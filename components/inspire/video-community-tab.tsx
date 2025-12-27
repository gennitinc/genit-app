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
} from "lucide-react";
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
  const [videos, setVideos] = useState<CommunityContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<CommunityContent | null>(
    null
  );
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [likingVideoId, setLikingVideoId] = useState<string | null>(null);
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
        // Fallback to just setting prompt
        onPromptSelect(video.prompt);
        onTabChange("preview");
        toast({
          title: "Prompt copied",
          description: "Ready to generate your version",
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
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
            Community Videos
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Get inspired by what others have created
          </p>
        </div>

        <div className="columns-2 lg:columns-3 gap-4">
          {videos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              index={index}
              onRecreate={() => handleRecreate(video)}
              onClick={() => handleVideoClick(video)}
              onLike={handleLike}
              isLiked={likedVideos.has(video.id) || video.isLiked}
              isLiking={likingVideoId === video.id}
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
          <DrawerContent className="max-h-[90vh] overflow-hidden flex flex-col">
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
    </>
  );
}

function VideoCard({
  video,
  index,
  onRecreate,
  onClick,
  onLike,
  isLiked,
  isLiking,
}: {
  video: CommunityContent;
  index: number;
  onRecreate: () => void;
  onClick: () => void;
  onLike?: (e: React.MouseEvent, videoId: string) => void;
  isLiked?: boolean;
  isLiking?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoElement.play().catch(() => {
              // Autoplay failed, user interaction needed
            });
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Use aspectRatio from API or randomize for masonry effect
  const aspectRatios = ["1/1", "3/4", "4/5", "9/16", "16/9"];
  const aspectRatio =
    video.aspectRatio?.replace(":", "/") ||
    aspectRatios[index % aspectRatios.length];

  return (
    <div
      onClick={onClick}
      className="group relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer break-inside-avoid mb-4"
    >
      <div className="relative">
        {video.videoUrl ? (
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
        ) : (
          <img
            src={video.thumbnailUrl}
            alt={video.prompt}
            className="w-full object-cover"
            style={{ aspectRatio }}
          />
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />

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
        <p className="text-white text-sm font-medium line-clamp-2 mb-2">
          {video.prompt}
        </p>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {video.author.avatar ? (
              <img
                src={video.author.avatar}
                alt={video.author.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                <User className="w-3 h-3 text-neutral-600 dark:text-neutral-400" />
              </div>
            )}
            <span className="text-xs text-white/80 font-medium">
              {video.author.name}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRecreate();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium transition-colors"
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
  return (
    <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
      {/* <DialogHeader className="px-6 pt-6 pb-4 shrink-0 border-b">
        <DialogTitle className="text-xl font-semibold">
          Video Details
        </DialogTitle>
      </DialogHeader> */}

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {/* Video Preview */}
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

        {/* Prompt */}
        <div>
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
            Prompt
          </h3>
          <p className="text-sm text-neutral-900 dark:text-white">
            {video.prompt}
          </p>
        </div>

        {/* Creator Info */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900">
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
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {video.author.name}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Creator
            </p>
          </div>
        </div>

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
              toast({
                title: "Prompt copied",
                description: "Copied to clipboard",
              });
            }}
            className="px-4 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
