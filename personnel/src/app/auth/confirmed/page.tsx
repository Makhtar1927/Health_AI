'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Stethoscope, 
  ArrowRight, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/authStore';

export default function StaffAuthConfirmedPage() {
  const { user } = useAuthStore();
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          setConfirmedEmail(session.user.email);
        }
      } catch (err) {
        console.warn('Erreur vérification session :', err);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email) {
        setConfirmedEmail(session.user.email);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Halos décoratifs clairs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-100/60 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-100/50 blur-[110px] pointer-events-none rounded-full" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-xl mx-auto flex items-center justify-between pb-6 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 shadow-xs flex items-center justify-center text-indigo-600">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
              HEALTH AI <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-100/80 border border-indigo-200 px-2 py-0.5 rounded-full">Pro</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Espace Personnel Médical</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Accès Certifié</span>
        </div>
      </header>

      {/* Contenu */}
      <div className="relative z-10 w-full max-w-xl mx-auto my-auto py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-200/80 text-center"
        >
          <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-100 rounded-2xl animate-pulse" />
            <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-3">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            Compte Professionnel Actif
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Email validé avec succès
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
            Votre compte de personnel soignant est pleinement opérationnel. Vous pouvez maintenant accéder à votre poste de travail clinique.
          </p>

          {confirmedEmail && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{confirmedEmail}</span>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/doctor/login"
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 text-white shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Accéder à mon espace professionnel</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-xl mx-auto pt-6 border-t border-slate-200/80 text-center text-xs text-slate-500">
        <p>Health AI Sénégal &bull; Dakar &bull; Ministère de la Santé et de l'Action Sociale</p>
      </footer>
    </main>
  );
}
