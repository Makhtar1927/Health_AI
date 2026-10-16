'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
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
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Heart,
  Thermometer,
  Droplet,
  HeartPulse,
  Wind,
  ClipboardList,
  Pill,
  TestTube2,
  Printer,
  Save,
  Clock,
  Calendar,
  UserCheck,
  AlertCircle,
  ChevronDown,
  X,
  MessageSquare,
  Send,
  BadgeAlert,
  Microscope,
  Syringe,
  Weight,
  Ruler,
  Eye,
  Ear,
  Bone,
  Zap,
  QrCode,
  Download,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import DoctorTopBar from '@/components/doctor/DoctorTopBar';
import DoctorNavBar from '@/components/doctor/DoctorNavBar';
import { getAuthHeader, useAuthStore } from '@/lib/authStore';
import { createRadiologyOrder, RadiologyOrder } from '@/lib/radiologyStore';

interface Drug {
  name: string;
  dosage: string;
  duration: string;
  route: string;
}

interface LabTest {
  name: string;
  urgency: 'routine' | 'urgent' | 'stat';
}

type ConsultTab = 'anamnese' | 'examen' | 'prescription' | 'examens';

function ConsultationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, initialize } = useAuthStore();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    initialize();
    setCheckingAuth(false);
  }, [initialize]);

  const id = searchParams.get('id') || 'P-101';
  const name = searchParams.get('name') || 'Amadou Sall';
  const age = searchParams.get('age') || '42';
  const gender = searchParams.get('gender') || 'M';
  const reason = searchParams.get('reason') || 'Douleurs thoraciques aiguës & dyspnée';

  useEffect(() => {
    if (!checkingAuth && !isAuthenticated) {
      const originalUrl = window.location.pathname + window.location.search;
      router.push(`/?redirect=${encodeURIComponent(originalUrl)}`);
    }
  }, [checkingAuth, isAuthenticated, router]);

  // ── TABS ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ConsultTab>('anamnese');

  // ── VITALS ────────────────────────────────────────────────────────────
  const [vitals, setVitals] = useState({
    bp_sys: '14', bp_dia: '9',
    pulse: '88', temp: '37.4',
    spo2: '96', rr: '18',
    weight: '72', height: '175',
    glycemia: ''
  });

  // ── ANAMNÈSE ──────────────────────────────────────────────────────────
  const [symptoms, setSymptoms] = useState('');
  const [hpi, setHpi] = useState('');  // Histoire de la maladie
  const [antecedents, setAntecedents] = useState({
    medical: '',
    surgical: '',
    family: '',
    allergies: '',
    treatments: ''
  });

  // ── EXAMEN CLINIQUE ───────────────────────────────────────────────────
  const [examGeneral, setExamGeneral] = useState('');
  const [examCardio, setExamCardio] = useState('');
  const [examPulmo, setExamPulmo] = useState('');
  const [examAbdo, setExamAbdo] = useState('');
  const [examNeuro, setExamNeuro] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');

  // ── PRESCRIPTION ──────────────────────────────────────────────────────
  const [drugs, setDrugs] = useState<Drug[]>([
    { name: '', dosage: '', duration: '', route: 'Per os' }
  ]);

  // ── EXAMENS COMPLÉMENTAIRES ───────────────────────────────────────────
  const [labTests, setLabTests] = useState<LabTest[]>([
    { name: '', urgency: 'routine' }
  ]);
  const [imagingOrder, setImagingOrder] = useState('');
  const [imagingType, setImagingType] = useState('Radiographie Pulmonaire (Face & Profil)');
  const [imagingModality, setImagingModality] = useState<'RX' | 'TDM' | 'IRM' | 'ECO'>('RX');
  const [imagingPriority, setImagingPriority] = useState<'routine' | 'urgent' | 'vital'>('urgent');
  const [imagingBodyPart, setImagingBodyPart] = useState('Thorax');
  const [imagingIndication, setImagingIndication] = useState('');
  const [generatedRadioOrder, setGeneratedRadioOrder] = useState<RadiologyOrder | null>(null);
  const [showRadioQrModal, setShowRadioQrModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [patientRadioOrders, setPatientRadioOrders] = useState<RadiologyOrder[]>([]);
  const [referral, setReferral] = useState('');

  // ── AI STATES ─────────────────────────────────────────────────────────
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [alertLevel, setAlertLevel] = useState<'GREEN' | 'ORANGE' | 'ROUGE' | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Je suis votre Co-Pilote clinique. Saisissez les symptômes ou médicaments, puis utilisez les boutons d\'analyse pour obtenir une aide décisionnelle.' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // ── SAVE ──────────────────────────────────────────────────────────────
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // ── Computed ──────────────────────────────────────────────────────────
  const bmi = vitals.weight && vitals.height
    ? (parseFloat(vitals.weight) / Math.pow(parseFloat(vitals.height) / 100, 2)).toFixed(1)
    : '--';

  const isTempHigh = parseFloat(vitals.temp) >= 38.5;
  const isSpO2Low = parseFloat(vitals.spo2) <= 92;
  const isBpHigh = parseInt(vitals.bp_sys) >= 160;
  const isPulseHigh = parseInt(vitals.pulse) >= 100;

  const doctorDisplayName = user?.name
    ? (user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`)
    : 'Dr. Oumy Aidara';

  const consultDate = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date());

  // ── Drug helpers ──────────────────────────────────────────────────────
  const addDrug = () => setDrugs([...drugs, { name: '', dosage: '', duration: '', route: 'Per os' }]);
  const removeDrug = (i: number) => setDrugs(drugs.filter((_, idx) => idx !== i));
  const updateDrug = (i: number, field: keyof Drug, v: string) => {
    const d = [...drugs]; d[i][field] = v; setDrugs(d);
  };

  // ── Lab test helpers ──────────────────────────────────────────────────
  const addLabTest = () => setLabTests([...labTests, { name: '', urgency: 'routine' }]);
  const removeLabTest = (i: number) => setLabTests(labTests.filter((_, idx) => idx !== i));
  const updateLabTest = (i: number, field: keyof LabTest, v: string) => {
    const t = [...labTests]; (t[i] as any)[field] = v; setLabTests(t);
  };

  // ── AI Actions ────────────────────────────────────────────────────────
  const checkDrugInteractions = async () => {
    const activeDrugs = drugs.filter(d => d.name.trim() !== '');
    if (activeDrugs.length === 0) return;
    setIsAiLoading(true); setAiReport(null); setAlertLevel(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const authHeader = await getAuthHeader();
      const res = await fetch(`${API_URL}/api/ai/analyze-prescription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ drugs: activeDrugs })
      });
      const data = await res.json();
      if (data.success) {
        setAiReport(data.analysis);
        const text = data.analysis.toUpperCase();
        if (text.includes('ROUGE') || text.includes('CONTRE-INDICATION ABSOLUE') || text.includes('DANGER')) {
          setAlertLevel('ROUGE');
        } else if (text.includes('ORANGE') || text.includes('PRÉCAUTION')) {
          setAlertLevel('ORANGE');
        } else {
          setAlertLevel('GREEN');
        }
      }
    } catch (e) {
      setAiReport('⚠️ Erreur de connexion avec le module d\'interactions IA.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const suggestDiagnosis = async () => {
    if (!symptoms.trim()) return;
    setIsAiLoading(true); setAiReport(null); setAlertLevel(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const authHeader = await getAuthHeader();
      const res = await fetch(`${API_URL}/api/ai/clinical-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({
          query: `En tant que consultant médical, pour un patient de ${age} ans (${gender === 'M' ? 'Masculin' : 'Féminin'}), présentant : "${symptoms}". Motif de consultation : "${reason}". Proposez : 1) Hypothèses diagnostiques différentielles, 2) Examens complémentaires à demander, 3) Traitement de première intention (médicaments et dosages). Réponse clinique concise en français.`,
          history: []
        })
      });
      const data = await res.json();
      if (data.success) { setAiReport(data.response); setAlertLevel('GREEN'); }
    } catch (e) {
      setAiReport('⚠️ Erreur lors de l\'accès au service de diagnostic clinique par l\'IA.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const sendChatMessage = async (msg?: string) => {
    const query = (msg || chatInput).trim();
    if (!query) return;
    setChatMessages(prev => [...prev, { role: 'user', content: query }]);
    if (!msg) setChatInput('');
    setIsChatLoading(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const authHeader = await getAuthHeader();
      const res = await fetch(`${API_URL}/api/ai/clinical-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ query, history: chatMessages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: m.content })) })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.success ? data.response : '⚠️ Assistant indisponible.' }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Erreur de connexion avec l\'IA.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSaveConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => router.push('/doctor/dashboard'), 2000);
    }, 1200);
  };

  if (checkingAuth || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-xs text-slate-500 mt-2">Vérification de l'accès médical sécurisé...</p>
      </div>
    );
  }

  const TABS: { key: ConsultTab; label: string; icon: React.ReactNode }[] = [
    { key: 'anamnese', label: 'Anamnèse', icon: <ClipboardList className="w-3.5 h-3.5" /> },
    { key: 'examen', label: 'Examen Clinique', icon: <Stethoscope className="w-3.5 h-3.5" /> },
    { key: 'prescription', label: 'Ordonnance', icon: <Pill className="w-3.5 h-3.5" /> },
    { key: 'examens', label: 'Examens Complémentaires', icon: <TestTube2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col pb-20 md:pb-6">

      {/* TopBar & NavBar */}
      <DoctorTopBar />
      <DoctorNavBar hasActiveConsultation={true} />

      <main className="max-w-7xl mx-auto w-full flex-grow px-3 sm:px-5 lg:px-8 py-4 sm:py-5">

        {/* ── Patient Identity Header ─────────────────────────────────── */}
        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">

            {/* Back + Identity */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Link
                href="/doctor/dashboard"
                className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
                {name.charAt(0)}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-black text-base sm:text-lg text-slate-900 tracking-tight">{name}</h1>
                  <span className="font-mono text-xs text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-lg">{id}</span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Consultation Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {age} ans &bull; {gender === 'M' ? 'Masculin' : 'Féminin'} &bull;
                  Motif : <strong className="text-slate-800">{reason}</strong>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {consultDate} &bull; Praticien : {doctorDisplayName}
                </p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => window.print()}
                className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Imprimer</span>
              </button>
              <Link
                href={`/doctor/imaging?id=${id}&patient=${encodeURIComponent(name)}`}
                className="h-9 px-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <span>PACS</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ── Vitals Strip ─────────────────────────────────────────── */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-600" />
              Constantes Vitales
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
              {/* BP */}
              <div className={`col-span-1 rounded-xl border p-2.5 text-center ${isBpHigh ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-center mb-1"><Droplet className={`w-3.5 h-3.5 ${isBpHigh ? 'text-rose-500' : 'text-blue-500'}`} /></div>
                <div className="flex items-center justify-center gap-0.5">
                  <input type="text" value={vitals.bp_sys} onChange={e => setVitals(v => ({...v, bp_sys: e.target.value}))}
                    className="w-8 text-center text-xs font-black bg-transparent focus:outline-none" />
                  <span className="text-[10px] text-slate-400">/</span>
                  <input type="text" value={vitals.bp_dia} onChange={e => setVitals(v => ({...v, bp_dia: e.target.value}))}
                    className="w-8 text-center text-xs font-black bg-transparent focus:outline-none" />
                </div>
                <p className={`text-[9px] font-bold mt-0.5 ${isBpHigh ? 'text-rose-600' : 'text-slate-400'}`}>TA (cmHg)</p>
              </div>
              {/* Pulse */}
              <div className={`col-span-1 rounded-xl border p-2.5 text-center ${isPulseHigh ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-center mb-1"><HeartPulse className={`w-3.5 h-3.5 ${isPulseHigh ? 'text-orange-500' : 'text-rose-500'}`} /></div>
                <input type="text" value={vitals.pulse} onChange={e => setVitals(v => ({...v, pulse: e.target.value}))}
                  className="w-14 text-center text-xs font-black bg-transparent focus:outline-none" />
                <p className={`text-[9px] font-bold mt-0.5 ${isPulseHigh ? 'text-orange-600' : 'text-slate-400'}`}>Pouls /min</p>
              </div>
              {/* Temp */}
              <div className={`col-span-1 rounded-xl border p-2.5 text-center ${isTempHigh ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-center mb-1"><Thermometer className={`w-3.5 h-3.5 ${isTempHigh ? 'text-amber-500' : 'text-orange-400'}`} /></div>
                <input type="text" value={vitals.temp} onChange={e => setVitals(v => ({...v, temp: e.target.value}))}
                  className="w-14 text-center text-xs font-black bg-transparent focus:outline-none" />
                <p className={`text-[9px] font-bold mt-0.5 ${isTempHigh ? 'text-amber-600' : 'text-slate-400'}`}>Temp °C</p>
              </div>
              {/* SpO2 */}
              <div className={`col-span-1 rounded-xl border p-2.5 text-center ${isSpO2Low ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-center mb-1"><Wind className={`w-3.5 h-3.5 ${isSpO2Low ? 'text-rose-500' : 'text-sky-500'}`} /></div>
                <input type="text" value={vitals.spo2} onChange={e => setVitals(v => ({...v, spo2: e.target.value}))}
                  className="w-14 text-center text-xs font-black bg-transparent focus:outline-none" />
                <p className={`text-[9px] font-bold mt-0.5 ${isSpO2Low ? 'text-rose-600' : 'text-slate-400'}`}>SpO2 %</p>
              </div>
              {/* RR */}
              <div className="col-span-1 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center">
                <div className="flex justify-center mb-1"><Activity className="w-3.5 h-3.5 text-teal-500" /></div>
                <input type="text" value={vitals.rr} onChange={e => setVitals(v => ({...v, rr: e.target.value}))}
                  className="w-14 text-center text-xs font-black bg-transparent focus:outline-none" />
                <p className="text-[9px] font-bold mt-0.5 text-slate-400">FR /min</p>
              </div>
              {/* Weight */}
              <div className="col-span-1 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center">
                <div className="flex justify-center mb-1"><Weight className="w-3.5 h-3.5 text-slate-500" /></div>
                <input type="text" value={vitals.weight} onChange={e => setVitals(v => ({...v, weight: e.target.value}))}
                  className="w-14 text-center text-xs font-black bg-transparent focus:outline-none" />
                <p className="text-[9px] font-bold mt-0.5 text-slate-400">Poids kg</p>
              </div>
              {/* Height */}
              <div className="col-span-1 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center">
                <div className="flex justify-center mb-1"><Ruler className="w-3.5 h-3.5 text-slate-500" /></div>
                <input type="text" value={vitals.height} onChange={e => setVitals(v => ({...v, height: e.target.value}))}
                  className="w-14 text-center text-xs font-black bg-transparent focus:outline-none" />
                <p className="text-[9px] font-bold mt-0.5 text-slate-400">Taille cm</p>
              </div>
              {/* BMI */}
              <div className="col-span-1 rounded-xl border border-slate-200 bg-emerald-50 p-2.5 text-center">
                <div className="flex justify-center mb-1"><Zap className="w-3.5 h-3.5 text-emerald-600" /></div>
                <p className="text-xs font-black text-emerald-700">{bmi}</p>
                <p className="text-[9px] font-bold mt-0.5 text-slate-400">IMC</p>
              </div>
              {/* Glycemia */}
              <div className="col-span-1 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center">
                <div className="flex justify-center mb-1"><Droplet className="w-3.5 h-3.5 text-amber-500" /></div>
                <input type="text" value={vitals.glycemia} onChange={e => setVitals(v => ({...v, glycemia: e.target.value}))}
                  placeholder="--"
                  className="w-14 text-center text-xs font-black bg-transparent focus:outline-none placeholder-slate-300" />
                <p className="text-[9px] font-bold mt-0.5 text-slate-400">Glycémie</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2-Column Layout ─────────────────────────────────────────── */}
        <form onSubmit={handleSaveConsultation}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

            {/* ── LEFT: Consultation Tabs (8 cols) ─────────────────── */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">

              {/* Tab Bar */}
              <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar gap-1">
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 min-w-max py-2 px-3 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ── TAB: ANAMNÈSE ────────────────────────────────────── */}
              <AnimatePresence mode="wait">
                {activeTab === 'anamnese' && (
                  <motion.div
                    key="anamnese"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-4"
                  >
                    {/* Motif & Symptômes */}
                    <section className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                          <h3 className="font-extrabold text-sm text-slate-900">Motif & Symptômes</h3>
                        </div>
                        <button
                          type="button"
                          onClick={suggestDiagnosis}
                          disabled={isAiLoading}
                          className="h-8 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Brain className="h-3.5 w-3.5" />
                          <span>Aide Diagnostic IA</span>
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1.5 block">Symptômes déclarés & signes fonctionnels</label>
                          <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)}
                            placeholder="Ex: Douleur rétrosternale constrictive irradiant au bras gauche depuis 2h, sueurs froides, dyspnée stade 3..."
                            className="w-full h-24 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors placeholder-slate-400 resize-none" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1.5 block">Histoire de la maladie actuelle</label>
                          <textarea value={hpi} onChange={e => setHpi(e.target.value)}
                            placeholder="Ex: Début brutal il y a 3 heures au repos, pas de fièvre, prise de Kardégic en automédication..."
                            className="w-full h-20 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors placeholder-slate-400 resize-none" />
                        </div>
                      </div>
                    </section>

                    {/* Antécédents */}
                    <section className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        <h3 className="font-extrabold text-sm text-slate-900">Antécédents</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1.5 block">Médicaux</label>
                          <textarea value={antecedents.medical} onChange={e => setAntecedents(a => ({...a, medical: e.target.value}))}
                            placeholder="Ex: HTA, diabète type 2, cardiopathie ischémique..."
                            className="w-full h-20 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors placeholder-slate-400 resize-none" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1.5 block">Chirurgicaux</label>
                          <textarea value={antecedents.surgical} onChange={e => setAntecedents(a => ({...a, surgical: e.target.value}))}
                            placeholder="Ex: Appendicectomie 2015, bypass coronarien 2020..."
                            className="w-full h-20 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors placeholder-slate-400 resize-none" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1.5 block">Familiaux</label>
                          <textarea value={antecedents.family} onChange={e => setAntecedents(a => ({...a, family: e.target.value}))}
                            placeholder="Ex: Père décédé d'infarctus à 58 ans..."
                            className="w-full h-16 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors placeholder-slate-400 resize-none" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                            <BadgeAlert className="w-3.5 h-3.5 text-rose-500" />
                            Allergies connues
                          </label>
                          <textarea value={antecedents.allergies} onChange={e => setAntecedents(a => ({...a, allergies: e.target.value}))}
                            placeholder="Ex: Pénicilline (choc anaphylactique), AINS (urticaire)..."
                            className="w-full h-16 px-3.5 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-rose-400 transition-colors placeholder-slate-400 resize-none" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700 mb-1.5 block">Traitements en cours</label>
                          <textarea value={antecedents.treatments} onChange={e => setAntecedents(a => ({...a, treatments: e.target.value}))}
                            placeholder="Ex: Bisoprolol 5mg/j, Ramipril 10mg/j, Atorvastatine 40mg/j..."
                            className="w-full h-16 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors placeholder-slate-400 resize-none" />
                        </div>
                      </div>
                    </section>
                  </motion.div>
                )}

                {/* ── TAB: EXAMEN CLINIQUE ─────────────────────────────── */}
                {activeTab === 'examen' && (
                  <motion.div
                    key="examen"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-4"
                  >
                    <section className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <Stethoscope className="w-4 h-4 text-emerald-600" />
                        <h3 className="font-extrabold text-sm text-slate-900">Examen Clinique par Appareil</h3>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: 'Examen Général', icon: <User className="w-3.5 h-3.5 text-slate-500" />, value: examGeneral, setter: setExamGeneral, placeholder: "Ex: Patient conscient, bien orienté, apyrétique, coloration normale..." },
                          { label: 'Cardiovasculaire', icon: <Heart className="w-3.5 h-3.5 text-rose-500" />, value: examCardio, setter: setExamCardio, placeholder: "Ex: Bruits du cœur réguliers, pas de souffle audible, pouls symétrique 88bpm, PA 14/9..." },
                          { label: 'Pulmonaire', icon: <Wind className="w-3.5 h-3.5 text-sky-500" />, value: examPulmo, setter: setExamPulmo, placeholder: "Ex: Murmure vésiculaire diminué en base droite, quelques crépitants, SpO2 96%..." },
                          { label: 'Abdominopelvien', icon: <Activity className="w-3.5 h-3.5 text-amber-500" />, value: examAbdo, setter: setExamAbdo, placeholder: "Ex: Abdomen souple, dépressible, pas de défense, transit normal..." },
                          { label: 'Neurologique', icon: <Brain className="w-3.5 h-3.5 text-indigo-500" />, value: examNeuro, setter: setExamNeuro, placeholder: "Ex: Glasgow 15, pas de signe de localisation, ROT présents et symétriques..." },
                        ].map(({ label, icon, value, setter, placeholder }) => (
                          <div key={label}>
                            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                              {icon} {label}
                            </label>
                            <textarea value={value} onChange={e => setter(e.target.value)}
                              placeholder={placeholder}
                              className="w-full h-20 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors placeholder-slate-400 resize-none" />
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <h3 className="font-extrabold text-sm text-slate-900">Conclusion & Diagnostic</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1.5 block">Hypothèse Diagnostique Retenue</label>
                          <input type="text" value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
                            placeholder="Ex: Syndrome coronarien aigu (SCA) sans sus-décalage ST — NSTEMI probable"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1.5 block">Notes & Conseils au Patient</label>
                          <textarea value={clinicalNotes} onChange={e => setClinicalNotes(e.target.value)}
                            placeholder="Ex: Repos strict au lit. Transfert SAMU si aggravation. Régime sans sel renforcé. Revoir dans 7 jours avec résultats bilan lipidique..."
                            className="w-full h-24 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors placeholder-slate-400 resize-none" />
                        </div>
                      </div>
                    </section>
                  </motion.div>
                )}

                {/* ── TAB: ORDONNANCE ───────────────────────────────────── */}
                {activeTab === 'prescription' && (
                  <motion.div
                    key="prescription"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <section className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <Pill className="w-4 h-4 text-emerald-600" />
                          <h3 className="font-extrabold text-sm text-slate-900">Ordonnance & Traitement</h3>
                        </div>
                        <button
                          type="button"
                          onClick={checkDrugInteractions}
                          disabled={isAiLoading}
                          className="h-8 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Vérifier Interactions</span>
                        </button>
                      </div>

                      {/* Drug List */}
                      <div className="space-y-3">
                        {drugs.map((drug, idx) => (
                          <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5 relative">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Médicament #{idx + 1}</span>
                              {drugs.length > 1 && (
                                <button type="button" onClick={() => removeDrug(idx)}
                                  className="w-6 h-6 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer">
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input type="text" placeholder="Médicament (ex: Aspirine 100mg)" value={drug.name}
                                onChange={e => updateDrug(idx, 'name', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors" />
                              <input type="text" placeholder="Posologie (ex: 1cp 2x/j avant repas)" value={drug.dosage}
                                onChange={e => updateDrug(idx, 'dosage', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors" />
                              <input type="text" placeholder="Durée (ex: 7 jours, 1 mois)" value={drug.duration}
                                onChange={e => updateDrug(idx, 'duration', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors" />
                              <select value={drug.route} onChange={e => updateDrug(idx, 'route', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors cursor-pointer">
                                {['Per os', 'Intra-veineux', 'Intra-musculaire', 'Sous-cutané', 'Sublinguale', 'Topique', 'Inhalation'].map(r => (
                                  <option key={r} value={r}>{r}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}
                        <button type="button" onClick={addDrug}
                          className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold hover:underline cursor-pointer">
                          <Plus className="w-4 h-4" /> Ajouter un médicament
                        </button>
                      </div>
                    </section>
                  </motion.div>
                )}

                {/* ── TAB: EXAMENS COMPLÉMENTAIRES ────────────────────── */}
                {activeTab === 'examens' && (
                  <motion.div
                    key="examens"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-4"
                  >
                    {/* Biological Tests */}
                    <section className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <TestTube2 className="w-4 h-4 text-emerald-600" />
                        <h3 className="font-extrabold text-sm text-slate-900">Biologie & Prélèvements</h3>
                      </div>
                      <div className="space-y-2.5">
                        {labTests.map((test, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input type="text" placeholder="Examen (ex: NFS, CRP, Troponines, BNP...)" value={test.name}
                              onChange={e => updateLabTest(idx, 'name', e.target.value)}
                              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors" />
                            <select value={test.urgency} onChange={e => updateLabTest(idx, 'urgency', e.target.value)}
                              className={`px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none transition-colors ${
                                test.urgency === 'stat' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                                test.urgency === 'urgent' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                'bg-slate-50 border-slate-200 text-slate-600'
                              }`}>
                              <option value="routine">Routine</option>
                              <option value="urgent">Urgent</option>
                              <option value="stat">STAT</option>
                            </select>
                            {labTests.length > 1 && (
                              <button type="button" onClick={() => removeLabTest(idx)}
                                className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button type="button" onClick={addLabTest}
                          className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold hover:underline cursor-pointer">
                          <Plus className="w-4 h-4" /> Ajouter un bilan
                        </button>
                      </div>
                    </section>

                    {/* Imaging & QR Code Generation */}
                    <section className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                            <Microscope className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-sm text-slate-900">Demande d'Imagerie Médicale & PACS</h3>
                            <p className="text-[11px] text-slate-500">Génération automatique du QR Code sécurisé pour la salle de radiologie</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                          <QrCode className="w-3 h-3" />
                          Protocole QR Sécurisé
                        </span>
                      </div>

                      {/* Examen selector presets */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                              Type d'Examen Radiologique
                            </label>
                            <select
                              value={imagingType}
                              onChange={e => {
                                const val = e.target.value;
                                setImagingType(val);
                                if (val.includes('Scanner') || val.includes('TDM')) {
                                  setImagingModality('TDM');
                                  setImagingBodyPart('Thorax & Abdomen');
                                } else if (val.includes('IRM')) {
                                  setImagingModality('IRM');
                                  setImagingBodyPart('Cerveau');
                                } else if (val.includes('Échographie')) {
                                  setImagingModality('ECO');
                                  setImagingBodyPart('Abdomen');
                                } else if (val.includes('Genou')) {
                                  setImagingModality('RX');
                                  setImagingBodyPart('Genou');
                                } else {
                                  setImagingModality('RX');
                                  setImagingBodyPart('Thorax');
                                }
                              }}
                              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-purple-600 transition-colors cursor-pointer"
                            >
                              <option value="Radiographie Pulmonaire (Face & Profil)">Radiographie Pulmonaire (Face & Profil)</option>
                              <option value="Scanner Thoraco-Abdominal C+">Scanner Thoraco-Abdominal C+</option>
                              <option value="Scanner Cérébral sans injection">Scanner Cérébral sans injection</option>
                              <option value="Radio Genou (Face & Profil)">Radio Genou (Face & Profil)</option>
                              <option value="Radio Rachis Lombaire">Radio Rachis Lombaire (Face/Profil)</option>
                              <option value="IRM Cérébrale Séquences Complètes">IRM Cérébrale Séquences Complètes</option>
                              <option value="Échographie Abdomino-Pelvienne">Échographie Abdomino-Pelvienne</option>
                              <option value="Autre Examen d'Imagerie Spécialisé">Autre Examen Spécialisé...</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                Modalité
                              </label>
                              <select
                                value={imagingModality}
                                onChange={e => setImagingModality(e.target.value as any)}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-purple-600 transition-colors cursor-pointer"
                              >
                                <option value="RX">RX (Rayons X)</option>
                                <option value="TDM">TDM (Scanner)</option>
                                <option value="IRM">IRM (Résonance)</option>
                                <option value="ECO">ECO (Échographie)</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                Degré d'Urgence
                              </label>
                              <select
                                value={imagingPriority}
                                onChange={e => setImagingPriority(e.target.value as any)}
                                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer focus:outline-none ${
                                  imagingPriority === 'vital' ? 'bg-rose-50 border-rose-300 text-rose-700' :
                                  imagingPriority === 'urgent' ? 'bg-amber-50 border-amber-300 text-amber-700' :
                                  'bg-slate-50 border-slate-200 text-slate-700'
                                }`}
                              >
                                <option value="vital">🚨 Urgence Vitale</option>
                                <option value="urgent">⚡ Urgent (Vacation)</option>
                                <option value="routine">Routine</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Indication clinique */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                            Indication Clinique & Hypothèse Diagnostique
                          </label>
                          <textarea
                            value={imagingIndication}
                            onChange={e => {
                              setImagingIndication(e.target.value);
                              setImagingOrder(e.target.value);
                            }}
                            placeholder="Ex: Douleurs thoraciques aiguës fébriles avec râles crépitants base droite. Suspicion de pneumonie alvéolaire ou décompensation cardiaque."
                            className="w-full h-20 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500 transition-colors placeholder-slate-400 resize-none leading-relaxed"
                          />
                        </div>

                        {/* Action: Generate QR Code button */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                          <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            Transmis instantanément à la console du manipulateur radio
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              const finalType = imagingType.trim() || 'Radiographie Pulmonaire (Face & Profil)';
                              const finalIndication = imagingIndication.trim() || reason || 'Examen d\'imagerie complémentaire.';
                              const newOrder = createRadiologyOrder({
                                patientId: id,
                                patientName: name,
                                patientAge: parseInt(age) || 42,
                                patientGender: gender as any,
                                type: finalType,
                                bodyPart: imagingBodyPart,
                                modality: imagingModality,
                                priority: imagingPriority,
                                doctor: doctorDisplayName,
                                hospital: user?.details?.hospital || 'Hôpital Principal de Dakar',
                                clinicalIndication: finalIndication
                              });
                              setGeneratedRadioOrder(newOrder);
                              setPatientRadioOrders(prev => [newOrder, ...prev]);
                              setShowRadioQrModal(true);
                            }}
                            className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm shadow-purple-600/20 transition-all cursor-pointer"
                          >
                            <QrCode className="w-4 h-4" />
                            <span>Générer Demande & QR Code Radiologie</span>
                          </button>
                        </div>

                        {/* List of generated orders for this consultation */}
                        {patientRadioOrders.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-purple-100 space-y-2">
                            <p className="text-[10px] font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Bons d'imagerie générés pour ce patient ({patientRadioOrders.length})
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {patientRadioOrders.map(order => (
                                <div key={order.id} className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl flex items-center justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-mono text-[10px] font-bold text-purple-700">{order.id}</span>
                                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-purple-200/80 text-purple-900">{order.modality}</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{order.type}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setGeneratedRadioOrder(order);
                                      setShowRadioQrModal(true);
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-purple-100 border border-purple-200 text-purple-800 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors shadow-xs cursor-pointer"
                                  >
                                    <QrCode className="w-3.5 h-3.5 text-purple-600" />
                                    <span>Voir QR</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </section>

                    {/* Referral */}
                    <section className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-3">
                      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <Syringe className="w-4 h-4 text-sky-600" />
                        <h3 className="font-extrabold text-sm text-slate-900">Orientation & Référencement</h3>
                      </div>
                      <textarea value={referral} onChange={e => setReferral(e.target.value)}
                        placeholder="Ex: Référencement en cardiologie pour exploration d'un SCA. Transfert SMUR si dégradation hémodynamique. Hospitalisation en UAS..."
                        className="w-full h-20 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500 transition-colors placeholder-slate-400 resize-none" />
                    </section>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Form Action Bar ──────────────────────────────────────── */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <Link
                  href="/doctor/dashboard"
                  className="h-11 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Retour tableau de bord
                </Link>

                <button
                  type="submit"
                  disabled={isSaving || saveSuccess}
                  className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /><span>Enregistrement...</span></>
                  ) : saveSuccess ? (
                    <><CheckCircle className="h-4 w-4" /><span>Consultation enregistrée !</span></>
                  ) : (
                    <><Save className="h-4 w-4" /><span>Valider & Enregistrer</span></>
                  )}
                </button>
              </div>
            </div>

            {/* ── RIGHT: AI Co-Pilot (4 cols) ──────────────────────────── */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-4">

              {/* AI Report Card */}
              {(isAiLoading || aiReport) && (
                <motion.section
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                      <Brain className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1">
                      Analyse IA <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
                    </h4>
                    {alertLevel && (
                      <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-full ${
                        alertLevel === 'ROUGE' ? 'bg-rose-100 text-rose-700' :
                        alertLevel === 'ORANGE' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {alertLevel === 'ROUGE' ? '🔴 ALERTE' : alertLevel === 'ORANGE' ? '🟠 PRÉCAUTION' : '🟢 OK'}
                      </span>
                    )}
                  </div>
                  {isAiLoading ? (
                    <div className="flex items-center gap-2 p-4 text-xs text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-600 shrink-0" />
                      Analyse médicale en cours...
                    </div>
                  ) : (
                    <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 rounded-xl p-3 max-h-52 overflow-y-auto border border-slate-100">
                      {aiReport}
                    </div>
                  )}
                </motion.section>
              )}

              {/* AI Co-Pilot Chat */}
              <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col" style={{height: '520px'}}>
                <div className="flex items-center justify-between border-b border-slate-100 p-4 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xs text-slate-900">Co-Pilote Clinique IA</h3>
                      <p className="text-[10px] text-slate-400 font-semibold">Moteur Gemini · Health AI</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">LIVE</span>
                </div>

                {/* Quick prompts */}
                <div className="px-4 py-2.5 border-b border-slate-50 shrink-0">
                  <div className="flex flex-wrap gap-1.5">
                    {['Diagnostic différentiel', 'Protocole OMS', 'Score GRACE', 'Posologie pédiatrique'].map((p) => (
                      <button key={p} type="button" onClick={() => sendChatMessage(p)}
                        className="text-[10px] font-semibold px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors cursor-pointer">
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-slate-900 text-white rounded-br-none'
                          : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-none p-3 flex items-center gap-2 text-xs text-slate-500">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                        Analyse en cours...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat input */}
                <form onSubmit={e => { e.preventDefault(); sendChatMessage(); }}
                  className="p-3 border-t border-slate-100 flex gap-2 shrink-0">
                  <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                    placeholder="Question clinique ou protocole..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors" />
                  <button type="submit" disabled={isChatLoading || !chatInput.trim()}
                    className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 shrink-0">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </section>
            </div>

          </div>
        </form>

      </main>

      {/* ── Modal QR Code Examen Radiologie (Responsive Mobile, Tablet & Desktop) ── */}
      <AnimatePresence>
        {showRadioQrModal && generatedRadioOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 w-full max-w-[94vw] sm:max-w-md md:max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl space-y-4 sm:space-y-5 text-slate-900 relative my-auto scrollbar-thin"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-3 gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-purple-600/20 font-black shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                      Bon d'Examen Radiologie
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-purple-700 font-bold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      Indexé en temps réel sur le PACS
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRadioQrModal(false)}
                  className="p-1 sm:p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-3.5 sm:p-5 bg-gradient-to-b from-purple-50/60 to-white rounded-2xl border border-purple-100 space-y-2 sm:space-y-3">
                <div className="p-2 sm:p-3 bg-white rounded-2xl shadow-sm border border-purple-100 flex items-center justify-center">
                  <img
                    src={generatedRadioOrder.qrCodeUrl}
                    alt={`QR Code ${generatedRadioOrder.id}`}
                    className="w-36 h-36 xs:w-40 xs:h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 object-contain"
                  />
                </div>
                <div className="text-center w-full px-2">
                  <span className="inline-block font-mono text-[11px] sm:text-xs font-black tracking-wider text-purple-900 bg-purple-100/90 px-3 py-0.5 rounded-full border border-purple-200">
                    {generatedRadioOrder.id}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">
                    À faire scanner en salle de radiologie / manipulateur
                  </p>
                </div>
              </div>

              {/* Details Card (Structured for small & large screens) */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-4 text-xs space-y-2.5 sm:space-y-3">
                
                {/* Patient row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-left">
                  <span className="text-slate-500 font-semibold text-[11px] sm:text-xs shrink-0">
                    Patient :
                  </span>
                  <strong className="text-slate-900 text-xs sm:text-sm sm:text-right">
                    {generatedRadioOrder.patientName} ({generatedRadioOrder.patientAge} ans)
                  </strong>
                </div>

                {/* Examen row (fixed wrapping) */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-left pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500 font-semibold text-[11px] sm:text-xs shrink-0">
                    Examen :
                  </span>
                  <span className="text-purple-700 font-black text-xs sm:text-sm sm:text-right leading-snug">
                    {generatedRadioOrder.type}
                  </span>
                </div>

                {/* Priorite row */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500 font-semibold text-[11px] sm:text-xs shrink-0">
                    Priorité :
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border ${
                    generatedRadioOrder.priority === 'vital' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                    generatedRadioOrder.priority === 'urgent' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    'bg-slate-200 text-slate-800 border-slate-300'
                  }`}>
                    {generatedRadioOrder.priority.toUpperCase()}
                  </span>
                </div>

                {/* Prescripteur row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-left pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500 font-semibold text-[11px] sm:text-xs shrink-0">
                    Prescripteur :
                  </span>
                  <span className="text-slate-700 font-bold text-xs sm:text-sm sm:text-right">
                    {generatedRadioOrder.doctor}
                  </span>
                </div>

                {/* Clinical Indication */}
                {generatedRadioOrder.clinicalIndication && (
                  <div className="pt-2 border-t border-slate-200/70 text-[10px] sm:text-[11px] text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                    <span className="not-italic font-bold text-slate-700 block mb-0.5">Motif clinique :</span>
                    "{generatedRadioOrder.clinicalIndication}"
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(generatedRadioOrder.id);
                    setCopiedToken(true);
                    setTimeout(() => setCopiedToken(false), 2000);
                  }}
                  className="py-2.5 sm:py-3 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedToken ? 'Copié !' : 'Copier Réf'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2.5 sm:py-3 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-purple-600/20 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer le Bon</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="bg-white border-t border-slate-200 py-3 px-4 text-center text-[11px] text-slate-400 mt-6">
        &copy; {new Date().getFullYear()} Health AI &bull; Dossier Médical Électronique Sécurisé &bull; {doctorDisplayName}
      </footer>
    </div>
  );
}

export default function DoctorConsultation() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    }>
      <ConsultationContent />
    </Suspense>
  );
}
