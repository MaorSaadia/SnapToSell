"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isLoading } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <div className="mb-2 text-2xl font-bold">Loading your dashboard</div>
          <p className="text-muted-foreground">
            Please wait while we prepare everything for you
          </p>
        </div>
      </div>
    );
  }

  const navigationLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/generate", label: "Generate Content" },
    { href: "/dashboard/chat", label: "AI Chat" },
    { href: "/dashboard/media", label: "Media Library" },
    { href: "/dashboard/history", label: "History" },
    { href: "/dashboard/settings", label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm"
            : "bg-background/70 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-18 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 group"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold transition-transform group-hover:scale-110">
                  S
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  SnapToSell
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium text-foreground/80 hover:text-primary transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* User Info & Logout Button */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {user?.name || user?.email}
                  </span>
                </div>
                <LogoutButton variant="ghost" />
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <div className="relative w-6 h-6">
                  <span
                    className={`absolute left-0 block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                      mobileMenuOpen ? "rotate-45 top-3" : "rotate-0 top-1"
                    }`}
                  ></span>
                  <span
                    className={`absolute left-0 block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                      mobileMenuOpen ? "opacity-0" : "opacity-100 top-3"
                    }`}
                  ></span>
                  <span
                    className={`absolute left-0 block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                      mobileMenuOpen ? "-rotate-45 top-3" : "rotate-0 top-5"
                    }`}
                  ></span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-border/40 overflow-hidden bg-background/95 backdrop-blur-md"
            >
              <div className="container mx-auto px-4 py-5 space-y-5">
                <nav className="flex flex-col space-y-2">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="pt-2 border-t border-border/40">
                  <div className="flex items-center gap-3 mb-3 px-2 py-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {user?.name || user?.email}
                    </span>
                  </div>
                  <LogoutButton variant="outline" className="w-full" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>

      <footer className="border-t py-6 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SnapToSell. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/dashboard/help"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Help
            </Link>
            <Link
              href="/dashboard/support"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
