'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore, LocalUserRecord, UserSession } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Stethoscope, Activity, Image as ImageIcon, 
  CreditCard, Plus, Search, Power, Send, Hospital, 
  AlertCircle, CheckCircle, LogOut, Sparkles, UserCheck, 
  UserX, ShieldAlert, BadgeAlert, ArrowRight, X, Loader2
} from 'lucide-react';

export default function AdminHospitalDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout, initialize, getUsersByRoles, createStaffAccount, toggleUserSuspension, transferUserAffiliation } = useAuthStore();

  const [staff, setStaff] = useState<LocalUserRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [newHospitalName, setNewHospitalName] = useState('');

  // Form states for new employee
  const [newRole, setNewRole] = useState<UserSession['role']>('doctor');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  
  // Custom role details
  const [rpps, setRpps] = useState('');
  const [specialty, setSpecialty] = useState('Généraliste');
  const [hospitalName, setHospitalName] = useState('Hôpital Principal de Dakar');
  const [department, setDepartment] = useState('Urgences');
  const [imagingCenter, setImagingCenter] = useState('');
  const [primaryMachinery, setPrimaryMachinery] = useState('IRM Siemens 3T');
  const [matricule, setMatricule] = useState('');
  const [deskAssignment, setDeskAssignment] = useState('Bureau A-101');
  const [posCode, setPosCode] = useState('CAISSE-01');

  // Notification Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    // If not authenticated or not hospital admin/superadmin, redirect
    if (isAuthenticated && user) {
      if (user.role !== 'admin_hospital' && user.role !== 'superadmin') {
        router.push('/hospital/login');
      } else {
        loadStaff();
      }
    } else if (!isAuthenticated) {
      router.push('/hospital/login');
    }
  }, [isAuthenticated, user, router]);

  const loadStaff = async () => {
    const data = await getUsersByRoles(['doctor', 'nurse', 'radiology', 'reception', 'cashier']);
    setStaff(data);
  };

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogoutClick = () => {
    logout();
    router.push('/hospital/login');
  };

  const handleToggleSuspension = async (email: string) => {
    const success = await toggleUserSuspension(email);
    if (success) {
      triggerToast("Statut du compte mis à jour avec succès.");
      await loadStaff();
    } else {
      triggerToast("Une erreur est survenue.", "error");
    }
  };

  const handleOpenTransfer = (email: string, currentHospital: string) => {
    setSelectedEmail(email);
    setNewHospitalName(currentHospital || 'Hôpital de Fann');
    setTransferModalOpen(true);
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHospitalName.trim()) return;

    const success = await transferUserAffiliation(selectedEmail, newHospitalName);
    if (success) {
      triggerToast(`Personnel transféré à ${newHospitalName} avec succès.`);
      setTransferModalOpen(false);
      await loadStaff();
    } else {
      triggerToast("Erreur lors du transfert.", "error");
    }
  };

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
      hospital: hospitalName
    };

    // Construct role specific details
    if (newRole === 'doctor') {
      details.rpps = rpps;
      details.specialty = specialty;
    } else if (newRole === 'nurse') {
      details.rpps = rpps; // ADELI/RPPS
      details.department = department;
    } else if (newRole === 'radiology') {
      details.rpps = rpps; // License
      details.imagingCenter = imagingCenter || "Centre Radiologique Central";
      details.primaryMachinery = primaryMachinery;
    } else if (newRole === 'reception') {
      details.matricule = matricule;
      details.deskAssignment = deskAssignment;
    } else if (newRole === 'cashier') {
      details.matricule = matricule;
      details.posCode = posCode;
    }

    const success = await createStaffAccount(newEmail, newPassword, newRole, fullName, details);
    if (success) {
      triggerToast(`Compte créé avec succès pour ${fullName}.`);
      setCreateModalOpen(false);
      // Reset form states
      setNewFirstName('');
      setNewLastName('');
      setNewEmail('');
      setNewPassword('');
      setNewPhone('');
      setRpps('');
      setMatricule('');
      await loadStaff();
    } else {
      triggerToast("Cet email est déjà utilisé par un autre compte.", "error");
    }
  };

  // Filters
  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'doctor': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'nurse': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'radiology': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'reception': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'cashier': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'doctor': return 'Médecin';
      case 'nurse': return 'Infirmier';
      case 'radiology': return 'Radiologue';
      case 'reception': return 'Accueil';
      case 'cashier': return 'Caissier';
      default: return role;
    }
  };

  const activeUser = user || {
    name: "Administrateur Hôpital",
    email: "direction@sunusante.sn",
    role: "admin_hospital"
  };

  // Stats calculations
  const totalCount = staff.length;
  const suspendedCount = staff.filter(s => s.suspended).length;
  const doctorCount = staff.filter(s => s.role === 'doctor').length;
  const nurseCount = staff.filter(s => s.role === 'nurse').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <Shield className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight">Direction Administrative</h1>
            <p className="text-[9px] text-emerald-400 font-semibold uppercase tracking-wider">Gestion Personnel Clinique</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            {activeUser.name}
          </span>
          <button 
            onClick={handleLogoutClick}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent border-0"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Quitter</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-4 sm:px-8 py-6 space-y-6">
        
        {/* Quick Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Effectif</h3>
              <p className="text-2xl font-black mt-1">{totalCount}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-750">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Médecins</h3>
              <p className="text-2xl font-black text-emerald-400 mt-1">{doctorCount}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Stethoscope className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Infirmiers</h3>
              <p className="text-2xl font-black text-rose-400 mt-1">{nurseCount}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Activity className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Comptes Suspendus</h3>
              <p className={`text-2xl font-black mt-1 ${suspendedCount > 0 ? 'text-amber-500' : 'text-slate-400'}`}>{suspendedCount}</p>
            </div>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${suspendedCount > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
        </section>

        {/* Action Board (Add account) */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-white">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
            <Shield className="h-56 w-56" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-[9px] bg-white/20 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Console d'Habilitation
              </span>
              <h2 className="text-2xl font-black mt-3">Gestion de l'Équipe Médicale & Admin</h2>
              <p className="text-emerald-100 text-xs mt-1 leading-relaxed max-w-xl">
                Créez de nouveaux profils certifiés, suspendez les comptes temporaires ou mettez à jour leur établissement d'affectation en temps réel.
              </p>
            </div>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="h-12 px-6 bg-white hover:bg-slate-100 text-emerald-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg flex-shrink-0 border-0"
            >
              <Plus className="h-5 w-5" />
              Créer un profil soignant
            </button>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-white"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
            {['all', 'doctor', 'nurse', 'radiology', 'reception', 'cashier'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                  roleFilter === role 
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-700/10 font-bold' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {role === 'all' ? 'Tous' : getRoleLabel(role)}
              </button>
            ))}
          </div>
        </section>

        {/* Staff Members Table */}
        <section className="bg-slate-950/40 rounded-3xl border border-slate-800/80 overflow-hidden shadow-glass backdrop-blur-glass">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-500 font-extrabold uppercase tracking-wider bg-slate-950/40">
                  <th className="p-5">Collaborateur</th>
                  <th className="p-5">Rôle</th>
                  <th className="p-5">Affectation</th>
                  <th className="p-5">Spécifications</th>
                  <th className="p-5 text-center">Statut</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((member) => (
                    <tr key={member.email} className="hover:bg-white/5 transition-colors text-xs">
                      
                      {/* Name and email */}
                      <td className="p-5">
                        <div>
                          <p className="font-bold text-slate-200">{member.name}</p>
                          <p className="text-[10px] text-slate-500">{member.email}</p>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="p-5">
                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold border ${getRoleBadgeColor(member.role)}`}>
                          {getRoleLabel(member.role)}
                        </span>
                      </td>

                      {/* Hospital location */}
                      <td className="p-5 font-medium text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Hospital className="h-3.5 w-3.5 text-slate-500" />
                          {member.details?.hospital || 'Non affecté'}
                        </div>
                      </td>

                      {/* Details specs */}
                      <td className="p-5 text-slate-400">
                        <div className="space-y-0.5">
                          {member.role === 'doctor' && (
                            <>
                              <p className="text-[10px]">RPPS: <strong className="text-slate-300">{member.details?.rpps || 'N/A'}</strong></p>
                              <p className="text-[10px]">Spé: <strong className="text-emerald-400">{member.details?.specialty || 'Généraliste'}</strong></p>
                            </>
                          )}
                          {member.role === 'nurse' && (
                            <>
                              <p className="text-[10px]">CNOM/RPPS: <strong className="text-slate-300">{member.details?.rpps || 'N/A'}</strong></p>
                              <p className="text-[10px]">Service: <strong className="text-rose-400">{member.details?.department || 'Urgences'}</strong></p>
                            </>
                          )}
                          {member.role === 'radiology' && (
                            <>
                              <p className="text-[10px]">Licence: <strong className="text-slate-300">{member.details?.rpps || 'N/A'}</strong></p>
                              <p className="text-[10px]">Centre: <strong className="text-purple-400">{member.details?.imagingCenter || 'N/A'}</strong></p>
                            </>
                          )}
                          {member.role === 'reception' && (
                            <>
                              <p className="text-[10px]">Matricule: <strong className="text-slate-300">{member.details?.matricule || 'N/A'}</strong></p>
                              <p className="text-[10px]">Bureau: <strong className="text-blue-400">{member.details?.deskAssignment || 'N/A'}</strong></p>
                            </>
                          )}
                          {member.role === 'cashier' && (
                            <>
                              <p className="text-[10px]">Matricule: <strong className="text-slate-300">{member.details?.matricule || 'N/A'}</strong></p>
                              <p className="text-[10px]">Point Vente: <strong className="text-amber-400">{member.details?.posCode || 'N/A'}</strong></p>
                            </>
                          )}
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
                            onClick={() => handleOpenTransfer(member.email, member.details?.hospital)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white transition-all cursor-pointer text-[10px] font-bold flex items-center gap-1"
                          >
                            <Send className="h-3 w-3" />
                            Transférer
                          </button>
                          
                          <button
                            onClick={() => handleToggleSuspension(member.email)}
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer flex items-center gap-1 transition-all border-0 ${
                              member.suspended 
                                ? 'bg-emerald-600/15 border-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white' 
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
                      Aucun personnel trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* CREATE ACCOUNT MODAL */}
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
                  <Shield className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-extrabold text-base">Habilitation d'un Nouveau Collaborateur</h3>
                </div>
                <button 
                  onClick={() => setCreateModalOpen(false)}
                  className="text-slate-400 hover:text-white cursor-pointer bg-transparent border-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAccountSubmit} className="space-y-4">
                
                {/* Role selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rôle Hospitalier</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserSession['role'])}
                    className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-white cursor-pointer appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`, backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '18px' }}
                  >
                    <option value="doctor" className="bg-slate-900">Médecin / Spécialiste</option>
                    <option value="nurse" className="bg-slate-900">Infirmier / Soins Cliniques</option>
                    <option value="radiology" className="bg-slate-900">Radiologue & Imagerie</option>
                    <option value="reception" className="bg-slate-900">Agent d'Accueil & Réception</option>
                    <option value="cashier" className="bg-slate-900">Caissier & Facturation</option>
                  </select>
                </div>

                {/* Identity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Prénom</label>
                    <input
                      type="text"
                      required
                      placeholder="Mamadou"
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nom</label>
                    <input
                      type="text"
                      required
                      placeholder="Sow"
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-white"
                    />
                  </div>
                </div>

                {/* Email and phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Adresse Email</label>
                    <input
                      type="email"
                      required
                      placeholder="m.sow@sunusante.sn"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Téléphone</label>
                    <input
                      type="tel"
                      placeholder="+221 77 483 92 10"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-white"
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
                    className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinique / Hôpital d'Affectation</label>
                  <input
                    type="text"
                    required
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-white"
                  />
                </div>

                {/* DYNAMIC ROLE FIELDS */}
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Spécificités du Rôle</p>
                  
                  {newRole === 'doctor' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">CNOM / RPPS</label>
                        <input
                          type="text"
                          required
                          placeholder="RPPS-9304928"
                          value={rpps}
                          onChange={(e) => setRpps(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs placeholder-slate-700 focus:outline-none focus:border-emerald-500 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Spécialité</label>
                        <select
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-white appearance-none cursor-pointer"
                          style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`, backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '16px' }}
                        >
                          <option value="Généraliste">Généraliste</option>
                          <option value="Cardiologue">Cardiologue</option>
                          <option value="Pédiatre">Pédiatre</option>
                          <option value="Chirurgien">Chirurgien</option>
                          <option value="Gynécologue">Gynécologue</option>
                          <option value="Neurologue">Neurologue</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {newRole === 'nurse' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">N° ADELI / RPPS</label>
                        <input
                          type="text"
                          required
                          placeholder="INF-72918"
                          value={rpps}
                          onChange={(e) => setRpps(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs placeholder-slate-700 focus:outline-none focus:border-emerald-500 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Service clinique</label>
                        <input
                          type="text"
                          required
                          placeholder="Urgences, Cardiologie..."
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs placeholder-slate-750 focus:outline-none focus:border-emerald-500 text-white"
                        />
                      </div>
                    </div>
                  )}

                  {newRole === 'radiology' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 uppercase font-bold">Licence Radiologie</label>
                          <input
                            type="text"
                            required
                            placeholder="RAD-920482"
                            value={rpps}
                            onChange={(e) => setRpps(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs placeholder-slate-700 focus:outline-none focus:border-emerald-500 text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 uppercase font-bold">Équipement Principal</label>
                          <input
                            type="text"
                            required
                            placeholder="IRM Siemens 3T, Scanner GE..."
                            value={primaryMachinery}
                            onChange={(e) => setPrimaryMachinery(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Centre d'Imagerie</label>
                        <input
                          type="text"
                          required
                          placeholder="Centre d'Imagerie Médicale Pasteur"
                          value={imagingCenter}
                          onChange={(e) => setImagingCenter(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-white"
                        />
                      </div>
                    </div>
                  )}

                  {newRole === 'reception' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Matricule Interne</label>
                        <input
                          type="text"
                          required
                          placeholder="MAT-ACC-839"
                          value={matricule}
                          onChange={(e) => setMatricule(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs placeholder-slate-700 focus:outline-none focus:border-emerald-500 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Affectation Bureau</label>
                        <input
                          type="text"
                          required
                          placeholder="Bureau Accueil Principal"
                          value={deskAssignment}
                          onChange={(e) => setDeskAssignment(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-white"
                        />
                      </div>
                    </div>
                  )}

                  {newRole === 'cashier' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Identifiant Caissier</label>
                        <input
                          type="text"
                          required
                          placeholder="MAT-CAI-901"
                          value={matricule}
                          onChange={(e) => setMatricule(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs placeholder-slate-700 focus:outline-none focus:border-emerald-500 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Code Point de Vente</label>
                        <input
                          type="text"
                          required
                          placeholder="PV-URGENCES-01"
                          value={posCode}
                          onChange={(e) => setPosCode(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-white"
                        />
                      </div>
                    </div>
                  )}

                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 font-bold text-xs text-white cursor-pointer shadow-lg shadow-emerald-700/10 transition-all flex items-center justify-center gap-1.5 border-0"
                >
                  <Plus className="h-4.5 w-4.5" />
                  Générer les Habilitations & Habiliter
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TRANSFER MODAL */}
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
                  <Hospital className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-extrabold text-base">Mutation Hospitalière</h3>
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
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Collaborateur</p>
                  <p className="text-xs font-bold text-slate-200">{selectedEmail}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nouvel Hôpital d'Affectation</label>
                  <input
                    type="text"
                    required
                    value={newHospitalName}
                    onChange={(e) => setNewHospitalName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 font-bold text-xs text-white cursor-pointer shadow-lg shadow-emerald-700/10 transition-all flex items-center justify-center gap-1.5 border-0"
                >
                  <Send className="h-4.5 w-4.5" />
                  Valider le Transfert
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success/Error Toast */}
      {showToast && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs animate-bounce ${
          toastType === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
          {toastMsg}
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
        &copy; {new Date().getFullYear()} Sunu Santé - Direction Hôpital.
      </footer>
    </div>
  );
}
