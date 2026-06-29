const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGeminiResponse(message) {
  const model = genAI.getGenerativeModel({
    model: "models/gemini-2.5-flash",
  });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: message }],
      },
    ],
  });

  return result.response.text();
}

module.exports = { getGeminiResponse };
