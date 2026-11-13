
import "dotenv/config";
import { GoogleGenAI ,Type  } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  console.log("Sending request...");

const response = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",

  contents: `
    Extract product information from this text:

    "Sony wireless headphones are available for 2999 rupees."

    Return product details.
  `,

  config: {
    responseMimeType: "application/json",

    responseSchema: {
      type: Type.OBJECT,

      properties: {
        productName: {
          type: Type.STRING,
          description: "Name of the product",
        },

        price: {
          type: Type.NUMBER,
          description: "Product price as a number",
        },

        available: {
          type: Type.BOOLEAN,
          description: "Whether the product is available",
        },
      },

      required: ["productName", "price", "available"],
    },
  },
});


  console.log("\nStructured Output:\n");
  console.log(response.text);

  const product = JSON.parse(response.text!);

  console.log("\nProduct Name:", product.productName);
  console.log("Price:", product.price);
  console.log("Available:", product.available);
}

main().catch(console.error);
