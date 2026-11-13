
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  console.log("Sending request...");

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",

    contents: `
      You are a student information assistant.

      Return the information in this format:

      Name: Hardeep
      Role: Backend Developer

      After the information, generate END.
      Do not generate anything after END.
    `,

    config: {
      temperature: 0.2,
      maxOutputTokens: 150,
      stopSequences: ["END"],
    },
  });

  console.log("\nAI Response:\n");
  console.log(response.text);
}

main().catch(console.error);
