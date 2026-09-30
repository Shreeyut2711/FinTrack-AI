import { Router } from 'express';
import { generateReport } from '../controllers/reportController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', generateReport);

export default router;
