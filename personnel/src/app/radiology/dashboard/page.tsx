'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ImageIcon, 
  Upload, 
  Clock, 
  Activity, 
  AlertTriangle, 
  ChevronRight, 
  Search, 
  CheckCircle, 
  Layers, 
  Database,
  ShieldCheck,
  QrCode,
  ScanLine,
  X,
  Sparkles,
  Radio,
  RefreshCw,
  Check,
  Calendar,
  User,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import RadiologyTopBar from '@/components/radiology/RadiologyTopBar';
import RadiologyNavBar from '@/components/radiology/RadiologyNavBar';
import { useAuthStore } from '@/lib/authStore';
import { 
  RadiologyOrder, 
  getRadiologyOrders, 
  updateRadiologyOrderStatus, 
  findOrderByQrString 
} from '@/lib/radiologyStore';
import { 
  saveRadiologyResult, 
  RadiologyResult, 
  getResultForOrder 
} from '@/lib/radiologyResultStore';

export default function RadiologyDashboard() {
  const [orders, setOrders] = useState<RadiologyOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const { user, initialize } = useAuthStore();
  const [showProtocols, setShowProtocols] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const currentDateStr = new Intl.DateTimeFormat('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());

  const radiologistDisplayName = user?.name 
    ? (user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`) 
    : 'Dr. Ousmane Diop';

  // Scanner Modal States
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [scanStep, setScanStep] = useState<'scanning' | 'manual' | 'detected'>('scanning');
  const [manualCodeInput, setManualCodeInput] = useState('');
  const [isLaserScanning, setIsLaserScanning] = useState(true);
  const [scannedOrder, setScannedOrder] = useState<RadiologyOrder | null>(null);

  // View QR Modal for any order
  const [viewingQrOrder, setViewingQrOrder] = useState<RadiologyOrder | null>(null);

  // Validation & Transmission States
  const [validationMode, setValidationMode] = useState(false);
  const [findingsInput, setFindingsInput] = useState('');
  const [conclusionInput, setConclusionInput] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionSuccess, setTransmissionSuccess] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string>('normal');

  const loadOrders = () => {
    const list = getRadiologyOrders();
    setOrders(list);
  };

  useEffect(() => {
    loadOrders();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sunu_sante_radiology_orders') loadOrders();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModality = selectedModality === 'ALL' || o.modality === selectedModality;
    const matchesStatus = selectedStatus === 'ALL' || o.status === selectedStatus;
    return matchesSearch && matchesModality && matchesStatus;
  });

  const totalPending = orders.filter(s => s.status === 'pending').length;
  const totalUrgent = orders.filter(s => (s.priority === 'vital' || s.priority === 'urgent') && s.status !== 'completed').length;
  const totalCompleted = orders.filter(s => s.status === 'completed').length;
  const totalInProgress = orders.filter(s => s.status === 'in_progress').length;

  const getPriorityBadge = (priority: 'routine' | 'urgent' | 'vital') => {
    switch (priority) {
      case 'vital': return { text: "Urg. Vitale", class: "bg-rose-100 text-rose-800 border-rose-300 animate-pulse font-black" };
      case 'urgent': return { text: "Urgent", class: "bg-amber-100 text-amber-800 border-amber-300 font-bold" };
      default: return { text: "Routine", class: "bg-slate-100 text-slate-700 border-slate-200 font-medium" };
    }
  };

  const getStatusBadge = (status: RadiologyOrder['status']) => {
    switch (status) {
      case 'pending': return { text: "En Attente", class: "bg-purple-50 text-purple-700 border-purple-200" };
      case 'in_progress': return { text: "En Cours", class: "bg-blue-50 text-blue-700 border-blue-200" };
      case 'completed': return { text: "Indexé & Signé", class: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    }
  };

  const handleOpenScanner = () => {
    setScanStep('scanning');
    setScannedOrder(null);
    setIsLaserScanning(true);
    setManualCodeInput('');
    setScanModalOpen(true);
  };

  const processFoundOrder = (order: RadiologyOrder) => {
    setScannedOrder(order);
    setScanStep('detected');
    setIsLaserScanning(false);
    setValidationMode(false);
    setTransmissionSuccess(false);

    // Préremplissage intelligent selon modalité/motif
    const existing = getResultForOrder(order.id);
    if (existing) {
      setFindingsInput(existing.findings);
      setConclusionInput(existing.conclusion);
      setTransmissionSuccess(true);
    } else {
      setFindingsInput(
        order.modality === 'RX'
          ? "Transparence parenchymateuse pulmonaire normale. Absence de foyer de condensation ou d'épanchement pleural. Silhouette cardiovasculaire dans les limites habituelles."
          : order.modality === 'TDM'
          ? "Intégrité des structures thoraciques et abdominales visualisées. Absence d'épanchement liquidien péritonéal ou d'anomalie post-traumatique patente."
          : "Examen morphologique ciblé réalisé conformément à la demande clinique. Structures analysées d'aspect physiologique."
      );
      setConclusionInput(
        order.priority === 'vital' || order.priority === 'urgent'
          ? "Pas de lésion aiguë vitale décelable sur ce contrôle. Examen rassurant à confronter à l'évolution clinique."
          : "Examen dans les limites de la normale. Pas d'anomalie évolutive."
      );
    }
  };

  const handleApplyTemplate = (type: 'normal' | 'infection' | 'fracture') => {
    setActiveTemplate(type);
    if (type === 'normal') {
      setFindingsInput("Structures anatomiques examinées d'aspect habituel. Absence d'épanchement, de collection ou d'anomalie morphologique patente.");
      setConclusionInput("Examen radiologique strictement normal. Aucun élément pathologique actif.");
    } else if (type === 'infection') {
      setFindingsInput("Foyer d'opacité alvéolaire systématisé avec présence d'un bronchogramme aérien discret. Absence de pleurésie réactionnelle.");
      setConclusionInput("Aspect évocateur d'un foyer infectieux pulmonaire débutant. À corréler à la biologie (CRP/NFS) et réévaluer sous antibiothérapie.");
    } else if (type === 'fracture') {
      setFindingsInput("Trait de refend osseux visible sans déplacement significatif des berges. Interligne articulaire conservé. Pas d'arrachement cortico-périosté.");
      setConclusionInput("Fracture osseuse non déplacée. Indication d'immobilisation antalgique et contrôle orthopédique spécialisé.");
    }
  };

  const handleTransmitResult = async () => {
    if (!scannedOrder) return;
    setIsTransmitting(true);
    try {
      const finalFindings = findingsInput.trim() || "Examen réalisé conformément aux protocoles du centre. Bilan morphologique normal.";
      const finalConclusion = conclusionInput.trim() || "Examen normal et rassurant.";

      const resultPayload: RadiologyResult = {
        orderId: scannedOrder.id,
        patientId: scannedOrder.patientId,
        patientName: scannedOrder.patientName,
        examType: scannedOrder.type,
        modality: scannedOrder.modality,
        bodyPart: scannedOrder.bodyPart,
        prescribingDoctor: scannedOrder.doctor,
        hospital: scannedOrder.hospital,
        radiologist: 'Dr. Ousmane Diop (Radiologue Référent)',
        validatedAt: new Date().toISOString(),
        findings: finalFindings,
        conclusion: finalConclusion,
        qrCodeUrl: scannedOrder.qrCodeUrl,
        imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
        dicomCount: scannedOrder.dicomCount || 4,
      };

      saveRadiologyResult(resultPayload);
      handleUpdateStatus(scannedOrder.id, 'completed');
      setTransmissionSuccess(true);
    } catch (e) {
      console.error('Erreur transmission résultat:', e);
    } finally {
      setIsTransmitting(false);
    }
  };

  const handleManualSearch = (code: string) => {
    const found = findOrderByQrString(code);
    if (found) {
      processFoundOrder(found);
    } else {
      alert("Aucune demande de radiologie ne correspond à cet identifiant ou QR Code.");
    }
  };

  const handleUpdateStatus = (orderId: string, newStatus: RadiologyOrder['status']) => {
    const updated = updateRadiologyOrderStatus(orderId, newStatus);
    setOrders(updated);
    if (scannedOrder && scannedOrder.id === orderId) {
      setScannedOrder({ ...scannedOrder, status: newStatus });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col justify-between pb-24 md:pb-8">
      
      {/* ── TOPBAR PROS (Harmonisé Médecin) ────────────────────────── */}
      <RadiologyTopBar onSearch={setSearchQuery} onOpenScanner={handleOpenScanner} />

      {/* ── NAVBAR PROS (Harmonisé Médecin avec Bottom Nav Mobile) ──── */}
      <RadiologyNavBar pendingCount={totalPending} onOpenScanner={handleOpenScanner} />

      {/* ── MAIN CONTENT CONTAINER ─────────────────────────────────── */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 space-y-4 sm:space-y-6">
        
        {/* ── 1. Hero Service & Action Header (Harmonisé Médecin) ───── */}
        <section className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
            
            {/* Radiologue Greeting & Service */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 font-medium">
                <span className="capitalize flex items-center gap-1 font-semibold text-slate-700">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600" />
                  {currentDateStr}
                </span>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1 text-purple-800 bg-purple-50 px-2 sm:px-2.5 py-0.5 rounded-full font-bold border border-purple-200 text-[10px] sm:text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                  Garde Active &bull; Console PACS & Scanner
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                {radiologistDisplayName}
              </h2>
              
              <p className="text-[11px] sm:text-sm text-slate-500 leading-snug">
                Vous avez <strong className="text-slate-900 font-bold">{orders.length} examen(s)</strong> dans votre liste de travail PACS, dont{' '}
                <strong className="text-rose-600 font-extrabold">{totalUrgent} urgence(s) vitale(s)</strong> à examiner en priorité.
              </p>
            </div>

            {/* Quick Primary Actions */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 pt-1 lg:pt-0 w-full sm:w-auto">
              <button
                onClick={handleOpenScanner}
                className="col-span-2 sm:col-span-1 h-9 sm:h-11 px-4 sm:px-5 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                title="Scanner le QR code d'un bon d'examen"
              >
                <QrCode className="w-4 h-4" />
                <span>Scanner QR Code</span>
              </button>

              <Link
                href="/radiology/viewer"
                className="h-9 sm:h-11 px-3 sm:px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                <span>Viewer PACS</span>
              </Link>

              <Link
                href="/radiology/upload"
                className="h-9 sm:h-11 px-3 sm:px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                title="Importer des clichés DICOM externes"
              >
                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                <span>Importer DICOM</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 2. KPI Grid (Harmonisé Médecin) ───────────────────────── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {[
            { label: "En Attente", value: totalPending, sub: "À préparer", icon: <Clock className="h-4 w-4 sm:h-5 sm:w-5" />, iconBg: "bg-purple-50 text-purple-600 border-purple-100", valColor: "text-purple-950", ping: false },
            { label: "Urgences Vitales", value: totalUrgent, sub: "Priorité P4/P3", icon: <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />, iconBg: "bg-rose-50 text-rose-600 border-rose-100", valColor: "text-rose-600", ping: totalUrgent > 0 },
            { label: "En Cours", value: totalInProgress, sub: "En acquisition", icon: <Activity className="h-4 w-4 sm:h-5 sm:w-5" />, iconBg: "bg-blue-50 text-blue-600 border-blue-100", valColor: "text-blue-600", ping: false },
            { label: "Validés DMP", value: totalCompleted, sub: "Transmis au patient", icon: <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />, iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100", valColor: "text-emerald-600", ping: false },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white border border-slate-200/90 p-2.5 sm:p-4 lg:p-5 rounded-2xl shadow-sm flex items-center justify-between gap-1.5 sm:gap-2">
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">{kpi.label}</p>
                <p className={`text-xl sm:text-2xl lg:text-3xl font-black mt-0.5 flex items-center gap-1 ${kpi.valColor}`}>
                  {kpi.value}
                  {kpi.ping && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping hidden sm:block" />}
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 hidden sm:block truncate">{kpi.sub}</p>
              </div>
              <div className={`h-8 w-8 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl border flex items-center justify-center shadow-xs shrink-0 ${kpi.iconBg}`}>
                {kpi.icon}
              </div>
            </div>
          ))}
        </section>

        {/* ── 3. Main Content: Worklist + Sidebar ───────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          
          {/* Worklist (Always first on mobile and desktop) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
              
              {/* Header */}
              <div className="p-3 sm:p-4 lg:p-5 border-b border-slate-100 flex items-center justify-between gap-2 sm:gap-3 bg-slate-50/50">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold shrink-0">
                    <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-xs sm:text-base text-slate-900 tracking-tight truncate">
                      Liste de Travail PACS
                    </h3>
                    <p className="text-[9px] sm:text-[11px] text-slate-500 truncate">
                      {filteredOrders.length} examen{filteredOrders.length > 1 ? 's' : ''} affiché{filteredOrders.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    onClick={loadOrders}
                    className="p-1.5 sm:p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Actualiser"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold hidden sm:inline">Actualiser</span>
                  </button>
                  <span className="text-[9px] sm:text-[10px] text-purple-800 font-bold bg-purple-50 border border-purple-200 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Sync DMP
                  </span>
                </div>
              </div>

              {/* Filters */}
              <div className="p-2.5 sm:p-4 border-b border-slate-100 bg-white space-y-2 sm:space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher patient, type, réf..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 transition-colors"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                    {['ALL', 'RX', 'TDM', 'IRM', 'ECO'].map(mod => (
                      <button
                        key={mod}
                        onClick={() => setSelectedModality(mod)}
                        className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          selectedModality === mod ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {mod === 'ALL' ? 'Toutes' : mod}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                    {[
                      { id: 'ALL', label: 'Tous' },
                      { id: 'pending', label: 'Attente' },
                      { id: 'in_progress', label: 'En cours' },
                      { id: 'completed', label: 'Indexés' },
                    ].map(st => (
                      <button
                        key={st.id}
                        onClick={() => setSelectedStatus(st.id)}
                        className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
                          selectedStatus === st.id ? 'bg-purple-100 text-purple-900 border border-purple-200' : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile/Tablet Cards (hidden on lg+) */}
              <div className="lg:hidden divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Aucun examen ne correspond à votre recherche.
                  </div>
                ) : (
                  filteredOrders.map(order => {
                    const priority = getPriorityBadge(order.priority);
                    const status = getStatusBadge(order.status);
                    return (
                      <div key={order.id} className="p-3 sm:p-4 space-y-2.5 hover:bg-slate-50/70 transition-colors">
                        
                        {/* Header: Initial avatar, Patient Identity, Badges */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                              {order.patientName.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                                  {order.patientName}
                                </h4>
                                <span className="text-[10px] text-slate-400 font-medium">({order.patientAge} ans • {order.patientGender})</span>
                              </div>
                              <span className="font-mono font-bold text-[9px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 mt-0.5 inline-block">
                                {order.id}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] border font-bold ${priority.class}`}>{priority.text}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${status.class}`}>{status.text}</span>
                          </div>
                        </div>

                        {/* Exam Details */}
                        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-extrabold text-purple-950">{order.type}</p>
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                              {order.modality}
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-[11px] text-slate-500">
                            Prescrit par <strong className="text-slate-700">{order.doctor}</strong> • {order.date}
                          </p>
                          {order.clinicalIndication && (
                            <p className="text-[10px] sm:text-[11px] text-slate-600 italic pt-1 border-t border-slate-200/60 leading-snug">
                              « {order.clinicalIndication} »
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              processFoundOrder(order);
                              setScanModalOpen(true);
                            }}
                            className="h-8 sm:h-9 px-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Traiter / Valider</span>
                          </button>

                          <Link
                            href={`/radiology/viewer?id=${order.id}&patient=${encodeURIComponent(order.patientName)}&type=${encodeURIComponent(order.type)}&doctor=${encodeURIComponent(order.doctor)}`}
                            className="h-8 sm:h-9 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                          >
                            <span>Viewer PACS</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Desktop Table (lg+) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse min-w-[640px]">
                  <thead>
                    <tr className="text-slate-500 text-xs uppercase font-semibold border-b border-slate-100 bg-slate-50/70">
                      <th className="py-3 px-4">Réf. Examen</th>
                      <th className="py-3 px-4">Patient</th>
                      <th className="py-3 px-4">Type de Radio</th>
                      <th className="py-3 px-4">Priorité</th>
                      <th className="py-3 px-4">Prescripteur</th>
                      <th className="py-3 px-4 text-center">QR Code</th>
                      <th className="py-3 px-4 text-right">Action PACS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence initial={false}>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">Aucun examen trouvé.</td>
                        </tr>
                      ) : (
                        filteredOrders.map(order => {
                          const priority = getPriorityBadge(order.priority);
                          const status = getStatusBadge(order.status);
                          return (
                            <motion.tr
                              key={order.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="hover:bg-purple-50/30 transition-colors group"
                            >
                              <td className="py-3.5 px-4">
                                <span className="font-mono font-bold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">{order.id}</span>
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="font-bold text-slate-900 text-sm">{order.patientName}</p>
                                <p className="text-[10px] text-slate-400">{order.patientAge} ans • {order.patientGender}</p>
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="text-xs font-semibold text-slate-800">{order.type}</p>
                                <span className="inline-block text-[9px] font-black uppercase px-1.5 py-px rounded bg-slate-100 text-slate-600 mt-0.5">{order.modality}</span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border ${priority.class}`}>{priority.text}</span>
                              </td>
                              <td className="py-3.5 px-4 text-slate-600 text-xs">
                                <p className="font-medium">{order.doctor}</p>
                                <p className="text-[10px] text-slate-400">{order.date}</p>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <button
                                  onClick={() => setViewingQrOrder(order)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 transition-colors cursor-pointer"
                                  title="Afficher le QR Code"
                                >
                                  <QrCode className="w-4 h-4" />
                                </button>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <Link
                                  href={`/radiology/viewer?id=${order.id}&patient=${encodeURIComponent(order.patientName)}&type=${encodeURIComponent(order.type)}&doctor=${encodeURIComponent(order.doctor)}`}
                                  className="h-8 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-xs inline-flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                                >
                                  <span>Visionner</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                              </td>
                            </motion.tr>
                          );
                        })
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar (Desktop side panel, clean bottom panel on mobile) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Quick Scanner Card */}
            <section className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 text-purple-900 font-extrabold text-sm mb-2">
                <ScanLine className="w-4 h-4 text-purple-600 shrink-0" />
                <h4>Numérisation Rapide</h4>
              </div>
              <p className="text-xs text-purple-950/80 leading-relaxed mb-3">
                Scannez le bon d'imagerie remis au patient pour ouvrir la console d'acquisition.
              </p>
              <button
                onClick={handleOpenScanner}
                className="w-full h-11 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Ouvrir le Viseur de Scan</span>
              </button>
            </section>

            {/* Consoles d'acquisition */}
            <section className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  Consoles d'Acquisition
                </h4>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap">
                  En Ligne
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { name: "Table RX Capteur Plan", room: "Salle 1 (Bloc A)", status: "Prête" },
                  { name: "Scanner GE Optima 64c", room: "Salle 3 (TDM)", status: "Calibré" },
                  { name: "IRM Siemens Magnetom", room: "Salle 2 (IRM)", status: "En service" },
                  { name: "Échographe Philips EPIQ", room: "Salle 4", status: "Disponible" },
                ].map(dev => (
                  <div key={dev.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800 text-[11px] truncate">{dev.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{dev.room}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{dev.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Protocoles & Radioprotection (Clean Accordion Card) */}
            <section className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm">
              <button
                type="button"
                onClick={() => setShowProtocols(!showProtocols)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Protocoles & Radioprotection</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showProtocols ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Expandable or compact preview */}
              <div className={`mt-3 space-y-2 text-xs text-slate-600 leading-relaxed ${showProtocols ? 'block' : 'hidden sm:block'}`}>
                <p className="p-2 rounded-xl bg-purple-50/60 border border-purple-100 text-[11px] text-purple-950 font-medium">
                  <strong>Principe ALARA :</strong> Optimisation systématique de la dose délivrée selon le rapport bénéfice/risque.
                </p>
                <ul className="text-[11px] space-y-1 text-slate-600 list-disc pl-4">
                  <li>Vérification préalable de non-grossesse (clichés abdomino-pelviens).</li>
                  <li>Signature électronique qualifiée sur tout compte-rendu transmis.</li>
                </ul>
              </div>
            </section>

          </div>

        </section>
      </main>

      {/* ── Modal: QR Scanner ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {scanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 w-full sm:max-w-lg shadow-2xl space-y-5 text-slate-900 relative max-h-[92vh] overflow-y-auto"
            >
              {/* Drag handle mobile */}
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto sm:hidden" />

              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-md shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Scanner d'Examen</h3>
                    <p className="text-[11px] text-purple-700 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Reconnaissance optique & Décodage PACS
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setScanModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step: Scanning */}
              {scanStep === 'scanning' && (
                <div className="space-y-4">
                  <div className="relative w-full h-48 sm:h-56 bg-slate-950 rounded-2xl border-2 border-purple-500/80 flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-purple-400" />
                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-purple-400" />
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-purple-400" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-purple-400" />
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 shadow-[0_0_15px_#ec4899] animate-[bounce_2.5s_ease-in-out_infinite]" />
                    <QrCode className="w-16 h-16 sm:w-20 sm:h-20 text-purple-400/30 animate-pulse" />
                    <p className="text-xs text-purple-200 font-bold mt-3 text-center px-4">
                      Placez le QR Code face à la caméra
                    </p>
                    <p className="text-[10px] text-slate-400">Détection automatique en cours...</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      Ou testez un QR Code en 1 clic :
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {orders.slice(0, 4).map(o => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => processFoundOrder(o)}
                          className="p-2.5 bg-purple-50/70 hover:bg-purple-100/90 border border-purple-200 rounded-xl text-left transition-colors cursor-pointer"
                        >
                          <span className="font-mono text-[10px] font-bold text-purple-700 block">{o.id}</span>
                          <span className="text-xs font-bold text-slate-900 block truncate">{o.patientName}</span>
                          <span className="text-[10px] text-slate-500 truncate block">{o.type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setScanStep('manual')}
                      className="text-xs font-bold text-purple-700 hover:text-purple-800 hover:underline cursor-pointer"
                    >
                      Entrer manuellement la référence
                    </button>
                  </div>
                </div>
              )}

              {/* Step: Manual */}
              {scanStep === 'manual' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Référence ou texte du QR Code
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: RAD-2026-101..."
                      value={manualCodeInput}
                      onChange={e => setManualCodeInput(e.target.value)}
                      className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:border-purple-600 transition-colors"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setScanStep('scanning')}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Retour au Viseur
                    </button>
                    <button
                      type="button"
                      onClick={() => handleManualSearch(manualCodeInput)}
                      className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Valider & Charger
                    </button>
                  </div>
                </div>
              )}

              {/* Step: Detected */}
              {scanStep === 'detected' && scannedOrder && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  
                  {/* Status header */}
                  <div className={`p-3 border rounded-2xl flex items-center justify-between gap-2 ${
                    transmissionSuccess
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-purple-50 border-purple-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 shrink-0 ${transmissionSuccess ? 'text-emerald-600' : 'text-purple-600'}`} />
                      <div>
                        <p className={`text-xs font-extrabold ${transmissionSuccess ? 'text-emerald-900' : 'text-purple-900'}`}>
                          {transmissionSuccess ? '✅ Résultat Validé & Transmis avec Succès' : 'QR Code Identifié & Dossier Chargé'}
                        </p>
                        <p className={`text-[10px] ${transmissionSuccess ? 'text-emerald-700' : 'text-purple-700'}`}>
                          {transmissionSuccess 
                            ? 'Transmis au dossier patient (port 3000) et au médecin prescripteur' 
                            : 'Synchronisé avec la demande clinique'}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-black bg-white px-2 py-0.5 rounded-lg border border-purple-200 text-purple-900 shrink-0">
                      {scannedOrder.id}
                    </span>
                  </div>

                  {/* Confirmation banner if successfully transmitted */}
                  {transmissionSuccess ? (
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs space-y-3">
                      <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Transmission Instantanée Réussie</span>
                      </div>
                      
                      <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-emerald-900">
                          <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                          <span><strong>Dossier Patient :</strong> Disponible sur <a href="https://healthai-sn.vercel.app/patient/records" target="_blank" rel="noreferrer" className="underline font-bold text-teal-700">https://healthai-sn.vercel.app/patient/records</a></span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-emerald-900">
                          <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                          <span><strong>Médecin Prescripteur :</strong> {scannedOrder.doctor} notifié avec compte-rendu complet</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-emerald-900">
                          <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                          <span><strong>Statut Examen :</strong> Indexé & Signé (Terminé)</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 space-y-1">
                        <span className="font-bold text-slate-900 block">Synthèse transmise :</span>
                        <p className="italic font-medium">« {conclusionInput} »</p>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setScanModalOpen(false)}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors cursor-pointer"
                        >
                          Fermer & Terminer
                        </button>
                        <button
                          type="button"
                          onClick={() => setValidationMode(true)}
                          className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Modifier Compte-Rendu
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Patient & Exam details card */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-3">
                        <div className="flex justify-between items-start pb-2 border-b border-slate-200 gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Patient</span>
                            <h4 className="font-extrabold text-slate-900 text-sm">{scannedOrder.patientName}</h4>
                            <p className="text-[11px] text-slate-500">
                              {scannedOrder.patientAge} ans • {scannedOrder.patientGender} • {scannedOrder.patientId}
                            </p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                            scannedOrder.priority === 'vital' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                            scannedOrder.priority === 'urgent' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            'bg-slate-200 text-slate-800'
                          }`}>
                            {scannedOrder.priority.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-400 font-semibold block">Examen :</span>
                            <strong className="text-purple-900 text-xs">{scannedOrder.type}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold block">Modalité :</span>
                            <strong className="text-slate-800">{scannedOrder.modality} — {scannedOrder.bodyPart}</strong>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200 text-[11px]">
                          <span className="text-slate-400 font-semibold block">Prescripteur :</span>
                          <p className="text-slate-700 font-bold">
                            {scannedOrder.doctor} • <span className="font-normal text-slate-500">{scannedOrder.hospital}</span>
                          </p>
                        </div>

                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700 leading-relaxed italic">
                          <span className="font-bold text-slate-900 not-italic block mb-0.5">Motif clinique :</span>
                          "{scannedOrder.clinicalIndication}"
                        </div>
                      </div>

                      {/* Editorial Validation Form */}
                      {validationMode ? (
                        <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-purple-950 flex items-center gap-1.5 uppercase tracking-wider">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                              Régie Médicale • Validation & Transmission
                            </h4>
                            <span className="text-[10px] text-purple-700 font-semibold">Signé : Dr. Ousmane Diop</span>
                          </div>

                          {/* Quick template chips */}
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Modèles Rapides :</span>
                            <div className="flex flex-wrap gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleApplyTemplate('normal')}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  activeTemplate === 'normal'
                                    ? 'bg-purple-700 text-white'
                                    : 'bg-white border border-purple-200 text-purple-900 hover:bg-purple-100'
                                }`}
                              >
                                ✓ Normal / Physiologique
                              </button>
                              <button
                                type="button"
                                onClick={() => handleApplyTemplate('infection')}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  activeTemplate === 'infection'
                                    ? 'bg-purple-700 text-white'
                                    : 'bg-white border border-purple-200 text-purple-900 hover:bg-purple-100'
                                }`}
                              >
                                ⚠️ Foyer Infectieux
                              </button>
                              <button
                                type="button"
                                onClick={() => handleApplyTemplate('fracture')}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  activeTemplate === 'fracture'
                                    ? 'bg-purple-700 text-white'
                                    : 'bg-white border border-purple-200 text-purple-900 hover:bg-purple-100'
                                }`}
                              >
                                🦴 Fracture / Fissure
                              </button>
                            </div>
                          </div>

                          {/* Findings Textarea */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">
                              Compte-Rendu / Constatations :
                            </label>
                            <textarea
                              value={findingsInput}
                              onChange={e => setFindingsInput(e.target.value)}
                              rows={3}
                              className="w-full p-2.5 bg-white border border-purple-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 resize-none leading-relaxed"
                              placeholder="Détaillez les observations..."
                            />
                          </div>

                          {/* Conclusion Textarea */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">
                              Conclusion Radiologique (Synthèse) :
                            </label>
                            <textarea
                              value={conclusionInput}
                              onChange={e => setConclusionInput(e.target.value)}
                              rows={2}
                              className="w-full p-2.5 bg-white border border-purple-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 resize-none leading-relaxed"
                              placeholder="Conclusion concise..."
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setValidationMode(false)}
                              className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                            >
                              Annuler
                            </button>
                            <button
                              type="button"
                              onClick={handleTransmitResult}
                              disabled={isTransmitting}
                              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                            >
                              {isTransmitting ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                              <span>✅ Valider & Transmettre Immédiatement</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {/* Button to open validation and transmission form */}
                          <button
                            type="button"
                            onClick={() => setValidationMode(true)}
                            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Rédiger Compte-Rendu & Transmettre le Résultat</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          <Link
                            href={`/radiology/viewer?id=${scannedOrder.id}&patient=${encodeURIComponent(scannedOrder.patientName)}&type=${encodeURIComponent(scannedOrder.type)}&doctor=${encodeURIComponent(scannedOrder.doctor)}`}
                            className="w-full h-10 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Ouvrir Viewer PACS & Analyse IA</span>
                          </Link>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(scannedOrder.id, 'in_progress')}
                              className="py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-colors cursor-pointer"
                            >
                              ⚡ Marquer En Cours
                            </button>
                            <Link
                              href={`/radiology/upload?id=${scannedOrder.id}&patient=${encodeURIComponent(scannedOrder.patientName)}`}
                              className="py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5 text-slate-500" />
                              <span>Téléverser Cliché</span>
                            </Link>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: View QR Code ──────────────────────────────────────────── */}
      <AnimatePresence>
        {viewingQrOrder && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 w-full sm:max-w-sm shadow-2xl space-y-4 text-slate-900 relative"
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto sm:hidden" />
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-purple-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">QR Code Examen</h3>
                </div>
                <button
                  onClick={() => setViewingQrOrder(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-3">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-purple-100">
                  <img
                    src={viewingQrOrder.qrCodeUrl}
                    alt={`QR Code ${viewingQrOrder.id}`}
                    className="w-40 h-40 sm:w-44 sm:h-44 object-contain"
                  />
                </div>
                <div className="text-center">
                  <span className="font-mono text-xs font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md">
                    {viewingQrOrder.id}
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{viewingQrOrder.patientName}</p>
                  <p className="text-[11px] text-slate-500">{viewingQrOrder.type}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setViewingQrOrder(null);
                  processFoundOrder(viewingQrOrder);
                  setScanModalOpen(true);
                }}
                className="w-full h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <ScanLine className="w-4 h-4" />
                <span>Simuler le Scan de ce QR Code</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="bg-white border-t border-slate-200 py-3 sm:py-4 px-4 text-center text-[11px] text-slate-400">
        © {new Date().getFullYear()} Health AI • Système de Radiologie Numérique, Protocoles QR & Serveur PACS.
      </footer>
    </div>
  );
}
