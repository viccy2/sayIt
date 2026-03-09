import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model';
import sendEmail from '../utils/sendEmail';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '30d' });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
export const register = async (req: Request, res: Response): Promise<any> => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 */
export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/auth/current_user
 * @desc    Get current user profile
 * @access  Private (Accessed via 'protect' middleware)
 */
export const getCurrentUser = async (req: any, res: Response): Promise<any> => {
  try {
    // req.user is attached by your 'protect' middleware
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/auth/forgot-password
 */
export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user found with that email' });
    }

    // 1. Generate Raw Token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2. Save Hashed Token to DB
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await user.save({ validateBeforeSave: false });

    // 3. Send Email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `You requested a password reset. Please click the link below to set a new password (valid for 10 minutes):\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'SayIt - Password Reset Request',
        message,
      });
      res.status(200).json({ message: 'Reset link sent to your email!' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/auth/reset-password/:token
 */
export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
