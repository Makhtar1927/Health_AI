import fs from 'fs';
import path from 'path';
import { supabase, supabaseAdmin } from '../config/supabase';
import { env } from '../config/env';
import { HealthFacility, AppointmentRecord, FacilitySpecialty } from '../controllers/facility.controller';
import { LocalUserRecord } from '../controllers/auth.controller';

const FACILITIES_DB = path.join(__dirname, '../../facilities-db.json');
const APPOINTMENTS_DB = path.join(__dirname, '../../appointments-db.json');
const USERS_DB = path.join(__dirname, '../../users-db.json');

export class DbService {
  private static isServiceKeyConfigured(): boolean {
    return (
      !!env.SUPABASE_SERVICE_ROLE_KEY &&
      !env.SUPABASE_SERVICE_ROLE_KEY.includes('votre-cle') &&
      env.SUPABASE_SERVICE_ROLE_KEY.length > 20
    );
  }

  // =========================================================================
  // LOCAL JSON HELPERS (Fallback robuste et persistance locale)
  // =========================================================================

  static readLocalFacilities(): HealthFacility[] {
    try {
      if (!fs.existsSync(FACILITIES_DB)) return [];
      const data = fs.readFileSync(FACILITIES_DB, 'utf-8');
      return JSON.parse(data || '[]');
    } catch {
      return [];
    }
  }

