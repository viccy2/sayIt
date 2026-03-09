import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';
import { PrismaClient } from '@prisma/client'; // Import the client

const router = Router();
const prisma = new PrismaClient(); // Initialize the client

/**
 * @route   POST /api/auth/register
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/forgot-password
 */
router.post('/forgot-password', authLimiter, authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * FIXED: Removed /:token. Data now comes in req.body (otp, email, password)
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @route   POST /api/auth/resend-verification
 */
router.post('/resend-verification', authLimiter, authController.resendVerification);

/**
 * @route   GET /api/auth/current_user
 */
router.get('/current_user', protect, authController.getCurrentUser);

/**
 * @route   POST /api/auth/verify-email
 * FIXED: Changed from GET to POST and removed /:token
 */
router.post('/verify-email', authController.verifyEmail);

/**
 * @route   GET /api/auth/dev/clear-database
 * @desc    Nuclear reset for development testing
 */
router.get('/dev/clear-database', async (req, res) => {
  try {
    // 1. Clear History first (to avoid foreign key constraint errors)
    await prisma.history.deleteMany({});
    
    // 2. Clear Users
    await prisma.user.deleteMany({});

    res.status(200).send(`
      <div style="font-family: sans-serif; text-align: center; padding-top: 50px;">
        <h1 style="color: #16a34a;">Database Wiped Successfully</h1>
        <p>All users and history records have been deleted.</p>
        <p style="color: #64748b;">You can now register a fresh account.</p>
      </div>
    `);
  } catch (error: any) {
    console.error("Reset Error:", error);
    res.status(500).send("Error clearing database: " + error.message);
  }
});

export default router;
