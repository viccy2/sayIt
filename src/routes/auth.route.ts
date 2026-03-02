import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

// Registration
router.post('/register', async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = new User({ username, email, password });
    await user.save();

    return res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        username: user.username,
        email: user.email,
        displayName: user.username // Matches your frontend HomeView logic
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
});

export default router;
