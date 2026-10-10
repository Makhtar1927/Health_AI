'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  ShieldCheck,
  Building2,
  Award,
  LogOut,
  Mail,
  Phone,
  CheckCircle2,
  Stethoscope,
  Video,
  Bot,
  Save,
  ArrowLeft,
  Lock,
  Fingerprint,
  Camera,
  Edit3,
  Clock,
  Laptop,
  Key,
  ChevronRight,
  Bell,
  Activity,
  AlertTriangle,
  BadgeCheck,
  Sparkles
} from 'lucide-react';
import DoctorTopBar from '@/components/doctor/DoctorTopBar';
import DoctorNavBar from '@/components/doctor/DoctorNavBar';
import { useAuthStore } from '@/lib/authStore';

type TabKey = 'general' | 'clinic' | 'ai' | 'security';

const TABS: { key: TabKey; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'general',  label: 'Identité',  icon: User,        color: 'emerald' },
  { key: 'clinic',   label: 'Cabinet',   icon: Building2,   color: 'blue'    },
  { key: 'ai',       label: 'Co-Pilote', icon: Bot,         color: 'purple'  },
  { key: 'security', label: 'Sécurité',  icon: ShieldCheck, color: 'rose'    },
];

export default function DoctorProfilePage() {
  const router  = useRouter();
  const { user, logout } = useAuthStore();

  const [activeTab, setActiveTab]           = useState<TabKey>('general');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess]       = useState(false);
  const [editMode, setEditMode]             = useState(false);

  const [form, setForm] = useState({
    title:            'Dr.',
    firstName:        user?.name?.split(' ')[0]              ?? 'Oumy',
    lastName:         user?.name?.split(' ').slice(1).join(' ') || 'Aidara',
    specialty:        'Cardiologue & Médecin Urgentiste',
    orderNumber:      'OM-SN-2018-8842',
    rpps:             '10048291038',
    email:            user?.email                            ?? 'oumy@gmail.com',
    phone:            '+221 77 654 32 10',
    hospital:         user?.details?.hospital                ?? "Hôpital Principal de Dakar",
    department:       user?.details?.department              ?? "Cardiologie & Médecine d'Urgence",
    boxNumber:        'Box N° 4 — Pavillon B',
    avgDuration:      '20 min',
    telemedicine:     true,
    aiInteractions:   true,
    aiPacs:           true,
    aiTts:            true,
    aiDiagnostic:     true,
    twoFactor:        true,
  });

  const fullName = `${form.title} ${form.firstName} ${form.lastName}`;
  const initials = `${form.firstName[0] ?? 'O'}${form.lastName[0] ?? 'A'}`;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditMode(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  // ─── Input helper ────────────────────────────────────────────────────────
  const Field = ({
    label, value, field, type = 'text', disabled = false
  }: {
    label: string; value: string; field: keyof typeof form;
    type?: string; disabled?: boolean;
  }) => (
    <div>
      <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        disabled={disabled || !editMode}
        onChange={e => setForm({ ...form, [field]: e.target.value })}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all
          ${disabled
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed font-mono'
            : editMode
            ? 'bg-white border-emerald-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm'
            : 'bg-slate-50 border-slate-200 text-slate-700 focus:outline-none cursor-default'
          }`}
      />
    </div>
  );

  // ─── Toggle helper ───────────────────────────────────────────────────────
  const Toggle = ({
    label, desc, field, accentColor = 'emerald'
  }: {
    label: string; desc: string; field: keyof typeof form; accentColor?: string;
  }) => {
    const checked = form[field] as boolean;
    return (
      <label className="flex items-start justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-white transition-colors group">
        <div className="space-y-0.5 pr-4">
          <p className="text-sm font-extrabold text-slate-900 group-hover:text-slate-800">{label}</p>
          <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>
        </div>
        <div
          onClick={() => setForm({ ...form, [field]: !checked })}
          className={`relative w-11 h-6 rounded-full transition-colors shrink-0 mt-0.5 cursor-pointer ${
            checked ? `bg-${accentColor}-500` : 'bg-slate-300'
          }`}
        >
          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
            checked ? 'left-6' : 'left-1'
          }`} />
        </div>
      </label>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-24 md:pb-10">
      <DoctorTopBar />
      <DoctorNavBar />

      {/* ── Page Hero ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            {/* Avatar + upload */}
            <div className="relative shrink-0 self-start sm:self-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-3xl shadow-lg ring-4 ring-white">
                {initials}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                <Camera className="w-3.5 h-3.5" />
              </button>
              <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white fill-white" />
              </span>
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    {fullName}
                  </h1>
                  <p className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                    <Stethoscope className="w-4 h-4 shrink-0" />
                    {form.specialty}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {form.hospital}
                    </span>
                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      RPPS {form.rpps}
                    </span>
                  </div>
                </div>

                {/* Edit / Save buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <AnimatePresence mode="wait">
                    {saveSuccess && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Enregistré
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {editMode ? (
                    <button
                      onClick={handleSave as any}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all shadow-sm cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Sauvegarder
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-all cursor-pointer border border-slate-200"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Modifier
                    </button>
                  )}

                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 text-xs font-extrabold transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Se déconnecter de la session praticien"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* KPI strips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-5 border-t border-slate-100">
            {[
              { label: 'Patients vus', value: '18', sub: 'cette vacation', color: 'text-emerald-700' },
              { label: 'En attente',   value: '6',  sub: 'file active',    color: 'text-amber-600'  },
              { label: 'Accréditation', value: 'HDS Niv.3', sub: "Valide 2027", color: 'text-blue-700'  },
              { label: 'N° Ordre',     value: form.orderNumber, sub: 'Enregistré ONMS', color: 'text-purple-700' },
            ].map(k => (
              <div key={k.label} className="bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{k.label}</p>
                <p className={`text-sm font-black mt-0.5 truncate ${k.color}`}>{k.value}</p>
                <p className="text-[10px] text-slate-400 font-medium truncate">{k.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Bar ────────────────────────────────────────────────────────── */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-14 md:top-28 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center overflow-x-auto no-scrollbar gap-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-xs font-extrabold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? `border-emerald-600 text-emerald-700`
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.key === 'security' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab Content ───────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">

        {/* ════════════ TAB: Identité ════════════ */}
        {activeTab === 'general' && (
          <form onSubmit={handleSave} className="space-y-5">
            {/* Section: Identité civile */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm text-slate-900">Identité du Praticien</h2>
                  <p className="text-[11px] text-slate-400">Données déclarées auprès de l'Ordre National des Médecins</p>
                </div>
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Registre Vérifié
                </span>
              </div>

              <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Titre"   value={form.title}     field="title" />
                <Field label="Prénom"  value={form.firstName} field="firstName" />
                <Field label="Nom"     value={form.lastName}  field="lastName" />
              </div>
              <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Spécialité Principale"   value={form.specialty}    field="specialty" />
                <Field label="N° Ordre (ONMS)"         value={form.orderNumber}  field="orderNumber" disabled />
              </div>

              <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                    Email Professionnel
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={form.email}
                      disabled={!editMode}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        editMode
                          ? 'bg-white border-emerald-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 cursor-default focus:outline-none'
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                    Téléphone de Garde
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={form.phone}
                      disabled={!editMode}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        editMode
                          ? 'bg-white border-emerald-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 cursor-default focus:outline-none'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Accréditations */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm text-slate-900">Accréditations & Clé de Signature</h2>
                  <p className="text-[11px] text-slate-400">Certificats eIDAS + habilitation HDS hospitalière</p>
                </div>
              </div>

              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs text-slate-900">Signature Biométrique Active</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Clé cryptographique eIDAS intégrée pour ordonnances certifiées.</p>
                    <span className="inline-block mt-2 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Cert. #8842-SN-OK · Valide 2027
                    </span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs text-slate-900">Habilitation Hospitalière HDS</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Accès certifié DMP & imagerie PACS haute résolution.</p>
                    <span className="inline-block mt-2 text-[9px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      {form.hospital}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {editMode && (
              <div className="flex justify-end">
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
                  <Save className="w-4 h-4" />
                  Enregistrer les modifications
                </button>
              </div>
            )}
          </form>
        )}

        {/* ════════════ TAB: Cabinet ════════════ */}
        {activeTab === 'clinic' && (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm text-slate-900">Configuration du Cabinet & Box</h2>
                  <p className="text-[11px] text-slate-400">Affectation clinique et flux des patients</p>
                </div>
              </div>

              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Établissement de rattachement" value={form.hospital}    field="hospital" />
                <Field label="Service Médical"               value={form.department}  field="department" />
                <Field label="Numéro de Box / Bureau"        value={form.boxNumber}   field="boxNumber" />
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                    Durée estimée par patient
                  </label>
                  <select
                    value={form.avgDuration}
                    disabled={!editMode}
                    onChange={e => setForm({ ...form, avgDuration: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      editMode
                        ? 'bg-white border-emerald-400 text-slate-900 focus:outline-none'
                        : 'bg-slate-50 border-slate-200 text-slate-700 cursor-default focus:outline-none'
                    }`}
                  >
                    <option value="15 min">15 minutes (Contrôle rapide)</option>
                    <option value="20 min">20 minutes (Standard)</option>
                    <option value="30 min">30 minutes (Bilan approfondi)</option>
                  </select>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-slate-100">
                <Toggle
                  label="Téléconsultations Vidéo"
                  desc="Ouvre la salle de consultation virtuelle sécurisée pour patients distants."
                  field="telemedicine"
                  accentColor="blue"
                />
              </div>
            </div>

            {editMode && (
              <div className="flex justify-end">
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
                  <Save className="w-4 h-4" />
                  Enregistrer les paramètres
                </button>
              </div>
            )}
          </form>
        )}

        {/* ════════════ TAB: Co-Pilote IA ════════════ */}
        {activeTab === 'ai' && (
          <form onSubmit={handleSave} className="space-y-5">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-2xl p-5 text-white flex items-center gap-4 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-black text-base">Co-Pilote Médical IA — Gemini Health</h2>
                <p className="text-purple-200 text-xs mt-0.5">Assistance diagnostique & vérification pharmacologique en temps réel</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-extrabold text-sm text-slate-900">Modules actifs</h3>
                <p className="text-[11px] text-slate-400">Configurez les assistances automatiques pendant vos consultations</p>
              </div>
              <div className="p-5 space-y-3">
                <Toggle
                  label="Alertes d'Interactions Médicamenteuses"
                  desc="Bloque et signale automatiquement les contre-indications majeures lors de la prescription."
                  field="aiInteractions"
                  accentColor="purple"
                />
                <Toggle
                  label="Pré-diagnostic automatique sur imagerie PACS"
                  desc="Détection des lésions parenchymateuses dès la réception d'un cliché DICOM."
                  field="aiPacs"
                  accentColor="purple"
                />
                <Toggle
                  label="Synthèse Vocale & Appel automatique des patients"
                  desc="Diffuse l'appel du patient en salle d'attente lors du clic sur « Appeler au Box »."
                  field="aiTts"
                  accentColor="purple"
                />
                <Toggle
                  label="Suggestions de diagnostics différentiels"
                  desc="Propose des hypothèses basées sur les symptômes saisis dans l'anamnèse."
                  field="aiDiagnostic"
                  accentColor="purple"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Les suggestions de l'IA sont non-contraignantes. La décision clinique reste sous la seule responsabilité du praticien.
            </p>

            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
                <Save className="w-4 h-4" />
                Sauvegarder les préférences IA
              </button>
            </div>
          </form>
        )}

        {/* ════════════ TAB: Sécurité ════════════ */}
        {activeTab === 'security' && (
          <div className="space-y-5">

            {/* Auth status */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm text-slate-900">Authentification & Sécurité HDS</h2>
                  <p className="text-[11px] text-slate-400">Norme de confidentialité des données de santé</p>
                </div>
              </div>

              <div className="p-5 space-y-3">
                {[
                  {
                    icon: Key,
                    label: 'Double Authentification (2FA)',
                    desc: 'Validation par code SMS ou clé FIDO2 à chaque connexion.',
                    status: 'Activé',
                    statusColor: 'bg-emerald-100 text-emerald-800',
                  },
                  {
                    icon: Laptop,
                    label: 'Session Médicale Active',
                    desc: 'Terminal Box 4 — Pavillon B (IP: 192.168.1.45)',
                    status: 'Exp. 8h',
                    statusColor: 'bg-slate-100 text-slate-700',
                  },
                  {
                    icon: Bell,
                    label: 'Alertes de connexion',
                    desc: "Notification par email lors d'une connexion depuis un nouvel appareil.",
                    status: 'Actif',
                    statusColor: 'bg-emerald-100 text-emerald-800',
                  },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center shrink-0 shadow-xs">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-extrabold text-xs text-slate-900">{item.label}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 ml-3 ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Danger Zone: Logout */}
            <div className="bg-gradient-to-br from-rose-50 to-white border-2 border-rose-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20 shrink-0">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-rose-950">Déconnexion de la Session Praticien</h3>
                  <p className="text-xs text-rose-800/80 mt-1 leading-relaxed max-w-lg">
                    La déconnexion ferme immédiatement votre accès aux dossiers médicaux partagés, désactive la clé de signature électronique et libère votre box de consultation.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-white/80 border border-rose-200/60 rounded-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs text-slate-700">Tous les dossiers de votre vacation sont sauvegardés et synchronisés.</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">Sync: il y a 1 min</span>
              </div>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-sm transition-all cursor-pointer shadow-lg shadow-rose-600/25 w-full sm:w-auto justify-center sm:justify-start"
              >
                <LogOut className="w-4 h-4" />
                Se Déconnecter de la Session Praticien
              </button>
            </div>

          </div>
        )}
      </main>

      {/* ── Logout Confirmation Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.95, y: 10  }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-5"
            >
              <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  <LogOut className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Confirmer la Déconnexion ?</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Vous allez quitter la session de <strong className="text-slate-800">{fullName}</strong>. Vos prescriptions en cours sont sauvegardées automatiquement.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="py-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={handleLogout}
                  className="py-3 rounded-xl bg-rose-600 hover:bg-rose-700 font-black text-xs text-white shadow-md shadow-rose-600/20 transition-colors cursor-pointer"
                >
                  Déconnecter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
