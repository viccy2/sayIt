import { Router } from 'express';
import { getUserHistory } from '../controllers/history.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// GET /api/history
router.get('/', protect, getUserHistory);

export default router;
