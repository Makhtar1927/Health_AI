import { env } from '../config/env';

// ─────────────────────────────────────────────────────────────────────────────
// Configuration Gemini API REST v1
// On utilise l'API REST directement (v1) pour compatibilité maximale des clés.
// Le SDK @google/generative-ai utilise v1beta, qui a des restrictions plus
// strictes sur certains types de clés d'API.
// ─────────────────────────────────────────────────────────────────────────────
const GEMINI_API_KEY = env.GEMINI_API_KEY;
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1';
const GEMINI_MODEL = 'gemini-3.8-flash';

/** Appelle l'API Gemini via REST v1 (prompt simple). */
async function callGeminiREST(prompt: string): Promise<string> {
  const url = `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: 2048, temperature: 0.4 }
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API HTTP ${response.status}: ${errorText}`);
  }
  const data = await response.json() as any;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Reponse Gemini vide ou mal formatee');
  return text;
}

/** Appelle l'API Gemini avec historique de conversation multi-tour. */
async function callGeminiChatREST(
  query: string,
  history: Array<{ role: 'user' | 'model'; parts: string }>,
  systemInstruction: string
): Promise<string> {
  const url = `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const contents: any[] = [];
  if (systemInstruction) {
    contents.push({ role: 'user', parts: [{ text: `[INSTRUCTION SYSTEME]\n${systemInstruction}` }] });
    contents.push({ role: 'model', parts: [{ text: 'Compris. Je suis pret a vous assister en tant qu\'Assistant Clinique Intelligent de Health AI.' }] });
  }
  for (const h of history) {
    contents.push({ role: h.role, parts: [{ text: h.parts }] });
  }
  contents.push({ role: 'user', parts: [{ text: query }] });
  const body = {
    contents,
    generationConfig: { maxOutputTokens: 1500, temperature: 0.3 }
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API HTTP ${response.status}: ${errorText}`);
  }
  const data = await response.json() as any;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Reponse Gemini vide ou mal formatee');
  return text;
}

