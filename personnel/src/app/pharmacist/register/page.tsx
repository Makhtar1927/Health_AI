'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { motion } from 'framer-motion';
import { Pill, Lock, Mail, ArrowLeft, Loader2, Sparkles, User, Phone, ShieldCheck, MapPin, Building2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PharmacistRegister() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading, error, clearError, initialize } = useAuthStore();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rpps, setRpps] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [city, setCity] = useState('Dakar');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    initialize();
    clearError();
  }, [initialize, clearError]);

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
      }, 1200);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-100 text-slate-900 overflow-hidden py-12">
      
      {/* Background Animated Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[5%] left-[10%] w-96 h-96 rounded-full bg-violet-400/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-[5%] right-[10%] w-96 h-96 rounded-full bg-fuchsia-400/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-xl">
        
        {/* Back Link */}
        <Link 
          href="/pharmacist/login" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la connexion
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-white shadow-xl border border-slate-200/90 mb-4"
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
          
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Inscription Officine</h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-800 border border-violet-200 text-xs font-black uppercase tracking-wider mt-2">
            <Pill className="h-3.5 w-3.5 text-violet-600" />
            Création de Compte Pharmacien Titulaire
          </div>
        </div>

        {/* Card Form */}
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
              Compte créé avec succès ! Accès à l&apos;officine...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Prénom & Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Babacar"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Nom</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Diagne"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Email & Téléphone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Adresse Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="b.diagne@officine.sn"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Téléphone Portable</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+221 77 123 45 67"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Numéro RPPS & Nom Officine */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Identifiant RPPS / Ordre</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="RPPS-849204"
                    value={rpps}
                    onChange={e => setRpps(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Nom de la Pharmacie</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Pharmacie Centrale"
                    value={pharmacyName}
                    onChange={e => setPharmacyName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Ville & Mot de passe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Ville d&apos;implantation</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Dakar"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Mot de passe de sécurité</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Bouton validation */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm shadow-violet-600/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enregistrement de l&apos;officine...
                  </>
                ) : (
                  <>
                    Finaliser l&apos;inscription Pharmacien
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Lien retour connexion */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Déjà titulaire d&apos;un compte ?{' '}
              <Link href="/pharmacist/login" className="font-extrabold text-violet-700 hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
