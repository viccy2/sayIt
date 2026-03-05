import { GoogleGenerativeAI } from "@google/generative-ai";

// Fix for Error 10: Ensure the string exists
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const analyzeText = async (text: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze this text: "${text}"
    1. Detect the language.
    2. Provide a clear meaning in English.
    3. Provide the BCP-47 language code (e.g., 'zh-CN', 'yo-NG', 'fr-FR').
    4. Provide 'speechText' (the original text or phonetic symbols for TTS).

    Return ONLY JSON:
    {
      "meaning": "string",
      "detectedLanguage": "string",
      "languageCode": "string",
      "speechText": "string"
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const responseText = response.text().replace(/```json|```/g, "").trim();
  return JSON.parse(responseText);
};
