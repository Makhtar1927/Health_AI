'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

export default function SuperAdminLogin() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearError, initialize } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    initialize();
    clearError();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const success = await login(email, password, 'superadmin');
    if (success) {
      setShowToast(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 text-slate-800 overflow-hidden">
      
      {/* Background Animated Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-amber-400/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-yellow-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '2.5s' }} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-sm">
        
        {/* Back Link to global portal switcher on port 3000 */}
        <a 
          href="http://localhost:3000" 
          className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-slate-800 transition-colors mb-6 cursor-pointer no-underline font-bold"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Retour au portail
        </a>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg text-white mb-4"
          >
            <Shield className="h-8 w-8 text-white font-extrabold" />
          </motion.div>
          
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 text-slate-900">Super-Administration</h1>
          <p className="text-xs text-amber-600 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
            Contrôle Global Écosystème
            <Sparkles className="h-3 w-3" />
          </p>
        </div>

        {/* Card Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white/85 border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 backdrop-blur-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-amber-500/5 blur-xl pointer-events-none" />

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Super-Administrateur</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="superadmin@sunusante.sn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-amber-500 text-slate-900 transition-colors shadow-sm focus:shadow-md"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mot de Passe</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-amber-500 text-slate-900 transition-colors shadow-sm focus:shadow-md"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || showToast}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-500 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50 border-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Authentification...
                </>
              ) : (
                'Accéder au Contrôle Global'
              )}
            </button>

          </form>

        </motion.div>

        {/* Demo Alert */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-center shadow-sm">
          <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
            💡 <strong className="text-amber-700">Mode Maquette</strong> : Saisissez n'importe quelle adresse email et mot de passe pour tester. Le compte sera créé automatiquement s'il n'existe pas encore.
          </p>
        </div>

      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-600 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-extrabold text-xs animate-bounce border border-amber-500/10">
          <Shield className="h-4.5 w-4.5 text-white animate-pulse" />
          Super-Admin Certifié ! Chargement de la console système...
        </div>
      )}

      <footer className="mt-12 text-center text-[10px] text-slate-600 font-bold relative z-10">
        &copy; {new Date().getFullYear()} Sunu Santé - Noyau de Super-Administration Global.
      </footer>
    </div>
  );
}
