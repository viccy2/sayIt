import { Response } from 'express';
import { analyzeText as performAIAnalysis } from '../services/aiService';
import History from '../models/history.model';

export const analyzeText = async (req: any, res: Response): Promise<any> => {
  try {
    const { text } = req.body;
    const user = req.user;

    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    // 1. Get the Analysis (Meaning + Language) from AI Service
    const result = await performAIAnalysis(text);

    let savedRecord: any = null;

    // 2. SAVE TO HISTORY (Restoring your original saving logic)
    if (user && user._id) {
      savedRecord = await History.create({
        user: user._id, 
        originalText: text,
        detectedLanguage: result.detectedLanguage,
        meaning: result.meaning,
      });
    }

    // 3. Return response with everything needed for Dashboard & Speech
    return res.json({
      language: result.detectedLanguage,
      meaning: result.meaning,
      languageCode: result.languageCode,
      speechText: result.speechText,
      _id: savedRecord ? savedRecord._id : null,
    });
  } catch (error: any) {
    console.error("Analysis Error:", error.message);
    return res.status(500).json({ message: 'Analysis failed', error: error.message });
  }
};
