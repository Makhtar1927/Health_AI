'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  Activity, 
  ArrowRight, 
  Sparkles,
  UserCheck,
  Building2,
  Lock
} from 'lucide-react';
import HealthAILogo from '@/components/HealthAILogo';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/authStore';

export default function AuthConfirmedPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // 1. Tenter de récupérer la session Supabase après confirmation
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          setConfirmedEmail(session.user.email);
          await notifyBackendConfirmation(session.user.email);
        }
      } catch (err) {
        console.warn('Erreur vérification session :', err);
      } finally {
        setIsVerifying(false);
      }
    };

    checkSession();

    // 2. Écouter les changements d'état d'authentification Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.email) {
        setConfirmedEmail(session.user.email);
        await notifyBackendConfirmation(session.user.email);
      }
      setIsVerifying(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Appel backend pour marquer emailConfirmed = true
  const notifyBackendConfirmation = async (email: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${API_URL}/api/auth/confirm-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
    } catch (err) {
      console.warn('Erreur notification backend confirmation email :', err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Halos décoratifs subtils en mode clair */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-100/60 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-100/50 blur-[110px] pointer-events-none rounded-full" />

      {/* Header avec Logo */}
      <header className="relative z-10 w-full max-w-xl mx-auto flex items-center justify-between pb-6 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <HealthAILogo size="md" />
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
              HEALTH AI <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-full">Sénégal</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Plateforme Médicale Intelligente</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Certifié HDS</span>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="relative z-10 w-full max-w-xl mx-auto my-auto py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-200/80 text-center"
        >
          {/* Badge Succès Animé */}
          <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-100 rounded-2xl animate-pulse" />
            <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-3">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            Identité vérifiée avec succès
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Votre compte est activé !
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
            Votre adresse e-mail a été certifiée par le système national de santé Health AI Sénégal. Vous pouvez maintenant accéder à l'ensemble des services médicaux.
          </p>

          {/* Email badge si disponible */}
          {confirmedEmail && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{confirmedEmail}</span>
            </div>
          )}

          {/* Cartouche Services Débloqués */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-left mb-6 space-y-3">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Services disponibles immédiatement :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs flex flex-col items-center text-center">
                <Calendar className="w-5 h-5 text-teal-600 mb-1.5" />
                <span className="text-xs font-bold text-slate-800">Prise de RDV</span>
                <span className="text-[11px] text-slate-500">24h/24 en ligne</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs flex flex-col items-center text-center">
                <Activity className="w-5 h-5 text-emerald-600 mb-1.5" />
                <span className="text-xs font-bold text-slate-800">Dossier Médical</span>
                <span className="text-[11px] text-slate-500">Historique sécurisé</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs flex flex-col items-center text-center">
                <FileText className="w-5 h-5 text-indigo-600 mb-1.5" />
                <span className="text-xs font-bold text-slate-800">Ordonnances QR</span>
                <span className="text-[11px] text-slate-500">Prêtes en pharmacie</span>
              </div>
            </div>
          </div>

          {/* Bouton d'action principal */}
          <div className="space-y-3">
            <Link
              href="/patient/login"
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Se connecter à mon espace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[11px] text-slate-400">
              Vos données de santé sont chiffrées de bout en bout conformément à la loi sénégalaise.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-xl mx-auto pt-6 border-t border-slate-200/80 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-2">
          <span>Health AI Sénégal &bull; Dakar</span>
          <span>&bull;</span>
          <Link href="/privacy" className="hover:text-teal-600 transition-colors">Politique de Confidentialité</Link>
        </p>
      </footer>
    </main>
  );
}
