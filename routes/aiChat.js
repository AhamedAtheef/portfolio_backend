import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import portfolioContext from "../ai/portfolioContext.js";

const router = express.Router();

const rateLimitMap = new Map();

// ✅ check API key
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log(genAI);

router.post("/chat", async (req, res) => {
  const ip = req.ip || req.connection?.remoteAddress || "unknown";
  const now = Date.now();
  if (rateLimitMap.has(ip)) {
    const lastRequest = rateLimitMap.get(ip);
    if (now - lastRequest < 5000) {
      return res.status(429).json({
        reply: "⚠️ Please wait a few seconds before asking again.",
      });
    }
  }
  rateLimitMap.set(ip, now);

  try {
    const { message } = req.body;

    // ✅ check message
    if (!message) {
      return res.status(400).json({
        reply: "Message is required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const prompt = `
${portfolioContext}

Visitor Question:
${message}
`;

    // delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = await model.generateContent(prompt);

    // ✅ safe access
    const reply = result?.response?.text() || "No response from AI";

    res.json({ reply });

  } catch (error) {
    console.error("FULL ERROR:", error);

    if (error.status === 429) {
      return res.status(429).json({
        reply: "⚠️ Please wait a few seconds before asking again.",
      });
    }

    if (error.status === 400) {
      return res.status(400).json({
        reply: "⚠️ Invalid request or API issue.",
      });
    }

    res.status(500).json({
      reply: "Something went wrong with AI response",
    });
  }
});

export default router;