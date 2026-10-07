'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  UserPlus, 
  Calendar, 
  Clock, 
  Search, 
  Plus, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  FileCheck,
  ClipboardList
} from 'lucide-react';
import Link from 'next/link';

export default function ReceptionDashboard() {
  const quickActions = [
    {
      title: "Salle d'Attente Temps Réel",
      description: "Appel, admission, et gestion active de la file d'attente clinique.",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      href: "/reception/waiting-room",
      badge: "Real-time Sync"
    },
    {
      title: "Nouveau Patient / Admission",
      description: "Enregistrer une fiche d'admission vitale et rattacher un DMP.",
      icon: UserPlus,
      color: "from-emerald-500 to-teal-600",
      href: "/reception/waiting-room?action=new-patient",
      badge: "Zod Validated"
    },
    {
      title: "Planification des Rendez-vous",
      description: "Visualiser l'agenda complet des médecins et réserver un créneau.",
      icon: Calendar,
      color: "from-purple-500 to-pink-600",
      href: "/reception/waiting-room", // Redirects to central reception operations
      badge: "Intelligent Slot"
    }
  ];

  const recentAdmissions = [
    { id: "P-101", name: "Amadou Sall", age: 42, checkInTime: "12:15", status: "En attente", doctor: "Dr. Awa Ndiaye" },
    { id: "P-103", name: "Cheikh Tidiane Diop", age: 67, checkInTime: "12:40", status: "Appel en cours", doctor: "Dr. Awa Ndiaye" },
    { id: "P-105", name: "Babacar Faye", age: 34, checkInTime: "12:55", status: "En consultation", doctor: "Dr. Abdoulaye Diallo" }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-indigo-955 to-slate-950 text-white">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex-grow flex flex-col justify-center">
        
        {/* Header Bar */}
        <header className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-6 backdrop-blur-md"
          >
            <Activity className="h-5 w-5 text-blue-400 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide text-blue-200">PORTAIL ACCUEIL ET RÉCEPTION</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
            Tableau de Bord Réception
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Centralisez l'admission des patients, gérez la fluidité de la file d'attente clinique en temps réel et affectez efficacement les consultations.
          </p>
        </header>

        {/* Dashboard Menu Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Quick Actions column (spanning 2 cols on wide screens) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-extrabold text-lg text-slate-200 mb-2 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-400" />
              Actions Opérationnelles
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 p-6 shadow-glass backdrop-blur-glass transition-all duration-300"
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${action.color} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />
                    
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className={`inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg text-white`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <span className="text-[9px] px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-slate-300 font-bold">
                          {action.badge}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-bold mb-2 text-slate-100 group-hover:text-white transition-colors duration-200">
                        {action.title}
                      </h3>
                      
                      <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                        {action.description}
                      </p>
                    </div>

                    <Link href={action.href} className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
                      Ouvrir l'action
                      <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active admissions summary */}
          <div className="space-y-6">
            <h2 className="font-extrabold text-lg text-slate-200 mb-2 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-emerald-400" />
              Admissions du Jour
            </h2>

            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 shadow-glass backdrop-blur-glass space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400">Derniers enregistrements</span>
                <Link href="/reception/waiting-room" className="text-[10px] font-bold text-blue-400 hover:underline">
                  Voir tout
                </Link>
              </div>

              <div className="space-y-3">
                {recentAdmissions.map((adm) => (
                  <div key={adm.id} className="p-3 bg-slate-950/40 rounded-2xl border border-slate-850 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-200">{adm.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{adm.age} ans • assigné à {adm.doctor}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-[9px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                        {adm.checkInTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shift-Left Security Protocols Panel */}
            <div className="p-5 bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-slate-800/80 rounded-3xl space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <ShieldAlert className="h-5 w-5" />
                <h4 className="text-xs font-bold text-slate-200">Garantie Conformité RGPD</h4>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Toutes les entrées de fiches d'admission sont soumises à une validation Zod stricte au niveau du client et font l'objet d'un audit de transactions en temps réel dans Supabase Postgres.
              </p>
            </div>

          </div>

        </main>

        {/* Back Link to Hub */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 font-bold transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Retourner au Portail Clinique Principal
          </Link>
        </div>

      </div>

      <footer className="text-center text-xs text-slate-500 mt-16">
        &copy; {new Date().getFullYear()} Sunu Santé - Module Réception & Admissions. Tous droits réservés.
      </footer>
    </div>
  );
}

// Small mock ArrowLeft icon
function ArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
