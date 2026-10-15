'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard,
  Plus,
  DollarSign,
  Search,
  CheckCircle,
  Clock,
  ShieldCheck,
  Percent,
  Layers,
  Wallet,
  Users,
  Check,
  X,
  Stethoscope,
  Building2,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import CashierShell from '@/components/cashier/CashierShell';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Transaction {
  id: string;
  patientName: string;
  actName: string;
  amount: number; // in FCFA
  insurance: string;
  patientShare: number;
  insuranceShare: number;
  paymentMode: 'Cash' | 'Wave' | 'Chèque';
  status: 'paid' | 'pending';
  time: string;
}

interface PendingTicket {
  id: string;
  patientName: string;
  patientPhone: string;
  facilityName: string;
  specialtyName: string;
  doctorName?: string;
  ticketPrice: number;
  date: string;
  timeSlot: string;
  status: string;
}

export default function CashierDashboard() {
  const [pendingTickets, setPendingTickets] = useState<PendingTicket[]>([]);
  const [selectedTicketToPay, setSelectedTicketToPay] = useState<PendingTicket | null>(null);
  const [ticketPaymentMode, setTicketPaymentMode] = useState<'Cash' | 'Wave' | 'IPM' | 'CMU'>('Cash');
  const [isProcessingTicket, setIsProcessingTicket] = useState(false);
  const [paymentSuccessToast, setPaymentSuccessToast] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_URL}/api/facilities/appointments/all`);
      if (res.ok) {
        const data = await res.json();
        if (data.appointments) {
          // Filter tickets that are confirmed or sent_to_cashier (not yet paid)
          const unpaid = data.appointments.filter((a: any) => 
            a.status === 'confirmed' || a.status === 'sent_to_cashier' || a.status === 'arrived'
          );
          setPendingTickets(unpaid);
        }
      }
    } catch (e) {
      console.warn('Error fetching pending tickets', e);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 10000);
    return () => clearInterval(interval);
  }, []);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "FAC-1001", patientName: "Cheikh Tidiane Diop", actName: "Radiographie Pulmonaire", amount: 25000, insurance: "IPM (80%)", patientShare: 5000, insuranceShare: 20000, paymentMode: "Wave", status: "paid", time: "14:12" },
    { id: "FAC-1002", patientName: "Amadou Sall", actName: "Radio Genou Face/Profil", amount: 25000, insurance: "Aucune (0%)", patientShare: 25000, insuranceShare: 0, paymentMode: "Cash", status: "paid", time: "14:05" },
    { id: "FAC-1003", patientName: "Aissatou Sow", actName: "Consultation Pneumologie", amount: 15000, insurance: "CMU (100%)", patientShare: 0, insuranceShare: 15000, paymentMode: "Cash", status: "paid", time: "12:44" },
    { id: "FAC-1004", patientName: "Mariama Diallo", actName: "Scanner Cérébral", amount: 120000, insurance: "AXA (70%)", patientShare: 36000, insuranceShare: 84000, paymentMode: "Wave", status: "pending", time: "11:30" }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  // Daily Calculations (FCFA)
  const totalCollected = transactions.filter(t => t.status === 'paid').reduce((acc, curr) => acc + curr.patientShare, 0);
  const totalInsurancePending = transactions.filter(t => t.status === 'paid').reduce((acc, curr) => acc + curr.insuranceShare, 0);
  const pendingInvoices = transactions.filter(t => t.status === 'pending').length;

  const filteredTransactions = transactions.filter(t => 
    t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.actName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleValidateTicketPayment = async () => {
    if (!selectedTicketToPay) return;
    setIsProcessingTicket(true);

    try {
      await fetch(`${API_URL}/api/facilities/appointments/${selectedTicketToPay.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ticket_paid' })
      });

      const isInsurance = ticketPaymentMode === 'IPM' || ticketPaymentMode === 'CMU';
      const patientRate = ticketPaymentMode === 'CMU' ? 0 : ticketPaymentMode === 'IPM' ? 0.2 : 1;
      const patientShare = Math.round(selectedTicketToPay.ticketPrice * patientRate);
      const insuranceShare = selectedTicketToPay.ticketPrice - patientShare;

      const newTx: Transaction = {
        id: `TCK-${Date.now().toString().slice(-4)}`,
        patientName: selectedTicketToPay.patientName,
        actName: `Ticket ${selectedTicketToPay.specialtyName}`,
        amount: selectedTicketToPay.ticketPrice,
        insurance: isInsurance ? `${ticketPaymentMode} (${Math.round((1 - patientRate) * 100)}%)` : 'Aucune (0%)',
        patientShare,
        insuranceShare,
        paymentMode: ticketPaymentMode === 'Wave' ? 'Wave' : 'Cash',
        status: 'paid',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };

      setTransactions(prev => [newTx, ...prev]);
      setPendingTickets(prev => prev.filter(t => t.id !== selectedTicketToPay.id));

      setPaymentSuccessToast(`Ticket de ${selectedTicketToPay.patientName} (${selectedTicketToPay.ticketPrice.toLocaleString()} FCFA) encaissé ! Patient orienté en salle d'attente.`);
      setSelectedTicketToPay(null);
      setTimeout(() => setPaymentSuccessToast(null), 5000);
    } catch (e) {
      console.error('Error processing ticket payment', e);
    } finally {
      setIsProcessingTicket(false);
    }
  };

  return (
    <CashierShell
      title="Journal de Caisse & Encaissements"
      subtitle="Validation des tickets & recouvrement des actes médicaux"
    >
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
        
        {/* Statistical Cards Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mb-6">
          
          <div className="bg-white border border-slate-200 p-3.5 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">Recette Patient</p>
              <p className="text-lg sm:text-2xl font-black text-emerald-600 mt-0.5">{totalCollected.toLocaleString()} F</p>
            </div>
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <Wallet className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-3.5 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">Tiers-Payant</p>
              <p className="text-lg sm:text-2xl font-black text-amber-600 mt-0.5">{totalInsurancePending.toLocaleString()} F</p>
            </div>
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Percent className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-3.5 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">En attente</p>
              <p className="text-xl sm:text-3xl font-black text-rose-600 mt-0.5">{pendingInvoices}</p>
            </div>
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
              <Clock className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-3.5 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">À facturer</p>
              <p className="text-xl sm:text-3xl font-black text-purple-600 mt-0.5">3</p>
            </div>
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <Users className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
          </div>

        </section>

        {/* Action and Invoicing workflow */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Recent Invoices Ledger (8 cols on desktop) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* FILE DES TICKETS DE CONSULTATION — TARIFS FIXÉS AUTOMATIQUEMENT */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                      Tickets de Consultation en Attente de Caisse
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Tarif fixé automatiquement par l'établissement pour la spécialité choisie.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-800 font-black bg-emerald-100/80 border border-emerald-300 px-2.5 py-1 rounded-full uppercase">
                  {pendingTickets.length} ticket{pendingTickets.length > 1 ? 's' : ''} à régler
                </span>
              </div>

              {pendingTickets.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 font-medium">
                  Aucun patient en attente de paiement ticket pour le moment.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pendingTickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-black text-xs flex-shrink-0">
                          {ticket.id.slice(-3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">{ticket.patientName}</h4>
                            <span className="text-[10px] font-mono text-slate-400 font-bold">{ticket.id}</span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium mt-0.5">
                            {ticket.specialtyName} &bull; <span className="text-slate-400">{ticket.facilityName}</span>
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Prévu le {ticket.date} à {ticket.timeSlot}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 justify-between sm:justify-end">
                        {/* MONTANT FIXÉ PAR L'ÉTABLISSEMENT */}
                        <div className="text-right">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Tarif Automatique</span>
                          <span className="text-base font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl block">
                            {ticket.ticketPrice.toLocaleString()} FCFA
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedTicketToPay(ticket)}
                          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <CreditCard className="h-4 w-4" />
                          <span>Encaisser</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Layers className="h-4.5 w-4.5 text-amber-600" />
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                    Livre des Encaissements Quotidiens
                  </h3>
                </div>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase">
                  Session Caisse Active
                </span>
              </div>

              {/* Search filter */}
              <div className="p-3 sm:p-4 border-b border-slate-100 bg-white">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par patient, acte ou référence..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Mobile View: Cards */}
              <div className="block md:hidden divide-y divide-slate-100">
                {filteredTransactions.map((t) => (
                  <div key={t.id} className="p-4 space-y-2 hover:bg-slate-50/70 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-400">{t.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        t.status === 'paid' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {t.status === 'paid' ? 'Encaissé' : 'En attente'}
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-sm text-slate-900">{t.patientName}</h4>
                    <p className="text-xs text-slate-600">{t.actName}</p>
                    
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <span className="text-slate-500">{t.insurance} &bull; {t.paymentMode}</span>
                      <span className="font-black text-emerald-700">{t.patientShare.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="text-slate-500 text-xs uppercase font-semibold border-b border-slate-100 bg-slate-50/70">
                      <th className="py-3 px-5">Réf Facture</th>
                      <th className="py-3 px-5">Patient</th>
                      <th className="py-3 px-5">Acte</th>
                      <th className="py-3 px-5">Assurance</th>
                      <th className="py-3 px-5">Part Patient</th>
                      <th className="py-3 px-5">Mode</th>
                      <th className="py-3 px-5 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence initial={false}>
                      {filteredTransactions.map((t) => (
                        <motion.tr
                          key={t.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="py-3.5 px-5 font-mono font-bold text-xs text-slate-400">
                            {t.id}
                          </td>
                          <td className="py-3.5 px-5 font-bold text-slate-900">
                            {t.patientName}
                          </td>
                          <td className="py-3.5 px-5 text-slate-600 text-xs">
                            {t.actName}
                          </td>
                          <td className="py-3.5 px-5 text-slate-500 text-xs">
                            {t.insurance}
                          </td>
                          <td className="py-3.5 px-5 font-black text-emerald-700">
                            {t.patientShare.toLocaleString()} FCFA
                          </td>
                          <td className="py-3.5 px-5 text-slate-600 text-xs">
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                              {t.paymentMode}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            {t.status === 'paid' ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                Encaissé
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                Impayé
                              </span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

            </div>

          </div>

          {/* Quick Invoice panel (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-6">
            
            <section className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Facturation & Encaissement</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Éditez une facture directe, rattachez les actes médicaux et appliquez le tiers-payant conventionné (IPM, CMU, mutuelles privées).
                  </p>
                </div>
              </div>

              <Link 
                href="/cashier/billing"
                className="w-full h-11 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all mt-5"
              >
                <Plus className="h-4 w-4" />
                <span>Créer Facture / Encaissement</span>
              </Link>
            </section>

            {/* Insurance partnership support */}
            <section className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                <span>Tiers-Payant Partenaires</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Taux de remboursement conventionnés : IPM (80%), CMU (100%), AXA (70%). L'émission de quittance est validée instantanément.
              </p>
            </section>

          </div>

        </section>

        {/* Modal Encaissement Rapide de Ticket */}
        <AnimatePresence>
          {selectedTicketToPay && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5"
              >
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">Encaisser le Ticket</h3>
                      <p className="text-xs text-slate-500">{selectedTicketToPay.facilityName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTicketToPay(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Patient :</span>
                      <strong className="text-slate-900">{selectedTicketToPay.patientName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Acte / Spécialité :</span>
                      <strong className="text-slate-900">{selectedTicketToPay.specialtyName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Référence :</span>
                      <strong className="font-mono text-slate-700">{selectedTicketToPay.id}</strong>
                    </div>
                  </div>

                  {/* MONTANT FIXÉ PAR L'ÉTABLISSEMENT */}
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wide block">
                        Montant Fixé Automatiquement
                      </span>
                      <span className="text-[11px] text-emerald-700">Aucune saisie manuelle requise</span>
                    </div>
                    <span className="text-xl font-black text-emerald-900">
                      {selectedTicketToPay.ticketPrice.toLocaleString()} FCFA
                    </span>
                  </div>

                  {/* Mode de paiement */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Mode d'encaissement :</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'Cash', label: '💵 Espèces' },
                        { id: 'Wave', label: '📱 Wave Mobile' },
                        { id: 'IPM', label: '🛡️ IPM (80%)' },
                        { id: 'CMU', label: '🏥 CMU (100%)' }
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setTicketPaymentMode(mode.id as any)}
                          className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                            ticketPaymentMode === mode.id
                              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedTicketToPay(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    disabled={isProcessingTicket}
                    onClick={handleValidateTicketPayment}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    <span>{isProcessingTicket ? 'Encaissement...' : 'Valider & Délivrer Ticket'}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {paymentSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-emerald-900/90 text-white border border-emerald-500 shadow-xl flex items-center gap-3 text-xs sm:text-sm font-semibold backdrop-blur-md"
            >
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span>{paymentSuccessToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </CashierShell>
  );
}
