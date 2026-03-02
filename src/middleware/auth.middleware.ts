import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

/**
 * @desc    Protect routes - Ensures the request has a valid JWT in the headers
 */
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  let token;

  // 1. Check if token exists in Authorization header (Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

      // 3. Get user from the token and attach to the request object
      // We exclude the password for security
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User associated with this token no longer exists.' });
      }

      // Attach user to req.user (This works because of our src/types/express.d.ts)
      req.user = user;
      
      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
