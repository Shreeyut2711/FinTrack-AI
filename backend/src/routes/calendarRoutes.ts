import { Router } from 'express';
import { getEvents, addEvent } from '../controllers/calendarController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();
router.use(authenticateJWT);

router.get('/', getEvents);
router.post('/', addEvent);

export default router;
