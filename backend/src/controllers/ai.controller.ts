import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service';
import { z } from 'zod';

export class AIController {
  /**
   * Analyse des interactions médicamenteuses
   */
  static async analyzePrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const drugSchema = z.object({
        drugs: z.array(
          z.object({
            name: z.string().min(1, 'Le nom du médicament est obligatoire'),
            dosage: z.string().optional()
          })
        ).min(1, 'Au moins un médicament est requis pour l\'analyse')
      });

      const parsed = drugSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Données de prescription invalides.',
          details: parsed.error.format()
        });
      }

      const { drugs } = parsed.data;
      const analysis = await AIService.analyzeDrugInteractions(drugs);

      return res.status(200).json({
        success: true,
        analysis
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Analyse d'imagerie médicale (X-ray, IRM, Scanner)
   */
  static async analyzeImaging(req: Request, res: Response, next: NextFunction) {
    try {
      const imagingSchema = z.object({
        imageUrl: z.string().url('L\'URL de l\'image doit être valide'),
        examType: z.string().min(1, 'Le type d\'examen est obligatoire')
      });

      const parsed = imagingSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Données d\'analyse d\'image invalides.',
          details: parsed.error.format()
        });
      }

      const { imageUrl, examType } = parsed.data;
      const analysisResults = await AIService.analyzeMedicalImaging(imageUrl, examType);

      return res.status(200).json({
        success: true,
        results: analysisResults
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Assistant clinique virtuel pour le personnel médical
   */
  static async getAssistantResponse(req: Request, res: Response, next: NextFunction) {
    try {
      const assistantSchema = z.object({
        query: z.string().min(1, 'La question de l\'utilisateur ne peut pas être vide'),
        history: z.array(
          z.object({
            role: z.enum(['user', 'model']),
            parts: z.string().min(1)
          })
        ).default([])
      });

      const parsed = assistantSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Paramètres d\'assistant invalides.',
          details: parsed.error.format()
        });
      }

      const { query, history } = parsed.data;
      const response = await AIService.getClinicalAssistantResponse(query, history);

      return res.status(200).json({
        success: true,
        response
      });
    } catch (error) {
      next(error);
    }
  }
}
