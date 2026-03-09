import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model';
import sendEmail from '../utils/sendEmail';

/**
 * @desc    Generate JWT Token
 */
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_secret_key', {
    expiresIn: '30d',
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user & Send verification email
 */
export const register = async (req: Request, res: Response): Promise<any> => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 1. Generate Verification Token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 2. Create User (isVerified defaults to false)
    const user = await User.create({
      username,
      email,
      password,
      verificationToken: crypto.createHash('sha256').update(verificationToken).digest('hex'),
      verificationTokenExpire: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // 3. Send Verification Email
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    const htmlMessage = `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="background-color: #6366f1; color: white; width: 40px; height: 40px; line-height: 40px; border-radius: 10px; display: inline-block; font-weight: bold; font-size: 20px;">S</div>
          <h1 style="color: #1e293b; margin-top: 10px;">say<span style="color: #6366f1;">It</span></h1>
        </div>
        <h2 style="color: #1e293b; text-align: center;">Verify Your Email</h2>
        <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
          Welcome to SayIt! Please click the button below to verify your email address and activate your account.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #6366f1; color: white; padding: 14px 24px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 40px;">
          If you did not create an account, you can safely ignore this email.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify your SayIt account',
        message: `Verify your email here: ${verifyUrl}`,
        html: htmlMessage,
      });
      res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });
    } catch (err) {
      // If email fails, we keep the user but they'll need a "resend" option later
      res.status(201).json({ message: 'User created, but verification email failed to send.' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify user email
 */
export const verifyEmail = async (req: Request, res: Response): Promise<any> => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      // BLOCK LOGIN IF NOT VERIFIED
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email address before logging in.' });
      }

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
 */
export const getCurrentUser = async (req: any, res: Response): Promise<any> => {
  try {
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

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const htmlMessage = `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="background-color: #6366f1; color: white; width: 40px; height: 40px; line-height: 40px; border-radius: 10px; display: inline-block; font-weight: bold; font-size: 20px;">S</div>
          <h1 style="color: #1e293b; margin-top: 10px;">say<span style="color: #6366f1;">It</span></h1>
        </div>
        <h2 style="color: #1e293b; text-align: center;">Password Reset Request</h2>
        <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
          You requested a password reset. Click the button below to set a new password. Valid for 10 minutes.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #1e293b; color: white; padding: 14px 24px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Reset your SayIt password',
        message: `Reset your password here: ${resetUrl}`,
        html: htmlMessage,
      });
      return res.status(200).json({ message: 'Reset link sent!' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Email could not be sent.' });
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
