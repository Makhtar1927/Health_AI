'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Clock, 
  AlertCircle, 
  Activity, 
  Search, 
  Plus, 
  UserPlus, 
  CheckCircle2, 
  Volume2, 
  VolumeX,
  UserCheck, 
  ChevronRight, 
  TrendingUp, 
  X, 
  Play, 
  Stethoscope, 
  HeartPulse, 
  Thermometer, 
  Heart, 
  Droplet, 
  Filter, 
  ArrowRight,
  ShieldAlert,
  Building2,
  Sparkles,
  PhoneCall,
  User,
  Radio
} from 'lucide-react';
import Link from 'next/link';
import DoctorTopBar from '@/components/doctor/DoctorTopBar';
import DoctorNavBar from '@/components/doctor/DoctorNavBar';

interface PatientQueueItem {
  id: string;
  name: string;
  gender: 'M' | 'F';
  age: number;
  checkInTime: string;
  waitTime: string;
  priority: 1 | 2 | 3 | 4; // 1: Routine, 2: Modéré, 3: Grave, 4: Vital
  status: 'waiting' | 'calling' | 'active';
  doctor: string;
  box: string;
  reason: string;
  vitals?: {
    bp: string;
    temp: number;
    spo2: number;
    pulse: number;
  };
  notes?: string;
  isMyPatient: boolean;
}

