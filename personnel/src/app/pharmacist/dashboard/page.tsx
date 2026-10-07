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
  LogOut,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Database,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

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
  const { user, isAuthenticated, logout, initialize } = useAuthStore();

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
      patientName: "Moussa Diop", 
      doctorName: "Dr. Babacar Sy", 
      date: "20/05/2026", 
      medications: [
        { name: "Metformine 1000mg", dosage: "1 comprimé au dîner", quantity: "3 boîtes" },
        { name: "Insuline Glargine", dosage: "20 unités au coucher", quantity: "1 stylo" }
      ],
      status: "pending" 
    },
    { 
      id: "ORD-7301", 
      patientName: "Fatou Sow", 
      doctorName: "Dr. Awa Ndiaye", 
      date: "19/05/2026", 
      medications: [
        { name: "Furosémide 40mg", dosage: "1 comprimé le matin", quantity: "1 boîte" }
      ],
      status: "dispensed" 
    }
  ]);

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: "INV-101", name: "Amoxicilline 500mg", category: "Antibiotique", stock: 120, minStock: 30, status: "optimal" },
    { id: "INV-102", name: "Paracétamol 1g (Doliprane)", category: "Antalgique", stock: 18, minStock: 50, status: "low" },
    { id: "INV-103", name: "Metformine 1000mg", category: "Antidiabétique", stock: 65, minStock: 20, status: "optimal" },
    { id: "INV-104", name: "Insuline Glargine", category: "Insuline", stock: 3, minStock: 10, status: "low" },
    { id: "INV-105", name: "Artésunate 120mg", category: "Antipaludéen", stock: 0, minStock: 15, status: "out" },
    { id: "INV-106", name: "Furosémide 40mg", category: "Diurétique", stock: 40, minStock: 15, status: "optimal" }
  ]);

  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const activeUser = user || {
    name: "Moustapha Seck",
    email: "moustapha.seck@sunusante.sn",
    role: "pharmacist",
    details: { pharmacyName: "Pharmacie de la Nation", city: "Dakar" }
  };

  const handleLogoutClick = () => {
    logout();
    router.push('/pharmacist/login');
  };

  // Simulate QR Code scanning
  const handleStartScan = () => {
    setScanModalOpen(true);
    setIsScanning(true);
    // Simulate camera delay then load a prescription
    setTimeout(() => {
      setIsScanning(false);
      // Load first pending prescription
      const pending = prescriptions.find(p => p.status === 'pending');
      if (pending) {
        setSelectedPrescription(pending);
      }
    }, 2000);
  };

  // Validate Dispensation
  const handleDispense = (id: string) => {
    setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status: 'dispensed' } : p));
    
    // Decrement stock for the medications listed in prescription
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

  // Reorder Item
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

  // Stats
  const pendingPrescriptionsCount = prescriptions.filter(p => p.status === 'pending').length;
  const criticalStockCount = inventory.filter(i => i.status === 'low' || i.status === 'out').length;
  const dispensedTodayCount = prescriptions.filter(p => p.status === 'dispensed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
            <PlusSquare className="h-5.5 w-5.5" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight">Espace Pharmacien & Dispensaire</h1>
            <p className="text-[9px] text-violet-400 font-semibold uppercase tracking-wider">Sunu Santé Clinique</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-violet-500 animate-pulse" />
            Dr. {activeUser.name}
          </span>
          <button 
            onClick={handleLogoutClick}
            className="text-xs text-slate-400 hover:text-violet-400 transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent border-0"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Quitter</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (QR Scanner & Prescription processing) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Stats Grid */}
          <section className="grid grid-cols-3 gap-4">
            
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ordonnances en attente</h3>
                <p className="text-2xl font-black">{pendingPrescriptionsCount}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Médicaments en rupture</h3>
                <p className="text-2xl font-black text-rose-400">{criticalStockCount}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <TrendingDown className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Délivrances aujourd'hui</h3>
                <p className="text-2xl font-black text-emerald-400">{dispensedTodayCount}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>

          </section>

          {/* QR Scan Action Board */}
          <section className="bg-gradient-to-r from-violet-600 to-fuchsia-700 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-white">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
              <QrCode className="h-56 w-56" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="text-[9px] bg-white/20 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Officine : {activeUser.details?.pharmacyName || "Pharmacie Centrale"} ({activeUser.details?.city || "Sénégal"})
                </span>
                <h2 className="text-2xl font-black mt-3">Validation par QR Code</h2>
                <p className="text-violet-100 text-xs mt-1 leading-relaxed">
                  Lisez instantanément les ordonnances électroniques cryptées émises par le médecin traitant du patient pour une dispensation sécurisée.
                </p>
              </div>

              <button
                onClick={handleStartScan}
                className="h-12 px-6 bg-white hover:bg-slate-100 text-violet-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg flex-shrink-0"
              >
                <QrCode className="h-5 w-5" />
                Scanner un QR Code
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          {/* Pending Prescriptions List */}
          <section className="bg-slate-950/40 rounded-3xl border border-slate-800/80 overflow-hidden shadow-glass backdrop-blur-glass">
            
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight">Prescriptions en Attente de Délivrance</h3>
              <span className="text-[9px] text-violet-400 font-bold bg-violet-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Liaison Ordonnance</span>
            </div>

            <div className="divide-y divide-slate-900">
              {prescriptions.map(p => (
                <div key={p.id} className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/5 transition-colors">
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-slate-500 font-bold">{p.id}</span>
                      <h4 className="font-extrabold text-slate-200">{p.patientName}</h4>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                        p.status === 'dispensed' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-violet-500/10 text-violet-400'
                      }`}>
                        {p.status === 'dispensed' ? 'Dispensée' : 'En Attente'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-semibold">
                      Prescripteur : <span className="text-slate-300 font-medium">{p.doctorName}</span> &bull; Émise le {p.date}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {p.medications.map((m, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800/80 text-slate-300">
                          💊 <strong>{m.name}</strong> ({m.dosage}) &bull; <span className="text-slate-400">{m.quantity}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {p.status === 'pending' && (
                    <button
                      onClick={() => handleDispense(p.id)}
                      className="h-9 px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      <Check className="h-4 w-4" />
                      Délivrer
                    </button>
                  )}

                </div>
              ))}
            </div>

          </section>

        </div>

        {/* Right Column (Inventory and alerts) */}
        <div className="space-y-6">
          
          {/* Inventory alert */}
          <section className="bg-slate-950/40 rounded-3xl border border-slate-800/80 p-6 flex flex-col shadow-glass backdrop-blur-glass">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
                  <Database className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-200">Stock & Inventaire</h3>
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Alerte de réapprovisionnement</p>
                </div>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/10 font-bold">Temps Réel</span>
            </div>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {inventory.map(item => (
                <div key={item.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-200">{item.name}</h4>
                      <p className="text-[9px] text-slate-500">{item.category}</p>
                    </div>
                    
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                      item.status === 'optimal' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : item.status === 'low' 
                          ? 'bg-amber-500/10 text-amber-400' 
                          : 'bg-red-500/10 text-red-400 animate-pulse'
                    }`}>
                      {item.status === 'optimal' ? 'Optimal' : item.status === 'low' ? 'Bas' : 'Rupture'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-slate-400">
                      <span>Stock : <strong>{item.stock} unités</strong></span>
                      <span>Seuil Min : {item.minStock}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.status === 'optimal' 
                            ? 'bg-emerald-500' 
                            : item.status === 'low' 
                              ? 'bg-amber-500' 
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, (item.stock / 150) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {(item.status === 'low' || item.status === 'out') && (
                    <button
                      onClick={() => handleReorder(item.id)}
                      className="w-full mt-1 py-1.5 rounded-lg bg-violet-600/10 hover:bg-violet-600 text-violet-400 hover:text-white border border-violet-500/20 font-bold text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <PlusSquare className="h-3.5 w-3.5" />
                      Commander réapprovisionnement
                    </button>
                  )}
                </div>
              ))}
            </div>

          </section>

        </div>

      </main>

      {/* Pop-up QR Scanner Simulation Modal */}
      <AnimatePresence>
        {scanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-slate-100 relative overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-violet-500" />
                  <h3 className="font-extrabold text-base">Scanner de Prescription</h3>
                </div>
                <button 
                  onClick={() => { setScanModalOpen(false); setSelectedPrescription(null); }}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-semibold"
                >
                  Annuler
                </button>
              </div>

              {isScanning ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="relative w-40 h-40 border-2 border-violet-500/50 rounded-2xl flex items-center justify-center overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-violet-500 animate-[bounce_2s_infinite]" />
                    <QrCode className="h-20 w-20 text-slate-700 animate-pulse" />
                  </div>
                  <p className="text-xs text-slate-400 animate-pulse">Accès caméra sécurisé... Recherche QR Code</p>
                </div>
              ) : selectedPrescription ? (
                <div className="space-y-4">
                  <div className="p-4 bg-violet-950/20 border border-violet-500/20 rounded-2xl space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] text-violet-400 font-bold uppercase tracking-wider">Ordonnance Électronique</span>
                        <h4 className="font-extrabold text-white text-sm">{selectedPrescription.patientName}</h4>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 font-bold">{selectedPrescription.id}</span>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Prescrit par : <strong>{selectedPrescription.doctorName}</strong> &bull; Date: {selectedPrescription.date}
                    </p>

                    <div className="border-t border-slate-800/80 pt-2 mt-2 space-y-2">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Médicaments à délivrer :</p>
                      {selectedPrescription.medications.map((m, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-200">
                          <span>💊 <strong>{m.name}</strong></span>
                          <span className="text-slate-400">{m.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex gap-2 text-[10px] text-emerald-400">
                    <ShieldCheck className="h-4.5 w-4.5 flex-shrink-0" />
                    <span>Signature électronique vérifiée. L'ordonnance est valide et n'a jamais été dispensée auparavant.</span>
                  </div>

                  <button
                    onClick={() => handleDispense(selectedPrescription.id)}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-700 hover:from-violet-500 hover:to-fuchsia-600 font-bold text-xs text-white cursor-pointer shadow-lg shadow-violet-700/10 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="h-4.5 w-4.5" />
                    Délivrer et Mettre à Jour le Stock
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-400">Aucun QR code valide détecté.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-violet-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
          {toastMsg}
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
        &copy; {new Date().getFullYear()} Sunu Santé - Module de Dispensation de Pharmacie v1. Tous droits réservés.
      </footer>
    </div>
  );
}
