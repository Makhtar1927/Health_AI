'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { 
  Activity, 
  FileText, 
  AlertTriangle, 
  User, 
  Bell, 
  Calendar, 
  QrCode, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Pill,
  Home
} from 'lucide-react';
import HealthAILogo from '@/components/HealthAILogo';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, initialize, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initialize();
    setMounted(true);
  }, [initialize]);

  useEffect(() => {
    if (!mounted) return;
    // Redirect to root login if not authenticated and not on an auth page
    if (!isAuthenticated && pathname !== '/patient/login' && pathname !== '/patient/register') {
      router.push('/');
    }
  }, [mounted, isAuthenticated, pathname, router]);

  // Auth pages — render without sidebar layout
  const isAuthPage = pathname === '/patient/login' || pathname === '/patient/register';
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Prevent hydration mismatch: render neutral skeleton until client is ready
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <HealthAILogo size="lg" pulse />
          <p className="text-xs font-medium">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navLinks = [
    { name: 'Accueil',         shortName: 'Accueil',     href: '/patient/home',          icon: Home },
    { name: 'Rendez-vous',     shortName: 'RDV',         href: '/patient/appointments',  icon: Calendar },
    { name: 'Dossier Médical', shortName: 'Dossier',     href: '/patient/records',       icon: FileText },
    { name: 'Ordonnances',     shortName: 'Ordonnances', href: '/patient/prescriptions', icon: Pill },
    { name: 'Mon Profil',      shortName: 'Profil',      href: '/patient/profile',       icon: User, isProfile: true },
    { name: 'Notifications',   shortName: 'Alertes',     href: '/patient/notifications', icon: Bell, isBell: true },
    { name: 'SOS Urgences',    shortName: 'SOS',         href: '/patient/emergency',     icon: AlertTriangle, isSos: true },
  ];

  const patientName = user?.name || 'Moussa Diop';
  const firstName   = patientName.split(' ')[0] || patientName;
  const bloodGroup  = user?.details?.bloodGroup || 'O+';
  const vitalId     = user?.details?.vitalId || 'SN-807F16';

  const getPageTitle = () => {
    const active = navLinks.find(l => pathname === l.href);
    return active ? active.name : 'Mon Espace';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden">

      {/* ── Desktop Sidebar (Hidden on mobile) ────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 h-screen bg-white border-r border-slate-200 flex-shrink-0 overflow-y-auto">
        
        {/* Logo */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <HealthAILogo size="md" />
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">Health AI</span>
              <span className="text-[10px] text-teal-700 font-semibold uppercase tracking-wide">Espace Patient</span>
            </div>
          </div>
        </div>

        {/* Patient Profile Card */}
        <div className="mx-4 mt-4 p-3.5 rounded-xl bg-teal-50 border border-teal-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600/10 text-teal-700 flex items-center justify-center border border-teal-200 font-bold text-sm flex-shrink-0">
              {patientName[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{patientName}</p>
              <p className="text-[10px] text-teal-700 font-mono mt-0.5">{vitalId}</p>
            </div>
            <span className="ml-auto text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-lg flex-shrink-0">
              Gr. {bloodGroup}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            if (link.isSos) {
              return (
                <Link key={link.name} href={link.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                </Link>
              );
            }

            if (link.isBell) {
              return (
                <Link key={link.name} href={link.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : 'text-slate-600 hover:bg-slate-100 border border-transparent hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal-700' : ''}`} />
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 border border-white" />
                    </div>
                    <span>{link.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-teal-500" />}
                </Link>
              );
            }

            return (
              <Link key={link.name} href={link.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 border border-teal-200'
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal-700' : ''}`} />
                <span>{link.name}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-teal-500" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 px-1 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Données chiffrées HDS & RGPD</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 lg:h-screen lg:overflow-hidden relative">

        {/* ─── Mobile Sticky Top Bar (lg:hidden) ────────────────────────────── */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between lg:hidden flex-shrink-0 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <Link href="/patient/home" className="flex items-center gap-2.5 min-w-0">
            <HealthAILogo size="sm" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block leading-tight truncate">Health AI</span>
              <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider block truncate">
                {getPageTitle()}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/patient/emergency"
              className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition-all active:scale-95 shadow-xs"
              title="SOS Urgence"
            >
              <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-white animate-pulse" />
              </div>
              <span className="text-[11px] font-extrabold text-rose-700 tracking-wider">
                SOS
              </span>
            </Link>

            <Link
              href="/patient/notifications"
              className="relative w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300 flex items-center justify-center transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
            </Link>

            <Link 
              href="/patient/profile" 
              className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-teal-50/90 hover:bg-teal-100 border border-teal-200/80 transition-all active:scale-95 shadow-xs"
              title="Mon Profil"
            >
              <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[11px] shadow-xs relative flex-shrink-0">
                {patientName[0]}
                <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500 border border-white" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 max-w-[80px] truncate">
                {firstName}
              </span>
            </Link>
          </div>
        </header>

        {/* ─── Desktop Header (hidden lg:flex) ─────────────────────────────── */}
        <header className="hidden lg:flex items-center justify-between bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">{getPageTitle()}</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/patient/notifications" className="relative p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
            </Link>
            <Link 
              href="/patient/profile" 
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-teal-50/80 hover:bg-teal-100/80 border border-teal-200/70 transition-all shadow-xs"
              title="Mon Profil"
            >
              <div className="h-8 w-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs relative">
                {patientName[0]}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{patientName}</p>
                <p className="text-[10px] text-teal-700 font-mono leading-tight">{vitalId}</p>
              </div>
            </Link>
          </div>
        </header>

        {/* ─── Main Content: Natural document scroll on mobile, contained on desktop ─── */}
        <main key={pathname} className="flex-1 pb-28 lg:pb-0 lg:overflow-y-auto page-enter">
          {children}
        </main>

        {/* ─── Mobile Fixed Bottom Navigation Bar (lg:hidden) ──────────────── */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          {navLinks.filter(l => !l.isSos && !l.isBell && !l.isProfile).map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-teal-700 bg-teal-50/90 font-bold scale-102'
                    : 'text-slate-400 hover:text-slate-600 active:text-slate-800 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-teal-700 stroke-[2.25]' : 'text-slate-400 stroke-[1.75]'}`} />
                  {link.isBell && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 border border-white" />
                  )}
                </div>
                <span className="text-[10px] tracking-tight">{link.shortName}</span>
              </Link>
            );
          })}
        </nav>

      </div>

    </div>
  );
}
