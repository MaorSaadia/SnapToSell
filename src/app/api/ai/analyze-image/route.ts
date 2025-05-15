import { NextRequest, NextResponse } from "next/server";
import {
  generateContentFromImage,
  ContentGenerationOptions,
} from "@/lib/gemini";
import { auth } from "@/../auth";
import globalCache from "@/lib/cache";

// Validate the content generation options
function validateOptions(
  options: unknown
): options is ContentGenerationOptions {
  if (!options || typeof options !== "object") return false;

  const opts = options as Partial<ContentGenerationOptions>;

  // Check required fields
  if (!opts.contentType || !opts.tone) {
    return false;
  }

  // Validate contentType
  if (!["website", "social", "video"].includes(opts.contentType)) {
    return false;
  }

  // Validate tone
  if (
    !["professional", "casual", "enthusiastic", "formal"].includes(opts.tone)
  ) {
    return false;
  }

  // If platform is specified, validate it
  if (
    opts.platform &&
    !["instagram", "tiktok", "facebook", "twitter"].includes(opts.platform)
  ) {
    return false;
  }

  // If maxLength is specified, validate it
  if (
    opts.maxLength !== undefined &&
    (typeof opts.maxLength !== "number" || opts.maxLength <= 0)
  ) {
    return false;
  }

  // If includeKeywords is specified, validate it
  if (
    opts.includeKeywords !== undefined &&
    (!Array.isArray(opts.includeKeywords) ||
      !opts.includeKeywords.every((k: string) => typeof k === "string"))
  ) {
    return false;
  }

  return true;
}

// Validate if string is a valid base64 image
function isValidBase64Image(str: string): boolean {
  // Check if it's a data URL
  if (str.startsWith("data:image/")) {
    // Extract the base64 part after the comma
    const base64Part = str.split(",")[1];
    if (!base64Part) return false;

    // Check if it's a valid base64 string
    try {
      return /^[A-Za-z0-9+/]*={0,2}$/.test(base64Part);
    } catch {
      // Ignore error and return false
      return false;
    }
  }

  // If it's not a data URL, check if it's just a base64 string
  try {
    return /^[A-Za-z0-9+/]*={0,2}$/.test(str);
  } catch {
    // Ignore error and return false
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request
    const { imageBase64, options, cacheKey } = await request.json();

    // Validate image
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid image data" },
        { status: 400 }
      );
    }

    // Validate if it's a proper base64 image
    if (!isValidBase64Image(imageBase64)) {
      return NextResponse.json(
        {
          error:
            "Invalid image format. Please provide a valid base64 encoded image",
        },
        { status: 400 }
      );
    }

    // Validate options
    if (!validateOptions(options)) {
      return NextResponse.json(
        { error: "Invalid content generation options" },
        { status: 400 }
      );
    }

    // Check cache if cacheKey is provided
    if (cacheKey) {
      const cachedResult = globalCache.get<string>(cacheKey);
      if (cachedResult) {
        return NextResponse.json({
          content: cachedResult,
          cached: true,
        });
      }
    }

    // Generate content with Gemini
    const content = await generateContentFromImage(imageBase64, options);

    // Store in cache if cacheKey is provided
    if (cacheKey && content) {
      globalCache.set(cacheKey, content, 3600); // Cache for 1 hour
    }

    // Return the generated content
    return NextResponse.json({
      content,
      cached: false,
    });
  } catch (error) {
    console.error("Error in analyze-image API:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}

// GET method returns error - only POST is supported
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST instead." },
    { status: 405 }
  );
}
