'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ArrowLeft, Loader2, Sparkles, Building2, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function AdminPharmacyLogin() {
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
      router.push('/pharmacy/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const success = await login(email, password, 'admin_pharmacy');
    if (success) {
      setShowToast(true);
      setTimeout(() => {
        router.push('/pharmacy/dashboard');
      }, 1200);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-100 text-slate-900 overflow-hidden">
      
      {/* Halos décoratifs lumineux en arrière-plan */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-96 h-96 rounded-full bg-violet-400/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-[10%] right-[15%] w-96 h-96 rounded-full bg-fuchsia-400/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Lien retour au portail global */}
        <a 
          href="https://healthai-sn.vercel.app" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-6 cursor-pointer no-underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au portail d&apos;accueil
        </a>

        {/* En-tête avec Logo Officiel Health AI */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-white shadow-xl border border-slate-200/90 mb-4"
          >
            <Image
              src="/HealthAI_symbole.png"
              alt="Health AI"
              width={56}
              height={56}
              className="object-contain"
              priority
            />
          </motion.div>
          
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Direction Pharmacie</h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-800 border border-violet-200 text-xs font-black uppercase tracking-wider mt-2">
            <Building2 className="h-3.5 w-3.5 text-violet-600" />
            Administration & Gérance d&apos;Officine
          </div>
        </div>

        {/* Carte Formulaire Mode Clair First */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white/95 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-violet-500/5 relative overflow-hidden"
        >
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold">
              {error}
            </div>
          )}

          {showToast && (
            <div className="mb-6 p-4 rounded-xl bg-violet-50 border border-violet-200 text-xs text-violet-950 font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-600" />
              Authentification réussie, ouverture de la console...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Adresse Email Administrateur</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="direction.pharma@healthai.sn"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-900 transition-colors"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">Mot de passe</label>
                <Link href="/auth/forgot-password" className="text-[11px] font-bold text-violet-600 hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-900 transition-colors"
                />
              </div>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm shadow-violet-600/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Vérification des accréditations...
                </>
              ) : (
                <>
                  Accéder à la Console Pharmacie
                </>
              )}
            </button>
          </form>

          {/* Note sur les accès */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500">
              Accès strictement réservé aux pharmaciens gérants et administrateurs d&apos;officines accrédités.
            </p>
          </div>
        </motion.div>

        {/* Note de sécurité */}
        <p className="text-center text-[11px] text-slate-400 font-medium mt-6 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-violet-600" />
          Plateforme certifiée Ministère de la Santé & de l&apos;Action Sociale (Sénégal)
        </p>

      </div>
    </div>
  );
}
