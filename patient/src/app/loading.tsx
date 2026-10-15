import Image from 'next/image';

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/40 to-slate-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-teal-600/10 blur-3xl" />
      </div>
      <div className="relative flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex w-28 h-28 rounded-full bg-teal-400/20 animate-ping" style={{ animationDuration: '1.6s' }} />
          <span className="absolute inline-flex w-24 h-24 rounded-full bg-teal-500/15 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.4s' }} />
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-2xl border border-slate-200/80 flex items-center justify-center p-2 z-10">
            <Image src="/HealthAI_symbole.png" alt="Health AI" width={64} height={64} className="w-full h-full object-contain" priority />
          </div>
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Health <span className="text-teal-600">AI</span></h1>
          <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Votre santé, notre priorité</p>
        </div>
        <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full" style={{ animation: 'loading-slide 1.8s ease-in-out infinite' }} />
        </div>
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-2 h-2 rounded-full bg-teal-500" style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      </div>
      <p className="absolute bottom-8 text-[11px] text-slate-400 font-medium tracking-wide flex items-center gap-1.5">
        <svg className="w-3 h-3 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        Données chiffrées · Sécurisé HDS
      </p>
    </div>
  );
}
