import { Request, Response } from 'express';
import * as LanguageService from '../services/language.service';
import * as MeaningService from '../services/meaning.service';
import History from '../models/history.model';

/**
 * @desc    Analyze text and save to user history
 * @route   POST /api/analyze
 * @access  Private/Public (Saves to history if user exists)
 */
export const analyzeText = async (req: Request, res: Response): Promise<any> => {
  try {
    const { text } = req.body;
    
    // req.user is now recognized thanks to our src/types/express.d.ts
    const user = req.user;

    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    // Triggering the business logic services
    const language = await LanguageService.detectLanguage(text);
    const meaning = await MeaningService.getShortMeaning(text);

    let savedRecord = null;

    // Only save to database if a user is logged in
    if (user && user._id) {
      savedRecord = await History.create({
        userId: user._id,
        originalText: text,
        detectedLanguage: language,
        meaning: meaning,
      });
    }

    return res.json({
      language,
      meaning,
      historyId: savedRecord ? savedRecord._id : null,
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      message: 'Analysis failed', 
      error: error.message || error 
    });
  }
};
