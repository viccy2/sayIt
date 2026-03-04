import { Response } from 'express';
import History from '../models/history.model';

export const getUserHistory = async (req: any, res: Response): Promise<any> => {
  try {
    // Get the ID (which is likely a string like "69a69cad...")
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log(`🔍 Searching histories for string ID: ${userId}`);

    // Query using the string ID
    const history = await History.find({ user: String(userId) })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`📊 Found ${history.length} records.`);
    
    return res.status(200).json(history);
  } catch (error: any) {
    console.error("❌ History Controller Error:", error.message);
    return res.status(500).json({ message: 'Error fetching history' });
  }
};
