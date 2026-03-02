import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user with username, email, and password
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get JWT token
 */
router.post('/login', authController.login);

/**
 * GOOGLE AUTH (DEACTIVATED)
 * Uncomment these once Google Cloud Console billing/payment is resolved.
 */
/*
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.googleCallback
);
*/

export default router;
