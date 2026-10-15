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
  UserCheck,
  Printer,
  ShieldCheck,
  Sparkles,
  Receipt
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import CashierShell from '@/components/cashier/CashierShell';

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
      }, 900);
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
    }, 1400);
  };

  return (
    <CashierShell
      title="Terminal de Facturation des Actes"
      subtitle="Encaissement Mobile Money Wave, Espèces, Tiers-Payant & IPM"
    >
      {/* Main Billing Workspace */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Billing Selection inputs (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          <AnimatePresence mode="wait">
            {paymentStep !== 3 ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Form parameters */}
                <section className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Paramètres de la Facture</h3>
                        <p className="text-[11px] text-slate-500">Identification du patient & couverture assurance</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                      Étape 1 sur 2
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Patient */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Patient à facturer</label>
                      <select
                        value={selectedPatient}
                        onChange={e => setSelectedPatient(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                      >
                        <option value="Cheikh Tidiane Diop">Cheikh Tidiane Diop (67 ans &bull; SN-2024-001)</option>
                        <option value="Amadou Sall">Amadou Sall (42 ans &bull; SN-2024-089)</option>
                        <option value="Aissatou Sow">Aissatou Sow (5 ans &bull; SN-2024-112)</option>
                        <option value="Mariama Ba">Mariama Ba (29 ans &bull; SN-2024-205)</option>
                      </select>
                    </div>

                    {/* Insurance */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Taux de couverture Tiers-Payant</label>
                      <select
                        value={insurance}
                        onChange={e => setInsurance(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                      >
                        <option value="NONE">Aucune Assurance (Ticket modérateur 100%)</option>
                        <option value="IPM">IPM Partenaire (Prise en charge 80%)</option>
                        <option value="CMU">CMU Sécurité (Gratuité Totale 100%)</option>
                        <option value="AXA">AXA Santé (Prise en charge 70%)</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Acts list */}
                <section className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Actes Médicaux & Prestations Cliniques</h3>
                      <p className="text-[11px] text-slate-500">Ajoutez les prestations réalisées lors de la consultation</p>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {selectedActs.length} acte{selectedActs.length > 1 ? 's' : ''} sélectionné{selectedActs.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Add Act Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Ajouter un acte médical</label>
                    <div className="relative">
                      <select
                        onChange={e => {
                          if (e.target.value) {
                            handleAddAct(e.target.value);
                            e.target.value = ''; // Reset select
                          }
                        }}
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                      >
                        <option value="">-- Sélectionnez un acte dans la nomenclature officielle --</option>
                        {availableActs.map((a, idx) => (
                          <option key={idx} value={a.name}>{a.name} &bull; {a.price.toLocaleString()} FCFA</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Acts items */}
                  <div className="space-y-2.5 pt-1">
                    {selectedActs.length === 0 ? (
                      <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                        <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-500">Aucun acte médical ajouté</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Sélectionnez une prestation ci-dessus pour calculer le total</p>
                      </div>
                    ) : (
                      selectedActs.map((act, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/80 p-3.5 rounded-xl transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-black flex items-center justify-center shadow-xs">
                              {idx + 1}
                            </span>
                            <div>
                              <span className="text-xs font-extrabold text-slate-800">{act.name}</span>
                              <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">
                                {act.price.toLocaleString()} FCFA
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAct(idx)}
                            className="h-8 w-8 rounded-lg bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer border border-slate-200 hover:border-red-200 shadow-xs"
                            title="Supprimer l'acte"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </motion.div>
            ) : (
              /* Step 3: Success Screen Printable Receipt */
              <motion.div 
                key="receipt"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-200 space-y-6 shadow-md relative"
              >
                {/* Branding header receipt */}
                <div className="text-center space-y-2 pb-6 border-b border-slate-200">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Image
                      src="/HealthAI_symbole.png"
                      alt="Health AI"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                    <span className="text-lg font-black uppercase tracking-tight text-slate-900">Health AI</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Clinique Médicale Dakar Plateau</p>
                  <p className="text-[10px] text-slate-400">Date : {new Date().toLocaleDateString('fr-FR')} &bull; Heure : {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} &bull; Guichet Caisse N°1</p>
                </div>

                {/* Patient metadata */}
                <div className="text-xs space-y-1.5 font-medium border-b border-slate-200 pb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patient :</span>
                    <strong className="text-slate-800">{selectedPatient}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Numéro Quittance :</span>
                    <strong className="font-mono text-slate-800">FAC-2024-{Math.floor(1000 + Math.random() * 9000)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Règlement :</span>
                    <strong className="text-emerald-700">{paymentMode === 'WAVE' ? 'Mobile Money (Wave Sénégal)' : 'Espèces (Comptant)'}</strong>
                  </div>
                </div>

                {/* Acts detail grid */}
                <div className="space-y-2.5 py-2 border-b border-slate-200">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Prestations Facturées</span>
                  {selectedActs.map((act, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{act.name}</span>
                      <span className="text-slate-900">{act.price.toLocaleString()} F</span>
                    </div>
                  ))}
                </div>

                {/* Pricing totals */}
                <div className="space-y-2 text-xs font-semibold pt-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Brut actes :</span>
                    <span>{totalGross.toLocaleString()} FCFA</span>
                  </div>
                  {insuranceRate > 0 && (
                    <div className="flex justify-between text-amber-600">
                      <span>Prise en charge {insurance} ({insuranceRate}%) :</span>
                      <span>- {insuranceShare.toLocaleString()} FCFA</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-3">
                    <span>Montant Net Encaissé :</span>
                    <span className="text-emerald-700">{patientShare.toLocaleString()} FCFA</span>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <p className="text-[10px] text-slate-400 italic">Quittance certifiée conforme &bull; Grand livre comptable Health AI</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-200">
                  <button 
                    onClick={() => window.print()} 
                    className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                    Imprimer le Reçu
                  </button>
                  <Link 
                    href="/cashier/dashboard" 
                    className="h-10 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center shadow-sm shadow-emerald-600/20 transition-all"
                  >
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
          <section className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
            
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Receipt className="h-3.5 w-3.5" />
                </div>
                Règlement Ticket Modérateur
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between text-slate-600 font-semibold">
                <span>Total brut prestations :</span>
                <span className="text-slate-900 font-bold">{totalGross.toLocaleString()} FCFA</span>
              </div>

              <div className="flex justify-between text-slate-600 font-semibold">
                <span>Remboursement ({insuranceRate}%) :</span>
                <span className="text-amber-600 font-bold">- {insuranceShare.toLocaleString()} FCFA</span>
              </div>

              <div className="flex justify-between text-sm font-black border-t border-slate-100 pt-3.5">
                <span className="text-slate-800">Net Patient à percevoir :</span>
                <span className="text-emerald-700 text-base">{patientShare.toLocaleString()} FCFA</span>
              </div>
            </div>

            {/* Selector cash or wave */}
            {paymentStep === 1 && (
              <div className="pt-2 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Mode de règlement</label>
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('WAVE')}
                      className={`h-11 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMode === 'WAVE'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      <Smartphone className={`h-4 w-4 ${paymentMode === 'WAVE' ? 'text-emerald-600' : 'text-slate-400'}`} />
                      Wave Sénégal
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode('CASH')}
                      className={`h-11 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMode === 'CASH'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      <Wallet className={`h-4 w-4 ${paymentMode === 'CASH' ? 'text-emerald-600' : 'text-slate-400'}`} />
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
                      placeholder="+221 77 000 00 00"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-800"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={triggerMobilePayment}
                  disabled={selectedActs.length === 0 || isProcessingPayment}
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
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
              <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-4 text-center">
                
                <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
                  <Smartphone className="h-5 w-5" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-slate-900">Demande de Débit Wave Envoyée</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Notification push envoyée pour <strong className="text-slate-900">{patientShare.toLocaleString()} FCFA</strong> au numéro <strong className="text-emerald-800">{phoneInput}</strong>.
                  </p>
                </div>

                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ x: ["-100%", "100%"] }} 
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-1/3 h-full bg-emerald-600 rounded-full" 
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={simulatePatientValidation}
                    disabled={isProcessingPayment}
                    className="w-full h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-600/20 transition-colors"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Validation sur le réseau...
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Simuler la validation du patient
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentStep(1)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-bold block mx-auto hover:underline cursor-pointer"
                  >
                    Annuler le paiement mobile
                  </button>
                </div>

              </div>
            )}

            {paymentStep === 3 && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle className="h-10 w-10 mx-auto text-emerald-600" />
                <h4 className="text-xs font-extrabold text-emerald-950">Règlement Validé !</h4>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Le paiement a été confirmé avec succès. La quittance est disponible pour impression.
                </p>
              </div>
            )}

          </section>

          {/* Assistance guichet card */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px]">
              <p className="font-extrabold text-slate-800">Sécurité des Transactions</p>
              <p className="text-slate-500 leading-relaxed">
                Toutes les opérations d&apos;encaissement sont synchronisées en temps réel avec le grand livre comptable.
              </p>
            </div>
          </div>

        </div>

      </div>
    </CashierShell>
  );
}
