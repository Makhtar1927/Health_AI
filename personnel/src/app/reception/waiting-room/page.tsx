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
  CheckCircle, 
  Volume2, 
  UserCheck, 
  ChevronRight,
  TrendingUp,
  X,
  Play
} from 'lucide-react';
import Link from 'next/link';

interface PatientQueue {
  id: string;
  name: string;
  gender: 'M' | 'F';
  age: number;
  checkInTime: string;
  priority: 1 | 2 | 3 | 4; // 1: Faible, 2: Moyen, 3: Grave, 4: Vital
  status: 'waiting' | 'calling' | 'active';
  doctor: string;
}

export default function ReceptionWaitingRoom() {
  const [queue, setQueue] = useState<PatientQueue[]>([
    { id: "P-101", name: "Amadou Sall", gender: "M", age: 42, checkInTime: "12:15", priority: 3, status: "waiting", doctor: "Dr. Awa Ndiaye" },
    { id: "P-102", name: "Mariama Diallo", gender: "F", age: 29, checkInTime: "12:30", priority: 1, status: "waiting", doctor: "Dr. Abdoulaye Diallo" },
    { id: "P-103", name: "Cheikh Tidiane Diop", gender: "M", age: 67, checkInTime: "12:40", priority: 4, status: "calling", doctor: "Dr. Awa Ndiaye" },
    { id: "P-104", name: "Aissatou Sow", gender: "F", age: 5, checkInTime: "12:45", priority: 2, status: "waiting", doctor: "Dr. Aminata Touré" },
    { id: "P-105", name: "Babacar Faye", gender: "M", age: 34, checkInTime: "12:55", priority: 2, status: "active", doctor: "Dr. Abdoulaye Diallo" }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState('');
  const [newPatientGender, setNewPatientGender] = useState<'M' | 'F'>('M');
  const [newPatientPriority, setNewPatientPriority] = useState<1 | 2 | 3 | 4>(2);
  const [newPatientDoctor, setNewPatientDoctor] = useState('Dr. Awa Ndiaye');

  // Actions dynamiques sur la file d'attente
  const handleCallPatient = (id: string) => {
    setQueue(prev => prev.map(p => p.id === id ? { ...p, status: 'calling' } : p));
    // Simuler l'annonce vocale en salle d'attente
    const patientName = queue.find(p => p.id === id)?.name;
    if (patientName && 'speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(`Le patient ${patientName} est attendu en consultation.`);
      msg.lang = 'fr-FR';
      window.speechSynthesis.speak(msg);
    }
  };

  const handleAdmitPatient = (id: string) => {
    setQueue(prev => prev.map(p => p.id === id ? { ...p, status: 'active' } : p));
  };

  const handleCompletePatient = (id: string) => {
    setQueue(prev => prev.filter(p => p.id !== id));
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName) return;

    const newPatient: PatientQueue = {
      id: `P-${Math.floor(100 + Math.random() * 900)}`,
      name: newPatientName,
      gender: newPatientGender,
      age: parseInt(newPatientAge) || 30,
      checkInTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      priority: newPatientPriority,
      status: 'waiting',
      doctor: newPatientDoctor
    };

    setQueue(prev => [newPatient, ...prev]);
    setIsNewPatientModalOpen(false);
    // Reset Form
    setNewPatientName('');
    setNewPatientAge('');
    setNewPatientPriority(2);
  };

  const getPriorityBadge = (priority: 1 | 2 | 3 | 4) => {
    switch (priority) {
      case 4: return { text: "Urg. Vitale", class: "bg-red-500/10 text-red-500 border border-red-500/20" };
      case 3: return { text: "Grave", class: "bg-orange-500/10 text-orange-500 border border-orange-500/20" };
      case 2: return { text: "Moyen", class: "bg-blue-500/10 text-blue-500 border border-blue-500/20" };
      default: return { text: "Bénin", class: "bg-slate-500/10 text-slate-400 border border-slate-500/10" };
    }
  };

  const filteredQueue = queue.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Statistiques calculées
  const totalWaiting = queue.filter(p => p.status === 'waiting').length;
  const totalCalling = queue.filter(p => p.status === 'calling').length;
  const totalActive = queue.filter(p => p.status === 'active').length;
  const criticalCases = queue.filter(p => p.priority >= 3).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      
      {/* Premium Desktop Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <Activity className="h-5.5 w-5.5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Espace Réception</h1>
            <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">Sunu Santé Clinique</p>
          </div>
        </div>
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-6">
          <span className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            Central Clinique Actif
          </span>
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
            Quitter le portail
          </Link>
        </div>
      </header>

      {/* Main Container Dashboard */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-8 py-8 space-y-8">
        
        {/* Top Statistical Grid Indicators */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">Salle d'Attente</h3>
              <p className="text-3xl font-black">{totalWaiting}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/10">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">En Appel</h3>
              <p className="text-3xl font-black text-amber-500">{totalCalling}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/10">
              <Volume2 className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">En Consultation</h3>
              <p className="text-3xl font-black text-emerald-500">{totalActive}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/10">
              <UserCheck className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">Cas prioritaires (Grave)</h3>
              <p className="text-3xl font-black text-red-500">{criticalCases}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/10">
              <AlertCircle className="h-6 w-6" />
            </div>
          </div>

        </section>

        {/* Search & Actions Bar */}
        <section className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
          
          {/* Search box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher un patient admis..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 text-white transition-colors"
            />
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex gap-4 w-full sm:w-auto">
            <button 
              onClick={() => setIsNewPatientModalOpen(true)}
              className="flex-1 sm:flex-none h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-500/10"
            >
              <UserPlus className="h-4.5 w-4.5" />
              Admettre un Patient
            </button>
          </div>

        </section>

        {/* Real-time Queue Patient List Container */}
        <section className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/80 backdrop-blur-md">
            <h3 className="font-extrabold text-base tracking-tight">Liste d'Attente Clinique en Direct</h3>
            <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Real-time sync</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="text-slate-500 text-xs uppercase font-bold border-b border-slate-900 bg-slate-900/40">
                  <th className="py-4 px-6">ID Patient</th>
                  <th className="py-4 px-6">Nom</th>
                  <th className="py-4 px-6">Âge / Sexe</th>
                  <th className="py-4 px-6">Enregistrement</th>
                  <th className="py-4 px-6">Gravité / Priorité</th>
                  <th className="py-4 px-6">Médecin Assigné</th>
                  <th className="py-4 px-6">Statut d'Attente</th>
                  <th className="py-4 px-6 text-right">Actions de Prise en Charge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60">
                <AnimatePresence initial={false}>
                  {filteredQueue.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                        Aucun patient enregistré en file d'attente pour le moment.
                      </td>
                    </tr>
                  ) : (
                    filteredQueue.map((p) => {
                      const badge = getPriorityBadge(p.priority);
                      return (
                        <motion.tr
                          key={p.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, x: -50 }}
                          className="hover:bg-slate-900/20 transition-colors group"
                        >
                          <td className="py-4 px-6 font-mono font-bold text-xs text-slate-500 group-hover:text-slate-400">
                            {p.id}
                          </td>
                          <td className="py-4 px-6 font-extrabold text-slate-200">
                            {p.name}
                          </td>
                          <td className="py-4 px-6 text-slate-400 text-xs font-semibold">
                            {p.age} ans | {p.gender}
                          </td>
                          <td className="py-4 px-6 text-slate-400 font-semibold text-xs flex items-center gap-1.5 mt-1">
                            <Clock className="h-3.5 w-3.5 text-slate-600" />
                            {p.checkInTime}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${badge.class}`}>
                              {badge.text}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-300 font-semibold text-xs">
                            {p.doctor}
                          </td>
                          <td className="py-4 px-6">
                            {p.status === 'active' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px] border border-emerald-500/20">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                En consultation
                              </span>
                            )}
                            {p.status === 'calling' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 font-bold text-[10px] border border-amber-500/20 animate-pulse">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                                Appel en cours
                              </span>
                            )}
                            {p.status === 'waiting' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-bold text-[10px] border border-slate-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                                En attente
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex gap-2 justify-end">
                              {p.status === 'waiting' && (
                                <button
                                  onClick={() => handleCallPatient(p.id)}
                                  className="h-9 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-amber-500/20 cursor-pointer"
                                >
                                  <Volume2 className="h-4 w-4" />
                                  Appeler
                                </button>
                              )}
                              {p.status === 'calling' && (
                                <button
                                  onClick={() => handleAdmitPatient(p.id)}
                                  className="h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
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
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* Modal: New Patient Admission Form */}
      <AnimatePresence>
        {isNewPatientModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Modal Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewPatientModalOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl z-10 text-left"
            >
              <button 
                onClick={() => setIsNewPatientModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-100">Enregistrer un Patient</h3>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Admission salle d'attente</p>
                </div>
              </div>

              <form onSubmit={handleAddPatient} className="space-y-4">
                
                {/* Input Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Nom Complet du Patient</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Babacar Diouf"
                    value={newPatientName}
                    onChange={e => setNewPatientName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Input Age */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400">Âge</label>
                    <input
                      type="number"
                      required
                      placeholder="Ex: 34"
                      value={newPatientAge}
                      onChange={e => setNewPatientAge(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white transition-colors"
                    />
                  </div>

                  {/* Input Gender */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400">Sexe</label>
                    <select
                      value={newPatientGender}
                      onChange={e => setNewPatientGender(e.target.value as 'M' | 'F')}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-300 transition-colors"
                    >
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                </div>

                {/* Priority Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Niveau de Priorité Médicale</label>
                  <select
                    value={newPatientPriority}
                    onChange={e => setNewPatientPriority(parseInt(e.target.value) as 1 | 2 | 3 | 4)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-300 transition-colors"
                  >
                    <option value={1}>1 - Bénin / Routine</option>
                    <option value={2}>2 - Moyen / Consultation standard</option>
                    <option value={3}>3 - Grave / Symptômes sévères</option>
                    <option value={4}>4 - Critique / Urgence Vitale</option>
                  </select>
                </div>

                {/* Doctor Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Médecin à Consulter</label>
                  <select
                    value={newPatientDoctor}
                    onChange={e => setNewPatientDoctor(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-300 transition-colors"
                  >
                    <option value="Dr. Awa Ndiaye">Dr. Awa Ndiaye (Cardiologie)</option>
                    <option value="Dr. Abdoulaye Diallo">Dr. Abdoulaye Diallo (Médecine Générale)</option>
                    <option value="Dr. Aminata Touré">Dr. Aminata Touré (Pneumologie)</option>
                  </select>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold transition-all uppercase tracking-wider cursor-pointer shadow-lg shadow-blue-500/10 mt-6"
                >
                  Admettre le patient
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
        &copy; {new Date().getFullYear()} Sunu Santé - Système de Salle d'Attente Temps Réel Dématérialisé.
      </footer>
    </div>
  );
}
