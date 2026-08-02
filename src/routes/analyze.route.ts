import { Router } from 'express';
import { analyzeText } from '../controllers/analyze.controller';
import { protect } from '../middleware/auth.middleware'; // Ensure your auth middleware is here

const router = Router();
router.post('/', protect, analyzeText);

export default router;
