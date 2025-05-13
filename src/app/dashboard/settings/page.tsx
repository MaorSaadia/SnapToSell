"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function SettingsPage() {
  const { user, subscription, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      // In a real app, you'd make an API call to update the user profile
      // For now, we'll just simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while updating your profile.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-6 px-4 md:px-6 md:py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 px-4 md:px-6 md:py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500">Manage your account settings</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {message.text && (
                <div
                  className={`mb-4 p-3 rounded-md text-sm ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    placeholder="Your company name"
                  />
                </div>

                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Password
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Change your password to keep your account secure
                </p>
                <Button variant="outline">Change Password</Button>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Management</CardTitle>
            <CardDescription>
              Manage your subscription plan and billing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {subscription ? (
              <>
                <div className="grid gap-2">
                  <div className="font-medium">Current Plan</div>
                  <div className="text-2xl font-bold">{subscription.tier}</div>
                  <div className="text-sm text-gray-500">
                    Status: {subscription.status}
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="font-medium">Credits</div>
                  <div className="flex items-center gap-2">
                    <div className="text-xl font-bold">
                      {subscription.remainingCredits}
                    </div>
                    <div className="text-sm text-gray-500">
                      remaining this month
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline">Upgrade Plan</Button>
                  <Button
                    variant="outline"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    Cancel Subscription
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">
                  You don't have an active subscription.
                </p>
                <Button asChild>
                  <Link href="/pricing">View Plans</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>
              Choose the plan that works best for your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-2 hover:border-primary hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <CardDescription>
                    For individuals getting started
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    $0
                    <span className="text-sm font-normal text-gray-500">
                      /mo
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2 text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      50 content generations per month
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2 text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Basic product descriptions
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2 text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Basic social media content
                    </li>
                  </ul>
                  <Button
                    variant={
                      subscription?.tier === "Free" ? "outline" : "default"
                    }
                    className="w-full"
                    disabled={subscription?.tier === "Free"}
                  >
                    {subscription?.tier === "Free"
                      ? "Current Plan"
                      : "Select Plan"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary shadow-md">
                <CardHeader>
                  <CardTitle>Professional</CardTitle>
                  <CardDescription>
                    For small to medium businesses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    $29.99
                    <span className="text-sm font-normal text-gray-500">
                      /mo
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2 text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      200 content generations per month
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2 text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Advanced product descriptions
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2 text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Social media content with hashtags
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2 text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      SEO-optimized content
                    </li>
                  </ul>
                  <Button
                    variant={
                      subscription?.tier === "Professional"
                        ? "outline"
                        : "default"
                    }
                    className="w-full"
                    disabled={subscription?.tier === "Professional"}
                  >
                    {subscription?.tier === "Professional"
                      ? "Current Plan"
                      : "Select Plan"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle>Business</CardTitle>
                  <CardDescription>
                    For larger ecommerce operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    $79.99
                    <span className="text-sm font-normal text-gray-500">
                      /mo
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2 text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      1000 content generations per month
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2 text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Premium product descriptions
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2 text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Advanced social media content
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2 text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Priority support
                    </li>
                  </ul>
                  <Button
                    variant={
                      subscription?.tier === "Business" ? "outline" : "default"
                    }
                    className="w-full"
                    disabled={subscription?.tier === "Business"}
                  >
                    {subscription?.tier === "Business"
                      ? "Current Plan"
                      : "Select Plan"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
