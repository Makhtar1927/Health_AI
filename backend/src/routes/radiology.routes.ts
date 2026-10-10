import { Router, Request, Response } from 'express';

export interface RadiologyOrder {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'M' | 'F';
  type: string;
  bodyPart: string;
  modality: 'RX' | 'TDM' | 'IRM' | 'ECO';
  priority: 'routine' | 'urgent' | 'vital';
  doctor: string;
  hospital: string;
  clinicalIndication: string;
  date: string;
  timestamp: number;
  status: 'pending' | 'in_progress' | 'completed';
  qrCodeData: string;
  qrCodeUrl: string;
  dicomCount?: number;
}

export interface RadiologyResult {
  orderId: string;
  patientId: string;
  patientName: string;
  examType: string;
  modality: 'RX' | 'TDM' | 'IRM' | 'ECO';
  bodyPart: string;
  prescribingDoctor: string;
  hospital: string;
  radiologist: string;
  validatedAt: string;
  findings: string;
  conclusion: string;
  qrCodeUrl: string;
  imageUrl?: string;
  dicomCount?: number;
}

// In-memory data store for live multi-app communication
let orders: RadiologyOrder[] = [
  {
    id: 'RAD-2026-101',
    patientId: 'P-101',
    patientName: 'Amadou Sall',
    patientAge: 42,
    patientGender: 'M',
    type: 'Radiographie Pulmonaire (Face & Profil)',
    bodyPart: 'Thorax',
    modality: 'RX',
    priority: 'vital',
    doctor: 'Dr. Oumy Aidara',
    hospital: 'Hôpital Principal de Dakar',
    clinicalIndication: 'Détresse respiratoire aiguë, râles crépitants base droite. Suspicion foyer infectieux ou OAP.',
    date: "Aujourd'hui à 14:10",
    timestamp: Date.now() - 1000 * 60 * 25,
    status: 'pending',
    qrCodeData: 'SUNU-SANTE://RAD/RAD-2026-101?patient=Amadou+Sall&type=Radiographie+Pulmonaire&priority=vital&dr=Dr.+Oumy+Aidara',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent('SUNU-SANTE://RAD/RAD-2026-101?patient=Amadou+Sall&type=Radiographie+Pulmonaire&priority=vital&dr=Dr.+Oumy+Aidara') + '&color=6b21a8&bgcolor=ffffff&format=svg&qzone=2',
    dicomCount: 2
  },
  {
    id: 'RAD-2026-102',
    patientId: 'P-102',
    patientName: 'Cheikh Tidiane Diop',
    patientAge: 67,
    patientGender: 'M',
    type: 'Scanner Thoraco-Abdominal C+',
    bodyPart: 'Thorax & Abdomen',
    modality: 'TDM',
    priority: 'urgent',
    doctor: 'Dr. Aminata Touré',
    hospital: 'Hôpital Principal de Dakar',
    clinicalIndication: 'Traumatisme fermé suite à AVP. Bilan lésionnel thoracique et abdominal.',
    date: "Aujourd'hui à 13:45",
    timestamp: Date.now() - 1000 * 60 * 50,
    status: 'pending',
    qrCodeData: 'SUNU-SANTE://RAD/RAD-2026-102?patient=Cheikh+Tidiane+Diop&type=Scanner+Thoraco-Abdominal&priority=urgent&dr=Dr.+Aminata+Touré',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent('SUNU-SANTE://RAD/RAD-2026-102?patient=Cheikh+Tidiane+Diop&type=Scanner+Thoraco-Abdominal&priority=urgent&dr=Dr.+Aminata+Touré') + '&color=6b21a8&bgcolor=ffffff&format=svg&qzone=2',
    dicomCount: 48
  },
  {
    id: 'RAD-2026-103',
    patientId: 'P-103',
    patientName: 'Mariama Diallo',
    patientAge: 29,
    patientGender: 'F',
    type: 'Radio Genou Gauche (Face & Profil)',
    bodyPart: 'Genou Gauche',
    modality: 'RX',
    priority: 'routine',
    doctor: 'Dr. Oumy Aidara',
    hospital: 'Hôpital Principal de Dakar',
    clinicalIndication: 'Gonalgie post-entorse survenue en activité sportive. Éliminer fracture ou arrachement osseux.',
    date: "Aujourd'hui à 12:20",
    timestamp: Date.now() - 1000 * 60 * 135,
    status: 'in_progress',
    qrCodeData: 'SUNU-SANTE://RAD/RAD-2026-103?patient=Mariama+Diallo&type=Radio+Genou+Gauche&priority=routine&dr=Dr.+Oumy+Aidara',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent('SUNU-SANTE://RAD/RAD-2026-103?patient=Mariama+Diallo&type=Radio+Genou+Gauche&priority=routine&dr=Dr.+Oumy+Aidara') + '&color=6b21a8&bgcolor=ffffff&format=svg&qzone=2',
    dicomCount: 3
  },
  {
    id: 'RAD-2026-104',
    patientId: 'P-104',
    patientName: 'Aissatou Sow',
    patientAge: 54,
    patientGender: 'F',
    type: 'Échographie Abdomino-Pelvienne',
    bodyPart: 'Abdomen',
    modality: 'ECO',
    priority: 'routine',
    doctor: 'Dr. Abdoulaye Diallo',
    hospital: 'Hôpital Principal de Dakar',
    clinicalIndication: 'Coliques hépatiques récidivantes. Recherche lithiase vésiculaire.',
    date: "Aujourd'hui à 11:15",
    timestamp: Date.now() - 1000 * 60 * 200,
    status: 'completed',
    qrCodeData: 'SUNU-SANTE://RAD/RAD-2026-104?patient=Aissatou+Sow&type=Echographie+Abdominale&priority=routine&dr=Dr.+Abdoulaye+Diallo',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent('SUNU-SANTE://RAD/RAD-2026-104?patient=Aissatou+Sow&type=Echographie+Abdominale&priority=routine&dr=Dr.+Abdoulaye+Diallo') + '&color=6b21a8&bgcolor=ffffff&format=svg&qzone=2',
    dicomCount: 12
  }
];

