import translate from 'google-translate-api-x';
import axios from 'axios';

export const analyzeText = async (text: string) => {
  try {
    // 1. Detect language and get a basic translation
    const res = await translate(text, { to: 'en' });
    const isoCode = res.from.language.iso.toLowerCase();
    
    let meaning = res.text;
    let detectedLanguage = res.from.language.iso;

    // 2. Refine the analysis based on input type
    const isSingleWord = text.trim().split(/\s+/).length === 1;

    if (isoCode === 'en') {
      detectedLanguage = 'English';
      
      if (isSingleWord) {
        try {
          // Single word: Get a formal definition
          const dict = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${text.trim().toLowerCase()}`);
          meaning = dict.data[0].meanings[0].definitions[0].definition;
        } catch (err) {
          // If dictionary fails, keep the original word but don't add the prefix
          meaning = text; 
        }
      } else {
        // It's a sentence: The "meaning" is the text itself, 
        // but we could wrap it or leave it for the UI to handle.
        meaning = text;
      }
    } else {
      // For Non-English text, if it's a single word, let's try to get a better 
      // definition of the TRANSLATED English word.
      if (isSingleWord) {
        try {
          const dict = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${res.text.toLowerCase()}`);
          meaning = `(${res.text}): ${dict.data[0].meanings[0].definitions[0].definition}`;
        } catch (err) {
          // Fallback to the simple translation if dictionary lookup fails
          meaning = res.text;
        }
      }
    }

    return {
      meaning: meaning,
      detectedLanguage: detectedLanguage,
      languageCode: isoCode, 
      speechText: text
    };
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};
