export type StaffRole = 'doctor' | 'nurse' | 'radiology' | 'reception' | 'cashier' | 'admin_hospital';

export type AttendanceStatus = 'present' | 'late' | 'break' | 'absent' | 'on_duty' | 'leave';

export interface AttendanceRecord {
  id: string;
  employeeEmail: string;
  employeeName: string;
  role: StaffRole;
  department: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // HH:mm
  checkOut?: string; // HH:mm
  breakStart?: string;
  breakEnd?: string;
  status: AttendanceStatus;
  durationMinutes: number;
  overtimeMinutes: number;
  lateMinutes: number;
  notes?: string;
  verifiedBy?: string;
  punchMethod: 'badge_rfid' | 'qr_code' | 'biometric' | 'manual';
}

export interface DepartmentInfo {
  id: string;
  name: string;
  code: string;
  headDoctor: string;
  totalBeds: number;
  occupiedBeds: number;
  activeStaffCount: number;
  waitingQueueCount: number;
  status: 'optimal' | 'tension' | 'saturation';
  color: string;
}

export interface MonthlyReportMetric {
  month: string; // e.g. "2026-10"
  monthLabel: string; // e.g. "Octobre 2026"
  hospitalName: string;
  admissionsTotal: number;
  emergencyAdmissions: number;
  plannedAdmissions: number;
  consultationsTotal: number;
  surgeriesTotal: number;
  radiologyExamsTotal: number;
  labTestsTotal: number;
  averageBedOccupancy: number; // percentage
  averageLengthOfStay: number; // days
  emergencyAvgWaitMinutes: number; // minutes
  mortalityRate: number; // percentage
  birthsCount: number;
  
  // Financial
  totalBillingFCFA: number;
  ipmInsuranceFCFA: number;
  patientCashFCFA: number;
  unpaidDebtsFCFA: number;
  recoveryRate: number; // percentage

  // HR & Attendance
  activeStaffTotal: number;
  totalWorkedHours: number;
  totalOvertimeHours: number;
  absenteeismRate: number; // percentage
  onDutyShiftsTotal: number;
  payrollEstimateFCFA: number;

  // Quality & Incidents
  incidentCount: number;
  satisfactionRate: number; // percentage

  generatedAt: string;
  directorSignatory: string;
}

export interface HospitalAlert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  title: string;
  department: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}
