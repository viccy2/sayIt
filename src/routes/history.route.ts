import { Router } from 'express';
import { getUserHistory, deleteHistoryItem } from '../controllers/history.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// GET /api/history -> List all
router.get('/', protect, getUserHistory);

// DELETE /api/history/:id -> Remove one
// CHANGE THIS LINE: from .get to .delete
router.delete('/:id', protect, deleteHistoryItem); 

export default router;
