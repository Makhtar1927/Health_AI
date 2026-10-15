import { Router } from 'express';
import { FacilityController } from '../controllers/facility.controller';

const router = Router();

// Routes Établissements & Spécialités
router.get('/', FacilityController.getFacilities);
router.post('/', FacilityController.createFacility);
router.put('/:id', FacilityController.updateFacility);
router.delete('/:id', FacilityController.deleteFacility);
router.get('/appointments/all', FacilityController.getAppointments);
router.post('/appointments', FacilityController.createAppointment);
router.patch('/appointments/:id/status', FacilityController.updateAppointmentStatus);
router.get('/:id', FacilityController.getFacilityById);
router.put('/:id/specialties', FacilityController.updateFacilitySpecialties);
router.get('/:id/slots', FacilityController.getAvailableSlots);

export default router;
