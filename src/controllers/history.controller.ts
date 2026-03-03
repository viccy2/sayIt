import { Response } from 'express';
import History from '../models/history.model';

export const getUserHistory = async (req: any, res: Response): Promise<any> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      console.error("❌ History Request Denied: No User ID in token.");
      return res.status(401).json({ message: 'User session not found' });
    }

    // LOG THIS: Copy this ID from your Vercel logs and search it in Atlas
    console.log("🔍 History Search for User ID:", userId);

    // Search for the ID in both possible field names
    const history = await History.find({
      $or: [{ user: userId }, { userId: userId }]
    }).sort({ createdAt: -1 });

    console.log(`✅ MongoDB match count: ${history.length}`);

    return res.status(200).json(history);
  } catch (error: any) {
    console.error("❌ History Controller Error:", error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};
