'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/authStore';
import {
  Building2,
  Users,
  CalendarCheck,
  UserPlus,
  Clock,
  UserCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Radio,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Search,
  Phone,
  HelpCircle,
  Stethoscope
} from 'lucide-react';

interface ReceptionShellProps {
  children: React.ReactNode;
  onOpenNewPatientModal?: () => void;
  title?: string;
  subtitle?: string;
}

export type AgentStatus = 'available' | 'break' | 'closed';

export default function ReceptionShell({
  children,
  onOpenNewPatientModal,
  title,
  subtitle,
}: ReceptionShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, initialize } = useAuthStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('available');

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fermer le menu mobile lors des changements de page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.replace('/reception/login');
  };

  const agentName = user?.name || 'Fatou Sarr';
  const agentEmail = user?.email || 'fatou.sarr@healthai.sn';
  const agentDesk = user?.details?.desk || 'Guichet 1 — Accueil Central';
  const agentMatricule = user?.details?.matricule || 'MAT-8392-A';

  const navLinks = [
    {
      name: 'Tableau de bord',
      href: '/reception/dashboard',
      icon: CalendarCheck,
      badge: 'Direct',
      description: 'Admissions & flux patients du jour',
    },
    {
      name: "File d'attente",
      href: '/reception/waiting-room',
      icon: Users,
      badge: 'Temps réel',
      description: 'Supervision des salles & box',
    },
    {
      name: 'Mon Profil & Guichet',
      href: '/reception/profile',
      icon: UserCheck,
      description: 'Paramètres agent & permanence',
    },
  ];

  const getStatusBadge = () => {
    switch (agentStatus) {
      case 'available':
        return {
          label: 'Au guichet',
          color: 'bg-emerald-500',
          textColor: 'text-emerald-700',
          bg: 'bg-emerald-50 border-emerald-200',
        };
      case 'break':
        return {
          label: 'En pause',
          color: 'bg-amber-500',
          textColor: 'text-amber-700',
          bg: 'bg-amber-50 border-amber-200',
        };
      case 'closed':
        return {
          label: 'Guichet fermé',
          color: 'bg-rose-500',
          textColor: 'text-rose-700',
          bg: 'bg-rose-50 border-rose-200',
        };
    }
  };

  const statusConfig = getStatusBadge();

  const notifications = [
    {
      id: 1,
      title: 'Box 4 Médecin disponible',
      detail: 'Dr. Oumy Aidara est prête à recevoir le patient suivant.',
      time: 'Il y a 3 min',
      urgent: false,
    },
    {
      id: 2,
      title: 'Admission Prioritaire',
      detail: 'Arrivée signalée : patient asthmatique au Pavillon Urgences.',
      time: 'Il y a 10 min',
      urgent: true,
    },
    {
      id: 3,
      title: 'Ticket validé en caisse',
      detail: 'Patient Amadou Sall a réglé sa consultation.',
      time: 'Il y a 18 min',
      urgent: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      
      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 1. SIDEBAR DESKTOP (Fixée à gauche, visible sur lg et plus)             */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 xl:w-72 flex-col fixed inset-y-0 left-0 bg-white border-r border-slate-200/90 z-30 shadow-xs">
        
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-100">
          <div className="relative w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-1.5 shrink-0">
            <Image
              src="/HealthAI_symbole.png"
              alt="Health AI"
              width={34}
              height={34}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 tracking-tight text-base">Health</span>
              <span className="font-black text-blue-600 tracking-tight text-base">AI</span>
            </div>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest truncate">
              Espace Accueil & Réception
            </p>
          </div>
        </div>

        {/* Profil de l'agent connecté dans la sidebar */}
        <div className="p-4 mx-3 my-3 bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                {agentName.slice(0, 2).toUpperCase()}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${statusConfig.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-black text-slate-900 truncate">{agentName}</h4>
              <p className="text-[10px] text-slate-500 font-medium truncate">{agentDesk}</p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Statut :</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.bg} ${statusConfig.textColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.color}`} />
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Quick Action Button: Admettre Patient */}
        <div className="px-3 mb-2">
          <button
            onClick={() => {
              if (onOpenNewPatientModal) {
                onOpenNewPatientModal();
              } else {
                router.push('/reception/dashboard?action=new-patient');
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Admettre un Patient</span>
          </button>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            Gestion Quotidienne
          </p>

          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                    isActive ? 'bg-blue-200/60 text-blue-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-100 space-y-1">
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Liaisons Médicales
            </p>
            <Link
              href="/doctor/waiting-room"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all"
            >
              <Stethoscope className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Vue Box Consultation</span>
              <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
            </Link>
            <Link
              href="/cashier"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all"
            >
              <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">Guichet Caisse</span>
              <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
            </Link>
          </div>
        </nav>

        {/* Footer Sidebar : Déconnexion & Version */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 active:bg-rose-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">Session</span>
          </button>
          <div className="mt-2 text-center text-[10px] text-slate-400">
            Health AI v2.4 • Hôpital Partenaire
          </div>
        </div>
      </aside>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 2. TOPBAR HEADER (Fixe / Sticky sur tous les écrans)                   */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 lg:pl-64 xl:pl-72 transition-all shadow-xs">
        <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          
          {/* Left: Hamburger mobile + Titre / Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger Button pour mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo visible sur mobile uniquement */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-center p-1 shrink-0">
                <Image
                  src="/HealthAI_symbole.png"
                  alt="Health AI"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-black text-slate-900 text-sm tracking-tight">Health AI</span>
            </div>

            {/* Titre & Breadcrumb desktop */}
            <div className="hidden sm:block min-w-0">
              <h1 className="text-sm md:text-base font-black text-slate-900 tracking-tight truncate">
                {title || (pathname === '/reception/dashboard' ? 'Tableau de Bord des Admissions' :
                  pathname === '/reception/waiting-room' ? "Supervision de la Salle d'Attente" :
                  pathname === '/reception/profile' ? "Profil de l'Agent d'Accueil" : 'Espace Réception')}
              </h1>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                <span className="truncate">{subtitle || 'Centre Hospitalier National Dalal Jamm'}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200 text-[10px]">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  Flux direct
                </span>
              </div>
            </div>
          </div>

          {/* Right: Recherche rapide + Notifications + Profil Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Bouton Action Rapide Mobile */}
            <button
              onClick={() => {
                if (onOpenNewPatientModal) {
                  onOpenNewPatientModal();
                } else {
                  router.push('/reception/dashboard?action=new-patient');
                }
              }}
              className="lg:hidden p-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
              title="Admettre un patient"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden xs:inline">Admettre</span>
            </button>

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 text-left"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-blue-600" />
                        <h4 className="text-xs font-black text-slate-900">Notifications Accueil</h4>
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        {notifications.length} nouvelles
                      </span>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl border text-xs transition-colors ${
                            n.urgent
                              ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                              : 'bg-slate-50 border-slate-100 hover:bg-slate-100/70 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-xs">{n.title}</h5>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-snug">{n.detail}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 text-center">
                      <Link
                        href="/reception/waiting-room"
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
                      >
                        Voir toute la salle d'attente →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu Profil Déroulant (Top Right) */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {agentName.slice(0, 2).toUpperCase()}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${statusConfig.color}`} />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-black text-slate-900 leading-tight truncate max-w-[120px]">
                    {agentName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium leading-tight">
                    {agentDesk.split('—')[0].trim()}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 text-left"
                  >
                    {/* Header Profil Dropdown */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                          {agentName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-slate-900 truncate">{agentName}</h4>
                          <p className="text-[10px] text-slate-500 truncate">{agentEmail}</p>
                          <span className="inline-block mt-0.5 text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            {agentMatricule}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Statut Toggle */}
                    <div className="mb-2 p-2 rounded-xl border border-slate-100 bg-white">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Disponibilité Guichet
                      </p>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => setAgentStatus('available')}
                          className={`py-1 px-1.5 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer ${
                            agentStatus === 'available'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-black'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          🟢 Au poste
                        </button>
                        <button
                          onClick={() => setAgentStatus('break')}
                          className={`py-1 px-1.5 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer ${
                            agentStatus === 'break'
                              ? 'bg-amber-50 text-amber-700 border border-amber-300 font-black'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          🟡 En pause
                        </button>
                        <button
                          onClick={() => setAgentStatus('closed')}
                          className={`py-1 px-1.5 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer ${
                            agentStatus === 'closed'
                              ? 'bg-rose-50 text-rose-700 border border-rose-300 font-black'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          🔴 Fermé
                        </button>
                      </div>
                    </div>

                    {/* Liens du Menu */}
                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      <Link
                        href="/reception/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <UserCheck className="w-4 h-4 text-blue-600" />
                        <span>Mon Profil & Guichet</span>
                      </Link>

                      <Link
                        href="/"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>Portail Général Health AI</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </header>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 3. MOBILE DRAWER (Menu latéral déroulant sur smartphone & tablette)     */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-2xl flex flex-col"
            >
              {/* Header Drawer */}
              <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-1.5 shrink-0">
                    <Image
                      src="/HealthAI_symbole.png"
                      alt="Health AI"
                      width={28}
                      height={28}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm tracking-tight">Health AI</h3>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Accueil & Admissions</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profil Drawer */}
              <div className="p-4 mx-3 my-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    {agentName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-900 truncate">{agentName}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{agentDesk}</p>
                    <span className="text-[9px] font-bold text-blue-600">{agentMatricule}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Drawer */}
              <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
                {navLinks.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenNewPatientModal) {
                        onOpenNewPatientModal();
                      } else {
                        router.push('/reception/dashboard?action=new-patient');
                      }
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
                  >
                    <UserPlus className="w-4 h-4" />
                    Admettre un Patient
                  </button>
                </div>
              </nav>

              {/* Footer Drawer */}
              <div className="p-3 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 4. MAIN CONTENT (Avec marge à gauche pour la sidebar sur desktop)       */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <main className="flex-1 lg:pl-64 xl:pl-72 pb-24 lg:pb-8 flex flex-col">
        {children}
      </main>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 5. BOTTOM NAVIGATION BAR (Visible uniquement sur mobile / écran < lg)  */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-4 z-30 shadow-lg">
        <div className="flex items-center justify-around">
          
          {/* 1. Dashboard */}
          <Link
            href="/reception/dashboard"
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              pathname === '/reception/dashboard' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <CalendarCheck className="w-5 h-5" />
            <span>Admissions</span>
          </Link>

          {/* 2. File d'attente */}
          <Link
            href="/reception/waiting-room"
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              pathname === '/reception/waiting-room' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>File Box</span>
          </Link>

          {/* 3. Action Centrale + Nouveau Patient */}
          <button
            onClick={() => {
              if (onOpenNewPatientModal) {
                onOpenNewPatientModal();
              } else {
                router.push('/reception/dashboard?action=new-patient');
              }
            }}
            className="flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
            aria-label="Nouveau patient"
          >
            <UserPlus className="w-6 h-6" />
          </button>

          {/* 4. Profil Agent */}
          <Link
            href="/reception/profile"
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              pathname === '/reception/profile' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <UserCheck className="w-5 h-5" />
            <span>Profil</span>
          </Link>

          {/* 5. Menu Drawer */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600"
          >
            <Menu className="w-5 h-5" />
            <span>Menu</span>
          </button>

        </div>
      </div>

    </div>
  );
}
