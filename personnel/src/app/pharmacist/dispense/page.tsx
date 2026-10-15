'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, 
  Search, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Check, 
  Printer, 
  User, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  X,
  Loader2,
  ScanLine,
  MapPin,
  RefreshCw,
  Zap,
  TrendingDown,
  Layers,
  Info,
  DollarSign
} from 'lucide-react';
import PharmacyShell from '@/components/pharmacist/PharmacyShell';

interface AlternativeDrug {
  name: string;
  dosage: string;
  dci: string;
  stockQty: number;
  location: string;
  price: number;
  reason: string;
}

interface MedicationItem {
  id: string;
  name: string;
  dci: string;
  dosage: string;
  quantityPrescribed: number;
  unit: string;
  availableStock: number;
  location: string;
  price: number;
  status: 'available' | 'partial' | 'out_of_stock';
  advice: string;
  alternative?: AlternativeDrug;
  isSubstituted?: boolean;
}

interface Prescription {
  id: string;
  patientName: string;
  patientAge: number;
  patientAllergies: string[];
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  insuranceName: string;
  insuranceRate: number; // e.g. 80 for 80%
  medications: MedicationItem[];
  status: 'pending' | 'dispensed';
  aiClinicalNote: string;
}

export default function PharmacistDispensePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'dispensed'>('pending');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  
  // QR Scan simulator
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [manualCodeInput, setManualCodeInput] = useState('');

  // Dispense action
  const [isDispensing, setIsDispensing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: "ORD-9304",
      patientName: "Awa Ndiaye",
      patientAge: 34,
      patientAllergies: ["Aucune allergie connue"],
      doctorName: "Dr. Awa Ndiaye",
      doctorSpecialty: "Médecine Générale",
      date: "15/10/2026",
      insuranceName: "IPM Banque Centrale",
      insuranceRate: 80,
      status: "pending",
      aiClinicalNote: "Posologie conforme au poids et à l'âge. Aucun conflit iatrogène détecté.",
      medications: [
        {
          id: "MED-01",
          name: "Amoxicilline 500mg Gélules",
          dci: "Amoxicilline trihydratée",
          dosage: "1 gélule 3 fois par jour au repas",
          quantityPrescribed: 2,
          unit: "boîtes",
          availableStock: 45,
          location: "Rayon Antibiotiques A-12",
          price: 2500,
          status: "available",
          advice: "Prendre en début de repas. Respecter scrupuleusement la durée prescrite (7 jours)."
        },
        {
          id: "MED-02",
          name: "Paracétamol 1g Comprimés",
          dci: "Paracétamol",
          dosage: "1 comprimé toutes les 6 heures si douleur",
          quantityPrescribed: 1,
          unit: "boîte",
          availableStock: 18,
          location: "Rayon Antalgiques B-03",
          price: 1200,
          status: "available",
          advice: "Ne pas dépasser 3g par jour. Espacer les prises d'au moins 4 heures."
        }
      ]
    },
    {
      id: "ORD-8492",
      patientName: "Cheikh Tidiane Diop",
      patientAge: 67,
      patientAllergies: ["Asthme sévère", "Intolérance aspirine"],
      doctorName: "Dr. Aminata Touré",
      doctorSpecialty: "Pneumologie & Allergologie",
      date: "15/10/2026",
      insuranceName: "CMU Gratuité Séniors",
      insuranceRate: 100,
      status: "pending",
      aiClinicalNote: "Vérifier la technique d'inhalation du patient pour le traitement aérosol.",
      medications: [
        {
          id: "MED-03",
          name: "Ventoline Aérosol 100µg (Princeps)",
          dci: "Salbutamol sulfate",
          dosage: "2 bouffées en cas de crise d'asthme",
          quantityPrescribed: 1,
          unit: "flacon",
          availableStock: 0, // En RUPTURE !
          location: "Rayon Pneumologie P-04",
          price: 4500,
          status: "out_of_stock",
          advice: "Rincer la bouche après inhalation. Garder toujours sur soi.",
          alternative: {
            name: "Salbutamol Mylan Générique 100µg",
            dosage: "Flacon pressurisé 200 doses (Exactement identique)",
            dci: "Salbutamol sulfate 100µg",
            stockQty: 24,
            location: "Rayon Génériques G-08",
            price: 3600,
            reason: "Bioéquivalence stricte validée & remboursable à 100% par la CMU"
          }
        },
        {
          id: "MED-04",
          name: "Prednisolone 20mg Comprimés",
          dci: "Prednisolone métasulfobenzoate",
          dosage: "2 comprimés le matin pendant 5 jours",
          quantityPrescribed: 2,
          unit: "boîtes",
          availableStock: 1, // STOCK PARTIEL (1 dispo sur 2 requises)
          location: "Rayon Corticoïdes C-02",
          price: 2800,
          status: "partial",
          advice: "Prendre le matin au petit-déjeuner pour respecter le rythme circadien.",
          alternative: {
            name: "Solupred 20mg Comprimés effervescents",
            dosage: "Boîte de 20 comprimés effervescents",
            dci: "Prednisolone",
            stockQty: 15,
            location: "Rayon Corticoïdes C-03",
            price: 3100,
            reason: "Complément immédiat disponible pour honorer la totalité de l'ordonnance"
          }
        }
      ]
    },
    {
      id: "ORD-7123",
      patientName: "Amadou Sall",
      patientAge: 42,
      patientAllergies: ["Aucune"],
      doctorName: "Dr. Abdoulaye Diallo",
      doctorSpecialty: "Traumatologie",
      date: "14/10/2026",
      insuranceName: "AXA Santé Partenaire",
      insuranceRate: 70,
      status: "dispensed",
      aiClinicalNote: "Traitement antalgique post-traumatique.",
      medications: [
        {
          id: "MED-05",
          name: "Diclofénac 50mg Comprimés",
          dci: "Diclofénac sodique",
          dosage: "1 comprimé midi et soir au cours du repas",
          quantityPrescribed: 1,
          unit: "boîte",
          availableStock: 32,
          location: "Rayon Rhumatologie R-05",
          price: 1900,
          status: "available",
          advice: "Ne pas prendre à jeun. Consulter en cas de brûlures d'estomac."
        }
      ]
    }
  ]);

  // Filtrage
  const filteredPrescriptions = prescriptions.filter(p => {
    const matchSearch = p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'all') return matchSearch;
    return matchSearch && p.status === filterStatus;
  });

  // Gestion du scanner
  const handleStartScan = () => {
    setIsScanModalOpen(true);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Sélectionne par exemple l'ordonnance avec rupture pour démontrer l'IA
      const target = prescriptions.find(p => p.id === "ORD-8492") || prescriptions[0];
      setSelectedPrescription(target);
    }, 1400);
  };

  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCodeInput.trim()) return;
    const found = prescriptions.find(p => p.id.toLowerCase() === manualCodeInput.trim().toLowerCase());
    if (found) {
      setSelectedPrescription(found);
      setIsScanModalOpen(false);
      setManualCodeInput('');
    } else {
      setToastMessage(`Aucune ordonnance trouvée avec le code : ${manualCodeInput}`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Substitution par alternative générique
  const handleApplySubstitution = (prescriptionId: string, medId: string) => {
    setPrescriptions(prev => prev.map(p => {
      if (p.id !== prescriptionId) return p;
      return {
        ...p,
        medications: p.medications.map(m => {
          if (m.id !== medId || !m.alternative) return m;
          return {
            ...m,
            name: `${m.alternative.name} (Substitut DCI)`,
            dosage: m.alternative.dosage,
            availableStock: m.alternative.stockQty,
            location: m.alternative.location,
            price: m.alternative.price,
            status: 'available',
            isSubstituted: true
          };
        })
      };
    }));

    // Mettre à jour l'ordonnance actuellement sélectionnée
    setSelectedPrescription(prev => {
      if (!prev || prev.id !== prescriptionId) return prev;
      return {
        ...prev,
        medications: prev.medications.map(m => {
          if (m.id !== medId || !m.alternative) return m;
          return {
            ...m,
            name: `${m.alternative.name} (Substitut DCI)`,
            dosage: m.alternative.dosage,
            availableStock: m.alternative.stockQty,
            location: m.alternative.location,
            price: m.alternative.price,
            status: 'available',
            isSubstituted: true
          };
        })
      };
    });

    setToastMessage(`Substitution générique appliquée avec succès. Médicament désormais disponible en rayon.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Validation de la dispensation
  const handleConfirmDispense = (id: string) => {
    setIsDispensing(true);
    setTimeout(() => {
      setPrescriptions(prev => prev.map(p => {
        if (p.id !== id) return p;
        return {
          ...p,
          status: 'dispensed',
          medications: p.medications.map(m => ({
            ...m,
            availableStock: Math.max(0, m.availableStock - m.quantityPrescribed)
          }))
        };
      }));

      setIsDispensing(false);
      setToastMessage(`Délivrance validée pour ${selectedPrescription?.patientName}. Stocks officinaux décomptés.`);
      setTimeout(() => setToastMessage(null), 4000);

      if (selectedPrescription?.id === id) {
        setSelectedPrescription(prev => prev ? { ...prev, status: 'dispensed' } : null);
      }
    }, 1100);
  };

  // Calculs financiers pour l'ordonnance sélectionnée
  const currentTotal = selectedPrescription?.medications.reduce((acc, m) => acc + (m.price * m.quantityPrescribed), 0) || 0;
  const currentInsuranceRate = selectedPrescription?.insuranceRate || 0;
  const insuranceAmount = (currentTotal * currentInsuranceRate) / 100;
  const patientRemainder = currentTotal - insuranceAmount;

  // Calcul du taux de disponibilité
  const totalMeds = selectedPrescription?.medications.length || 0;
  const availableMeds = selectedPrescription?.medications.filter(m => m.status === 'available').length || 0;
  const hasOutStock = selectedPrescription?.medications.some(m => m.status === 'out_of_stock' || m.status === 'partial');

  return (
    <PharmacyShell
      title="Délivrance & Contrôle des Ordonnances"
      subtitle="Vérification instantanée de la disponibilité des stocks & substitutions DCI"
      onQuickAction={handleStartScan}
      quickActionLabel="Scanner une Ordonnance"
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Toast de confirmation */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 rounded-xl bg-violet-50 border border-violet-200 text-violet-950 text-xs font-bold flex items-center justify-between shadow-md"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-violet-600 shrink-0" />
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="text-violet-700 hover:text-violet-900 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Barre d'outils, Recherche & Déclencheur Scanner */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Champ recherche */}
          <div className="relative w-full md:w-96">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher patient, N° ordonnance (ex: ORD-8492), médecin..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-800"
            />
          </div>

          {/* Filtres & Bouton Scan */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'pending' ? 'bg-white text-violet-800 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                À délivrer ({prescriptions.filter(p => p.status === 'pending').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('dispensed')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'dispensed' ? 'bg-white text-violet-800 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Délivrées ({prescriptions.filter(p => p.status === 'dispensed').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'all' ? 'bg-white text-violet-800 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Toutes ({prescriptions.length})
              </button>
            </div>

            <button
              type="button"
              onClick={handleStartScan}
              className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm shadow-violet-600/20 cursor-pointer transition-all shrink-0"
            >
              <ScanLine className="h-4 w-4" />
              <span>Scanner Ordonnance</span>
            </button>
          </div>

        </div>

        {/* Grille principale : Liste des ordonnances & Détail actif de dispensation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Colonne gauche : Liste des ordonnances en file d'attente (5 cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Ordonnances au Guichet ({filteredPrescriptions.length})
              </span>
              <span className="text-[11px] text-slate-400">Cliquez pour vérifier le stock</span>
            </div>

            {filteredPrescriptions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center shadow-sm">
                <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Aucune ordonnance correspondante</p>
                <p className="text-[11px] text-slate-400 mt-1">Utilisez le bouton Scanner ci-dessus.</p>
              </div>
            ) : (
              filteredPrescriptions.map(prescription => {
                const isSelected = selectedPrescription?.id === prescription.id;
                const isPending = prescription.status === 'pending';
                const hasRupture = prescription.medications.some(m => m.status === 'out_of_stock');
                const hasPartial = prescription.medications.some(m => m.status === 'partial');

                return (
                  <div
                    key={prescription.id}
                    onClick={() => setSelectedPrescription(prescription)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs ${
                      isSelected
                        ? 'border-violet-500 ring-2 ring-violet-500/20 shadow-md'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-violet-800 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200/60">
                            {prescription.id}
                          </span>
                          <span className="text-xs font-black text-slate-900">{prescription.patientName}</span>
                          <span className="text-[10px] text-slate-500 font-bold">({prescription.patientAge} ans)</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {prescription.doctorName} &bull; <strong className="text-slate-700">{prescription.insuranceName} ({prescription.insuranceRate}%)</strong>
                        </p>
                      </div>

                      {/* Indicateur de disponibilité globale sur la carte */}
                      <div className="shrink-0 text-right">
                        {isPending ? (
                          hasRupture ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                              <AlertTriangle className="h-3 w-3 text-rose-600" />
                              Rupture stock
                            </span>
                          ) : hasPartial ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                              <AlertTriangle className="h-3 w-3 text-amber-600" />
                              Stock partiel
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              100% En stock
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            <Check className="h-3 w-3" />
                            Délivrée
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Liste rapide des médicaments */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {prescription.medications.map(m => (
                        <span 
                          key={m.id} 
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            m.status === 'out_of_stock'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200 line-through'
                              : m.status === 'partial'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-50 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <Pill className="h-3 w-3" />
                          {m.name.split(' ')[0]} ({m.quantityPrescribed} {m.unit})
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Colonne droite : Détail de l'ordonnance & Contrôle de Disponibilité en Stock (7 cols) */}
          <div className="lg:col-span-7">
            {selectedPrescription ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-6 shadow-sm">
                
                {/* En-tête Ordonnance & Patient */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-violet-800 bg-violet-50 px-2.5 py-0.5 rounded-md border border-violet-200">
                        {selectedPrescription.id}
                      </span>
                      <h3 className="text-base font-black text-slate-900">{selectedPrescription.patientName}</h3>
                      <span className="text-xs text-slate-500 font-bold">({selectedPrescription.patientAge} ans)</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Prescription du <strong className="text-slate-700">{selectedPrescription.date}</strong> &bull; {selectedPrescription.doctorName} ({selectedPrescription.doctorSpecialty})
                    </p>
                  </div>

                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto ${
                    selectedPrescription.status === 'pending'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {selectedPrescription.status === 'pending' ? 'En cours de délivrance' : 'Ordonnance honorée'}
                  </span>
                </div>

                {/* BANDEAU DISPONIBILITÉ GLOBALE EN STOCK */}
                <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                  !hasOutStock
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      !hasOutStock ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {!hasOutStock ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-black">
                        {!hasOutStock 
                          ? "Disponibilité Officinale : 100% des médicaments sont en rayon" 
                          : "Disponibilité Partielle : Rupture détectée & Alternatives proposées"}
                      </h4>
                      <p className="text-[11px] opacity-80 mt-0.5">
                        {availableMeds} sur {totalMeds} médicament(s) immédiatement prêts à être délivrés.
                      </p>
                    </div>
                  </div>
                  
                  <span className="text-xs font-black font-mono px-2.5 py-1 rounded-lg bg-white/90 border border-slate-200">
                    {Math.round((availableMeds / totalMeds) * 100)}% DISPO
                  </span>
                </div>

                {/* NOTE CLINIQUE & ALLERGIES PATIENT */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                      Contrôle Pharmaceutique IA Health AI
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      Allergies : <strong className="text-rose-600">{selectedPrescription.patientAllergies.join(', ')}</strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {selectedPrescription.aiClinicalNote}
                  </p>
                </div>

                {/* LISTE DÉTAILLÉE DES MÉDICAMENTS AVEC DISPONIBILITÉ & EMPLACEMENT */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Médicaments Prescrits & Disponibilité en Rayon
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">Emplacements réels officine</span>
                  </div>

                  <div className="space-y-3.5">
                    {selectedPrescription.medications.map(med => {
                      const isAvailable = med.status === 'available';
                      const isPartial = med.status === 'partial';
                      const isOut = med.status === 'out_of_stock';

                      return (
                        <div 
                          key={med.id} 
                          className={`p-4 rounded-xl border transition-all ${
                            isOut
                              ? 'bg-rose-50/30 border-rose-200'
                              : isPartial
                              ? 'bg-amber-50/30 border-amber-200'
                              : 'bg-slate-50/70 border-slate-200/90'
                          }`}
                        >
                          {/* Ligne principale du médicament */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-black text-slate-900">{med.name}</span>
                                {med.isSubstituted && (
                                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-violet-100 text-violet-900 border border-violet-200">
                                    Substitué par le Pharmacien
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium">
                                DCI : <strong className="text-slate-700">{med.dci}</strong> &bull; Quantité demandée : <strong>{med.quantityPrescribed} {med.unit}</strong>
                              </p>
                              <p className="text-xs text-slate-700 font-semibold pt-0.5">
                                Posologie : {med.dosage}
                              </p>
                            </div>

                            {/* Badge de disponibilité en stock & Rayon */}
                            <div className="shrink-0 flex flex-col items-end gap-1">
                              {isAvailable && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black border border-emerald-300">
                                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                                  En stock ({med.availableStock} boîtes)
                                </span>
                              )}
                              {isPartial && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300">
                                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                                  Stock limité ({med.availableStock} sur {med.quantityPrescribed} requises)
                                </span>
                              )}
                              {isOut && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-black border border-rose-300">
                                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                                  Rupture de Stock (0 en rayon)
                                </span>
                              )}

                              {/* Localisation dans la pharmacie */}
                              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-slate-400" />
                                {med.location}
                              </span>
                            </div>
                          </div>

                          {/* Conseils au patient */}
                          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 italic">
                              Conseil délivrance : {med.advice}
                            </span>
                            <span className="font-bold text-slate-800">
                              {(med.price * med.quantityPrescribed).toLocaleString()} FCFA
                            </span>
                          </div>

                          {/* ENCART SUGGESTION D'ALTERNATIVE GÉNÉRIQUE DCI EN CAS DE RUPTURE OU STOCK LIMITÉ */}
                          {med.alternative && !med.isSubstituted && (
                            <div className="mt-3 p-3.5 rounded-xl bg-violet-50/80 border border-violet-200 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs font-black text-violet-950">
                                  <Zap className="h-4 w-4 text-violet-600" />
                                  <span>Proposition de Substitution Générique Health AI</span>
                                </div>
                                <span className="text-[10px] font-extrabold text-violet-700 bg-white px-2 py-0.5 rounded-md border border-violet-200">
                                  DCI Équivalente
                                </span>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-violet-100">
                                <div>
                                  <span className="text-xs font-extrabold text-slate-900 block">{med.alternative.name}</span>
                                  <span className="text-[10px] text-slate-500 block">{med.alternative.dosage} &bull; Emplacement : <strong>{med.alternative.location}</strong></span>
                                  <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                                    Disponibilité en réserve : {med.alternative.stockQty} boîtes &bull; {med.alternative.reason}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleApplySubstitution(selectedPrescription.id, med.id)}
                                  className="px-3.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors shrink-0"
                                >
                                  <RefreshCw className="h-3.5 w-3.5" />
                                  Remplacer par ce générique
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RÉCAPITULATIF FINANCIER & TIERS-PAYANT */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-slate-600">
                    <span>Total brut ordonnance :</span>
                    <span className="text-slate-900">{currentTotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between font-bold text-violet-700">
                    <span>Prise en charge {selectedPrescription.insuranceName} ({currentInsuranceRate}%) :</span>
                    <span>- {insuranceAmount.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 border-t border-slate-200 pt-2">
                    <span>Reste à percevoir du patient :</span>
                    <span className="text-emerald-700 font-black">{patientRemainder.toLocaleString()} FCFA</span>
                  </div>
                </div>

                {/* BOUTON D'ACTION : VALIDATION DE LA DÉLIVRANCE */}
                <div className="pt-2">
                  {selectedPrescription.status === 'pending' ? (
                    <button
                      type="button"
                      onClick={() => handleConfirmDispense(selectedPrescription.id)}
                      disabled={isDispensing}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm shadow-violet-600/25 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      {isDispensing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Décompte des stocks officinaux & signature cryptographique...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Valider la dispensation & Décompter les stocks ({patientRemainder.toLocaleString()} F à encaisser)
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <Printer className="h-4 w-4 text-slate-600" />
                        Imprimer le Reçu de Dispensation & Ticket Posologique
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPrescription(null)}
                        className="h-11 px-5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-800 text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        Passer à l&apos;ordonnance suivante
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-sm text-slate-400 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto">
                  <Pill className="h-7 w-7" />
                </div>
                <h3 className="text-sm font-black text-slate-800">Aucune ordonnance sélectionnée au guichet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Scannez le QR Code patient ou choisissez une ordonnance dans la liste de gauche pour contrôler la disponibilité immédiate des stocks.
                </p>
                <button
                  type="button"
                  onClick={handleStartScan}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <ScanLine className="h-4 w-4" />
                  Scanner maintenant
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* MODAL SCANNER QR CODE & CODE MANUEL */}
      <AnimatePresence>
        {isScanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsScanModalOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 text-center z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                    <QrCode className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-black text-slate-900 block">Lecteur Guichet Pharmacie</span>
                    <span className="text-[10px] text-slate-500">Scanner QR ou saisie du N° ordonnance</span>
                  </div>
                </div>
                <button onClick={() => setIsScanModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Viseur caméra simulé */}
              <div className="relative w-56 h-56 mx-auto rounded-3xl bg-slate-950 overflow-hidden flex items-center justify-center border-2 border-dashed border-violet-400 shadow-inner">
                <QrCode className="h-32 w-32 text-slate-700" />
                
                {/* Ligne laser animée */}
                {isScanning && (
                  <motion.div
                    animate={{ y: [-90, 90] }}
                    transition={{ repeat: Infinity, duration: 1.3, repeatType: 'reverse' }}
                    className="absolute inset-x-3 h-1 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 shadow-lg shadow-violet-400/80 rounded-full"
                  />
                )}

                {/* Coin du viseur */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-violet-400" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-violet-400" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-violet-400" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-violet-400" />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-black text-slate-800">
                  {isScanning ? "Lecture du flux vidéo & décodage..." : "Ordonnance détectée & analysée !"}
                </p>
                <p className="text-[11px] text-slate-500">
                  {isScanning ? "Présentez le QR Code de l'ordonnance ou saisissez le code ci-dessous" : "Chargement immédiat du contrôle des stocks..."}
                </p>
              </div>

              {/* Formulaire saisie manuelle si le QR est abîmé */}
              <form onSubmit={handleManualCodeSubmit} className="pt-2 border-t border-slate-100 space-y-2.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ou tapez le code (ex: ORD-8492)"
                    value={manualCodeInput}
                    onChange={e => setManualCodeInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl cursor-pointer"
                  >
                    Valider
                  </button>
                </div>
              </form>

              {!isScanning && (
                <button
                  type="button"
                  onClick={() => setIsScanModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                >
                  Ouvrir l&apos;ordonnance & Vérifier la disponibilité
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </PharmacyShell>
  );
}
