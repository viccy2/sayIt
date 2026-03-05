import { Router } from 'express';
import { handleAnalysis } from '../controllers/analyze.controller';
//import { protect } from '../middleware/auth.middleware';
const router = Router();

router.post('/', handleAnalysis);

export default router;
