'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  QrCode, 
  Calendar, 
  AlertTriangle, 
  User, 
  Activity, 
  ExternalLink,
  ShieldCheck,
  HeartPulse,
  Pill,
  ChevronRight,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Stethoscope,
  Phone,
  Copy,
  Check,
  MapPin,
  Sparkles,
  Droplets,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';

export default function PatientHome() {
  const { user, initialize } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [copiedVitalId, setCopiedVitalId] = useState(false);

  useEffect(() => {
    initialize();
    setMounted(true);
  }, [initialize]);

  if (!mounted) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm animate-pulse">S+</div>
          <p className="text-xs font-medium">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  // Informations patient dynamiques
  const activeName   = user?.name || 'Moussa Diop';
  const firstName    = activeName.split(' ')[0];
  const bloodGroup   = user?.details?.bloodGroup || 'O+';
  const vitalId      = user?.details?.vitalId || 'SN-807F16';
  const birthYear    = user?.details?.birthDate ? new Date(user.details.birthDate).getFullYear() : 1996;
  const age          = new Date().getFullYear() - birthYear;
  const gender       = user?.details?.gender === 'F' ? 'Femme' : 'Homme';
  const allergies    = user?.details?.allergies || 'Pénicilline';

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    `https://sunusante.sn/patient/${vitalId}`
  )}&color=0d9488&bgcolor=ffffff&format=svg&qzone=2`;

  const nextRdv = {
    doctor: 'Dr. Awa Ndiaye',
    specialty: 'Cardiologie',
    hospital: 'Clinique du Cap, Dakar',
    date: '25 Mai 2026',
    time: '09:30',
    type: 'Présentiel',
    status: 'Confirmé'
  };

  const lastPrescription = {
    date: '12 Mai 2026',
    doctor: 'Dr. Abdoulaye Diallo',
    drugs: [
      { name: 'Lisinopril 10 mg', dosage: '1 comprimé chaque matin' },
      { name: 'Amlodipine 5 mg', dosage: '1 comprimé chaque soir' }
    ]
  };

  const quickActions = [
    { 
      label: 'Prendre Rendez-vous', 
      sub: 'En cabinet ou vidéo', 
      href: '/patient/appointments', 
      icon: Calendar,    
      color: 'bg-teal-50 text-teal-700 border-teal-200'  
    },
    { 
      label: 'Dossier Médical', 
      sub: 'Analyses & imagerie', 
      href: '/patient/records',    
      icon: FileText,     
      color: 'bg-blue-50 text-blue-700 border-blue-200'  
    },
    { 
      label: 'Ordonnances Actives', 
      sub: 'QR Code pharmacie', 
      href: '/patient/prescriptions', 
      icon: Pill,       
      color: 'bg-purple-50 text-purple-700 border-purple-200' 
    },
    { 
      label: 'Mon Profil & Santé', 
      sub: 'Infos & contacts d’urgence', 
      href: '/patient/profile',      
      icon: User,        
      color: 'bg-slate-100 text-slate-700 border-slate-200' 
    },
  ];

  const handleCopyId = () => {
    navigator.clipboard.writeText(vitalId);
    setCopiedVitalId(true);
    setTimeout(() => setCopiedVitalId(false), 2500);
  };

  return (
    <div className="w-full bg-slate-50 text-slate-900 px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
      <div className="max-w-7xl mx-auto space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">

        {/* ══════════════════════════════════════════════════════════════════
            COLONNE GAUCHE (2/3 de l'écran sur desktop)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-6">

          {/* ── 1. CARTE VITALE DIGITALE (Welcome Hero) ────────────────────── */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white p-5 sm:p-7 shadow-lg shadow-teal-900/15">
            {/* Formes géométriques d'ambiance */}
            <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-teal-500/10 -translate-y-1/3 translate-x-1/4 blur-2xl pointer-events-none" />
            <div className="absolute left-1/3 bottom-0 w-48 h-48 rounded-full bg-emerald-500/10 translate-y-1/3 blur-xl pointer-events-none" />

            <div className="relative z-10">
              {/* En-tête de carte */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-bold text-teal-100 border border-white/20 backdrop-blur-sm">
                      <ShieldCheck className="w-3 h-3 text-emerald-300" />
                      Espace Sécurisé HDS
                    </span>
                    <span className="text-teal-200/80 text-xs hidden sm:inline">• Sunu Santé SN</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Bonjour, {firstName} 👋
                  </h1>
                  <p className="text-teal-200 text-xs sm:text-sm mt-0.5 font-medium">
                    {activeName} · {age} ans · {gender}
                  </p>
                </div>

                {/* Badge Groupe Sanguin & Identifiant */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-500/20 text-rose-100 text-xs font-bold border border-rose-400/30 backdrop-blur-sm">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-300" />
                    Groupe {bloodGroup}
                  </span>
                  <button
                    onClick={handleCopyId}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-[10px] font-mono font-bold border border-white/15 transition-all cursor-pointer"
                    title="Copier l'identifiant"
                  >
                    <span>{vitalId}</span>
                    {copiedVitalId ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 text-teal-200" />}
                  </button>
                </div>
              </div>

              {/* Barre de métriques rapides de santé */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-4 border-t border-white/15 text-xs">
                <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-teal-200 text-[10px] uppercase font-bold tracking-wider block">Allergie</span>
                  <p className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">{allergies}</p>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-teal-200 text-[10px] uppercase font-bold tracking-wider block">Prochain RDV</span>
                  <p className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">{nextRdv.date}</p>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-teal-200 text-[10px] uppercase font-bold tracking-wider block">Traitements</span>
                  <p className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">2 en cours</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. SERVICES MÉDICAUX / ACCÈS RAPIDES ────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-600" />
                Services Médicaux Rapides
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">Accès 1-clic</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={i}
                    href={action.href}
                    className="group p-4 bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${action.color} group-hover:scale-105 transition-transform mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-teal-700 transition-colors">
                        {action.label}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                        {action.sub}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── 3. PROCHAIN RENDEZ-VOUS ────────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" />
                Prochain Rendez-vous Médical
              </h2>
              <Link 
                href="/patient/appointments" 
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-0.5 hover:underline"
              >
                Gérer mes RDV <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center flex-shrink-0 font-bold text-base">
                    N
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                      {nextRdv.specialty}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {nextRdv.doctor}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span>{nextRdv.hospital}</span>
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  {nextRdv.status}
                </span>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>{nextRdv.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>{nextRdv.time}</span>
                  </div>
                </div>

                <Link
                  href="/patient/appointments"
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors"
                >
                  Voir les détails
                </Link>
              </div>
            </div>
          </section>

          {/* ── 4. DERNIÈRE ORDONNANCE & TRAITEMENT ─────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-purple-600" />
                Ordonnance & Traitement en Cours
              </h2>
              <Link 
                href="/patient/prescriptions" 
                className="text-xs font-semibold text-purple-700 hover:text-purple-800 flex items-center gap-0.5 hover:underline"
              >
                Afficher QR Code <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3.5 pb-3 border-b border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-800">Prescrit par {lastPrescription.doctor}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Délivrée le {lastPrescription.date}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                  2 médicaments actifs
                </span>
              </div>

              <div className="space-y-2.5">
                {lastPrescription.drugs.map((drug, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                      <span className="font-bold text-slate-800">{drug.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">{drug.dosage}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* ══════════════════════════════════════════════════════════════════
            COLONNE DROITE (1/3 de l'écran sur desktop)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="space-y-6">

          {/* ── 5. WIDGET QR CODE MÉDICAL DIRECT ───────────────────────────── */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 text-center shadow-xs space-y-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-2">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Carte Médicale Digitale</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 max-w-[220px]">
                À présenter aux médecins et soignants pour ouvrir votre dossier d'urgence.
              </p>
            </div>

            {/* QR Code Container */}
            <div className="mx-auto w-[180px] h-[180px] bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden p-2">
              <img
                src={qrUrl}
                alt="QR Code Dossier Patient Sunu Santé"
                width={180}
                height={180}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-700 tracking-wider">
                ID : {vitalId}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
              <Link
                href="/patient/records"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors text-center"
              >
                Ouvrir mon dossier
              </Link>
            </div>
          </div>

          {/* ── 6. SOS URGENCES MÉDICALES ───────────────────────────────────── */}
          <div className="bg-rose-50/80 rounded-3xl border border-rose-200 p-5 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/30 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-900">Urgence Médicale</h3>
                <p className="text-[11px] text-rose-700 font-medium">SAMU 15 • Pompiers 18 • Dakar</p>
              </div>
            </div>

            <p className="text-xs text-rose-800 leading-relaxed">
              En cas de malaise ou situation critique, contactez immédiatement les secours avec géolocalisation.
            </p>

            <Link
              href="/patient/emergency"
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-rose-600/20 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Déclencher Alerte SOS (24/7)</span>
            </Link>
          </div>

          {/* ── 7. RAPPEL PRÉVENTION SANTÉ ─────────────────────────────────── */}
          <div className="bg-slate-100/70 rounded-3xl border border-slate-200/80 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-teal-800 font-bold">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Conseil Santé du Jour</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Pensez à mesurer régulièrement votre tension artérielle le matin avant la prise de vos comprimés.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
