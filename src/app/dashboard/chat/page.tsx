import React from "react";
import { Metadata } from "next";
import ChatClient from "./ChatClient";

export const metadata: Metadata = {
  title: "AI Chat - Snap to Sell",
  description: "Chat with our AI assistant about your products and marketing",
};

export default function ChatPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          AI Marketing Assistant
        </h1>
        <p className="text-gray-600 mb-8">
          Chat with our AI assistant to get marketing advice, content
          suggestions, and answers to your questions.
        </p>

        {/* Client component loaded */}
        <div className="mb-10">
          <ChatClient />
        </div>
      </div>
    </div>
  );
}
