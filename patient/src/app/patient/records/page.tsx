'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Image as ImageIcon, 
  Activity, 
  Search, 
  Calendar,
  ExternalLink,
  UserCheck,
  AlertTriangle,
  User,
  ShieldCheck,
  Stethoscope,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  FileSpreadsheet,
  HeartPulse,
  Share2,
  Check
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

interface Consultation {
  id: string;
  date: string;
  doctor: string;
  department: string;
  diagnostic: string;
  symptoms: string;
  notes: string;
  biometrics: { weight: string; pressure: string; temp: string; pulse: string };
}

interface ImagingExam {
  id: string;
  date: string;
  type: string;
  doctor: string;
  findings: string;
  conclusion: string;
  status: string;
  imageUrl: string;
}

interface LabReport {
  id: string;
  date: string;
  title: string;
  lab: string;
  biologist: string;
  results: { test: string; value: string; unit: string; range: string; status: 'normal' | 'high' | 'low' }[];
}

const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: "CONS-2026-001",
    date: "12 Mai 2026",
    doctor: "Dr. Abdoulaye Diallo",
    department: "Médecine Générale",
    diagnostic: "Hypertension artérielle légère sous contrôle",
    symptoms: "Céphalées matinales légères, fatigue modérée",
    notes: "Patient en bon état général. Pression légèrement élevée au repos. Poursuite du traitement Lisinopril 10mg.",
    biometrics: { weight: "78 kg", pressure: "14/9 cmHg", temp: "36.7 °C", pulse: "72 bpm" }
  },
  {
    id: "CONS-2026-002",
    date: "04 Février 2026",
    doctor: "Dr. Aminata Touré",
    department: "Pneumologie",
    diagnostic: "Bronchite aiguë résolue",
    symptoms: "Toux sèche persistante, congestion nasale et fébricule",
    notes: "Auscultation pulmonaire nette à ce jour. Aucun râle crépitant. Radio de contrôle prescrite.",
    biometrics: { weight: "79 kg", pressure: "12/7 cmHg", temp: "38.2 °C", pulse: "80 bpm" }
  }
];

const INITIAL_IMAGING: ImagingExam[] = [
  {
    id: "IMG-901",
    date: "10 Mai 2026",
    type: "Radiographie Pulmonaire (Face & Profil)",
    doctor: "Dr. Jean-Luc Ndiaye (Radiologue)",
    findings: "Champs pulmonaires clairs et bien aérés. Absence de foyer d'opacité parenchymateuse suspecte. Index cardiothoracique normal. Culs-de-sac pleuraux libres.",
    conclusion: "Cliché thoracique sans anomalie évolutive décelable.",
    status: "Validé par le Radiologue",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
  }
];

const INITIAL_LABS: LabReport[] = [
  {
    id: "LAB-802",
    date: "11 Mai 2026",
    title: "Bilan Métabolique & Hémogramme Complet",
    lab: "Laboratoire Central Sunu Santé — Dakar Plateau",
    biologist: "Dr. Salimata Ba",
    results: [
      { test: "Glycémie à jeun", value: "0.95", unit: "g/L", range: "0.70 - 1.10", status: "normal" },
      { test: "Hémoglobine", value: "14.5", unit: "g/dL", range: "13.0 - 17.0", status: "normal" },
      { test: "Cholestérol Total", value: "2.15", unit: "g/L", range: "< 2.00", status: "high" },
      { test: "Créatinine Sérique", value: "8.8", unit: "mg/L", range: "7.0 - 12.0", status: "normal" },
      { test: "Triglycérides", value: "1.30", unit: "g/L", range: "< 1.50", status: "normal" }
    ]
  }
];

