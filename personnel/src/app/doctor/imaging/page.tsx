'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Image as ImageIcon,
  Sliders,
  Sun,
  Eye,
  RotateCw,
  Search,
  Maximize2,
  Activity,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Zap,
  BrainCircuit,
  Info,
  ZoomIn,
  ZoomOut,
  FlipHorizontal,
  Layers,
  Clock,
  User,
  Calendar,
  Printer,
  Download,
  X,
  LayoutPanelLeft,
  ScanLine,
  Contrast,
  Focus,
  BookOpen,
  ChevronRight,
  RefreshCw,
  Ruler,
  Move,
  ChevronLeft,
  Crosshair,
  FileText,
  Check,
  Copy,
  Minimize2,
  QrCode
} from 'lucide-react';
import Link from 'next/link';
import DoctorTopBar from '@/components/doctor/DoctorTopBar';
import DoctorNavBar from '@/components/doctor/DoctorNavBar';
import { getAuthHeader } from '@/lib/authStore';

interface ScanRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  examType: string;
  examDate: string;
  bodyPart: string;
  modality: 'RX' | 'TDM' | 'IRM' | 'ECO' | 'ECG';
  status: 'new' | 'in_progress' | 'reviewed';
  urgency: 'routine' | 'urgent' | 'stat';
  imageUrl: string;
  description: string;
  requestedBy: string;
}

const SCANS: ScanRecord[] = [
  {
    id: 'SCAN-98831',
    patientId: 'P-103',
    patientName: 'Cheikh Tidiane Diop',
    patientAge: 67,
    examType: 'Radiographie Pulmonaire Face & Profil',
    examDate: 'Auj. 12:55',
    bodyPart: 'Thorax',
    modality: 'RX',
    status: 'new',
    urgency: 'stat',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1200&auto=format&fit=crop',
    description: 'Suspicion de pneumonie communautaire. Détresse respiratoire sévère.',
    requestedBy: 'Dr. Oumy Aidara'
  },
  {
    id: 'SCAN-44021',
    patientId: 'P-101',
    patientName: 'Amadou Sall',
    patientAge: 42,
    examType: 'Radiographie Genou Profil',
    examDate: 'Auj. 12:18',
    bodyPart: 'Genou Gauche',
    modality: 'RX',
    status: 'in_progress',
    urgency: 'urgent',
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1200&auto=format&fit=crop',
    description: 'Chute traumatique. Suspicion de fracture plateau tibial.',
    requestedBy: 'Dr. Oumy Aidara'
  },
  {
    id: 'SCAN-77412',
    patientId: 'P-104',
    patientName: 'Aissatou Sow',
    patientAge: 5,
    examType: 'Scanner Thoracique Haute Résolution',
    examDate: 'Auj. 11:30',
    bodyPart: 'Thorax',
    modality: 'TDM',
    status: 'reviewed',
    urgency: 'urgent',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1200&auto=format&fit=crop',
    description: 'Fièvre persistante et toux quinteuse. Exclure pneumopathie infiltrante.',
    requestedBy: 'Dr. Oumy Aidara'
  },
  {
    id: 'SCAN-31009',
    patientId: 'P-102',
    patientName: 'Mariama Diallo',
    patientAge: 29,
    examType: 'Échographie Abdominale & Pelvienne',
    examDate: 'Hier 16:45',
    bodyPart: 'Abdomen / Pelvis',
    modality: 'ECO',
    status: 'reviewed',
    urgency: 'routine',
    imageUrl: 'https://images.unsplash.com/photo-1576669801775-ff43c5ab079d?q=80&w=1200&auto=format&fit=crop',
    description: 'Bilan de contrôle gynécologique annuel.',
    requestedBy: 'Dr. Oumy Aidara'
  }
];

const AI_RESULTS: Record<string, any> = {
  'SCAN-98831': {
    hasPathology: true,
    pathologyType: 'Pneumonie Lobaire Droite',
    confidenceScore: 0.94,
    severity: 'high',
    findings: "Opacité alvéolaire homogène et systématisée au niveau du lobe inférieur droit (segment apical). Bronchogramme aérien net présent. Absence d'épanchement pleural. Silhouette cardiaque de taille normale (ICT = 0.48).",
    measurements: "Foyer d'opacité : ~4.2 × 3.1 cm",
    recommendations: "Antibiothérapie probabiliste à spectre étendu. Radio de contrôle à J15 recommandée. Oxygénothérapie si SpO2 < 92%.",
    regions: [{ top: '35%', left: '55%', w: '120px', h: '110px', label: 'Foyer Alvéolaire' }]
  },
  'SCAN-44021': {
    hasPathology: true,
    pathologyType: 'Fracture Plateau Tibial Latéral',
    confidenceScore: 0.88,
    severity: 'medium',
    findings: "Trait de fracture sous-cortical non déplacé traversant le plateau tibial latéral externe. Alignement articulaire global préservé. Absence de luxation péronéo-tibiale associée. Interligne articulaire respecté.",
    measurements: "Trait de fracture : ~1.8 cm de long",
    recommendations: "Immobilisation rigide par attelle plâtrée. Consultation orthopédique en urgence pour évaluation de mise en charge. Contrôle radio à J8.",
    regions: [{ top: '45%', left: '40%', w: '80px', h: '70px', label: 'Trait de fracture' }]
  },
  'SCAN-77412': {
    hasPathology: false,
    pathologyType: 'Aucune pathologie décelée',
    confidenceScore: 0.91,
    severity: 'none',
    findings: "Scanner thoracique sans anomalie parenchymateuse significative. Pas d'infiltrat, ni de condensation alvéolaire. Plèvres libres. Médiastin centré. Cœur de taille et de morphologie normales.",
    measurements: "Densité parenchymateuse : -800 à -600 UH (normale)",
    recommendations: "Aucun traitement radiologique spécifique. Poursuivre le bilan clinique et biologique (NFS, CRP, BK). Surveillance clinique à 48h.",
    regions: []
  },
  'SCAN-31009': {
    hasPathology: false,
    pathologyType: 'Examen sans particularité',
    confidenceScore: 0.97,
    severity: 'none',
    findings: "Utérus normo-conformé avec endomètre fin (4mm). Ovaires de taille normale bilatéralement. Absence de masse pelvienne ou d'épanchement péritonéal. Foie, vésicule, reins, rate dans les limites de la normale.",
    measurements: "Utérus : 7.2 × 4.1 × 3.8 cm",
    recommendations: "Bilan de contrôle sans anomalie. Prochaine consultation de suivi dans 12 mois.",
    regions: []
  }
};

function ImagingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultId = searchParams.get('scanId') || 'SCAN-98831';
  const [selectedId, setSelectedId] = useState(defaultId);
  const [compareMode, setCompareMode] = useState(false);
  const [compareId, setCompareId] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  // Close fullscreen on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Filters
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [invert, setInvert] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);

  // PACS Workstation interactive states
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState<'pointer' | 'pan' | 'measure'>('pointer');
  const [measureLine, setMeasureLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [showAiDrawer, setShowAiDrawer] = useState(true);
  const [showCrosshair, setShowCrosshair] = useState(false);
  const [showSeriesTray, setShowSeriesTray] = useState(false);
  const [activePreset, setActivePreset] = useState<'standard' | 'lung' | 'bone' | 'soft' | 'invert'>('standard');
  const [copiedReport, setCopiedReport] = useState(false);
  const [reportValidated, setReportValidated] = useState(false);

  // AI
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [showAnnotations, setShowAnnotations] = useState(false);

  const currentScan = SCANS.find(s => s.id === selectedId) || SCANS[0];
  const compareScan = compareId ? SCANS.find(s => s.id === compareId) : null;
  const currentIndex = SCANS.findIndex(s => s.id === selectedId);

  const handlePrevScan = () => {
    const prev = (currentIndex - 1 + SCANS.length) % SCANS.length;
    setSelectedId(SCANS[prev].id);
    setPan({ x: 0, y: 0 });
    setMeasureLine(null);
    if (aiResult) {
      setAiResult(AI_RESULTS[SCANS[prev].id] || null);
    }
  };

  const handleNextScan = () => {
    const next = (currentIndex + 1) % SCANS.length;
    setSelectedId(SCANS[next].id);
    setPan({ x: 0, y: 0 });
    setMeasureLine(null);
    if (aiResult) {
      setAiResult(AI_RESULTS[SCANS[next].id] || null);
    }
  };

  const applyPreset = (preset: 'standard' | 'lung' | 'bone' | 'soft' | 'invert') => {
    setActivePreset(preset);
    if (preset === 'standard') {
      setBrightness(100);
      setContrast(100);
      setInvert(false);
    } else if (preset === 'lung') {
      setBrightness(110);
      setContrast(145);
      setInvert(false);
    } else if (preset === 'bone') {
      setBrightness(85);
      setContrast(180);
      setInvert(false);
    } else if (preset === 'soft') {
      setBrightness(115);
      setContrast(120);
      setInvert(false);
    } else if (preset === 'invert') {
      setInvert(v => !v);
    }
  };

  const handleCopyReport = () => {
    if (!aiResult) return;
    const text = `COMPTE-RENDU RADIOLOGIQUE - HEALTH AI PACS\nPatient : ${currentScan.patientName} (${currentScan.patientId}) - Âge : ${currentScan.patientAge} ans\nExamen : ${currentScan.examType} (${currentScan.modality}) - Date : ${currentScan.examDate}\nIndication : ${currentScan.description}\nDiagnostic IA (${(aiResult.confidenceScore * 100).toFixed(0)}% confiance) : ${aiResult.pathologyType}\nConstatations : ${aiResult.findings}\nMesures : ${aiResult.measurements}\nRecommandations : ${aiResult.recommendations}\nPrescripteur : ${currentScan.requestedBy}`;
    navigator.clipboard?.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleValidateReport = () => {
    setReportValidated(true);
    setTimeout(() => setReportValidated(false), 3000);
  };

  const resetFilters = () => {
    setBrightness(100); setContrast(100);
    setInvert(false); setRotation(0); setZoom(100);
    setPan({ x: 0, y: 0 });
    setMeasureLine(null);
    setActivePreset('standard');
  };

  const runAiAnalysis = async () => {
    setIsAiLoading(true);
    setAiResult(null);
    setShowAnnotations(false);
    await new Promise(r => setTimeout(r, 2200));
    setAiResult(AI_RESULTS[selectedId] || null);
    setShowAnnotations(true);
    setIsAiLoading(false);
  };

  const statusInfo = (s: ScanRecord['status']) => {
    if (s === 'new') return { label: 'Nouveau', cls: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (s === 'in_progress') return { label: 'En cours', cls: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Lu', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  const urgencyInfo = (u: ScanRecord['urgency']) => {
    if (u === 'stat') return { label: 'STAT', cls: 'bg-rose-600 text-white' };
    if (u === 'urgent') return { label: 'URGENT', cls: 'bg-amber-500 text-white' };
    return { label: 'Routine', cls: 'bg-slate-200 text-slate-700' };
  };

  const modalityColor = (m: ScanRecord['modality']) => {
    const map: Record<string, string> = {
      RX: 'bg-blue-100 text-blue-700 border-blue-200',
      TDM: 'bg-purple-100 text-purple-700 border-purple-200',
      IRM: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      ECO: 'bg-teal-100 text-teal-700 border-teal-200',
      ECG: 'bg-rose-100 text-rose-700 border-rose-200'
    };
    return map[m] || 'bg-slate-100 text-slate-700';
  };

  const imageStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(100%) invert(${invert ? 100 : 0}%)`,
    transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
    transition: 'filter 0.2s, transform 0.3s'
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col pb-20 md:pb-6">
      <DoctorTopBar />
      <DoctorNavBar />

      <main className="max-w-[1400px] mx-auto w-full flex-grow px-3 sm:px-5 lg:px-8 py-4 sm:py-5">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Link href="/doctor/dashboard"
              className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-2">
                Console PACS & Imagerie Médicale
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Connecté
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Visualiseur DICOM · Diagnostic Vision IA · Health AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setCompareMode(!compareMode)}
              className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                compareMode
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}>
              <LayoutPanelLeft className="w-3.5 h-3.5" />
              <span>Comparaison</span>
            </button>
            <button onClick={resetFilters}
              className="h-9 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button onClick={() => window.print()}
              className="h-9 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer">
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>
            <Link
              href="/doctor/consultation?id=P-101&name=Amadou%20Sall&reason=Demande%20Examen%20Radiologique"
              className="h-9 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-purple-600/20 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>+ Prescrire Radio (QR)</span>
            </Link>
          </div>
        </div>

        {/* ── Main Grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

          {/* ── Column 1: PACS Worklist ────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
                  <ScanLine className="w-3.5 h-3.5 text-purple-600" />
                  Liste d'Attente PACS
                  <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {SCANS.filter(s => s.status === 'new').length} new
                  </span>
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {SCANS.map(scan => {
                  const st = statusInfo(scan.status);
                  const urg = urgencyInfo(scan.urgency);
                  const isSelected = scan.id === selectedId;
                  const isCompare = scan.id === compareId;
                  return (
                    <button key={scan.id}
                      onClick={() => {
                        if (compareMode && !isSelected) {
                          setCompareId(scan.id);
                        } else {
                          setSelectedId(scan.id);
                          setAiResult(null);
                          setShowAnnotations(false);
                        }
                      }}
                      className={`w-full text-left p-3.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-50 border-l-4 border-purple-600'
                          : isCompare
                          ? 'bg-indigo-50 border-l-4 border-indigo-500'
                          : 'hover:bg-slate-50'
                      }`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${urg.cls}`}>{urg.label}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${modalityColor(scan.modality)}`}>{scan.modality}</span>
                          </div>
                          <p className="font-bold text-xs text-slate-900 mt-1 truncate">{scan.patientName}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{scan.examType}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${st.cls}`}>{st.label}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />{scan.examDate}
                            </span>
                          </div>
                        </div>
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                          <img src={scan.imageUrl} alt={scan.examType}
                            className="w-full h-full object-cover grayscale opacity-80" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-600" />
                  Filtres Cliniques
                </h3>
                <button onClick={resetFilters} className="text-[10px] text-purple-600 font-bold hover:underline cursor-pointer">Reset</button>
              </div>
              {[
                { label: 'Luminosité', icon: <Sun className="w-3 h-3" />, value: brightness, setter: setBrightness, min: 40, max: 200 },
                { label: 'Contraste', icon: <Contrast className="w-3 h-3" />, value: contrast, setter: setContrast, min: 40, max: 220 },
                { label: 'Zoom', icon: <Search className="w-3 h-3" />, value: zoom, setter: setZoom, min: 80, max: 250 },
              ].map(({ label, icon, value, setter, min, max }) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1">{icon}{label}</span>
                    <span className="text-slate-700">{value}%</span>
                  </div>
                  <input type="range" min={min} max={max} value={value}
                    onChange={e => setter(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-purple-600" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button onClick={() => setInvert(!invert)}
                  className={`py-2 rounded-xl border text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    invert ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}>
                  <Eye className="w-3 h-3" />Négatif
                </button>
                <button onClick={() => setRotation(r => (r + 90) % 360)}
                  className="py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-600 flex items-center justify-center gap-1 cursor-pointer transition-all">
                  <RotateCw className="w-3 h-3" />Pivoter
                </button>
                <button onClick={() => setZoom(z => Math.min(z + 20, 250))}
                  className="py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-600 flex items-center justify-center gap-1 cursor-pointer transition-all">
                  <ZoomIn className="w-3 h-3" />Zoom +
                </button>
                <button onClick={() => setZoom(z => Math.max(z - 20, 60))}
                  className="py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-600 flex items-center justify-center gap-1 cursor-pointer transition-all">
                  <ZoomOut className="w-3 h-3" />Zoom -
                </button>
              </div>
            </div>
          </div>

          {/* ── Column 2+3: Viewer ────────────────────────────────────── */}
          <div className="lg:col-span-6 space-y-4">

            {/* Scan metadata bar */}
            <div className="bg-slate-900 text-white rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
              <div className="space-y-0.5 min-w-0">
                <p className="font-black text-xs text-white truncate">{currentScan.patientName} · {currentScan.patientAge} ans</p>
                <p className="text-[10px] text-slate-400">{currentScan.examType} · {currentScan.examDate}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9px] font-mono text-slate-500">ID: {currentScan.id}</span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded ${urgencyInfo(currentScan.urgency).cls}`}>
                  {urgencyInfo(currentScan.urgency).label}
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${modalityColor(currentScan.modality)}`}>
                  {currentScan.modality}
                </span>
              </div>
            </div>

            {/* DICOM Viewer */}
            <div className={`bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl ${compareMode && compareScan ? 'grid grid-cols-2 gap-0.5' : ''}`}>

              {/* Primary Image */}
              <div className="relative overflow-hidden flex items-center justify-center" style={{minHeight: '420px'}}>

                {/* Grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-10" />

                {/* Patient overlay */}
                <div className="absolute top-3 left-3 z-20 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                  <p className="text-[9px] text-purple-400 font-bold uppercase tracking-widest">Patient</p>
                  <p className="text-xs font-bold text-white">{currentScan.patientName}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{currentScan.id}</p>
                </div>

                {/* PACS badge + Fullscreen button */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                  <div className="bg-black/70 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-green-400 uppercase tracking-wider">PACS Live</span>
                  </div>
                  <button
                    onClick={() => setFullscreen(true)}
                    title="Plein écran (analyse détaillée)"
                    className="h-8 w-8 rounded-xl bg-black/70 hover:bg-purple-600 border border-slate-700 hover:border-purple-500 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Image */}
                <div className="w-full h-full flex items-center justify-center p-4" style={{minHeight: '380px'}}>
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{maxHeight: '400px'}}>
                    <img
                      src={currentScan.imageUrl}
                      alt={currentScan.examType}
                      className="object-contain max-w-full max-h-full rounded-lg"
                      style={imageStyle}
                      draggable={false}
                    />

                    {/* AI Annotation Boxes */}
                    {showAnnotations && aiResult?.regions?.map((region: any, i: number) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`absolute border-2 border-dashed rounded-lg flex items-start justify-center ${
                          aiResult.severity === 'high' ? 'border-red-500 bg-red-500/10' :
                          aiResult.severity === 'medium' ? 'border-amber-500 bg-amber-500/10' : 'border-emerald-500'
                        }`}
                        style={{ top: region.top, left: region.left, width: region.w, height: region.h }}>
                        <span className={`text-[8px] font-black text-white px-2 py-0.5 rounded-b absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-lg ${
                          aiResult.severity === 'high' ? 'bg-red-600' :
                          aiResult.severity === 'medium' ? 'bg-amber-600' : 'bg-emerald-600'
                        }`}>
                          {region.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* DICOM scale */}
                <div className="absolute bottom-3 left-3 z-20 bg-black/60 px-2 py-1 rounded text-[9px] text-slate-500 font-mono">
                  Calib: 0.125 mm/px · Zoom: {zoom}%
                </div>

                {/* AI Analyze button */}
                <div className="absolute bottom-3 right-3 z-20">
                  <button onClick={runAiAnalysis} disabled={isAiLoading}
                    className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[11px] flex items-center gap-1.5 shadow-lg transition-all cursor-pointer disabled:opacity-50">
                    {isAiLoading ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" />Analyse IA...</>
                    ) : (
                      <><BrainCircuit className="w-3.5 h-3.5" />Diagnostic IA Vision</>
                    )}
                  </button>
                </div>
              </div>

              {/* Compare Image */}
              {compareMode && compareScan && (
                <div className="relative overflow-hidden flex items-center justify-center border-l border-slate-800" style={{minHeight: '420px'}}>
                  <div className="absolute top-3 left-3 z-20 bg-indigo-600/90 px-3 py-1.5 rounded-xl">
                    <p className="text-[9px] text-white font-bold uppercase">Comparaison</p>
                    <p className="text-xs font-bold text-white">{compareScan.patientName}</p>
                  </div>
                  <div className="w-full h-full flex items-center justify-center p-4" style={{minHeight: '380px'}}>
                    <img src={compareScan.imageUrl} alt={compareScan.examType}
                      className="object-contain max-w-full max-h-full rounded-lg"
                      style={{ filter: 'grayscale(100%) brightness(100%) contrast(100%)', maxHeight: '400px' }}
                      draggable={false} />
                  </div>
                </div>
              )}
            </div>

            {/* ── HIGH-GRADE CLINICAL PACS FULLSCREEN WORKSTATION (MOBILE & DESKTOP) ── */}
            <AnimatePresence>
              {fullscreen && (
                <motion.div
                  key="fullscreen-modal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[9999] bg-slate-950 text-white flex flex-col select-none overflow-hidden"
                >
                  {/* ── 1. Top Clinical Control Bar ────────────────────────── */}
                  <div className="bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-md shrink-0 z-50">
                    
                    {/* Primary Row: Identity & Quick Actions */}
                    <div className="flex items-center justify-between px-3 sm:px-4 py-2 gap-2">
                      
                      {/* Left: Patient & Exam Badge */}
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-purple-950/40 shrink-0">
                          H+
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-black text-xs sm:text-sm text-white tracking-tight truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none">
                              {currentScan.patientName}
                            </p>
                            <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-800/80 text-purple-300 font-bold">
                              {currentScan.patientId}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-400">
                              {currentScan.modality}
                            </span>
                          </div>
                          <p className="hidden sm:block text-[10px] text-slate-400 truncate mt-0.5">
                            {currentScan.examType} · {currentScan.examDate} · <span className="text-slate-300">{currentScan.requestedBy}</span>
                          </p>
                        </div>
                      </div>

                      {/* Center: Desktop Series Switcher */}
                      <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-xl">
                        <button
                          onClick={handlePrevScan}
                          title="Cliché précédent"
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-mono font-bold text-slate-300 px-1.5">
                          Cliché {currentIndex + 1} / {SCANS.length}
                        </span>
                        <button
                          onClick={handleNextScan}
                          title="Cliché suivant"
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <div className="w-[1px] h-4 bg-slate-700 mx-1" />
                        <button
                          onClick={() => setShowSeriesTray(v => !v)}
                          className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                            showSeriesTray ? 'bg-purple-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Série ({SCANS.length})</span>
                        </button>
                      </div>

                      {/* Right: Actions and Tools */}
                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        
                        {/* Mobile Cliché Mini-Switcher */}
                        <div className="flex lg:hidden items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                          <button
                            onClick={handlePrevScan}
                            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[10px] font-mono font-bold px-1 text-slate-300">
                            {currentIndex + 1}/{SCANS.length}
                          </span>
                          <button
                            onClick={handleNextScan}
                            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Desktop Presets Group */}
                        <div className="hidden xl:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                          <button
                            onClick={() => applyPreset('standard')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                              activePreset === 'standard' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            Standard
                          </button>
                          <button
                            onClick={() => applyPreset('lung')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                              activePreset === 'lung' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            Poumon
                          </button>
                          <button
                            onClick={() => applyPreset('bone')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                              activePreset === 'bone' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            Os
                          </button>
                          <button
                            onClick={() => applyPreset('soft')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                              activePreset === 'soft' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            Tissus
                          </button>
                        </div>

                        {/* Desktop Tools Selection */}
                        <div className="hidden md:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                          <button
                            onClick={() => setActiveTool('pointer')}
                            title="Mode Curseur"
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                              activeTool === 'pointer' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Focus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setActiveTool('pan')}
                            title="Translation (Pan)"
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                              activeTool === 'pan' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Move className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setActiveTool('measure')}
                            title="Règle Caliper"
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                              activeTool === 'measure' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Ruler className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setShowCrosshair(v => !v)}
                            title="Réticule"
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                              showCrosshair ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Crosshair className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Desktop Fine Adjustments */}
                        <div className="hidden md:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                          <button
                            onClick={() => setZoom(z => Math.min(z + 20, 350))}
                            title="Zoom +"
                            className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <ZoomIn className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setZoom(z => Math.max(z - 20, 40))}
                            title="Zoom -"
                            className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <ZoomOut className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setRotation(r => (r + 90) % 360)}
                            title="Rotation 90°"
                            className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setInvert(v => !v)}
                            title="Inversion Négatif"
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                              invert ? 'bg-purple-600 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={resetFilters}
                            title="Réinitialiser"
                            className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* AI Report Drawer Toggle Button */}
                        <button
                          onClick={() => setShowAiDrawer(v => !v)}
                          className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl font-extrabold text-[11px] sm:text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                            showAiDrawer
                              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          }`}
                        >
                          <BrainCircuit className="w-3.5 h-3.5 text-purple-200" />
                          <span>Rapport IA</span>
                          {aiResult && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                        </button>

                        {/* Close button */}
                        <button
                          onClick={() => setFullscreen(false)}
                          className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-slate-800 hover:bg-rose-600 border border-slate-700 hover:border-rose-500 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                          title="Fermer le plein écran (Échap)"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Secondary Row: Mobile Scrollable Tools Bar */}
                    <div className="flex md:hidden items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
                      
                      {/* Presets */}
                      <button
                        onClick={() => applyPreset('standard')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold whitespace-nowrap cursor-pointer ${
                          activePreset === 'standard' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        Std
                      </button>
                      <button
                        onClick={() => applyPreset('lung')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold whitespace-nowrap cursor-pointer ${
                          activePreset === 'lung' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        🫁 Poumon
                      </button>
                      <button
                        onClick={() => applyPreset('bone')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold whitespace-nowrap cursor-pointer ${
                          activePreset === 'bone' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        🦴 Os
                      </button>
                      <button
                        onClick={() => applyPreset('soft')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold whitespace-nowrap cursor-pointer ${
                          activePreset === 'soft' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        Tissus
                      </button>

                      <div className="w-[1px] h-4 bg-slate-700 shrink-0 mx-0.5" />

                      {/* Tools */}
                      <button
                        onClick={() => setActiveTool(activeTool === 'pan' ? 'pointer' : 'pan')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                          activeTool === 'pan' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        <Move className="w-3 h-3" />
                        <span>Pan</span>
                      </button>
                      <button
                        onClick={() => setActiveTool(activeTool === 'measure' ? 'pointer' : 'measure')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                          activeTool === 'measure' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        <Ruler className="w-3 h-3" />
                        <span>Règle</span>
                      </button>
                      <button
                        onClick={() => setShowCrosshair(v => !v)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                          showCrosshair ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        <Crosshair className="w-3 h-3" />
                        <span>Réticule</span>
                      </button>

                      <div className="w-[1px] h-4 bg-slate-700 shrink-0 mx-0.5" />

                      {/* Zoom controls */}
                      <button
                        onClick={() => setZoom(z => Math.min(z + 20, 350))}
                        className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold cursor-pointer"
                      >
                        + Zoom
                      </button>
                      <button
                        onClick={() => setZoom(z => Math.max(z - 20, 40))}
                        className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold cursor-pointer"
                      >
                        - Zoom
                      </button>
                      <button
                        onClick={() => setInvert(v => !v)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                          invert ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        Négatif
                      </button>
                      <button
                        onClick={resetFilters}
                        className="px-2 py-1 rounded-lg bg-slate-800 text-rose-300 text-[10px] font-bold cursor-pointer"
                      >
                        Centrer
                      </button>

                      <div className="w-[1px] h-4 bg-slate-700 shrink-0 mx-0.5" />

                      <button
                        onClick={() => setShowSeriesTray(v => !v)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                          showSeriesTray ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        <Layers className="w-3 h-3" />
                        <span>Série ({SCANS.length})</span>
                      </button>
                    </div>
                  </div>

                  {/* ── 2. Main Workstation Area ───────────────────────────── */}
                  <div className="flex-1 relative flex overflow-hidden">
                    
                    {/* ── Center Image Viewport (Always 100% visible on Mobile & Desktop) ── */}
                    <div
                      className="flex-1 relative bg-black flex items-center justify-center overflow-hidden cursor-default touch-none"
                      onMouseDown={(e) => {
                        if (activeTool === 'pan') {
                          setIsPanning(true);
                          setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
                        } else if (activeTool === 'measure') {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const y = e.clientY - rect.top;
                          setIsMeasuring(true);
                          setMeasureLine({ x1: x, y1: y, x2: x, y2: y });
                        }
                      }}
                      onMouseMove={(e) => {
                        if (activeTool === 'pan' && isPanning) {
                          setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
                        } else if (activeTool === 'measure' && isMeasuring) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const y = e.clientY - rect.top;
                          setMeasureLine(prev => prev ? { ...prev, x2: x, y2: y } : null);
                        }
                      }}
                      onMouseUp={() => {
                        setIsPanning(false);
                        setIsMeasuring(false);
                      }}
                      onTouchStart={(e) => {
                        if (e.touches.length === 1) {
                          setIsPanning(true);
                          setPanStart({
                            x: e.touches[0].clientX - pan.x,
                            y: e.touches[0].clientY - pan.y
                          });
                        }
                      }}
                      onTouchMove={(e) => {
                        if (e.touches.length === 1 && isPanning) {
                          setPan({
                            x: e.touches[0].clientX - panStart.x,
                            y: e.touches[0].clientY - panStart.y
                          });
                        }
                      }}
                      onTouchEnd={() => {
                        setIsPanning(false);
                      }}
                      onWheel={(e) => {
                        e.preventDefault();
                        const delta = e.deltaY < 0 ? 15 : -15;
                        setZoom(z => Math.max(40, Math.min(350, z + delta)));
                      }}
                    >
                      {/* Subtle Technical DICOM Background Grid */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-10" />

                      {/* Interactive Crosshair (Réticule) */}
                      {showCrosshair && (
                        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
                          <div className="absolute w-full h-[1px] bg-cyan-400/40" />
                          <div className="absolute h-full w-[1px] bg-cyan-400/40" />
                          <div className="w-16 h-16 rounded-full border border-cyan-400/50" />
                          <div className="w-2 h-2 rounded-full bg-cyan-400" />
                        </div>
                      )}

                      {/* ── HUD DESKTOP (Detailed 4 Corners) ── */}
                      {/* Top-Left Corner */}
                      <div className="hidden md:block absolute top-3 left-4 z-30 font-mono text-[10px] text-cyan-400/90 font-bold tracking-wider space-y-0.5 select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        <p className="text-white text-xs">{currentScan.patientName.toUpperCase()}</p>
                        <p>ID: {currentScan.patientId} · AGE: {currentScan.patientAge}A · SEX: M</p>
                        <p>ACCESSION: {currentScan.id}</p>
                        <p className="text-cyan-300">EXAMEN: {currentScan.modality} {currentScan.bodyPart.toUpperCase()}</p>
                      </div>

                      {/* Top-Right Corner */}
                      <div className="hidden md:block absolute top-3 right-4 z-30 font-mono text-[10px] text-right text-cyan-400/90 font-bold tracking-wider space-y-0.5 select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        <p className="text-white">HÔPITAL PRINCIPAL DE DAKAR</p>
                        <p>HEALTH AI PACS SERVER v4.2</p>
                        <p>DATE: {currentScan.examDate} 12:55:04</p>
                        <p className="text-purple-300">PRESET: {activePreset.toUpperCase()}</p>
                      </div>

                      {/* Bottom-Left Corner */}
                      <div className="hidden md:block absolute bottom-3 left-4 z-30 font-mono text-[10px] text-cyan-400/90 font-bold tracking-wider space-y-0.5 select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        <p>WL: {Math.round(brightness * 3.5 - 150)} · WW: {Math.round(contrast * 14)}</p>
                        <p>ZOOM: {zoom}% · ROTATION: {rotation}°</p>
                        <p>PAN: X:{Math.round(pan.x)} Y:{Math.round(pan.y)} px</p>
                        <p className="text-slate-400">ÉCHELLE: 0.125 mm/px · FOV: 430 mm</p>
                      </div>

                      {/* Bottom-Right Corner */}
                      <div className="hidden md:block absolute bottom-3 right-4 z-30 font-mono text-[10px] text-right text-cyan-400/90 font-bold tracking-wider space-y-0.5 select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        <p>MATRICE: 2048 × 2048 (16-bit)</p>
                        <p>STATUS: {currentScan.status.toUpperCase()} · URG: {currentScan.urgency.toUpperCase()}</p>
                        <p className={aiResult ? 'text-emerald-400' : 'text-amber-400'}>
                          IA: {aiResult ? aiResult.pathologyType : 'NON ANALYSÉ'}
                        </p>
                        <p className="text-slate-400">COMPRESSION: LOSSLESS DICOM</p>
                      </div>

                      {/* ── HUD MOBILE (Compact & Zero Overlap) ── */}
                      <div className="md:hidden absolute top-2 left-2 z-30 font-mono text-[9px] text-cyan-400 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md pointer-events-none">
                        {currentScan.modality} · WL:{Math.round(brightness * 3.5 - 150)}
                      </div>
                      <div className="md:hidden absolute top-2 right-2 z-30 font-mono text-[9px] text-purple-300 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md pointer-events-none">
                        {activePreset.toUpperCase()} · {zoom}%
                      </div>
                      <div className="md:hidden absolute bottom-2 left-2 z-30 font-mono text-[9px] text-slate-400 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md pointer-events-none">
                        0.125 mm/px
                      </div>
                      <div className="md:hidden absolute bottom-2 right-2 z-30 font-mono text-[9px] text-cyan-300 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md pointer-events-none">
                        {aiResult ? '✓ IA Prête' : 'IA en attente'}
                      </div>

                      {/* Transformed Radiologic Image Container */}
                      <div
                        className="relative z-20 flex items-center justify-center transition-transform"
                        style={{
                          transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom / 100})`,
                          transformOrigin: 'center center',
                          cursor: activeTool === 'pan' ? (isPanning ? 'grabbing' : 'grab') : activeTool === 'measure' ? 'crosshair' : 'default'
                        }}
                      >
                        <img
                          key={currentScan.id}
                          src={currentScan.imageUrl}
                          alt={currentScan.examType}
                          className="max-w-[92vw] md:max-w-[85vw] max-h-[75vh] md:max-h-[80vh] object-contain select-none shadow-2xl rounded-sm"
                          style={{
                            filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(100%) invert(${invert ? 100 : 0}%)`
                          }}
                          draggable={false}
                        />

                        {/* AI Detection Overlay Boxes on Image */}
                        {showAnnotations && aiResult?.regions?.map((region: any, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`absolute border-2 border-dashed rounded-lg z-30 pointer-events-none ${
                              aiResult.severity === 'high'
                                ? 'border-red-400 bg-red-500/15'
                                : aiResult.severity === 'medium'
                                ? 'border-amber-400 bg-amber-500/15'
                                : 'border-emerald-400'
                            }`}
                            style={{ top: region.top, left: region.left, width: region.w, height: region.h }}
                          >
                            <span
                              className={`text-[8px] sm:text-[9px] font-black text-white px-1.5 sm:px-2 py-0.5 rounded-b absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-xl ${
                                aiResult.severity === 'high' ? 'bg-red-600' : aiResult.severity === 'medium' ? 'bg-amber-600' : 'bg-emerald-600'
                              }`}
                            >
                              ⚠️ {region.label}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Interactive Measurement Caliper SVG Overlay */}
                      {measureLine && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
                          <line
                            x1={measureLine.x1}
                            y1={measureLine.y1}
                            x2={measureLine.x2}
                            y2={measureLine.y2}
                            stroke="#06b6d4"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                          />
                          <circle cx={measureLine.x1} cy={measureLine.y1} r="4" fill="#06b6d4" />
                          <circle cx={measureLine.x2} cy={measureLine.y2} r="4" fill="#06b6d4" />
                          <rect
                            x={(measureLine.x1 + measureLine.x2) / 2 - 32}
                            y={(measureLine.y1 + measureLine.y2) / 2 - 14}
                            width="64"
                            height="20"
                            rx="6"
                            fill="#083344"
                            stroke="#06b6d4"
                            strokeWidth="1"
                          />
                          <text
                            x={(measureLine.x1 + measureLine.x2) / 2}
                            y={(measureLine.y1 + measureLine.y2) / 2}
                            fill="#a5f3fc"
                            fontSize="10"
                            fontWeight="bold"
                            fontFamily="monospace"
                            textAnchor="middle"
                            dominantBaseline="central"
                          >
                            {(Math.hypot(measureLine.x2 - measureLine.x1, measureLine.y2 - measureLine.y1) * 0.125 * (100 / zoom)).toFixed(1)} mm
                          </text>
                        </svg>
                      )}

                      {/* Floating Measure Tool Hint / Clear button */}
                      {measureLine && (
                        <div className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 border border-cyan-800 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-2xl backdrop-blur-md">
                          <span className="text-[10px] sm:text-[11px] font-mono text-cyan-300 font-bold">
                            Mesure : {(Math.hypot(measureLine.x2 - measureLine.x1, measureLine.y2 - measureLine.y1) * 0.125 * (100 / zoom)).toFixed(1)} mm
                          </span>
                          <button
                            onClick={() => setMeasureLine(null)}
                            className="text-[9px] sm:text-[10px] bg-cyan-950 hover:bg-rose-900 text-cyan-400 hover:text-white px-2 py-0.5 rounded cursor-pointer transition-colors"
                          >
                            Effacer
                          </button>
                        </div>
                      )}

                      {/* Desktop Navigation Floating Controls */}
                      <div className="hidden md:flex absolute bottom-16 left-1/2 -translate-x-1/2 z-40 items-center gap-1.5 bg-slate-950/80 border border-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-2xl">
                        <span className="text-[10px] text-slate-400">Molette : Zoom · Glisser : {activeTool === 'pan' ? 'Panoramique' : activeTool === 'measure' ? 'Mesure Caliper' : 'Sélection'}</span>
                        <div className="w-[1px] h-3 bg-slate-800 mx-1" />
                        <button
                          onClick={resetFilters}
                          className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          Centrer vue
                        </button>
                      </div>
                    </div>

                    {/* ── AI & CLINICAL DRAWER (Responsive: Bottom Sheet on Mobile / Side Panel on Desktop) ── */}
                    <AnimatePresence>
                      {showAiDrawer && (
                        <>
                          {/* Mobile Backdrop Overlay */}
                          <motion.div
                            key="ai-drawer-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAiDrawer(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
                          />

                          {/* Drawer Element */}
                          <motion.aside
                            key="ai-drawer"
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                            className="fixed inset-x-0 bottom-0 z-50 max-h-[82vh] md:max-h-none md:inset-auto md:relative md:w-96 bg-slate-950 border-t md:border-t-0 md:border-l border-slate-800 rounded-t-3xl md:rounded-none shadow-2xl flex flex-col overflow-hidden shrink-0"
                          >
                            {/* Mobile Drag Handle */}
                            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto my-2.5 shrink-0 md:hidden" />

                            {/* Drawer Header */}
                            <div className="px-4 sm:px-5 py-3 border-b border-slate-800/90 flex items-center justify-between bg-slate-900/60 shrink-0 backdrop-blur-md">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                                  <BrainCircuit className="w-4 h-4" />
                                </div>
                                <div>
                                  <h3 className="font-extrabold text-xs text-white">Diagnostic IA Vision</h3>
                                  <p className="text-[10px] text-slate-400">Gemini Clinical PACS · Health AI</p>
                                </div>
                              </div>
                              <button
                                onClick={() => setShowAiDrawer(false)}
                                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                                title="Fermer"
                              >
                                <X className="w-4 h-4 md:hidden" />
                                <ChevronRight className="w-4 h-4 hidden md:block" />
                              </button>
                            </div>

                            {/* Drawer Content */}
                            <div className="p-4 space-y-3.5 flex-1 overflow-y-auto">
                              
                              {/* Clinical Indication Card */}
                              <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-3 space-y-1.5">
                                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Indication Clinique</p>
                                <p className="text-xs text-slate-200 leading-relaxed">{currentScan.description}</p>
                                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                                  <span>Prescrit par : <strong className="text-slate-300">{currentScan.requestedBy}</strong></span>
                                  <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                                    currentScan.urgency === 'stat' ? 'bg-red-950 text-red-300' : 'bg-slate-800 text-slate-300'
                                  }`}>
                                    {currentScan.urgency}
                                  </span>
                                </div>
                              </div>

                              {/* AI Vision Status & Launcher */}
                              {isAiLoading ? (
                                <div className="bg-purple-950/30 border border-purple-800/50 rounded-2xl p-6 text-center space-y-3">
                                  <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
                                  <div>
                                    <p className="text-xs font-black text-white">Segmentation & Analyse IA en cours...</p>
                                    <p className="text-[10px] text-purple-300/80 mt-1">Extraction des motifs alvéolaires par Gemini Medical</p>
                                  </div>
                                </div>
                              ) : !aiResult ? (
                                <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 text-center space-y-3">
                                  <Sparkles className="w-8 h-8 text-purple-400 mx-auto" />
                                  <div>
                                    <p className="text-xs font-black text-white">Aucun diagnostic IA exécuté</p>
                                    <p className="text-[10px] text-slate-400 mt-1">L'IA détecte automatiquement opacités, fractures et anomalies.</p>
                                  </div>
                                  <button
                                    onClick={runAiAnalysis}
                                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
                                  >
                                    <BrainCircuit className="w-4 h-4" />
                                    Lancer le Diagnostic IA Vision
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-3.5">
                                  
                                  {/* Pathology Severity Banner */}
                                  <div className={`rounded-xl p-3.5 border ${
                                    aiResult.severity === 'high'
                                      ? 'bg-rose-950/60 border-rose-800/80 text-rose-200'
                                      : aiResult.severity === 'medium'
                                      ? 'bg-amber-950/60 border-amber-800/80 text-amber-200'
                                      : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-200'
                                  }`}>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-[10px] font-black uppercase tracking-wider">
                                        {aiResult.severity === 'high' ? '⚠️ Anomalie Critique Détectée' : aiResult.severity === 'medium' ? '⚠️ Pathologie Détectée' : '✓ Aspect Normal'}
                                      </span>
                                      <span className="text-xs font-mono font-black">
                                        {(aiResult.confidenceScore * 100).toFixed(0)}% certitude
                                      </span>
                                    </div>
                                    <p className="text-sm font-black text-white">{aiResult.pathologyType}</p>
                                  </div>

                                  {/* Findings */}
                                  <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 space-y-1.5">
                                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Constatations Radiologiques</p>
                                    <p className="text-xs text-slate-300 leading-relaxed">{aiResult.findings}</p>
                                    {aiResult.measurements && (
                                      <div className="pt-2 border-t border-slate-800 text-[11px] text-cyan-300 font-mono font-bold">
                                        📏 {aiResult.measurements}
                                      </div>
                                    )}
                                  </div>

                                  {/* Recommendations */}
                                  <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 space-y-1.5">
                                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">Recommandations Thérapeutiques IA</p>
                                    <p className="text-xs text-slate-300 leading-relaxed">{aiResult.recommendations}</p>
                                  </div>

                                  {/* Toggle Annotations */}
                                  {aiResult.regions && aiResult.regions.length > 0 && (
                                    <label className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl cursor-pointer">
                                      <span className="text-xs font-extrabold text-slate-300 flex items-center gap-2">
                                        <ScanLine className="w-3.5 h-3.5 text-purple-400" />
                                        Afficher repères sur le cliché
                                      </span>
                                      <input
                                        type="checkbox"
                                        checked={showAnnotations}
                                        onChange={(e) => setShowAnnotations(e.target.checked)}
                                        className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                                      />
                                    </label>
                                  )}

                                  {/* Action Buttons */}
                                  <div className="space-y-2 pt-1 pb-4">
                                    <button
                                      onClick={handleCopyReport}
                                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-200 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                                    >
                                      {copiedReport ? (
                                        <>
                                          <Check className="w-4 h-4 text-emerald-400" />
                                          <span className="text-emerald-400 font-black">Copié dans le presse-papier !</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-4 h-4 text-slate-400" />
                                          <span>Copier au Compte-Rendu</span>
                                        </>
                                      )}
                                    </button>

                                    <button
                                      onClick={handleValidateReport}
                                      className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                        reportValidated
                                          ? 'bg-emerald-600 text-white'
                                          : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/50'
                                      }`}
                                    >
                                      {reportValidated ? (
                                        <>
                                          <Check className="w-4 h-4" />
                                          <span>Validé & Archivé au DMP</span>
                                        </>
                                      ) : (
                                        <>
                                          <FileText className="w-4 h-4" />
                                          <span>Valider & Insérer au Dossier</span>
                                        </>
                                      )}
                                    </button>

                                    <button
                                      onClick={runAiAnalysis}
                                      className="w-full py-1.5 text-[10px] text-slate-500 hover:text-slate-300 text-center cursor-pointer transition-colors"
                                    >
                                      Réanalyser ce cliché
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.aside>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── 3. Bottom Series Thumbnails Tray ───────────────────── */}
                  <AnimatePresence>
                    {showSeriesTray && (
                      <motion.div
                        key="series-tray"
                        initial={{ y: 90, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-20 sm:h-24 bg-slate-950/95 border-t border-slate-800 px-3 sm:px-4 py-2 flex items-center gap-2.5 overflow-x-auto shrink-0 z-50 backdrop-blur-md"
                      >
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 shrink-0 hidden xs:block">
                          Série :
                        </p>
                        {SCANS.map((scan, idx) => (
                          <button
                            key={scan.id}
                            onClick={() => {
                              setSelectedId(scan.id);
                              setPan({ x: 0, y: 0 });
                              setMeasureLine(null);
                              if (aiResult) {
                                setAiResult(AI_RESULTS[scan.id] || null);
                              }
                            }}
                            className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all cursor-pointer shrink-0 text-left ${
                              selectedId === scan.id
                                ? 'bg-purple-950/70 border-purple-500 ring-2 ring-purple-500/50'
                                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <img
                              src={scan.imageUrl}
                              alt={scan.examType}
                              className="w-11 h-11 sm:w-14 sm:h-14 object-cover rounded-lg bg-black filter grayscale"
                            />
                            <div className="pr-1 sm:pr-2">
                              <span className="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">
                                #{idx + 1} · {scan.modality}
                              </span>
                              <p className="text-[11px] sm:text-xs font-black text-white mt-0.5 max-w-[100px] sm:max-w-[130px] truncate">
                                {scan.patientName}
                              </p>
                              <p className="text-[9px] sm:text-[10px] text-slate-400 max-w-[100px] sm:max-w-[130px] truncate">
                                {scan.examType}
                              </p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scan description */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Indication clinique</p>
              <p className="text-xs text-slate-700 leading-relaxed">{currentScan.description}</p>
              <p className="text-[10px] text-slate-400 mt-1.5">Demandé par : <strong className="text-slate-600">{currentScan.requestedBy}</strong> · Corps : <strong className="text-slate-600">{currentScan.bodyPart}</strong></p>
            </div>
          </div>

          {/* ── Column 4: AI Diagnostic Report ────────────────────────── */}
          <div className="lg:col-span-3 space-y-4">

            {/* AI Report */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-slate-900">Rapport IA Vision</h3>
                  <p className="text-[10px] text-slate-400">Gemini · Health AI</p>
                </div>
              </div>

              <div className="p-4 min-h-[300px] flex flex-col">
                {isAiLoading ? (
                  <div className="flex flex-col items-center justify-center text-center gap-3 flex-1 py-8">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center">
                        <Loader2 className="w-7 h-7 animate-spin text-purple-600" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center">
                        <BrainCircuit className="w-2.5 h-2.5 text-white" />
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Analyse Vision IA</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">Scrutation densitométrique et<br />détection de patterns anormaux...</p>
                    </div>
                  </div>
                ) : aiResult ? (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 text-xs">

                    {/* Pathology Badge */}
                    <div className={`p-3 rounded-xl border flex items-start gap-2 ${
                      aiResult.severity === 'high' ? 'bg-rose-50 border-rose-200 text-rose-800' :
                      aiResult.severity === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                      'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}>
                      {aiResult.severity !== 'none' ? (
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong className="font-extrabold block text-xs">{aiResult.pathologyType}</strong>
                        {aiResult.severity !== 'none' && (
                          <span className="text-[10px] opacity-90">Sévérité : {aiResult.severity === 'high' ? 'Haute' : 'Moyenne'}</span>
                        )}
                      </div>
                    </div>

                    {/* Confidence Score */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Indice de confiance</span>
                        <span className="font-black text-purple-700">{(aiResult.confidenceScore * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${aiResult.confidenceScore * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            aiResult.confidenceScore > 0.85 ? 'bg-purple-600' : 'bg-amber-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Measurements */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mesures</p>
                      <p className="text-slate-700 font-semibold">{aiResult.measurements}</p>
                    </div>

                    {/* Findings */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Observations Radiologiques</p>
                      <p className="text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3">
                        {aiResult.findings}
                      </p>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Recommandations Cliniques</p>
                      <p className="text-slate-600 leading-relaxed italic text-[11px]">{aiResult.recommendations}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-1">
                      <button className="flex-1 h-9 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                        <Printer className="w-3.5 h-3.5" />
                        Imprimer CR
                      </button>
                      <Link href={`/doctor/consultation?id=${currentScan.patientId}&name=${encodeURIComponent(currentScan.patientName)}&age=${currentScan.patientAge}`}
                        className="flex-1 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                        Dossier
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center flex-1 p-6 gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center">
                      <BrainCircuit className="w-7 h-7 text-purple-400 opacity-60" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-700">En attente d'analyse</p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed max-w-[180px]">
                        Cliquez sur <strong>Diagnostic IA Vision</strong> dans le visualiseur pour analyser ce cliché.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-4 space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">File PACS du jour</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-2.5">
                  <p className="text-base font-black text-rose-600">{SCANS.filter(s => s.status === 'new').length}</p>
                  <p className="text-[9px] font-bold text-slate-500 mt-0.5">Nouveaux</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-2.5">
                  <p className="text-base font-black text-amber-600">{SCANS.filter(s => s.status === 'in_progress').length}</p>
                  <p className="text-[9px] font-bold text-slate-500 mt-0.5">En cours</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5">
                  <p className="text-base font-black text-emerald-600">{SCANS.filter(s => s.status === 'reviewed').length}</p>
                  <p className="text-[9px] font-bold text-slate-500 mt-0.5">Lus</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-3 px-4 text-center text-[11px] text-slate-400 mt-6">
        © {new Date().getFullYear()} Health AI · Console PACS & Imagerie · Diagnostic Vision IA
      </footer>
    </div>
  );
}

export default function DoctorImaging() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    }>
      <ImagingContent />
    </Suspense>
  );
}
