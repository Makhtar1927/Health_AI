'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Lock, Calendar, Heart, 
  ShieldAlert, ShieldCheck, ArrowLeft, ArrowRight, 
  Loader2, Sparkles, Smartphone, Award
} from 'lucide-react';
import Link from 'next/link';

export default function PatientRegister() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading, error, clearError, initialize } = useAuthStore();
  
  // Step indicator
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('M');
  const [socialSecurity, setSocialSecurity] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    initialize();
    clearError();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/patient/home');
    }
  }, [isAuthenticated, router]);

  // Validation per step
  const canGoNext = () => {
    if (step === 1) {
      return firstName.trim() !== '' && lastName.trim() !== '' && birthDate !== '';
    }
    if (step === 2) {
      return email.trim() !== '' && phone.trim() !== '' && socialSecurity.trim() !== '';
    }
    if (step === 3) {
      return emergencyName.trim() !== '' && emergencyPhone.trim() !== '';
    }
    return password.trim().length >= 6;
  };

  const handleNext = () => {
    if (canGoNext() && step < totalSteps) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== totalSteps || !canGoNext()) return;

    const fullName = `${firstName} ${lastName}`;
    const details = {
      firstName,
      lastName,
      birthDate,
      gender,
      socialSecurity,
      phone,
      bloodGroup,
      allergies: allergies || 'Aucune connue',
      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone
      }
    };

    const success = await register(email, password, 'patient', fullName, details);
    if (success) {
      setShowToast(true);
      setTimeout(() => {
        router.push('/patient/home');
      }, 1500);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Step names
  const stepTitles = [
    "Identité",
    "Coordonnées",
    "Fiche Médicale",
    "Sécurité"
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-950 text-white overflow-hidden py-12">
      
      {/* Background Animated Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Main Container - Optimized for mobile-first layout */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Back Link */}
        <Link 
          href="/patient/login" 
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
            className="inline-flex items-center justify-center p-3.5 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg text-white mb-4"
          >
            <Smartphone className="h-7 w-7 animate-pulse" />
          </motion.div>
          
          <h1 className="text-2xl font-black tracking-tight mb-2">Rejoindre Sunu Santé</h1>
          <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
            Créer mon Carnet de Santé
            <Sparkles className="h-3 w-3" />
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-6 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex justify-between items-center text-[10px] text-slate-400 mb-2.5 font-bold uppercase tracking-wider">
            <span>Étape {step} sur {totalSteps}</span>
            <span className="text-cyan-400">{stepTitles[step - 1]}</span>
          </div>
          <div className="h-2 bg-slate-950 rounded-full overflow-hidden flex gap-1 p-0.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i} 
                className={`h-full rounded-full transition-all duration-300 flex-1 ${
                  i < step ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card Form */}
        <motion.div
          layout
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-glass backdrop-blur-glass relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-cyan-500/5 blur-xl pointer-events-none" />

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/25 text-xs text-red-400 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <AnimatePresence mode="wait">
              {/* STEP 1: IDENTITY */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Aminata"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Nom</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Ndiaye"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Date de Naissance</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                      <input
                        type="date"
                        required
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-white transition-colors cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Sexe</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setGender('M')}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                          gender === 'M' 
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-500 text-white' 
                            : 'bg-slate-950/40 border-slate-850 text-slate-400'
                        }`}
                      >
                        Masculin
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('F')}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                          gender === 'F' 
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-500 text-white' 
                            : 'bg-slate-950/40 border-slate-850 text-slate-400'
                        }`}
                      >
                        Féminin
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: CONTACTS & ID */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Adresse Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                      <input
                        type="email"
                        required
                        placeholder="ami.ndiaye@exemple.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">N° de Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                      <input
                        type="tel"
                        required
                        placeholder="+221 77 123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">N° de Sécurité Sociale / ID Unique</label>
                    <div className="relative">
                      <Award className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="1 92 08 38 120 493 22"
                        value={socialSecurity}
                        onChange={(e) => setSocialSecurity(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-white transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: MEDICAL INFO */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Groupe Sanguin</label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-white transition-colors cursor-pointer appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`, backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '18px' }}
                      >
                        {bloodGroups.map((g) => (
                          <option key={g} value={g} className="bg-slate-900 text-white">
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Allergies Connues</label>
                      <input
                        type="text"
                        placeholder="Pénicilline, arachides (facultatif)"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/60">
                    <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                      Contact d'Urgence
                    </p>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nom du Contact</label>
                        <input
                          type="text"
                          required
                          placeholder="Moussa Ndiaye (Père, Époux...)"
                          value={emergencyName}
                          onChange={(e) => setEmergencyName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs placeholder-slate-650 focus:outline-none focus:border-cyan-500 text-white transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Téléphone du Contact</label>
                        <input
                          type="tel"
                          required
                          placeholder="+221 77 987 65 43"
                          value={emergencyPhone}
                          onChange={(e) => setEmergencyPhone(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs placeholder-slate-650 focus:outline-none focus:border-cyan-500 text-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: PASSWORD */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Mot de Passe de Sécurité</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-white transition-colors"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">Doit contenir au moins 6 caractères.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/30 flex gap-3 text-xs text-cyan-300 leading-relaxed">
                    <ShieldCheck className="h-6 w-6 text-cyan-400 flex-shrink-0" />
                    <div>
                      <strong className="text-cyan-200">RGPD & Confidentialité</strong> : Vos données de santé sont cryptées localement et ne sont accessibles qu'aux praticiens habilités par votre code ou dossier.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4 border-t border-slate-800/80">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 h-12 rounded-xl border border-slate-800 text-slate-300 hover:text-white font-bold text-sm flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </button>
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canGoNext()}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white hover:from-cyan-500 hover:to-blue-600 disabled:opacity-40 disabled:pointer-events-none font-bold text-sm flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-lg shadow-cyan-700/10"
                >
                  Suivant
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || showToast || !canGoNext()}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white hover:from-cyan-500 hover:to-blue-600 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-700/10 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      Créer mon Compte
                      <ShieldCheck className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>

          </form>

          {/* Login Link */}
          {step === 1 && (
            <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
              <p className="text-[11px] text-slate-500">
                Déjà patient ?{' '}
                <Link href="/patient/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                  Se connecter
                </Link>
              </p>
            </div>
          )}

        </motion.div>

      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
          Compte patient créé ! Initialisation de votre dossier...
        </div>
      )}

      <footer className="mt-12 text-center text-[10px] text-slate-600 relative z-10">
        &copy; {new Date().getFullYear()} Sunu Santé - Dossier Médical Individuel Sécurisé.
      </footer>
    </div>
  );
}
