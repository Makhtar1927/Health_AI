'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Lock, 
  Mail, 
  ArrowLeft, 
  Loader2, 
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  KeyRound
} from 'lucide-react';
import Link from 'next/link';
import HealthAILogo from '@/components/HealthAILogo';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading, error, clearError, initialize } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    initialize();
    clearError();
  }, [initialize, clearError]);

  useEffect(() => {
    if (isAuthenticated) {
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push('/doctor/dashboard');
      }
    }
  }, [isAuthenticated, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const success = await login(email, password, 'doctor');
    if (success) {
      setShowToast(true);
      setTimeout(() => {
        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push('/doctor/dashboard');
        }
      }, 1500);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Halos décoratifs subtils */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-100/60 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-100/50 blur-[110px] pointer-events-none rounded-full" />

      {/* Top Banner Sécurité Médicale */}
      <header className="relative z-10 w-full max-w-xl mx-auto flex items-center justify-between pb-6 border-b border-slate-200/80">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Tous les accès pro</span>
        </Link>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Accès RPPS Médical</span>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto py-6">
        
        {/* Brand/Role Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <HealthAILogo size="lg" withText subtitle="Cabinet Médical & Télémédecine" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Espace Praticien Médical
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1.5">
            <span className="font-semibold text-emerald-700">Health AI Sénégal</span>
            <span>&bull;</span>
            <span>Consultations, Ordonnances & Diagnostic IA</span>
          </p>
        </div>

        {/* Card Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden"
        >
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Raccourci Démo Praticien */}
          <div className="mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-[11px] font-semibold text-slate-500">Compte test :</span>
            <button
              type="button"
              onClick={() => { setEmail('medecin@sunusante.sn'); setPassword('Medecin2026!'); }}
              className="text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              Pré-remplir Dr. Aidara
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Adresse e-mail professionnelle
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="medecin@sunusante.sn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">Mot de passe</label>
                <Link href="/auth/forgot-password" className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || showToast}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-700/20 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Accéder à ma consultation clinique</span>
                </>
              )}
            </button>

          </form>

          {/* Rappel compte test */}
          <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
            <span className="font-medium">Compte Médecin Test :</span>
            <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              medecin@sunusante.sn
            </span>
          </div>

        </motion.div>

      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 font-bold text-xs animate-bounce border border-emerald-400">
          <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
          <span>Authentification médecin réussie ! Chargement du cabinet...</span>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-xl mx-auto pt-4 border-t border-slate-200/80 text-center text-[11px] text-slate-500">
        &copy; {new Date().getFullYear()} Health AI Sénégal &bull; Ordre National des Médecins &bull; HDS
      </footer>
    </div>
  );
}

export default function DoctorLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-600">
        <HealthAILogo size="lg" pulse />
        <p className="text-xs text-slate-500 mt-3 font-medium">Chargement de la connexion sécurisée...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
