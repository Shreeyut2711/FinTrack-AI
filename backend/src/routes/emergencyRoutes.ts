import { Router } from 'express';
import {
  getEmergencyFundDetails,
  updateEmergencyTarget,
  addContribution,
  emergencyWithdrawalWorkflow
} from '../controllers/emergencyController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getEmergencyFundDetails);
router.put('/target', updateEmergencyTarget);
router.post('/contribution', addContribution);
router.post('/withdrawal', emergencyWithdrawalWorkflow);

export default router;
