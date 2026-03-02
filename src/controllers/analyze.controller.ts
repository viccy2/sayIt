import { Request, Response } from 'express';
import * as LanguageService from '../services/language.service';
import * as MeaningService from '../services/meaning.service';
import History from '../models/history.model';

export const analyzeText = async (req: Request, res: Response): Promise<any> => {
  try {
    const { text } = req.body;
    const user = req.user;

    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const language = await LanguageService.detectLanguage(text);
    const meaning = await MeaningService.getShortMeaning(text);

    // FIX for Error 10: Explicitly allow this to be a document or null
    let savedRecord: any = null;

    if (user && user._id) {
      savedRecord = await History.create({
        userId: user._id,
        originalText: text,
        detectedLanguage: language,
        meaning: meaning,
      });
    }

    // FIX for Error 11: TypeScript now knows savedRecord isn't 'never'
    return res.json({
      language,
      meaning,
      historyId: savedRecord ? savedRecord._id : null,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Analysis failed', error: error.message });
  }
};
