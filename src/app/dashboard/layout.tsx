"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";
import { useAuth } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold">Loading...</div>
          <p className="text-gray-500">
            Please wait while we load your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center space-x-2 m-2">
              <span className="text-2xl font-bold">SnapToSell</span>
            </Link>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/generate"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Generate Content
            </Link>
            <Link
              href="/dashboard/chat"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              AI Chat
            </Link>
            <Link
              href="/dashboard/media"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Media Library
            </Link>
            <Link
              href="/dashboard/history"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              History
            </Link>
            <Link
              href="/dashboard/settings"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Settings
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {user?.name || user?.email}
              </span>
              <LogoutButton variant="outline" />
            </div>
            <Button
              variant="outline"
              className="md:hidden"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
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
                className="h-5 w-5"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="container py-4 space-y-4">
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/generate"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Generate Content
                </Link>
                <Link
                  href="/dashboard/chat"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  AI Chat
                </Link>
                <Link
                  href="/dashboard/media"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Media Library
                </Link>
                <Link
                  href="/dashboard/history"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  History
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
              </nav>
              <div className="pt-2">
                <p className="text-sm text-gray-500 mb-2">
                  {user?.name || user?.email}
                </p>
                <LogoutButton variant="outline" className="w-full" />
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SnapToSell. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/dashboard/help"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Help
            </Link>
            <Link
              href="/dashboard/support"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
