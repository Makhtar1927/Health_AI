'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore, LocalUserRecord, UserSession } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Plus, Search, Power, Send, Hospital, 
  AlertCircle, LogOut, Sparkles, ShieldAlert, X, Pill, MapPin
} from 'lucide-react';

export default function AdminPharmacyDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout, initialize, getUsersByRoles, createStaffAccount, toggleUserSuspension, transferUserAffiliation } = useAuthStore();

  const [pharmacists, setPharmacists] = useState<LocalUserRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [newPharmacyName, setNewPharmacyName] = useState('');

  // Form states for new pharmacist
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [orderId, setOrderId] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [city, setCity] = useState('Dakar');

  // Notification Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    // If not authenticated or not pharmacy admin/superadmin, redirect
    if (isAuthenticated && user) {
      if (user.role !== 'admin_pharmacy' && user.role !== 'superadmin') {
        router.push('/pharmacy/login');
      } else {
        loadPharmacists();
      }
    } else if (!isAuthenticated) {
      router.push('/pharmacy/login');
    }
  }, [isAuthenticated, user, router]);

  const loadPharmacists = async () => {
    const data = await getUsersByRoles(['pharmacist']);
    setPharmacists(data);
  };

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogoutClick = () => {
    logout();
    router.push('/pharmacy/login');
  };

  const handleToggleSuspension = async (email: string) => {
    const success = await toggleUserSuspension(email);
    if (success) {
      triggerToast("Statut du compte pharmacien mis à jour.");
      await loadPharmacists();
    } else {
      triggerToast("Une erreur est survenue.", "error");
    }
  };

  const handleOpenTransfer = (email: string, currentPharmacy: string) => {
    setSelectedEmail(email);
    setNewPharmacyName(currentPharmacy || 'Pharmacie Centrale');
    setTransferModalOpen(true);
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPharmacyName.trim()) return;

    const success = await transferUserAffiliation(selectedEmail, newPharmacyName);
    if (success) {
      triggerToast(`Pharmacien muté vers la ${newPharmacyName} avec succès.`);
      setTransferModalOpen(false);
      await loadPharmacists();
    } else {
      triggerToast("Erreur lors de la mutation.", "error");
    }
  };

  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newFirstName || !newLastName || !newPassword || !orderId || !pharmacyName) {
      triggerToast("Veuillez renseigner tous les champs obligatoires.", "error");
      return;
    }

    const fullName = `${newFirstName} ${newLastName}`;
    const details = {
      firstName: newFirstName,
      lastName: newLastName,
      phone: newPhone,
      pharmacyOrderId: orderId,
      pharmacyName,
      city
    };

    const success = await createStaffAccount(newEmail, newPassword, 'pharmacist', fullName, details);
    if (success) {
      triggerToast(`Compte Pharmacien créé pour ${fullName}.`);
      setCreateModalOpen(false);
      // Reset form states
      setNewFirstName('');
      setNewLastName('');
      setNewEmail('');
      setNewPassword('');
      setNewPhone('');
      setOrderId('');
      setPharmacyName('');
      await loadPharmacists();
    } else {
      triggerToast("Cet email est déjà utilisé par un autre compte.", "error");
    }
  };

  const filteredPharmacists = pharmacists.filter(member => {
    return member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (member.details?.pharmacyName && member.details.pharmacyName.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const activeUser = user || {
    name: "Administrateur Pharmacie",
    email: "direction.pharma@sunusante.sn",
    role: "admin_pharmacy"
  };

  // Stats
  const totalCount = pharmacists.length;
  const activeCount = pharmacists.filter(p => !p.suspended).length;
  const suspendedCount = pharmacists.filter(p => p.suspended).length;
  const uniquePharmacies = new Set(pharmacists.map(p => p.details?.pharmacyName).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
            <Shield className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight">Direction Administrative Pharmacie</h1>
            <p className="text-[9px] text-violet-400 font-semibold uppercase tracking-wider">Gestion Officines & Dispensaires</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-violet-500 animate-pulse" />
            {activeUser.name}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-4 sm:px-8 py-6 space-y-6">
        
        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Pharmaciens</h3>
              <p className="text-2xl font-black mt-1">{totalCount}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-750">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Actifs</h3>
              <p className="text-2xl font-black text-emerald-400 mt-1">{activeCount}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Officines Représentées</h3>
              <p className="text-2xl font-black text-violet-400 mt-1">{uniquePharmacies}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Pill className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Suspendus</h3>
              <p className={`text-2xl font-black mt-1 ${suspendedCount > 0 ? 'text-amber-500' : 'text-slate-400'}`}>{suspendedCount}</p>
            </div>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${suspendedCount > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
        </section>

        {/* Action board */}
        <section className="bg-gradient-to-r from-violet-650 to-fuchsia-700 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-white">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
            <Shield className="h-56 w-56" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-[9px] bg-white/20 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Console Pharmacie
              </span>
              <h2 className="text-2xl font-black mt-3">Habilitation des Pharmaciens</h2>
              <p className="text-violet-100 text-xs mt-1 leading-relaxed max-w-xl">
                Créez des accès sécurisés pour les pharmaciens d'officine affiliés, contrôlez leur état de service ou changez leur point d'affectation principal.
              </p>
            </div>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="h-12 px-6 bg-white hover:bg-slate-100 text-violet-850 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg flex-shrink-0 border-0"
            >
              <Plus className="h-5 w-5" />
              Créer un profil pharmacien
            </button>
          </div>
        </section>

        {/* Search */}
        <section className="flex justify-between items-center bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, pharmacie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:border-violet-500 text-white"
            />
          </div>
        </section>

        {/* Pharmacists List */}
        <section className="bg-slate-950/40 rounded-3xl border border-slate-800/80 overflow-hidden shadow-glass backdrop-blur-glass">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-500 font-extrabold uppercase tracking-wider bg-slate-950/40">
                  <th className="p-5">Pharmacien</th>
                  <th className="p-5">N° Ordre des Pharmaciens</th>
                  <th className="p-5">Affectation</th>
                  <th className="p-5">Ville</th>
                  <th className="p-5 text-center">Statut</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {filteredPharmacists.length > 0 ? (
                  filteredPharmacists.map((member) => (
                    <tr key={member.email} className="hover:bg-white/5 transition-colors text-xs">
                      
                      {/* Identity */}
                      <td className="p-5">
                        <div>
                          <p className="font-bold text-slate-200">{member.name}</p>
                          <p className="text-[10px] text-slate-500">{member.email}</p>
                        </div>
                      </td>

                      {/* Order Id */}
                      <td className="p-5 font-mono font-bold text-slate-400">
                        {member.details?.pharmacyOrderId || 'N/A'}
                      </td>

                      {/* Pharmacy name */}
                      <td className="p-5 font-medium text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Pill className="h-3.5 w-3.5 text-violet-400" />
                          {member.details?.pharmacyName || 'Non affilié'}
                        </div>
                      </td>

                      {/* City */}
                      <td className="p-5 text-slate-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-500" />
                          {member.details?.city || 'Sénégal'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          member.suspended 
                            ? 'bg-red-500/15 text-red-400 border border-red-500/10' 
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/10'
                        }`}>
                          {member.suspended ? 'Suspendu' : 'Actif'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-5 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleOpenTransfer(member.email, member.details?.pharmacyName)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white transition-all cursor-pointer text-[10px] font-bold flex items-center gap-1"
                          >
                            <Send className="h-3 w-3" />
                            Muter officine
                          </button>
                          
                          <button
                            onClick={() => handleToggleSuspension(member.email)}
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer flex items-center gap-1 transition-all border-0 ${
                              member.suspended 
                                ? 'bg-emerald-600/15 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white' 
                                : 'bg-red-600/15 border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white'
                            }`}
                          >
                            <Power className="h-3 w-3" />
                            {member.suspended ? 'Activer' : 'Suspendre'}
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-slate-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      Aucun pharmacien répertorié
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 text-slate-100 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-violet-400" />
                  <h3 className="font-extrabold text-base">Habilitation d'un Nouveau Pharmacien</h3>
                </div>
                <button 
                  onClick={() => setCreateModalOpen(false)}
                  className="text-slate-400 hover:text-white cursor-pointer bg-transparent border-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAccountSubmit} className="space-y-4">
                
                {/* Identity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Prénom</label>
                    <input
                      type="text"
                      required
                      placeholder="Abdoulaye"
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs placeholder-slate-650 focus:outline-none focus:border-violet-500 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nom</label>
                    <input
                      type="text"
                      required
                      placeholder="Faye"
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs placeholder-slate-650 focus:outline-none focus:border-violet-500 text-white"
                    />
                  </div>
                </div>

                {/* Email and phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Adresse Email Professionnelle</label>
                    <input
                      type="email"
                      required
                      placeholder="a.faye@sunusante.sn"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs placeholder-slate-650 focus:outline-none focus:border-violet-500 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Téléphone</label>
                    <input
                      type="tel"
                      placeholder="+221 77 501 32 90"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs placeholder-slate-650 focus:outline-none focus:border-violet-500 text-white"
                    />
                  </div>
                </div>

                {/* Password selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mot de passe temporaire</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs placeholder-slate-650 focus:outline-none focus:border-violet-500 text-white"
                  />
                </div>

                {/* Specifics */}
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-4">
                  <p className="text-[10px] text-violet-400 font-bold uppercase tracking-wider">Habilitations Officielles</p>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] text-slate-500 uppercase font-bold">Numéro d'Ordre des Pharmaciens</label>
                    <input
                      type="text"
                      required
                      placeholder="ORD-PH-98302"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs placeholder-slate-700 focus:outline-none focus:border-violet-500 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-500 uppercase font-bold">Nom de la Pharmacie</label>
                      <input
                        type="text"
                        required
                        placeholder="Pharmacie de la Cité"
                        value={pharmacyName}
                        onChange={(e) => setPharmacyName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs placeholder-slate-700 focus:outline-none focus:border-violet-500 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-500 uppercase font-bold">Ville</label>
                      <input
                        type="text"
                        required
                        placeholder="Dakar, Thies, Saint-Louis..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs focus:outline-none focus:border-violet-500 text-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-700 hover:from-violet-500 hover:to-fuchsia-600 font-bold text-xs text-white cursor-pointer shadow-lg shadow-violet-700/10 transition-all flex items-center justify-center gap-1.5 border-0"
                >
                  <Plus className="h-4.5 w-4.5" />
                  Habiliter et valider le compte
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MUTATION MODAL */}
      <AnimatePresence>
        {transferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-6 text-slate-100 relative"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-violet-400" />
                  <h3 className="font-extrabold text-base">Mutation Officinale</h3>
                </div>
                <button 
                  onClick={() => setTransferModalOpen(false)}
                  className="text-slate-400 hover:text-white cursor-pointer bg-transparent border-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleTransferSubmit} className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Pharmacien</p>
                  <p className="text-xs font-bold text-slate-200">{selectedEmail}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nouvelle Pharmacie d'Affiliation</label>
                  <input
                    type="text"
                    required
                    value={newPharmacyName}
                    onChange={(e) => setNewPharmacyName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-700 hover:from-violet-500 hover:to-fuchsia-600 font-bold text-xs text-white cursor-pointer shadow-lg shadow-violet-700/10 transition-all flex items-center justify-center gap-1.5 border-0"
                >
                  <Send className="h-4.5 w-4.5" />
                  Confirmer la mutation d'officine
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success/Error Toast */}
      {showToast && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs animate-bounce ${
          toastType === 'success' ? 'bg-violet-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toastType === 'success' ? (
            <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
          ) : (
            <ShieldAlert className="h-4.5 w-4.5 text-white" />
          )}
          {toastMsg}
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
        &copy; {new Date().getFullYear()} Sunu Santé - Direction Officinale de l'Écosystème.
      </footer>
    </div>
  );
}
