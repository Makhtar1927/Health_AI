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
  Check,
  Plus,
  Syringe,
  FolderOpen,
  Copy,
  Lock,
  Upload,
  AlertCircle,
  FileCheck,
  Sparkles,
  Phone,
  QrCode,
  ScanLine,
  RefreshCw
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import HealthAILogo from '@/components/HealthAILogo';

interface Consultation {
  id: string;
  date: string;
  doctor: string;
  department: string;
  clinic: string;
  diagnostic: string;
  symptoms: string;
  notes: string;
  prescriptionLinked?: string;
  biometrics: { weight: string; pressure: string; temp: string; pulse: string };
}

interface ImagingExam {
  id: string;
  date: string;
  type: string;
  doctor: string;
  clinic: string;
  findings: string;
  conclusion: string;
  status: string;
  imageUrl?: string;
  orderStatus?: 'pending' | 'in_progress' | 'completed';
  qrCodeUrl?: string;
  clinicalIndication?: string;
  modality?: string;
  priority?: string;
  radiologist?: string;
  validatedAt?: string;
}

interface LabReport {
  id: string;
  date: string;
  title: string;
  lab: string;
  biologist: string;
  results: { 
    test: string; 
    value: number; 
    displayValue: string; 
    unit: string; 
    minRange: number; 
    maxRange: number; 
    status: 'normal' | 'high' | 'low' 
  }[];
}

interface Vaccine {
  name: string;
  disease: string;
  date: string;
  batchNumber: string;
  nextBooster: string;
  status: 'valid' | 'due';
}

interface PatientDoc {
  id: string;
  name: string;
  category: string;
  date: string;
  size: string;
  uploadedBy: string;
}

const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: "CONS-2026-001",
    date: "12 Mai 2026",
    doctor: "Dr. Abdoulaye Diallo",
    department: "Médecine Générale",
    clinic: "Cabinet Médical Sunu — Dakar Plateau",
    diagnostic: "Hypertension artérielle légère sous contrôle thérapeutique",
    symptoms: "Céphalées matinales légères, fatigue en fin de journée",
    notes: "Bonne observance du traitement. Pression artérielle stable à 14/9. Poursuite du Lisinopril 10mg et recommandation d'une activité aérobie régulière.",
    prescriptionLinked: "ORD-9201",
    biometrics: { weight: "78 kg", pressure: "14/9 cmHg", temp: "36.7 °C", pulse: "72 bpm" }
  },
  {
    id: "CONS-2026-002",
    date: "04 Février 2026",
    doctor: "Dr. Aminata Touré",
    department: "Pneumologie",
    clinic: "Hôpital Principal de Dakar",
    diagnostic: "Bronchite aiguë infectieuse résolue",
    symptoms: "Toux sèche récurrente, expectorations claires, fébricule modéré",
    notes: "Auscultation pulmonaire symétrique et claire à ce jour. Radio de contrôle rassurante. Traitement antibiotique terminé.",
    prescriptionLinked: "ORD-8542",
    biometrics: { weight: "79 kg", pressure: "12/7 cmHg", temp: "38.2 °C", pulse: "80 bpm" }
  }
];

const INITIAL_IMAGING: ImagingExam[] = [
  {
    id: "IMG-901",
    date: "10 Mai 2026",
    type: "Radiographie Pulmonaire (Face & Profil)",
    doctor: "Dr. Jean-Luc Ndiaye",
    clinic: "Centre d'Imagerie Médicale de la Madeleine",
    findings: "Parenchyme pulmonaire normal sans foyer d'opacité évolutif. Silhouette cardiaque de morphologie et de taille conformes. Culs-de-sac pleuraux libres.",
    conclusion: "Cliché thoracique strictement normal. Absence d'atteinte infectieuse ou pleurale active.",
    status: "Rapport Validé & Signé",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "IMG-902",
    date: "15 Janvier 2026",
    type: "Échocardiographie Doppler Cardiaque",
    doctor: "Dr. Awa Ndiaye",
    clinic: "Clinique du Cap, Dakar",
    findings: "Ventricule gauche non dilaté, fraction d'éjection préservée (62%). Valves mitrale et aortique souples et continentes. Péricarde sec.",
    conclusion: "Examen cardiologique rassurant dans le cadre du suivi de tension artérielle.",
    status: "Rapport Validé & Signé",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
  }
];

