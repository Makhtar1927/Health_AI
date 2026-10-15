'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore, LocalUserRecord } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Plus, 
  Search, 
  Power, 
  Send, 
  AlertCircle, 
  LogOut, 
  Sparkles, 
  ShieldAlert, 
  X, 
  Pill, 
  MapPin,
  CheckCircle2,
  TrendingUp,
  Package,
  Truck,
  FileText,
  DollarSign,
  Clock,
  QrCode,
  Calendar,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  Shield,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import Image from 'next/image';

type PharmacyAdminTab = 'overview' | 'staff' | 'inventory' | 'reports' | 'settings';

interface WholesalerOrder {
  id: string;
  wholesaler: string;
  orderDate: string;
  expectedDelivery: string;
  itemsCount: number;
  totalAmount: number;
  status: 'pending' | 'in_transit' | 'delivered';
}

export default function AdminPharmacyDashboard() {
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    logout, 
    initialize, 
    getUsersByRoles, 
    createStaffAccount, 
    toggleUserSuspension, 
    transferUserAffiliation,
    getFacilities
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<PharmacyAdminTab>('overview');
  const [pharmacists, setPharmacists] = useState<LocalUserRecord[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState<LocalUserRecord | null>(null);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [newPharmacyName, setNewPharmacyName] = useState('');

  // Form states for new pharmacist
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [orderId, setOrderId] = useState('');
  const [pharmacyName, setPharmacyName] = useState('Pharmacie Centrale Dakar Plateau');
  const [city, setCity] = useState('Dakar');

  // Wholesaler order form
  const [selectedWholesaler, setSelectedWholesaler] = useState('COPHASE Sénégal');
  const [orderNotes, setOrderNotes] = useState('');

  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Données de commandes grossistes
  const [wholesalerOrders, setWholesalerOrders] = useState<WholesalerOrder[]>([
    {
      id: "BC-2026-089",
      wholesaler: "COPHASE Sénégal",
      orderDate: "15/10/2026 09:15",
      expectedDelivery: "Aujourd'hui à 14h30",
      itemsCount: 140,
      totalAmount: 1850000,
      status: "in_transit"
    },
    {
      id: "BC-2026-088",
      wholesaler: "Laborex Sénégal",
      orderDate: "14/10/2026 16:40",
      expectedDelivery: "15/10/2026 11:00",
      itemsCount: 85,
      totalAmount: 920000,
      status: "delivered"
    },
    {
      id: "BC-2026-085",
      wholesaler: "SODIPHARM",
      orderDate: "12/10/2026 10:20",
      expectedDelivery: "13/10/2026 15:00",
      itemsCount: 45,
      totalAmount: 540000,
      status: "delivered"
    }
  ]);

  useEffect(() => {
    initialize();
    getFacilities().then((allFacs) => {
      const pharms = (allFacs || []).filter((f: any) => f.type === 'pharmacie');
      setPharmacies(pharms);
      if (pharms.length > 0) {
        setPharmacyName(pharms[0].name);
        setNewPharmacyName(pharms[0].name);
        if (pharms[0].region) setCity(pharms[0].region);
      }
    }).catch(err => console.warn('Could not load pharmacies', err));
  }, [initialize, getFacilities]);

  useEffect(() => {
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
    // Si aucun pharmacien, injecter une équipe témoin pour la démonstration
    if (data.length === 0) {
      setPharmacists([
        {
          name: "Dr. Babacar Diagne",
          email: "b.diagne@officine.sn",
          passwordHash: "demo_hash_diagne",
          role: "pharmacist",
          suspended: false,
          details: {
            rpps: "RPPS-849204",
            phone: "+221 77 450 88 12",
            pharmacyName: "Pharmacie Centrale Dakar Plateau",
            city: "Dakar",
            roleTitle: "Pharmacien Adjoint"
          }
        },
        {
          name: "Dr. Fatou Kiné Fall",
          email: "f.fall@officine.sn",
          passwordHash: "demo_hash_fall",
          role: "pharmacist",
          suspended: false,
          details: {
            rpps: "RPPS-912450",
            phone: "+221 78 320 14 55",
            pharmacyName: "Pharmacie Centrale Dakar Plateau",
            city: "Dakar",
            roleTitle: "Pharmacienne Assistante"
          }
        },
        {
          name: "Moussa Seck",
          email: "m.seck@officine.sn",
          passwordHash: "demo_hash_seck",
          role: "pharmacist",
          suspended: false,
          details: {
            rpps: "PREP-55201",
            phone: "+221 77 890 23 11",
            pharmacyName: "Pharmacie Centrale Dakar Plateau",
            city: "Dakar",
            roleTitle: "Préparateur en Pharmacie"
          }
        }
      ]);
    } else {
      setPharmacists(data);
    }
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
    setNewPharmacyName(currentPharmacy || 'Pharmacie Centrale Dakar Plateau');
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
      rpps: orderId,
      pharmacyName,
      city,
      roleTitle: "Pharmacien Adjoint"
    };

    const success = await createStaffAccount(newEmail, newPassword, 'pharmacist', fullName, details);
    if (success) {
      triggerToast(`Compte Pharmacien créé pour ${fullName}.`);
      setCreateModalOpen(false);
      setNewFirstName('');
      setNewLastName('');
      setNewEmail('');
      setNewPassword('');
      setNewPhone('');
      setOrderId('');
      await loadPharmacists();
    } else {
      triggerToast("Cet email est déjà utilisé par un autre compte.", "error");
    }
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: WholesalerOrder = {
      id: `BC-2026-09${wholesalerOrders.length + 1}`,
      wholesaler: selectedWholesaler,
      orderDate: "15/10/2026 " + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      expectedDelivery: "Demain à 10h00",
      itemsCount: 75,
      totalAmount: 1250000,
      status: "pending"
    };

    setWholesalerOrders([newOrder, ...wholesalerOrders]);
    setOrderModalOpen(false);
    triggerToast(`Bon de commande ${newOrder.id} transmis à ${selectedWholesaler}.`);
  };

  const filteredPharmacists = pharmacists.filter(member => {
    return member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (member.details?.pharmacyName && member.details.pharmacyName.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const activeUser = user || {
    name: "Dr. Ousmane Diop",
    email: "direction.pharma@healthai.sn",
    role: "admin_pharmacy"
  };

  const totalCount = pharmacists.length;
  const activeCount = pharmacists.filter(p => !p.suspended).length;
  const suspendedCount = pharmacists.filter(p => p.suspended).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-violet-100 selection:text-violet-900">
      
      {/* Toast de notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 shadow-xl ${
              toastType === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            {toastType === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-rose-600" />}
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 1. TOPBAR DIRECTIONNELLE MODE CLAIR FIRST                                 */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 h-16 flex items-center justify-between shadow-xs">
        
        {/* Logo Health AI + Titre */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center p-1.5">
            <Image
              src="/HealthAI_symbole.png"
              alt="Health AI"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-slate-900">Health AI</span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200">
                Direction Pharmacie
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Pharmacie Centrale Dakar Plateau &bull; Licence LIC-DKR-2021-089
            </p>
          </div>
        </div>

        {/* Profil Admin & Déconnexion */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-extrabold text-slate-800">{activeUser.name}</span>
            <span className="text-[10px] text-slate-400 font-medium">(Titulaire Gérant)</span>
          </div>

          <button
            onClick={handleLogoutClick}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5 cursor-pointer border border-transparent hover:border-rose-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Quitter la console</span>
          </button>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* 2. BARRE D'ONGLETS STRATÉGIQUES                                          */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-slate-200/90 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2">
          
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Vue d&apos;ensemble
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'staff'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="h-4 w-4" />
            Équipe Officinale ({totalCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'inventory'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Truck className="h-4 w-4" />
            Stocks & Grossistes (COPHASE / Laborex)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'reports'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="h-4 w-4" />
            Comptabilité & Tiers-Payant
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'settings'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Agrément & Gardes
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CONTENU PRINCIPAL DYNAMIQUE PAR ONGLET                                */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        
        {/* ======================================================================= */}
        {/* ONGLET 1 : VUE D'ENSEMBLE                                               */}
        {/* ======================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Bannière de direction */}
            <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-violet-600/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="text-[10px] bg-white/20 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  Console Officinale Stratégique
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Supervision & Direction de l&apos;Officine</h2>
                <p className="text-violet-100 text-xs sm:text-sm leading-relaxed">
                  Pilotage en temps réel des délivrances au comptoir, gestion des habilitations de l&apos;équipe officinale et chaîne d&apos;approvisionnement grossistes.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 text-xs font-black flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-violet-600" />
                  Nouveau Pharmacien
                </button>
                <button
                  type="button"
                  onClick={() => setOrderModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-violet-950/40 hover:bg-violet-950/60 text-white text-xs font-extrabold flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
                >
                  <Truck className="h-4 w-4" />
                  Commander Grossiste
                </button>
              </div>
            </div>

            {/* 4 Indicateurs Macro */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                <p className="text-[10px] sm:text-xs text-slate-500 font-extrabold uppercase tracking-wider">Chiffre d&apos;Affaires Mois</p>
                <div className="flex items-baseline justify-between">
                  <p className="text-xl sm:text-2xl font-black text-slate-900">14 250 000 F</p>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    +8.4%
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Part Tiers-Payant : 68%</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                <p className="text-[10px] sm:text-xs text-slate-500 font-extrabold uppercase tracking-wider">Pharmaciens Habilités</p>
                <div className="flex items-baseline justify-between">
                  <p className="text-xl sm:text-2xl font-black text-slate-900">{totalCount}</p>
                  <span className="text-[10px] text-violet-700 font-bold bg-violet-50 px-2 py-0.5 rounded-md">
                    {activeCount} en service
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">2 Guichets ouverts simultanément</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                <p className="text-[10px] sm:text-xs text-slate-500 font-extrabold uppercase tracking-wider">Ordonnances Honorées</p>
                <div className="flex items-baseline justify-between">
                  <p className="text-xl sm:text-2xl font-black text-emerald-700">1 420</p>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Taux 98.4%
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">100% scellées électroniquement</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                <p className="text-[10px] sm:text-xs text-slate-500 font-extrabold uppercase tracking-wider">Taux de Rupture Stock</p>
                <div className="flex items-baseline justify-between">
                  <p className="text-xl sm:text-2xl font-black text-slate-900">1.2%</p>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Seuil optimal &lt; 2%
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Substitution DCI activée</p>
              </div>
            </div>

            {/* Grille : Équipe en service + Livraisons du jour */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Équipe officinale active */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Pharmaciens & Préparateurs en Service</h3>
                      <p className="text-[11px] text-slate-500">Personnel habilité pour la délivrance au comptoir</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('staff')}
                    className="text-xs font-bold text-violet-600 hover:text-violet-700"
                  >
                    Gérer l&apos;équipe &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {pharmacists.map((member, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-900 block">{member.name}</span>
                          <span className="text-[10px] text-slate-500">
                            {member.details?.roleTitle || "Pharmacien"} &bull; RPPS : {member.details?.rpps || "849204"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          🟢 Au comptoir
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chaîne logistique grossistes */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Livraisons Grossistes Attendues</h3>
                      <p className="text-[11px] text-slate-500">Réassortiments COPHASE / Laborex</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="text-xs font-bold text-violet-600 hover:text-violet-700"
                  >
                    Commandes &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {wholesalerOrders.map(order => (
                    <div key={order.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900">{order.wholesaler}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          order.status === 'in_transit'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {order.status === 'in_transit' ? 'En transit' : 'Livré & En rayon'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {order.id} &bull; {order.itemsCount} références &bull; <strong>{order.totalAmount.toLocaleString()} FCFA</strong>
                      </p>
                      <p className="text-[10px] text-slate-400">Arrivée estimée : {order.expectedDelivery}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================================= */}
        {/* ONGLET 2 : ÉQUIPE OFFICINALE & PHARMACIENS                              */}
        {/* ======================================================================= */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher pharmacien par nom, email, RPPS..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-800"
                />
              </div>

              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="w-full md:w-auto px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-violet-600/20 cursor-pointer transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Créer un Compte Pharmacien</span>
              </button>
            </div>

            {/* Tableau de l'équipe */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-6">Praticien & Identifiant</th>
                      <th className="py-3.5 px-4">Contact Direct</th>
                      <th className="py-3.5 px-4">Affectation Officine</th>
                      <th className="py-3.5 px-4 text-center">État du Compte</th>
                      <th className="py-3.5 px-6 text-right">Actions Direction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredPharmacists.map((member, idx) => {
                      const isSuspended = member.suspended;
                      return (
                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-700 font-black text-xs flex items-center justify-center shrink-0 border border-violet-200/60">
                                {member.name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-black text-slate-900 block">{member.name}</span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  RPPS : {member.details?.rpps || "849204"} &bull; {member.details?.roleTitle || "Pharmacien"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="space-y-0.5">
                              <span className="text-slate-700 font-medium block">{member.email}</span>
                              <span className="text-[11px] text-slate-400 font-semibold block">{member.details?.phone || "+221 77 000 00 00"}</span>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-bold text-slate-800 block">
                              {member.details?.pharmacyName || "Pharmacie Centrale Dakar Plateau"}
                            </span>
                            <span className="text-[10px] text-slate-400">{member.details?.city || "Dakar"}</span>
                          </td>

                          <td className="py-4 px-4 text-center">
                            {isSuspended ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                                🔴 Suspendu
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                🟢 Habilité & Actif
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Générer Badge */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedStaff(member);
                                  setBadgeModalOpen(true);
                                }}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                                title="Imprimer le Badge Officiel"
                              >
                                <QrCode className="h-4 w-4" />
                              </button>

                              {/* Muter */}
                              <button
                                type="button"
                                onClick={() => handleOpenTransfer(member.email, member.details?.pharmacyName)}
                                className="p-2 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 transition-colors cursor-pointer"
                                title="Muter vers une autre officine"
                              >
                                <Send className="h-4 w-4" />
                              </button>

                              {/* Toggle Suspension */}
                              <button
                                type="button"
                                onClick={() => handleToggleSuspension(member.email)}
                                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                  isSuspended
                                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                    : 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                                }`}
                                title={isSuspended ? "Réactiver le pharmacien" : "Suspendre temporairement"}
                              >
                                <Power className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================================= */}
        {/* ONGLET 3 : STOCKS STRATÉGIQUES & COMMANDES GROSSISTES                   */}
        {/* ======================================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">Approvisionnements Grossistes & Répartiteurs</h3>
                <p className="text-[11px] text-slate-500">Commandes groupées pour maintenir un stock sans rupture</p>
              </div>

              <button
                type="button"
                onClick={() => setOrderModalOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm cursor-pointer transition-all"
              >
                <Plus className="h-4 w-4" />
                Passer un Bon de Commande
              </button>
            </div>

            {/* Tableau des commandes grossistes */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-6">N° Bon de Commande</th>
                      <th className="py-3.5 px-4">Grossiste Répartiteur</th>
                      <th className="py-3.5 px-4">Date de Commande</th>
                      <th className="py-3.5 px-4">Volume & Montant</th>
                      <th className="py-3.5 px-4 text-center">Statut Expédition</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {wholesalerOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-slate-800">
                          {order.id}
                        </td>
                        <td className="py-4 px-4 font-black text-slate-900">
                          {order.wholesaler}
                        </td>
                        <td className="py-4 px-4 text-slate-600">
                          {order.orderDate}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-extrabold text-slate-900 block">{order.totalAmount.toLocaleString()} FCFA</span>
                          <span className="text-[10px] text-slate-400">{order.itemsCount} références</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {order.status === 'in_transit' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                              🚚 En transit (Livraison 14h30)
                            </span>
                          )}
                          {order.status === 'delivered' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              ✅ Réceptionné & Contrôlé
                            </span>
                          )}
                          {order.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200">
                              ⏳ En préparation grossiste
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => triggerToast(`Bordereau ${order.id} téléchargé.`)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Bordereau
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================================= */}
        {/* ONGLET 4 : COMPTABILITÉ & TIERS-PAYANT                                  */}
        {/* ======================================================================= */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
                <span className="text-xs font-extrabold uppercase text-slate-400">Règlements Wave & Mobile Money</span>
                <p className="text-2xl font-black text-slate-900">4 850 000 FCFA</p>
                <p className="text-[11px] text-emerald-600 font-bold">34% des encaissements directs</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
                <span className="text-xs font-extrabold uppercase text-slate-400">Remboursements IPM & Mutuelles</span>
                <p className="text-2xl font-black text-violet-700">7 240 000 FCFA</p>
                <p className="text-[11px] text-slate-500 font-bold">51% en Tiers-Payant conventionné</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
                <span className="text-xs font-extrabold uppercase text-slate-400">Prise en charge CMU (Gratuité)</span>
                <p className="text-2xl font-black text-emerald-700">2 160 000 FCFA</p>
                <p className="text-[11px] text-slate-500 font-bold">15% télétransmis à l&apos;ANACMU</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900">Bordereaux de Télétransmission Tiers-Payant</h3>
                <button
                  type="button"
                  onClick={() => triggerToast("Grand livre comptable exporté avec succès.")}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Exporter Grand Livre (PDF/Excel)
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-900 block">IPM Banque Centrale & Secteur Privé</span>
                    <span className="text-[11px] text-slate-500">Période : 01 au 15 Octobre 2026 &bull; 412 ordonnances</span>
                  </div>
                  <span className="text-xs font-black text-violet-700 bg-violet-50 px-3 py-1 rounded-lg border border-violet-200">
                    4 150 000 F en attente virement
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-900 block">CMU - Caisse Nationale d&apos;Assurance Maladie</span>
                    <span className="text-[11px] text-slate-500">Période : Septembre 2026 &bull; 198 ordonnances</span>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    Virement étatique perçu (2 160 000 F)
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================================= */}
        {/* ONGLET 5 : AGRÉMENT & GARDES                                            */}
        {/* ======================================================================= */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Agrément Officinal & Organisation des Gardes</h3>
              <p className="text-[11px] text-slate-500">Conformité avec le Ministère de la Santé et l&apos;Ordre des Pharmaciens</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Numéro de Licence Sanitaire</span>
                <p className="text-sm font-black text-slate-900">LIC-SANTE-DKR-2021-089</p>
                <p className="text-[11px] text-emerald-700 font-bold">Agrément permanent renouvelé</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Pharmacien Titulaire Propriétaire</span>
                <p className="text-sm font-black text-slate-900">Dr. Ousmane Diop</p>
                <p className="text-[11px] text-slate-500">ONPS Section A - Inscription N° 1084</p>
              </div>

              <div className="p-4 rounded-xl bg-violet-50/70 border border-violet-200 sm:col-span-2 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-violet-600" />
                  <span className="font-extrabold text-violet-950">Prochaine Garde de Nuit Officielle</span>
                </div>
                <p className="text-[11px] text-violet-900 leading-relaxed font-medium">
                  La Pharmacie Centrale est désignée <strong>Officine de Garde 24h/24</strong> pour le secteur Dakar-Plateau du <strong>Samedi 24 Octobre 2026 à 20h00 au Lundi 26 Octobre à 08h00</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 4. MODALS INTERACTIFS                                                     */}
      {/* ========================================================================= */}

      {/* Modal Création Pharmacien */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCreateModalOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Créer un Compte Pharmacien</h3>
                    <p className="text-[10px] text-slate-500">Habilitation pour le comptoir et la dispensation</p>
                  </div>
                </div>
                <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateAccountSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Prénom</label>
                    <input
                      type="text"
                      required
                      placeholder="Cheikh"
                      value={newFirstName}
                      onChange={e => setNewFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Nom</label>
                    <input
                      type="text"
                      required
                      placeholder="Ndiaye"
                      value={newLastName}
                      onChange={e => setNewLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Email Professionnel</label>
                    <input
                      type="email"
                      required
                      placeholder="c.ndiaye@officine.sn"
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Numéro RPPS</label>
                    <input
                      type="text"
                      required
                      placeholder="RPPS-849204"
                      value={orderId}
                      onChange={e => setOrderId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Téléphone Direct</label>
                    <input
                      type="tel"
                      placeholder="+221 77 000 00 00"
                      value={newPhone}
                      onChange={e => setNewPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Mot de Passe Initial</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    Pharmacie d&apos;Affectation <span className="text-rose-500">*</span>
                  </label>
                  {pharmacies.length > 0 ? (
                    <select
                      required
                      value={pharmacyName}
                      onChange={e => {
                        setPharmacyName(e.target.value);
                        const match = pharmacies.find(p => p.name === e.target.value);
                        if (match?.region) setCity(match.region);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                      {pharmacies.map((p: any) => (
                        <option key={p.id} value={p.name}>
                          {p.name} {p.region ? `• ${p.region}` : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={pharmacyName}
                      onChange={e => setPharmacyName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-violet-500"
                    />
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold shadow-sm"
                  >
                    Habiliter le Pharmacien
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Mutation Pharmacien */}
      <AnimatePresence>
        {transferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTransferModalOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900">Mutation de Point d&apos;Affectation</h3>
                <button onClick={() => setTransferModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Pharmacien concerné</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedEmail}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    Nouvelle Pharmacie d&apos;Affectation <span className="text-rose-500">*</span>
                  </label>
                  {pharmacies.length > 0 ? (
                    <select
                      required
                      value={newPharmacyName}
                      onChange={e => setNewPharmacyName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 cursor-pointer"
                    >
                      {pharmacies.map((p: any) => (
                        <option key={p.id} value={p.name}>
                          {p.name} {p.region ? `• ${p.region}` : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={newPharmacyName}
                      onChange={e => setNewPharmacyName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                    />
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setTransferModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold shadow-sm"
                  >
                    Enregistrer la Mutation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Commande Grossiste */}
      <AnimatePresence>
        {orderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOrderModalOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Truck className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">Bon de Commande Grossiste</h3>
                </div>
                <button onClick={() => setOrderModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateOrderSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Grossiste Répartiteur</label>
                  <select
                    value={selectedWholesaler}
                    onChange={e => setSelectedWholesaler(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  >
                    <option value="COPHASE Sénégal">COPHASE Sénégal (Livraison sous 4h)</option>
                    <option value="Laborex Sénégal">Laborex Sénégal</option>
                    <option value="SODIPHARM">SODIPHARM</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Type de Commande</label>
                  <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800">
                    <option>Réapprovisionnement Seuil Critique (Antibiotiques, Antalgiques)</option>
                    <option>Commande Spéciale Stupéfiants & Tableau A</option>
                    <option>Commande Urgente Garde de Nuit</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Instructions de Livraison</label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Livrer avant 14h30 par le quai arrière de la pharmacie"
                    value={orderNotes}
                    onChange={e => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setOrderModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold shadow-sm"
                  >
                    Transmettre la Commande
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Impression Badge Professionnel */}
      <AnimatePresence>
        {badgeModalOpen && selectedStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBadgeModalOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 text-center z-10"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black text-slate-900">Badge Officinal Health AI</span>
                <button onClick={() => setBadgeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Aperçu du badge physique */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-700 text-white shadow-xl space-y-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-xs flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-tight">Health AI Officine</span>
                </div>

                <div className="w-16 h-16 rounded-full bg-white text-violet-800 font-black text-xl flex items-center justify-center mx-auto shadow-md">
                  {selectedStaff.name.charAt(0)}
                </div>

                <div>
                  <h4 className="text-base font-black">{selectedStaff.name}</h4>
                  <p className="text-xs text-violet-100">{selectedStaff.details?.roleTitle || "Pharmacien Adjoint"}</p>
                  <p className="text-[10px] text-violet-200 mt-1 font-mono">RPPS : {selectedStaff.details?.rpps || "849204"}</p>
                </div>

                <div className="p-2 bg-white rounded-xl inline-block shadow-sm">
                  <QrCode className="h-20 w-20 text-slate-900" />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-extrabold flex items-center justify-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Imprimer le Badge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
