'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  Calendar,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  Pill,
  ShieldCheck,
  X,
  Copy,
  Check,
  Search,
  RefreshCw,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Building2,
  Stethoscope,
  Package,
  Timer,
  Bell,
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

interface Drug {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  color: string;
  remaining?: number;
  total?: number;
}

interface Prescription {
  id: string;
  date: string;
  expiryDate?: string;
  doctor: string;
  specialty: string;
  clinic: string;
  status: 'active' | 'completed' | 'expiring';
  renewalStatus?: 'ok' | 'soon' | 'expired';
  qrCodeUrl: string;
  drugs: Drug[];
  aiAnalysis: string;
  aiRisk: 'safe' | 'warning' | 'info';
  pharmacyNote?: string;
  diagnosis?: string;
}

const PRESCRIPTIONS: Prescription[] = [
  {
    id: 'ORD-9201',
    date: '12 Mai 2026',
    expiryDate: '12 Juin 2026',
    doctor: 'Dr. Abdoulaye Diallo',
    specialty: 'Medecine Generale',
    clinic: 'Cabinet Medical Sunu — Dakar',
    status: 'active',
    renewalStatus: 'soon',
    diagnosis: 'Hypertension arterielle essentielle',
    qrCodeUrl:
      'https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=https%3A%2F%2Fhealthai.sn%2Fordonnance%2FORD-9201&color=7c3aed&bgcolor=ffffff&format=svg&qzone=2',
    drugs: [
      {
        name: 'Lisinopril 10 mg',
        dosage: '1 comprime',
        frequency: 'Chaque matin',
        duration: '30 jours',
        instructions: 'Surveillance TA recommandee',
        color: 'violet',
        remaining: 18,
        total: 30,
      },
      {
        name: 'Amlodipine 5 mg',
        dosage: '1 comprime',
        frequency: 'Chaque soir',
        duration: '30 jours',
        instructions: 'Ne pas interrompre sans avis',
        color: 'blue',
        remaining: 18,
        total: 30,
      },
    ],
    aiAnalysis:
      'Aucune interaction deletere detectee. Association Lisinopril + Amlodipine conforme aux recommandations ESC 2024 pour HTA.',
    aiRisk: 'safe',
    pharmacyNote: 'Delivrance autorisee IPM / Mutuelle.',
  },
  {
    id: 'ORD-8542',
    date: '04 Feb. 2026',
    expiryDate: '18 Feb. 2026',
    doctor: 'Dr. Aminata Toure',
    specialty: 'Pneumologie',
    clinic: 'Hopital Principal de Dakar',
    status: 'completed',
    renewalStatus: 'expired',
    diagnosis: 'Bronchite aigue bacterienne',
    qrCodeUrl:
      'https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=https%3A%2F%2Fhealthai.sn%2Fordonnance%2FORD-8542&color=64748b&bgcolor=f8fafc&format=svg&qzone=2',
    drugs: [
      {
        name: 'Amoxicilline 1 g',
        dosage: '1 comprime',
        frequency: 'Matin et soir',
        duration: '7 jours',
        instructions: 'Prendre pendant les repas',
        color: 'amber',
        remaining: 0,
        total: 14,
      },
      {
        name: 'Sirop Helicidine',
        dosage: '1 c. a soupe',
        frequency: '3 fois par jour',
        duration: '5 jours',
        instructions: 'Toux seche persistante',
        color: 'orange',
        remaining: 0,
        total: 15,
      },
    ],
    aiAnalysis:
      'Traitement antibiotique de premiere intention pour bronchite aigue. Traitement termine avec succes.',
    aiRisk: 'info',
    pharmacyNote: 'Delivrance completee le 05/02/2026.',
  },
];

const drugColorMap: Record<string, { pill: string; text: string; bar: string }> = {
  violet: { pill: 'bg-violet-100 text-violet-700', text: 'text-violet-700', bar: 'bg-violet-500' },
  blue:   { pill: 'bg-blue-100 text-blue-700',     text: 'text-blue-700',   bar: 'bg-blue-500' },
  amber:  { pill: 'bg-amber-100 text-amber-700',   text: 'text-amber-700',  bar: 'bg-amber-500' },
  orange: { pill: 'bg-orange-100 text-orange-700', text: 'text-orange-700', bar: 'bg-orange-500' },
  teal:   { pill: 'bg-teal-100 text-teal-700',     text: 'text-teal-700',   bar: 'bg-teal-500' },
};

const riskConfig = {
  safe:    { icon: CheckCircle2, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', label: 'Securite Verifiee', iconColor: 'text-emerald-600' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-800',  label: "Point d'attention", iconColor: 'text-amber-600' },
  info:    { icon: Info,          bg: 'bg-sky-50',    border: 'border-sky-200',    text: 'text-sky-800',    label: 'Information',        iconColor: 'text-sky-600' },
};

