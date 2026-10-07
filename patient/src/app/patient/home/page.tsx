'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  QrCode, 
  Calendar, 
  AlertTriangle, 
  User, 
  Bell, 
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
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';

const cardIn = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.3 } }),
};

export default function PatientHome() {
  const { user, initialize } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initialize();
    setMounted(true);
  }, [initialize]);

  // Data dynamique / démo
  const activeName   = user?.name || 'Moussa Diop';
  const firstName    = activeName.split(' ')[0];
  const bloodGroup   = user?.details?.bloodGroup || 'O+';
  const vitalId      = user?.details?.vitalId || 'SN-807F16';
  const age          = user?.details?.birthDate
    ? new Date().getFullYear() - new Date(user.details.birthDate).getFullYear()
    : 30;
  const gender       = user?.details?.gender || 'M';
  const allergies    = user?.details?.allergies || 'Pénicilline';

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `https://sunusante.sn/patient/${vitalId}`
  )}&color=0d9488&bgcolor=ffffff&format=svg&qzone=2`;

  const nextRdv = {
    doctor: 'Dr. Awa Ndiaye',
    specialty: 'Cardiologue',
    date: '25 Mai 2026',
    time: '09:30',
    lieu: 'Clinique Principal, Dakar'
  };

  const lastPrescription = {
    date: '12 Mai 2026',
    doctor: 'Dr. A. Diallo',
    drugs: ['Lisinopril 10 mg', 'Amlodipine 5 mg']
  };

  const quickActions = [
    { label: 'Dossier Médical', sub: 'Analyses & radiologies', href: '/patient/records',    icon: FileText,     color: 'bg-blue-50 text-blue-700 border-blue-200'  },
    { label: 'Ordonnances',     sub: 'QR Code pharmacie',      href: '/patient/prescriptions', icon: Pill,       color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { label: 'Rendez-vous',     sub: 'Planifier & modifier',   href: '/patient/appointments', icon: Calendar,    color: 'bg-teal-50 text-teal-700 border-teal-200'  },
    { label: 'Mon Profil',      sub: 'Infos personnelles',     href: '/patient/profile',      icon: User,        color: 'bg-slate-100 text-slate-700 border-slate-200' },
  ];

  return (
    <div className="flex flex-col min-h-full w-full bg-slate-50 text-slate-900">

      {/* ─── Mobile Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3.5 flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            S+
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 block leading-tight">Sunu Santé</span>
            <span className="text-[10px] text-teal-700 font-medium uppercase tracking-wide">Espace Patient</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
          </button>
          <Link href="/patient/profile" className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
            <User className="h-4 w-4 text-slate-500" />
          </Link>
        </div>
      </header>

      {/* ─── Main Grid ─────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">

        {/* ══════════════════════════════════════════════════════
            LEFT COLUMN  (2/3 width on desktop)
        ══════════════════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-5">

          {/* ── Welcome / Patient ID Card ─────────────────────── */}
          <motion.div
            custom={0} variants={cardIn} initial="hidden" animate="show"
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 text-white p-5 sm:p-6 shadow-lg shadow-teal-600/20"
          >
            {/* Decorative circles */}
            <div className="absolute right-0 top-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute right-12 bottom-0 w-28 h-28 rounded-full bg-white/5 translate-y-1/2 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-teal-200 text-[11px] font-semibold uppercase tracking-widest mb-1">Bonjour 👋</p>
                  <h1 className="text-2xl font-bold tracking-tight">{firstName}</h1>
                  <p className="text-teal-200 text-xs mt-0.5">{activeName} · {age} ans · {gender === 'M' ? 'Homme' : 'Femme'}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-xs font-bold border border-white/20 backdrop-blur-sm">
                    <HeartPulse className="w-3 h-3" />
                    Groupe {bloodGroup}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-[10px] font-semibold border border-white/20">
                    <ShieldCheck className="w-3 h-3" />
                    {vitalId}
                  </span>
                </div>
              </div>

              {/* Vitals strip */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20">
                <div>
                  <p className="text-teal-200 text-[10px] font-semibold uppercase tracking-wider">Allergie</p>
                  <p className="text-sm font-bold mt-0.5 truncate">{allergies}</p>
                </div>
                <div>
                  <p className="text-teal-200 text-[10px] font-semibold uppercase tracking-wider">Prochain RDV</p>
                  <p className="text-sm font-bold mt-0.5">{nextRdv.date}</p>
                </div>
                <div>
                  <p className="text-teal-200 text-[10px] font-semibold uppercase tracking-wider">Ordonnances</p>
                  <p className="text-sm font-bold mt-0.5">2 actives</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Quick Actions Grid ────────────────────────────── */}
          <motion.section custom={1} variants={cardIn} initial="hidden" animate="show">
            <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600" />
              Services Médicaux
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link key={i} href={action.href}
                    className="group p-4 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md hover:shadow-teal-500/10 transition-all duration-200 flex flex-col gap-3"
                  >
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${action.color} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-tight">{action.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{action.sub}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.section>

          {/* ── Next Appointment ──────────────────────────────── */}
          <motion.section custom={2} variants={cardIn} initial="hidden" animate="show">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" />
                Prochain Rendez-vous
              </h2>
              <Link href="/patient/appointments" className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-0.5 hover:underline">
                Tout voir <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4 hover:border-teal-300 hover:shadow-sm transition-all">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">{nextRdv.doctor}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{nextRdv.specialty}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{nextRdv.lieu}</p>
                </div>
                <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  Confirmé
                </span>
              </div>

              <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-teal-500" />
                  <span>{nextRdv.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{nextRdv.time}</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ── Last Prescription ─────────────────────────────── */}
          <motion.section custom={3} variants={cardIn} initial="hidden" animate="show">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-purple-600" />
                Dernière Ordonnance
              </h2>
              <Link href="/patient/prescriptions" className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-0.5 hover:underline">
                Voir QR Code <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-purple-200 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-3.5 pb-3.5 border-b border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-800">Prescrit par {lastPrescription.doctor}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Le {lastPrescription.date}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                  <QrCode className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2">
                {lastPrescription.drugs.map((drug, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                    <span className="font-medium">{drug}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

        </div>

        {/* ══════════════════════════════════════════════════════
            RIGHT COLUMN  (1/3 width on desktop)
        ══════════════════════════════════════════════════════ */}
        <div className="space-y-5">

          {/* ── QR Code Dossier Médical ───────────────────────── */}
          <motion.div custom={1} variants={cardIn} initial="hidden" animate="show"
            className="bg-white rounded-2xl border border-slate-200 p-5 text-center space-y-4 hover:border-teal-300 hover:shadow-sm transition-all"
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mt-1">Mon QR Médical</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-[200px]">
                Présentez ce code à votre médecin pour partager votre dossier vital en admission.
              </p>
            </div>

            <div className="mx-auto w-[160px] h-[160px] bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden">
              <img
                src={qrUrl}
                alt="QR Code Dossier Médical Patient"
                width={160}
                height={160}
                className="w-full h-full object-contain p-1"
              />
            </div>

            <div className="flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-slate-700 tracking-wider">{vitalId}</span>
            </div>

            <a
              href={`http://localhost:3003/doctor/consultation?id=${vitalId}&name=${encodeURIComponent(activeName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-teal-700 font-semibold hover:underline"
            >
              Simuler le Scan
              <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>

          {/* ── SOS Urgence ──────────────────────────────────── */}
          <motion.div custom={2} variants={cardIn} initial="hidden" animate="show"
            className="bg-rose-50 rounded-2xl border border-rose-200 p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/30 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-800">Urgence Médicale</h3>
                <p className="text-[11px] text-rose-600 font-medium">Assistance immédiate 24/7</p>
              </div>
            </div>
            <Link
              href="/patient/emergency"
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-rose-600/30 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Activer SOS Urgence
            </Link>
          </motion.div>

          {/* ── Données de Santé ─────────────────────────────── */}
          <motion.div custom={3} variants={cardIn} initial="hidden" animate="show"
            className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3"
          >
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Données Vitales</h3>

            <div className="space-y-2.5">
              {[
                { label: 'Groupe Sanguin', value: bloodGroup, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
                { label: 'Allergies connues', value: allergies, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
                { label: 'ID Vital Sunu Santé', value: vitalId, color: 'text-teal-700 font-mono', bg: 'bg-teal-50 border-teal-100' },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-xl border ${item.bg}`}>
                  <span className="text-[11px] text-slate-600 font-medium">{item.label}</span>
                  <span className={`text-[11px] font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5 pt-1 text-[10px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Données chiffrées HDS & RGPD</span>
            </div>
          </motion.div>

          {/* ── Liens Rapides Desktop ─────────────────────────── */}
          <motion.div custom={4} variants={cardIn} initial="hidden" animate="show"
            className="hidden lg:block bg-white rounded-2xl border border-slate-200 overflow-hidden"
          >
            {[
              { label: 'Dossier Médical', href: '/patient/records', icon: FileText },
              { label: 'Mes Ordonnances', href: '/patient/prescriptions', icon: Pill },
              { label: 'Rendez-vous', href: '/patient/appointments', icon: Calendar },
              { label: 'Mon Profil', href: '/patient/profile', icon: User },
            ].map((link, i) => {
              const Icon = link.icon;
              return (
                <Link key={i} href={link.href}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group"
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                  <span className="text-xs font-semibold text-slate-700 flex-1">{link.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </motion.div>

        </div>
      </main>

      {/* ─── Mobile Bottom Navigation ──────────────────────────── */}
      <nav className="sticky bottom-0 z-40 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around lg:hidden">
        {[
          { href: '/patient/home',          icon: Activity,       label: 'Accueil',  active: true  },
          { href: '/patient/records',       icon: FileText,       label: 'Dossier',  active: false },
          { href: '/patient/appointments',  icon: Calendar,       label: 'RDV',      active: false },
          { href: '/patient/prescriptions', icon: Pill,           label: 'Ordonnances', active: false },
          { href: '/patient/profile',       icon: User,           label: 'Profil',   active: false },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <Link key={i} href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                item.active 
                  ? 'text-teal-700 bg-teal-50' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
