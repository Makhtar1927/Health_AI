'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusSquare, 
  Clock, 
  QrCode, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Search, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  TrendingDown, 
  Database, 
  ArrowRight,
  X
} from 'lucide-react';
import StaffHeader from '@/components/StaffHeader';

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
      date: "20/05/2026", 
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
      date: "20/05/2026", 
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
      date: "19/05/2026", 
      medications: [
        { name: "Diclofénac 50mg", dosage: "1 comprimé midi et soir au repas", quantity: "1 boîte" }
      ],
      status: "dispensed" 
    }
  ]);

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: "INV-01", name: "Amoxicilline 500mg", category: "Antibiotique", stock: 120, minStock: 30, status: "optimal" },
    { id: "INV-02", name: "Paracétamol 1g", category: "Antalgique", stock: 15, minStock: 50, status: "low" },
    { id: "INV-03", name: "Salbutamol 100µg", category: "Pneumologie", stock: 4, minStock: 20, status: "out" },
    { id: "INV-04", name: "Artéméther / Luméfantrine", category: "Antipaludéen", stock: 85, minStock: 25, status: "optimal" }
  ]);

  const [activeTabMobile, setActiveTabMobile] = useState<'prescriptions' | 'inventory'>('prescriptions');
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    initialize();
  }, [initialize]);

  const activeUser = user || {
    name: "Dr. Babacar Diagne",
    email: "pharmacien@healthai.sn",
    role: "pharmacist",
    details: { pharmacyName: "Pharmacie Centrale", city: "Dakar" }
  };

  const handleStartScan = () => {
    setScanModalOpen(true);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const pending = prescriptions.find(p => p.status === 'pending');
      if (pending) {
        setSelectedPrescription(pending);
      }
    }, 1800);
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
          stock: item.stock + 100,
          status: 'optimal'
        };
      }
      return item;
    }));
    
    const name = inventory.find(i => i.id === id)?.name;
    setToastMsg(`Commande de réapprovisionnement passée pour : ${name}.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const pendingPrescriptionsCount = prescriptions.filter(p => p.status === 'pending').length;
  const criticalStockCount = inventory.filter(i => i.status === 'low' || i.status === 'out').length;
  const dispensedTodayCount = prescriptions.filter(p => p.status === 'dispensed').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      
      {/* Shared Responsive Header */}
      <StaffHeader
        title="Espace Pharmacien & Officine"
        subtitle="Health AI Clinique"
        roleBadge="Pharmacien"
        badgeColor="bg-violet-50 text-violet-800 border-violet-200"
        icon={<PlusSquare className="h-5 w-5 text-violet-600" />}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
        
        {/* Mobile Switch Tabs */}
        <div className="lg:hidden flex items-center bg-white p-1 rounded-2xl border border-slate-200 mb-5 shadow-sm">
          <button
            onClick={() => setActiveTabMobile('prescriptions')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTabMobile === 'prescriptions' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Ordonnances ({pendingPrescriptionsCount})
          </button>
          <button
            onClick={() => setActiveTabMobile('inventory')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTabMobile === 'inventory' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Stock & Ruptures ({criticalStockCount})
          </button>
        </div>

        {/* Quick Stats Grid */}
        <section className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-6">
          <div className="bg-white border border-slate-200 p-3.5 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">En attente</p>
              <p className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">{pendingPrescriptionsCount}</p>
            </div>
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center">
              <FileText className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-3.5 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">Ruptures / Bas</p>
              <p className="text-xl sm:text-3xl font-extrabold text-rose-600 mt-0.5">{criticalStockCount}</p>
            </div>
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
              <TrendingDown className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-3.5 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">Délivrées</p>
              <p className="text-xl sm:text-3xl font-extrabold text-emerald-600 mt-0.5">{dispensedTodayCount}</p>
            </div>
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
          </div>
        </section>

        {/* 2-Columns Grid on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: QR Scan Banner & Prescriptions */}
          <div className={`space-y-6 lg:col-span-7 xl:col-span-8 ${activeTabMobile === 'inventory' ? 'hidden lg:block' : 'block'}`}>
            
            {/* QR Scan Action Board */}
            <section className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-md relative overflow-hidden text-white">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
                <QrCode className="h-48 w-48 text-white" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] bg-white/20 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Officine : {activeUser.details?.pharmacyName || "Pharmacie Centrale"}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black mt-2">Délivrance d'Ordonnance Sécurisée</h2>
                  <p className="text-violet-100 text-xs mt-0.5 max-w-lg">
                    Scannez l'ordonnance électronique cryptée pour certifier la prescription et automatiser la mise à jour des stocks.
                  </p>
                </div>

                <button
                  onClick={handleStartScan}
                  className="w-full md:w-auto h-11 px-5 bg-white hover:bg-slate-50 text-violet-900 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
                >
                  <QrCode className="h-4.5 w-4.5 text-violet-700" />
                  <span>Scanner un QR Code</span>
                  <ArrowRight className="h-3.5 w-3.5 text-violet-700" />
                </button>
              </div>
            </section>

            {/* Prescriptions List */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                  Prescriptions en Attente de Délivrance
                </h3>
                <span className="text-[10px] text-violet-700 font-bold bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full uppercase">
                  DMP Connecté
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {prescriptions.map(p => (
                  <div key={p.id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-50/70 transition-colors">
                    
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-slate-400 font-bold">{p.id}</span>
                        <h4 className="font-bold text-sm text-slate-900">{p.patientName}</h4>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          p.status === 'dispensed' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-violet-50 text-violet-700 border-violet-200'
                        }`}>
                          {p.status === 'dispensed' ? 'Délivrée' : 'En Attente'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-medium">
                        Prescripteur : <span className="text-slate-800 font-semibold">{p.doctorName}</span> &bull; Émise le {p.date}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {p.medications.map((m, idx) => (
                          <span key={idx} className="text-[11px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-slate-700">
                            💊 <strong>{m.name}</strong> ({m.dosage}) &bull; <span className="text-slate-500">{m.quantity}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end shrink-0 pt-1 sm:pt-0">
                      {p.status === 'pending' ? (
                        <button
                          onClick={() => handleDispense(p.id)}
                          className="h-8 sm:h-9 px-3.5 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Délivrer</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Validée</span>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column: Inventory & Stock */}
          <div className={`space-y-6 lg:col-span-5 xl:col-span-4 ${activeTabMobile === 'prescriptions' ? 'hidden lg:block' : 'block'}`}>
            
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <Database className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">Stock & Inventaire</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Alerte de réapprovisionnement</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 font-bold">
                  En Direct
                </span>
              </div>

              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {inventory.map(item => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900">{item.name}</h4>
                        <p className="text-[10px] text-slate-400">{item.category}</p>
                      </div>
                      
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                        item.status === 'optimal' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : item.status === 'low' 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {item.status === 'optimal' ? 'Optimal' : item.status === 'low' ? 'Bas' : 'Rupture'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Stock : <strong className="text-slate-800">{item.stock} unités</strong></span>
                        <span>Seuil : {item.minStock}</span>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.status === 'optimal' 
                              ? 'bg-emerald-500' 
                              : item.status === 'low' 
                                ? 'bg-amber-500' 
                                : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, (item.stock / 150) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {(item.status === 'low' || item.status === 'out') && (
                      <button
                        onClick={() => handleReorder(item.id)}
                        className="w-full mt-1 py-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 font-bold text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <PlusSquare className="h-3.5 w-3.5" />
                        <span>Commander réapprovisionnement</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

          </div>

        </div>

      </main>

      {/* Pop-up QR Scanner Simulation Modal */}
      <AnimatePresence>
        {scanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-slate-900 relative"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-violet-600" />
                  <h3 className="font-extrabold text-base">Scanner d'Ordonnance</h3>
                </div>
                <button 
                  onClick={() => { setScanModalOpen(false); setSelectedPrescription(null); }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isScanning ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <div className="relative w-36 h-36 border-2 border-violet-500 rounded-2xl flex items-center justify-center overflow-hidden bg-violet-50/30">
                    <div className="absolute top-0 left-0 w-full h-1 bg-violet-600 animate-[bounce_2s_infinite]" />
                    <QrCode className="h-16 w-16 text-violet-300 animate-pulse" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Recherche du QR code de l'ordonnance...</p>
                </div>
              ) : selectedPrescription ? (
                <div className="space-y-4">
                  <div className="p-4 bg-violet-50/70 border border-violet-200 rounded-2xl space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-violet-700 font-bold uppercase tracking-wider">Ordonnance Certifiée</span>
                        <h4 className="font-bold text-slate-900 text-sm">{selectedPrescription.patientName}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">{selectedPrescription.id}</span>
                    </div>

                    <p className="text-xs text-slate-500">
                      Médecin : <strong>{selectedPrescription.doctorName}</strong> &bull; {selectedPrescription.date}
                    </p>

                    <div className="border-t border-violet-100 pt-2 space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Médicaments à délivrer :</p>
                      {selectedPrescription.medications.map((m, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-800">
                          <span>💊 <strong>{m.name}</strong></span>
                          <span className="text-slate-500">{m.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex gap-2 text-xs text-emerald-800">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Signature électronique vérifiée. Ordonnance valide et non encore dispensée.</span>
                  </div>

                  <button
                    onClick={() => handleDispense(selectedPrescription.id)}
                    className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 font-bold text-xs text-white cursor-pointer shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="h-4 w-4" />
                    <span>Délivrer et Décompter du Stock</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-500">Aucun QR code détecté.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-violet-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs">
          <Sparkles className="h-4 w-4 text-white animate-pulse" />
          {toastMsg}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 sm:py-4 px-4 text-center text-[11px] text-slate-400">
        &copy; {new Date().getFullYear()} Health AI &bull; Module Officinal de Pharmacie & Gestion des Stocks.
      </footer>
    </div>
  );
}
