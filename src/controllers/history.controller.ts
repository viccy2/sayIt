import { Request, Response } from 'express';
import History from '../models/history.model';

export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const history = await History.find({ userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error });
  }
};

export const deleteHistoryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await History.findByIdAndDelete(id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item' });
  }
};
