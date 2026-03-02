import { Router } from 'express';
import * as historyController from '../controllers/history.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Protect all history routes
router.use(protect);

router.get('/', historyController.getHistory);
router.delete('/:id', historyController.deleteHistoryItem);

export default router;