const INITIAL_LABS: LabReport[] = [
  {
    id: "LAB-802",
    date: "11 Mai 2026",
    title: "Bilan Métabolique & Hémogramme Complet",
    lab: "Laboratoire Central Health AI — Dakar Plateau",
    biologist: "Dr. Salimata Ba",
    results: [
      { test: "Glycémie à jeun", value: 0.95, displayValue: "0.95", unit: "g/L", minRange: 0.70, maxRange: 1.10, status: "normal" },
      { test: "Hémoglobine", value: 14.5, displayValue: "14.5", unit: "g/dL", minRange: 13.0, maxRange: 17.0, status: "normal" },
      { test: "Cholestérol Total", value: 2.15, displayValue: "2.15", unit: "g/L", minRange: 1.50, maxRange: 2.00, status: "high" },
      { test: "Triglycérides", value: 1.30, displayValue: "1.30", unit: "g/L", minRange: 0.50, maxRange: 1.50, status: "normal" },
      { test: "Créatinine Sérique", value: 8.8, displayValue: "8.8", unit: "mg/L", minRange: 7.0, maxRange: 12.0, status: "normal" }
    ]
  }
];

const INITIAL_VACCINES: Vaccine[] = [
  { name: "Fièvre Jaune", disease: "Fièvre Jaune (Stamaril)", date: "10 Octobre 2021", batchNumber: "FJ-88392", nextBooster: "Valide à vie (OMS)", status: "valid" },
  { name: "Hépatite B", disease: "Virus Hépatite B (Engerix-B)", date: "15 Juin 2020", batchNumber: "HB-44102", nextBooster: "15 Juin 2030", status: "valid" },
  { name: "Tétanos - Diphtérie", disease: "Tétanos (Dultavax)", date: "22 Mars 2019", batchNumber: "TD-99120", nextBooster: "Mars 2029", status: "valid" },
  { name: "Fièvre Typhoïde", disease: "Salmonella Typhi (Typhim Vi)", date: "12 Avril 2023", batchNumber: "TY-31094", nextBooster: "Avril 2026 (À renouveler)", status: "due" }
];

const INITIAL_DOCS: PatientDoc[] = [
  { id: "DOC-01", name: "Attestation Prise en Charge IPM 2026.pdf", category: "Assurance", date: "02 Janvier 2026", size: "1.2 Mo", uploadedBy: "Patient" },
  { id: "DOC-02", name: "Certificat Médical d'Aptitude Sportive.pdf", category: "Certificat", date: "14 Février 2026", size: "840 Ko", uploadedBy: "Dr. Diallo" }
];

