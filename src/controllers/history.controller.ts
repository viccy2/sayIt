Import { Response } from 'express';
import History from '../models/history.model';
import mongoose from 'mongoose';

/**
 * @desc    Get all history items for the logged-in user
 * @route   GET /api/history
 * @access  Private
 */
export const getUserHistory = async (req: any, res: Response): Promise<any> => {
  try {
    const rawUserId = req.user?._id;

    if (!rawUserId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID' });
    }

    // Convert string ID to MongoDB ObjectId for a guaranteed match
    const userId = new mongoose.Types.ObjectId(rawUserId);

    console.log("🔍 Querying Atlas for user:", userId);

    // Find all records where the 'user' field matches our ID
    const history = await History.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Found ${history.length} history items in Atlas.`);
    
    return res.status(200).json(history);
  } catch (error: any) {
    console.error("❌ History Controller Error:", error.message);
    return res.status(500).json({ 
      message: 'Error fetching history', 
      error: error.message 
    });
  }
};
