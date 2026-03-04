import { Response } from 'express';
import History from '../models/history.model';

// 1. Fetch History
export const getUserHistory = async (req: any, res: Response): Promise<any> => {
  try {
    const userId = String(req.user?._id).trim();

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const history = await History.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
    
    return res.status(200).json(history);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// 2. Delete History Item
export const deleteHistoryItem = async (req: any, res: Response): Promise<any> => {
  try {
    const { id } = req.params; // Get ID from URL (/api/history/:id)
    const userId = String(req.user?._id).trim();

    // Find the record first to check ownership
    const record = await History.findById(id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // SECURITY CHECK: Ensure the user trying to delete it is the owner
    if (record.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this record' });
    }

    await record.deleteOne();

    return res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error deleting record', error: error.message });
  }
};
