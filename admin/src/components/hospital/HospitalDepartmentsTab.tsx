'use client';

import React, { useState } from 'react';
import { 
  Building2, BedDouble, Users, AlertCircle, Plus, 
  CheckCircle2, Clock, Activity, ArrowRight, Shield
} from 'lucide-react';
import { DepartmentInfo } from '@/types/hospital';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  departments: DepartmentInfo[];
  onUpdateBeds?: (deptId: string, occupied: number) => void;
  onAddDepartment?: (dept: DepartmentInfo) => void;
}

export const HospitalDepartmentsTab: React.FC<Props> = ({ departments, onUpdateBeds, onAddDepartment }) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(departments[0]?.id || 'urgences');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [headDoctor, setHeadDoctor] = useState('');
  const [totalBedsInput, setTotalBedsInput] = useState(20);

  const selectedDept = departments.find(d => d.id === selectedDeptId) || departments[0];

  const totalBeds = departments.reduce((a, b) => a + b.totalBeds, 0);
  const totalOccupied = departments.reduce((a, b) => a + b.occupiedBeds, 0);
  const totalAvailable = totalBeds - totalOccupied;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) return;

    const id = deptName.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, '_');

    const newDept: DepartmentInfo = {
      id: `${id}_${Date.now().toString().slice(-4)}`,
      name: deptName.trim(),
      code: deptCode.trim().toUpperCase() || deptName.slice(0, 4).toUpperCase(),
      headDoctor: headDoctor.trim() || 'Dr. Chef de Service',
      totalBeds: Number(totalBedsInput) || 10,
      occupiedBeds: 0,
      activeStaffCount: 1,
      waitingQueueCount: 0,
      status: 'optimal',
      color: 'emerald'
    };

    if (onAddDepartment) {
      onAddDepartment(newDept);
    }
    setSelectedDeptId(newDept.id);
    setIsAddModalOpen(false);
    setDeptName('');
    setDeptCode('');
    setHeadDoctor('');
    setTotalBedsInput(20);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div>
          <span className="text-[10px] bg-purple-50 text-purple-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-purple-200">
            Gestion Lits & Services Hospitaliers
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">Capacité d'Accueil & Pôles Cliniques</h2>
          <p className="text-slate-600 text-xs mt-1 max-w-xl">
            Surveillance en temps réel des services, des lits d'hospitalisation et des affectations médicales.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center w-full sm:w-auto justify-around">
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

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm border-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau Service</span>
          </button>
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

        {/* Add new service placeholder card */}
        <div
          onClick={() => setIsAddModalOpen(true)}
          className="p-5 rounded-3xl border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 min-h-[180px] text-slate-400 hover:text-emerald-700"
        >
          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Plus className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold text-center">Ajouter un nouveau service</p>
        </div>
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

      {/* ADD SERVICE MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-slate-900"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Nouveau Service Hospitalier</h3>
                    <p className="text-[10px] text-slate-500">Le personnel pourra être affecté à ce service</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer bg-transparent border-0 p-1"
                >
                  <Shield className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Nom du Service <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Cardiologie, Urgences, Pédiatrie..."
                    value={deptName}
                    onChange={e => setDeptName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Code Service</label>
                    <input
                      type="text"
                      placeholder="CARD, URG, PED"
                      value={deptCode}
                      maxLength={6}
                      onChange={e => setDeptCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs uppercase placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Capacité Lits</label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={totalBedsInput}
                      onChange={e => setTotalBedsInput(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Chef de Service / Médecin Responsable</label>
                  <input
                    type="text"
                    placeholder="Dr. Prénom Nom"
                    value={headDoctor}
                    onChange={e => setHeadDoctor(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-transparent hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer border-0"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm border-0 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Créer le Service
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
