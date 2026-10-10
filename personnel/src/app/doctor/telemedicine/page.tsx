'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Heart,
  MessageSquare,
  Activity,
  Loader2,
  Send,
  Clock,
  User,
  Shield,
  Wifi,
  ChevronRight,
  FileText,
  AlertTriangle,
  Sparkles,
  Stethoscope,
  Bot,
  X,
  Maximize2,
  Phone,
  MoreVertical
} from 'lucide-react';
import DoctorTopBar from '@/components/doctor/DoctorTopBar';
import DoctorNavBar from '@/components/doctor/DoctorNavBar';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const waitingPatients = [
  {
    id: 1,
    name: 'Cheikh Tidiane Diop',
    age: 58,
    reason: 'Suivi HTA – tension élevée',
    waitTime: '14:00',
    priority: 'urgent',
    avatar: 'C',
  },
  {
    id: 2,
    name: 'Aminata Sall',
    age: 34,
    reason: 'Renouvellement ordonnance',
    waitTime: '14:30',
    priority: 'normal',
    avatar: 'A',
  },
  {
    id: 3,
    name: 'Ibrahima Wade',
    age: 45,
    reason: 'Bilan cardiaque post-infarctus',
    waitTime: '15:00',
    priority: 'normal',
    avatar: 'I',
  },
];

const chatInitial = [
  { sender: 'Patient', time: '14:02', text: "Docteur, j'ai bien pris mon traitement ce matin mais ma tension reste élevée." },
  { sender: 'Docteur', time: '14:03', text: "Entendu. Avez-vous mesuré votre tension il y a 30 minutes ?" },
];

const transcriptInitial = [
  "[14:00] Dr. Awa Ndiaye : Bonjour M. Diop. Comment vous sentez-vous ?",
  "[14:01] Cheikh Tidiane Diop : Bonjour docteur. J'ai encore des maux de tête importants et des vertiges.",
  "[14:02] Dr. Awa Ndiaye : Avez-vous pu relever votre tension artérielle avec votre tensiomètre connecté ?",
];

