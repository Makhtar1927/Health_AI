'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Users, 
  Clock, 
  HeartPulse, 
  Plus, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Thermometer,
  Eye,
  Heart,
  Droplet,
  Check,
  ClipboardCheck,
  LogOut,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface CarePatient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  room: string;
  reason: string;
  status: 'pending' | 'vitals_done' | 'cared';
  vitals?: {
    temp: number;
    pulse: number;
    bp: string;
    spo2: number;
  };
}

interface MedicationTask {
  id: string;
  patientName: string;
  medication: string;
  dosage: string;
  time: string;
  status: 'pending' | 'done';
}

export default function NurseDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout, initialize } = useAuthStore();

  const [patients, setPatients] = useState<CarePatient[]>([
    { id: "N-201", name: "Aminata Diallo", age: 34, gender: "F", room: "Chambre 104", reason: "Suivi post-césarienne", status: "pending" },
    { id: "N-202", name: "Ibrahima Ndiaye", age: 56, gender: "M", room: "Chambre 108", reason: "Pneumonie communautaire", status: "pending" },
    { id: "N-203", name: "Sokhna Fall", age: 72, gender: "F", room: "Chambre 112", reason: "Insuffisance cardiaque", status: "vitals_done", vitals: { temp: 37.8, pulse: 92, bp: "14/9", spo2: 94 } },
    { id: "N-204", name: "Modou Gueye", age: 45, gender: "M", room: "Urgences - Box 2", reason: "Suspicion paludisme", status: "pending" }
  ]);

  const [medsTasks, setMedsTasks] = useState<MedicationTask[]>([
    { id: "M-1", patientName: "Aminata Diallo", medication: "Paracétamol IV", dosage: "1g", time: "14:00", status: "pending" },
    { id: "M-2", patientName: "Ibrahima Ndiaye", medication: "Amoxicilline", dosage: "1g", time: "14:15", status: "pending" },
    { id: "M-3", patientName: "Sokhna Fall", medication: "Furosémide (Lasilix)", dosage: "40mg", time: "14:30", status: "done" },
    { id: "M-4", patientName: "Modou Gueye", medication: "Artésunate", dosage: "120mg", time: "15:00", status: "pending" }
  ]);

  // Modal State for vital signs
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [temp, setTemp] = useState('');
  const [pulse, setPulse] = useState('');
  const [bp, setBp] = useState('');
  const [spo2, setSpo2] = useState('');
  
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    // If not authenticated (mock or real), we can let them browse for preview but redirecting is cleaner
    // For seamless presentation, if there is no user in store, we use a beautiful default mock nurse
  }, [isAuthenticated]);

  const activeUser = user || {
    name: "Maimouna Diallo",
    email: "maimouna.diallo@sunusante.sn",
    role: "nurse",
    details: { department: "Urgences & Soins Intensifs", hospital: "Hôpital Principal de Dakar" }
  };

  const handleLogoutClick = () => {
    logout();
    router.push('/nurse/login');
  };

  // Vitals Save
  const handleOpenVitalsModal = (id: string) => {
    const p = patients.find(pat => pat.id === id);
    if (p) {
      setSelectedPatientId(id);
      setTemp(p.vitals?.temp.toString() || '37.0');
      setPulse(p.vitals?.pulse.toString() || '75');
      setBp(p.vitals?.bp || '12/8');
      setSpo2(p.vitals?.spo2.toString() || '98');
    }
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    setPatients(prev => prev.map(p => {
      if (p.id === selectedPatientId) {
        return {
          ...p,
          status: 'vitals_done',
          vitals: {
            temp: parseFloat(temp),
            pulse: parseInt(pulse),
            bp: bp,
            spo2: parseInt(spo2)
          }
        };
      }
      return p;
    }));

    // Trigger Toast
    const pName = patients.find(p => p.id === selectedPatientId)?.name;
    setToastMsg(`Constantes enregistrées avec succès pour ${pName}.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setSelectedPatientId(null);
  };

  // Administer meds
  const handleAdministerMed = (id: string) => {
    setMedsTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'done' } : t));
    
    const task = medsTasks.find(t => t.id === id);
    setToastMsg(`Administration de ${task?.medication} enregistrée pour ${task?.patientName}.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Stats
  const pendingVitalsCount = patients.filter(p => p.status === 'pending').length;
  const criticalVitalsCount = patients.filter(p => p.vitals && (p.vitals.temp >= 38.5 || p.vitals.spo2 <= 92)).length;
  const totalMedsAdministered = medsTasks.filter(t => t.status === 'done').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-950 to-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
            <Activity className="h-5.5 w-5.5" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight">Espace Infirmier & Soins</h1>
            <p className="text-[9px] text-rose-400 font-semibold uppercase tracking-wider">Sunu Santé Clinique</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
            Inf. {activeUser.name}
          </span>
          <button 
            onClick={handleLogoutClick}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent border-0"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Quitter</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Patients Queue & Vital Signs) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Stats Grid */}
          <section className="grid grid-cols-3 gap-4">
            
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Constantes en attente</h3>
                <p className="text-2xl font-black">{pendingVitalsCount}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <HeartPulse className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Alertes Critiques</h3>
                <p className="text-2xl font-black text-rose-400">{criticalVitalsCount}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Meds administrés</h3>
                <p className="text-2xl font-black text-emerald-400">{totalMedsAdministered}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ClipboardCheck className="h-5 w-5" />
              </div>
            </div>

          </section>

          {/* Active Care Banner */}
          <section className="bg-gradient-to-r from-rose-600 to-red-700 rounded-3xl p-6 shadow-xl relative overflow-hidden text-white">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
              <Activity className="h-48 w-48" />
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[9px] bg-white/20 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Service affecté : {activeUser.details?.department || "Urgences Générales"}
                </span>
                <h2 className="text-xl font-black mt-3">Console Clinique Ambulatoire</h2>
                <p className="text-rose-100 text-xs mt-1">Saisie des constantes médicales en temps réel et validation des soins prescrits par les médecins.</p>
              </div>
              
              <div className="bg-white/10 border border-white/20 px-4 py-3 rounded-2xl flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-[11px] font-bold">Liaison Médecin Active</span>
              </div>
            </div>
          </section>

          {/* Patients Care Queue */}
          <section className="bg-slate-950/40 rounded-3xl border border-slate-800/80 overflow-hidden shadow-glass backdrop-blur-glass">
            
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight">Fiches de Soins Actives (File d'Attente)</h3>
              <span className="text-[9px] text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Soins en cours</span>
            </div>

            <div className="divide-y divide-slate-900">
              {patients.map(p => (
                <div key={p.id} className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/5 transition-colors">
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-slate-500 font-bold">{p.id}</span>
                      <h4 className="font-extrabold text-slate-200">{p.name}</h4>
                      <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md font-bold">{p.room}</span>
                    </div>
                    
                    <p className="text-xs text-slate-400 font-semibold">
                      {p.age} ans &bull; {p.gender} &bull; Motif : <span className="text-slate-300 font-normal">{p.reason}</span>
                    </p>

                    {/* Vitals summary if exists */}
                    {p.vitals ? (
                      <div className="flex flex-wrap gap-3 mt-3 pt-2 border-t border-slate-900">
                        <span className="text-[10px] bg-slate-900 px-2 py-1 rounded-md text-slate-300 inline-flex items-center gap-1">
                          <Thermometer className="h-3.5 w-3.5 text-orange-400" />
                          Temp: <strong className={p.vitals.temp >= 38.5 ? "text-red-400" : "text-slate-200"}>{p.vitals.temp}°C</strong>
                        </span>
                        <span className="text-[10px] bg-slate-900 px-2 py-1 rounded-md text-slate-300 inline-flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5 text-rose-400" />
                          Pouls: <strong className="text-slate-200">{p.vitals.pulse} bpm</strong>
                        </span>
                        <span className="text-[10px] bg-slate-900 px-2 py-1 rounded-md text-slate-300 inline-flex items-center gap-1">
                          <Droplet className="h-3.5 w-3.5 text-blue-400" />
                          Tension: <strong className="text-slate-200">{p.vitals.bp}</strong>
                        </span>
                        <span className="text-[10px] bg-slate-900 px-2 py-1 rounded-md text-slate-300 inline-flex items-center gap-1">
                          <Activity className="h-3.5 w-3.5 text-teal-400" />
                          SpO2: <strong className={p.vitals.spo2 <= 92 ? "text-red-400" : "text-slate-200"}>{p.vitals.spo2}%</strong>
                        </span>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-500 italic mt-1">⚠️ Aucune constante enregistrée pour ce tour de soins.</p>
                    )}

                  </div>

                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleOpenVitalsModal(p.id)}
                      className="h-9 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-rose-500/20 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Saisir Constantes
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </section>

        </div>

        {/* Right Column (Medication task planner & Alerts) */}
        <div className="space-y-6">
          
          {/* Medication Admin Schedule */}
          <section className="bg-slate-950/40 rounded-3xl border border-slate-800/80 p-6 flex flex-col shadow-glass backdrop-blur-glass">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-200">Administration Médicaments</h3>
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Planning de la tournée</p>
                </div>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/10 font-bold">14h00 - 16h00</span>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {medsTasks.map(t => (
                <div 
                  key={t.id} 
                  className={`p-4 rounded-2xl border text-xs flex justify-between items-center transition-colors ${
                    t.status === 'done' 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-400' 
                      : 'bg-slate-900 border-slate-800 hover:border-rose-500/20'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-300">{t.patientName}</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-slate-950 text-slate-400 rounded-md font-mono">{t.time}</span>
                    </div>
                    <p className={t.status === 'done' ? "line-through text-slate-500" : "font-extrabold text-rose-400"}>
                      {t.medication} - <span className="font-semibold text-slate-300">{t.dosage}</span>
                    </p>
                  </div>

                  {t.status === 'pending' ? (
                    <button
                      onClick={() => handleAdministerMed(t.id)}
                      className="h-8 w-8 rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center cursor-pointer transition-all shadow-md active:scale-90"
                    >
                      <Check className="h-4.5 w-4.5" />
                    </button>
                  ) : (
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/25">
                      <CheckCircle className="h-4.5 w-4.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>

          </section>

          {/* Clinical Alert Log */}
          <section className="bg-slate-950/40 rounded-3xl border border-slate-800/80 p-6 shadow-glass backdrop-blur-glass">
            
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-4">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center animate-pulse">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-200">Alertes Cliniques Constantes</h3>
                <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Intelligence d'Alerte IA</p>
              </div>
            </div>

            <div className="space-y-4">
              
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-red-400">Température Élevée</span>
                  <span className="text-[8px] bg-red-500/20 text-red-300 font-mono px-1 rounded">Ch. 112</span>
                </div>
                <p className="text-slate-300">Patient <strong>Sokhna Fall</strong> présente 37.8°C avec diagnostic d'insuffisance cardiaque. Surveillance requise.</p>
              </div>

              <div className="p-3.5 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-orange-400">Hypoxie Légère (SpO2 94%)</span>
                  <span className="text-[8px] bg-orange-500/20 text-orange-300 font-mono px-1 rounded">Ch. 112</span>
                </div>
                <p className="text-slate-300">Saturation de <strong>Sokhna Fall</strong> mesurée à 94% sous air ambiant. Évaluer l'administration d'O2 nasal.</p>
              </div>

            </div>

          </section>

        </div>

      </main>

      {/* Pop-up Modal for Saisie des Constantes */}
      <AnimatePresence>
        {selectedPatientId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-slate-100"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-5 w-5 text-rose-500 animate-pulse" />
                  <h3 className="font-extrabold text-base">Saisie des Constantes</h3>
                </div>
                <button 
                  onClick={() => setSelectedPatientId(null)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-semibold"
                >
                  Fermer
                </button>
              </div>

              <form onSubmit={handleSaveVitals} className="space-y-4">
                <p className="text-xs text-slate-400">
                  Enregistrer les paramètres vitaux actuels pour : <strong className="text-white">{patients.find(p => p.id === selectedPatientId)?.name}</strong>
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {/* Temp */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Température (°C)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      required
                      value={temp}
                      onChange={e => setTemp(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500" 
                    />
                  </div>
                  {/* Pulse */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Pouls (bpm)</label>
                    <input 
                      type="number" 
                      required
                      value={pulse}
                      onChange={e => setPulse(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500" 
                    />
                  </div>
                  {/* BP */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Tension (ex: 12/8)</label>
                    <input 
                      type="text" 
                      required
                      value={bp}
                      onChange={e => setBp(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500" 
                    />
                  </div>
                  {/* SpO2 */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Saturation SpO2 (%)</label>
                    <input 
                      type="number" 
                      required
                      value={spo2}
                      onChange={e => setSpo2(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500" 
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 font-bold text-xs text-white cursor-pointer shadow-lg shadow-rose-700/10 transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="h-4.5 w-4.5" />
                  Valider et Synchroniser
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
          {toastMsg}
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
        &copy; {new Date().getFullYear()} Sunu Santé - Module Dossier de Soins Infirmiers & Monitoring V1. Tous droits réservés.
      </footer>
    </div>
  );
}
