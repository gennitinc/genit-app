"use client";

import { useState, useEffect, useRef } from "react";
import { CommunityContent } from "@/types/inspire";
import { Heart, Eye, Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { communityApi, creatorApi } from "@/utils/inspire-api";
import { toast } from "@/hooks/use-toast";
import { useUserContext } from "@/context/AuthenticatedContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

interface CreatorProfileContentProps {
  content: CommunityContent[];
  contentType: "images" | "videos";
  loading: boolean;
}

function VideoCard({
  item,
  aspectRatio,
  isLiked,
  likingId,
  onLike,
  onClick,
}: {
  item: CommunityContent;
  aspectRatio: string;
  isLiked: boolean;
  likingId: string | null;
  onLike: (e: React.MouseEvent, id: string) => void;
  onClick: (item: CommunityContent) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Auto-play preview when entering viewport
  useEffect(() => {
    if (item.contentType !== "video" || !item.videoUrl) return;

    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isPlayingRef.current && !isHovered) {
            // Video is in viewport, start auto-play preview
            videoElement.currentTime = 0;
            isPlayingRef.current = true;
            setIsPaused(false);
            videoElement
              .play()
              .then(() => {
                // Pause after 2 seconds
                timeoutRef.current = setTimeout(() => {
                  videoElement.pause();
                  videoElement.currentTime = 0; // Reset to beginning
                  isPlayingRef.current = false;
                  setIsPaused(true);
                }, 2000);
              })
              .catch((error) => {
                console.error("Error auto-playing video:", error);
                isPlayingRef.current = false;
                setIsPaused(true);
              });
          } else if (!entry.isIntersecting && !isHovered) {
            // Video is out of viewport, pause and reset
            videoElement.pause();
            videoElement.currentTime = 0;
            isPlayingRef.current = false;
            setIsPaused(true);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of video is visible
      }
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [item.videoUrl, item.contentType, isHovered]);

  // Handle hover to play (desktop only, with sound)
  const handleMouseEnter = () => {
    if (
      item.contentType === "video" &&
      item.videoUrl &&
      videoRef.current &&
      isDesktop
    ) {
      setIsHovered(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false; // Unmute on hover
      videoRef.current.play().catch((error) => {
        console.error("Error playing video on hover:", error);
      });
      setIsPaused(false);
    }
  };

  const handleMouseLeave = () => {
    if (
      item.contentType === "video" &&
      item.videoUrl &&
      videoRef.current &&
      isDesktop
    ) {
      setIsHovered(false);
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true; // Mute again when leaving
      setIsPaused(true);
      isPlayingRef.current = false;
    }
  };

  // Handle play icon click (mobile only, with sound)
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      item.contentType === "video" &&
      item.videoUrl &&
      videoRef.current &&
      !isDesktop
    ) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false; // Unmute on click
      videoRef.current.play().catch((error) => {
        console.error("Error playing video on click:", error);
      });
      setIsPaused(false);
      setIsHovered(true);
    }
  };

  return (
    <div
      onClick={() => onClick(item)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer break-inside-avoid mb-4"
    >
      <div className="relative">
        {item.contentType === "video" && item.videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={item.videoUrl}
              poster={item.thumbnailUrl}
              className="w-full object-cover"
              style={{ aspectRatio }}
              muted
              playsInline
              preload="metadata"
            />
            {/* Play icon in center when paused */}
            {isPaused && (
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  !isDesktop && "pointer-events-auto cursor-pointer"
                )}
                onClick={handlePlayClick}
              >
                <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 text-white ml-1" />
                </div>
              </div>
            )}
          </>
        ) : (
          <img
            src={item.thumbnailUrl}
            alt={item.prompt}
            className="w-full object-cover"
            style={{ aspectRatio }}
            loading="lazy"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Stats */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => onLike(e, item.id)}
                disabled={likingId === item.id}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white transition-all",
                  isLiked && "bg-red-500/80 hover:bg-red-500/90"
                )}
              >
                {likingId === item.id ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Heart
                    className={cn("w-3.5 h-3.5", isLiked && "fill-white")}
                  />
                )}
                <span className="text-xs font-medium">{item.likes}</span>
              </button>

              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white">
                <Eye className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{item.views}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CreatorProfileContent({
  content,
  contentType,
  loading,
}: CreatorProfileContentProps) {
  const { user } = useUserContext();
  const [selectedContent, setSelectedContent] =
    useState<CommunityContent | null>(null);
  const [likingId, setLikingId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(
    new Set(content.filter((c) => c.isLiked).map((c) => c.id))
  );
  const [contentState, setContentState] = useState<CommunityContent[]>(content);

  useEffect(() => {
    setContentState(content);
    setLikedIds(new Set(content.filter((c) => c.isLiked).map((c) => c.id)));
  }, [content]);

  const handleLike = async (e: React.MouseEvent, contentId: string) => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like content",
        variant: "destructive",
      });
      return;
    }

    try {
      setLikingId(contentId);
      const response = await communityApi.toggleLike(contentId);

      if (response.success && response.data) {
        const isLiked = response.data.liked;
        setLikedIds((prev) => {
          const newSet = new Set(prev);
          if (isLiked) {
            newSet.add(contentId);
          } else {
            newSet.delete(contentId);
          }
          return newSet;
        });

        // Update local content
        setContentState((prev) =>
          prev.map((c) =>
            c.id === contentId
              ? {
                  ...c,
                  likes: response.data?.likes || c.likes,
                  isLiked: isLiked,
                }
              : c
          )
        );
      }
    } catch (error: any) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    } finally {
      setLikingId(null);
    }
  };

  const handleContentClick = async (item: CommunityContent) => {
    setSelectedContent(item);
    // Track view
    try {
      await creatorApi.trackView(item.id);
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 dark:text-neutral-400">
          No {contentType} published yet
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 mb-8">
        {contentState.map((item) => {
          const isLiked = likedIds.has(item.id);
          const aspectRatios = ["1/1", "3/4", "4/5", "9/16", "16/9"];
          const aspectRatio =
            item.aspectRatio?.replace(":", "/") ||
            aspectRatios[contentState.indexOf(item) % aspectRatios.length];

          return (
            <VideoCard
              key={item.id}
              item={item}
              aspectRatio={aspectRatio}
              isLiked={isLiked}
              likingId={likingId}
              onLike={handleLike}
              onClick={handleContentClick}
            />
          );
        })}
      </div>

      {/* Content Detail Dialog */}
      {selectedContent && (
        <Dialog
          open={!!selectedContent}
          onOpenChange={() => setSelectedContent(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {selectedContent.prompt}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {selectedContent.contentType === "video" &&
              selectedContent.videoUrl ? (
                <video
                  src={selectedContent.videoUrl}
                  controls
                  className="w-full rounded-lg"
                  poster={selectedContent.thumbnailUrl}
                />
              ) : (
                <img
                  src={selectedContent.mediaUrl}
                  alt={selectedContent.prompt}
                  className="w-full rounded-lg"
                />
              )}
              <div className="mt-4 flex items-center gap-4">
                <button
                  onClick={(e) => handleLike(e, selectedContent.id)}
                  disabled={likingId === selectedContent.id}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                    likedIds.has(selectedContent.id)
                      ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  )}
                >
                  {likingId === selectedContent.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Heart
                      className={cn(
                        "w-4 h-4",
                        likedIds.has(selectedContent.id) && "fill-current"
                      )}
                    />
                  )}
                  <span className="font-medium">{selectedContent.likes}</span>
                </button>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                  <Eye className="w-4 h-4 text-neutral-500" />
                  <span className="font-medium">{selectedContent.views}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
