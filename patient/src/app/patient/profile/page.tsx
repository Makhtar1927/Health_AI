'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  MapPin,
  Shield,
  AlertTriangle,
  Save,
  CheckCircle2,
  Lock,
  Edit3,
  Copy,
  Check,
  ShieldCheck,
  Mail,
  Calendar,
  HeartPulse,
  Droplets,
  AlertCircle,
  Building2,
  Stethoscope,
  Activity,
  FileText,
  ChevronRight,
  X,
  Syringe,
  Weight,
  Ruler,
  Clock,
  Star,
  Info,
  Camera,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';

type Tab = 'info' | 'medical' | 'security';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  birthDate: string;
  gender: string;
  weight: string;
  height: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  insuranceName: string;
  insuranceNumber: string;
  insuranceCoverage: string;
  allergies: string[];
  medicalHistory: string[];
  treatingDoctor: string;
  treatingSpecialty: string;
  treatingClinic: string;
}

export default function PatientProfile() {
  const router = useRouter();
  const { user, initialize, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedVitalId, setCopiedVitalId] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: 'AZERTY',
    lastName: '',
    phone: '+221 77 123 45 67',
    email: 'azerty@healthai.sn',
    address: 'Fann Residence, Rue des Ambassades, Dakar',
    bloodGroup: 'O+',
    birthDate: '15 Avril 1996',
    gender: 'Homme',
    weight: '78 kg',
    height: '1m75',
    emergencyContactName: 'Amina Diop',
    emergencyContactRelation: 'Epouse',
    emergencyContactPhone: '+221 78 987 65 43',
    insuranceName: 'IPM Entreprises Dakar',
    insuranceNumber: 'POL-773-DKR',
    insuranceCoverage: '80%',
    allergies: ['Penicilline', 'Arachides'],
    medicalHistory: [
      'Hypertension arterielle legere',
      'Appendicectomie (2018)',
      'Diabete type 2 (surveille)',
    ],
    treatingDoctor: 'Dr. Abdoulaye Diallo',
    treatingSpecialty: 'Medecine Generale',
    treatingClinic: 'Cabinet Medical Sunu - Dakar',
  });

  useEffect(() => {
    initialize();
    setMounted(true);
  }, [initialize]);

  if (!mounted) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white animate-pulse">
            <User className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  const patientName =
    user?.name || `${formData.firstName} ${formData.lastName}`.trim() || 'AZERTY';
  const vitalId = user?.details?.vitalId || 'SN-807F16';
  const initials = patientName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const age = 30;

  const handleCopyId = () => {
    navigator.clipboard.writeText(vitalId);
    setCopiedVitalId(true);
    setTimeout(() => setCopiedVitalId(false), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const inputCls = (editing: boolean) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-slate-800 focus:outline-none transition-colors ${
      editing
        ? 'border-teal-400 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
        : 'border-slate-200 bg-slate-50 cursor-default'
    }`;

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'info', label: 'Informations', icon: User },
    { key: 'medical', label: 'Medical', icon: HeartPulse },
    { key: 'security', label: 'Securite', icon: Shield },
  ];

  const bmi = 78 / (1.75 * 1.75);
  const bmiLabel =
    bmi < 18.5 ? 'Maigreur' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Surpoids' : 'Obesite';
  const bmiColor = bmi < 25 ? 'text-emerald-700' : 'text-amber-700';

  return (
    <div className="min-h-full bg-slate-50 pb-20 text-slate-900">

      {/* HERO */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 pt-6 pb-0">
        <div className="max-w-5xl mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-end gap-5 pb-5 border-b border-slate-100">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-extrabold text-3xl shadow-lg shadow-teal-600/20">
                {initials}
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer shadow-sm"
              >
                <Camera className="w-3.5 h-3.5 text-slate-500" />
              </button>
              <span className="absolute top-1 right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  <ShieldCheck className="w-3 h-3" />
                  Identite Certifiee HDS
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-400">{vitalId}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight truncate">
                {patientName}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {formData.gender} &bull; {age} ans &bull; Ne le {formData.birthDate}
              </p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono font-bold transition-colors cursor-pointer"
                >
                  {vitalId}
                  {copiedVitalId ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400" />
                  )}
                </button>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold">
                  <Droplets className="w-3 h-3" />
                  Groupe {formData.bloodGroup}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold">
                  <AlertCircle className="w-3 h-3" />
                  {formData.allergies.length} allergie(s)
                </span>
              </div>
            </div>

            {/* Actions: Edit & Logout */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isEditing
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-700/20'
                }`}
              >
                {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                <span>{isEditing ? 'Annuler' : 'Modifier'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Déconnexion"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-teal-600 text-teal-700'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4"
          >
            <div className="p-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2.5 shadow-lg">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              Vos informations ont ete mises a jour avec succes.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTENT */}
      <form onSubmit={handleSave}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 pb-4">
          <AnimatePresence mode="wait">

            {/* TAB INFO */}
            {activeTab === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-5"
              >
                {/* Left */}
                <div className="lg:col-span-5 space-y-5">

                  {/* Biometrie */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-teal-600" />
                      Biometrie
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col items-center p-3 rounded-2xl bg-rose-50 border border-rose-100 text-center">
                        <Droplets className="w-4 h-4 text-rose-500 mb-1" />
                        <span className="text-xl font-extrabold text-rose-600">{formData.bloodGroup}</span>
                        <span className="text-[9px] text-rose-700 font-semibold mt-0.5 uppercase tracking-wide">Groupe</span>
                      </div>
                      <div className="flex flex-col items-center p-3 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                        <Weight className="w-4 h-4 text-blue-500 mb-1" />
                        <span className="text-xl font-extrabold text-blue-600">78</span>
                        <span className="text-[9px] text-blue-700 font-semibold mt-0.5 uppercase tracking-wide">Poids kg</span>
                      </div>
                      <div className="flex flex-col items-center p-3 rounded-2xl bg-violet-50 border border-violet-100 text-center">
                        <Ruler className="w-4 h-4 text-violet-500 mb-1" />
                        <span className="text-xl font-extrabold text-violet-600">175</span>
                        <span className="text-[9px] text-violet-700 font-semibold mt-0.5 uppercase tracking-wide">Taille cm</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] font-bold text-slate-500">IMC</span>
                        <span className={`text-[11px] font-extrabold ${bmiColor}`}>{bmiLabel}</span>
                      </div>
                      <div className="h-2 bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-400 to-rose-400 rounded-full relative">
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-slate-700 rounded-full shadow-sm"
                          style={{ left: `${Math.min(Math.max(((bmi - 15) / 25) * 100, 2), 98)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-semibold">
                        <span>15</span>
                        <span className="font-extrabold text-slate-600">{bmi.toFixed(1)}</span>
                        <span>40</span>
                      </div>
                    </div>
                  </div>

                  {/* Medecin traitant */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                      Medecin Traitant
                    </h3>
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-teal-50/70 border border-teal-100">
                      <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                        {formData.treatingDoctor.split(' ').slice(-1)[0]?.[0] ?? 'D'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-teal-700 uppercase tracking-wider truncate">
                          {formData.treatingSpecialty}
                        </p>
                        <p className="text-sm font-extrabold text-slate-900 truncate">{formData.treatingDoctor}</p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <Building2 className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{formData.treatingClinic}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      {[1,2,3,4].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                      <Star className="w-3 h-3 text-slate-300" />
                      <span className="ml-1">4.0 — Suivi depuis 2022</span>
                    </div>
                  </div>

                  {/* Assurance */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-emerald-600" />
                      Couverture Medicale
                    </h3>
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">{formData.insuranceName}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">No {formData.insuranceNumber}</p>
                      </div>
                      <span className="flex-shrink-0 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-extrabold">
                        {formData.insuranceCoverage}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: formData.insuranceCoverage }} />
                    </div>
                    <p className="text-[10px] text-slate-400 text-center">
                      Taux de prise en charge : {formData.insuranceCoverage}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="lg:col-span-7 space-y-5">

                  {/* Coordonnees */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-teal-600" />
                      Coordonnees Personnelles
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">Prenom</label>
                        <input type="text" disabled={!isEditing} value={formData.firstName}
                          onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                          className={inputCls(isEditing)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">Nom</label>
                        <input type="text" disabled={!isEditing} value={formData.lastName}
                          onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                          className={inputCls(isEditing)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block flex items-center gap-1">
                          <Phone className="w-3 h-3" />Telephone
                        </label>
                        <input type="text" disabled={!isEditing} value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className={inputCls(isEditing)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block flex items-center gap-1">
                          <Mail className="w-3 h-3" />Email
                        </label>
                        <input type="email" disabled={!isEditing} value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className={inputCls(isEditing)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block flex items-center gap-1">
                          <Calendar className="w-3 h-3" />Date de Naissance
                        </label>
                        <input type="text" disabled={!isEditing} value={formData.birthDate}
                          onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                          className={inputCls(isEditing)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">Genre</label>
                        <input type="text" disabled={!isEditing} value={formData.gender}
                          onChange={e => setFormData({ ...formData, gender: e.target.value })}
                          className={inputCls(isEditing)} />
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <label className="text-slate-500 font-bold block flex items-center gap-1">
                        <MapPin className="w-3 h-3" />Adresse de Residence
                      </label>
                      <input type="text" disabled={!isEditing} value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        className={inputCls(isEditing)} />
                    </div>
                  </div>

                  {/* Contact urgence */}
                  <div className="bg-white rounded-3xl border border-rose-200/70 p-5 sm:p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-rose-600" />
                      Contact d&apos;Urgence
                      <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full border border-rose-200">
                        Personne de Confiance
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">Nom complet</label>
                        <input type="text" disabled={!isEditing} value={formData.emergencyContactName}
                          onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                          className={inputCls(isEditing)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">Lien de parente</label>
                        <input type="text" disabled={!isEditing} value={formData.emergencyContactRelation}
                          onChange={e => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                          className={inputCls(isEditing)} />
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <label className="text-slate-500 font-bold block">
                        Telephone d&apos;Urgence
                      </label>
                      <input type="text" disabled={!isEditing} value={formData.emergencyContactPhone}
                        onChange={e => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                        className={inputCls(isEditing)} />
                    </div>
                  </div>

                  {isEditing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <button type="submit"
                        className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-teal-700/20 cursor-pointer transition-all">
                        <Save className="w-4 h-4" />
                        Enregistrer les modifications
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB MEDICAL */}
            {activeTab === 'medical' && (
              <motion.div
                key="medical"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-5"
              >
                <div className="lg:col-span-6">
                  <div className="bg-white rounded-3xl border border-amber-200/80 p-5 shadow-sm space-y-4 h-full">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Allergies Declarees
                    </h3>
                    <div className="space-y-2">
                      {formData.allergies.map((a, i) => (
                        <div key={i} className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-amber-50 border border-amber-200">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-xs font-bold text-amber-900">{a}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 bg-amber-200 text-amber-800 rounded-lg font-semibold">
                            Medicament
                          </span>
                        </div>
                      ))}
                    </div>
                    {isEditing && (
                      <button type="button" className="w-full py-2 rounded-xl border border-dashed border-amber-300 text-amber-700 text-xs font-bold hover:bg-amber-50 transition-colors cursor-pointer">
                        + Ajouter une allergie
                      </button>
                    )}
                    <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-2 text-[11px] text-amber-800">
                      <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-600" />
                      Ces informations sont transmises automatiquement aux professionnels de sante lors de vos consultations.
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 h-full">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Antecedents Medicaux
                    </h3>
                    <div className="space-y-2">
                      {formData.medicalHistory.map((h, i) => (
                        <div key={i} className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-extrabold flex-shrink-0">
                            {i + 1}
                          </div>
                          <span className="text-xs font-semibold text-slate-700 flex-1">{h}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                    {isEditing && (
                      <button type="button" className="w-full py-2 rounded-xl border border-dashed border-blue-300 text-blue-700 text-xs font-bold hover:bg-blue-50 transition-colors cursor-pointer">
                        + Ajouter un antecedent
                      </button>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-12">
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <Syringe className="w-4 h-4 text-teal-600" />
                      Historique Vaccinal
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { name: 'COVID-19', date: 'Mar 2022', status: 'Complet', ok: true },
                        { name: 'Tetanos', date: 'Jan 2020', status: 'Rappel 2025', ok: false },
                        { name: 'Hepatite B', date: 'Juin 2018', status: 'Complet', ok: true },
                        { name: 'Fievre Jaune', date: 'Aou 2019', status: 'Complet', ok: true },
                      ].map((v) => (
                        <div key={v.name} className={`p-3.5 rounded-2xl border ${v.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-extrabold text-slate-900">{v.name}</span>
                            <span className={`w-2 h-2 rounded-full ${v.ok ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          </div>
                          <p className={`text-[10px] font-bold ${v.ok ? 'text-emerald-700' : 'text-amber-700'}`}>{v.status}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />{v.date}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB SECURITE */}
            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-5 max-w-2xl"
              >
                <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white">Certification HDS</h3>
                      <p className="text-[11px] text-teal-400 font-semibold">Hebergeur de Donnees de Sante</p>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 bg-teal-500/20 border border-teal-500/30 rounded-xl text-[10px] font-bold text-teal-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      Actif
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    {[
                      { label: 'Chiffrement', value: 'AES-256 GCM' },
                      { label: 'Protocole', value: 'TLS 1.3' },
                      { label: 'Stockage', value: 'Senegale - Dakar DC' },
                      { label: 'Conformite', value: 'ISO 27001' },
                    ].map((s) => (
                      <div key={s.label} className="p-3 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-slate-400 font-semibold">{s.label}</p>
                        <p className="font-extrabold text-white mt-0.5">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-600" />
                    Acces et Sessions
                  </h3>
                  {[
                    { device: 'Navigateur Chrome - Windows', location: 'Dakar, SN', time: 'Maintenant', active: true },
                    { device: 'Application Mobile - Android', location: 'Dakar, SN', time: 'Il y a 2h', active: false },
                    { device: 'Navigateur Safari - iPhone', location: 'Dakar, SN', time: 'Hier, 18h42', active: false },
                  ].map((s, i) => (
                    <div key={i} className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border ${s.active ? 'bg-teal-50 border-teal-200' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.active ? 'bg-teal-500 animate-pulse' : 'bg-slate-300'}`} />
                        <div>
                          <p className={`text-xs font-bold ${s.active ? 'text-teal-900' : 'text-slate-700'}`}>{s.device}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{s.location} &bull; {s.time}</p>
                        </div>
                      </div>
                      {!s.active && (
                        <button type="button" className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer">
                          Revoquer
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-2.5">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-slate-600" />
                    Actions de Securite
                  </h3>
                  {/* Déconnexion directe dans la liste de sécurité */}
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <div>
                        <p className="text-xs font-bold text-rose-700">Se déconnecter de la session</p>
                        <p className="text-[10px] text-rose-500 mt-0.5">Ferme la session sécurisée sur cet appareil</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-rose-400 group-hover:text-rose-600 transition-colors" />
                  </button>

                  {[
                    { label: 'Changer mon mot de passe', desc: 'Derniere modification il y a 3 mois', Icon: Lock, color: 'text-slate-700' },
                    { label: 'Telecharger mes donnees', desc: 'Export complet RGPD conforme', Icon: FileText, color: 'text-blue-700' },
                    { label: 'Supprimer mon compte', desc: 'Action irreversible - contacter le support', Icon: AlertTriangle, color: 'text-rose-700' },
                  ].map((a) => (
                    <button key={a.label} type="button"
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors text-left cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <a.Icon className={`w-4 h-4 ${a.color}`} />
                        <div>
                          <p className={`text-xs font-bold ${a.color}`}>{a.label}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{a.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>

      {/* Modal de Confirmation de Déconnexion */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <LogOut className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Confirmer la déconnexion ?
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Êtes-vous sûr de vouloir quitter votre espace patient Health AI ? Vous devrez vous reconnecter pour consulter vos dossiers.
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-rose-600/20"
                >
                  Se déconnecter
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
