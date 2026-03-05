import translate from 'google-translate-api-x';
import axios from 'axios';

export const analyzeText = async (text: string) => {
  try {
    const res = await translate(text, { to: 'en' });
    const isEnglish = res.from.language.iso === 'en';
    let meaning = res.text;

    // IF IT'S ENGLISH: Fetch a real definition
    if (isEnglish) {
      try {
        const dictRes = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${text.trim()}`);
        // Grab the first definition found
        meaning = dictRes.data[0].meanings[0].definitions[0].definition;
      } catch (e) {
        meaning = `English term: ${text} (No dictionary definition found)`;
      }
    }

    return {
      meaning: meaning,
      detectedLanguage: isEnglish ? 'English' : res.from.language.iso,
      languageCode: res.from.language.iso,
      speechText: text
    };
  } catch (error) {
    throw new Error("Analysis failed");
  }
};
