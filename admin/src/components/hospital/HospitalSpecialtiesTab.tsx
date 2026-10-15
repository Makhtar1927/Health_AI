'use client';

import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, Plus, Save, Clock, Calendar, Check, AlertCircle, 
  DollarSign, Users, ChevronRight, CheckCircle2, ShieldCheck, Sparkles,
  ToggleLeft, ToggleRight, X, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FacilitySpecialty {
  id: string;
  name: string;
  isActive: boolean;
  ticketPrice: number;
  availableDays: number[]; // 1=Lundi, 2=Mardi, 3=Mercredi, 4=Jeudi, 5=Vendredi, 6=Samedi, 7=Dimanche
  startTime: string;
  endTime: string;
  slotDuration: number;
  maxPatientsPerSlot: number;
  assignedDoctors: string[];
}

const DAYS_OF_WEEK = [
  { id: 1, label: 'Lun', full: 'Lundi' },
  { id: 2, label: 'Mar', full: 'Mardi' },
  { id: 3, label: 'Mer', full: 'Mercredi' },
  { id: 4, label: 'Jeu', full: 'Jeudi' },
  { id: 5, label: 'Ven', full: 'Vendredi' },
  { id: 6, label: 'Sam', full: 'Samedi' },
  { id: 7, label: 'Dim', full: 'Dimanche' },
];

