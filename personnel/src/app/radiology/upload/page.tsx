'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  ShieldCheck,
  EyeOff,
  FileText,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  FileBadge,
  Sparkles,
  Lock,
  X,
  FolderOpen,
  Image as ImageIcon,
  Database,
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  RotateCw,
  Layers,
  HardDrive,
  Zap,
  Eye,
  CloudUpload
} from 'lucide-react';
import Link from 'next/link';
import RadiologyTopBar from '@/components/radiology/RadiologyTopBar';
import RadiologyNavBar from '@/components/radiology/RadiologyNavBar';

interface UploadFile {
  id: string;
  file: File;
  preview?: string;
  status: 'pending' | 'anonymizing' | 'uploading' | 'done' | 'error';
  progress: number;
}

type UploadStep = 'form' | 'anonymizing' | 'uploading' | 'success';

export default function RadiologyUpload() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [examType, setExamType] = useState('RX_THORAX');
  const [patientId, setPatientId] = useState('P-103');
  const [patientName, setPatientName] = useState('Cheikh Tidiane Diop');
  const [modality, setModality] = useState<'RX' | 'TDM' | 'IRM' | 'ECO'>('RX');
  const [notes, setNotes] = useState('');
  const [anonymizeEnabled, setAnonymizeEnabled] = useState(true);
  const [step, setStep] = useState<UploadStep>('form');
  const [globalProgress, setGlobalProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Drag & Drop handlers ──────────────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const addFilesToQueue = (newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles);
    const uploadFiles: UploadFile[] = arr.map(f => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      file: f,
      status: 'pending',
      progress: 0,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined
    }));
    setFiles(prev => [...prev, ...uploadFiles]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      addFilesToQueue(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToQueue(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  // ── Simulate Upload (Anonymisation → Chiffrement → Envoi PACS) ────
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      alert('Veuillez sélectionner au moins un fichier DICOM ou une image à téléverser.');
      return;
    }

    // Phase 1: Anonymisation côté client (Shift-Left)
    setStep('anonymizing');
    setCurrentPhase('Anonymisation des métadonnées DICOM (Shift-Left)...');
    setGlobalProgress(0);

    await simulateDelay(400);
    setGlobalProgress(20);
    await simulateDelay(400);
    setGlobalProgress(45);
    setCurrentPhase('Hachage SHA-256 des identifiants sensibles...');
    await simulateDelay(500);
    setGlobalProgress(65);

    // Phase 2: Chiffrement & envoi
    setStep('uploading');
    setCurrentPhase('Chiffrement AES-256 & envoi sécurisé vers PACS...');
    setGlobalProgress(70);
    await simulateDelay(500);

    setCurrentPhase('Indexation DICOM sur serveur OrthanC...');
    setGlobalProgress(85);
    await simulateDelay(600);

    setCurrentPhase('Synchronisation avec le Dossier Médical Partagé (DMP)...');
    setGlobalProgress(95);
    await simulateDelay(500);
    setGlobalProgress(100);

    // Phase 3: Succès
    setStep('success');
    setCurrentPhase('Archivage HDS certifié. Transmission terminée.');
    setFiles(prev => prev.map(f => ({ ...f, status: 'done', progress: 100 })));
  };

  const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const reset = () => {
    setFiles([]);
    setStep('form');
    setGlobalProgress(0);
    setCurrentPhase('');
    setPatientId('P-103');
    setPatientName('Cheikh Tidiane Diop');
    setNotes('');
  };

  // ── Computed DICOM Metadata (original vs anonymized) ──────────────
  const originalMeta = {
    nom: patientName || 'Cheikh Tidiane Diop',
    numSS: '1 67 02 201 021 54',
    dateNaissance: '12/04/1959',
    etablissement: 'Clinique Dakar Plateau - Bloc B',
    equipement: 'GE Optima CT660',
  };
  const anonymizedMeta = {
    nom: `ANON_${patientId.replace('-', '_')}`,
    numSS: 'X XX XX XXX XXX XX',
    dateNaissance: 'XX/XX/1959',
    etablissement: 'Région: Dakar [MASQUÉ]',
    equipement: 'GE Optima CT660',
  };

  const modalityLabel: Record<string, string> = {
    'RX': 'Radiographie (RX)',
    'TDM': 'Scanner TDM',
    'IRM': 'IRM',
    'ECO': 'Échographie'
  };

  const examOptions = [
    { value: 'RX_THORAX', label: 'Radiographie Pulmonaire – Face & Profil' },
    { value: 'RX_GENOU', label: 'Radiographie Genou – Profil' },
    { value: 'RX_CHEVILLE', label: 'Radiographie Cheville' },
    { value: 'TDM_THORAX', label: 'Scanner Thoraco-Abdominal C+' },
    { value: 'TDM_CRANE', label: 'Scanner Cérébral Sans Injection' },
    { value: 'IRM_LOMBAIRE', label: 'IRM Rachis Lombaire' },
    { value: 'IRM_CERVEAU', label: 'IRM Cérébrale Fonctionnelle' },
    { value: 'ECO_ABDOMEN', label: 'Échographie Abdominale' },
  ];

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 flex flex-col pb-24 md:pb-8">

      {/* ── Standard TopBar ──────────────────────────────────────── */}
      <RadiologyTopBar />

      {/* ── Standard NavBar ──────────────────────────────────────── */}
      <RadiologyNavBar />

      {/* ── Page Header ──────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/radiology/dashboard"
              className="h-9 w-9 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-600 flex items-center justify-center border border-slate-200 transition-colors shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="font-black text-base sm:text-xl text-slate-900 tracking-tight">
                Passerelle d'Import DICOM
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                Téléversement sécurisé &bull; Anonymisation Shift-Left &bull; Archivage PACS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Protocole Shift-Left Actif
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
              <Lock className="w-3 h-3" />
              AES-256 + HDS
            </span>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto w-full px-3 sm:px-6 py-5 sm:py-6 space-y-5">

        {/* ── SUCCESS STATE ───────────────────────────────────────── */}
        <AnimatePresence>
          {step === 'success' && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h2 className="font-black text-xl text-slate-900">Import DICOM Réussi !</h2>
                <p className="text-sm text-slate-500">
                  {files.length} fichier{files.length > 1 ? 's' : ''} archivé{files.length > 1 ? 's' : ''} dans le système PACS avec anonymisation HDS complète.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-xs">
                {[
                  { icon: ShieldCheck, label: 'Anonymisation Shift-Left', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
                  { icon: HardDrive, label: 'Indexé sur OrthanC PACS', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
                  { icon: Database, label: 'Synchronisé avec le DMP', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border ${s.bg}`}>
                      <Icon className={`w-5 h-5 ${s.color}`} />
                      <span className={`font-bold ${s.color} text-center leading-tight`}>{s.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Files uploaded list */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 divide-y divide-slate-100 text-left max-w-lg mx-auto">
                {files.map(f => (
                  <div key={f.id} className="flex items-center gap-3 px-4 py-2.5 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="truncate text-slate-700 font-semibold flex-1">{f.file.name}</span>
                    <span className="text-slate-400 shrink-0">{(f.file.size / 1024 / 1024).toFixed(1)} Mo</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/radiology/dashboard"
                  className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour au Dashboard
                </Link>
                <button
                  type="button"
                  onClick={reset}
                  className="h-11 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Nouveau Téléversement
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── UPLOAD PROGRESS STATE ───────────────────────────────── */}
        <AnimatePresence>
          {(step === 'anonymizing' || step === 'uploading') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  {step === 'anonymizing' ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : (
                    <CloudUpload className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {step === 'anonymizing' ? 'Anonymisation en cours...' : 'Téléversement PACS en cours...'}
                  </h3>
                  <p className="text-[11px] text-slate-400">{currentPhase}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Progression globale</span>
                  <span>{globalProgress}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <motion.div
                    animate={{ width: `${globalProgress}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_0_10px_rgba(124,58,237,0.4)]"
                  />
                </div>
              </div>

              {/* Phases */}
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Anonymisation DICOM Header (RDEI)', done: globalProgress >= 45 },
                  { label: 'Hachage SHA-256 des identifiants', done: globalProgress >= 65 },
                  { label: 'Chiffrement AES-256 & Envoi TLS', done: globalProgress >= 85 },
                  { label: 'Indexation PACS & Sync DMP', done: globalProgress >= 100 },
                ].map(ph => (
                  <div key={ph.label} className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${ph.done ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    {ph.done ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-slate-400 animate-spin shrink-0" />
                    )}
                    <span className="font-semibold">{ph.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FORM STATE ──────────────────────────────────────────── */}
        {step === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

            {/* LEFT: Upload Form */}
            <div className="lg:col-span-7 space-y-4">

              {/* 1. Zone de dépôt DICOM */}
              <section className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Fichiers à importer</h3>
                    <p className="text-[11px] text-slate-400">DICOM (.dcm), PNG, JPG, JPEG – max 50 Mo/fichier</p>
                  </div>
                </div>

                {/* Dropzone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
                    isDragOver
                      ? 'border-purple-500 bg-purple-50/70'
                      : 'border-slate-300 hover:border-purple-400 bg-slate-50/70 hover:bg-purple-50/30'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".dcm,.png,.jpg,.jpeg"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <div className="space-y-3">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mx-auto transition-colors ${isDragOver ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}`}>
                      <FileBadge className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className={`font-extrabold text-sm ${isDragOver ? 'text-purple-700' : 'text-slate-700'}`}>
                        {isDragOver ? 'Relâchez pour ajouter les fichiers' : 'Glissez-déposez vos clichés DICOM ici'}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        ou <span className="text-purple-600 font-bold underline underline-offset-2">cliquez pour parcourir</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400">
                      <span className="px-2 py-0.5 bg-slate-100 rounded-full">.DCM</span>
                      <span className="px-2 py-0.5 bg-slate-100 rounded-full">.PNG</span>
                      <span className="px-2 py-0.5 bg-slate-100 rounded-full">.JPG</span>
                    </div>
                  </div>
                </div>

                {/* File Queue */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {files.length} fichier{files.length > 1 ? 's' : ''} en file d'attente
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {files.map(f => (
                        <div key={f.id} className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                          {f.preview ? (
                            <div
                              className="h-10 w-10 rounded-lg bg-black bg-cover bg-center shrink-0 border border-slate-300"
                              style={{ backgroundImage: `url(${f.preview})`, filter: 'grayscale(60%)' }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate">{f.file.name}</p>
                            <p className="text-[10px] text-slate-400">{(f.file.size / 1024 / 1024).toFixed(2)} Mo &bull; {f.file.type || 'DICOM'}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(f.id)}
                            className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* 2. Formulaire Clinique */}
              <section className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">Informations Cliniques</h3>
                </div>

                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                        Patient (Nom ou ID)
                      </label>
                      <input
                        type="text"
                        value={patientName}
                        onChange={e => setPatientName(e.target.value)}
                        placeholder="Cheikh Tidiane Diop"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 transition-colors font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                        ID Patient (Registre)
                      </label>
                      <input
                        type="text"
                        required
                        value={patientId}
                        onChange={e => setPatientId(e.target.value)}
                        placeholder="Ex: P-103"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 transition-colors font-mono font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                        Modalité
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(['RX', 'TDM', 'IRM', 'ECO'] as const).map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setModality(m)}
                            className={`py-2 rounded-xl text-[11px] font-extrabold text-center transition-all cursor-pointer ${
                              modality === m
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                        Type d'examen
                      </label>
                      <select
                        value={examType}
                        onChange={e => setExamType(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600 transition-colors cursor-pointer"
                      >
                        {examOptions.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                      Notes cliniques complémentaires (optionnel)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Indication clinique, précautions, contexte de l'examen..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {/* Anonymisation Toggle */}
                  <div className={`p-4 rounded-2xl border transition-colors ${anonymizeEnabled ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${anonymizeEnabled ? 'bg-emerald-600 text-white' : 'bg-rose-200 text-rose-700'}`}>
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className={`text-xs font-extrabold ${anonymizeEnabled ? 'text-emerald-900' : 'text-rose-900'}`}>
                            Anonymisation Shift-Left (Recommandée)
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {anonymizeEnabled
                              ? 'Les métadonnées DICOM sont anonymisées dans votre navigateur avant envoi. Aucune donnée sensible en clair n\'atteint le cloud (CDP Sénégal).'
                              : '⚠️ Désactivé — Vos données patient seront transmises en clair. Cela expose l\'établissement à des infractions RGPD / CDP.'}
                          </p>
                        </div>
                      </div>

                      {/* Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => setAnonymizeEnabled(!anonymizeEnabled)}
                        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 mt-1 ${anonymizeEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${anonymizeEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-1">
                    <Link
                      href="/radiology/dashboard"
                      className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Annuler</span>
                    </Link>
                    <button
                      type="submit"
                      disabled={files.length === 0}
                      className="flex-1 h-11 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        {anonymizeEnabled
                          ? `Anonymiser & Téléverser (${files.length} fichier${files.length > 1 ? 's' : ''})`
                          : `Téléverser (Non-anonymisé – ${files.length} fichier${files.length > 1 ? 's' : ''})`}
                      </span>
                    </button>
                  </div>

                </form>
              </section>

            </div>

            {/* RIGHT: Aperçu Anonymisation + Infos Sécurité */}
            <div className="lg:col-span-5 space-y-4">

              {/* Anonymization Preview Panel */}
              <section className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Aperçu de l'Anonymisation</h4>
                    <p className="text-[11px] text-slate-400">DICOM Header &bull; Avant vs. Après traitement</p>
                  </div>
                </div>

                {anonymizeEnabled ? (
                  <div className="space-y-3">
                    {/* Original */}
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider">
                          Données originales (en clair)
                        </span>
                      </div>
                      <div className="text-[11px] font-mono space-y-1 text-slate-700">
                        {Object.entries(originalMeta).map(([key, val]) => (
                          <div key={key} className="flex gap-2 items-baseline">
                            <span className="text-slate-400 shrink-0 w-24">{key}:</span>
                            <span className="font-bold text-rose-700">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Shift-Left anonymization</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Anonymized */}
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
                          Transmis vers PACS (anonymisé)
                        </span>
                      </div>
                      <div className="text-[11px] font-mono space-y-1 text-slate-700">
                        {Object.entries(anonymizedMeta).map(([key, val]) => (
                          <div key={key} className="flex gap-2 items-baseline">
                            <span className="text-slate-400 shrink-0 w-24">{key}:</span>
                            <span className="font-extrabold text-emerald-700">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center space-y-3">
                    <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 opacity-70" />
                    <h4 className="font-bold text-sm text-slate-700">Anonymisation désactivée</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      L'établissement est exposé à des infractions réglementaires de protection des données de santé (CDP Sénégal / RGPD).
                    </p>
                    <button
                      type="button"
                      onClick={() => setAnonymizeEnabled(true)}
                      className="text-xs font-bold text-purple-700 underline underline-offset-2 cursor-pointer"
                    >
                      Réactiver l'anonymisation
                    </button>
                  </div>
                )}
              </section>

              {/* Security Info Card */}
              <section className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-purple-600" />
                  Conformité & Sécurité
                </h4>
                <div className="space-y-2 text-xs">
                  {[
                    { icon: ShieldCheck, label: 'Shift-Left : anonymisation locale avant envoi', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
                    { icon: Lock, label: 'Chiffrement TLS 1.3 + AES-256 en transit', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
                    { icon: Database, label: 'Serveur certifié HDS (Hébergeur Données Santé)', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
                    { icon: CheckCircle, label: 'Conforme CDP Sénégal & RGPD', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
                  ].map(s => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${s.bg}`}>
                        <Icon className={`w-4 h-4 ${s.color} shrink-0`} />
                        <span className={`font-semibold ${s.color}`}>{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* PACS Quota Card */}
              <section className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-slate-600" />
                  Capacité PACS
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Espace utilisé</span>
                    <span>438 Go / 2 To</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full w-[22%] bg-purple-600 rounded-full" />
                  </div>
                  <p className="text-[10px] text-slate-400">22% utilisé — 1.58 To disponibles sur OrthanC HDS</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {[
                    { label: 'Examens', value: '2 847', color: 'text-purple-700' },
                    { label: 'Séries', value: '14 230', color: 'text-slate-700' },
                    { label: 'Clichés', value: '68 492', color: 'text-slate-700' },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-50 border border-slate-200 rounded-xl py-2">
                      <p className={`font-black text-sm ${s.color}`}>{s.value}</p>
                      <p className="text-[10px] text-slate-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              </section>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
