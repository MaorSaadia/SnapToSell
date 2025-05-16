"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import UsageChart from "@/components/analytics/UsageChart";
import ContentHistoryList from "@/components/analytics/ContentHistoryList";
import FavoritesList from "@/components/analytics/FavoritesList";

export default function AnalyticsPage() {
  const { user } = useAuth(); // Used to identify the current user
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGenerations: 0,
    websiteDescriptions: 0,
    socialMediaContent: 0,
    imagesProcessed: 0,
    totalCreditsUsed: 0,
  });
  
  // Define types for our content history and favorites
  interface ContentHistoryItem {
    id: string;
    contentType: string;
    platform: string | null;
    tone: string;
    createdAt: string;
    generatedContent: string;
    keywords: string[];
    isFavorite?: boolean;
  }
  
  interface FavoriteItem {
    id: string;
    contentGenerationId: string;
    contentType: string;
    platform: string | null;
    tone: string;
    createdAt: string;
    generatedContent: string;
    keywords: string[];
    notes?: string;
  }
  
  const [contentHistory, setContentHistory] = useState<ContentHistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // For demo purposes, we'll use mock data
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Mock data for analytics
      setStats({
        totalGenerations: 12,
        websiteDescriptions: 7,
        socialMediaContent: 5,
        imagesProcessed: 8,
        totalCreditsUsed: 15,
      });

      // Mock content history data
      setContentHistory([
        {
          id: "1",
          contentType: "website",
          platform: null,
          tone: "professional",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          generatedContent: "This elegant handcrafted leather wallet combines...",
          keywords: ["leather", "handcrafted", "premium"],
        },
        {
          id: "2",
          contentType: "social",
          platform: "instagram",
          tone: "casual",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          generatedContent: "✨ Elevate your style with our new collection...",
          keywords: ["fashion", "trending", "style"],
        },
        {
          id: "3",
          contentType: "social",
          platform: "tiktok",
          tone: "casual",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
          generatedContent: "Quick unboxing of our bestselling product...",
          keywords: ["unboxing", "review", "trendy"],
        },
      ]);

      // Mock favorites data
      setFavorites([
        {
          id: "1",
          contentGenerationId: "2",
          contentType: "social",
          platform: "instagram",
          tone: "casual",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          generatedContent: "✨ Elevate your style with our new collection...",
          keywords: ["fashion", "trending", "style"],
          notes: "Really like the emojis in this one",
        }
      ]);

      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Mock data for charts
  const usageData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "Content Generated",
        data: [1, 2, 0, 3, 4, 1, 1],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
      },
      {
        label: "Credits Used",
        data: [1, 3, 0, 3, 5, 2, 1],
        backgroundColor: "rgba(249, 115, 22, 0.5)",
        borderColor: "rgb(249, 115, 22)",
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="container py-6 px-4 md:px-6 md:py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 px-4 md:px-6 md:py-8">
      <div className="flex flex-col gap-6 md:gap-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-500">
            Track your AI content generation usage and metrics
          </p>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Generations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {stats.totalGenerations}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Website Descriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {stats.websiteDescriptions}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Social Media Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {stats.socialMediaContent}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Images Processed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {stats.imagesProcessed}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Credits Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {stats.totalCreditsUsed}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <UsageChart data={usageData} />
            </div>
          </CardContent>
        </Card>

        {/* Content History & Favorites */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="history">Content History</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Content Generation History</CardTitle>
              </CardHeader>
              <CardContent>
                <ContentHistoryList 
                  history={contentHistory}
                  onToggleFavorite={(id: string) => console.log(`Toggle favorite for ${id}`)}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Saved Content</CardTitle>
              </CardHeader>
              <CardContent>
                <FavoritesList 
                  favorites={favorites}
                  onRemoveFavorite={(id: string) => console.log(`Remove favorite ${id}`)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
