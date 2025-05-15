import React, { useState, useRef } from "react";
import { ContentGenerationOptions } from "@/lib/gemini";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Components } from "react-markdown";
import SocialCaptionFormatter from "./SocialCaptionFormatter";

interface ContentDisplayProps {
  content: string;
  contentType: ContentGenerationOptions["contentType"];
  platform?: ContentGenerationOptions["platform"];
  onRegenerate?: () => Promise<void>;
  isRegenerating?: boolean;
}

// Define the code element props type to include the inline property
interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
}

// Custom renderers for markdown elements to improve appearance
const markdownRenderers: Components = {
  // Style headings with better typography and spacing
  h1: (props) => (
    <h1 className="text-xl font-semibold text-gray-900 mb-3 mt-4" {...props} />
  ),
  h2: (props) => (
    <h2 className="text-lg font-semibold text-gray-800 mb-2 mt-4" {...props} />
  ),
  h3: (props) => (
    <h3
      className="text-base font-semibold text-gray-800 mb-2 mt-3"
      {...props}
    />
  ),
  // Enhance bullet points
  ul: (props) => <ul className="list-disc pl-5 my-3 space-y-1" {...props} />,
  // Style ordered lists
  ol: (props) => <ol className="list-decimal pl-5 my-3 space-y-1" {...props} />,
  // Better formatting for list items
  li: (props) => <li className="text-gray-700 mb-1" {...props} />,
  // Style links attractively
  a: ({ href, ...props }) => (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-800 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  // Style bold text without showing asterisks
  strong: (props) => <span className="font-bold text-gray-900" {...props} />,
  // Style italics without showing asterisks
  em: (props) => <span className="italic text-gray-800" {...props} />,
  // Style code blocks with syntax highlighting appearance
  code: ({ className, inline, ...props }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || "");
    const isInline = !match && (inline || false);
    return (
      <code
        className={`${
          isInline
            ? "px-1 py-0.5 bg-gray-100 rounded"
            : "block p-2 bg-gray-100 overflow-x-auto my-2"
        } text-sm font-mono text-gray-800`}
        {...props}
      />
    );
  },
  // Better paragraphs with proper spacing
  p: (props) => <p className="mb-3 text-gray-800" {...props} />,
};

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  content,
  contentType,
  platform,
  onRegenerate,
  isRegenerating = false,
}) => {
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [showSocialFormatter, setShowSocialFormatter] = useState(false);

  // Handle copy to clipboard
  const handleCopy = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(editedContent);
      setCopied(true);

      // Reset copied status after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  // Handle content edit
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Save edited content
  const handleSave = () => {
    setIsEditing(false);
  };

  // Toggle social formatting tools
  const toggleSocialFormatter = () => {
    setShowSocialFormatter(!showSocialFormatter);
  };

  // Calculate character count and words
  const charCount = editedContent.length;
  const wordCount = editedContent.trim().split(/\s+/).length;

  // Format title
  const formatTitle = () => {
    switch (contentType) {
      case "website":
        return "Website Product Description";
      case "social":
        return `${
          platform
            ? platform.charAt(0).toUpperCase() + platform.slice(1)
            : "Social Media"
        } Post`;
      case "video":
        return "Video Title & Description";
      default:
        return "Generated Content";
    }
  };

  // Show special formatter for social media content
  const isSocialContent = contentType === "social" || contentType === "video";

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">{formatTitle()}</h3>
        <div className="flex space-x-2">
          {!isEditing ? (
            <>
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {copied ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                    Copy
                  </>
                )}
              </button>
              {isSocialContent && (
                <button
                  type="button"
                  onClick={toggleSocialFormatter}
                  className="inline-flex items-center px-3 py-1.5 border border-purple-300 text-xs font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  {showSocialFormatter ? "Hide Formatter" : "Format for Social"}
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-3 py-1.5 border border-green-300 text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Save
            </button>
          )}
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className={`inline-flex items-center px-3 py-1.5 border border-blue-300 text-xs font-medium rounded-md 
                ${
                  isRegenerating
                    ? "text-blue-400 bg-blue-50 cursor-not-allowed"
                    : "text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
            >
              {isRegenerating ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-1 text-blue-500"
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
                  Regenerating...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Regenerate
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Show social media formatter if enabled */}
      {showSocialFormatter && isSocialContent ? (
        <div className="mt-4 border rounded-lg p-4 bg-gray-50">
          <h4 className="text-md font-medium mb-3">Social Media Formatting</h4>
          <SocialCaptionFormatter
            content={editedContent}
            platform={platform || "instagram"}
          />
        </div>
      ) : (
        <div
          className={`mt-2 p-4 rounded-md ${
            isEditing ? "bg-white border border-blue-200" : "bg-gray-50"
          }`}
        >
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-64 p-0 border-0 focus:ring-0 text-gray-800 resize-none"
              autoFocus
            />
          ) : (
            <div ref={contentRef} className="prose max-w-none text-gray-800">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownRenderers}
              >
                {editedContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
        <div>
          {charCount} characters · {wordCount} words
        </div>
        {platform && (contentType === "social" || contentType === "video") && (
          <div>
            Platform: <span className="font-medium">{platform}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDisplay;
