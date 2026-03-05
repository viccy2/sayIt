import { Request, Response } from 'express';
import { analyzeText } from '../services/aiService';

export const handleAnalysis = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const result = await analyzeText(text);
    res.json(result);
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ error: "Failed to analyze text" });
  }
};
