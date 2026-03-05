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

    // 1. Get the Analysis (Meaning + Language) from our new Service
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

    // 3. Return response with languageCode for useSpeech to work
    return res.json({
      language: result.detectedLanguage,
      meaning: result.meaning,
      languageCode: result.languageCode, // CRITICAL for speech
      speechText: result.speechText,     // CRITICAL for symbols
      _id: savedRecord ? savedRecord._id : null,
    });
  } catch (error: any) {
    console.error("Analysis Error:", error.message);
    return res.status(500).json({ message: 'Analysis failed', error: error.message });
  }
};
