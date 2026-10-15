'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Mail, ArrowLeft, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CashierLogin() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearError, initialize } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    initialize();
    clearError();
  }, [initialize, clearError]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/cashier/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const success = await login(email, password, 'cashier');
    if (success) {
      setShowToast(true);
      setTimeout(() => {
        router.push('/cashier/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-emerald-50/35 to-slate-100 text-slate-800 overflow-hidden">
      
      {/* Background Animated Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[15%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-emerald-400/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[15%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-teal-500/10 blur-[90px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full bg-amber-200/20 blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-sm">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-6 cursor-pointer font-bold no-underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au portail
        </Link>

        {/* Logo Health AI + Badge Caisse */}
        <motion.div 
          initial={{ scale: 0.85, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center mb-6 gap-3.5"
        >
          <div className="relative">
            <span className="absolute inset-0 rounded-2xl animate-ping bg-emerald-400/20" style={{ animationDuration: '2s' }} />
            <div className="relative w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-xl flex items-center justify-center p-2">
              <Image
                src="/HealthAI_symbole.png"
                alt="Health AI"
                width={64}
                height={64}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            {/* Badge Espace Caisse */}
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-md border border-white text-white">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Espace Caisse</h1>
            <p className="text-xs font-semibold text-emerald-600 mt-0.5 uppercase tracking-wider flex items-center justify-center gap-1">
              Connexion Guichet Caissier
              <Sparkles className="h-3 w-3" />
            </p>
          </div>
        </motion.div>

        {/* Card Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white/90 border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md relative overflow-hidden"
        >
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="moussa.caisse@healthai.sn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-800 font-medium transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mot de Passe</label>
                <a href="#" className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold transition-colors">Mot de passe oublié ?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-800 font-medium transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || showToast}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.01] transition-all active:scale-95 disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ouverture de session caisse...
                </>
              ) : (
                'Ouvrir ma Session Caisse'
              )}
            </button>

          </form>

          {/* Links */}
          <div className="mt-5 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Pas encore enregistré ?{' '}
              <Link href="/cashier/register" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">
                Créer un compte caissier
              </Link>
            </p>
          </div>

        </motion.div>

        {/* Info Mode Démo */}
        <div className="mt-5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            💡 <strong className="text-emerald-700">Test Rapide</strong> : Saisissez n'importe quel email et mot de passe pour ouvrir la caisse.
          </p>
        </div>

      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <Sparkles className="h-4 w-4 text-white animate-pulse" />
          Session ouverte ! Chargement du terminal de facturation...
        </div>
      )}

      <footer className="mt-8 text-center text-xs text-slate-400 relative z-10 font-medium">
        &copy; {new Date().getFullYear()} Health AI — Module Comptable & Facturation Certifié.
      </footer>
    </div>
  );
}
