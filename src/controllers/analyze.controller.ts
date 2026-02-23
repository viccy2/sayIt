import { Request, Response } from 'express';
import * as LanguageService from '../services/language.service';
import * as MeaningService from '../services/meaning.service';
import History from '../models/history.model';

export const analyzeText = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    
    // Cast to 'any' to avoid the 'never' type conflict during the build
    const user = req.user as any;

    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const language = await LanguageService.detectLanguage(text);
    const meaning = await MeaningService.getShortMeaning(text);

    // Initialize as 'any' so it can accept the Mongoose Document or null
    let savedRecord: any = null;

    if (user && user._id) {
      savedRecord = await History.create({
        userId: user._id,
        originalText: text,
        detectedLanguage: language,
        meaning: meaning,
      });
    }

    res.json({
      language,
      meaning,
      historyId: savedRecord ? savedRecord._id : null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Analysis failed', error });
  }
};
