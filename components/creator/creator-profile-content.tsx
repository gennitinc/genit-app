"use client";

import { useState, useEffect, useRef } from "react";
import { CommunityContent } from "@/types/inspire";
import {
  Heart,
  Eye,
  Loader2,
  Play,
  Pause,
  RefreshCw,
  Copy,
  User,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { communityApi, creatorApi } from "@/utils/inspire-api";
import { toast } from "@/hooks/use-toast";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";

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
  onRecreate,
}: {
  item: CommunityContent;
  aspectRatio: string;
  isLiked: boolean;
  likingId: string | null;
  onLike: (e: React.MouseEvent, id: string) => void;
  onClick: (item: CommunityContent) => void;
  onRecreate: (item: CommunityContent) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Auto-play preview when entering viewport - All devices
  useEffect(() => {
    if (item.contentType !== "video" || !item.videoUrl) return;

    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isPlayingRef.current && !isHovered) {
            // Video is in viewport, start auto-play preview (muted)
            videoElement.currentTime = 0;
            videoElement.muted = true; // Keep muted for preview
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
            videoElement.muted = true; // Reset to muted
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
      {/* Top gradient line */}
      <div
        style={
          {
            // @ts-ignore
            "--background": "#ffffff",
            "--color": "rgba(0, 0, 0, 0.2)",
            "--height": "1px",
            "--width": "5px",
            "--fade-stop": "90%",
            "--offset": "200px",
            "--color-dark": "rgba(255, 255, 255, 0.2)",
            // @ts-ignore
            maskComposite: "exclude",
          } as React.CSSProperties
        }
        className="absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] top-0"
      ></div>

      {/* Bottom gradient line */}
      <div
        style={
          {
            // @ts-ignore
            "--background": "#ffffff",
            "--color": "rgba(0, 0, 0, 0.2)",
            "--height": "1px",
            "--width": "5px",
            "--fade-stop": "90%",
            "--offset": "200px",
            "--color-dark": "rgba(255, 255, 255, 0.2)",
            // @ts-ignore
            maskComposite: "exclude",
          } as React.CSSProperties
        }
        className="absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] top-auto bottom-0"
      ></div>

      {/* Left gradient line */}
      <div
        style={
          {
            // @ts-ignore
            "--background": "#ffffff",
            "--color": "rgba(0, 0, 0, 0.2)",
            "--height": "5px",
            "--width": "1px",
            "--fade-stop": "90%",
            "--offset": "80px",
            "--color-dark": "rgba(255, 255, 255, 0.2)",
            // @ts-ignore
            maskComposite: "exclude",
          } as React.CSSProperties
        }
        className="absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] left-0"
      ></div>

      {/* Right gradient line */}
      <div
        style={
          {
            // @ts-ignore
            "--background": "#ffffff",
            "--color": "rgba(0, 0, 0, 0.2)",
            "--height": "5px",
            "--width": "1px",
            "--fade-stop": "90%",
            "--offset": "80px",
            "--color-dark": "rgba(255, 255, 255, 0.2)",
            // @ts-ignore
            maskComposite: "exclude",
          } as React.CSSProperties
        }
        className="absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] right-0 left-auto"
      ></div>
      
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
              loop
            />
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

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Play/Pause and View icons - Play/Pause only on mobile/tablet, View always visible */}
        {item.contentType === "video" && item.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div
              className={`flex items-center ${!isDesktop ? "gap-3" : ""} pointer-events-auto`}
            >
              {/* Play/Pause Button - Only visible on mobile/tablet */}
              {!isDesktop && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isPaused) {
                      handlePlayClick(e);
                    } else {
                      if (videoRef.current) {
                        videoRef.current.pause();
                        setIsPaused(true);
                      }
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-black/70 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center shadow-lg transition-colors opacity-100"
                >
                  {isPaused ? (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  ) : (
                    <Pause className="w-5 h-5 text-white" />
                  )}
                </button>
              )}
              {/* View Button - Always visible */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(item);
                }}
                className="w-10 h-10 rounded-full bg-black/70 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center shadow-lg transition-colors opacity-100"
              >
                <Eye className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Likes count and heart icon - Top right, centered together */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {item.likes > 0 && (
            <span className="text-white text-xs font-medium">{item.likes}</span>
          )}
          <button
            type="button"
            onClick={(e) => onLike(e, item.id)}
            disabled={likingId === item.id}
            className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title={isLiked ? "Unlike" : "Like"}
          >
            <Heart
              className={`w-4 h-4 transition-all ${
                isLiked ? "fill-red-500 text-red-500" : "fill-none text-white"
              }`}
            />
          </button>
        </div>

        {/* Prompt and Recreate button - Bottom overlay on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="mb-2">
            <p className="text-white text-sm font-medium line-clamp-2">
              {item.prompt}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href={`/creator/${item.author.name}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit"
            >
              {item.author.avatar ? (
                <img
                  src={item.author.avatar}
                  alt={item.author.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                  <User className="w-3 h-3 text-neutral-600 dark:text-neutral-400" />
                </div>
              )}
              <span className="text-xs text-white/80 font-medium">
                {item.author.name}
              </span>
              {item.author.isVerified && (
                <svg
                  viewBox="0 0 22 22"
                  aria-label="Verified account"
                  role="img"
                  className="w-3.5 h-3.5 flex-shrink-0"
                  data-testid="icon-verified"
                  fill="#3b82f6"
                >
                  <g>
                    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                  </g>
                </svg>
              )}
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRecreate(item);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium transition-colors w-fit"
            >
              <RefreshCw className="w-3 h-3" />
              Recreate
            </button>
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
  const router = useRouter();
  const [selectedContent, setSelectedContent] =
    useState<CommunityContent | null>(null);
  const [likingId, setLikingId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(
    new Set(content.filter((c) => c.isLiked).map((c) => c.id))
  );
  const [contentState, setContentState] = useState<CommunityContent[]>(content);
  const isDesktop = useMediaQuery("(min-width: 768px)");

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

  const handleRecreate = async (item: CommunityContent) => {
    // Check if user is authenticated
    if (!user) {
      router.push("/signin");
      return;
    }

    try {
      // Store recreate data in localStorage for navigation
      const recreateData = {
        type: contentType === "images" ? "image" : "video",
        prompt: item.prompt,
        aspectRatio: item.aspectRatio,
        resolution: item.resolution,
        style: item.style,
        imageCount: item.imageCount,
        modelId: item.modelId,
        presenterId: item.presenterId,
        voiceId: item.voiceId,
        duration: item.duration,
        startFrameUrl: item.startFrameUrl,
        endFrameUrl: item.endFrameUrl,
        referenceImageUrls: item.referenceImageUrls || [],
      };
      localStorage.setItem("recreateData", JSON.stringify(recreateData));

      // Navigate to create page
      router.push(
        `/inspire/create?prompt=${encodeURIComponent(item.prompt)}&mode=${contentType === "images" ? "image" : "video"}`
      );
      toast({
        title: "Settings saved",
        description: "All parameters will be restored on the create page",
      });
    } catch (error) {
      console.error("Error preparing recreate:", error);
      // Still allow navigating even if there's an error
      router.push(
        `/inspire/create?prompt=${encodeURIComponent(item.prompt)}&mode=${contentType === "images" ? "image" : "video"}`
      );
    }
  };

  const handleContentClick = async (item: CommunityContent) => {
    try {
      // Fetch full details
      const response = await communityApi.getById(item.id);
      if (response.success && response.data) {
        setSelectedContent(response.data);
      } else {
        setSelectedContent(item);
      }
    } catch (error) {
      // Fallback to basic content data
      setSelectedContent(item);
    }
    // Track view
    try {
      await creatorApi.trackView(item.id);
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  };

  if (loading) {
    // Generate varying heights for masonry grid effect
    const skeletonHeights = [
      200, 280, 240, 320, 260, 300, 220, 340, 250, 290, 210, 270, 230, 310, 240,
      280, 260, 300, 220, 320,
    ];

    return (
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 mb-8 w-full">
        {skeletonHeights.map((height, idx) => (
          <div
            key={`skeleton-${idx}`}
            className="break-inside-avoid mb-4 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800"
          >
            <Skeleton
              className="w-full rounded-xl bg-neutral-200 dark:bg-neutral-700"
              style={{ height: `${height}px` }}
            />
          </div>
        ))}
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
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 mb-8 w-full">
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
              onRecreate={handleRecreate}
            />
          );
        })}
      </div>

      {/* Desktop Dialog */}
      {isDesktop ? (
        <Dialog
          open={!!selectedContent}
          onOpenChange={() => setSelectedContent(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
            {selectedContent && (
              <ContentDetailContent
                content={selectedContent}
                onRecreate={() => {
                  handleRecreate(selectedContent);
                  setSelectedContent(null);
                }}
                onClose={() => setSelectedContent(null)}
                onLike={handleLike}
                isLiked={
                  likedIds.has(selectedContent.id) || selectedContent.isLiked
                }
                isLiking={likingId === selectedContent.id}
              />
            )}
          </DialogContent>
        </Dialog>
      ) : (
        /* Mobile/Tablet Drawer */
        <Drawer
          open={!!selectedContent}
          onOpenChange={() => setSelectedContent(null)}
        >
          <DrawerContent className="max-h-[90vh] overflow-hidden flex flex-col">
            {selectedContent && (
              <ContentDetailContent
                content={selectedContent}
                onRecreate={() => {
                  handleRecreate(selectedContent);
                  setSelectedContent(null);
                }}
                onClose={() => setSelectedContent(null)}
                onLike={handleLike}
                isLiked={
                  likedIds.has(selectedContent.id) || selectedContent.isLiked
                }
                isLiking={likingId === selectedContent.id}
              />
            )}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

function ContentDetailContent({
  content,
  onRecreate,
  onClose,
  onLike,
  isLiked,
  isLiking,
}: {
  content: CommunityContent;
  onRecreate: () => void;
  onClose: () => void;
  onLike?: (e: React.MouseEvent, contentId: string) => void;
  isLiked?: boolean;
  isLiking?: boolean;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [copied, setCopied] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const videoDetailRef = useRef<HTMLVideoElement>(null);

  // Auto-play video in drawer/dialog when it opens
  useEffect(() => {
    const videoElement = videoDetailRef.current;
    if (!videoElement || !content.videoUrl || content.contentType !== "video")
      return;

    // Auto-play when dialog/drawer opens (unmuted, with controls)
    videoElement.currentTime = 0;
    videoElement.muted = false; // Unmute for dialog playback
    videoElement.play().catch((error) => {
      console.error("Error auto-playing video in dialog:", error);
    });

    return () => {
      // Cleanup: pause video when dialog closes
      if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    };
  }, [content.videoUrl, content.contentType]);

  return (
    <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Media Preview */}
        <div className="relative w-full bg-neutral-100 dark:bg-neutral-800">
          {content.contentType === "video" && content.videoUrl ? (
            <video
              ref={videoDetailRef}
              src={content.videoUrl}
              controls
              playsInline
              preload="auto"
              autoPlay
              className="w-full h-auto object-contain"
              poster={content.thumbnailUrl}
            />
          ) : (
            <img
              src={content.mediaUrl}
              alt={content.prompt}
              className="w-full h-auto object-contain"
            />
          )}
        </div>

        <div className="px-6 space-y-4">
          {/* Prompt */}
          <div>
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Prompt
            </h3>
            <div>
              <p
                className={cn(
                  "text-sm text-neutral-900 dark:text-white",
                  !showFullPrompt && "line-clamp-2"
                )}
              >
                {content.prompt}
              </p>
              {content.prompt.split("\n").length > 2 ||
              (content.prompt.length > 200 && !showFullPrompt) ? (
                <button
                  type="button"
                  onClick={() => setShowFullPrompt(!showFullPrompt)}
                  className="text-neutral-500 dark:text-neutral-400 text-xs font-medium mt-1 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors flex items-center gap-1"
                >
                  {showFullPrompt ? (
                    <>
                      View less <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      View more <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              ) : null}
            </div>
          </div>

          {/* Creator Info */}
          <Link
            href={`/creator/${content.author.name}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {content.author.avatar ? (
              <img
                src={content.author.avatar}
                alt={content.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {content.author.name}
                </p>
                {content.author.isVerified && (
                  <svg
                    viewBox="0 0 22 22"
                    aria-label="Verified account"
                    role="img"
                    className="w-4 h-4 flex-shrink-0"
                    data-testid="icon-verified"
                    fill="#3b82f6"
                  >
                    <g>
                      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                    </g>
                  </svg>
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Creator
              </p>
            </div>
          </Link>

          {/* Stats */}
          <div className="flex items-center gap-4 m-2">
            {onLike ? (
              <button
                type="button"
                onClick={(e) => onLike(e, content.id)}
                disabled={isLiking}
                className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <span>{content.likes}</span>
                <Heart
                  className={`w-4 h-4 transition-all ${
                    isLiked || content.isLiked
                      ? "fill-red-500 text-red-500"
                      : "fill-none"
                  }`}
                />
              </button>
            ) : (
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <span>{content.likes}</span>
                <Heart className="w-4 h-4" />
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <Eye className="w-4 h-4" />
              <span>{content.views}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions - Fixed at bottom */}
      <div className="shrink-0 px-6 py-4 border-t bg-neutral-50 dark:bg-neutral-900">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRecreate}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Recreate
          </button>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(content.prompt);
              setCopied(true);
              toast({
                title: "Prompt copied",
                description: "Copied to clipboard",
              });
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-4 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                const url =
                  content.videoUrl || content.mediaUrl || content.thumbnailUrl;
                if (!url) {
                  toast({
                    title: "Error",
                    description: "No media available to download",
                    variant: "destructive",
                  });
                  return;
                }
                const response = await fetch(url);
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.download = `gennit-${content.id}.${
                  content.videoUrl ? "mp4" : "jpg"
                }`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(downloadUrl);
                toast({
                  title: "Download started",
                  description: "Your download has started",
                });
              } catch (error) {
                console.error("Error downloading:", error);
                toast({
                  title: "Error",
                  description: "Failed to download media",
                  variant: "destructive",
                });
              }
            }}
            className="px-4 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
