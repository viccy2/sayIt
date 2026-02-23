import LanguageDetect from 'languagedetect';

const lngDetector = new LanguageDetect();

export const detectLanguage = async (text: string): Promise<string> => {
  try {
    // Get the top 1 result
    const detections = lngDetector.detect(text, 1);

    if (detections && detections.length > 0) {
      const langName = detections[0][0];
      return langName.charAt(0).toUpperCase() + langName.slice(1);
    }

    return 'Unknown Language';
  } catch (error) {
    return 'Detection Error';
  }
};
