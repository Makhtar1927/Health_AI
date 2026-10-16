'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Lock, Mail, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function RadiologyLogin() {
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
      router.push('/radiology/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const success = await login(email, password, 'radiology');
    if (success) {
      setShowToast(true);
      setTimeout(() => {
        router.push('/radiology/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 text-white overflow-hidden">
      
      {/* Background Animated Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-purple-500/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-pink-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '2.5s' }} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Retour au portail
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg text-white mb-4"
          >
            <ImageIcon className="h-8 w-8" />
          </motion.div>
          
          <h1 className="text-3xl font-black tracking-tight mb-2">Espace Imagerie</h1>
          <p className="text-xs text-purple-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
            Connexion Radiologue
            <Sparkles className="h-3 w-3" />
          </p>
        </div>

        {/* Card Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-glass backdrop-blur-glass relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-purple-500/5 blur-xl pointer-events-none" />

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/25 text-xs text-red-400 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="nom.radio@sunusante.sn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500 text-white transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mot de Passe</label>
                <a href="#" className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold transition-colors">Mot de passe oublié ?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500 text-white transition-colors"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || showToast}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-700 text-white hover:from-purple-500 hover:to-pink-600 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-700/10 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Accès PACS en cours...
                </>
              ) : (
                'Accéder au PACS'
              )}
            </button>

          </form>

          {/* Quick links */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500">
              Pas encore inscrit ?{' '}
              <Link href="/radiology/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>

        </motion.div>



      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
          Accès autorisé ! Chargement de la console PACS...
        </div>
      )}

      <footer className="mt-12 text-center text-[10px] text-slate-600 relative z-10">
        &copy; {new Date().getFullYear()} Health AI - Sécurisation PACS DICOM v3.
      </footer>
    </div>
  );
}
