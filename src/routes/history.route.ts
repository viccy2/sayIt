import { Router } from 'express';
import { getUserHistory } from '../controllers/history.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Protect this route so only the logged-in user sees THEIR history
router.get('/', protect, getUserHistory);

export default router;
