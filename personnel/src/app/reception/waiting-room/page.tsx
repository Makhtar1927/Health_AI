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
  UserCheck, 
  ChevronRight, 
  TrendingUp, 
  X, 
  Play,
  Stethoscope,
  Building2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import StaffHeader from '@/components/StaffHeader';

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
    { id: "P-101", name: "Amadou Sall", gender: "M", age: 42, checkInTime: "12:15", priority: 3, status: "waiting", doctor: "Dr. Oumy Aidara" },
    { id: "P-102", name: "Mariama Diallo", gender: "F", age: 29, checkInTime: "12:30", priority: 1, status: "waiting", doctor: "Dr. Abdoulaye Diallo" },
    { id: "P-103", name: "Cheikh Tidiane Diop", gender: "M", age: 67, checkInTime: "12:40", priority: 4, status: "calling", doctor: "Dr. Oumy Aidara" },
    { id: "P-104", name: "Aissatou Sow", gender: "F", age: 5, checkInTime: "12:45", priority: 2, status: "waiting", doctor: "Dr. Aminata Touré" },
    { id: "P-105", name: "Babacar Faye", gender: "M", age: 34, checkInTime: "12:55", priority: 2, status: "active", doctor: "Dr. Oumy Aidara" }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState('');
  const [newPatientGender, setNewPatientGender] = useState<'M' | 'F'>('M');
  const [newPatientPriority, setNewPatientPriority] = useState<1 | 2 | 3 | 4>(2);
  const [newPatientDoctor, setNewPatientDoctor] = useState('Dr. Oumy Aidara');

  const handleCallPatient = (id: string) => {
    setQueue(prev => prev.map(p => p.id === id ? { ...p, status: 'calling' } : p));
    const patientName = queue.find(p => p.id === id)?.name;
    if (patientName && typeof window !== 'undefined' && 'speechSynthesis' in window) {
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
    if (!newPatientName.trim()) return;

    const newPatient: PatientQueue = {
      id: `P-${Math.floor(100 + Math.random() * 900)}`,
      name: newPatientName.trim(),
      gender: newPatientGender,
      age: parseInt(newPatientAge) || 30,
      checkInTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      priority: newPatientPriority,
      status: 'waiting',
      doctor: newPatientDoctor
    };

    setQueue(prev => [newPatient, ...prev]);
    setIsNewPatientModalOpen(false);
    setNewPatientName('');
    setNewPatientAge('');
    setNewPatientPriority(2);
  };

  const getPriorityBadge = (priority: 1 | 2 | 3 | 4) => {
    switch (priority) {
      case 4: return { text: "Urg. Vitale", class: "bg-rose-100 text-rose-700 border-rose-200" };
      case 3: return { text: "Grave", class: "bg-amber-100 text-amber-800 border-amber-200" };
      case 2: return { text: "Moyen", class: "bg-blue-100 text-blue-700 border-blue-200" };
      default: return { text: "Bénin", class: "bg-slate-100 text-slate-600 border-slate-200" };
    }
  };

  const filteredQueue = queue.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalWaiting = queue.filter(p => p.status === 'waiting').length;
  const totalCalling = queue.filter(p => p.status === 'calling').length;
  const totalActive = queue.filter(p => p.status === 'active').length;
  const criticalCases = queue.filter(p => p.priority >= 3).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      
      {/* Header */}
      <StaffHeader
        title="Gestion File d'Attente Générale"
        subtitle="Accueil & Admissions Centrales"
        roleBadge="Réception"
        badgeColor="bg-blue-50 text-blue-700 border-blue-200"
        icon={<Users className="w-5 h-5" />}
      />

      {/* Main Container Dashboard */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-4 sm:px-6 py-6 space-y-6">
        
        {/* Top banner navigation between Reception and Doctor Box */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">File d'Attente Clinique en Direct</h2>
            <p className="text-xs text-slate-500">Supervision globale des flux d'admission de tous les box médicaux</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/doctor/waiting-room"
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold text-xs flex items-center gap-1.5 transition-all"
            >
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              Vue Box Médecin (Dr. Aidara)
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button 
              onClick={() => setIsNewPatientModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Admettre un Patient
            </button>
          </div>
        </div>

        {/* Top Statistical Grid Indicators */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Salle d'Attente</h3>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{totalWaiting}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">En Appel</h3>
              <p className="text-2xl font-black text-amber-600 mt-0.5">{totalCalling}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Volume2 className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">En Consultation</h3>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">{totalActive}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Prioritaires</h3>
              <p className="text-2xl font-black text-rose-600 mt-0.5">{criticalCases}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou identifiant patient..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-slate-800 transition-colors"
            />
          </div>
        </section>

        {/* Real-time Queue Patient List Container */}
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/60">
            <h3 className="font-extrabold text-sm text-slate-900">Patients enregistrés ({filteredQueue.length})</h3>
            <span className="text-[10px] text-blue-700 font-extrabold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Sync Hôpital Principal
            </span>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 uppercase font-extrabold border-b border-slate-100 bg-slate-50/50">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Âge / Sexe</th>
                  <th className="py-3 px-4">Arrivée</th>
                  <th className="py-3 px-4">Priorité</th>
                  <th className="py-3 px-4">Médecin</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQueue.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                      Aucun patient enregistré en file d'attente pour le moment.
                    </td>
                  </tr>
                ) : (
                  filteredQueue.map((p) => {
                    const badge = getPriorityBadge(p.priority);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{p.id}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{p.name}</td>
                        <td className="py-3.5 px-4 text-slate-600">{p.age} ans ({p.gender})</td>
                        <td className="py-3.5 px-4 text-slate-500">{p.checkInTime}</td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${badge.class}`}>
                            {badge.text}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">{p.doctor}</td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.status === 'calling' ? 'bg-amber-100 text-amber-800 animate-pulse font-extrabold' :
                            p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {p.status === 'calling' ? 'En Appel' : p.status === 'active' ? 'En consultation' : 'En attente'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          <button
                            onClick={() => handleCallPatient(p.id)}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold cursor-pointer"
                          >
                            Appeler
                          </button>
                          <button
                            onClick={() => handleAdmitPatient(p.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold cursor-pointer"
                          >
                            Admettre
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredQueue.map(p => {
              const badge = getPriorityBadge(p.priority);
              return (
                <div key={p.id} className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {p.id}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900">{p.name}</h4>
                    </div>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${badge.class}`}>
                      {badge.text}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{p.gender} · {p.age} ans · Arrivé à {p.checkInTime}</span>
                    <span className="font-semibold text-slate-700">{p.doctor}</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleCallPatient(p.id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold"
                    >
                      Appeler Micro
                    </button>
                    <button
                      onClick={() => handleAdmitPatient(p.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                    >
                      Admettre
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </section>

      </main>

      {/* Modal Nouveau Patient */}
      <AnimatePresence>
        {isNewPatientModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white border border-slate-200 p-6 rounded-3xl shadow-2xl z-10 text-left"
            >
              <button 
                onClick={() => setIsNewPatientModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Enregistrer une Admission</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Salle d'attente générale</p>
                </div>
              </div>

              <form onSubmit={handleAddPatient} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Nom complet du patient *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Babacar Diouf"
                    value={newPatientName}
                    onChange={e => setNewPatientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Âge</label>
                    <input
                      type="number"
                      required
                      placeholder="Ex: 34"
                      value={newPatientAge}
                      onChange={e => setNewPatientAge(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Sexe</label>
                    <select
                      value={newPatientGender}
                      onChange={e => setNewPatientGender(e.target.value as 'M' | 'F')}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                    >
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Niveau de Priorité Médicale</label>
                  <select
                    value={newPatientPriority}
                    onChange={e => setNewPatientPriority(parseInt(e.target.value) as 1 | 2 | 3 | 4)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  >
                    <option value={1}>1 - Bénin / Routine</option>
                    <option value={2}>2 - Moyen / Standard</option>
                    <option value={3}>3 - Grave / Urgent</option>
                    <option value={4}>4 - Critique / Urgence Vitale</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Médecin Assigné</label>
                  <select
                    value={newPatientDoctor}
                    onChange={e => setNewPatientDoctor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Dr. Oumy Aidara">Dr. Oumy Aidara (Box 4)</option>
                    <option value="Dr. Abdoulaye Diallo">Dr. Abdoulaye Diallo (Box 1)</option>
                    <option value="Dr. Aminata Touré">Dr. Aminata Touré (Box 2)</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewPatientModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black cursor-pointer shadow-sm"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="text-center text-xs text-slate-400 py-4 border-t border-slate-200">
        &copy; {new Date().getFullYear()} Health AI - Système de File d'Attente & Triage Central.
      </footer>
    </div>
  );
}
