"use client";

import Markdown from "react-markdown";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  GitBranch,
  Loader2,
} from "lucide-react";
import {
  MessageContainer,
  MessageContent,
  MessageActions,
} from "@/components/chat/messages";
import { AvatarDisplay } from "@/components/ui/avatar-display";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useProjectDesign } from "@/context/DesignProject";

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Response } from "@/components/ai-elements/response";
import { DeleteConfirmation } from "./delete-confirmation";
import { DesignInspirationResults } from "./design-inspiration-results";

interface AIMessageProps {
  message: any;
  analysis?: string;
  totalTime?: number;
  versionId?: string;
  isStreaming?: boolean;
  streamingContent?: string; // NEW: Real-time streaming content
  streamingAnalysis?: string; // NEW: Real-time streaming analysis
  onCopy?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onDelete?: () => void;
  onOptionClick?: (option: string) => void;
  generation: any;
  className?: string;
}

export function AIMessage({
  message,
  // content,
  // analysis,
  generation,
  totalTime,
  versionId,
  isStreaming = false,
  streamingContent, // NEW: Accept streaming content
  streamingAnalysis, // NEW: Accept streaming analysis
  onCopy,
  onLike,
  onDislike,
  onDelete,
  onOptionClick,
  className,
}: AIMessageProps) {
  const { project } = useProjectDesign();
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [displayContent, setDisplayContent] = useState("");
  const [displayAnalysis, setDisplayAnalysis] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatTime = (ms: number) => {
    if (!ms || ms <= 0) return "";
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getVersionDisplay = (versionId?: string) => {
    if (!versionId) return null;

    // Extract version number from ID or use a simple counter new
    const versionNumber = versionId.includes("v")
      ? versionId.split("v")[1]
      : versionId.slice(-1);

    return `v${versionNumber}`;
  };

  return (
    <MessageContainer
      avatar={<AvatarDisplay variant="ai" alt="AI Logo" fallback="AI" />}
      actions={
        <MessageActions
          onCopy={onCopy}
          onLike={onLike}
          onDislike={onDislike}
          onDelete={onDelete ? () => setShowDeleteConfirm(true) : undefined}
          isLiked={message?.feedback?.userReaction === "like"}
          isDisliked={message?.feedback?.userReaction === "dislike"}
          disabled={isStreaming}
        />
      }
      className={className}
    >
      <MessageContent variant="ai" className="bg-transparent">
        <div className="space-y-4">
          {message?.parts?.map((part: any, i: number) => {
            switch (part.type) {
              case "text":
                return (
                  <Response key={`${message.id}-${i}`}>{part.text}</Response>
                );
              case "reasoning":
                return (
                  <Reasoning
                    key={`${message.id}-${i}`}
                    className="w-full"
                    isStreaming={isStreaming}
                  >
                    <ReasoningTrigger />
                    <ReasoningContent>{part.text}</ReasoningContent>
                  </Reasoning>
                );
              case "options":
                const isProjectSelection = part.options?.some((opt: string) => 
                  ["Flyer or Poster", "Logo or Branding", "Social Media Graphic", "Website Landing Page"].includes(opt)
                );

                if (isProjectSelection) {
                  return (
                    <div className="">
                      <p className="mb-4">
                        Select Project Type
                      </p>
                      <div
                        key={`${message.id}-${i}`}
                        className="mt-4 p-4 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm"
                      >
                        <RadioGroup
                          onValueChange={(value) => !project?.category && onOptionClick?.(value)}
                          disabled={!!project?.category}
                          value={project?.category || undefined}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                        >
                          {part.options?.map((option: string, idx: number) => (
                            <div key={idx} className="relative group">
                              <RadioGroupItem
                                value={option}
                                id={`${message.id}-${idx}`}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={`${message.id}-${idx}`}
                                className={cn(
                                  "flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 cursor-pointer transition-all duration-200",
                                  "hover:bg-muted/50 hover:border-primary/30",
                                  "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary",
                                  "group-hover:translate-x-1",
                                )}
                              >
                                <div className="w-4 h-4 rounded-full border border-primary/20 flex items-center justify-center peer-data-[state=checked]:border-primary transition-colors">
                                  <div className="w-2 h-2 rounded-full bg-primary opacity-0 peer-data-[state=checked]:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground">
                                  {option}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={`${message.id}-${i}`} className="flex flex-wrap gap-2 mt-2">
                    {part.options?.map((option: string, idx: number) => (
                      <Button
                        key={idx}
                        variant="secondary"
                        size="sm"
                        className="rounded-full text-xs bg-primary/5 hover:bg-primary/10 border-primary/20"
                        onClick={() => onOptionClick?.(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                );
              case "search_results":
                return (
                  <DesignInspirationResults
                    key={`${message.id}-${i}`}
                    results={part.results}
                    query={part.query}
                    message={message}
                  />
                );
              default:
                return null;
            }
          })}

          {/* Footer with processing time and enhanced status */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              {totalTime && totalTime > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Processed in {formatTime(totalTime)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </MessageContent>
      {onDelete && (
        <DeleteConfirmation
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          onConfirm={onDelete}
          message="Are you sure you want to delete this? This will delete both the user prompt and AI response, along with all versions after this."
        />
      )}
    </MessageContainer>
  );
}
