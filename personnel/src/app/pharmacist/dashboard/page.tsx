'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusSquare, 
  Clock, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Search, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  TrendingDown, 
  Package, 
  ArrowRight,
  X,
  Pill,
  Truck,
  ScanLine,
  Activity,
  Layers,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';
import Link from 'next/link';
import PharmacyShell from '@/components/pharmacist/PharmacyShell';

interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  medications: Array<{ name: string; dosage: string; quantity: string }>;
  status: 'pending' | 'dispensed';
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  status: 'optimal' | 'low' | 'out';
}

export default function PharmacistDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, initialize } = useAuthStore();

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { 
      id: "ORD-9304", 
      patientName: "Awa Ndiaye", 
      doctorName: "Dr. Awa Ndiaye", 
      date: "15/10/2026", 
      medications: [
        { name: "Amoxicilline 500mg", dosage: "1 gélule 3 fois/jour", quantity: "2 boîtes" },
        { name: "Paracétamol 1g", dosage: "1 comprimé toutes les 6 heures si douleur", quantity: "1 boîte" }
      ],
      status: "pending" 
    },
    { 
      id: "ORD-8492", 
      patientName: "Cheikh Tidiane Diop", 
      doctorName: "Dr. Aminata Touré", 
      date: "15/10/2026", 
      medications: [
        { name: "Salbutamol Aérosol 100µg", dosage: "2 bouffées en cas de crise", quantity: "1 flacon" },
        { name: "Prednisolone 20mg", dosage: "2 comprimés le matin pendant 5 jours", quantity: "1 boîte" }
      ],
      status: "pending" 
    },
    { 
      id: "ORD-7123", 
      patientName: "Amadou Sall", 
      doctorName: "Dr. Abdoulaye Diallo", 
      date: "14/10/2026", 
      medications: [
        { name: "Diclofénac 50mg", dosage: "1 comprimé midi et soir au repas", quantity: "1 boîte" }
      ],
      status: "dispensed" 
    }
  ]);

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: "INV-01", name: "Amoxicilline 500mg", category: "Antibiotique", stock: 120, minStock: 30, status: "optimal" },
    { id: "INV-02", name: "Paracétamol 1g", category: "Antalgique", stock: 15, minStock: 50, status: "low" },
    { id: "INV-03", name: "Salbutamol 100µg", category: "Pneumologie", stock: 0, minStock: 20, status: "out" },
    { id: "INV-04", name: "Artéméther / Luméfantrine", category: "Antipaludéen", stock: 85, minStock: 25, status: "optimal" },
    { id: "INV-05", name: "Prednisolone 20mg", category: "Anti-inflammatoire", stock: 45, minStock: 15, status: "optimal" },
    { id: "INV-06", name: "Ventoline Aérosol 100µg", category: "Pneumologie", stock: 38, minStock: 10, status: "optimal" }
  ]);

  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Diagnostic de disponibilité immédiate des stocks pour chaque médicament prescrit
  const checkMedicationStock = (medName: string) => {
    const rootName = medName.split(' ')[0].toLowerCase();
    const item = inventory.find(inv => 
      inv.name.toLowerCase().includes(rootName) ||
      rootName.includes(inv.name.toLowerCase().split(' ')[0])
    );

    if (!item || item.stock === 0) {
      let alt = null;
      if (rootName.includes('salbutamol')) {
        alt = { name: "Ventoline Aérosol 100µg", stock: 38, note: "Même molécule & dosage identique (DCI)" };
      } else if (rootName.includes('paracétamol') || rootName.includes('doliprane')) {
        alt = { name: "Paracétamol 500mg DCI", stock: 80, note: "Prendre 2 comprimés pour dose 1g" };
      } else if (rootName.includes('amoxicilline')) {
        alt = { name: "Clamoxyl 500mg", stock: 60, note: "Princeps équivalent disponible" };
      }
      return {
        isAvailable: false,
        stock: item?.stock || 0,
        status: 'out' as const,
        item,
        alternative: alt
      };
    }

    const isLow = item.stock < item.minStock;
    return {
      isAvailable: true,
      stock: item.stock,
      status: isLow ? ('low' as const) : ('optimal' as const),
      item,
      alternative: null
    };
  };

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleStartScan = (targetPrescription?: Prescription) => {
    setScanModalOpen(true);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const toSelect = targetPrescription || prescriptions.find(p => p.status === 'pending') || prescriptions[0];
      if (toSelect) {
        setSelectedPrescription(toSelect);
      }
    }, 1200);
  };

  const handleSubstitute = (originalName: string, altName: string) => {
    if (!selectedPrescription) return;
    setSelectedPrescription({
      ...selectedPrescription,
      medications: selectedPrescription.medications.map(m => 
        m.name === originalName ? { ...m, name: `${altName} (Substitution IA)` } : m
      )
    });
    setToastMsg(`Substitution validée : ${altName} à la place de ${originalName}.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDispense = (id: string) => {
    setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status: 'dispensed' } : p));
    
    const p = prescriptions.find(pres => pres.id === id);
    if (p) {
      setInventory(prev => prev.map(item => {
        const match = p.medications.some(med => item.name.toLowerCase().includes(med.name.split(' ')[0].toLowerCase()));
        if (match) {
          const newStock = Math.max(0, item.stock - 2);
          const isLow = newStock < item.minStock;
          return {
            ...item,
            stock: newStock,
            status: newStock === 0 ? 'out' : isLow ? 'low' : 'optimal'
          };
        }
        return item;
      }));
    }

    setToastMsg(`Dispensation validée avec succès pour ${p?.patientName}.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setScanModalOpen(false);
    setSelectedPrescription(null);
  };

  const handleReorder = (id: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          stock: item.stock + 80,
          status: 'optimal'
        };
      }
      return item;
    }));
    
    const name = inventory.find(i => i.id === id)?.name;
    setToastMsg(`Commande de réapprovisionnement transmise à COPHASE pour : ${name}.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const pendingPrescriptionsCount = prescriptions.filter(p => p.status === 'pending').length;
  const criticalStockCount = inventory.filter(i => i.status === 'low' || i.status === 'out').length;
  const dispensedTodayCount = prescriptions.filter(p => p.status === 'dispensed').length;

  return (
    <PharmacyShell
      title="Tableau de Bord Officinal"
      subtitle="Supervision des ordonnances, alertes de stock & contrôle IA"
      onQuickAction={handleStartScan}
      quickActionLabel="Scanner QR Ordonnance"
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 rounded-xl bg-violet-50 border border-violet-200 text-violet-950 text-xs font-bold flex items-center justify-between shadow-md"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-violet-600" />
                <span>{toastMsg}</span>
              </div>
              <button onClick={() => setShowToast(false)} className="text-violet-700 hover:text-violet-900">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4 Métriques d'activité de l'officine */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Ordonnances en attente</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{pendingPrescriptionsCount}</p>
              <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                Temps d&apos;attente moyen : 4 min
              </span>
            </div>
            <div className="h-11 w-11 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Ruptures & Stocks Bas</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{criticalStockCount}</p>
              <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1 mt-1">
                <AlertTriangle className="h-3 w-3" />
                Réapprovisionnement conseillé
              </span>
            </div>
            <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Délivrées ce jour</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">{dispensedTodayCount + 28}</p>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                <CheckCircle2 className="h-3 w-3" />
                100% Vérifiées par IA
              </span>
            </div>
            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <Pill className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Taux de Service</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">98.4%</p>
              <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-1">
                <Sparkles className="h-3 w-3 text-violet-600" />
                Objectif mensuel atteint
              </span>
            </div>
            <div className="h-11 w-11 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </section>

        {/* Section double colonne : Ordonnances récentes + Stocks critiques */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Colonne gauche : File des ordonnances (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">File des Ordonnances Télétransmises</h3>
                    <p className="text-[11px] text-slate-500">Mises à disposition par les médecins de la clinique</p>
                  </div>
                </div>

                <Link
                  href="/pharmacist/dispense"
                  className="text-xs font-extrabold text-violet-600 hover:text-violet-700 flex items-center gap-1"
                >
                  Voir tout &rarr;
                </Link>
              </div>

              <div className="space-y-3">
                {prescriptions.map(p => {
                  const isPending = p.status === 'pending';
                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl bg-slate-50 hover:bg-violet-50/40 border border-slate-200/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-violet-800">{p.id}</span>
                          <span className="text-xs font-black text-slate-900">{p.patientName}</span>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                            isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isPending ? 'En attente' : 'Délivrée'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Prescrit par <strong className="text-slate-700">{p.doctorName}</strong> &bull; {p.date}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {p.medications.map((m, idx) => (
                            <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                              {m.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {isPending ? (
                          <button
                            type="button"
                            onClick={() => handleStartScan(p)}
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all border-0"
                          >
                            <ScanLine className="h-3.5 w-3.5" />
                            Scanner & Contrôler Stock
                          </button>
                        ) : (
                          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Complétée
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Colonne droite : Alertes Stocks & Grossistes (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Alertes Ruptures de Stock</h3>
                    <p className="text-[11px] text-slate-500">Seuils minimaux d&apos;alerte atteints</p>
                  </div>
                </div>

                <Link
                  href="/pharmacist/inventory"
                  className="text-xs font-extrabold text-violet-600 hover:text-violet-700 flex items-center gap-1"
                >
                  Gérer &rarr;
                </Link>
              </div>

              <div className="space-y-3">
                {inventory.map(item => {
                  const isCritical = item.status === 'low' || item.status === 'out';
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
                        item.status === 'out'
                          ? 'bg-rose-50/70 border-rose-200'
                          : item.status === 'low'
                          ? 'bg-amber-50/70 border-amber-200'
                          : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-black text-slate-900 block">{item.name}</span>
                        <span className="text-[10px] text-slate-500">{item.category} &bull; Seuil min : {item.minStock}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            item.status === 'out'
                              ? 'bg-rose-200/80 text-rose-900'
                              : item.status === 'low'
                              ? 'bg-amber-200/80 text-amber-900'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            Stock : {item.stock} unités
                          </span>
                        </div>
                      </div>

                      {isCritical && (
                        <button
                          type="button"
                          onClick={() => handleReorder(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-[11px] flex items-center gap-1 border border-slate-200 shadow-xs cursor-pointer transition-colors shrink-0"
                        >
                          <Truck className="h-3.5 w-3.5 text-violet-600" />
                          Commander (+80)
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assistance et Liaisons */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-200/70 flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-black text-violet-950">Conseil Pharmaceutique Health AI</p>
                <p className="text-[11px] text-violet-900 leading-relaxed">
                  L&apos;IA compare les ordonnances aux interactions connues et antécédents patients pour zéro risque iatrogène.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Modal Scanner QR Code interactif */}
      <AnimatePresence>
        {scanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setScanModalOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative w-full ${isScanning ? 'max-w-sm' : 'max-w-xl'} bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 z-10 text-left transition-all`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
                    <ScanLine className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900">
                      {isScanning ? "Lecteur Caméra QR Code" : "Contrôle & Disponibilité Stock Ordonnance"}
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      {isScanning ? "Alignez le code dans le cadre" : "Analyse automatique des disponibilités en officine"}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setScanModalOpen(false);
                    setSelectedPrescription(null);
                  }} 
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {isScanning ? (
                <div className="space-y-4 py-4 text-center">
                  <div className="relative w-48 h-48 mx-auto rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center border-2 border-dashed border-violet-400">
                    <QrCode className="h-28 w-28 text-slate-600 animate-pulse" />
                    <motion.div
                      animate={{ y: [-80, 80] }}
                      transition={{ repeat: Infinity, duration: 1.2, repeatType: 'reverse' }}
                      className="absolute inset-x-2 h-1 bg-violet-400 shadow-md shadow-violet-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">Lecture optique en cours...</p>
                    <p className="text-[10px] text-slate-500">Pointez la caméra vers l&apos;ordonnance patient</p>
                  </div>
                </div>
              ) : selectedPrescription ? (
                <div className="space-y-4">
                  {/* Info Patient & Prescripteur */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                        {selectedPrescription.id}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 mt-1">{selectedPrescription.patientName}</h4>
                      <p className="text-[10px] text-slate-500">{selectedPrescription.doctorName} &bull; {selectedPrescription.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Signature Certifiée
                      </span>
                    </div>
                  </div>

                  {/* Analyse disponibilité des médicaments */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Médicaments prescrits & État des stocks :
                    </p>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {selectedPrescription.medications.map((med, idx) => {
                        const stockInfo = checkMedicationStock(med.name);
                        return (
                          <div 
                            key={idx} 
                            className={`p-3 rounded-2xl border text-xs transition-all ${
                              !stockInfo.isAvailable 
                                ? 'bg-rose-50/50 border-rose-200' 
                                : stockInfo.status === 'low' 
                                  ? 'bg-amber-50/50 border-amber-200' 
                                  : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <Pill className={`h-3.5 w-3.5 ${
                                    !stockInfo.isAvailable ? 'text-rose-600' : 'text-violet-600'
                                  }`} />
                                  <span className="font-extrabold text-slate-900">{med.name}</span>
                                </div>
                                <p className="text-[11px] text-slate-600 mt-0.5">{med.dosage}</p>
                                <span className="text-[10px] text-slate-400 font-medium">Quantité : {med.quantity}</span>
                              </div>

                              <div className="text-right shrink-0">
                                {stockInfo.isAvailable ? (
                                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                                    stockInfo.status === 'low'
                                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  }`}>
                                    <Check className="h-3 w-3" />
                                    {stockInfo.status === 'low' ? `Stock faible (${stockInfo.stock})` : `En stock (${stockInfo.stock})`}
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    Rupture (0 en stock)
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Suggestion d'alternative automatique */}
                            {!stockInfo.isAvailable && stockInfo.alternative && (
                              <div className="mt-2.5 pt-2 border-t border-rose-200/80 flex items-center justify-between gap-2 bg-white/80 p-2 rounded-xl">
                                <div>
                                  <span className="text-[9px] font-black uppercase text-violet-700 flex items-center gap-1">
                                    <Sparkles className="h-3 w-3" />
                                    Alternative DCI disponible :
                                  </span>
                                  <p className="text-[11px] font-bold text-slate-800">
                                    {stockInfo.alternative.name} ({stockInfo.alternative.stock} en stock)
                                  </p>
                                  <p className="text-[9px] text-slate-500">{stockInfo.alternative.note}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleSubstitute(med.name, stockInfo.alternative!.name)}
                                  className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-[10px] shrink-0 transition-colors shadow-xs"
                                >
                                  Remplacer
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions de délivrance */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/pharmacist/dispense?id=${selectedPrescription.id}`}
                      className="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Dispensation Complète
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const nextPending = prescriptions.find(p => p.status === 'pending' && p.id !== selectedPrescription.id);
                          if (nextPending) {
                            handleStartScan(nextPending);
                          } else {
                            handleStartScan();
                          }
                        }}
                        className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                      >
                        Scanner Autre
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDispense(selectedPrescription.id)}
                        className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Délivrer et Déstocker
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </PharmacyShell>
  );
}
