import { Request, Response } from 'express';
import * as LanguageService from '../services/language.service';
import * as MeaningService from '../services/meaning.service';
import History from '../models/history.model';

export const analyzeText = async (req: any, res: Response): Promise<any> => {
  try {
    const { text } = req.body;
    const user = req.user; // Populated by your 'protect' middleware

    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    // 1. Get AI Analysis from your Services
    const language = await LanguageService.detectLanguage(text);
    const meaning = await MeaningService.getShortMeaning(text);

    let savedRecord: any = null;

    // 2. SAVE TO HISTORY
    // Ensure field names match your History Schema (user, not userId)
    if (user && user._id) {
      savedRecord = await History.create({
        user: user._id, // Matches our history.model.ts
        originalText: text,
        detectedLanguage: language,
        meaning: meaning,
      });
    }

    // 3. RETURN RESPONSE
    // We return the full object so the Dashboard can show it immediately
    return res.json({
      language,
      meaning,
      _id: savedRecord ? savedRecord._id : null,
    });
  } catch (error: any) {
    console.error("Analysis Error:", error.message);
    return res.status(500).json({ 
      message: 'Analysis failed', 
      error: error.message 
    });
  }
};
