'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Lock, Calendar, 
  ShieldCheck, ArrowLeft, ArrowRight, 
  Loader2, Sparkles, Award, AlertCircle,
  Eye, EyeOff, Check, X
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
  const [bloodGroup, setBloodGroup] = useState('Non renseigné');
  const [allergies, setAllergies] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Règles de sécurité du mot de passe
  const passwordCriteria = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordValid = 
    passwordCriteria.minLength &&
    passwordCriteria.hasUpper &&
    passwordCriteria.hasLower &&
    passwordCriteria.hasNumber &&
    passwordCriteria.hasSpecial;

  const isPasswordMatch = password.length > 0 && password === confirmPassword;
  
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    initialize();
    clearError();
  }, [initialize, clearError]);

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
      // Groupe sanguin, allergies et contact d'urgence sont facultatifs
      return true;
    }
    return isPasswordValid && isPasswordMatch;
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
      bloodGroup: bloodGroup !== 'Non renseigné' ? bloodGroup : 'Non renseigné',
      allergies: allergies.trim() !== '' ? allergies : 'Aucune connue',
      emergencyContact: {
        name: emergencyName.trim() !== '' ? emergencyName : 'Non renseigné',
        phone: emergencyPhone.trim() !== '' ? emergencyPhone : 'Non renseigné'
      }
    };

    const success = await register(email, password, 'patient', fullName, details);
    if (success === ('pending' as any)) {
      // Email de confirmation envoyé — rediriger vers page d'attente
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('pending-confirmation-email', email);
      }
      router.push('/auth/pending-confirmation');
    } else if (success) {
      setShowToast(true);
      setTimeout(() => {
        router.push('/patient/home');
      }, 1500);
    }
  };

  const bloodGroups = ['Non renseigné', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const stepTitles = [
    "Identité",
    "Coordonnées",
    "Fiche Médicale",
    "Sécurité"
  ];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 py-6 sm:py-10 px-4">
      
      <div className="w-full max-w-lg mx-auto">
        
        {/* Back Link to Direct Login */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la connexion patient
        </Link>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-500 text-white shadow-md shadow-teal-500/20 mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Créer votre Compte Patient
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Création de votre carnet de santé numérique sécurisé Health AI
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-500 mb-2 font-medium">
            <span>Étape {step} sur {totalSteps}</span>
            <span className="text-teal-700 font-semibold">{stepTitles[step - 1]}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex gap-1 p-0.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i} 
                className={`h-full rounded-full transition-all duration-300 flex-1 ${
                  i < step ? 'bg-teal-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card Form Light Mode First */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 relative">
          
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <AnimatePresence mode="wait">
              {/* STEP 1: IDENTITY */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Aminata"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nom de famille</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Ndiaye"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date de Naissance</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="date"
                        required
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white transition-all cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sexe</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setGender('M')}
                        className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                          gender === 'M' 
                            ? 'bg-teal-50 border-teal-600 text-teal-800' 
                            : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Masculin
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('F')}
                        className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                          gender === 'F' 
                            ? 'bg-teal-50 border-teal-600 text-teal-800' 
                            : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Adresse Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="ami.ndiaye@exemple.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Numéro de Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+221 77 123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">N° National d'Identité ou Sécurité Sociale</label>
                    <div className="relative">
                      <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="1 92 08 38 120 493 22"
                        value={socialSecurity}
                        onChange={(e) => setSocialSecurity(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: MEDICAL INFO */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Groupe Sanguin</label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white transition-all cursor-pointer"
                      >
                        {bloodGroups.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Allergies Connues</label>
                      <input
                        type="text"
                        placeholder="ex: Pénicilline, arachides"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-slate-800">
                        Contact d'Urgence Recommandé
                      </p>
                      <span className="text-[10px] text-slate-400">Facultatif — peut être renseigné ou modifié plus tard</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">Nom du Contact</label>
                        <input
                          type="text"
                          placeholder="ex: Moussa Ndiaye (Père / Époux)"
                          value={emergencyName}
                          onChange={(e) => setEmergencyName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">Téléphone du Contact</label>
                        <input
                          type="tel"
                          placeholder="+221 77 987 65 43"
                          value={emergencyPhone}
                          onChange={(e) => setEmergencyPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white transition-all"
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {/* Champ 1: Mot de passe */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Mot de Passe de Sécurité
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Checklist des exigences du mot de passe */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <p className="font-semibold text-slate-700 text-[11px] mb-1">
                      Exigences obligatoires de sécurité :
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${passwordCriteria.minLength ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {passwordCriteria.minLength ? <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-1 flex-shrink-0" />}
                        <span>8 caractères minimum</span>
                      </div>
                      <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${passwordCriteria.hasUpper ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {passwordCriteria.hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-1 flex-shrink-0" />}
                        <span>1 majuscule (A-Z)</span>
                      </div>
                      <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${passwordCriteria.hasLower ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {passwordCriteria.hasLower ? <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-1 flex-shrink-0" />}
                        <span>1 minuscule (a-z)</span>
                      </div>
                      <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${passwordCriteria.hasNumber ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {passwordCriteria.hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-1 flex-shrink-0" />}
                        <span>1 chiffre (0-9)</span>
                      </div>
                      <div className={`flex items-center gap-1.5 text-[11px] font-medium sm:col-span-2 transition-colors ${passwordCriteria.hasSpecial ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {passwordCriteria.hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-1 flex-shrink-0" />}
                        <span>1 caractère spécial (@, #, $, !, %, ...)</span>
                      </div>
                    </div>
                  </div>

                  {/* Champ 2: Confirmer le Mot de Passe */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Confirmer le Mot de Passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                          confirmPassword.length > 0
                            ? isPasswordMatch
                              ? 'border-emerald-500 focus:border-emerald-600 focus:ring-emerald-500/20'
                              : 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                            : 'border-slate-300 focus:border-teal-600 focus:ring-teal-500/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {confirmPassword.length > 0 && (
                      <p className={`text-[11px] mt-1.5 flex items-center gap-1 font-medium ${isPasswordMatch ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPasswordMatch ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Les mots de passe correspondent parfaitement.</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Les mots de passe ne correspondent pas.</span>
                          </>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200/60 flex items-start gap-2.5 text-xs text-teal-800 leading-relaxed">
                    <ShieldCheck className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Protection HDS & Secret Médical</strong> : Vos données médicales sont strictement chiffrées et protégées.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Navigation Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Précédent
                </button>
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canGoNext()}
                  className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-teal-600/20 transition-all"
                >
                  Suivant
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || showToast || !canGoNext()}
                  className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Création en cours...
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

          {/* S'incrire / Connexion en bas */}
          {step === 1 && (
            <div className="mt-5 pt-4 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-600">
                Vous avez déjà un compte ?{' '}
                <Link href="/" className="text-teal-700 hover:text-teal-800 font-semibold hover:underline">
                  Se connecter directement
                </Link>
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 font-semibold text-xs sm:text-sm">
          <Sparkles className="h-4 w-4 text-white" />
          <span>Compte créé avec succès ! Ouverture de votre espace...</span>
        </div>
      )}

      <footer className="mt-8 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Health AI — Système de Santé Numérique et IA Médicale.
      </footer>
    </main>
  );
}
