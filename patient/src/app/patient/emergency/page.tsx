'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  MapPin, 
  Phone, 
  ShieldAlert,
  Loader2,
  HeartPulse,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Building2,
  User,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';

export default function PatientEmergency() {
  const { user, initialize } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [sosStatus, setSosStatus] = useState<'idle' | 'countdown' | 'triggered'>('idle');
  const [countdown, setCountdown] = useState(5);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [fetchingGPS, setFetchingGPS] = useState(false);

  useEffect(() => {
    initialize();
    setMounted(true);
  }, [initialize]);

  // Simulation GPS Dakar
  useEffect(() => {
    if (sosStatus === 'countdown' || sosStatus === 'triggered') {
      setFetchingGPS(true);
      const timer = setTimeout(() => {
        setCoords({ lat: 14.7167, lng: -17.4677 });
        setFetchingGPS(false);
      }, 1200);
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

  if (!mounted) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold text-sm animate-pulse">S+</div>
          <p className="text-xs font-medium">Chargement du module d'urgence...</p>
        </div>
      </div>
    );
  }

  const patientName = user?.name || 'Moussa Diop';
  const vitalId = user?.details?.vitalId || 'SN-807F16';
  const bloodGroup = user?.details?.bloodGroup || 'O+';
  const allergies = user?.details?.allergies || 'Pénicilline';

  const triggerSOS = () => {
    setCountdown(5);
    setSosStatus('countdown');
  };

  const cancelSOS = () => {
    setSosStatus('idle');
    setCountdown(5);
  };

  const emergencyNumbers = [
    { label: "SAMU Sénégal", number: "15", desc: "Urgences Médicales & Réanimation", color: "bg-rose-600 text-white" },
    { label: "Sapeurs-Pompiers", number: "18", desc: "Secours d'urgence & Accidents", color: "bg-red-700 text-white" },
    { label: "Hôpital Principal Dakar", number: "+221 33 839 50 50", desc: "Urgences 24/7 Plateau", color: "bg-teal-700 text-white" },
    { label: "Police Secours", number: "17", desc: "Sécurité & Assistance", color: "bg-slate-800 text-white" }
  ];

  return (
    <div className="min-h-full bg-slate-50 text-slate-900 pb-16">

      {/* ─── Hero Header ────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                Service d'Urgence Médicale 24/7
              </span>
              <span className="text-xs text-slate-400 font-mono font-medium">{vitalId}</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              SOS Urgence Vitale & SAMU
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Déclenchez une alerte prioritaire géolocalisée auprès des services de secours Sunu Santé et contactez directement les numéros d'urgence nationaux.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Ligne d'Urgence Active
            </span>
          </div>
        </div>
      </div>

      {/* ─── Contenu Principal ──────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* COLONNE GAUCHE (7 / 12) : Bouton d'Urgence Interactif ────────── */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs text-center flex flex-col items-center justify-center relative overflow-hidden">
            
            {/* Ambient Red Glow lors de l'alerte */}
            {(sosStatus === 'countdown' || sosStatus === 'triggered') && (
              <div className="absolute inset-0 bg-rose-500/5 animate-pulse pointer-events-none" />
            )}

            <AnimatePresence mode="wait">
              {/* ÉTAT 1 : IDLE */}
              {sosStatus === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center space-y-6 w-full py-4"
                >
                  <div className="max-w-md text-center space-y-1">
                    <p className="text-sm font-bold text-slate-800">
                      En cas de détresse médicale ou d'accident
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Une pression sur le bouton ci-dessous envoie instantanément votre position GPS et votre fiche médicale prioritaire au SAMU et à la clinique de garde.
                    </p>
                  </div>

                  {/* Bouton SOS Rond Grand Format */}
                  <motion.button
                    onClick={triggerSOS}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 text-white flex flex-col items-center justify-center shadow-xl shadow-rose-600/30 border-4 border-rose-300/40 relative cursor-pointer select-none transition-all group"
                  >
                    <span className="font-black text-5xl sm:text-6xl tracking-tight text-white drop-shadow-md">
                      SOS
                    </span>
                    <span className="text-[11px] font-bold tracking-widest uppercase text-rose-100 mt-2">
                      Appuyer
                    </span>
                  </motion.button>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 max-w-sm">
                    🔒 Déclenchement sécurisé : un compte à rebours de 5 secondes vous permet d'annuler en cas d'erreur.
                  </div>
                </motion.div>
              )}

              {/* ÉTAT 2 : COMPTE À REBOURS */}
              {sosStatus === 'countdown' && (
                <motion.div
                  key="countdown"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center space-y-6 w-full py-6"
                >
                  <div className="text-rose-600 font-bold text-sm uppercase tracking-wider animate-pulse flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Déclenchement automatique de l'alerte</span>
                  </div>

                  <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-rose-50 border-4 border-rose-500 flex items-center justify-center shadow-xl shadow-rose-500/20">
                    <span className="font-black text-7xl text-rose-600 tabular-nums">
                      {countdown}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Transmission de vos coordonnées GPS en cours...
                  </p>

                  <button
                    onClick={cancelSOS}
                    className="w-full max-w-xs py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Annuler l'alerte SOS
                  </button>
                </motion.div>
              )}

              {/* ÉTAT 3 : ALERTE DÉCLENCHÉE */}
              {sosStatus === 'triggered' && (
                <motion.div
                  key="triggered"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center space-y-5 w-full py-6 text-center"
                >
                  <div className="w-16 h-16 rounded-3xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
                    <AlertTriangle className="w-9 h-9 animate-bounce" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-rose-700 tracking-tight">
                      ALERTE TRANSMISE AVEC SUCCÈS
                    </h2>
                    <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                      Le régulateur d'urgence Sunu Santé a pris en charge votre appel. Une équipe de réanimation est mobilisée et tente de vous joindre immédiatement.
                    </p>
                  </div>

                  {coords && (
                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-mono">
                      Position GPS transmise : Lat {coords.lat} | Lng {coords.lng} (Dakar)
                    </div>
                  )}

                  <button
                    onClick={cancelSOS}
                    className="w-full max-w-xs py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Terminer et fermer l'alerte
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* COLONNE DROITE (5 / 12) : Fiche Secours & Numéros Directs ──── */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Fiche Médicale de Premier Secours (Sauveteur) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  <span>Fiche Médicale de Premier Secours</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">{vitalId}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                  <span className="text-[10px] font-bold text-rose-800 uppercase block">Groupe Sanguin</span>
                  <span className="text-xl font-black text-rose-600 mt-0.5 block">{bloodGroup}</span>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">Allergie Majeure</span>
                  <span className="text-xs font-bold text-amber-900 mt-1.5 block truncate">{allergies}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Contact d'Urgence Déclaré</span>
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Amina Diop (Épouse)</span>
                  <a 
                    href="tel:+221789876543" 
                    className="inline-flex items-center gap-1 text-teal-700 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Appeler</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Numéros d'Urgence Directs */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <PhoneCall className="w-4 h-4 text-teal-600" />
                <span>Numéros d'Urgence Directs</span>
              </h3>

              <div className="space-y-2">
                {emergencyNumbers.map((item, i) => (
                  <a
                    key={i}
                    href={`tel:${item.number.replace(/\s+/g, '')}`}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors group cursor-pointer"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                      <p className="text-[10px] text-slate-500">{item.desc}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl font-bold text-xs ${item.color}`}>
                      {item.number}
                    </span>
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
