"use client";

import type React from "react";
import { useState } from "react";
import {
  Check,
  AlertTriangle,
  Edit,
  ChevronRight,
  Square,
  Loader,
  Circle,
  RefreshCw,
  Eye,
  RotateCcw,
  Image as ImageIcon,
  Video,
  File,
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
  type: string; // MIME type (e.g., "image/png", "video/mp4")
  timestamp: string;
  filePath?: string;
  url?: string;
  text?: string;
}

interface GenerationGroup {
  _id?: string;
  id?: string;
  title: string;
  timestamp: string;
  items: GenerationItem[];
  isCollapsed?: boolean;
  isLatest: boolean;
  isViewing: boolean;
  isLoading?: boolean;
  hasError?: boolean;
}

interface VersioningMessageProps {
  generation: GenerationGroup;
  onToggle?: (id: string) => void;
  onRetry?: (id: string) => void;
  onCopy?: () => void;
  onReload?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onView?: (id: string) => void;
  onRestore?: (id: string) => void;
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
  onToggle,
  onRetry,
  onCopy,
  onReload,
  onLike,
  onDislike,
  onView,
  onRestore,
  className,
}: VersioningMessageProps) {
  // Internal state for collapse if not controlled externally
  const [internalCollapsed, setInternalCollapsed] = useState(
    generation.isCollapsed ?? false
  );

  const isCollapsed = generation.isCollapsed ?? internalCollapsed;

  const getStatusIcon = (status: GenerationItem["status"]) => {
    const iconMap = {
      generated: <Check className="w-2.5 h-2.5 text-green-500" />,
      edited: <Edit className="w-2.5 h-2.5 text-blue-500" />,
      stopped: <Square className="w-2.5 h-2.5 text-orange-500" />,
      error: <AlertTriangle className="w-2.5 h-2.5 text-red-500" />,
      generating: <Loader className="w-2.5 h-2.5 text-blue-500 animate-spin" />,
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

  const handleToggle = () => {
    if (onToggle) {
      const id = generation._id || generation.id;
      if (id) {
        onToggle(id);
      }
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRetry) {
      const id = generation._id || generation.id;
      if (id) {
        onRetry(id);
      }
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onView) {
      const id = generation._id || generation.id;
      if (id) {
        onView(id);
      }
    }
  };

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRestore) {
      const id = generation._id || generation.id;
      if (id) {
        onRestore(id);
      }
    }
  };

  const renderGenerationContent = () => {
    if (generation.isLoading) {
      return (
        <div className="flex items-center gap-2 sm:gap-3 px-1.5 py-2 rounded-md relative z-10">
          <div className="flex-shrink-0">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500/20 flex items-center justify-center border-2 border-blue-500/50 shadow-sm relative z-20">
              <Loader className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-blue-500 animate-spin" />
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

    const getFileExtension = (filename: string): string => {
      return filename.split(".").pop()?.toUpperCase() || "FILE";
    };

    const getMediaType = (mimeType: string): "image" | "video" | "file" => {
      if (mimeType?.startsWith("image/")) return "image";
      if (mimeType?.startsWith("video/")) return "video";
      return "file";
    };

    const renderItemContent = (item: GenerationItem) => {
      const mediaUrl = item.url || item.filePath;
      const mediaType = getMediaType(item.type);
      const fileExt = item.name
        ? getFileExtension(item.name)
        : item.type?.split("/")[1]?.toUpperCase() || "FILE";

      if (item.status === "generating") {
        return (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                <ShinyText
                  text={item.name || "Generating..."}
                  speed={3}
                  className="text-xs sm:text-sm font-medium"
                />
              </p>
              <p className="text-xs text-muted-foreground">
                {item.type} • {formatTimestamp(item.timestamp)}
              </p>
            </div>
            <div className="flex-shrink-0">
              <ShinyText
                text="generating"
                speed={3}
                className="text-xs font-medium capitalize text-blue-500"
              />
            </div>
          </>
        );
      }

      return (
        <>
          <div className="flex-1 min-w-0">
            {mediaType === "image" && mediaUrl ? (
              <div className="flex flex-col items-start gap-2">
                <div className="flex-shrink-0 w-full h-full sm:w-full sm:h-full rounded-md overflow-hidden border border-border bg-muted">
                  <img
                    src={mediaUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full flex items-center justify-center"><svg class="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>`;
                      }
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <ImageIcon className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Image • {fileExt} • 
                    </p>
                  </div>
                </div>
              </div>
            ) : mediaType === "video" && mediaUrl ? (
              <div className="flex flex-col items-start gap-2">
                <div className="flex-shrink-0 w-full h-full sm:w-full sm:h-full rounded-md overflow-hidden border border-border bg-muted relative">
                  <video
                    src={mediaUrl}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Video className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Video • {fileExt} • 
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-md border border-border bg-muted flex items-center justify-center">
                  <File className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <File className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {item.type || "File"} • 
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      );
    };

    return generation.items.map((item, index) => (
      <div key={item.id} className="relative">
        {index < generation.items.length - 1 && (
          <div className="absolute left-[11px] sm:left-[15px] top-[22px] w-0.5 h-6 bg-muted-foreground/10 z-0"></div>
        )}
        <div className="flex items-center gap-2 sm:gap-3 px-1.5 py-2 rounded-md relative z-10 hover:bg-muted/50 transition-colors group">
          {renderItemContent(item)}
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
              <div className="flex items-center gap-2 flex-wrap justify-between">
                <h3 className="font-medium text-foreground text-xs sm:text-sm truncate">
                  {generation.title}
                </h3>
                <div className="flex flex-row items-center gap-2">
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
        </div>

        {/* Generation Items - Collapsible content */}
        <div
          className={cn(
            "border-t border-border bg-muted/20 overflow-hidden transition-all duration-300 ease-in-out",
            isCollapsed ? "max-h-0 opacity-0" : "max-h-fit opacity-100"
          )}
        >
          <div className="p-2 space-y-1 relative overflow-y-auto">
            {renderGenerationContent()}
          </div>
        </div>

        {/* Mobile actions - shown at bottom on small screens */}
        {/* <div className="sm:hidden border-t border-border p-2 bg-muted/10">
          <MessageActions
            onCopy={onCopy}
            onReload={onReload}
            onLike={onLike}
            onDislike={onDislike}
            className="flex justify-center"
          />
        </div> */}
      </div>
    </div>
  );
}

export type { GenerationItem, GenerationGroup };