const renewalConfig = {
  ok:      { label: 'Valide',         bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  soon:    { label: 'Expire bientot', bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-500 animate-pulse' },
  expired: { label: 'Expiree',        bg: 'bg-slate-100',  text: 'text-slate-500',   border: 'border-slate-200',   dot: 'bg-slate-400' },
};

export default function PatientPrescriptions() {
  const { user, initialize } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQr, setSelectedQr] = useState<Prescription | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(PRESCRIPTIONS[0]?.id ?? null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    initialize();
    setMounted(true);
  }, [initialize]);

  if (!mounted) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white animate-pulse">
            <Pill className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium">Chargement des ordonnances...</p>
        </div>
      </div>
    );
  }

  const patientName = user?.name || 'Moussa Diop';
  const vitalId = user?.details?.vitalId || 'SN-807F16';

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filtered = PRESCRIPTIONS.filter((p) => {
    if (activeTab === 'active' && p.status !== 'active') return false;
    if (activeTab === 'completed' && p.status !== 'completed') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.doctor.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.drugs.some((d) => d.name.toLowerCase().includes(q)) ||
        (p.diagnosis || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCount = PRESCRIPTIONS.filter((p) => p.status === 'active').length;
  const completedCount = PRESCRIPTIONS.filter((p) => p.status === 'completed').length;
  const totalDrugs = PRESCRIPTIONS.filter((p) => p.status === 'active').flatMap((p) => p.drugs).length;

  return (
    <div className="min-h-full bg-slate-50 pb-20 text-slate-900">

      {/* HERO HEADER */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 pt-5 pb-6">
        <div className="max-w-5xl mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200">
                  <Pill className="w-3 h-3" />
                  Pharmacie Numerique
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-400">{vitalId}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Mes Ordonnances
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg">
                Presentez le QR Code securise en pharmacie pour retirer vos medicaments.
              </p>
            </div>

            {PRESCRIPTIONS.some((p) => p.renewalStatus === 'soon') && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2.5 px-3.5 py-2.5 bg-amber-50 border border-amber-200 rounded-2xl max-w-xs"
              >
                <Bell className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-amber-800">Renouvellement imminent</p>
                  <p className="text-[10px] text-amber-700 mt-0.5">
                    ORD-9201 expire le 12 Juin 2026. Pensez a contacter votre medecin.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
            {[
              { label: 'Actives',      value: String(activeCount),    sub: 'en cours',  color: 'text-violet-700' },
              { label: 'Medicaments',  value: String(totalDrugs),     sub: 'molecules', color: 'text-blue-700' },
              { label: 'Historique',   value: String(completedCount), sub: 'terminees', color: 'text-slate-700' },
              { label: 'Interactions', value: '0',                    sub: 'detectees', color: 'text-emerald-700' },
            ].map((s) => (
              <div key={s.label} className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
                <span className="text-[10px] font-semibold text-slate-500 block truncate">{s.label}</span>
                <span className={`text-lg font-extrabold ${s.color} block`}>{s.value}</span>
                <span className="text-[10px] text-slate-400 block">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm">
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl flex-shrink-0">
            {(['active', 'completed', 'all'] as const).map((tab) => {
              const labels = {
                active: `En cours (${activeCount})`,
                completed: `Historique (${completedCount})`,
                all: `Toutes (${PRESCRIPTIONS.length})`,
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab
                      ? 'bg-white text-violet-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          <div className="relative flex-1 min-w-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher medicament, medecin, diagnostic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PRESCRIPTIONS LIST */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 space-y-4 pb-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center">
            <Pill className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Aucune ordonnance trouvee</p>
            <p className="text-xs text-slate-400 mt-1">Modifiez vos filtres ou effectuez une nouvelle recherche.</p>
          </div>
        ) : (
          filtered.map((ord, idx) => {
            const isActive = ord.status === 'active';
            const isExpanded = expandedId === ord.id;
            const risk = riskConfig[ord.aiRisk];
            const RiskIcon = risk.icon;
            const renewal = renewalConfig[ord.renewalStatus || 'ok'];

            return (
              <motion.div
                key={ord.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-white rounded-2xl sm:rounded-3xl border shadow-sm overflow-hidden ${
                  isActive ? 'border-violet-200/80' : 'border-slate-200'
                }`}
              >
                {/* Card Header */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(ord.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                      >
                        {ord.id}
                        {copiedId === ord.id
                          ? <Check className="w-3 h-3 text-emerald-500" />
                          : <Copy className="w-3 h-3" />}
                      </button>
                      <span className="text-slate-300 text-xs">•</span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {ord.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${renewal.bg} ${renewal.text} ${renewal.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${renewal.dot}`} />
                        {renewal.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isActive
                          ? 'bg-violet-50 text-violet-700 border-violet-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {isActive
                          ? <><span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />Active</>
                          : <><CheckCircle2 className="w-3 h-3" />Terminee</>}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center font-extrabold text-sm text-violet-700 flex-shrink-0">
                      {ord.doctor.split(' ').slice(-1)[0]?.[0] ?? 'D'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Stethoscope className="w-3 h-3 text-violet-500 flex-shrink-0" />
                        <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider truncate">{ord.specialty}</span>
                      </div>
                      <h3 className="text-sm sm:text-[15px] font-extrabold text-slate-900 truncate">{ord.doctor}</h3>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <Building2 className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{ord.clinic}</span>
                      </div>
                      {ord.diagnosis && (
                        <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-semibold">
                          <Info className="w-3 h-3" />
                          {ord.diagnosis}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {ord.drugs.map((drug, di) => {
                      const c = drugColorMap[drug.color] || drugColorMap.violet;
                      return (
                        <span key={di} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold ${c.pill}`}>
                          <Pill className="w-3 h-3" />
                          {drug.name}
                        </span>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : ord.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-600 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Masquer les details' : 'Voir les details du traitement'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden border-t border-slate-100"
                    >
                      <div className="p-4 sm:p-5 space-y-4">

                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Package className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Medicaments prescrits — {ord.drugs.length}
                            </span>
                          </div>
                          <div className="space-y-2.5">
                            {ord.drugs.map((drug, di) => {
                              const c = drugColorMap[drug.color] || drugColorMap.violet;
                              const pct =
                                drug.total && drug.total > 0
                                  ? Math.round(((drug.remaining ?? 0) / drug.total) * 100)
                                  : 0;
                              return (
                                <div key={di} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                      <span className={`text-sm font-extrabold ${c.text}`}>{drug.name}</span>
                                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 flex-wrap">
                                        <span className="flex items-center gap-1"><Pill className="w-3 h-3" />{drug.dosage}</span>
                                        <span className="flex items-center gap-1"><Timer className="w-3 h-3" />{drug.frequency}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{drug.duration}</span>
                                      </div>
                                    </div>
                                    <span className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-lg font-bold ${c.pill}`}>
                                      {drug.duration}
                                    </span>
                                  </div>
                                  {drug.instructions && (
                                    <p className="text-[11px] text-slate-500 italic mb-2">i {drug.instructions}</p>
                                  )}
                                  {typeof drug.remaining !== 'undefined' && drug.total && (
                                    <div>
                                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                        <span>Progression du traitement</span>
                                        <span className="font-bold text-slate-600">{drug.remaining}/{drug.total} jours restants</span>
                                      </div>
                                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full rounded-full ${c.bar} transition-all`}
                                          style={{ width: `${pct}%` }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className={`p-3.5 rounded-2xl border ${risk.bg} ${risk.border}`}>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-800">Analyse IA Clinique</span>
                            <span className={`ml-auto inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${risk.bg} ${risk.border} ${risk.text}`}>
                              <RiskIcon className={`w-3 h-3 ${risk.iconColor}`} />
                              {risk.label}
                            </span>
                          </div>
                          <p className={`text-[11px] leading-relaxed ${risk.text}`}>{ord.aiAnalysis}</p>
                        </div>

                        {ord.expiryDate && (
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                            <RefreshCw className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span>Valide jusqu&apos;au <strong className="text-slate-700">{ord.expiryDate}</strong></span>
                            {ord.pharmacyNote && (
                              <span className="ml-auto pl-2 border-l border-slate-200 text-slate-400 truncate">{ord.pharmacyNote}</span>
                            )}
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                          <button
                            onClick={() => alert(`Telechargement PDF de l'ordonnance ${ord.id}...`)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Telecharger PDF
                          </button>
                          <button
                            onClick={() => setSelectedQr(ord)}
                            className="flex-1 sm:flex-[2] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-xs font-bold transition-all shadow-sm shadow-violet-600/20 cursor-pointer"
                          >
                            <QrCode className="w-4 h-4" />
                            Afficher QR Pharmacie
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* QR CODE MODAL */}
      <AnimatePresence>
        {selectedQr && (
          <motion.div
            key="qr-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedQr(null)}
          >
            <motion.div
              initial={{ y: 60, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 60, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200 shadow-2xl max-w-sm w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-violet-50/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">QR Code Pharmacie</h3>
                    <p className="text-[10px] font-mono font-bold text-violet-700">{selectedQr.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedQr(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 flex flex-col items-center gap-4">
                <p className="text-xs text-slate-500 text-center max-w-[260px]">
                  Presentez ce QR Code a l&apos;officine pour autoriser la dispensation securisee de vos medicaments.
                </p>

                <div className="w-60 h-60 bg-slate-50 rounded-2xl border-2 border-violet-200 p-3 flex items-center justify-center shadow-inner">
                  <img
                    src={selectedQr.qrCodeUrl}
                    alt={`QR Code ${selectedQr.id}`}
                    width={230}
                    height={230}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="w-full rounded-2xl bg-slate-50 border border-slate-200 divide-y divide-slate-100 overflow-hidden text-[11px]">
                  {[
                    { label: 'Patient',       value: patientName },
                    { label: 'Prescripteur',  value: selectedQr.doctor },
                    { label: 'Medicaments',   value: `${selectedQr.drugs.length} prescrit(s)` },
                    { label: 'Expiration',    value: selectedQr.expiryDate || '—' },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center px-3.5 py-2">
                      <span className="text-slate-400">{row.label}</span>
                      <span className="font-bold text-slate-800">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Chiffrement AES-256 - Ordre National des Pharmaciens</span>
                </div>
              </div>

              <div className="px-5 pb-5">
                <button
                  onClick={() => setSelectedQr(null)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-extrabold transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
