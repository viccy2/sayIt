import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model';
import sendEmail from '../utils/sendEmail';

/**
 * @desc    Generate 6-digit Numeric OTP
 */
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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
 */
export const register = async (req: Request, res: Response): Promise<any> => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const otp = generateOTP();
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
    
    await User.create({
      username,
      email,
      password,
      verificationToken: hashedOTP,
      verificationTokenExpire: new Date(Date.now() + 15 * 60 * 1000), 
    });

    const htmlMessage = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; text-align: center;">
        <h1 style="color: #1e293b;">Verify Your Account</h1>
        <p style="color: #64748b;">Your 6-digit verification code:</p>
        <div style="margin: 30px 0; background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px dashed #6366f1;">
          <h1 style="letter-spacing: 10px; color: #6366f1; font-size: 36px; margin: 0;">${otp}</h1>
        </div>
      </div>
    `;

    await sendEmail({
      email,
      subject: `${otp} is your verification code`,
      message: `Your code is: ${otp}`,
      html: htmlMessage,
    });

    res.status(201).json({ message: 'OTP sent! Please check your email.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/auth/verify-email
 */
export const verifyEmail = async (req: Request, res: Response): Promise<any> => {
  const { email, otp } = req.body;
  try {
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

    const user = await User.findOne({
      email,
      verificationToken: hashedOTP,
      verificationTokenExpire: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired code.' });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    res.status(200).json({ 
      message: 'Account verified!', 
      token: generateToken(user._id.toString()) 
    });
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
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    user.resetPasswordToken = crypto.createHash('sha256').update(otp).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await sendEmail({
      email: user.email,
      subject: `Reset Code: ${otp}`,
      message: `Your code is: ${otp}`,
      html: `<div style="text-align:center;"><h1>${otp}</h1><p>Expires in 10 mins</p></div>`,
    });

    res.status(200).json({ message: 'Reset code sent!' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/auth/reset-password
 */
export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  const { email, otp, password } = req.body;
  try {
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
    
    const user = await User.findOne({
      email,
      resetPasswordToken: hashedOTP,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired code.' });
    
    user.password = password; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    res.status(200).json({ message: 'Password reset successfully!' });
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
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your account first.' });
      }
      
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req: any, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resendVerification = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Already verified' });

    const otp = generateOTP();
    user.verificationToken = crypto.createHash('sha256').update(otp).digest('hex');
    user.verificationTokenExpire = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendEmail({
      email: user.email,
      subject: `${otp} is your new code`,
      message: `Code: ${otp}`,
      html: `<h1 style="text-align:center;">${otp}</h1>`
    });

    res.status(200).json({ message: 'New code sent!' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
