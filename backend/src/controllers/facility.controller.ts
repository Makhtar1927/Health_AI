import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { DbService } from '../services/db.service';

export interface DoctorSlotAssignment {
  doctorName: string;
  days: number[]; // 1=Lundi, ..., 7=Dimanche
  startTime?: string;
  endTime?: string;
}

export interface FacilitySpecialty {
  id: string;
  name: string;
  isActive: boolean;
  ticketPrice: number;
  availableDays: number[]; // 1=Lundi, 2=Mardi, 3=Mercredi, 4=Jeudi, 5=Vendredi, 6=Samedi, 7=Dimanche
  startTime: string; // "08:00"
  endTime: string; // "13:00"
  slotDuration: number; // en minutes (ex: 30)
  maxPatientsPerSlot: number; // ex: 1 ou 2
  assignedDoctors: string[];
  doctorAssignments?: DoctorSlotAssignment[];
}

export interface HealthFacility {
  id: string;
  name: string;
  type: 'hopital' | 'centre_de_sante' | 'poste_de_sante' | 'clinique' | 'pharmacie';
  region: string;
  district: string;
  address: string;
  phone: string;
  specialties: FacilitySpecialty[];
}

export interface AppointmentRecord {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  facilityId: string;
  facilityName: string;
  facilityAddress?: string;
  specialtyId: string;
  specialtyName: string;
  doctorName?: string;
  ticketPrice: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM
  status: 'confirmed' | 'arrived' | 'sent_to_cashier' | 'ticket_paid' | 'in_consultation' | 'completed' | 'cancelled';
  reason: string;
  createdAt: string;
}

const readFacilities = (): HealthFacility[] => DbService.readLocalFacilities();
const writeFacilities = (data: HealthFacility[]) => DbService.writeLocalFacilities(data);
const readAppointments = (): AppointmentRecord[] => DbService.readLocalAppointments();
const writeAppointments = (data: AppointmentRecord[]) => DbService.writeLocalAppointments(data);

// Convert HH:MM to minutes from midnight
const timeToMinutes = (t: string): number => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

// Convert minutes to HH:MM
const minutesToTime = (min: number): string => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

/**
 * Algorithme d'affectation automatique du médecin :
 * Trouve automatiquement le médecin concerné selon la spécialité, le jour et le créneau horaire.
 */
export const resolveDoctorForSlot = (
  spec: FacilitySpecialty,
  dayOfWeek: number,
  slotTime: string
): string => {
  if (spec.doctorAssignments && spec.doctorAssignments.length > 0) {
    const slotMin = timeToMinutes(slotTime);
    // 1. Chercher un médecin expressément rattaché à ce jour ET cette tranche horaire
    const matchingDoc = spec.doctorAssignments.find(doc => {
      const matchDay = doc.days.includes(dayOfWeek);
      if (!matchDay) return false;
      const docStart = timeToMinutes(doc.startTime || spec.startTime || '08:00');
      const docEnd = timeToMinutes(doc.endTime || spec.endTime || '18:00');
      return slotMin >= docStart && slotMin < docEnd;
    });

    if (matchingDoc) {
      return matchingDoc.doctorName;
    }

    // 2. Si pas de restriction d'horaire, prendre le médecin rattaché à ce jour
    const dayDoc = spec.doctorAssignments.find(doc => doc.days.includes(dayOfWeek));
    if (dayDoc) return dayDoc.doctorName;
  }

  // 3. Fallback sur assignedDoctors en rotation ou premier
  if (spec.assignedDoctors && spec.assignedDoctors.length > 0) {
    const docIndex = (dayOfWeek - 1) % spec.assignedDoctors.length;
    return spec.assignedDoctors[docIndex] || spec.assignedDoctors[0];
  }

  return 'Médecin spécialiste de garde';
};

