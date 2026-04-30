"use client";

import { cn } from "@/lib/utils";
import type React from "react";

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
        "prose prose-xs max-w-none rounded-lg p-4",
        variant === "ai" && "bg-muted-foreground/15 prose-gray",
        variant === "user" && "bg-muted-foreground/15 prose-gray",
        className
      )}
    >
      {children}
    </div>
  );
}
