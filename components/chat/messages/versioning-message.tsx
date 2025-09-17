"use client";

import type React from "react";
import { useState } from "react";
import {
  Check,
  AlertTriangle,
  Edit,
  ChevronRight,
  Square,
  Loader2,
  Circle,
  RefreshCw,
  Eye,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageActions } from "@/components/chat/messages";
import ShinyText from "@/components/ui/shiny-text";

interface GenerationItem {
  id: string;
  name: string;
  status: "generated" | "edited" | "stopped" | "error" | "generating";
  type: string;
  timestamp: string;
  filePath?: string; // Add filePath for navigation
  content?: string; // Add content for display
}

interface GenerationGroup {
  id: string;
  title: string;
  timestamp: string;
  items: GenerationItem[];
  isLatest: boolean;
  isViewing: boolean;
  isLoading?: boolean;
  hasError?: boolean;
}

interface VersioningMessageProps {
  generation: GenerationGroup;
  initialCollapsed?: boolean;
  onToggle?: (id: string, isCollapsed: boolean) => void;
  onRetry?: (id: string) => void;
  onCopy?: () => void;
  onReload?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onView?: (id: string) => void;
  onRestore?: (id: string) => void;
  onItemClick?: (item: GenerationItem) => void; // New prop for item click
  isGenerating?: boolean; // NEW: Add generating state
  className?: string;
}

// Utility function to format timestamps
const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      // Less than 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      // More than 24 hours, show date
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "Unknown time";
  }
};

