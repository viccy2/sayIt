import { Request, Response } from 'express';
import * as authService from '../services/auth.service';


export const getCurrentUser = async (req: any, res: any) => {
  try {
    // req.user.id comes from the middleware we just wrote
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    await authService.registerUser(req.body);
    res.status(201).json({ message: "User created" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authService.validateUser(email, password);

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const token = authService.generateToken(user);
    res.json({
      token,
      user: { username: user.username, email: user.email, displayName: user.username }
    });
  } catch (error) {
    res.status(500).json({ message: "Login error" });
  }
};
