"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUpload: (url: string) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  className?: string;
  acceptedFileTypes?: string[];
}

export function FileUpload({
  onUpload,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB default
  className,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/webp"],
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Reset error state
      setError(null);

      // Handle file size validation
      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > maxSize
      );
      if (oversizedFiles.length > 0) {
        setError(
          `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`
        );
        return;
      }

      // Handle file type validation
      const invalidFiles = acceptedFiles.filter(
        (file) => !acceptedFileTypes.includes(file.type)
      );
      if (invalidFiles.length > 0) {
        setError(
          `Invalid file type. Accepted types: ${acceptedFileTypes.join(", ")}`
        );
        return;
      }

      // Update files state
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
      setFiles(newFiles);

      // Create previews
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    },
    [files, maxFiles, maxSize, acceptedFileTypes]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", files[0]);

      // Upload to server
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      console.log("Upload successful:", data);

      if (data.secure_url) {
        // Pass the URL back to the parent component
        onUpload(data.secure_url);

        // Reset files after successful upload
        setFiles([]);
        setPreviews([]);
      } else {
        throw new Error("No secure URL returned from upload");
      }
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 cursor-pointer flex flex-col items-center justify-center",
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300",
          files.length > 0 && "border-primary"
        )}
      >
        <input {...getInputProps()} />

        {previews.length > 0 ? (
          <div className="flex flex-wrap gap-2 w-full">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <Image
                  src={preview}
                  alt={`Preview ${index}`}
                  width={100}
                  height={100}
                  className="object-cover rounded-md"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="text-4xl mb-2">📁</div>
            <p className="text-center text-gray-500">
              {isDragActive
                ? "Drop files here"
                : "Drag & drop files here, or click to select"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Accepted file types: {acceptedFileTypes.join(", ")}
            </p>
            <p className="text-xs text-gray-400">
              Max size: {maxSize / (1024 * 1024)}MB
            </p>
          </>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {files.length > 0 && (
        <Button
          onClick={handleUpload}
          disabled={isUploading}
          className="mt-4 w-full"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      )}
    </div>
  );
}
