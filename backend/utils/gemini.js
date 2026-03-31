const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not defined in environment variables.');
      return null;
    }
    // Set it once and keep it in memory
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

const askGemini = async (prompt) => {
  try {
    const ai = getGenAI();
    if (!ai) throw new Error("Gemini AI is not configured.");

    // Use gemini-2.5-flash with a strict PCM system instruction
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are an expert tutor strictly focused on Physics, Chemistry, and Mathematics (PCM). You MUST NOT answer questions unrelated to these three subjects. If a user asks about anything else (e.g. History, Coding, Movies, etc.), politely decline and remind them you are only programmed to help with PCM."
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to communicate with AI Tutor.");
  }
};

module.exports = { askGemini };
