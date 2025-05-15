"use client";

import React, { useState } from "react";
import VideoUploader from "./VideoUploader";
import { ContentGenerationOptions } from "@/lib/gemini";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface VideoContentGeneratorProps {
  onGenerate: (
    options: ContentGenerationOptions,
    videoUrl?: string,
    textPrompt?: string
  ) => Promise<void>;
  isGenerating: boolean;
}

type SocialPlatformType = "instagram" | "tiktok" | "facebook" | "youtube";
type ToneType =
  | "professional"
  | "casual"
  | "enthusiastic"
  | "formal"
  | "humorous"
  | "inspirational";

const socialPlatforms = [
  { id: "instagram" as SocialPlatformType, name: "Instagram", icon: "📱" },
  { id: "tiktok" as SocialPlatformType, name: "TikTok", icon: "🎵" },
  { id: "facebook" as SocialPlatformType, name: "Facebook", icon: "👍" },
  { id: "youtube" as SocialPlatformType, name: "YouTube", icon: "▶️" },
];

const toneMappings = [
  {
    id: "professional" as ToneType,
    name: "Professional",
    description: "Polished and business-oriented",
  },
  {
    id: "casual" as ToneType,
    name: "Casual",
    description: "Relaxed and conversational",
  },
  {
    id: "enthusiastic" as ToneType,
    name: "Enthusiastic",
    description: "Excited and energetic",
  },
  {
    id: "formal" as ToneType,
    name: "Formal",
    description: "Serious and reserved",
  },
  {
    id: "humorous" as ToneType,
    name: "Humorous",
    description: "Funny and entertaining",
  },
  {
    id: "inspirational" as ToneType,
    name: "Inspirational",
    description: "Uplifting and motivational",
  },
];

const VideoContentGenerator: React.FC<VideoContentGeneratorProps> = ({
  onGenerate,
  isGenerating,
}) => {
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [textPrompt, setTextPrompt] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatformType>("instagram");
  const [selectedTone, setSelectedTone] = useState<ToneType>("enthusiastic");
  const [keywords, setKeywords] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("video-only");

  const handleVideoSelect = (url: string) => {
    setVideoUrl(url);
  };

  const handleGenerate = async () => {
    if (!videoUrl && !textPrompt) {
      alert("Please upload a video or enter a text prompt");
      return;
    }

    // Parse keywords
    const keywordsArray = keywords
      ? keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0)
      : undefined;

    // Build enhanced text prompt if product details are provided
    let enhancedPrompt = textPrompt;
    if (productName) {
      enhancedPrompt += `\nProduct Name: ${productName}`;
    }
    if (productDescription) {
      enhancedPrompt += `\nProduct Description: ${productDescription}`;
    }

    // Create generation options
    const options: ContentGenerationOptions = {
      contentType: "video",
      platform: selectedPlatform,
      tone: selectedTone,
      includeKeywords: keywordsArray,
    };

    // Call the generate function
    await onGenerate(options, videoUrl, enhancedPrompt || undefined);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="video-only">Video Upload</TabsTrigger>
          <TabsTrigger value="text-prompt">Text Description</TabsTrigger>
        </TabsList>

        <TabsContent value="video-only" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Upload Video</Label>
              <VideoUploader
                onVideoSelect={(url) => handleVideoSelect(url)}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload a video of your product to generate captions
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="productName">Product Name (optional)</Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProductName(e.target.value)
                  }
                  placeholder="e.g. Eco-Friendly Water Bottle"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="productDescription">
                  Product Description (optional)
                </Label>
                <Textarea
                  id="productDescription"
                  value={productDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setProductDescription(e.target.value)
                  }
                  placeholder="Brief description of your product features and benefits"
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="text-prompt" className="space-y-4 pt-4">
          <div>
            <Label htmlFor="textPrompt">Text Prompt</Label>
            <Textarea
              id="textPrompt"
              value={textPrompt}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setTextPrompt(e.target.value)
              }
              placeholder="Describe your product and what you want to highlight in the social media content"
              rows={5}
              className="mt-1"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="platform">Target Platform</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {socialPlatforms.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => setSelectedPlatform(platform.id)}
                className={`px-4 py-3 text-sm rounded-md border flex items-center ${
                  selectedPlatform === platform.id
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="mr-2">{platform.icon}</span>
                {platform.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="tone">Content Tone</Label>
          <Select
            value={selectedTone}
            onValueChange={(value: ToneType) => setSelectedTone(value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              {toneMappings.map((tone) => (
                <SelectItem key={tone.id} value={tone.id}>
                  <div>
                    <span className="font-medium">{tone.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      - {tone.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="keywords">Keywords (comma separated)</Label>
        <Input
          id="keywords"
          value={keywords}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setKeywords(e.target.value)
          }
          placeholder="e.g. sustainable, trendy, affordable"
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Important keywords to include in your social media captions
        </p>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || (!videoUrl && !textPrompt)}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating Content...
          </>
        ) : (
          "Generate Social Media Captions"
        )}
      </Button>
    </div>
  );
};

export default VideoContentGenerator;
