'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  Users, 
  Clock, 
  Activity, 
  MessageSquare, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
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
  UserCheck,
  Send,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { getAuthHeader } from '../../../lib/authStore';

interface PatientQueue {
  id: string;
  name: string;
  gender: 'M' | 'F';
  age: number;
  checkInTime: string;
  priority: 1 | 2 | 3 | 4; // 1: Bénin, 2: Moyen, 3: Grave, 4: Vital
  status: 'waiting' | 'calling' | 'active';
  reason: string;
}

export default function DoctorDashboard() {
  const [queue, setQueue] = useState<PatientQueue[]>([
    { id: "P-101", name: "Amadou Sall", gender: "M", age: 42, checkInTime: "12:15", priority: 3, status: "waiting", reason: "Douleurs thoraciques aiguës" },
    { id: "P-103", name: "Cheikh Tidiane Diop", gender: "M", age: 67, checkInTime: "12:40", priority: 4, status: "calling", reason: "Détresse respiratoire sévère" },
    { id: "P-104", name: "Aissatou Sow", gender: "F", age: 5, checkInTime: "12:45", priority: 2, status: "waiting", reason: "Fièvre persistante & toux" },
    { id: "P-102", name: "Mariama Diallo", gender: "F", age: 29, checkInTime: "12:30", priority: 1, status: "active", reason: "Renouvellement ordonnance" }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Clinical Assistant State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: "Bonjour Docteur. Je suis votre Assistant Clinique intelligent Sunu Santé. Comment puis-je vous aider aujourd'hui ? Je peux résumer des protocoles cliniques ou vérifier des contre-indications." }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Stats computed
  const totalWaiting = queue.filter(p => p.status === 'waiting').length;
  const criticalCases = queue.filter(p => p.priority >= 3).length;
  const activeConsultation = queue.find(p => p.status === 'active');

  const filteredQueue = queue.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Call patient
  const handleCallPatient = (id: string) => {
    setQueue(prev => prev.map(p => p.id === id ? { ...p, status: 'calling' } : p));
    const patientName = queue.find(p => p.id === id)?.name;
    if (patientName && 'speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(`Le patient ${patientName} est attendu par le médecin.`);
      msg.lang = 'fr-FR';
      window.speechSynthesis.speak(msg);
    }
  };

  const handleAdmitPatient = (id: string) => {
    setQueue(prev => prev.map(p => {
      if (p.id === id) return { ...p, status: 'active' };
      if (p.status === 'active') return { ...p, status: 'waiting' }; // Met le précédent en attente
      return p;
    }));
  };

  const handleCompletePatient = (id: string) => {
    setQueue(prev => prev.filter(p => p.id !== id));
  };

  // AI Chat call to backend
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
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
        body: JSON.stringify({ query: userMsg, history: formattedHistory })
      });

      const data = await res.json();
      if (data.success) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Désolé, je n'ai pas pu contacter le serveur d'IA. Veuillez vérifier que l'API backend est lancée et configurée." }]);
      }
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Erreur de connexion avec l'IA. (Est-ce que le backend tourne sur localhost:5000 ?)" }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const getPriorityInfo = (priority: 1 | 2 | 3 | 4) => {
    switch (priority) {
      case 4: return { text: "Urg. Vitale", class: "bg-red-500/10 text-red-400 border border-red-500/20" };
      case 3: return { text: "Grave", class: "bg-orange-500/10 text-orange-400 border border-orange-500/20" };
      case 2: return { text: "Moyen", class: "bg-blue-500/10 text-blue-400 border border-blue-500/20" };
      default: return { text: "Routine", class: "bg-slate-800 text-slate-400 border border-slate-700" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <Stethoscope className="h-5.5 w-5.5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Espace Médecin</h1>
            <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Sunu Santé Clinique</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <span className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            Dr. Awa Ndiaye
          </span>
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
            Quitter le portail
          </Link>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left and Center Content (Queue & Active Patient) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Stats */}
          <section className="grid grid-cols-3 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">En attente</h3>
                <p className="text-3xl font-black">{totalWaiting}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
            </div>
            
            <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">Cas Graves</h3>
                <p className="text-3xl font-black text-red-400">{criticalCases}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">Consultations du jour</h3>
                <p className="text-3xl font-black text-emerald-400">12</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Activity className="h-5 w-5" />
              </div>
            </div>
          </section>

          {/* Active Consultation Workspace Banner */}
          <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12">
              <Stethoscope className="h-64 w-64" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="text-[10px] bg-white/20 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Consultation Clinique Active</span>
                {activeConsultation ? (
                  <div className="mt-4">
                    <h2 className="text-2xl font-black text-white">{activeConsultation.name}</h2>
                    <p className="text-emerald-100 text-sm mt-1">{activeConsultation.age} ans | {activeConsultation.gender} | Motif : {activeConsultation.reason}</p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <h2 className="text-xl font-bold text-white">Aucun patient admis</h2>
                    <p className="text-emerald-100 text-sm mt-1">Admettez un patient de la file d'attente pour démarrer la consultation.</p>
                  </div>
                )}
              </div>

              {activeConsultation && (
                <div className="flex gap-3">
                  <Link href={`/doctor/consultation?id=${activeConsultation.id}&name=${encodeURIComponent(activeConsultation.name)}&age=${activeConsultation.age}&gender=${activeConsultation.gender}&reason=${encodeURIComponent(activeConsultation.reason)}`} className="h-12 px-6 bg-white hover:bg-slate-100 text-emerald-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg">
                    Ouvrir Espace de Consultation
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button onClick={() => handleCompletePatient(activeConsultation.id)} className="h-12 px-5 bg-emerald-800/40 hover:bg-emerald-800 text-white border border-emerald-500/20 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
                    <CheckCircle className="h-4.5 w-4.5" />
                    Terminer
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Waiting Patients List */}
          <section className="bg-slate-950/40 rounded-3xl border border-slate-800/80 overflow-hidden shadow-glass backdrop-blur-glass">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h3 className="font-extrabold text-base tracking-tight">Salle d'Attente - File d'Attente Médecin</h3>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Sync Active</span>
            </div>

            <div className="p-4 border-b border-slate-800">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Rechercher un patient enregistré..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-white transition-colors"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-900">
              <AnimatePresence initial={false}>
                {filteredQueue.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 font-medium">
                    Aucun patient dans votre file d'attente.
                  </div>
                ) : (
                  filteredQueue.map((p) => {
                    const badge = getPriorityInfo(p.priority);
                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        className={`p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors hover:bg-white/5 ${p.status === 'active' ? 'bg-emerald-500/5' : ''}`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-slate-500 font-bold">{p.id}</span>
                            <h4 className="font-extrabold text-slate-200">{p.name}</h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${badge.class}`}>
                              {badge.text}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-semibold">{p.age} ans | {p.gender} &bull; Motif : <span className="text-slate-300 font-medium">{p.reason}</span></p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Arrivé à {p.checkInTime}
                          </p>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                          {p.status === 'waiting' && (
                            <button
                              onClick={() => handleCallPatient(p.id)}
                              className="h-9 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-amber-500/20 cursor-pointer"
                            >
                              <Volume2 className="h-4 w-4" />
                              Appeler
                            </button>
                          )}
                          
                          {(p.status === 'waiting' || p.status === 'calling') && (
                            <button
                              onClick={() => handleAdmitPatient(p.id)}
                              className="h-9 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Play className="h-4 w-4" />
                              Admettre
                            </button>
                          )}

                          {p.status === 'active' && (
                            <button
                              onClick={() => handleCompletePatient(p.id)}
                              className="h-9 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Terminer
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

          {/* Quick Navigation Panels */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link href="/doctor/imaging" className="group p-6 bg-slate-950/40 border border-slate-800 hover:border-purple-500/50 rounded-2xl flex flex-col justify-between gap-4 transition-all hover:-translate-y-1">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-200">Imagerie & Scanners</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Consulter les radiographies, scanner et l'aide au diagnostic d'IA Vision.</p>
              </div>
              <span className="text-xs text-purple-400 font-bold inline-flex items-center gap-1">
                Visualiser PACS <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <Link href="/doctor/telemedicine" className="group p-6 bg-slate-950/40 border border-slate-800 hover:border-sky-500/50 rounded-2xl flex flex-col justify-between gap-4 transition-all hover:-translate-y-1">
              <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-200">Téléconsultations</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Démarrer une visioconférence sécurisée avec vos patients à distance.</p>
              </div>
              <span className="text-xs text-sky-400 font-bold inline-flex items-center gap-1">
                Lancer le salon RTC <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <Link href="/reception/waiting-room" className="group p-6 bg-slate-950/40 border border-slate-800 hover:border-emerald-500/50 rounded-2xl flex flex-col justify-between gap-4 transition-all hover:-translate-y-1">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-200">Salle d'attente générale</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Visualiser l'ensemble de la file d'attente à la réception de l'hôpital.</p>
              </div>
              <span className="text-xs text-emerald-400 font-bold inline-flex items-center gap-1">
                Vue générale <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </section>

        </div>

        {/* Right Sidebar - Clinical AI Assistant */}
        <div className="space-y-8">
          
          <section className="bg-slate-950/40 rounded-3xl border border-slate-800/80 p-6 flex flex-col h-[650px] shadow-glass backdrop-blur-glass relative">
            
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Brain className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-200 flex items-center gap-1">
                    Assistant Clinique IA
                    <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
                  </h3>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Google Gemini active</p>
                </div>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/10 font-bold">AIDE DÉCISIONNELLE</span>
            </div>

            {/* Chat Messages Panel */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-slate-900/80 border border-slate-800 text-slate-300 rounded-bl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl rounded-bl-none p-4 flex items-center gap-2.5 text-xs text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                    L'IA formule son diagnostic médical...
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendChatMessage} className="mt-4 pt-3 border-t border-slate-800/80 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ex: Quel traitement pour paludisme grave ?"
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white transition-colors"
              />
              <button
                type="submit"
                disabled={isAiLoading}
                className="h-10 w-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-600/10 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <p className="text-[9px] text-slate-500 mt-3 text-center italic">
              * L'IA constitue un outil de suggestion d'aide à la décision. Le praticien reste entièrement responsable de ses prescriptions.
            </p>
          </section>

        </div>

      </main>

      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
        &copy; {new Date().getFullYear()} Sunu Santé - Dossier Clinique Connecté & Assistant IA. Tous droits réservés.
      </footer>
    </div>
  );
}
