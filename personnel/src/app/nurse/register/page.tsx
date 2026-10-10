'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { motion } from 'framer-motion';
import { Activity, Lock, Mail, ArrowLeft, Loader2, Sparkles, User, Phone, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function NurseRegister() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading, error, clearError, initialize } = useAuthStore();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rpps, setRpps] = useState('');
  const [department, setDepartment] = useState('Urgences');
  const [hospital, setHospital] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    initialize();
    clearError();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/nurse/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !rpps || !hospital || !password) return;
    
    const fullName = `${firstName} ${lastName}`;
    const details = {
      firstName,
      lastName,
      rpps,
      department,
      hospital,
      phone
    };

    const success = await register(email, password, 'nurse', fullName, details);
    if (success) {
      setShowToast(true);
      setTimeout(() => {
        router.push('/nurse/dashboard');
      }, 1500);
    }
  };

  const departments = [
    "Urgences",
    "Pédiatrie",
    "Réanimation",
    "Médecine Générale",
    "Chirurgie Générale",
    "Maternité / Obstétrique",
    "Cardiologie"
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-rose-950 to-slate-950 text-white overflow-hidden py-12">
      
      {/* Background Animated Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-rose-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-red-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-2xl">
        
        {/* Back Link */}
        <Link 
          href="/nurse/login" 
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
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 shadow-lg text-white mb-4"
          >
            <Activity className="h-6 w-6" />
          </motion.div>
          
          <h1 className="text-3xl font-black tracking-tight mb-2">Inscription Infirmier</h1>
          <p className="text-xs text-rose-400 font-bold uppercase tracking-widest">Création de compte Personnel Soignant</p>
        </div>

        {/* Card Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-glass backdrop-blur-glass relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-rose-500/5 blur-2xl pointer-events-none" />

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
                    placeholder="Maimouna"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-rose-500 text-white transition-colors"
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
                    placeholder="Diallo"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-rose-500 text-white transition-colors"
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
                    placeholder="nom.inf@sunusante.sn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-rose-500 text-white transition-colors"
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
                    placeholder="+221 77 444 33 22"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-rose-500 text-white transition-colors"
                  />
                </div>
              </div>

              {/* RPPS / ADELI */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Numéro ADELI / RPPS</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="INF-739281"
                    value={rpps}
                    onChange={(e) => setRpps(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-rose-500 text-white transition-colors"
                  />
                </div>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Service d'Affectation</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-rose-500 text-white transition-colors cursor-pointer appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`, backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '18px' }}
                >
                  {departments.map((d) => (
                    <option key={d} value={d} className="bg-slate-900 text-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hospital */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Clinique / Hôpital d'Affiliation</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Hôpital de Fann, Clinique de l'Amitié, etc."
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-rose-500 text-white transition-colors"
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
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-rose-500 text-white transition-colors"
                  />
                </div>
              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || showToast}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-white hover:from-rose-500 hover:to-red-600 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-700/10 transition-all active:scale-95 disabled:opacity-50 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Création de l'accès clinique...
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
              <Link href="/nurse/login" className="text-rose-400 hover:text-rose-300 font-semibold transition-colors">
                Se connecter
              </Link>
            </p>
          </div>

        </motion.div>

      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
          Fiche de soins validée ! Accès au tableau de bord...
        </div>
      )}

      <footer className="mt-12 text-center text-[10px] text-slate-600 relative z-10">
        &copy; {new Date().getFullYear()} Health AI - Gestion des Dossiers de Soins Infirmiers.
      </footer>
    </div>
  );
}
