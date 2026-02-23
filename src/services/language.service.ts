// @ts-ignore - Tell TS to ignore the module resolution for this specific import
import LanguageDetect from 'languagedetect';

const lngDetector = new LanguageDetect();

export const detectLanguage = async (text: string): Promise<string> => {
  try {
    const detections = lngDetector.detect(text, 1);
    if (detections && detections.length > 0) {
      return detections[0][0];
    }
    return 'Unknown';
  } catch (error) {
    return 'Detection Error';
  }
};