export function VersioningMessage({
  generation,
  initialCollapsed = false,
  onToggle,
  onRetry,
  onCopy,
  onReload,
  onLike,
  onDislike,
  onView,
  onRestore,
  onItemClick,
  isGenerating = false,
  className,
}: VersioningMessageProps) {
  // Local state for collapse - completely independent of external state
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  // Detect media type helpers
  const isImageItem = (item: GenerationItem) => {
    const t = (item.type || "").toLowerCase();
    const n = (item.name || "").toLowerCase();
    return (
      t.startsWith("image/") ||
      n.endsWith(".png") ||
      n.endsWith(".jpg") ||
      n.endsWith(".jpeg") ||
      n.endsWith(".webp") ||
      n.endsWith(".gif") ||
      n.endsWith(".svg")
    );
  };

  const isVideoItem = (item: GenerationItem) => {
    const t = (item.type || "").toLowerCase();
    const n = (item.name || "").toLowerCase();
    return (
      t.startsWith("video/") ||
      n.endsWith(".mp4") ||
      n.endsWith(".webm") ||
      n.endsWith(".mov") ||
      n.endsWith(".mkv")
    );
  };

  const getItemSrc = (item: GenerationItem) => {
    // Prefer explicit filePath; fallback to content if it's a URL/data URI
    if (item.filePath) return item.filePath;
    if (item.content && /^(https?:\/\/|data:)/.test(item.content))
      return item.content;
    return undefined;
  };

  const getStatusIcon = (status: GenerationItem["status"]) => {
    const iconMap = {
      generated: <Check className="w-2.5 h-2.5 text-green-500" />,
      edited: <Edit className="w-2.5 h-2.5 text-blue-500" />,
      stopped: <Square className="w-2.5 h-2.5 text-orange-500" />,
      error: <AlertTriangle className="w-2.5 h-2.5 text-red-500" />,
      generating: (
        <Loader2 className="w-2.5 h-2.5 text-blue-500 animate-spin" />
      ),
    };
    return (
      iconMap[status] || (
        <Circle className="w-2.5 h-2.5 text-muted-foreground" />
      )
    );
  };

  const getStatusColor = (status: GenerationItem["status"]) => {
    const colorMap = {
      generated: "bg-green-500/20 border-green-500/50",
      edited: "bg-blue-500/20 border-blue-500/50",
      stopped: "bg-orange-500/20 border-orange-500/50",
      error: "bg-red-500/20 border-red-500/50",
      generating: "bg-blue-500/20 border-blue-500/50",
    };
    return (
      colorMap[status] || "bg-muted-foreground/20 border-muted-foreground/50"
    );
  };

  // Local toggle handler - manages state internally
  const handleToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);

    // Optional callback to notify external components about the state change
    if (onToggle) {
      onToggle(generation.id, newCollapsedState);
    }
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRetry) {
      onRetry(generation.id);
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onView) {
      onView(generation.id);
    }
  };

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRestore) {
      onRestore(generation.id);
    }
  };

  const renderGenerationContent = () => {
    if (generation.isLoading) {
      return (
        <div className="flex items-center gap-2 sm:gap-3 px-1.5 py-2 rounded-md relative z-10">
          <div className="flex-shrink-0">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500/20 flex items-center justify-center border-2 border-blue-500/50 shadow-sm relative z-20">
              <Loader2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-blue-500 animate-spin" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              Loading...
            </p>
            <p className="text-xs text-muted-foreground">Fetching files...</p>
          </div>
          <div className="flex-shrink-0">
            <Badge variant="secondary" className="text-xs">
              loading
            </Badge>
          </div>
        </div>
      );
    }

    if (generation.hasError) {
      return (
        <div className="flex items-center gap-2 sm:gap-3 px-1.5 py-2 rounded-md relative z-10">
          <div className="flex-shrink-0">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500/20 flex items-center justify-center border-2 border-red-500/50 shadow-sm relative z-20">
              <AlertTriangle className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-red-500" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              Failed to load files
            </p>
            <p className="text-xs text-muted-foreground">
              Something went wrong while fetching the data
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="h-6 px-2 text-xs text-red-500 hover:text-red-700"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          </div>
        </div>
      );
    }

    return generation.items.map((item, index) => (
      <div key={item.id} className="relative">
        {index < generation.items.length - 1 && (
          <div className="absolute left-[11px] sm:left-[15px] top-[22px] w-0.5 h-6 bg-muted-foreground/10 z-0"></div>
        )}
        <div className="flex items-center gap-2 sm:gap-3 px-1.5 py-1 rounded-md relative z-10 hover:bg-muted/50 transition-colors group">
          <div className="flex-shrink-0">
            <div
              className={cn(
                "w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 shadow-sm relative z-20",
                getStatusColor(item.status)
              )}
            >
              {getStatusIcon(item.status)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            {(() => {
              const src = getItemSrc(item);
              if (isImageItem(item) && src) {
                return (
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => onItemClick?.(item)}
                  >
                    <img
                      src={src}
                      alt={item.name}
                      className="w-24 h-24 rounded-md object-cover border border-border"
                    />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                        {item.status === "generating" ? (
                          <ShinyText
                            text={item.name}
                            speed={3}
                            className="text-xs sm:text-sm font-medium"
                          />
                        ) : (
                          item.name
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        image • {formatTimestamp(item.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              }
              if (isVideoItem(item) && src) {
                return (
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => onItemClick?.(item)}
                  >
                    <video
                      src={src}
                      className="w-28 h-20 rounded-md border border-border object-cover"
                      controls
                    />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                        {item.status === "generating" ? (
                          <ShinyText
                            text={item.name}
                            speed={3}
                            className="text-xs sm:text-sm font-medium"
                          />
                        ) : (
                          item.name
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        video • {formatTimestamp(item.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              }
              return (
                <>
                  <p
                    className="text-xs sm:text-sm font-medium text-foreground truncate cursor-pointer hover:underline transition-all duration-200"
                    onClick={() => onItemClick?.(item)}
                  >
                    {item.status === "generating" ? (
                      <ShinyText
                        text={item.name}
                        speed={3}
                        className="text-xs sm:text-sm font-medium"
                      />
                    ) : (
                      item.name
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.type} • {formatTimestamp(item.timestamp)}
                  </p>
                </>
              );
            })()}
          </div>
          <div className="flex-shrink-0">
            {item.status === "generating" ? (
              <ShinyText
                text="generating"
                speed={3}
                className="text-xs font-medium capitalize text-blue-500"
              />
            ) : (
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs capitalize",
                  item.status === "generated" &&
                    "bg-green-500/10 text-green-600 border-green-500/20",
                  item.status === "edited" &&
                    "bg-blue-500/10 text-blue-600 border-blue-500/20",
                  item.status === "error" &&
                    "bg-red-500/10 text-red-600 border-red-500/20",
                  item.status === "stopped" &&
                    "bg-orange-500/10 text-orange-600 border-orange-500/20"
                )}
              >
                {item.status}
              </Badge>
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className={cn("ml-6 sm:ml-12 group", className)}>
      <div className="border border-border rounded-xl overflow-hidden bg-background shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Generation Header */}
        <div
          className="flex items-center justify-between p-2 sm:p-3 cursor-pointer hover:bg-muted/50 transition-colors duration-150"
          onClick={handleToggle}
        >
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div
              className={cn(
                "transition-transform duration-200 flex-shrink-0",
                !isCollapsed && "rotate-90"
              )}
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-foreground text-xs sm:text-sm truncate">
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                      <span className="animate-pulse">Generating...</span>
                    </div>
                  ) : (
                    generation.title
                  )}
                </h3>
                <div className="flex flex-row items-center gap-1">
                  {generation.isLatest && (
                    <Badge className="text-xs px-1.5 py-0.5 bg-green-500/10 text-green-600 border-green-500/20 flex-shrink-0">
                      Latest
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatTimestamp(generation.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Actions for the generation */}

            {/* View and Restore Icons - Side by Side */}
            <div className="flex items-center gap-0.5">
              {/* View Icon */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleView}
                className={cn(
                  "h-6 w-6 p-0 hover:bg-muted transition-colors",
                  generation.isViewing &&
                    "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                )}
                title={
                  generation.isViewing ? "Currently viewing" : "View generation"
                }
              >
                <Eye
                  className={cn(
                    "w-3 h-3",
                    generation.isViewing
                      ? "text-blue-600"
                      : "text-muted-foreground"
                  )}
                />
              </Button>

              {/* Restore/Revert Icon - Only show if not latest and not currently viewing */}
              {!generation.isLatest && !generation.isViewing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRestore}
                  className="h-6 w-6 p-0 hover:bg-muted transition-colors"
                  title="Restore this generation"
                >
                  <RotateCcw className="w-3 h-3 text-muted-foreground" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Generation Items - Collapsible content with local state */}
        <div
          className={cn(
            "border-t border-border bg-muted/20 overflow-hidden transition-all duration-300 ease-in-out",
            isCollapsed ? "max-h-0 opacity-0" : "max-h-96 opacity-100"
          )}
        >
          <div className="p-2 space-y-1 relative overflow-y-auto custom-scrollbar">
            {renderGenerationContent()}
          </div>
        </div>

        {/* Mobile actions - shown at bottom on small screens */}
        <div className="sm:hidden border-t border-border p-2 bg-muted/10">
          <div className="flex items-center justify-between">
            {/* Mobile View and Restore Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleView}
                className={cn(
                  "h-8 px-2 text-xs",
                  generation.isViewing && "bg-blue-500/10 text-blue-600"
                )}
              >
                <Eye className="w-3 h-3 mr-1" />
                {generation.isViewing ? "Viewing" : "View"}
              </Button>

              {!generation.isLatest && !generation.isViewing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRestore}
                  className="h-8 px-2 text-xs"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Restore
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { GenerationItem, GenerationGroup };
