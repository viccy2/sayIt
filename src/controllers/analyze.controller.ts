import { Request, Response } from 'express';
import * as LanguageService from '../services/language.service';
import * as MeaningService from '../services/meaning.service';
import History from '../models/history.model';

export const analyzeText = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const userId = (req.user as any)?._id;

    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const language = await LanguageService.detectLanguage(text);
    const meaning = await MeaningService.getShortMeaning(text);

    // Save to history if user is logged in
    let savedRecord = null;
    if (userId) {
      savedRecord = await History.create({
        userId,
        originalText: text,
        detectedLanguage: language,
        meaning: meaning,
      });
    }

    res.json({
      language,
      meaning,
      historyId: savedRecord?._id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Analysis failed', error });
  }
};
