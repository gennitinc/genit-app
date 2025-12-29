"use client";

import { useRef, useEffect, useState } from "react";
import {
  Copy,
  RefreshCw,
  Heart,
  Eye,
  User,
  Users,
  Loader2,
  Play,
  Pause,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
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
import { communityApi } from "@/utils/inspire-api";
import { CommunityContent } from "@/types/inspire";
import { io, Socket } from "socket.io-client";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface VideoGenerationParamsCallback {
  // Common
  setPrompt: (prompt: string) => void;
  setAspectRatio?: (aspectRatio: string) => void;
  setResolution?: (resolution: string) => void;
  setModel?: (model: any) => void;

  // Video specific
  setPresenter?: (presenter: any) => void;
  setVoice?: (voice: any) => void;
  setDuration?: (duration: number) => void;
  setStartFrame?: (file: File | null) => void;
  setEndFrame?: (file: File | null) => void;
  setReferenceImages?: (images: File[]) => void;

  // Switch to preview tab
  onTabChange: (
    tab: "preview" | "community" | "templates" | "tutorial"
  ) => void;
}

interface VideoCommunityTabProps {
  onPromptSelect: (prompt: string) => void;
  onTabChange: (
    tab: "preview" | "community" | "templates" | "tutorial"
  ) => void;
  onParamsRestore?: VideoGenerationParamsCallback;
}

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

export function VideoCommunityTab({
  onPromptSelect,
  onTabChange,
  onParamsRestore,
}: VideoCommunityTabProps) {
  const { user } = useUserContext();
  const router = useRouter();
  const [videos, setVideos] = useState<CommunityContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<CommunityContent | null>(
    null
  );
  const [viewVideo, setViewVideo] = useState<CommunityContent | null>(null);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [likingVideoId, setLikingVideoId] = useState<string | null>(null);
  const [expandedPrompts, setExpandedPrompts] = useState<Set<string>>(new Set());
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const socketRef = useRef<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
      {
        transports: ["websocket", "polling"],
      }
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on(
      "community:like-updated",
      (data: { contentId: string; likes: number; liked: boolean }) => {
        setVideos((prev) =>
          prev.map((vid) =>
            vid.id === data.contentId
              ? { ...vid, likes: data.likes, isLiked: data.liked }
              : vid
          )
        );
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await communityApi.getContent({
          type: "video",
          limit: 30,
          sort: "recent",
        });
        if (response.success && response.data) {
          const fetchedVideos = response.data.content || [];
          setVideos(fetchedVideos);

          // Initialize liked videos set from API response
          const liked = new Set<string>();
          fetchedVideos.forEach((vid) => {
            if (vid.isLiked) {
              liked.add(vid.id);
            }
          });
          setLikedVideos(liked);
        } else {
          console.error("Failed to fetch videos:", response);
          setVideos([]);
        }
      } catch (error) {
        console.error("Error fetching community videos:", error);
        toast({
          title: "Error",
          description: "Failed to load community videos. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleRecreate = async (video: CommunityContent) => {
    // Check if user is authenticated
    if (!user) {
      router.push("/signin");
      return;
    }

    try {
      if (onParamsRestore) {
        // Restore prompt
        onParamsRestore.setPrompt(video.prompt);

        // Restore aspect ratio
        if (video.aspectRatio && onParamsRestore.setAspectRatio) {
          onParamsRestore.setAspectRatio(video.aspectRatio);
        }

        // Restore resolution
        if (video.resolution && onParamsRestore.setResolution) {
          onParamsRestore.setResolution(video.resolution);
        }

        // Restore duration
        if (video.duration && onParamsRestore.setDuration) {
          onParamsRestore.setDuration(parseInt(video.duration) || 8);
        }

        // Restore presenter if available
        if (video.presenterId && onParamsRestore.setPresenter) {
          // Presenter will be set by fetching the presenter object
          // The presenterId is available for the parent to fetch and set
        }

        // Restore voice if available
        if (video.voiceId && onParamsRestore.setVoice) {
          // Voice will be set by fetching the voice object
          // The voiceId is available for the parent to fetch and set
        }

        // Restore start frame and end frame if available
        if (video.startFrameUrl && onParamsRestore.setStartFrame) {
          // Download and set start frame
          try {
            const response = await fetch(video.startFrameUrl);
            const blob = await response.blob();
            const file = new File([blob], "start-frame.jpg", {
              type: blob.type,
            });
            onParamsRestore.setStartFrame(file);
          } catch (error) {
            console.error("Failed to load start frame:", error);
          }
        }

        if (video.endFrameUrl && onParamsRestore.setEndFrame) {
          // Download and set end frame
          try {
            const response = await fetch(video.endFrameUrl);
            const blob = await response.blob();
            const file = new File([blob], "end-frame.jpg", { type: blob.type });
            onParamsRestore.setEndFrame(file);
          } catch (error) {
            console.error("Failed to load end frame:", error);
          }
        }

        // Restore reference images if available
        if (
          video.referenceImageUrls &&
          video.referenceImageUrls.length > 0 &&
          onParamsRestore.setReferenceImages
        ) {
          try {
            const imageFiles = await Promise.all(
              video.referenceImageUrls.map(async (url, index) => {
                const response = await fetch(url);
                const blob = await response.blob();
                return new File([blob], `reference-${index}.jpg`, {
                  type: blob.type,
                });
              })
            );
            onParamsRestore.setReferenceImages(imageFiles);
          } catch (error) {
            console.error("Failed to load reference images:", error);
          }
        }

        // Switch to preview tab
        onParamsRestore.onTabChange("preview");

        toast({
          title: "Settings restored",
          description:
            "All generation parameters have been loaded. Click Generate to create your version.",
        });
      } else {
        // Store recreate data in localStorage for navigation
        const recreateData = {
          type: "video",
          prompt: video.prompt,
          aspectRatio: video.aspectRatio,
          resolution: video.resolution,
          duration: video.duration,
          presenterId: video.presenterId,
          voiceId: video.voiceId,
          startFrameUrl: video.startFrameUrl,
          endFrameUrl: video.endFrameUrl,
          referenceImageUrls: video.referenceImageUrls || [],
        };
        localStorage.setItem("recreateData", JSON.stringify(recreateData));
        
        // Navigate to create page
        onPromptSelect(video.prompt);
        onTabChange("preview");
        toast({
          title: "Settings saved",
          description: "All parameters will be restored on the create page",
        });
      }
    } catch (error) {
      // Still allow recreating even if there's an error
      onPromptSelect(video.prompt);
      onTabChange("preview");
    }
  };

  const handleLike = async (e: React.MouseEvent, videoId: string) => {
    e.stopPropagation();

    // Check if user is authenticated
    if (!user) {
      router.push("/signin");
      return;
    }

    try {
      setLikingVideoId(videoId);
      const response = await communityApi.toggleLike(videoId);
      if (response.success && response.data) {
        const isLiked = response.data.liked || false;
        const likes = response.data.likes || 0;

        setVideos((prev) =>
          prev.map((vid) =>
            vid.id === videoId ? { ...vid, likes, isLiked: isLiked } : vid
          )
        );

        if (selectedVideo?.id === videoId) {
          setSelectedVideo((prev) =>
            prev ? { ...prev, likes, isLiked: isLiked } : null
          );
        }

        if (isLiked) {
          setLikedVideos((prev) => new Set(prev).add(videoId));
        } else {
          setLikedVideos((prev) => {
            const newSet = new Set(prev);
            newSet.delete(videoId);
            return newSet;
          });
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLikingVideoId(null);
    }
  };

  const handleVideoClick = async (video: CommunityContent) => {
    try {
      // Fetch full details
      const response = await communityApi.getById(video.id);
      if (response.success && response.data) {
        setSelectedVideo(response.data);
      } else {
        setSelectedVideo(video);
      }
    } catch (error) {
      // Fallback to basic video data
      setSelectedVideo(video);
    }
  };

  if (loading) {
    return (
      <section className="p-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 text-neutral-400 dark:text-neutral-500 animate-spin mb-3" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Loading community videos...
          </p>
        </div>
      </section>
    );
  }

  if (videos.length === 0 && !loading) {
    return (
      <section className="p-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
            No community videos yet
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6">
            Generate a video and publish it to share with others
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => onTabChange("preview")}
              className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-sm font-medium text-white dark:text-neutral-900 transition-colors"
            >
              Create Video
            </button>
            <button
              type="button"
              onClick={() => onTabChange("templates")}
              className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              Browse Templates
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="p-4">
        <div className="columns-2 lg:columns-3 gap-4">
          {videos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              index={index}
              onRecreate={() => handleRecreate(video)}
              onClick={() => handleVideoClick(video)}
              onView={() => setViewVideo(video)}
              onLike={handleLike}
              isLiked={likedVideos.has(video.id) || video.isLiked}
              isLiking={likingVideoId === video.id}
              expandedPrompts={expandedPrompts}
              setExpandedPrompts={setExpandedPrompts}
            />
          ))}
        </div>
      </section>

      {/* Desktop Dialog */}
      {isDesktop ? (
        <Dialog
          open={!!selectedVideo}
          onOpenChange={() => setSelectedVideo(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
            {selectedVideo && (
              <VideoDetailContent
                video={selectedVideo}
                onRecreate={() => {
                  handleRecreate(selectedVideo);
                  setSelectedVideo(null);
                }}
                onClose={() => setSelectedVideo(null)}
                onLike={handleLike}
                isLiked={
                  likedVideos.has(selectedVideo.id) || selectedVideo.isLiked
                }
                isLiking={likingVideoId === selectedVideo.id}
              />
            )}
          </DialogContent>
        </Dialog>
      ) : (
        /* Mobile/Tablet Drawer */
        <Drawer
          open={!!selectedVideo}
          onOpenChange={() => setSelectedVideo(null)}
        >
          <DrawerContent className="max-h-[85vh] overflow-hidden flex flex-col">
            {selectedVideo && (
              <VideoDetailContent
                video={selectedVideo}
                onRecreate={() => {
                  handleRecreate(selectedVideo);
                  setSelectedVideo(null);
                }}
                onClose={() => setSelectedVideo(null)}
                onLike={handleLike}
                isLiked={
                  likedVideos.has(selectedVideo.id) || selectedVideo.isLiked
                }
                isLiking={likingVideoId === selectedVideo.id}
              />
            )}
          </DrawerContent>
        </Drawer>
      )}

      {/* View Drawer - Shows prompt and user profile only (no media) */}
      <Drawer open={!!viewVideo} onOpenChange={() => setViewVideo(null)}>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          {viewVideo && (
            <div className="p-6">
              <DrawerHeader>
                <DrawerTitle>Content Details</DrawerTitle>
              </DrawerHeader>
              <div className="space-y-6 mt-4">
                {/* Prompt */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                    Prompt
                  </h3>
                  <p className="text-base text-neutral-900 dark:text-neutral-100">
                    {viewVideo.prompt}
                  </p>
                </div>

                {/* User Profile */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-3">
                    Creator
                  </h3>
                  <Link
                    href={`/creator/${viewVideo.author.name}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    {viewVideo.author.avatar ? (
                      <img
                        src={viewVideo.author.avatar}
                        alt={viewVideo.author.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-medium text-neutral-900 dark:text-neutral-100">
                          {viewVideo.author.name}
                        </span>
                        {viewVideo.author.isVerified && (
                          <svg
                            viewBox="0 0 22 22"
                            aria-label="Verified account"
                            role="img"
                            className="w-5 h-5 flex-shrink-0"
                            data-testid="icon-verified"
                            fill="#3b82f6"
                          >
                            <g>
                              <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                            </g>
                          </svg>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

function VideoCard({
  video,
  index,
  onRecreate,
  onClick,
  onView,
  onLike,
  isLiked,
  isLiking,
  expandedPrompts,
  setExpandedPrompts,
}: {
  video: CommunityContent;
  index: number;
  onRecreate: () => void;
  onClick: () => void;
  onView: () => void;
  onLike?: (e: React.MouseEvent, videoId: string) => void;
  isLiked?: boolean;
  isLiking?: boolean;
  expandedPrompts: Set<string>;
  setExpandedPrompts: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Auto-play preview (muted) when entering viewport
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !video.videoUrl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isPaused) {
            // Auto-play preview for 2 seconds (muted)
            videoElement.currentTime = 0;
            videoElement.muted = true; // Keep muted for preview
            videoElement.play().catch(() => {
              // Autoplay failed, user interaction needed
            });
            // Pause after 2 seconds
            timeoutRef.current = setTimeout(() => {
              if (videoElement && isPaused) {
                videoElement.pause();
                videoElement.currentTime = 0;
                setIsPaused(true);
              }
            }, 2000);
          } else if (!entry.isIntersecting) {
            videoElement.pause();
            videoElement.currentTime = 0;
            videoElement.muted = true; // Reset to muted
            setIsPaused(true);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [video.videoUrl, isPaused]);

  // Handle hover to play (desktop only, with sound)
  const handleMouseEnter = () => {
    if (video.videoUrl && videoRef.current && isDesktop) {
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
    if (video.videoUrl && videoRef.current && isDesktop) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true; // Mute again when leaving
      setIsPaused(true);
    }
  };

  // Handle play icon click (mobile only, with sound)
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.videoUrl && videoRef.current && !isDesktop) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false; // Unmute on click
      videoRef.current.play().catch((error) => {
        console.error("Error playing video on click:", error);
      });
      setIsPaused(false);
    }
  };

  // Use aspectRatio from API or randomize for masonry effect
  const aspectRatios = ["1/1", "3/4", "4/5", "9/16", "16/9"];
  const aspectRatio =
    video.aspectRatio?.replace(":", "/") ||
    aspectRatios[index % aspectRatios.length];

  return (
    <div
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer break-inside-avoid mb-4"
    >
      <div className="relative">
        {video.videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              loop
              muted
              playsInline
              className="w-full object-cover"
              style={{ aspectRatio }}
            />
          </>
        ) : (
          <img
            src={video.thumbnailUrl}
            alt={video.prompt}
            className="w-full object-cover"
            style={{ aspectRatio }}
          />
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Play/Pause and View icons - Centered */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (isPaused) {
                  if (isDesktop) {
                    handleMouseEnter();
                  } else {
                    handlePlayClick(e as any);
                  }
                } else {
                  if (videoRef.current) {
                    videoRef.current.pause();
                    setIsPaused(true);
                  }
                }
              }}
              className="w-12 h-12 rounded-full bg-black/70 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center shadow-lg transition-colors"
            >
              {isPaused ? (
                <Play className="w-6 h-6 text-white ml-1" />
              ) : (
                <Pause className="w-6 h-6 text-white" />
              )}
            </button>
            {/* View Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="w-12 h-12 rounded-full bg-black/70 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center shadow-lg transition-colors"
            >
              <Eye className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Likes count and heart icon - Top right, centered together */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {video.likes > 0 && (
            <span className="text-white text-xs font-medium">
              {video.likes}
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(e, video.id);
            }}
            disabled={!onLike || isLiking}
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
        
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="mb-2">
          <p
            className={`text-white text-sm font-medium ${
              !expandedPrompts.has(video.id) ? "line-clamp-4" : ""
            }`}
          >
            {video.prompt}
          </p>
          {(video.prompt.split("\n").length > 4 ||
            (video.prompt.length > 200 && !expandedPrompts.has(video.id))) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedPrompts((prev) => {
                  const newSet = new Set(prev);
                  if (newSet.has(video.id)) {
                    newSet.delete(video.id);
                  } else {
                    newSet.add(video.id);
                  }
                  return newSet;
                });
              }}
              className="text-white/80 text-xs font-medium mt-1 hover:text-white transition-colors flex items-center gap-1"
            >
              {expandedPrompts.has(video.id) ? (
                <>
                  View less <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  View more <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href={`/creator/${video.author.name}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit"
          >
            {video.author.avatar ? (
              <img
                src={video.author.avatar}
                alt={video.author.name}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                <User className="w-3 h-3 text-neutral-600 dark:text-neutral-400" />
              </div>
            )}
            <span className="text-xs text-white/80 font-medium">
              {video.author.name}
            </span>
            {video.author.isVerified && (
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
              onRecreate();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium transition-colors w-fit"
          >
            <RefreshCw className="w-3 h-3" />
            Recreate
          </button>
        </div>
      </div>
    </div>
  );
}

function VideoDetailContent({
  video,
  onRecreate,
  onClose,
  onLike,
  isLiked,
  isLiking,
}: {
  video: CommunityContent;
  onRecreate: () => void;
  onClose: () => void;
  onLike?: (e: React.MouseEvent, videoId: string) => void;
  isLiked?: boolean;
  isLiking?: boolean;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [copied, setCopied] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  
  return (
    <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {/* Video Preview - Hidden on mobile */}
        {isDesktop && (
          <div className="relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            {video.videoUrl ? (
              <video
                src={video.videoUrl}
                poster={video.thumbnailUrl}
                controls
                loop
                className="w-full h-auto max-h-[50vh] object-contain"
              />
            ) : (
              <img
                src={video.thumbnailUrl}
                alt={video.prompt}
                className="w-full h-auto max-h-[50vh] object-contain"
              />
            )}
          </div>
        )}

        {/* Prompt */}
        <div>
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
            Prompt
          </h3>
          <div>
            <p
              className={`text-sm text-neutral-900 dark:text-white ${
                !showFullPrompt ? "line-clamp-4" : ""
              }`}
            >
              {video.prompt}
            </p>
            {(video.prompt.split("\n").length > 4 ||
              (video.prompt.length > 200 && !showFullPrompt)) && (
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
            )}
          </div>
        </div>

        {/* Creator Info */}
        <Link
          href={`/creator/${video.author.name}`}
          className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {video.author.avatar ? (
            <img
              src={video.author.avatar}
              alt={video.author.name}
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
                {video.author.name}
              </p>
              {video.author.isVerified && (
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Heart className="w-4 h-4" />
            <span>{video.likes} likes</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Eye className="w-4 h-4" />
            <span>{video.views} views</span>
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
              navigator.clipboard.writeText(video.prompt);
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
        </div>
      </div>
    </div>
  );
}
