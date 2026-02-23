import axios from 'axios';

export const getShortMeaning = async (text: string): Promise<string> => {
  try {
    // We only fetch meaning for single words or short phrases
    const query = text.trim().split(' ')[0];
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
    
    // Extract the first definition
    const definition = response.data[0]?.meanings[0]?.definitions[0]?.definition;
    
    return definition ? definition.substring(0, 100) + '...' : 'Meaning not found.';
  } catch (error) {
    return 'Definition unavailable for this input.';
  }
};
