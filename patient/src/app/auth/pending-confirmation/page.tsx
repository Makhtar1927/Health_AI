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
  ShieldCheck
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
      const res = await fetch(${API_URL}/api/auth/forgot-password, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirectTo: ${origin}/auth/confirmed })
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
        setResendError("Impossible de renvoyer l'email. Reessayez.");
      }
    } catch (err) {
      setResendError('Erreur de connexion. Reessayez.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-teal-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

      <header className="relative z-10 w-full max-w-xl mx-auto flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <HealthAILogo size="md" />
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              HEALTH AI <span className="text-[10px] uppercase font-bold text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded-full">Senegal</span>
            </h1>
            <p className="text-[11px] text-slate-400">Plateforme Medicale Intelligente</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Verification Email</span>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center py-10 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-teal-500/20 border-2 border-teal-500/40 flex items-center justify-center mx-auto">
              <Mail className="w-12 h-12 text-teal-300" strokeWidth={1.5} />
            </div>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-1 -right-1 w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center border-2 border-slate-900">
              <Clock className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Verifiez votre boite mail</h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md">Un lien de confirmation a ete envoye a</p>
          {email && (
            <div className="mt-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-xl inline-block">
              <span className="text-teal-300 font-semibold text-sm break-all">{email}</span>
            </div>
          )}
          <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-md">
            Cliquez sur le lien dans l'email pour <strong className="text-white">activer votre compte</strong>. Apres confirmation, vous pourrez vous connecter normalement.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8 w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-3">
          {[
            { icon: '1', text: 'Ouvrez votre application email (Gmail, Outlook...)' },
            { icon: '2', text: 'Cherchez un email de "Health AI Senegal"' },
            { icon: '3', text: 'Cliquez sur "Confirmer mon compte"' },
            { icon: '4', text: 'Revenez ici pour vous connecter' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold flex items-center justify-center shrink-0">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 flex flex-col items-center gap-3 w-full">
          {resendSuccess && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" /> Email renvoye avec succes !
            </div>
          )}
          {resendError && <p className="text-red-400 text-sm">{resendError}</p>}

          <button onClick={handleResend} disabled={!canResend || resendLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20">
            {resendLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {canResend ? "Renvoyer l'email de confirmation" : Renvoyer dans s}
          </button>
          <p className="text-slate-500 text-xs">Verifiez aussi vos spams / courriers indesirables</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-6 flex items-start gap-2 text-xs text-slate-500 bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 text-left max-w-md">
          <Sparkles className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
          <p>Votre compte a bien ete cree. Il sera <strong className="text-slate-400">automatiquement active</strong> des que vous cliquerez sur le lien de confirmation dans l'email.</p>
        </motion.div>
      </div>

      <footer className="relative z-10 w-full max-w-xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <Link href="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-teal-400 transition-colors font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Retour a la connexion
        </Link>
        <span>2026 Health AI Senegal</span>
      </footer>
    </main>
  );
}
