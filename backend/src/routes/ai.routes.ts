import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authenticateUser, requireRole } from '../middlewares/auth.middleware';
import { strictLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Rôles reconnus dans la base de données Supabase (profiles.role)
const MEDICAL_STAFF = ['doctor', 'radiology', 'reception', 'cashier', 'pharmacist', 'admin_hospital', 'superadmin'];
const DOCTORS_ONLY = ['doctor', 'admin_hospital', 'superadmin'];
const RADIOLOGY_STAFF = ['doctor', 'radiology', 'admin_hospital', 'superadmin'];

// Toutes les routes IA nécessitent d'être authentifié et sont soumises au rate limiting strict
router.use(authenticateUser);
router.use(strictLimiter);

// Analyse de prescription — Médecins + admins
router.post('/analyze-prescription', requireRole(DOCTORS_ONLY), AIController.analyzePrescription);

// Analyse d'imagerie — Médecins + radiologues
router.post('/analyze-imaging', requireRole(RADIOLOGY_STAFF), AIController.analyzeImaging);

// Assistant clinique intelligent — Tous les professionnels de santé
router.post('/clinical-assistant', requireRole(MEDICAL_STAFF), AIController.getAssistantResponse);

export default router;
