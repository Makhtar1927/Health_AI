'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore, LocalUserRecord, UserSession } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Shield, Users, Plus, Search, Power, Send, Hospital, 
  AlertCircle, LogOut, Sparkles, ShieldAlert, X, Building,
  KeyRound, ShieldCheck, Trash2, UserPlus, Eye, Activity, HeartPulse, UserCheck,
  Building2, Pill, MapPin, Phone, Edit3, CheckCircle2, ChevronRight, Layers, SlidersHorizontal
} from 'lucide-react';

type TabType = 'analytics' | 'accounts' | 'facilities';

interface FacilityRecord {
  id: string;
  name: string;
  type: 'hopital' | 'centre_de_sante' | 'poste_de_sante' | 'clinique' | 'pharmacie';
  region: string;
  district: string;
  address: string;
  phone: string;
}

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
    deleteUser,
    getFacilities,
    createFacility,
    updateFacility,
    deleteFacility
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const [allUsers, setAllUsers] = useState<LocalUserRecord[]>([]);
  const [facilities, setFacilities] = useState<FacilityRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserSession['role']>('all');
  const [facilityTypeFilter, setFacilityTypeFilter] = useState<'all' | 'hospital' | 'pharmacy'>('all');
  
  // User Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedUserRole, setSelectedUserRole] = useState<string>('');
  const [newAffiliation, setNewAffiliation] = useState('');

  // Facility Modal states
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<FacilityRecord | null>(null);
  const [facilityName, setFacilityName] = useState('');
  const [facilityType, setFacilityType] = useState<FacilityRecord['type']>('hopital');
  const [facilityRegion, setFacilityRegion] = useState('Dakar');
  const [facilityDistrict, setFacilityDistrict] = useState('Dakar Centre');
  const [facilityAddress, setFacilityAddress] = useState('');
  const [facilityPhone, setFacilityPhone] = useState('+221 33 000 00 00');

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
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role !== 'superadmin') {
        router.push('/login');
      } else {
        loadAllUsers();
        loadAllFacilities();
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

  const loadAllFacilities = async () => {
    const data = await getFacilities();
    setFacilities(data);
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
    setSelectedUserRole(role);
    const currentAffiliation = role === 'pharmacist' || role === 'admin_pharmacy'
      ? details?.pharmacyName 
      : details?.hospital;
    setNewAffiliation(currentAffiliation || '');
    setTransferModalOpen(true);
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAffiliation.trim()) {
      triggerToast("Veuillez sélectionner un établissement dans la liste.", "error");
      return;
    }

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
      triggerToast("Vous ne pouvez pas supprimer votre propre compte super-administrateur.", "error");
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

  // Création d'utilisateur avec sélection obligatoire d'un établissement existant
  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newFirstName || !newLastName || !newPassword) {
      triggerToast("Veuillez renseigner tous les champs obligatoires.", "error");
      return;
    }

    const fullName = `${newFirstName} ${newLastName}`;
    
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
        triggerToast("Veuillez sélectionner une pharmacie dans la liste déroulante.", "error");
        return;
      }
      details.pharmacyName = affiliationName;
    } else if (newRole !== 'superadmin') {
      if (!affiliationName) {
        triggerToast("Veuillez sélectionner un hôpital dans la liste déroulante.", "error");
        return;
      }
      details.hospital = affiliationName;
    }

    const success = await createStaffAccount(newEmail, newPassword, newRole, fullName, details);
    if (success) {
      triggerToast(`Compte [${getRoleLabel(newRole)}] créé pour ${fullName} avec succès.`);
      setCreateModalOpen(false);
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

  // Gestion des établissements (Création & Modification)
  const handleOpenCreateFacility = () => {
    setEditingFacility(null);
    setFacilityName('');
    setFacilityType('hopital');
    setFacilityRegion('Dakar');
    setFacilityDistrict('Dakar Centre');
    setFacilityAddress('');
    setFacilityPhone('+221 33 000 00 00');
    setFacilityModalOpen(true);
  };

  const handleOpenEditFacility = (fac: FacilityRecord) => {
    setEditingFacility(fac);
    setFacilityName(fac.name);
    setFacilityType(fac.type);
    setFacilityRegion(fac.region);
    setFacilityDistrict(fac.district);
    setFacilityAddress(fac.address);
    setFacilityPhone(fac.phone);
    setFacilityModalOpen(true);
  };

  const handleSaveFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityName.trim() || !facilityPhone.trim()) {
      triggerToast("Nom et téléphone sont obligatoires.", "error");
      return;
    }

    if (editingFacility) {
      // Modification
      const success = await updateFacility(editingFacility.id, {
        name: facilityName,
        type: facilityType,
        region: facilityRegion,
        district: facilityDistrict,
        address: facilityAddress,
        phone: facilityPhone
      });

      if (success) {
        triggerToast(`Établissement "${facilityName}" mis à jour avec succès.`);
        setFacilityModalOpen(false);
        await loadAllFacilities();
      } else {
        triggerToast("Erreur lors de la mise à jour de l'établissement.", "error");
      }
    } else {
      // Création
      const success = await createFacility({
        name: facilityName,
        type: facilityType,
        region: facilityRegion,
        district: facilityDistrict,
        address: facilityAddress,
        phone: facilityPhone
      });

      if (success) {
        triggerToast(`Établissement "${facilityName}" créé avec succès.`);
        setFacilityModalOpen(false);
        await loadAllFacilities();
      } else {
        triggerToast("Erreur lors de la création de l'établissement.", "error");
      }
    }
  };

  const handleDeleteFacility = async (id: string, name: string) => {
    if (!confirm(`Confirmez-vous la suppression définitive de "${name}" ?`)) return;

    const success = await deleteFacility(id);
    if (success) {
      triggerToast(`Établissement "${name}" supprimé avec succès.`);
      await loadAllFacilities();
    } else {
      triggerToast("Erreur lors de la suppression.", "error");
    }
  };

  // Listes filtrées d'hôpitaux et de pharmacies pour les selects
  const hospitalsList = facilities.filter(f => f.type !== 'pharmacie');
  const pharmaciesList = facilities.filter(f => f.type === 'pharmacie');

  const filteredUsers = allUsers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.details?.vitalId && member.details.vitalId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredFacilities = facilities.filter(fac => {
    const matchesSearch = 
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.district.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (facilityTypeFilter === 'hospital') {
      return matchesSearch && fac.type !== 'pharmacie';
    }
    if (facilityTypeFilter === 'pharmacy') {
      return matchesSearch && fac.type === 'pharmacie';
    }
    return matchesSearch;
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

  // Stats
  const totalCount = allUsers.length;
  const patientCount = allUsers.filter(u => u.role === 'patient').length;
  const staffCount = allUsers.filter(u => u.role !== 'patient' && u.role !== 'superadmin').length;
  const suspendedCount = allUsers.filter(u => u.suspended).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between overflow-x-hidden antialiased">
      
      {/* Toast de notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 shadow-xl ${
              toastType === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-emerald-500/10' 
                : 'bg-rose-50 border-rose-200 text-rose-950 shadow-rose-500/10'
            }`}
          >
            {toastType === 'success' ? (
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
            )}
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Super Admin Mode Clair */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
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
              <h1 className="text-base font-black tracking-tight text-slate-900">Health AI</h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                Super-Administrateur
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Répertoire National des Hôpitaux, Pharmacies & Habilitations</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-extrabold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {user?.name || "Super-Admin"}
          </span>
          <button 
            onClick={handleLogoutClick}
            className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent border-0"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-4 sm:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Mode Clair */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 px-3 text-xs font-extrabold relative flex items-center gap-2 cursor-pointer transition-all border-0 bg-transparent ${
              activeTab === 'analytics' ? 'text-amber-600 font-black' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Activity className="h-4 w-4" />
            Vue d&apos;ensemble / Analytics
            {activeTab === 'analytics' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('accounts')}
            className={`pb-3 px-3 text-xs font-extrabold relative flex items-center gap-2 cursor-pointer transition-all border-0 bg-transparent ${
              activeTab === 'accounts' ? 'text-amber-600 font-black' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="h-4 w-4" />
            Comptes & Praticiens ({totalCount})
            {activeTab === 'accounts' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('facilities')}
            className={`pb-3 px-3 text-xs font-extrabold relative flex items-center gap-2 cursor-pointer transition-all border-0 bg-transparent ${
              activeTab === 'facilities' ? 'text-amber-600 font-black' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="h-4 w-4" />
            Hôpitaux & Pharmacies ({facilities.length})
            {activeTab === 'facilities' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500" />
            )}
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => handleOpenCreateFacility()}
              className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-extrabold flex items-center gap-1.5 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Ajouter un Établissement</span>
            </button>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm hover:from-amber-600 hover:to-yellow-500 transition-all cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Créer un Compte</span>
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* TAB 1: ANALYTICS                                                      */}
        {/* ===================================================================== */}
        {activeTab === 'analytics' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Comptes Inscrits</h3>
                  <p className="text-3xl font-black mt-1 text-slate-900">{totalCount}</p>
                </div>
                <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                  <Users className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Hôpitaux Agréés</h3>
                  <p className="text-3xl font-black text-cyan-700 mt-1">{hospitalsList.length}</p>
                </div>
                <div className="h-11 w-11 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center border border-cyan-200">
                  <Hospital className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Pharmacies Agréées</h3>
                  <p className="text-3xl font-black text-violet-700 mt-1">{pharmaciesList.length}</p>
                </div>
                <div className="h-11 w-11 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center border border-violet-200">
                  <Pill className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Personnel Médical</h3>
                  <p className="text-3xl font-black text-emerald-700 mt-1">{staffCount}</p>
                </div>
                <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <HeartPulse className="h-5 w-5" />
                </div>
              </div>
            </section>

            {/* Banner Informative Super Admin */}
            <div className="bg-gradient-to-r from-amber-500 to-yellow-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-amber-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="text-[10px] bg-white/20 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Règle d&apos;Or du Système Health AI
                </span>
                <h2 className="text-2xl font-black tracking-tight">Source Unique de Vérité</h2>
                <p className="text-amber-50 text-xs sm:text-sm leading-relaxed">
                  Tous les hôpitaux et pharmacies créés ici alimentent automatiquement les menus déroulants de toute la plateforme. Aucun utilisateur ne peut saisir un établissement inexistant.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('facilities')}
                className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-md hover:bg-slate-50 transition-all cursor-pointer"
              >
                Gérer les Établissements &rarr;
              </button>
            </div>
          </motion.div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: GESTION DES COMPTES UTILISATEURS                               */}
        {/* ===================================================================== */}
        {activeTab === 'accounts' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Filter toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, identifiant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Rôle :</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="doctor">Médecins</option>
                  <option value="nurse">Infirmiers</option>
                  <option value="radiology">Radiologues</option>
                  <option value="pharmacist">Pharmaciens</option>
                  <option value="reception">Accueil</option>
                  <option value="cashier">Caissiers</option>
                  <option value="admin_hospital">Admin Hôpital</option>
                  <option value="admin_pharmacy">Admin Pharmacie</option>
                  <option value="patient">Patients</option>
                </select>
              </div>
            </div>

            {/* Users table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-6">Utilisateur & Contact</th>
                      <th className="py-3.5 px-4">Rôle</th>
                      <th className="py-3.5 px-4">Rattachement Établissement</th>
                      <th className="py-3.5 px-4 text-center">Statut</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredUsers.map((member, idx) => {
                      const isSuspended = member.suspended;
                      const affiliation = member.details?.hospital || member.details?.pharmacyName || (member.role === 'patient' ? "Dossier National Vital" : "Central");

                      return (
                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 font-black text-xs flex items-center justify-center shrink-0 border border-amber-200/60">
                                {member.name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-black text-slate-900 block">{member.name}</span>
                                <span className="text-[11px] text-slate-400 font-mono">{member.email}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getRoleBadgeColor(member.role)}`}>
                              {getRoleLabel(member.role)}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-bold text-slate-800 block">{affiliation}</span>
                            {member.details?.roleTitle && (
                              <span className="text-[10px] text-slate-400">{member.details.roleTitle}</span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-center">
                            {isSuspended ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                                Suspendu
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                Actif
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Muter établissement */}
                              {member.role !== 'patient' && member.role !== 'superadmin' && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenTransfer(member.email, member.role, member.details)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                                  title="Changer d'établissement"
                                >
                                  <Send className="h-4 w-4" />
                                </button>
                              )}

                              {/* Toggle Suspension */}
                              <button
                                type="button"
                                onClick={() => handleToggleSuspension(member.email)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  isSuspended ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                }`}
                                title={isSuspended ? "Réactiver" : "Suspendre"}
                              >
                                <Power className="h-4 w-4" />
                              </button>

                              {/* Supprimer */}
                              <button
                                type="button"
                                onClick={() => handleOpenDelete(member.email)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                title="Supprimer définitivement"
                              >
                                <Trash2 className="h-4 w-4" />
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
          </motion.div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: HÔPITAUX & PHARMACIES (SOURCE DE VÉRITÉ UNIQUE)                 */}
        {/* ===================================================================== */}
        {activeTab === 'facilities' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Toolbar Établissements */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher hôpital ou pharmacie, ville..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setFacilityTypeFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      facilityTypeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    Tous ({facilities.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFacilityTypeFilter('hospital')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      facilityTypeFilter === 'hospital' ? 'bg-white text-cyan-800 shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    Hôpitaux ({hospitalsList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFacilityTypeFilter('pharmacy')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      facilityTypeFilter === 'pharmacy' ? 'bg-white text-violet-800 shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    Pharmacies ({pharmaciesList.length})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleOpenCreateFacility}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            {/* Tableau des établissements */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-6">Établissement & Type</th>
                      <th className="py-3.5 px-4">Localisation & Région</th>
                      <th className="py-3.5 px-4">Contact Téléphonique</th>
                      <th className="py-3.5 px-4 text-center">Spécialités / Rôle</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredFacilities.map(fac => {
                      const isPharmacy = fac.type === 'pharmacie';

                      return (
                        <tr key={fac.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                isPharmacy ? 'bg-violet-50 text-violet-700 border border-violet-200' : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                              }`}>
                                {isPharmacy ? <Pill className="h-4.5 w-4.5" /> : <Hospital className="h-4.5 w-4.5" />}
                              </div>
                              <div>
                                <span className="font-black text-slate-900 block">{fac.name}</span>
                                <span className="text-[10px] text-slate-400 capitalize">{fac.type.replace(/_/g, ' ')}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="space-y-0.5">
                              <span className="font-extrabold text-slate-800 block">{fac.region} &bull; {fac.district}</span>
                              <span className="text-[11px] text-slate-400 block">{fac.address || "Adresse principale"}</span>
                            </div>
                          </td>

                          <td className="py-4 px-4 font-mono font-semibold text-slate-700">
                            {fac.phone}
                          </td>

                          <td className="py-4 px-4 text-center">
                            {isPharmacy ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200">
                                Officine de Dispensation
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                                Établissement de Soins & Consultations
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditFacility(fac)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                                title="Modifier l'établissement"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteFacility(fac.id, fac.name)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                title="Supprimer l'établissement"
                              >
                                <Trash2 className="h-4 w-4" />
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
          </motion.div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL CRÉATION COMPTE : SÉLECTION PAR CLIC DANS LISTE DÉROULANTE          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-slate-800 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Nouveau Compte Système</h3>
                    <p className="text-xs text-slate-500">Sélectionnez obligatoirement un établissement officiel</p>
                  </div>
                </div>
                <button 
                  onClick={() => setCreateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAccountSubmit} className="space-y-4">
                {/* Rôle */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Rôle de l&apos;utilisateur</label>
                  <select
                    value={newRole}
                    onChange={(e) => {
                      setNewRole(e.target.value as any);
                      setAffiliationName(''); // Réinitialiser le select pour forcer la sélection
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="doctor">Médecin Spécialiste / Généraliste</option>
                    <option value="nurse">Infirmier / Soignant</option>
                    <option value="radiology">Radiologue / Imagerie</option>
                    <option value="pharmacist">Pharmacien au Comptoir</option>
                    <option value="reception">Accueil & Réception</option>
                    <option value="cashier">Caissier & Facturation</option>
                    <option value="admin_hospital">Admin Direction Hôpital</option>
                    <option value="admin_pharmacy">Admin Direction Pharmacie</option>
                    <option value="patient">Patient Bénéficiaire</option>
                  </select>
                </div>

                {/* Prénom & Nom */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Prénom</label>
                    <input
                      type="text"
                      required
                      placeholder="Mamadou"
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Nom</label>
                    <input
                      type="text"
                      required
                      placeholder="Ba"
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-900"
                    />
                  </div>
                </div>

                {/* Email & Mot de passe */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="m.ba@healthai.sn"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Mot de passe</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-900"
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Numéro de Téléphone</label>
                  <input
                    type="tel"
                    placeholder="+221 77 000 00 00"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-900"
                  />
                </div>

                {/* SÉLECTION EXCLUSIVE PAR CLIC DE L'ÉTABLISSEMENT */}
                {newRole === 'patient' ? (
                  <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">Sexe</label>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setPatientGender('M')}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${
                            patientGender === 'M' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700'
                          }`}
                        >
                          M
                        </button>
                        <button
                          type="button"
                          onClick={() => setPatientGender('F')}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${
                            patientGender === 'F' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700'
                          }`}
                        >
                          F
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">Âge</label>
                      <input
                        type="number"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">Groupe</label>
                      <select
                        value={patientBloodGroup}
                        onChange={(e) => setPatientBloodGroup(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-center"
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
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                      {newRole === 'pharmacist' || newRole === 'admin_pharmacy'
                        ? "Pharmacie d'Affectation (Sélectionnez)"
                        : "Hôpital / Établissement de Soins (Sélectionnez)"
                      }
                    </label>
                    <select
                      required
                      value={affiliationName}
                      onChange={(e) => setAffiliationName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer"
                    >
                      <option value="">
                        {newRole === 'pharmacist' || newRole === 'admin_pharmacy'
                          ? "-- Choisissez une pharmacie agréée --"
                          : "-- Choisissez un hôpital agréé --"}
                      </option>
                      {(newRole === 'pharmacist' || newRole === 'admin_pharmacy' ? pharmaciesList : hospitalsList).map(fac => (
                        <option key={fac.id} value={fac.name}>
                          {fac.name} &bull; {fac.region} ({fac.district})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-extrabold text-xs cursor-pointer shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-yellow-500 transition-all flex items-center justify-center gap-1.5 border-0 mt-3"
                >
                  <Plus className="h-4.5 w-4.5" />
                  Créer et Valider l&apos;Affectation
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL MUTATION D'ÉTABLISSEMENT : SÉLECTION PAR CLIC DANS LISTE            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {transferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-slate-800 relative"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900">Changer de Point d&apos;Affectation</h3>
                <button onClick={() => setTransferModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleTransferSubmit} className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Compte Sélectionné</p>
                  <p className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 truncate">{selectedEmail}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Nouvel Établissement (Sélectionnez par clic)
                  </label>
                  <select
                    required
                    value={newAffiliation}
                    onChange={(e) => setNewAffiliation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer"
                  >
                    <option value="">-- Choisissez le nouvel établissement d&apos;affectation --</option>
                    {(selectedUserRole === 'pharmacist' || selectedUserRole === 'admin_pharmacy' ? pharmaciesList : hospitalsList).map(fac => (
                      <option key={fac.id} value={fac.name}>
                        {fac.name} &bull; {fac.region} ({fac.district})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-extrabold text-xs cursor-pointer shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-yellow-500 transition-all flex items-center justify-center gap-1.5 border-0 mt-3"
                >
                  <Send className="h-4 w-4" />
                  Valider la Mutation Administrative
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL AJOUT / MODIFICATION D'ÉTABLISSEMENT                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {facilityModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-slate-800 relative"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">
                    {editingFacility ? "Modifier l'Établissement" : "Enregistrer un Nouvel Établissement"}
                  </h3>
                </div>
                <button onClick={() => setFacilityModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveFacility} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Type d&apos;Établissement</label>
                  <select
                    value={facilityType}
                    onChange={(e) => setFacilityType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="hopital">Hôpital National / Régional</option>
                    <option value="clinique">Clinique Privée Agréée</option>
                    <option value="centre_de_sante">Centre de Santé</option>
                    <option value="poste_de_sante">Poste de Santé</option>
                    <option value="pharmacie">Pharmacie d&apos;Officine</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nom Officiel de l&apos;Établissement</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Hôpital Dalal Jamm ou Pharmacie Mermoz"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Région</label>
                    <select
                      value={facilityRegion}
                      onChange={(e) => setFacilityRegion(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Dakar">Dakar</option>
                      <option value="Thiès">Thiès</option>
                      <option value="Saint-Louis">Saint-Louis</option>
                      <option value="Kaolack">Kaolack</option>
                      <option value="Ziguinchor">Ziguinchor</option>
                      <option value="Diourbel">Diourbel</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">District / Ville</label>
                    <input
                      type="text"
                      placeholder="Dakar Plateau"
                      value={facilityDistrict}
                      onChange={(e) => setFacilityDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Adresse Complète</label>
                  <input
                    type="text"
                    placeholder="Avenue Cheikh Anta Diop"
                    value={facilityAddress}
                    onChange={(e) => setFacilityAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Téléphone Direct</label>
                  <input
                    type="tel"
                    required
                    placeholder="+221 33 000 00 00"
                    value={facilityPhone}
                    onChange={(e) => setFacilityPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setFacilityModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-sm"
                  >
                    {editingFacility ? "Enregistrer les modifications" : "Créer l'Établissement"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: SUPPRESSION D'UTILISATEUR */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-5 text-slate-800 text-center"
            >
              <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <Trash2 className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-black text-slate-900">Supprimer Définitivement ?</h3>
                <p className="text-xs text-slate-500">
                  Le compte <strong className="text-slate-800">{selectedEmail}</strong> sera irrévocablement supprimé de la base de données.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSubmit}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-colors cursor-pointer shadow-sm"
                >
                  Confirmer Suppression
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
