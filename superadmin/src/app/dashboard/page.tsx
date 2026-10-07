'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore, LocalUserRecord, UserSession } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Plus, Search, Power, Send, Hospital, 
  AlertCircle, LogOut, Sparkles, ShieldAlert, X, Building,
  KeyRound, ShieldCheck, Trash2, UserPlus, Eye, Activity, HeartPulse, UserCheck
} from 'lucide-react';

type TabType = 'analytics' | 'accounts';

export default function SuperAdminDashboard() {
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
    deleteUser 
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const [allUsers, setAllUsers] = useState<LocalUserRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserSession['role']>('all');
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [newAffiliation, setNewAffiliation] = useState('');

  // Form states for new user creation
  const [newRole, setNewRole] = useState<UserSession['role']>('doctor');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [affiliationName, setAffiliationName] = useState('');
  
  // Patient specific details
  const [patientGender, setPatientGender] = useState<'M' | 'F'>('M');
  const [patientAge, setPatientAge] = useState('30');
  const [patientBloodGroup, setPatientBloodGroup] = useState('O+');

  // Notification Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    // Session checks
    if (isAuthenticated && user) {
      if (user.role !== 'superadmin') {
        router.push('/login');
      } else {
        loadAllUsers();
      }
    } else if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  const loadAllUsers = async () => {
    const roles: UserSession['role'][] = [
      'superadmin', 'admin_hospital', 'admin_pharmacy',
      'doctor', 'nurse', 'radiology', 'pharmacist', 'reception', 'cashier',
      'patient'
    ];
    const data = await getUsersByRoles(roles);
    setAllUsers(data);
  };

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogoutClick = () => {
    logout();
    router.push('/login');
  };

  const handleToggleSuspension = async (email: string) => {
    const success = await toggleUserSuspension(email);
    if (success) {
      triggerToast("Statut du compte mis à jour avec succès.");
      await loadAllUsers();
    } else {
      triggerToast("Une erreur est survenue lors de la mise à jour.", "error");
    }
  };

  const handleOpenTransfer = (email: string, role: string, details: any) => {
    setSelectedEmail(email);
    const currentAffiliation = role === 'pharmacist' || role === 'admin_pharmacy'
      ? details?.pharmacyName 
      : details?.hospital;
    setNewAffiliation(currentAffiliation || '');
    setTransferModalOpen(true);
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAffiliation.trim()) return;

    const success = await transferUserAffiliation(selectedEmail, newAffiliation);
    if (success) {
      triggerToast(`Affectation mise à jour vers "${newAffiliation}" avec succès.`);
      setTransferModalOpen(false);
      await loadAllUsers();
    } else {
      triggerToast("Erreur lors de la mise à jour de l'affectation.", "error");
    }
  };

  const handleOpenDelete = (email: string) => {
    if (email.toLowerCase() === user?.email.toLowerCase()) {
      triggerToast("Vous ne pouvez pas supprimer votre propre compte super-administrateur active.", "error");
      return;
    }
    setSelectedEmail(email);
    setDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async () => {
    const success = await deleteUser(selectedEmail);
    if (success) {
      triggerToast(`Le compte ${selectedEmail} a été supprimé définitivement du système.`);
      setDeleteModalOpen(false);
      await loadAllUsers();
    } else {
      triggerToast("Une erreur est survenue lors de la suppression.", "error");
    }
  };

  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newFirstName || !newLastName || !newPassword) {
      triggerToast("Veuillez renseigner tous les champs obligatoires.", "error");
      return;
    }

    const fullName = `${newFirstName} ${newLastName}`;
    
    // Construct role specific details
    let details: Record<string, any> = {
      firstName: newFirstName,
      lastName: newLastName,
      phone: newPhone,
      isCreatedBySuperadmin: true
    };

    if (newRole === 'patient') {
      details = {
        ...details,
        gender: patientGender,
        age: parseInt(patientAge) || 30,
        bloodGroup: patientBloodGroup,
        vitalId: `VITAL-${Math.floor(100000 + Math.random() * 900000)}`,
        allergies: 'Aucune enregistrée'
      };
    } else if (newRole === 'pharmacist' || newRole === 'admin_pharmacy') {
      if (!affiliationName) {
        triggerToast("Veuillez renseigner le nom de la pharmacie.", "error");
        return;
      }
      details.pharmacyName = affiliationName;
    } else if (newRole !== 'superadmin') {
      if (!affiliationName) {
        triggerToast("Veuillez renseigner le nom de l'hôpital ou établissement.", "error");
        return;
      }
      details.hospital = affiliationName;
    }

    const success = await createStaffAccount(newEmail, newPassword, newRole, fullName, details);
    if (success) {
      triggerToast(`Compte [${getRoleLabel(newRole)}] créé pour ${fullName} avec succès.`);
      setCreateModalOpen(false);
      // Reset form states
      setNewFirstName('');
      setNewLastName('');
      setNewEmail('');
      setNewPassword('');
      setNewPhone('');
      setAffiliationName('');
      await loadAllUsers();
    } else {
      triggerToast("Cet email est déjà utilisé par un autre compte dans le système.", "error");
    }
  };

  const filteredUsers = allUsers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.details?.vitalId && member.details.vitalId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'admin_hospital': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'admin_pharmacy': return 'bg-violet-100 text-violet-800 border-violet-200';
      case 'doctor': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'nurse': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'radiology': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pharmacist': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'reception': return 'bg-pink-100 text-pink-850 border-pink-200';
      case 'cashier': return 'bg-yellow-100 text-yellow-850 border-yellow-200';
      case 'patient': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin': return 'Super-Administrateur';
      case 'admin_hospital': return 'Admin Hôpital';
      case 'admin_pharmacy': return 'Admin Pharmacie';
      case 'doctor': return 'Médecin';
      case 'nurse': return 'Infirmier';
      case 'radiology': return 'Radiologue';
      case 'pharmacist': return 'Pharmacien';
      case 'reception': return 'Accueil';
      case 'cashier': return 'Caissier';
      case 'patient': return 'Patient';
      default: return role;
    }
  };

  // Advanced Stats calculations
  const totalCount = allUsers.length;
  const patientsCount = allUsers.filter(u => u.role === 'patient').length;
  const staffCount = allUsers.filter(u => ['doctor', 'nurse', 'radiology', 'pharmacist', 'reception', 'cashier'].includes(u.role)).length;
  const adminsCount = allUsers.filter(u => ['admin_hospital', 'admin_pharmacy', 'superadmin'].includes(u.role)).length;
  const suspendedCount = allUsers.filter(u => u.suspended).length;

  const activeUser = user || {
    name: "Super-Administrateur Global",
    email: "superadmin@sunusante.sn",
    role: "superadmin"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-100 text-slate-800 flex flex-col justify-between overflow-x-hidden">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white font-black border border-amber-500/20 shadow-md shadow-amber-500/10">
            <Shield className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-1.5 text-slate-900">
              Sunu Santé
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">
                SYSTEME GLOBAL
              </span>
            </h1>
            <p className="text-[9px] text-amber-700 font-bold uppercase tracking-widest">Console de Supervision Globale</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-xs px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-bold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
            {activeUser.name}
          </span>
          <button 
            onClick={handleLogoutClick}
            className="text-xs text-slate-500 hover:text-amber-600 transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent border-0 font-semibold"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Quitter</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-4 sm:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-4 text-sm font-extrabold relative flex items-center gap-2 cursor-pointer transition-all border-0 bg-transparent ${
              activeTab === 'analytics' ? 'text-amber-600 font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="h-4.5 w-4.5" />
            Vue d'ensemble / Analytics
            {activeTab === 'analytics' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('accounts')}
            className={`pb-4 text-sm font-extrabold relative flex items-center gap-2 cursor-pointer transition-all border-0 bg-transparent ${
              activeTab === 'accounts' ? 'text-amber-600 font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="h-4.5 w-4.5" />
            Gestion des Comptes ({totalCount})
            {activeTab === 'accounts' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600" />
            )}
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="pb-4 text-sm font-extrabold text-slate-600 hover:text-amber-600 cursor-pointer flex items-center gap-1.5 border-0 bg-transparent"
          >
            <Plus className="h-4.5 w-4.5" />
            Créer un Compte
          </button>
        </div>

        {/* Tab 1: Analytics Dashboard */}
        {activeTab === 'analytics' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Quick Stats Grid */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200/60 p-5 rounded-3xl flex items-center justify-between hover:border-amber-400/50 hover:shadow-md transition-all group shadow-sm shadow-slate-100">
                <div>
                  <h3 className="text-[10px] text-slate-600 font-extrabold uppercase tracking-widest">Comptes Inscrits</h3>
                  <p className="text-3xl font-black mt-1 group-hover:text-amber-600 transition-colors text-slate-800">{totalCount}</p>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100 group-hover:bg-amber-100 group-hover:text-amber-700 transition-all">
                  <Users className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200/60 p-5 rounded-3xl flex items-center justify-between hover:border-cyan-400/50 hover:shadow-md transition-all group shadow-sm shadow-slate-100">
                <div>
                  <h3 className="text-[10px] text-slate-600 font-extrabold uppercase tracking-widest">Personnel Médical</h3>
                  <p className="text-3xl font-black text-cyan-600 mt-1">{staffCount}</p>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center border border-slate-100 group-hover:bg-cyan-100 transition-all">
                  <HeartPulse className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200/60 p-5 rounded-3xl flex items-center justify-between hover:border-indigo-400/50 hover:shadow-md transition-all group shadow-sm shadow-slate-100">
                <div>
                  <h3 className="text-[10px] text-slate-600 font-extrabold uppercase tracking-widest">Patients Enregistrés</h3>
                  <p className="text-3xl font-black text-indigo-600 mt-1">{patientsCount}</p>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-100 transition-all">
                  <UserCheck className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200/60 p-5 rounded-3xl flex items-center justify-between hover:border-amber-400/50 hover:shadow-md transition-all group shadow-sm shadow-slate-100">
                <div>
                  <h3 className="text-[10px] text-slate-600 font-extrabold uppercase tracking-widest">Administrateurs</h3>
                  <p className="text-3xl font-black text-amber-600 mt-1">{adminsCount}</p>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-slate-100 group-hover:bg-amber-100 transition-all">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
            </section>

            {/* Quick Actions and Intro */}
            <section className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 rounded-3xl p-6 sm:p-8 shadow-lg shadow-amber-500/10 relative overflow-hidden text-white">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
                <KeyRound className="h-64 w-64 text-white" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <span className="text-[9px] bg-white/20 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-white/25">
                    Console de Habilitations et Contrôle
                  </span>
                  <h2 className="text-2xl font-black mt-3">Supervision Intégrale de l'Écosystème Sunu Santé</h2>
                  <p className="text-amber-50 text-xs mt-2 leading-relaxed max-w-2xl font-semibold">
                    Vous disposez de tous les pouvoirs système : créez de nouveaux comptes pour les patients et personnels cliniques, suspendez ou réactivez les accès instantanément, mutez les personnels d'établissement ou supprimez définitivement les comptes du système.
                  </p>
                </div>

                <div className="flex gap-3 flex-shrink-0">
                  <button
                    onClick={() => setCreateModalOpen(true)}
                    className="h-11 px-5 bg-white hover:bg-slate-50 text-amber-700 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md border-0"
                  >
                    <UserPlus className="h-4 w-4" />
                    Nouveau Compte
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('accounts')}
                    className="h-11 px-5 bg-white/10 hover:bg-white/25 text-white border border-white/20 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                    Voir les Comptes
                  </button>
                </div>
              </div>
            </section>

            {/* Distribution Analysis */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm shadow-slate-100/50 space-y-4">
                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="h-4.5 w-4.5 text-amber-600" />
                  Répartition des Comptes par Catégorie
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Médecins & Praticiens', count: allUsers.filter(u => u.role === 'doctor').length, color: 'bg-cyan-500', percentage: totalCount ? (allUsers.filter(u => u.role === 'doctor').length / totalCount) * 100 : 0 },
                    { label: 'Autres Personnels Clíniques (Infirmiers, Radios...)', count: allUsers.filter(u => ['nurse', 'radiology', 'pharmacist', 'reception', 'cashier'].includes(u.role)).length, color: 'bg-indigo-500', percentage: totalCount ? (allUsers.filter(u => ['nurse', 'radiology', 'pharmacist', 'reception', 'cashier'].includes(u.role)).length / totalCount) * 100 : 0 },
                    { label: 'Patients', count: patientsCount, color: 'bg-emerald-500', percentage: totalCount ? (patientsCount / totalCount) * 100 : 0 },
                    { label: 'Administrateurs Locaux', count: allUsers.filter(u => ['admin_hospital', 'admin_pharmacy'].includes(u.role)).length, color: 'bg-amber-500', percentage: totalCount ? (allUsers.filter(u => ['admin_hospital', 'admin_pharmacy'].includes(u.role)).length / totalCount) * 100 : 0 },
                  ].map((row, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800 font-bold">{row.label}</span>
                        <span className="font-bold text-slate-900">{row.count} ({row.percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${row.color}`} style={{ width: `${row.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Safety Summary */}
              <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm shadow-slate-100/50 space-y-4">
                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-amber-600" />
                  État du Réseau & Habilitations
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] text-slate-600 font-extrabold uppercase tracking-wider">État des Accès</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">100% Opérationnel</p>
                    <span className="text-[9px] text-slate-500 font-extrabold block mt-1">Noyau de routage actif</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] text-slate-600 font-extrabold uppercase tracking-wider">Accès Suspendus</p>
                    <p className={`text-2xl font-black mt-1 ${suspendedCount > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{suspendedCount}</p>
                    <span className="text-[9px] text-slate-500 font-extrabold block mt-1">Habilitations révoquées</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex gap-2.5 items-start text-[10px] text-slate-700 leading-relaxed font-semibold">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900">Rappel Audit RGPD / HIPAA :</strong> Toute action effectuée par le super-administrateur (création, suspension ou mutation administrative) est auditée et archivée localement dans le registre central d'activité.
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* Tab 2: Global Accounts Management */}
        {activeTab === 'accounts' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Filters and Search Bar */}
            <section className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, identifiant vital..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-amber-500 text-slate-900 shadow-sm"
                />
              </div>

              {/* Role filter select */}
              <div className="w-full sm:w-auto flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden md:inline">Filtrer par Rôle :</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="w-full sm:w-48 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer shadow-sm"
                >
                  <option value="all">Tous les rôles ({totalCount})</option>
                  <option value="patient">Patients ({patientsCount})</option>
                  <option value="doctor">Médecins</option>
                  <option value="nurse">Infirmiers</option>
                  <option value="radiology">Radiologues</option>
                  <option value="pharmacist">Pharmaciens</option>
                  <option value="reception">Personnels d'Accueil</option>
                  <option value="cashier">Caissiers</option>
                  <option value="admin_hospital">Admins Hôpital</option>
                  <option value="admin_pharmacy">Admins Pharmacie</option>
                  <option value="superadmin">Super-Administrateurs</option>
                </select>
              </div>
            </section>

            {/* Main Accounts Table */}
            <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md shadow-slate-100/50">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-500 font-extrabold uppercase tracking-wider bg-slate-50">
                      <th className="p-5">Identité & Email</th>
                      <th className="p-5">Rôle</th>
                      <th className="p-5">Juridiction / Identifiant Unique</th>
                      <th className="p-5 text-center">Statut</th>
                      <th className="p-5 text-right">Actions de Contrôle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((member) => (
                        <tr key={member.email} className="hover:bg-slate-50/50 transition-colors text-xs">
                          
                          {/* Name and Email */}
                          <td className="p-5">
                            <div>
                              <p className="font-bold text-slate-900">{member.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{member.email}</p>
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td className="p-5">
                            <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold border whitespace-nowrap ${getRoleBadgeColor(member.role)}`}>
                              {getRoleLabel(member.role)}
                            </span>
                          </td>

                          {/* Jurisdiction / ID details */}
                          <td className="p-5 font-semibold text-slate-600">
                            {member.role === 'patient' ? (
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100">
                                  {member.details?.vitalId || 'VITAL-NON-ATTRIBUÉ'}
                                </span>
                                <p className="text-[10px] text-slate-500 font-normal">
                                  {member.details?.gender === 'M' ? 'Homme' : 'Femme'}, {member.details?.age || 30} ans, {member.details?.bloodGroup || 'O+'}
                                </p>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                {member.role === 'pharmacist' || member.role === 'admin_pharmacy' ? (
                                  <Building className="h-3.5 w-3.5 text-violet-600 flex-shrink-0" />
                                ) : (
                                  <Hospital className="h-3.5 w-3.5 text-cyan-600 flex-shrink-0" />
                                )}
                                <span className="truncate max-w-[200px]">
                                  {member.role === 'pharmacist' || member.role === 'admin_pharmacy'
                                    ? (member.details?.pharmacyName || 'Officine Globale')
                                    : (member.details?.hospital || 'Établissement Global')
                                  }
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Suspension Status */}
                          <td className="p-5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold whitespace-nowrap ${
                              member.suspended 
                                ? 'bg-red-50 text-red-600 border border-red-200/50' 
                                : 'bg-emerald-50 text-emerald-600 border border-emerald-250/50'
                            }`}>
                              {member.suspended ? 'Suspendu' : 'Actif'}
                            </span>
                          </td>

                          {/* Control Actions */}
                          <td className="p-5 text-right">
                            <div className="flex gap-2 justify-end">
                              {/* Mutation action for non-patient/non-superadmin accounts */}
                              {member.role !== 'patient' && member.role !== 'superadmin' && (
                                <button
                                  onClick={() => handleOpenTransfer(
                                    member.email, 
                                    member.role,
                                    member.details
                                  )}
                                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-600 hover:text-slate-900 transition-all cursor-pointer text-[10px] font-bold flex items-center gap-1"
                                >
                                  <Send className="h-3 w-3" />
                                  Mutations
                                </button>
                              )}

                              {/* Toggle access suspension */}
                              {member.email.toLowerCase() !== user?.email.toLowerCase() && (
                                <button
                                  onClick={() => handleToggleSuspension(member.email)}
                                  className={`px-2.5 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer flex items-center gap-1 transition-all border ${
                                    member.suspended 
                                      ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border-emerald-200/50' 
                                      : 'bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white border-amber-200/50'
                                  }`}
                                >
                                  <Power className="h-3 w-3" />
                                  {member.suspended ? 'Activer' : 'Suspendre'}
                                </button>
                              )}

                              {/* Delete account permanently */}
                              {member.email.toLowerCase() !== user?.email.toLowerCase() && (
                                <button
                                  onClick={() => handleOpenDelete(member.email)}
                                  className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition-all border border-red-200 cursor-pointer text-[10px] font-bold flex items-center gap-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Supprimer
                                </button>
                              )}
                            </div>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-slate-400">
                          <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-30 text-slate-400" />
                          Aucun compte ne correspond à votre recherche ou filtre.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </motion.div>
        )}

      </main>

      {/* MODAL: CREATE ACCOUNT (Unified form for all 10 roles) */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 text-slate-800 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-amber-600" />
                  <h3 className="font-extrabold text-base text-slate-900">Créer un Compte Écosystème</h3>
                </div>
                <button 
                  onClick={() => setCreateModalOpen(false)}
                  className="text-slate-500 hover:text-slate-800 cursor-pointer bg-transparent border-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAccountSubmit} className="space-y-4">
                
                {/* Role selection dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Sélectionner le Rôle Profil</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserSession['role'])}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-800 cursor-pointer shadow-sm"
                  >
                    <optgroup label="Habilitations Administrateur" className="bg-white">
                      <option value="admin_hospital">Directeur d'Hôpital (admin_hospital)</option>
                      <option value="admin_pharmacy">Superviseur de Pharmacie (admin_pharmacy)</option>
                      <option value="superadmin">Super-Administrateur Système (superadmin)</option>
                    </optgroup>
                    <optgroup label="Professionnels de Santé Clínique" className="bg-white">
                      <option value="doctor">Médecin Généraliste / Spécialiste (doctor)</option>
                      <option value="nurse">Infirmier Hospitalier (nurse)</option>
                      <option value="radiology">Laborantin / Radiologue (radiology)</option>
                      <option value="pharmacist">Pharmacien Titulaire / Adjoint (pharmacist)</option>
                    </optgroup>
                    <optgroup label="Personnels Administratifs Locaux" className="bg-white">
                      <option value="reception">Secrétaire / Accueil Clinique (reception)</option>
                      <option value="cashier">Caissier Principal (cashier)</option>
                    </optgroup>
                    <optgroup label="Patients et Assurés" className="bg-white">
                      <option value="patient">Patient Assuré Sunu Santé (patient)</option>
                    </optgroup>
                  </select>
                </div>

                {/* First and Last Names */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Prénom</label>
                    <input
                      type="text"
                      required
                      placeholder="Modou"
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-amber-500 text-slate-800 shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nom</label>
                    <input
                      type="text"
                      required
                      placeholder="Diagne"
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-amber-500 text-slate-800 shadow-sm"
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Adresse Email</label>
                    <input
                      type="email"
                      required
                      placeholder="m.diagne@sunusante.sn"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-amber-500 text-slate-800 shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">N° Téléphone</label>
                    <input
                      type="tel"
                      placeholder="+221 77 109 23 88"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-amber-500 text-slate-800 shadow-sm"
                    />
                  </div>
                </div>

                {/* Temporary Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mot de passe temporaire</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-amber-500 text-slate-800 shadow-sm"
                  />
                </div>

                {/* Patient Specific Fields */}
                {newRole === 'patient' ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Sexe</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setPatientGender('M')}
                          className={`flex-grow py-1 rounded text-xs font-bold cursor-pointer border ${
                            patientGender === 'M' ? 'bg-amber-600 text-white font-bold border-amber-600' : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          M
                        </button>
                        <button
                          type="button"
                          onClick={() => setPatientGender('F')}
                          className={`flex-grow py-1 rounded text-xs font-bold cursor-pointer border ${
                            patientGender === 'F' ? 'bg-amber-600 text-white font-bold border-amber-600' : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          F
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Âge</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        className="w-full px-3 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 text-center focus:outline-none focus:border-amber-500 shadow-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Groupe Sanguin</label>
                      <select
                        value={patientBloodGroup}
                        onChange={(e) => setPatientBloodGroup(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 text-center focus:outline-none focus:border-amber-500 cursor-pointer shadow-sm"
                      >
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                ) : newRole !== 'superadmin' ? (
                  /* Affiliation name for doctors, pharmacists, admins, receptionists, etc. */
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {newRole === 'pharmacist' || newRole === 'admin_pharmacy'
                        ? "Nom de la Pharmacie / Officine"
                        : "Nom de l'Hôpital / Établissement Médical"
                      }
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={
                        newRole === 'pharmacist' || newRole === 'admin_pharmacy'
                          ? "Pharmacie Centrale de Pikine" 
                          : "Hôpital Principal de Dakar"
                      }
                      value={affiliationName}
                      onChange={(e) => setAffiliationName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-800 shadow-sm"
                    />
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-500 font-extrabold text-xs cursor-pointer shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-1.5 border-0"
                >
                  <Plus className="h-4.5 w-4.5" />
                  Créer et Attribuer les Habilités Profil
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: MUTATION / TRANSFER JURISDICTION */}
      <AnimatePresence>
        {transferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-6 text-slate-800 relative"
            >
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-amber-600" />
                  <h3 className="font-extrabold text-base text-slate-900">Mutation Administrative</h3>
                </div>
                <button 
                  onClick={() => setTransferModalOpen(false)}
                  className="text-slate-500 hover:text-slate-800 cursor-pointer bg-transparent border-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleTransferSubmit} className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Compte Sélectionné</p>
                  <p className="text-xs font-mono font-bold text-slate-600">{selectedEmail}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nouvel Établissement sous Affectation</label>
                  <input
                    type="text"
                    required
                    value={newAffiliation}
                    onChange={(e) => setNewAffiliation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-800 shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-500 font-extrabold text-xs cursor-pointer shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-1.5 border-0"
                >
                  <Send className="h-4.5 w-4.5" />
                  Valider la Mutation Administrative
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: DEFINITIVE USER DELETION CONFIRMATION */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-red-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-6 text-slate-800 relative"
            >
              <div className="text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                
                <h3 className="font-extrabold text-base text-red-600">Suppression Définitive !</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Êtes-vous sûr de vouloir supprimer définitivement le compte <strong className="text-slate-900 font-mono">{selectedEmail}</strong> de l'écosystème Sunu Santé ?
                </p>
                <div className="p-3 bg-red-50 border border-red-200/60 rounded-2xl text-[10px] text-red-600 text-left font-semibold leading-relaxed">
                  ⚠️ <strong>Cette action est irréversible :</strong> Toutes les informations cliniques, dossiers médicaux d'affiliation et accès associés seront instantanément révoqués et perdus.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors border border-slate-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteSubmit}
                  className="h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer border-0"
                >
                  Oui, Supprimer le Compte
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success/Error Toast */}
      {showToast && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-extrabold text-xs animate-bounce ${
          toastType === 'success' ? 'bg-amber-600 text-white border border-amber-500/10' : 'bg-red-600 text-white'
        }`}>
          <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
          {toastMsg}
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-slate-600 py-6 border-t border-slate-100 font-bold">
        &copy; {new Date().getFullYear()} Sunu Santé - Noyau de Super-Administration & Contrôle Global Système.
      </footer>
    </div>
  );
}
