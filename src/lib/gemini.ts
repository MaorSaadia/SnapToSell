import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the pro vision model
export const geminiProVision = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

// Helper function to convert an image to a GoogleGenerativeAI.Part
export async function fileToGenerativePart(file: File) {
  const buffer = await file.arrayBuffer();
  return {
    inlineData: {
      data: Buffer.from(buffer).toString("base64"),
      mimeType: file.type,
    },
  };
}
