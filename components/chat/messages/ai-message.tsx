"use client";

import { DeleteConfirmation } from "./delete-confirmation";
import { DesignInspirationResults } from "./design-inspiration-results";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Response } from "@/components/ai-elements/response";
import {
  MessageActions,
  MessageContainer,
  MessageContent,
} from "@/components/chat/messages";
import { AvatarDisplay } from "@/components/ui/avatar-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useProjectDesign } from "@/context/DesignProject";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  GitBranch,
  Loader2,
} from "lucide-react";
import Markdown from "react-markdown";
import { useEffect, useState } from "react";
import Link from "next/link";

/** Strip raw JSON / API error dumps from AI text and replace with a friendly message. */
function sanitizeTextContent(text: string): string {
  if (!text) return text;
  const trimmed = text.trim();
  // Detect if the entire message is a JSON error blob
  if (trimmed.startsWith("{") && trimmed.includes('"error"')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.error) {
        const code = parsed.error?.code || parsed.code;
        const status = parsed.error?.status;
        if (code === 429 || status === "RESOURCE_EXHAUSTED" || status === "Too Many Requests") {
          return "We're experiencing high demand right now. Please try again in a moment.";
        }
        if (code === 401 || code === 403) {
          return "There was an authentication issue. Please reconnect your account and try again.";
        }
        return "Something went wrong while processing your request. Please try again.";
      }
    } catch {
      // Not valid JSON, fall through
    }
  }
  // If the text contains an embedded JSON error (e.g. model echoed it), strip it
  const jsonErrorMatch = trimmed.match(/\{"error":\{[\s\S]*\}\}/);
  if (jsonErrorMatch && jsonErrorMatch[0].length > text.length * 0.5) {
    const cleaned = text.replace(jsonErrorMatch[0], "").trim();
    return cleaned || "Something went wrong while processing your request. Please try again.";
  }
  return text;
}

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
      avatar={<AvatarDisplay variant='ai' alt='AI Logo' fallback='AI' />}
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
      <MessageContent variant='ai' className='bg-transparent'>
        <div className='space-y-4'>
          {message?.parts?.map((part: any, i: number) => {
            switch (part.type) {
              case "text": {
                // Strip image/media content from text if generations exist (shown in Version card instead)
                let textContent = part.text || "";
                const hasGenerations = message?.generationGroups?.some(
                  (g: any) => g.items?.length > 0
                );
                if (hasGenerations && textContent) {
                  // Remove markdown images: ![alt](url)
                  textContent = textContent.replace(/!\[.*?\]\(.*?\)/g, "");
                  // Remove markdown links to generated files: [text](https://...)
                  textContent = textContent.replace(/\[.*?\]\(https?:\/\/.*?\)/g, "");
                  // Remove raw URLs on their own lines
                  textContent = textContent.replace(/^https?:\/\/\S+$/gm, "");
                  // Clean up excessive whitespace
                  textContent = textContent.replace(/\n{3,}/g, "\n\n").trim();
                }
                // Sanitize any raw error JSON that may have leaked into the message
                textContent = sanitizeTextContent(textContent);
                if (!textContent) return null;

                const lowerText = textContent.toLowerCase();
                const needsAdBalanceTopUp = lowerText.includes("ad balance") || lowerText.includes("top up");
                const isMetaAdTopUp = needsAdBalanceTopUp && (lowerText.includes("meta") || lowerText.includes("facebook"));
                const isGoogleAdTopUp = needsAdBalanceTopUp && (lowerText.includes("google"));

                const integrationNames = [
                  "Meta Ads", "Google Ads", "Facebook", "Instagram", "X Ads", "Twitter", "X", 
                  "Pinterest", "TikTok", "LinkedIn", "Shopify", "Mailchimp", "Brevo"
                ];
                let integrationToConnect: string | null = null;
                let isReconnect = false;
                
                for (const name of integrationNames) {
                  const n = name.toLowerCase();
                  if (
                    lowerText.includes(`connect ${n}`) || 
                    lowerText.includes(`connect your ${n}`) ||
                    lowerText.includes(`no ${n} connection`) ||
                    lowerText.includes(`${n} needs reconnection`) ||
                    lowerText.includes(`reconnect ${n}`) ||
                    lowerText.includes(`reconnect your ${n}`) ||
                    (lowerText.includes(n) && (lowerText.includes("token expired") || lowerText.includes("needs reconnection") || lowerText.includes("reconnect")))
                  ) {
                    integrationToConnect = name;
                    isReconnect = lowerText.includes("reconnect") || lowerText.includes("expired") || lowerText.includes("needs reconnection");
                    break;
                  }
                }

                if (!integrationToConnect) {
                  const match = textContent.match(/(?:reconnect|connect) (?:your )?([A-Z][A-Za-z0-9\s]+?)(?: account| integration| in the integrations page)/i) || 
                                textContent.match(/([A-Z][A-Za-z0-9\s]+?) needs reconnection/i);
                  if (match && match[1].length < 20) {
                    integrationToConnect = match[1].trim();
                    isReconnect = lowerText.includes("reconnect") || lowerText.includes("expired") || lowerText.includes("needs reconnection");
                  }
                }

                return (
                  <div key={`${message.id}-${i}`} className="flex flex-col gap-2">
                    <Response>{textContent}</Response>
                    {(integrationToConnect || needsAdBalanceTopUp) && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {integrationToConnect && (
                          <Button asChild size="sm" variant="default" className="w-fit">
                            <Link href="/integrations">{isReconnect ? "Reconnect / Manage" : "Connect"} {integrationToConnect}</Link>
                          </Button>
                        )}
                        {isMetaAdTopUp && (
                          <Button asChild size="sm" variant="secondary" className="w-fit">
                            <a href="https://business.facebook.com/ads/manager/billing_history/summary/" target="_blank" rel="noopener noreferrer">Top Up Meta Ads Balance</a>
                          </Button>
                        )}
                        {isGoogleAdTopUp && (
                          <Button asChild size="sm" variant="secondary" className="w-fit">
                            <a href="https://ads.google.com/aw/billing/summary" target="_blank" rel="noopener noreferrer">Top Up Google Ads Balance</a>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              }
              case "reasoning":
                return (
                  <Reasoning
                    key={`${message.id}-${i}`}
                    className='w-full'
                    isStreaming={isStreaming}
                  >
                    <ReasoningTrigger />
                    <ReasoningContent>{part.text}</ReasoningContent>
                  </Reasoning>
                );
              case "options":
                const isProjectSelection = part.options?.some((opt: string) =>
                  [
                    "Flyer or Poster",
                    "Logo or Branding",
                    "Social Media Graphic",
                    "Website Landing Page",
                  ].includes(opt)
                );

                if (isProjectSelection) {
                  return (
                    <div className=''>
                      <p className='mb-4'>Select Project Type</p>
                      <div
                        key={`${message.id}-${i}`}
                        className='bg-muted/30 border-border/50 mt-4 rounded-2xl border p-4 backdrop-blur-sm'
                      >
                        <RadioGroup
                          onValueChange={(value) =>
                            !project?.category && onOptionClick?.(value)
                          }
                          disabled={!!project?.category}
                          value={project?.category || undefined}
                          className='grid grid-cols-1 gap-3 sm:grid-cols-2'
                        >
                          {part.options?.map((option: string, idx: number) => (
                            <div key={idx} className='group relative'>
                              <RadioGroupItem
                                value={option}
                                id={`${message.id}-${idx}`}
                                className='peer sr-only'
                              />
                              <Label
                                htmlFor={`${message.id}-${idx}`}
                                className={cn(
                                  "border-border/50 bg-background/50 flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all duration-200",
                                  "hover:bg-muted/50 hover:border-primary/30",
                                  "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:ring-primary peer-data-[state=checked]:ring-1",
                                  "group-hover:translate-x-1"
                                )}
                              >
                                <div className='border-primary/20 peer-data-[state=checked]:border-primary flex h-4 w-4 items-center justify-center rounded-full border transition-colors'>
                                  <div className='bg-primary h-2 w-2 rounded-full opacity-0 transition-opacity peer-data-[state=checked]:opacity-100' />
                                </div>
                                <span className='text-foreground/80 group-hover:text-foreground text-xs font-semibold'>
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
                  <div
                    key={`${message.id}-${i}`}
                    className='mt-2 flex flex-wrap gap-2'
                  >
                    {part.options?.map((option: string, idx: number) => (
                      <Button
                        key={idx}
                        variant='secondary'
                        size='sm'
                        className='bg-primary/5 hover:bg-primary/10 border-primary/20 rounded-full text-xs'
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
          <div className='text-muted-foreground flex items-center justify-between text-xs'>
            <div className='flex items-center gap-4'>
              {totalTime && totalTime > 0 && (
                <div className='flex items-center gap-1'>
                  <Clock className='h-3 w-3' />
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
          message='Are you sure you want to delete this? This will delete both the user prompt and AI response, along with all versions after this.'
        />
      )}
    </MessageContainer>
  );
}
