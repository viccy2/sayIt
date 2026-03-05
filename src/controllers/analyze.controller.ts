This is the analyze controller.ts file 

import { Response } from 'express';
import * as LanguageService from '../services/language.service';
import * as MeaningService from '../services/meaning.service';
import History from '../models/history.model';

export const analyzeText = async (req: any, res: Response): Promise<any> => {
  try {
    const { text } = req.body;
    const user = req.user;

    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    // AI logic (Assuming these services are working)
    const language = await LanguageService.detectLanguage(text);
    const meaning = await MeaningService.getShortMeaning(text);

    let savedRecord: any = null;

    if (user && user._id) {
      // CRITICAL FIX: Changed 'userId' to 'user' to match the Model
      savedRecord = await History.create({
        user: user._id, 
        originalText: text,
        detectedLanguage: language,
        meaning: meaning,
      });
    }

    return res.json({
      language,
      meaning,
      _id: savedRecord ? savedRecord._id : null,
    });
  } catch (error: any) {
    console.error("Analysis Error:", error.message);
    return res.status(500).json({ message: 'Analysis failed', error: error.message });
  }
};
