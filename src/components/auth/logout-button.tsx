"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { ButtonHTMLAttributes } from "react";

interface LogoutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  redirectUrl?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export function LogoutButton({
  redirectUrl = "/",
  children = "Sign out",
  variant = "default",
  ...props
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ redirect: true, callbackUrl: redirectUrl });
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant={variant}
      {...props}
    >
      {isLoading ? "Signing out..." : children}
    </Button>
  );
}