const PRESET_SPECIALTIES = [
  "Dentisterie & Odontologie",
  "Cardiologie",
  "Médecine Générale",
  "Pédiatrie",
  "Gynécologie & Obstétrique",
  "Ophtalmologie",
  "Dermatologie",
  "Pneumologie",
  "Radiologie & Imagerie",
  "Chirurgie Générale",
  "ORL & Cervico-faciale"
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Props {
  hospitalName?: string;
}

export const HospitalSpecialtiesTab: React.FC<Props> = ({ hospitalName = "Hôpital Principal de Dakar" }) => {
  const [facilityId, setFacilityId] = useState('hopital-principal-dakar');
  const [specialties, setSpecialties] = useState<FacilitySpecialty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // New Specialty Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecPrice, setNewSpecPrice] = useState(2000);
  const [newSpecDays, setNewSpecDays] = useState<number[]>([1, 3, 5]);
  const [newSpecStart, setNewSpecStart] = useState('08:00');
  const [newSpecEnd, setNewSpecEnd] = useState('13:00');
  const [newSpecDuration, setNewSpecDuration] = useState(30);
  const [newSpecMaxPatients, setNewSpecMaxPatients] = useState(1);
  const [newSpecDoctor, setNewSpecDoctor] = useState('');

  // Fetch from backend
  const fetchFacilityData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/facilities`);
      if (res.ok) {
        const data = await res.json();
        const found = data.facilities?.find((f: any) => 
          f.name.toLowerCase().includes(hospitalName.toLowerCase()) || f.id === facilityId
        ) || data.facilities?.[0];

        if (found) {
          setFacilityId(found.id);
          setSpecialties(found.specialties || []);
        }
      }
    } catch (e) {
      console.error('Erreur chargement spécialités établissement', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilityData();
  }, [hospitalName]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Toggle Day
  const handleToggleDay = (specIndex: number, dayId: number) => {
    setSpecialties(prev => {
      const next = [...prev];
      const spec = { ...next[specIndex] };
      if (spec.availableDays.includes(dayId)) {
        spec.availableDays = spec.availableDays.filter(d => d !== dayId);
      } else {
        spec.availableDays = [...spec.availableDays, dayId].sort();
      }
      next[specIndex] = spec;
      return next;
    });
  };

  // Field change
  const handleFieldChange = (specIndex: number, field: keyof FacilitySpecialty, value: any) => {
    setSpecialties(prev => {
      const next = [...prev];
      next[specIndex] = { ...next[specIndex], [field]: value };
      return next;
    });
  };

  // Save changes to backend
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/facilities/${facilityId}/specialties`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specialties })
      });

      if (res.ok) {
        showToast('Configuration des spécialités et tarification enregistrée avec succès !', 'success');
      } else {
        const err = await res.json();
        showToast(err.error || 'Erreur lors de la sauvegarde.', 'error');
      }
    } catch (e) {
      showToast('Impossible de contacter le serveur Sunu Santé.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Add new specialty
  const handleCreateSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecName.trim()) return;

    const id = newSpecName.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, '_');

    const newSpec: FacilitySpecialty = {
      id: `${id}_${Date.now().toString().slice(-4)}`,
      name: newSpecName,
      isActive: true,
      ticketPrice: Number(newSpecPrice) || 2000,
      availableDays: newSpecDays.length > 0 ? newSpecDays : [1, 2, 3, 4, 5],
      startTime: newSpecStart || '08:00',
      endTime: newSpecEnd || '13:00',
      slotDuration: Number(newSpecDuration) || 30,
      maxPatientsPerSlot: Number(newSpecMaxPatients) || 1,
      assignedDoctors: newSpecDoctor.trim() ? [newSpecDoctor.trim()] : ['Médecin de garde']
    };

    setSpecialties(prev => [...prev, newSpec]);
    setIsAddModalOpen(false);
    setNewSpecName('');
    setNewSpecDoctor('');
    showToast(`Spécialité "${newSpec.name}" ajoutée ! Pensez à enregistrer.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border text-xs sm:text-sm font-semibold backdrop-blur-md ${
              toast.type === 'success' 
                ? 'bg-emerald-900/90 text-white border-emerald-500 shadow-emerald-900/30' 
                : 'bg-rose-900/90 text-white border-rose-500 shadow-rose-900/30'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <AlertCircle className="h-5 w-5 text-rose-400" />}
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
            Gestion Autonome Établissement
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            Configuration des Spécialités & Planning
          </h2>
          <p className="text-slate-600 text-xs mt-1 max-w-2xl leading-relaxed">
            Définissez les jours de présence des spécialistes (ex: Dentiste le mardi et jeudi), les plages horaires, la durée des créneaux, les quotas de patients et le <strong>prix du ticket</strong> qui sera automatiquement reporté en Caisse et sur le portail Patient.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Plus className="h-4 w-4 text-emerald-600" />
            <span>Nouvelle Spécialité</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm shadow-emerald-600/20 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Enregistrement...' : 'Enregistrer les Modifications'}</span>
          </button>
        </div>
      </section>

      {/* Specialties Cards List */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          <Clock className="h-8 w-8 animate-spin mx-auto text-emerald-600 mb-3" />
          <p className="text-xs font-semibold">Chargement des paramètres de l'établissement...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {specialties.map((spec, index) => {
            return (
              <div
                key={spec.id || index}
                className={`bg-white rounded-3xl border transition-all p-5 sm:p-6 shadow-sm ${
                  spec.isActive 
                    ? 'border-slate-200 hover:border-emerald-300' 
                    : 'border-slate-200 bg-slate-50/60 opacity-80'
                }`}
              >
                {/* Top Row: Title, Active Switch & Ticket Price */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${
                      spec.isActive 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-slate-900">{spec.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                          spec.isActive 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {spec.isActive ? 'Active' : 'Désactivée'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Médecins : {spec.assignedDoctors?.join(', ') || 'Non assigné'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Active toggle button */}
                    <button
                      type="button"
                      onClick={() => handleFieldChange(index, 'isActive', !spec.isActive)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        spec.isActive 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {spec.isActive ? (
                        <>
                          <ToggleRight className="h-5 w-5 text-emerald-600" />
                          <span>Activée</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-5 w-5 text-slate-400" />
                          <span>Désactivée</span>
                        </>
                      )}
                    </button>

                    {/* Ticket Price Box */}
                    <div className="bg-amber-50/80 border border-amber-200 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-800 uppercase">Prix Ticket :</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={spec.ticketPrice}
                          onChange={(e) => handleFieldChange(index, 'ticketPrice', Math.max(0, Number(e.target.value)))}
                          className="w-20 bg-white border border-amber-300 rounded-lg px-2 py-0.5 text-xs font-black text-amber-900 text-right focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <span className="text-xs font-black text-amber-900">FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configuration Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4">
                  {/* Column 1: Days of presence (5 cols) */}
                  <div className="md:col-span-5 space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Jours d'ouverture & de présence du praticien :</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {DAYS_OF_WEEK.map(d => {
                        const isSelected = spec.availableDays.includes(d.id);
                        return (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => handleToggleDay(index, d.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                              isSelected 
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {d.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Sélectionnez les jours exacts où le spécialiste consulte dans cet établissement.
                    </p>
                  </div>

                  {/* Column 2: Hours & Slot duration (4 cols) */}
                  <div className="md:col-span-4 space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Horaires & Durée d'un créneau :</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
                        <span className="text-slate-400 font-semibold">De</span>
                        <input
                          type="time"
                          value={spec.startTime}
                          onChange={(e) => handleFieldChange(index, 'startTime', e.target.value)}
                          className="bg-transparent font-mono font-bold text-slate-800 focus:outline-none"
                        />
                      </div>
                      <span className="text-slate-400 text-xs font-bold">à</span>
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
                        <span className="text-slate-400 font-semibold">À</span>
                        <input
                          type="time"
                          value={spec.endTime}
                          onChange={(e) => handleFieldChange(index, 'endTime', e.target.value)}
                          className="bg-transparent font-mono font-bold text-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Durée / consultation :</span>
                      <select
                        value={spec.slotDuration}
                        onChange={(e) => handleFieldChange(index, 'slotDuration', Number(e.target.value))}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={20}>20 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>60 minutes</option>
                      </select>
                    </div>
                  </div>

                  {/* Column 3: Capacity & Doctors (3 cols) */}
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Quota par créneau :</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={spec.maxPatientsPerSlot}
                        onChange={(e) => handleFieldChange(index, 'maxPatientsPerSlot', Math.max(1, Number(e.target.value)))}
                        className="w-16 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 text-center focus:outline-none focus:bg-white focus:border-emerald-500"
                      />
                      <span className="text-xs text-slate-500">patient(s) max</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Les créneaux atteignant ce quota seront automatiquement signalés complets et grisés côté patient.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Specialty Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Ajouter une Spécialité</h3>
                    <p className="text-xs text-slate-500">{hospitalName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSpecialty} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nom de la Spécialité</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Dentisterie, Ophtalmologie, Cardiologie..."
                    list="spec-suggestions"
                    value={newSpecName}
                    onChange={(e) => setNewSpecName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
                  />
                  <datalist id="spec-suggestions">
                    {PRESET_SPECIALTIES.map(p => <option key={p} value={p} />)}
                  </datalist>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Prix du ticket (FCFA)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={100}
                      value={newSpecPrice}
                      onChange={(e) => setNewSpecPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-black text-amber-900 focus:outline-none focus:bg-white focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Durée d'un créneau</label>
                    <select
                      value={newSpecDuration}
                      onChange={(e) => setNewSpecDuration(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 font-bold focus:outline-none"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={20}>20 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Jours d'ouverture hebdomadaires</label>
                  <div className="flex flex-wrap gap-1.5">
                    {DAYS_OF_WEEK.map(d => {
                      const isSel = newSpecDays.includes(d.id);
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => {
                            if (isSel) setNewSpecDays(newSpecDays.filter(id => id !== d.id));
                            else setNewSpecDays([...newSpecDays, d.id].sort());
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                            isSel ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Heure début</label>
                    <input
                      type="time"
                      value={newSpecStart}
                      onChange={(e) => setNewSpecStart(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Heure fin</label>
                    <input
                      type="time"
                      value={newSpecEnd}
                      onChange={(e) => setNewSpecEnd(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Médecin(s) rattaché(s)</label>
                  <input
                    type="text"
                    placeholder="ex: Dr. Oumy Aidara"
                    value={newSpecDoctor}
                    onChange={(e) => setNewSpecDoctor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                  >
                    Ajouter au catalogue
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
