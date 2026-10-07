import { Router } from 'express';
import { MediaController } from '../controllers/media.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = Router();

// Toutes les requêtes médias requièrent une authentification active
router.use(authenticateUser);

// Signature d'upload sécurisé
router.post('/upload-signature', MediaController.getUploadSignature);

// Récupération d'un lien d'accès sécurisé temporaire
router.get('/secure-link', MediaController.getSecureLink);

export default router;
