import { Response } from 'express';
import * as AIService from '../services/ai.service'; // We will create this
import History from '../models/history.model';

export const analyzeText = async (req: any, res: Response): Promise<any> => {
  try {
    const { text } = req.body;
    const user = req.user;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Text is required' });
    }

    // NEW: One single call to a "Universal" AI service
    // This returns: { language, translation, meaning }
    const analysis = await AIService.getUniversalAnalysis(text);

    let savedRecord: any = null;

    if (user && user._id) {
      savedRecord = await History.create({
        user: user._id, 
        originalText: text,
        detectedLanguage: analysis.language,
        meaning: analysis.meaning, // This will now contain the translation + context
      });
    }

    return res.json({
      ...analysis,
      _id: savedRecord ? savedRecord._id : null,
    });
  } catch (error: any) {
    console.error("Analysis Error:", error.message);
    return res.status(500).json({ 
      message: 'Analysis failed', 
      error: 'The AI could not process this script. Please try again.' 
    });
  }
};
