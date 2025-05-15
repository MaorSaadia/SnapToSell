"use client";

import React, { useState, useCallback } from "react";
import Chat from "@/components/ai/Chat";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! I'm your AI marketing assistant. How can I help with your marketing content today?",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);

    // Add user message to state
    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // Call API to get AI response
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();

      // Add AI response to messages
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error communicating with AI:", error);

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error while processing your request. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function for product description requests
  const handleProductDescriptionRequest = useCallback(() => {
    const message =
      "Create a concise, ready-to-use product description for an e-commerce site. Focus on key features and benefits only.";
    handleSendMessage(message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left sidebar: Features and context */}
      <div className="lg:col-span-3">
        <Card className="h-full">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              AI Marketing Assistant
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Ask anything about product marketing and content creation.
            </p>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">
                  Generate product descriptions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Create social media posts</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">
                  Get marketing strategy advice
                </span>
              </li>
            </ul>

            <div className="my-6 pt-6 border-t border-b pb-6">
              <h3 className="font-medium text-sm mb-3">Quick Actions:</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full text-left justify-start text-sm h-auto py-2"
                  onClick={handleProductDescriptionRequest}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Get concise product description
                </Button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <h3 className="font-medium text-sm mb-3">
                Example prompts to try:
              </h3>
              <div className="space-y-2">
                <div
                  className="text-xs bg-gray-50 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                  onClick={() =>
                    handleSendMessage(
                      "Write a brief, compelling product description for a premium coffee maker"
                    )
                  }
                >
                  Write a brief, compelling product description for a premium
                  coffee maker
                </div>
                <div
                  className="text-xs bg-gray-50 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                  onClick={() =>
                    handleSendMessage(
                      "Create an Instagram post for a fitness apparel brand"
                    )
                  }
                >
                  Create an Instagram post for a fitness apparel brand
                </div>
                <div
                  className="text-xs bg-gray-50 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                  onClick={() =>
                    handleSendMessage(
                      "What are 5 strategies to increase customer engagement?"
                    )
                  }
                >
                  What are 5 strategies to increase customer engagement?
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side: Chat interface */}
      <div className="lg:col-span-9">
        <Chat
          initialMessages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
