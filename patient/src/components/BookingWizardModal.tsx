'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Stethoscope, Calendar, Clock, DollarSign, CheckCircle2, 
  MapPin, Phone, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck, 
  X, Check, Sparkles, Filter, ChevronRight, User, AlertTriangle
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface FacilitySpecialty {
  id: string;
  name: string;
  isActive: boolean;
  ticketPrice: number;
  availableDays: number[]; // 1=Lundi, ..., 7=Dimanche
  startTime: string;
  endTime: string;
  slotDuration: number;
  maxPatientsPerSlot: number;
  assignedDoctors: string[];
}

export interface HealthFacility {
  id: string;
  name: string;
  type: 'hopital' | 'centre_de_sante' | 'poste_de_sante';
  region: string;
  district: string;
  address: string;
  phone: string;
  specialties: FacilitySpecialty[];
}

interface SlotInfo {
  time: string;
  isFull: boolean;
  bookedCount: number;
  maxPatients: number;
  availableCount: number;
}

const REGIONS_SENEGAL = [
  "Toutes",
  "Dakar",
  "Thiès",
  "Diourbel",
  "Saint-Louis",
  "Kaolack",
  "Fatick",
  "Ziguinchor"
];

const DISTRICTS_MAP: Record<string, string[]> = {
  "Dakar": ["Tous", "Dakar Centre", "Almadies", "Guédiawaye", "Pikine", "Rufisque"],
  "Thiès": ["Tous", "Thiès Ville", "Mbour", "Tivaouane"],
  "Diourbel": ["Tous", "Touba", "Mbacké", "Bambey"],
  "Saint-Louis": ["Tous", "Saint-Louis", "Dagana", "Podor"],
  "Kaolack": ["Tous", "Kaolack", "Nioro"],
  "Fatick": ["Tous", "Fatick", "Foundiougne", "Gossas"],
  "Ziguinchor": ["Tous", "Ziguinchor", "Oussouye", "Bignona"]
};

const DAYS_NAMES: Record<number, string> = {
  1: 'Lundi', 2: 'Mardi', 3: 'Mercredi', 4: 'Jeudi', 5: 'Vendredi', 6: 'Samedi', 7: 'Dimanche'
};

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  patientPhone?: string;
  patientEmail?: string;
  onAppointmentBooked: (appointment: any) => void;
}

