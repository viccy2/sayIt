import { Router } from 'express';
import { getUserHistory, deleteHistoryItem } from '../controllers/history.controller'; // Added deleteHistoryItem
import { protect } from '../middleware/auth.middleware';

const router = Router();

// GET /api/history - Fetch all records for the logged-in user
router.get('/', protect, getUserHistory);

// DELETE /api/history/:id - Delete a specific record by its ID
router.get('/:id', protect, deleteHistoryItem); 

export default router;
