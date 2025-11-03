"use client";

import { AvatarDisplay } from "@/components/ui/avatar-display";
import ShinyText from "@/components/ui/shiny-text";

// import ShinyText from "@/components/ui/shiny-text";

interface AIThinkingContentProps {
  className?: string;
}

export function AIThinkingContent({ className }: AIThinkingContentProps) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <div className="flex items-center gap-2">
        <AvatarDisplay
          variant="ai"
          alt="AI Logo"
          src="../../resources/images/gennit2.png"
          fallback="../../resources/images/gennit2.png"
        />

        <ShinyText
          text="thinking"
          disabled={false}
          speed={3}
          className="custom-class"
        />
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
      </div>
    </div>
  );
}
