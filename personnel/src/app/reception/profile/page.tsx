'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/authStore';
import ReceptionShell from '@/components/reception/ReceptionShell';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  Clock,
  KeyRound,
  CheckCircle2,
  Sparkles,
  Save,
  Activity,
  Award,
  Users,
  CreditCard,
  Lock,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  FileBadge
} from 'lucide-react';

export default function ReceptionProfilePage() {
  const { user, initialize } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'info' | 'desk' | 'security'>('info');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [matricule, setMatricule] = useState('');
  const [desk, setDesk] = useState('');
  const [hospital, setHospital] = useState('Centre Hospitalier National Dalal Jamm');
  const [supervisor, setSupervisor] = useState('Mme. Aminata Ndiaye (Chef de Bureau Admissions)');
  const [language, setLanguage] = useState('Français & Wolof');

  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      const parts = (user.name || 'Fatou Sarr').split(' ');
      setFirstName(parts[0] || 'Fatou');
      setLastName(parts.slice(1).join(' ') || 'Sarr');
      setEmail(user.email || 'fatou.sarr@healthai.sn');
      setPhone(user.details?.phone || '+221 77 555 44 33');
      setMatricule(user.details?.matricule || 'MAT-8392-A');
      setDesk(user.details?.desk || 'Guichet 1 — Accueil Central');
    } else {
      setFirstName('Fatou');
      setLastName('Sarr');
      setEmail('fatou.sarr@healthai.sn');
      setPhone('+221 77 555 44 33');
      setMatricule('MAT-8392-A');
      setDesk('Guichet 1 — Accueil Central');
    }
  }, [user]);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Vos informations d’agent d’accueil ont été mises à jour avec succès.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    setToastMessage('Votre mot de passe a été modifié avec succès.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <ReceptionShell
      title="Mon Profil & Paramètres Guichet"
      subtitle="Espace personnel de l'agent d'accueil et d'admission"
    >
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ── Banner Fiche Agent ─────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-400/5 blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
            {/* Avatar grand format */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-blue-500/20 border-2 border-white">
                {firstName.charAt(0)}{lastName.charAt(0)}
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" title="En service" />
            </div>

            {/* Infos clés */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-0.5">
                    Agent d'Accueil & Admissions Cliniques
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold self-center sm:self-auto">
                  <FileBadge className="w-3.5 h-3.5" />
                  Matricule : {matricule}
                </div>
              </div>

              {/* Détails secondaires */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{hospital}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{desk}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Permanence : 07h30 — 15h30</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Statistiques du Guichet du Jour ─────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admissions Aujourd'hui</span>
            <p className="text-2xl font-black text-slate-900 mt-1">28</p>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              +14% vs hier
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Temps Moyen Guichet</span>
            <p className="text-2xl font-black text-blue-600 mt-1">2 min 40s</p>
            <span className="text-[11px] text-slate-400 font-medium mt-1 block">
              Objectif &lt; 3 min
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transmis en Caisse</span>
            <p className="text-2xl font-black text-purple-600 mt-1">24</p>
            <span className="text-[11px] text-purple-700 font-bold mt-1 block">
              100% enregistrés
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Satisfaction Usagers</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">98%</p>
            <span className="text-[11px] text-emerald-700 font-bold mt-1 block">
              Excellente fluidité
            </span>
          </div>
        </div>

        {/* ── Onglets de Navigation ───────────────────────────────────────── */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Fiche Personnelle
          </button>
          <button
            onClick={() => setActiveTab('desk')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'desk'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Assignation & Permanence
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Sécurité & Accès
          </button>
        </div>

        {/* ── Contenu des Onglets ─────────────────────────────────────────── */}
        {activeTab === 'info' && (
          <form onSubmit={handleSaveInfo} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900">Coordonnées & Informations Professionnelles</h3>
              <p className="text-xs text-slate-500">Mettez à jour vos informations de contact visibles par les services hospitaliers</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Nom de Famille</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Adresse Email Professionnelle</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Numéro Téléphone Flotte</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Matricule Hospitalier</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    disabled
                    value={matricule}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Langues d'Accueil Usager</label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Enregistrer les Modifications
              </button>
            </div>
          </form>
        )}

        {activeTab === 'desk' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900">Guichet & Responsabilité Clinique</h3>
              <p className="text-xs text-slate-500">Paramétrage du point de contact patient et des box associés</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900">Établissement de Santé</h4>
                </div>
                <p className="text-sm font-black text-slate-800">{hospital}</p>
                <p className="text-[11px] text-slate-500">Rattaché au Pôle Consultations & Accueil Principal</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold text-slate-900">Guichet Actif</h4>
                </div>
                <p className="text-sm font-black text-slate-800">{desk}</p>
                <p className="text-[11px] text-slate-500">Imprimante de tickets ticket-box-01 connectée</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900">Superviseur de Service</h4>
                </div>
                <p className="text-sm font-black text-slate-800">{supervisor}</p>
                <p className="text-[11px] text-slate-500">Poste téléphonique interne : Ext. 2104</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-slate-900">Cycle de Permanence</h4>
                </div>
                <p className="text-sm font-black text-slate-800">Équipe Matin (07:30 - 15:30)</p>
                <p className="text-[11px] text-slate-500">Relève assurée par : Agent Moustapha Ba</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handleSaveSecurity} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900">Sécurité du Compte & Mot de Passe</h3>
              <p className="text-xs text-slate-500">Assurez la sécurité de vos accès aux dossiers d'admission des patients</p>
            </div>

            <div className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Mot de passe actuel</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Confirmer le nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        )}

        {/* ── Toast de succès ────────────────────────────────────────────── */}
        {toastMessage && (
          <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs animate-bounce">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            {toastMessage}
          </div>
        )}

      </div>
    </ReceptionShell>
  );
}
