import React, { useState, useRef } from "react";
import { ContentGenerationOptions } from "@/lib/gemini";

interface ContentDisplayProps {
  content: string;
  contentType: ContentGenerationOptions["contentType"];
  platform?: ContentGenerationOptions["platform"];
  onRegenerate?: () => Promise<void>;
  isRegenerating?: boolean;
}

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
          <div
            ref={contentRef}
            className="prose max-w-none text-gray-800 whitespace-pre-wrap"
          >
            {editedContent}
          </div>
        )}
      </div>

      <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
        <div>
          {charCount} characters · {wordCount} words
        </div>
        {platform && contentType === "social" && (
          <div>
            Platform: <span className="font-medium">{platform}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDisplay;