export default function PatientRecords() {
  const { user, initialize } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'consultations' | 'imaging' | 'lab' | 'vaccines' | 'documents'>('consultations');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedImagingModal, setSelectedImagingModal] = useState<ImagingExam | null>(null);
  const [selectedLabModal, setSelectedLabModal] = useState<LabReport | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // États de formulaire d'upload
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Analyse Externe');
  const [uploadSuccessToast, setUploadSuccessToast] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Données dynamiques
  const [patientDocs, setPatientDocs] = useState<PatientDoc[]>(INITIAL_DOCS);
  const [imagingList, setImagingList] = useState<ImagingExam[]>(INITIAL_IMAGING);
  const [radioFilter, setRadioFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [selectedQrExam, setSelectedQrExam] = useState<ImagingExam | null>(null);
  const [isRefreshingRadio, setIsRefreshingRadio] = useState(false);

  const fetchDynamicImaging = async () => {
    try {
      const [ordersRes, resultsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://health-ai-backend-jhie.onrender.com'}/api/radiology/orders`).then(r => r.ok ? r.json() : { data: [] }).catch(() => ({ data: [] })),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://health-ai-backend-jhie.onrender.com'}/api/radiology/results`).then(r => r.ok ? r.json() : { data: [] }).catch(() => ({ data: [] }))
      ]);

      const ordersData: any[] = ordersRes.data || [];
      const resultsData: any[] = resultsRes.data || [];

      if (ordersData.length === 0 && resultsData.length === 0) return;

      const dynamicItems: ImagingExam[] = ordersData.map((order) => {
        const matchResult = resultsData.find((r: any) => r.orderId === order.id);
        const isCompleted = order.status === 'completed' || !!matchResult;
        const isInProgress = order.status === 'in_progress';

        return {
          id: order.id,
          date: matchResult?.validatedAt
            ? new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(matchResult.validatedAt))
            : order.date,
          type: order.type,
          doctor: order.doctor,
          clinic: order.hospital || "Centre d'Imagerie Médicale Health AI",
          findings: matchResult?.findings || (isInProgress ? "Examen en cours d'acquisition par l'équipe de radiologie..." : "Prescription médicale transmise. Présentez-vous au centre de radiologie avec le QR code ci-dessous."),
          conclusion: matchResult?.conclusion || (isInProgress ? "Acquisition en cours. En attente du compte-rendu radiologique." : "En attente de réalisation de l'examen."),
          status: isCompleted ? "Rapport Validé & Transmis" : isInProgress ? "Examen En Cours" : "En Attente d'Examen",
          imageUrl: matchResult?.imageUrl || "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
          orderStatus: isCompleted ? 'completed' : isInProgress ? 'in_progress' : 'pending',
          qrCodeUrl: order.qrCodeUrl,
          clinicalIndication: order.clinicalIndication,
          modality: order.modality,
          priority: order.priority,
          radiologist: matchResult?.radiologist,
          validatedAt: matchResult?.validatedAt,
        };
      });

      const staticMerged = INITIAL_IMAGING.filter(init => !dynamicItems.some(d => d.id === init.id));
      setImagingList([...dynamicItems, ...staticMerged]);
    } catch (e) {
      console.warn('Erreur synchro radiologie:', e);
    }
  };

  const handleManualRefreshRadio = async () => {
    setIsRefreshingRadio(true);
    await fetchDynamicImaging();
    setTimeout(() => setIsRefreshingRadio(false), 600);
  };

  useEffect(() => {
    initialize();
    setMounted(true);
    fetchDynamicImaging();

    const interval = setInterval(fetchDynamicImaging, 3500);
    return () => clearInterval(interval);
  }, [initialize]);

  if (!mounted) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <HealthAILogo size="lg" pulse />
          <p className="text-xs font-medium">Chargement du dossier médical sécurisé...</p>
        </div>
      </div>
    );
  }

  const patientName = user?.name || 'Moussa Diop';
  const vitalId = user?.details?.vitalId || 'SN-807F16';
  const bloodGroup = user?.details?.bloodGroup || 'O+';
  const temporaryPin = "842 195";

  const handleCopyPin = () => {
    navigator.clipboard.writeText("842195");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const newDoc: PatientDoc = {
      id: `DOC-0${patientDocs.length + 1}`,
      name: `${uploadTitle}.pdf`,
      category: uploadCategory,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
      size: "1.4 Mo",
      uploadedBy: "Patient"
    };

    setPatientDocs(prev => [newDoc, ...prev]);
    setIsUploadModalOpen(false);
    setUploadTitle('');
    setUploadSuccessToast(true);
    setTimeout(() => setUploadSuccessToast(false), 4000);
  };

  // Filtrage
  const q = searchQuery.toLowerCase();
  const filteredConsultations = INITIAL_CONSULTATIONS.filter(c => 
    !q || c.doctor.toLowerCase().includes(q) || c.department.toLowerCase().includes(q) || c.diagnostic.toLowerCase().includes(q)
  );

  const filteredImaging = imagingList.filter(img => {
    const matchesQuery = !q || img.type.toLowerCase().includes(q) || img.doctor.toLowerCase().includes(q) || img.findings.toLowerCase().includes(q) || img.id.toLowerCase().includes(q);
    if (!matchesQuery) return false;
    if (radioFilter === 'PENDING') return img.orderStatus === 'pending' || img.orderStatus === 'in_progress';
    if (radioFilter === 'COMPLETED') return img.orderStatus === 'completed' || (!img.orderStatus && img.status.includes('Validé'));
    return true;
  });

  const totalRadioPending = imagingList.filter(i => i.orderStatus === 'pending' || i.orderStatus === 'in_progress').length;
  const totalRadioCompleted = imagingList.filter(i => i.orderStatus === 'completed' || (!i.orderStatus && i.status.includes('Validé'))).length;

  const filteredLabs = INITIAL_LABS.filter(lab => 
    !q || lab.title.toLowerCase().includes(q) || lab.lab.toLowerCase().includes(q) || lab.results.some(r => r.test.toLowerCase().includes(q))
  );

  const filteredVaccines = INITIAL_VACCINES.filter(v => 
    !q || v.name.toLowerCase().includes(q) || v.disease.toLowerCase().includes(q)
  );

  const filteredDocs = patientDocs.filter(d => 
    !q || d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
  );

  return (
    <div className="min-h-full bg-slate-50 text-slate-900 pb-16">

      {/* ─── Toast de Confirmation Upload ───────────────────────────────── */}
      <AnimatePresence>
        {uploadSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 z-50 bg-teal-700 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-teal-600 max-w-md ml-auto"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Document ajouté à votre dossier !</p>
              <p className="text-[11px] text-teal-100 truncate">Chiffré et accessible par vos praticiens.</p>
            </div>
            <button 
              onClick={() => setUploadSuccessToast(false)} 
              className="p-1 rounded-lg text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Hero Header & Synthèse Médicale ────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                <ShieldCheck className="w-3 h-3 text-teal-600" />
                Dossier Médical HDS & DMP
              </span>
              <span className="text-xs text-slate-400 font-mono font-medium">{vitalId}</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Dossier Médical Partagé
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Historique exhaustif de votre santé : consultations, radiologies, bilans sanguins et carnet de vaccinations certifiés.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Ajouter un document</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100/70 text-teal-800 text-xs font-bold transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-teal-600" />
              <span>Partager avec un médecin</span>
            </button>

            <button
              onClick={() => alert(`Génération du résumé PDF complet du dossier médical pour ${patientName} (${vitalId})...`)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold shadow-sm shadow-teal-700/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Bandeau de Paramètres Vitaux Mesurés Récemment */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-5 sm:mt-6">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">Tension Artérielle</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base sm:text-lg font-bold text-slate-800">14/9</span>
              <span className="text-[11px] text-slate-400">cmHg</span>
            </div>
            <span className="text-[10px] text-teal-700 font-semibold block mt-0.5">Sous surveillance</span>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">Poids & IMC</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base sm:text-lg font-bold text-slate-800">78 kg</span>
              <span className="text-[11px] text-slate-400">IMC 24.1</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Poids normal</span>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">Glycémie à jeun</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base sm:text-lg font-bold text-slate-800">0.95</span>
              <span className="text-[11px] text-slate-400">g/L</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Normale (0.70 - 1.10)</span>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">Groupe Sanguin</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base sm:text-lg font-bold text-rose-600">O+</span>
              <span className="text-[11px] text-slate-400">Rhésus Positif</span>
            </div>
            <span className="text-[10px] text-rose-700 font-semibold block mt-0.5">Carte validée</span>
          </div>
        </div>
      </div>

      {/* ─── Barre d'Onglets & Recherche ────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Switcher d'onglets ergonomique */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl overflow-x-auto scrollbar-none w-full md:w-auto">
            <button
              onClick={() => setActiveTab('consultations')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'lab'
                  ? 'bg-white text-blue-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Analyses ({filteredLabs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('vaccines')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'vaccines'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Syringe className="w-3.5 h-3.5" />
              <span>Vaccins ({filteredVaccines.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'documents'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Mes Fichiers ({filteredDocs.length})</span>
            </button>
          </div>

          {/* Recherche */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher examen, médecin..."
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

      {/* ─── Contenu des Onglets ────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-6">

        {/* 1. ONGLET CONSULTATIONS */}
        {activeTab === 'consultations' && (
          <div className="space-y-4">
            {filteredConsultations.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
                <p className="text-xs text-slate-500">Aucune consultation trouvée.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredConsultations.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top badge & Date */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {c.department}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-teal-600" />
                          <span>{c.date}</span>
                        </div>
                      </div>

                      {/* Doctor info */}
                      <div className="flex items-start gap-3 mb-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {c.doctor.split(' ')[1] ? c.doctor.split(' ')[1][0] : 'M'}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-slate-900 truncate">
                            {c.doctor}
                          </h3>
                          <p className="text-xs text-slate-500 truncate">{c.clinic}</p>
                        </div>
                      </div>

                      {/* Diagnostic & Notes */}
                      <div className="space-y-2 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-0.5">
                            Diagnostic posé
                          </span>
                          <p className="text-slate-800 font-bold">{c.diagnostic}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-0.5">
                            Observations & Recommandations
                          </span>
                          <p className="text-slate-600 text-xs leading-relaxed">{c.notes}</p>
                        </div>
                      </div>
                    </div>

                    {/* Paramètres Vitaux Mesurés */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Constantes mesurées lors de la visite
                      </span>
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
            
            {/* Sub-header & Filtres de statut radio */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setRadioFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    radioFilter === 'ALL'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tous ({imagingList.length})
                </button>
                <button
                  onClick={() => setRadioFilter('PENDING')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    radioFilter === 'PENDING'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>En attente au centre ({totalRadioPending})</span>
                </button>
                <button
                  onClick={() => setRadioFilter('COMPLETED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    radioFilter === 'COMPLETED'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Résultats validés ({totalRadioCompleted})</span>
                </button>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[11px] text-slate-400 hidden md:inline">Sync en direct (PACS & Personnel)</span>
                <button
                  type="button"
                  onClick={handleManualRefreshRadio}
                  disabled={isRefreshingRadio}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingRadio ? 'animate-spin text-purple-600' : ''}`} />
                  <span>Actualiser</span>
                </button>
              </div>
            </div>

            {filteredImaging.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
                <p className="text-xs text-slate-500">Aucun examen radiologique trouvé pour ce filtre.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredImaging.map((img) => {
                  const isPending = img.orderStatus === 'pending' || img.orderStatus === 'in_progress';

                  return (
                    <div
                      key={img.id}
                      className={`rounded-2xl sm:rounded-3xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                        isPending
                          ? 'bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 border-amber-300'
                          : 'bg-white border-slate-200/90'
                      }`}
                    >
                      <div>
                        {/* Top Badge & Date */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          {isPending ? (
                            <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 border border-amber-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>Prescrit • En attente de radio</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Résultat Validé & Transmis</span>
                            </span>
                          )}

                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{img.date}</span>
                          </div>
                        </div>

                        {/* Title & Prescriber */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-base font-bold text-slate-900">
                            {img.type}
                          </h3>
                          <span className="font-mono text-[10px] font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 shrink-0">
                            {img.id}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mb-3">
                          {img.clinic} • Prescrit par <strong>{img.doctor}</strong>
                        </p>

                        {/* Body distinction: PENDING vs COMPLETED */}
                        {isPending ? (
                          <div className="space-y-3 mb-3.5">
                            {/* Clinical indication */}
                            {img.clinicalIndication && (
                              <div className="p-3 rounded-xl bg-white/90 border border-amber-200 text-xs space-y-1">
                                <span className="text-[10px] font-bold text-amber-900 uppercase block">Motif prescrit par le médecin :</span>
                                <p className="text-slate-800 italic leading-relaxed">« {img.clinicalIndication} »</p>
                              </div>
                            )}

                            {/* Direct QR Code Presentation Card */}
                            <div className="p-3.5 rounded-2xl bg-white border border-amber-300 shadow-xs flex flex-col sm:flex-row items-center gap-3">
                              {img.qrCodeUrl && (
                                <div 
                                  onClick={() => setSelectedQrExam(img)}
                                  className="w-28 h-28 bg-white p-1 rounded-xl border border-purple-200 shrink-0 cursor-pointer hover:scale-105 transition-transform shadow-xs"
                                  title="Cliquez pour agrandir le QR code"
                                >
                                  <img
                                    src={img.qrCodeUrl}
                                    alt={`QR Code ${img.id}`}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              )}
                              <div className="text-left space-y-1 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <QrCode className="w-4 h-4 text-purple-700 shrink-0" />
                                  <p className="text-xs font-black text-slate-900">Bordereau Radiologique Numérique</p>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-tight">
                                  Présentez ce QR Code à l'accueil du service de radiologie. Le radiologue le scannera pour accéder à votre prescription.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setSelectedQrExam(img)}
                                  className="inline-flex items-center gap-1 text-[11px] font-extrabold text-purple-700 hover:text-purple-900 underline pt-0.5 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Agrandir le QR Code plein écran</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3 mb-3.5">
                            {/* Cliché Thumbnail Card */}
                            {img.imageUrl && (
                              <div 
                                onClick={() => setSelectedImagingModal(img)}
                                className="relative h-44 rounded-2xl bg-slate-950 border border-slate-200 overflow-hidden cursor-pointer group"
                              >
                                <img
                                  src={img.imageUrl}
                                  alt={img.type}
                                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-102 transition-all duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3.5">
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                                    <Eye className="w-3.5 h-3.5" />
                                    Ouvrir le cliché haute définition
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Conclusion */}
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Conclusion radiologique transmise :</span>
                              <p className="text-slate-800 font-medium italic">« {img.conclusion} »</p>
                              {img.radiologist && (
                                <p className="text-[10px] text-purple-800 font-bold pt-1">
                                  Validé par : {img.radiologist}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                        {isPending ? (
                          <>
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                              En attente de réalisation
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedQrExam(img)}
                              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>Présenter QR Code</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              {img.status}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedImagingModal(img)}
                              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                            >
                              Rapport complet
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. ONGLET ANALYSES BIOLOGIQUES */}
        {activeTab === 'lab' && (
          <div className="space-y-4">
            {filteredLabs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
                <p className="text-xs text-slate-500">Aucun bilan biologique trouvé.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLabs.map((lab) => (
                  <div
                    key={lab.id}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Biologie Médicale Certifiée
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{lab.id}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{lab.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{lab.lab} • Biologiste référent : {lab.biologist}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-semibold">{lab.date}</span>
                        <button
                          onClick={() => setSelectedLabModal(lab)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
                        >
                          Détails complets
                        </button>
                      </div>
                    </div>

                    {/* Biomarqueurs avec Jauges Graphiques d'Intervalle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {lab.results.map((r, idx) => {
                        const isNormal = r.status === 'normal';
                        // Calcul d'un pourcentage pour positionner le curseur
                        const rangeSpan = (r.maxRange - r.minRange) || 1;
                        const posPct = Math.min(Math.max(((r.value - r.minRange) / rangeSpan) * 50 + 25, 5), 95);

                        return (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-2xl border transition-all ${
                              isNormal
                                ? 'bg-slate-50/80 border-slate-200/80'
                                : 'bg-amber-50/90 border-amber-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1 mb-2">
                              <span className="text-xs font-bold text-slate-800">{r.test}</span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                                isNormal ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-200 text-amber-900'
                              }`}>
                                {isNormal ? 'Dans les normes' : 'À surveiller'}
                              </span>
                            </div>

                            <div className="flex items-baseline gap-1.5 mb-2">
                              <span className={`text-xl font-black ${isNormal ? 'text-slate-900' : 'text-amber-700'}`}>
                                {r.displayValue}
                              </span>
                              <span className="text-xs text-slate-500 font-semibold">{r.unit}</span>
                            </div>

                            {/* Jauge graphique de valeur */}
                            <div className="space-y-1">
                              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden relative">
                                <div 
                                  className={`h-full ${isNormal ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full`}
                                  style={{ width: `${posPct}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                                <span>Réf: {r.minRange}</span>
                                <span>{r.maxRange} {r.unit}</span>
                              </div>
                            </div>
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

        {/* 4. ONGLET CARNET DE VACCINATION */}
        {activeTab === 'vaccines' && (
          <div className="space-y-4">
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <Syringe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">Carnet Vaccinal International & National</h3>
                <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                  Vos injections et rappels sont enregistrés et certifiés par le Ministère de la Santé et conformes aux exigences de voyage de l'OMS.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVaccines.map((v, idx) => {
                const isValid = v.status === 'valid';
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-sm font-bold text-slate-900">{v.name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isValid
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                        }`}>
                          {isValid ? 'À jour' : 'Rappel requis'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{v.disease}</p>

                      <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Date d'injection :</span>
                          <span className="font-bold text-slate-700">{v.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">N° Lot :</span>
                          <span className="font-mono text-slate-600">{v.batchNumber}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-200/60">
                          <span className="text-slate-500 font-semibold">Prochain rappel :</span>
                          <span className="font-bold text-teal-700">{v.nextBooster}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. ONGLET MES DOCUMENTS IMPORTÉS */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Pièces Médicales & Téléversements</h3>
                <p className="text-xs text-slate-500">Ajoutez des ordonnances scannées, attestations ou comptes-rendus externes.</p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau fichier</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between gap-3 hover:border-teal-300 transition-all"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-blue-700 uppercase">{doc.category}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{doc.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{doc.date} • {doc.size}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Téléchargement de ${doc.name}...`)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors flex-shrink-0"
                    title="Télécharger le fichier"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ─── MODAL : Visualiseur de Cliché Radiologique (Rapport Complet) ─── */}
      <AnimatePresence>
        {selectedImagingModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.98 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200 shadow-2xl max-w-2xl w-full h-[88dvh] sm:h-auto sm:max-h-[88vh] flex flex-col overflow-hidden"
            >
              {/* Mobile grab handle */}
              <div className="pt-2 sm:hidden flex justify-center flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-slate-300" />
              </div>

              <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-purple-50/70 flex-shrink-0">
                <div className="min-w-0 flex-1 pr-3">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{selectedImagingModal.type}</h3>
                  <p className="text-[10px] text-purple-700 font-medium truncate">Examen {selectedImagingModal.id} • {selectedImagingModal.date}</p>
                </div>
                <button
                  onClick={() => setSelectedImagingModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer flex-shrink-0"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs overscroll-contain">
                {/* Visualiseur - seulement si une image est disponible */}
                {selectedImagingModal.imageUrl && (
                  <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center max-h-64 shadow-inner">
                    <img
                      src={selectedImagingModal.imageUrl}
                      alt={selectedImagingModal.type}
                      className="max-h-64 w-auto object-contain"
                    />
                  </div>
                )}

                {/* Infos basiques */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Clinique</span>
                    <p className="font-semibold text-slate-800 mt-0.5 text-[11px] truncate">{selectedImagingModal.clinic}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Prescripteur</span>
                    <p className="font-semibold text-slate-800 mt-0.5 text-[11px] truncate">{selectedImagingModal.doctor}</p>
                  </div>
                </div>

                {selectedImagingModal.findings && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description détaillée des clichés</span>
                    <p className="text-slate-700 leading-relaxed text-xs">{selectedImagingModal.findings}</p>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Conclusion du Radiologue</span>
                  <p className="text-xs font-semibold leading-relaxed">{selectedImagingModal.conclusion}</p>
                  {selectedImagingModal.radiologist && (
                    <p className="text-[10px] text-purple-800 font-bold pt-1">Validé par : {selectedImagingModal.radiologist}</p>
                  )}
                </div>
              </div>

              {/* Footer surélevé et visible */}
              <div className="p-4 sm:p-5 pb-[max(2rem,env(safe-area-inset-bottom)+1rem)] border-t border-slate-100 bg-slate-50 flex items-center justify-between flex-shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
                <span className="text-[11px] text-slate-500 font-medium truncate pr-3">{selectedImagingModal.doctor}</span>
                <button
                  onClick={() => setSelectedImagingModal(null)}
                  className="px-6 py-2.5 min-h-[46px] bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex-shrink-0 shadow-sm"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL : Détail Rapport de Laboratoire ──────────────────────── */}
      <AnimatePresence>
        {selectedLabModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.98 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200 shadow-2xl max-w-xl w-full h-[88dvh] sm:h-auto sm:max-h-[88vh] flex flex-col overflow-hidden"
            >
              {/* Mobile grab handle */}
              <div className="pt-2 sm:hidden flex justify-center flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-slate-300" />
              </div>

              <div className="px-5 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-blue-50/70 flex-shrink-0">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedLabModal.title}</h3>
                  <p className="text-[10px] text-blue-700 font-medium">{selectedLabModal.lab}</p>
                </div>
                <button
                  onClick={() => setSelectedLabModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3 text-xs overscroll-contain">
                <div className="flex items-center justify-between text-slate-500 text-[11px] pb-2 border-b border-slate-100">
                  <span>Prélèvement : {selectedLabModal.date}</span>
                  <span>Biologiste : {selectedLabModal.biologist}</span>
                </div>

                <div className="space-y-2.5">
                  {selectedLabModal.results.map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 text-xs truncate">{r.test}</p>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 truncate">Référence : {r.minRange}–{r.maxRange} {r.unit}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`font-black text-sm ${r.status === 'normal' ? 'text-slate-900' : 'text-amber-700'}`}>
                          {r.displayValue} <span className="text-[10px] font-semibold">{r.unit}</span>
                        </span>
                        <span className={`block text-[9px] font-bold ${r.status === 'normal' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {r.status === 'normal' ? 'Normal' : 'Hors normes'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer surélevé */}
              <div className="p-4 sm:p-5 pb-[max(2rem,env(safe-area-inset-bottom)+1rem)] border-t border-slate-100 bg-slate-50 flex items-center justify-end flex-shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
                <button
                  onClick={() => setSelectedLabModal(null)}
                  className="px-6 py-2.5 min-h-[46px] bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL : Partage Sécurisé avec un Médecin ───────────────────── */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.98 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200 shadow-2xl max-w-md w-full max-h-[88dvh] sm:max-h-[88vh] flex flex-col overflow-hidden text-center"
            >
              {/* Mobile grab handle */}
              <div className="pt-2 sm:hidden flex justify-center flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-slate-300" />
              </div>

              <div className="px-5 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-teal-50/70 flex-shrink-0">
                <div className="flex items-center gap-2 text-left">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Accès Praticien Sécurisé</h3>
                    <p className="text-[10px] text-teal-700 font-medium">Validité temporaire de 24 heures</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4 overscroll-contain flex flex-col items-center">
                <p className="text-xs text-slate-600 max-w-xs">
                  Communiquez ce code PIN à 6 chiffres à votre médecin ou spécialiste pour lui donner accès à votre dossier de consultation.
                </p>

                {/* PIN Code Display */}
                <div className="p-4 rounded-2xl bg-teal-50 border-2 border-teal-200 w-full flex items-center justify-center gap-3">
                  <span className="font-mono text-2xl font-black text-teal-900 tracking-widest">
                    {temporaryPin}
                  </span>
                  <button
                    onClick={handleCopyPin}
                    className="p-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-colors cursor-pointer"
                    title="Copier le code PIN"
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 w-full text-xs text-left space-y-1">
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Dossier :</span>
                    <span className="font-bold text-slate-800">{vitalId}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Expiration :</span>
                    <span className="font-bold text-teal-700">Demain à 20:00</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Accès chiffré révocable à tout moment.</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 pb-[max(2rem,env(safe-area-inset-bottom)+1rem)] border-t border-slate-100 bg-slate-50 flex items-center justify-center flex-shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="w-full py-2.5 min-h-[46px] bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL : Téléverser un Document Médical ─────────────────────── */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.98 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200 shadow-2xl max-w-lg w-full h-[88dvh] sm:h-auto sm:max-h-[88vh] flex flex-col overflow-hidden"
            >
              {/* Mobile grab handle */}
              <div className="pt-2 sm:hidden flex justify-center flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-slate-300" />
              </div>

              <div className="px-5 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-teal-50/70 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Ajouter un Document</h3>
                    <p className="text-[10px] text-teal-700 font-medium">Intégration directe à votre dossier</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Titre du document</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Échographie pelvienne, Analyse sang externe..."
                      value={uploadTitle}
                      onChange={e => setUploadTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-teal-500 bg-slate-50 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Catégorie médicale</label>
                    <select
                      value={uploadCategory}
                      onChange={e => setUploadCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-teal-500 bg-slate-50 cursor-pointer"
                    >
                      <option value="Analyse Externe">Analyse Biologique Externe</option>
                      <option value="Compte-rendu Clinique">Compte-rendu de Consultation</option>
                      <option value="Imagerie / Radio">Cliché / Radiographie</option>
                      <option value="Assurance & IPM">Document Assurance / IPM</option>
                      <option value="Autre">Autre Document Médical</option>
                    </select>
                  </div>

                  {/* Faux Drag & Drop Zone */}
                  <div className="border-2 border-dashed border-teal-300 rounded-2xl p-6 text-center bg-teal-50/40 hover:bg-teal-50/70 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800">Glissez votre fichier ici ou cliquez pour choisir</p>
                    <p className="text-[10px] text-slate-400 mt-1">Formats acceptés : PDF, JPG, PNG, DICOM (Max 20 Mo)</p>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span>Document stocké sur infrastructure certifiée HDS.</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pb-[max(2rem,env(safe-area-inset-bottom)+1rem)] border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 flex-shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2.5 min-h-[46px] rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 min-h-[46px] rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs sm:text-sm font-bold transition-all shadow-sm shadow-teal-700/20 cursor-pointer"
                  >
                    Ajouter le document
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL : QR Code Examen Radiologique (Plein Écran) ──────────── */}
      <AnimatePresence>
        {selectedQrExam && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.98 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200 shadow-2xl max-w-sm w-full max-h-[88dvh] sm:max-h-[88vh] flex flex-col overflow-hidden text-center"
            >
              {/* Mobile grab handle */}
              <div className="pt-2 sm:hidden flex justify-center flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-slate-300" />
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 px-5 py-3.5 flex-shrink-0">
                <div className="flex items-center gap-2 text-left">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Bordereau Radiologique</h3>
                    <p className="text-[10px] text-purple-700 font-semibold">{selectedQrExam.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedQrExam(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* QR Code Container défilable si besoin */}
              <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4 overscroll-contain">
                <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 flex flex-col items-center gap-3">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-purple-100">
                    <img
                      src={selectedQrExam.qrCodeUrl}
                      alt={`QR Code ${selectedQrExam.id}`}
                      className="w-44 h-44 object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md">
                      {selectedQrExam.id}
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{selectedQrExam.type}</p>
                    <p className="text-[11px] text-slate-500">Prescrit par {selectedQrExam.doctor}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-left space-y-1">
                  <p className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Présentez ce QR Code au centre</span>
                  </p>
                  <p className="text-[10px] text-amber-800 leading-relaxed">
                    Le radiologue ou le manipulateur scannera cet écran pour charger automatiquement le protocole d'examen et vos antécédents médicaux.
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 pb-[max(2rem,env(safe-area-inset-bottom)+1rem)] border-t border-slate-100 bg-slate-50 flex items-center justify-center flex-shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
                <button
                  type="button"
                  onClick={() => setSelectedQrExam(null)}
                  className="w-full py-2.5 min-h-[46px] bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-sm"
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