  static writeLocalFacilities(data: HealthFacility[]): void {
    try {
      fs.writeFileSync(FACILITIES_DB, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Erreur écriture facilities-db.json', e);
    }
  }

  static readLocalAppointments(): AppointmentRecord[] {
    try {
      if (!fs.existsSync(APPOINTMENTS_DB)) return [];
      const data = fs.readFileSync(APPOINTMENTS_DB, 'utf-8');
      return JSON.parse(data || '[]');
    } catch {
      return [];
    }
  }

  static writeLocalAppointments(data: AppointmentRecord[]): void {
    try {
      fs.writeFileSync(APPOINTMENTS_DB, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Erreur écriture appointments-db.json', e);
    }
  }

  static readLocalUsers(): LocalUserRecord[] {
    try {
      if (!fs.existsSync(USERS_DB)) return [];
      const data = fs.readFileSync(USERS_DB, 'utf-8');
      return JSON.parse(data || '[]');
    } catch {
      return [];
    }
  }

  static writeLocalUsers(data: LocalUserRecord[]): void {
    try {
      fs.writeFileSync(USERS_DB, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Erreur écriture users-db.json', e);
    }
  }

  // =========================================================================
  // MÉTHODES HYBRIDES (SUPABASE CLOUD AVEC FALLBACK LOCAL)
  // =========================================================================

  /**
   * Récupère toutes les structures de santé avec leurs spécialités
   */
  static async getFacilities(): Promise<HealthFacility[]> {
    try {
      // 1. Tenter la lecture depuis Supabase
      const { data: facilities, error } = await supabase
        .from('facilities')
        .select(`
          id,
          name,
          type,
          region,
          district,
          address,
          phone,
          facility_specialties (
            id,
            name,
            is_active,
            ticket_price,
            available_days,
            start_time,
            end_time,
            slot_duration,
            max_patients_per_slot,
            assigned_doctors,
            doctor_assignments
          )
        `);

      if (!error && facilities && facilities.length > 0) {
        // Formater les données pour compatibilité avec le frontend
        return facilities.map((f: any) => ({
          id: f.id,
          name: f.name,
          type: f.type,
          region: f.region,
          district: f.district,
          address: f.address,
          phone: f.phone,
          specialties: (f.facility_specialties || []).map((s: any) => ({
            id: s.id,
            name: s.name,
            isActive: s.is_active,
            ticketPrice: Number(s.ticket_price),
            availableDays: s.available_days,
            startTime: s.start_time,
            endTime: s.end_time,
            slotDuration: s.slot_duration,
            maxPatientsPerSlot: s.max_patients_per_slot,
            assignedDoctors: s.assigned_doctors || [],
            doctorAssignments: s.doctor_assignments || []
          }))
        }));
      }
    } catch (err) {
      console.warn('⚠️ Supabase non joignable pour facilities, bascule sur la base locale.');
    }

    // 2. Fallback local si Supabase n'est pas encore initialisé
    return this.readLocalFacilities();
  }

  /**
   * Récupère tous les rendez-vous
   */
  static async getAppointments(): Promise<AppointmentRecord[]> {
    try {
      const client = this.isServiceKeyConfigured() ? supabaseAdmin : supabase;
      const { data, error } = await client
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((a: any) => ({
          id: a.id,
          patientName: a.patient_name,
          patientPhone: a.patient_phone,
          patientEmail: a.patient_email,
          facilityId: a.facility_id,
          facilityName: a.facility_name,
          facilityAddress: a.facility_address,
          specialtyId: a.specialty_id,
          specialtyName: a.specialty_name,
          doctorName: a.doctor_name,
          ticketPrice: Number(a.ticket_price),
          date: a.appointment_date,
          timeSlot: a.time_slot,
          status: a.status,
          reason: a.reason,
          createdAt: a.created_at
        }));
      }
    } catch (err) {
      console.warn('⚠️ Supabase non joignable pour appointments, bascule sur la base locale.');
    }

    return this.readLocalAppointments();
  }

  /**
   * Sauvegarde un nouveau rendez-vous dans Supabase et le fichier local
   */
  static async createAppointment(appointment: AppointmentRecord): Promise<void> {
    // 1. Toujours enregistrer en local pour persistance immédiate
    const currentLocal = this.readLocalAppointments();
    currentLocal.unshift(appointment);
    this.writeLocalAppointments(currentLocal);

    // 2. Synchroniser vers Supabase si accessible
    try {
      const client = this.isServiceKeyConfigured() ? supabaseAdmin : supabase;
      await client.from('appointments').insert({
        id: appointment.id,
        patient_name: appointment.patientName,
        patient_phone: appointment.patientPhone,
        patient_email: appointment.patientEmail,
        facility_id: appointment.facilityId,
        facility_name: appointment.facilityName,
        facility_address: appointment.facilityAddress,
        specialty_id: appointment.specialtyId,
        specialty_name: appointment.specialtyName,
        doctor_name: appointment.doctorName,
        ticket_price: appointment.ticketPrice,
        appointment_date: appointment.date,
        time_slot: appointment.timeSlot,
        status: appointment.status,
        reason: appointment.reason,
        created_at: appointment.createdAt
      });
    } catch (err) {
      console.error('Échec de synchronisation du RDV vers Supabase Cloud (sauvegarde locale OK)', err);
    }
  }

  /**
   * Met à jour le statut d'un rendez-vous
   */
  static async updateAppointmentStatus(id: string, status: string): Promise<boolean> {
    // 1. Local
    const local = this.readLocalAppointments();
    const apt = local.find(a => a.id === id);
    if (apt) {
      (apt as any).status = status;
      this.writeLocalAppointments(local);
    }

    // 2. Supabase
    try {
      const client = this.isServiceKeyConfigured() ? supabaseAdmin : supabase;
      await client
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch (err) {
      console.error('Échec mise à jour statut RDV Supabase', err);
    }

    return !!apt;
  }

  /**
   * Sauvegarde ou met à jour un profil utilisateur dans Supabase Cloud
   */
  static async syncUserToSupabase(user: LocalUserRecord): Promise<void> {
    try {
      const client = this.isServiceKeyConfigured() ? supabaseAdmin : supabase;
      await client.from('profiles').upsert({
        email: user.email.toLowerCase(),
        name: user.name,
        role: user.role,
        password_hash: user.passwordHash,
        suspended: user.suspended || false,
        details: user.details || {},
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' });
    } catch (err) {
      console.warn('Sync profile vers Supabase non bloquante :', err);
    }
  }

  /**
   * Supprime un utilisateur de Supabase Cloud
   */
  static async deleteUserFromSupabase(email: string): Promise<void> {
    try {
      const client = this.isServiceKeyConfigured() ? supabaseAdmin : supabase;
      await client.from('profiles').delete().eq('email', email.toLowerCase());
    } catch (err) {
      console.warn('Suppression Supabase non bloquante :', err);
    }
  }
}
