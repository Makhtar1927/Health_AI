'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Stethoscope,
  Image as ImageIcon,
  Video,
  Users,
  Activity,
  FileText
} from 'lucide-react';

interface DoctorNavBarProps {
  waitingCount?: number;
  hasActiveConsultation?: boolean;
}

export default function DoctorNavBar({
  waitingCount = 4,
  hasActiveConsultation = false
}: DoctorNavBarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Tableau de Bord',
      shortLabel: 'Accueil',
      href: '/doctor/dashboard',
      icon: LayoutDashboard,
      badge: waitingCount > 0 ? waitingCount.toString() : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      label: 'Consultation Clinique',
      shortLabel: 'Consultation',
      href: '/doctor/consultation',
      icon: Stethoscope,
      badge: hasActiveConsultation ? 'Active' : undefined,
      badgeColor: 'bg-blue-100 text-blue-800 animate-pulse'
    },
    {
      label: 'Imagerie PACS & IA',
      shortLabel: 'Imagerie',
      href: '/doctor/imaging',
      icon: ImageIcon,
    },
    {
      label: 'Téléconsultations',
      shortLabel: 'Visio',
      href: '/doctor/telemedicine',
      icon: Video,
    },
    {
      label: 'Salle d\'Attente Clinique',
      shortLabel: 'Attente',
      href: '/doctor/waiting-room',
      icon: Users,
    }
  ];

  return (
    <>
      {/* ── Desktop Sub-Topbar Navigation ────────────────────────────── */}
      <nav className="hidden md:block bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-16 z-40 h-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white text-emerald-800' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── Mobile Fixed Bottom Navigation Bar ──────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 safe-area-pb">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                  isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600 stroke-[2.5]' : 'text-slate-500'}`} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight leading-none">
                  {item.shortLabel}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
