"use client";

import { useState, useRef } from "react";
import {
  Loader2,
  Wand2,
  Video as VideoIcon,
  Download,
  Share2,
  RefreshCw,
  Copy,
  Monitor,
  Clock,
  Maximize2,
  Play,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { AspectRatio } from "@/app/inspire/create/page";
import { communityApi } from "@/utils/inspire-api";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GeneratedVideo {
  id: string;
  url: string;
  thumbnail: string;
  prompt: string;
  resolution: string;
  aspectRatio: string;
  createdAt?: string;
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
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDownload = async () => {
    const currentVideo = generatedVideos[selectedVideoIndex];
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
    const currentVideo = generatedVideos[selectedVideoIndex];
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
    const currentVideo = generatedVideos[selectedVideoIndex];
    if (!currentVideo) return;

    try {
      setPublishing(true);

      // Use the selected aspect ratio
      const aspectRatio = selectedAspectRatio;

      await communityApi.submit({
        contentType: "video",
        prompt: currentVideo.prompt,
        thumbnailUrl: currentVideo.thumbnail,
        mediaUrl: currentVideo.url,
        videoUrl: currentVideo.url,
        aspectRatio,
        resolution: currentVideo.resolution,
        isPublic: true,
      });

      toast({
        title: "Published!",
        description:
          "Your video has been submitted to the community for review",
      });
    } catch (error: any) {
      console.error("Error publishing video:", error);
      toast({
        title: "Publish failed",
        description:
          error?.message || "Failed to publish video. Please try again.",
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
    <section className="p-4">
      {/* <div className="mb-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
          Generated Videos
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Preview and manage your AI-generated videos
        </p>
      </div> */}

      {/* Main Preview Area */}
      <div className="flex flex-col">
        {/* Preview Container */}
        <div className="relative w-full rounded-xl overflow-hidden min-h-[400px]">
          {/* Generating State */}
          {isGenerating && (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-8 bg-neutral-50 dark:bg-neutral-900 rounded-xl"
              style={{
                aspectRatio:
                  selectedAspectRatio === "16:9"
                    ? "16/9"
                    : selectedAspectRatio === "9:16"
                      ? "9/16"
                      : selectedAspectRatio === "1:1"
                        ? "1/1"
                        : "4/3",
              }}
            >
              <Loader2 className="w-8 h-8 text-cyan-500 dark:text-cyan-400 animate-spin mb-4" />
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                Generating video
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                {generationProgress}% complete
              </p>
              <div className="w-48 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 dark:bg-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Video Display */}
          {!isGenerating && generatedVideos.length > 0 && (
            <div className="relative group flex items-center justify-center bg-black rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                src={generatedVideos[selectedVideoIndex]?.url}
                className="max-w-full max-h-[60vh] w-auto h-auto object-contain"
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
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button
                  type="button"
                  onClick={handleFullscreen}
                  className="w-8 h-8 rounded-lg bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Empty State - only show when not generating and no videos */}
          {!isGenerating && generatedVideos.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                <VideoIcon className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                No videos yet
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6">
                Enter a prompt or upload an image in the left panel and click
                Generate to create your video
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onPromptRestore(
                      "A cinematic shot of a woman walking through a neon-lit cyberpunk city at night, rain falling, reflections on wet streets"
                    )
                  }
                  className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
                >
                  Try Example Prompt
                </button>
                {onTabChange && (
                  <button
                    type="button"
                    onClick={() => onTabChange("templates")}
                    className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-sm font-medium text-white dark:text-neutral-900 transition-colors"
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
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Generated outputs ({generatedVideos.length})
              </p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {generatedVideos.map((video, index) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => onVideoSelect(index)}
                  className={cn(
                    "relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                    selectedVideoIndex === index
                      ? "border-neutral-900 dark:border-neutral-100 ring-2 ring-neutral-900/20 dark:ring-neutral-100/20"
                      : "border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
                  )}
                >
                  <img
                    src={video.thumbnail}
                    alt={`Output ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VIDEO ACTION BUTTONS */}
        {generatedVideos.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    const currentVideo = generatedVideos[selectedVideoIndex];
                    if (currentVideo) {
                      onPromptRestore(currentVideo.prompt);
                      onDrawerClose?.(); // Close drawer on mobile
                      toast({
                        title: "Prompt restored",
                        description: "Click Generate to recreate",
                      });
                    }
                  }}
                  className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Recreate</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    const currentVideo = generatedVideos[selectedVideoIndex];
                    if (currentVideo) {
                      navigator.clipboard.writeText(currentVideo.prompt);
                      toast({
                        title: "Prompt copied",
                        description: "Prompt copied to clipboard",
                      });
                    }
                  }}
                  className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy prompt</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-sm font-medium text-white dark:text-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Publish
                </>
              )}
            </button>
          </div>
        )}

        {/* VIDEO DETAILS */}
        {generatedVideos.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                  Prompt
                </p>
                <p className="text-sm text-neutral-900 dark:text-white line-clamp-2">
                  {generatedVideos[selectedVideoIndex]?.prompt || "No prompt"}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <Monitor className="w-3.5 h-3.5" />
                {generatedVideos[selectedVideoIndex]?.resolution}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
                {generatedVideos[selectedVideoIndex]?.aspectRatio}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <Clock className="w-3.5 h-3.5" />
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
