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

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Response } from "@/components/ai-elements/response";
interface AIMessageProps {
  content: string;
  message: any;
  analysis?: string;
  totalTime?: number;
  versionId?: string;
  isStreaming?: boolean;
  streamingContent?: string; // NEW: Real-time streaming content
  streamingAnalysis?: string; // NEW: Real-time streaming analysis
  onCopy?: () => void;
  onReload?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  className?: string;
}

export function AIMessage({
  message,
  content,
  analysis,
  totalTime,
  versionId,
  isStreaming = false,
  streamingContent, // NEW: Accept streaming content
  streamingAnalysis, // NEW: Accept streaming analysis
  onCopy,
  onReload,
  onLike,
  onDislike,
  className,
}: AIMessageProps) {
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [displayContent, setDisplayContent] = useState("");
  const [displayAnalysis, setDisplayAnalysis] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Enhanced streaming effect for content with real-time updates
  useEffect(() => {
    if (isStreaming && streamingContent) {
      // Use the real streaming content directly
      setDisplayContent(streamingContent);
      setIsTyping(true);
    } else if (isStreaming && content) {
      // Fallback to typewriter effect if no streaming content
      setIsTyping(true);
      setDisplayContent("");

      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < content.length) {
          setDisplayContent(content.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 15);

      return () => {
        clearInterval(typingInterval);
        setIsTyping(false);
      };
    } else {
      setDisplayContent(content);
      setIsTyping(false);
    }
  }, [content, isStreaming, streamingContent]);

  // Enhanced streaming effect for analysis
  useEffect(() => {
    if (isStreaming && streamingAnalysis) {
      // Use the real streaming analysis directly
      setDisplayAnalysis(streamingAnalysis);
    } else if (isStreaming && analysis) {
      setDisplayAnalysis("");
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < analysis.length) {
          setDisplayAnalysis(analysis.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 10);

      return () => {
        clearInterval(typingInterval);
      };
    } else {
      setDisplayAnalysis(analysis || "");
    }
  }, [analysis, isStreaming, streamingAnalysis]);

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
          onReload={onReload}
          onLike={onLike}
          onDislike={onDislike}
          disabled={isStreaming}
        />
      }
      className={className}
    >
      <MessageContent variant="ai">
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
                    isStreaming={status === "streaming"}
                  >
                    <ReasoningTrigger />
                    <ReasoningContent>{part.text}</ReasoningContent>
                  </Reasoning>
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
    </MessageContainer>
  );
}
