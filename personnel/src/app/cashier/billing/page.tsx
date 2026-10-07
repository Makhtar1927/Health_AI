'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  CreditCard,
  Plus,
  Trash2,
  CheckCircle,
  Percent,
  Layers,
  ArrowUpRight,
  Wallet,
  Smartphone,
  QrCode,
  Loader2,
  Check,
  FileText,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

interface Act {
  name: string;
  price: number;
}

export default function CashierBilling() {
  const [selectedPatient, setSelectedPatient] = useState('Cheikh Tidiane Diop');
  const [selectedActs, setSelectedActs] = useState<Act[]>([
    { name: "Radiographie Pulmonaire - Face", price: 25000 }
  ]);
  const [insurance, setInsurance] = useState<'NONE' | 'IPM' | 'CMU' | 'AXA'>('IPM');
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'WAVE'>('WAVE');

  // Wave Payment Simulation States
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<1 | 2 | 3>(1); // 1: Form, 2: Push SMS sent, 3: Completed
  const [phoneInput, setPhoneInput] = useState('+221 77 654 32 10');

  // Available Acts list
  const availableActs = [
    { name: "Consultation Médecine Générale", price: 10000 },
    { name: "Consultation Spécialiste", price: 15000 },
    { name: "Radiographie Pulmonaire - Face", price: 25000 },
    { name: "Radiographie Genou - Profil", price: 25000 },
    { name: "Scanner Cérébral", price: 120000 },
    { name: "Analyse Sanguine (NFS)", price: 8000 }
  ];

  const handleAddAct = (actName: string) => {
    const act = availableActs.find(a => a.name === actName);
    if (act) {
      setSelectedActs([...selectedActs, act]);
    }
  };

  const handleRemoveAct = (index: number) => {
    setSelectedActs(selectedActs.filter((_, i) => i !== index));
  };

  // Pricing calculations
  const totalGross = selectedActs.reduce((acc, curr) => acc + curr.price, 0);

  const getInsurancePercent = () => {
    switch (insurance) {
      case 'IPM': return 80;
      case 'CMU': return 100;
      case 'AXA': return 70;
      default: return 0;
    }
  };

  const insuranceRate = getInsurancePercent();
  const insuranceShare = (totalGross * insuranceRate) / 100;
  const patientShare = totalGross - insuranceShare;

  // Process Wave Mobile Payment Simulation
  const triggerMobilePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMode === 'CASH') {
      // Direct Cash checkout
      setIsProcessingPayment(true);
      setTimeout(() => {
        setIsProcessingPayment(false);
        setPaymentStep(3);
      }, 1000);
      return;
    }

    // Wave Flow
    setIsProcessingPayment(true);
    setPaymentStep(2); // SMS push state
  };

  const simulatePatientValidation = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentStep(3); // Completed state
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/cashier/dashboard" className="h-10 w-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 border border-slate-700 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Facturation & Caisse</h1>
            <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Sunu Santé &bull; Passerelle Wave & Bizao</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-amber-400" />
            Caissier Principal Active
          </span>
        </div>
      </header>

      {/* Main Billing Workspace */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Billing Selection inputs (2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          
          <AnimatePresence mode="wait">
            {paymentStep !== 3 ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Form parameters */}
                <section className="bg-slate-950/40 rounded-3xl border border-slate-800/80 p-6 space-y-6 shadow-glass backdrop-blur-glass">
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-900">
                    <Layers className="h-5 w-5 text-amber-400" />
                    <h3 className="font-extrabold text-base tracking-tight">Paramètres de Facturation</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Patient */}
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-400">Patient à facturer</label>
                      <select
                        value={selectedPatient}
                        onChange={e => setSelectedPatient(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-300 transition-colors"
                      >
                        <option value="Cheikh Tidiane Diop">Cheikh Tidiane Diop (67 ans)</option>
                        <option value="Amadou Sall">Amadou Sall (42 ans)</option>
                        <option value="Aissatou Sow">Aissatou Sow (5 ans)</option>
                      </select>
                    </div>

                    {/* Insurance */}
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-400">Taux de couverture Tiers-Payant</label>
                      <select
                        value={insurance}
                        onChange={e => setInsurance(e.target.value as any)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-300 transition-colors"
                      >
                        <option value="NONE">Aucune Assurance (Ticket modérateur 100%)</option>
                        <option value="IPM">IPM (Remboursement Tiers-Payant 80%)</option>
                        <option value="CMU">CMU - Gratuité Totale (100%)</option>
                        <option value="AXA">AXA Partenaire (Remboursement Tiers-Payant 70%)</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Acts list */}
                <section className="bg-slate-950/40 rounded-3xl border border-slate-800/80 p-6 space-y-6 shadow-glass backdrop-blur-glass">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-900">
                    <h3 className="font-extrabold text-base tracking-tight text-slate-200">Actes Médicaux & Prestations Cliniques</h3>
                    <span className="text-[10px] text-slate-500 font-bold">Ticket de caisse</span>
                  </div>

                  {/* Add Act Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-400">Ajouter un acte médical</label>
                    <select
                      onChange={e => {
                        if (e.target.value) {
                          handleAddAct(e.target.value);
                          e.target.value = ''; // Reset select
                        }
                      }}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-300 transition-colors"
                    >
                      <option value="">-- Sélectionnez un acte à ajouter --</option>
                      {availableActs.map((a, idx) => (
                        <option key={idx} value={a.name}>{a.name} ({a.price.toLocaleString()} FCFA)</option>
                      ))}
                    </select>
                  </div>

                  {/* Acts items */}
                  <div className="space-y-3">
                    {selectedActs.map((act, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-900 border border-slate-850 p-4 rounded-xl">
                        <div>
                          <span className="text-xs font-extrabold text-slate-200">{act.name}</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{act.price.toLocaleString()} FCFA</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAct(idx)}
                          className="h-8 w-8 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            ) : (
              /* Step 3: Success Screen Printable Receipt */
              <motion.div 
                key="receipt"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white text-slate-950 p-8 rounded-3xl border border-slate-200 space-y-6 shadow-2xl relative"
              >
                {/* Branding header receipt */}
                <div className="text-center space-y-1 pb-6 border-b border-slate-200">
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Sunu Santé</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Clinique Médicale Dakar Plateau</p>
                  <p className="text-[9px] text-slate-400">Date : {new Date().toLocaleDateString('fr-FR')} &bull; Heure : {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                {/* Patient metadata */}
                <div className="text-xs space-y-1.5 font-medium border-b border-slate-200 pb-4">
                  <p><strong>Patient :</strong> {selectedPatient}</p>
                  <p><strong>Facture :</strong> FAC-{Math.floor(1000 + Math.random() * 9000)}</p>
                  <p><strong>Règlement :</strong> {paymentMode === 'WAVE' ? 'Mobile Money (Wave)' : 'Espèces'}</p>
                </div>

                {/* Acts detail grid */}
                <div className="space-y-3 py-2 border-b border-slate-200">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Prestations Facturées</span>
                  {selectedActs.map((act, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-semibold">
                      <span>{act.name}</span>
                      <span>{act.price.toLocaleString()} F</span>
                    </div>
                  ))}
                </div>

                {/* Pricing totals */}
                <div className="space-y-2 text-xs font-semibold pt-2">
                  <div className="flex justify-between">
                    <span>Total Brut actes :</span>
                    <span>{totalGross.toLocaleString()} FCFA</span>
                  </div>
                  
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Couverture Assurance ({insuranceRate}%) :</span>
                    <span>- {insuranceShare.toLocaleString()} FCFA</span>
                  </div>

                  <div className="flex justify-between text-lg font-black text-slate-900 border-t border-slate-200 pt-3">
                    <span>Ticket Modérateur Encaissé :</span>
                    <span>{patientShare.toLocaleString()} FCFA</span>
                  </div>
                </div>

                {/* Success Seal watermark */}
                <div className="pt-6 text-center">
                  <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-green-500/20">
                    <CheckCircle className="h-4 w-4 fill-green-500/5 text-green-600" />
                    Paiement Validé & Archivé
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                  <button onClick={() => window.print()} className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer">
                    Imprimer Reçu
                  </button>
                  <Link href="/cashier/dashboard" className="h-10 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center transition-colors">
                    Fermer la session Facture
                  </Link>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right column: Checkout Calculation & Interactive Payment Simulator (1 Column) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Real-time price receipt check */}
          <section className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800/80 shadow-glass backdrop-blur-glass space-y-6">
            
            <div className="border-b border-slate-900 pb-4">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-amber-400" />
                Règlement Ticket Modérateur
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between text-slate-400 font-bold">
                <span>Total brut prestations :</span>
                <span className="text-slate-200">{totalGross.toLocaleString()} FCFA</span>
              </div>

              <div className="flex justify-between text-slate-400 font-bold">
                <span>Remboursement Assurance ({insuranceRate}%) :</span>
                <span className="text-amber-400">- {insuranceShare.toLocaleString()} FCFA</span>
              </div>

              <div className="flex justify-between text-base font-black border-t border-slate-900 pt-4">
                <span className="text-slate-300">Net Patient à percevoir :</span>
                <span className="text-emerald-400">{patientShare.toLocaleString()} FCFA</span>
              </div>
            </div>

            {/* Selector cash or wave */}
            {paymentStep === 1 && (
              <div className="pt-2 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Mode de règlement</label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMode('WAVE')}
                      className={`h-11 rounded-xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMode === 'WAVE'
                          ? 'bg-amber-600/10 border-amber-500 text-amber-400'
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Smartphone className="h-4 w-4" />
                      Mobile Money (Wave)
                    </button>

                    <button
                      onClick={() => setPaymentMode('CASH')}
                      className={`h-11 rounded-xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMode === 'CASH'
                          ? 'bg-amber-600/10 border-amber-500 text-amber-400'
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Wallet className="h-4 w-4" />
                      Espèces / Cash
                    </button>
                  </div>
                </div>

                {paymentMode === 'WAVE' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Numéro de téléphone du patient</label>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={e => setPhoneInput(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-white"
                    />
                  </div>
                )}

                <button
                  onClick={triggerMobilePayment}
                  disabled={selectedActs.length === 0 || isProcessingPayment}
                  className="w-full h-12 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 disabled:opacity-50 transition-colors"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                      Lancement passerelle...
                    </>
                  ) : (
                    <>
                      Valider et Encaisser ({patientShare.toLocaleString()} F)
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Mobile Push Simulator Active */}
            {paymentStep === 2 && (
              <div className="p-5 bg-amber-600/5 border border-amber-500/20 rounded-2xl space-y-4 text-center">
                
                <div className="h-10 w-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto animate-bounce">
                  <Smartphone className="h-5 w-5" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-slate-200">SMS Push Wave Émis</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Demande de débit de <strong className="text-slate-200">{patientShare.toLocaleString()} FCFA</strong> envoyée au numéro <strong className="text-slate-200">{phoneInput}</strong>.
                  </p>
                </div>

                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ x: ["-100%", "100%"] }} 
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-1/3 h-full bg-amber-500 rounded-full" 
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={simulatePatientValidation}
                    disabled={isProcessingPayment}
                    className="w-full h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/10 transition-colors"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Traitement bancaire...
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Simuler la validation du patient
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setPaymentStep(1)}
                    className="text-[10px] text-slate-500 hover:text-slate-300 font-bold block mx-auto hover:underline"
                  >
                    Annuler le paiement mobile
                  </button>
                </div>

              </div>
            )}

            {paymentStep === 3 && (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl text-center space-y-2">
                <CheckCircle className="h-10 w-10 mx-auto text-emerald-400" />
                <h4 className="text-xs font-extrabold text-slate-200">Règlement complété !</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Le paiement a été validé sur la passerelle. La facture a été marquée comme payée dans le grand livre des caisses.
                </p>
              </div>
            )}

          </section>

        </div>

      </main>

      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
        &copy; {new Date().getFullYear()} Sunu Santé - Caisse & Facturation Connectée.
      </footer>
    </div>
  );
}
