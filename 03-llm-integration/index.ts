import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  console.log("Sending request...");

  const interaction = await ai.interactions.create(
    {
      model: "gemini-3.5-flash-lite",

      system_instruction: `
  You are a strict programming teacher.

  Rules:
  1. Answer in exactly 2 sentences.
  2. Never provide code.
  3. Use very simple English.
`,
      input: "Explain Hash Maps in DSA.",
    },
    {
      timeout: 30000,
    },
  );

  console.log("Response received!");
  console.log(interaction.output_text);
}

main().catch((error) => {
  console.error("ERROR:", error);
});
