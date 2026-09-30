import { Router } from 'express';
import { askAIAssistant, suggestCategory } from '../controllers/aiController';
import { authenticateJWT } from '../middleware/auth';
import { aiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateJWT);

router.post('/assistant', aiRateLimiter, askAIAssistant);
router.post('/categorize', aiRateLimiter, suggestCategory);

export default router;
