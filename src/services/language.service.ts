import LanguageDetect from 'languagedetect';

const lngDetector = new LanguageDetect();

export const detectLanguage = async (text: string): Promise<string> => {
  try {
    const results = lngDetector.detect(text, 1); // Get the top match
    
    if (results.length > 0) {
      // Returns the name of the language (e.g., 'english')
      return results[0][0].charAt(0).toUpperCase() + results[0][0].slice(1);
    }
    
    return 'Unknown';
  } catch (error) {
    console.error('Language Detection Error:', error);
    return 'Detection Error';
  }
};
