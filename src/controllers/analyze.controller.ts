import { Request, Response } from 'express';
import { analyzeText } from '../services/aiService'; // Ensure this matches the filename

export const handleAnalysis = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const result = await analyzeText(text);
    res.json(result);
  } catch (error) {
    console.error("Analysis Controller Error:", error);
    res.status(500).json({ error: "Analysis failed" });
  }
};
