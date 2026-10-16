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
  AlertCircle,
  KeyRound
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
      setErrorMsg('Veuillez saisir une adresse e-mail valide.');
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
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Halos décoratifs subtils en mode clair */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-teal-100/60 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-100/50 blur-[110px] pointer-events-none rounded-full" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-xl mx-auto flex items-center justify-between pb-6 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <HealthAILogo size="md" />
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
              HEALTH AI <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-100/80 border border-teal-200 px-2 py-0.5 rounded-full">Sénégal</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Portail Patient Sécurisé</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-700 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Sécurité HDS</span>
        </div>
      </header>

      {/* Conteneur Formulaire */}
      <div className="relative z-10 w-full max-w-xl mx-auto my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-200/80"
        >
          {!submitted ? (
            <div>
              <div className="text-center mb-6">
                <div className="relative mx-auto w-16 h-16 mb-4 flex items-center justify-center">
                  <div className="w-14 h-14 bg-gradient-to-tr from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20 text-white">
                    <KeyRound className="w-7 h-7" />
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  Récupération d'accès
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Mot de passe oublié ?
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  Saisissez l'adresse e-mail associée à votre compte patient. Nous vous enverrons un lien officiel pour définir un nouveau mot de passe.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom.prenom@exemple.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
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

              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <Link
                  href="/patient/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Retour à la connexion
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                E-mail envoyé !
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-sm mx-auto">
                Si un compte patient est associé à l'adresse <strong className="text-slate-900 font-semibold">{email}</strong>, vous recevrez un lien de réinitialisation d'ici quelques instants.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs text-slate-600 mb-6 space-y-2">
                <p className="font-bold text-slate-700">Vous ne recevez rien ?</p>
                <ul className="list-disc list-inside space-y-1 text-slate-500">
                  <li>Vérifiez votre dossier de spams ou courriers indésirables.</li>
                  <li>Assurez-vous d'avoir tapé la bonne adresse e-mail.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Essayer avec une autre adresse
                </button>

                <Link
                  href="/patient/login"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Retourner à la connexion
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-xl mx-auto pt-6 border-t border-slate-200/80 text-center text-xs text-slate-500">
        <p>Health AI Sénégal &bull; Dakar &bull; Support : support@healthai.sn</p>
      </footer>
    </main>
  );
}
