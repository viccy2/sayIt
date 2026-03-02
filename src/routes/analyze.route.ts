import { Router } from 'express';
import * as analyzeController from '../controllers/analyze.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/analyze
 * @desc    Analyze text (Language + Meaning) and save to history
 * @access  Private (Requires JWT)
 */
router.post('/', protect, analyzeController.analyzeText);

export default router;
