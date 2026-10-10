'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  Users, 
  Clock, 
  Activity, 
  Sparkles, 
  ChevronRight, 
  Image as ImageIcon,
  Video,
  FileText,
  Search,
  CheckCircle,
  Play,
  Volume2,
  AlertTriangle,
  Brain,
  ArrowRight,
  Send,
  Loader2,
  HeartPulse,
  Thermometer,
  Heart,
  Droplet,
  Filter,
  Calendar,
  PhoneCall,
  UserCheck,
  Plus,
  ShieldCheck,
  BadgeAlert,
  Mic,
  RotateCcw,
  SlidersHorizontal,
  X
} from 'lucide-react';
import Link from 'next/link';
import DoctorTopBar from '@/components/doctor/DoctorTopBar';
import DoctorNavBar from '@/components/doctor/DoctorNavBar';
import { getAuthHeader, useAuthStore } from '@/lib/authStore';

interface PatientQueue {
  id: string;
  name: string;
  gender: 'M' | 'F';
  age: number;
  checkInTime: string;
  priority: 1 | 2 | 3 | 4; // 1: Routine, 2: Modéré, 3: Grave, 4: Vital
  status: 'waiting' | 'calling' | 'active';
  reason: string;
  vitals?: {
    bp: string;
    temp: number;
    spo2: number;
    pulse: number;
  };
  notes?: string;
}

