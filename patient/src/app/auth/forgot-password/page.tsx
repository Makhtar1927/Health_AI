'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import HealthAILogo from '@/components/HealthAILogo';
import { useAuthStore } from '@/lib/authStore';

export default function ForgotPasswordPage() {
  const { requestPasswordReset, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setErrorMsg('Veuillez saisir une adresse email valide.');
      return;
    }

    const res = await requestPasswordReset(trimmed);
    if (res.success) {
      setSubmitted(true);
    } else {
      setErrorMsg(res.error || 'Une erreur est survenue lors de l\'envoi du lien.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Halos lumineux en fond */}
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
          {!submitted ? (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Récupération d'accès
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                  Mot de passe oublié ?
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                  Saisissez l'adresse e-mail associée à votre compte patient. Nous vous enverrons un lien sécurisé pour définir un nouveau mot de passe.
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
                    Adresse email enregistrée
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ex: moussa.diop@email.com"
                      required
                      autoFocus
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
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Envoyer le lien de réinitialisation</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour à la page de connexion</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                E-mail envoyé avec succès !
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Si un compte patient est associé à <strong className="text-teal-300 font-mono">{email}</strong>, vous recevrez un lien pour réinitialiser votre mot de passe d'ici quelques instants.
              </p>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 text-xs text-slate-400 text-left space-y-2 mb-6">
                <p className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">•</span>
                  <span>Vérifiez également votre dossier <strong>Courrier indésirable (Spam)</strong> si vous ne trouvez pas le mail.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">•</span>
                  <span>Le lien est valable pendant <strong>1 heure</strong> pour des raisons de sécurité.</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour à la connexion</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-teal-400 hover:text-teal-300 font-semibold underline underline-offset-4"
                >
                  Renvoyer un autre e-mail
                </button>
              </div>
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
