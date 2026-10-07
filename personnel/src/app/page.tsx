'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, Activity, Image as ImageIcon, Pill, 
  Users, CreditCard, Sparkles, ShieldAlert, ArrowRight, Shield
} from 'lucide-react';
import Link from 'next/link';

export default function PersonnelPortal() {
  const portals = [
    {
      title: 'Médecin',
      desc: 'Dossier patient intelligent, consultations virtuelles & ordonnances IA.',
      icon: Stethoscope,
      href: '/doctor/login',
      color: 'from-emerald-500 to-teal-600',
      badge: 'Spécialiste & Généraliste'
    },
    {
      title: 'Infirmier',
      desc: 'Suivi des constantes vitales, fiche de soins & plan de soins.',
      icon: Activity,
      href: '/nurse/login',
      color: 'from-rose-500 to-pink-600',
      badge: 'Soins & Constantes'
    },
    {
      title: 'Radiologue',
      desc: 'Visualisation DICOM PACS & compte-rendu radiologique IA.',
      icon: ImageIcon,
      href: '/radiology/login',
      color: 'from-purple-500 to-indigo-600',
      badge: 'Imagerie & Diagnostic'
    },
    {
      title: 'Pharmacien',
      desc: 'Validation d\'ordonnance électronique, stock & délivrance QR Code.',
      icon: Pill,
      href: '/pharmacist/login',
      color: 'from-violet-500 to-fuchsia-600',
      badge: 'Dispensaire & QR Code'
    },
    {
      title: 'Accueil & Réception',
      desc: 'Enregistrement patient, files d\'attente & RDV.',
      icon: Users,
      href: '/reception/login',
      color: 'from-blue-500 to-cyan-600',
      badge: 'Admission & RDV'
    },
    {
      title: 'Caissier & Facturation',
      desc: 'Gestion des paiements, facturation AMO & encaissements.',
      icon: CreditCard,
      href: '/cashier/login',
      color: 'from-amber-500 to-yellow-600',
      badge: 'Caisse & Facturation'
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-4 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white overflow-hidden">
      
      {/* Background Animated Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[35vw] h-[35vw] rounded-full bg-emerald-500/5 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-blue-500/5 blur-[100px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between py-4 border-b border-white/5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Shield className="h-5.5 w-5.5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Sunu Santé
            </h1>
            <p className="text-[9px] text-emerald-400 font-semibold uppercase tracking-wider">Portail Professionnel</p>
          </div>
        </div>

        <a 
          href="http://localhost:3000" 
          className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer no-underline border border-white/5 px-3 py-1.5 rounded-lg bg-white/5"
        >
          Retour au portail principal
        </a>
      </header>

      {/* Main Switcher Grid */}
      <main className="relative z-10 max-w-6xl mx-auto w-full my-12 flex-grow flex flex-col justify-center space-y-8">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            Sélectionner votre espace de travail
            <Sparkles className="h-3 w-3 animate-pulse" />
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight max-w-2xl mx-auto">
            Portails Professionnels Sunu Santé
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Accédez à vos outils cliniques et administratifs dédiés pour offrir des soins de santé intelligents et réactifs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((portal, idx) => {
            const Icon = portal.icon;
            return (
              <motion.div
                key={portal.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={portal.href}
                  className="group block bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 shadow-glass backdrop-blur-glass transition-all hover:translate-y-[-2px] relative overflow-hidden"
                >
                  {/* Subtle hover gradient */}
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${portal.color} opacity-0 group-hover:opacity-5 blur-xl pointer-events-none transition-all`} />

                  <div className="flex justify-between items-start mb-4">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${portal.color} p-0.5 shadow-md shadow-slate-950/20`}>
                      <div className="h-full w-full rounded-[14px] bg-slate-950 flex items-center justify-center text-white">
                        <Icon className="h-5.5 w-5.5 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>

                    <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400">
                      {portal.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 mb-1.5 group-hover:text-white flex items-center gap-1.5">
                    {portal.title}
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {portal.desc}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 border-t border-white/5 max-w-6xl mx-auto w-full text-slate-500 text-[10px]">
        &copy; {new Date().getFullYear()} Sunu Santé - Écosystème Clinique Connecté. Tous droits réservés.
      </footer>
    </div>
  );
}
