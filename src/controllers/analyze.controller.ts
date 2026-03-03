import { Request, Response } from 'express';
import * as LanguageService from '../services/language.service';
import * as MeaningService from '../services/meaning.service';
import History from '../models/history.model';

interface AuthenticatedRequest extends Request {
  user?: { _id: string };
  body: { text: string };
}

export const analyzeText = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    const userId = req.user?._id;

    if (!text || text.trim().length === 0) {
      res.status(400).json({ message: 'Valid text is required for analysis' });
      return;
    }

    // 1. Parallel Execution: AI logic can run simultaneously to save time
    const [language, meaning] = await Promise.all([
      LanguageService.detectLanguage(text),
      MeaningService.getShortMeaning(text)
    ]);

    let savedRecordId = null;

    // 2. Persist to History if user is authenticated
    if (userId) {
      const savedRecord = await History.create({
        user: userId, // Matches your History.find({ user: userId }) logic
        originalText: text,
        detectedLanguage: language,
        meaning: meaning,
      });
      savedRecordId = savedRecord._id;
    }

    res.status(200).json({
      language,
      meaning,
      _id: savedRecordId,
    });

  } catch (error: any) {
    console.error("❌ Analysis Error:", error.message);
    res.status(500).json({ 
      message: 'Analysis failed', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};
