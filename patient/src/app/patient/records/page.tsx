'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  Image as ImageIcon, 
  Activity, 
  Search, 
  Calendar,
  ExternalLink,
  ChevronDown,
  UserCheck,
  AlertTriangle,
  User
} from 'lucide-react';
import Link from 'next/link';

export default function PatientRecords() {
  const [activeTab, setActiveTab] = useState<'consultations' | 'imaging' | 'lab'>('consultations');

  const consultations = [
    {
      id: "C-1",
      date: "12 Mai 2026",
      doctor: "Dr. Abdoulaye Diallo",
      department: "Médecine Générale",
      diagnostic: "Hypertension artérielle légère",
      symptoms: "Céphalées matinales, fatigue légère",
      biometrics: { weight: "78 kg", pressure: "14/9", temp: "36.7°C" }
    },
    {
      id: "C-2",
      date: "04 Février 2026",
      doctor: "Dr. Aminata Touré",
      department: "Pneumologie",
      diagnostic: "Bronchite aiguë résolue",
      symptoms: "Toux sèche persistante, congestion nasale",
      biometrics: { weight: "79 kg", pressure: "12/7", temp: "38.2°C" }
    }
  ];

  const imagingExams = [
    {
      id: "IMG-901",
      date: "10 Mai 2026",
      type: "Radiographie Pulmonaire",
      doctor: "Dr. Jean-Luc Ndiaye (Radiologue)",
      findings: "Champs pulmonaires clairs. Absence de foyer d'opacité parenchymateuse. Silhouette cardiaque de taille normale.",
      status: "Validé",
      hasPathology: false,
      cloudinaryUrl: "https://res.cloudinary.com/dorfcwv6a/image/authenticated/s--signed--/sunu_sante/dicom/xray_chest_moussa.jpg"
    }
  ];

  const labReports = [
    {
      id: "LAB-802",
      date: "11 Mai 2026",
      title: "Hémogramme Complet & Glycémie",
      lab: "Laboratoire Central Sunu Santé",
      results: [
        { test: "Glycémie à jeun", value: "0.95 g/L", range: "0.70 - 1.10", status: "normal" },
        { test: "Hémoglobine", value: "14.5 g/dL", range: "13.0 - 17.0", status: "normal" },
        { test: "Cholestérol Total", value: "2.10 g/L", range: "< 2.00", status: "high" }
      ]
    }
  ];

  return (
    <div className="relative min-h-screen bg-transparent text-slate-800 dark:text-slate-100 flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-slate-200 dark:border-slate-800 md:max-w-none md:mx-0 md:shadow-none md:border-0 md:bg-transparent md:h-full md:min-h-0 md:justify-start md:items-stretch w-full">
      
      {/* Mobile Header Bar (Hidden on desktop) */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center gap-4 md:hidden w-full">
        <Link href="/patient/home" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <ArrowLeft className="h-4.5 w-4.5" />
        </Link>
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-800 dark:text-white">Dossier Médical</h1>
          <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider">Carnet de Santé Digital</p>
        </div>
      </header>

      {/* Main Container - Fully responsive grids */}
      <main className="flex-grow px-6 py-6 overflow-y-auto space-y-6 md:p-8 md:h-full md:overflow-y-auto w-full relative z-10">
        
        {/* Navigation Tabs - Apple-style Tactile sliding pill selector */}
        <div className="flex bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-md p-1 rounded-2xl gap-1 max-w-md w-full relative overflow-hidden border border-slate-300/20 dark:border-slate-800/40 shadow-inner">
          
          {/* Dynamic sliding highlight indicator box */}
          <div 
            className="absolute top-1 bottom-1 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200/10 dark:border-slate-750 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none"
            style={{
              left: activeTab === 'consultations' ? '4px' : activeTab === 'imaging' ? 'calc(33.33% + 2px)' : 'calc(66.66% + 2px)',
              width: 'calc(33.33% - 6px)'
            }}
          />

          <button 
            onClick={() => setActiveTab('consultations')}
            className={`relative z-10 flex-1 py-2.5 text-xs font-black rounded-xl transition-all duration-300 cursor-pointer ${
              activeTab === 'consultations' 
                ? 'text-cyan-600 dark:text-cyan-400 scale-102' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Consultations
          </button>
          
          <button 
            onClick={() => setActiveTab('imaging')}
            className={`relative z-10 flex-1 py-2.5 text-xs font-black rounded-xl transition-all duration-300 cursor-pointer ${
              activeTab === 'imaging' 
                ? 'text-cyan-600 dark:text-cyan-400 scale-102' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Radiologies
          </button>
          
          <button 
            onClick={() => setActiveTab('lab')}
            className={`relative z-10 flex-1 py-2.5 text-xs font-black rounded-xl transition-all duration-300 cursor-pointer ${
              activeTab === 'lab' 
                ? 'text-cyan-600 dark:text-cyan-400 scale-102' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Analyses
          </button>
        </div>

        {/* Dynamic content rendering based on selected Tab */}
        <div className="w-full relative z-10">
          
          {/* CONSULTATIONS TAB */}
          {activeTab === 'consultations' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              {consultations.map((c, index) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-3xl glass-premium p-5 border border-slate-200/40 dark:border-slate-800/80 shadow-sm space-y-4 hover:border-cyan-500/10 dark:hover:border-cyan-500/20 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-extrabold uppercase tracking-wider">{c.department}</span>
                      <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 mt-0.5">{c.doctor}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-bold">
                      <Calendar className="h-3.5 w-3.5 text-cyan-500" />
                      <span>{c.date}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100/50 dark:border-slate-800/60 pt-3 space-y-2.5 text-xs font-medium">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block font-bold uppercase text-[9px] tracking-wider">Symptômes rapportés</span>
                      <span className="text-slate-600 dark:text-slate-350 mt-1 block leading-relaxed">{c.symptoms}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block font-bold uppercase text-[9px] tracking-wider">Diagnostic final</span>
                      <span className="text-slate-700 dark:text-slate-200 mt-1 block font-black text-xs">{c.diagnostic}</span>
                    </div>
                  </div>

                  {/* Biometrics bar */}
                  <div className="grid grid-cols-3 gap-2 bg-white/40 dark:bg-slate-950/30 p-2.5 rounded-xl border border-slate-200/30 dark:border-slate-850/60 text-[10px] text-center text-slate-500 dark:text-slate-400 font-bold">
                    <div>
                      <span className="block text-slate-400 dark:text-slate-500 font-bold uppercase text-[8px] tracking-widest">Tension</span>
                      <span className="font-black text-slate-700 dark:text-slate-300 mt-1 block text-xs">{c.biometrics.pressure}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 dark:text-slate-500 font-bold uppercase text-[8px] tracking-widest">Poids</span>
                      <span className="font-black text-slate-700 dark:text-slate-300 mt-1 block text-xs">{c.biometrics.weight}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 dark:text-slate-500 font-bold uppercase text-[8px] tracking-widest">Temp.</span>
                      <span className="font-black text-slate-700 dark:text-slate-300 mt-1 block text-xs">{c.biometrics.temp}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* RADIOLOGIES TAB */}
          {activeTab === 'imaging' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              {imagingExams.map((img, index) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-3xl glass-premium p-5 border border-slate-200/40 dark:border-slate-800/80 shadow-sm space-y-4 hover:border-purple-500/10 dark:hover:border-purple-500/20 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold uppercase tracking-wider">Imagerie Médicale</span>
                      <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 mt-0.5">{img.type}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-bold">
                      <Calendar className="h-3.5 w-3.5 text-purple-500" />
                      <span>{img.date}</span>
                    </div>
                  </div>

                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5 font-bold">Prescrit par {img.doctor}</p>

                  <div className="border-t border-slate-100/50 dark:border-slate-800/60 pt-3 space-y-3 font-medium">
                    <div className="text-xs">
                      <span className="text-slate-400 dark:text-slate-500 block font-bold uppercase text-[9px] tracking-wider">Compte-rendu du Radiologue</span>
                      <span className="text-slate-600 dark:text-slate-350 mt-1 block leading-relaxed">{img.findings}</span>
                    </div>

                    {/* Radiologue validation badge */}
                    <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-2 rounded-xl text-xs font-extrabold border border-emerald-500/20 shadow-sm shadow-emerald-500/5 max-w-max">
                      <UserCheck className="h-4 w-4" />
                      <span>Cliché validé par le Radiologue Sénior</span>
                    </div>
                  </div>

                  {/* Secure View Image Button */}
                  <div className="pt-2">
                    <a 
                      href={img.cloudinaryUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-750 text-white dark:text-cyan-400 font-black text-xs flex items-center justify-center gap-2 transition-colors border border-slate-800 dark:border-slate-700 cursor-pointer shadow-md shadow-indigo-950/10"
                    >
                      <ImageIcon className="h-4.5 w-4.5" />
                      Visualiser le cliché (Lien Signé)
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ANALYSES TAB */}
          {activeTab === 'lab' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              {labReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-3xl glass-premium p-5 border border-slate-200/40 dark:border-slate-800/80 shadow-sm space-y-4 hover:border-amber-500/10 dark:hover:border-amber-500/20 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold uppercase tracking-wider">Laboratoire</span>
                      <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 mt-0.5">{report.title}</h3>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">{report.lab}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-bold">
                      <Calendar className="h-3.5 w-3.5 text-amber-500" />
                      <span>{report.date}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100/50 dark:border-slate-800/60 pt-3 space-y-2.5">
                    <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase text-[9px] tracking-wider block mb-1">Détails des résultats :</span>
                    
                    <div className="space-y-2.5">
                      {report.results.map((res, rIndex) => (
                        <div 
                          key={rIndex}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-slate-950/30 border border-slate-200/30 dark:border-slate-850/60 text-xs font-bold shadow-sm"
                        >
                          <div>
                            <span className="font-extrabold text-slate-700 dark:text-slate-200 block text-xs">{res.test}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">Norme: {res.range}</span>
                          </div>
                          <div className="text-right">
                            <span className={`font-black text-sm block ${res.status === 'high' ? 'text-red-500' : 'text-emerald-500'}`}>
                              {res.value}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase inline-block mt-1 border ${
                              res.status === 'high' 
                                ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            }`}>
                              {res.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Mobile Bottom Navigation Bar (Hidden on desktop) */}
      <footer className="sticky bottom-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center justify-around text-slate-400 dark:text-slate-500 md:hidden">
        <Link href="/patient/home" className="flex flex-col items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <Activity className="h-5 w-5" />
          <span className="text-[9px] font-bold">Accueil</span>
        </Link>
        <Link href="/patient/records" className="flex flex-col items-center gap-1 text-cyan-500">
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