export default function DoctorWaitingRoomPage() {
  const [queue, setQueue] = useState<PatientQueueItem[]>([
    { 
      id: "P-103", 
      name: "Cheikh Tidiane Diop", 
      gender: "M", 
      age: 67, 
      checkInTime: "12:40", 
      waitTime: "18 min",
      priority: 4, 
      status: "calling", 
      doctor: "Dr. Oumy Aidara",
      box: "Box 4",
      reason: "Détresse respiratoire aiguë & antécédent BPCO décompensé",
      vitals: { bp: "16/10", temp: 38.6, spo2: 89, pulse: 104 },
      notes: "Cliché radio thoracique demandé en urgence",
      isMyPatient: true
    },
    { 
      id: "P-101", 
      name: "Amadou Sall", 
      gender: "M", 
      age: 42, 
      checkInTime: "12:15", 
      waitTime: "43 min",
      priority: 3, 
      status: "waiting", 
      doctor: "Dr. Oumy Aidara",
      box: "Box 4",
      reason: "Douleurs thoraciques constrictives & essoufflement à l'effort",
      vitals: { bp: "15/9", temp: 37.4, spo2: 95, pulse: 88 },
      notes: "ECG pré-réalisé à l'accueil",
      isMyPatient: true
    },
    { 
      id: "P-104", 
      name: "Aissatou Sow", 
      gender: "F", 
      age: 5, 
      checkInTime: "12:45", 
      waitTime: "13 min",
      priority: 2, 
      status: "waiting", 
      doctor: "Dr. Aminata Touré",
      box: "Box 2 - Pédiatrie",
      reason: "Fièvre persistante à 39°C depuis 48h & toux quinteuse",
      vitals: { bp: "10/6", temp: 38.9, spo2: 97, pulse: 112 },
      notes: "Accompagnée par sa mère",
      isMyPatient: false
    },
    { 
      id: "P-105", 
      name: "Babacar Faye", 
      gender: "M", 
      age: 34, 
      checkInTime: "12:55", 
      waitTime: "5 min",
      priority: 2, 
      status: "waiting", 
      doctor: "Dr. Oumy Aidara",
      box: "Box 4",
      reason: "Traumatisme cheville droite suite chute de moto",
      vitals: { bp: "13/8", temp: 37.0, spo2: 99, pulse: 78 },
      notes: "Immobilisation temporaire posée par l'infirmier",
      isMyPatient: true
    },
    { 
      id: "P-102", 
      name: "Mariama Diallo", 
      gender: "F", 
      age: 29, 
      checkInTime: "12:30", 
      waitTime: "28 min",
      priority: 1, 
      status: "active", 
      doctor: "Dr. Abdoulaye Diallo",
      box: "Box 1",
      reason: "Renouvellement traitement d'entretien & bilan biologique",
      vitals: { bp: "12/7", temp: 36.8, spo2: 99, pulse: 72 },
      notes: "Dossier DMP complet à jour",
      isMyPatient: false
    },
    { 
      id: "P-106", 
      name: "Fatou Kiné Diagne", 
      gender: "F", 
      age: 51, 
      checkInTime: "13:05", 
      waitTime: "2 min",
      priority: 3, 
      status: "waiting", 
      doctor: "Dr. Oumy Aidara",
      box: "Box 4",
      reason: "Céphalées intenses avec poussée hypertensive à 18/11",
      vitals: { bp: "18/11", temp: 37.2, spo2: 96, pulse: 92 },
      notes: "Antécédent HTA mal équilibrée",
      isMyPatient: true
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'my' | 'all'>('my');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 1 | 2 | 3 | 4>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'waiting' | 'calling' | 'active'>('all');
  const [callingPatient, setCallingPatient] = useState<string | null>("Cheikh Tidiane Diop");

  // Modal nouveau patient
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState('');
  const [newPatientGender, setNewPatientGender] = useState<'M' | 'F'>('M');
  const [newPatientPriority, setNewPatientPriority] = useState<1 | 2 | 3 | 4>(2);
  const [newPatientReason, setNewPatientReason] = useState('');

  // Appel sonore vocal
  const handleCallPatient = (patient: PatientQueueItem) => {
    setQueue(prev => prev.map(p => p.id === patient.id ? { ...p, status: 'calling' } : p));
    setCallingPatient(patient.name);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const message = new SpeechSynthesisUtterance(
        `Le patient ${patient.name} est attendu au Box 4 du Docteur Oumy Aidara.`
      );
      message.lang = 'fr-FR';
      message.rate = 0.95;
      window.speechSynthesis.speak(message);
    }
  };

  const handleAdmitToConsultation = (patientId: string) => {
    setQueue(prev => prev.map(p => p.id === patientId ? { ...p, status: 'active' } : p));
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const newItem: PatientQueueItem = {
      id: `P-${Math.floor(107 + Math.random() * 890)}`,
      name: newPatientName.trim(),
      gender: newPatientGender,
      age: parseInt(newPatientAge) || 35,
      checkInTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      waitTime: '0 min',
      priority: newPatientPriority,
      status: 'waiting',
      doctor: 'Dr. Oumy Aidara',
      box: 'Box 4',
      reason: newPatientReason.trim() || 'Consultation d\'urgence programmée',
      vitals: { bp: '13/8', temp: 37.1, spo2: 98, pulse: 76 },
      notes: 'Admis directement par le box médical',
      isMyPatient: true
    };

    setQueue(prev => [newItem, ...prev]);
    setIsModalOpen(false);
    setNewPatientName('');
    setNewPatientAge('');
    setNewPatientReason('');
    setNewPatientPriority(2);
  };

  const getPriorityConfig = (priority: 1 | 2 | 3 | 4) => {
    switch (priority) {
      case 4:
        return {
          label: 'Urg. Vitale (P4)',
          shortLabel: 'Vital P4',
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-600',
          badge: 'bg-rose-600 text-white',
          border: 'border-l-rose-500'
        };
      case 3:
        return {
          label: 'Grave (P3)',
          shortLabel: 'Grave P3',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          badge: 'bg-amber-500 text-white',
          border: 'border-l-amber-500'
        };
      case 2:
        return {
          label: 'Modéré (P2)',
          shortLabel: 'Modéré P2',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          badge: 'bg-blue-600 text-white',
          border: 'border-l-blue-500'
        };
      default:
        return {
          label: 'Routine (P1)',
          shortLabel: 'Routine P1',
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          badge: 'bg-slate-500 text-white',
          border: 'border-l-slate-400'
        };
    }
  };

  const filteredQueue = queue.filter(item => {
    if (scopeFilter === 'my' && !item.isMyPatient) return false;
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      const matchReason = item.reason.toLowerCase().includes(q);
      return matchName || matchId || matchReason;
    }
    return true;
  });

  const totalWaiting = queue.filter(p => p.status === 'waiting').length;
  const totalCalling = queue.filter(p => p.status === 'calling').length;
  const totalActive = queue.filter(p => p.status === 'active').length;
  const totalCritical = queue.filter(p => p.priority >= 3).length;
  const myQueueCount = queue.filter(p => p.isMyPatient && p.status !== 'active').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-24 md:pb-12">
      <DoctorTopBar />
      <DoctorNavBar waitingCount={myQueueCount} />

      {/* ── Banner Audio Appel Actif ───────────────────────────────────── */}
      <AnimatePresence>
        {callingPatient && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-700 text-white px-4 py-2.5 shadow-sm border-b border-emerald-800"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <span className="font-extrabold uppercase tracking-wider text-[11px] bg-emerald-800/80 px-2 py-0.5 rounded-full shrink-0">
                  Appel en cours
                </span>
                <span className="truncate">
                  Patient <strong className="font-black underline">{callingPatient}</strong> appelé au Box 4
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      const msg = new SpeechSynthesisUtterance(
                        `Rappel : Le patient ${callingPatient} est attendu au Box 4 du Docteur Oumy Aidara.`
                      );
                      msg.lang = 'fr-FR';
                      window.speechSynthesis.speak(msg);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Répéter l'annonce vocale"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Répéter
                </button>
                <button
                  onClick={() => setCallingPatient(null)}
                  className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="Fermer la bannière"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Container ──────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto w-full px-3.5 sm:px-6 pt-4 sm:pt-6 space-y-4 sm:space-y-6">

        {/* ── Header Title & Realtime KPIs ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Salle d'Attente & Triage Clinique
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Gestion de la file d'attente, appel des box et régulation des urgences médicales
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              Admission Rapide
            </button>
          </div>
        </div>

        {/* ── KPI Strip ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">En Salle d'Attente</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{totalWaiting}</p>
            <p className="text-[10px] font-semibold text-emerald-700 mt-0.5">
              {queue.filter(p => p.isMyPatient && p.status === 'waiting').length} pour votre box
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">En Appel Micro</span>
              <Volume2 className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-amber-600">{totalCalling}</p>
            <p className="text-[10px] font-medium text-slate-400 mt-0.5">Notification vocale active</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Cas Prioritaires</span>
              <AlertCircle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-black text-rose-600">{totalCritical}</p>
            <p className="text-[10px] font-medium text-rose-700/80 mt-0.5">P4 Vital & P3 Grave</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">En Consultation</span>
              <UserCheck className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-black text-blue-600">{totalActive}</p>
            <p className="text-[10px] font-medium text-slate-400 mt-0.5">Prise en charge active</p>
          </div>
        </div>

        {/* ── Search & Filter Controls ────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-3">
          
          {/* Top row: Search input + Scope toggle */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher patient par nom, ID ou motif..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Scope Toggle: Mes Patients vs Toute la Clinique */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
              <button
                onClick={() => setScopeFilter('my')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  scopeFilter === 'my'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Mon Box (Dr. Aidara) ({queue.filter(p => p.isMyPatient).length})
              </button>
              <button
                onClick={() => setScopeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  scopeFilter === 'all'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Toute la Clinique ({queue.length})
              </button>
            </div>

          </div>

          {/* Bottom row: Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100 text-[11px]">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] shrink-0 mr-1">
              Filtres :
            </span>

            {/* Statut chips */}
            {[
              { key: 'all', label: 'Tous les statuts' },
              { key: 'waiting', label: 'En attente' },
              { key: 'calling', label: 'En appel' },
              { key: 'active', label: 'En consultation' }
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key as any)}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                  statusFilter === f.key
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}

            <span className="w-px h-4 bg-slate-200 shrink-0 mx-1" />

            {/* Priorité chips */}
            {[
              { key: 'all', label: 'Toutes urgences' },
              { key: 4, label: '🔴 Vital (P4)' },
              { key: 3, label: '🟠 Grave (P3)' },
              { key: 2, label: '🔵 Modéré (P2)' },
              { key: 1, label: '⚪ Routine (P1)' }
            ].map(f => (
              <button
                key={String(f.key)}
                onClick={() => setPriorityFilter(f.key as any)}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                  priorityFilter === f.key
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>

        {/* ── Patient List (Mobile Cards + Desktop Enhanced) ──────────────── */}
        <div className="space-y-3">
          {filteredQueue.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-extrabold text-sm text-slate-700">Aucun patient ne correspond aux critères</p>
              <p className="text-xs text-slate-400">Modifiez vos filtres ou effectuez une nouvelle recherche.</p>
              <button
                onClick={() => { setSearchQuery(''); setPriorityFilter('all'); setStatusFilter('all'); setScopeFilter('my'); }}
                className="mt-2 text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            filteredQueue.map(patient => {
              const priorityCfg = getPriorityConfig(patient.priority);
              const isCalling = patient.status === 'calling';
              const isActive = patient.status === 'active';

              return (
                <div
                  key={patient.id}
                  className={`bg-white border rounded-2xl transition-all shadow-xs overflow-hidden ${
                    isCalling
                      ? 'border-amber-400 ring-2 ring-amber-400/20'
                      : isActive
                      ? 'border-blue-300 bg-blue-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left: Patient Avatar, Details & Vitals */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      
                      {/* Avatar initials with gender pill */}
                      <div className="relative shrink-0">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-xs ${
                          patient.priority === 4
                            ? 'bg-rose-600 text-white'
                            : patient.priority === 3
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}>
                          {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <span className="absolute -bottom-1 -right-1 text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-white border border-slate-200 text-slate-600 shadow-xs">
                          {patient.gender} · {patient.age}a
                        </span>
                      </div>

                      {/* Info & Motifs */}
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <h3 className="font-black text-sm sm:text-base text-slate-900 tracking-tight">
                            {patient.name}
                          </h3>
                          <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                            {patient.id}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${priorityCfg.bg}`}>
                            {priorityCfg.shortLabel}
                          </span>
                          {isCalling && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                              <Volume2 className="w-3 h-3" />
                              En Appel
                            </span>
                          )}
                          {isActive && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-600 text-white">
                              <UserCheck className="w-3 h-3" />
                              En Box
                            </span>
                          )}
                        </div>

                        {/* Motif clinique */}
                        <p className="text-xs font-semibold text-slate-700 leading-snug line-clamp-2">
                          {patient.reason}
                        </p>

                        {/* Assignation & Temps */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 font-medium pt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Arrivé à {patient.checkInTime} (<strong className="text-slate-600 font-bold">Attente: {patient.waitTime}</strong>)
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-emerald-600" />
                            {patient.box} · {patient.doctor}
                          </span>
                        </div>

                        {/* Vitals HUD Chips */}
                        {patient.vitals && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-2">
                            <div className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                              <Activity className="w-3 h-3 text-emerald-600" />
                              TA: <span className="font-mono text-slate-900">{patient.vitals.bp}</span>
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                              patient.vitals.spo2 < 92
                                ? 'bg-rose-50 text-rose-800 border-rose-200 font-black'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              <Droplet className="w-3 h-3 text-blue-500" />
                              SpO2: <span className="font-mono">{patient.vitals.spo2}%</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                              <Thermometer className="w-3 h-3 text-amber-500" />
                              T°: <span className="font-mono">{patient.vitals.temp}°C</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                              <Heart className="w-3 h-3 text-rose-500" />
                              FC: <span className="font-mono">{patient.vitals.pulse} bpm</span>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>

                    {/* Right: Quick Action Buttons */}
                    <div className="flex items-center gap-2 self-stretch sm:self-end lg:self-center shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      
                      {/* Vocal Call Button */}
                      <button
                        onClick={() => handleCallPatient(patient)}
                        className={`flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
                          isCalling
                            ? 'bg-amber-500 hover:bg-amber-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                        title="Appeler au microphone du box"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        {isCalling ? 'Rappeler' : 'Appeler'}
                      </button>

                      {/* Direct Start Consultation Button */}
                      <Link
                        href={`/doctor/consultation?patientId=${patient.id}`}
                        onClick={() => handleAdmitToConsultation(patient.id)}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
                        title="Démarrer la consultation pour ce patient"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        Consulter
                        <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </Link>

                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

      </main>

      {/* ── Modal: Admission Rapide Patient ─────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Admission Rapide en Box</h3>
                    <p className="text-[10px] text-slate-400">Ajout immédiat à la file d'attente</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddPatient} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Nom complet du patient *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Mamadou Ndiaye"
                    value={newPatientName}
                    onChange={e => setNewPatientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Âge (ans)</label>
                    <input
                      type="number"
                      placeholder="ex: 38"
                      value={newPatientAge}
                      onChange={e => setNewPatientAge(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Genre</label>
                    <select
                      value={newPatientGender}
                      onChange={e => setNewPatientGender(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                    >
                      <option value="M">Masculin (M)</option>
                      <option value="F">Féminin (F)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Niveau d'urgence clinique (Triage)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: 4, label: '🔴 Vital (P4)', desc: 'Pronostic engagé' },
                      { val: 3, label: '🟠 Grave (P3)', desc: 'Prise en charge < 15m' },
                      { val: 2, label: '🔵 Modéré (P2)', desc: 'Soins réguliers' },
                      { val: 1, label: '⚪ Routine (P1)', desc: 'Contrôle standard' }
                    ].map(p => (
                      <button
                        type="button"
                        key={p.val}
                        onClick={() => setNewPatientPriority(p.val as any)}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          newPatientPriority === p.val
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                        }`}
                      >
                        <p className="font-extrabold text-[11px]">{p.label}</p>
                        <p className="text-[10px] text-slate-400">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Motif principal d'admission</label>
                  <input
                    type="text"
                    placeholder="ex: Céphalées fébriles, douleur thoracique..."
                    value={newPatientReason}
                    onChange={e => setNewPatientReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black cursor-pointer shadow-sm"
                  >
                    Enregistrer en file
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
