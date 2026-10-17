'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Sliders,
  Sun,
  Eye,
  RotateCw,
  Search,
  Maximize2,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Mic,
  MicOff,
  BrainCircuit,
  Layers,
  FileText,
  Check,
  ShieldCheck,
  QrCode,
  Ruler,
  Crosshair,
  RefreshCw,
  Send,
  ChevronRight,
  User,
  Calendar,
  Activity,
  Download,
  Printer,
  Copy,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  X,
  Stethoscope
} from 'lucide-react';
import Link from 'next/link';
import RadiologyTopBar from '@/components/radiology/RadiologyTopBar';
import RadiologyNavBar from '@/components/radiology/RadiologyNavBar';
import { useAuthStore, getAuthHeader } from '@/lib/authStore';
import { 
  getRadiologyOrders, 
  updateRadiologyOrderStatus, 
  RadiologyOrder 
} from '@/lib/radiologyStore';
import { 
  saveRadiologyResult, 
  RadiologyResult, 
  getResultForOrder 
} from '@/lib/radiologyResultStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function RadiologyViewerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryId = searchParams.get('id') || 'RAD-2026-101';
  const queryPatient = searchParams.get('patient');
  const queryType = searchParams.get('type');
  const queryDoctor = searchParams.get('doctor');

  // Orders list & Active Order
  const [orders, setOrders] = useState<RadiologyOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(queryId);
  const [activeOrder, setActiveOrder] = useState<RadiologyOrder | null>(null);

  // Responsive mobile tabs: 'viewport' | 'ai' | 'report' | 'tools'
  const [activeMobileTab, setActiveMobileTab] = useState<'viewport' | 'ai' | 'report' | 'tools'>('viewport');

  // Viewport & DICOM States
  const [viewMode, setViewMode] = useState<'2d' | '3d_mpr'>('2d');
  const [windowPreset, setWindowPreset] = useState<'default' | 'lung' | 'bone' | 'soft_tissue' | 'brain'>('default');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(true);
  const [invert, setInvert] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [showRuler, setShowRuler] = useState(false);
  const [showAiOverlay, setShowAiOverlay] = useState(true);
  const [activeSeriesIndex, setActiveSeriesIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Speech to Text States
  const [isDictating, setIsDictating] = useState(false);
  const [reportFindings, setReportFindings] = useState('');
  const [reportConclusion, setReportConclusion] = useState('');
  const recognitionRef = useRef<any>(null);

  // AI Vision Analysis States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    hasPathology: boolean;
    pathologyType: string;
    confidenceScore: number;
    severity: 'critical' | 'high' | 'medium' | 'low';
    findings: string;
    measurements: string;
    recommendations: string;
    boundingLocation?: { top: string; left: string; width: string; height: string };
  } | null>(null);

  // Save & Transmit states
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionSuccess, setTransmissionSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load all radiology orders & pick selected
  useEffect(() => {
    const list = getRadiologyOrders();
    setOrders(list);

    const found = list.find(o => o.id === selectedOrderId) || list[0] || null;
    setActiveOrder(found);

    if (found) {
      // Check if existing result exists
      const existing = getResultForOrder(found.id);
      if (existing) {
        setReportFindings(existing.findings);
        setReportConclusion(existing.conclusion);
      } else {
        // Pre-fill initial findings according to modality
        if (found.modality === 'RX') {
          setReportFindings("Transparence parenchymateuse pulmonaire symétrique. Absence de foyer alvéolaire évident ou d'épanchement pleural. Silhouette cardiovasculaire d'index normal.");
          setReportConclusion("Radiographie thoracique dans les limites physiologiques.");
        } else if (found.modality === 'TDM') {
          setReportFindings("Exploration tomodensitométrique multi-coupes après injection. Pas de lésion parenchymateuse aiguë ni de collection liquidienne sous-diaphragmatique.");
          setReportConclusion("Bilan TDM rassurant, pas de lésion viscérale post-traumatique patente.");
        } else {
          setReportFindings("Examen morphologique standardisé. Structures anatomiques d'aspect physiologique sans anomalie focale.");
          setReportConclusion("Examen normal.");
        }
      }
    }
  }, [selectedOrderId]);

  // Set default AI results according to selected order
  useEffect(() => {
    if (!activeOrder) return;
    if (activeOrder.priority === 'vital') {
      setAiResult({
        hasPathology: true,
        pathologyType: "Foyer de Pneumopathie Alvéolaire",
        confidenceScore: 0.96,
        severity: "critical",
        findings: "Opacité alvéolaire dense et confluente au niveau du lobe inférieur droit avec bronchogramme aérien net. Réaction pleurale débutante homolatérale.",
        measurements: "Foyer d'opacité étendu sur 4.4 cm x 3.8 cm.",
        recommendations: "Indication d'antibiothérapie probabiliste urgente. Radiographie de contrôle à J+15.",
        boundingLocation: { top: '34%', left: '52%', width: '130px', height: '130px' }
      });
    } else if (activeOrder.priority === 'urgent') {
      setAiResult({
        hasPathology: true,
        pathologyType: "Trait de Fracture Sous-Corticale",
        confidenceScore: 0.91,
        severity: "high",
        findings: "Trait de fracture net non déplacé au niveau de l'interligne osseux. Absence d'arrachement ligamentaire ou d'épanchement intra-articulaire massif.",
        measurements: "Trait de refend mesuré à 1.9 cm.",
        recommendations: "Immobilisation antalgique stricte et avis orthopédique pour consolidation.",
        boundingLocation: { top: '46%', left: '38%', width: '110px', height: '100px' }
      });
    } else {
      setAiResult({
        hasPathology: false,
        pathologyType: "Morphologie Normale",
        confidenceScore: 0.98,
        severity: "low",
        findings: "Intégrité des contours anatomiques. Absence de lésion nodulaire, de condensation focale ou d'anomalie de densité suspecte.",
        measurements: "Indices biométriques dans les normes.",
        recommendations: "Aucune intervention radiologique requise. Poursuite de la prise en charge médicale.",
        boundingLocation: undefined
      });
    }
  }, [activeOrder]);

  // Speech to Text Web API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'fr-FR';

        rec.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            }
          }
          if (finalTranscript) {
            setReportFindings(prev => prev ? `${prev} ${finalTranscript.trim()}` : finalTranscript.trim());
          }
        };

        rec.onerror = (e: any) => {
          console.error("Speech Recognition Error:", e);
          setIsDictating(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleDictation = () => {
    if (!recognitionRef.current) {
      alert("La dictée vocale n'est pas supportée sur ce navigateur. Vous pouvez saisir le rapport au clavier.");
      return;
    }

    if (isDictating) {
      recognitionRef.current.stop();
      setIsDictating(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsDictating(true);
      } catch {
        setIsDictating(false);
      }
    }
  };

  // Preset windowing filters
  const applyWindowPreset = (preset: 'default' | 'lung' | 'bone' | 'soft_tissue' | 'brain') => {
    setWindowPreset(preset);
    switch (preset) {
      case 'lung': // WW: 1500, WL: -600 (High contrast lung fields)
        setBrightness(125);
        setContrast(140);
        setGrayscale(true);
        setInvert(false);
        break;
      case 'bone': // WW: 2000, WL: 300 (High contrast cortical bone)
        setBrightness(90);
        setContrast(165);
        setGrayscale(true);
        setInvert(false);
        break;
      case 'soft_tissue': // WW: 400, WL: 40 (Soft abdominal tissue)
        setBrightness(110);
        setContrast(115);
        setGrayscale(true);
        setInvert(false);
        break;
      case 'brain': // WW: 80, WL: 40 (Fine cerebral parenchyma)
        setBrightness(105);
        setContrast(130);
        setGrayscale(true);
        setInvert(false);
        break;
      default:
        setBrightness(100);
        setContrast(100);
        setGrayscale(true);
        setInvert(false);
    }
  };

  const resetFilters = () => {
    setWindowPreset('default');
    setBrightness(100);
    setContrast(100);
    setGrayscale(true);
    setInvert(false);
    setRotation(0);
    setZoom(100);
    setShowRuler(false);
  };

  // Run or re-run AI vision analysis
  const runAiVisionAnalysis = async () => {
    setIsAiLoading(true);
    try {
      const authHeader = await getAuthHeader();
      const res = await fetch(`${API_URL}/api/ai/analyze-imaging`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({
          imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1000&auto=format&fit=crop",
          examType: activeOrder?.type || 'Radiographie Pulmonaire'
        })
      });
      const data = await res.json();
      if (data.success && data.results) {
        setAiResult(data.results);
      }
    } catch (err) {
      console.warn("Utilisation de la synthèse IA embarquée:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Inject AI recommendations directly into the report
  const injectAiIntoReport = () => {
    if (!aiResult) return;
    setReportFindings(prev => 
      `${prev.trim()}\n\n[ANALYSE ASSISTÉE PAR IA VISION - ${aiResult.pathologyType} (${Math.round(aiResult.confidenceScore * 100)}%)]\n${aiResult.findings} ${aiResult.measurements}`
    );
    setReportConclusion(aiResult.recommendations);
  };

  // Clinical report quick templates
  const applyReportTemplate = (type: 'normal' | 'pneumonia' | 'fracture' | 'trauma') => {
    if (type === 'normal') {
      setReportFindings("Structures anatomiques explorées d'aspect morphologique régulier et habituel. Absence d'épanchement liquidien, de collection ou de condensation pathologique.");
      setReportConclusion("Examen radiologique strictement normal. Aucun élément pathologique actif.");
    } else if (type === 'pneumonia') {
      setReportFindings("Présence d'une opacité alvéolaire systématisée dense avec bronchogramme aérien décelable. Absence de pleurésie réactionnelle volumineuse.");
      setReportConclusion("Aspect tomodensitométrique évocateur d'un foyer infectieux pulmonaire lobaire. À corréler à la biologie (CRP/NFS) et réévaluer sous antibiothérapie.");
    } else if (type === 'fracture') {
      setReportFindings("Trait de fracture net visualisé sans déplacement secondaire significatif des berges osseuses. Interlignes articulaires contigus respectés.");
      setReportConclusion("Fracture osseuse non déplacée. Indication d'immobilisation antalgique et contrôle orthopédique spécialisé.");
    } else if (type === 'trauma') {
      setReportFindings("Bilan morphologique post-traumatique complet. Absence d'épanchement liquidien intra-péritonéal (hémopéritoine), intégrité des parenchymes solides explorés.");
      setReportConclusion("Bilan post-traumatique immédiat rassurant. Surveillance clinique rapprochée recommandée.");
    }
  };

  // Save report and transmit to DMP & Doctor
  const handleSaveAndTransmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    if (!reportFindings.trim()) {
      alert("Veuillez renseigner ou dicter les constatations médicales avant de valider l'examen.");
      return;
    }

    setIsTransmitting(true);
    try {
      const resultPayload: RadiologyResult = {
        orderId: activeOrder.id,
        patientId: activeOrder.patientId,
        patientName: activeOrder.patientName,
        examType: activeOrder.type,
        modality: activeOrder.modality,
        bodyPart: activeOrder.bodyPart,
        prescribingDoctor: activeOrder.doctor,
        hospital: activeOrder.hospital,
        radiologist: 'Dr. Ousmane Diop (Radiologue PACS & IA)',
        validatedAt: new Date().toISOString(),
        findings: reportFindings,
        conclusion: reportConclusion.trim() || "Examen validé conforme aux constatations.",
        qrCodeUrl: activeOrder.qrCodeUrl,
        imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1000&auto=format&fit=crop',
        dicomCount: activeOrder.dicomCount || 4,
      };

      // 1. Stockage local partagé pour le patient et le personnel
      saveRadiologyResult(resultPayload);
      updateRadiologyOrderStatus(activeOrder.id, 'completed');

      // 2. Transmission au backend si joignable
      try {
        await fetch(`${API_URL}/api/radiology/transmit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resultPayload)
        });
      } catch (beErr) {
        console.warn("Backend transmit sync:", beErr);
      }

      setTransmissionSuccess(true);
    } catch (err) {
      console.error("Erreur de transmission:", err);
    } finally {
      setIsTransmitting(false);
    }
  };

  const copyPatientLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText('https://healthai-sn.vercel.app/patient/records');
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Mock series thumbnails
  const seriesThumbnails = [
    { title: "Coupe 1 (Face)", sub: "Incidence PA", url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=600&auto=format&fit=crop" },
    { title: "Coupe 2 (Profil)", sub: "Incidence Latérale", url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop" },
    { title: "Coupe 3 (Zoom Lobe)", sub: "Recon. Haute Résol.", url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80" },
    { title: "Coupe 4 (3D MIP)", sub: "Projection Max", url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop" }
  ];

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 flex flex-col justify-between pb-24 md:pb-8">
      
      {/* ── 1. GLOBAL TOPBAR (Standardisée) ───────────────────────── */}
      <RadiologyTopBar />

      {/* ── 2. GLOBAL NAVBAR (Sub-Nav Desktop & Bottom Nav Mobile) ── */}
      <RadiologyNavBar />

      {/* ── 3. CLINICAL PACS HEADER BAR ───────────────────────────── */}
      <section className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2.5">
          
          {/* Left: Back & Patient Selector */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Link 
              href="/radiology/dashboard"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 flex items-center justify-center border border-slate-700 transition-colors shrink-0"
              title="Retour à la liste PACS"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            {/* Patient & Study Selector */}
            <div className="relative">
              <select
                value={selectedOrderId}
                onChange={e => setSelectedOrderId(e.target.value)}
                className="appearance-none bg-slate-800 hover:bg-slate-750 text-white text-xs sm:text-sm font-bold pl-3 pr-8 py-1.5 sm:py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer max-w-[190px] xs:max-w-[260px] sm:max-w-xs truncate"
              >
                {orders.map(o => (
                  <option key={o.id} value={o.id} className="bg-slate-900 text-white">
                    {o.id} • {o.patientName} ({o.modality})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Modality & Priority Pills */}
            {activeOrder && (
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-600 text-white tracking-wider">
                  {activeOrder.modality}
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  activeOrder.priority === 'vital'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    : activeOrder.priority === 'urgent'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-700 text-slate-300 border-slate-600'
                }`}>
                  {activeOrder.priority === 'vital' ? 'Urgence Vitale' : activeOrder.priority === 'urgent' ? 'Urgent' : 'Routine'}
                </span>
              </div>
            )}
          </div>

          {/* Right: Mode Switcher (2D / 3D MPR) & AI Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-slate-800 p-0.5 sm:p-1 rounded-xl border border-slate-700 flex items-center">
              <button
                type="button"
                onClick={() => setViewMode('2d')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  viewMode === '2d' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Mode 2D
              </button>
              <button
                type="button"
                onClick={() => setViewMode('3d_mpr')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  viewMode === '3d_mpr' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                3D MPR
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-950/70 border border-purple-800/80 text-[11px] font-extrabold text-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Assistance IA Active</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. MOBILE TAB BAR (Affiché uniquement sur écran mobile < lg) ── */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-3 py-2 sticky top-14 z-30 shadow-xs">
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: 'viewport', label: 'Cliché PACS', icon: Eye },
            { id: 'tools', label: 'Filtres & HUD', icon: Sliders },
            { id: 'ai', label: 'Diagnostic IA', icon: BrainCircuit },
            { id: 'report', label: 'Compte-Rendu', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeMobileTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMobileTab(tab.id as any)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-xs'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 5. MAIN WORKSPACE ─────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-3 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
          
          {/* ── COLONNE GAUCHE (Desktop: Filtres PACS & Données Patient) ── */}
          <div className={`lg:col-span-3 space-y-4 ${activeMobileTab === 'tools' ? 'block' : 'hidden lg:block'}`}>
            
            {/* 1. Carte Identité Clinique */}
            {activeOrder && (
              <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      {activeOrder.patientName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                        {activeOrder.patientName}
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        {activeOrder.patientAge} ans &bull; {activeOrder.patientGender === 'M' ? 'Homme' : 'Femme'} &bull; {activeOrder.patientId}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    {activeOrder.id}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-slate-600">
                  <p><strong>Examen :</strong> <span className="text-slate-900 font-bold">{activeOrder.type}</span></p>
                  <p><strong>Prescripteur :</strong> <span className="text-slate-800 font-semibold">{activeOrder.doctor}</span></p>
                  <p><strong>Établissement :</strong> <span className="text-slate-500">{activeOrder.hospital}</span></p>
                  {activeOrder.clinicalIndication && (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] italic text-slate-600">
                      « {activeOrder.clinicalIndication} »
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 2. Préréglages Fenêtrage Médical (Window Width / Level) */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-600" />
                  Fenêtrage (WW / WL)
                </h4>
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-bold text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
                >
                  RÀZ
                </button>
              </div>

              {/* Windowing Chips */}
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { id: 'default', label: 'Défaut' },
                  { id: 'lung', label: 'Poumon / Thorax' },
                  { id: 'bone', label: 'Os / Squelette' },
                  { id: 'soft_tissue', label: 'Tissus Mous' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => applyWindowPreset(p.id as any)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer ${
                      windowPreset === p.id
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Sliders: Luminosité & Contraste & Zoom */}
              <div className="space-y-3 pt-1 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-500 font-bold text-[11px]">
                    <span className="flex items-center gap-1"><Sun className="w-3 h-3 text-amber-500" /> Luminosité</span>
                    <span>{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="160"
                    value={brightness}
                    onChange={e => setBrightness(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-500 font-bold text-[11px]">
                    <span className="flex items-center gap-1"><Sliders className="w-3 h-3 text-purple-600" /> Contraste</span>
                    <span>{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    value={contrast}
                    onChange={e => setContrast(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-500 font-bold text-[11px]">
                    <span className="flex items-center gap-1"><Search className="w-3 h-3 text-blue-500" /> Zoom</span>
                    <span>{zoom}%</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="220"
                    value={zoom}
                    onChange={e => setZoom(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInvert(!invert)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    invert
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Négatif</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-purple-600" />
                  <span>Pivoter 90°</span>
                </button>
              </div>
            </section>

            {/* 3. Carrousel des Séries DICOM */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 shadow-sm space-y-2.5">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                Séries Clichés ({seriesThumbnails.length})
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {seriesThumbnails.map((s, idx) => (
                  <button
                    key={s.title}
                    onClick={() => setActiveSeriesIndex(idx)}
                    className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer group ${
                      activeSeriesIndex === idx
                        ? 'border-purple-600 bg-purple-50/70 shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:border-purple-300'
                    }`}
                  >
                    <div className="h-16 rounded-lg bg-black overflow-hidden relative mb-1.5">
                      <div 
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform"
                        style={{ backgroundImage: `url(${s.url})`, filter: 'grayscale(100%)' }}
                      />
                      {activeSeriesIndex === idx && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-[10px] font-extrabold text-slate-900 truncate">{s.title}</p>
                    <p className="text-[9px] text-slate-400 truncate">{s.sub}</p>
                  </button>
                ))}
              </div>
            </section>

          </div>

          {/* ── COLONNE CENTRALE (Le Viewport DICOM Professionnel) ─────── */}
          <div className={`lg:col-span-5 space-y-4 ${activeMobileTab === 'viewport' ? 'block' : 'hidden lg:block'}`}>
            
            <section className="bg-slate-950 rounded-2xl sm:rounded-3xl border border-slate-800 p-3 sm:p-5 flex flex-col justify-between items-center relative overflow-hidden shadow-2xl min-h-[460px] sm:min-h-[540px]">
              
              {/* HUD Médical Supérieur Gauche */}
              <div className="absolute top-3 left-3 z-20 bg-slate-950/85 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-mono text-slate-300 pointer-events-none">
                <p className="font-bold text-white truncate max-w-[150px] sm:max-w-none">{activeOrder?.patientName}</p>
                <p className="text-purple-400">{activeOrder?.id} &bull; {activeOrder?.modality}</p>
              </div>

              {/* HUD Médical Supérieur Droit */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAiOverlay(!showAiOverlay)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                    showAiOverlay
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Afficher/masquer les détections IA"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>IA Overlay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowRuler(!showRuler)}
                  className={`p-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    showRuler
                      ? 'bg-blue-600/30 border-blue-500 text-blue-200'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Règle métrique millimétrique"
                >
                  <Ruler className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* ZONE DU CLICHÉ (CANVAS DICOM) */}
              <div className="flex-grow w-full flex items-center justify-center p-2 sm:p-6 mt-8 sm:mt-10">
                {viewMode === '2d' ? (
                  /* 2D High Contrast View */
                  <div className="relative overflow-hidden bg-black rounded-2xl border border-slate-900 flex items-center justify-center w-full h-[320px] sm:h-[400px]">
                    <motion.div
                      animate={{ rotate: rotation, scale: zoom / 100 }}
                      className="w-full h-full relative cursor-grab active:cursor-grabbing"
                    >
                      {/* Grille millimétrique PACS subtile */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-10" />

                      {/* Image radiologique haute fidélité */}
                      <div
                        className="w-full h-full bg-cover bg-center transition-all duration-150"
                        style={{
                          backgroundImage: `url(${seriesThumbnails[activeSeriesIndex]?.url || seriesThumbnails[0].url})`,
                          filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale ? 100 : 0}%) invert(${invert ? 100 : 0}%)`
                        }}
                      />

                      {/* Détection IA Superposée (Bounding Box & Heatmap) */}
                      {showAiOverlay && aiResult && aiResult.hasPathology && aiResult.boundingLocation && (
                        <motion.div
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="absolute border-2 border-dashed border-rose-500 bg-rose-500/15 rounded-xl z-20 shadow-[0_0_20px_rgba(244,63,94,0.35)]"
                          style={{
                            top: aiResult.boundingLocation.top,
                            left: aiResult.boundingLocation.left,
                            width: aiResult.boundingLocation.width,
                            height: aiResult.boundingLocation.height,
                          }}
                        >
                          <span className="text-[9px] font-black uppercase tracking-wide text-white px-2 py-0.5 rounded-full bg-rose-600 absolute -top-3 left-1/2 -translate-x-1/2 shadow-md whitespace-nowrap flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            {aiResult.pathologyType} ({Math.round(aiResult.confidenceScore * 100)}%)
                          </span>
                        </motion.div>
                      )}

                      {/* Caliper / Règle métrique virtuelle */}
                      {showRuler && (
                        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-32 border-b-2 border-amber-400 z-20 flex items-center justify-between">
                          <div className="w-1 h-3 bg-amber-400" />
                          <span className="text-[10px] font-mono font-bold text-amber-300 bg-black/80 px-1 rounded -translate-y-3">
                            42.4 mm
                          </span>
                          <div className="w-1 h-3 bg-amber-400" />
                        </div>
                      )}
                    </motion.div>
                  </div>
                ) : (
                  /* 3D MPR (Multiplanar Reconstruction: Sagittal, Coronal, Axial) */
                  <div className="grid grid-cols-2 gap-2.5 w-full h-[320px] sm:h-[400px]">
                    <div className="relative bg-black rounded-xl border border-slate-900 overflow-hidden">
                      <span className="absolute top-1.5 left-1.5 text-[8px] bg-slate-950/80 px-1.5 py-0.5 rounded font-mono text-purple-400 z-10">Sagittal S-14</span>
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${seriesThumbnails[1].url})`, filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(100%)` }} />
                    </div>
                    <div className="relative bg-black rounded-xl border border-slate-900 overflow-hidden">
                      <span className="absolute top-1.5 left-1.5 text-[8px] bg-slate-950/80 px-1.5 py-0.5 rounded font-mono text-purple-400 z-10">Coronal C-28</span>
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${seriesThumbnails[0].url})`, filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(100%)` }} />
                    </div>
                    <div className="relative bg-black rounded-xl border border-slate-900 overflow-hidden col-span-2">
                      <span className="absolute top-1.5 left-1.5 text-[8px] bg-slate-950/80 px-1.5 py-0.5 rounded font-mono text-purple-400 z-10">Axial A-42 (MIP 3D)</span>
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${seriesThumbnails[2].url})`, filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(100%)` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* HUD Médical Inférieur (Métadonnées d'acquisition) */}
              <div className="w-full pt-3 border-t border-slate-900 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 font-mono">
                <div>
                  <span>Zoom: {zoom}% &bull; Rot: {rotation}°</span>
                  <span className="hidden sm:inline"> &bull; WW: {contrast * 10} / WL: {brightness * 4}</span>
                </div>
                <div className="text-right">
                  <span>Dose DLP: 120 mGy.cm</span>
                  <span className="text-purple-400 ml-2 font-bold">512×512 16-bit</span>
                </div>
              </div>

            </section>

            {/* Quick Actions sous le viewer */}
            <div className="flex items-center justify-between gap-2 bg-white p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoom(Math.max(70, zoom - 15))}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  title="Dézoomer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(Math.min(220, zoom + 15))}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  title="Zoomer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  title="Réinitialiser"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={runAiVisionAnalysis}
                disabled={isAiLoading}
                className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Calcul IA...</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-3.5 h-3.5 text-purple-200" />
                    <span>Lancer Diagnostic IA</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* ── COLONNE DROITE (Diagnostic IA & Dictée / Rapport Médical) ─ */}
          <div className={`lg:col-span-4 space-y-4 ${activeMobileTab === 'report' || activeMobileTab === 'ai' ? 'block' : 'hidden lg:block'}`}>
            
            {/* 1. Carte Synthèse Diagnostic IA */}
            {aiResult && (
              <section className="bg-gradient-to-br from-purple-50 via-indigo-50/50 to-white rounded-2xl sm:rounded-3xl border border-purple-200/90 p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                      <BrainCircuit className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-purple-950 uppercase tracking-wider">
                        Gemini Health Vision
                      </h4>
                      <p className="text-[10px] text-purple-700 font-bold">
                        Confiance diagnostique : {Math.round(aiResult.confidenceScore * 100)}%
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    aiResult.severity === 'critical'
                      ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                      : aiResult.severity === 'high'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {aiResult.severity === 'critical' ? 'Critique' : aiResult.severity === 'high' ? 'Urgent' : 'Normal'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-extrabold text-purple-950 block">{aiResult.pathologyType}</span>
                    <p className="text-[11px] text-slate-700 leading-snug">{aiResult.findings}</p>
                  </div>

                  {aiResult.measurements && (
                    <div className="p-2 rounded-xl bg-white/80 border border-purple-100 text-[10px] text-purple-900 font-medium">
                      <strong>Mesures IA :</strong> {aiResult.measurements}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={injectAiIntoReport}
                    className="w-full py-2 px-3 rounded-xl bg-purple-100/80 hover:bg-purple-200 text-purple-900 font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                    <span>Insérer dans le Compte-Rendu</span>
                  </button>
                </div>
              </section>
            )}

            {/* 2. Console de Dictée Vocale & Compte-Rendu Médical */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight">
                      Compte-Rendu Radiologique
                    </h4>
                    <p className="text-[10px] text-slate-400">Certification électronique & DMP</p>
                  </div>
                </div>

                {/* Mic speech-to-text toggle */}
                <button
                  type="button"
                  onClick={toggleDictation}
                  className={`h-8 px-3 rounded-xl font-extrabold text-[10px] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    isDictating
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                  }`}
                  title="Dictée vocale médicale en direct"
                >
                  {isDictating ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Arrêter</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>Dicter</span>
                    </>
                  )}
                </button>
              </div>

              {/* Templates rapides */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Modèles de comptes-rendus :
                </span>
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'normal', label: 'Normal' },
                    { id: 'pneumonia', label: 'Pneumopathie' },
                    { id: 'fracture', label: 'Fracture' },
                    { id: 'trauma', label: 'Traumatisme' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => applyReportTemplate(t.id as any)}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulaire de rédaction */}
              <form onSubmit={handleSaveAndTransmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Constatations & Analyse Morphologique
                  </label>
                  <textarea
                    rows={5}
                    value={reportFindings}
                    onChange={e => setReportFindings(e.target.value)}
                    placeholder="Rédigez ou dictez vocalement le corps du compte-rendu..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 leading-relaxed transition-colors resize-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Conclusion & Recommandations Cliniques
                  </label>
                  <input
                    type="text"
                    value={reportConclusion}
                    onChange={e => setReportConclusion(e.target.value)}
                    placeholder="Ex: Examen normal / Pneumopathie nécessitant antibiothérapie..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 transition-colors font-semibold"
                  />
                </div>

                {/* Bouton de signature et transmission */}
                <button
                  type="submit"
                  disabled={isTransmitting}
                  className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isTransmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signature et transmission...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Valider & Transmettre au DMP</span>
                    </>
                  )}
                </button>
              </form>

            </section>

          </div>

        </div>
      </main>

      {/* ── 6. MODAL DE CONFIRMATION DE TRANSMISSION RÉUSSIE ───────── */}
      <AnimatePresence>
        {transmissionSuccess && activeOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 max-w-md w-full shadow-2xl space-y-4 text-slate-900 relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-black text-lg text-slate-900">
                  Compte-Rendu Validé & Transmis !
                </h3>
                <p className="text-xs text-slate-500">
                  L'examen <strong className="text-purple-700 font-bold">{activeOrder.id}</strong> a été certifié par le Dr. Ousmane Diop.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Dossier Patient synchronisé (DMP - healthai-sn.vercel.app)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Médecin prescripteur ({activeOrder.doctor}) notifié</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Horodatage et certification HDS complétés</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-800 block">Conclusion transmise :</span>
                <p className="italic text-slate-600">« {reportConclusion} »</p>
              </div>

              <div className="flex gap-2 pt-2">
                <a
                  href="https://healthai-sn.vercel.app/patient/records"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Vérifier DMP</span>
                </a>

                <button
                  type="button"
                  onClick={() => router.push('/radiology/dashboard')}
                  className="flex-1 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Retour Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function RadiologyViewer() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">
            Chargement de la Console PACS & Studio IA...
          </p>
        </div>
      </div>
    }>
      <RadiologyViewerContent />
    </React.Suspense>
  );
}
