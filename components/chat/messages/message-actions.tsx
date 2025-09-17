"use client";

import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { useState } from "react";

interface MessageActionsProps {
  onCopy?: () => void;
  onReload?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  isLiked?: boolean;
  disabled?: boolean
  isDisliked?: boolean;
  className?: string;
}

export function MessageActions({
  onCopy,
  onReload,
  onLike,
  onDislike,
  isLiked = false,
  isDisliked = false,
  disabled,
  className = "",
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const handleCopy = async () => {
    if (onCopy) {
      onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReload = async () => {
    if (onReload) {
      setIsReloading(true);
      try {
        await onReload();
      } finally {
        setTimeout(() => setIsReloading(false), 1000);
      }
    }
  };

  const handleLike = () => {
    if (onLike) {
      onLike();
    }
  };

  const handleDislike = () => {
    if (onDislike) {
      onDislike();
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        onClick={handleCopy}
        disabled={copied}
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        onClick={handleReload}
        disabled={disabled}
      >
        <RefreshCw className={`w-4 h-4 ${isReloading ? "animate-spin" : ""}`} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        disabled={disabled}
        className={`p-1.5 transition-colors ${
          isLiked
            ? "text-green-500 hover:text-green-600"
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={handleLike}
      >
        <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={`p-1.5 transition-colors ${
          isDisliked
            ? "text-red-500 hover:text-red-600"
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={handleDislike}
      >
        <ThumbsDown className={`w-4 h-4 ${isDisliked ? "fill-current" : ""}`} />
      </Button>
    </div>
  );
}
