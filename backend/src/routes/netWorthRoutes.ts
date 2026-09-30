import { Router } from 'express';
import { getNetWorthSummary, addAssetLiability } from '../controllers/netWorthController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getNetWorthSummary);
router.post('/', addAssetLiability);

export default router;
