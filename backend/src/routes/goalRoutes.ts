import { Router } from 'express';
import { getGoals, createGoal, addContributionToGoal } from '../controllers/goalController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getGoals);
router.post('/', createGoal);
router.post('/:id/contribute', addContributionToGoal);

export default router;
