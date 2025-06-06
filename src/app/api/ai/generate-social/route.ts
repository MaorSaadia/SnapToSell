import { NextRequest, NextResponse } from "next/server";
import {
  generateContentFromImage,
  generateContentFromText,
  ContentGenerationOptions,
} from "@/lib/gemini";
import { auth } from "@/../auth";
import globalCache from "@/lib/cache";

// Character limits by platform
const PLATFORM_LIMITS = {
  instagram: 2200,
  tiktok: 2200,
  facebook: 63206,
  twitter: 280,
};

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

    // Ensure we have the right options for social media
    const contentOptions: ContentGenerationOptions = {
      ...options,
      contentType: "social",
    };

    // Apply platform-specific character limits if needed
    if (contentOptions.platform && !contentOptions.maxLength) {
      contentOptions.maxLength =
        PLATFORM_LIMITS[
          contentOptions.platform as keyof typeof PLATFORM_LIMITS
        ] || 2000;
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
      // Cache social media content for 12 hours
      globalCache.set(cacheKey, content, 12 * 3600);
    }

    // Return the generated content
    return NextResponse.json({
      content,
      cached: false,
    });
  } catch (error) {
    console.error("Error in generate-social API:", error);
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
