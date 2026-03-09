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
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password using token
 */
router.post('/reset-password/:token', authController.resetPassword);

router.post('/resend-verification', authController.resendVerification);
/**
 * @route   GET /api/auth/current_user
 * @desc    Get current user profile (This fixes your 404/Redirect loop)
 * @access  Private
 */
router.get('/current_user', protect, authController.getCurrentUser);

router.get('/verify-email/:token', authController.verifyEmail);

export default router;
