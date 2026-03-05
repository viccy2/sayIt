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

    // 1. Get the Analysis from AI Service
    const result = await performAIAnalysis(text);

    let savedRecord: any = null;

    // 2. DUPLICATE GUARD & SAVE
    if (user && user._id) {
      // Check if this user saved this EXACT text in the last 5 seconds
      const fiveSecondsAgo = new Date(Date.now() - 5000);
      
      const duplicate = await History.findOne({
        user: user._id,
        originalText: text.trim(),
        createdAt: { $gte: fiveSecondsAgo }
      });

      if (!duplicate) {
        savedRecord = await History.create({
          user: user._id, 
          originalText: text.trim(),
          detectedLanguage: result.detectedLanguage,
          meaning: result.meaning,
        });
      } else {
        // If it's a duplicate, we use the existing record's ID
        savedRecord = duplicate;
      }
    }

    // 3. Return response
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
