"use client";

import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, Copy01Icon, Delete02Icon, ThumbsUpIcon, ThumbsDownIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";

interface MessageActionsProps {
  onCopy?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onDelete?: () => void;
  isLiked?: boolean;
  disabled?: boolean;
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
            variant='ghost'
            size='sm'
            className='text-muted-foreground hover:text-foreground p-1.5 transition-colors'
            onClick={handleCopy}
            disabled={copied}
          >
            {copied ? (
              <HugeiconsIcon icon={Tick02Icon} className='h-4 w-4 text-green-500' />
            ) : (
              <HugeiconsIcon icon={Copy01Icon} className='h-4 w-4' />
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
              variant='ghost'
              size='sm'
              className='text-muted-foreground hover:text-destructive p-1.5 transition-colors'
              onClick={onDelete}
              disabled={disabled}
            >
              <HugeiconsIcon icon={Delete02Icon} className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              <LocalizedText text={"Delete"} />
            </p>
          </TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            disabled={disabled}
            className={`p-1.5 transition-colors ${
              isLiked
                ? "text-green-500 hover:text-green-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={handleLike}
          >
            <HugeiconsIcon icon={ThumbsUpIcon} className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isLiked ? "Unlike" : "Like"}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className={`p-1.5 transition-colors ${
              isDisliked
                ? "text-red-500 hover:text-red-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={handleDislike}
          >
            <HugeiconsIcon icon={ThumbsDownIcon}
              className={`h-4 w-4 ${isDisliked ? "fill-current" : ""}`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isDisliked ? "Remove dislike" : "Dislike"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
