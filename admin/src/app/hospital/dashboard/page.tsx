'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore, LocalUserRecord, UserSession } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Stethoscope, Activity, BedDouble, 
  Clock, FileText, Building2, LogOut, Plus, X, 
  CheckCircle, AlertCircle, Send, Sparkles, ChevronRight
} from 'lucide-react';

import { 
  INITIAL_DEPARTMENTS, 
  INITIAL_ALERTS, 
  INITIAL_ATTENDANCE, 
  MONTHLY_REPORTS 
} from '@/lib/hospitalData';
import { AttendanceRecord, DepartmentInfo, HospitalAlert, MonthlyReportMetric } from '@/types/hospital';

import { HospitalOverviewTab } from '@/components/hospital/HospitalOverviewTab';
import { HospitalAttendanceTab } from '@/components/hospital/HospitalAttendanceTab';
import { HospitalReportsTab } from '@/components/hospital/HospitalReportsTab';
import { HospitalDepartmentsTab } from '@/components/hospital/HospitalDepartmentsTab';
import { HospitalStaffTab } from '@/components/hospital/HospitalStaffTab';
import { HospitalBadgeModal } from '@/components/hospital/HospitalBadgeModal';
import { HospitalSpecialtiesTab } from '@/components/hospital/HospitalSpecialtiesTab';

type ActiveTab = 'overview' | 'attendance' | 'reports' | 'departments' | 'specialties' | 'staff';

