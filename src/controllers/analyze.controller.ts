export const analyzeText = async (req: any, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    // Log this to your terminal to see if the user is actually arriving
    console.log("DEBUG: User from req:", req.user);

    if (!text) {
      res.status(400).json({ message: 'Text is required' });
      return;
    }

    // Run these one by one for a moment to isolate which one is failing
    const language = await LanguageService.detectLanguage(text);
    const meaning = await MeaningService.getShortMeaning(text);

    if (req.user?._id) {
      await History.create({
        user: req.user._id, 
        originalText: text,
        detectedLanguage: language,
        meaning: meaning,
      });
      console.log("✅ Record saved successfully");
    }

    res.json({ language, meaning });
  } catch (error: any) {
    console.error("❌ CRITICAL ERROR:", error.message);
    res.status(500).json({ message: 'Analysis failed', error: error.message });
  }
};
