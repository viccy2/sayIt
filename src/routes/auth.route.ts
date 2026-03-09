import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';
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
router.post('/forgot-password', authLimiter, authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password using token
 */
router.post('/reset-password/:token', authController.resetPassword);

router.post('/resend-verification', authLimiter,  authController.resendVerification);
/**
 * @route   GET /api/auth/current_user
 * @desc    Get current user profile (This fixes your 404/Redirect loop)
 * @access  Private
 */
router.get('/current_user', protect, authController.getCurrentUser);

router.get('/verify-email/:token', authController.verifyEmail);
// DANGER: This will delete all data. Use only for development.
router.get('/dev/clear-database', async (req, res) => {
  try {
    // 1. Clear History first (to avoid foreign key constraint errors)
    await prisma.history.deleteMany({});
    
    // 2. Clear Users
    await prisma.user.deleteMany({});

    res.status(200).send(`
      <div style="font-family: sans-serif; text-align: center; padding-top: 50px;">
        <h1 style="color: #16a34a;">Database Wiped!</h1>
        <p>All users and history records have been deleted.</p>
        <a href="/">Go back to Login</a>
      </div>
    `);
  } catch (error: any) {
    res.status(500).send("Error clearing database: " + error.message);
  }
});

export default router;
