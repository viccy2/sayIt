import { Request, Response } from 'express';
import { analyzeText } from '../services/aiService';
import History from '../models/History'; // Ensure you import your History model

export const handleAnalysis = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const userId = (req as any).user?.id; // Assuming you have auth middleware

    if (!text) return res.status(400).json({ error: "Text required" });

    // 1. Get the AI/Translation result
    const result = await analyzeText(text);

    // 2. SAVE TO DATABASE
    if (userId) {
      await History.create({
        userId,
        originalText: text,
        meaning: result.meaning,
        language: result.detectedLanguage,
        languageCode: result.languageCode
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ error: "Analysis failed" });
  }
};
