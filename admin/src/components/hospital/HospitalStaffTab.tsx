'use client';

import React from 'react';
import { 
  Plus, Search, Hospital, Send, Power, AlertCircle, 
  UserCheck, Shield, Users, Stethoscope, Activity, ShieldAlert
} from 'lucide-react';
import { LocalUserRecord } from '@/lib/authStore';

interface Props {
  staff: LocalUserRecord[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  onOpenCreateModal: () => void;
  onOpenTransferModal: (email: string, currentHospital: string) => void;
  onToggleSuspension: (email: string) => void;
}

export const HospitalStaffTab: React.FC<Props> = ({
  staff,
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  onOpenCreateModal,
  onOpenTransferModal,
  onToggleSuspension
}) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'doctor': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'nurse': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'radiology': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'reception': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cashier': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
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

  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalCount = staff.length;
  const doctorCount = staff.filter(s => s.role === 'doctor').length;
  const nurseCount = staff.filter(s => s.role === 'nurse').length;
  const suspendedCount = staff.filter(s => s.suspended).length;

  return (
    <div className="space-y-6">
      {/* Action Board (Add account) */}
      <section className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden text-white">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-[10px] bg-white/20 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Console d'Habilitation RH
            </span>
            <h2 className="text-2xl font-black mt-2">Gestion des Soignants & Personnel Hospitalier</h2>
            <p className="text-emerald-100/90 text-xs mt-1 leading-relaxed max-w-xl">
              Délivrez des habilitations certifiées, suspendez des comptes temporaires ou transférez les praticiens entre établissements en temps réel.
            </p>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="h-12 px-6 bg-white hover:bg-slate-100 text-emerald-900 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm flex-shrink-0 border-0"
          >
            <Plus className="h-5 w-5 text-emerald-700" />
            Créer un profil soignant
          </button>
        </div>
      </section>

      {/* Mini Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Effectif</h3>
            <p className="text-2xl font-black mt-1 text-slate-900">{totalCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Médecins</h3>
            <p className="text-2xl font-black text-emerald-700 mt-1">{doctorCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Stethoscope className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Infirmiers</h3>
            <p className="text-2xl font-black text-rose-700 mt-1">{nurseCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Comptes Suspendus</h3>
            <p className={`text-2xl font-black mt-1 ${suspendedCount > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{suspendedCount}</p>
          </div>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${suspendedCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'doctor', 'nurse', 'radiology', 'reception', 'cashier'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                roleFilter === role 
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm font-bold' 
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {role === 'all' ? 'Tous' : getRoleLabel(role)}
            </button>
          ))}
        </div>
      </section>

      {/* Staff Members Table */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] text-slate-500 font-extrabold uppercase tracking-wider bg-slate-50/80">
                <th className="p-5">Collaborateur</th>
                <th className="p-5">Rôle</th>
                <th className="p-5">Affectation</th>
                <th className="p-5">Spécifications</th>
                <th className="p-5 text-center">Statut</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((member) => (
                  <tr key={member.email} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-5">
                      <div>
                        <p className="font-bold text-slate-900">{member.name}</p>
                        <p className="text-[10px] text-slate-500">{member.email}</p>
                      </div>
                    </td>

                    <td className="p-5">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold border ${getRoleBadgeColor(member.role)}`}>
                        {getRoleLabel(member.role)}
                      </span>
                    </td>

                    <td className="p-5 font-medium text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Hospital className="h-3.5 w-3.5 text-slate-400" />
                        {member.details?.hospital || 'Non affecté'}
                      </div>
                    </td>

                    <td className="p-5 text-slate-600">
                      <div className="space-y-0.5">
                        {member.role === 'doctor' && (
                          <>
                            <p className="text-[10px]">RPPS: <strong className="text-slate-800">{member.details?.rpps || 'N/A'}</strong></p>
                            <p className="text-[10px]">Spé: <strong className="text-emerald-700">{member.details?.specialty || 'Généraliste'}</strong></p>
                          </>
                        )}
                        {member.role === 'nurse' && (
                          <>
                            <p className="text-[10px]">ADELI: <strong className="text-slate-800">{member.details?.rpps || 'N/A'}</strong></p>
                            <p className="text-[10px]">Service: <strong className="text-rose-700">{member.details?.department || 'Urgences'}</strong></p>
                          </>
                        )}
                        {member.role === 'radiology' && (
                          <>
                            <p className="text-[10px]">Licence: <strong className="text-slate-800">{member.details?.rpps || 'N/A'}</strong></p>
                            <p className="text-[10px]">Centre: <strong className="text-purple-700">{member.details?.imagingCenter || 'N/A'}</strong></p>
                          </>
                        )}
                        {member.role === 'reception' && (
                          <>
                            <p className="text-[10px]">Matricule: <strong className="text-slate-800">{member.details?.matricule || 'N/A'}</strong></p>
                            <p className="text-[10px]">Bureau: <strong className="text-blue-700">{member.details?.deskAssignment || 'N/A'}</strong></p>
                          </>
                        )}
                        {member.role === 'cashier' && (
                          <>
                            <p className="text-[10px]">Matricule: <strong className="text-slate-800">{member.details?.matricule || 'N/A'}</strong></p>
                            <p className="text-[10px]">Caisse: <strong className="text-amber-700">{member.details?.posCode || 'N/A'}</strong></p>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        member.suspended 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {member.suspended ? 'Suspendu' : 'Actif'}
                      </span>
                    </td>

                    <td className="p-5 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => onOpenTransferModal(member.email, member.details?.hospital)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 hover:text-slate-900 transition-all cursor-pointer text-[10px] font-bold flex items-center gap-1"
                        >
                          <Send className="h-3 w-3" />
                          Transférer
                        </button>
                        
                        <button
                          onClick={() => onToggleSuspension(member.email)}
                          className={`px-2.5 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer flex items-center gap-1 transition-all border ${
                            member.suspended 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white' 
                              : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-600 hover:text-white'
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
                    Aucun personnel soignant trouvé avec ces filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
