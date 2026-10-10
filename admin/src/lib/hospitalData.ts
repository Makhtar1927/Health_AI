import { AttendanceRecord, DepartmentInfo, HospitalAlert, MonthlyReportMetric } from '@/types/hospital';

export const INITIAL_DEPARTMENTS: DepartmentInfo[] = [
  {
    id: 'urgences',
    name: 'Urgences Générales & Traumatologie',
    code: 'URG',
    headDoctor: 'Dr. Cheikh Anta Diop',
    totalBeds: 28,
    occupiedBeds: 25,
    activeStaffCount: 14,
    waitingQueueCount: 8,
    status: 'tension',
    color: 'rose'
  },
  {
    id: 'reanimation',
    name: 'Réanimation Polyvalente & Soins Intensifs',
    code: 'REA',
    headDoctor: 'Pr. Aïssatou Ndiaye',
    totalBeds: 16,
    occupiedBeds: 15,
    activeStaffCount: 18,
    waitingQueueCount: 1,
    status: 'saturation',
    color: 'red'
  },
  {
    id: 'cardiologie',
    name: 'Cardiologie & USIC',
    code: 'CARD',
    headDoctor: 'Dr. Ousmane Kane',
    totalBeds: 34,
    occupiedBeds: 28,
    activeStaffCount: 12,
    waitingQueueCount: 4,
    status: 'optimal',
    color: 'emerald'
  },
  {
    id: 'maternite',
    name: 'Gynécologie-Obstétrique & Maternité',
    code: 'MAT',
    headDoctor: 'Dr. Fatou Bintou Sow',
    totalBeds: 42,
    occupiedBeds: 37,
    activeStaffCount: 16,
    waitingQueueCount: 3,
    status: 'optimal',
    color: 'pink'
  },
  {
    id: 'radiologie',
    name: 'Imagerie Médicale & PACS',
    code: 'RAD',
    headDoctor: 'Dr. Abdoulaye Diallo',
    totalBeds: 8,
    occupiedBeds: 4,
    activeStaffCount: 9,
    waitingQueueCount: 6,
    status: 'optimal',
    color: 'purple'
  },
  {
    id: 'chirurgie',
    name: 'Chirurgie Viscérale & Blocs Opératoires',
    code: 'CHIR',
    headDoctor: 'Pr. Mamadou Lamine Cissé',
    totalBeds: 30,
    occupiedBeds: 24,
    activeStaffCount: 15,
    waitingQueueCount: 2,
    status: 'optimal',
    color: 'blue'
  },
  {
    id: 'pediatrie',
    name: 'Pédiatrie & Néonatalogie',
    code: 'PED',
    headDoctor: 'Dr. Mariama Ba',
    totalBeds: 36,
    occupiedBeds: 29,
    activeStaffCount: 13,
    waitingQueueCount: 5,
    status: 'optimal',
    color: 'teal'
  }
];

