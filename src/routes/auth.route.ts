import { Router } from 'express';
import passport from 'passport';
import * as AuthController from '../controllers/auth.controller';

const router = Router();

// Route: GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route: GET /api/auth/google/callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  AuthController.googleCallback
);

router.get('/me', AuthController.getUser);
router.get('/logout', AuthController.logout);

export default router;
