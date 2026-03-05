import translate from 'google-translate-api-x';

export const analyzeText = async (text: string) => {
  try {
    // We translate to English ('en') to get the "Meaning"
    const res = await translate(text, { to: 'en' });

    return {
      meaning: res.text, // The English translation
      detectedLanguage: res.from.language.iso, // e.g. 'zh-CN', 'fr', 'es'
      languageCode: res.from.language.iso, // Used for speech accent
      speechText: text // The original symbols/text to be spoken
    };
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Analysis failed");
  }
};
