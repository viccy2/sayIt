import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = await User.findById(decoded.id).select('-password') as any;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  }
  if (!token) return res.status(401).json({ message: 'No token' });
};
