import { Router } from 'express';
import { getSubscriptions, addSubscription } from '../controllers/subscriptionController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getSubscriptions);
router.post('/', addSubscription);

export default router;
