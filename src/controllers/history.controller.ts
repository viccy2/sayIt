import { Request, Response } from 'express';
import History from '../models/history.model';
import mongoose from 'mongoose';

// Define a custom request type to avoid 'any'
interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

/**
 * @desc    Get all history items for the logged-in user
 * @route   GET /api/history
 * @access  Private
 */
export const getUserHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const rawUserId = req.user?._id;

    if (!rawUserId) {
      // Use 401 for missing credentials, 403 for insufficient permissions
      res.status(401).json({ message: 'Unauthorized: User context missing' });
      return;
    }

    // Defensive check: Ensure the ID is a valid hex string before casting
    if (!mongoose.Types.ObjectId.isValid(rawUserId)) {
      res.status(400).json({ message: 'Invalid User ID format' });
      return;
    }

    const userId = new mongoose.Types.ObjectId(rawUserId);

    // .lean() makes the query faster by returning plain JS objects instead of Mongoose Documents
    const history = await History.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(history);
  } catch (error: any) {
    console.error("❌ History Controller Error:", error.message);
    res.status(500).json({ 
      message: 'Server Error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};
