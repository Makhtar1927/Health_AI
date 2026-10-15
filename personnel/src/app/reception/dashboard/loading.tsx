'use client';

import Image from 'next/image';

export default function ReceptionDashboardLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 animate-in fade-in duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center gap-8 z-10">
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex w-28 h-28 rounded-full bg-blue-400/20 animate-ping" style={{ animationDuration: '1.8s' }} />
          <span className="absolute inline-flex w-24 h-24 rounded-full bg-indigo-500/15 animate-ping" style={{ animationDuration: '2.2s', animationDelay: '0.4s' }} />

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

          <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md z-20 border border-white">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Health <span className="text-blue-600">AI</span>
          </h1>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-full px-3 py-0.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Mise à jour des files d'attente</span>
          </div>
        </div>

        <div className="w-52 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 rounded-full sa-loading-bar" />
        </div>

        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-blue-500"
              style={{
                animation: `sa-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <p className="absolute bottom-8 text-[11px] text-slate-500 font-medium tracking-wide flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" clipRule="evenodd" />
        </svg>
        SYNCHRONISATION ACCUEIL · CAISSE · SALLE D'ATTENTE
      </p>
    </div>
  );
}
