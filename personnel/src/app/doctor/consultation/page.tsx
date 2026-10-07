'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  ArrowLeft, 
  User, 
  Activity, 
  Sparkles, 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle,
  AlertTriangle,
  Loader2,
  Brain,
  Info,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { getAuthHeader, useAuthStore } from '../../../lib/authStore';

interface Drug {
  name: string;
  dosage: string;
}

function ConsultationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const { user, isAuthenticated, initialize, logout } = useAuthStore();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    initialize();
    setCheckingAuth(false);
  }, [initialize]);

  const id = searchParams.get('id') || 'P-NEW';
  const name = searchParams.get('name') || 'Patient Inconnu';
  const age = searchParams.get('age') || '30';
  const gender = searchParams.get('gender') || 'M';
  const reason = searchParams.get('reason') || 'Consultation de routine';

  useEffect(() => {
    if (!checkingAuth) {
      if (!isAuthenticated) {
        // Securely capture target deep-link to allow redirect back after login
        const originalUrl = window.location.pathname + window.location.search;
        router.push(`/doctor/login?redirect=${encodeURIComponent(originalUrl)}`);
      }
    }
  }, [checkingAuth, isAuthenticated, router]);

  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  
  // Prescription State
  const [drugs, setDrugs] = useState<Drug[]>([
    { name: '', dosage: '' }
  ]);

  // AI States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [alertLevel, setAlertLevel] = useState<'GREEN' | 'ORANGE' | 'ROUGE' | null>(null);
  
  // Submit Saving State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const addDrug = () => {
    setDrugs([...drugs, { name: '', dosage: '' }]);
  };

  const removeDrug = (index: number) => {
    setDrugs(drugs.filter((_, i) => i !== index));
  };

  const handleDrugChange = (index: number, field: keyof Drug, value: string) => {
    const updated = [...drugs];
    updated[index][field] = value;
    setDrugs(updated);
  };

  // Trigger Gemini Drug Interaction Checker
  const checkDrugInteractions = async () => {
    const activeDrugs = drugs.filter(d => d.name.trim() !== '');
    if (activeDrugs.length === 0) {
      alert("Veuillez saisir au moins un médicament.");
      return;
    }

    setIsAiLoading(true);
    setAiReport(null);
    setAlertLevel(null);

    try {
      const authHeader = await getAuthHeader();
      const res = await fetch('http://localhost:5000/api/ai/analyze-prescription', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify({ drugs: activeDrugs })
      });

      const data = await res.json();
      if (data.success) {
        setAiReport(data.analysis);
        
        // Detect Alert Level in response text
        const text = data.analysis.toUpperCase();
        if (text.includes('ROUGE') || text.includes('CONTRE-INDICATION ABSOLUE') || text.includes('DANGER')) {
          setAlertLevel('ROUGE');
        } else if (text.includes('ORANGE') || text.includes('RISQUE MODÉRÉ') || text.includes('PRÉCAUTION')) {
          setAlertLevel('ORANGE');
        } else {
          setAlertLevel('GREEN');
        }
      } else {
        setAiReport("⚠️ Impossible d'obtenir l'analyse de prescription. Assurez-vous que l'API et la clé Gemini soient configurées.");
      }
    } catch (error) {
      console.error(error);
      setAiReport("⚠️ Erreur de connexion avec le module d'interactions IA. (Est-ce que le backend tourne sur localhost:5000 ?)");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Trigger Gemini Assistant to suggest diagnosis
  const suggestDiagnosis = async () => {
    if (!symptoms.trim()) {
      alert("Veuillez d'abord saisir quelques symptômes.");
      return;
    }

    setIsAiLoading(true);
    setAiReport(null);
    setAlertLevel(null);

    try {
      const authHeader = await getAuthHeader();
      const res = await fetch('http://localhost:5000/api/ai/clinical-assistant', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify({ 
          query: `En tant que consultant médical, suggérez des hypothèses diagnostiques, des questions cliniques clés à poser et une proposition de traitement (médicaments & dosages recommandés) pour les symptômes suivants : "${symptoms}". Renvoyez uniquement un rapport clinique concis structuré en français.`,
          history: [] 
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiReport(data.response);
        setAlertLevel('GREEN');
      } else {
        setAiReport("⚠️ Une erreur est survenue lors de la suggestion diagnostique.");
      }
    } catch (error) {
      console.error(error);
      setAiReport("⚠️ Erreur lors de l'accès au service de diagnostic clinique par l'IA.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Save consultation sheet
  const handleSaveConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate saving to Supabase
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        router.push('/doctor/dashboard');
      }, 2000);
    }, 1500);
  };

  if (checkingAuth || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="text-xs text-slate-400 mt-2">Vérification de l'habilitation médicale...</p>
      </div>
    );
  }

  if (user && user.role !== 'doctor') {
    const handleLogoutAndRetry = () => {
      logout();
      const originalUrl = window.location.pathname + window.location.search;
      router.push(`/doctor/login?redirect=${encodeURIComponent(originalUrl)}`);
    };

    const getDashboardRedirect = () => {
      if (user.role === 'nurse') return '/nurse/dashboard';
      if (user.role === 'pharmacist') return '/pharmacist/dashboard';
      if (user.role === 'radiology') return '/radiology/dashboard';
      if (user.role === 'reception') return '/reception/dashboard';
      if (user.role === 'cashier') return '/cashier/dashboard';
      return '/';
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col justify-between p-4 sm:p-6 text-slate-100">
        <div className="flex-grow flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full bg-slate-900/60 border border-red-500/20 p-8 rounded-3xl text-center space-y-6 shadow-2xl backdrop-blur-md relative overflow-hidden"
          >
            {/* Glowing background details */}
            <div className="absolute top-0 left-0 w-24 h-24 rounded-full bg-red-500/5 blur-xl pointer-events-none" />
            
            <div className="flex flex-col items-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shadow-lg shadow-red-500/5 animate-pulse">
                <AlertTriangle className="h-8 w-8" />
              </div>
              
              <h2 className="text-xl font-black text-white tracking-tight">Accès Sécurisé Restreint</h2>
              <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-[10px] uppercase tracking-wider">
                Habilitation Médecin Requise
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Ce dossier médical partagé (ID Vital : <strong className="font-mono text-cyan-400">{id}</strong>) contient des informations confidentielles protégées. 
              Votre compte actuel (<strong className="text-slate-200">{user.name}</strong>, Rôle : <strong className="text-amber-400 font-bold uppercase">{user.role}</strong>) n'est pas habilité à accéder à ces fiches de consultation clinique.
            </p>

            <div className="pt-2 flex flex-col gap-3">
              <button 
                onClick={handleLogoutAndRetry}
                className="w-full h-11 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/10 transition-colors"
              >
                Déconnexion & Compte Médecin
              </button>
              
              <Link 
                href={getDashboardRedirect()}
                className="w-full h-11 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center transition-colors border border-slate-700"
              >
                Retourner à mon Espace Travail
              </Link>
            </div>
          </motion.div>
        </div>

        <footer className="text-center text-[10px] text-slate-600 py-4">
          &copy; {new Date().getFullYear()} Sunu Santé - Système de Traçabilité & Confidentialité Médicale HIPAA.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doctor/dashboard" className="h-10 w-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 border border-slate-700 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Espace de Consultation</h1>
            <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Sunu Santé &bull; Dossier Médical Partagé</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-400" />
            Patient : {name}
          </span>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Clinical Inputs (Forms) */}
        <form onSubmit={handleSaveConsultation} className="lg:col-span-2 space-y-8">
          
          {/* Patient Card Info */}
          <section className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dossier Actif</span>
              <h2 className="text-xl font-extrabold text-slate-100">{name}</h2>
              <p className="text-xs text-slate-400 font-semibold">{age} ans &bull; Sexe : {gender} &bull; ID Patient : <span className="font-mono text-emerald-400 font-bold">{id}</span></p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl">
              <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-wider">Motif d'Admission</span>
              <span className="text-xs font-bold text-slate-300">{reason}</span>
            </div>
          </section>

          {/* Clinical Worksheets */}
          <section className="bg-slate-950/40 rounded-3xl border border-slate-800/80 p-6 space-y-6 shadow-glass backdrop-blur-glass">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-900">
              <Activity className="h-5 w-5 text-emerald-400 animate-pulse" />
              <h3 className="font-extrabold text-base tracking-tight">Observations & Diagnostic Clinique</h3>
            </div>

            <div className="space-y-4">
              {/* Symptoms Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-extrabold text-slate-400">Symptômes Déclarés & Signes Cliniques</label>
                  <button
                    type="button"
                    onClick={suggestDiagnosis}
                    className="h-8 px-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white font-bold text-[10px] flex items-center gap-1.5 transition-all border border-indigo-500/20 cursor-pointer"
                  >
                    <Brain className="h-3.5 w-3.5" />
                    Analyser avec l'IA
                  </button>
                </div>
                <textarea
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                  placeholder="Ex: Céphalées pulsatiles depuis 4 jours, fièvre modérée à 38.5°C, asthénie intense, toux sèche nocturne..."
                  className="w-full h-24 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-white transition-colors placeholder-slate-600"
                />
              </div>

              {/* Diagnosis Input */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400">Hypothèse Diagnostique Finale</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  placeholder="Ex: Tachycardie sinusale réactionnelle / Tendance paludéenne à confirmer"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-white transition-colors placeholder-slate-600"
                />
              </div>

              {/* Clinical Notes Input */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400">Notes Cliniques & Conseils Hygiéno-Diététiques</label>
                <textarea
                  value={clinicalNotes}
                  onChange={e => setClinicalNotes(e.target.value)}
                  placeholder="Ex: Hydratation abondante prescrite. Repos strict de 3 jours. Suivi de température toutes les 6 heures..."
                  className="w-full h-24 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-white transition-colors placeholder-slate-600"
                />
              </div>
            </div>
          </section>

          {/* Dynamic Interactive Prescription */}
          <section className="bg-slate-950/40 rounded-3xl border border-slate-800/80 p-6 space-y-6 shadow-glass backdrop-blur-glass">
            <div className="flex items-center justify-between pb-4 border-b border-slate-900">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-400" />
                <h3 className="font-extrabold text-base tracking-tight">Ordonnance & Médication</h3>
              </div>
              
              <button
                type="button"
                onClick={checkDrugInteractions}
                className="h-8 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold text-[10px] flex items-center gap-1.5 transition-all border border-emerald-500/20 cursor-pointer shadow-lg shadow-emerald-500/5 animate-pulse"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Vérifier Interactions (IA)
              </button>
            </div>

            <div className="space-y-4">
              {drugs.map((drug, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Nom du médicament (ex: Paracétamol)"
                      value={drug.name}
                      onChange={e => handleDrugChange(index, 'name', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-white transition-colors"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Dosage (ex: 1g matin et soir pendant 5 jours)"
                      value={drug.dosage}
                      onChange={e => handleDrugChange(index, 'dosage', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-white transition-colors"
                    />
                  </div>

                  {drugs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDrug(index)}
                      className="h-10 w-10 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-red-500/20"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addDrug}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Ajouter un autre médicament
              </button>
            </div>
          </section>

          {/* Action Footer Buttons */}
          <div className="flex justify-end gap-4">
            <Link
              href="/doctor/dashboard"
              className="h-12 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
            >
              Annuler
            </Link>
            
            <button
              type="submit"
              disabled={isSaving || saveSuccess}
              className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/10 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Sauvegarde de la consultation...
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle className="h-4.5 w-4.5 text-white" />
                  Consultation Enregistrée !
                </>
              ) : (
                <>
                  Enregistrer & Valider la Fiche
                </>
              )}
            </button>
          </div>

        </form>

        {/* Right Side: AI Assistant & Drug Interaction Reports */}
        <div className="space-y-8">
          
          <section className="bg-slate-950/40 rounded-3xl border border-slate-800/80 p-6 shadow-glass backdrop-blur-glass flex flex-col min-h-[450px]">
            
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Brain className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-200 flex items-center gap-1">
                    Analyse Clinique IA
                    <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
                  </h3>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Google Gemini active</p>
                </div>
              </div>
            </div>

            {/* AI Results Presentation */}
            <div className="flex-1 flex flex-col justify-center">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
                  <p className="text-xs text-slate-400">Calcul du métabolisme et recoupement des interactions médicamenteuses en cours...</p>
                </div>
              ) : aiReport ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  {/* Alert level indicator */}
                  {alertLevel === 'ROUGE' && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <strong className="font-bold">Alerte Rouge : Contre-indication absolue !</strong>
                        <p className="mt-1 opacity-90">Des paires de médicaments de cette liste présentent des risques sévères. Substitutions indispensables.</p>
                      </div>
                    </div>
                  )}

                  {alertLevel === 'ORANGE' && (
                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <strong className="font-bold">Alerte Orange : Vigilance recommandée</strong>
                        <p className="mt-1 opacity-90">Prendre des précautions d'administration ou surveiller le tableau biologique.</p>
                      </div>
                    </div>
                  )}

                  {alertLevel === 'GREEN' && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <strong className="font-bold">Alerte Verte : Aucun risque majeur</strong>
                        <p className="mt-1 opacity-90">La combinaison de médicaments ne présente aucune interaction négative majeure répertoriée.</p>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-300 leading-relaxed whitespace-pre-line max-h-[450px] overflow-y-auto font-sans">
                    {aiReport}
                  </div>
                </motion.div>
              ) : (
                <div className="text-center p-8 text-slate-500 space-y-3">
                  <Info className="h-10 w-10 mx-auto opacity-30 text-indigo-400" />
                  <h4 className="font-bold text-xs text-slate-400">En attente d'évaluation</h4>
                  <p className="text-[11px] max-w-xs mx-auto leading-relaxed">
                    Saisissez des symptômes ou listez des médicaments, puis cliquez sur les boutons IA pour lancer l'analyse en temps réel.
                  </p>
                </div>
              )}
            </div>

          </section>

        </div>

      </main>

      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
        &copy; {new Date().getFullYear()} Sunu Santé - Module IA de Prescription & Sécurisation Clinique.
      </footer>
    </div>
  );
}

export default function DoctorConsultation() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    }>
      <ConsultationContent />
    </Suspense>
  );
}
