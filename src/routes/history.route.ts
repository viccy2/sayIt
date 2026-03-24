import { Router } from 'express';
import { 
  getUserHistory, 
  deleteHistoryItem, 
  clearUserHistory // Add this import
} from '../controllers/history.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// GET /api/history -> List all
router.get('/', protect, getUserHistory);

// DELETE /api/history -> Clear all (NEW)
router.delete('/', protect, clearUserHistory);

// DELETE /api/history/:id -> Remove one
router.delete('/:id', protect, deleteHistoryItem); 

export default router;
