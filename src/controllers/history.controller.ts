import { Request, Response } from 'express';
import * as historyService from '../services/history.service';

export const getHistory = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const history = await historyService.getHistoryByUserId(userId);
    return res.json(history);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching history', error });
  }
};

export const deleteHistoryItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const deletedItem = await historyService.deleteItemById(id, userId);
    
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json({ message: 'Item deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting item' });
  }
};
