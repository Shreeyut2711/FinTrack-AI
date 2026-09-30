import { Router } from 'express';
import { getTransactions, addTransaction, deleteTransaction, getDashboardSummary } from '../controllers/transactionController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getTransactions);
router.post('/', addTransaction);
router.delete('/:id', deleteTransaction);
router.get('/dashboard-summary', getDashboardSummary);

export default router;
