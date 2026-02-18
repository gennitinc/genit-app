"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  Download,
  Image as ImageIcon,
  Video,
  File,
  Play,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageActions } from "@/components/chat/messages";
import ShinyText from "@/components/ui/shiny-text";
import { serverUrlSocket, apiResponse } from "@/utils/apiResponse";
import { templateApi } from "@/utils/inspire-api";
import { toast } from "@/hooks/use-toast";
import { useUserContext } from "@/context/AuthenticatedContext";
import { DeleteConfirmation } from "./delete-confirmation";
import { VideoPlayerMessage } from "../video-player-message";

interface GenerationItem {
  id: string;
  name: string;
  status: "generated" | "edited" | "stopped" | "error" | "generating";
  type: string; // MIME type (e.g., "image/png", "video/mp4")
  timestamp: string;
  filePath?: string;
  url?: string;
  text?: string;
  videoConfig?: any; // Remotion JSON config
  publishStatus?: "published" | "pending" | "rejected" | null;
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
  onDelete?: () => void;
  onView?: (id: string) => void;
  onRestore?: (id: string) => void;
  className?: string;
  designType?: string; // Design type from project (logo, flier, etc.)
  originalPrompt?: string; // Original prompt from the message
}

// Helper function to generate animation prompts based on design type
const getAnimationPrompt = (
  designType: string | undefined,
  originalPrompt: string | undefined,
): string => {
  const basePrompt = originalPrompt || "Animate this design";

  const prompts: Record<string, string> = {
    logo: `Animate the logo with smooth, professional motion. Add subtle movement like gentle rotation, scaling, or morphing effects. Keep the brand identity intact while bringing the logo to life with elegant transitions. ${basePrompt}`,
    flier: `Animate this flier design with engaging motion graphics. Add dynamic text animations, smooth transitions between elements, and eye-catching visual effects that highlight key information. ${basePrompt}`,
    instagram_post: `Create an animated Instagram post with trendy motion effects. Add smooth transitions, text animations, and dynamic elements that capture attention in the feed. ${basePrompt}`,
    poster: `Animate this poster with cinematic motion. Add dramatic transitions, text reveals, and visual effects that enhance the message and create impact. ${basePrompt}`,
    youtube_thumbnail: `Animate this YouTube thumbnail with dynamic motion. Add eye-catching effects, text animations, and movement that draws viewers in and stands out in search results. ${basePrompt}`,
    facebook_post: `Animate this Facebook post with engaging motion. Add smooth transitions, text animations, and visual effects that increase engagement and catch the viewer's attention. ${basePrompt}`,
    facebook_cover: `Animate this Facebook cover with subtle, professional motion. Add gentle transitions and effects that enhance the design without being distracting. ${basePrompt}`,
    banner: `Animate this banner with dynamic motion graphics. Add smooth transitions, text animations, and visual effects that create impact and draw attention. ${basePrompt}`,
    generic_design: `Animate this design with smooth, professional motion. Add elegant transitions and effects that enhance the visual appeal. ${basePrompt}`,
  };

  return (
    prompts[designType || ""] ||
    `Animate this design with smooth, professional motion. Add elegant transitions and visual effects. ${basePrompt}`
  );
};

