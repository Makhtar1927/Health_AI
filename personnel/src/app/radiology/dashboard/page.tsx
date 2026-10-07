'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ImageIcon, 
  Upload, 
  Clock, 
  Activity, 
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Search,
  CheckCircle,
  Play,
  Volume2,
  FileText,
  Brain,
  Video,
  Mic,
  Cpu,
  Layers,
  Database
} from 'lucide-react';
import Link from 'next/link';

interface RadiologyStudy {
  id: string;
  patientName: string;
  type: string; // Scanner, X-Ray, IRM
  priority: 'routine' | 'urgent' | 'vital';
  doctor: string;
  status: 'pending' | 'uploading' | 'completed';
  date: string;
}

export default function RadiologyDashboard() {
  const [studies, setStudies] = useState<RadiologyStudy[]>([
    { id: "RAD-201", patientName: "Cheikh Tidiane Diop", type: "Lung X-Ray (Face)", priority: "vital", doctor: "Dr. Aminata Touré", status: "pending", date: "14:10" },
    { id: "RAD-202", patientName: "Amadou Sall", type: "Knee X-Ray (Profil)", priority: "urgent", doctor: "Dr. Awa Ndiaye", status: "pending", date: "14:15" },
    { id: "RAD-203", patientName: "Aissatou Sow", type: "Abdominal CT Scan", priority: "routine", doctor: "Dr. Abdoulaye Diallo", status: "completed", date: "12:30" },
    { id: "RAD-204", patientName: "Mariama Diallo", type: "Brain MRI", priority: "urgent", doctor: "Dr. Aminata Touré", status: "completed", date: "11:15" }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  
  const totalPending = studies.filter(s => s.status === 'pending').length;
  const totalUrgent = studies.filter(s => s.priority === 'vital' || s.priority === 'urgent').length;
  const totalCompleted = studies.filter(s => s.status === 'completed').length;

  const filteredStudies = studies.filter(s => s.patientName.toLowerCase().includes(searchQuery.toLowerCase()));

  const getPriorityBadge = (priority: 'routine' | 'urgent' | 'vital') => {
    switch (priority) {
      case 'vital': return { text: "Urg. Vitale", class: "bg-red-500/10 text-red-400 border border-red-500/20" };
      case 'urgent': return { text: "Urgent", class: "bg-orange-500/10 text-orange-400 border border-orange-500/20" };
      default: return { text: "Routine", class: "bg-slate-800 text-slate-400 border border-slate-700" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
            <ImageIcon className="h-5.5 w-5.5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Espace Radiologie & PACS</h1>
            <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">Sunu Santé Clinique</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center gap-2">
            <Cpu className="h-4 w-4 text-purple-400" />
            PACS Server : Actif
          </span>
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
            Quitter le portail
          </Link>
        </div>
      </header>

      {/* Main Container Dashboard */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-8 py-8 space-y-8">
        
        {/* Statistical Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">Examens en Attente</h3>
              <p className="text-3xl font-black">{totalPending}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">Prioritaires / Urgents</h3>
              <p className="text-3xl font-black text-red-400">{totalUrgent}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">Examens Interprétés</h3>
              <p className="text-3xl font-black text-emerald-400">{totalCompleted}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">Serveur Cloud DICOM</h3>
              <p className="text-3xl font-black text-purple-400">99.8%</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Database className="h-5 w-5" />
            </div>
          </div>
        </section>

        {/* Real-time Worklist Operations & Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Worklist Studies (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-slate-950/40 rounded-3xl border border-slate-800/80 p-6 space-y-6 shadow-glass backdrop-blur-glass">
              <div className="flex justify-between items-center pb-4 border-b border-slate-900">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-400" />
                  <h3 className="font-extrabold text-base tracking-tight">Registre d'Examen d'Imagerie Clinique</h3>
                </div>
                <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Serveur PACS</span>
              </div>

              {/* Search filter bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Rechercher un patient ou un type d'examen..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 text-white transition-colors"
                />
              </div>

              {/* List table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="text-slate-500 text-xs uppercase font-bold border-b border-slate-900 bg-slate-900/40">
                      <th className="py-4 px-6">ID Étude</th>
                      <th className="py-4 px-6">Patient</th>
                      <th className="py-4 px-6">Examen requis</th>
                      <th className="py-4 px-6">Priorité</th>
                      <th className="py-4 px-6">Praticien</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    <AnimatePresence initial={false}>
                      {filteredStudies.map((s) => {
                        const priority = getPriorityBadge(s.priority);
                        return (
                          <motion.tr
                            key={s.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-slate-900/20 transition-colors group"
                          >
                            <td className="py-4 px-6 font-mono font-bold text-xs text-slate-500 group-hover:text-slate-400">
                              {s.id}
                            </td>
                            <td className="py-4 px-6 font-extrabold text-slate-200">
                              {s.patientName}
                            </td>
                            <td className="py-4 px-6 text-slate-400 text-xs font-semibold">
                              {s.type}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${priority.class}`}>
                                {priority.text}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-slate-400 text-xs font-semibold">
                              {s.doctor}
                            </td>
                            <td className="py-4 px-6 text-right">
                              {s.status === 'pending' ? (
                                <Link 
                                  href={`/radiology/viewer?id=${s.id}&patient=${encodeURIComponent(s.patientName)}&type=${encodeURIComponent(s.type)}&doctor=${encodeURIComponent(s.doctor)}`}
                                  className="h-8 px-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-extrabold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-purple-600/10"
                                >
                                  Interpréter (PACS)
                                  <ChevronRight className="h-4 w-4" />
                                </Link>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-extrabold">
                                  <CheckCircle className="h-4 w-4" />
                                  Compte-rendu signé
                                </span>
                              )}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

            </div>

          </div>

          {/* Quick Upload Panel & Resources (1 column) */}
          <div className="lg:col-span-1 space-y-6">
            
            <section className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800/80 shadow-glass backdrop-blur-glass flex flex-col justify-between min-h-[300px]">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-200">Téléversement DICOM & PACS</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Ajoutez de nouvelles images scanner ou radiographies. Notre processus de transfert inclut une anonymisation client automatique (Shift-Left).
                  </p>
                </div>
              </div>

              <Link 
                href="/radiology/upload" 
                className="w-full h-12 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/10 transition-colors mt-6"
              >
                <Upload className="h-4.5 w-4.5" />
                Téléverser Image Médicale
              </Link>
            </section>

            {/* Quality control guidelines */}
            <section className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800/80 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Activity className="h-4 w-4 text-purple-400" />
                Directives Qualité
              </div>
              <ul className="text-xs space-y-3 text-slate-400 leading-relaxed list-disc pl-4">
                <li>Tous les clichés DICOM doivent passer l'anonymiseur client avant transit.</li>
                <li>L'assistance IA Gemini est un support d'interprétation complémentaire facultatif.</li>
                <li>Signer vocalement ou manuellement chaque compte-rendu pour indexation DMP.</li>
              </ul>
            </section>

          </div>

        </section>

      </main>

      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
        &copy; {new Date().getFullYear()} Sunu Santé - Système de Traitement de Radiologie Connecté.
      </footer>
    </div>
  );
}
