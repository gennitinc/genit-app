"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, ThumbsUp, ThumbsDown, Check, Trash2 } from "lucide-react";
import { useState } from "react";

interface MessageActionsProps {
  onCopy?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onDelete?: () => void;
  isLiked?: boolean;
  disabled?: boolean
  isDisliked?: boolean;
  className?: string;
}

export function MessageActions({
  onCopy,
  onLike,
  onDislike,
  onDelete,
  isLiked = false,
  isDisliked = false,
  disabled,
  className = "",
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (onCopy) {
      onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied!" : "Copy"}</p>
        </TooltipContent>
      </Tooltip>

      {onDelete && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
              onClick={onDelete}
              disabled={disabled}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent>
          <p>{isLiked ? "Unlike" : "Like"}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent>
          <p>{isDisliked ? "Remove dislike" : "Dislike"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
