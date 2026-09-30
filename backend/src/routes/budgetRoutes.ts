import { Router } from 'express';
import { getBudgets, createOrUpdateBudget } from '../controllers/budgetController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getBudgets);
router.post('/', createOrUpdateBudget);

export default router;
