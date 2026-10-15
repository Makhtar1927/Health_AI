'use client';

import Image from 'next/image';
import { Shield, Sparkles, Building2 } from 'lucide-react';

export default function AdminPharmacyLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-violet-50/40 to-slate-100 animate-in fade-in duration-300">
      
      {/* Halos décoratifs lumineux */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-400/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-fuchsia-400/15 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-emerald-200/20 blur-2xl" />
      </div>

      {/* Conteneur central */}
      <div className="relative flex flex-col items-center gap-8 z-10">
        
        {/* Logo animé — Pulsation douce */}
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex w-28 h-28 rounded-full bg-violet-400/20 animate-ping" style={{ animationDuration: '1.8s' }} />
          <span className="absolute inline-flex w-24 h-24 rounded-full bg-fuchsia-400/15 animate-ping" style={{ animationDuration: '2.2s', animationDelay: '0.4s' }} />

          {/* Logo principal blanc */}
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-2xl border border-slate-200/90 flex items-center justify-center p-2 z-10">
            <Image
              src="/HealthAI_symbole.png"
              alt="Health AI"
              width={64}
              height={64}
              className="w-full h-full object-contain"
              priority
            />
          </div>

          {/* Badge Direction Pharmacie */}
          <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-md z-20 border border-white">
            <Building2 className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Nom & Slogan */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Health <span className="text-violet-600">AI</span>
          </h1>
          <div className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-800 border border-violet-200 rounded-full px-3 py-0.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Direction Officine & Pharmacie</span>
          </div>
        </div>

        {/* Barre de progression animée */}
        <div className="w-52 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-500 rounded-full animate-pulse" />
        </div>

        {/* Points animés */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-violet-500"
              style={{
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Mention sécurité en bas */}
      <p className="absolute bottom-8 text-[11px] text-slate-500 font-medium tracking-wide flex items-center gap-1.5">
        <Shield className="w-3.5 h-3.5 text-violet-600" />
        CONSOLE DE GESTION & SUPERVISION DES ÉTABLISSEMENTS PHARMACEUTIQUES
      </p>
    </div>
  );
}
