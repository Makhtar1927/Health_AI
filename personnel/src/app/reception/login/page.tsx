'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { motion } from 'framer-motion';
import { Users, Lock, Mail, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ReceptionLogin() {
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
      router.push('/reception/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const success = await login(email, password, 'reception');
    if (success) {
      setShowToast(true);
      setTimeout(() => {
        router.push('/reception/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-blue-50/35 to-slate-100 text-slate-800 overflow-hidden">
      
      {/* Background Animated Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[15%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-400/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[15%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-indigo-500/10 blur-[90px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full bg-cyan-200/20 blur-3xl" />
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

        {/* Logo Health AI + Badge Réception */}
        <motion.div 
          initial={{ scale: 0.85, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center mb-6 gap-3.5"
        >
          <div className="relative">
            <span className="absolute inset-0 rounded-2xl animate-ping bg-blue-400/20" style={{ animationDuration: '2s' }} />
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
            {/* Badge Espace Accueil */}
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md border border-white text-white">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Health <span className="text-blue-600">AI</span>
            </h1>
            <div className="mt-1.5 inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-full px-3 py-0.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Espace Accueil & Réception</span>
            </div>
          </div>
        </motion.div>

        {/* Card Formulaire Mode Clair */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white/95 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-blue-500/5 blur-xl pointer-events-none" />

          <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-6 text-center">
            Identification Personnel d'Accueil
          </p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold leading-relaxed">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="reception@healthai.sn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-slate-900 transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Mot de Passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-slate-900 transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || showToast}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 border-0 mt-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authentification...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  Accéder à l'Accueil Clinique
                </>
              )}
            </button>

          </form>

        </motion.div>

        {/* Demo Alert */}
        <div className="mt-5 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/70 text-center">
          <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
            💡 <strong className="text-blue-800">Compte démo</strong> : Saisissez n'importe quel email/mot de passe pour tester. Il sera auto-configuré.
          </p>
        </div>

      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 font-bold text-xs border border-blue-500/20 animate-bounce">
          <Sparkles className="h-4 w-4 text-white animate-pulse" />
          Session certifiée · Chargement de la console d'accueil...
        </div>
      )}

      <footer className="mt-10 text-center text-[10px] text-slate-500 font-bold relative z-10">
        &copy; {new Date().getFullYear()} Health AI — Module d'Admission & Accueil Hospitalier.
      </footer>
    </div>
  );
}
