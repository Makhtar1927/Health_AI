'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  CheckCircle2, 
  MapPin, 
  Video, 
  Search, 
  X, 
  ChevronRight, 
  Phone, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  CalendarCheck,
  Check,
  Stethoscope,
  Building,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  hospital: string;
  location: string;
  type: 'in_person' | 'teleconsult';
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  reason: string;
  preparation?: string;
  phone?: string;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  { 
    id: "RDV-501", 
    doctor: "Dr. Awa Ndiaye", 
    specialty: "Cardiologie", 
    hospital: "Clinique du Cap",
    location: "Avenue Pasteur, Dakar Plateau",
    type: "in_person",
    date: "25 Mai 2026", 
    time: "09:30", 
    status: "confirmed", 
    reason: "Suivi de tension artérielle & électrocardiogramme",
    preparation: "Venir avec les ordonnances précédentes et le carnet de tension",
    phone: "+221 33 889 12 34"
  },
  { 
    id: "RDV-502", 
    doctor: "Dr. Abdoulaye Diallo", 
    specialty: "Médecine Générale", 
    hospital: "Cabinet Médical Sunu",
    location: "Téléconsultation Vidéo Sécurisée",
    type: "teleconsult",
    date: "12 Mai 2026", 
    time: "11:15", 
    status: "completed", 
    reason: "Renouvellement d'ordonnance et contrôle biologique",
    preparation: "Consultation vidéo effectuée avec succès. Ordonnance générée.",
    phone: "+221 33 824 50 00"
  },
  { 
    id: "RDV-503", 
    doctor: "Dr. Aminata Touré", 
    specialty: "Pneumologie", 
    hospital: "Hôpital Principal de Dakar",
    location: "Pavillon Médical, Plateau",
    type: "in_person",
    date: "14 Février 2026", 
    time: "15:00", 
    status: "completed", 
    reason: "Exploration fonctionnelle respiratoire suite à toux",
    preparation: "Bilan radiologique consulté par le spécialiste.",
    phone: "+221 33 839 50 50"
  }
];

const DOCTORS_CATALOG = [
  { name: "Dr. Awa Ndiaye", specialty: "Cardiologie", hospital: "Clinique du Cap, Dakar", type: "both", phone: "+221 33 889 12 34" },
  { name: "Dr. Abdoulaye Diallo", specialty: "Médecine Générale", hospital: "Cabinet Médical Sunu", type: "both", phone: "+221 33 824 50 00" },
  { name: "Dr. Aminata Touré", specialty: "Pneumologie", hospital: "Hôpital Principal de Dakar", type: "in_person", phone: "+221 33 839 50 50" },
  { name: "Dr. Babacar Seck", specialty: "Pédiatrie", hospital: "Hôpital d'Enfants Albert Royer, Fann", type: "both", phone: "+221 33 869 18 18" },
  { name: "Dr. Fatou Kiné Diop", specialty: "Dermatologie", hospital: "Polyclinique des Almadies", type: "both", phone: "+221 33 820 44 00" },
  { name: "Dr. Cheikh Anta Wade", specialty: "Ophtalmologie", hospital: "Clinique de la Vision, Mermoz", type: "in_person", phone: "+221 33 860 10 20" }
];

const SPECIALTIES = [
  "Tous",
  "Médecine Générale",
  "Cardiologie",
  "Pneumologie",
  "Pédiatrie",
  "Dermatologie",
  "Ophtalmologie"
];

const TIME_SLOTS = [
  "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:30", "15:00", "15:30", "16:00", "16:30"
];

