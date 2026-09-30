import { Router } from 'express';
import { runSimulation, getScenarios } from '../controllers/digitalTwinController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();
router.use(authenticateJWT);

router.get('/', getScenarios);
router.post('/simulate', runSimulation);

export default router;
