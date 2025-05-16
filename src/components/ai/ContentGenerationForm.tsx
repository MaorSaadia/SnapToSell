import React, { useState, useEffect } from "react";
import { ContentGenerationOptions } from "@/lib/gemini";
import ImageUploader from "./ImageUploader";

interface ContentGenerationFormProps {
  onGenerate: (
    options: ContentGenerationOptions,
    imageBase64?: string,
    textPrompt?: string
  ) => Promise<void>;
  isGenerating: boolean;
  defaultOptions?: Partial<ContentGenerationOptions>;
  showImageUpload?: boolean;
  showTextPrompt?: boolean;
  hideContentTypeSelector?: boolean;
}

const PLATFORM_LIMITS = {
  instagram: 2200,
  tiktok: 2200,
  facebook: 63206,
  youtube: 5000,
};

const ContentGenerationForm: React.FC<ContentGenerationFormProps> = ({
  onGenerate,
  isGenerating,
  defaultOptions = {},
  showImageUpload = true,
  showTextPrompt = true,
  hideContentTypeSelector = false,
}) => {
  // Form states
  const [contentType, setContentType] = useState<
    ContentGenerationOptions["contentType"]
  >(defaultOptions.contentType || "website");
  const [platform, setPlatform] = useState<
    ContentGenerationOptions["platform"]
  >(defaultOptions.platform || "instagram");
  const [tone, setTone] = useState<ContentGenerationOptions["tone"]>(
    defaultOptions.tone || "professional"
  );
  const [maxLength, setMaxLength] = useState<number | undefined>(
    defaultOptions.maxLength ||
      (defaultOptions.platform
        ? PLATFORM_LIMITS[defaultOptions.platform]
        : undefined)
  );
  const [keywords, setKeywords] = useState<string>(
    defaultOptions.includeKeywords
      ? defaultOptions.includeKeywords.join(", ")
      : ""
  );
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [textPrompt, setTextPrompt] = useState<string>("");

  // Update maxLength when platform changes
  useEffect(() => {
    if (contentType === "social" && platform) {
      setMaxLength(PLATFORM_LIMITS[platform]);
    }
  }, [platform, contentType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!showImageUpload && !showTextPrompt) {
      alert("You must provide either an image or a text prompt");
      return;
    }

    if (!showImageUpload && !textPrompt) {
      alert("Please enter a text prompt");
      return;
    }

    if (!showTextPrompt && !imageBase64) {
      alert("Please upload an image");
      return;
    }

    // Parse keywords
    const keywordsArray = keywords
      ? keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0)
      : undefined;

    // Prepare options
    const options: ContentGenerationOptions = {
      contentType,
      tone,
      ...(contentType === "social" ? { platform } : {}),
      ...(maxLength ? { maxLength } : {}),
      ...(keywordsArray && keywordsArray.length > 0
        ? { includeKeywords: keywordsArray }
        : {}),
    };

    try {
      // Track generation event for analytics
      // This would typically be an API call to record the generation in the database
      const trackAnalytics = async () => {
        try {
          // Example API call (would be implemented on backend)
          // await fetch('/api/analytics/track', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({
          //     contentType,
          //     platform: contentType === "social" ? platform : null,
          //     tone,
          //     promptText: textPrompt || null,
          //     hasImage: !!imageBase64,
          //     keywords: keywordsArray || [],
          //   }),
          // });
          console.log('Analytics tracked:', {
            contentType,
            platform: contentType === "social" ? platform : null,
            tone,
            keywords: keywordsArray || [],
          });
        } catch (error) {
          console.error('Failed to track analytics:', error);
          // Non-blocking error - content was still generated
        }
      };

      // Call the generate function
      await onGenerate(options, imageBase64, textPrompt || undefined);
      
      // Track analytics after successful generation
      trackAnalytics();
    } catch (error) {
      console.error('Content generation failed:', error);
      // You could display an error notification here
    }
  };

  const handleImageSelect = (base64: string) => {
    setImageBase64(base64);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left column */}
        <div className="space-y-6">
          {/* Content type selector - only show if not hidden */}
          {!hideContentTypeSelector && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content type
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setContentType("website")}
                  className={`px-4 py-2 text-sm rounded-md border ${
                    contentType === "website"
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Website
                </button>
                <button
                  type="button"
                  onClick={() => setContentType("social")}
                  className={`px-4 py-2 text-sm rounded-md border ${
                    contentType === "social"
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Social
                </button>
                <button
                  type="button"
                  onClick={() => setContentType("video")}
                  className={`px-4 py-2 text-sm rounded-md border ${
                    contentType === "video"
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Video
                </button>
              </div>
            </div>
          )}

          {/* Platform selector (only for social) */}
          {contentType === "social" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <button
                  type="button"
                  onClick={() => setPlatform("instagram")}
                  className={`px-4 py-2 text-sm rounded-md border ${
                    platform === "instagram"
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Instagram
                </button>
                <button
                  type="button"
                  onClick={() => setPlatform("tiktok")}
                  className={`px-4 py-2 text-sm rounded-md border ${
                    platform === "tiktok"
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  TikTok
                </button>
                <button
                  type="button"
                  onClick={() => setPlatform("facebook")}
                  className={`px-4 py-2 text-sm rounded-md border ${
                    platform === "facebook"
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Facebook
                </button>
                <button
                  type="button"
                  onClick={() => setPlatform("youtube")}
                  className={`px-4 py-2 text-sm rounded-md border ${
                    platform === "youtube"
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  YouTube
                </button>
              </div>
            </div>
          )}

          {/* Tone selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tone
            </label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <button
                type="button"
                onClick={() => setTone("professional")}
                className={`px-4 py-2 text-sm rounded-md border ${
                  tone === "professional"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Professional
              </button>
              <button
                type="button"
                onClick={() => setTone("casual")}
                className={`px-4 py-2 text-sm rounded-md border ${
                  tone === "casual"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Casual
              </button>
              <button
                type="button"
                onClick={() => setTone("enthusiastic")}
                className={`px-4 py-2 text-sm rounded-md border ${
                  tone === "enthusiastic"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Enthusiastic
              </button>
              <button
                type="button"
                onClick={() => setTone("formal")}
                className={`px-4 py-2 text-sm rounded-md border ${
                  tone === "formal"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Formal
              </button>
            </div>
          </div>

          {/* Character limit */}
          <div>
            <label
              htmlFor="maxLength"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Maximum length (characters)
            </label>
            <input
              type="number"
              id="maxLength"
              value={maxLength || ""}
              onChange={(e) =>
                setMaxLength(
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              min="50"
              max="5000"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
              placeholder="Maximum character count"
              disabled={contentType === "social" && !!platform}
            />
            {contentType === "social" && platform && (
              <p className="text-xs text-gray-500 mt-1">
                {`Character limit for ${platform}: ${PLATFORM_LIMITS[platform]}`}
              </p>
            )}
          </div>

          {/* Keywords */}
          <div>
            <label
              htmlFor="keywords"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Keywords (comma separated)
            </label>
            <input
              type="text"
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
              placeholder="E.g. sustainable, handmade, premium"
            />
          </div>

          {/* Text prompt */}
          {showTextPrompt && (
            <div>
              <label
                htmlFor="textPrompt"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Text prompt (optional)
              </label>
              <textarea
                id="textPrompt"
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                placeholder="Describe your product if you're not uploading an image"
              />
            </div>
          )}
        </div>

        {/* Right column - Image upload */}
        {showImageUpload && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product image (optional)
            </label>
            <ImageUploader
              onImageSelect={(base64) => handleImageSelect(base64)}
              className="h-full"
            />
          </div>
        )}
      </div>

      {/* Submit button */}
      <div>
        <button
          type="submit"
          disabled={isGenerating || (!imageBase64 && !textPrompt)}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${
              isGenerating || (!imageBase64 && !textPrompt)
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
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
            "Generate Content"
          )}
        </button>
      </div>
    </form>
  );
};

export default ContentGenerationForm;