export default function PatientAppointments() {
  const { user, initialize } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('Tous');

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'in_person' | 'teleconsult'>('in_person');
  const [bookingSpecialty, setBookingSpecialty] = useState('Cardiologie');
  const [bookingDoctor, setBookingDoctor] = useState('Dr. Awa Ndiaye');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('09:30');
  const [bookingReason, setBookingReason] = useState('');
  const [bookingSuccessToast, setBookingSuccessToast] = useState(false);

  // Detail Modal State
  const [detailModalApp, setDetailModalApp] = useState<Appointment | null>(null);

  useEffect(() => {
    initialize();
    setMounted(true);
  }, [initialize]);

  if (!mounted) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm animate-pulse">S+</div>
          <p className="text-xs font-medium">Chargement de vos rendez-vous...</p>
        </div>
      </div>
    );
  }

  // Filtrage des rendez-vous
  const filteredAppointments = appointments.filter(app => {
    // Filtre d'onglet
    if (activeTab === 'upcoming' && app.status !== 'confirmed' && app.status !== 'pending') return false;
    if (activeTab === 'past' && app.status !== 'completed' && app.status !== 'cancelled') return false;

    // Filtre de spécialité
    if (selectedSpecialtyFilter !== 'Tous' && app.specialty !== selectedSpecialtyFilter) return false;

    // Filtre texte
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDoc = app.doctor.toLowerCase().includes(q);
      const matchSpec = app.specialty.toLowerCase().includes(q);
      const matchHosp = app.hospital.toLowerCase().includes(q);
      const matchReason = app.reason.toLowerCase().includes(q);
      if (!matchDoc && !matchSpec && !matchHosp && !matchReason) return false;
    }

    return true;
  });

  // Gestion du choix de spécialité dans le formulaire
  const handleSpecialtyChange = (spec: string) => {
    setBookingSpecialty(spec);
    const matchingDoc = DOCTORS_CATALOG.find(d => d.specialty === spec);
    if (matchingDoc) {
      setBookingDoctor(matchingDoc.name);
    }
  };

  // Soumission de réservation
  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !bookingReason.trim()) return;

    const matchedDoc = DOCTORS_CATALOG.find(d => d.name === bookingDoctor);
    const formattedDate = new Date(bookingDate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const newApp: Appointment = {
      id: `RDV-${Math.floor(100 + Math.random() * 900)}`,
      doctor: bookingDoctor,
      specialty: bookingSpecialty,
      hospital: matchedDoc?.hospital || "Clinique Sunu Santé",
      location: bookingType === 'teleconsult' ? "Téléconsultation Vidéo Sécurisée" : (matchedDoc?.hospital || "Dakar"),
      type: bookingType,
      date: formattedDate,
      time: bookingTime,
      status: 'confirmed',
      reason: bookingReason,
      preparation: bookingType === 'teleconsult' 
        ? "Assurez-vous d'avoir une connexion stable et un microphone activé 5 min avant."
        : "Présentez-vous 10 minutes avant muni de votre identifiant Sunu Santé.",
      phone: matchedDoc?.phone || "+221 33 800 00 00"
    };

    setAppointments(prev => [newApp, ...prev]);
    setIsBookingOpen(false);
    setBookingReason('');
    setBookingDate('');
    setBookingSuccessToast(true);
    setTimeout(() => setBookingSuccessToast(false), 5000);
  };

  // Annuler un rendez-vous
  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
    if (detailModalApp?.id === id) {
      setDetailModalApp(prev => prev ? { ...prev, status: 'cancelled' } : null);
    }
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Confirmé',
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500'
        };
      case 'pending':
        return {
          label: 'En attente',
          className: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500 animate-pulse'
        };
      case 'completed':
        return {
          label: 'Effectué',
          className: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400'
        };
      case 'cancelled':
        return {
          label: 'Annulé',
          className: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500'
        };
    }
  };

  const upcomingCount = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length;
  const pastCount = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled').length;

  return (
    <div className="min-h-full bg-slate-50 text-slate-900 pb-12">

      {/* ─── Notification Toast de succès ─────────────────────────────────── */}
      <AnimatePresence>
        {bookingSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-emerald-700 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-600"
          >
            <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold">Rendez-vous planifié avec succès !</p>
              <p className="text-[11px] text-emerald-100">Un rappel SMS a été envoyé sur votre téléphone.</p>
            </div>
            <button 
              onClick={() => setBookingSuccessToast(false)} 
              className="ml-2 text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Hero Header & Statistiques ───────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                <CalendarCheck className="w-3 h-3 text-teal-600" />
                Planning Médical
              </span>
              <span className="text-xs text-slate-400 font-medium">• Sunu Santé Direct</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Mes Rendez-vous
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Consultez vos consultations à venir, rejoignez vos téléconsultations sécurisées ou prenez un nouveau rendez-vous en quelques clics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-teal-700/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Prendre un rendez-vous
            </button>
          </div>
        </div>

        {/* Mini stats cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 block">À venir</span>
            <span className="text-lg font-bold text-teal-700 mt-0.5 block">{upcomingCount} consultation{upcomingCount > 1 ? 's' : ''}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 block">Téléconsultations</span>
            <span className="text-lg font-bold text-blue-700 mt-0.5 block">Disponible 24/7</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 block">Historique</span>
            <span className="text-lg font-bold text-slate-800 mt-0.5 block">{pastCount} effectuée{pastCount > 1 ? 's' : ''}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 block">Prise en charge</span>
            <span className="text-lg font-bold text-emerald-700 mt-0.5 block">100% IPM & Mutuelle</span>
          </div>
        </div>
      </div>

      {/* ─── Barre de filtres et recherche ─────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              À venir ({upcomingCount})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'past'
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Historique ({pastCount})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous ({appointments.length})
            </button>
          </div>

          {/* Recherche & Filtre de Spécialité */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher médecin, motif..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <select
              value={selectedSpecialtyFilter}
              onChange={e => setSelectedSpecialtyFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              {SPECIALTIES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* ─── Liste des Rendez-vous ────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Aucun rendez-vous trouvé</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchQuery || selectedSpecialtyFilter !== 'Tous'
                ? "Aucune consultation ne correspond à vos critères de recherche."
                : "Vous n'avez pas de rendez-vous programmé dans cette catégorie."}
            </p>
            <div className="mt-5 flex justify-center gap-3">
              {(searchQuery || selectedSpecialtyFilter !== 'Tous') && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedSpecialtyFilter('Tous'); }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              )}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors"
              >
                Prendre un rendez-vous
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAppointments.map((app) => {
              const badge = getStatusBadge(app.status);
              const isTeleconsult = app.type === 'teleconsult';

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Type & Status */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        {isTeleconsult ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Video className="w-3 h-3 text-blue-600" />
                            Téléconsultation
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                            <Building className="w-3 h-3 text-teal-600" />
                            Présentiel
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-400">{app.id}</span>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.className}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {badge.label}
                      </span>
                    </div>

                    {/* Doctor Info */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-teal-600/10 text-teal-700 border border-teal-200/80 flex items-center justify-center font-bold text-base flex-shrink-0 group-hover:scale-105 transition-transform">
                        {app.doctor.split(' ')[1] ? app.doctor.split(' ')[1][0] : 'D'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                          {app.specialty}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 truncate">
                          {app.doctor}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>{app.hospital}</span>
                        </p>
                      </div>
                    </div>

                    {/* Motif Card */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-semibold text-slate-700 block mb-0.5">Motif de consultation :</span>
                      <p className="text-slate-600 italic">« {app.reason} »</p>
                    </div>

                    {/* Date and Time Bar */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-teal-50/60 border border-teal-100 text-teal-900 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                        <span className="truncate">{app.date}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-teal-50/60 border border-teal-100 text-teal-900 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                        <span>{app.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setDetailModalApp(app)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Voir détails
                    </button>

                    <div className="flex items-center gap-2">
                      {isTeleconsult && (app.status === 'confirmed' || app.status === 'pending') && (
                        <button
                          onClick={() => alert(`Connexion à la salle de téléconsultation vidéo pour ${app.doctor}...\nLe lien de salle sécurisée Sunu Santé s'active 10 min avant le créneau.`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
                        >
                          <Video className="w-3.5 h-3.5" />
                          Rejoindre
                        </button>
                      )}

                      {(app.status === 'confirmed' || app.status === 'pending') && (
                        <button
                          onClick={() => handleCancelAppointment(app.id)}
                          className="px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Annuler le rendez-vous"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── MODAL : Détails d'un rendez-vous ─────────────────────────────── */}
      <AnimatePresence>
        {detailModalApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    S+
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Détails de la consultation</h3>
                    <p className="text-[10px] text-teal-700 font-mono font-bold">{detailModalApp.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailModalApp(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                {/* Médecin & Établissement */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-teal-50/50 border border-teal-100">
                  <div className="w-10 h-10 rounded-xl bg-teal-600/10 text-teal-700 flex items-center justify-center font-bold text-sm">
                    {detailModalApp.doctor.split(' ')[1] ? detailModalApp.doctor.split(' ')[1][0] : 'D'}
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-teal-700 uppercase">{detailModalApp.specialty}</span>
                    <h4 className="text-sm font-bold text-slate-900">{detailModalApp.doctor}</h4>
                    <p className="text-slate-500 text-[11px]">{detailModalApp.hospital}</p>
                  </div>
                </div>

                {/* Date & Heure */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-medium text-slate-400 uppercase">Date</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{detailModalApp.date}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-medium text-slate-400 uppercase">Heure</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{detailModalApp.time}</p>
                  </div>
                </div>

                {/* Lieu / Canal */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-medium text-slate-400 uppercase">Lieu ou Modalité</span>
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    {detailModalApp.type === 'teleconsult' ? (
                      <>
                        <Video className="w-3.5 h-3.5 text-blue-600" />
                        <span>Téléconsultation Vidéo Sunu Santé (HD)</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        <span>{detailModalApp.location}</span>
                      </>
                    )}
                  </p>
                </div>

                {/* Motif */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-medium text-slate-400 uppercase">Motif déclaré</span>
                  <p className="text-xs text-slate-700 font-medium">« {detailModalApp.reason} »</p>
                </div>

                {/* Préparation / Consignes */}
                {detailModalApp.preparation && (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 space-y-1">
                    <span className="text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Consignes médicales
                    </span>
                    <p className="text-[11px] leading-relaxed">{detailModalApp.preparation}</p>
                  </div>
                )}

                {/* Contact secrétariat */}
                {detailModalApp.phone && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-600">Secrétariat médical :</span>
                    </div>
                    <span className="font-bold text-slate-800 font-mono">{detailModalApp.phone}</span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                {(detailModalApp.status === 'confirmed' || detailModalApp.status === 'pending') ? (
                  <button
                    onClick={() => handleCancelAppointment(detailModalApp.id)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                  >
                    Annuler ce rendez-vous
                  </button>
                ) : (
                  <div className="text-[11px] text-slate-400 italic">Rendez-vous archivé</div>
                )}

                <button
                  onClick={() => setDetailModalApp(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL : Prise de Rendez-vous ─────────────────────────────────── */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full my-8 overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-teal-50/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Prendre un nouveau rendez-vous</h3>
                    <p className="text-[10px] text-teal-700 font-medium">Plateforme médicale Sunu Santé</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleBookSubmit} className="p-6 space-y-4">
                
                {/* 1. Mode de consultation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">1. Modalité de consultation</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBookingType('in_person')}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        bookingType === 'in_person'
                          ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <Building className={`w-4 h-4 mt-0.5 ${bookingType === 'in_person' ? 'text-teal-600' : 'text-slate-400'}`} />
                      <div>
                        <p className="text-xs font-bold">En Présentiel</p>
                        <p className="text-[10px] text-slate-500">En cabinet ou clinique</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBookingType('teleconsult')}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        bookingType === 'teleconsult'
                          ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <Video className={`w-4 h-4 mt-0.5 ${bookingType === 'teleconsult' ? 'text-blue-600' : 'text-slate-400'}`} />
                      <div>
                        <p className="text-xs font-bold">Téléconsultation</p>
                        <p className="text-[10px] text-slate-500">Vidéo sécurisée directe</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Spécialité médicale */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">2. Spécialité requise</label>
                  <select
                    value={bookingSpecialty}
                    onChange={e => handleSpecialtyChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-teal-500 focus:bg-white"
                  >
                    {SPECIALTIES.filter(s => s !== 'Tous').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Choix du médecin */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">3. Médecin spécialiste</label>
                  <select
                    value={bookingDoctor}
                    onChange={e => setBookingDoctor(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-teal-500 focus:bg-white"
                  >
                    {DOCTORS_CATALOG.filter(d => d.specialty === bookingSpecialty).map(d => (
                      <option key={d.name} value={d.name}>
                        {d.name} — {d.hospital}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Date & Heure */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">4. Date souhaitée</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate}
                      onChange={e => setBookingDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-teal-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Créneau horaire</label>
                    <select
                      value={bookingTime}
                      onChange={e => setBookingTime(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-teal-500 focus:bg-white"
                    >
                      {TIME_SLOTS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 5. Motif de consultation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">5. Motif de la consultation</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Ex: Contrôle tensionnel, maux de tête persistants, renouvellement..."
                    value={bookingReason}
                    onChange={e => setBookingReason(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white resize-none"
                  />
                </div>

                {/* Reassurance badge */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Rendez-vous sécurisé certifié HDS. Confirmation instantanée par SMS.</span>
                </div>

                {/* Boutons d'action */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBookingOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm shadow-teal-700/20 cursor-pointer"
                  >
                    Confirmer le rendez-vous
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