export default function PatientRecords() {
  const { user, initialize } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'consultations' | 'imaging' | 'lab'>('consultations');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedImagingModal, setSelectedImagingModal] = useState<ImagingExam | null>(null);
  const [selectedLabModal, setSelectedLabModal] = useState<LabReport | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  useEffect(() => {
    initialize();
    setMounted(true);
  }, [initialize]);

  if (!mounted) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm animate-pulse">S+</div>
          <p className="text-xs font-medium">Chargement du dossier médical...</p>
        </div>
      </div>
    );
  }

  const patientName = user?.name || 'Moussa Diop';
  const vitalId = user?.details?.vitalId || 'SN-807F16';
  const bloodGroup = user?.details?.bloodGroup || 'O+';

  const handleShareDossier = () => {
    navigator.clipboard.writeText(`https://sunusante.sn/dossier/${vitalId}`);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 3000);
  };

  // Filtrage simple
  const q = searchQuery.toLowerCase();
  const filteredConsultations = INITIAL_CONSULTATIONS.filter(c => 
    !q || c.doctor.toLowerCase().includes(q) || c.department.toLowerCase().includes(q) || c.diagnostic.toLowerCase().includes(q)
  );

  const filteredImaging = INITIAL_IMAGING.filter(img => 
    !q || img.type.toLowerCase().includes(q) || img.doctor.toLowerCase().includes(q) || img.findings.toLowerCase().includes(q)
  );

  const filteredLabs = INITIAL_LABS.filter(lab => 
    !q || lab.title.toLowerCase().includes(q) || lab.lab.toLowerCase().includes(q) || lab.results.some(r => r.test.toLowerCase().includes(q))
  );

  return (
    <div className="min-h-full bg-slate-50 text-slate-900 pb-16">

      {/* ─── Hero Header & Stats ────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                <ShieldCheck className="w-3 h-3 text-teal-600" />
                Dossier Patient Chiffré HDS
              </span>
              <span className="text-xs text-slate-400 font-mono font-medium">{vitalId}</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Dossier Médical Numérique
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Consultez l'historique exhaustif de vos consultations, vos examens radiologiques et vos bilans de biologie médicale certifiés.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShareDossier}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              {copiedShareLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-500" />}
              <span>{copiedShareLink ? 'Lien copié !' : 'Partager'}</span>
            </button>

            <button
              onClick={() => alert(`Téléchargement de la synthèse du dossier médical pour ${patientName} (${vitalId})...`)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm shadow-teal-700/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exporter en PDF</span>
            </button>
          </div>
        </div>

        {/* Mini stats cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mt-5 sm:mt-6">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">Consultations</span>
            <span className="text-base sm:text-lg font-bold text-teal-700 mt-0.5 block truncate">
              {INITIAL_CONSULTATIONS.length} enregistrées
            </span>
          </div>
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">Imageries & Radios</span>
            <span className="text-base sm:text-lg font-bold text-purple-700 mt-0.5 block truncate">
              {INITIAL_IMAGING.length} examen validé
            </span>
          </div>
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">Analyses Biologiques</span>
            <span className="text-base sm:text-lg font-bold text-blue-700 mt-0.5 block truncate">
              {INITIAL_LABS.length} bilan complet
            </span>
          </div>
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">Données Vitales</span>
            <span className="text-base sm:text-lg font-bold text-emerald-700 mt-0.5 block truncate">
              Groupe {bloodGroup} • Conforme
            </span>
          </div>
        </div>
      </div>

      {/* ─── Barre d'onglets & Recherche ────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Switcher d'onglets ergonomique */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl overflow-x-auto scrollbar-none w-full md:w-auto">
            <button
              onClick={() => setActiveTab('consultations')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'consultations'
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Consultations ({filteredConsultations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('imaging')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'imaging'
                  ? 'bg-white text-purple-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Radiologies ({filteredImaging.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('lab')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'lab'
                  ? 'bg-white text-blue-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Analyses ({filteredLabs.length})</span>
            </button>
          </div>

          {/* Recherche textuelle rapide */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher diagnostic, médecin..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ─── Contenu dynamique des onglets ──────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-6">

        {/* 1. ONGLET CONSULTATIONS */}
        {activeTab === 'consultations' && (
          <div className="space-y-4">
            {filteredConsultations.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
                <p className="text-xs text-slate-500">Aucune consultation ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredConsultations.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* En-tête */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {c.department}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-teal-600" />
                          <span>{c.date}</span>
                        </div>
                      </div>

                      {/* Médecin & Titre */}
                      <div className="flex items-start gap-3 mb-3.5">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {c.doctor.split(' ')[1] ? c.doctor.split(' ')[1][0] : 'M'}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                            {c.doctor}
                          </h3>
                          <span className="text-[10px] text-slate-400 font-mono">{c.id}</span>
                        </div>
                      </div>

                      {/* Diagnostic & Symptômes */}
                      <div className="space-y-2 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-0.5">Diagnostic retenu</span>
                          <p className="text-slate-800 font-bold">{c.diagnostic}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-0.5">Symptômes & Notes</span>
                          <p className="text-slate-600 line-clamp-2">{c.symptoms}</p>
                        </div>
                      </div>
                    </div>

                    {/* Biométrie Strip */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Paramètres vitaux mesurés</span>
                      <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                        <div className="p-2 rounded-xl bg-teal-50/50 border border-teal-100">
                          <span className="text-[9px] text-slate-400 uppercase block font-semibold">Tension</span>
                          <span className="font-bold text-slate-800 text-[11px] sm:text-xs mt-0.5 block">{c.biometrics.pressure}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-teal-50/50 border border-teal-100">
                          <span className="text-[9px] text-slate-400 uppercase block font-semibold">Poids</span>
                          <span className="font-bold text-slate-800 text-[11px] sm:text-xs mt-0.5 block">{c.biometrics.weight}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-teal-50/50 border border-teal-100">
                          <span className="text-[9px] text-slate-400 uppercase block font-semibold">Temp.</span>
                          <span className="font-bold text-slate-800 text-[11px] sm:text-xs mt-0.5 block">{c.biometrics.temp}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-teal-50/50 border border-teal-100">
                          <span className="text-[9px] text-slate-400 uppercase block font-semibold">Pouls</span>
                          <span className="font-bold text-slate-800 text-[11px] sm:text-xs mt-0.5 block">{c.biometrics.pulse}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. ONGLET RADIOLOGIES & IMAGERIE */}
        {activeTab === 'imaging' && (
          <div className="space-y-4">
            {filteredImaging.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
                <p className="text-xs text-slate-500">Aucun examen radiologique ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredImaging.map((img) => (
                  <div
                    key={img.id}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Radiographie Numérique
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-purple-600" />
                          <span>{img.date}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mb-1">
                        {img.type}
                      </h3>
                      <p className="text-xs text-slate-500 mb-3">Interprété par {img.doctor}</p>

                      {/* Aperçu du cliché */}
                      <div 
                        onClick={() => setSelectedImagingModal(img)}
                        className="relative h-44 rounded-2xl bg-slate-900 border border-slate-200 overflow-hidden cursor-pointer group mb-3.5"
                      >
                        <img
                          src={img.imageUrl}
                          alt={img.type}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-102 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3.5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                            <Eye className="w-3.5 h-3.5" />
                            Agrandir le cliché
                          </span>
                        </div>
                      </div>

                      {/* Compte-rendu succinct */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Conclusion du radiologue :</span>
                        <p className="text-slate-800 font-medium italic">« {img.conclusion} »</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {img.status}
                      </span>
                      <button
                        onClick={() => setSelectedImagingModal(img)}
                        className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors"
                      >
                        Détails & Rapport
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. ONGLET ANALYSES BIOLOGIQUES */}
        {activeTab === 'lab' && (
          <div className="space-y-4">
            {filteredLabs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
                <p className="text-xs text-slate-500">Aucun bilan de laboratoire ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLabs.map((lab) => (
                  <div
                    key={lab.id}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3.5 border-b border-slate-100 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Biologie Médicale
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{lab.id}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{lab.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{lab.lab} • Biologiste : {lab.biologist}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-semibold">{lab.date}</span>
                        <button
                          onClick={() => setSelectedLabModal(lab)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
                        >
                          Rapport complet
                        </button>
                      </div>
                    </div>

                    {/* Table des résultats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {lab.results.map((r, idx) => {
                        const isNormal = r.status === 'normal';
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border transition-all ${
                              isNormal
                                ? 'bg-slate-50/70 border-slate-200/70'
                                : 'bg-amber-50/80 border-amber-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-xs font-bold text-slate-800">{r.test}</span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                                isNormal ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-200 text-amber-900'
                              }`}>
                                {isNormal ? 'Normal' : 'À surveiller'}
                              </span>
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                              <span className={`text-base font-black ${isNormal ? 'text-slate-900' : 'text-amber-700'}`}>
                                {r.value}
                              </span>
                              <span className="text-xs text-slate-500 font-medium">{r.unit}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">
                              Normes : {r.range} {r.unit}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ─── MODAL : Détail Imagerie (Visualiseur & Compte-rendu) ──────────── */}
      <AnimatePresence>
        {selectedImagingModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.98 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92dvh] sm:max-h-[88vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedImagingModal.type}</h3>
                  <p className="text-[10px] text-purple-700 font-medium">Examen {selectedImagingModal.id} • {selectedImagingModal.date}</p>
                </div>
                <button
                  onClick={() => setSelectedImagingModal(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs overscroll-contain">
                <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center max-h-72">
                  <img
                    src={selectedImagingModal.imageUrl}
                    alt={selectedImagingModal.type}
                    className="max-h-72 w-auto object-contain"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description détaillée du radiologue</span>
                  <p className="text-slate-700 leading-relaxed text-xs">{selectedImagingModal.findings}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Conclusion clinique</span>
                  <p className="text-xs font-semibold leading-relaxed">{selectedImagingModal.conclusion}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between flex-shrink-0">
                <span className="text-[11px] text-slate-500 font-medium">{selectedImagingModal.doctor}</span>
                <button
                  onClick={() => setSelectedImagingModal(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL : Détail Laboratoire ─────────────────────────────────── */}
      <AnimatePresence>
        {selectedLabModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.98 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200 shadow-2xl max-w-xl w-full max-h-[92dvh] sm:max-h-[88vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-50/60 flex-shrink-0">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedLabModal.title}</h3>
                  <p className="text-[10px] text-blue-700 font-medium">{selectedLabModal.lab}</p>
                </div>
                <button
                  onClick={() => setSelectedLabModal(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 text-xs overscroll-contain">
                <div className="flex items-center justify-between text-slate-500 text-[11px] pb-2 border-b border-slate-100">
                  <span>Prélèvement du {selectedLabModal.date}</span>
                  <span>Biologiste : {selectedLabModal.biologist}</span>
                </div>

                <div className="space-y-2">
                  {selectedLabModal.results.map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div>
                        <p className="font-bold text-slate-800">{r.test}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Valeurs de référence : {r.range} {r.unit}</p>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold text-sm ${r.status === 'normal' ? 'text-slate-900' : 'text-amber-700'}`}>
                          {r.value} {r.unit}
                        </span>
                        <span className={`block text-[9px] font-bold ${r.status === 'normal' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {r.status === 'normal' ? 'Dans les normes' : 'Hors normes'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end flex-shrink-0">
                <button
                  onClick={() => setSelectedLabModal(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
