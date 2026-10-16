'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  KeyRound,
  Sparkles 
} from 'lucide-react';
import HealthAILogo from '@/components/HealthAILogo';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/authStore';

export default function ResetPasswordPage() {
  const { resetPassword, isLoading } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // 1. Tenter d'extraire la session de récupération Supabase
    const initRecovery = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          setUserEmail(session.user.email);
        }
      } catch (e) {
        console.warn('Erreur vérification session :', e);
      } finally {
        setIsReady(true);
      }
    };

    initRecovery();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
      setIsReady(true);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Les mots de passe ne correspondent pas.');
      return;
    }

    const res = await resetPassword(password, userEmail || undefined);
    if (res.success) {
      setSuccess(true);
    } else {
      setErrorMsg(res.error || 'Échec de la mise à jour du mot de passe.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-teal-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-xl mx-auto flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <HealthAILogo size="md" />
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              HEALTH AI <span className="text-[10px] uppercase font-bold text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded-full">Sénégal</span>
            </h1>
            <p className="text-[11px] text-slate-400">Portail Patient Sécurisé</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sécurité HDS</span>
        </div>
      </header>

      {/* Conteneur Formulaire */}
      <div className="relative z-10 w-full max-w-xl mx-auto my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl"
        >
          {!success ? (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Nouveau mot de passe
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                  Réinitialisez votre mot de passe
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                  {userEmail ? (
                    <>Pour le compte <strong className="text-teal-300 font-mono">{userEmail}</strong></>
                  ) : (
                    'Choisissez un mot de passe robuste d\'au moins 6 caractères pour sécuriser votre espace.'
                  )}
                </p>
              </div>

              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      minLength={6}
                      autoFocus
                      className="w-full pl-10 pr-10 py-3 text-sm bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Confirmez le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      minLength={6}
                      className="w-full pl-10 pr-3.5 py-3 text-sm bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <span>Mettre à jour le mot de passe</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-lg shadow-emerald-500/25 flex items-center justify-center"
              >
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
              </motion.div>

              <h3 className="text-2xl font-black text-white mb-2">
                Mot de passe mis à jour !
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-8 max-w-sm mx-auto">
                Votre nouveau mot de passe a été enregistré avec succès. Vous pouvez dès à présent vous connecter à votre espace patient.
              </p>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-teal-600/30 transition-all active:scale-95"
              >
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-xl mx-auto pt-6 border-t border-white/10 text-center">
        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 mb-1.5">
          <Lock className="w-3.5 h-3.5 text-teal-500" />
          Plateforme certifiée en conformité avec les directives de santé publique du Sénégal.
        </p>
        <p className="text-[10px] text-slate-600">
          &copy; {new Date().getFullYear()} Health AI Sénégal — Tous droits réservés.
        </p>
      </footer>
    </main>
  );
}