const aiSuggestions = [
  { label: 'Interaction médicamenteuse détectée', detail: "Amlodipine + Ibuprofène → risque d'inefficacité antihypertensive", level: 'warn' },
  { label: 'Diagnostic différentiel suggéré', detail: 'Hypertension artérielle résistante (stade II) — contrôle MAPA recommandé', level: 'info' },
  { label: 'Conduite à tenir (IA)', detail: 'Ajustement posologique Amlodipine 10mg + restriction sodée stricte', level: 'action' },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function DoctorTelemedicine() {
  const [inCall, setInCall] = useState(false);
  const [activePatient, setActivePatient] = useState<typeof waitingPatients[0] | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Panel tabs
  const [activeTab, setActiveTab] = useState<'vitals' | 'transcript' | 'chat' | 'ai'>('vitals');
  const [chatMessage, setChatMessage] = useState('');
  const [chatList, setChatList] = useState(chatInitial);
  const [transcript, setTranscript] = useState<string[]>(transcriptInitial);
  const [showMobileSide, setShowMobileSide] = useState(false);

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Call timer
  useEffect(() => {
    if (!inCall) { setCallDuration(0); return; }
    const t = setInterval(() => setCallDuration(d => d + 1), 1000);
    return () => clearInterval(t);
  }, [inCall]);

  // Simulated auto-transcript during call
  useEffect(() => {
    if (!inCall) return;
    const lines = [
      " [14:04] Cheikh Tidiane Diop : Oui, j'ai mesuré 165 sur 95 il y a quelques minutes.",
      " [14:05] Dr. Awa Ndiaye : C'est effectivement trop élevé. Avez-vous de la fièvre ou des nausées ?",
      " [14:06] Cheikh Tidiane Diop : Pas de fièvre docteur, mais de légères nausées au lever.",
    ];
    let cur = 0;
    const timer = setInterval(() => {
      if (cur < lines.length) {
        setTranscript(prev => [...prev, lines[cur]]);
        cur++;
      }
    }, 12000);
    return () => clearInterval(timer);
  }, [inCall]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleJoin = (patient: typeof waitingPatients[0]) => {
    setActivePatient(patient);
    setInCall(true);
  };

  const handleEndCall = () => {
    setInCall(false);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatList(prev => [...prev, {
      sender: 'Docteur',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      text: chatMessage,
    }]);
    setChatMessage('');
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-20 md:pb-0">
      <DoctorTopBar />
      <DoctorNavBar />

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div>
            <h1 className="font-black text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-2">
              <Video className="w-5 h-5 text-sky-600" />
              Salon de Téléconsultation
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">WebRTC chiffré de bout en bout · Norme HDS</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border ${
              inCall
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${inCall ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} />
              {inCall ? 'En cours' : 'En attente'}
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Shield className="w-3 h-3" />
              Sécurisé
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Layout ───────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-3 sm:px-5 lg:px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* LEFT: Waiting Room List (visible when not in call on mobile) */}
        <div className={`lg:col-span-3 space-y-3 ${inCall ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-sm text-slate-900">Salle d'Attente</h2>
                <p className="text-[11px] text-slate-500">{waitingPatients.length} patients en file</p>
              </div>
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black flex items-center justify-center">
                {waitingPatients.length}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {waitingPatients.map((p, i) => (
                <div key={p.id} className="p-3.5 hover:bg-slate-50/80 transition-colors group">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      p.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {p.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-extrabold text-xs text-slate-900 truncate">{p.name}</p>
                        {p.priority === 'urgent' && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 shrink-0">URGENT</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{p.reason}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <Clock className="w-3 h-3" />
                          {p.waitTime}
                        </span>
                        <button
                          onClick={() => handleJoin(p)}
                          className="flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-sky-600 text-white hover:bg-sky-500 transition-colors cursor-pointer"
                        >
                          <Video className="w-3 h-3" />
                          Rejoindre
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connection Quality */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm">
            <p className="text-xs font-extrabold text-slate-900 flex items-center gap-2 mb-3">
              <Wifi className="w-4 h-4 text-emerald-600" />
              Qualité de connexion
            </p>
            <div className="space-y-2">
              {[
                { label: 'Bande passante', value: '42 Mbps', color: 'text-emerald-700', bar: 'bg-emerald-500', pct: '80%' },
                { label: 'Latence WebRTC', value: '18ms', color: 'text-emerald-700', bar: 'bg-emerald-500', pct: '90%' },
                { label: 'Perte paquets', value: '0.2%', color: 'text-slate-700', bar: 'bg-blue-500', pct: '98%' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-[11px] mb-0.5">
                    <span className="text-slate-500 font-medium">{item.label}</span>
                    <span className={`font-extrabold ${item.color}`}>{item.value}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.bar}`} style={{ width: item.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER: Video Studio */}
        <div className="lg:col-span-6 flex flex-col gap-3">

          {/* Video Area */}
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden shadow-xl" style={{ minHeight: inCall ? '380px' : '260px' }}>

            {/* Patient Video Feed */}
            {inCall ? (
              videoEnabled ? (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-90"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop')` }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center">
                    <VideoOff className="w-7 h-7" />
                  </div>
                  <p className="text-xs text-slate-500">Flux vidéo patient désactivé</p>
                </div>
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 p-6">
                <div className="w-20 h-20 rounded-2xl bg-slate-800/80 text-sky-400 flex items-center justify-center">
                  <Video className="w-9 h-9" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-200">Aucune consultation en cours</p>
                  <p className="text-xs text-slate-500 mt-1">Sélectionnez un patient dans la salle d'attente pour démarrer</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-600 border border-slate-800 px-4 py-2 rounded-xl bg-slate-900/60">
                  <Shield className="w-3.5 h-3.5 text-sky-500" />
                  WebRTC E2E · Conforme HDS · Aucun enregistrement sans consentement
                </div>
              </div>
            )}

            {/* Overlay: Patient name tag */}
            {inCall && activePatient && (
              <div className="absolute bottom-20 left-4 z-10">
                <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-xl text-white text-xs font-bold">
                  {activePatient.name} · {activePatient.age} ans
                </div>
              </div>
            )}

            {/* PiP: Doctor local feed */}
            {inCall && videoEnabled && (
              <div className="absolute top-4 right-4 w-28 h-36 sm:w-32 sm:h-44 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl z-10">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600&auto=format&fit=crop')` }}
                />
                <div className="absolute bottom-1.5 left-1.5 bg-black/60 px-1.5 py-0.5 rounded text-[9px] text-white font-bold">Moi</div>
              </div>
            )}

            {/* Vitals HUD Overlay */}
            {inCall && (
              <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm border border-slate-700/80 p-3 rounded-xl space-y-1.5">
                <p className="text-[9px] text-sky-400 font-extrabold uppercase tracking-wider">Bio-capteurs IoT</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                  <Heart className="w-3.5 h-3.5 fill-red-500/20 animate-pulse" />
                  <span>82 bpm</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Activity className="w-3.5 h-3.5" />
                  <span>165 / 95 mmHg</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                  <span className="text-[10px] font-mono">SpO₂</span>
                  <span>98%</span>
                </div>
              </div>
            )}

            {/* Duration badge */}
            {inCall && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-mono font-bold text-white border border-slate-700">
                <span className="w-2 h-2 bg-red-500 rounded-full inline-block mr-1.5 animate-pulse" />
                {formatDuration(callDuration)}
              </div>
            )}

            {/* Call Controls Bar */}
            {inCall && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/70 backdrop-blur-md border border-slate-700 px-4 py-2.5 rounded-2xl shadow-2xl">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    audioEnabled ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-600 text-white'
                  }`}
                  title={audioEnabled ? 'Couper le micro' : 'Activer le micro'}
                >
                  {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    videoEnabled ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-600 text-white'
                  }`}
                  title={videoEnabled ? 'Désactiver la caméra' : 'Activer la caméra'}
                >
                  {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setScreenShare(!screenShare)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    screenShare ? 'bg-sky-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                  title="Partager l'écran"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowMobileSide(true)}
                  className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center lg:hidden cursor-pointer"
                  title="Panneau patient"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-slate-600" />
                <button
                  onClick={handleEndCall}
                  className="flex items-center gap-2 px-4 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-red-600/30"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span className="hidden sm:inline">Raccrocher</span>
                </button>
              </div>
            )}
          </div>

          {/* Post-call banner */}
          {!inCall && activePatient && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  {activePatient.avatar}
                </div>
                <div>
                  <p className="font-extrabold text-sm text-slate-900">Consultation terminée</p>
                  <p className="text-xs text-slate-500">{activePatient.name} · Durée : {formatDuration(callDuration)}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-colors cursor-pointer">
                <FileText className="w-3.5 h-3.5" />
                Rédiger CR
              </button>
            </motion.div>
          )}
        </div>

        {/* RIGHT: Patient Panel */}
        <div className={`lg:col-span-3 ${inCall ? 'hidden lg:flex flex-col gap-3' : 'hidden lg:flex flex-col gap-3'}`}>
          {activePatient ? (
            <>
              {/* Patient Info Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-700 text-white font-black text-lg flex items-center justify-center">
                    {activePatient.avatar}
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-slate-900">{activePatient.name}</p>
                    <p className="text-xs text-slate-500">{activePatient.age} ans · {activePatient.reason}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-3">
                  {[
                    { label: 'Dossier', value: 'DMP-2024-1882' },
                    { label: 'Assurance', value: 'IPM Sénégal' },
                    { label: 'Médecin Réf.', value: 'Dr. Diallo' },
                    { label: 'Dernière visite', value: '12 Sep 2026' },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-50 rounded-xl p-2.5">
                      <p className="text-[10px] text-slate-400 font-bold">{item.label}</p>
                      <p className="text-xs font-extrabold text-slate-800 mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabbed Panel */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col flex-1 overflow-hidden">
                {/* Tab Bar */}
                <div className="flex border-b border-slate-100">
                  {([
                    { key: 'vitals', label: 'Constantes', icon: Heart },
                    { key: 'transcript', label: 'Transcription', icon: Mic },
                    { key: 'chat', label: 'Chat', icon: MessageSquare },
                    { key: 'ai', label: 'IA', icon: Bot },
                  ] as const).map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 py-2.5 text-[10px] font-extrabold flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                          activeTab === tab.key
                            ? 'text-sky-700 border-b-2 border-sky-600 -mb-px'
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">

                  {/* Vitals */}
                  {activeTab === 'vitals' && (
                    <>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Bio-capteurs IoT Patient</p>
                      {[
                        { label: 'Fréquence Cardiaque', value: '82 bpm', icon: Heart, color: 'text-red-600', bg: 'bg-red-50', status: 'Normal' },
                        { label: 'Tension Artérielle', value: '165 / 95', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50', status: '⚠ Élevée' },
                        { label: 'SpO₂', value: '98 %', icon: Activity, color: 'text-sky-600', bg: 'bg-sky-50', status: 'Normal' },
                        { label: 'Glycémie', value: '1.02 g/L', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50', status: 'Normal' },
                      ].map(v => {
                        const Icon = v.icon;
                        return (
                          <div key={v.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-lg ${v.bg} ${v.color} flex items-center justify-center`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-500 font-bold">{v.label}</p>
                                <p className={`text-sm font-black ${v.color}`}>{v.value}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500">{v.status}</span>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {/* Transcript */}
                  {activeTab === 'transcript' && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Dictée vocale en continu</p>
                        {inCall && (
                          <span className="flex items-center gap-1 text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full animate-pulse">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            REC
                          </span>
                        )}
                      </div>
                      <div className="bg-slate-950 rounded-xl p-3 space-y-2 font-mono text-[10px] text-slate-400 leading-relaxed max-h-64 overflow-y-auto">
                        {transcript.map((line, i) => (
                          <p key={i} className="border-b border-slate-900/80 pb-1.5 last:border-0">{line}</p>
                        ))}
                        {inCall && (
                          <div className="flex items-center gap-2 text-slate-600 italic mt-3">
                            <Loader2 className="w-3 h-3 animate-spin text-sky-500" />
                            Écoute WebRTC active...
                          </div>
                        )}
                        <div ref={transcriptEndRef} />
                      </div>
                    </>
                  )}

                  {/* Chat */}
                  {activeTab === 'chat' && (
                    <div className="flex flex-col h-full" style={{ minHeight: '200px' }}>
                      <div className="flex-1 space-y-2 mb-3 max-h-52 overflow-y-auto">
                        {chatList.map((msg, i) => (
                          <div key={i} className={`flex flex-col ${msg.sender === 'Docteur' ? 'items-end' : 'items-start'}`}>
                            <p className="text-[9px] text-slate-400 font-bold mb-0.5">{msg.sender} · {msg.time}</p>
                            <p className={`px-3 py-2 rounded-xl text-xs max-w-[90%] leading-relaxed ${
                              msg.sender === 'Docteur'
                                ? 'bg-sky-600 text-white rounded-tr-none'
                                : 'bg-slate-100 text-slate-800 rounded-tl-none'
                            }`}>
                              {msg.text}
                            </p>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-100">
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={e => setChatMessage(e.target.value)}
                          placeholder="Message sécurisé..."
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
                        />
                        <button type="submit" className="w-8 h-8 rounded-xl bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center shrink-0 cursor-pointer">
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  )}

                  {/* AI Suggestions */}
                  {activeTab === 'ai' && (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <Bot className="w-4 h-4 text-purple-600" />
                        <p className="text-xs font-extrabold text-slate-900">Co-Pilote Médical IA</p>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-200">BETA</span>
                      </div>
                      <div className="space-y-2.5">
                        {aiSuggestions.map((s, i) => (
                          <div key={i} className={`p-3 rounded-xl border text-xs ${
                            s.level === 'warn'
                              ? 'bg-amber-50 border-amber-200'
                              : s.level === 'action'
                              ? 'bg-emerald-50 border-emerald-200'
                              : 'bg-blue-50 border-blue-200'
                          }`}>
                            <p className={`font-extrabold mb-1 ${
                              s.level === 'warn' ? 'text-amber-800' : s.level === 'action' ? 'text-emerald-800' : 'text-blue-800'
                            }`}>
                              {s.level === 'warn' && '⚠ '}{s.label}
                            </p>
                            <p className="text-[11px] text-slate-600 leading-relaxed">{s.detail}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 text-center mt-3 leading-relaxed">
                        Suggestions non-contraignantes · Décision clinique sous responsabilité du praticien.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6" />
              </div>
              <p className="font-extrabold text-sm text-slate-700">Aucun patient actif</p>
              <p className="text-xs text-slate-400 mt-1">Sélectionnez un patient dans la file d'attente pour afficher son dossier et ses constantes.</p>
            </div>
          )}
        </div>

      </main>

      {/* ── Mobile Bottom Sheet for Patient Panel ─────────────────────── */}
      <AnimatePresence>
        {showMobileSide && inCall && activePatient && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[9000] bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 max-h-[85vh] flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white font-black text-sm flex items-center justify-center">
                  {activePatient.avatar}
                </div>
                <div>
                  <p className="font-extrabold text-sm text-slate-900">{activePatient.name}</p>
                  <p className="text-[11px] text-slate-500">{activePatient.reason}</p>
                </div>
              </div>
              <button
                onClick={() => setShowMobileSide(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Vitals */}
            <div className="px-4 py-3 grid grid-cols-3 gap-2 border-b border-slate-100 shrink-0">
              {[
                { label: 'FC', value: '82 bpm', color: 'text-red-600' },
                { label: 'TA', value: '165/95', color: 'text-amber-600' },
                { label: 'SpO₂', value: '98%', color: 'text-sky-600' },
              ].map(v => (
                <div key={v.label} className="bg-slate-50 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] text-slate-400 font-bold">{v.label}</p>
                  <p className={`text-sm font-black mt-0.5 ${v.color}`}>{v.value}</p>
                </div>
              ))}
            </div>

            {/* Chat in sheet */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatList.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'Docteur' ? 'items-end' : 'items-start'}`}>
                  <p className="text-[9px] text-slate-400 font-bold mb-0.5">{msg.sender} · {msg.time}</p>
                  <p className={`px-3 py-2 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                    msg.sender === 'Docteur'
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendChat} className="flex gap-2 px-4 pb-6 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                placeholder="Message sécurisé..."
                className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
              />
              <button type="submit" className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center cursor-pointer">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
