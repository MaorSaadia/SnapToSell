import { NextRequest, NextResponse } from "next/server";
import {
  generateContentFromImage,
  generateContentFromText,
  ContentGenerationOptions,
} from "@/lib/gemini";
import { auth } from "@/../auth";
import globalCache from "@/lib/cache";

// Platform-specific limits and formatting guidelines
const PLATFORM_FORMATS = {
  instagram: {
    maxLength: 2200,
    formatPrompt:
      "Format with appropriate line breaks, emojis, and hashtags that work well on Instagram. Include 5-10 relevant hashtags at the end.",
  },
  tiktok: {
    maxLength: 2200,
    formatPrompt:
      "Format with short, punchy sentences and trending TikTok hashtags. Include 3-5 relevant hashtags.",
  },
  facebook: {
    maxLength: 63206,
    formatPrompt:
      "Format with appropriate paragraphs and minimal hashtags. Focus on storytelling and engagement questions.",
  },
  youtube: {
    maxLength: 5000,
    formatPrompt:
      "Format as a YouTube description with timestamps, links, and calls to action. Include relevant keywords for SEO.",
  },
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

    // Ensure we have the right options for social media content
    const contentOptions: ContentGenerationOptions = {
      ...options,
      contentType: "social",
    };

    // Apply platform-specific constraints if platform is specified
    if (contentOptions.platform && PLATFORM_FORMATS[contentOptions.platform]) {
      const platformFormat = PLATFORM_FORMATS[contentOptions.platform];

      // Set the max length for the platform if not specified
      if (!contentOptions.maxLength) {
        contentOptions.maxLength = platformFormat.maxLength;
      }

      // Don't exceed platform limits
      contentOptions.maxLength = Math.min(
        contentOptions.maxLength,
        platformFormat.maxLength
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
    let content: string;

    // Construct enhanced prompt with platform-specific formatting guidelines
    let enhancedPrompt = textPrompt || "";
    if (contentOptions.platform && PLATFORM_FORMATS[contentOptions.platform]) {
      const formatPrompt =
        PLATFORM_FORMATS[contentOptions.platform].formatPrompt;
      enhancedPrompt = enhancedPrompt
        ? `${enhancedPrompt}\n\n${formatPrompt}`
        : formatPrompt;
    }

    if (imageBase64) {
      content = await generateContentFromImage(imageBase64, contentOptions);
    } else {
      content = await generateContentFromText(enhancedPrompt, contentOptions);
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
