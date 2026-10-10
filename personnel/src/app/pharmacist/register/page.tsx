'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { motion } from 'framer-motion';
import { PlusSquare, Lock, Mail, ArrowLeft, Loader2, Sparkles, User, Phone, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function PharmacistRegister() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading, error, clearError, initialize } = useAuthStore();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rpps, setRpps] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    initialize();
    clearError();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/pharmacist/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !rpps || !pharmacyName || !city || !password) return;
    
    const fullName = `${firstName} ${lastName}`;
    const details = {
      firstName,
      lastName,
      rpps,
      pharmacyName,
      city,
      phone
    };

    const success = await register(email, password, 'pharmacist', fullName, details);
    if (success) {
      setShowToast(true);
      setTimeout(() => {
        router.push('/pharmacist/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-950 text-white overflow-hidden py-12">
      
      {/* Background Animated Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-violet-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-2xl">
        
        {/* Back Link */}
        <Link 
          href="/pharmacist/login" 
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Retour à la connexion
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg text-white mb-4"
          >
            <PlusSquare className="h-6 w-6" />
          </motion.div>
          
          <h1 className="text-3xl font-black tracking-tight mb-2">Inscription Pharmacien</h1>
          <p className="text-xs text-violet-400 font-bold uppercase tracking-widest">Rejoindre le Réseau d'Officines Health AI</p>
        </div>

        {/* Card Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-glass backdrop-blur-glass relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-violet-500/5 blur-2xl pointer-events-none" />

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/25 text-xs text-red-400 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Prenom */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Prénom</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Moustapha"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500 text-white transition-colors"
                  />
                </div>
              </div>

              {/* Nom */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Nom</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Seck"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500 text-white transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Adresse Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="moustapha.seck@sunusante.sn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500 text-white transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">N° de Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="tel"
                    required
                    placeholder="+221 77 111 22 33"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500 text-white transition-colors"
                  />
                </div>
              </div>

              {/* RPPS / Ordre */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Numéro d'Ordre des Pharmaciens</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="PHA-28392"
                    value={rpps}
                    onChange={(e) => setRpps(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500 text-white transition-colors"
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ville d'Officine</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Dakar, Thiès, Saint-Louis, etc."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500 text-white transition-colors"
                  />
                </div>
              </div>

              {/* Pharmacy Name */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Nom de la Pharmacie (Officine ou Hôpital)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Pharmacie de la Nation, Pharmacie du CHU Fann, etc."
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500 text-white transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Mot de Passe de Sécurité</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500 text-white transition-colors"
                  />
                </div>
              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || showToast}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-700 text-white hover:from-violet-500 hover:to-fuchsia-600 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-violet-700/10 transition-all active:scale-95 disabled:opacity-50 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Enregistrement officine en cours...
                </>
              ) : (
                'Finaliser mon inscription'
              )}
            </button>

          </form>

          {/* Links */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500">
              Déjà inscrit ?{' '}
              <Link href="/pharmacist/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                Se connecter
              </Link>
            </p>
          </div>

        </motion.div>

      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-violet-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
          Officine activée ! Redirection en cours...
        </div>
      )}

      <footer className="mt-12 text-center text-[10px] text-slate-600 relative z-10">
        &copy; {new Date().getFullYear()} Health AI - Sécurisation des Prescriptions Électroniques.
      </footer>
    </div>
  );
}
