'use client';

import React, { useState } from 'react';
import { 
  Clock, UserCheck, AlertTriangle, Coffee, Moon, CheckCircle2, 
  Search, Filter, Plus, FileDown, Check, X, ShieldAlert, Sparkles, UserX,
  CreditCard, QrCode
} from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, StaffRole } from '@/types/hospital';

interface Props {
  attendanceList: AttendanceRecord[];
  onOpenBadgeModal: () => void;
  onRegularize: (recordId: string, updated: Partial<AttendanceRecord>) => void;
}

export const HospitalAttendanceTab: React.FC<Props> = ({ 
  attendanceList, 
  onOpenBadgeModal,
  onRegularize 
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const filtered = attendanceList.filter((item) => {
    const matchesSearch = item.employeeName.toLowerCase().includes(search.toLowerCase()) ||
                          item.employeeEmail.toLowerCase().includes(search.toLowerCase()) ||
                          item.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesRole = roleFilter === 'all' || item.role === roleFilter;
    const matchesDept = selectedDept === 'all' || item.department === selectedDept;
    return matchesSearch && matchesStatus && matchesRole && matchesDept;
  });

  // Calculate live metrics
  const totalEmployees = attendanceList.length;
  const presentCount = attendanceList.filter(a => a.status === 'present').length;
  const lateCount = attendanceList.filter(a => a.status === 'late' || a.lateMinutes > 0).length;
  const breakCount = attendanceList.filter(a => a.status === 'break').length;
  const onDutyCount = attendanceList.filter(a => a.status === 'on_duty').length;
  const absentCount = attendanceList.filter(a => a.status === 'absent').length;

  const presenceRate = totalEmployees > 0 
    ? Math.round(((presentCount + onDutyCount + breakCount) / totalEmployees) * 100) 
    : 100;

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            En Service
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="h-3 w-3 text-amber-600" />
            En Retard
          </span>
        );
      case 'break':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Coffee className="h-3 w-3 text-blue-600" />
            En Pause
          </span>
        );
      case 'on_duty':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Moon className="h-3 w-3 text-purple-600" />
            Garde de Nuit
          </span>
        );
      case 'absent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <UserX className="h-3 w-3 text-rose-600" />
            Absent
          </span>
        );
      case 'leave':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Congé
          </span>
        );
    }
  };

  const getMethodBadge = (method: AttendanceRecord['punchMethod']) => {
    switch (method) {
      case 'badge_rfid':
        return <span className="text-[10px] text-slate-600 font-medium flex items-center gap-1"><CreditCard className="h-3 w-3 text-cyan-600" /> RFID</span>;
      case 'qr_code':
        return <span className="text-[10px] text-slate-600 font-medium flex items-center gap-1"><QrCode className="h-3 w-3 text-emerald-600" /> QR Code</span>;
      case 'biometric':
        return <span className="text-[10px] text-slate-600 font-medium flex items-center gap-1"><Sparkles className="h-3 w-3 text-purple-600" /> Empreinte</span>;
      default:
        return <span className="text-[10px] text-slate-400">Manuel</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Fast Badge CTA */}
      <section className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 border border-emerald-700 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-white/20 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-white/30">
                Horodatage Certifié Health AI
              </span>
              <span className="text-xs text-emerald-100">Date du jour : {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-2">Système de Pointage & Gestion du Temps Hospitalier</h2>
            <p className="text-emerald-100/90 text-xs mt-1 max-w-2xl leading-relaxed">
              Surveillance continue des présences soignantes, relèves de garde, retards et heures supplémentaires. Conforme au Code du Travail et à la convention médicale sénégalaise.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOpenBadgeModal}
              className="px-5 py-3 bg-white hover:bg-slate-100 text-emerald-900 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer border-0"
            >
              <Clock className="h-4 w-4 text-emerald-700" />
              Borne de Pointage / Badgeuse
            </button>
            <button
              onClick={() => alert("Génération de la feuille d'émargement officielle du jour (PDF)")}
              className="px-4 py-3 bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <FileDown className="h-4 w-4 text-emerald-200" />
              Émargement Quotidien
            </button>
          </div>
        </div>
      </section>

      {/* Real-time Attendance Stats Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Taux Présence</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600">{presenceRate}%</span>
            <span className="text-[10px] text-slate-400">Aujourd'hui</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">En Poste</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{presentCount}</span>
            <span className="text-[10px] text-emerald-600 font-bold">Actifs</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Garde de Nuit</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-purple-600">{onDutyCount}</span>
            <span className="text-[10px] text-purple-600 font-bold">Astreinte</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">En Pause</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-600">{breakCount}</span>
            <span className="text-[10px] text-slate-400">Repas</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Retards</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600">{lateCount}</span>
            <span className="text-[10px] text-amber-600 font-bold">À justifier</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Absences</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-600">{absentCount}</span>
            <span className="text-[10px] text-rose-600 font-bold">Remplacés</span>
          </div>
        </div>
      </section>

      {/* Filters and Search Bar */}
      <section className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher soignant, département..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Status filters */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {['all', 'present', 'late', 'break', 'on_duty', 'absent'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer border-0 ${
                  statusFilter === st 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                {st === 'all' ? 'Tous' : st === 'present' ? 'En service' : st === 'late' ? 'Retard' : st === 'break' ? 'Pause' : st === 'on_duty' ? 'Garde' : 'Absent'}
              </button>
            ))}
          </div>

          {/* Department selector */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer font-medium"
          >
            <option value="all">Tous les services</option>
            <option value="Urgences">Urgences</option>
            <option value="Réanimation">Réanimation</option>
            <option value="Cardiologie">Cardiologie</option>
            <option value="Radiologie">Radiologie</option>
            <option value="Accueil & Admissions">Accueil</option>
            <option value="Caisse Centrale">Caisse</option>
          </select>
        </div>
      </section>

      {/* Attendance Punch Table */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] text-slate-500 font-extrabold uppercase tracking-wider bg-slate-50/80">
                <th className="p-4 sm:p-5">Collaborateur</th>
                <th className="p-4 sm:p-5">Service / Pôle</th>
                <th className="p-4 sm:p-5">Pointage Entrée</th>
                <th className="p-4 sm:p-5">Pointage Sortie</th>
                <th className="p-4 sm:p-5">Retard / Pause</th>
                <th className="p-4 sm:p-5">Heures Prestées</th>
                <th className="p-4 sm:p-5">Mode</th>
                <th className="p-4 sm:p-5 text-center">Statut</th>
                <th className="p-4 sm:p-5 text-right">Régularisation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.length > 0 ? (
                filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Collaborator */}
                    <td className="p-4 sm:p-5">
                      <div>
                        <p className="font-bold text-slate-900">{record.employeeName}</p>
                        <p className="text-[10px] text-slate-500">{record.employeeEmail}</p>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="p-4 sm:p-5 font-semibold text-slate-700">
                      {record.department}
                    </td>

                    {/* Check In */}
                    <td className="p-4 sm:p-5">
                      {record.checkIn ? (
                        <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                          <Clock className="h-3.5 w-3.5 text-emerald-600" />
                          <span>{record.checkIn}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Non pointé</span>
                      )}
                    </td>

                    {/* Check Out */}
                    <td className="p-4 sm:p-5">
                      {record.checkOut ? (
                        <div className="flex items-center gap-1.5 font-bold text-slate-700">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>{record.checkOut}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">En cours...</span>
                      )}
                    </td>

                    {/* Lateness / Pause */}
                    <td className="p-4 sm:p-5">
                      {record.lateMinutes > 0 ? (
                        <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-amber-600" />
                          +{record.lateMinutes} min
                        </span>
                      ) : record.breakStart ? (
                        <span className="text-[11px] font-semibold text-blue-700">
                          Pause ({record.breakStart} - {record.breakEnd || '...'})
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-semibold">À l'heure (0m)</span>
                      )}
                    </td>

                    {/* Worked time & Overtime */}
                    <td className="p-4 sm:p-5">
                      <div>
                        <p className="font-bold text-slate-900">
                          {Math.floor(record.durationMinutes / 60)}h {record.durationMinutes % 60}m
                        </p>
                        {record.overtimeMinutes > 0 && (
                          <p className="text-[10px] font-bold text-emerald-700">
                            +{Math.floor(record.overtimeMinutes / 60)}h{record.overtimeMinutes % 60 > 0 ? `${record.overtimeMinutes % 60}m` : ''} supp.
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Punch Method */}
                    <td className="p-4 sm:p-5">
                      {getMethodBadge(record.punchMethod)}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 sm:p-5 text-center">
                      {getStatusBadge(record.status)}
                    </td>

                    {/* Actions */}
                    <td className="p-4 sm:p-5 text-right">
                      {record.status === 'late' || record.status === 'absent' ? (
                        <button
                          onClick={() => {
                            const reason = prompt("Justificatif / Note de régularisation (ex: Garde prolongée, panne transport, certificat) :");
                            if (reason) {
                              onRegularize(record.id, { 
                                status: 'present', 
                                notes: `Régularisé par la Direction: ${reason}`,
                                lateMinutes: 0
                              });
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 border border-emerald-200 text-emerald-700 hover:text-white text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Régulariser
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-medium flex items-center justify-end gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Conforme
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    Aucun collaborateur correspondant aux filtres de pointage.
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
