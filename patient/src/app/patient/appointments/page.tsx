'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  CheckCircle, 
  Activity, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import Link from 'next/link';

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
}

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: "A-501", doctor: "Dr. Awa Ndiaye", specialty: "Cardiologue", date: "25 Mai 2026", time: "09:30", status: "confirmed", reason: "Suivi de tension artérielle" },
    { id: "A-502", doctor: "Dr. Abdoulaye Diallo", specialty: "Médecin Généraliste", date: "12 Mai 2026", time: "11:15", status: "completed", reason: "Consultation de routine et ordonnance" }
  ]);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Awa Ndiaye');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Cardiologie');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [reasonText, setReasonText] = useState('');

  const doctorsList = [
    { name: "Dr. Awa Ndiaye", specialty: "Cardiologue" },
    { name: "Dr. Abdoulaye Diallo", specialty: "Médecin Généraliste" },
    { name: "Dr. Aminata Touré", specialty: "Pneumologue" }
  ];

  const timeSlots = ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:30", "15:00", "15:30"];

  const handleDoctorChange = (doctorName: string) => {
    setSelectedDoctor(doctorName);
    const doc = doctorsList.find(d => d.name === doctorName);
    if (doc) setSelectedSpecialty(doc.specialty);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !reasonText) return;

    const newApp: Appointment = {
      id: `A-${Math.floor(100 + Math.random() * 900)}`,
      doctor: selectedDoctor,
      specialty: selectedSpecialty,
      date: new Date(selectedDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
      time: selectedTime,
      status: 'pending',
      reason: reasonText
    };

    setAppointments(prev => [newApp, ...prev]);
    setIsBookingOpen(false);
    // Reset Form
    setReasonText('');
    setSelectedDate('');
  };

  const getStatusBadge = (status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'confirmed': return { text: "Confirmé", class: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" };
      case 'pending': return { text: "En attente", class: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse" };
      case 'completed': return { text: "Terminé", class: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/10" };
      default: return { text: "Annulé", class: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20" };
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent text-slate-800 dark:text-slate-100 flex flex-col justify-between max-w-md mx-auto md:max-w-none md:mx-0 md:h-full md:min-h-0 md:justify-start md:items-stretch w-full">
      
      {/* Mobile Header Bar (Hidden on desktop) */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between md:hidden w-full">
        <div className="flex items-center gap-4">
          <Link href="/patient/home" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-800 dark:text-white">Rendez-vous</h1>
            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider">Planification de Soins</p>
          </div>
        </div>
        {!isBookingOpen && (
          <button 
            onClick={() => setIsBookingOpen(true)}
            className="h-9 w-9 rounded-xl bg-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20 hover:bg-cyan-600 transition-colors cursor-pointer"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </header>

      {/* Main Container - Dual-Pane split layout on desktop */}
      <main className="flex-grow px-6 py-6 overflow-y-auto md:p-8 md:h-full md:overflow-y-auto w-full relative z-10">
        
        {/* ========================================================================= */}
        {/* DESKTOP VIEWPORT (Side-by-side simultaneous pane layout)                  */}
        {/* ========================================================================= */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-8 md:items-start w-full relative z-10">
          
          {/* Left Pane: Appointments List */}
          <div className="md:col-span-7 space-y-6">
            <h3 className="font-black text-base tracking-tight text-slate-800 dark:text-slate-100">Mes Rendez-vous Planifiés</h3>
            <div className="space-y-4">
              {appointments.map((app, index) => {
                const badge = getStatusBadge(app.status);
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-3xl glass-premium p-5 border border-slate-200/40 dark:border-slate-800/80 shadow-sm space-y-4 hover:border-cyan-500/10 dark:hover:border-cyan-500/20 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-extrabold uppercase tracking-wider">{app.specialty}</span>
                        <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mt-0.5">{app.doctor}</h4>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${badge.class}`}>
                        {badge.text}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100/50 dark:border-slate-800/60 pt-3 space-y-2.5">
                      <p className="italic font-medium text-slate-500 dark:text-slate-400">"{app.reason}"</p>
                      
                      <div className="flex justify-between items-center font-bold pt-1 border-t border-slate-50 dark:border-slate-800/40">
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Calendar className="h-3.5 w-3.5 text-cyan-500" />
                          <span>{app.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Clock className="h-3.5 w-3.5 text-cyan-500" />
                          <span>{app.time}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Pane: Booking Form (Always visible on desktop!) */}
          <div className="md:col-span-5 space-y-6 glass-premium p-6 rounded-3xl border border-slate-200/40 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
            {/* Soft backdrop glow inside form */}
            <div className="absolute right-[-10%] top-[-10%] w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

            <div className="bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/20 rounded-2xl p-4 relative z-10">
              <h3 className="font-black text-cyan-600 dark:text-cyan-400 text-sm">Nouveau Rendez-vous</h3>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 leading-relaxed font-medium">
                Planifiez instantanément une consultation avec votre spécialiste Sunu Santé.
              </p>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-4 relative z-10">
              
              {/* Doctor Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Médecin & Spécialité</label>
                <select
                  value={selectedDoctor}
                  onChange={e => handleDoctorChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/60 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-slate-700 dark:text-slate-200 transition-all font-bold cursor-pointer"
                >
                  {doctorsList.map((d, index) => (
                    <option key={index} value={d.name}>{d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>

              {/* Date Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Date souhaitée</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/60 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-slate-700 dark:text-slate-200 transition-all font-bold"
                />
              </div>

              {/* Time slots */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Créneaux disponibles</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {timeSlots.map((time, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 text-[10px] font-extrabold rounded-lg border transition-all duration-200 cursor-pointer ${
                        selectedTime === time 
                          ? 'bg-cyan-500 border-cyan-500 text-white shadow-sm shadow-cyan-500/10' 
                          : 'bg-white/50 dark:bg-slate-950/40 border-slate-200/40 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Motif de consultation</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ex: Suivi tensionnel, maux de tête récurrents..."
                  value={reasonText}
                  onChange={e => setReasonText(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-slate-955 border border-slate-200/40 dark:border-slate-800/60 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-slate-700 dark:text-slate-200 transition-all resize-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs transition-colors uppercase tracking-widest shadow-lg shadow-cyan-500/10 border border-transparent cursor-pointer"
              >
                Confirmer la Réservation
              </button>

            </form>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEWPORT (Toggle mechanism preserved)                               */}
        {/* ========================================================================= */}
        <div className="md:hidden w-full relative z-10">
          <AnimatePresence mode='wait'>
            {isBookingOpen ? (
              <motion.div
                key="booking"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-3xl p-5">
                  <h3 className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">Prendre Rendez-vous</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 leading-relaxed">
                    Remplissez ce formulaire pour planifier une consultation en présentiel ou en téléconsultation.
                  </p>
                </div>

                <form onSubmit={handleBookAppointment} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400">Médecin & Spécialité</label>
                    <select
                      value={selectedDoctor}
                      onChange={e => handleDoctorChange(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      {doctorsList.map((d, index) => (
                        <option key={index} value={d.name}>{d.name} ({d.specialty})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400">Date souhaitée</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-slate-700 dark:text-slate-200 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 block">Créneau horaire disponible</label>
                    <div className="grid grid-cols-5 gap-2">
                      {timeSlots.map((time, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 text-[11px] font-bold rounded-lg border transition-all ${selectedTime === time ? 'bg-cyan-500 border-cyan-500 text-white shadow-md' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400">Motif de consultation</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Ex: Suivi tensionnel, maux de tête récurrents..."
                      value={reasonText}
                      onChange={e => setReasonText(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-slate-700 dark:text-slate-200 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsBookingOpen(false)}
                      className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs text-slate-600 dark:text-slate-400 transition-colors"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-xs transition-colors uppercase tracking-wider cursor-pointer shadow-lg shadow-cyan-500/15"
                    >
                      Réserver
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  {appointments.map((app, index) => {
                    const badge = getStatusBadge(app.status);
                    return (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">{app.specialty}</span>
                            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mt-0.5">{app.doctor}</h4>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badge.class}`}>
                            {badge.text}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3 space-y-2.5">
                          <p className="italic">"{app.reason}"</p>
                          
                          <div className="flex justify-between items-center font-semibold pt-1 border-t border-slate-50 dark:border-slate-800/40">
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{app.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{app.time}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* Mobile Bottom Navigation Bar (Hidden on desktop) */}
      <footer className="sticky bottom-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center justify-around text-slate-400 dark:text-slate-500 md:hidden">
        <Link href="/patient/home" className="flex flex-col items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <Activity className="h-5 w-5" />
          <span className="text-[9px] font-bold">Accueil</span>
        </Link>
        <Link href="/patient/records" className="flex flex-col items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <FileText className="h-5 w-5" />
          <span className="text-[9px] font-bold">Dossier</span>
        </Link>
        <Link href="/patient/emergency" className="flex flex-col items-center gap-1 hover:text-red-500 transition-colors">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <span className="text-[9px] font-bold text-red-500">SOS</span>
        </Link>
        <Link href="/patient/profile" className="flex flex-col items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <User className="h-5 w-5" />
          <span className="text-[9px] font-bold">Profil</span>
        </Link>
      </footer>
    </div>
  );
}
