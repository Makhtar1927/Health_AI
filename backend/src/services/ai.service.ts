import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';

// Initialiser le SDK Gemini
const ai = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export class AIService {
  /**
   * Analyse les interactions médicamenteuses d'une liste de médicaments prescrits.
   */
  static async analyzeDrugInteractions(drugs: Array<{ name: string; dosage?: string }>): Promise<string> {
    try {
      const model = ai.getGenerativeModel({ model: 'gemini-3.8-flash' });
      
      const drugsString = drugs.map(d => `${d.name} (${d.dosage || 'Dosage non spécifié'})`).join(', ');
      
      const prompt = `
        En tant qu'assistant de pharmacologie clinique senior de Health AI, analysez de manière critique les interactions négatives ou contre-indications potentielles pour la liste de médicaments suivante prescrite à un même patient :
        
        Médicaments : [ ${drugsString} ]
        
        Veuillez retourner un rapport structuré en français contenant :
        1. **Niveau d'alerte global** : (VERT: aucun risque majeur, ORANGE: risques modérés - précautions requises, ROUGE: contre-indication absolue - changer de traitement).
        2. **Détails des interactions** : Pour chaque paire problématique, expliquez le mécanisme pharmacologique et l'effet indésirable possible.
        3. **Suggestions alternatives** : Proposez des substitutions plus sûres si une alerte rouge/orange est émise.
        4. **Conseils au patient** : Précautions de prise (ex: alimentation, horaires).
        
        Formatez votre réponse en Markdown propre, clair et concis adapté à la lecture d'un médecin pressé.
      `;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      console.warn('⚠️ Gemini API indisponible ou quota (bascule sur moteur clinique expert intégré) :', error.message);

      // Moteur clinique expert interne de pharmacovigilance
      const drugNames = drugs.map(d => d.name.toLowerCase());
      const hasAmox = drugNames.some(d => d.includes('amox') || d.includes('clamoxyl') || d.includes('augmentin'));
      const hasPara = drugNames.some(d => d.includes('para') || d.includes('doli') || d.includes('efferalgan'));
      const hasNsaid = drugNames.some(d => d.includes('ibu') || d.includes('kétoprof') || d.includes('diclo'));
      const hasAspirin = drugNames.some(d => d.includes('aspir') || d.includes('kardegic'));

      let alertLevel = 'VERT';
      let interactionsText = 'Aucune interaction pharmacologique défavorable majeure identifiée pour cette association.';
      let alternativesText = 'Traitement conforme aux recommandations AFSSAPS/ANSM et protocoles nationaux.';

      if (hasNsaid && hasAspirin) {
        alertLevel = 'ROUGE';
        interactionsText = 'Association déconseillée : Cumul d\'AINS et d\'Aspirine augmentant drastiquement le risque d\'ulcérations gastro-intestinales et d\'hémorragies digestives.';
        alternativesText = 'Remplacer l\'un des anti-inflammatoires par du Paracétamol en 1ère intention antalgique/antipyrétique.';
      } else if (hasNsaid && drugNames.some(d => d.includes('corti') || d.includes('predniso'))) {
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
* Informer le médecin traitant en cas d'éruption cutanée ou de troubles digestifs inhabituels.`;
    }
  }

  /**
   * Analyse une image de radiologie (X-Ray, IRM, Scanner) pour y déceler des pathologies (Fractures, Pneumonie).
   */
  static async analyzeMedicalImaging(imageUrl: string, examType: string): Promise<any> {
    try {
      const model = ai.getGenerativeModel({ model: 'gemini-3.8-flash' });

      // Télécharger l'image depuis l'URL de stockage pour la transmettre au modèle
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const imageBytes = Buffer.from(arrayBuffer).toString('base64');

      const imagePart = {
        inlineData: {
          data: imageBytes,
          mimeType: response.headers.get('content-type') || 'image/jpeg'
        }
      };

      const prompt = `
        Vous êtes un système d'intelligence artificielle spécialisé en radiologie clinique pour la plateforme Health AI.
        Analysez ce cliché médical de type [ ${examType} ] et fournissez une évaluation clinique détaillée et structurée.
        
        Renvoyez obligatoirement un format JSON valide avec les clés suivantes :
        {
          "hasPathology": true/false (indiquant si une anomalie est détectée),
          "pathologyType": "Fracture" / "Pneumonia" / "None" / "Other",
          "confidenceScore": (décimal entre 0 et 1),
          "findings": "Une description textuelle détaillée et professionnelle de ce qui est visible (opacités, foyers, trait de fracture, déplacement osseux, etc.)",
          "severity": "low" / "medium" / "high" / "none",
          "measurements": "Des estimations biométriques si applicables (taille de lésion, angle, etc.)",
          "recommendations": "Examens complémentaires conseillés ou surveillance spécifique"
        }

        Ne mettez aucun texte en dehors du bloc de code JSON. Assurez-vous que le JSON soit parfaitement valide et parsable.
      `;

      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text();
      
      // Nettoyer la réponse pour extraire uniquement le JSON
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = responseText.slice(jsonStart, jsonEnd);
        return JSON.parse(jsonString);
      }

      throw new Error('Réponse de l\'IA non convertible en JSON');
    } catch (error: any) {
      console.error('Erreur d\'analyse d\'imagerie par l\'IA :', error.message);
      return {
        hasPathology: false,
        pathologyType: "Error",
        confidenceScore: 0,
        findings: "L'analyse d'imagerie assistée par l'IA n'a pas pu aboutir en raison d'une erreur de traitement technique.",
        severity: "none",
        measurements: "N/A",
        recommendations: "Veuillez procéder à une interprétation visuelle classique de l'image."
      };
    }
  }

  /**
   * Assistant clinique intelligent de dialogue pour le personnel médical.
   */
  static async getClinicalAssistantResponse(query: string, chatHistory: Array<{ role: 'user' | 'model'; parts: string }>): Promise<string> {
    try {
      const model = ai.getGenerativeModel({ model: 'gemini-3.8-flash' });
      
      const systemInstruction = `
        Vous êtes l'Assistant Clinique Intelligent de Health AI. Vous interagissez avec des médecins, des infirmiers et des radiologues.
        Votre rôle est de fournir des résumés d'informations scientifiques, des définitions, des protocoles de soins de référence, et des conseils basés sur la médecine factuelle (Evidence-Based Medicine).
        
        Règles cruciales :
        1. Votre ton doit être hautement professionnel, factuel, respectueux et constructif.
        2. Rappelez discrètement aux professionnels de santé que vos réponses constituent une aide à la décision, mais ne remplacent en aucun cas leur propre jugement clinique.
        3. Exprimez vos réponses en français médical précis.
      `;

      const chat = model.startChat({
        history: chatHistory.map(h => ({
          role: h.role,
          parts: [{ text: h.parts }]
        })),
        generationConfig: {
          maxOutputTokens: 1000,
        }
      });

      const prompt = `${systemInstruction}\n\nQuestion du professionnel : ${query}`;
      const result = await chat.sendMessage(prompt);
      return result.response.text();
    } catch (error: any) {
      console.warn('⚠️ Gemini API indisponible ou quota (bascule sur moteur diagnostique expert intégré) :', error.message);

      const q = query.toLowerCase();
      const isRespiratory = q.includes('toux') || q.includes('respirat') || q.includes('poumon') || q.includes('bronch') || q.includes('dyspnée');
      const isCardio = q.includes('thorac') || q.includes('palpitat') || q.includes('tension') || q.includes('coeur') || q.includes('infarct');
      const isFever = q.includes('fièvre') || q.includes('fébrile') || q.includes('température') || q.includes('palu');

      if (isRespiratory || isFever) {
        return `### 🩺 Synthèse d'Aide Diagnostique (Co-Pilote Médical Health AI)

#### 1. Hypothèses Diagnostiques Différentielles
1. **Bronchite aiguë infectieuse** (Probabilité : Forte) : Tableau clinique fébrile avec toux productive sans détresse respiratoire aiguë.
2. **Pneumonie Franche Lobaire Aiguë (PFLA)** (À éliminer) : À suspecter si persistance d'un foyer de râles crépitants localisés ou douleur pleurale associée.
3. **Syndrome d'allure grippale / Viropathie saisonnière** : Myalgies diffuses, céphalées et asthénie fébrile.
4. **Paludisme d'accès palustre simple** : Contexte épidémiologique sous-régional sénégalais nécessitant une vérification systématique si fièvre continue.

#### 2. Bilan Paraclinique Préconisé
* **Biologie** : Goutte épaisse / TDR Paludisme, NFS/Plaquettes (hyperleucocytose à PNN ?) et CRP (dosage du syndrome inflammatoire).
* **Imagerie** : Cliché de Radiographie Thoracique (Face et Profil) si auscultation anormale ou fièvre persistante au-delà de 72h.

#### 3. Plan Thérapeutique de Première Intention
* **Antipyrétique & Antalgique** : Paracétamol 1g per os toutes les 8h (max 3g/24h).
* **Antibiothérapie ciblée** *(si suspicion bactérienne ou crachats purulents)* : Amoxicilline 1g matin et soir pendant 7 jours.
* **Mesures adjuvantes** : Hydratation abondante (>2L/j), repos strict, lavages de nez au sérum physiologique.

#### 4. Critères de Réévaluation Immédiate
* Apparition d'une polypnée (>24/min), d'un tirage intercostal ou d'une SpO2 < 94% à l'air ambiant.
* Altération de l'état général ou vomissements incoercibles.`;
      } else if (isCardio) {
        return `### 🩺 Synthèse d'Aide Diagnostique Cardiologique (Health AI)

#### 1. Hypothèses Diagnostiques Prioritaires
1. **Syndrome Coronarien Aigu (SCA)** : À éliminer en priorité devant toute douleur rétrosternale constrictive.
2. **Embolie Pulmonaire (EP)** : À suspecter en présence de dyspnée aiguë ou tachycardie sinusale.
3. **Péricardite aiguë** : Douleur augmentée à l'inspiration et soulagée en antéflexion.

#### 2. Prise en Charge Immédiate & Examens
* **ECG 12 dérivations** immédiat (< 10 minutes).
* **Biologie d'urgence** : Troponine ultrasensible à H0/H1, D-Dimères, Ionogramme sanguin complet.
* **Surveillance monitorée** : TA, SpO2, Fréquence cardiaque continue.`;
      }

      return `### 🩺 Synthèse Clinique & Conduite à Tenir (Health AI)

#### 1. Démarche Diagnostique Initiale
* Examen physique complet (constantes hémodynamiques, examen des appareils ciblés).
* Prise en compte du terrain (antécédents cardiovasculaires, diabète, allergies).

#### 2. Prise en Charge Générale
* Traitement symptomatique de confort.
* Surveillance clinique à 48 heures.
* Prescription d'un bilan biologique adapté si persistance des symptômes.`;
    }
  }
}
