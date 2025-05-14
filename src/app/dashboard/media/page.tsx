"use client";

import { useState } from "react";
import { MediaManager } from "@/components/media-manager";

export default function MediaPage() {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  // Handle media selection
  const handleSelectMedia = (url: string) => {
    setSelectedMedia(url);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Media Library</h1>

      <div className="grid grid-cols-1 gap-6">
        <MediaManager onSelectMedia={handleSelectMedia} />
      </div>

      {selectedMedia && (
        <div className="mt-8 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Selected Media</h2>
          <p className="mb-2 text-sm font-mono break-all">{selectedMedia}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(selectedMedia);
              alert("URL copied to clipboard!");
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Copy URL
          </button>
        </div>
      )}
    </div>
  );
}
