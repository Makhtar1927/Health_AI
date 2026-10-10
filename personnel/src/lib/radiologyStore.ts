'use client';

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

const STORAGE_KEY = 'sunu_sante_radiology_orders';

export const INITIAL_RADIOLOGY_ORDERS: RadiologyOrder[] = [
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
    date: 'Aujourd\'hui à 14:10',
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
    date: 'Aujourd\'hui à 13:45',
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
    date: 'Aujourd\'hui à 12:20',
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
    date: 'Aujourd\'hui à 11:15',
    timestamp: Date.now() - 1000 * 60 * 200,
    status: 'completed',
    qrCodeData: 'SUNU-SANTE://RAD/RAD-2026-104?patient=Aissatou+Sow&type=Echographie+Abdominale&priority=routine&dr=Dr.+Abdoulaye+Diallo',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent('SUNU-SANTE://RAD/RAD-2026-104?patient=Aissatou+Sow&type=Echographie+Abdominale&priority=routine&dr=Dr.+Abdoulaye+Diallo') + '&color=6b21a8&bgcolor=ffffff&format=svg&qzone=2',
    dicomCount: 12
  }
];

export function getRadiologyOrders(): RadiologyOrder[] {
  if (typeof window === 'undefined') return INITIAL_RADIOLOGY_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RADIOLOGY_ORDERS));
      return INITIAL_RADIOLOGY_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_RADIOLOGY_ORDERS;
  } catch (e) {
    console.error('Erreur lecture radiology orders:', e);
    return INITIAL_RADIOLOGY_ORDERS;
  }
}

export function saveRadiologyOrders(orders: RadiologyOrder[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Erreur sauvegarde radiology orders:', e);
  }
}

export function createRadiologyOrder(params: {
  patientId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: 'M' | 'F';
  type: string;
  bodyPart?: string;
  modality?: 'RX' | 'TDM' | 'IRM' | 'ECO';
  priority?: 'routine' | 'urgent' | 'vital';
  doctor?: string;
  hospital?: string;
  clinicalIndication: string;
}): RadiologyOrder {
  const currentOrders = getRadiologyOrders();
  const nextNum = 105 + currentOrders.length;
  const id = `RAD-2026-${nextNum}`;

  const modality = params.modality || 'RX';
  const priority = params.priority || 'routine';
  const doctor = params.doctor || 'Dr. Oumy Aidara';
  const hospital = params.hospital || 'Hôpital Principal de Dakar';
  const bodyPart = params.bodyPart || 'Thorax';

  const qrPayload = `SUNU-SANTE://RAD/${id}?patient=${encodeURIComponent(params.patientName)}&type=${encodeURIComponent(params.type)}&priority=${priority}&dr=${encodeURIComponent(doctor)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrPayload)}&color=6b21a8&bgcolor=ffffff&format=svg&qzone=2`;

  const newOrder: RadiologyOrder = {
    id,
    patientId: params.patientId || `P-${Math.floor(100 + Math.random() * 900)}`,
    patientName: params.patientName,
    patientAge: params.patientAge ?? 42,
    patientGender: params.patientGender ?? 'M',
    type: params.type,
    bodyPart,
    modality,
    priority,
    doctor,
    hospital,
    clinicalIndication: params.clinicalIndication,
    date: new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short'
    }).format(new Date()),
    timestamp: Date.now(),
    status: 'pending',
    qrCodeData: qrPayload,
    qrCodeUrl: qrUrl,
    dicomCount: 0
  };

  const updated = [newOrder, ...currentOrders];
  saveRadiologyOrders(updated);

  // Synchro backend
  if (typeof window !== 'undefined') {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/radiology/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch(err => console.warn('Synchro backend commande radio (hors ligne):', err.message));
  }

  return newOrder;
}

export function updateRadiologyOrderStatus(orderId: string, status: RadiologyOrder['status']): RadiologyOrder[] {
  const current = getRadiologyOrders();
  const updated = current.map(o => o.id === orderId ? { ...o, status } : o);
  saveRadiologyOrders(updated);

  if (typeof window !== 'undefined') {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/radiology/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(err => console.warn('Synchro backend statut radio:', err.message));
  }

  return updated;
}

export async function fetchRadiologyOrdersFromBackend(): Promise<RadiologyOrder[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/radiology/orders`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
      }
      return json.data;
    }
  } catch (e) {
    // Fallback local
  }
  return getRadiologyOrders();
}

export function findOrderByQrString(qrString: string): RadiologyOrder | undefined {
  if (!qrString) return undefined;
  const trimmed = qrString.trim();
  const orders = getRadiologyOrders();

  // 1. Direct ID match
  const directMatch = orders.find(o => o.id.toLowerCase() === trimmed.toLowerCase());
  if (directMatch) return directMatch;

  // 2. Contains RAD-ID in the payload
  const matchRegex = trimmed.match(/RAD-2026-\d+/i);
  if (matchRegex) {
    const foundId = matchRegex[0].toUpperCase();
    const found = orders.find(o => o.id.toUpperCase() === foundId);
    if (found) return found;
  }

  // 3. Name or part match
  return orders.find(o => 
    trimmed.toLowerCase().includes(o.id.toLowerCase()) || 
    (o.patientName && trimmed.toLowerCase().includes(o.patientName.toLowerCase()))
  );
}
