import { Router } from 'express';
import { register, login, getProfile, updateSettings } from '../controllers/authController';
import { authenticateJWT } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.get('/profile', authenticateJWT, getProfile);
router.put('/settings', authenticateJWT, updateSettings);

export default router;
