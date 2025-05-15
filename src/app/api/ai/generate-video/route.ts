import { NextRequest, NextResponse } from "next/server";
import {
  generateContentFromImage,
  generateContentFromText,
  ContentGenerationOptions,
} from "@/lib/gemini";
import { auth } from "@/../auth";
import globalCache from "@/lib/cache";

// Platform-specific formats for video content
const VIDEO_PLATFORM_FORMATS = {
  instagram: {
    maxLength: 2200,
    formatPrompt:
      "Create a short, engaging caption for Instagram Reels that includes emojis and 5-7 relevant hashtags at the end. Focus on hooking viewers in the first sentence.",
  },
  tiktok: {
    maxLength: 2200,
    formatPrompt:
      "Create a short, catchy TikTok caption with trending hashtags and call-to-action. Keep it casual and use relevant emojis. Include 3-5 trending hashtags.",
  },
  facebook: {
    maxLength: 8000,
    formatPrompt:
      "Write an engaging Facebook video description that tells a story about the product. Include a clear call-to-action and 1-2 relevant hashtags. Structure it with proper paragraphs.",
  },
  youtube: {
    maxLength: 5000,
    formatPrompt:
      "Create a detailed YouTube video description with timestamps for key sections, product details, and a strong call-to-action. Include links and relevant keywords for SEO. Format with proper paragraph breaks.",
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
    const {
      imageBase64,
      textPrompt,
      options,
      videoUrl,
      cacheKey,
      extractedFrames,
    } = await request.json();

    // Validate input
    if (!imageBase64 && !textPrompt && !videoUrl) {
      return NextResponse.json(
        { error: "Must provide either image, video, or text prompt" },
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

    // Ensure we have the right options for video content
    const contentOptions: ContentGenerationOptions = {
      ...options,
      contentType: "video",
    };

    // Apply platform-specific constraints if platform is specified
    if (
      contentOptions.platform &&
      VIDEO_PLATFORM_FORMATS[contentOptions.platform]
    ) {
      const platformFormat = VIDEO_PLATFORM_FORMATS[contentOptions.platform];

      // Set the max length for the platform if not specified
      if (!contentOptions.maxLength) {
        contentOptions.maxLength = platformFormat.maxLength;
      }

      // Don't exceed platform limits
      contentOptions.maxLength = Math.min(
        contentOptions.maxLength,
        platformFormat.maxLength
      );
    } else if (!contentOptions.maxLength) {
      contentOptions.maxLength = 500; // Default length for video descriptions
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

    // Prepare enhanced prompt based on platform and provided video
    let enhancedPrompt = textPrompt || "";

    // Generate content with Gemini
    let content: string;

    // If we have extracted frames from the video, use the first frame for visual analysis
    if (extractedFrames && extractedFrames.length > 0) {
      // Create a detailed prompt describing the video based on all frames
      enhancedPrompt += enhancedPrompt ? "\n\n" : "";
      enhancedPrompt +=
        "This video contains the following key frames (analyze these to understand the video content):";

      // We'll use the first frame for image analysis and describe the rest
      const firstFrame = extractedFrames[0];

      // Add platform-specific formatting instructions
      if (
        contentOptions.platform &&
        VIDEO_PLATFORM_FORMATS[contentOptions.platform]
      ) {
        const formatPrompt =
          VIDEO_PLATFORM_FORMATS[contentOptions.platform].formatPrompt;
        enhancedPrompt = enhancedPrompt
          ? `${enhancedPrompt}\n\n${formatPrompt}`
          : formatPrompt;
      }

      // Generate content using the first frame as the image
      content = await generateContentFromImage(firstFrame, contentOptions);
    } else if (imageBase64) {
      // Traditional image analysis if an image is directly provided
      content = await generateContentFromImage(imageBase64, contentOptions);
    } else {
      // If no extracted frames or direct image, just use the text prompt with video URL
      if (videoUrl) {
        enhancedPrompt += enhancedPrompt
          ? `\n\nVideo URL: ${videoUrl}`
          : `Video URL: ${videoUrl}`;
        enhancedPrompt +=
          "\nPlease create caption and description for this video.";
      }

      // Add platform-specific formatting instructions
      if (
        contentOptions.platform &&
        VIDEO_PLATFORM_FORMATS[contentOptions.platform]
      ) {
        const formatPrompt =
          VIDEO_PLATFORM_FORMATS[contentOptions.platform].formatPrompt;
        enhancedPrompt = enhancedPrompt
          ? `${enhancedPrompt}\n\n${formatPrompt}`
          : formatPrompt;
      }

      content = await generateContentFromText(enhancedPrompt, contentOptions);
    }

    // Store in cache if cacheKey is provided
    if (cacheKey && content) {
      // Cache video content for 8 hours
      globalCache.set(cacheKey, content, 8 * 3600);
    }

    // Return the generated content
    return NextResponse.json({
      content,
      cached: false,
    });
  } catch (error) {
    console.error("Error in generate-video API:", error);
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
