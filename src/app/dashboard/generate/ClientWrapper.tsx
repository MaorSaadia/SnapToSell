"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Loading state component
function LoadingState() {
  return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-500">Loading content generator...</p>
    </div>
  );
}

// Dynamically import the actual content component
const GenerateContentClient = dynamic(() => import("./GenerateContentClient"), {
  loading: () => <LoadingState />,
  ssr: false,
});

export default function ClientWrapper() {
  const [isClient, setIsClient] = useState(false);

  // This ensures the component only renders on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingState />;
  }

  return <GenerateContentClient />;
}
