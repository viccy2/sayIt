import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getUniversalAnalysis = async (text: string) => {
  const prompt = `
    You are an expert polyglot. Analyze this text: "${text}"
    
    1. Identify the language (be specific, e.g., "Korean", "Simplified Chinese", "Nigerian Pidgin").
    2. Translate it to natural English.
    3. Explain the cultural meaning or context (is it formal? slang? a greeting?).
    
    Return ONLY a JSON object:
    {
      "language": "Detected Language Name",
      "translation": "English Translation",
      "meaning": "Deep context/meaning of the phrase"
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawText = response.text().replace(/```json|```/g, "").trim();
  
  return JSON.parse(rawText);
};
