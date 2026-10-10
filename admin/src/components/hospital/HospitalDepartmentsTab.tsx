'use client';

import React, { useState } from 'react';
import { 
  Building2, BedDouble, Users, AlertCircle, Plus, 
  CheckCircle2, Clock, Activity, ArrowRight, Shield
} from 'lucide-react';
import { DepartmentInfo } from '@/types/hospital';

interface Props {
  departments: DepartmentInfo[];
  onUpdateBeds?: (deptId: string, occupied: number) => void;
}

export const HospitalDepartmentsTab: React.FC<Props> = ({ departments, onUpdateBeds }) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(departments[0]?.id || 'urgences');

  const selectedDept = departments.find(d => d.id === selectedDeptId) || departments[0];

  const totalBeds = departments.reduce((a, b) => a + b.totalBeds, 0);
  const totalOccupied = departments.reduce((a, b) => a + b.occupiedBeds, 0);
  const totalAvailable = totalBeds - totalOccupied;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div>
          <span className="text-[10px] bg-purple-50 text-purple-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-purple-200">
            Gestion Lits & Flux Hospitaliers
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">Capacité d'Accueil & Pôles Cliniques</h2>
          <p className="text-slate-600 text-xs mt-1 max-w-xl">
            Surveillance en temps réel des lits d'hospitalisation, des places de déchocage et des files d'attente par service.
          </p>
        </div>

        <div className="flex gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Total Lits</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{totalBeds}</p>
          </div>
          <div className="h-8 w-px bg-slate-200 self-center" />
          <div>
            <p className="text-[10px] text-emerald-700 font-bold uppercase">Disponibles</p>
            <p className="text-xl font-black text-emerald-700 mt-0.5">{totalAvailable}</p>
          </div>
          <div className="h-8 w-px bg-slate-200 self-center" />
          <div>
            <p className="text-[10px] text-amber-700 font-bold uppercase">Occupés</p>
            <p className="text-xl font-black text-amber-700 mt-0.5">{totalOccupied}</p>
          </div>
        </div>
      </section>

      {/* Grid of all departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const rate = Math.round((dept.occupiedBeds / dept.totalBeds) * 100);
          const isSelected = dept.id === selectedDeptId;

          return (
            <div
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-white border-2 border-emerald-600 shadow-md ring-2 ring-emerald-50' 
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] px-2.5 py-1 rounded-md font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {dept.code}
                </span>
                <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded uppercase ${
                  dept.status === 'saturation' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                  dept.status === 'tension' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {dept.status === 'saturation' ? 'Saturation' : dept.status === 'tension' ? 'Tension' : 'Optimal'}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-3">{dept.name}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Chef: {dept.headDoctor}</p>

              {/* Progress bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Occupation</span>
                  <span className={rate > 90 ? 'text-rose-600 font-bold' : rate > 75 ? 'text-amber-600 font-bold' : 'text-emerald-700 font-bold'}>
                    {dept.occupiedBeds} / {dept.totalBeds} ({rate}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      rate > 90 ? 'bg-rose-500' : rate > 75 ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-slate-700">
                  <Users className="h-3 w-3 text-blue-600" /> {dept.activeStaffCount} en service
                </span>
                <span className="flex items-center gap-1 text-slate-700">
                  <Clock className="h-3 w-3 text-amber-600" /> {dept.waitingQueueCount} en attente
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail card of selected department */}
      {selectedDept && (
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                Focus Service Sélectionné
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">{selectedDept.name}</h3>
              <p className="text-xs text-slate-500">Responsable médical : {selectedDept.headDoctor}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newOcc = Math.min(selectedDept.totalBeds, selectedDept.occupiedBeds + 1);
                  if (onUpdateBeds) onUpdateBeds(selectedDept.id, newOcc);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer transition-all"
              >
                + Admettre un patient (Occuper 1 lit)
              </button>
              <button
                onClick={() => {
                  const newOcc = Math.max(0, selectedDept.occupiedBeds - 1);
                  if (onUpdateBeds) onUpdateBeds(selectedDept.id, newOcc);
                }}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 cursor-pointer transition-all"
              >
                - Décharge / Sortie (Libérer 1 lit)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Capacité Actuelle</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{selectedDept.occupiedBeds} / {selectedDept.totalBeds}</p>
              <p className="text-xs text-slate-500 mt-1">Disponibles : <strong className="text-emerald-700">{selectedDept.totalBeds - selectedDept.occupiedBeds} lits</strong></p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Équipe Médicale en Poste</p>
              <p className="text-2xl font-black text-blue-700 mt-1">{selectedDept.activeStaffCount}</p>
              <p className="text-xs text-slate-500 mt-1">Médecins, infirmiers et aides-soignants</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">File d'Attente / Salle de Tri</p>
              <p className="text-2xl font-black text-amber-700 mt-1">{selectedDept.waitingQueueCount}</p>
              <p className="text-xs text-slate-500 mt-1">Patients enregistrés en attente de prise en charge</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
