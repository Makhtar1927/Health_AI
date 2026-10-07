'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  Calendar,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  Pill,
  ShieldCheck,
  Building,
  Check,
  X,
  Copy,
  ExternalLink,
  Search,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

interface Drug {
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
}

interface Prescription {
  id: string;
  date: string;
  doctor: string;
  specialty: string;
  clinic: string;
  status: 'active' | 'completed';
  qrCodeUrl: string;
  drugs: Drug[];
  aiAnalysis: string;
  pharmacyNote?: string;
}

const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: "ORD-9201",
    date: "12 Mai 2026",
    doctor: "Dr. Abdoulaye Diallo",
    specialty: "Médecine Générale",
    clinic: "Cabinet Médical Sunu — Dakar",
    status: "active",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=https%3A%2F%2Fsunusante.sn%2Fordonnance%2FORD-9201&color=6b21a8&bgcolor=ffffff&format=svg&qzone=2",
    drugs: [
      { 
        name: "Lisinopril 10 mg", 
        dosage: "1 comprimé chaque matin au petit-déjeuner", 
        duration: "30 jours",
        instructions: "Surveillance de la pression artérielle recommandée"
      },
      { 
        name: "Amlodipine 5 mg", 
        dosage: "1 comprimé chaque soir au coucher", 
        duration: "30 jours",
        instructions: "Ne pas interrompre sans avis médical"
      }
    ],
    aiAnalysis: "Compatibilité thérapeutique vérifiée : aucune contre-indication ou interaction délétère détectée entre Lisinopril et Amlodipine.",
    pharmacyNote: "Délivrance autorisée en pharmacie agréée IPM / Mutuelle."
  },
  {
    id: "ORD-8542",
    date: "04 Février 2026",
    doctor: "Dr. Aminata Touré",
    specialty: "Pneumologie",
    clinic: "Hôpital Principal de Dakar",
    status: "completed",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=https%3A%2F%2Fsunusante.sn%2Fordonnance%2FORD-8542&color=6b21a8&bgcolor=ffffff&format=svg&qzone=2",
    drugs: [
      { 
        name: "Amoxicilline 1 g", 
        dosage: "1 comprimé matin et soir", 
        duration: "7 jours (terminé)",
        instructions: "Prendre pendant les repas"
      },
      { 
        name: "Sirop Hélicidine", 
        dosage: "1 cuillère à soupe 3 fois par jour", 
        duration: "5 jours (terminé)",
        instructions: "En cas de toux sèche persistante"
      }
    ],
    aiAnalysis: "Traitement antibiotique de première intention pour bronchite aiguë résolue.",
    pharmacyNote: "Délivrance complétée le 04/02/2026."
  }
];

