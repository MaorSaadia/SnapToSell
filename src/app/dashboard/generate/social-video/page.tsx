"use client";

import { useState } from "react";
import VideoContentGenerator from "@/components/ai/VideoContentGenerator";
import ContentDisplay from "@/components/ai/ContentDisplay";
import { ContentGenerationOptions } from "@/lib/gemini";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SocialVideoPage() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [lastOptions, setLastOptions] =
    useState<ContentGenerationOptions | null>(null);
  const [lastVideoUrl, setLastVideoUrl] = useState<string | null>(null);
  const [lastTextPrompt, setLastTextPrompt] = useState<string | null>(null);
  const [lastExtractedFrames, setLastExtractedFrames] = useState<
    string[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateContent = async (
    options: ContentGenerationOptions,
    videoUrl?: string,
    textPrompt?: string,
    extractedFrames?: string[]
  ) => {
    try {
      setError(null);
      setIsGenerating(true);

      // Store for regeneration
      setLastOptions(options);
      setLastVideoUrl(videoUrl || null);
      setLastTextPrompt(textPrompt || null);
      setLastExtractedFrames(extractedFrames || null);

      // Call API
      const cacheKey = videoUrl
        ? `${options.contentType}-${options.tone}-${
            options.platform || ""
          }-${videoUrl.substring(0, 100)}`
        : `${options.contentType}-${options.tone}-${
            options.platform || ""
          }-${textPrompt?.substring(0, 100)}`;

      const response = await fetch("/api/ai/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUrl,
          textPrompt,
          options,
          cacheKey,
          extractedFrames,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate content");
      }

      const data = await response.json();
      setGeneratedContent(data.content);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error generating content:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!lastOptions) return;

    try {
      setError(null);
      setIsRegenerating(true);

      // Call API without the cache key to force regeneration
      const response = await fetch("/api/ai/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUrl: lastVideoUrl,
          textPrompt: lastTextPrompt,
          options: lastOptions,
          extractedFrames: lastExtractedFrames,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to regenerate content");
      }

      const data = await response.json();
      setGeneratedContent(data.content);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error regenerating content:", err);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-8">
      <div className="mb-6">
        <Link href="/dashboard/generate">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Generate
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Social Media Video Content
          </h1>
          <p className="text-gray-600">
            Upload a product video or provide a description to generate
            platform-optimized captions and descriptions for your social media
            posts.
          </p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <VideoContentGenerator
            onGenerate={handleGenerateContent}
            isGenerating={isGenerating}
          />
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="font-medium">Error generating content:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Generated content display */}
        {generatedContent && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Generated Content</h2>
            <ContentDisplay
              content={generatedContent}
              contentType={lastOptions?.contentType || "video"}
              platform={lastOptions?.platform}
              onRegenerate={handleRegenerate}
              isRegenerating={isRegenerating}
            />
          </div>
        )}
      </div>
    </div>
  );
}