export const INITIAL_ALERTS: HospitalAlert[] = [
  {
    id: 'alt-1',
    level: 'critical',
    title: 'Capacité Lits Réanimation presque saturée (94%)',
    department: 'Réanimation',
    description: '1 seul lit de déchocage disponible. Pré-alerter la régulation SAMU/Centre 15.',
    timestamp: 'Il y a 14 min',
    resolved: false
  },
  {
    id: 'alt-2',
    level: 'warning',
    title: 'Afflux patientèle aux Urgences Générales',
    department: 'Urgences',
    description: 'Délai d’attente moyen à 42 min. Recommandation d’affecter 2 internes supplémentaires.',
    timestamp: 'Il y a 38 min',
    resolved: false
  },
  {
    id: 'alt-3',
    level: 'info',
    title: 'Maintenance préventive IRM 3T programmée',
    department: 'Radiologie',
    description: 'Vérification hélium planifiée ce dimanche de 02h00 à 06h00 sans interruption du scanner.',
    timestamp: 'Il y a 2h',
    resolved: false
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-101',
    employeeEmail: 'dr.diop@sunusante.sn',
    employeeName: 'Dr. Cheikh Anta Diop',
    role: 'doctor',
    department: 'Urgences',
    date: '2026-10-08',
    checkIn: '07:55',
    checkOut: undefined,
    breakStart: '12:30',
    breakEnd: '13:00',
    status: 'present',
    durationMinutes: 480,
    overtimeMinutes: 45,
    lateMinutes: 0,
    punchMethod: 'badge_rfid',
    notes: 'Chef de garde Urgences'
  },
  {
    id: 'att-102',
    employeeEmail: 'dr.kane@sunusante.sn',
    employeeName: 'Dr. Ousmane Kane',
    role: 'doctor',
    department: 'Cardiologie',
    date: '2026-10-08',
    checkIn: '08:02',
    checkOut: undefined,
    status: 'present',
    durationMinutes: 470,
    overtimeMinutes: 0,
    lateMinutes: 2,
    punchMethod: 'qr_code'
  },
  {
    id: 'att-103',
    employeeEmail: 'a.fall@sunusante.sn',
    employeeName: 'Aminata Fall',
    role: 'nurse',
    department: 'Réanimation',
    date: '2026-10-08',
    checkIn: '06:50',
    checkOut: '15:10',
    status: 'present',
    durationMinutes: 500,
    overtimeMinutes: 20,
    lateMinutes: 0,
    punchMethod: 'badge_rfid',
    notes: 'Relève du matin effectuée sans incident'
  },
  {
    id: 'att-104',
    employeeEmail: 'dr.diallo@sunusante.sn',
    employeeName: 'Dr. Abdoulaye Diallo',
    role: 'radiology',
    department: 'Radiologie',
    date: '2026-10-08',
    checkIn: '08:35',
    status: 'late',
    durationMinutes: 420,
    overtimeMinutes: 0,
    lateMinutes: 35,
    punchMethod: 'biometric',
    notes: 'Retard transport régularisé avec accord chef de pôle'
  },
  {
    id: 'att-105',
    employeeEmail: 'm.seck@sunusante.sn',
    employeeName: 'Mamadou Seck',
    role: 'reception',
    department: 'Accueil & Admissions',
    date: '2026-10-08',
    checkIn: '07:45',
    checkOut: undefined,
    breakStart: '13:15',
    status: 'break',
    durationMinutes: 360,
    overtimeMinutes: 0,
    lateMinutes: 0,
    punchMethod: 'qr_code'
  },
  {
    id: 'att-106',
    employeeEmail: 'k.sarr@sunusante.sn',
    employeeName: 'Khadija Sarr',
    role: 'cashier',
    department: 'Caisse Centrale',
    date: '2026-10-08',
    checkIn: '08:00',
    checkOut: undefined,
    status: 'present',
    durationMinutes: 450,
    overtimeMinutes: 0,
    lateMinutes: 0,
    punchMethod: 'badge_rfid'
  },
  {
    id: 'att-107',
    employeeEmail: 'dr.ndiaye@sunusante.sn',
    employeeName: 'Pr. Aïssatou Ndiaye',
    role: 'doctor',
    department: 'Réanimation',
    date: '2026-10-08',
    checkIn: '19:00',
    status: 'on_duty',
    durationMinutes: 720,
    overtimeMinutes: 120,
    lateMinutes: 0,
    punchMethod: 'badge_rfid',
    notes: 'Garde de nuit 19h-07h programmée'
  },
  {
    id: 'att-108',
    employeeEmail: 'i.traore@sunusante.sn',
    employeeName: 'Ibrahima Traoré',
    role: 'nurse',
    department: 'Urgences',
    date: '2026-10-08',
    status: 'absent',
    durationMinutes: 0,
    overtimeMinutes: 0,
    lateMinutes: 0,
    punchMethod: 'manual',
    notes: 'Arrêt de travail transmis - Remplacement assuré par F. Ndir'
  }
];

