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
  Lock, 
  Sparkles,
  UserCheck,
  Building2
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
          // Informer le backend que l'email est confirmé
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
        // Informer le backend que l'email est confirmé
        await notifyBackendConfirmation(session.user.email);
      }
      setIsVerifying(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Appel backend pour marquer emailConfirmed = true dans users-db.json
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
    <main className="min-h-screen bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      
      {/* Halos lumineux en arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-teal-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Header avec Logo */}
      <header className="relative z-10 w-full max-w-xl mx-auto flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <HealthAILogo size="md" />
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              HEALTH AI <span className="text-[10px] uppercase font-bold text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded-full">Sénégal</span>
            </h1>
            <p className="text-[11px] text-slate-400">Plateforme Médicale Intelligente</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sécurité HDS</span>
        </div>
      </header>

      {/* Conteneur Central */}
      <div className="relative z-10 w-full max-w-xl mx-auto my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl text-center"
        >
          {/* Badge de succès animé */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-lg shadow-emerald-500/25 flex items-center justify-center"
          >
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 animate-pulse" />
            </div>
          </motion.div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Compte certifié & activé
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
            Votre compte est désormais actif !
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
            Votre adresse e-mail a été confirmée avec succès. Vous disposez désormais d&apos;un accès officiel et sécurisé à l&apos;ensemble de vos services de santé sur Health AI.
          </p>

          {/* Carte récapitulative e-mail si détecté */}
          {confirmedEmail && (
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto mb-6 flex items-center justify-center gap-2 text-xs text-slate-200">
              <UserCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>Adresse confirmée :</span>
              <strong className="text-teal-300 font-mono truncate">{confirmedEmail}</strong>
            </div>
          )}

          {/* Fonctionnalités débloquées */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-8 text-left">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 w-fit mb-2">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Rendez-vous 24/7</p>
                <p className="text-[10px] text-slate-400 mt-1">Hôpitaux et centres de santé</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 w-fit mb-2">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Ordonnances QR</p>
                <p className="text-[10px] text-slate-400 mt-1">Délivrance en pharmacie</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-2">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Dossier Médical</p>
                <p className="text-[10px] text-slate-400 mt-1">Historique & constantes</p>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Accéder à mon espace patient</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/patient/appointments"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>Consulter les structures</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer Institutionnel */}
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
