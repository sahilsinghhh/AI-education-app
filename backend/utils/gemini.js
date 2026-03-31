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
      systemInstruction:
        "You are StudyBuddy AI, a friendly and accurate professional tutor for students from school to college. You can help with Science (Physics, Chemistry, Biology), Mathematics, Computer Science/Programming, English & writing, Social Studies/Humanities, Commerce (Accounting, Economics, Business Studies), and Arts (history, political science, sociology, psychology, philosophy, languages, etc.). " +
        "Adapt explanations to the student's level (school/college), use step-by-step reasoning when helpful, and include examples and practice questions when asked. " +
        "If the user request is not educational (e.g., entertainment, gossip) or is unsafe/illegal (cheating, hacking, self-harm, violence), politely refuse and redirect to a safe, learning-focused alternative."
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