let results: RadiologyResult[] = [
  {
    orderId: 'RAD-2026-104',
    patientId: 'P-104',
    patientName: 'Aissatou Sow',
    examType: 'Échographie Abdomino-Pelvienne',
    modality: 'ECO',
    bodyPart: 'Abdomen',
    prescribingDoctor: 'Dr. Abdoulaye Diallo',
    hospital: 'Hôpital Principal de Dakar',
    radiologist: 'Dr. Ousmane Diop',
    validatedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    findings: 'Foie de taille et d’échostructure homogènes. Vésicule alithiasique à paroi fine. Voies biliaires intra et extra-hépatiques non dilatées. Reins de taille normale sans dilatation pyélocalicielle.',
    conclusion: 'Échographie abdominale dans les limites de la normale. Pas d’argument pour une lithiase vésiculaire ou une cholécystite.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent('SUNU-SANTE://RAD/RAD-2026-104?patient=Aissatou+Sow') + '&color=6b21a8&bgcolor=ffffff&format=svg&qzone=2',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    dicomCount: 12
  }
];

const router = Router();

// GET all orders with optional filter by patientId, doctor, or status
router.get('/orders', (req: Request, res: Response) => {
  try {
    const { patientId, doctor, status } = req.query;
    let filtered = [...orders];

    if (patientId) {
      filtered = filtered.filter(o => 
        o.patientId.toLowerCase() === String(patientId).toLowerCase() ||
        o.patientName.toLowerCase().includes(String(patientId).toLowerCase())
      );
    }
    if (doctor) {
      filtered = filtered.filter(o => 
        o.doctor.toLowerCase().includes(String(doctor).toLowerCase())
      );
    }
    if (status) {
      filtered = filtered.filter(o => o.status === status);
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create a new radiology order (prescribed by doctor)
router.post('/orders', (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.patientName || !body.type) {
      return res.status(400).json({ success: false, message: 'patientName et type requis' });
    }

    const nextNum = 100 + orders.length + 1;
    const id = body.id || `RAD-2026-${nextNum}`;
    const doctor = body.doctor || 'Dr. Oumy Aidara';
    const priority = body.priority || 'routine';
    const type = body.type;

    const qrPayload = body.qrCodeData || `SUNU-SANTE://RAD/${id}?patient=${encodeURIComponent(body.patientName)}&type=${encodeURIComponent(type)}&priority=${priority}&dr=${encodeURIComponent(doctor)}`;
    const qrUrl = body.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrPayload)}&color=6b21a8&bgcolor=ffffff&format=svg&qzone=2`;

    const newOrder: RadiologyOrder = {
      id,
      patientId: body.patientId || `P-${Math.floor(100 + Math.random() * 900)}`,
      patientName: body.patientName,
      patientAge: body.patientAge ?? 40,
      patientGender: body.patientGender ?? 'M',
      type,
      bodyPart: body.bodyPart || 'Thorax',
      modality: body.modality || 'RX',
      priority,
      doctor,
      hospital: body.hospital || 'Hôpital Principal de Dakar',
      clinicalIndication: body.clinicalIndication || '',
      date: body.date || new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short'
      }).format(new Date()),
      timestamp: Date.now(),
      status: 'pending',
      qrCodeData: qrPayload,
      qrCodeUrl: qrUrl,
      dicomCount: body.dicomCount || 0
    };

    orders = [newOrder, ...orders];
    res.status(201).json({ success: true, data: newOrder });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH update status of an order
router.patch('/orders/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, dicomCount } = req.body;

    const existingIndex = orders.findIndex(o => o.id === id);
    if (existingIndex === -1) {
      return res.status(404).json({ success: false, message: 'Ordre introuvable' });
    }

    if (status) orders[existingIndex].status = status;
    if (dicomCount !== undefined) orders[existingIndex].dicomCount = dicomCount;

    res.json({ success: true, data: orders[existingIndex] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all results with optional filters
router.get('/results', (req: Request, res: Response) => {
  try {
    const { patientId, prescribingDoctor, orderId } = req.query;
    let filtered = [...results];

    if (orderId) {
      filtered = filtered.filter(r => r.orderId === orderId);
    }
    if (patientId) {
      filtered = filtered.filter(r => 
        r.patientId.toLowerCase() === String(patientId).toLowerCase() ||
        r.patientName.toLowerCase().includes(String(patientId).toLowerCase())
      );
    }
    if (prescribingDoctor) {
      filtered = filtered.filter(r => 
        r.prescribingDoctor.toLowerCase().includes(String(prescribingDoctor).toLowerCase())
      );
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST validate and transmit a radiology result (by radiologist)
router.post('/results', (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.orderId || !body.findings || !body.conclusion) {
      return res.status(400).json({ 
        success: false, 
        message: 'orderId, findings et conclusion sont obligatoires pour valider le résultat' 
      });
    }

    const newResult: RadiologyResult = {
      orderId: body.orderId,
      patientId: body.patientId || 'P-000',
      patientName: body.patientName || 'Patient Inconnu',
      examType: body.examType || 'Examen Radiologique',
      modality: body.modality || 'RX',
      bodyPart: body.bodyPart || 'Non spécifié',
      prescribingDoctor: body.prescribingDoctor || 'Médecin Référent',
      hospital: body.hospital || 'Hôpital Principal de Dakar',
      radiologist: body.radiologist || 'Dr. Ousmane Diop (Radiologue)',
      validatedAt: new Date().toISOString(),
      findings: body.findings,
      conclusion: body.conclusion,
      qrCodeUrl: body.qrCodeUrl || '',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      dicomCount: body.dicomCount || 4
    };

    // Update orders list to mark as completed
    orders = orders.map(o => o.id === body.orderId ? { ...o, status: 'completed' } : o);

    // Save result (replace if already exists for this orderId)
    results = [newResult, ...results.filter(r => r.orderId !== body.orderId)];

    res.status(201).json({ 
      success: true, 
      message: 'Résultat validé et transmis avec succès au patient et au médecin prescripteur',
      data: newResult 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
