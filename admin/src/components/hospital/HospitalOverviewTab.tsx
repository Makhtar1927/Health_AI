'use client';

import React from 'react';
import { 
  Building2, Users, Stethoscope, Activity, BedDouble, 
  AlertTriangle, Clock, TrendingUp, CheckCircle2, ShieldAlert,
  ArrowUpRight, HeartPulse, Sparkles, ChevronRight, FileText
} from 'lucide-react';
import { DepartmentInfo, HospitalAlert, AttendanceRecord } from '@/types/hospital';

interface Props {
  departments: DepartmentInfo[];
  alerts: HospitalAlert[];
  attendance: AttendanceRecord[];
  staffCount: number;
  onNavigateTab: (tab: 'overview' | 'staff' | 'attendance' | 'reports' | 'departments') => void;
  onOpenBadge: () => void;
  onOpenCreateStaff: () => void;
}

export const HospitalOverviewTab: React.FC<Props> = ({
  departments,
  alerts,
  attendance,
  staffCount,
  onNavigateTab,
  onOpenBadge,
  onOpenCreateStaff
}) => {
  // Aggregate bed capacity
  const totalBeds = departments.reduce((acc, d) => acc + d.totalBeds, 0);
  const occupiedBeds = departments.reduce((acc, d) => acc + d.occupiedBeds, 0);
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  const activeStaffNow = attendance.filter(a => a.status === 'present' || a.status === 'on_duty').length;
  const criticalAlertsCount = alerts.filter(a => a.level === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome / Executive Hospital Control Banner */}
      <section className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 border border-emerald-700 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden text-white">
        <div className="absolute right-0 top-0 bottom-0 opacity-15 pointer-events-none flex items-center pr-8">
          <Building2 className="h-64 w-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-white/20 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-white/30 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-ping" />
                Poste de Commandement Centralisé
              </span>
              <span className="text-xs text-emerald-100 font-medium">Hôpital Principal de Dakar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
              Direction Administrative & Régulation Clinique
            </h2>
            <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Supervision unifiée en temps réel : capacité des lits hospitaliers, flux des urgences, pointage soignant certifié et audit mensuel des activités.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={onOpenBadge}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-emerald-900 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer border-0"
            >
              <Clock className="h-4 w-4 text-emerald-700" />
              Borne Badgeuse
            </button>
            <button
              onClick={onOpenCreateStaff}
              className="px-4 py-2.5 bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <Users className="h-4 w-4 text-emerald-200" />
              Nouveau Soignant
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-4 py-2.5 bg-teal-900/60 hover:bg-teal-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <FileText className="h-4 w-4 text-teal-200" />
              Rapport Mensuel
            </button>
          </div>
        </div>
      </section>

      {/* Main KPI Pulse Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Lits */}
        <div 
          onClick={() => onNavigateTab('departments')}
          className="bg-white hover:bg-slate-50/80 border border-slate-200 shadow-sm hover:shadow-md p-5 rounded-2xl transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Capacité Lits</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
              <BedDouble className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{occupancyRate}%</span>
            <span className="text-xs text-slate-500 font-semibold">({occupiedBeds}/{totalBeds} lits)</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${occupancyRate > 90 ? 'bg-rose-500' : occupancyRate > 75 ? 'bg-amber-500' : 'bg-emerald-600'}`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Soignants actifs en poste */}
        <div 
          onClick={() => onNavigateTab('attendance')}
          className="bg-white hover:bg-slate-50/80 border border-slate-200 shadow-sm hover:shadow-md p-5 rounded-2xl transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Effectif en Poste</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{activeStaffNow}</span>
            <span className="text-xs text-blue-700 font-semibold">/ {staffCount} collaborateurs</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1 font-medium">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Pointages conformes aujourd'hui
          </p>
        </div>

        {/* Urgences en cours */}
        <div 
          onClick={() => onNavigateTab('departments')}
          className="bg-white hover:bg-slate-50/80 border border-slate-200 shadow-sm hover:shadow-md p-5 rounded-2xl transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">File Urgences</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform">
              <HeartPulse className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600">8</span>
            <span className="text-xs text-slate-500 font-semibold">en attente de tri</span>
          </div>
          <p className="text-[10px] text-amber-700 mt-2 flex items-center gap-1 font-medium">
            <Clock className="h-3 w-3 text-amber-600" /> Délai moyen : 28 minutes
          </p>
        </div>

        {/* Facturation / Caisse */}
        <div 
          onClick={() => onNavigateTab('reports')}
          className="bg-white hover:bg-slate-50/80 border border-slate-200 shadow-sm hover:shadow-md p-5 rounded-2xl transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Recouvrement M-en-cours</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:scale-105 transition-transform">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-700">97.0%</span>
            <span className="text-xs text-slate-500 font-semibold">taux IPM / Caisses</span>
          </div>
          <p className="text-[10px] text-teal-700 mt-2 flex items-center gap-1 font-medium">
            <Sparkles className="h-3 w-3 text-teal-600" /> 184.5M FCFA télé-transmis
          </p>
        </div>
      </section>

      {/* Grid: Alerts & Department Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Department Occupancy Snapshot */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">État des Services & Pôles Hospitaliers</h3>
              <p className="text-xs text-slate-500">Capacités d'accueil en temps réel</p>
            </div>
            <button
              onClick={() => onNavigateTab('departments')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer bg-transparent border-0"
            >
              Voir tous les détails <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {departments.slice(0, 4).map((dept) => {
              const deptRate = Math.round((dept.occupiedBeds / dept.totalBeds) * 100);
              return (
                <div key={dept.id} className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{dept.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-white text-slate-600 border border-slate-200">
                        {dept.code}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Chef de pôle : {dept.headDoctor}</p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">{dept.occupiedBeds} / {dept.totalBeds} lits</p>
                      <p className="text-[10px] text-slate-500">{dept.activeStaffCount} soignants en poste</p>
                    </div>

                    <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${deptRate > 90 ? 'bg-rose-500' : deptRate > 75 ? 'bg-amber-500' : 'bg-emerald-600'}`}
                        style={{ width: `${deptRate}%` }}
                      />
                    </div>

                    <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded uppercase ${
                      dept.status === 'saturation' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      dept.status === 'tension' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {dept.status === 'saturation' ? 'Saturé' : dept.status === 'tension' ? 'Tension' : 'Optimal'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Direction Alerts & Regulatory Notifications */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              <h3 className="text-base font-extrabold text-slate-900">Alertes de Direction</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
              {alerts.length} actives
            </span>
          </div>

          <div className="space-y-3">
            {alerts.map((alt) => (
              <div 
                key={alt.id}
                className={`p-3.5 rounded-2xl border ${
                  alt.level === 'critical' ? 'bg-rose-50/70 border-rose-200 text-rose-950' :
                  alt.level === 'warning' ? 'bg-amber-50/70 border-amber-200 text-amber-950' :
                  'bg-blue-50/70 border-blue-200 text-blue-950'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                    alt.level === 'critical' ? 'bg-rose-100 text-rose-800' :
                    alt.level === 'warning' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alt.department}
                  </span>
                  <span className="text-[10px] text-slate-500">{alt.timestamp}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-2">{alt.title}</h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{alt.description}</p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('attendance')}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Clock className="h-3.5 w-3.5 text-emerald-600" />
              Consulter le registre de pointage
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
