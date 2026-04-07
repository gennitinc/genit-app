"use client";

import { AvatarDisplay } from "@/components/ui/avatar-display";
import ShinyText from "@/components/ui/shiny-text";

// import ShinyText from "@/components/ui/shiny-text";

interface AIThinkingContentProps {
  className?: string;
  status?: string | null;
}

export function AIThinkingContent({ className, status }: AIThinkingContentProps) {
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
          text={status || "thinking"}
          disabled={false}
          speed={3}
          className="text-xs font-medium tracking-tight"
        />
        {/* Animated thinking dots */}
        <div className="flex items-center gap-1">
          <div
            className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

