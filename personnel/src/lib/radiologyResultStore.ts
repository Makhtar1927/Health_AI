'use client';

// ─────────────────────────────────────────────────────────────────────────────
// radiologyResultStore.ts
// Stocke les RÉSULTATS validés par le radiologue, partagés entre les apps
// (personnel ↔ patient) via localStorage.
//
// Clé partagée : 'sunu_sante_radiology_results'
// Cette même clé est lue dans l'app patient/records pour afficher les résultats.
// ─────────────────────────────────────────────────────────────────────────────

export interface RadiologyResult {
  /** Référence de la demande d'imagerie (ex: RAD-2026-101) */
  orderId: string;
  patientId: string;
  patientName: string;
  /** Type d'examen prescrit */
  examType: string;
  modality: 'RX' | 'TDM' | 'IRM' | 'ECO';
  bodyPart: string;
  /** Médecin prescripteur */
  prescribingDoctor: string;
  hospital: string;
  /** Radiologue qui a validé */
  radiologist: string;
  /** Date de validation (ISO string) */
  validatedAt: string;
  /** Compte-rendu rédigé par le radiologue */
  findings: string;
  /** Conclusion (synthèse) */
  conclusion: string;
  /** URL QR code de l'ordonnance originale */
  qrCodeUrl: string;
  /** URL image / aperçu du cliché (optionnelle) */
  imageUrl?: string;
  /** Nombre de séries DICOM indexées */
  dicomCount?: number;
}

const RESULTS_KEY = 'sunu_sante_radiology_results';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function getRadiologyResults(): RadiologyResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRadiologyResult(result: RadiologyResult): RadiologyResult[] {
  const current = getRadiologyResults();
  // Remplace si déjà existant pour ce orderId
  const filtered = current.filter(r => r.orderId !== result.orderId);
  const updated = [result, ...filtered];
  if (typeof window !== 'undefined') {
    localStorage.setItem(RESULTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', {
      key: RESULTS_KEY,
      newValue: JSON.stringify(updated),
    }));

    // Transmission immédiate au backend (relais pour app patient & médecin)
    fetch(`${BACKEND_URL}/api/radiology/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    }).catch(err => {
      console.warn('Synchro backend résultat radio (mode hors-ligne):', err.message);
    });
  }
  return updated;
}

export function getResultForOrder(orderId: string): RadiologyResult | undefined {
  return getRadiologyResults().find(r => r.orderId === orderId);
}

export async function fetchRadiologyResultsFromBackend(): Promise<RadiologyResult[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/radiology/results`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(RESULTS_KEY, JSON.stringify(data.data));
      }
      return data.data;
    }
  } catch (e) {
    // Fallback local
  }
  return getRadiologyResults();
}
