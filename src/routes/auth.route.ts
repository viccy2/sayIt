import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware'; // Verify this path matches your file structure

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/current_user
 * @desc    Get logged in user data
 * @access  Private
 */
router.get('/current_user', protect, authController.getCurrentUser);

export default router;
