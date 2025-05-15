"use client";

import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { extractVideoFrames } from "@/lib/video-utils";

interface VideoUploaderProps {
  onVideoSelect: (videoUrl: string, file: File, frames?: string[]) => void;
  videoPreview?: string;
  className?: string;
  accept?: string;
  maxSize?: number;
  extractFrames?: boolean;
  numFrames?: number;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({
  onVideoSelect,
  videoPreview,
  className = "",
  accept = "video/mp4, video/quicktime, video/webm",
  maxSize = 50 * 1024 * 1024, // 50MB default
  extractFrames = true,
  numFrames = 3,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    videoPreview
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [extractedFrames, setExtractedFrames] = useState<string[]>([]);
  const [processingFrames, setProcessingFrames] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setIsLoading(true);
      setError(null);
      setUploadProgress(0);
      setExtractedFrames([]);

      const file = acceptedFiles[0];

      // Check file size
      if (file.size > maxSize) {
        setError(
          `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`
        );
        setIsLoading(false);
        return;
      }

      try {
        // Create a preview URL for the video
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Upload the video file
        const formData = new FormData();
        formData.append("file", file);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/upload", true);

        // Track upload progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        };

        xhr.onload = async () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);

            // Extract frames if enabled
            let frames: string[] = [];
            if (extractFrames) {
              try {
                setProcessingFrames(true);
                frames = await extractVideoFrames(file, numFrames);
                setExtractedFrames(frames);
              } catch (frameError) {
                console.error("Error extracting frames:", frameError);
              } finally {
                setProcessingFrames(false);
              }
            }

            // Call the onVideoSelect callback with video URL and frames
            onVideoSelect(response.secure_url, file, frames);
            setIsLoading(false);
          } else {
            setError("Upload failed. Please try again.");
            setIsLoading(false);
          }
        };

        xhr.onerror = () => {
          setError("Upload failed due to network error. Please try again.");
          setIsLoading(false);
        };

        xhr.send(formData);
      } catch (err) {
        console.error("Error uploading video:", err);
        setError("Failed to upload video. Please try again.");
        setIsLoading(false);
      }
    },
    [maxSize, onVideoSelect, extractFrames, numFrames]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/mp4": [".mp4"],
      "video/quicktime": [".mov"],
      "video/webm": [".webm"],
    },
    maxSize,
    multiple: false,
  });

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleRemoveVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(undefined);
    setDuration(null);
    setUploadProgress(0);
    setExtractedFrames([]);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed p-4 rounded-lg cursor-pointer min-h-[200px] flex flex-col items-center justify-center",
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300",
          previewUrl && "border-primary"
        )}
      >
        <input {...getInputProps()} />

        {previewUrl ? (
          <div className="w-full relative">
            <video
              ref={videoRef}
              src={previewUrl}
              controls
              className="w-full rounded-md max-h-[300px]"
              onLoadedMetadata={handleLoadedMetadata}
            />
            {duration !== null && (
              <div className="mt-2 text-sm text-gray-600">
                Duration: {formatDuration(duration)}
              </div>
            )}
            <button
              onClick={handleRemoveVideo}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M24 10v8m0 0v8m0-8h8m-8 0h-8"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="8" y="8" width="32" height="32" rx="4" strokeWidth={2} />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              {isDragActive
                ? "Drop the video here..."
                : "Drag and drop a video, or click to browse"}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {`Supports: ${accept} (Max: ${maxSize / (1024 * 1024)}MB)`}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="w-full mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-center mt-2 text-sm text-gray-500">
              Uploading: {uploadProgress}%
            </p>
          </div>
        )}

        {processingFrames && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-600">
              Processing video frames...
            </p>
          </div>
        )}

        {extractedFrames.length > 0 && (
          <div className="mt-4 w-full">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Extracted Frames:
            </p>
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {extractedFrames.map((frame, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 relative h-24 w-24 border rounded overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={frame}
                    alt={`Frame ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default VideoUploader;
