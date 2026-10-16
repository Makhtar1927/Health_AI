'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Mail,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  Clock,
  ShieldCheck,
  Inbox,
  AlertCircle
} from 'lucide-react';
import HealthAILogo from '@/components/HealthAILogo';

export default function PendingConfirmationPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('pending-confirmation-email') || '';
    setEmail(storedEmail);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResend = async () => {
    if (!email || !canResend) return;
    setResendLoading(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const origin = window.location.origin;
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirectTo: `${origin}/auth/confirmed` })
      });

      if (res.ok) {
        setResendSuccess(true);
        setCanResend(false);
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) { clearInterval(timer); setCanResend(true); return 0; }
            return prev - 1;
          });
        }, 1000);
      } else {
        setResendError("Impossible de renvoyer l'e-mail. Veuillez réessayer dans quelques instants.");
      }
    } catch (err) {
      setResendError('Erreur de connexion au serveur. Veuillez vérifier votre réseau.');
    } finally {
      setResendLoading(false);
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
            <p className="text-[11px] text-slate-500 font-medium">Plateforme Médicale Intelligente</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-700 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Vérification d'identité</span>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="relative z-10 w-full max-w-xl mx-auto my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-200/80 text-center"
        >
          {/* Icône animée */}
          <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-teal-100 rounded-2xl animate-pulse" />
            <div className="relative w-16 h-16 bg-gradient-to-tr from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20 text-white">
              <Mail className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold mb-3">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Activation en attente
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Activez votre compte
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
            Un e-mail de confirmation officiel vous a été envoyé. Veuillez cliquer sur le lien sécurisé inclus dans l'e-mail pour finaliser l'activation de votre dossier patient.
          </p>

          {/* Badge Email du destinataire */}
          {email && (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono font-medium mb-6 max-w-full overflow-hidden text-ellipsis">
              <Inbox className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span className="truncate">{email}</span>
            </div>
          )}

          {/* Guide des étapes */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-left mb-6 space-y-3">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Étapes d'activation :
            </p>
            <div className="flex items-start gap-3 text-xs text-slate-600">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">1</span>
              <span>Consultez votre messagerie électronique (<strong>{email || 'votre boîte e-mail'}</strong>).</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-slate-600">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">2</span>
              <span>Ouvrez le message envoyé par <strong>Health AI Sénégal</strong> et cliquez sur <strong>"Activer mon compte"</strong>.</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-slate-600">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">3</span>
              <span>Votre compte sera instantanément certifié et vous pourrez prendre vos rendez-vous médicaux.</span>
            </div>
          </div>

          {/* Conseils Spams */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-800 text-xs text-left mb-6">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Vous ne le trouvez pas ?</strong> Vérifiez votre dossier <em>Courrier indésirable</em> ou <em>Spam</em>, ou patientez 1 à 2 minutes.
            </p>
          </div>

          {/* Retours visuels renvoi */}
          {resendSuccess && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Un nouvel e-mail de confirmation vient de vous être envoyé.</span>
            </div>
          )}

          {resendError && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{resendError}</span>
            </div>
          )}

          {/* Actions : Renvoyer ou Retour */}
          <div className="space-y-3">
            <button
              onClick={handleResend}
              disabled={!canResend || resendLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                canResend
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/10 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
              {resendLoading ? (
                'Envoi en cours...'
              ) : canResend ? (
                "Renvoyer l'e-mail de confirmation"
              ) : (
                `Renvoyer un e-mail (${countdown}s)`
              )}
            </button>

            <Link
              href="/patient/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Retourner à l'écran de connexion
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-xl mx-auto pt-6 border-t border-slate-200/80 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-2">
          <span>Plateforme nationale certifiée</span>
          <span>&bull;</span>
          <span>Conformité Secret Médical & HDS</span>
        </p>
      </footer>
    </main>
  );
}
