'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  QrCode, 
  Calendar, 
  AlertTriangle, 
  User, 
  Bell, 
  Activity, 
  MapPin,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';

export default function PatientHome() {
  const { user, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Dynamically resolve patient profile fields with premium fallback structures
  const activeName = user?.name || "Moussa Diop";
  const activeBloodGroup = user?.details?.bloodGroup || "O+";
  const activeAllergiesCount = user?.details?.allergies 
    ? (user.details.allergies.toLowerCase().includes('aucune') ? 0 : 1) 
    : 2;
  const activeVitalId = user?.details?.vitalId || "SN-807F16";
  const activeAge = user?.details?.birthDate 
    ? new Date().getFullYear() - new Date(user.details.birthDate).getFullYear() 
    : 30;
  const activeGender = user?.details?.gender || "M";

  const patientData = {
    name: activeName,
    bloodGroup: activeBloodGroup,
    allergiesCount: activeAllergiesCount,
    vitalId: activeVitalId,
    age: activeAge,
    gender: activeGender,
    nextAppointment: {
      doctor: "Dr. Awa Ndiaye",
      specialty: "Cardiologue",
      date: "25 Mai 2026",
      time: "09:30"
    },
    recentPrescription: {
      date: "12 Mai 2026",
      doctor: "Dr. Abdoulaye Diallo",
      drugs: ["Lisinopril 10mg", "Amlodipine 5mg"]
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent text-slate-800 dark:text-slate-100 flex flex-col justify-between max-w-md mx-auto md:max-w-none md:mx-0 md:h-full md:min-h-0 md:justify-start md:items-stretch w-full">
      
      {/* Mobile Top Header Bar (Hidden on desktop) */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-800 dark:text-white">Sunu Santé</h1>
            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider">Carnet Digital</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-300 dark:border-slate-700">
            <User className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </header>

      {/* Main Content Area - Grid responsive on desktop */}
      <main className="flex-grow px-6 py-6 overflow-y-auto space-y-6 md:p-8 md:grid md:grid-cols-1 lg:grid-cols-3 md:gap-8 md:space-y-0 md:h-full md:overflow-y-auto w-full relative z-10">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN (Takes up 2 columns on desktop)                                */}
        {/* ========================================================================= */}
        <div className="lg:col-span-2 space-y-6 w-full">
          
          {/* Welcome Patient Card - Beautiful medical gradient & ambient glow */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-400 via-cyan-600 to-indigo-600 dark:from-cyan-500 dark:via-cyan-600 dark:to-indigo-800 p-6 text-white shadow-lg shadow-cyan-500/10 dark:shadow-indigo-950/20"
          >
            {/* Card geometric details */}
            <div className="absolute right-[-10%] top-[-10%] w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute left-[-5%] bottom-[-10%] w-24 h-24 rounded-full bg-cyan-400/20 blur-lg pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <p className="text-[10px] text-cyan-100 font-extrabold uppercase tracking-widest leading-none mb-1">Carnet Connecté</p>
                <h2 className="text-2xl font-black tracking-tight">{patientData.name}</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md border border-white/20">
                Groupe {patientData.bloodGroup}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4 text-sm relative z-10">
              <div>
                <p className="text-cyan-100 text-[10px] font-bold uppercase tracking-wider">Allergies</p>
                <p className="font-extrabold text-base mt-0.5">{patientData.allergiesCount} connues</p>
              </div>
              <div>
                <p className="text-cyan-100 text-[10px] font-bold uppercase tracking-wider">Identifiant Vital</p>
                <p className="font-mono font-black text-base mt-0.5 tracking-wider">{patientData.vitalId}</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Access Menu Grid - Glass-premium styles and neon glow hovers */}
          <div className="space-y-3">
            <h3 className="font-black text-base tracking-tight text-slate-800 dark:text-slate-100">Services Médicaux</h3>
            <div className="grid grid-cols-2 gap-4">
              
              <Link href="/patient/records" className="group rounded-3xl glass-premium glass-premium-hover p-5 border border-slate-200/40 dark:border-slate-800/80 shadow-sm flex flex-col justify-between h-32 hover:border-blue-500/30 dark:hover:border-blue-500/40">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 group-hover:scale-105 transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">Dossier Médical</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Consultez vos analyses et radiologies</p>
                </div>
              </Link>

              <Link href="/patient/prescriptions" className="group rounded-3xl glass-premium glass-premium-hover p-5 border border-slate-200/40 dark:border-slate-800/80 shadow-sm flex flex-col justify-between h-32 hover:border-purple-500/30 dark:hover:border-purple-500/40">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20 group-hover:scale-105 transition-all shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">Ordonnances</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">QR Code de retrait pharmacie</p>
                </div>
              </Link>

            </div>
          </div>

          {/* Next Appointment Card - Translucent glass-premium */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-base tracking-tight text-slate-800 dark:text-slate-100">Rendez-vous à venir</h3>
              <Link href="/patient/appointments" className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline">
                Tout voir
              </Link>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl glass-premium p-5 border border-slate-200/40 dark:border-slate-800/80 shadow-sm space-y-4 hover:border-cyan-500/20 dark:hover:border-cyan-500/30 transition-all duration-350"
            >
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center border border-cyan-500/20 flex-shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                  <Calendar className="h-5.5 w-5.5" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{patientData.nextAppointment.doctor}</h4>
                  <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-0.5">{patientData.nextAppointment.specialty}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
                    Confirmé
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100/50 dark:border-slate-800/60 pt-4 text-xs font-bold text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-500 neon-pulse-cyan" />
                  <span>{patientData.nextAppointment.date}</span>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/60">{patientData.nextAppointment.time}</div>
              </div>
            </motion.div>
          </div>

          {/* Recent Prescription Summary - Translucent glass-premium */}
          <div className="space-y-3">
            <h3 className="font-black text-base tracking-tight text-slate-800 dark:text-slate-100">Dernier traitement</h3>
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl glass-premium p-5 border border-slate-200/40 dark:border-slate-800/80 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-100/50 dark:border-slate-800/60 pb-3">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">Prescrit par {patientData.recentPrescription.doctor}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-0.5">Le {patientData.recentPrescription.date}</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20">
                  <QrCode className="h-4.5 w-4.5" />
                </div>
              </div>
              
              <div className="space-y-2">
                {patientData.recentPrescription.drugs.map((drug, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                    <span>{drug}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN (Takes up 1 column on desktop)                               */}
        {/* ========================================================================= */}
        <div className="space-y-6 w-full">
          
          {/* Vital QR Code Share Card - Futuristic dark glass & indigo halos */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-950 border border-slate-800/80 p-6 text-center space-y-4 shadow-xl shadow-indigo-950/20 w-full"
          >
            {/* Ambient glows inside card */}
            <div className="absolute left-[-20%] top-[-20%] w-36 h-36 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
            <div className="absolute right-[-20%] bottom-[-20%] w-36 h-36 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

            <div className="flex flex-col items-center space-y-2 relative z-10">
              <div className="h-11 w-11 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-black tracking-tight text-white uppercase mt-1">Dossier Médical QR</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-[240px] mx-auto leading-relaxed">
                Présentez ce QR Code au médecin lors de votre admission pour lui partager instantanément votre dossier vital.
              </p>
            </div>

            {/* White border QR container for high scan readability */}
            <div className="relative mx-auto w-[160px] h-[160px] bg-white p-3 rounded-2xl shadow-lg flex items-center justify-center border-4 border-cyan-500/20 relative z-10">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                  `http://localhost:3003/doctor/consultation?id=${patientData.vitalId}&name=${encodeURIComponent(patientData.name)}&age=${patientData.age}&gender=${patientData.gender}&reason=Scan de dossier vital`
                )}`} 
                alt="QR Code Dossier Vital" 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="pt-1 text-center space-y-2.5 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400">{patientData.vitalId}</span>
              </div>

              <div className="pt-1">
                <a 
                  href={`http://localhost:3003/doctor/consultation?id=${patientData.vitalId}&name=${encodeURIComponent(patientData.name)}&age=${patientData.age}&gender=${patientData.gender}&reason=Scan de dossier vital`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2 rounded-xl text-[10px] text-cyan-400 hover:text-cyan-300 font-extrabold tracking-wide uppercase transition-all duration-200 border border-cyan-500/20 hover:border-cyan-500/40"
                >
                  <span>Simuler le Scan</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* SOS Emergency Call Button Section - Glowing red gradient banner */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-red-500/10 dark:bg-red-500/5 border border-red-500/20 dark:border-red-500/30 p-5 flex items-center justify-between shadow-sm relative overflow-hidden"
          >
            {/* Background Red glowing halo */}
            <div className="absolute right-[-10%] top-[-10%] w-24 h-24 rounded-full bg-red-500/10 blur-xl pointer-events-none animate-pulse" />
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="h-10 w-10 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse flex-shrink-0">
                <AlertTriangle className="h-5 w-5 animate-bounce" />
              </div>
              <div>
                <h3 className="font-extrabold text-red-600 dark:text-red-400 text-sm">Urgence SOS</h3>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5 font-semibold">Alerte instantanée Dakar</p>
              </div>
            </div>
            <Link href="/patient/emergency" className="h-9 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center justify-center transition-colors relative z-10 shadow-md shadow-red-600/20">
              Activer
            </Link>
          </motion.div>

        </div>

      </main>

      {/* Mobile Bottom Navigation Bar (Hidden on desktop) */}
      <footer className="sticky bottom-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center justify-around text-slate-400 dark:text-slate-500 md:hidden">
        <Link href="/patient/home" className="flex flex-col items-center gap-1 text-cyan-500">
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
