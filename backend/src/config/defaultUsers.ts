import { LocalUserRecord } from '../controllers/auth.controller';

export const DEFAULT_USERS: LocalUserRecord[] = [
  // 1. ESPACE SUPERADMIN
  {
    email: 'superadmin@sunusante.sn',
    passwordHash: 'SuperAdmin2026!',
    role: 'superadmin',
    name: 'Pape Makhtar Aidara',
    suspended: false,
    emailConfirmed: true,
    details: {
      firstName: 'Pape Makhtar',
      lastName: 'Aidara',
      phone: '+221 77 000 00 01',
      title: 'Super Administrateur Plateforme'
    }
  },

  // 2. ESPACE ADMIN (Hôpital & Pharmacie)
  {
    email: 'admin.hopital@sunusante.sn',
    passwordHash: 'Hopital2026!',
    role: 'admin_hospital',
    name: 'Dr. Amadou Fall',
    suspended: false,
    emailConfirmed: true,
    details: {
      firstName: 'Amadou',
      lastName: 'Fall',
      phone: '+221 77 123 45 00',
      hospital: 'Hôpital Principal de Dakar',
      title: 'Directeur Médical & RH'
    }
  },
  {
    email: 'admin.pharmacie@sunusante.sn',
    passwordHash: 'Pharmacie2026!',
    role: 'admin_pharmacy',
    name: 'Dr. Fatou Ndiaye',
    suspended: false,
    emailConfirmed: true,
    details: {
      firstName: 'Fatou',
      lastName: 'Ndiaye',
      phone: '+221 77 234 56 00',
      pharmacyName: 'Pharmacie Centrale de Dakar',
      title: 'Pharmacienne Titulaire & Gérante'
    }
  },

  // 3. ESPACE PERSONNEL SOIGNANT & MÉDICAL
  {
    email: 'medecin@sunusante.sn',
    passwordHash: 'Medecin2026!',
    role: 'doctor',
    name: 'Dr. Cheikh Tidiane Diop',
    suspended: false,
    emailConfirmed: true,
    details: {
      firstName: 'Cheikh Tidiane',
      lastName: 'Diop',
      phone: '+221 77 345 67 01',
      rpps: 'MED-77294',
      specialty: 'Médecine Générale',
      hospital: 'Hôpital Principal de Dakar'
    }
  },
  {
    email: 'infirmier@sunusante.sn',
    passwordHash: 'Infirmier2026!',
    role: 'nurse',
    name: 'Aïssatou Sow',
    suspended: false,
    emailConfirmed: true,
    details: {
      firstName: 'Aïssatou',
      lastName: 'Sow',
      phone: '+221 77 456 78 02',
      adeli: 'INF-44829',
      department: 'Urgences & Soins Intensifs',
      hospital: 'Hôpital Principal de Dakar'
    }
  },
  {
    email: 'radiologue@sunusante.sn',
    passwordHash: 'Radio2026!',
    role: 'radiology',
    name: 'Dr. Babacar Ndiaye',
    suspended: false,
    emailConfirmed: true,
    details: {
      firstName: 'Babacar',
      lastName: 'Ndiaye',
      phone: '+221 77 567 89 03',
      rpps: 'RAD-99124',
      imagingCenter: 'Centre Radiologique Central',
      hospital: 'Hôpital Principal de Dakar'
    }
  },
  {
    email: 'accueil@sunusante.sn',
    passwordHash: 'Accueil2026!',
    role: 'reception',
    name: 'Aminata Sarr',
    suspended: false,
    emailConfirmed: true,
    details: {
      firstName: 'Aminata',
      lastName: 'Sarr',
      phone: '+221 77 678 90 04',
      matricule: 'MAT-4029',
      deskAssignment: 'Guichet Central Accueil',
      hospital: 'Hôpital Principal de Dakar'
    }
  },
  {
    email: 'caisse@sunusante.sn',
    passwordHash: 'Caisse2026!',
    role: 'cashier',
    name: 'Ibrahima Diallo',
    suspended: false,
    emailConfirmed: true,
    details: {
      firstName: 'Ibrahima',
      lastName: 'Diallo',
      phone: '+221 77 789 01 05',
      matricule: 'MAT-7710',
      posCode: 'POS-01',
      hospital: 'Hôpital Principal de Dakar'
    }
  },
  {
    email: 'pharmacien@sunusante.sn',
    passwordHash: 'Pharmacien2026!',
    role: 'pharmacist',
    name: 'Dr. Babacar Diagne',
    suspended: false,
    emailConfirmed: true,
    details: {
      firstName: 'Babacar',
      lastName: 'Diagne',
      phone: '+221 77 890 12 06',
      rpps: 'RPPS-849204',
      pharmacyName: 'Pharmacie Centrale de Dakar',
      roleTitle: 'Pharmacien Adjoint'
    }
  },

  // 4. ESPACE PATIENT (Compte de test épuré sans données médicales pré-remplies)
  {
    email: 'test.patient@sunusante.sn',
    passwordHash: 'Patient2026!',
    role: 'patient',
    name: 'Patient Test',
    suspended: false,
    emailConfirmed: true,
    details: {
      firstName: 'Patient',
      lastName: 'Test',
      phone: '+221 77 000 00 00',
      gender: 'M',
      bloodGroup: 'Non renseigné',
      allergies: 'Aucune connue'
    }
  }
];
