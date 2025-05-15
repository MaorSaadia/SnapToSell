import React from "react";
import { Metadata } from "next";
import ClientWrapper from "./ClientWrapper";

export const metadata: Metadata = {
  title: "Generate Content - Snap to Sell",
  description: "Generate product descriptions and social media content with AI",
};

export default function GeneratePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          AI Content Generation
        </h1>
        <p className="text-gray-600 mb-8">
          Upload a product image or enter a text description, and let our AI
          generate compelling content for your website or social media.
        </p>

        {/* Client component loaded through wrapper */}
        <div className="mb-10">
          <ClientWrapper />
        </div>
      </div>
    </div>
  );
}
