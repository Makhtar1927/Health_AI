'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, QrCode, CreditCard, CheckCircle2, Clock, 
  UserCheck, AlertCircle, Sparkles, Building2
} from 'lucide-react';
import { AttendanceRecord, StaffRole } from '@/types/hospital';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPunch: (record: Partial<AttendanceRecord>) => void;
}

export const HospitalBadgeModal: React.FC<Props> = ({ isOpen, onClose, onPunch }) => {
  const [matriculeOrCode, setMatriculeOrCode] = useState('');
  const [punchType, setPunchType] = useState<'check_in' | 'check_out' | 'break_start' | 'break_end'>('check_in');
  const [method, setMethod] = useState<'badge_rfid' | 'qr_code' | 'manual'>('badge_rfid');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulate = (name: string, role: StaffRole, dept: string, email: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = now.toISOString().split('T')[0];

    const punchRecord: Partial<AttendanceRecord> = {
      employeeEmail: email,
      employeeName: name,
      role: role,
      department: dept,
      date: dateStr,
      punchMethod: method,
      status: punchType === 'check_in' ? 'present' : punchType === 'break_start' ? 'break' : 'present',
      notes: `Pointage ${punchType === 'check_in' ? 'Entrée' : punchType === 'check_out' ? 'Sortie' : 'Pause'} enregistré à ${timeStr}`
    };

    if (punchType === 'check_in') {
      punchRecord.checkIn = timeStr;
    } else if (punchType === 'check_out') {
      punchRecord.checkOut = timeStr;
    }

    onPunch(punchRecord);
    setSuccessMsg(`Pointage validé avec succès pour ${name} (${timeStr})`);
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matriculeOrCode.trim()) return;
    handleSimulate(
      `Agent ${matriculeOrCode.toUpperCase()}`,
      'nurse',
      'Urgences',
      `agent.${matriculeOrCode.toLowerCase()}@sunusante.sn`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-slate-900 relative"
      >
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Borne de Pointage Numérique</h3>
              <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Badgeuse RFID & Flash QR Code</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 cursor-pointer bg-transparent border-0 p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto animate-bounce" />
            <p className="text-sm font-bold text-slate-900">{successMsg}</p>
            <p className="text-xs text-slate-500">Horodatage cryptographique certifié Sunu Santé</p>
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            {/* Mode selection */}
            <div className="grid grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setPunchType('check_in')}
                className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer border-0 ${
                  punchType === 'check_in' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                Prise de poste
              </button>
              <button
                type="button"
                onClick={() => setPunchType('break_start')}
                className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer border-0 ${
                  punchType === 'break_start' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                Pause Déjeuner
              </button>
              <button
                type="button"
                onClick={() => setPunchType('break_end')}
                className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer border-0 ${
                  punchType === 'break_end' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                Reprise
              </button>
              <button
                type="button"
                onClick={() => setPunchType('check_out')}
                className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer border-0 ${
                  punchType === 'check_out' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                Fin de service
              </button>
            </div>

            {/* Quick Simulation Badges for Demo */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Badge Rapide (Simulation en 1-Clic)</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulate('Dr. Cheikh Anta Diop', 'doctor', 'Urgences', 'dr.diop@sunusante.sn')}
                  className="p-3 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-2xl text-left transition-all cursor-pointer group shadow-sm"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">Dr. Cheikh Anta Diop</p>
                  <p className="text-[10px] text-slate-500">Urgences · Matr. URG-042</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulate('Aminata Fall', 'nurse', 'Réanimation', 'a.fall@sunusante.sn')}
                  className="p-3 bg-slate-50 hover:bg-rose-50/70 border border-slate-200 hover:border-rose-300 rounded-2xl text-left transition-all cursor-pointer group shadow-sm"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-rose-700">Aminata Fall (IDE)</p>
                  <p className="text-[10px] text-slate-500">Réanimation · Matr. REA-112</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulate('Dr. Abdoulaye Diallo', 'radiology', 'Radiologie', 'dr.diallo@sunusante.sn')}
                  className="p-3 bg-slate-50 hover:bg-purple-50/70 border border-slate-200 hover:border-purple-300 rounded-2xl text-left transition-all cursor-pointer group shadow-sm"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700">Dr. Abdoulaye Diallo</p>
                  <p className="text-[10px] text-slate-500">Radiologie · Matr. RAD-009</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulate('Mamadou Seck', 'reception', 'Accueil', 'm.seck@sunusante.sn')}
                  className="p-3 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-2xl text-left transition-all cursor-pointer group shadow-sm"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">Mamadou Seck</p>
                  <p className="text-[10px] text-slate-500">Accueil · Matr. ACC-201</p>
                </button>
              </div>
            </div>

            {/* Manual matricule or badge input */}
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <label className="text-[10px] uppercase font-bold text-slate-600 tracking-wider block">
                Ou scanner par Code Badge / Matricule
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: MAT-7749 ou BADGE-RFID-..."
                  value={matriculeOrCode}
                  onChange={(e) => setMatriculeOrCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border-0 shadow-sm"
                >
                  Valider
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
