"use client";

import React, { useState } from "react";
import ContentGenerationForm from "@/components/ai/ContentGenerationForm";
import ContentDisplay from "@/components/ai/ContentDisplay";
import { ContentGenerationOptions } from "@/lib/gemini";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GenerateContentClient: React.FC = () => {
  // State for content generation
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [lastOptions, setLastOptions] =
    useState<ContentGenerationOptions | null>(null);
  const [lastImageBase64, setLastImageBase64] = useState<string | null>(null);
  const [lastTextPrompt, setLastTextPrompt] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("website");
  const [error, setError] = useState<string | null>(null);

  // Generate content based on form input
  const handleGenerateContent = async (
    options: ContentGenerationOptions,
    imageBase64?: string,
    textPrompt?: string
  ) => {
    try {
      setError(null);
      setIsGenerating(true);

      // Store for regeneration
      setLastOptions(options);
      setLastImageBase64(imageBase64 || null);
      setLastTextPrompt(textPrompt || null);

      // Determine which API endpoint to use based on content type
      let endpoint = "";

      switch (options.contentType) {
        case "website":
          endpoint = "/api/ai/generate-website";
          break;
        case "social":
          endpoint = "/api/ai/generate-social";
          break;
        case "video":
          endpoint = "/api/ai/generate-video";
          break;
        default:
          endpoint = "/api/ai/analyze-image";
      }

      // Generate a cache key
      const cacheKey = imageBase64
        ? `${options.contentType}-${options.tone}-${
            options.platform || ""
          }-${imageBase64.substring(0, 100)}`
        : `${options.contentType}-${options.tone}-${
            options.platform || ""
          }-${textPrompt?.substring(0, 100)}`;

      // Call API
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64,
          textPrompt,
          options,
          cacheKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate content");
      }

      const data = await response.json();
      setGeneratedContent(data.content);
      
      // Save the generated content to history
      await saveToHistory(data.content, options, imageBase64, textPrompt);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error generating content:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Save content to history
  const saveToHistory = async (
    content: string,
    options: ContentGenerationOptions,
    imageBase64?: string,
    textPrompt?: string
  ) => {
    try {
      // Extract product name from prompt or use default
      const productName = textPrompt 
        ? textPrompt.split("\n")[0].substring(0, 50) // Use first line of prompt as product name
        : "Unnamed Product";

      // Save to history API
      const response = await fetch("/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          options,
          imageBase64,
          textPrompt,
          productName
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error saving to history:", errorData.error);
      }
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  };

  // Handle regeneration with same parameters
  const handleRegenerate = async () => {
    if (!lastOptions) return;

    try {
      setError(null);
      setIsRegenerating(true);

      // Determine which API endpoint to use based on content type
      let endpoint = "";

      switch (lastOptions.contentType) {
        case "website":
          endpoint = "/api/ai/generate-website";
          break;
        case "social":
          endpoint = "/api/ai/generate-social";
          break;
        case "video":
          endpoint = "/api/ai/generate-video";
          break;
        default:
          endpoint = "/api/ai/analyze-image";
      }

      // Call API without the cache key to force regeneration
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: lastImageBase64,
          textPrompt: lastTextPrompt,
          options: lastOptions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to regenerate content");
      }

      const data = await response.json();
      setGeneratedContent(data.content);
      
      // Save the regenerated content to history
      if (lastOptions) {
        await saveToHistory(data.content, lastOptions, lastImageBase64 || undefined, lastTextPrompt || undefined);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error regenerating content:", err);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setGeneratedContent(null); // Clear previous content
    setError(null);
  };

  // Website content generation handler
  const handleWebsiteGenerate = async (
    options: ContentGenerationOptions,
    imageBase64?: string,
    textPrompt?: string
  ) => {
    // Force website content type
    const websiteOptions: ContentGenerationOptions = {
      ...options,
      contentType: "website",
    };

    await handleGenerateContent(websiteOptions, imageBase64, textPrompt);
  };

  // Social media content generation handler
  const handleSocialGenerate = async (
    options: ContentGenerationOptions,
    imageBase64?: string,
    textPrompt?: string
  ) => {
    // Force social content type
    const socialOptions: ContentGenerationOptions = {
      ...options,
      contentType: "social",
    };

    await handleGenerateContent(socialOptions, imageBase64, textPrompt);
  };

  // Video content generation handler
  const handleVideoGenerate = async (
    options: ContentGenerationOptions,
    imageBase64?: string,
    textPrompt?: string
  ) => {
    // Force video content type
    const videoOptions: ContentGenerationOptions = {
      ...options,
      contentType: "video",
    };

    await handleGenerateContent(videoOptions, imageBase64, textPrompt);
  };

  return (
    <div className="space-y-8">
      <Tabs
        defaultValue="website"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="website">Website</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="video">Video Content</TabsTrigger>
        </TabsList>

        <TabsContent value="website" className="mt-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Generate Website Product Descriptions
            </h2>
            <p className="text-gray-600 mb-6">
              Create professional and SEO-friendly product descriptions for your
              website or e-commerce store.
            </p>
            <ContentGenerationForm
              onGenerate={handleWebsiteGenerate}
              isGenerating={isGenerating}
              defaultOptions={{
                tone: "professional",
                contentType: "website",
              }}
              hideContentTypeSelector={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Generate Social Media Content
            </h2>
            <p className="text-gray-600 mb-6">
              Create engaging posts optimized for different social media
              platforms.
            </p>
            <ContentGenerationForm
              onGenerate={handleSocialGenerate}
              isGenerating={isGenerating}
              defaultOptions={{
                tone: "casual",
                contentType: "social",
                platform: "instagram",
              }}
              hideContentTypeSelector={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="video" className="mt-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Generate Video Titles & Descriptions
            </h2>
            <p className="text-gray-600 mb-6">
              Create catchy titles and descriptions for your product videos.
            </p>
            <ContentGenerationForm
              onGenerate={handleVideoGenerate}
              isGenerating={isGenerating}
              defaultOptions={{
                tone: "enthusiastic",
                contentType: "video",
              }}
              hideContentTypeSelector={true}
            />
          </div>
        </TabsContent>
      </Tabs>

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
            contentType={lastOptions?.contentType || "website"}
            platform={lastOptions?.platform}
            onRegenerate={handleRegenerate}
            isRegenerating={isRegenerating}
          />
        </div>
      )}
    </div>
  );
};

export default GenerateContentClient;
