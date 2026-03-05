import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeText = async (text: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze the following text: "${text}"
    1. Detect the language.
    2. Provide a clear, concise meaning in English.
    3. Provide the BCP-47 language code (e.g., 'zh-CN' for Chinese, 'en-US' for English, 'yo-NG' for Yoruba).
    4. Provide a 'speechText' field. If the input is symbols (like Chinese characters), this should be the native characters so the TTS engine can read them.

    Return ONLY a JSON object in this format:
    {
      "meaning": "string",
      "detectedLanguage": "string",
      "languageCode": "string",
      "speechText": "string"
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
};