// Utility function to format timestamps
const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
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
  onDelete,
  onView,
  onRestore,
  className,
  designType,
  originalPrompt,
}: VersioningMessageProps) {
  const router = useRouter();
  const { user } = useUserContext();
  const [publishing, setPublishing] = useState<string | null>(null);
  const [checkingPublishStatus, setCheckingPublishStatus] = useState(false);
  const [publishedItems, setPublishedItems] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Internal state for collapse if not controlled externally
  const [internalCollapsed, setInternalCollapsed] = useState(
    generation.isCollapsed ?? false,
  );

  const isCollapsed = generation.isCollapsed ?? internalCollapsed;

  // Check publish status from server when component mounts or items change
  useEffect(() => {
    const checkPublishStatus = async () => {
      if (!user || generation.items.length === 0) return;

      try {
        setCheckingPublishStatus(true);

        // Get all media URLs from generation items
        const mediaUrls = generation.items
          .map((item) => {
            const url = item.url || item.filePath;
            if (!url) return null;
            // Convert relative URLs to absolute
            return url.startsWith("/") ? `${serverUrlSocket}${url}` : url;
          })
          .filter((url): url is string => url !== null);

        if (mediaUrls.length === 0) return;

        // Check each URL against templates to see if it's published
        const checkPromises = mediaUrls.map(async (mediaUrl) => {
          try {
            // Check if this URL is already published by querying templates
            const response = await apiResponse.get(
              `/templates?mediaUrl=${encodeURIComponent(mediaUrl)}&limit=1`,
              { withCredentials: true },
            );

            if (
              response.data?.success &&
              response.data?.data?.templates?.length > 0
            ) {
              const template = response.data.data.templates[0];
              // Check if it's published by the current user
              const templateUserId = template.userId?._id || template.userId;
              const currentUserId = (user as any)?._id || (user as any)?.id;
              if (
                templateUserId &&
                currentUserId &&
                String(templateUserId) === String(currentUserId)
              ) {
                return { mediaUrl, published: true };
              }
            }
            return { mediaUrl, published: false };
          } catch (error) {
            console.error(
              `Error checking publish status for ${mediaUrl}:`,
              error,
            );
            return { mediaUrl, published: false };
          }
        });

        const results = await Promise.all(checkPromises);

        // Create a set of published item IDs
        const publishedSet = new Set<string>();
        generation.items.forEach((item) => {
          const itemUrl = item.url || item.filePath;
          if (!itemUrl) return;

          const fullUrl = itemUrl.startsWith("/")
            ? `${serverUrlSocket}${itemUrl}`
            : itemUrl;

          const result = results.find((r) => r.mediaUrl === fullUrl);
          if (result?.published) {
            publishedSet.add(item.id);
          }
        });

        setPublishedItems(publishedSet);
      } catch (error) {
        console.error("Error checking publish status:", error);
      } finally {
        setCheckingPublishStatus(false);
      }
    };

    checkPublishStatus();
  }, [generation.items, user, serverUrlSocket]);

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

  const handlePublishToInspiration = async (
    e: React.MouseEvent,
    item: GenerationItem,
  ) => {
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to publish to inspiration",
        variant: "destructive",
      });
      router.push("/signin");
      return;
    }

    try {
      setPublishing(item.id);

      const mediaUrl = item.url || item.filePath;
      if (!mediaUrl) {
        throw new Error("Media URL is required");
      }

      const mediaType = item.type?.startsWith("image/")
        ? "image"
        : item.type?.startsWith("video/")
          ? "video"
          : "image";

      // Get full URL if it's a relative path
      let fullMediaUrl = mediaUrl;
      if (mediaUrl.startsWith("/")) {
        fullMediaUrl = `${serverUrlSocket}${mediaUrl}`;
      }

      const response = await templateApi.publishToInspiration({
        mediaUrl: fullMediaUrl,
        thumbnailUrl: fullMediaUrl,
        mediaType,
        prompt: originalPrompt || item.name || "",
        category: designType || "generic_design",
        title: item.name || "User-generated design",
      });

      if (response.success) {
        // Update the published items state
        setPublishedItems((prev) => new Set(prev).add(item.id));
        toast({
          title: "Published to inspiration",
          description: "Your content has been added to the inspiration gallery",
        });
      } else {
        // Check if it's already published
        if (response.message?.includes("already been published")) {
          setPublishedItems((prev) => new Set(prev).add(item.id));
          toast({
            title: "Already published",
            description:
              "This content has already been published to inspiration",
          });
        } else {
          throw new Error(response.message || "Failed to publish");
        }
      }
    } catch (error: any) {
      console.error("Error publishing to inspiration:", error);

      // Check if it's a duplicate/conflict error (409 status)
      const errorMessage =
        error?.response?.data?.message || error?.message || "";
      if (
        error?.response?.status === 409 ||
        errorMessage.includes("already been published") ||
        errorMessage.includes("already published")
      ) {
        // Item is already published
        setPublishedItems((prev) => new Set(prev).add(item.id));
        toast({
          title: "Already published",
          description: "This content has already been published to inspiration",
        });
      } else {
        toast({
          title: "Publish failed",
          description:
            errorMessage ||
            "Failed to publish to inspiration. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setPublishing(null);
    }
  };

  const handleDownload = async (file: { filePath?: string; name?: string }) => {
    console.log("hit download");
    try {
      if (!file || !file.filePath) return;

      const response = await fetch(file.filePath, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = file.name || "download";
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("DOWNLOAD ERROR:", err);
    }
  };

  const handleAnimateDesign = async (item: GenerationItem) => {
    try {
      let imageUrl = item.url || item.filePath;
      if (!imageUrl) return;

      // Convert relative URL to absolute URL for server-side compatibility
      if (imageUrl.startsWith("/")) {
        const baseUrl = serverUrlSocket
          ? serverUrlSocket.replace(/\/$/, "")
          : typeof window !== "undefined"
            ? window.location.origin
            : "";
        imageUrl = baseUrl + imageUrl;
      }

      // Get the animation prompt based on design type
      const animationPrompt = getAnimationPrompt(designType, originalPrompt);

      // Upload the reference image to server (download, upload to S3, return URL)
      let uploadedImageUrl = imageUrl;
      try {
        const { videoGenApi } = await import("@/utils/inspire-api");
        const response =
          await videoGenApi.uploadReferenceImageFromUrl(imageUrl);
        if (response.success && response.data?.imageUrl) {
          uploadedImageUrl = response.data.imageUrl;
        }
      } catch (uploadError) {
        console.error(
          "Failed to upload reference image, using original URL:",
          uploadError,
        );
        // Continue with original URL if upload fails
      }

      // Prepare animate data with uploaded S3 URL
      const animateData = {
        type: "video",
        prompt: animationPrompt,
        referenceImageUrls: [uploadedImageUrl],
        designType: designType || "generic_design",
      };

      // Store in localStorage for client-side fallback
      localStorage.setItem("animateDesignData", JSON.stringify(animateData));

      // Build URL with parameters for server-side compatibility
      const params = new URLSearchParams({
        mode: "ai-video-gen",
        animate: "true",
        prompt: encodeURIComponent(animationPrompt),
        referenceImage: encodeURIComponent(uploadedImageUrl),
        designType: designType || "generic_design",
      });

      // Navigate to inspire/create video tab with URL parameters
      router.push(`/inspire/create?${params.toString()}`);
    } catch (error) {
      console.error("Error animating design:", error);
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
            <svg
              className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
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

    const getMediaType = (
      mimeType: string,
    ): "image" | "video" | "file" | "remotion" => {
      if (mimeType?.startsWith("image/")) return "image";
      if (mimeType?.startsWith("video/")) return "video";
      if (mimeType === "application/json+remotion") return "remotion";
      return "file";
    };

    const renderItemContent = (item: GenerationItem) => {
      const mediaUrl = item.url || item.filePath;
      const mediaType = getMediaType(item.type);
      const fileExt = item.name
        ? getFileExtension(item.name)
        : item.type?.split("/")[1]?.toUpperCase() || "FILE";

      // Check if item is published (from state or item property)
      const isPublished =
        publishedItems.has(item.id) || item.publishStatus === "published";

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

      // Check for Remotion Video Config
      if (item.videoConfig) {
        return (
          <div className="flex-1 min-w-0 w-full">
            <VideoPlayerMessage videoConfig={item.videoConfig} />
            <div className="flex-1 min-w-0 mt-2">
              <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                {item.name}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Video className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Preview • Remotion
                </p>
              </div>
            </div>
          </div>
        );
      }

      return (
        <>
          <div className="flex-1 min-w-0">
            {mediaType === "image" && mediaUrl ? (
              <div className="flex flex-col items-start gap-2 w-full">
                <div className="flex-shrink-0 w-full h-full sm:w-full sm:h-full rounded-md overflow-hidden border border-border bg-muted relative">
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
                <div className="flex-1 min-w-0 w-full">
                  <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                    {item.name}
                  </p>
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Image • {fileExt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isPublished && !item.publishStatus && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handlePublishToInspiration(e, item)}
                          disabled={publishing === item.id}
                          className="h-7 px-2 text-xs gap-1.5 w-fit"
                        >
                          {publishing === item.id ? (
                            <Loader className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3" />
                          )}
                          {publishing === item.id ? "Publishing..." : "Publish"}
                        </Button>
                      )}

                      {(isPublished || item.publishStatus) && (
                        <div className="flex items-center gap-1">
                          <Badge
                            variant={
                              isPublished || item.publishStatus === "published"
                                ? "default"
                                : item.publishStatus === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="h-7 px-2 text-xs gap-1.5 w-fit"
                          >
                            {isPublished || item.publishStatus === "published"
                              ? "Published 🎉"
                              : item.publishStatus === "pending"
                                ? "Pending"
                                : item.publishStatus === "rejected"
                                  ? "Rejected"
                                  : ""}
                          </Badge>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnimateDesign(item);
                        }}
                        className="h-7.5 px-2 text-xs gap-1.5 w-fit"
                      >
                        <Play className="w-3 h-3" />
                        Convert to video
                      </Button>
                    </div>
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
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Video className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Video • {fileExt}
                      </p>
                    </div>
                    {(isPublished || item.publishStatus) && (
                      <div className="flex items-center gap-1">
                        <Badge
                          variant={
                            isPublished || item.publishStatus === "published"
                              ? "default"
                              : item.publishStatus === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs h-5 px-1.5"
                        >
                          {isPublished || item.publishStatus === "published"
                            ? "Published to Inspiration"
                            : item.publishStatus === "pending"
                              ? "Pending"
                              : item.publishStatus === "rejected"
                                ? "Rejected"
                                : ""}
                        </Badge>
                      </div>
                    )}
                    {!isPublished && !item.publishStatus && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handlePublishToInspiration(e, item)}
                        disabled={publishing === item.id}
                        className="h-7 px-2 text-xs gap-1.5 w-fit"
                      >
                        {publishing === item.id ? (
                          <Loader className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        {publishing === item.id ? "Publishing..." : "Publish"}
                      </Button>
                    )}
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
                !isCollapsed && "rotate-90",
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 mr-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Prefer an explicit item from the generation items.
                      const repItem =
                        generation.items?.[0] || generation.items?.slice(-1)[0];
                      if (!repItem) return;
                      handleDownload({
                        filePath: repItem.url || repItem.filePath,
                        name: repItem.name,
                      });
                    }}
                    title="Download file"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  {/* {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(true);
                      }}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )} */}
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
            isCollapsed ? "max-h-0 opacity-0" : "max-h-fit opacity-100",
          )}
        >
          <div className="p-2 space-y-1 relative overflow-y-auto">
            {renderGenerationContent()}
          </div>
        </div>
      </div>
      {onDelete && (
        <DeleteConfirmation
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          onConfirm={onDelete}
          message="Are you sure you want to delete this? This will delete both the user prompt and AI response, along with all versions after this."
        />
      )}
    </div>
  );
}

export type { GenerationItem, GenerationGroup };
