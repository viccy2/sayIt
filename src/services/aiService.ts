import translate from 'google-translate-api-x';

export const analyzeText = async (text: string) => {
  try {
    // 1. Detect and Translate
    const res = await translate(text, { to: 'en' });

    let meaning = res.text;

    // FIX: If input is already English, the "translation" is just the same word.
    // We want the MEANING. Without a paid AI, we can check if they are identical:
    if (text.toLowerCase().trim() === res.text.toLowerCase().trim()) {
      // If it's English, we can try to get a definition by "translating" 
      // it to a different language and back, OR we can simply 
      // label it as English for the frontend to handle.
      meaning = `English term: ${text}`; 
    }

    return {
      meaning: meaning,
      detectedLanguage: res.from.language.iso === 'en' ? 'English' : res.from.language.iso,
      languageCode: res.from.language.iso, // e.g. 'zh-CN', 'en', 'yo'
      speechText: text // This is what will be spoken
    };
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Analysis failed");
  }
};
