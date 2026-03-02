import User, { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';

export const registerUser = async (userData: any) => {
  const { username, email, password } = userData;
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('User already exists');
  
  const user = new User({ username, email, password });
  return await user.save();
};

export const validateUser = async (email: string, pass: string) => {
  const user = await User.findOne({ email });
  if (user && await user.comparePassword(pass)) {
    return user;
  }
  return null;
};

export const generateToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
};
