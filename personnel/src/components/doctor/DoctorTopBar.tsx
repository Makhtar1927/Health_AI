'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import {
  Bell,
  LogOut,
  ChevronDown,
  Building2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User,
  Activity
} from 'lucide-react';

interface DoctorTopBarProps {
  onSearch?: (query: string) => void;
}

export default function DoctorTopBar({ onSearch }: DoctorTopBarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [doctorStatus, setDoctorStatus] = useState<'available' | 'in_consultation' | 'busy' | 'break'>('in_consultation');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const statusMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target as Node)) {
        setShowStatusMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const doctorFullName = user?.name ? (user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`) : 'Dr. Oumy Aidara';
  const doctorShortName = doctorFullName.split(' ').slice(0, 2).join(' ');
  const hospitalName = user?.details?.hospital || 'Hôpital Principal de Dakar';
  const departmentName = user?.details?.department || 'Médecine Générale & Urgences';

  const statusConfigs = {
    available: { label: 'Disponible', dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    in_consultation: { label: 'En Consultation', dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    busy: { label: 'Urgences', dot: 'bg-rose-500', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
    break: { label: 'En Pause', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' }
  };

  const notifications = [
    { id: 1, title: 'Alerte Constantes (Inf. Sow)', time: '5 min', desc: 'SpO2 à 92% pour Sokhna Fall (Ch. 112)', type: 'urgent' },
    { id: 2, title: 'Cliché PACS Disponible', time: '12 min', desc: 'Radio thoracique de Cheikh T. Diop prête', type: 'info' },
    { id: 3, title: 'Nouvelle Admission', time: '20 min', desc: 'Amadou Sall orienté vers votre box', type: 'normal' }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 h-14 sm:h-16 flex items-center shadow-[0_1px_4px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2 sm:gap-4">
          
          {/* ── Left: Branding ────────────────────────────────────────── */}
          <Link href="/doctor/dashboard" className="flex items-center gap-2.5 min-w-0 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              H+
            </div>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight block">Health AI</span>
                <span className="hidden sm:inline-block text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  MÉDECIN
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate max-w-[140px] sm:max-w-[220px]">
                {hospitalName}
              </p>
            </div>
          </Link>

          {/* ── Center: Clinical Department Tag (Desktop only) ───────── */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate max-w-[280px]">{departmentName}</span>
          </div>

          {/* ── Right Actions: Status Pill + Bell + Profile + Déconnexion ── */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* 1. Statut Clinique Pill */}
            <div className="relative" ref={statusMenuRef}>
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`flex items-center gap-1.5 pl-2 pr-2 sm:pr-2.5 py-1 rounded-full border text-[11px] font-bold cursor-pointer transition-all active:scale-95 shadow-xs ${statusConfigs[doctorStatus].badge}`}
                title="Changer de statut clinique"
              >
                <span className={`w-2 h-2 rounded-full ${statusConfigs[doctorStatus].dot} animate-pulse shrink-0`} />
                <span className="hidden sm:inline">{statusConfigs[doctorStatus].label}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showStatusMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                  <p className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Statut du Médecin
                  </p>
                  {(Object.keys(statusConfigs) as Array<keyof typeof statusConfigs>).map((key) => {
                    const cfg = statusConfigs[key];
                    const isSelected = doctorStatus === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setDoctorStatus(key);
                          setShowStatusMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left font-medium transition-colors cursor-pointer ${
                          isSelected ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                          <span>{cfg.label}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Notification Bell Circle */}
            <div className="relative" ref={notifMenuRef}>
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Alertes cliniques"
                title="Alertes cliniques"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="font-bold text-xs text-slate-900">Alertes Service Clinique</span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                      3 récentes
                    </span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2 rounded-xl border text-xs space-y-0.5 ${
                          n.type === 'urgent'
                            ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className="flex items-center gap-1.5 truncate">
                            {n.type === 'urgent' && <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                            <span className="truncate">{n.title}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Profil Médecin Pill (Lien direct vers la page Profil) */}
            <Link
              href="/doctor/profile"
              className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-slate-800 transition-all active:scale-95 shadow-xs cursor-pointer"
              title="Gérer mon profil praticien"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                {doctorFullName.replace('Dr. ', '')[0] || 'D'}
              </div>
              <span className="truncate max-w-[85px] xs:max-w-[120px] sm:max-w-[140px]">
                {doctorShortName}
              </span>
            </Link>

            {/* 4. Bouton Déconnexion Direct */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-600 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
              title="Se déconnecter"
              aria-label="Se déconnecter"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quitter</span>
            </button>

          </div>

        </div>
      </header>
    </>
  );
}
