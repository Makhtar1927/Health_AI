'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  CheckCircle2,
  Building2,
  Zap
} from 'lucide-react';
import HealthAILogo from '@/components/HealthAILogo';

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

/* Identités professionnelles supportées avec leurs accès rapides */
const ROLES_DISPLAY = [
  { 
    label: 'Médecin', 
    Icon: Stethoscope, 
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
    email: 'medecin@sunusante.sn',
    pwd: 'Medecin2026!'
  },
  { 
    label: 'Infirmier', 
    Icon: Activity, 
    color: 'text-rose-700 bg-rose-50 border-rose-200/80',
    email: 'infirmier@sunusante.sn',
    pwd: 'Infirmier2026!'
  },
  { 
    label: 'Radiologue', 
    Icon: ImageIcon, 
    color: 'text-purple-700 bg-purple-50 border-purple-200/80',
    email: 'radiologue@sunusante.sn',
    pwd: 'Radio2026!'
  },
  { 
    label: 'Pharmacien', 
    Icon: Pill, 
    color: 'text-teal-700 bg-teal-50 border-teal-200/80',
    email: 'pharmacien@sunusante.sn',
    pwd: 'Pharmacien2026!'
  },
  { 
    label: 'Accueil', 
    Icon: Users, 
    color: 'text-blue-700 bg-blue-50 border-blue-200/80',
    email: 'accueil@sunusante.sn',
    pwd: 'Accueil2026!'
  },
  { 
    label: 'Caisse', 
    Icon: CreditCard, 
    color: 'text-amber-700 bg-amber-50 border-amber-200/80',
    email: 'caisse@sunusante.sn',
    pwd: 'Caisse2026!'
  },
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
    const t = setInterval(() => setRoleIdx(i => (i + 1) % ROLES_DISPLAY.length), 2600);
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

  const handleQuickFill = (roleEmail: string, rolePwd: string) => {
    setEmail(roleEmail);
    setPassword(rolePwd);
    setLocalError(null);
    clearError();
  };

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
          <HealthAILogo size="lg" pulse />
          <p className="text-xs text-slate-500 font-medium">Connexion sécurisée en cours...</p>
        </div>
      </main>
    );
  }

  const displayError = localError ?? error;
  const ActiveRole   = ROLES_DISPLAY[roleIdx];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/70 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white relative overflow-hidden">

      {/* Halo lumineux d'ambiance pro */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[340px] bg-gradient-to-r from-emerald-100/50 via-teal-100/40 to-blue-100/30 blur-[130px] pointer-events-none rounded-full" />

      {/* ── Top Bar Institutionnelle ───────────────────────────────────── */}
      <header className="relative z-10 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-800">Portail Professionnel Santé</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline text-slate-500 font-medium">Réseau Hospitalier National du Sénégal</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-800 font-semibold bg-emerald-50/80 px-2.5 py-1 rounded-full border border-emerald-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px]">Conforme HDS & MSAS</span>
          </div>
        </div>
      </header>

      {/* ── Contenu centré ───────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

          {/* ── Panneau gauche (desktop) : Présentation institutionnelle & Rôles ─────── */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-center">

            <div className="mb-4">
              <HealthAILogo size="xl" withText subtitle="Système de Santé Numérique & Intelligence Clinique" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold w-fit mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Plateforme Unifiée du Personnel Soignant</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
              Accédez à vos outils cliniques <br />
              <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-600 bg-clip-text text-transparent">
                en toute sécurité
              </span>
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-xl">
              Connectez-vous avec vos identifiants professionnels. Health AI oriente instantanément chaque praticien vers sa console métier adaptée avec co-pilote d'assistance clinique IA.
            </p>

            {/* Carousel de rôles interactif */}
            <div className="mb-6 p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/90 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Postes de travail pris en charge
                </p>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Détection automatique
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {ROLES_DISPLAY.map((r, i) => {
                  const Icon = r.Icon;
                  const isActive = i === roleIdx;
                  return (
                    <motion.button
                      key={r.label}
                      type="button"
                      onClick={() => handleQuickFill(r.email, r.pwd)}
                      animate={{ scale: isActive ? 1.03 : 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isActive
                          ? r.color + ' ring-2 ring-emerald-500/20 shadow-sm'
                          : 'bg-slate-50/70 border-slate-200/60 text-slate-500 hover:bg-white hover:border-slate-300'
                      }`}
                      title={`Cliquer pour pré-remplir l'accès ${r.label}`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? '' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold leading-tight">{r.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Note d'automatisation */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-100/80 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
              <Building2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Interopérabilité hospitalière :</strong> consultations médicales, constantes infirmières, imagerie PACS/DICOM, dispensation officine et facturation guichet interconnectées en temps réel.
              </span>
            </div>
          </div>

          {/* ── Formulaire de Connexion ───────────────────────────────── */}
          <div className="lg:col-span-6 xl:col-span-5 w-full max-w-md mx-auto">

            {/* Logo + titre mobile */}
            <div className="flex flex-col items-center mb-6 lg:hidden">
              <HealthAILogo size="lg" withText subtitle="Portail Professionnel Santé" className="mb-2" />
              <p className="text-xs text-slate-500 text-center max-w-xs mt-1">
                Entrez vos identifiants institutionnels pour accéder à votre espace de travail.
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgb(0,0,0,0.06)] relative overflow-hidden">

              {/* Header carte */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    Connexion Professionnelle
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Identifiants certifiés par votre établissement.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Raccourcis de test rapide en 1 clic */}
              <div className="mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    Accès rapide démonstration :
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ROLES_DISPLAY.map((r) => (
                    <button
                      key={r.label}
                      type="button"
                      onClick={() => handleQuickFill(r.email, r.pwd)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        email === r.email
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message d'erreur */}
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Adresse e-mail professionnelle
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="medecin@sunusante.sn"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setLocalError(null); clearError(); }}
                      className="w-full pl-10 pr-3.5 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Mot de passe</label>
                    <Link href="/auth/forgot-password" className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold hover:underline cursor-pointer">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setLocalError(null); clearError(); }}
                      className="w-full pl-10 pr-10 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all font-medium"
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

                {/* Bouton Connexion */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:from-emerald-800 active:to-teal-800 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98] cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authentification en cours...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Accéder à mon espace clinique</span>
                    </>
                  )}
                </button>
              </form>

              {/* Info sécurité */}
              <div className="mt-5 flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed">
                <HeartPulse className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800">Chiffrement de bout en bout :</strong> vos sessions sont journalisées et sécurisées selon les normes de santé publique.
                </span>
              </div>

              {/* Lien vers portail patient */}
              <p className="mt-4 text-center text-xs text-slate-500">
                Vous êtes un patient ?{' '}
                <a href="https://healthai-sn.vercel.app" className="text-emerald-700 font-bold hover:underline cursor-pointer">
                  Accéder à votre espace patient &rarr;
                </a>
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="relative z-10 bg-white/90 backdrop-blur-md border-t border-slate-200/80 py-3.5 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Health AI Sénégal — Plateforme Médicale Hospitalière & Téléconsultation</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Réseau Sécurisé Sénégal
            </span>
            <span>•</span>
            <span className="hover:text-slate-700 transition-colors">Support : contact@healthai.sn</span>
          </div>
        </div>
      </footer>

    </main>
  );
}