export const MONTHLY_REPORTS: MonthlyReportMetric[] = [
  {
    month: '2026-10',
    monthLabel: 'Octobre 2026',
    hospitalName: 'Hôpital Principal de Dakar - Sunu Santé',
    admissionsTotal: 1845,
    emergencyAdmissions: 890,
    plannedAdmissions: 955,
    consultationsTotal: 5420,
    surgeriesTotal: 342,
    radiologyExamsTotal: 1280,
    labTestsTotal: 6940,
    averageBedOccupancy: 88.4,
    averageLengthOfStay: 4.8,
    emergencyAvgWaitMinutes: 28,
    mortalityRate: 1.4,
    birthsCount: 168,
    
    totalBillingFCFA: 184500000,
    ipmInsuranceFCFA: 138375000,
    patientCashFCFA: 40590000,
    unpaidDebtsFCFA: 5535000,
    recoveryRate: 97.0,

    activeStaffTotal: 148,
    totalWorkedHours: 24860,
    totalOvertimeHours: 1140,
    absenteeismRate: 2.1,
    onDutyShiftsTotal: 412,
    payrollEstimateFCFA: 74200000,

    incidentCount: 1,
    satisfactionRate: 94.6,

    generatedAt: '08/10/2026 à 18:30:00 (GMT)',
    directorSignatory: 'Pr. Babacar Guèye, Directeur Général'
  },
  {
    month: '2026-09',
    monthLabel: 'Septembre 2026',
    hospitalName: 'Hôpital Principal de Dakar - Sunu Santé',
    admissionsTotal: 2110,
    emergencyAdmissions: 1020,
    plannedAdmissions: 1090,
    consultationsTotal: 6180,
    surgeriesTotal: 388,
    radiologyExamsTotal: 1420,
    labTestsTotal: 7820,
    averageBedOccupancy: 91.2,
    averageLengthOfStay: 5.1,
    emergencyAvgWaitMinutes: 32,
    mortalityRate: 1.6,
    birthsCount: 194,

    totalBillingFCFA: 210400000,
    ipmInsuranceFCFA: 157800000,
    patientCashFCFA: 46288000,
    unpaidDebtsFCFA: 6312000,
    recoveryRate: 96.9,

    activeStaffTotal: 146,
    totalWorkedHours: 25400,
    totalOvertimeHours: 1280,
    absenteeismRate: 2.8,
    onDutyShiftsTotal: 435,
    payrollEstimateFCFA: 76100000,

    incidentCount: 3,
    satisfactionRate: 93.8,

    generatedAt: '30/09/2026 à 23:59:59 (GMT)',
    directorSignatory: 'Pr. Babacar Guèye, Directeur Général'
  },
  {
    month: '2026-08',
    monthLabel: 'Août 2026',
    hospitalName: 'Hôpital Principal de Dakar - Sunu Santé',
    admissionsTotal: 1980,
    emergencyAdmissions: 940,
    plannedAdmissions: 1040,
    consultationsTotal: 5890,
    surgeriesTotal: 356,
    radiologyExamsTotal: 1310,
    labTestsTotal: 7200,
    averageBedOccupancy: 87.5,
    averageLengthOfStay: 4.6,
    emergencyAvgWaitMinutes: 29,
    mortalityRate: 1.5,
    birthsCount: 182,

    totalBillingFCFA: 196800000,
    ipmInsuranceFCFA: 147600000,
    patientCashFCFA: 43296000,
    unpaidDebtsFCFA: 5904000,
    recoveryRate: 97.0,

    activeStaffTotal: 144,
    totalWorkedHours: 24900,
    totalOvertimeHours: 1190,
    absenteeismRate: 2.4,
    onDutyShiftsTotal: 420,
    payrollEstimateFCFA: 73800000,

    incidentCount: 2,
    satisfactionRate: 94.2,

    generatedAt: '31/08/2026 à 23:59:59 (GMT)',
    directorSignatory: 'Pr. Babacar Guèye, Directeur Général'
  }
];
