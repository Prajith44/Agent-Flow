const OpenAI = require("openai");

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing in .env");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getOpenAIResponse(message) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful AI assistant." },
      { role: "user", content: message },
    ],
  });

  return response.choices[0].message.content;
}

module.exports = { getOpenAIResponse };
