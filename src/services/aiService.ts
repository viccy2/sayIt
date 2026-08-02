import translate from 'google-translate-api-x';
import axios from 'axios';

export const analyzeText = async (text: string) => {
  try {
    const res = await translate(text, { to: 'en' });
    const isoCode = res.from.language.iso.toLowerCase();
    
    let meaning = res.text;
    let detectedLanguage = res.from.language.iso;
    
    const isSingleWord = text.trim().split(/\s+/).length === 1;

    if (isoCode === 'en') {
      detectedLanguage = 'English';
      
      if (isSingleWord) {
        try {
          const dict = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${text.trim().toLowerCase()}`);
          meaning = dict.data[0].meanings[0].definitions[0].definition;
        } catch (err) {
          meaning = text; 
        }
      } else {
        meaning = text;
      }
    } else {
      if (isSingleWord) {
        try {
          const dict = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${res.text.toLowerCase()}`);
          meaning = `(${res.text}): ${dict.data[0].meanings[0].definitions[0].definition}`;
        } catch (err) {
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
