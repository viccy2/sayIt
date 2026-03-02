import axios from 'axios';

/**
 * @desc    Fetches a short definition/meaning for the provided text
 * @param   text The word or phrase to look up
 * @returns A string containing the short meaning or a fallback message
 */
export const getShortMeaning = async (text: string): Promise<string> => {
  try {
    // We use the Free Dictionary API (no key required)
    // Note: This works best for single words.
    const trimmedText = text.trim().split(' ')[0]; 
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${trimmedText}`);

    // Dig into the response to find the first definition
    const definition = response.data[0]?.meanings[0]?.definitions[0]?.definition;

    return definition || "Meaning found, but no concise definition available.";
  } catch (error: any) {
    // If it's a phrase or the word isn't in the dictionary
    if (error.response?.status === 404) {
      return "Definition not found in the standard dictionary.";
    }
    
    console.error('Meaning Service Error:', error.message);
    return "Definition temporarily unavailable.";
  }
};