export default function DoctorDashboard() {
  const { user, initialize } = useAuthStore();

  const [queue, setQueue] = useState<PatientQueue[]>([
    { 
      id: "P-103", 
      name: "Cheikh Tidiane Diop", 
      gender: "M", 
      age: 67, 
      checkInTime: "12:40", 
      priority: 4, 
      status: "calling", 
      reason: "Détresse respiratoire sévère & antécédent BPCO décompensé",
      vitals: { bp: "16/10", temp: 38.6, spo2: 89, pulse: 104 },
      notes: "Cliché radio thoracique demandé en urgence"
    },
    { 
      id: "P-101", 
      name: "Amadou Sall", 
      gender: "M", 
      age: 42, 
      checkInTime: "12:15", 
      priority: 3, 
      status: "waiting", 
      reason: "Douleurs thoraciques constrictives & essoufflement à l'effort",
      vitals: { bp: "15/9", temp: 37.4, spo2: 95, pulse: 88 },
      notes: "ECG pré-réalisé à l'accueil"
    },
    { 
      id: "P-104", 
      name: "Aissatou Sow", 
      gender: "F", 
      age: 5, 
      checkInTime: "12:45", 
      priority: 2, 
      status: "waiting", 
      reason: "Fièvre persistante à 39°C depuis 48h & toux quinteuse",
      vitals: { bp: "10/6", temp: 38.9, spo2: 97, pulse: 112 },
      notes: "Accompagnée par sa mère"
    },
    { 
      id: "P-102", 
      name: "Mariama Diallo", 
      gender: "F", 
      age: 29, 
      checkInTime: "12:30", 
      priority: 1, 
      status: "active", 
      reason: "Renouvellement traitement d'entretien & bilan biologique",
      vitals: { bp: "12/7", temp: 36.8, spo2: 99, pulse: 72 },
      notes: "Dossier DMP complet à jour"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'critical' | 1 | 2 | 3 | 4>('all');
  const [activeTabMobile, setActiveTabMobile] = useState<'queue' | 'ai'>('queue');
  const [callingPatientName, setCallingPatientName] = useState<string | null>(null);

  // AI Clinical Assistant State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { 
      role: 'assistant', 
      content: "Bonjour Docteur. Je suis votre Co-Pilote Clinique Health AI. Je peux analyser les symptômes, synthétiser des protocoles thérapeutiques ou contrôler les contre-indications d'ordonnance en temps réel." 
    }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Dynamic Statistics
  const totalWaiting = queue.filter(p => p.status === 'waiting' || p.status === 'calling').length;
  const criticalCases = queue.filter(p => p.priority >= 3).length;
  const activeConsultation = queue.find(p => p.status === 'active');
  const consultationsDoneToday = 14;

  // Filtered Queue computation
  const filteredQueue = queue.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (priorityFilter === 'all') return true;
    if (priorityFilter === 'critical') return p.priority >= 3;
    return p.priority === priorityFilter;
  });

  // Call patient (Text to Speech Web API)
  const handleCallPatient = (id: string) => {
    const patient = queue.find(p => p.id === id);
    if (!patient) return;

    setQueue(prev => prev.map(p => p.id === id ? { ...p, status: 'calling' } : p));
    setCallingPatientName(patient.name);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(`Le patient ${patient.name} est attendu par le médecin en salle de consultation.`);
      msg.lang = 'fr-FR';
      msg.rate = 0.95;
      window.speechSynthesis.speak(msg);
    }

    setTimeout(() => {
      setCallingPatientName(null);
    }, 4500);
  };

  const handleAdmitPatient = (id: string) => {
    setQueue(prev => prev.map(p => {
      if (p.id === id) return { ...p, status: 'active' };
      if (p.status === 'active') return { ...p, status: 'waiting' };
      return p;
    }));
  };

  const handleCompletePatient = (id: string) => {
    setQueue(prev => prev.filter(p => p.id !== id));
  };

  const handleCallNextWaiting = () => {
    const nextPatient = queue.find(p => p.status === 'waiting' || p.status === 'calling');
    if (nextPatient) {
      handleCallPatient(nextPatient.id);
    }
  };

  // AI Chat submission
  const handleSendChatMessage = async (textToSend?: string) => {
    const query = (textToSend || chatInput).trim();
    if (!query) return;

    setChatMessages(prev => [...prev, { role: 'user', content: query }]);
    if (!textToSend) setChatInput('');
    setIsAiLoading(true);

    try {
      const formattedHistory = chatMessages.map(m => ({
        role: m.role === 'user' ? 'user' as const : 'model' as const,
        parts: m.content
      }));

      const authHeader = await getAuthHeader();
      const res = await fetch('http://localhost:5000/api/ai/clinical-assistant', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify({ query, history: formattedHistory })
      });

      const data = await res.json();
      if (data.success) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "⚠️ Assistant indisponible temporairement. Veuillez vérifier que le serveur backend est démarré sur le port 5000." 
        }]);
      }
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "⚠️ Erreur de connexion avec le serveur d'IA médical. Assurez-vous que l'API tourne sur localhost:5000." 
      }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const getPriorityInfo = (priority: 1 | 2 | 3 | 4) => {
    switch (priority) {
      case 4: return { text: "Urgence Vitale (P4)", badge: "bg-rose-100 text-rose-800 border-rose-300 font-black", dot: "bg-rose-600" };
      case 3: return { text: "Cas Grave (P3)", badge: "bg-orange-100 text-orange-800 border-orange-300 font-bold", dot: "bg-orange-500" };
      case 2: return { text: "Modéré (P2)", badge: "bg-blue-100 text-blue-800 border-blue-300 font-semibold", dot: "bg-blue-500" };
      default: return { text: "Routine (P1)", badge: "bg-slate-100 text-slate-700 border-slate-300 font-medium", dot: "bg-slate-400" };
    }
  };

  const aiQuickPrompts = [
    "Protocole Paludisme Grave OMS",
    "Score de gravité CURB-65",
    "Posologie pédiatrique Amoxicilline",
    "Contre-indications AINS + Kardegic"
  ];

  const currentDateStr = new Intl.DateTimeFormat('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());

  const doctorDisplayName = user?.name 
    ? (user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`) 
    : 'Dr. Oumy Aidara';

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col justify-between pb-16 md:pb-8">
      
      {/* ── TOPBAR PROS ──────────────────────────────────────────────── */}
      <DoctorTopBar onSearch={setSearchQuery} />

      {/* ── NAVBAR PROS ──────────────────────────────────────────────── */}
      <DoctorNavBar 
        waitingCount={totalWaiting} 
        hasActiveConsultation={Boolean(activeConsultation)} 
      />

      {/* ── VOICE CALL ALERT BANNER (Active speech) ─────────────────── */}
      <AnimatePresence>
        {callingPatientName && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-amber-500 text-slate-950 font-extrabold text-xs px-4 py-2 flex items-center justify-center gap-2 shadow-sm sticky top-28 z-30"
          >
            <Volume2 className="w-4 h-4 animate-bounce" />
            <span>Appel vocal en cours : <strong>{callingPatientName}</strong> est invité(e) en salle de consultation.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT CONTAINER ───────────────────────────────────── */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-3 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        
        {/* ── 1. Hero Service & Action Header ────────────────────────── */}
        <section className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Doctor Greeting & Service */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="capitalize flex items-center gap-1.5 font-semibold text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  {currentDateStr}
                </span>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Garde Active &bull; Box 1
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                {doctorDisplayName}
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-500">
                Vous avez <strong className="text-slate-900 font-bold">{totalWaiting} patient(s)</strong> dans votre file, dont{' '}
                <strong className="text-rose-600 font-extrabold">{criticalCases} urgence(s) vitale(s)</strong> à examiner en priorité.
              </p>
            </div>

            {/* Quick Primary Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 lg:pt-0">
              <button
                onClick={handleCallNextWaiting}
                className="h-10 sm:h-11 px-4 sm:px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                title="Déclencher l'appel vocal du patient suivant"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Appeler Suivant</span>
              </button>

              <Link
                href="/doctor/consultation"
                className="h-10 sm:h-11 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <span>Dossier Consultation</span>
              </Link>

              <Link
                href="/reception/waiting-room"
                className="h-10 sm:h-11 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                title="Voir la salle d'attente générale"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Salle d'attente</span>
              </Link>
            </div>

          </div>
        </section>

        {/* ── 2. Mobile Tabs Switcher ─────────────────────────────────── */}
        <div className="lg:hidden flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTabMobile('queue')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTabMobile === 'queue' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            File d'Attente ({totalWaiting})
          </button>
          <button
            onClick={() => setActiveTabMobile('ai')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTabMobile === 'ai' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            Co-Pilote IA Clinique
          </button>
        </div>

        {/* ── 3. Four Clinical KPI Cards ──────────────────────────────── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          
          <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">File d'Attente</p>
              <p className="text-xl sm:text-3xl font-black text-slate-900 mt-0.5">{totalWaiting}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Attente moy. ~ 12 min</p>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>
          
          <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Cas Prioritaires</p>
              <p className="text-xl sm:text-3xl font-black text-rose-600 mt-0.5">{criticalCases}</p>
              <p className="text-[10px] text-rose-700 font-bold mt-0.5">Tri Vitale & Grave (P3-P4)</p>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Actes Effectués</p>
              <p className="text-xl sm:text-3xl font-black text-emerald-600 mt-0.5">{consultationsDoneToday}</p>
              <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">Planning journalier 78%</p>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Radios PACS</p>
              <p className="text-xl sm:text-3xl font-black text-purple-600 mt-0.5">2 Prêts</p>
              <p className="text-[10px] text-purple-700 font-medium mt-0.5">Clichés synchronisés</p>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
          </div>

        </section>

        {/* ── 4. Main 2-Column Clinical Layout ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ── Left Column: Active Patient Hero & Queue (8 cols) ──────── */}
          <div className={`space-y-6 lg:col-span-7 xl:col-span-8 ${activeTabMobile === 'ai' ? 'hidden lg:block' : 'block'}`}>
            
            {/* Consultation Active en Box Banner */}
            <section className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden text-white">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8 pointer-events-none">
                <Stethoscope className="w-48 h-48 text-white" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-white/20 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Consultation Active en Box
                    </span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>

                  {activeConsultation ? (
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1">{activeConsultation.name}</h3>
                      <p className="text-emerald-100 text-xs sm:text-sm">
                        {activeConsultation.age} ans &bull; Sexe {activeConsultation.gender} &bull; Motif : <span className="font-semibold">{activeConsultation.reason}</span>
                      </p>

                      {/* Vitals Snapshot */}
                      {activeConsultation.vitals && (
                        <div className="flex flex-wrap gap-2 mt-2.5 pt-2 border-t border-white/20 text-xs">
                          <span className="bg-white/15 px-2.5 py-1 rounded-lg">
                            Tension: <strong>{activeConsultation.vitals.bp}</strong>
                          </span>
                          <span className="bg-white/15 px-2.5 py-1 rounded-lg">
                            Temp: <strong>{activeConsultation.vitals.temp}°C</strong>
                          </span>
                          <span className="bg-white/15 px-2.5 py-1 rounded-lg">
                            SpO2: <strong>{activeConsultation.vitals.spo2}%</strong>
                          </span>
                          <span className="bg-white/15 px-2.5 py-1 rounded-lg">
                            Pouls: <strong>{activeConsultation.vitals.pulse} bpm</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mt-1">Aucun patient actuellement en box</h3>
                      <p className="text-emerald-100 text-xs">
                        Admettez un patient dans la file d'attente pour ouvrir immédiatement son dossier médical.
                      </p>
                    </div>
                  )}
                </div>

                {activeConsultation && (
                  <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0">
                    <Link
                      href={`/doctor/consultation?id=${activeConsultation.id}&name=${encodeURIComponent(activeConsultation.name)}&age=${activeConsultation.age}&gender=${activeConsultation.gender}&reason=${encodeURIComponent(activeConsultation.reason)}`}
                      className="flex-1 md:flex-initial h-10 px-4 bg-white hover:bg-slate-50 text-emerald-900 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>Ouvrir Fiche Clinique</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleCompletePatient(activeConsultation.id)}
                      className="h-10 px-3.5 bg-emerald-950/60 hover:bg-emerald-950 text-white border border-emerald-400/40 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Terminer</span>
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Waiting Queue Interactive Board */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
              
              {/* Header with Search + Filter Chips */}
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                      File d'Attente Médicale du Jour
                    </h3>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
                      Sync Temps Réel
                    </span>
                  </div>

                  {/* Local Queue Search */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filtrer patient, motif..."
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 transition-colors"
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
                </div>

                {/* Priority Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                  <span className="text-[11px] text-slate-400 font-bold mr-1 flex items-center gap-1 shrink-0">
                    <Filter className="w-3 h-3" /> Tri :
                  </span>
                  {[
                    { key: 'all', label: `Tous (${queue.length})` },
                    { key: 'critical', label: `Urgences (${criticalCases})` },
                    { key: 4, label: 'Vital (P4)' },
                    { key: 3, label: 'Grave (P3)' },
                    { key: 2, label: 'Modéré (P2)' },
                    { key: 1, label: 'Routine (P1)' }
                  ].map((filter) => {
                    const isSelected = priorityFilter === filter.key;
                    return (
                      <button
                        key={filter.label}
                        onClick={() => setPriorityFilter(filter.key as any)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Patient Cards List */}
              <div className="divide-y divide-slate-100">
                <AnimatePresence initial={false}>
                  {filteredQueue.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs sm:text-sm font-medium">
                      Aucun patient ne correspond à ces critères dans la file d'attente.
                    </div>
                  ) : (
                    filteredQueue.map((p) => {
                      const priority = getPriorityInfo(p.priority);
                      const isCalling = p.status === 'calling';
                      const isActive = p.status === 'active';

                      return (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors hover:bg-slate-50/80 ${
                            isActive ? 'bg-emerald-50/50 border-l-4 border-emerald-600' : ''
                          } ${isCalling ? 'bg-amber-50/40 border-l-4 border-amber-500' : ''}`}
                        >
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs text-slate-400 font-bold">{p.id}</span>
                              <h4 className="font-bold text-sm text-slate-900">{p.name}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] border flex items-center gap-1 ${priority.badge}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                                {priority.text}
                              </span>
                              {isCalling && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                                  Appel en cours...
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-500 font-medium">
                              {p.age} ans &bull; Sexe {p.gender} &bull; Motif :{' '}
                              <strong className="text-slate-900">{p.reason}</strong>
                            </p>

                            {/* Pre-recorded Nurse Vitals Snapshot */}
                            {p.vitals && (
                              <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                                <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 flex items-center gap-1">
                                  <Droplet className="w-3 h-3 text-blue-500" />
                                  TA : <strong>{p.vitals.bp}</strong>
                                </span>
                                <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 flex items-center gap-1">
                                  <Thermometer className="w-3 h-3 text-orange-500" />
                                  Temp : <strong className={p.vitals.temp >= 38.5 ? 'text-rose-600 font-extrabold' : ''}>{p.vitals.temp}°C</strong>
                                </span>
                                <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 flex items-center gap-1">
                                  <HeartPulse className="w-3 h-3 text-rose-500" />
                                  SpO2 : <strong className={p.vitals.spo2 <= 92 ? 'text-rose-600 font-extrabold' : ''}>{p.vitals.spo2}%</strong>
                                </span>
                                <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-1">
                                  <Clock className="w-3 h-3" /> Arrivé à {p.checkInTime}
                                </span>
                              </div>
                            )}

                            {p.notes && (
                              <p className="text-[11px] text-slate-400 italic">
                                Note accueil : {p.notes}
                              </p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-1 sm:pt-0">
                            {p.status === 'waiting' && (
                              <button
                                onClick={() => handleCallPatient(p.id)}
                                className="h-9 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1.5 border border-amber-200 transition-all cursor-pointer"
                                title="Appeler le patient au micro vocal"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Appeler</span>
                              </button>
                            )}
                            
                            {(p.status === 'waiting' || p.status === 'calling') && (
                              <button
                                onClick={() => handleAdmitPatient(p.id)}
                                className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                              >
                                <Play className="w-3.5 h-3.5" />
                                <span>Admettre</span>
                              </button>
                            )}

                            {p.status === 'active' && (
                              <button
                                onClick={() => handleCompletePatient(p.id)}
                                className="h-9 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Terminer</span>
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Quick Portals Tiles (PACS, Telemedicine, Waiting room) */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <Link href="/doctor/imaging" className="group p-4 bg-white border border-slate-200/90 hover:border-purple-300 rounded-2xl flex flex-col justify-between gap-3 shadow-xs hover:shadow-md transition-all">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Imagerie & PACS</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Visionneuse DICOM et IA Vision pour scanner et radios.</p>
                </div>
                <span className="text-xs text-purple-700 font-bold inline-flex items-center gap-1">
                  Accéder PACS <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link href="/doctor/telemedicine" className="group p-4 bg-white border border-slate-200/90 hover:border-sky-300 rounded-2xl flex flex-col justify-between gap-3 shadow-xs hover:shadow-md transition-all">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Video className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Téléconsultations</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Salon vidéo RTC haute sécurité avec transcription IA.</p>
                </div>
                <span className="text-xs text-sky-700 font-bold inline-flex items-center gap-1">
                  Lancer Visio <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              <Link href="/reception/waiting-room" className="group p-4 bg-white border border-slate-200/90 hover:border-emerald-300 rounded-2xl flex flex-col justify-between gap-3 shadow-xs hover:shadow-md transition-all">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Salle d'Attente Générale</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Vue d'ensemble des flux à la réception centrale.</p>
                </div>
                <span className="text-xs text-emerald-700 font-bold inline-flex items-center gap-1">
                  Vue Globale <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </section>

          </div>

          {/* ── Right Column: AI Co-Pilot Clinical Assistant (4 cols) ──── */}
          <div className={`lg:col-span-5 xl:col-span-4 ${activeTabMobile === 'queue' ? 'hidden lg:block' : 'block'}`}>
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 flex flex-col h-[600px] sm:h-[660px] shadow-sm">
              
              {/* Co-pilot Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                    <Brain className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                      Co-Pilote Médical IA
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Moteur Gemini Clinique</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                  DÉCISIONNEL
                </span>
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="mb-3">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Suggestions Rapides</p>
                <div className="flex flex-wrap gap-1.5">
                  {aiQuickPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendChatMessage(p)}
                      className="text-[10px] font-semibold px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-slate-900 text-white rounded-br-none' 
                        : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-none p-3 flex items-center gap-2 text-xs text-slate-500">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      Analyse des recommandations médicales...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendChatMessage(); }} 
                className="mt-3 pt-3 border-t border-slate-100 flex gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Posez une question clinique ou protocole..."
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !chatInput.trim()}
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              <p className="text-[10px] text-slate-400 mt-2 text-center">
                * Outil d'aide à la décision médicale &bull; La décision thérapeutique incombe au praticien.
              </p>
            </section>
          </div>

        </div>

      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 py-3 sm:py-4 px-4 text-center text-[11px] text-slate-400">
        &copy; {new Date().getFullYear()} Health AI &bull; Espace Médical Hospitalier & Dossier Clinique Connecté.
      </footer>
    </div>
  );
}
