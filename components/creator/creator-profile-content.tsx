"use client";

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
import { useUserContext } from "@/context/AuthenticatedContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CommunityContent } from "@/types/inspire";
import { communityApi, creatorApi } from "@/utils/inspire-api";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Eye,
  Heart,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
      className='group relative mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800'
    >
      <div className='relative'>
        {item.contentType === "video" && item.videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={item.videoUrl}
              poster={item.thumbnailUrl}
              className='w-full object-cover'
              style={{ aspectRatio }}
              muted
              playsInline
              preload='metadata'
              loop
            />
          </>
        ) : (
          <img
            src={item.thumbnailUrl}
            alt={item.prompt}
            className='w-full object-cover'
            style={{ aspectRatio }}
            loading='lazy'
          />
        )}

        {/* Gradient overlay on hover */}
        <div className='absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100' />

        {/* Play/Pause and View icons - Play/Pause only on mobile/tablet, View always visible */}
        {item.contentType === "video" && item.videoUrl && (
          <div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center'>
            <div
              className={`flex items-center ${!isDesktop ? "gap-3" : ""} pointer-events-auto`}
            >
              {/* Play/Pause Button - Only visible on mobile/tablet */}
              {!isDesktop && (
                <button
                  type='button'
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
                  className='flex h-10 w-10 items-center justify-center rounded-full bg-black/70 opacity-100 shadow-lg backdrop-blur-sm transition-colors hover:bg-black/80'
                >
                  {isPaused ? (
                    <Play className='ml-0.5 h-5 w-5 text-white' />
                  ) : (
                    <Pause className='h-5 w-5 text-white' />
                  )}
                </button>
              )}
              {/* View Button - Always visible */}
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(item);
                }}
                className='flex h-10 w-10 items-center justify-center rounded-full bg-black/70 opacity-100 shadow-lg backdrop-blur-sm transition-colors hover:bg-black/80'
              >
                <Eye className='h-5 w-5 text-white' />
              </button>
            </div>
          </div>
        )}

        {/* Likes count and heart icon - Top right, centered together */}
        <div className='absolute top-3 right-3 z-10 flex items-center gap-1.5'>
          {item.likes > 0 && (
            <span className='text-xs font-medium text-white'>{item.likes}</span>
          )}
          <button
            type='button'
            onClick={(e) => onLike(e, item.id)}
            disabled={likingId === item.id}
            className='flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-50'
            title={isLiked ? "Unlike" : "Like"}
          >
            <Heart
              className={`h-4 w-4 transition-all ${
                isLiked ? "fill-red-500 text-red-500" : "fill-none text-white"
              }`}
            />
          </button>
        </div>

        {/* Prompt and Recreate button - Bottom overlay on hover */}
        <div className='absolute right-0 bottom-0 left-0 p-3 opacity-0 transition-opacity group-hover:opacity-100'>
          <div className='mb-2'>
            <p className='line-clamp-2 text-sm font-medium text-white'>
              {item.prompt}
            </p>
          </div>
          <div className='flex flex-col gap-2'>
            <Link
              href={`/creator/${item.author.name}`}
              onClick={(e) => e.stopPropagation()}
              className='flex w-fit items-center gap-2 transition-opacity hover:opacity-80'
            >
              {item.author.avatar ? (
                <img
                  src={item.author.avatar}
                  alt={item.author.name}
                  className='h-5 w-5 rounded-full object-cover'
                />
              ) : (
                <div className='flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700'>
                  <User className='h-3 w-3 text-neutral-600 dark:text-neutral-400' />
                </div>
              )}
              <span className='text-xs font-medium text-white/80'>
                {item.author.name}
              </span>
              {item.author.isVerified && (
                <svg
                  viewBox='0 0 22 22'
                  aria-label='Verified account'
                  role='img'
                  className='h-3.5 w-3.5 flex-shrink-0'
                  data-testid='icon-verified'
                  fill='#3b82f6'
                >
                  <g>
                    <path d='M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z' />
                  </g>
                </svg>
              )}
            </Link>
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                onRecreate(item);
              }}
              className='flex w-fit items-center gap-1 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-cyan-600'
            >
              <RefreshCw className='h-3 w-3' />
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
      <div className='mb-8 w-full columns-2 gap-4 md:columns-3 lg:columns-4'>
        {skeletonHeights.map((height, idx) => (
          <div
            key={`skeleton-${idx}`}
            className='mb-4 break-inside-avoid overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800'
          >
            <Skeleton
              className='w-full rounded-xl bg-neutral-200 dark:bg-neutral-700'
              style={{ height: `${height}px` }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className='py-12 text-center'>
        <p className='text-neutral-500 dark:text-neutral-400'>
          No {contentType} published yet
        </p>
      </div>
    );
  }

  return (
    <>
      <div className='mb-8 w-full columns-2 gap-4 md:columns-3 lg:columns-4'>
        {contentState.map((item) => {
          const isLiked = likedIds.has(item.id);
          const aspectRatios = ["1/1", "3/4", "4/5", "9/16", "16/9"];
          let aspectRatio = item.aspectRatio?.replace(":", "/");
          if (!aspectRatio || aspectRatio === "auto") {
            aspectRatio = aspectRatios[contentState.indexOf(item) % aspectRatios.length];
          }

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
          <DialogContent className='flex max-h-[90vh] max-w-2xl flex-col overflow-hidden p-0'>
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
          <DrawerContent className='flex max-h-[90vh] flex-col overflow-hidden'>
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
    <div className='flex h-full max-h-[90vh] flex-col overflow-hidden'>
      <div className='min-h-0 flex-1 overflow-y-auto'>
        {/* Media Preview */}
        <div className='relative w-full bg-neutral-100 dark:bg-neutral-800'>
          {content.contentType === "video" && content.videoUrl ? (
            <video
              ref={videoDetailRef}
              src={content.videoUrl}
              controls
              playsInline
              preload='auto'
              autoPlay
              className='h-auto w-full object-contain'
              poster={content.thumbnailUrl}
            />
          ) : (
            <img
              src={content.mediaUrl}
              alt={content.prompt}
              className='h-auto w-full object-contain'
            />
          )}
        </div>

        <div className='space-y-4 px-6'>
          {/* Prompt */}
          <div>
            <h3 className='mb-1 text-sm font-medium text-neutral-500 dark:text-neutral-400'>
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
                  type='button'
                  onClick={() => setShowFullPrompt(!showFullPrompt)}
                  className='mt-1 flex items-center gap-1 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                >
                  {showFullPrompt ? (
                    <>
                      View less <ChevronUp className='h-3 w-3' />
                    </>
                  ) : (
                    <>
                      View more <ChevronDown className='h-3 w-3' />
                    </>
                  )}
                </button>
              ) : null}
            </div>
          </div>

          {/* Creator Info */}
          <Link
            href={`/creator/${content.author.name}`}
            className='flex items-center gap-3 rounded-lg bg-neutral-50 p-3 transition-colors hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800'
          >
            {content.author.avatar ? (
              <img
                src={content.author.avatar}
                alt={content.author.name}
                className='h-10 w-10 rounded-full object-cover'
              />
            ) : (
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700'>
                <User className='h-5 w-5 text-neutral-600 dark:text-neutral-400' />
              </div>
            )}
            <div className='flex-1'>
              <div className='flex items-center gap-1.5'>
                <p className='text-sm font-medium text-neutral-900 dark:text-white'>
                  {content.author.name}
                </p>
                {content.author.isVerified && (
                  <svg
                    viewBox='0 0 22 22'
                    aria-label='Verified account'
                    role='img'
                    className='h-4 w-4 flex-shrink-0'
                    data-testid='icon-verified'
                    fill='#3b82f6'
                  >
                    <g>
                      <path d='M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z' />
                    </g>
                  </svg>
                )}
              </div>
              <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                Creator
              </p>
            </div>
          </Link>

          {/* Stats */}
          <div className='m-2 flex items-center gap-4'>
            {onLike ? (
              <button
                type='button'
                onClick={(e) => onLike(e, content.id)}
                disabled={isLiking}
                className='flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-red-500 disabled:opacity-50 dark:text-neutral-400'
              >
                <span>{content.likes}</span>
                <Heart
                  className={`h-4 w-4 transition-all ${
                    isLiked || content.isLiked
                      ? "fill-red-500 text-red-500"
                      : "fill-none"
                  }`}
                />
              </button>
            ) : (
              <div className='flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400'>
                <span>{content.likes}</span>
                <Heart className='h-4 w-4' />
              </div>
            )}
            <div className='flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400'>
              <Eye className='h-4 w-4' />
              <span>{content.views}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions - Fixed at bottom */}
      <div className='shrink-0 border-t bg-neutral-50 px-6 py-4 dark:bg-neutral-900'>
        <div className='flex gap-2'>
          <button
            type='button'
            onClick={onRecreate}
            className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-cyan-600'
          >
            <RefreshCw className='h-4 w-4' />
            Recreate
          </button>
          <button
            type='button'
            onClick={() => {
              navigator.clipboard.writeText(content.prompt);
              setCopied(true);
              toast({
                title: "Prompt copied",
                description: "Copied to clipboard",
              });
              setTimeout(() => setCopied(false), 2000);
            }}
            className='rounded-lg bg-neutral-100 px-4 py-2.5 text-neutral-900 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700'
          >
            {copied ? (
              <Check className='h-4 w-4 text-green-500' />
            ) : (
              <Copy className='h-4 w-4' />
            )}
          </button>
          <button
            type='button'
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
                link.download = `genit-${content.id}.${
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
            className='rounded-lg bg-neutral-100 px-4 py-2.5 text-neutral-900 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700'
          >
            <Download className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
}
