import { Router } from 'express';
import { 
  getUserHistory, 
  deleteHistoryItem, 
  clearUserHistory 
} from '../controllers/history.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// GET /api/history -> list all
router.get('/', protect, getUserHistory);

// DELETE /api/history -> clear all 
router.delete('/', protect, clearUserHistory);

// DELETE /api/history/:id -> Remove one 
router.delete('/:id', protect, deleteHistoryItem); 

export default router;
