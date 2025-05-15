import { NextRequest, NextResponse } from "next/server";
import {
  generateContentFromImage,
  generateContentFromText,
  ContentGenerationOptions,
} from "@/lib/gemini";
import { auth } from "@/../auth";
import globalCache from "@/lib/cache";

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request
    const { imageBase64, textPrompt, options, cacheKey } = await request.json();

    // Validate input
    if (!imageBase64 && !textPrompt) {
      return NextResponse.json(
        { error: "Must provide either imageBase64 or textPrompt" },
        { status: 400 }
      );
    }

    // Validate options
    if (!options || typeof options !== "object") {
      return NextResponse.json(
        { error: "Missing content generation options" },
        { status: 400 }
      );
    }

    // Ensure we have the right options for website descriptions
    const contentOptions: ContentGenerationOptions = {
      ...options,
      contentType: "website",
    };

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
    let content: string;
    if (imageBase64) {
      content = await generateContentFromImage(imageBase64, contentOptions);
    } else {
      content = await generateContentFromText(
        textPrompt as string,
        contentOptions
      );
    }

    // Store in cache if cacheKey is provided
    if (cacheKey && content) {
      // Cache website descriptions for 24 hours
      globalCache.set(cacheKey, content, 24 * 3600);
    }

    // Return the generated content
    return NextResponse.json({
      content,
      cached: false,
    });
  } catch (error) {
    console.error("Error in generate-website API:", error);
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
