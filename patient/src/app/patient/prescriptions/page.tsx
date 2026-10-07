'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  QrCode, 
  Activity, 
  Calendar,
  Download,
  AlertTriangle,
  FileText,
  User,
  CheckCircle,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function PatientPrescriptions() {
  const prescriptions = [
    {
      id: "ORD-9201",
      date: "12 Mai 2026",
      doctor: "Dr. Abdoulaye Diallo",
      specialty: "Médecine Générale",
      status: "Actif",
      qrCodeData: "https://xnezurgklbaminjlyeyx.supabase.co/prescriptions/SN-807F16-9201",
      drugs: [
        { name: "Lisinopril 10mg", dosage: "1 comprimé le matin", duration: "30 jours" },
        { name: "Amlodipine 5mg", dosage: "1 comprimé le soir", duration: "30 jours" }
      ],
      aiAnalysis: "Aucune interaction majeure détectée entre Lisinopril et Amlodipine. Risque cardiovasculaire sous surveillance adéquate."
    },
    {
      id: "ORD-8542",
      date: "04 Février 2026",
      doctor: "Dr. Aminata Touré",
      specialty: "Pneumologie",
      status: "Terminé",
      qrCodeData: "https://xnezurgklbaminjlyeyx.supabase.co/prescriptions/SN-807F16-8542",
      drugs: [
        { name: "Amoxicilline 1g", dosage: "1 comprimé 2 fois par jour", duration: "7 jours" },
        { name: "Sirop Hélicidine", dosage: "1 cuillère à soupe 3 fois par jour", duration: "5 jours" }
      ],
      aiAnalysis: "Traitement antibiotique standard pour bronchite. Veiller à respecter la durée complète du traitement."
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
          <h1 className="text-base font-bold tracking-tight text-slate-800 dark:text-white">Mes Ordonnances</h1>
          <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider">Retraits en Pharmacie</p>
        </div>
      </header>

      {/* Main Container - Fully responsive grid structures */}
      <main className="flex-grow px-6 py-6 overflow-y-auto space-y-6 md:p-8 md:h-full md:overflow-y-auto w-full relative z-10">
        
        {/* Helper Banner - Maximum readable width on desktop */}
        <div className="rounded-3xl bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/20 p-5 text-xs text-slate-600 dark:text-slate-350 leading-relaxed space-y-2 max-w-3xl font-medium">
          <p className="font-black text-cyan-600 dark:text-cyan-400 uppercase text-[10px] tracking-wider">Comment retirer vos médicaments ?</p>
          <p>Présentez simplement le QR Code de votre ordonnance active au pharmacien pour qu'il puisse scanner et valider la délivrance en toute sécurité.</p>
        </div>

        {/* Prescriptions List - Rendered as a grid on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full relative z-10">
          {prescriptions.map((ord, index) => (
            <motion.div
              key={ord.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-3xl glass-premium p-5 border border-slate-200/40 dark:border-slate-800/80 shadow-sm space-y-4 hover:border-cyan-500/10 dark:hover:border-cyan-500/20 transition-all duration-300"
            >
              {/* Header inside card */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">{ord.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black ${
                      ord.status === 'Actif' 
                        ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 animate-pulse' 
                        : 'bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 mt-1">{ord.doctor}</h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{ord.specialty}</p>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-bold">
                  <Calendar className="h-3.5 w-3.5 text-cyan-500" />
                  <span>{ord.date}</span>
                </div>
              </div>

              {/* Drugs list */}
              <div className="border-t border-slate-100/50 dark:border-slate-800/60 pt-3 space-y-2">
                <span className="text-slate-400 dark:text-slate-500 text-[9px] font-bold uppercase tracking-wider block">Médicaments Prescrits :</span>
                {ord.drugs.map((drug, dIndex) => (
                  <div key={dIndex} className="p-3 bg-white/40 dark:bg-slate-950/20 rounded-xl border border-slate-200/30 dark:border-slate-850/60 text-xs space-y-1 font-bold">
                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-200">
                      <span>{drug.name}</span>
                      <span className="text-cyan-500 dark:text-cyan-400">{drug.duration}</span>
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">{drug.dosage}</p>
                  </div>
                ))}
              </div>

              {/* AI Interaction Analysis Box - Styled beautifully */}
              {ord.aiAnalysis && (
                <div className="p-3 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/15 rounded-2xl text-[11px] leading-relaxed text-indigo-700 dark:text-indigo-300 font-medium">
                  <span className="font-black block mb-0.5 uppercase text-[9px] tracking-wider text-indigo-600 dark:text-indigo-400">💡 Assistant IA Clinique :</span>
                  {ord.aiAnalysis}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button 
                  onClick={() => alert(`Contenu du QR Code sécurisé : ${ord.qrCodeData}`)}
                  className="flex-1 h-11 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-transparent shadow-md shadow-cyan-600/10"
                >
                  <QrCode className="h-4.5 w-4.5" />
                  Scanner Ordonnance
                </button>
                <button 
                  onClick={() => alert("Téléchargement sécurisé PDF de l'ordonnance lancé...")}
                  className="h-11 w-11 rounded-xl bg-white/60 dark:bg-slate-850 text-slate-600 dark:text-slate-350 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center justify-center cursor-pointer border border-slate-200 dark:border-slate-800 shadow-sm"
                  title="Télécharger PDF"
                >
                  <Download className="h-4.5 w-4.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </main>

      {/* Mobile Bottom Navigation Bar (Hidden on desktop) */}
      <footer className="sticky bottom-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center justify-around text-slate-400 dark:text-slate-500 md:hidden">
        <Link href="/patient/home" className="flex flex-col items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <Activity className="h-5 w-5" />
          <span className="text-[9px] font-bold">Accueil</span>
        </Link>
        <Link href="/patient/records" className="flex flex-col items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
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
