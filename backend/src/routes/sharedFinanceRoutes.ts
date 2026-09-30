import { Router } from 'express';
import { getHouseholdDetails, addSharedExpense } from '../controllers/sharedFinanceController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();
router.use(authenticateJWT);

router.get('/', getHouseholdDetails);
router.post('/expenses', addSharedExpense);

export default router;
