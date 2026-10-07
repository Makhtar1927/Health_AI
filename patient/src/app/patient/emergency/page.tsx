'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  MapPin, 
  Phone, 
  User, 
  ArrowLeft, 
  Heart, 
  ShieldAlert,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function PatientEmergency() {
  const [sosStatus, setSosStatus] = useState<'idle' | 'countdown' | 'triggered'>('idle');
  const [countdown, setCountdown] = useState(5);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [fetchingGPS, setFetchingGPS] = useState(false);

  // Simuler la récupération GPS Dakar
  useEffect(() => {
    if (sosStatus === 'countdown' || sosStatus === 'triggered') {
      setFetchingGPS(true);
      const timer = setTimeout(() => {
        setCoords({ lat: 14.7167, lng: -17.4677 }); // Coordonnées de Dakar, Sénégal
        setFetchingGPS(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [sosStatus]);

  // Compte à rebours SOS
  useEffect(() => {
    let interval: any;
    if (sosStatus === 'countdown' && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (sosStatus === 'countdown' && countdown === 0) {
      setSosStatus('triggered');
    }
    return () => clearInterval(interval);
  }, [sosStatus, countdown]);

  const triggerSOS = () => {
    setCountdown(5);
    setSosStatus('countdown');
  };

  const cancelSOS = () => {
    setSosStatus('idle');
    setCountdown(5);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-slate-900 md:max-w-none md:mx-0 md:shadow-none md:border-0 md:bg-transparent md:h-full md:min-h-0 md:justify-start md:items-stretch md:text-slate-800 md:dark:text-slate-100 w-full overflow-hidden">
      
      {/* ========================================================================= */}
      {/* AMBIENT RADAR BACKDROP GLOWS (Active in countdown/triggered states)        */}
      {/* ========================================================================= */}
      {(sosStatus === 'countdown' || sosStatus === 'triggered') && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="absolute h-64 w-64 rounded-full border border-red-500/20 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute h-96 w-96 rounded-full border border-red-500/10 animate-ping" style={{ animationDuration: '4.5s', animationDelay: '1s' }} />
          <div className="absolute h-[500px] w-[500px] rounded-full border border-red-500/5 animate-ping" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          <div className="absolute h-[700px] w-[700px] rounded-full border border-red-500/5 animate-ping" style={{ animationDuration: '8s', animationDelay: '3s' }} />
          {/* Pulsing red background orb */}
          <div className="absolute h-[400px] w-[400px] rounded-full orb-glow-red blur-[120px] opacity-40 dark:opacity-60" />
        </div>
      )}

      {/* Mobile Header Bar (Hidden on desktop) */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-900 px-6 py-4 flex items-center gap-4 md:hidden w-full">
        <Link href="/patient/home" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
          <ArrowLeft className="h-4.5 w-4.5" />
        </Link>
        <div>
          <h1 className="text-base font-bold tracking-tight text-red-500">Urgence SOS</h1>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Alerte Médicale Dakar</p>
        </div>
      </header>

      {/* Main Container - Responsive split layout on desktop */}
      <main className="flex-grow px-6 py-8 flex flex-col justify-around items-center md:p-8 md:grid md:grid-cols-2 md:gap-8 md:items-center md:justify-items-center w-full relative z-10">

        {/* ========================================================================= */}
        {/* LEFT COLUMN: INTERACTIVE SOS PANEL                                        */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center justify-center w-full space-y-6 relative z-10">
          <AnimatePresence mode='wait'>
            {sosStatus === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-8 flex flex-col items-center w-full"
              >
                <div className="text-slate-400 dark:text-slate-500 max-w-xs text-sm font-medium leading-relaxed">
                  <ShieldAlert className="h-14 w-14 text-red-500/80 mx-auto mb-4 animate-pulse" />
                  <p>
                    Appuyez sur le bouton rouge ci-dessous en cas de danger vital ou d'accident. Une alerte instantanée sera transmise à l'accueil clinique de Sunu Santé.
                  </p>
                </div>

                {/* True 3D Neomorphic SOS Button with Active Indentation Shadow */}
                <motion.button
                  onClick={triggerSOS}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="h-48 w-48 lg:h-56 lg:w-56 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white flex flex-col items-center justify-center btn-3d-sos border-4 border-red-500/20 relative cursor-pointer select-none"
                >
                  <span className="font-black text-6xl tracking-tighter text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]">SOS</span>
                  <span className="text-[10px] font-black tracking-widest uppercase mt-3 text-red-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">Appuyer</span>
                </motion.button>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Le bouton nécessite une pression simple pour s'enclencher.</p>
              </motion.div>
            )}

            {sosStatus === 'countdown' && (
              <motion.div 
                key="countdown"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-6 flex flex-col items-center w-full"
              >
                <div className="text-red-500 font-black text-lg animate-pulse uppercase tracking-wider">
                  Déclenchement de l'alerte dans...
                </div>

                {/* Counting down circle - Styled as glowing neomorphic portal */}
                <div className="h-48 w-48 lg:h-56 lg:w-56 rounded-full bg-slate-900 dark:bg-slate-950 border-[8px] border-red-500 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)] relative">
                  <span className="font-black text-8xl text-red-500 tabular-nums drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]">{countdown}</span>
                </div>

                <button
                  onClick={cancelSOS}
                  className="w-full max-w-xs py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-200 dark:text-slate-100 font-black text-xs transition-colors uppercase tracking-widest border border-slate-700 dark:border-slate-800 cursor-pointer shadow-md"
                >
                  Annuler l'alerte
                </button>
              </motion.div>
            )}

            {sosStatus === 'triggered' && (
              <motion.div 
                key="triggered"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-6 flex flex-col items-center w-full"
              >
                <div className="h-16 w-16 rounded-2xl bg-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] border border-red-500/20">
                  <AlertTriangle className="h-9 w-9 text-white animate-bounce" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-black text-red-500 tracking-tight uppercase">ALERTE SIGNALÉE</h2>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-2 max-w-xs mx-auto leading-relaxed font-bold">
                    Le central clinique de Sunu Santé a reçu votre appel. Une équipe de réception prépare votre dossier et vous contacte immédiatement.
                  </p>
                </div>

                <button
                  onClick={cancelSOS}
                  className="w-full max-w-xs py-4 rounded-2xl bg-red-600/10 border border-red-500/25 hover:bg-red-600/20 font-black text-xs text-red-500 transition-all uppercase tracking-widest cursor-pointer"
                >
                  Terminer l'appel d'urgence
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: TELEMETRY & MEDICAL CONSTANTS                                */}
        {/* ========================================================================= */}
        <div className="w-full space-y-6 flex flex-col justify-center relative z-10">
          
          {/* Fake GPS Card - Translucent glass-premium */}
          {(sosStatus === 'countdown' || sosStatus === 'triggered') && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full glass-premium border border-red-500/20 dark:border-red-500/30 rounded-3xl p-5 text-left space-y-3 shadow-md"
            >
              <h3 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-red-500 animate-bounce" />
                Localisation d'Urgence Active
              </h3>
              {fetchingGPS ? (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                  <Loader2 className="h-4.5 w-4.5 animate-spin text-red-500" />
                  <span>Calcul des coordonnées satellite...</span>
                </div>
              ) : coords ? (
                <div className="font-bold">
                  <p className="text-sm text-slate-200 md:text-slate-800 md:dark:text-slate-100 font-black">Clinique Proche (Dakar Plateau)</p>
                  <p className="text-[11px] font-mono text-red-400 mt-1.5 bg-red-500/5 px-2.5 py-1 rounded-lg border border-red-500/10 max-w-max">Lat: {coords.lat} | Lng: {coords.lng}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-550">Calcul en cours...</p>
              )}
            </motion.div>
          )}

          {/* Life-Saving Medical Card (Rescuer View) - Frosted glass-premium */}
          <div className="w-full glass-premium border border-slate-200/40 dark:border-slate-800/80 rounded-3xl p-5 space-y-4 shadow-sm hover:border-red-500/10 dark:hover:border-red-500/25 transition-all">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              Fiche Médicale de Premier Secours
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-xs font-black">
              <div className="bg-white/40 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-200/30 dark:border-slate-850/60 shadow-inner">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 block mb-0.5 uppercase tracking-wider font-bold">Groupe Sanguin</span>
                <span className="text-red-500 font-black text-lg">O Rhésus + (O+)</span>
              </div>
              <div className="bg-white/40 dark:bg-slate-955/40 p-3 rounded-2xl border border-slate-200/30 dark:border-slate-850/60 shadow-inner">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 block mb-0.5 uppercase tracking-wider font-bold">Allergie Majeure</span>
                <span className="text-amber-500 font-black text-[11px] block truncate mt-1.5 uppercase">Pénicilline, Arachide</span>
              </div>
            </div>

            <div className="bg-white/40 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-slate-200/30 dark:border-slate-850/60 shadow-inner flex items-center justify-between text-xs font-bold">
              <div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 block mb-0.5 uppercase tracking-wider">Contact d'Urgence (Épouse)</span>
                <span className="font-black text-slate-800 dark:text-slate-100">Fatou Diop</span>
              </div>
              <a href="tel:+221770000000" className="h-9 w-9 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-500 flex items-center justify-center transition-colors border border-green-500/20">
                <Phone className="h-4.5 w-4.5 animate-pulse" />
              </a>
            </div>
          </div>

        </div>

      </main>

      {/* Mobile Footer - Hidden on desktop */}
      <footer className="text-center text-[10px] text-slate-600 py-6 border-t border-slate-900 md:hidden">
        Sunu Santé Sécurisé - Protocole d'Urgence SMS & GPS Automatisé.
      </footer>
    </div>
  );
}
