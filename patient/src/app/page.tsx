'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  Stethoscope, 
  Image as ImageIcon, 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  ChevronRight,
  BrainCircuit,
  Database,
  CloudLightning,
  Pill
} from 'lucide-react';

export default function HomePortal() {
  const roles = [
    {
      title: "Agent d'Accueil & Réception",
      description: "Gestion de la salle d'attente en temps réel, création de fiches d'admission et planification d'agenda.",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      href: "http://localhost:3003/reception/login",
      features: ["Salle d'attente dynamique", "Admission Patient unique", "Prise de rdv fluide"]
    },
    {
      title: "Médecin / Spécialiste",
      description: "Consultation clinique, dossier médical partagé, télémédecine et aide à la prescription par Intelligence Artificielle.",
      icon: Stethoscope,
      color: "from-emerald-500 to-teal-600",
      href: "http://localhost:3003/doctor/login",
      features: ["Dossier Médical Partagé", "Assistant d'interaction IA", "Téléconsultations RTC"]
    },
    {
      title: "Infirmier / Soins Cliniques",
      description: "Suivi des constantes vitales en temps réel, planification d'administration des soins et alertes d'urgence.",
      icon: Activity,
      color: "from-rose-500 to-red-600",
      href: "http://localhost:3003/nurse/login",
      features: ["Constantes vitales en direct", "Plan de soin infirmier", "Alertes médicales instantanées"]
    },
    {
      title: "Radiologue & Imagerie",
      description: "Visionneuse DICOM 2D/3D en ligne, compte-rendu vocal et détection automatique de pathologies (fractures, pneumonies).",
      icon: ImageIcon,
      color: "from-purple-500 to-pink-600",
      href: "http://localhost:3003/radiology/login",
      features: ["Upload PACS/DICOM chiffré", "Analyse de vision Gemini", "Saisie vocale avancée"]
    },
    {
      title: "Pharmacien & Dispensaire",
      description: "Validation et délivrance d'ordonnances via QR code sécurisé, et gestion intelligente des stocks de médicaments.",
      icon: Pill,
      color: "from-violet-500 to-fuchsia-600",
      href: "http://localhost:3003/pharmacist/login",
      features: ["Scan Ordonnances QR", "Contrôle des interactions", "Gestion d'inventaire IA"]
    },
    {
      title: "Caissier & Facturation",
      description: "Gestion de la caisse, traitement du tiers-payant mutuelle/assurance et encaissements multi-modes.",
      icon: CreditCard,
      color: "from-amber-500 to-orange-600",
      href: "http://localhost:3003/cashier/login",
      features: ["Calculs Tiers-Payant", "Paiements Wave & Cash", "États financiers quotidiens"]
    },
    {
      title: "Portail Patient (Mobile-First)",
      description: "Suivi des consultations, ordonnances électroniques, carnet de santé numérique et bouton SOS Urgences.",
      icon: Smartphone,
      color: "from-cyan-500 to-blue-600",
      href: "/patient/login",
      features: ["Ordonnances avec QR Code", "SOS géolocalisé", "Installable en PWA"]
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white">
      
      {/* Decorative Animated Circles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex-grow flex flex-col justify-center">
        
        {/* Branding Header */}
        <header className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-6 backdrop-blur-md"
          >
            <Activity className="h-5 w-5 text-blue-400 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide text-blue-200">PORTAIL CLINIQUE PROFESSIONNEL</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent"
          >
            Sunu Santé
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            Plateforme médicale intelligente connectée, unifiant le parcours de soins, l'analyse d'images par IA et la gestion administrative sécurisée de bout en bout.
          </motion.p>
        </header>

        {/* Roles Dashboard Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {roles.map((role, index) => {
            const IconComponent = role.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 p-8 shadow-glass backdrop-blur-glass transition-all duration-300 animate-fade-in"
              >
                {/* Background Card glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${role.color} opacity-5 blur-3xl group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />

                <div>
                  <div className={`inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br ${role.color} shadow-lg text-white mb-6`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-white transition-colors duration-200">
                    {role.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <div>
                  {/* Small Feature Pill Indicators */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {role.features.map((feat, fIndex) => (
                      <span key={fIndex} className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-slate-300">
                        {feat}
                      </span>
                    ))}
                  </div>

                  <a href={role.href} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors duration-200 no-underline">
                    Entrer dans l'espace
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </main>

        {/* Administration Section */}
        <section className="mb-16 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-glass">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-200 tracking-tight">Portails d'Administration</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Super Admin */}
            <a href="http://localhost:3001/login" className="group p-5 bg-slate-950/40 border border-slate-850 hover:border-amber-500/30 rounded-2xl flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden no-underline">
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-amber-500/5 blur-xl group-hover:opacity-100 transition-opacity" />
              <div>
                <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Super-Admin
                </span>
                <h3 className="text-sm font-bold text-slate-200 group-hover:text-amber-400 transition-colors mt-3">Système Global</h3>
                <p className="text-[11px] text-slate-500 mt-1">Habilitations des directions d'établissement.</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all mt-4 self-end" />
            </a>

            {/* Hospital Admin */}
            <a href="http://localhost:3002/hospital/login" className="group p-5 bg-slate-950/40 border border-slate-850 hover:border-emerald-500/30 rounded-2xl flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden no-underline">
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-emerald-500/5 blur-xl group-hover:opacity-100 transition-opacity" />
              <div>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Admin Clinique
                </span>
                <h3 className="text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors mt-3">Direction Hôpital</h3>
                <p className="text-[11px] text-slate-500 mt-1">Gestion du personnel médical, infirmier et caissier.</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all mt-4 self-end" />
            </a>

            {/* Pharmacy Admin */}
            <a href="http://localhost:3002/pharmacy/login" className="group p-5 bg-slate-950/40 border border-slate-850 hover:border-violet-500/30 rounded-2xl flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden no-underline">
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-violet-500/5 blur-xl group-hover:opacity-100 transition-opacity" />
              <div>
                <span className="text-[9px] bg-violet-500/10 text-violet-400 border border-violet-500/20 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Admin Officine
                </span>
                <h3 className="text-sm font-bold text-slate-200 group-hover:text-violet-400 transition-colors mt-3">Direction Pharmacie</h3>
                <p className="text-[11px] text-slate-500 mt-1">Gestion des pharmaciens et habilitations QR.</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all mt-4 self-end" />
            </a>
          </div>
        </section>

        {/* Infrastructure Specs Footer Banner */}
        <section className="border-t border-slate-800/80 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="flex flex-col items-center bg-slate-900/30 border border-slate-950 p-5 rounded-2xl">
              <div className="p-3 bg-blue-500/10 rounded-xl mb-3 text-blue-400">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Intelligence Artificielle</h4>
              <p className="text-sm font-semibold text-slate-200">Google Gemini 1.5</p>
            </div>

            <div className="flex flex-col items-center bg-slate-900/30 border border-slate-950 p-5 rounded-2xl">
              <div className="p-3 bg-emerald-500/10 rounded-xl mb-3 text-emerald-400">
                <Database className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Base de Données</h4>
              <p className="text-sm font-semibold text-slate-200">Supabase / Postgres</p>
            </div>

            <div className="flex flex-col items-center bg-slate-900/30 border border-slate-950 p-5 rounded-2xl">
              <div className="p-3 bg-pink-500/10 rounded-xl mb-3 text-pink-400">
                <CloudLightning className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Stockage PACS/Médias</h4>
              <p className="text-sm font-semibold text-slate-200">Cloudinary Authenticated</p>
            </div>

            <div className="flex flex-col items-center bg-slate-900/30 border border-slate-950 p-5 rounded-2xl">
              <div className="p-3 bg-purple-500/10 rounded-xl mb-3 text-purple-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Protocole Sécurité</h4>
              <p className="text-sm font-semibold text-slate-200">Conception Shift-Left</p>
            </div>

          </div>
        </section>

      </div>

      <footer className="text-center text-xs text-slate-500 mt-16">
        &copy; {new Date().getFullYear()} Sunu Santé - Système de Santé Connecté Moderne. Tous droits réservés.
      </footer>
    </div>
  );
}