export default function PatientPrescriptions() {
  const { user, initialize } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('active');
  const [selectedQrModal, setSelectedQrModal] = useState<Prescription | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    initialize();
    setMounted(true);
  }, [initialize]);

  if (!mounted) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm animate-pulse">S+</div>
          <p className="text-xs font-medium">Chargement de vos ordonnances...</p>
        </div>
      </div>
    );
  }

  const patientName = user?.name || 'Moussa Diop';
  const vitalId = user?.details?.vitalId || 'SN-807F16';

  const handleCopyCode = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filtered = INITIAL_PRESCRIPTIONS.filter(p => {
    if (activeTab === 'active' && p.status !== 'active') return false;
    if (activeTab === 'completed' && p.status !== 'completed') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDoc = p.doctor.toLowerCase().includes(q);
      const matchDrug = p.drugs.some(d => d.name.toLowerCase().includes(q));
      const matchId = p.id.toLowerCase().includes(q);
      if (!matchDoc && !matchDrug && !matchId) return false;
    }
    return true;
  });

  const activeCount = INITIAL_PRESCRIPTIONS.filter(p => p.status === 'active').length;
  const completedCount = INITIAL_PRESCRIPTIONS.filter(p => p.status === 'completed').length;

  return (
    <div className="min-h-full bg-slate-50 text-slate-900 pb-16">

      {/* ─── Hero Header & Statistiques ─────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                <Pill className="w-3 h-3 text-purple-600" />
                Pharmacie Numérique
              </span>
              <span className="text-xs text-slate-400 font-mono font-medium">{vitalId}</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Mes Ordonnances Médicales
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Présentez le QR Code sécurisé en pharmacie pour retirer vos médicaments. Traitements analysés et vérifiés par l'IA clinique.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-200/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">Délivrance Rapide</span>
                <p className="text-xs font-bold text-slate-800">Scan direct au comptoir</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mini stats cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mt-5 sm:mt-6">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">Ordonnances Actives</span>
            <span className="text-base sm:text-lg font-bold text-purple-700 mt-0.5 block truncate">
              {activeCount} en cours
            </span>
          </div>
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">Médicaments Actifs</span>
            <span className="text-base sm:text-lg font-bold text-teal-700 mt-0.5 block truncate">
              2 molécules
            </span>
          </div>
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">Historique</span>
            <span className="text-base sm:text-lg font-bold text-slate-800 mt-0.5 block truncate">
              {completedCount} délivrance{completedCount > 1 ? 's' : ''}
            </span>
          </div>
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">Sécurité Clinique</span>
            <span className="text-base sm:text-lg font-bold text-emerald-700 mt-0.5 block truncate">
              0 interaction
            </span>
          </div>
        </div>
      </div>

      {/* ─── Barre de filtres et recherche ─────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl overflow-x-auto scrollbar-none w-full md:w-auto">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-white text-purple-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              En cours ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-white text-purple-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Historique ({completedCount})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-purple-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Toutes ({INITIAL_PRESCRIPTIONS.length})
            </button>
          </div>

          {/* Recherche */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher médicament, médecin..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
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

      {/* ─── Liste des Ordonnances ────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-6">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center">
            <p className="text-xs text-slate-500">Aucune ordonnance trouvée pour cette sélection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((ord) => {
              const isActive = ord.status === 'active';

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Bar inside Card */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyCode(ord.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                          title="Copier le numéro"
                        >
                          <span>{ord.id}</span>
                          {copiedId === ord.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <span className="text-xs text-slate-400">•</span>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{ord.date}</span>
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isActive
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-purple-600 animate-pulse' : 'bg-slate-400'}`} />
                        <span>{isActive ? 'Active' : 'Délivrée'}</span>
                      </span>
                    </div>

                    {/* Médecin Prescripteur */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {ord.doctor.split(' ')[1] ? ord.doctor.split(' ')[1][0] : 'D'}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                          {ord.specialty}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                          {ord.doctor}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">{ord.clinic}</p>
                      </div>
                    </div>

                    {/* Liste des Médicaments */}
                    <div className="space-y-2 mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Médicaments prescrits ({ord.drugs.length}) :
                      </span>
                      {ord.drugs.map((drug, dIdx) => (
                        <div key={dIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span className="text-sm font-bold text-purple-900">{drug.name}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-purple-100/70 text-purple-800 rounded-md">
                              {drug.duration}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1">{drug.dosage}</p>
                          {drug.instructions && (
                            <p className="text-[11px] text-slate-400 italic mt-0.5">ℹ️ {drug.instructions}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* IA Clinique Note */}
                    {ord.aiAnalysis && (
                      <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900 space-y-1 mb-4">
                        <div className="flex items-center gap-1.5 font-bold text-[10px] text-teal-800 uppercase">
                          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                          <span>Analyse de Sécurité IA</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-teal-950">{ord.aiAnalysis}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions du bas */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2.5">
                    <button
                      onClick={() => alert(`Téléchargement sécurisé PDF de l'ordonnance ${ord.id}...`)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>PDF</span>
                    </button>

                    <button
                      onClick={() => setSelectedQrModal(ord)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm shadow-purple-600/20 cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Afficher QR Pharmacie</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── MODAL : QR Code Pharmacie Plein Écran ──────────────────────── */}
      <AnimatePresence>
        {selectedQrModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.98 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200 shadow-2xl max-w-md w-full max-h-[92dvh] sm:max-h-[88vh] flex flex-col overflow-hidden text-center"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-purple-50/70 flex-shrink-0">
                <div className="flex items-center gap-2 text-left">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">QR Code de Délivrance</h3>
                    <p className="text-[10px] text-purple-700 font-mono font-bold">{selectedQrModal.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedQrModal(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 overscroll-contain flex flex-col items-center">
                <p className="text-xs text-slate-600 max-w-xs">
                  Présentez ce QR Code à l'officine de pharmacie pour autoriser la dispensation de vos médicaments.
                </p>

                {/* QR Code Container */}
                <div className="w-56 h-56 bg-slate-50 rounded-2xl border-2 border-purple-200 p-3 flex items-center justify-center shadow-inner">
                  <img
                    src={selectedQrModal.qrCodeUrl}
                    alt={`QR Code ${selectedQrModal.id}`}
                    width={220}
                    height={220}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 w-full text-xs text-left space-y-1">
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Patient :</span>
                    <span className="font-bold text-slate-800">{patientName}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Prescripteur :</span>
                    <span className="font-bold text-slate-800">{selectedQrModal.doctor}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Médicaments :</span>
                    <span className="font-bold text-purple-700">{selectedQrModal.drugs.length} prescrits</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Chiffrement AES-256 certifié Ordre des Pharmaciens</span>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-center flex-shrink-0">
                <button
                  onClick={() => setSelectedQrModal(null)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
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
