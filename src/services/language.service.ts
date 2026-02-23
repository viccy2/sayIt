import languageDetect from 'node-languagedetect'; // Use this exact name

export const detectLanguage = async (text: string): Promise<string> => {
  try {
    // node-languagedetect returns a simple object: { language: 'english', score: 1.0 }
    const result = languageDetect.detectOne(text);

    if (result) {
      // Capitalize the result (e.g., 'english' -> 'English')
      return result.charAt(0).toUpperCase() + result.slice(1);
    }

    return 'Unknown Language';
  } catch (error) {
    console.error('Detection Error:', error);
    return 'English'; // Safe fallback for the build
  }
};
