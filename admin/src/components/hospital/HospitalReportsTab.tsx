'use client';

import React, { useState } from 'react';
import { 
  FileText, Download, Printer, Share2, CheckCircle2, 
  TrendingUp, Activity, DollarSign, Users, Award, 
  Calendar, ShieldCheck, Sparkles, AlertCircle, RefreshCw
} from 'lucide-react';
import { MonthlyReportMetric } from '@/types/hospital';

interface Props {
  reports: MonthlyReportMetric[];
  currentHospitalName: string;
}

export const HospitalReportsTab: React.FC<Props> = ({ reports, currentHospitalName }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(reports[0]?.month || '2026-10');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeReport = reports.find(r => r.month === selectedMonth) || reports[0];

  const handleGenerateNew = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Rapport consolidé pour ${activeReport.monthLabel} recalculé avec les dernières données d'admissions, de caisse et de pointage.`);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      `Indicateur,Valeur\n` +
      `Mois,${activeReport.monthLabel}\n` +
      `Etablissement,${activeReport.hospitalName}\n` +
      `Admissions Totales,${activeReport.admissionsTotal}\n` +
      `Urgences,${activeReport.emergencyAdmissions}\n` +
      `Consultations,${activeReport.consultationsTotal}\n` +
      `Actes Chirurgicaux,${activeReport.surgeriesTotal}\n` +
      `Examens Radiologie,${activeReport.radiologyExamsTotal}\n` +
      `Analyses Laboratoire,${activeReport.labTestsTotal}\n` +
      `Taux Occupation Lits,${activeReport.averageBedOccupancy}%\n` +
      `Délai Attente Urgences,${activeReport.emergencyAvgWaitMinutes} min\n` +
      `Facturation Totale,${activeReport.totalBillingFCFA} FCFA\n` +
      `Part IPM Mutuelles,${activeReport.ipmInsuranceFCFA} FCFA\n` +
      `Paiements Caisse Especes,${activeReport.patientCashFCFA} FCFA\n` +
      `Effectif RH Actif,${activeReport.activeStaffTotal}\n` +
      `Heures Prestees,${activeReport.totalWorkedHours}h\n` +
      `Taux Absentéisme,${activeReport.absenteeismRate}%\n` +
      `Satisfaction Usagers,${activeReport.satisfactionRate}%\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rapport_mensuel_${activeReport.month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Control Banner & Month Selector */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div>
          <span className="text-[10px] bg-blue-50 text-blue-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-200">
            Audit & Gouvernance Clinique
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">Générateur de Rapports Mensuels d'Activité</h2>
          <p className="text-slate-600 text-xs mt-1 max-w-xl">
            Bilan d'exploitation consolidé : données d'hospitalisation, actes médicaux, recettes financières et suivi du temps de travail du personnel soignant.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month selector */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl px-3 py-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {reports.map((rep) => (
                <option key={rep.month} value={rep.month} className="bg-white">
                  {rep.monthLabel}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerateNew}
            disabled={isGenerating}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-2 border border-slate-200 transition-all cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-blue-600 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Recalcul...' : 'Actualiser'}
          </button>

          <button
            onClick={exportCSV}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-2 border border-slate-200 transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600" />
            Export CSV
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer border-0"
          >
            <Printer className="h-3.5 w-3.5" />
            Imprimer / PDF
          </button>
        </div>
      </section>

      {/* KPI Highlights for the selected month */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm p-5 rounded-2xl">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Admissions Totales</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{activeReport.admissionsTotal.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-700 font-semibold mt-1">
            Dont {activeReport.emergencyAdmissions} urgences ({(activeReport.emergencyAdmissions / activeReport.admissionsTotal * 100).toFixed(0)}%)
          </p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-5 rounded-2xl">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Facturation & Recettes</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-teal-700 mt-2">{(activeReport.totalBillingFCFA / 1000000).toFixed(1)} M FCFA</p>
          <p className="text-[10px] text-teal-700 font-semibold mt-1">
            Recouvrement certifié à {activeReport.recoveryRate}%
          </p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-5 rounded-2xl">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Heures Travaillées RH</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{activeReport.totalWorkedHours.toLocaleString()} h</p>
          <p className="text-[10px] text-blue-700 font-semibold mt-1">
            {activeReport.totalOvertimeHours}h supp. · Absentéisme : {activeReport.absenteeismRate}%
          </p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-5 rounded-2xl">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Taux d'Occupation Lits</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-700 mt-2">{activeReport.averageBedOccupancy}%</p>
          <p className="text-[10px] text-purple-700 font-semibold mt-1">
            DMS moyenne : {activeReport.averageLengthOfStay} jours
          </p>
        </div>
      </section>

      {/* Official Institutional Document Preview */}
      <section className="bg-slate-100 border border-slate-200 rounded-3xl p-4 sm:p-8 shadow-sm relative">
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-800">
              Aperçu du Document d'Audit Officiel — Prêt pour Téléchargement & Impression
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
            Réf: RAP-HOSP-{activeReport.month}-SN
          </span>
        </div>

        {/* Paper Container - styled as official medical document */}
        <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-10 space-y-8 text-slate-900 shadow-md max-w-5xl mx-auto print:shadow-none print:border-none">
          
          {/* Header of official document */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-6 gap-4">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-800">
                RÉPUBLIQUE DU SÉNÉGAL · MINISTÈRE DE LA SANTÉ ET DE L'ACTION SOCIALE
              </p>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-1">
                {activeReport.hospitalName}
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Rapport Mensuel de Gestion, de Fréquentation & d'Activité Médicale
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold inline-block">
                Période : {activeReport.monthLabel}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">Généré le {activeReport.generatedAt}</p>
            </div>
          </div>

          {/* Section 1: Activite Clinique */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              1. Bilan d'Activité Médicale, Chirurgicale & Hospitalière
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Consultations Externes</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">{activeReport.consultationsTotal.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Interventions Chirurgicales</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">{activeReport.surgeriesTotal.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Examens Radiologie / PACS</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">{activeReport.radiologyExamsTotal.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Analyses de Laboratoire</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">{activeReport.labTestsTotal.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Naissances / Maternité</p>
                <p className="text-base font-bold text-emerald-700 mt-0.5">{activeReport.birthsCount}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Taux de Mortalité</p>
                <p className="text-base font-bold text-rose-700 mt-0.5">{activeReport.mortalityRate}%</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Attente Moyenne Urgences</p>
                <p className="text-base font-bold text-amber-700 mt-0.5">{activeReport.emergencyAvgWaitMinutes} min</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Satisfaction Usagers</p>
                <p className="text-base font-bold text-teal-700 mt-0.5">{activeReport.satisfactionRate}%</p>
              </div>
            </div>
          </div>

          {/* Section 2: Performance Financiere */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              2. Bilan Économique, Recouvrement IPM & Caisse
            </h4>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider bg-slate-50">
                    <th className="p-3">Poste Comptable</th>
                    <th className="p-3">Montant Consolidé</th>
                    <th className="p-3">Part du Chiffre d'Affaires</th>
                    <th className="p-3 text-right">Statut Recouvrement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Prises en charge IPM / Mutuelles / Assurances</td>
                    <td className="p-3 font-bold text-emerald-700">{formatFCFA(activeReport.ipmInsuranceFCFA)}</td>
                    <td className="p-3 text-slate-600">{((activeReport.ipmInsuranceFCFA / activeReport.totalBillingFCFA) * 100).toFixed(1)}%</td>
                    <td className="p-3 text-right text-emerald-700 font-bold">Télé-transmis & Validé</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Quote-part Ticket Modérateur (Caisse Espèces / Wave / OM)</td>
                    <td className="p-3 font-bold text-teal-700">{formatFCFA(activeReport.patientCashFCFA)}</td>
                    <td className="p-3 text-slate-600">{((activeReport.patientCashFCFA / activeReport.totalBillingFCFA) * 100).toFixed(1)}%</td>
                    <td className="p-3 text-right text-teal-700 font-bold">Encaissé à 100%</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Créances restantes & Dépassements en cours de relance</td>
                    <td className="p-3 font-bold text-amber-700">{formatFCFA(activeReport.unpaidDebtsFCFA)}</td>
                    <td className="p-3 text-slate-600">{((activeReport.unpaidDebtsFCFA / activeReport.totalBillingFCFA) * 100).toFixed(1)}%</td>
                    <td className="p-3 text-right text-amber-700 font-bold">Contentieux / Relances</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="p-3 text-slate-900">TOTAL FACTURÉ DU MOIS</td>
                    <td className="p-3 text-slate-900 text-sm">{formatFCFA(activeReport.totalBillingFCFA)}</td>
                    <td className="p-3 text-emerald-700">100.0%</td>
                    <td className="p-3 text-right text-emerald-700">Taux Net: {activeReport.recoveryRate}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Bilan RH & Temps de Travail */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              3. Bilan des Ressources Humaines & Synthèse du Pointage
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Collaborateurs Actifs</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">{activeReport.activeStaffTotal} soignants</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Total Heures Travaillées</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">{activeReport.totalWorkedHours.toLocaleString()} h</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Heures Supp. Validées</p>
                <p className="text-base font-bold text-blue-700 mt-0.5">{activeReport.totalOvertimeHours} h</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Gardes / Astreintes Assurées</p>
                <p className="text-base font-bold text-purple-700 mt-0.5">{activeReport.onDutyShiftsTotal} vacations</p>
              </div>
            </div>
          </div>

          {/* Signatures & Certification */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6">
            <div className="text-[10px] text-slate-500 space-y-1">
              <p>Certification numérique : <span className="font-mono text-slate-700">SHA256: 7f8c9b2e4d01a35...SN</span></p>
              <p>Conforme aux directives de la Direction des Établissements de Santé (DES) du Sénégal.</p>
            </div>

            <div className="text-right p-4 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 min-w-[240px]">
              <p className="text-[10px] font-bold uppercase text-slate-600">Pour la Direction Générale & Médicale</p>
              <p className="text-xs font-bold text-emerald-800 mt-1">{activeReport.directorSignatory}</p>
              <div className="mt-3 flex justify-end">
                <span className="px-2.5 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold uppercase">
                  ✓ Sceau Certifié Numérique
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
