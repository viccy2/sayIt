import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';
// Models needed for the dev-reset route
import User from '../models/user.model';
import History from '../models/history.model';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user and send verification OTP
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset 6-digit OTP
 */
router.post('/forgot-password', authLimiter, authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using 6-digit OTP and email from body
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Send a new verification OTP
 */
router.post('/resend-verification', authLimiter, authController.resendVerification);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify account using 6-digit OTP from body
 */
router.post('/verify-email', authController.verifyEmail);

/**
 * @route   GET /api/auth/current_user
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/current_user', protect, authController.getCurrentUser);

/**
 * @route   GET /api/auth/dev/clear-database
 * @desc    DEVELOPMENT ONLY: Nukes the User and History collections
 * @access  Public (Dev)
 */
router.get('/dev/clear-database', async (req, res) => {
  // Security check: You might want to wrap this in an if(process.env.NODE_ENV === 'development')
  try {
    // Capture counts before deletion for the summary
    const userCount = await User.countDocuments();
    const historyCount = await History.countDocuments();

    // 1. Clear History (child data)
    await History.deleteMany({});
    
    // 2. Clear Users (parent data)
    await User.deleteMany({});

    res.status(200).send(`
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; text-align: center; padding: 60px 20px; background-color: #f8fafc; min-height: 100vh;">
        <div style="max-width: 500px; margin: auto; background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
          <div style="background: #fee2e2; color: #ef4444; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; font-size: 30px; margin: 0 auto 20px;">🗑️</div>
          <h1 style="color: #1e293b; margin-bottom: 8px;">Database Wiped</h1>
          <p style="color: #64748b; margin-bottom: 24px;">Mongoose collections have been cleared successfully.</p>
          
          <div style="display: flex; justify-content: space-around; background: #f1f5f9; padding: 20px; border-radius: 16px; margin-bottom: 24px;">
            <div>
              <div style="font-size: 24px; font-weight: 800; color: #6366f1;">${userCount}</div>
              <div style="font-size: 12px; color: #64748b; text-transform: uppercase;">Users</div>
            </div>
            <div style="border-left: 1px solid #e2e8f0;"></div>
            <div>
              <div style="font-size: 24px; font-weight: 800; color: #6366f1;">${historyCount}</div>
              <div style="font-size: 12px; color: #64748b; text-transform: uppercase;">History</div>
            </div>
          </div>
          
          <a href="/" style="display: inline-block; background: #1e293b; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700;">Return to App</a>
        </div>
      </div>
    `);
  } catch (error: any) {
    console.error("Wipe Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Database reset failed", 
      error: error.message 
    });
  }
});

export default router;
