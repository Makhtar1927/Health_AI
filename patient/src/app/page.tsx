'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  Activity,
  HeartHandshake,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import HealthAILogo from '@/components/HealthAILogo';

export default function PatientDirectLogin() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearError, initialize } = useAuthStore();

  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initialize();
    clearError();
    setMounted(true);
  }, [initialize, clearError]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/patient/home');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const trimmed = identifier.trim();
    if (!trimmed) {
      setLocalError(authMethod === 'email' ? 'Veuillez saisir votre adresse email.' : 'Veuillez saisir votre numéro de téléphone.');
      return;
    }

    if (!password) {
      setLocalError('Veuillez saisir votre mot de passe.');
      return;
    }

    // Normaliser l'email si connexion par téléphone
    const finalEmail = authMethod === 'email' 
      ? trimmed 
      : `${trimmed.replace(/[^0-9]/g, '')}@patient.healthai.sn`;

    const success = await login(finalEmail, password, 'patient');
    if (success) {
      router.push('/patient/home');
    }
  };



  // Prevent hydration mismatch: same root tag <main> on server & client
  if (!mounted) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <HealthAILogo size="lg" pulse />
          <p className="text-xs text-slate-500 font-medium">Connexion sécurisée...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-teal-500 selection:text-white">
      
      {/* Top Banner de Sécurité Médicale */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-700">Portail Patient Officiel</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline text-slate-500">Plateforme certifiée HDS (Santé)</span>
          </div>
          <div className="flex items-center gap-1.5 text-teal-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Chiffrement AES-256</span>
          </div>
        </div>
      </div>

      {/* Main Content Area : Responsive Mobile-First & Adapté aux Grands Écrans */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* COLONNE GAUCHE (Visible sur grand écran / Desktop) : Rassurance Médicale */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-center pr-4 xl:pr-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-semibold w-fit mb-6">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Votre santé à portée de main</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-slate-900 leading-tight mb-4">
              Retrouvez toutes vos informations de santé en un seul endroit sécurisé.
            </h1>

            <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-xl">
              Accédez en toute confidentialité à vos ordonnances numériques, prenez vos rendez-vous médicaux et communiquez facilement avec vos professionnels de santé.
            </p>

            {/* Cartes d'Avantages Pro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mb-8">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-teal-50 text-teal-700 flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">Rendez-vous 24/7</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Planification directe avec rappels SMS et WhatsApp</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">Ordonnances QR</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Transmises instantanément à votre pharmacie</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 flex-shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">Dossier Partagé</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Constantes, analyses labo et historique médical</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-purple-50 text-purple-700 flex-shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">Secret Médical</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Conformité RGPD et protection HDS des données</p>
                </div>
              </div>
            </div>

            {/* Note de Confiance */}
            <div className="flex items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-200/60 max-w-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Plus de 45 cliniques, hôpitaux et cabinets connectés au réseau Health AI au Sénégal.</span>
            </div>
          </div>

          {/* COLONNE DROITE / CARTE MOBILE-FIRST : Espace de Connexion Direct */}
          <div className="w-full lg:col-span-6 xl:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
              
              {/* Header de la Carte */}
              <div className="text-center sm:text-left mb-6">
                <div className="inline-flex items-center gap-2.5 mb-2">
                  <HealthAILogo size="md" />
                  <div>
                    <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">Health AI</span>
                    <span className="text-[11px] font-medium text-teal-700 uppercase tracking-wider">Espace Patient</span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-3">
                  Connexion Patient
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Accédez à votre espace santé sécurisé en toute simplicité.
                </p>
              </div>

              {/* Erreur éventuelle */}
              {(error || localError) && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{error || localError}</span>
                </div>
              )}

              {/* Sélecteur de méthode (Email vs Téléphone) */}
              <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
                <button
                  type="button"
                  onClick={() => { setAuthMethod('email'); setLocalError(null); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    authMethod === 'email'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Adresse Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMethod('phone'); setLocalError(null); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    authMethod === 'phone'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Numéro Téléphone</span>
                </button>
              </div>

              {/* Formulaire de Connexion */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Champ Identifiant */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {authMethod === 'email' ? 'Adresse email du patient' : 'Numéro de téléphone portable'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      {authMethod === 'email' ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <Phone className="w-4 h-4" />
                      )}
                    </div>
                    <input
                      type={authMethod === 'email' ? 'email' : 'tel'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={authMethod === 'email' ? 'ex: moussa.diop@email.com' : 'ex: 77 123 45 67 ou +221'}
                      required
                      autoComplete={authMethod === 'email' ? 'email' : 'tel'}
                      className="w-full pl-10 pr-3.5 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Mot de passe
                    </label>
                    <a
                      href="#forgot-password"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Un SMS ou email de réinitialisation vous sera envoyé après validation de votre identifiant.');
                      }}
                      className="text-xs text-teal-700 hover:text-teal-800 font-medium hover:underline"
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Se souvenir de moi */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500 focus:ring-offset-0"
                    />
                    <span>Rester connecté sur cet appareil</span>
                  </label>
                </div>

                {/* Bouton d'Action Principal */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connexion sécurisée en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Se connecter à mon espace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>



              {/* S'INSCRIRE EN BAS (Mise en avant claire exigée par l'utilisateur) */}
              <div className="mt-6 pt-5 border-t border-slate-200/80 text-center">
                <p className="text-xs sm:text-sm text-slate-600">
                  Vous n'avez pas encore de compte patient ?
                </p>
                <Link
                  href="/patient/register"
                  className="inline-flex items-center justify-center gap-1.5 mt-2.5 w-full py-2.5 px-4 rounded-xl border-2 border-teal-600 text-teal-700 hover:bg-teal-50 active:bg-teal-100 font-semibold text-xs sm:text-sm transition-all"
                >
                  <span>Créer un compte patient gratuitement</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Footer Institutionnel et Sécurisé */}
      <footer className="bg-white border-t border-slate-200/80 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Health AI — Système de Santé Numérique et IA Médicale.</p>
          <div className="flex items-center gap-4">
            <a href="#confidentialite" className="hover:text-slate-800 transition-colors">Confidentialité & Données</a>
            <span className="text-slate-300">•</span>
            <a href="#assistance" className="hover:text-slate-800 transition-colors">Assistance Patient 24/7</a>
          </div>
        </div>
      </footer>

    </main>
  );
}
