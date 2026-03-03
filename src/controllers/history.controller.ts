import { Response } from 'express';
import History from '../models/history.model';
import mongoose from 'mongoose';

export const getUserHistory = async (req: any, res: Response): Promise<any> => {
  try {
    const rawUserId = req.user?._id;

    if (!rawUserId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Force the ID into a Hex-based ObjectId
    const userId = new mongoose.Types.ObjectId(String(rawUserId));

    // This log is your "Truth Teller" - check it in your terminal!
    console.log(`Checking collection: "${History.collection.name}" for User ID: ${userId}`);

    const history = await History.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`📊 Query returned ${history.length} records.`);
    
    return res.status(200).json(history);
  } catch (error: any) {
    console.error("❌ History Error:", error.message);
    return res.status(500).json({ message: 'Error fetching history' });
  }
};
