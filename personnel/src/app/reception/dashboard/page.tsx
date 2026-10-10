'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Calendar, Clock, CheckCircle2, Circle,
  XCircle, AlertCircle, Search, ChevronRight, Stethoscope,
  Building2, Phone, ArrowRight, Radio, Volume2, UserCheck,
  CalendarCheck, X, Activity, Bell, LogIn, CreditCard,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import StaffHeader from '@/components/StaffHeader';

// ─── Types ─────────────────────────────────────────────────────────────────

type AppointmentStatus = 'scheduled' | 'sent_to_cashier' | 'ticket_paid' | 'in_consultation' | 'done' | 'absent';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'M' | 'F';
  patientPhone: string;
  doctor: string;
  doctorBox: string;
  specialty: string;
  time: string;
  reason: string;
  type: 'in_person' | 'walkin';
  status: AppointmentStatus;
  priority: 1 | 2 | 3;
  arrivedAt?: string;
  sentToCashierAt?: string;
}

// ─── Shared state via localStorage (simulating cross-tab sync) ─────────────
const QUEUE_KEY = 'sunu_cashier_queue';

export const getCashierQueue = (): Appointment[] => {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); } catch { return []; }
};

export const addToCashierQueue = (appt: Appointment) => {
  if (typeof window === 'undefined') return;
  const existing = getCashierQueue();
  if (!existing.find(a => a.id === appt.id)) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify([appt, ...existing]));
  }
};

// ─── Helpers ───────────────────────────────────────────────────────────────

