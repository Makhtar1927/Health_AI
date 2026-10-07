'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Phone, 
  MapPin, 
  Shield, 
  Heart, 
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
  Building,
  HeartPulse,
  Droplets,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

export default function PatientProfile() {
  const { user, initialize } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedVitalId, setCopiedVitalId] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "Moussa",
    lastName: "Diop",
    phone: "+221 77 123 45 67",
    email: "moussa.diop@sunusante.sn",
    address: "Fann Résidence, Rue des Ambassades, Dakar",
    bloodGroup: "O+",
    birthDate: "15 Avril 1996",
    gender: "Homme",
    emergencyContactName: "Amina Diop",
    emergencyContactRelation: "Épouse",
    emergencyContactPhone: "+221 78 987 65 43",
    insuranceName: "IPM Entreprises Dakar",
    insuranceNumber: "POL-773-DKR",
    insuranceCoverage: "80%",
    allergies: ["Pénicilline", "Arachides"],
    medicalHistory: ["Hypertension artérielle légère", "Appendicectomie (2018)"]
  });

  useEffect(() => {
    initialize();
    setMounted(true);
  }, [initialize]);

  if (!mounted) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm animate-pulse">S+</div>
          <p className="text-xs font-medium">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  const patientName = user?.name || `${formData.firstName} ${formData.lastName}`;
  const vitalId = user?.details?.vitalId || 'SN-807F16';

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

  return (
    <div className="min-h-full bg-slate-50 text-slate-900 pb-16">

      {/* ─── Hero Header ────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                <ShieldCheck className="w-3 h-3 text-teal-600" />
                Identité Certifiée HDS
              </span>
              <span className="text-xs text-slate-400 font-mono font-medium">{vitalId}</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Mon Profil & Dossier Vital
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Gérez vos données médicales d'urgence, vos coordonnées de contact et vos informations de couverture mutuelle.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isEditing
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-700/20'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Annuler' : 'Modifier mon profil'}</span>
            </button>
          </div>
        </div>

        {/* Mini stats cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mt-5 sm:mt-6">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">Groupe Sanguin</span>
            <span className="text-base sm:text-lg font-bold text-rose-600 mt-0.5 block truncate">
              {formData.bloodGroup} Rhésus Positif
            </span>
          </div>
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">Allergies Actives</span>
            <span className="text-base sm:text-lg font-bold text-amber-700 mt-0.5 block truncate">
              {formData.allergies.length} signalées
            </span>
          </div>
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">Tiers-Payant IPM</span>
            <span className="text-base sm:text-lg font-bold text-emerald-700 mt-0.5 block truncate">
              Prise en charge {formData.insuranceCoverage}
            </span>
          </div>
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block truncate">Sécurité & Chiffrement</span>
            <span className="text-base sm:text-lg font-bold text-teal-700 mt-0.5 block truncate">
              AES-256 Actif
            </span>
          </div>
        </div>
      </div>

      {/* ─── Notification Toast de Succès ───────────────────────────────── */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4"
          >
            <div className="p-3.5 rounded-2xl bg-emerald-700 text-white text-xs font-bold flex items-center gap-2.5 shadow-lg">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Vos informations personnelles et médicales ont été mises à jour avec succès.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Formulaire & Grille Profil ─────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-6">
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* COLONNE GAUCHE (5 / 12) : Carte d'identité médicale ────────── */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Carte Identité Patient */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 text-center shadow-xs space-y-4">
              <div className="relative inline-block mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-teal-600/10 text-teal-700 border-2 border-teal-200 flex items-center justify-center font-bold text-2xl shadow-sm">
                  {patientName[0]}
                </div>
                <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">{patientName}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{formData.gender} • Né le {formData.birthDate}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  {vitalId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Copier mon identifiant"
                >
                  {copiedVitalId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Données Vitales Clés */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                Données Vitales d'Urgence
              </h3>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200">
                  <span className="text-[10px] font-bold text-rose-800 uppercase block">Groupe Sanguin</span>
                  <span className="text-2xl font-black text-rose-600 mt-0.5 block">{formData.bloodGroup}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200">
                  <span className="text-[10px] font-bold text-teal-800 uppercase block">Statut Vital</span>
                  <span className="text-xs font-bold text-teal-800 mt-2 block">Dossier Actif</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Allergies Médicamenteuses
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.allergies.map((a, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900 font-bold text-[10px]">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sécurité et HDS */}
            <div className="p-4 rounded-3xl bg-slate-900 text-white text-xs space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2 text-teal-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Certification Hébergeur de Données de Santé</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Toutes vos données médicales sont pseudonymisées et chiffrées selon les protocoles hospitaliers internationaux.
              </p>
            </div>

          </div>

          {/* COLONNE DROITE (7 / 12) : Formulaire complet ─────────────── */}
          <div className="lg:col-span-7 space-y-5">

            {/* 1. Coordonnées & Adresse */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600" />
                Coordonnées Personnelles
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">Prénom</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/60 font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">Nom</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/60 font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">Numéro de Téléphone</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/60 font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">Adresse Email</label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/60 font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-slate-500 font-bold block">Adresse de Résidence</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/60 font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* 2. Contact d'Urgence (Personne de Confiance) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-600" />
                Contact d'Urgence Déclaré
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">Nom & Prénom</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.emergencyContactName}
                    onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/60 font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">Lien de parenté</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.emergencyContactRelation}
                    onChange={e => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/60 font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-slate-500 font-bold block">Numéro Téléphone d'Urgence</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.emergencyContactPhone}
                  onChange={e => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/60 font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* 3. Assurance & Mutuelle Santé */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                Assurance & Couverture Médicale
              </h3>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{formData.insuranceName}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">N° Police : {formData.insuranceNumber}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center self-start sm:self-center">
                  Prise en charge {formData.insuranceCoverage}
                </span>
              </div>
            </div>

            {/* Bouton de sauvegarde */}
            {isEditing && (
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-teal-700/20 cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            )}

          </div>

        </form>
      </div>

    </div>
  );
}
