import { Request, Response } from 'express';
import History from '../models/history.model';

export const getUserHistory = async (req: any, res: Response): Promise<any> => {
  try {
    // req.user._id comes from your 'protect' middleware
    const history = await History.find({ user: req.user._id })
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(history);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching history' });
  }
};

// We will use this later when we build the Analysis logic
export const addHistoryItem = async (userId: string, text: string, meaning: string, lang: string) => {
  return await History.create({
    user: userId,
    originalText: text,
    meaning: meaning,
    detectedLanguage: lang
  });
};
