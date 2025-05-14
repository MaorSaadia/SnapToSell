"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FileUpload } from "./ui/file-upload";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import {
  fetchMediaItems,
  deleteMediaItem,
  createMediaItem,
} from "@/lib/media-utils";
import { Input } from "./ui/input";

// Types
interface MediaItem {
  id: string;
  url: string;
  name: string;
  createdAt: string;
  size: number;
  type: string;
}

interface MediaManagerProps {
  onSelectMedia?: (url: string) => void;
  className?: string;
}

export function MediaManager({ onSelectMedia, className }: MediaManagerProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 10;

  // Fetch media items
  const loadMediaItems = async (query = searchQuery, pageIndex = page) => {
    setIsLoading(true);
    try {
      const response = await fetchMediaItems({
        limit,
        offset: pageIndex * limit,
        search: query,
      });

      setMediaItems(response.items);
      setTotal(response.total);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading media:", error);
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadMediaItems();
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(0);
    loadMediaItems(searchQuery, 0);
  };

  // Handle new file upload
  const handleUpload = async (url: string | undefined) => {
    try {
      // Check if we have a valid URL
      if (!url) {
        console.error("No URL provided to handleUpload");
        return;
      }

      console.log("Image uploaded to Cloudinary:", url);

      // Extract filename from URL
      const filename = url.split("/").pop() || `upload-${Date.now()}.jpg`;

      // Create media item in database
      await createMediaItem({
        url,
        name: filename,
        size: 0, // Size unknown from Cloudinary
        type: "image/jpeg", // Default to JPEG
      });

      // Reload media items to show the new one
      loadMediaItems();
    } catch (error) {
      console.error("Error saving media:", error);
    }
  };

  // Handle media selection
  const handleSelect = (id: string) => {
    setSelectedItem(id);
    const item = mediaItems.find((item) => item.id === id);
    if (item && onSelectMedia) {
      onSelectMedia(item.url);
    }
  };

  // Handle media deletion
  const handleDelete = async (id: string) => {
    try {
      await deleteMediaItem(id);

      // Update UI
      setMediaItems((prev) => prev.filter((item) => item.id !== id));
      if (selectedItem === id) {
        setSelectedItem(null);
      }
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  // Handle pagination
  const handleNextPage = () => {
    const newPage = page + 1;
    setPage(newPage);
    loadMediaItems(searchQuery, newPage);
  };

  const handlePrevPage = () => {
    const newPage = Math.max(0, page - 1);
    setPage(newPage);
    loadMediaItems(searchQuery, newPage);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Media Library</h2>
        <p className="text-gray-500">Upload and manage your product images</p>
      </div>

      <div className="mb-6">
        <FileUpload
          onUpload={handleUpload}
          maxFiles={1}
          maxSize={10 * 1024 * 1024} // 10MB
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
          <Input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit" size="sm">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500 mr-2">{total} media items</p>
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("grid")}
          >
            Grid
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("list")}
          >
            List
          </Button>
        </div>
      </div>

      <Separator className="mb-4" />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading media...</p>
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">No media items found</p>
          {searchQuery ? (
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                loadMediaItems("", 0);
              }}
            >
              Clear search
            </Button>
          ) : (
            <p className="text-sm text-gray-400">
              Upload your first image above
            </p>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "relative group cursor-pointer border rounded-lg overflow-hidden",
                selectedItem === item.id && "ring-2 ring-primary"
              )}
              onClick={() => handleSelect(item.id)}
            >
              <div className="aspect-square relative">
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2 text-xs truncate">{item.name}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50",
                selectedItem === item.id && "bg-gray-100"
              )}
              onClick={() => handleSelect(item.id)}
            >
              <div className="h-12 w-12 relative mr-3">
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()} •{" "}
                  {formatFileSize(item.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <Button
            onClick={handlePrevPage}
            disabled={page === 0}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "Unknown";

  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}
