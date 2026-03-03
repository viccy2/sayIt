import { Response } from 'express';
import History from '../models/history.model';

export const getUserHistory = async (req: any, res: Response): Promise<any> => {
  try {
    // 1. Get the ID from the 'protect' middleware
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 2. CRITICAL CHANGE: Search by 'user', not 'userId'
    const history = await History.find({ user: userId })
                                 .sort({ createdAt: -1 }); // Newest first

    console.log(`Found ${history.length} items for user ${userId}`);
    
    // 3. Send back the array
    res.status(200).json(history);
  } catch (error: any) {
    console.error("Fetch History Error:", error.message);
    res.status(500).json({ message: 'Error fetching history' });
  }
};
