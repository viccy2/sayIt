import { Router } from 'express';
import * as HistoryController from '../controllers/history.controller';

const router = Router();

// Endpoint: GET /api/history
router.get('/', HistoryController.getHistory);
router.delete('/:id', HistoryController.deleteHistoryItem);

export default router;
