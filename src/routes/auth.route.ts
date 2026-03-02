import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/current_user
 * @desc    Get current user profile (This fixes your 404/Redirect loop)
 * @access  Private
 */
router.get('/current_user', protect, authController.getCurrentUser);

export default router;
