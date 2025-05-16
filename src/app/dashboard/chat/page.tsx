import React from "react";
import { Metadata } from "next";
import ChatClient from "./ChatClient";

export const metadata: Metadata = {
  title: "AI Chat - Snap to Sell",
  description: "Chat with our AI assistant about your products and marketing",
};

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            {/* <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
              <Sparkles className="w-6 h-6 text-black-600" />
            </div> */}
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-black mb-4">
              AI Marketing Assistant
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Transform your e-commerce content with our AI assistant. Get
              product descriptions, social media posts, and marketing strategies
              tailored to your brand.
            </p>
          </div>

          {/* Client component loaded */}
          <div className="mb-6">
            <ChatClient />
          </div>
        </div>
      </div>
    </div>
  );
}
