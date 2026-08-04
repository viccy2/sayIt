import { Router, Request, Response } from 'express';
import * as authController from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';
import User from '../models/user.model';
import History from '../models/history.model';

const router = Router();

/**
 * AUTHENTICATION ROUTES
 */
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/resend-verification', authLimiter, authController.resendVerification);
router.post('/verify-email', authController.verifyEmail);

/**
 * USER PROFILE ROUTES
 */
router.get('/current_user', protect, authController.getCurrentUser);

/**
 * @route   GET /api/auth/dev/clear-database
 * @desc    reset database for Users and Histories
 */
router.get('/dev/clear-database', async (req: Request, res: Response) => {
  try {
    const userCount = await User.countDocuments();
    const historyCount = await History.countDocuments();
    await History.deleteMany({});
    await User.deleteMany({});
    res.status(200).send(`
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; text-align: center; padding: 60px 20px; background-color: #f8fafc; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
        <div style="max-width: 500px; width: 100%; background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
          <div style="background: #fee2e2; color: #ef4444; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; font-size: 30px; margin: 0 auto 20px;">🗑️</div>
          <h1 style="color: #1e293b; margin-bottom: 8px; font-size: 24px;">Database Wiped</h1>
          <p style="color: #64748b; margin-bottom: 24px;">Your Atlas collections have been cleared.</p>
          
          <div style="display: flex; justify-content: space-around; background: #f1f5f9; padding: 20px; border-radius: 16px; margin-bottom: 24px;">
            <div>
              <div style="font-size: 24px; font-weight: 800; color: #6366f1;">${userCount}</div>
              <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Users</div>
            </div>
            <div style="border-left: 1px solid #cbd5e1; height: 40px; align-self: center;"></div>
            <div>
              <div style="font-size: 24px; font-weight: 800; color: #6366f1;">${historyCount}</div>
              <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Histories</div>
            </div>
          </div>
          
          <a href="/" style="display: inline-block; background: #6366f1; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; transition: background 0.2s;">Return to Dashboard</a>
        </div>
      </div>
    `);
  } catch (error: any) {
    console.error("CRITICAL: Database Reset Error ->", error);
    res.status(500).send(`
      <div style="font-family: sans-serif; padding: 40px; text-align: center;">
        <h2 style="color: #ef4444;">Reset Failed</h2>
        <pre style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: left; display: inline-block;">${error.message}</pre>
      </div>
    `);
  }
});

export default router;
