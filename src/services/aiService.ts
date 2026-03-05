import translate from 'google-translate-api-x';
import axios from 'axios';

export const analyzeText = async (text: string) => {
  try {
    const res = await translate(text, { to: 'en' });
    const isoCode = res.from.language.iso.toLowerCase();
    
    let meaning = res.text;
    let detectedLanguage = res.from.language.iso;

    // If English, get a real definition from the Free Dictionary API
    if (isoCode === 'en') {
      detectedLanguage = 'English';
      try {
        const dict = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${text.trim()}`);
        meaning = dict.data[0].meanings[0].definitions[0].definition;
      } catch (err) {
        meaning = `English word: ${text}`; 
      }
    }

    return {
      meaning,
      detectedLanguage,
      languageCode: isoCode, 
      speechText: text
    };
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};
