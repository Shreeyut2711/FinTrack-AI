import { Router } from 'express';
import { getSecurityAlerts, updateAlertStatus } from '../controllers/securityController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();
router.use(authenticateJWT);

router.get('/', getSecurityAlerts);
router.put('/:id', updateAlertStatus);

export default router;
