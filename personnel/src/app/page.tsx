'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Stethoscope,
  Activity,
  Pill,
  Users,
  CreditCard,
  Image as ImageIcon,
  Sparkles,
  HeartPulse,
  ArrowRight,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────────
   Redirection basée sur le rôle retourné par le serveur
──────────────────────────────────────────────────────────────────────────── */
const ROLE_REDIRECT: Record<string, string> = {
  doctor:      '/doctor/dashboard',
  nurse:       '/nurse/dashboard',
  radiology:   '/radiology/dashboard',
  pharmacist:  '/pharmacist/dashboard',
  reception:   '/reception/dashboard',
  cashier:     '/cashier/dashboard',
};

/* Icônes affichées dans le carousel d'identités professionnelles */
const ROLES_DISPLAY = [
  { label: 'Médecin',      Icon: Stethoscope,  color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { label: 'Infirmier',    Icon: Activity,      color: 'text-rose-600    bg-rose-50    border-rose-200'    },
  { label: 'Radiologue',   Icon: ImageIcon,     color: 'text-purple-600  bg-purple-50  border-purple-200'  },
  { label: 'Pharmacien',   Icon: Pill,          color: 'text-violet-600  bg-violet-50  border-violet-200'  },
  { label: 'Réception',    Icon: Users,         color: 'text-blue-600    bg-blue-50    border-blue-200'    },
  { label: 'Caissier',     Icon: CreditCard,    color: 'text-amber-600   bg-amber-50   border-amber-200'   },
];

export default function PersonnelLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearError, initialize, user } = useAuthStore();

  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPwd]  = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [mounted, setMounted]       = useState(false);

  /* Carousel de rôles (fond décoratif) */
  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setRoleIdx(i => (i + 1) % ROLES_DISPLAY.length), 2200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    initialize();
    clearError();
    setMounted(true);
  }, [initialize, clearError]);

  const getRedirectTarget = (role: string) => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const target = params.get('redirect');
      if (target && target.startsWith('/')) return target;
    }
    return ROLE_REDIRECT[role] ?? '/doctor/dashboard';
  };

  /* Redirect si déjà connecté */
  useEffect(() => {
    if (!mounted) return;
    if (isAuthenticated && user) {
      const dest = getRedirectTarget(user.role);
      router.replace(dest);
    }
  }, [mounted, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setLocalError('Veuillez saisir votre adresse e-mail professionnelle.');
      return;
    }
    if (!password) {
      setLocalError('Veuillez saisir votre mot de passe.');
      return;
    }

    const success = await login(trimmedEmail, password);
    const loggedUser = useAuthStore.getState().user;
    if (success && loggedUser) {
      const dest = getRedirectTarget(loggedUser.role);
      router.replace(dest);
    }
  };

  /* ── Skeleton hydratation ── */
  if (!mounted) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg animate-pulse">
            H+
          </div>
          <p className="text-xs text-slate-500 font-medium">Connexion sécurisée...</p>
        </div>
      </main>
    );
  }

  const displayError = localError ?? error;
  const ActiveRole   = ROLES_DISPLAY[roleIdx];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">

      {/* ── Top Banner Sécurité ───────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">Portail Professionnel Officiel</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline text-slate-500">Accès réservé au personnel hospitalier</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Chiffrement AES-256</span>
          </div>
        </div>
      </div>

      {/* ── Contenu centré ───────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

          {/* ── Panneau gauche (desktop) : présentation des rôles ─────── */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-center">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold w-fit mb-6">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Système de Santé Numérique Health AI</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
              Bienvenue sur votre<br />
              <span className="text-emerald-700">Espace Professionnel</span>
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed mb-8 max-w-xl">
              Connectez-vous avec vos identifiants institutionnels. La plateforme détecte automatiquement votre profil et vous oriente vers votre espace de travail dédié.
            </p>

            {/* Carousel de rôles actif */}
            <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Accès disponibles selon votre profil
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {ROLES_DISPLAY.map((r, i) => {
                  const Icon = r.Icon;
                  const isActive = i === roleIdx;
                  return (
                    <motion.div
                      key={r.label}
                      animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1.04 : 1 }}
                      transition={{ duration: 0.3 }}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all ${
                        isActive ? r.color + ' shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? '' : 'text-slate-400'}`} />
                      <span className={`text-[10px] font-bold ${isActive ? '' : 'text-slate-400'}`}>{r.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Info auto-redirection */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 leading-relaxed">
              <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Redirection automatique :</strong> vos identifiants déterminent votre espace de travail. Médecin, infirmier, radiologue, pharmacien, accueil ou caissier — un seul portail, un seul geste.
              </span>
            </div>
          </div>

          {/* ── Formulaire de Connexion ───────────────────────────────── */}
          <div className="lg:col-span-6 xl:col-span-5 w-full max-w-md mx-auto">

            {/* Logo + titre mobile */}
            <div className="flex flex-col items-center mb-6 lg:hidden">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md mb-3">
                H+
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 text-center">
                Connexion Personnel Médical
              </h1>
              <p className="text-xs text-slate-500 mt-1 text-center max-w-xs">
                Entrez vos identifiants institutionnels pour accéder à votre espace.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50">

              {/* Icône logo desktop */}
              <div className="hidden lg:flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                  H+
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900 leading-tight">Health AI</p>
                  <p className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">Portail Professionnel</p>
                </div>
              </div>

              <div className="mb-5">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Connexion à votre espace
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Identifiants fournis par votre établissement de santé.
                </p>
              </div>

              {/* Erreur */}
              <AnimatePresence>
                {displayError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{displayError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Adresse e-mail professionnelle
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="dr.diallo@hopital-dakar.sn"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setLocalError(null); clearError(); }}
                      className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setLocalError(null); clearError(); }}
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Mot de passe oublié */}
                <div className="text-right">
                  <button type="button" className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold hover:underline cursor-pointer">
                    Mot de passe oublié ?
                  </button>
                </div>

                {/* Bouton Connexion */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm shadow-emerald-700/20 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Vérification en cours...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Accéder à mon espace de travail</span>
                    </>
                  )}
                </button>
              </form>

              {/* Info sécurité */}
              <div className="mt-5 flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                <HeartPulse className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800">Accès sécurisé :</strong> vos identifiants sont vérifiés en temps réel. La plateforme vous redirige automatiquement vers l'interface correspondant à votre fonction.
                </span>
              </div>

              {/* Lien vers portail patient */}
              <p className="mt-4 text-center text-xs text-slate-500">
                Vous êtes un patient ?{' '}
                <a href="https://healthai-sn.vercel.app" className="text-emerald-700 font-semibold hover:underline cursor-pointer">
                  Accéder à votre espace patient
                </a>
              </p>
            </div>

            {/* Rôles animés sous la carte — version mobile */}
            <div className="mt-5 grid grid-cols-3 gap-2 lg:hidden">
              {ROLES_DISPLAY.map((r, i) => {
                const Icon = r.Icon;
                const isActive = i === roleIdx;
                return (
                  <motion.div
                    key={r.label}
                    animate={{ opacity: isActive ? 1 : 0.45, scale: isActive ? 1.04 : 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all ${
                      isActive ? r.color + ' shadow-sm' : 'bg-white border-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? '' : 'text-slate-400'}`} />
                    <span className={`text-[9px] font-bold ${isActive ? '' : 'text-slate-400'}`}>{r.label}</span>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 py-3 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Health AI — Système de Santé Numérique & IA Médicale</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Données chiffrées HDS
            </span>
            <span>•</span>
            <span>Support : support@healthai.sn</span>
          </div>
        </div>
      </footer>

    </main>
  );
}