export const BookingWizardModal: React.FC<BookingWizardProps> = ({
  isOpen,
  onClose,
  patientName = 'Moussa Diop',
  patientPhone = '+221 77 123 45 67',
  patientEmail = 'moussa.diop@sunusante.sn',
  onAppointmentBooked
}) => {
  // Wizard Step: 1 | 2 | 3 | 4 | 5
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Étape 1 : Filtres & Structure de santé
  const [facilities, setFacilities] = useState<HealthFacility[]>([]);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('Dakar');
  const [selectedDistrict, setSelectedDistrict] = useState('Tous');
  const [selectedType, setSelectedType] = useState<'all' | 'hopital' | 'centre_de_sante' | 'poste_de_sante'>('all');
  const [selectedFacility, setSelectedFacility] = useState<HealthFacility | null>(null);

  // Étape 2 : Spécialité
  const [selectedSpecialty, setSelectedSpecialty] = useState<FacilitySpecialty | null>(null);

  // Étape 3 : Date & Créneau
  const [selectedDate, setSelectedDate] = useState('');
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsData, setSlotsData] = useState<{
    isDayAvailable: boolean;
    reason?: string;
    slots: SlotInfo[];
    availableDays?: number[];
  } | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Étape 4 : Motif & Patient
  const [reason, setReason] = useState('Consultation & Diagnostic médical');
  const [contactPhone, setContactPhone] = useState(patientPhone);

  // Étape 5 : Résultat / Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Charger les structures de santé
  useEffect(() => {
    if (!isOpen) return;
    const fetchFacilities = async () => {
      setIsLoadingFacilities(true);
      try {
        const res = await fetch(`${API_URL}/api/facilities`);
        if (res.ok) {
          const data = await res.json();
          setFacilities(data.facilities || []);
        }
      } catch (e) {
        console.error('Erreur chargement structures', e);
      } finally {
        setIsLoadingFacilities(false);
      }
    };
    fetchFacilities();
  }, [isOpen]);

  // Réinitialiser les états quand on ferme / ouvre
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedFacility(null);
      setSelectedSpecialty(null);
      setSelectedDate('');
      setSelectedTimeSlot('');
      setConfirmedAppointment(null);
      setErrorMsg(null);
    }
  }, [isOpen]);

  // Filtrer les structures selon Région, District, Type
  const filteredFacilities = facilities.filter(f => {
    if (selectedRegion !== 'Toutes' && f.region.toLowerCase() !== selectedRegion.toLowerCase()) return false;
    if (selectedDistrict !== 'Tous' && f.district.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
    if (selectedType !== 'all' && f.type !== selectedType) return false;
    return true;
  });

  // Quand une spécialité et une date changent, charger les créneaux
  useEffect(() => {
    if (!selectedFacility || !selectedSpecialty || !selectedDate) return;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/api/facilities/${selectedFacility.id}/slots?specialtyId=${selectedSpecialty.id}&date=${selectedDate}`
        );
        if (res.ok) {
          const data = await res.json();
          setSlotsData(data);
          // Si le créneau précédent n'est plus valide, le vider
          setSelectedTimeSlot('');
        }
      } catch (e) {
        console.error('Erreur créneaux', e);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedFacility, selectedSpecialty, selectedDate]);

  // Soumission finale du rendez-vous
  const handleConfirmBooking = async () => {
    if (!selectedFacility || !selectedSpecialty || !selectedDate || !selectedTimeSlot) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_URL}/api/facilities/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          patientPhone: contactPhone,
          patientEmail,
          facilityId: selectedFacility.id,
          specialtyId: selectedSpecialty.id,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          doctorName: selectedSpecialty.assignedDoctors?.[0] || 'Médecin de garde',
          reason
        })
      });

      const data = await res.json();
      if (res.ok) {
        setConfirmedAppointment(data.appointment);
        setCurrentStep(5);
        onAppointmentBooked(data.appointment);
      } else {
        setErrorMsg(data.error || 'Impossible de confirmer ce rendez-vous.');
      }
    } catch (e) {
      setErrorMsg('Erreur de connexion au serveur Sunu Santé.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        className="bg-white rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200 shadow-2xl max-w-2xl w-full h-[90dvh] sm:h-auto sm:max-h-[88vh] flex flex-col overflow-hidden"
      >
        {/* Mobile handle */}
        <div className="pt-2 sm:hidden flex justify-center">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header avec Stepper */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                {currentStep}
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {currentStep === 1 && "Étape 1 : Choisir la Structure de Santé"}
                  {currentStep === 2 && "Étape 2 : Choisir la Spécialité Médicale"}
                  {currentStep === 3 && "Étape 3 : Choisir le Jour & le Créneau"}
                  {currentStep === 4 && "Étape 4 : Validation du Ticket & Tarification"}
                  {currentStep === 5 && "Étape 5 : Rendez-vous Confirmé & Parcours"}
                </h3>
                <p className="text-[10px] text-slate-500">Parcours intelligent Sunu Santé</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all ${
                  step <= currentStep ? 'bg-teal-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 pb-3 overscroll-contain">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              ÉTAPE 1 : CHOISIR LA STRUCTURE DE SANTÉ
          ══════════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Filtrez selon votre localisation pour trouver l'établissement le plus proche :
              </p>

              {/* 3 Filtres : Région, District, Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                {/* 1. Région */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Région</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      setSelectedDistrict('Tous');
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                  >
                    {REGIONS_SENEGAL.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                {/* 2. District */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">District Sanitaire</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                  >
                    {(DISTRICTS_MAP[selectedRegion] || ["Tous"]).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Type d'établissement */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Type de structure</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                  >
                    <option value="all">Tous types</option>
                    <option value="hopital">🏥 Hôpital</option>
                    <option value="centre_de_sante">🏢 Centre de santé</option>
                    <option value="poste_de_sante">🏠 Poste de santé</option>
                  </select>
                </div>
              </div>

              {/* Liste des Établissements filtrés */}
              <div className="space-y-2.5 pt-1">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Établissements disponibles ({filteredFacilities.length})</span>
                </div>

                {isLoadingFacilities ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Chargement des structures de santé...
                  </div>
                ) : filteredFacilities.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    Aucun établissement ne correspond à ces critères. Essayez d'élargir le filtre.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {filteredFacilities.map((fac) => {
                      const isSel = selectedFacility?.id === fac.id;
                      const activeCount = fac.specialties?.filter(s => s.isActive).length || 0;
                      const typeLabel = fac.type === 'hopital' ? 'Hôpital' : fac.type === 'centre_de_sante' ? 'Centre de santé' : 'Poste de santé';

                      return (
                        <div
                          key={fac.id}
                          onClick={() => setSelectedFacility(fac)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                            isSel 
                              ? 'bg-teal-50/80 border-2 border-teal-600 shadow-sm ring-2 ring-teal-500/10' 
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {/* Icône type */}
                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              fac.type === 'hopital' ? 'bg-emerald-100 text-emerald-800' :
                              fac.type === 'centre_de_sante' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              <Building2 className="h-4.5 w-4.5" />
                            </div>

                            {/* Info principale */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1.5">
                                <h4 className="font-extrabold text-sm text-slate-900 truncate flex-1">{fac.name}</h4>
                                {/* Cercle de sélection */}
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center border flex-shrink-0 ${
                                  isSel ? 'bg-teal-600 text-white border-teal-600' : 'border-slate-300'
                                }`}>
                                  {isSel && <Check className="h-3 w-3" />}
                                </div>
                              </div>
                              {/* Type badge + spécialités sur la même ligne, jamais wrappé */}
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-slate-100 text-slate-600 uppercase whitespace-nowrap flex-shrink-0">
                                  {typeLabel}
                                </span>
                                <span className="text-[9px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded-md whitespace-nowrap flex-shrink-0">
                                  {activeCount} spéc.
                                </span>
                                <p className="text-[10px] text-slate-400 truncate">
                                  {fac.district}, {fac.region}
                                </p>
                              </div>
                              {/* Adresse */}
                              <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                                <MapPin className="h-2.5 w-2.5 text-slate-400 flex-shrink-0" />
                                <span className="truncate">{fac.address}</span>
                              </p>
                            </div>
                          </div>

                          {/* Action directe mobile si sélectionné */}
                          {isSel && (
                            <div className="mt-2.5 pt-2 border-t border-teal-200/80 flex items-center justify-between">
                              <span className="text-[11px] font-bold text-teal-800 flex items-center gap-1">
                                <Check className="h-3.5 w-3.5 text-teal-600" />
                                Sélectionné
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentStep(2);
                                }}
                                className="px-3 py-1 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                              >
                                <span>Choisir la spécialité</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              ÉTAPE 2 : CHOISIR LA SPÉCIALITÉ (SEULES CELLES DE CET ÉTABLISSEMENT)
          ══════════════════════════════════════════════════════════════════ */}
          {currentStep === 2 && selectedFacility && (
            <div className="space-y-4">
              <div className="bg-teal-50 border border-teal-200 p-3 rounded-2xl flex items-center gap-2.5 text-xs text-teal-900">
                <Building2 className="h-4 w-4 text-teal-600 flex-shrink-0" />
                <span>Établissement sélectionné : <strong>{selectedFacility.name}</strong></span>
              </div>

              <p className="text-xs text-slate-600">
                Voici les spécialités ouvertes et disponibles dans cet établissement :
              </p>

              {/* Grille des spécialités de cet établissement */}
              <div className="grid grid-cols-1 gap-2.5">
                {selectedFacility.specialties.filter(s => s.isActive).map((spec) => {
                  const isSel = selectedSpecialty?.id === spec.id;
                  const openDaysText = spec.availableDays.map(d => DAYS_NAMES[d]).join(', ');

                  return (
                    <div
                      key={spec.id}
                      onClick={() => setSelectedSpecialty(spec)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSel 
                          ? 'bg-teal-50/80 border-2 border-teal-600 shadow-sm ring-2 ring-teal-500/10' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                            <Stethoscope className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-900">{spec.name}</h4>
                            <p className="text-[11px] text-slate-500">
                              Praticien : {spec.assignedDoctors?.[0] || 'Médecin de garde'}
                            </p>
                          </div>
                        </div>

                        {/* PRIX DU TICKET FIXÉ PAR L'ÉTABLISSEMENT */}
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Prix Ticket</span>
                          <span className="text-sm font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                            {spec.ticketPrice.toLocaleString()} FCFA
                          </span>
                        </div>
                      </div>

                      {/* Jours et horaires de présence du spécialiste */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Calendar className="h-3.5 w-3.5 text-teal-600" />
                          <span className="font-semibold">Présence :</span>
                          <span className="font-bold text-slate-900">{openDaysText}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{spec.startTime} - {spec.endTime} &bull; {spec.slotDuration} min/patient</span>
                        </div>
                      </div>

                      {/* Action directe mobile si spécialité sélectionnée */}
                      {isSel && (
                        <div className="mt-2.5 pt-2 border-t border-teal-200/80 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-teal-800 flex items-center gap-1">
                            <Check className="h-3.5 w-3.5 text-teal-600" />
                            Spécialité sélectionnée
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentStep(3);
                            }}
                            className="px-3 py-1 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                          >
                            <span>Choisir le créneau</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              ÉTAPE 3 : CHOISIR LE JOUR ET LE CRÉNEAU
          ══════════════════════════════════════════════════════════════════ */}
          {currentStep === 3 && selectedFacility && selectedSpecialty && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Spécialité :</span>{' '}
                  <strong className="text-slate-900">{selectedSpecialty.name}</strong>
                </div>
                <div className="text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                  Tarif : {selectedSpecialty.ticketPrice.toLocaleString()} FCFA
                </div>
              </div>

              {/* Rappel des jours de présence */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-700 flex-shrink-0" />
                <span>
                  Le spécialiste consulte <strong>uniquement le(s) {selectedSpecialty.availableDays.map(d => DAYS_NAMES[d]).join(', ')}</strong> de {selectedSpecialty.startTime} à {selectedSpecialty.endTime}.
                </span>
              </div>

              {/* Sélection de la date */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  1. Choisissez une date de rendez-vous :
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-teal-500"
                />
              </div>

              {/* Résultat des Créneaux pour la date */}
              {selectedDate && (
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    2. Choisissez votre créneau horaire :
                  </label>

                  {slotsLoading ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      Vérification des disponibilités du praticien...
                    </div>
                  ) : slotsData && !slotsData.isDayAvailable ? (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Spécialiste non présent à cette date</p>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          {slotsData.reason || `Veuillez sélectionner un jour où le spécialiste est présent.`}
                        </p>
                      </div>
                    </div>
                  ) : slotsData && slotsData.isDayAvailable ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {slotsData.slots.map((slot) => {
                        const isSelected = selectedTimeSlot === slot.time;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={slot.isFull}
                            onClick={() => setSelectedTimeSlot(slot.time)}
                            className={`p-2.5 rounded-xl text-center text-xs font-bold transition-all border ${
                              slot.isFull
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                                : isSelected
                                ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-500/20'
                                : 'bg-white border-slate-200 text-slate-800 hover:border-teal-400 hover:bg-teal-50/50 cursor-pointer'
                            }`}
                          >
                            <span className="block font-mono text-sm">{slot.time}</span>
                            <span className={`text-[9px] block mt-0.5 ${slot.isFull ? 'text-rose-500 font-bold' : isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                              {slot.isFull ? 'Complet' : `${slot.availableCount} place(s)`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              ÉTAPE 4 : VOIR LE PRIX DU TICKET AVANT DE CONFIRMER
          ══════════════════════════════════════════════════════════════════ */}
          {currentStep === 4 && selectedFacility && selectedSpecialty && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Vérifiez le récapitulatif de votre rendez-vous et le tarif officiel fixé par l'établissement :
              </p>

              {/* TICKET VIRTUEL SUNU SANTÉ */}
              <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden border border-teal-800">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 pb-4 border-b border-white/10">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider border border-teal-500/30">
                      Ticket de Consultation
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-white mt-1.5 break-words">{selectedFacility.name}</h3>
                    <p className="text-[11px] text-slate-300">{selectedFacility.district}, {selectedFacility.region}</p>
                  </div>
                  
                  {/* PRIX FIXÉ PAR L'ÉTABLISSEMENT */}
                  <div className="bg-amber-400 text-slate-950 px-3 py-2 rounded-2xl text-center sm:text-right shadow-lg self-start flex-shrink-0">
                    <span className="text-[9px] font-black uppercase tracking-wider block whitespace-nowrap">Prix du Ticket</span>
                    <span className="text-base sm:text-lg font-black block whitespace-nowrap">
                      {selectedSpecialty.ticketPrice.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Spécialité</span>
                    <p className="font-bold text-white mt-0.5">{selectedSpecialty.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Médecin</span>
                    <p className="font-bold text-white mt-0.5">{selectedSpecialty.assignedDoctors?.[0] || 'Médecin de garde'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Date & Heure</span>
                    <p className="font-bold text-teal-300 mt-0.5 font-mono">{selectedDate} à {selectedTimeSlot}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Patient</span>
                    <p className="font-bold text-white mt-0.5">{patientName}</p>
                  </div>
                </div>
              </div>

              {/* Saisie motif & contact */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Motif de consultation</label>
                  <input
                    type="text"
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Téléphone pour rappel SMS</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Reassurance */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-teal-50/50 p-2.5 rounded-xl border border-teal-100">
                <ShieldCheck className="h-4 w-4 text-teal-600 flex-shrink-0" />
                <span>Le montant de {selectedSpecialty.ticketPrice.toLocaleString()} FCFA sera automatiquement synchronisé en Caisse dès votre arrivée.</span>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              ÉTAPE 5 : CONFIRMATION & PARCOURS DE SOINS
          ══════════════════════════════════════════════════════════════════ */}
          {currentStep === 5 && confirmedAppointment && (
            <div className="space-y-5 text-center py-2">
              <div className="h-16 w-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-extrabold px-3 py-1 rounded-full uppercase border border-emerald-200">
                  Statut : Confirmé
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Rendez-vous Confirmé avec Succès !</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Référence : <strong className="font-mono text-slate-900">{confirmedAppointment.id}</strong>
                </p>
              </div>

              {/* Parcours étape par étape expliqué au patient */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 text-left space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-teal-600" />
                  <span>Votre Parcours Médical à l'Hôpital :</span>
                </h4>

                <div className="space-y-3 pt-1">
                  <div className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-lg bg-teal-600 text-white text-[11px] font-black flex items-center justify-center flex-shrink-0">
                      1
                    </span>
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">Accueil & Pointage</p>
                      <p className="text-slate-500 text-[11px]">Présentez votre référence {confirmedAppointment.id} dès votre arrivée.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-lg bg-amber-500 text-white text-[11px] font-black flex items-center justify-center flex-shrink-0">
                      2
                    </span>
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">Caisse & Règlement Ticket</p>
                      <p className="text-slate-500 text-[11px]">
                        Le montant officiel de <strong>{confirmedAppointment.ticketPrice.toLocaleString()} FCFA</strong> s'affiche automatiquement en Caisse (espèces ou Wave).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-lg bg-purple-600 text-white text-[11px] font-black flex items-center justify-center flex-shrink-0">
                      3
                    </span>
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">Salle d'attente</p>
                      <p className="text-slate-500 text-[11px]">Votre nom est affiché sur l'écran dynamique en attente de votre tour.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-lg bg-blue-600 text-white text-[11px] font-black flex items-center justify-center flex-shrink-0">
                      4
                    </span>
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">Cabinet Médical</p>
                      <p className="text-slate-500 text-[11px]">Consultation avec {confirmedAppointment.doctorName || 'le médecin'}.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer avec boutons de navigation de l'assistant */}
        <div className="p-3.5 sm:p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-slate-200/80 bg-slate-50 flex items-center justify-between flex-shrink-0 gap-2">
          {currentStep > 1 && currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep - 1) as any)}
              className="px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Précédent</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep === 1 && (
            <button
              type="button"
              disabled={!selectedFacility}
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm cursor-pointer ml-auto"
            >
              <span>Choisir la spécialité</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

          {currentStep === 2 && (
            <button
              type="button"
              disabled={!selectedSpecialty}
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm cursor-pointer ml-auto"
            >
              <span>Choisir le créneau</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

          {currentStep === 3 && (
            <button
              type="button"
              disabled={!selectedDate || !selectedTimeSlot || !slotsData?.isDayAvailable}
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm cursor-pointer ml-auto"
            >
              <span>Voir le ticket & tarif</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

          {currentStep === 4 && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmBooking}
              className="px-5 sm:px-6 py-2.5 min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-teal-600/20 disabled:opacity-50 cursor-pointer ml-auto"
            >
              <span>{isSubmitting ? 'Confirmation...' : 'Confirmer le Rendez-vous'}</span>
              <Check className="h-4 w-4" />
            </button>
          )}

          {currentStep === 5 && (
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Terminer & Voir mes rendez-vous
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
