import { Request, Response } from 'express';
import * as aiService from '../services/aiService';

export const handleAnalysis = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const analysis = await aiService.analyzeText(text);

    // We return the full object so the dashboard can access 
    // the meaning and the languageCode for the speech engine.
    res.json(analysis);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze language" });
  }
};
