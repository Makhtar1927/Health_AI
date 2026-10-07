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
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const drugsString = drugs.map(d => `${d.name} (${d.dosage || 'Dosage non spécifié'})`).join(', ');
      
      const prompt = `
        En tant qu'assistant de pharmacologie clinique senior de Sunu Santé, analysez de manière critique les interactions négatives ou contre-indications potentielles pour la liste de médicaments suivante prescrite à un même patient :
        
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
      console.error('Erreur lors de l\'analyse des interactions médicamenteuses :', error.message);
      return `### ⚠️ Erreur de Diagnostic de l'IA\nImpossible d'effectuer l'analyse pharmacologique en temps réel. Veuillez vérifier manuellement le dictionnaire des interactions.`;
    }
  }

  /**
   * Analyse une image de radiologie (X-Ray, IRM, Scanner) pour y déceler des pathologies (Fractures, Pneumonie).
   */
  static async analyzeMedicalImaging(imageUrl: string, examType: string): Promise<any> {
    try {
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-pro' });

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
        Vous êtes un système d'intelligence artificielle spécialisé en radiologie clinique pour la plateforme Sunu Santé.
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
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const systemInstruction = `
        Vous êtes l'Assistant Clinique Intelligent de Sunu Santé. Vous interagissez avec des médecins, des infirmiers et des radiologues.
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
      console.error('Erreur assistant clinique IA :', error.message);
      return "Une erreur de connexion au service d'IA clinique est survenue. Veuillez réessayer dans quelques instants.";
    }
  }
}
