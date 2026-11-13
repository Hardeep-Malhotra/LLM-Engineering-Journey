import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// STEP 1: Actual backend function
async function getWeather(city: string) {
  console.log(`Fetching weather for ${city}...`);

  return {
    city,
    temperature: 28,
    condition: "Sunny",
    humidity: "60%",
  };
}

// STEP 2: Define custom tool
const getWeatherTool = {
  name: "getWeather",
  description: "Get weather information for a given city.",

  parametersJsonSchema: {
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "Name of the city",
      },
    },
    required: ["city"],
  },
};

async function main() {
  const userPrompt = "Tell me the current weather in Delhi.";

  console.log("Sending request...");

  // 1. Ask Gemini
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: userPrompt,
    config: {
      tools: [
        {
          functionDeclarations: [getWeatherTool],
        },
      ],
    },
  });

  // 2. Read Gemini's tool call
  const functionCall = response.functionCalls?.[0];

  if (!functionCall) {
    console.log(response.text);
    return;
  }

  console.log("\nTool Requested:", functionCall.name);
  console.log("Arguments:", functionCall.args);

  // 3. Execute the actual backend function
  if (functionCall.name === "getWeather") {
    const city = String(functionCall.args?.city ?? "");

    const weatherData = await getWeather(city);

    console.log("\nTool Execution Result:");
    console.log(weatherData);

    // 4. Send tool result back to Gemini
    const modelContent = response.candidates?.[0]?.content;

    if (!modelContent) {
      throw new Error("Gemini model response content is missing.");
    }

    const finalResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",

      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },

        modelContent,

        {
          role: "user",
          parts: [
            {
              functionResponse: {
                name: functionCall.name,
                response: weatherData,
              },
            },
          ],
        },
      ],

      config: {
        tools: [
          {
            functionDeclarations: [getWeatherTool],
          },
        ],
      },
    });

    // 5. Display final answer
    console.log("\nFinal AI Response:");
    console.log(finalResponse.text);
  }
}

main().catch(console.error);