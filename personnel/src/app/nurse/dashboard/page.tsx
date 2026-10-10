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
  Thermometer,
  Heart,
  Droplet,
  Check,
  ClipboardCheck,
  Sparkles,
  X
} from 'lucide-react';
import StaffHeader from '@/components/StaffHeader';

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
  const { user, isAuthenticated, initialize } = useAuthStore();

  const [patients, setPatients] = useState<CarePatient[]>([
    { id: "N-201", name: "Aminata Diallo", age: 34, gender: "F", room: "Chambre 104", reason: "Suivi post-césarienne", status: "pending" },
    { id: "N-202", name: "Ibrahima Ndiaye", age: 56, gender: "M", room: "Chambre 108", reason: "Pneumonie communautaire", status: "pending" },
    { id: "N-203", name: "Sokhna Fall", age: 72, gender: "F", room: "Chambre 112", reason: "Insuffisance cardiaque", status: "vitals_done", vitals: { temp: 37.8, pulse: 92, bp: "14/9", spo2: 94 } },
    { id: "N-204", name: "Modou Gueye", age: 45, gender: "M", room: "Urgences - Box 2", reason: "Suspicion paludisme", status: "pending" }
  ]);

  const [medsTasks, setMedsTasks] = useState<MedicationTask[]>([
    { id: "M-1", patientName: "Sokhna Fall", medication: "Furosémide 40mg", dosage: "1 ampoule IV lente", time: "14:00", status: "pending" },
    { id: "M-2", patientName: "Ibrahima Ndiaye", medication: "Ceftriaxone 1g", dosage: "Perfusion 30 min", time: "14:30", status: "pending" },
    { id: "M-3", patientName: "Aminata Diallo", medication: "Paracétamol Perf 1g", dosage: "Perfusion antalgique", time: "15:00", status: "done" }
  ]);

  const [activeTabMobile, setActiveTabMobile] = useState<'patients' | 'tasks'>('patients');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [temp, setTemp] = useState('37.0');
  const [pulse, setPulse] = useState('75');
  const [bp, setBp] = useState('12/8');
  const [spo2, setSpo2] = useState('98');

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    initialize();
  }, [initialize]);

  const activeUser = user || {
    name: "Fatou Sow",
    email: "infirmiere@healthai.sn",
    role: "nurse",
    details: { department: "Soins Intensifs & Urgences" }
  };

  const handleOpenVitalsModal = (id: string) => {
    setSelectedPatientId(id);
    const p = patients.find(item => item.id === id);
    if (p?.vitals) {
      setTemp(p.vitals.temp.toString());
      setPulse(p.vitals.pulse.toString());
      setBp(p.vitals.bp);
      setSpo2(p.vitals.spo2.toString());
    } else {
      setTemp('37.2');
      setPulse('78');
      setBp('12/8');
      setSpo2('98');
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

    const pName = patients.find(p => p.id === selectedPatientId)?.name;
    setToastMsg(`Constantes enregistrées avec succès pour ${pName}.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setSelectedPatientId(null);
  };

  const handleAdministerMed = (id: string) => {
    setMedsTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'done' } : t));
    const task = medsTasks.find(t => t.id === id);
    setToastMsg(`Administration de ${task?.medication} enregistrée pour ${task?.patientName}.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const pendingVitalsCount = patients.filter(p => p.status === 'pending').length;
  const criticalVitalsCount = patients.filter(p => p.vitals && (p.vitals.temp >= 38.5 || p.vitals.spo2 <= 92)).length;
  const totalMedsAdministered = medsTasks.filter(t => t.status === 'done').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      
      {/* Shared Responsive Header */}
      <StaffHeader
        title="Espace Infirmier & Soins"
        subtitle="Health AI Clinique"
        roleBadge="Infirmier"
        badgeColor="bg-rose-50 text-rose-800 border-rose-200"
        icon={<Activity className="h-5 w-5 text-rose-600" />}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
        
        {/* Mobile Switch Tabs */}
        <div className="lg:hidden flex items-center bg-white p-1 rounded-2xl border border-slate-200 mb-5 shadow-sm">
          <button
            onClick={() => setActiveTabMobile('patients')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTabMobile === 'patients' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Patients & Constantes ({patients.length})
          </button>
          <button
            onClick={() => setActiveTabMobile('tasks')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTabMobile === 'tasks' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Tournée Médicaments ({medsTasks.length})
          </button>
        </div>

        {/* Quick Stats Grid */}
        <section className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-6">
          <div className="bg-white border border-slate-200 p-3.5 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">À relever</p>
              <p className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">{pendingVitalsCount}</p>
            </div>
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <HeartPulse className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 p-3.5 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">Alertes</p>
              <p className="text-xl sm:text-3xl font-extrabold text-rose-600 mt-0.5">{criticalVitalsCount}</p>
            </div>
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
              <AlertTriangle className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-3.5 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">Meds donnés</p>
              <p className="text-xl sm:text-3xl font-extrabold text-emerald-600 mt-0.5">{totalMedsAdministered}</p>
            </div>
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <ClipboardCheck className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
          </div>
        </section>

        {/* 2-Columns Grid on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Patients & Vitals */}
          <div className={`space-y-6 lg:col-span-7 xl:col-span-8 ${activeTabMobile === 'tasks' ? 'hidden lg:block' : 'block'}`}>
            
            {/* Service Banner */}
            <section className="bg-gradient-to-r from-rose-600 to-rose-700 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden text-white">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
                <Activity className="h-44 w-44 text-white" />
              </div>
              
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-[10px] bg-white/20 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Service : {activeUser.details?.department || "Urgences & Soins"}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black mt-2">Console Soins Ambulatoires</h2>
                  <p className="text-rose-100 text-xs mt-0.5 max-w-lg">
                    Saisie des constantes vitales en temps réel et validation des soins prescrits par les médecins.
                  </p>
                </div>
                
                <div className="bg-white/15 border border-white/20 px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
                  <span>Sync DMP Médecin Active</span>
                </div>
              </div>
            </section>

            {/* Patients List */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                  Patients Hospitalisés & Box de Consultation
                </h3>
                <span className="text-[10px] text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full uppercase">
                  Tour de soins
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {patients.map(p => (
                  <div key={p.id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-50/70 transition-colors">
                    
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-slate-400 font-bold">{p.id}</span>
                        <h4 className="font-bold text-sm text-slate-900">{p.name}</h4>
                        <span className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md font-bold">
                          {p.room}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-500 font-medium">
                        {p.age} ans &bull; {p.gender} &bull; Motif : <span className="text-slate-800 font-semibold">{p.reason}</span>
                      </p>

                      {/* Vitals Summary */}
                      {p.vitals ? (
                        <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-100">
                          <span className="text-[11px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 inline-flex items-center gap-1">
                            <Thermometer className="h-3 w-3 text-orange-500" />
                            Temp: <strong className={p.vitals.temp >= 38.5 ? "text-rose-600" : "text-slate-900"}>{p.vitals.temp}°C</strong>
                          </span>
                          <span className="text-[11px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 inline-flex items-center gap-1">
                            <Heart className="h-3 w-3 text-rose-500" />
                            Pouls: <strong className="text-slate-900">{p.vitals.pulse} bpm</strong>
                          </span>
                          <span className="text-[11px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 inline-flex items-center gap-1">
                            <Droplet className="h-3 w-3 text-blue-500" />
                            Tension: <strong className="text-slate-900">{p.vitals.bp}</strong>
                          </span>
                          <span className="text-[11px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 inline-flex items-center gap-1">
                            <Activity className="h-3 w-3 text-emerald-500" />
                            SpO2: <strong className={p.vitals.spo2 <= 92 ? "text-rose-600" : "text-slate-900"}>{p.vitals.spo2}%</strong>
                          </span>
                        </div>
                      ) : (
                        <p className="text-[11px] text-amber-600 font-medium italic mt-1">
                          ⚠️ Constantes non encore saisies pour ce tour.
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end shrink-0 pt-1 sm:pt-0">
                      <button
                        onClick={() => handleOpenVitalsModal(p.id)}
                        className="h-8 sm:h-9 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 font-bold text-xs flex items-center gap-1.5 border border-rose-200 transition-all cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Saisir Constantes</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column: Medications Schedule & Alerts */}
          <div className={`space-y-6 lg:col-span-5 xl:col-span-4 ${activeTabMobile === 'patients' ? 'hidden lg:block' : 'block'}`}>
            
            {/* Medications Schedule */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">Administration Médicaments</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Planning de la tournée</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                  14h - 16h
                </span>
              </div>

              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {medsTasks.map(t => (
                  <div 
                    key={t.id} 
                    className={`p-3.5 rounded-xl border text-xs flex justify-between items-center transition-colors ${
                      t.status === 'done' 
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-500' 
                        : 'bg-slate-50 border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 truncate">{t.patientName}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-white border border-slate-200 text-slate-500 rounded font-mono shrink-0">{t.time}</span>
                      </div>
                      <p className={t.status === 'done' ? "line-through text-slate-400 text-xs" : "font-bold text-rose-700 text-xs"}>
                        {t.medication} - <span className="font-normal text-slate-600">{t.dosage}</span>
                      </p>
                    </div>

                    {t.status === 'pending' ? (
                      <button
                        onClick={() => handleAdministerMed(t.id)}
                        title="Valider l'administration"
                        className="h-8 w-8 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center cursor-pointer shadow-sm transition-all shrink-0"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    ) : (
                      <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Clinical Alert Log */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
                <div className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">Alertes Cliniques Constantes</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Surveillance IA Health AI</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-rose-800">Température Élevée</span>
                    <span className="text-[10px] bg-white border border-rose-200 text-rose-700 font-mono px-1 rounded">Ch. 112</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Patient <strong>Sokhna Fall</strong> présente 37.8°C avec diagnostic d'insuffisance cardiaque. Surveillance requise.
                  </p>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-800">Hypoxie Légère (SpO2 94%)</span>
                    <span className="text-[10px] bg-white border border-amber-200 text-amber-700 font-mono px-1 rounded">Ch. 112</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Saturation de <strong>Sokhna Fall</strong> mesurée à 94% sous air ambiant. Évaluer l'administration d'O2 nasal.
                  </p>
                </div>
              </div>
            </section>

          </div>

        </div>

      </main>

      {/* Pop-up Modal for Saisie des Constantes */}
      <AnimatePresence>
        {selectedPatientId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-slate-900"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-5 w-5 text-rose-600" />
                  <h3 className="font-extrabold text-base">Saisie des Constantes</h3>
                </div>
                <button 
                  onClick={() => setSelectedPatientId(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVitals} className="space-y-4">
                <p className="text-xs text-slate-500">
                  Enregistrer les paramètres vitaux actuels pour : <strong className="text-slate-900">{patients.find(p => p.id === selectedPatientId)?.name}</strong>
                </p>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Température (°C)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      required
                      value={temp}
                      onChange={e => setTemp(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-rose-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Pouls (bpm)</label>
                    <input 
                      type="number" 
                      required
                      value={pulse}
                      onChange={e => setPulse(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-rose-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Tension (ex: 12/8)</label>
                    <input 
                      type="text" 
                      required
                      value={bp}
                      onChange={e => setBp(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-rose-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Saturation SpO2 (%)</label>
                    <input 
                      type="number" 
                      required
                      value={spo2}
                      onChange={e => setSpo2(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-rose-500" 
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 font-bold text-xs text-white cursor-pointer shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Valider et Synchroniser avec le DMP</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs">
          <Sparkles className="h-4 w-4 text-white animate-pulse" />
          {toastMsg}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 sm:py-4 px-4 text-center text-[11px] text-slate-400">
        &copy; {new Date().getFullYear()} Health AI &bull; Dossier de Soins Infirmiers & Monitoring Clinique.
      </footer>
    </div>
  );
}
