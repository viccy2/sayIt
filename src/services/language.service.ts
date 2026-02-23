// We'll switch to 'languagedetect' for better short-string handling if you want to stay free,
// OR use a simple API call to a detection service.
import LanguageDetect from 'languagedetect';

const lngDetector = new LanguageDetect();

export const detectLanguage = async (text: string): Promise<string> => {
  try {
    // Get all probable languages
    const detections = lngDetector.detect(text, 1); // Returns top 1 result

    if (detections.length > 0) {
      // Returns format: [['english', 0.59]]
      const [langName] = detections[0];
      // Capitalize first letter
      return langName.charAt(0).toUpperCase() + langName.slice(1);
    }

    return 'Unknown Language';
  } catch (error) {
    console.error('Detection Error:', error);
    return 'Detection Error';
  }
};
