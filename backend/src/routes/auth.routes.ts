import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// Auth Endpoints
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// Admin / Staff Management Endpoints
router.get('/users', AuthController.getUsersByRoles);
router.post('/create-staff', AuthController.createStaffAccount);
router.post('/toggle-suspension', AuthController.toggleUserSuspension);
router.post('/transfer', AuthController.transferUserAffiliation);
router.post('/delete-user', AuthController.deleteUser);

export default router;
