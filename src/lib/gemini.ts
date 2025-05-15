import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Initialize the Gemini API with API key
const apiKey = process.env.GEMINI_API_KEY;

// Error if API key is not set
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in the environment variables");
}

// Initialize the API client
const genAI = new GoogleGenerativeAI(apiKey as string);

// Safety settings to ensure appropriate content generation
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Rate limiting variables
const MAX_REQUESTS_PER_MINUTE = 30;
const requestTimestamps: number[] = [];

// Check if request exceeds rate limit
function isRateLimited(): boolean {
  const now = Date.now();
  // Remove timestamps older than 1 minute
  const oneMinuteAgo = now - 60 * 1000;
  while (requestTimestamps.length > 0 && requestTimestamps[0] < oneMinuteAgo) {
    requestTimestamps.shift();
  }

  // Check if we've exceeded the rate limit
  return requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE;
}

// Record a new request timestamp
function recordRequest(): void {
  requestTimestamps.push(Date.now());
}

// Helper function to properly process Base64 image data
function processBase64Image(base64String: string): string {
  // If the string already has a data URL prefix, extract just the Base64 part
  if (base64String.startsWith("data:image")) {
    // Extract the actual base64 data after the comma
    const commaIndex = base64String.indexOf(",");
    if (commaIndex !== -1) {
      return base64String.substring(commaIndex + 1);
    }
  }
  return base64String;
}

// Interface for content generation options
export interface ContentGenerationOptions {
  contentType: "website" | "social" | "video";
  platform?: "instagram" | "tiktok" | "facebook" | "twitter";
  tone: "professional" | "casual" | "enthusiastic" | "formal";
  maxLength?: number;
  includeKeywords?: string[];
}

// Generate text content based on image analysis
export async function generateContentFromImage(
  imageBase64: string,
  options: ContentGenerationOptions
): Promise<string> {
  // Check rate limiting
  if (isRateLimited()) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }

  try {
    // Record this request
    recordRequest();

    // Select appropriate model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Construct the prompt based on options
    let promptText = `Analyze this product image and `;

    switch (options.contentType) {
      case "website":
        promptText += `create a professional product description for an e-commerce website. `;
        break;
      case "social":
        promptText += `create a compelling ${
          options.platform || "social media"
        } post to sell this product. `;
        break;
      case "video":
        promptText += `create an engaging video title and description for this product. `;
        break;
    }

    promptText += `Use a ${options.tone} tone. `;

    if (options.maxLength) {
      promptText += `Keep the text under ${options.maxLength} characters. `;
    }

    if (options.includeKeywords && options.includeKeywords.length > 0) {
      promptText += `Include these keywords if appropriate: ${options.includeKeywords.join(
        ", "
      )}. `;
    }

    // Process the base64 image data properly
    const processedImageData = processBase64Image(imageBase64);

    // Prepare the image for the prompt
    const imageParts = [
      {
        inlineData: {
          data: processedImageData,
          mimeType: "image/jpeg",
        },
      },
    ];

    // Generate content
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: promptText }, ...imageParts] },
      ],
      safetySettings,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error(
      `Failed to generate content: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Helper function for generating content with text only (no image)
export async function generateContentFromText(
  prompt: string,
  options: ContentGenerationOptions
): Promise<string> {
  // Check rate limiting
  if (isRateLimited()) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }

  try {
    // Record this request
    recordRequest();

    // Select appropriate model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Construct the prompt based on options
    let promptText = prompt + ` `;

    promptText += `Use a ${options.tone} tone. `;

    if (options.maxLength) {
      promptText += `Keep the text under ${options.maxLength} characters. `;
    }

    if (options.includeKeywords && options.includeKeywords.length > 0) {
      promptText += `Include these keywords if appropriate: ${options.includeKeywords.join(
        ", "
      )}. `;
    }

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: promptText }] }],
      safetySettings,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error(
      `Failed to generate content: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
