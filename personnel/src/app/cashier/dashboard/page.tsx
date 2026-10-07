'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard,
  Plus,
  TrendingUp,
  DollarSign,
  Activity,
  Search,
  CheckCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  Percent,
  Layers,
  ArrowUpRight,
  Wallet,
  Users
} from 'lucide-react';
import Link from 'next/link';

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

export default function CashierDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "FAC-1001", patientName: "Cheikh Tidiane Diop", actName: "Pulmonary X-Ray", amount: 25000, insurance: "IPM (80%)", patientShare: 5000, insuranceShare: 20000, paymentMode: "Wave", status: "paid", time: "14:12" },
    { id: "FAC-1002", patientName: "Amadou Sall", actName: "Knee X-Ray", amount: 25000, insurance: "Aucune (0%)", patientShare: 25000, insuranceShare: 0, paymentMode: "Cash", status: "paid", time: "14:05" },
    { id: "FAC-1003", patientName: "Aissatou Sow", actName: "Consultation Pneumologue", amount: 15000, insurance: "CMU (100%)", patientShare: 0, insuranceShare: 15000, paymentMode: "Cash", status: "paid", time: "12:44" },
    { id: "FAC-1004", patientName: "Mariama Diallo", actName: "CT Scan Cérébral", amount: 120000, insurance: "AXA (70%)", patientShare: 36000, insuranceShare: 84000, paymentMode: "Wave", status: "pending", time: "11:30" }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  // Daily Calculations (FCFA)
  const totalCollected = transactions.filter(t => t.status === 'paid').reduce((acc, curr) => acc + curr.patientShare, 0);
  const totalInsurancePending = transactions.filter(t => t.status === 'paid').reduce((acc, curr) => acc + curr.insuranceShare, 0);
  const pendingInvoices = transactions.filter(t => t.status === 'pending').length;

  const filteredTransactions = transactions.filter(t => t.patientName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
            <CreditCard className="h-5.5 w-5.5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Espace Caissier & Facturation</h1>
            <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Sunu Santé Clinique</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            Caisse Ouverte : Session Active
          </span>
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
            Quitter le portail
          </Link>
        </div>
      </header>

      {/* Main Container Dashboard */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-8 py-8 space-y-8">
        
        {/* Statistical Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">Recette Encaissement (Patient)</h3>
              <p className="text-2xl font-black text-emerald-400">{totalCollected.toLocaleString()} FCFA</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Wallet className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tiers-Payant Mutuelle (À recouvrer)</h3>
              <p className="text-2xl font-black text-amber-400">{totalInsurancePending.toLocaleString()} FCFA</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Percent className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">Factures en attente</h3>
              <p className="text-3xl font-black text-red-400">{pendingInvoices}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">Patients à facturer</h3>
              <p className="text-3xl font-black text-purple-400">3</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>

        </section>

        {/* Action and Invoicing workflow */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Invoices Ledger (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-slate-950/40 rounded-3xl border border-slate-800/80 p-6 space-y-6 shadow-glass backdrop-blur-glass">
              <div className="flex justify-between items-center pb-4 border-b border-slate-900">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-amber-400" />
                  <h3 className="font-extrabold text-base tracking-tight">Grand Livre des Encaissements Quotidiens</h3>
                </div>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Transactions actives</span>
              </div>

              {/* Search filter */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Rechercher un règlement patient..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500 text-white transition-colors"
                />
              </div>

              {/* Transaction ledger list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="text-slate-500 text-xs uppercase font-bold border-b border-slate-900 bg-slate-900/40">
                      <th className="py-4 px-6">ID Facture</th>
                      <th className="py-4 px-6">Patient</th>
                      <th className="py-4 px-6">Acte facturé</th>
                      <th className="py-4 px-6">Assurance / Tier</th>
                      <th className="py-4 px-6">Ticket Modérateur</th>
                      <th className="py-4 px-6">Mode</th>
                      <th className="py-4 px-6 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    <AnimatePresence initial={false}>
                      {filteredTransactions.map((t) => (
                        <motion.tr
                          key={t.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-slate-900/20 transition-colors group"
                        >
                          <td className="py-4 px-6 font-mono font-bold text-xs text-slate-500 group-hover:text-slate-400">
                            {t.id}
                          </td>
                          <td className="py-4 px-6 font-extrabold text-slate-200">
                            {t.patientName}
                          </td>
                          <td className="py-4 px-6 text-slate-400 text-xs font-semibold">
                            {t.actName}
                          </td>
                          <td className="py-4 px-6 text-slate-400 text-xs font-semibold">
                            {t.insurance}
                          </td>
                          <td className="py-4 px-6 font-extrabold text-emerald-400">
                            {t.patientShare.toLocaleString()} FCFA
                          </td>
                          <td className="py-4 px-6 text-slate-400 text-xs font-semibold">
                            {t.paymentMode}
                          </td>
                          <td className="py-4 px-6 text-right">
                            {t.status === 'paid' ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                encaissé
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                                impayé
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

          {/* Quick Invoice panel (1 Column) */}
          <div className="lg:col-span-1 space-y-6">
            
            <section className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800/80 shadow-glass backdrop-blur-glass flex flex-col justify-between min-h-[300px]">
              
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-200">Facturer un Patient</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Générez une facture en associant le patient, les actes cliniques prescrits par le médecin, et appliquez les couvertures d'assurance (IPM, CMU).
                  </p>
                </div>
              </div>

              <Link 
                href="/cashier/billing"
                className="w-full h-12 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 transition-colors mt-6"
              >
                <Plus className="h-4.5 w-4.5 text-slate-950" />
                Créer Facture / Encaissement
              </Link>

            </section>

            {/* Insurance partnership support */}
            <section className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800/80 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                Tiers-Payant Partenaires
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Taux de remboursement en vigueur appliqués automatiquement : IPM (80%), CMU (100%), AXA (70%). Veuillez vérifier les cartes d'affiliation physiques.
              </p>
            </section>

          </div>

        </section>

      </main>

      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
        &copy; {new Date().getFullYear()} Sunu Santé - Module de Caisse & Financement. Tous droits réservés.
      </footer>
    </div>
  );
}
