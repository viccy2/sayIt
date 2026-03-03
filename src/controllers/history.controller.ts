import { Response } from 'express';
import History from '../models/history.model';
import mongoose from 'mongoose';

/**
 * @desc    Get all history items for the logged-in user
 * @route   GET /api/history
 * @access  Private
 */
export const getUserHistory = async (req: any, res: Response): Promise<any> => {
  try {
    // 1. Get the ID from the request
    const rawId = req.user?._id;

    if (!rawId) {
      console.log("❌ No user ID found in req.user");
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 2. FORCE CAST to ObjectId
    // Wrapping in String() first handles cases where rawId is already an object
    const userId = new mongoose.Types.ObjectId(String(rawId));

    console.log("🔍 Database Query ID:", userId);

    // 3. Query using the 'user' field
    const history = await History.find({ user: userId })
      .sort({ createdAt: -1 }) // Newest first
      .lean();

    console.log(`✅ Success: Found ${history.length} records in Atlas.`);
    
    // 4. Return the data
    return res.status(200).json(history);

  } catch (error: any) {
    console.error("❌ History Controller Error:", error.message);
    return res.status(500).json({ message: 'Server error fetching history' });
  }
};
