'use client';

import React, { useEffect } from 'react';
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
  ExternalLink,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, initialize, logout } = useAuthStore();
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  useEffect(() => {
    initialize();
    
    // Theme initialization - Mode clair par defaut (Light First)
    const stored = localStorage.getItem('sunu-sante-theme') as 'light' | 'dark' | null;
    const initial = stored || 'light';
    setTheme(initial);
    if (initial === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [initialize]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('sunu-sante-theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Exclude login and register pages from being wrapped in the main dashboard layout
  const isAuthPage = pathname === '/patient/login' || pathname === '/patient/register';

  if (isAuthPage) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logout();
    router.push('/patient/login');
  };

  const navLinks = [
    { name: "Accueil", href: "/patient/home", icon: Activity },
    { name: "Rendez-vous", href: "/patient/appointments", icon: Calendar },
    { name: "Dossier Médical", href: "/patient/records", icon: FileText },
    { name: "Mes Ordonnances", href: "/patient/prescriptions", icon: QrCode },
    { name: "Mon Profil", href: "/patient/profile", icon: User },
    { name: "SOS Urgences", href: "/patient/emergency", icon: AlertTriangle, isSos: true },
  ];

  const patientName = user?.name || "Moussa Diop";
  const bloodGroup = user?.details?.bloodGroup || "O+";
  const vitalId = user?.details?.vitalId || "SN-807F16";

  // Determine current page title dynamically
  const getPageTitle = () => {
    const activeLink = navLinks.find(link => pathname === link.href);
    return activeLink ? activeLink.name : "Mon Espace";
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row md:h-screen md:overflow-hidden select-none">
      
      {/* ========================================================================= */}
      {/* CYBER-HEALTH GLOWING BACKDROPS (Desktop & Mobile)                        */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20vw] left-[-20vw] w-[50vw] h-[50vw] rounded-full orb-glow-cyan blur-[120px] opacity-60 dark:opacity-80" />
        <div className="absolute bottom-[-20vw] right-[-20vw] w-[50vw] h-[50vw] rounded-full orb-glow-indigo blur-[120px] opacity-60 dark:opacity-80" />
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR NAVIGATION (md and up) - Floating Glassmorphic Panel       */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col w-72 h-[calc(100vh-2rem)] sticky top-4 left-4 my-4 ml-4 rounded-[32px] glass-premium border border-slate-200/40 dark:border-slate-800/80 shadow-premium flex-shrink-0 justify-between p-6 z-50">
        
        <div className="space-y-6">
          {/* Clinic Branding with Glowing pulse */}
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/20 flex items-center justify-center text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Activity className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-800 dark:text-white leading-none">Sunu Santé</h1>
              <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-extrabold uppercase tracking-widest mt-1">Espace Patient</p>
            </div>
          </div>

          {/* Patient Quick Vital Profile Card - Styled beautifully */}
          <div className="p-4.5 rounded-2xl bg-white/20 dark:bg-slate-950/40 border border-white/40 dark:border-slate-850/60 space-y-4 relative overflow-hidden shadow-sm">
            {/* Ambient inner glow */}
            <div className="absolute right-[-10%] top-[-10%] w-20 h-20 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />
            
            <div className="flex justify-between items-center relative z-10">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Carte d'Identité</span>
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-500 dark:text-red-400 font-black text-[9px] border border-red-500/20 animate-pulse">
                Gr. {bloodGroup}
              </span>
            </div>

            <div className="relative z-10">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 truncate">{patientName}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-2 w-2 rounded-full bg-cyan-500 neon-pulse-cyan" />
                <span className="text-[9px] font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
                  {vitalId}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              if (link.isSos) {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 border ${
                      isActive 
                        ? 'bg-red-500/20 border-red-500/30 text-red-500 shadow-md shadow-red-500/5' 
                        : 'bg-red-500/5 hover:bg-red-500/10 border-transparent hover:border-red-500/10 text-red-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4.5 w-4.5 ${isActive ? 'animate-pulse' : ''}`} />
                      <span>{link.name}</span>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  </Link>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-300 border relative overflow-hidden ${
                    isActive
                      ? 'bg-cyan-500/10 dark:bg-cyan-500/20 border-cyan-500/20 text-cyan-500 shadow-sm'
                      : 'border-transparent hover:bg-white/40 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {/* Neon Cyan link active visual marker */}
                  {isActive && (
                    <span className="absolute left-0 top-1/4 h-1/2 w-1.5 rounded-r-lg bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                  )}
                  <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Operations */}
        <div className="space-y-4 pt-6 border-t border-slate-200/40 dark:border-slate-800/80">
          {/* Quick Doctor Consultation Simulator shortcut */}
          <a 
            href={`http://localhost:3003/doctor/consultation?id=${vitalId}&name=${encodeURIComponent(patientName)}&age=30&gender=M&reason=Consultation%20Dashboard`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/10 hover:border-cyan-500/20 text-[10px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider transition-all duration-200"
          >
            <span>Simuler Consultation</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-white transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Se déconnecter</span>
          </button>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER PANEL (Scrollable, adapts layouts)                       */}
      {/* ========================================================================= */}
      <div className="flex-grow flex flex-col min-h-screen md:h-screen md:overflow-y-auto relative z-10">
        
        {/* DESKTOP HEADER TOP BAR (md and up) - Styled translucently */}
        <header className="hidden md:flex items-center justify-between bg-white/45 dark:bg-slate-900/40 backdrop-blur-md border-b border-slate-200/40 dark:border-slate-800/80 px-8 py-5 flex-shrink-0 z-40 sticky top-0 shadow-sm shadow-slate-100/5">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">{getPageTitle()}</h2>
            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-[9px] font-bold text-cyan-600 dark:text-cyan-400">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-500" />
              <span>Dossier chiffré Blockchain actif</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Switcher Button */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800 border border-slate-200/40 dark:border-slate-850 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer shadow-sm"
              title={theme === 'light' ? 'Activer Mode Sombre' : 'Activer Mode Clair'}
            >
              {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>

            <button className="relative p-2.5 rounded-xl bg-white/50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800 border border-slate-200/40 dark:border-slate-850 hover:text-slate-800 dark:hover:text-white transition-all shadow-sm">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800" />

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{patientName}</p>
                <p className="text-[9px] font-mono text-slate-400 dark:text-slate-500">{vitalId}</p>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center border border-cyan-500/20 font-black text-sm shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                {patientName[0]}
              </div>
            </div>
          </div>
        </header>

        {/* LAYOUT CHILDREN CONTAINER */}
        <div className="flex-grow w-full flex flex-col relative max-w-md mx-auto md:max-w-none md:mx-0 bg-transparent md:h-full md:overflow-y-auto z-10">
          {children}
        </div>

      </div>

    </div>
  );
}
