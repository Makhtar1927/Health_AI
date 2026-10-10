'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Lock, Mail, ArrowLeft, Loader2, Sparkles, User, Phone, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function RadiologyRegister() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading, error, clearError, initialize } = useAuthStore();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rpps, setRpps] = useState('');
  const [imagingCenter, setImagingCenter] = useState('');
  const [equipment, setEquipment] = useState('Scanner Multibarette');
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
    if (!firstName || !lastName || !email || !phone || !rpps || !imagingCenter || !password) return;
    
    const fullName = `${firstName} ${lastName}`;
    const details = {
      firstName,
      lastName,
      rpps,
      imagingCenter,
      equipment,
      phone
    };

    const success = await register(email, password, 'radiology', fullName, details);
    if (success) {
      setShowToast(true);
      setTimeout(() => {
        router.push('/radiology/dashboard');
      }, 1500);
    }
  };

  const equipments = [
    "Scanner Multibarette",
    "IRM 3 Tesla",
    "Mammographie 3D (Tomosynthèse)",
    "Échographe Doppler",
    "Radiographie Numérique Standard",
    "Panoramique Dentaire"
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 text-white overflow-hidden py-12">
      
      {/* Background Animated Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-purple-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-pink-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-2xl">
        
        {/* Back Link */}
        <Link 
          href="/radiology/login" 
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
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg text-white mb-4"
          >
            <ImageIcon className="h-6 w-6" />
          </motion.div>
          
          <h1 className="text-3xl font-black tracking-tight mb-2">Inscription Radiologue</h1>
          <p className="text-xs text-purple-400 font-bold uppercase tracking-widest">Création de compte Spécialiste Imagerie</p>
        </div>

        {/* Card Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-glass backdrop-blur-glass relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-500/5 blur-2xl pointer-events-none" />

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
                    placeholder="Moussa"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500 text-white transition-colors"
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
                    placeholder="Diop"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500 text-white transition-colors"
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
                    placeholder="nom.radio@sunusante.sn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500 text-white transition-colors"
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
                    placeholder="+221 77 987 65 43"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500 text-white transition-colors"
                  />
                </div>
              </div>

              {/* RPPS */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Numéro RPPS / Licence</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="RAD-73920"
                    value={rpps}
                    onChange={(e) => setRpps(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500 text-white transition-colors"
                  />
                </div>
              </div>

              {/* Equipment */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Équipement Spécialisé Principal</label>
                <select
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-purple-500 text-white transition-colors cursor-pointer appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`, backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '18px' }}
                >
                  {equipments.map((eq) => (
                    <option key={eq} value={eq} className="bg-slate-900 text-white">
                      {eq}
                    </option>
                  ))}
                </select>
              </div>

              {/* Imaging Center */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Centre d'Imagerie / Clinique</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Centre d'Imagerie de Dakar, Service Radiologie CHU Fann, etc."
                    value={imagingCenter}
                    onChange={(e) => setImagingCenter(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500 text-white transition-colors"
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
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500 text-white transition-colors"
                  />
                </div>
              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || showToast}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-700 text-white hover:from-purple-500 hover:to-pink-600 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-700/10 transition-all active:scale-95 disabled:opacity-50 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Création de l'accès radiologue...
                </>
              ) : (
                'Créer mon compte radiologue'
              )}
            </button>

          </form>

          {/* Links */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500">
              Déjà un compte ?{' '}
              <Link href="/radiology/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Se connecter
              </Link>
            </p>
          </div>

        </motion.div>

      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
          Compte créé ! Accès PACS activé...
        </div>
      )}

      <footer className="mt-12 text-center text-[10px] text-slate-600 relative z-10">
        &copy; {new Date().getFullYear()} Health AI - Sécurisation PACS DICOM v3.
      </footer>
    </div>
  );
}
