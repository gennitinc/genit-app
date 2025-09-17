"use client";

import type React from "react";
import { cn } from "@/lib/utils";

interface MessageContentProps {
  children: React.ReactNode;
  variant?: "ai" | "user";
  className?: string;
}

export function MessageContent({
  children,
  variant = "ai",
  className,
}: MessageContentProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-4 prose prose-xs max-w-none",
        variant === "ai" && "bg-muted-foreground/15 prose-gray",
        variant === "user" && "bg-muted-foreground/15 prose-gray",
        className
      )}
    >
      {children}
    </div>
  );
}
