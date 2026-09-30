import { Router } from 'express';
import { getMemories, saveMemory, deleteMemory } from '../controllers/memoryController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();
router.use(authenticateJWT);

router.get('/', getMemories);
router.post('/', saveMemory);
router.delete('/:id', deleteMemory);

export default router;
