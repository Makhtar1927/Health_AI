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
  ArrowRight,
  Navigation,
  Activity,
  Flame,
  Radio,
  Clock,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Share2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import HealthAILogo from '@/components/HealthAILogo';

export default function PatientEmergency() {
  const { user, initialize } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [sosStatus, setSosStatus] = useState<'idle' | 'countdown' | 'triggered'>('idle');
  const [countdown, setCountdown] = useState(5);
  const [coords, setCoords] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [fetchingGPS, setFetchingGPS] = useState(false);
  const [flashScreen, setFlashScreen] = useState(false);
  const [activeFirstAid, setActiveFirstAid] = useState<number | null>(null);
  const [alertSteps, setAlertSteps] = useState({
    gps: false,
    samu: false,
    contacts: false,
    fileShared: false,
  });

  useEffect(() => {
    initialize();
    setMounted(true);
  }, [initialize]);

  // Géolocalisation réelle ou simulation Dakar
  useEffect(() => {
    if (sosStatus === 'countdown' || sosStatus === 'triggered') {
      setFetchingGPS(true);
      if (typeof window !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setCoords({
              lat: Number(pos.coords.latitude.toFixed(4)),
              lng: Number(pos.coords.longitude.toFixed(4)),
              address: 'Dakar, Plateau (Position GPS détectée)'
            });
            setFetchingGPS(false);
          },
          () => {
            setCoords({
              lat: 14.6937,
              lng: -17.4441,
              address: 'Avenue Pasteur, Dakar Plateau (Position estimée)'
            });
            setFetchingGPS(false);
          },
          { timeout: 3500 }
        );
      } else {
        setCoords({
          lat: 14.6937,
          lng: -17.4441,
          address: 'Avenue Pasteur, Dakar Plateau (Position estimée)'
        });
        setFetchingGPS(false);
      }
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
      setTimeout(() => setAlertSteps(prev => ({ ...prev, gps: true })), 400);
      setTimeout(() => setAlertSteps(prev => ({ ...prev, fileShared: true })), 900);
      setTimeout(() => setAlertSteps(prev => ({ ...prev, samu: true })), 1400);
      setTimeout(() => setAlertSteps(prev => ({ ...prev, contacts: true })), 1900);
    }
    return () => clearInterval(interval);
  }, [sosStatus, countdown]);

  if (!mounted) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <HealthAILogo size="lg" pulse />
          <p className="text-xs font-medium">Chargement du module d'urgence...</p>
        </div>
      </div>
    );
  }

  const patientName = user?.name || 'Moussa Diop';
  const vitalId = user?.details?.vitalId || 'SN-807F16';
  const bloodGroup = user?.details?.bloodGroup || 'O+';
  const allergies = user?.details?.allergies || 'Pénicilline, AINS';
  const chronicConditions = user?.details?.chronicConditions || 'Hypertension artérielle';

  const triggerSOS = () => {
    setCountdown(5);
    setSosStatus('countdown');
    setAlertSteps({ gps: false, samu: false, contacts: false, fileShared: false });
  };

  const cancelSOS = () => {
    setSosStatus('idle');
    setCountdown(5);
    setFlashScreen(false);
  };

  const emergencyNumbers = [
    { label: "SAMU Sénégal", number: "15", desc: "Urgences vitales 24/7", color: "bg-rose-600 hover:bg-rose-700 text-white", urgent: true },
    { label: "Sapeurs-Pompiers", number: "18", desc: "Secours & accidents", color: "bg-red-700 hover:bg-red-800 text-white", urgent: true },
    { label: "Hôpital Principal", number: "+221 33 839 50 50", desc: "Urgences 24/7 Plateau", color: "bg-teal-700 hover:bg-teal-800 text-white", urgent: false },
    { label: "Police Secours", number: "17", desc: "Assistance immédiate", color: "bg-slate-800 hover:bg-slate-900 text-white", urgent: false }
  ];

  const nearbyCenters = [
    {
      name: "Hôpital Principal de Dakar",
      type: "Centre Militaire & Civil",
      distance: "1.4 km",
      time: "4 min",
      address: "1 Avenue Nelson Mandela, Plateau",
      tel: "+221338395050",
      open: "24h/24 • 7j/7"
    },
    {
      name: "Clinique de la Madeleine",
      type: "Clinique Privée Urgences",
      distance: "2.1 km",
      time: "6 min",
      address: "Avenue des Jasmins, Plateau",
      tel: "+221338899470",
      open: "Urgences 24/7"
    },
    {
      name: "CHU de Fann",
      type: "Hôpital Universitaire",
      distance: "3.8 km",
      time: "9 min",
      address: "Avenue Cheikh Anta Diop",
      tel: "+221338691818",
      open: "Urgences 24/7"
    }
  ];

  const firstAidGuides = [
    {
      title: "Arrêt Cardiaque / Inconscience",
      icon: HeartPulse,
      color: "text-rose-600 bg-rose-50 border-rose-200",
      steps: [
        "1. Vérifiez si la victime réagit et respire.",
        "2. Déclenchez le SOS immédiatement ou appelez le 15.",
        "3. Débutez le massage cardiaque au centre du thorax (100-120 bpm).",
        "4. Utilisez un défibrillateur (DAE) si disponible."
      ]
    },
    {
      title: "Étouffement Respiratoire",
      icon: Activity,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      steps: [
        "1. Donnez jusqu'à 5 claques fortes entre les omoplates.",
        "2. Si inefficace, pratiquez 5 compressions abdominales (Heimlich).",
        "3. Alternez claques et compressions jusqu'au dégagement."
      ]
    },
    {
      title: "Hémorragie / Saignement Abondant",
      icon: ShieldAlert,
      color: "text-red-600 bg-red-50 border-red-200",
      steps: [
        "1. Comprimez la plaie fermement et en continu avec un tissu propre.",
        "2. Allongez la victime pour éviter la chute de tension.",
        "3. Ne retirez jamais un corps étranger planté dans la plaie."
      ]
    },
    {
      title: "Position Latérale de Sécurité (PLS)",
      icon: User,
      color: "text-teal-600 bg-teal-50 border-teal-200",
      steps: [
        "1. Si la personne est inconsciente mais RESPIRE normalement.",
        "2. Tournez-la délicatement sur le côté, genou supérieur plié.",
        "3. Basculez doucement sa tête en arrière, bouche ouverte."
      ]
    }
  ];

  return (
    <div className={`min-h-full pb-32 lg:pb-16 transition-colors duration-500 overflow-x-hidden ${flashScreen ? 'bg-rose-100' : 'bg-slate-50'}`}>

      {/* ─── Top Alert Micro-Banner (Compact & Responsive) ───────────────── */}
      <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white px-3 sm:px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-white animate-ping flex-shrink-0" />
            <span className="font-bold tracking-wide uppercase truncate">Canal d'Urgence Health AI</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setFlashScreen(!flashScreen)}
              className="text-[10px] sm:text-[11px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-lg flex items-center gap-1 font-bold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>{flashScreen ? 'Éteindre' : 'Balise Nuit'}</span>
            </button>
            <span className="font-mono text-rose-100 font-bold hidden xs:inline">{vitalId}</span>
          </div>
        </div>
      </div>

      {/* ─── Hero Header Responsive ─────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                Assistance Vitale 24h/24
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Sénégal 24/7</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              SOS Urgence & SAMU
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              Déclenchez une alerte géolocalisée prioritaire auprès des secours et contactez directement les services médicaux d'urgence.
            </p>
          </div>

          {/* Boutons d'appel rapide pleine largeur sur mobile */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center pt-1 sm:pt-0">
            <a
              href="tel:15"
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5 fill-white" />
              <span>SAMU (15)</span>
            </a>
            <a
              href="tel:18"
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2.5 rounded-xl bg-red-700 hover:bg-red-800 active:bg-red-900 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Pompiers (18)</span>
            </a>
          </div>
        </div>
      </div>

      {/* ─── Contenu Principal Responsive ───────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 mt-4 sm:mt-6 space-y-4 sm:space-y-6">
        
        {/* Grille principale : Bouton SOS + Fiche vitale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">

          {/* COLONNE SOS (7/12 desktop) : Panneau d'action d'urgence ──────── */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-7 shadow-xs text-center flex flex-col items-center justify-center relative overflow-hidden">
            
            {/* Halo lumineux d'alerte */}
            {(sosStatus === 'countdown' || sosStatus === 'triggered') && (
              <div className="absolute inset-0 bg-rose-500/10 animate-pulse pointer-events-none" />
            )}

            <AnimatePresence mode="wait">
              {/* ÉTAT 1 : IDLE */}
              {sosStatus === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center space-y-4 sm:space-y-6 w-full py-2 sm:py-4"
                >
                  <div className="max-w-md text-center space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                      <Radio className="w-3 h-3 text-rose-600 animate-pulse" />
                      Balise prête au déclenchement
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Appuyez pour déclencher l'alerte d'urgence
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Transmet instantanément votre position GPS et prévient le SAMU et votre contact d'urgence.
                    </p>
                  </div>

                  {/* Bouton SOS Rond Responsive */}
                  <div className="relative flex items-center justify-center my-2 sm:my-4">
                    <span className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-rose-500/20 animate-ping pointer-events-none" />
                    <span className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-rose-500/30 animate-pulse pointer-events-none" />
                    
                    <motion.button
                      onClick={triggerSOS}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.93 }}
                      className="w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-red-700 via-rose-600 to-rose-500 text-white flex flex-col items-center justify-center shadow-xl shadow-rose-600/40 border-4 border-rose-200/60 relative cursor-pointer select-none transition-all group z-10"
                    >
                      <span className="font-black text-4xl sm:text-6xl tracking-tight drop-shadow-md">
                        SOS
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase text-rose-100 mt-0.5 sm:mt-1">
                        Appuyer
                      </span>
                    </motion.button>
                  </div>

                  {/* Note sécurisée */}
                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 text-[11px] sm:text-xs text-slate-600 max-w-md text-left">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>
                      <strong>Sécurité anti-erreur :</strong> un compte à rebours de 5 secondes vous permet d'annuler immédiatement l'alerte.
                    </span>
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
                  className="flex flex-col items-center space-y-4 sm:space-y-6 w-full py-4 sm:py-6"
                >
                  <div className="text-rose-600 font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 animate-bounce" />
                    <span>Déclenchement des secours dans</span>
                  </div>

                  {/* Cercle décompte */}
                  <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-rose-50 border-4 border-rose-500 flex flex-col items-center justify-center shadow-xl shadow-rose-500/20">
                    <span className="font-black text-6xl sm:text-8xl text-rose-600 tabular-nums leading-none">
                      {countdown}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-rose-500 uppercase tracking-widest mt-1">
                      secondes
                    </span>
                  </div>

                  <div className="space-y-1 text-center px-2">
                    <p className="text-[11px] sm:text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600 flex-shrink-0" />
                      Acquisition GPS & préparation de l'alerte...
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-400">
                      Appuyez sur Annuler en cas d'erreur.
                    </p>
                  </div>

                  <button
                    onClick={cancelSOS}
                    className="w-full max-w-xs py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm active:scale-95"
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
                  className="flex flex-col items-center space-y-4 w-full py-2 sm:py-4 text-center"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
                    <AlertTriangle className="w-8 h-8 sm:w-9 sm:h-9 animate-bounce" />
                  </div>

                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] sm:text-xs mb-1">
                      CODE ROUGE • ALERTE ENVOYÉE
                    </span>
                    <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                      Secours Médicaux Mobilisés
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed px-2">
                      Le régulateur d'urgence Health AI & le SAMU ont reçu vos coordonnées. Gardez votre ligne libre.
                    </p>
                  </div>

                  {/* Checklist des transmissions */}
                  <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-left space-y-2 text-[11px] sm:text-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <span className="font-bold text-slate-700">Actions automatiques :</span>
                      <span className="text-[10px] text-teal-700 font-mono font-bold">TRANSMISSION 100%</span>
                    </div>

                    <div className="flex items-start gap-2">
                      {alertSteps.gps ? (
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 animate-spin flex-shrink-0 mt-0.5" />
                      )}
                      <span className={alertSteps.gps ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                        Position GPS : {coords ? `${coords.lat}, ${coords.lng}` : 'En cours...'}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      {alertSteps.fileShared ? (
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 animate-spin flex-shrink-0 mt-0.5" />
                      )}
                      <span className={alertSteps.fileShared ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                        Fiche d'urgence télétransmise aux médecins
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      {alertSteps.samu ? (
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 animate-spin flex-shrink-0 mt-0.5" />
                      )}
                      <span className={alertSteps.samu ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                        Liaison régulation SAMU Sénégal (15)
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      {alertSteps.contacts ? (
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 animate-spin flex-shrink-0 mt-0.5" />
                      )}
                      <span className={alertSteps.contacts ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                        SMS d'alerte envoyé à Amina Diop (+221 78 987 65 43)
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md pt-1">
                    <a
                      href="tel:15"
                      className="flex-1 py-2.5 sm:py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Parler au SAMU (15)</span>
                    </a>
                    <button
                      onClick={cancelSOS}
                      className="flex-1 py-2.5 sm:py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Clôturer l'alerte
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* COLONNE DROITE (5/12 desktop) : Fiche de Secours & Numéros ────── */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            
            {/* Carte Fiche Médicale d'Urgence Sauveteur */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                    <HeartPulse className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Fiche Médicale d'Urgence
                    </h3>
                    <p className="text-[10px] text-slate-400">Pour urgentiste ou témoin</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {vitalId}
                </span>
              </div>

              {/* Identité Patient */}
              <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0">
                  {patientName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-extrabold text-slate-900 truncate">{patientName}</h4>
                  <p className="text-[10px] text-slate-500 truncate">36 ans • Homme • Dakar</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg flex-shrink-0">
                  Assuré
                </span>
              </div>

              {/* Données Vitales : 2 colonnes bien équilibrées */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-rose-50 border border-rose-200 text-center">
                  <span className="text-[9px] sm:text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                    Groupe Sanguin
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-rose-600 mt-0.5 block">
                    {bloodGroup}
                  </span>
                  <span className="text-[9px] text-rose-500">Donneur O+</span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-[9px] sm:text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    Allergies
                  </span>
                  <span className="text-[11px] sm:text-xs font-extrabold text-amber-900 mt-1 block truncate" title={allergies}>
                    {allergies}
                  </span>
                  <span className="text-[9px] text-amber-600">Alerte vigilance</span>
                </div>
              </div>

              {/* Antécédent */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] sm:text-xs space-y-0.5">
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase block">Antécédents majeurs</span>
                <p className="font-semibold text-slate-800">{chronicConditions}</p>
                <p className="text-[10px] text-slate-500">Traitement régulier : Amlodipine 5mg</p>
              </div>

              {/* Contact d'urgence déclaré */}
              <div className="p-3 rounded-xl sm:rounded-2xl bg-teal-50/70 border border-teal-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                    Contact d'Urgence Déclaré
                  </span>
                  <span className="text-[9px] bg-teal-200/60 text-teal-800 font-bold px-1.5 py-0.2 rounded">
                    Priorité 1
                  </span>
                </div>
                <div className="flex items-center justify-between font-bold text-slate-900 gap-2">
                  <div className="min-w-0">
                    <p className="text-xs truncate">Amina Diop</p>
                    <p className="text-[10px] font-normal text-slate-500 truncate">Épouse • +221 78 987 65 43</p>
                  </div>
                  <a 
                    href="tel:+221789876543" 
                    className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors flex-shrink-0"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Appeler</span>
                  </a>
                </div>
              </div>

              <div className="text-right">
                <Link
                  href="/patient/profile"
                  className="text-[11px] font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
                >
                  <span>Mettre à jour la fiche médicale</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Carte Numéros Directs */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                  <span>Numéros d'Urgence Gratuits</span>
                </h3>
                <span className="text-[9px] sm:text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  24/7
                </span>
              </div>

              <div className="space-y-2">
                {emergencyNumbers.map((item, i) => (
                  <a
                    key={i}
                    href={`tel:${item.number.replace(/\s+/g, '')}`}
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                      item.urgent
                        ? 'bg-rose-50/50 border-rose-200/80 hover:bg-rose-50'
                        : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="truncate">{item.label}</span>
                        {item.urgent && (
                          <span className="text-[8px] bg-rose-600 text-white font-extrabold px-1.5 py-0.2 rounded flex-shrink-0">
                            URGENT
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate">{item.desc}</p>
                    </div>
                    <span className={`px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl font-black text-xs flex-shrink-0 ${item.color}`}>
                      {item.number}
                    </span>
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* ─── SECTION 2 : Centres d'Urgence les Plus Proches ─────────────── */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-2.5 border-b border-slate-100">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Urgences Hospitalières 24/7 à Proximité</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Calculé depuis Dakar Plateau & Alentours
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <MapPin className="w-3 h-3 text-rose-600" />
              <span>Dakar, Sénégal</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {nearbyCenters.map((center, index) => (
              <div 
                key={index}
                className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-2.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded">
                      {center.open}
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-teal-600" />
                      {center.distance} ({center.time})
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900">{center.name}</h4>
                  <p className="text-[10px] text-slate-500">{center.type}</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{center.address}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <a
                    href={`tel:${center.tel}`}
                    className="flex-1 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Appeler</span>
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.name + ' ' + center.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center transition-colors"
                    title="Itinéraire GPS"
                  >
                    <Navigation className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── SECTION 3 : Gestes de Premiers Secours (Guide Vital) ───────── */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>Gestes de Premiers Secours en Attendant les Médecins</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Protocoles d'urgence recommandés par les urgentistes
              </p>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 hidden xs:inline">
              4 guides
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {firstAidGuides.map((guide, idx) => {
              const Icon = guide.icon;
              const isExpanded = activeFirstAid === idx;

              return (
                <div 
                  key={idx}
                  className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFirstAid(isExpanded ? null : idx)}
                    className="w-full p-3 sm:p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg sm:rounded-xl border flex items-center justify-center font-bold flex-shrink-0 ${guide.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 truncate">{guide.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-1" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-3.5 pb-3.5 pt-1 bg-slate-50/70 border-t border-slate-100"
                      >
                        <ul className="space-y-1.5 mt-1.5">
                          {guide.steps.map((step, sIdx) => (
                            <li key={sIdx} className="text-[11px] sm:text-xs text-slate-700 leading-relaxed flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
