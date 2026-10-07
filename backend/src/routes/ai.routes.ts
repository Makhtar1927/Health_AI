import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authenticateUser, requireRole } from '../middlewares/auth.middleware';
import { strictLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Toutes les routes IA nécessitent d'être authentifié et sont soumises au rate limiting strict
router.use(authenticateUser);
router.use(strictLimiter);

// Analyse de prescription (Docteurs et pharmaciens si applicable)
router.post('/analyze-prescription', requireRole(['doctor', 'admin']), AIController.analyzePrescription);

// Analyse d'imagerie (Docteurs et radiologues)
router.post('/analyze-imaging', requireRole(['doctor', 'radiologue', 'admin']), AIController.analyzeImaging);

// Assistant clinique intelligent (Tous les professionnels de santé)
router.post('/clinical-assistant', requireRole(['doctor', 'radiologue', 'accueil', 'cashier', 'admin']), AIController.getAssistantResponse);

export default router;
