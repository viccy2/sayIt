import { Router } from 'express';
// Change 'handleAnalysis' to 'analyzeText' here
import { analyzeText } from '../controllers/analyze.controller';
import { protect } from '../middleware/auth.middleware'; // Ensure your auth middleware is here

const router = Router();

// Ensure the route uses the correct function name
router.post('/', protect, analyzeText);

export default router;
