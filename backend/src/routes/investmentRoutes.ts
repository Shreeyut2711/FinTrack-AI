import { Router } from 'express';
import { getInvestments, addInvestment, calculateSIP, calculateEMI } from '../controllers/investmentController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getInvestments);
router.post('/', addInvestment);
router.post('/sip-calculator', calculateSIP);
router.post('/emi-calculator', calculateEMI);

export default router;
