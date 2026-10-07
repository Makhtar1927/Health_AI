'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Shield, 
  Activity, 
  Heart, 
  AlertTriangle,
  FileText,
  Save,
  CheckCircle2,
  Lock
} from 'lucide-react';
import Link from 'next/link';

export default function PatientProfile() {
  const [profile, setProfile] = useState({
    firstName: "Moussa",
    lastName: "Diop",
    phone: "+221 77 123 45 67",
    email: "moussa.diop@email.com",
    address: "Fann Résidence, Dakar, Sénégal",
    bloodType: "O+",
    birthDate: "15 Avril 1992",
    emergencyContactName: "Amina Diop",
    emergencyContactPhone: "+221 78 987 65 43",
    insuranceName: "IPM Dakar Aérien",
    insuranceNumber: "POL-773-XYZ",
    insuranceCoverage: 80, // 80% coverage
    allergies: ["Pénicilline", "Arachides"],
    medicalHistory: ["Asthme modéré", "Appendicectomie (2018)"]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="relative min-h-screen bg-transparent text-slate-800 dark:text-slate-100 flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-slate-200 dark:border-slate-800 md:max-w-none md:mx-0 md:shadow-none md:border-0 md:bg-transparent md:h-full md:min-h-0 md:justify-start md:items-stretch w-full">
      
      {/* Mobile Header Bar (Hidden on desktop) */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between md:hidden w-full">
        <div className="flex items-center gap-4">
          <Link href="/patient/home" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-800 dark:text-white">Mon Profil Vital</h1>
            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider">Identité & Urgence</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
        >
          {isEditing ? "Annuler" : "Modifier"}
        </button>
      </header>

      {/* Main Container - Responsive column grid on desktop */}
      <main className="flex-grow px-6 py-6 overflow-y-auto space-y-6 md:p-8 md:h-full md:overflow-y-auto w-full relative z-10">

        {/* Desktop Save/Edit Toggle Button (Anchor at top of page content on desktop) */}
        <div className="hidden md:flex justify-end mb-4 relative z-10">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-xs font-black rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/80 text-cyan-500 hover:bg-white dark:hover:bg-slate-800/80 hover:text-cyan-600 shadow-sm cursor-pointer transition-all"
          >
            {isEditing ? "Annuler Modifications" : "Modifier Profil"}
          </button>
        </div>

        {/* Success Alert toast */}
        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2 max-w-lg relative z-10 shadow-sm shadow-emerald-500/5"
          >
            <CheckCircle2 className="h-4.5 w-4.5" />
            <span>Vos modifications ont été enregistrées sur la blockchain santé.</span>
          </motion.div>
        )}

        {/* Form Details wrapped in responsive layout */}
        <form onSubmit={handleSave} className="w-full relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full relative z-10">
            
            {/* ========================================================================= */}
            {/* LEFT PROFILE PANEL (Drives identity & biologicalconstants)                */}
            {/* ========================================================================= */}
            <div className="md:col-span-5 space-y-6 w-full relative z-10">
              
              {/* User Card Profile */}
              <div className="flex flex-col items-center text-center p-6 glass-premium border border-slate-200/40 dark:border-slate-800/80 rounded-3xl shadow-sm space-y-3 relative overflow-hidden">
                <div className="absolute right-[-10%] top-[-10%] w-20 h-20 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </div>
                  <span className="absolute bottom-0 right-0 h-4.5 w-4.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">{profile.firstName} {profile.lastName}</h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-bold">Identifiant Vital : <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">SN-807F16</span></p>
                </div>
              </div>

              {/* Informations de Santé */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pl-2">
                  <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                  Données Cliniques Vitales
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-premium p-4 rounded-2xl border border-slate-200/40 dark:border-slate-800/80 text-center">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Groupe Sanguin</span>
                    <span className="text-2xl font-black text-red-500 mt-1 block">{profile.bloodType}</span>
                  </div>
                  <div className="glass-premium p-4 rounded-2xl border border-slate-200/40 dark:border-slate-800/80 text-center">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Né(e) le</span>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-200 mt-2 block">{profile.birthDate}</span>
                  </div>
                </div>
              </div>

              {/* Crypto & Blockchain security */}
              <div className="p-4.5 bg-slate-900 dark:bg-slate-950/60 text-slate-350 rounded-3xl border border-slate-800/80 flex items-center gap-4 shadow-sm shadow-indigo-950/5">
                <Lock className="h-8 w-8 text-cyan-400 flex-shrink-0" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    Chiffrement End-to-End Actif
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                    Vos données sont hachées et stockées de manière pseudonymisée conformément aux réglementations de santé en vigueur.
                  </p>
                </div>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* RIGHT PROFILE PANEL (Contact, emergency & clinical history forms)          */}
            {/* ========================================================================= */}
            <div className="md:col-span-7 space-y-6 w-full relative z-10">
              
              {/* Contact Info */}
              <div className="space-y-4 glass-premium p-5 rounded-3xl border border-slate-200/40 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
                <div className="absolute right-[-10%] top-[-10%] w-32 h-32 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none" />
                
                <h3 className="font-extrabold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2 relative z-10">
                  <User className="h-4 w-4 text-cyan-500" />
                  Contacts et Coordonnées
                </h3>

                <div className="space-y-3.5 text-xs relative z-10">
                  <div className="space-y-1">
                    <label className="text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                      <Phone className="h-3.5 w-3.5 text-cyan-500" /> Téléphone
                    </label>
                    {isEditing ? (
                      <input 
                        type="text"
                        value={profile.phone}
                        onChange={e => setProfile({...profile, phone: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white/50 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500 font-bold"
                      />
                    ) : (
                      <p className="font-black text-slate-750 dark:text-slate-200 pl-5 text-xs tracking-wide">{profile.phone}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                      <MapPin className="h-3.5 w-3.5 text-cyan-500" /> Adresse de Résidence
                    </label>
                    {isEditing ? (
                      <input 
                        type="text"
                        value={profile.address}
                        onChange={e => setProfile({...profile, address: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white/50 dark:bg-slate-955/40 border border-slate-200/40 dark:border-slate-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500 font-bold"
                      />
                    ) : (
                      <p className="font-black text-slate-750 dark:text-slate-200 pl-5 text-xs">{profile.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Urgence & Assurances */}
              <div className="space-y-4 glass-premium p-5 rounded-3xl border border-slate-200/40 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
                <div className="absolute right-[-10%] top-[-10%] w-32 h-32 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />

                <h3 className="font-extrabold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2 relative z-10">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  Urgence & Assurance Mutuelle
                </h3>

                <div className="space-y-3.5 text-xs relative z-10">
                  <div className="space-y-1">
                    <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider block">Contact d'Urgence (Proche)</span>
                    <p className="font-black text-slate-750 dark:text-slate-200 text-xs">{profile.emergencyContactName} • <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold tracking-wider">{profile.emergencyContactPhone}</span></p>
                  </div>

                  <div className="space-y-1 border-t border-slate-200/40 dark:border-slate-800/60 pt-3.5">
                    <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider block">Couverture Assurance</span>
                    <div className="flex justify-between items-center mt-1">
                      <div>
                        <p className="font-black text-slate-750 dark:text-slate-200 text-xs">{profile.insuranceName}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">Police: {profile.insuranceNumber}</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black rounded-xl text-xs border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
                        Tiers-payant {profile.insuranceCoverage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Allergies & DMP */}
              <div className="space-y-4 glass-premium p-5 rounded-3xl border border-slate-200/40 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
                <div className="absolute right-[-10%] top-[-10%] w-32 h-32 rounded-full bg-red-500/5 blur-2xl pointer-events-none" />

                <h3 className="font-extrabold text-xs text-red-500 uppercase tracking-wider flex items-center gap-1.5 mb-2 relative z-10">
                  <AlertTriangle className="h-4 w-4" />
                  Allergies et Antécédents
                </h3>

                <div className="space-y-3.5 text-xs relative z-10">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider block mb-1">Allergies déclarées</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.allergies.map((allergy, aIndex) => (
                        <span key={aIndex} className="px-2.5 py-1 bg-red-500/10 text-red-600 dark:text-red-400 font-black rounded-lg text-[10px] border border-red-500/20 animate-pulse">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-200/40 dark:border-slate-800/60 pt-3.5">
                    <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider block mb-1">Antécédents médicaux</span>
                    <ul className="space-y-1.5 pl-4 list-disc text-slate-600 dark:text-slate-350 font-bold">
                      {profile.medicalHistory.map((history, hIndex) => (
                        <li key={hIndex} className="tracking-wide">{history}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Save Button for Edit Mode */}
              {isEditing && (
                <motion.button
                  type="submit"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-12 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 border border-transparent"
                >
                  <Save className="h-4.5 w-4.5" />
                  Sauvegarder les modifications
                </motion.button>
              )}

            </div>

          </div>

        </form>

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
        <Link href="/patient/profile" className="flex flex-col items-center gap-1 text-cyan-500">
          <User className="h-5 w-5" />
          <span className="text-[9px] font-bold">Profil</span>
        </Link>
      </footer>
    </div>
  );
}
