'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Pill,
  Package,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  QrCode,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Users,
  CreditCard,
  Stethoscope,
  CheckCircle2,
  Clock,
  ScanLine
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

interface PharmacyShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onQuickAction?: () => void;
  quickActionLabel?: string;
}

export default function PharmacyShell({
  children,
  title,
  subtitle,
  onQuickAction,
  quickActionLabel = "Scanner Ordonnance"
}: PharmacyShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, initialize } = useAuthStore();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [pharmacyStatus, setPharmacyStatus] = useState<'OPEN' | 'INVENTORY' | 'CLOSED'>('OPEN');

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Fermer le drawer mobile lors des changements de page
  useEffect(() => {
    setMobileDrawerOpen(false);
    setProfileDropdownOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  const activeUser = user || {
    name: "Dr. Babacar Diagne",
    email: "pharmacien@healthai.sn",
    role: "pharmacist",
    details: {
      rpps: "RPPS-849204",
      pharmacyName: "Pharmacie Centrale Health AI",
      city: "Dakar"
    }
  };

  const navItems = [
    {
      label: 'Tableau de bord',
      href: '/pharmacist/dashboard',
      icon: LayoutDashboard,
      badge: 'Direct'
    },
    {
      label: 'Délivrance & Ordonnances',
      href: '/pharmacist/dispense',
      icon: Pill,
      badge: '2 en attente'
    },
    {
      label: 'Stocks & Inventaire',
      href: '/pharmacist/inventory',
      icon: Package,
      badge: 'Alertes'
    },
    {
      label: 'Profil & Officine',
      href: '/pharmacist/profile',
      icon: User
    }
  ];

  const handleLogout = () => {
    logout();
    router.push('/pharmacist/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-violet-100 selection:text-violet-900">
      
      {/* ========================================================================= */}
      {/* 1. TOPBAR RESPONSIVE                                                      */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-xs">
        
        {/* Partie gauche : Hamburger mobile + Identité / Titre */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/pharmacist/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform">
              <Image
                src="/HealthAI_symbole.png"
                alt="Health AI"
                width={28}
                height={28}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight text-slate-900">Health AI</span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200/80">
                  Pharmacie
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Officine & Délivrance Sécurisée</p>
            </div>
          </Link>

          {/* Séparateur & Titre dynamique sur grand écran */}
          <div className="hidden xl:flex items-center pl-4 border-l border-slate-200">
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 leading-tight">{title}</h1>
              {subtitle && <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>}
            </div>
          </div>
        </div>

        {/* Partie droite : Statut officine, Notifications & Dropdown Profil */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Badge de statut de l'officine */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
            <span className={`w-2 h-2 rounded-full ${
              pharmacyStatus === 'OPEN' 
                ? 'bg-emerald-500 animate-pulse' 
                : pharmacyStatus === 'INVENTORY' 
                ? 'bg-amber-500' 
                : 'bg-rose-500'
            }`} />
            <span className="font-extrabold text-slate-700 text-[11px]">
              {pharmacyStatus === 'OPEN' && 'Officine Ouverte'}
              {pharmacyStatus === 'INVENTORY' && 'Inventaire en cours'}
              {pharmacyStatus === 'CLOSED' && 'Guichet Fermé'}
            </span>
          </div>

          {/* Raccourci rapide sur desktop */}
          {onQuickAction && (
            <button
              onClick={onQuickAction}
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-extrabold shadow-sm shadow-violet-600/20 transition-all cursor-pointer"
            >
              <ScanLine className="h-3.5 w-3.5" />
              {quickActionLabel}
            </button>
          )}

          {/* Bouton Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileDropdownOpen(false);
              }}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-600 ring-2 ring-white" />
            </button>

            {/* Popover notifications */}
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200/90 shadow-xl p-4 z-50 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-extrabold text-slate-900">Notifications Pharmacie</span>
                    <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                      2 nouvelles
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-violet-50/70 border border-violet-100/80">
                      <p className="font-extrabold text-violet-950 text-[11px]">Nouvelle ordonnance télétransmise</p>
                      <p className="text-[10px] text-violet-800 mt-0.5">Dr. Awa Ndiaye &bull; Patient Awa Ndiaye (Amoxicilline 500mg)</p>
                      <span className="text-[9px] text-violet-600 font-semibold block mt-1">Il y a 3 minutes</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100/80">
                      <p className="font-extrabold text-amber-950 text-[11px]">Alerte Stock Seuil Critique</p>
                      <p className="text-[10px] text-amber-800 mt-0.5">Salbutamol 100µg aérosol (reste 4 flacons)</p>
                      <span className="text-[9px] text-amber-600 font-semibold block mt-1">Il y a 25 minutes</span>
                    </div>
                  </div>

                  <Link
                    href="/pharmacist/dispense"
                    className="block text-center text-[11px] font-extrabold text-violet-600 hover:text-violet-700 pt-1"
                  >
                    Voir toutes les ordonnances &rarr;
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dropdown Menu Profil Caissier / Pharmacien */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                {activeUser.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-extrabold text-slate-800 block leading-tight">{activeUser.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">Pharmacien Titulaire</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Popover profil */}
            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200/90 shadow-xl p-3 z-50 space-y-3"
                >
                  <div className="px-2 py-1.5 border-b border-slate-100">
                    <p className="text-xs font-black text-slate-900">{activeUser.name}</p>
                    <p className="text-[10px] text-slate-500">{activeUser.email}</p>
                    <p className="text-[10px] font-semibold text-violet-700 mt-1">
                      {activeUser.details?.pharmacyName || "Pharmacie Centrale"}
                    </p>
                  </div>

                  {/* Toggle état officine */}
                  <div className="px-2 space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Disponibilité Officine
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        type="button"
                        onClick={() => setPharmacyStatus('OPEN')}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer ${
                          pharmacyStatus === 'OPEN'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        🟢 Ouvert
                      </button>
                      <button
                        type="button"
                        onClick={() => setPharmacyStatus('INVENTORY')}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer ${
                          pharmacyStatus === 'INVENTORY'
                            ? 'bg-amber-50 text-amber-800 border border-amber-300'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        🟡 Inventaire
                      </button>
                      <button
                        type="button"
                        onClick={() => setPharmacyStatus('CLOSED')}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer ${
                          pharmacyStatus === 'CLOSED'
                            ? 'bg-rose-50 text-rose-800 border border-rose-300'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        🔴 Fermé
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    <Link
                      href="/pharmacist/profile"
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      Fiche & Paramètres Officine
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 text-rose-500" />
                      Déconnexion de l&apos;officine
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </header>

      {/* ========================================================================= */}
      {/* 2. BODY AVEC SIDEBAR DESKTOP + CONTENU PRINCIPAL                          */}
      {/* ========================================================================= */}
      <div className="flex-1 flex w-full">
        
        {/* SIDEBAR DESKTOP */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white border-r border-slate-200/90 p-5 shrink-0 justify-between">
          <div className="space-y-6">
            
            {/* Profil Pharmacien en Sidebar */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                {activeUser.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-black text-slate-900 block truncate">{activeUser.name}</span>
                <span className="text-[10px] text-slate-500 block truncate">{activeUser.details?.rpps || "RPPS-849204"}</span>
                <span className="text-[9px] font-extrabold text-violet-700 uppercase tracking-wider block mt-0.5">
                  {activeUser.details?.pharmacyName || "Pharmacie Centrale"}
                </span>
              </div>
            </div>

            {/* Raccourci Scanner Ordonnance */}
            <Link
              href="/pharmacist/dispense"
              className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-violet-600/20 transition-all cursor-pointer group"
            >
              <QrCode className="h-4 w-4 group-hover:scale-110 transition-transform" />
              Scanner une Ordonnance
            </Link>

            {/* Navigation principale */}
            <nav className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block">
                Gestion Officine
              </span>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                      isActive
                        ? 'bg-violet-50 text-violet-900 border border-violet-200/80 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-violet-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-violet-200/60 text-violet-900'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Encart Alertes Stock */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-extrabold text-amber-950">Seuils Critiques</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                2 médicaments en rupture imminente. Réassort grossiste conseillé.
              </p>
              <Link
                href="/pharmacist/inventory"
                className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-900 hover:underline"
              >
                Gérer les stocks &rarr;
              </Link>
            </div>

            {/* Liaisons transversales cliniques */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block">
                Liaisons Cliniques
              </span>
              <Link
                href="/reception/dashboard"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="h-3.5 w-3.5 text-blue-500" />
                  <span>Accueil Réception</span>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-300" />
              </Link>
              <Link
                href="/cashier/dashboard"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Espace Caisse</span>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-300" />
              </Link>
              <Link
                href="/doctor/dashboard"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Stethoscope className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Consultation Médecin</span>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-300" />
              </Link>
            </div>

          </div>

          {/* Bas de sidebar : Déconnexion */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Quitter l&apos;officine</span>
            </button>
          </div>
        </aside>

        {/* CONTENU PRINCIPAL DYNAMIQUE */}
        <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
          {children}
        </main>

      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE DRAWER ANIMÉ                                                    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            {/* Backdrop sombre flouté */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 lg:hidden"
            />

            {/* Panneau coulissant */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 p-6 flex flex-col justify-between shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="space-y-6">
                
                {/* En-tête drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1 shadow-xs">
                      <Image
                        src="/HealthAI_symbole.png"
                        alt="Health AI"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <span className="text-sm font-black text-slate-900 block leading-tight">Health AI</span>
                      <span className="text-[10px] font-bold text-violet-600">Espace Pharmacie</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Profil Drawer */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                    {activeUser.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">{activeUser.name}</span>
                    <span className="text-[10px] text-slate-500">{activeUser.details?.pharmacyName || "Pharmacie Centrale"}</span>
                  </div>
                </div>

                {/* Liens navigation */}
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                          isActive
                            ? 'bg-violet-50 text-violet-900 border border-violet-200'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${isActive ? 'text-violet-600' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>

                {/* Liaisons médicales dans mobile drawer */}
                <div className="space-y-1 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block">
                    Passerelles
                  </span>
                  <Link
                    href="/reception/dashboard"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
                  >
                    <Users className="h-3.5 w-3.5 text-blue-500" />
                    <span>Accueil Réception</span>
                  </Link>
                  <Link
                    href="/cashier/dashboard"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
                  >
                    <CreditCard className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Espace Caisse</span>
                  </Link>
                  <Link
                    href="/doctor/dashboard"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
                  >
                    <Stethoscope className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Consultation Médecin</span>
                  </Link>
                </div>

              </div>

              {/* Déconnexion drawer */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50/80 hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Fermer la session</span>
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. BOTTOM NAVBAR MOBILE                                                   */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-1.5 flex items-center justify-around shadow-lg">
        <Link
          href="/pharmacist/dashboard"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            pathname === '/pharmacist/dashboard' ? 'text-violet-600' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="h-4 w-4 mb-0.5" />
          <span>Accueil</span>
        </Link>

        <Link
          href="/pharmacist/dispense"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            pathname === '/pharmacist/dispense' ? 'text-violet-600' : 'text-slate-500'
          }`}
        >
          <Pill className="h-4 w-4 mb-0.5" />
          <span>Délivrance</span>
        </Link>

        {/* Bouton Scanner Central Flottant */}
        <Link
          href="/pharmacist/dispense"
          className="-mt-5 w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-violet-600/30 hover:scale-105 active:scale-95 transition-transform"
          aria-label="Scanner une ordonnance"
        >
          <QrCode className="h-5 w-5" />
        </Link>

        <Link
          href="/pharmacist/inventory"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            pathname === '/pharmacist/inventory' ? 'text-violet-600' : 'text-slate-500'
          }`}
        >
          <Package className="h-4 w-4 mb-0.5" />
          <span>Stock</span>
        </Link>

        <Link
          href="/pharmacist/profile"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            pathname === '/pharmacist/profile' ? 'text-violet-600' : 'text-slate-500'
          }`}
        >
          <User className="h-4 w-4 mb-0.5" />
          <span>Profil</span>
        </Link>
      </div>

    </div>
  );
}
