'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Mail, ArrowLeft, Loader2, Sparkles, User, Phone, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CashierRegister() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading, error, clearError, initialize } = useAuthStore();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [matricule, setMatricule] = useState('');
  const [posCode, setPosCode] = useState('Caisse N°1 - Admissions Générales');
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
    if (!firstName || !lastName || !email || !phone || !matricule || !posCode || !password) return;
    
    const fullName = `${firstName} ${lastName}`;
    const details = {
      firstName,
      lastName,
      matricule,
      posCode,
      phone
    };

    const success = await register(email, password, 'cashier', fullName, details);
    if (success) {
      setShowToast(true);
      setTimeout(() => {
        router.push('/cashier/dashboard');
      }, 1500);
    }
  };

  const posCodes = [
    "Caisse N°1 - Admissions Générales",
    "Caisse N°2 - Urgences 24/7",
    "Caisse N°3 - Imagerie & Radiologie",
    "Caisse N°4 - Pharmacie Principale",
    "Caisse N°5 - Consultations Spécialisées"
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-emerald-50/35 to-slate-100 text-slate-800 overflow-hidden py-12">
      
      {/* Background Animated Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-emerald-400/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-teal-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full bg-amber-200/20 blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-2xl">
        
        {/* Back Link */}
        <Link 
          href="/cashier/login" 
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-6 cursor-pointer font-bold no-underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la connexion
        </Link>

        {/* Logo Health AI + Header */}
        <motion.div 
          initial={{ scale: 0.85, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center mb-6 gap-3"
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
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-md border border-white text-white">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Inscription Caisse</h1>
            <p className="text-xs font-semibold text-emerald-600 mt-1 uppercase tracking-wider">
              Enregistrement Agent Caissier / Facturation
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
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Prenom */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Moussa"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>

              {/* Nom */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Nom</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Diop"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Adresse Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="moussa.diop@healthai.sn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">N° de Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+221 77 654 32 10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>

              {/* Matricule */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Matricule Interne Caissier</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="CSH-4091-B"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>

              {/* PosCode */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Assignation Guichet de Caisse</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    value={posCode}
                    onChange={(e) => setPosCode(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-800 font-medium transition-all cursor-pointer appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%2364748b' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`, backgroundPosition: 'right 10px center', backgroundRepeat: 'no-repeat', backgroundSize: '16px' }}
                  >
                    {posCodes.map((c) => (
                      <option key={c} value={c} className="bg-white text-slate-800">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Mot de Passe de Sécurité</label>
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

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || showToast}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.01] transition-all active:scale-95 disabled:opacity-50 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Création de l'habilitation caisse...
                </>
              ) : (
                "Créer mon compte caissier"
              )}
            </button>

          </form>

          {/* Links */}
          <div className="mt-5 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Déjà un compte caissier ?{' '}
              <Link href="/cashier/login" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">
                Se connecter
              </Link>
            </p>
          </div>

        </motion.div>

      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <Sparkles className="h-4 w-4 text-white animate-pulse" />
          Compte créé avec succès ! Ouverture du guichet de caisse...
        </div>
      )}

      <footer className="mt-8 text-center text-xs text-slate-400 relative z-10 font-medium">
        &copy; {new Date().getFullYear()} Health AI — Module Comptable & Facturation Certifié.
      </footer>
    </div>
  );
}