const getStatusConfig = (status: AppointmentStatus) => {
  switch (status) {
    case 'done':
      return { label: 'Terminé', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' };
    case 'in_consultation':
      return { label: 'En consultation', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500 animate-pulse' };
    case 'ticket_paid':
      return { label: 'Ticket validé — En salle', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', dot: 'bg-purple-500' };
    case 'sent_to_cashier':
      return { label: 'Envoyé en Caisse ↗', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500 animate-pulse' };
    case 'absent':
      return { label: 'Absent', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200', dot: 'bg-rose-400' };
    default:
      return { label: 'Prévu', color: 'text-slate-600', bg: 'bg-slate-100 border-slate-200', dot: 'bg-slate-400' };
  }
};

const getPriorityConfig = (p: 1 | 2 | 3) => {
  if (p === 3) return { label: 'Urgent', cls: 'bg-rose-100 text-rose-700 border-rose-200' };
  if (p === 2) return { label: 'Modéré', cls: 'bg-amber-100 text-amber-700 border-amber-200' };
  return { label: 'Routine', cls: 'bg-slate-100 text-slate-500 border-slate-200' };
};

// ─── Initial data ──────────────────────────────────────────────────────────

const INITIAL: Appointment[] = [
  {
    id: 'RDV-701', patientId: 'P-101', patientName: 'Amadou Sall', patientAge: 42,
    patientGender: 'M', patientPhone: '+221 77 234 56 78',
    doctor: 'Dr. Oumy Aidara', doctorBox: 'Box 4', specialty: 'Cardiologie',
    time: '08:30', reason: 'Suivi tension artérielle & ECG',
    type: 'in_person', status: 'scheduled', priority: 2
  },
  {
    id: 'RDV-702', patientId: 'P-102', patientName: 'Mariama Diallo', patientAge: 29,
    patientGender: 'F', patientPhone: '+221 70 987 65 43',
    doctor: 'Dr. Abdoulaye Diallo', doctorBox: 'Box 1', specialty: 'Médecine Générale',
    time: '09:00', reason: 'Renouvellement ordonnance & bilan biologique',
    type: 'in_person', status: 'ticket_paid', priority: 1
  },
  {
    id: 'RDV-703', patientId: 'P-103', patientName: 'Cheikh Tidiane Diop', patientAge: 67,
    patientGender: 'M', patientPhone: '+221 76 543 21 09',
    doctor: 'Dr. Oumy Aidara', doctorBox: 'Box 4', specialty: 'Pneumologie',
    time: '09:30', reason: 'Détresse respiratoire & antécédent BPCO',
    type: 'in_person', status: 'scheduled', priority: 3
  },
  {
    id: 'RDV-704', patientId: 'P-104', patientName: 'Aissatou Sow', patientAge: 5,
    patientGender: 'F', patientPhone: '+221 78 112 33 44',
    doctor: 'Dr. Aminata Touré', doctorBox: 'Box 2 — Pédiatrie', specialty: 'Pédiatrie',
    time: '09:45', reason: 'Fièvre persistante 39°C & toux quinteuse',
    type: 'in_person', status: 'scheduled', priority: 2
  },
  {
    id: 'RDV-705', patientId: 'P-105', patientName: 'Babacar Faye', patientAge: 34,
    patientGender: 'M', patientPhone: '+221 77 765 43 21',
    doctor: 'Dr. Oumy Aidara', doctorBox: 'Box 4', specialty: 'Traumatologie',
    time: '10:15', reason: 'Traumatisme cheville droite suite chute moto',
    type: 'in_person', status: 'scheduled', priority: 2
  },
  {
    id: 'RDV-706', patientId: 'P-106', patientName: 'Fatou Kiné Diagne', patientAge: 51,
    patientGender: 'F', patientPhone: '+221 70 456 78 90',
    doctor: 'Dr. Oumy Aidara', doctorBox: 'Box 4', specialty: 'Cardiologie',
    time: '10:45', reason: 'Céphalées intenses & poussée hypertensive',
    type: 'in_person', status: 'done', priority: 3
  },
];

// ─── Component ─────────────────────────────────────────────────────────────

export default function ReceptionDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'active' | 'done'>('all');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [justSentId, setJustSentId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState<'M' | 'F'>('M');
  const [newPriority, setNewPriority] = useState<1 | 2 | 3>(2);
  const [newDoctor, setNewDoctor] = useState('Dr. Oumy Aidara');
  const [newReason, setNewReason] = useState('');

  useEffect(() => {
    const update = () => setCurrentTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    update();
    const iv = setInterval(update, 30000);
    return () => clearInterval(iv);
  }, []);

  // ── Validate arrival → send to cashier ────────────────────────────────────
  const handleValidateArrival = (appt: Appointment) => {
    const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const updated = { ...appt, status: 'sent_to_cashier' as AppointmentStatus, arrivedAt: now, sentToCashierAt: now };
    setAppointments(prev => prev.map(a => a.id === appt.id ? updated : a));
    // Push to shared cashier queue (localStorage)
    addToCashierQueue(updated);
    setJustSentId(appt.id);
    setTimeout(() => setJustSentId(null), 4000);
    setConfirmingId(null);
  };

  const handleMarkAbsent = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'absent' as AppointmentStatus } : a));
    setConfirmingId(null);
  };

  const handleAddWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const box = newDoctor === 'Dr. Oumy Aidara' ? 'Box 4' : newDoctor === 'Dr. Abdoulaye Diallo' ? 'Box 1' : 'Box 2 — Pédiatrie';
    const specialtyMap: Record<string, string> = {
      'Dr. Oumy Aidara': 'Cardiologie',
      'Dr. Abdoulaye Diallo': 'Médecine Générale',
      'Dr. Aminata Touré': 'Pédiatrie'
    };
    const newAppt: Appointment = {
      id: `WALK-${Math.floor(100 + Math.random() * 900)}`,
      patientId: `P-${Math.floor(200 + Math.random() * 800)}`,
      patientName: newName.trim(),
      patientAge: parseInt(newAge) || 30,
      patientGender: newGender,
      patientPhone: '—',
      doctor: newDoctor,
      doctorBox: box,
      specialty: specialtyMap[newDoctor] || 'Médecine Générale',
      time: now,
      reason: newReason.trim() || 'Consultation sans rendez-vous',
      type: 'walkin',
      status: 'sent_to_cashier',
      priority: newPriority,
      arrivedAt: now,
      sentToCashierAt: now,
    };
    setAppointments(prev => [newAppt, ...prev]);
    addToCashierQueue(newAppt);
    setIsNewPatientOpen(false);
    setNewName(''); setNewAge(''); setNewReason(''); setNewPriority(2);
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalToday = appointments.length;
  const pendingCount = appointments.filter(a => a.status === 'scheduled').length;
  const sentToCashierCount = appointments.filter(a => a.status === 'sent_to_cashier').length;
  const ticketPaidCount = appointments.filter(a => a.status === 'ticket_paid').length;
  const doneCount = appointments.filter(a => a.status === 'done').length;

  const filtered = appointments.filter(a => {
    const matchSearch =
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter =
      filterStatus === 'all' ? true :
      filterStatus === 'scheduled' ? a.status === 'scheduled' :
      filterStatus === 'active' ? ['sent_to_cashier', 'ticket_paid', 'in_consultation'].includes(a.status) :
      ['done', 'absent'].includes(a.status);
    return matchSearch && matchFilter;
  });

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <StaffHeader
        title="Tableau de Bord — Réception"
        subtitle="Accueil & Admissions Centrales"
        roleBadge="Accueil"
        badgeColor="bg-blue-50 text-blue-700 border-blue-200"
        icon={<Building2 className="h-5 w-5" />}
      />

      <main className="flex-grow max-w-7xl mx-auto w-full px-3 sm:px-5 lg:px-8 py-5 space-y-5">

        {/* ── Top bar ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight capitalize">{today}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <Radio className="w-3 h-3 animate-pulse" />
                Flux en direct
              </span>
              <span className="text-xs text-slate-400 font-medium">{currentTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/reception/waiting-room"
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all">
              <Users className="w-4 h-4 text-blue-600" />
              File d'Attente
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button onClick={() => setIsNewPatientOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer">
              <UserPlus className="w-4 h-4" />
              Patient sans RDV
            </button>
          </div>
        </div>

        {/* ── Flux visuel ─────────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">Flux Patient</p>
          <div className="flex items-center gap-1 flex-wrap text-xs font-bold">
            {[
              { label: 'Prévu', count: pendingCount, color: 'bg-slate-100 text-slate-600 border-slate-200' },
              { label: '→', count: null, color: '' },
              { label: 'Arrivé → Caisse', count: sentToCashierCount, color: 'bg-amber-50 text-amber-700 border-amber-200' },
              { label: '→', count: null, color: '' },
              { label: 'Ticket Payé → File', count: ticketPaidCount, color: 'bg-purple-50 text-purple-700 border-purple-200' },
              { label: '→', count: null, color: '' },
              { label: 'Terminé', count: doneCount, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            ].map((step, i) =>
              step.count === null
                ? <span key={i} className="text-slate-300 text-lg">›</span>
                : (
                  <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${step.color}`}>
                    {step.label}
                    <span className="font-black text-base leading-none">{step.count}</span>
                  </span>
                )
            )}
          </div>
        </div>

        {/* ── Appointment list ─────────────────────────────────────────────── */}
        <div className="space-y-3">
          {/* Header + filters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Rendez-vous & Admissions du Jour</h3>
                  <p className="text-[10px] text-slate-400">{filtered.length} dossiers affichés</p>
                </div>
              </div>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                {(['all', 'scheduled', 'active', 'done'] as const).map(f => (
                  <button key={f} onClick={() => setFilterStatus(f)}
                    className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${filterStatus === f ? 'bg-white shadow-xs text-blue-700' : 'text-slate-500 hover:text-slate-800'}`}>
                    {f === 'all' ? 'Tous' : f === 'scheduled' ? 'Prévus' : f === 'active' ? 'En cours' : 'Terminés'}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input type="text" placeholder="Rechercher patient, médecin, ID..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-300 text-slate-800 transition-all" />
            </div>
          </div>

          {/* Cards */}
          <AnimatePresence>
            {filtered.map(appt => {
              const st = getStatusConfig(appt.status);
              const pr = getPriorityConfig(appt.priority);
              const isScheduled = appt.status === 'scheduled';
              const isConfirming = confirmingId === appt.id;
              const justSent = justSentId === appt.id;

              return (
                <motion.div key={appt.id} layout
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -8 }}
                  className={`bg-white border rounded-2xl overflow-hidden shadow-xs transition-all ${
                    justSent ? 'border-amber-400 ring-2 ring-amber-400/25' :
                    appt.status === 'sent_to_cashier' ? 'border-amber-300' :
                    appt.status === 'ticket_paid' ? 'border-purple-300' :
                    isScheduled ? 'border-slate-200 hover:border-blue-200' :
                    'border-slate-100 opacity-75'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
                    {/* Left */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      {/* Time */}
                      <div className="shrink-0 text-center w-12">
                        <p className="text-base font-black text-slate-900">{appt.time}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{appt.type === 'walkin' ? 'Sans RDV' : 'RDV'}</p>
                        {appt.sentToCashierAt && (
                          <p className="text-[9px] text-amber-600 font-bold mt-0.5">→ {appt.sentToCashierAt}</p>
                        )}
                      </div>
                      <div className={`w-0.5 self-stretch rounded-full ${
                        appt.status === 'done' ? 'bg-emerald-200' :
                        appt.status === 'sent_to_cashier' ? 'bg-amber-300' :
                        appt.status === 'ticket_paid' ? 'bg-purple-300' :
                        isScheduled ? 'bg-slate-200' : 'bg-blue-200'
                      }`} />
                      {/* Info */}
                      <div className="min-w-0 space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h4 className="font-black text-sm text-slate-900">{appt.patientName}</h4>
                          <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{appt.id}</span>
                          <span className="text-[9px] text-slate-500">{appt.patientGender} · {appt.patientAge} ans</span>
                          {appt.priority >= 3 && (
                            <span className="text-[9px] font-black text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-full">⚡ Urgent</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 font-semibold leading-snug line-clamp-1">{appt.reason}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Stethoscope className="w-3 h-3 text-emerald-600" />
                            {appt.doctor} · {appt.doctorBox}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3 text-blue-500" />
                            {appt.specialty}
                          </span>
                          {appt.patientPhone !== '—' && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {appt.patientPhone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Status + Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${st.bg} ${st.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>

                      {/* Scheduled → confirm arrival */}
                      {isScheduled && !isConfirming && (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setConfirmingId(appt.id)}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer">
                            <LogIn className="w-3.5 h-3.5" />
                            Valider Arrivée → Caisse
                          </button>
                          <button onClick={() => handleMarkAbsent(appt.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-500 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer border border-slate-200 hover:border-rose-200">
                            <XCircle className="w-3.5 h-3.5" />
                            Absent
                          </button>
                        </div>
                      )}

                      {/* Confirmation prompt */}
                      {isConfirming && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-600 font-bold">Envoyer en caisse ?</span>
                          <button onClick={() => handleValidateArrival(appt)}
                            className="px-2.5 py-1.5 bg-blue-600 text-white text-[11px] font-black rounded-lg cursor-pointer hover:bg-blue-500">
                            Oui ✓
                          </button>
                          <button onClick={() => setConfirmingId(null)}
                            className="px-2.5 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-lg cursor-pointer hover:bg-slate-200">
                            Non
                          </button>
                        </motion.div>
                      )}

                      {/* Sent to cashier: show link */}
                      {appt.status === 'sent_to_cashier' && (
                        <Link href="/cashier/dashboard"
                          className="text-[11px] font-bold text-amber-700 hover:underline flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          En attente à la Caisse <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      )}

                      {appt.status === 'ticket_paid' && (
                        <span className="text-[11px] font-bold text-purple-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Ticket payé — En salle d'attente
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Banner: just sent to cashier */}
                  <AnimatePresence>
                    {justSent && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="bg-amber-500 text-white px-4 py-2 text-[11px] font-bold flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5" />
                        {appt.patientName} envoyé(e) à la caisse · Ticket de consultation requis
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      {/* ── Modal: Patient sans RDV ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isNewPatientOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Patient sans Rendez-vous</h3>
                    <p className="text-[10px] text-slate-400">Sera directement envoyé en caisse</p>
                  </div>
                </div>
                <button onClick={() => setIsNewPatientOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAddWalkIn} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Nom complet *</label>
                  <input required type="text" placeholder="Ex: Mamadou Ndiaye" value={newName} onChange={e => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Âge</label>
                    <input type="number" placeholder="Ex: 34" value={newAge} onChange={e => setNewAge(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-xs" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Sexe</label>
                    <select value={newGender} onChange={e => setNewGender(e.target.value as 'M' | 'F')}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-xs">
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Motif</label>
                  <input type="text" placeholder="Ex: Douleurs abdominales" value={newReason} onChange={e => setNewReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-xs" />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1.5">Urgence</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { val: 3 as const, label: '🔴 Urgent' },
                      { val: 2 as const, label: '🔵 Modéré' },
                      { val: 1 as const, label: '⚪ Routine' },
                    ]).map(p => (
                      <button type="button" key={p.val} onClick={() => setNewPriority(p.val)}
                        className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all font-bold text-[11px] ${newPriority === p.val ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Médecin</label>
                  <select value={newDoctor} onChange={e => setNewDoctor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-xs">
                    <option value="Dr. Oumy Aidara">Dr. Oumy Aidara (Box 4)</option>
                    <option value="Dr. Abdoulaye Diallo">Dr. Abdoulaye Diallo (Box 1)</option>
                    <option value="Dr. Aminata Touré">Dr. Aminata Touré (Box 2)</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsNewPatientOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">Annuler</button>
                  <button type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black shadow-sm cursor-pointer">
                    Valider → Envoyer en Caisse
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="border-t border-slate-200 py-3 text-center text-[11px] text-slate-400">
        © {new Date().getFullYear()} Health AI · Accueil & Admissions
      </footer>
    </div>
  );
}
