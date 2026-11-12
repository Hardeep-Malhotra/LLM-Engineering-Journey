
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
      input: "what is hash map in DSA .",
    },
    {
      timeout: 30000,
    }
  );

  console.log("Response received!");
  console.log(interaction.output_text);
}

main().catch((error) => {
  console.error("ERROR:", error);
});
