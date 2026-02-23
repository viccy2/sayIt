import { Router } from 'express';
import * as AnalyzeController from '../controllers/analyze.controller';

const router = Router();

// Endpoint: POST /api/analyze
router.post('/', AnalyzeController.analyzeText);

export default router;
