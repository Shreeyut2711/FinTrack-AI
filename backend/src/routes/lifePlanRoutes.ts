import { Router } from 'express';
import { getLifePlans, createLifePlan } from '../controllers/lifePlanController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();
router.use(authenticateJWT);

router.get('/', getLifePlans);
router.post('/', createLifePlan);

export default router;
