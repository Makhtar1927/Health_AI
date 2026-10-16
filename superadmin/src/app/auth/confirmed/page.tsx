'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, ArrowRight, Lock, Sparkles, UserCheck, Globe, BarChart3, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AuthConfirmedPage() {
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) setConfirmedEmail(session.user.email);
      } catch (err) {
        console.warn('Erreur verification session :', err);
      } finally {
        setIsVerifying(false);
      }
    };
    checkSession();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) setConfirmedEmail(session.user.email);
      setIsVerifying(false);
    });
    return () => { authListener?.subscription.unsubscribe(); };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/10 blur-[120px] pointer-events-none rounded-full" />

      <header className="relative z-10 w-full max-w-xl mx-auto flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white p-1 shadow-md flex items-center justify-center">
            <Image
              src="/HealthAI_symbole.png"
              alt="Health AI"
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              HEALTH AI <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-full">Super Admin</span>
            </h1>
            <p className="text-[11px] text-slate-400">Administration centrale</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Securite HDS</span>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-xl mx-auto my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-gradient-to-tr from-purple-500 to-violet-400 p-1 shadow-lg shadow-purple-500/25 flex items-center justify-center"
          >
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 animate-pulse" />
            </div>
          </motion.div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Compte Super Administrateur active
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
            Compte Super Admin actif !
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
            Votre identite a ete confirmee. Vous disposez d'un acces complet a la plateforme Health AI pour superviser l'ensemble du reseau de sante.
          </p>

          {confirmedEmail && (
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto mb-6 flex items-center justify-center gap-2 text-xs text-slate-200">
              <UserCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>Adresse confirmee :</span>
              <strong className="text-purple-300 font-mono truncate">{confirmedEmail}</strong>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-8 text-left">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 w-fit mb-2"><Globe className="w-4 h-4" /></div>
              <div><p className="text-xs font-bold text-white leading-tight">Reseau National</p><p className="text-[10px] text-slate-400 mt-1">Tous les etablissements</p></div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 w-fit mb-2"><BarChart3 className="w-4 h-4" /></div>
              <div><p className="text-xs font-bold text-white leading-tight">Statistiques</p><p className="text-[10px] text-slate-400 mt-1">Tableaux de bord</p></div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-2"><Shield className="w-4 h-4" /></div>
              <div><p className="text-xs font-bold text-white leading-tight">Securite Globale</p><p className="text-[10px] text-slate-400 mt-1">Acces & permissions</p></div>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-white font-extrabold text-sm shadow-lg shadow-purple-600/30 inline-flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>Acceder au tableau de bord</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      <footer className="relative z-10 w-full max-w-xl mx-auto pt-6 border-t border-white/10 text-center">
        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 mb-1.5">
          <Lock className="w-3.5 h-3.5 text-purple-500" />
          Plateforme certifiee en conformite avec les directives de sante publique du Senegal.
        </p>
        <p className="text-[10px] text-slate-600">
          &copy; {new Date().getFullYear()} Health AI Senegal - Tous droits reserves.
        </p>
      </footer>
    </main>
  );
}