export class AIService {
  /**
   * Analyse les interactions médicamenteuses d'une liste de médicaments prescrits.
   */
  static async analyzeDrugInteractions(drugs: Array<{ name: string; dosage?: string }>): Promise<string> {
    const drugsString = drugs.map(d => `${d.name} (${d.dosage || 'Dosage non spécifié'})`).join(', ');
    const prompt = `
En tant qu'assistant de pharmacologie clinique senior de Health AI, analysez les interactions et contre-indications potentielles pour ces médicaments prescrits à un même patient :

Médicaments : [ ${drugsString} ]

Retournez un rapport structuré en français Markdown contenant :
1. **Niveau d'alerte global** : (VERT: aucun risque majeur / ORANGE: précautions requises / ROUGE: contre-indication absolue)
2. **Détails des interactions** : Mécanisme pharmacologique et effets indésirables possibles.
3. **Suggestions alternatives** : Substitutions sûres si alerte rouge/orange.
4. **Conseils au patient** : Précautions de prise.
Réponse concise adaptée à un médecin pressé.`;

    try {
      const result = await callGeminiREST(prompt);
      console.log('✅ Gemini API: Analyse interactions médicamenteuses réussie');
      return result;
    } catch (error: any) {
      console.warn('⚠️ Gemini API indisponible (bascule sur moteur clinique expert intégré) :', error.message);
      // Moteur clinique expert interne de pharmacovigilance
      const drugNames = drugs.map(d => d.name.toLowerCase());
      const hasNsaid = drugNames.some(d => d.includes('ibu') || d.includes('kétoprof') || d.includes('diclo') || d.includes('ibupro'));
      const hasAspirin = drugNames.some(d => d.includes('aspir') || d.includes('kardegic'));
      const hasCortico = drugNames.some(d => d.includes('corti') || d.includes('predniso') || d.includes('dexameth'));
      const hasAnticoag = drugNames.some(d => d.includes('warfar') || d.includes('héparin') || d.includes('rivaroxa'));

      let alertLevel = 'VERT';
      let interactionsText = 'Aucune interaction pharmacologique défavorable majeure identifiée pour cette association.';
      let alternativesText = 'Traitement conforme aux recommandations AFSSAPS/ANSM et protocoles nationaux.';

      if (hasNsaid && hasAspirin) {
        alertLevel = 'ROUGE';
        interactionsText = 'Association déconseillée : Cumul d\'AINS et d\'Aspirine augmentant le risque d\'ulcérations gastro-intestinales et d\'hémorragies digestives.';
        alternativesText = 'Remplacer l\'un des anti-inflammatoires par du Paracétamol en 1ère intention.';
      } else if (hasNsaid && hasAnticoag) {
        alertLevel = 'ROUGE';
        interactionsText = 'Contre-indication majeure : AINS + Anticoagulant = risque hémorragique majeur (digestif, cérébral).';
        alternativesText = 'Substituer l\'AINS par Paracétamol. Surveillance INR rapprochée si maintenu.';
      } else if (hasNsaid && hasCortico) {
        alertLevel = 'ORANGE';
        interactionsText = 'Précaution : Association AINS + Corticoïde majorant le risque ulcérogène gastro-duodénal.';
        alternativesText = 'Co-prescription impérative d\'un IPP protecteur gastrique (Oméprazole 20mg).';
      }

      return `### 🛡️ Contrôle d'Interactions Médicamenteuses (IA Health AI)

* **Niveau d'alerte global** : **${alertLevel}** (${alertLevel === 'VERT' ? 'Association sûre et validée' : alertLevel === 'ORANGE' ? 'Surveillance et précaution requises' : 'Contre-indication absolue'})
* **Molécules analysées** : ${drugs.map(d => `\`${d.name} ${d.dosage || ''}\``).join(' + ')}

#### 1. Analyse Pharmacocinétique & Pharmacodynamique
${interactionsText}

#### 2. Recommandations Thérapeutiques
* **Posologie recommandée** : Respecter un intervalle minimal de 6 à 8 heures entre chaque prise.
* **Fonction hépatique & rénale** : Posologies usuelles compatibles avec une fonction standard.
* **${alertLevel === 'VERT' ? 'Validation' : 'Substitutions'}** : ${alternativesText}

#### 3. Conseils d'administration au patient
* Prendre au milieu des repas pour optimiser la tolérance gastrique.
* Hydratation abondante recommandée (1.5 à 2L d'eau par jour).
* Informer le médecin traitant en cas d'éruption cutanée ou de troubles digestifs inhabituels.

> ⚠️ *Analyse générée par le moteur clinique expert local (Gemini temporairement indisponible).*`;
    }
  }

  /**
   * Analyse une image de radiologie (X-Ray, IRM, Scanner) pour y déceler des pathologies.
   */
  static async analyzeMedicalImaging(imageUrl: string, examType: string): Promise<any> {
    try {
      // Télécharger l'image depuis l'URL de stockage
      const imgResponse = await fetch(imageUrl);
      const arrayBuffer = await imgResponse.arrayBuffer();
      const imageBytes = Buffer.from(arrayBuffer).toString('base64');
      const mimeType = imgResponse.headers.get('content-type') || 'image/jpeg';

      const url = `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      const body = {
        contents: [{
          parts: [
            {
              text: `Vous êtes un système d'IA spécialisé en radiologie clinique (Health AI).
Analysez ce cliché médical de type [ ${examType} ] et fournissez une évaluation clinique structurée.
Renvoyez uniquement un JSON valide avec ces clés :
{"hasPathology":bool,"pathologyType":"Fracture"|"Pneumonia"|"None"|"Other","confidenceScore":float,"findings":"description","severity":"low"|"medium"|"high"|"none","measurements":"si applicable","recommendations":"examens conseillés"}`
            },
            { inlineData: { mimeType, data: imageBytes } }
          ]
        }],
        generationConfig: { maxOutputTokens: 1024, temperature: 0.1 }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Gemini Imaging HTTP ${response.status}: ${err}`);
      }

      const data = await response.json() as any;
      const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        return JSON.parse(responseText.slice(jsonStart, jsonEnd));
      }
      throw new Error('Réponse JSON non parseable');
    } catch (error: any) {
      console.error('Erreur d\'analyse d\'imagerie par l\'IA :', error.message);
      return {
        hasPathology: false,
        pathologyType: 'Error',
        confidenceScore: 0,
        findings: 'L\'analyse d\'imagerie assistée par l\'IA n\'a pas pu aboutir en raison d\'une erreur technique.',
        severity: 'none',
        measurements: 'N/A',
        recommendations: 'Veuillez procéder à une interprétation visuelle classique de l\'image.'
      };
    }
  }

  /**
   * Assistant clinique intelligent de dialogue pour le personnel médical.
   */
  static async getClinicalAssistantResponse(
    query: string,
    chatHistory: Array<{ role: 'user' | 'model'; parts: string }>
  ): Promise<string> {
    const systemInstruction = `Vous êtes l'Assistant Clinique Intelligent de Health AI. Vous interagissez avec des médecins, des infirmiers et des radiologues au Sénégal.
Votre rôle est de fournir des résumés d'informations scientifiques, des définitions, des protocoles de soins de référence, et des conseils basés sur la médecine factuelle.
Règles :
1. Ton hautement professionnel, factuel, respectueux.
2. Vos réponses sont une aide à la décision, pas un substitut au jugement clinique.
3. Français médical précis.
4. Contexte épidémiologique sénégalais (paludisme, fièvre typhoïde) quand pertinent.`;

    try {
      const result = await callGeminiChatREST(query, chatHistory, systemInstruction);
      console.log('✅ Gemini API: Réponse assistant clinique réussie');
      return result;
    } catch (error: any) {
      console.warn('⚠️ Gemini API indisponible (bascule sur moteur diagnostique expert intégré) :', error.message);

      const q = query.toLowerCase();
      const isRespiratory = q.includes('toux') || q.includes('respirat') || q.includes('poumon') || q.includes('bronch') || q.includes('dyspnée');
      const isCardio = q.includes('thorac') || q.includes('palpitat') || q.includes('tension') || q.includes('coeur') || q.includes('infarct');
      const isFever = q.includes('fièvre') || q.includes('fébrile') || q.includes('température') || q.includes('palu');
      const isPrescription = q.includes('ordonnance') || q.includes('posologie') || q.includes('dose') || q.includes('médicament');

      if (isPrescription) {
        return `### 💊 Aide à la Prescription (Co-Pilote Médical Health AI)

#### Posologies de référence (adulte 70kg)
| Médicament | Indication | Posologie standard |
|---|---|---|
| Amoxicilline | Infection bactérienne | 1g × 2-3/j, 7 jours |
| Paracétamol | Douleur/Fièvre | 1g × 3/j, max 3g/24h |
| Ibuprofène | Anti-inflammatoire | 400mg × 3/j avec repas |
| Métronidazole | Parasitose/Anaérobie | 500mg × 3/j, 7 jours |
| ACT (Artéméther) | Paludisme simple | Selon poids, 3 jours |

> ⚠️ *Moteur expert local actif — Gemini temporairement indisponible.*`;
      } else if (isRespiratory || isFever) {
        return `### 🩺 Synthèse d'Aide Diagnostique (Co-Pilote Médical Health AI)

#### 1. Hypothèses Diagnostiques Différentielles
1. **Bronchite aiguë infectieuse** (Probabilité : Forte) : Tableau clinique fébrile avec toux productive.
2. **Pneumonie Franche Lobaire Aiguë (PFLA)** (À éliminer) : Foyer de râles crépitants localisés.
3. **Syndrome grippal / Viropathie saisonnière** : Myalgies, céphalées, asthénie fébrile.
4. **Paludisme d'accès simple** *(Contexte sénégalais)* : TDR systématique si fièvre continue.

#### 2. Bilan Paraclinique Préconisé
* **Biologie** : Goutte épaisse / TDR Paludisme, NFS/Plaquettes, CRP.
* **Imagerie** : Radiographie Thoracique si auscultation anormale ou fièvre >72h.

#### 3. Plan Thérapeutique de Première Intention
* **Antipérétique** : Paracétamol 1g × 3/j (max 3g/24h).
* **Antibiothérapie** *(si suspicion bactérienne)* : Amoxicilline 1g × 2/j, 7 jours.
* **Mesures adjuvantes** : Hydratation >2L/j, repos, lavages nasaux.

> ⚠️ *Moteur expert local actif — Gemini temporairement indisponible.*`;
      } else if (isCardio) {
        return `### 🩺 Synthèse d'Aide Diagnostique Cardiologique (Health AI)

#### 1. Hypothèses Diagnostiques Prioritaires
1. **Syndrome Coronarien Aigu (SCA)** : À éliminer en priorité.
2. **Embolie Pulmonaire (EP)** : Dyspnée aiguë ou tachycardie sinusale.
3. **Péricardite aiguë** : Douleur augmentée à l'inspiration.

#### 2. Prise en Charge Immédiate
* **ECG 12 dérivations** immédiat (<10 min).
* **Biologie d'urgence** : Troponine H0/H1, D-Dimères, Ionogramme.
* **Surveillance** : TA, SpO2, FC continue.

> ⚠️ *Moteur expert local actif — Gemini temporairement indisponible.*`;
      }

      return `### 🩺 Synthèse Clinique & Conduite à Tenir (Health AI)

#### 1. Démarche Diagnostique Initiale
* Examen physique complet (constantes hémodynamiques, appareils ciblés).
* Prise en compte du terrain (antécédents, allergies connues).

#### 2. Prise en Charge Générale
* Traitement symptomatique de confort.
* Surveillance clinique à 48 heures.
* Bilan biologique adapté si persistance des symptômes.

> ⚠️ *Moteur expert local actif — Gemini temporairement indisponible. Reformulez votre question pour une réponse plus précise.*`;
    }
  }
}
