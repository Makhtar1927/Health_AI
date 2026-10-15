'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/authStore';
import CashierShell from '@/components/cashier/CashierShell';
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
  CreditCard,
  DollarSign,
  Wallet,
  Receipt,
  Lock,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  FileBadge,
  Smartphone,
  Printer,
  BadgeCheck
} from 'lucide-react';

export default function CashierProfilePage() {
  const { user, initialize } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'info' | 'pos' | 'security'>('info');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [matricule, setMatricule] = useState('');
  const [posCode, setPosCode] = useState('');
  const [hospital, setHospital] = useState('Centre Hospitalier National Dalal Jamm');
  const [supervisor, setSupervisor] = useState('M. Ibrahima Fall (Régisseur Principal des Recettes)');

  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cashierPin, setCashierPin] = useState('4829');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      const parts = (user.name || 'Moussa Diop').split(' ');
      setFirstName(parts[0] || 'Moussa');
      setLastName(parts.slice(1).join(' ') || 'Diop');
      setEmail(user.email || 'moussa.caisse@healthai.sn');
      setPhone(user.details?.phone || '+221 77 654 32 10');
      setMatricule(user.details?.matricule || 'CSH-4091-B');
      setPosCode(user.details?.posCode || 'Caisse N°1 — Admissions Générales');
    } else {
      setFirstName('Moussa');
      setLastName('Diop');
      setEmail('moussa.caisse@healthai.sn');
      setPhone('+221 77 654 32 10');
      setMatricule('CSH-4091-B');
      setPosCode('Caisse N°1 — Admissions Générales');
    }
  }, [user]);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Vos informations d’agent caissier ont été mises à jour avec succès.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    setToastMessage('Votre mot de passe et code caisse ont été modifiés avec succès.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <CashierShell
      title="Mon Profil & Paramètres Caisse"
      subtitle="Espace personnel du caissier et gestion du guichet financier"
    >
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ── Banner Fiche Caissier ────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-400/5 blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
            {/* Avatar grand format */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 border-2 border-white">
                {firstName.charAt(0)}{lastName.charAt(0)}
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" title="Caisse Ouverte" />
            </div>

            {/* Infos clés */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-0.5">
                    Agent Caissier & Gestionnaire Recouvrement
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold self-center sm:self-auto">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
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
                  <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{posCode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Session : 07h30 — 15h30</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Statistiques Financières de la Journée ──────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Encaissé Aujourd'hui</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">345 000 <span className="text-xs font-bold text-emerald-700">F</span></p>
            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
              +18% vs moyenne
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tickets Encaissés</span>
            <p className="text-2xl font-black text-slate-900 mt-1">38</p>
            <span className="text-[11px] text-slate-400 font-medium mt-1 block">
              100% quittances émises
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Part Mobile Money (Wave)</span>
            <p className="text-2xl font-black text-blue-600 mt-1">68%</p>
            <span className="text-[11px] text-blue-700 font-bold mt-1 block">
              Zéro écart d'espèces
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fond de Roulement Caisse</span>
            <p className="text-2xl font-black text-purple-600 mt-1">50 000 <span className="text-xs font-bold text-purple-700">F</span></p>
            <span className="text-[11px] text-purple-700 font-bold mt-1 block">
              Vérifié à 07:30
            </span>
          </div>
        </div>

        {/* ── Onglets de Navigation ───────────────────────────────────────── */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Fiche Caissier
          </button>
          <button
            onClick={() => setActiveTab('pos')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'pos'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Guichet & Équipements
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Sécurité & Code Caisse
          </button>
        </div>

        {/* ── Contenu des Onglets ─────────────────────────────────────────── */}
        {activeTab === 'info' && (
          <form onSubmit={handleSaveInfo} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900">Coordonnées & Informations Professionnelles</h3>
              <p className="text-xs text-slate-500">Mettez à jour vos informations enregistrées au registre du personnel financier</p>
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 font-medium"
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 font-medium"
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Numéro Téléphone Pro</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Matricule Caissier Certifié</label>
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
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Plafond d'Encaissement Autorisé</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    disabled
                    value="2 500 000 FCFA / jour"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Enregistrer les Modifications
              </button>
            </div>
          </form>
        )}

        {activeTab === 'pos' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900">Guichet & Équipements de Recouvrement</h3>
              <p className="text-xs text-slate-500">Supervision du matériel comptable, imprimantes et passerelles Wave</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900">Guichet Actif</h4>
                </div>
                <p className="text-sm font-black text-slate-800">{posCode}</p>
                <p className="text-[11px] text-slate-500">Terminal de caisse physique n° 01 • Rattaché à l'accueil</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900">Passerelle Wave & Mobile Money</h4>
                </div>
                <p className="text-sm font-black text-slate-800">TPE-WAVE-SN-491 (En ligne 🟢)</p>
                <p className="text-[11px] text-slate-500">Paiement QR Code et SMS Push synchronisés</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-purple-600" />
                  <h4 className="text-xs font-bold text-slate-900">Imprimante de Quittances</h4>
                </div>
                <p className="text-sm font-black text-slate-800">Epson Thermal TM-T20III</p>
                <p className="text-[11px] text-slate-500">Statut papier : 85% • Découpe automatique active</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-slate-900">Superviseur Comptable</h4>
                </div>
                <p className="text-sm font-black text-slate-800">{supervisor}</p>
                <p className="text-[11px] text-slate-500">Validation des annulations : Poste Ext. 3010</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handleSaveSecurity} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900">Sécurité du Compte & Code PIN Caisse</h3>
              <p className="text-xs text-slate-500">Gérez vos identifiants d'accès au tiroir-caisse et à la clôture journalière</p>
            </div>

            <div className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Code PIN Tiroir-Caisse (4 chiffres)</label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    maxLength={4}
                    value={cashierPin}
                    onChange={(e) => setCashierPin(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
              </div>

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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                Mettre à jour les accès
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
    </CashierShell>
  );
}
