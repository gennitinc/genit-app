"use client";

import { AvatarDisplay } from "@/components/ui/avatar-display";
import ShinyText from "@/components/ui/shiny-text";

interface AIThinkingContentProps {
  className?: string;
}

export function AIThinkingContent({ className }: AIThinkingContentProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-3">
        <AvatarDisplay variant="ai" alt="AI Logo" fallback="AI" />
        {/* Animated thinking dots */}
        <div className="flex items-center gap-1">
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
        {/* Shiny thinking text */}
        <ShinyText
          text="thinking..."
          speed={2}
          className="text-sm font-medium text-muted-foreground"
        />
      </div>
    </div>
  );
}
