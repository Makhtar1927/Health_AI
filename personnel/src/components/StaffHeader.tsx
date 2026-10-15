'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { LogOut, ShieldCheck } from 'lucide-react';

import Image from 'next/image';

interface StaffHeaderProps {
  title: string;
  subtitle?: string;
  roleBadge: string;
  badgeColor?: string;
  icon: React.ReactNode;
}

export default function StaffHeader({
  title,
  subtitle = 'Health AI Clinique',
  roleBadge,
  badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200',
  icon,
}: StaffHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const displayName = user?.name || 'Professionnel';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-6 py-2.5 sm:py-3 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Branding & Role */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          {/* Logo officiel Health AI */}
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-1 shrink-0 overflow-hidden">
            <Image
              src="/HealthAI_symbole.png"
              alt="Health AI"
              width={34}
              height={34}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 shrink-0 hidden xs:flex">
              {icon}
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate tracking-tight">
                {title}
              </h1>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 font-medium">
                <span className="truncate">{subtitle}</span>
                <span className="hidden sm:inline">•</span>
                <span className={`hidden sm:inline-flex items-center px-1.5 py-0.2 rounded font-semibold border ${badgeColor}`}>
                  {roleBadge}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: User status & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold truncate max-w-[140px]">{displayName}</span>
          </div>

          <button
            onClick={handleLogout}
            title="Se déconnecter"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200/80 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
}
