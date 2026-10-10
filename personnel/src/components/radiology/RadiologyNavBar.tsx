'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  QrCode,
  Sparkles,
  Upload,
  FileCheck,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

interface RadiologyNavBarProps {
  pendingCount?: number;
  onOpenScanner?: () => void;
}

export default function RadiologyNavBar({
  pendingCount = 3,
  onOpenScanner
}: RadiologyNavBarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Liste de Travail PACS',
      shortLabel: 'PACS',
      href: '/radiology/dashboard',
      icon: LayoutDashboard,
      badge: pendingCount > 0 ? pendingCount.toString() : undefined,
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      label: 'Scanner QR Code',
      shortLabel: 'Scan QR',
      href: '#scan',
      onClick: onOpenScanner,
      icon: QrCode,
      badge: 'Scan',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      label: 'Viewer PACS & IA',
      shortLabel: 'Viewer IA',
      href: '/radiology/viewer',
      icon: Sparkles,
    },
    {
      label: 'Téléverser Cliché',
      shortLabel: 'Upload',
      href: '/radiology/upload',
      icon: Upload,
    }
  ];

  return (
    <>
      {/* ── Desktop Sub-Topbar Navigation ────────────────────────────── */}
      <nav className="hidden md:block bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-14 sm:top-16 z-40 h-12 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              if (item.onClick) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.onClick}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all shrink-0 cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-purple-700" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-purple-700 text-white shadow-sm shadow-purple-700/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white text-purple-900' : item.badgeColor
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

            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative text-purple-700 hover:text-purple-900 cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight leading-none font-bold text-purple-800">
                    {item.shortLabel}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                  isActive ? 'text-purple-800 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-purple-700 stroke-[2.5]' : 'text-slate-500'}`} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-purple-700 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight leading-none">
                  {item.shortLabel}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-purple-700 mt-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
