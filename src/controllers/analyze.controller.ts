import { Response } from 'express';
import { analyzeText as performAIAnalysis } from '../services/aiService';
import History from '../models/history.model';

export const analyzeText = async (req: any, res: Response): Promise<any> => {
  try {
    const { text } = req.body;
    const user = req.user;
    const cleanText = text.trim();

    if (!cleanText) return res.status(400).json({ message: 'Text is required' });

    // 1. Get the Analysis from AI Service
    const result = await performAIAnalysis(cleanText);

    let savedRecord: any = null;

    if (user && user._id) {
      // LOGIC: Check if this user has EVER saved this EXACT text before
      const existingEntry = await History.findOne({
        user: user._id,
        originalText: cleanText
      });

      if (!existingEntry) {
        // Only save if it's a brand new word for this user
        savedRecord = await History.create({
          user: user._id, 
          originalText: cleanText,
          detectedLanguage: result.detectedLanguage,
          meaning: result.meaning,
        });
        console.log(`✨ New word discovered: ${cleanText}`);
      } else {
        // If it exists, we just reference the old one
        savedRecord = existingEntry;
        console.log(`📖 Word already known: ${cleanText}`);
      }
    }

    return res.json({
      ...result,
      _id: savedRecord ? savedRecord._id : null,
    });
  } catch (error: any) {
    console.error("Analysis Error:", error.message);
    return res.status(500).json({ message: 'Analysis failed' });
  }
};
