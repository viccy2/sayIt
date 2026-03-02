import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { protect } from '../middleware/auth'; // Import the middleware

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// NEW PROTECTED ROUTE
// This matches your frontend's GET /api/auth/current_user
router.get('/current_user', protect, authController.getCurrentUser);

export default router;