export class FacilityController {
  /**
   * Lister les structures de santé avec filtres optionnels
   */
  static async getFacilities(req: Request, res: Response, next: NextFunction) {
    try {
      const { region, district, type } = req.query;
      let facilities = readFacilities();

      if (region && typeof region === 'string' && region !== 'all') {
        facilities = facilities.filter(f => f.region.toLowerCase() === region.toLowerCase());
      }
      if (district && typeof district === 'string' && district !== 'all') {
        facilities = facilities.filter(f => f.district.toLowerCase() === district.toLowerCase());
      }
      if (type && typeof type === 'string' && type !== 'all') {
        facilities = facilities.filter(f => f.type.toLowerCase() === type.toLowerCase());
      }

      res.status(200).json({ success: true, facilities });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupérer un établissement par ID
   */
  static async getFacilityById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const facilities = readFacilities();
      const facility = facilities.find(f => f.id === id);

      if (!facility) {
        return res.status(404).json({ error: 'Établissement introuvable' });
      }

      res.status(200).json({ success: true, facility });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mise à jour des spécialités configurées par l'établissement (Admin Hôpital)
   */
  static async updateFacilitySpecialties(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { specialties } = req.body;

      if (!Array.isArray(specialties)) {
        return res.status(400).json({ error: 'Le champ specialties doit être un tableau' });
      }

      const facilities = readFacilities();
      const index = facilities.findIndex(f => f.id === id);

      if (index === -1) {
        return res.status(404).json({ error: 'Établissement non trouvé' });
      }

      facilities[index].specialties = specialties;
      writeFacilities(facilities);

      res.status(200).json({
        success: true,
        message: 'Spécialités et tarification de l\'établissement mises à jour avec succès.',
        facility: facilities[index]
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Calcul des créneaux disponibles pour une spécialité à une date donnée
   */
  static async getAvailableSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { specialtyId, date } = req.query;

      if (!specialtyId || !date || typeof specialtyId !== 'string' || typeof date !== 'string') {
        return res.status(400).json({ error: 'specialtyId et date sont requis' });
      }

      const facilities = readFacilities();
      const facility = facilities.find(f => f.id === id);

      if (!facility) {
        return res.status(404).json({ error: 'Établissement non trouvé' });
      }

      const spec = facility.specialties.find(s => s.id === specialtyId);
      if (!spec) {
        return res.status(404).json({ error: 'Spécialité non proposée par cet établissement' });
      }

      if (!spec.isActive) {
        return res.status(200).json({
          success: true,
          isDayAvailable: false,
          reason: 'Cette spécialité est actuellement suspendue dans cet établissement.',
          ticketPrice: spec.ticketPrice,
          slots: []
        });
      }

      // Calculer le jour de la semaine (1=Lundi ... 7=Dimanche)
      // Attention aux fuseaux horaires : découpage YYYY-MM-DD
      const [year, month, day] = date.split('-').map(Number);
      const parsedDate = new Date(year, month - 1, day);
      let dayOfWeek = parsedDate.getDay(); // 0=Dimanche, 1=Lundi, ..., 6=Samedi
      if (dayOfWeek === 0) dayOfWeek = 7;

      const isDayAvailable = spec.availableDays.includes(dayOfWeek);

      if (!isDayAvailable) {
        const daysMap: Record<number, string> = {
          1: 'Lundi', 2: 'Mardi', 3: 'Mercredi', 4: 'Jeudi', 5: 'Vendredi', 6: 'Samedi', 7: 'Dimanche'
        };
        const openDaysNames = spec.availableDays.map(d => daysMap[d]).join(', ');
        return res.status(200).json({
          success: true,
          isDayAvailable: false,
          reason: `Ce spécialiste n'est présent que le(s) : ${openDaysNames}.`,
          ticketPrice: spec.ticketPrice,
          availableDays: spec.availableDays,
          slots: []
        });
      }

      // Générer les créneaux horaires
      const startMin = timeToMinutes(spec.startTime || '08:00');
      const endMin = timeToMinutes(spec.endTime || '13:00');
      const duration = spec.slotDuration || 30;
      const maxPatients = spec.maxPatientsPerSlot || 1;

      // Récupérer les réservations existantes pour cet établissement, cette spécialité et cette date
      const appointments = readAppointments().filter(
        a => a.facilityId === id &&
             a.specialtyId === specialtyId &&
             a.date === date &&
             a.status !== 'cancelled'
      );

      const slots = [];
      for (let m = startMin; m + duration <= endMin; m += duration) {
        const timeSlot = minutesToTime(m);
        const bookedCount = appointments.filter(a => a.timeSlot === timeSlot).length;
        const isFull = bookedCount >= maxPatients;

        slots.push({
          time: timeSlot,
          isFull,
          bookedCount,
          maxPatients,
          availableCount: Math.max(0, maxPatients - bookedCount)
        });
      }

      res.status(200).json({
        success: true,
        isDayAvailable: true,
        ticketPrice: spec.ticketPrice,
        slotDuration: spec.slotDuration,
        maxPatientsPerSlot: maxPatients,
        assignedDoctors: spec.assignedDoctors,
        availableDays: spec.availableDays,
        slots
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Création d'un rendez-vous avec ticket tarifé
   */
  static async createAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const createSchema = z.object({
        patientName: z.string().min(2),
        patientPhone: z.string(),
        patientEmail: z.string().email().optional(),
        facilityId: z.string(),
        specialtyId: z.string(),
        date: z.string(), // YYYY-MM-DD
        timeSlot: z.string(), // HH:MM
        doctorName: z.string().optional(),
        reason: z.string().min(3)
      });

      const parsed = createSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Validation Error', details: parsed.error.format() });
      }

      const {
        patientName,
        patientPhone,
        patientEmail,
        facilityId,
        specialtyId,
        date,
        timeSlot,
        doctorName,
        reason
      } = parsed.data;

      const facilities = readFacilities();
      const facility = facilities.find(f => f.id === facilityId);
      if (!facility) {
        return res.status(404).json({ error: 'Établissement non trouvé' });
      }

      const spec = facility.specialties.find(s => s.id === specialtyId);
      if (!spec) {
        return res.status(404).json({ error: 'Spécialité non trouvée' });
      }

      if (!spec.isActive) {
        return res.status(400).json({ error: 'Cette spécialité est actuellement fermée' });
      }

      // Vérifier la capacité du créneau
      const appointments = readAppointments();
      const existingInSlot = appointments.filter(
        a => a.facilityId === facilityId &&
             a.specialtyId === specialtyId &&
             a.date === date &&
             a.timeSlot === timeSlot &&
             a.status !== 'cancelled'
      );

      if (existingInSlot.length >= (spec.maxPatientsPerSlot || 1)) {
        return res.status(409).json({ error: 'Ce créneau horaire est désormais complet. Veuillez en choisir un autre.' });
      }

      // Résolution automatique du médecin selon la spécialité, le jour et le créneau horaire
      const [year, month, day] = date.split('-').map(Number);
      const parsedDate = new Date(year, month - 1, day);
      let dayOfWeek = parsedDate.getDay(); // 0=Dimanche
      if (dayOfWeek === 0) dayOfWeek = 7;

      const resolvedDoctor = resolveDoctorForSlot(spec, dayOfWeek, timeSlot);

      const newAppt: AppointmentRecord = {
        id: `RDV-${Math.floor(1000 + Math.random() * 9000)}`,
        patientName,
        patientPhone,
        patientEmail: patientEmail || 'patient@sunusante.sn',
        facilityId: facility.id,
        facilityName: facility.name,
        facilityAddress: facility.address,
        specialtyId: spec.id,
        specialtyName: spec.name,
        doctorName: resolvedDoctor, // Affectation automatique selon le planning
        ticketPrice: spec.ticketPrice, // PRIX FIXÉ PAR L'ÉTABLISSEMENT
        date,
        timeSlot,
        status: 'confirmed',
        reason,
        createdAt: new Date().toISOString()
      };

      // Enregistrement hybride (Supabase + Local)
      await DbService.createAppointment(newAppt);

      res.status(201).json({
        success: true,
        message: 'Rendez-vous confirmé avec succès ! Ticket généré.',
        appointment: newAppt
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupérer les rendez-vous
   */
  static async getAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const { facilityId, patientEmail, status, date } = req.query;
      let appointments = await DbService.getAppointments();

      if (facilityId && typeof facilityId === 'string') {
        appointments = appointments.filter(a => a.facilityId === facilityId);
      }
      if (patientEmail && typeof patientEmail === 'string') {
        appointments = appointments.filter(a => a.patientEmail.toLowerCase() === patientEmail.toLowerCase());
      }
      if (status && typeof status === 'string' && status !== 'all') {
        appointments = appointments.filter(a => a.status === status);
      }
      if (date && typeof date === 'string') {
        appointments = appointments.filter(a => a.date === date);
      }

      res.status(200).json({ success: true, appointments });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mettre à jour le statut d'un rendez-vous (Parcours : arrivé, caisse, payé, attente, consultation, terminé)
   */
  static async updateAppointmentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['confirmed', 'arrived', 'sent_to_cashier', 'ticket_paid', 'in_consultation', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Statut invalide' });
      }

      const updated = await DbService.updateAppointmentStatus(id, status);

      if (!updated) {
        return res.status(404).json({ error: 'Rendez-vous introuvable' });
      }

      const all = await DbService.getAppointments();
      const current = all.find(a => a.id === id);

      res.status(200).json({
        success: true,
        message: `Statut mis à jour vers "${status}".`,
        appointment: current
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Créer un nouvel établissement (Hôpital ou Pharmacie) - Super Admin
   */
  static async createFacility(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, type, region, district, address, phone } = req.body;

      if (!name || !type || !region || !phone) {
        return res.status(400).json({ error: 'name, type, region et phone sont obligatoires.' });
      }

      const facilities = readFacilities();
      const generatedId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.floor(100 + Math.random() * 900);

      const newFacility: HealthFacility = {
        id: generatedId,
        name,
        type,
        region,
        district: district || region,
        address: address || '',
        phone,
        specialties: type === 'pharmacie' ? [] : [
          {
            id: 'general',
            name: 'Médecine Générale',
            isActive: true,
            ticketPrice: 2000,
            availableDays: [1, 2, 3, 4, 5],
            startTime: '08:00',
            endTime: '16:00',
            slotDuration: 30,
            maxPatientsPerSlot: 2,
            assignedDoctors: []
          }
        ]
      };

      facilities.push(newFacility);
      writeFacilities(facilities);

      res.status(201).json({
        success: true,
        message: `${type === 'pharmacie' ? 'Pharmacie' : 'Hôpital / Établissement'} créé avec succès.`,
        facility: newFacility
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mettre à jour les informations d'un établissement - Super Admin
   */
  static async updateFacility(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, type, region, district, address, phone } = req.body;

      const facilities = readFacilities();
      const index = facilities.findIndex(f => f.id === id);

      if (index === -1) {
        return res.status(404).json({ error: 'Établissement introuvable.' });
      }

      if (name) facilities[index].name = name;
      if (type) facilities[index].type = type;
      if (region) facilities[index].region = region;
      if (district) facilities[index].district = district;
      if (address !== undefined) facilities[index].address = address;
      if (phone) facilities[index].phone = phone;

      writeFacilities(facilities);

      res.status(200).json({
        success: true,
        message: 'Établissement mis à jour avec succès.',
        facility: facilities[index]
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprimer un établissement - Super Admin
   */
  static async deleteFacility(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const facilities = readFacilities();
      const filtered = facilities.filter(f => f.id !== id);

      if (filtered.length === facilities.length) {
        return res.status(404).json({ error: 'Établissement introuvable.' });
      }

      writeFacilities(filtered);

      res.status(200).json({
        success: true,
        message: 'Établissement supprimé avec succès.'
      });
    } catch (error) {
      next(error);
    }
  }
}
