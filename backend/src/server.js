const express = require("express");
const cors = require("cors");
const passport = require("passport");

require("dotenv").config();

require("./passport/googleStrategy");


const connectDB = require("./config/db");

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use("/auth", require("./routes/auth.routes"));
app.use("/auth/local", require("./routes/localAuth.routes"));

// Test route
app.get("/", (req, res) => {
  res.send("AgentFlow Backend is running 🚀");
});

// Server start

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

// CHAT API (TEXT ONLY - STEP 1)


const { getGeminiResponse } = require("./services/gemini.service");

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const aiReply = await getGeminiResponse(message);

    return res.json({ reply: aiReply });
  } catch (error) {
    console.error("GEMINI CHAT ERROR:", error.message);
    return res.status(500).json({
      reply: "Gemini failed to respond",
    });
  }
});




