// Using require to bypass TypeScript's strict module resolution for this library
const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();

export const detectLanguage = async (text: string): Promise<string> => {
  try {
    // .detect(text, limit) returns an array: [['english', 0.5]]
    const detections = lngDetector.detect(text, 1);

    if (detections && detections.length > 0) {
      const langName = detections[0][0];
      // Format to "English", "Spanish", etc.
      return langName.charAt(0).toUpperCase() + langName.slice(1);
    }

    return 'Unknown Language';
  } catch (error) {
    console.error('Language detection failed:', error);
    return 'English'; // Default fallback
  }
};