export default function AdminHospitalDashboard() {
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

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Master Data States
  const [staff, setStaff] = useState<LocalUserRecord[]>([]);
  const [departments, setDepartments] = useState<DepartmentInfo[]>(INITIAL_DEPARTMENTS);
  const [alerts, setAlerts] = useState<HospitalAlert[]>(INITIAL_ALERTS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [reports, setReports] = useState<MonthlyReportMetric[]>(MONTHLY_REPORTS);

  // Filter & Search states for Staff Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Modals
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
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
  const [specialty, setSpecialty] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [department, setDepartment] = useState('');
  const [imagingCenter, setImagingCenter] = useState('Centre Radiologique Central');
  const [primaryMachinery, setPrimaryMachinery] = useState('IRM Siemens 3T');
  const [matricule, setMatricule] = useState('');
  const [deskAssignment, setDeskAssignment] = useState('Bureau A-101');
  const [posCode, setPosCode] = useState('CAISSE-01');

  // Facilities (hospitals) loaded from API
  const [facilities, setFacilities] = useState<any[]>([]);

  // Notification Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    initialize();
    // Load facilities for the selects
    getFacilities().then(data => {
      const hospitalFacilities = data.filter((f: any) => f.type !== 'pharmacie');
      setFacilities(hospitalFacilities);
      if (hospitalFacilities.length > 0) {
        setHospitalName(hospitalFacilities[0].name);
        setNewHospitalName(hospitalFacilities[0].name);
      }
    });
  }, []);

  useEffect(() => {
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

  const handleAddDepartment = (dept: DepartmentInfo) => {
    setDepartments(prev => [...prev, dept]);
    // Auto-select first department/specialty for new accounts if empty
    if (!department) setDepartment(dept.name);
    if (!specialty) setSpecialty(dept.name);
  };

  const loadStaff = async () => {
    try {
      const data = await getUsersByRoles(['doctor', 'nurse', 'radiology', 'reception', 'cashier']);
      if (data && data.length > 0) {
        setStaff(data);
      } else {
        // Fallback default mock staff if database empty
        setStaff([
          {
            email: 'dr.diop@sunusante.sn',
            name: 'Dr. Cheikh Anta Diop',
            role: 'doctor',
            passwordHash: '***',
            details: { hospital: 'Hôpital Principal de Dakar', rpps: 'MED-77490', specialty: 'Urgences & Réanimation' }
          },
          {
            email: 'dr.kane@sunusante.sn',
            name: 'Dr. Ousmane Kane',
            role: 'doctor',
            passwordHash: '***',
            details: { hospital: 'Hôpital Principal de Dakar', rpps: 'MED-88120', specialty: 'Cardiologie' }
          },
          {
            email: 'a.fall@sunusante.sn',
            name: 'Aminata Fall',
            role: 'nurse',
            passwordHash: '***',
            details: { hospital: 'Hôpital Principal de Dakar', rpps: 'INF-11204', department: 'Réanimation' }
          },
          {
            email: 'dr.diallo@sunusante.sn',
            name: 'Dr. Abdoulaye Diallo',
            role: 'radiology',
            passwordHash: '***',
            details: { hospital: 'Hôpital Principal de Dakar', rpps: 'RAD-9930', imagingCenter: 'Centre Radiologique Central' }
          },
          {
            email: 'm.seck@sunusante.sn',
            name: 'Mamadou Seck',
            role: 'reception',
            passwordHash: '***',
            details: { hospital: 'Hôpital Principal de Dakar', matricule: 'ACC-201', deskAssignment: 'Accueil Central' }
          },
          {
            email: 'k.sarr@sunusante.sn',
            name: 'Khadija Sarr',
            role: 'cashier',
            passwordHash: '***',
            details: { hospital: 'Hôpital Principal de Dakar', matricule: 'CAIS-01', posCode: 'CAISSE-01' }
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3200);
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

    if (newRole === 'doctor') {
      details.rpps = rpps || 'MED-NEW';
      details.specialty = specialty;
    } else if (newRole === 'nurse') {
      details.rpps = rpps || 'INF-NEW';
      details.department = department;
    } else if (newRole === 'radiology') {
      details.rpps = rpps || 'RAD-NEW';
      details.imagingCenter = imagingCenter;
      details.primaryMachinery = primaryMachinery;
    } else if (newRole === 'reception') {
      details.matricule = matricule || 'ACC-NEW';
      details.deskAssignment = deskAssignment;
    } else if (newRole === 'cashier') {
      details.matricule = matricule || 'CAIS-NEW';
      details.posCode = posCode;
    }

    const success = await createStaffAccount(newEmail, newPassword, newRole, fullName, details);
    if (success) {
      triggerToast(`Compte créé avec succès pour ${fullName}.`);
      setCreateModalOpen(false);
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

  // Live Attendance Punch handler
  const handleRecordPunch = (punch: Partial<AttendanceRecord>) => {
    const existingIndex = attendance.findIndex(a => a.employeeEmail === punch.employeeEmail);
    if (existingIndex >= 0) {
      const updated = [...attendance];
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...punch,
        status: punch.status || updated[existingIndex].status
      };
      setAttendance(updated);
    } else {
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        employeeEmail: punch.employeeEmail || 'inconnu@sunusante.sn',
        employeeName: punch.employeeName || 'Collaborateur',
        role: punch.role || 'nurse',
        department: punch.department || 'Urgences',
        date: punch.date || new Date().toISOString().split('T')[0],
        checkIn: punch.checkIn,
        checkOut: punch.checkOut,
        status: punch.status || 'present',
        durationMinutes: 480,
        overtimeMinutes: 0,
        lateMinutes: 0,
        punchMethod: punch.punchMethod || 'badge_rfid',
        notes: punch.notes
      };
      setAttendance([newRecord, ...attendance]);
    }
    triggerToast(`Pointage enregistré pour ${punch.employeeName || 'le collaborateur'}.`);
  };

  // Regularize attendance record
  const handleRegularize = (recordId: string, updated: Partial<AttendanceRecord>) => {
    setAttendance(attendance.map(a => a.id === recordId ? { ...a, ...updated } : a));
    triggerToast("Pointage régularisé par la Direction.");
  };

  // Update Bed occupancy
  const handleUpdateBeds = (deptId: string, occupied: number) => {
    setDepartments(departments.map(d => {
      if (d.id === deptId) {
        const rate = (occupied / d.totalBeds) * 100;
        const status = rate >= 95 ? 'saturation' : rate >= 75 ? 'tension' : 'optimal';
        return { ...d, occupiedBeds: occupied, status };
      }
      return d;
    }));
    triggerToast("Capacité du service mise à jour.");
  };

  const activeUser = user || {
    name: "Dr. Babacar Guèye",
    email: "direction@sunusante.sn",
    role: "admin_hospital"
  };

  const presentCount = attendance.filter(a => a.status === 'present' || a.status === 'on_duty').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between overflow-x-hidden font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border backdrop-blur-md ${
              toastType === 'success' 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}
          >
            {toastType === 'success' ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-rose-600" />}
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Top Header - Light Mode First */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-sm font-black text-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                Direction Hospitalière
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Poste de Commandement
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Hôpital Principal de Dakar · Health AI</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Badge Shortcut */}
          <button
            onClick={() => setBadgeModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
          >
            <Clock className="h-3.5 w-3.5 text-emerald-600" />
            <span>Badgeuse Direct</span>
          </button>

          {/* User pill */}
          <div className="text-xs px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-bold flex items-center gap-2 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate max-w-[140px]">{activeUser.name}</span>
          </div>

          {/* Logout */}
          <button 
            onClick={handleLogoutClick}
            className="text-xs text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent border-0 p-1"
            title="Déconnexion"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Quitter</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs Bar - Light Mode First */}
      <nav className="bg-white/90 border-b border-slate-200 px-4 sm:px-8 py-2 sticky top-[57px] z-30 backdrop-blur-md overflow-x-auto shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border-0 ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <Building2 className="h-4 w-4" />
            Vue d'Ensemble & Régulation
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border-0 ${
              activeTab === 'attendance'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <Clock className="h-4 w-4" />
            Système de Pointage & Horaires
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'attendance' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {presentCount} en poste
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border-0 ${
              activeTab === 'reports'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            Rapports Mensuels & Audit
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'reports' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
            }`}>
              Oct 2026
            </span>
          </button>

          <button
            onClick={() => setActiveTab('departments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border-0 ${
              activeTab === 'departments'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <BedDouble className="h-4 w-4" />
            Capacités & Lits
          </button>

          <button
            onClick={() => setActiveTab('specialties')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border-0 ${
              activeTab === 'specialties'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <Stethoscope className="h-4 w-4" />
            Spécialités & Planning
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border-0 ${
              activeTab === 'staff'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <Users className="h-4 w-4" />
            Personnel & Habilitations
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'staff' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {staff.length}
            </span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-4 sm:px-8 py-6">
        {activeTab === 'overview' && (
          <HospitalOverviewTab
            departments={departments}
            alerts={alerts}
            attendance={attendance}
            staffCount={staff.length}
            onNavigateTab={setActiveTab}
            onOpenBadge={() => setBadgeModalOpen(true)}
            onOpenCreateStaff={() => setCreateModalOpen(true)}
          />
        )}

        {activeTab === 'attendance' && (
          <HospitalAttendanceTab
            attendanceList={attendance}
            onOpenBadgeModal={() => setBadgeModalOpen(true)}
            onRegularize={handleRegularize}
          />
        )}

        {activeTab === 'reports' && (
          <HospitalReportsTab
            reports={reports}
            currentHospitalName="Hôpital Principal de Dakar - Health AI"
          />
        )}

        {activeTab === 'departments' && (
          <HospitalDepartmentsTab
            departments={departments}
            onUpdateBeds={handleUpdateBeds}
            onAddDepartment={handleAddDepartment}
          />
        )}

        {activeTab === 'specialties' && (
          <HospitalSpecialtiesTab
            hospitalName={user?.details?.hospital || "Hôpital Principal de Dakar"}
          />
        )}

        {activeTab === 'staff' && (
          <HospitalStaffTab
            staff={staff}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            onOpenCreateModal={() => setCreateModalOpen(true)}
            onOpenTransferModal={handleOpenTransfer}
            onToggleSuspension={handleToggleSuspension}
          />
        )}
      </main>

      {/* Interactive Badge Modal */}
      <HospitalBadgeModal
        isOpen={badgeModalOpen}
        onClose={() => setBadgeModalOpen(false)}
        onPunch={handleRecordPunch}
      />

      {/* CREATE ACCOUNT MODAL - Light Mode First */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 text-slate-900 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Habilitation d'un Nouveau Soignant</h3>
                    <p className="text-[10px] text-slate-500">Formulaire d'enregistrement certifié Health AI</p>
                  </div>
                </div>
                <button 
                  onClick={() => setCreateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer bg-transparent border-0 p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAccountSubmit} className="space-y-4">
                {/* Role selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Rôle Hospitalier</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserSession['role'])}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 cursor-pointer font-medium"
                  >
                    <option value="doctor">Médecin / Spécialiste</option>
                    <option value="nurse">Infirmier / Soins Cliniques</option>
                    <option value="radiology">Radiologue & Imagerie</option>
                    <option value="reception">Agent d'Accueil & Réception</option>
                    <option value="cashier">Caissier & Facturation</option>
                  </select>
                </div>

                {/* Identity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Prénom</label>
                    <input
                      type="text"
                      required
                      placeholder="Mamadou"
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Nom</label>
                    <input
                      type="text"
                      required
                      placeholder="Sow"
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                {/* Email and phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Adresse Email</label>
                    <input
                      type="email"
                      required
                      placeholder="m.sow@sunusante.sn"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Téléphone</label>
                    <input
                      type="tel"
                      placeholder="+221 77 483 92 10"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                {/* Password selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Mot de passe temporaire</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Établissement d'Affectation <span className="text-rose-500">*</span>
                  </label>
                  {facilities.length > 0 ? (
                    <select
                      required
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 font-medium cursor-pointer"
                    >
                      {facilities.map((f: any) => (
                        <option key={f.id} value={f.name}>{f.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      placeholder="Hôpital Principal de Dakar"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 font-medium"
                    />
                  )}
                </div>

                {/* DYNAMIC ROLE FIELDS */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Spécificités du Rôle</p>
                  
                  {newRole === 'doctor' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">CNOM / RPPS</label>
                        <input
                          type="text"
                          placeholder="MED-77294"
                          value={rpps}
                          onChange={(e) => setRpps(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Spécialité / Service <span className="text-rose-500">*</span></label>
                        {departments.length > 0 ? (
                          <select
                            required
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 cursor-pointer"
                          >
                            <option value="">-- Choisir un service --</option>
                            {departments.map(d => (
                              <option key={d.id} value={d.name}>{d.name}</option>
                            ))}
                            <option value="Médecine Générale">Médecine Générale</option>
                            <option value="Généraliste">Généraliste</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder="Cardiologie, Urgences..."
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {newRole === 'nurse' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Numéro ADELI</label>
                        <input
                          type="text"
                          placeholder="INF-44829"
                          value={rpps}
                          onChange={(e) => setRpps(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Service d'affectation <span className="text-rose-500">*</span></label>
                        {departments.length > 0 ? (
                          <select
                            required
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 cursor-pointer"
                          >
                            <option value="">-- Choisir un service --</option>
                            {departments.map(d => (
                              <option key={d.id} value={d.name}>{d.name}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder="Urgences, Soins Intensifs..."
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {newRole === 'radiology' && (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Licence Manipulateur / Praticien</label>
                        <input
                          type="text"
                          placeholder="RAD-99124"
                          value={rpps}
                          onChange={(e) => setRpps(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 uppercase font-bold">Centre Radiologique</label>
                          <input
                            type="text"
                            placeholder="Centre Radiologique Central"
                            value={imagingCenter}
                            onChange={(e) => setImagingCenter(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 uppercase font-bold">Machine assignée</label>
                          <input
                            type="text"
                            placeholder="IRM Siemens 3T"
                            value={primaryMachinery}
                            onChange={(e) => setPrimaryMachinery(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {(newRole === 'reception' || newRole === 'cashier') && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Matricule Interne</label>
                        <input
                          type="text"
                          placeholder="MAT-4029"
                          value={matricule}
                          onChange={(e) => setMatricule(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">
                          {newRole === 'reception' ? 'Bureau / Guichet' : 'Code Caisse POS'}
                        </label>
                        <input
                          type="text"
                          value={newRole === 'reception' ? deskAssignment : posCode}
                          onChange={(e) => newRole === 'reception' ? setDeskAssignment(e.target.value) : setPosCode(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 bg-transparent hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer border-0"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm border-0 flex items-center gap-1.5"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Créer le profil
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TRANSFER MODAL - Light Mode First */}
      <AnimatePresence>
        {transferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-slate-900"
            >
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                    <Send className="h-4 w-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">Transfert d'Établissement</h3>
                </div>
                <button 
                  onClick={() => setTransferModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer bg-transparent border-0 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleTransferSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Nouvel Établissement <span className="text-rose-500">*</span></label>
                  {facilities.length > 0 ? (
                    <select
                      required
                      value={newHospitalName}
                      onChange={(e) => setNewHospitalName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
                    >
                      {facilities.map((f: any) => (
                        <option key={f.id} value={f.name}>{f.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="Ex: Hôpital Aristide Le Dantec..."
                      value={newHospitalName}
                      onChange={(e) => setNewHospitalName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setTransferModalOpen(false)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer bg-transparent border-0"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0 shadow-sm"
                  >
                    Confirmer le Transfert
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-4 sm:px-8 py-4 bg-white text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>© 2026 Health AI · Direction Hospitalière & Gouvernance Médicale Numérique · République du Sénégal</p>
        <p className="flex items-center gap-2 text-slate-600 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Système HDS & RGPD / CDP Conforme · Version Pro 3.4
        </p>
      </footer>
    </div>
  );
}
