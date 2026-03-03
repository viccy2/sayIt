import { Response } from 'express';
import History from '../models/history.model';

export const getUserHistory = async (req: any, res: Response): Promise<any> => {
  try {
    // Finds history belonging ONLY to the logged-in user
    const history = await History.find({ user: req.user._id })
                                 .sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching history' });
  }
};
