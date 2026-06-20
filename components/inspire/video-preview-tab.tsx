"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/types/inspire";
import { communityApi } from "@/utils/inspire-api";
import {
  Clock,
  Copy,
  Download,
  Loader2,
  Maximize2,
  Monitor,
  Play,
  RefreshCw,
  Share2,
  Upload,
  Video as VideoIcon,
  Wand2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface GeneratedVideo {
  id: string;
  generatedVideoId?: string; // ID from the database
  url: string;
  thumbnail: string;
  prompt: string;
  resolution: string;
  aspectRatio: string;
  createdAt?: string;
  startFrameUrl?: string; // Start frame image URL (for video)
  endFrameUrl?: string; // End frame image URL (for video)
  referenceImageUrls?: string[]; // Reference images for style/context
}

interface VideoPreviewTabProps {
  isGenerating: boolean;
  generationProgress: number;
  generatedVideos: GeneratedVideo[];
  selectedVideoIndex: number;
  selectedAspectRatio: AspectRatio;
  onVideoSelect: (index: number) => void;
  onPromptRestore: (prompt: string) => void;
  onTabChange?: (
    tab: "preview" | "community" | "templates" | "tutorial"
  ) => void;
  onDrawerClose?: () => void;
}

export function VideoPreviewTab({
  isGenerating,
  generationProgress,
  generatedVideos,
  selectedVideoIndex,
  selectedAspectRatio,
  onVideoSelect,
  onPromptRestore,
  onTabChange,
  onDrawerClose,
}: VideoPreviewTabProps) {
  const [publishing, setPublishing] = useState(false);
  const [publishedVideoIds, setPublishedVideoIds] = useState<Set<string>>(
    new Set()
  );
  const [publishedContentMap, setPublishedContentMap] = useState<
    Map<string, string>
  >(new Map()); // Map of generatedVideoId -> communityContentId
  const [checkingPublished, setCheckingPublished] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if videos have been published on mount and when selected video changes
  useEffect(() => {
    const checkPublishedStatus = async () => {
      if (generatedVideos.length === 0) return;

      try {
        setCheckingPublished(true);
        // Fetch user's own community content to check for published videos
        const response = await communityApi.getUserContent("video", 1, 100);

        if (response.success && response.data?.content) {
          const publishedIds = new Set<string>();
          const contentMap = new Map<string, string>();
          response.data.content.forEach((content: any) => {
            if (content.generatedVideoId) {
              publishedIds.add(content.generatedVideoId);
              contentMap.set(content.generatedVideoId, content.id);
            }
          });
          setPublishedVideoIds(publishedIds);
          setPublishedContentMap(contentMap);
        }
      } catch (error) {
        console.error("Error checking published status:", error);
      } finally {
        setCheckingPublished(false);
      }
    };

    checkPublishedStatus();
  }, [generatedVideos.length]); // Re-check when videos change

  // Get current video (used throughout component)
  const currentVideo = generatedVideos[selectedVideoIndex];

  // Check if current video is published
  const isPublished = Boolean(
    currentVideo?.generatedVideoId &&
    publishedVideoIds.has(currentVideo.generatedVideoId)
  );

  const handleDownload = async () => {
    if (!currentVideo) return;

    try {
      const response = await fetch(currentVideo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `video-${currentVideo.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Download started",
        description: "Your video is being downloaded",
      });
    } catch (error) {
      console.error("Error downloading video:", error);
      toast({
        title: "Download failed",
        description: "Failed to download video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!currentVideo) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out this AI-generated video",
          text: currentVideo.prompt,
          url: currentVideo.url,
        });
        toast({
          title: "Shared",
          description: "Video shared successfully",
        });
      } else {
        // Fallback: Copy URL to clipboard
        await navigator.clipboard.writeText(currentVideo.url);
        toast({
          title: "Link copied",
          description: "Video URL copied to clipboard",
        });
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        // Fallback: Copy URL to clipboard
        await navigator.clipboard.writeText(currentVideo.url);
        toast({
          title: "Link copied",
          description: "Video URL copied to clipboard",
        });
      }
    }
  };

  const handlePublish = async () => {
    if (!currentVideo) return;

    // If already published, unpublish it
    if (
      currentVideo.generatedVideoId &&
      publishedVideoIds.has(currentVideo.generatedVideoId)
    ) {
      const communityContentId = publishedContentMap.get(
        currentVideo.generatedVideoId
      );
      if (communityContentId) {
        try {
          setPublishing(true);
          await communityApi.delete(communityContentId);
          setPublishedVideoIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(currentVideo.generatedVideoId!);
            return newSet;
          });
          setPublishedContentMap((prev) => {
            const newMap = new Map(prev);
            newMap.delete(currentVideo.generatedVideoId!);
            return newMap;
          });
          toast({
            title: "Unpublished",
            description: "Video has been removed from the community",
          });
        } catch (error: any) {
          console.error("Error unpublishing video:", error);
          toast({
            title: "Unpublish failed",
            description:
              error?.response?.data?.message ||
              error?.message ||
              "Failed to unpublish video. Please try again.",
            variant: "destructive",
          });
        } finally {
          setPublishing(false);
        }
      }
      return;
    }

    try {
      setPublishing(true);

      // Use the selected aspect ratio
      const aspectRatio = selectedAspectRatio;

      const response = await communityApi.submit({
        contentType: "video",
        generatedVideoId: currentVideo.generatedVideoId || currentVideo.id,
        prompt: currentVideo.prompt,
        thumbnailUrl: currentVideo.thumbnail,
        mediaUrl: currentVideo.url,
        videoUrl: currentVideo.url,
        aspectRatio,
        resolution: currentVideo.resolution,
        startFrameUrl: currentVideo.startFrameUrl,
        endFrameUrl: currentVideo.endFrameUrl,
        referenceImageUrls: currentVideo.referenceImageUrls || [],
        isPublic: true,
      });

      // Update published status
      if (currentVideo.generatedVideoId && response.data?.id) {
        setPublishedVideoIds((prev) =>
          new Set(prev).add(currentVideo.generatedVideoId!)
        );
        setPublishedContentMap((prev) =>
          new Map(prev).set(currentVideo.generatedVideoId!, response.data.id)
        );
      }

      toast({
        title: "Post published",
        description: "Your video has been published to the community",
      });
    } catch (error: any) {
      console.error("Error publishing video:", error);
      toast({
        title: "Publish failed",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to publish video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if ((video as any).webkitRequestFullscreen) {
      (video as any).webkitRequestFullscreen();
    } else if ((video as any).mozRequestFullScreen) {
      (video as any).mozRequestFullScreen();
    } else if ((video as any).msRequestFullscreen) {
      (video as any).msRequestFullscreen();
    }
  };

  return (
    <section className='p-4 px-0'>
      {/* Main Preview Area */}
      <div className='flex flex-col'>
        {/* Preview Container */}
        <div
          className={cn(
            "relative min-h-[400px] w-full overflow-hidden rounded-xl"
          )}
        >
          {/* Generating State */}
          {isGenerating && (
            <div className='absolute inset-0 flex flex-col items-center justify-center p-8 text-center'>
              <Loader2 className='mb-4 h-8 w-8 animate-spin text-neutral-400 dark:text-neutral-500' />
              <h3 className='mb-2 text-base font-semibold text-neutral-900 dark:text-white'>
                Generating video
              </h3>
              <p className='mb-4 text-sm text-neutral-500 dark:text-neutral-400'>
                {generationProgress}% complete
              </p>
              <div className='h-1 w-48 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700'>
                <div
                  className='h-full rounded-full bg-neutral-900 transition-all duration-300 dark:bg-neutral-100'
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Video Display */}
          {!isGenerating && generatedVideos.length > 0 && (
            <div className='group relative flex items-center justify-center overflow-hidden rounded-xl bg-black'>
              <video
                ref={videoRef}
                src={generatedVideos[selectedVideoIndex]?.url}
                className='h-auto max-h-[60vh] w-auto max-w-full object-contain'
                controls
                loop
                playsInline
                onError={(e) => {
                  console.error("Video playback error:", e);
                  toast({
                    title: "Video playback error",
                    description: "The video URL may be invalid or inaccessible",
                    variant: "destructive",
                  });
                }}
              />
              <div className='absolute top-3 right-3 z-20 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
                <button
                  type='button'
                  onClick={handleFullscreen}
                  className='flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white transition-colors hover:bg-black/70'
                  title='Fullscreen'
                >
                  <Maximize2 className='h-4 w-4' />
                </button>
              </div>
            </div>
          )}

          {/* Empty State - only show when not generating and no videos */}
          {!isGenerating && generatedVideos.length === 0 && (
            <div className='absolute inset-0 flex flex-col items-center justify-center p-8 text-center'>
              <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800'>
                <VideoIcon className='h-8 w-8 text-neutral-400 dark:text-neutral-500' />
              </div>
              <h3 className='mb-2 text-lg font-semibold text-neutral-900 dark:text-white'>
                No videos yet
              </h3>
              <p className='mb-6 max-w-sm text-sm text-neutral-500 dark:text-neutral-400'>
                Enter a prompt or upload an image in the left panel and click
                Generate to create your video
              </p>
              <div className='flex flex-col gap-3 sm:flex-row'>
                <button
                  type='button'
                  onClick={() =>
                    onPromptRestore(
                      "A cinematic shot of a woman walking through a neon-lit cyberpunk city at night, rain falling, reflections on wet streets"
                    )
                  }
                  className='rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                >
                  Try Example Prompt
                </button>
                {onTabChange && (
                  <button
                    type='button'
                    onClick={() => onTabChange("templates")}
                    className='rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200'
                  >
                    Browse Templates
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* VIDEO THUMBNAILS */}
        {generatedVideos.length > 1 && (
          <div className='mt-4'>
            <div className='mb-2 flex items-center justify-between'>
              <p className='text-xs font-medium text-neutral-500 dark:text-neutral-400'>
                Generated outputs ({generatedVideos.length})
              </p>
            </div>
            <div className='flex gap-2 overflow-x-auto pb-2'>
              {generatedVideos.map((video, index) => (
                <button
                  key={video.id}
                  type='button'
                  onClick={() => onVideoSelect(index)}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                    selectedVideoIndex === index
                      ? "border-neutral-900 ring-2 ring-neutral-900/20 dark:border-neutral-100 dark:ring-neutral-100/20"
                      : "border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
                  )}
                >
                  <img
                    src={video.thumbnail}
                    alt={`Output ${index + 1}`}
                    className='h-full w-full object-cover'
                  />
                  <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
                    <Play className='h-4 w-4 text-white' />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VIDEO ACTION BUTTONS */}
        {generatedVideos.length > 0 && (
          <div className='mt-4 flex flex-wrap items-center gap-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type='button'
                  onClick={() => {
                    if (currentVideo) {
                      onPromptRestore(currentVideo.prompt);
                      onDrawerClose?.(); // Close drawer on mobile
                      toast({
                        title: "Prompt restored",
                        description: "Click Generate to recreate",
                      });
                    }
                  }}
                  className='flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                >
                  <RefreshCw className='h-4 w-4' />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Recreate</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type='button'
                  onClick={() => {
                    if (currentVideo) {
                      navigator.clipboard.writeText(currentVideo.prompt);
                      toast({
                        title: "Prompt copied",
                        description: "Prompt copied to clipboard",
                      });
                    }
                  }}
                  className='flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                >
                  <Copy className='h-4 w-4' />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy prompt</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type='button'
                  onClick={handleDownload}
                  className='flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                >
                  <Download className='h-4 w-4' />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type='button'
                  onClick={handleShare}
                  className='flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                >
                  <Share2 className='h-4 w-4' />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
            <button
              type='button'
              onClick={handlePublish}
              disabled={publishing}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                isPublished
                  ? "bg-neutral-200 text-neutral-600 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600"
                  : "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
              )}
            >
              {publishing ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Publishing...
                </>
              ) : isPublished ? (
                <>
                  <Upload className='h-4 w-4' />
                  Published
                </>
              ) : (
                <>
                  <Upload className='h-4 w-4' />
                  Publish
                </>
              )}
            </button>
          </div>
        )}

        {/* VIDEO DETAILS */}
        {generatedVideos.length > 0 && (
          <div className='mt-4 rounded-xl border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-700 dark:bg-neutral-800'>
            <div className='flex items-start justify-between gap-4'>
              <div className='min-w-0 flex-1'>
                <p className='mb-1 text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400'>
                  Prompt
                </p>
                <p className='line-clamp-2 text-sm text-neutral-900 dark:text-white'>
                  {generatedVideos[selectedVideoIndex]?.prompt || "No prompt"}
                </p>
              </div>
            </div>
            <div className='mt-3 flex flex-wrap gap-3 border-t border-neutral-200 pt-3 dark:border-neutral-700'>
              <div className='flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400'>
                <Monitor className='h-3.5 w-3.5' />
                {generatedVideos[selectedVideoIndex]?.resolution}
              </div>
              <div className='flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400'>
                <svg
                  className='h-3.5 w-3.5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <rect x='3' y='3' width='18' height='18' rx='2' />
                </svg>
                {generatedVideos[selectedVideoIndex]?.aspectRatio}
              </div>
              <div className='flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400'>
                <Clock className='h-3.5 w-3.5' />
                {generatedVideos[selectedVideoIndex]?.createdAt
                  ? new Date(
                      generatedVideos[selectedVideoIndex].createdAt
                    ).toLocaleTimeString()
                  : "Just now"}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
