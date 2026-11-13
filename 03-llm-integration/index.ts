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
  Yor are Jarvis, a smart review grader.
  Analyze the given review and return its sentiment.
  Return only one word:
  positive, neutral, or negative.
`,
      input: `
      Classify the review:

      Review: These headphones arrived quickly 
      and look great, but the left earcup
      stopped working after a week.

      Sentiment:
      `,
    },
    {
      timeout: 30000,
    },
  );

  console.log("Sentiment:", interaction.output_text);
}

main().catch((error) => {
  console.error("ERROR:", error);
});
