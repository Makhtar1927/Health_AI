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
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm animate-pulse">S+</div>
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
    { name: 'Accueil',         href: '/patient/home',          icon: Home },
    { name: 'Rendez-vous',     href: '/patient/appointments',  icon: Calendar },
    { name: 'Dossier Médical', href: '/patient/records',       icon: FileText },
    { name: 'Ordonnances',     href: '/patient/prescriptions', icon: Pill },
    { name: 'Mon Profil',      href: '/patient/profile',       icon: User },
    { name: 'SOS Urgences',    href: '/patient/emergency',     icon: AlertTriangle, isSos: true },
  ];

  const patientName = user?.name || 'Moussa Diop';
  const bloodGroup  = user?.details?.bloodGroup || 'O+';
  const vitalId     = user?.details?.vitalId || 'SN-807F16';

  const getPageTitle = () => {
    const active = navLinks.find(l => pathname === l.href);
    return active ? active.name : 'Mon Espace';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden">

      {/* ── Desktop Sidebar ───────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 h-screen bg-white border-r border-slate-200 flex-shrink-0 overflow-y-auto">
        
        {/* Logo */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold shadow-sm">
              S+
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">Sunu Santé</span>
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
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* ── Main content area ─────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:h-screen lg:overflow-y-auto">

        {/* Desktop header */}
        <header className="hidden lg:flex items-center justify-between bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">{getPageTitle()}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
            </button>
            <div className="h-8 w-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-sm">
              {patientName[0]}
            </div>
          </div>
        </header>

        {/* Page children */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>

    </div>
  );
}
