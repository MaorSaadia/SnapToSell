"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

// Content history type
type ContentHistoryItem = {
  id: string;
  userId: string;
  productName: string;
  contentType: string;
  platform?: string | null;
  tone: string;
  content: string;
  imageBase64?: string | null;
  textPrompt?: string | null;
  generatedAt: string;
  keywords: string[];
};

// Map content type to display text
const contentTypeMap: Record<string, string> = {
  website: "Product Description",
  social: "Social Media Post",
  video: "Video Script"
};

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ContentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentHistoryItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/history");
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch content history");
        }
        
        const data = await response.json();
        setHistory(data.contentHistory);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user]);

  const handleViewContent = (item: ContentHistoryItem) => {
    setSelectedContent(item);
    setDialogOpen(true);
  };

  const handleDownload = (item: ContentHistoryItem) => {
    // Create a text file with the content
    const element = document.createElement("a");
    const file = new Blob([item.content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${item.productName.replace(/\s+/g, "-").toLowerCase()}-${new Date(item.generatedAt).toISOString().split("T")[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRegenerate = (item: ContentHistoryItem) => {
    // Navigate to generate page with prefilled data
    window.location.href = `/dashboard/generate?regenerate=${item.id}`;
  };

  // Get a preview of the content (first 150 characters)
  const getContentPreview = (content: string) => {
    return content.length > 150 ? `${content.substring(0, 150)}...` : content;
  };

  return (
    <div className="container py-6 px-4 md:px-6 md:py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Content History</h1>
          <p className="text-gray-500">
            View and reuse your previously generated content
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))
          ) : history.length > 0 ? (
            history.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {item.productName}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {contentTypeMap[item.contentType] || item.contentType}
                        {item.platform && ` - ${item.platform}`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(item.generatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Display product image if available */}
                  {item.imageBase64 && (
                    <div className="mb-4 flex justify-center">
                      <div className="relative h-40 w-full max-w-xs">
                        <Image 
                          src={item.imageBase64} 
                          alt={item.productName || 'Product image'}
                          fill
                          className="object-contain rounded-md"
                          unoptimized // Since we're using base64 encoded images
                        />
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-gray-700">{getContentPreview(item.content)}</p>
                  {item.keywords && item.keywords.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.keywords.map((keyword, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => handleViewContent(item)}
                      className="text-xs text-primary hover:text-primary/80 font-medium">
                      View Full Content
                    </button>
                    <span className="text-gray-300">|</span>
                    <button 
                      onClick={() => handleRegenerate(item)}
                      className="text-xs text-primary hover:text-primary/80 font-medium">
                      Regenerate
                    </button>
                    <span className="text-gray-300">|</span>
                    <button 
                      onClick={() => handleDownload(item)}
                      className="text-xs text-primary hover:text-primary/80 font-medium">
                      Download
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-gray-500">
                You haven&apos;t generated any content yet. Go to the{" "}
                <a
                  href="/dashboard/generate"
                  className="text-primary hover:text-primary/80"
                >
                  Generate Content
                </a>{" "}
                page to create your first content.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content view dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedContent?.productName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-sm font-medium">Type: </span>
                <span className="text-sm">
                  {selectedContent && contentTypeMap[selectedContent.contentType]}
                  {selectedContent?.platform && ` - ${selectedContent.platform}`}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium">Date: </span>
                <span className="text-sm">
                  {selectedContent && new Date(selectedContent.generatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {/* Display product image in modal if available */}
            {selectedContent?.imageBase64 && (
              <div className="mb-6 flex justify-center">
                <div className="relative h-60 w-full max-w-md">
                  <Image 
                    src={selectedContent.imageBase64} 
                    alt={selectedContent.productName || 'Product image'}
                    fill
                    className="object-contain rounded-md"
                    unoptimized // Since we're using base64 encoded images
                  />
                </div>
              </div>
            )}
            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md border overflow-auto max-h-[50vh]">
              {selectedContent?.content}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => selectedContent && handleDownload(selectedContent)}
              >
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
