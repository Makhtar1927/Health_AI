'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  FileCheck, 
  Truck, 
  Clock, 
  Save, 
  Pill,
  Sparkles,
  Lock,
  QrCode
} from 'lucide-react';
import PharmacyShell from '@/components/pharmacist/PharmacyShell';
import { useAuthStore } from '@/lib/authStore';

export default function PharmacistProfilePage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'pharmacy' | 'security'>('profile');
  const [isSaved, setIsSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || 'Dr. Babacar Diagne',
    email: user?.email || 'pharmacien@healthai.sn',
    phone: '+221 77 450 88 12',
    rpps: 'RPPS-SN-849204',
    orderNumber: 'ONPS-Section-A-1428',
    diploma: "Doctorat d'État en Pharmacie - UCAD Dakar (2015)",
    pharmacyName: 'Pharmacie Centrale Dakar Plateau',
    licenseNumber: 'LIC-SANTE-DKR-2021-089',
    city: 'Dakar',
    address: '42 Avenue Ponty, Dakar Plateau',
    openingHours: '08h00 - 22h00 & Service de Garde',
    primaryWholesaler: 'COPHASE Sénégal',
    secondaryWholesaler: 'Laborex Sénégal'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <PharmacyShell
      title="Profil Pharmacien & Fiche Officine"
      subtitle="Agrément sanitaire, répartiteurs & sécurité de dispensation"
    >
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Banner Profil Pharmacien */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md shadow-violet-600/20 shrink-0">
            {formData.name.charAt(0)}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">{formData.name}</h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200 text-xs font-black self-center sm:self-auto">
                <ShieldCheck className="h-3.5 w-3.5 text-violet-600" />
                Pharmacien Titulaire
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {formData.pharmacyName} &bull; {formData.city}
            </p>
            
            {/* Badges légaux & Ordre */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] font-bold text-slate-600">
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg">RPPS : {formData.rpps}</span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg">Ordre : {formData.orderNumber}</span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/70 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                Agrément Sanitaire Actif
              </span>
            </div>
          </div>

          {/* Métriques clés du pharmacien */}
          <div className="hidden lg:grid grid-cols-2 gap-3 shrink-0 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-lg font-black text-slate-900 block">1 420</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Ordonnances M-1</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80">
              <span className="text-lg font-black text-emerald-700 block">98.4%</span>
              <span className="text-[10px] text-emerald-800 font-bold uppercase">Taux de Service</span>
            </div>
          </div>
        </div>

        {/* Navigation onglets */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <User className="h-4 w-4" />
            Fiche Pharmacien
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pharmacy')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'pharmacy'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Building2 className="h-4 w-4" />
            Fiche Officine & Grossistes
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Sécurité & Traçabilité
          </button>
        </div>

        {/* Formulaire des paramètres */}
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Onglet 1: Fiche Pharmacien */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-6 shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900">Données Professionnelles du Pharmacien</h3>
                <p className="text-[11px] text-slate-500">Informations certifiées conformes auprès du Ministère de la Santé</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nom et Prénom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Adresse Email Officielle</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Numéro de Téléphone Direct</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Numéro d&apos;Identifiant RPPS</label>
                  <input
                    type="text"
                    value={formData.rpps}
                    readOnly
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Inscription à l&apos;Ordre des Pharmaciens</label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={e => setFormData({ ...formData, orderNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Diplôme & Titres</label>
                  <input
                    type="text"
                    value={formData.diploma}
                    onChange={e => setFormData({ ...formData, diploma: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Onglet 2: Fiche Officine & Grossistes */}
          {activeTab === 'pharmacy' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-6 shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900">Établissement Pharmaceutique & Liaisons Répartiteurs</h3>
                <p className="text-[11px] text-slate-500">Gestion de la licence et approvisionnements des stocks</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Raison Sociale de l&apos;Officine</label>
                  <input
                    type="text"
                    value={formData.pharmacyName}
                    onChange={e => setFormData({ ...formData, pharmacyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Numéro de Licence d&apos;Exploitation</label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    readOnly
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Adresse de l&apos;Officine</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Grossiste Répartiteur Principal</label>
                  <select
                    value={formData.primaryWholesaler}
                    onChange={e => setFormData({ ...formData, primaryWholesaler: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-800"
                  >
                    <option value="COPHASE Sénégal">COPHASE Sénégal (Livraisons 2x/jour)</option>
                    <option value="Laborex Sénégal">Laborex Sénégal</option>
                    <option value="SODIPHARM">SODIPHARM</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Grossiste Secondaire</label>
                  <select
                    value={formData.secondaryWholesaler}
                    onChange={e => setFormData({ ...formData, secondaryWholesaler: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-800"
                  >
                    <option value="Laborex Sénégal">Laborex Sénégal</option>
                    <option value="COPHASE Sénégal">COPHASE Sénégal</option>
                    <option value="SODIPHARM">SODIPHARM</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Horaires d&apos;Ouverture & Service de Garde</label>
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={e => setFormData({ ...formData, openingHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Onglet 3: Sécurité & Traçabilité */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-6 shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900">Règlementation Pharmaceutique & Signature Électronique</h3>
                <p className="text-[11px] text-slate-500">Certificats de délivrance et traçabilité des stupéfiants</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <Lock className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-extrabold text-slate-900">Clé de Signature Électronique des Ordonnances</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Chaque dispensation validée est scellée par une signature cryptographique conforme au standard Health AI & Ministère de la Santé.
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      Certificat Actif &bull; Expire le 31/12/2026
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <FileCheck className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-extrabold text-slate-900">Registre Spécial des Substances Contrôlées (Tableau A & B)</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Journalisation inviolable et export direct pour l&apos;Inspection Régionale de la Pharmacie.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions & Sauvegarde */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {isSaved ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Modifications enregistrées avec succès !
              </span>
            ) : (
              <span className="text-xs text-slate-400">Toutes les modifications sont synchronisées en temps réel.</span>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-extrabold shadow-sm shadow-violet-600/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Save className="h-4 w-4" />
              Enregistrer les modifications
            </button>
          </div>

        </form>

      </div>
    </PharmacyShell>
  );
}
