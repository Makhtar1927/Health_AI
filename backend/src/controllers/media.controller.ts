import { Request, Response, NextFunction } from 'express';
import { CloudinaryService } from '../services/cloudinary.service';
import { z } from 'zod';

export class MediaController {
  /**
   * Demande de signature d'upload sécurisée
   */
  static getUploadSignature(req: Request, res: Response, next: NextFunction) {
    try {
      const signatureSchema = z.object({
        folder: z.enum(['profiles', 'dicom', 'prescriptions', 'invoices']),
        publicId: z.string().optional()
      });

      const parsed = signatureSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Dossier de stockage non valide.',
          details: parsed.error.format()
        });
      }

      const { folder, publicId } = parsed.data;
      const signatureData = CloudinaryService.generateUploadSignature(folder, publicId);

      return res.status(200).json({
        success: true,
        ...signatureData
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtention d'un lien d'accès sécurisé temporaire pour un média privé
   */
  static getSecureLink(req: Request, res: Response, next: NextFunction) {
    try {
      const linkSchema = z.object({
        publicId: z.string().min(1, 'L\'identifiant public du média est obligatoire'),
        expirationSeconds: z.number().int().positive().default(300)
      });

      const parsed = linkSchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Paramètres de récupération invalides.',
          details: parsed.error.format()
        });
      }

      const { publicId, expirationSeconds } = parsed.data;
      const secureUrl = CloudinaryService.getSecureRetrieveUrl(publicId, expirationSeconds);

      return res.status(200).json({
        success: true,
        secureUrl
      });
    } catch (error) {
      next(error);
    }
  }
}
