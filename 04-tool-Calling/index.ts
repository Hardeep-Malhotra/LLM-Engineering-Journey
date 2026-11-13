
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ==========================================
// STEP 1: BACKEND FUNCTIONS
// ==========================================

// Tool 1: Weather
async function getWeather(city: string) {
  console.log(`Fetching weather for ${city}...`);

  return {
    city,
    temperature: 28,
    condition: "Sunny",
    humidity: "60%",
  };
}

// Tool 2: Current Time
async function getCurrentTime(city: string) {
  console.log(`Getting current time for ${city}...`);

  return {
    city,
    currentTime: "05:30 PM",
    timezone: "Asia/Kolkata",
  };
}

// Tool 3: Population
async function getPopulation(city: string) {
  console.log(`Getting population for ${city}...`);

  return {
    city,
    population: "Approximately 3.3 crore",
  };
}

// ==========================================
// STEP 2: TOOL DEFINITIONS
// ==========================================

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

const getCurrentTimeTool = {
  name: "getCurrentTime",
  description: "Get the current local time for a given city.",
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

const getPopulationTool = {
  name: "getPopulation",
  description: "Get the population information for a given city.",
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

// Register all tools
const tools = [
  getWeatherTool,
  getCurrentTimeTool,
  getPopulationTool,
];

// ==========================================
// STEP 3: MAIN FUNCTION
// ==========================================

async function main() {
  const userPrompt =
    "Tell me the weather, current time, and population of Delhi. Use all three available tools.";

  console.log("Sending request...");

  // Ask Gemini to select the required tools
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: userPrompt,

    config: {
      tools: [
        {
          functionDeclarations: tools,
        },
      ],
    },
  });

  // Read all requested function calls
  const functionCalls = response.functionCalls ?? [];

  if (functionCalls.length === 0) {
    console.log("\nNormal AI Response:");
    console.log(response.text);
    return;
  }

  console.log("\nFunction Calls:");
  console.log(functionCalls);

  // ==========================================
  // STEP 4: EXECUTE MULTIPLE TOOLS
  // ==========================================

  const functionResponses = [];

  for (const functionCall of functionCalls) {
    const args = functionCall.args ?? {};
    const city = String(args.city ?? "");

    if (!city) {
      throw new Error("City argument is missing.");
    }

    let result;

    switch (functionCall.name) {
      case "getWeather":
        result = await getWeather(city);
        break;

      case "getCurrentTime":
        result = await getCurrentTime(city);
        break;

      case "getPopulation":
        result = await getPopulation(city);
        break;

      default:
        throw new Error(
          `Unknown tool: ${functionCall.name}`
        );
    }

    console.log(`\nResult from ${functionCall.name}:`);
    console.log(result);

    // Store each tool's result
    functionResponses.push({
      functionResponse: {
        name: functionCall.name,
        id: functionCall.id,
        response: result,
      },
    });
  }

  // ==========================================
  // STEP 5: SEND RESULTS BACK TO GEMINI
  // ==========================================

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
        parts: functionResponses,
      },
    ],

    config: {
      tools: [
        {
          functionDeclarations: tools,
        },
      ],
    },
  });

  // ==========================================
  // STEP 6: FINAL AI RESPONSE
  // ==========================================

  console.log("\nFinal AI Response:");
  console.log(finalResponse.text);
}

// Execute main function
main().catch((error) => {
  console.error("Error:", error);
});
