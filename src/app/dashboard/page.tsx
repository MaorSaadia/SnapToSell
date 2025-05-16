"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  // Using a mock subscription since we're having database connection issues
  const mockSubscription = {
    tier: "Professional",
    status: "ACTIVE",
    remainingCredits: 200,
  };

  if (isLoading) {
    return (
      <div className="container py-6 px-4 md:px-6 md:py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 px-4 md:px-6 md:py-8">
      <div className="flex flex-col gap-6 md:gap-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome to SnapToSell, {user?.name || "User"}
          </h1>
          <p className="text-gray-500">
            Generate AI-powered product descriptions and social media content
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Content Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Images Processed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Credits Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {mockSubscription.remainingCredits}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {mockSubscription.tier}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-500">
                Upload a product image and get AI-generated descriptions and
                social media content in seconds.
              </p>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/dashboard/generate">Create Content</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-500">
                Upload, manage, and organize your product images and other media
                files.
              </p>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/dashboard/media">Media Library</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-500">
                Track your AI usage, view content history, and analyze your content generation patterns.
              </p>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/dashboard/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-gray-500">
                  No recent activity. Start generating content to see your
                  history here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="font-medium">Current Plan</div>
                <div className="text-2xl font-bold">
                  {mockSubscription.tier}
                </div>
                <div className="text-sm text-gray-500">
                  Status: {mockSubscription.status}
                </div>
              </div>
              <div className="grid gap-2">
                <div className="font-medium">Credits</div>
                <div className="flex items-center gap-2">
                  <div className="text-xl font-bold">
                    {mockSubscription.remainingCredits}
                  </div>
                  <div className="text-sm text-gray-500">remaining</div>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href="/dashboard/settings">Manage Subscription</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
