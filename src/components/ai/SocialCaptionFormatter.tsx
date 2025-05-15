"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clipboard, Download, CheckCircle2 } from "lucide-react";

interface SocialCaptionFormatterProps {
  content: string;
  platform?: string;
}

interface PlatformFormatting {
  icon: string;
  color: string;
  instructions: string[];
  previewClass: string;
  formatCaption: (caption: string) => string;
}

const PLATFORM_FORMATTING: Record<string, PlatformFormatting> = {
  instagram: {
    icon: "📱",
    color: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500",
    instructions: [
      "Keep captions concise but engaging",
      "Use line breaks to improve readability",
      "Use 5-10 relevant hashtags at the end",
      "Include a call-to-action",
      "Use emojis to add personality",
    ],
    previewClass: "font-sans max-w-md bg-white p-4 rounded-lg shadow-lg",
    formatCaption: (caption: string) => {
      // Ensure hashtags are at the end
      let formatted = caption;
      const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
      const hashtags = caption.match(hashtagRegex) || [];

      if (hashtags.length > 0) {
        // Remove hashtags from the main text
        formatted = caption.replace(hashtagRegex, "").trim();

        // Add hashtags at the end with proper spacing
        formatted += "\n\n";
        formatted += hashtags.join(" ");
      }

      return formatted;
    },
  },
  tiktok: {
    icon: "🎵",
    color: "bg-black",
    instructions: [
      "Keep it super short (under 150 characters ideal)",
      "Use trending hashtags (3-5 maximum)",
      "Include trending sounds/music references",
      "Use emojis liberally",
      "Add a hook or question to encourage engagement",
    ],
    previewClass:
      "font-sans max-w-sm bg-black text-white p-3 rounded-lg shadow-lg",
    formatCaption: (caption: string) => {
      // Make TikTok captions more concise
      let formatted = caption;

      // Ensure it has emojis (if none found, add a few generic ones)
      const emojiRegex = /[\u{1F300}-\u{1F6FF}]/u;
      if (!emojiRegex.test(formatted)) {
        formatted += " ✨ 🔥 💯";
      }

      return formatted;
    },
  },
  facebook: {
    icon: "👍",
    color: "bg-blue-600",
    instructions: [
      "Use proper paragraphs for longer posts",
      "Include 1-2 relevant hashtags maximum",
      "Ask questions to drive engagement",
      "Tag relevant products or people",
      "Include links (shortened if possible)",
    ],
    previewClass:
      "font-sans max-w-xl bg-white border border-gray-300 p-4 rounded-lg shadow-sm",
    formatCaption: (caption: string) => {
      // Format for Facebook with proper paragraphs
      let formatted = caption;

      // Ensure paragraphs have proper spacing
      formatted = formatted.replace(/\n{3,}/g, "\n\n");

      return formatted;
    },
  },
  youtube: {
    icon: "▶️",
    color: "bg-red-600",
    instructions: [
      "Include timestamps for longer descriptions",
      "Add links to related content or products",
      "Use keywords for SEO optimization",
      "Structure with headers and sections",
      "Include social media links and calls-to-action",
    ],
    previewClass:
      "font-sans max-w-2xl bg-white p-4 border-l-4 border-red-600 shadow-md",
    formatCaption: (caption: string) => {
      // Format for YouTube with timestamps if not present
      let formatted = caption;

      // Check if timestamps are missing and add a placeholder
      if (!/((\d{1,2}:)?\d{1,2}:\d{2})/.test(formatted)) {
        formatted =
          "0:00 Intro\n0:15 Product Features\n0:45 How It Works\n1:15 Pricing\n\n" +
          formatted;
      }

      return formatted;
    },
  },
};

const SocialCaptionFormatter: React.FC<SocialCaptionFormatterProps> = ({
  content,
  platform = "instagram",
}) => {
  const [activePlatform, setActivePlatform] = useState<string>(platform);
  const [customized, setCustomized] = useState<string>(content);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadName, setDownloadName] = useState<string>("caption");

  // Apply platform-specific formatting when platform changes
  React.useEffect(() => {
    if (PLATFORM_FORMATTING[activePlatform]) {
      const formatted =
        PLATFORM_FORMATTING[activePlatform].formatCaption(content);
      setCustomized(formatted);
    } else {
      setCustomized(content);
    }
  }, [activePlatform, content]);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(customized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([customized], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${downloadName || "caption"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activePlatform} onValueChange={setActivePlatform}>
        <TabsList className="grid grid-cols-4">
          {Object.keys(PLATFORM_FORMATTING).map((key) => (
            <TabsTrigger
              key={key}
              value={key}
              className="flex items-center gap-1"
            >
              <span>{PLATFORM_FORMATTING[key].icon}</span>
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(PLATFORM_FORMATTING).map((key) => (
          <TabsContent key={key} value={key} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column: Guidelines */}
              <div className="space-y-4">
                <div
                  className={`${PLATFORM_FORMATTING[key].color} text-white p-4 rounded-lg`}
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {key.charAt(0).toUpperCase() + key.slice(1)} Best Practices
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {PLATFORM_FORMATTING[key].instructions.map(
                      (instruction, i) => (
                        <li key={i}>{instruction}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              {/* Right column: Preview and controls */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <Label htmlFor="caption" className="text-lg font-medium mb-2">
                    Formatted Caption
                  </Label>
                  <textarea
                    id="caption"
                    className="w-full min-h-[200px] p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={customized}
                    onChange={(e) => setCustomized(e.target.value)}
                  />
                </div>

                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="filename">Download Filename</Label>
                    <Input
                      id="filename"
                      value={downloadName}
                      onChange={(e) => setDownloadName(e.target.value)}
                      placeholder="Caption filename"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCopyClick}>
                      {copied ? (
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                      ) : (
                        <Clipboard className="mr-1 h-4 w-4" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button onClick={handleDownload}>
                      <Download className="mr-1 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>

                <div
                  className={`mt-4 ${PLATFORM_FORMATTING[key].previewClass}`}
                >
                  <div className="text-sm text-gray-500 mb-2">Preview:</div>
                  <div className="whitespace-pre-wrap">{customized}</div>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SocialCaptionFormatter;
