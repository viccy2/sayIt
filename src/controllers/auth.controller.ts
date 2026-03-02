import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model'; // Matches your export default in user.model.ts

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
