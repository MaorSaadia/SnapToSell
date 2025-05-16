"use client";

import React, { useState } from "react";
import Chat from "@/components/ai/Chat";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, TrendingUp } from "lucide-react";

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

  const examplePrompts = [
    {
      text: "Write a compelling product description for our new eco-friendly water bottle that keeps drinks cold for 24 hours",
      icon: <Sparkles className="w-4 h-4" />,
      color: "bg-gradient-to-r from-blue-500 to-teal-400",
    },
    {
      text: "Create an Instagram carousel post for our summer fashion collection targeting Gen Z",
      icon: <MessageSquare className="w-4 h-4" />,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
      text: "Suggest a full marketing strategy for launching our new organic skincare line",
      icon: <TrendingUp className="w-4 h-4" />,
      color: "bg-gradient-to-r from-amber-500 to-red-500",
    },
    {
      text: "Create a newsletter subject line and opening paragraph that will increase our open rates",
      icon: <Sparkles className="w-4 h-4" />,
      color: "bg-gradient-to-r from-emerald-500 to-cyan-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left sidebar: Features and context */}
      <div className="lg:col-span-3">
        <Card className="h-full bg-white shadow-lg border-0 overflow-hidden">
          <div className="bg-black p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              SnapToSell AI
            </h2>
            <p className="text-blue-100 text-sm">
              Your AI marketing partner for e-commerce success
            </p>
          </div>

          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  What I can help with:
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 p-1">
                      <Sparkles className="w-3.5 h-3.5" />
                    </Badge>
                    <span className="text-sm font-medium text-gray-800">
                      Product descriptions that convert
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-50 p-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </Badge>
                    <span className="text-sm font-medium text-gray-800">
                      Engaging social media content
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 p-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </Badge>
                    <span className="text-sm font-medium text-gray-800">
                      Data-driven marketing strategies
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Try these prompts:
                </h3>
                <div className="space-y-3">
                  {examplePrompts.map((prompt, index) => (
                    <div
                      key={index}
                      className="group relative cursor-pointer p-0.5 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                      style={{ background: prompt.color }}
                      onClick={() => handleSendMessage(prompt.text)}
                    >
                      <div className="bg-white p-3 rounded-md flex items-start gap-2 transition-all">
                        <div className="flex-shrink-0 mt-0.5">
                          {prompt.icon}
                        </div>
                        <p className="text-sm text-gray-800 font-medium group-hover:text-gray-900">
                          {prompt.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side: Chat interface */}
      <div className="lg:col-span-9">
        <Card className="border-0 shadow-lg overflow-hidden h-full">
          <CardContent className="p-0">
            <div className="bg-black p-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat with SnapToSell AI
              </h2>
            </div>
            <Chat
              initialMessages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
