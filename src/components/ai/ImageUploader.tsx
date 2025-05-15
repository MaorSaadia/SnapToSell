import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface ImageUploaderProps {
  onImageSelect: (base64: string, file: File) => void;
  imagePreview?: string;
  className?: string;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  imagePreview,
  className = "",
  accept = "image/jpeg, image/png, image/webp",
  maxSize = 5 * 1024 * 1024, // 5MB default
  multiple = false,
}) => {
  const [previewSrc, setPreviewSrc] = useState<string | undefined>(
    imagePreview
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setIsLoading(true);
      setError(null);

      const file = acceptedFiles[0];

      // Ensure image is properly encoded
      try {
        // Read the file as base64
        const reader = new FileReader();
        reader.onload = () => {
          try {
            if (typeof reader.result !== "string") {
              throw new Error("Failed to convert image to string");
            }

            const base64 = reader.result;
            setPreviewSrc(base64);
            onImageSelect(base64, file);
            setIsLoading(false);
          } catch (err) {
            console.error("Error processing image:", err);
            setError("Failed to process image. Please try another image.");
            setIsLoading(false);
          }
        };

        reader.onerror = () => {
          setError("Failed to read file");
          setIsLoading(false);
        };

        reader.readAsDataURL(file);
      } catch (err) {
        console.error("Error reading file:", err);
        setError("Failed to read file. Please try another image.");
        setIsLoading(false);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        [accept]: [],
      },
      maxSize,
      multiple,
      onDropRejected: (fileRejections) => {
        const rejection = fileRejections[0];
        if (rejection.errors[0].code === "file-too-large") {
          setError(
            `File is too large. Max size is ${maxSize / (1024 * 1024)}MB`
          );
        } else if (rejection.errors[0].code === "file-invalid-type") {
          setError(`Invalid file type. Accepted types: ${accept}`);
        } else {
          setError("File upload failed");
        }
      },
    });

  return (
    <div className={`w-full ${className}`}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${isDragReject ? "border-red-500 bg-red-50" : ""}
          ${isLoading ? "opacity-70 pointer-events-none" : ""}
        `}
      >
        <input {...getInputProps()} />

        {previewSrc ? (
          <div className="relative w-full h-48 mb-3">
            <Image
              src={previewSrc}
              alt="Preview"
              fill
              className="object-contain"
            />
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
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              {isDragActive
                ? "Drop the image here..."
                : "Drag and drop an image, or click to browse"}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {`Supports: ${accept} (Max: ${maxSize / (1024 * 1024)}MB)`}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="text-center mt-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Processing image...</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {previewSrc && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPreviewSrc(undefined);
          }}
          className="mt-2 text-sm text-red-500 hover:text-red-700"
        >
          Remove image
        </button>
      )}
    </div>
  );
};

export default ImageUploader;
