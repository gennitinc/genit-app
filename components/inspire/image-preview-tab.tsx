"use client";

import { useState } from "react";
import {
  Loader2,
  Wand2,
  ImageIcon,
  Download,
  Share2,
  RefreshCw,
  Copy,
  Palette,
  Monitor,
  Clock,
  Maximize2,
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

interface GeneratedImage {
  id: string;
  url: string;
  thumbnail: string;
  prompt: string;
  style: string;
  resolution: string;
  aspectRatio?: AspectRatio;
  createdAt?: string;
  generatedImageId?: string; // ID from the database
}

interface ImagePreviewTabProps {
  isGenerating: boolean;
  generationProgress: number;
  generatedImages: GeneratedImage[];
  selectedImageIndex: number;
  selectedAspectRatio: AspectRatio;
  onImageSelect: (index: number) => void;
  onPromptRestore: (prompt: string) => void;
  onTabChange?: (
    tab: "preview" | "community" | "templates" | "tutorial"
  ) => void;
  onDrawerClose?: () => void;
}

export function ImagePreviewTab({
  isGenerating,
  generationProgress,
  generatedImages,
  selectedImageIndex,
  selectedAspectRatio,
  onImageSelect,
  onPromptRestore,
  onTabChange,
  onDrawerClose,
}: ImagePreviewTabProps) {
  const [publishing, setPublishing] = useState(false);

  const handleDownload = async () => {
    const currentImage = generatedImages[selectedImageIndex];
    if (!currentImage) return;

    try {
      const response = await fetch(currentImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `image-${currentImage.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Download started",
        description: "Your image is being downloaded",
      });
    } catch (error) {
      console.error("Error downloading image:", error);
      toast({
        title: "Download failed",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const currentImage = generatedImages[selectedImageIndex];
    if (!currentImage) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out this AI-generated image",
          text: currentImage.prompt,
          url: currentImage.url,
        });
        toast({
          title: "Shared",
          description: "Image shared successfully",
        });
      } else {
        // Fallback: Copy URL to clipboard
        await navigator.clipboard.writeText(currentImage.url);
        toast({
          title: "Link copied",
          description: "Image URL copied to clipboard",
        });
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        // Fallback: Copy URL to clipboard
        await navigator.clipboard.writeText(currentImage.url);
        toast({
          title: "Link copied",
          description: "Image URL copied to clipboard",
        });
      }
    }
  };

  const handlePublish = async () => {
    const currentImage = generatedImages[selectedImageIndex];
    if (!currentImage) return;

    try {
      setPublishing(true);

      // Use aspect ratio from image object if available, otherwise use selected aspect ratio
      const aspectRatio = currentImage.aspectRatio || selectedAspectRatio;

      await communityApi.submit({
        contentType: "image",
        generatedImageId: currentImage.generatedImageId || currentImage.id, // Use generatedImageId if available
        prompt: currentImage.prompt,
        thumbnailUrl: currentImage.thumbnail || currentImage.url,
        mediaUrl: currentImage.url,
        aspectRatio,
        style: currentImage.style,
        resolution: currentImage.resolution,
        isPublic: true,
      });

      toast({
        title: "Published!",
        description:
          "Your image has been submitted to the community for review",
      });
    } catch (error: any) {
      console.error("Error publishing image:", error);
      toast({
        title: "Publish failed",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to publish image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleFullscreen = () => {
    const currentImage = generatedImages[selectedImageIndex];
    if (!currentImage) return;

    const img = new Image();
    img.src = currentImage.url;
    img.style.maxWidth = "100vw";
    img.style.maxHeight = "100vh";
    img.style.objectFit = "contain";

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100vw";
    container.style.height = "100vh";
    container.style.backgroundColor = "rgba(0, 0, 0, 0.95)";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.zIndex = "9999";
    container.style.cursor = "pointer";
    container.appendChild(img);

    const closeFullscreen = () => {
      document.body.removeChild(container);
    };

    container.addEventListener("click", closeFullscreen);
    document.body.appendChild(container);
  };

  return (
    <section className="p-4">
      {/* Main Preview Area */}
      <div className="flex flex-col">
        {/* Preview Container */}
        <div className="relative w-full rounded-xl overflow-hidden min-h-[400px]">
          {/* Generating State */}
          {isGenerating && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
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
              <Loader2 className="w-8 h-8 text-neutral-400 dark:text-neutral-500 animate-spin mb-4" />
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                Generating image
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                {generationProgress}% complete
              </p>
              <div className="w-48 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Image Display */}
          {!isGenerating && generatedImages.length > 0 && (
            <div className="relative group flex items-center justify-center">
              <img
                src={generatedImages[selectedImageIndex]?.url}
                alt={generatedImages[selectedImageIndex]?.prompt}
                className="max-w-full max-h-[60vh] w-auto h-auto object-contain"
              />
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

          {/* Empty State - only show when not generating and no images */}
          {!isGenerating && generatedImages.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                No images yet
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6">
                Enter a prompt in the left panel and click Generate to create
                your image
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onPromptRestore(
                      "A majestic mountain landscape at sunset with dramatic clouds and golden hour lighting"
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

        {/* IMAGE THUMBNAILS */}
        {generatedImages.length > 1 && (
          <div className="mt-4">
            {/* <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Generated images ({generatedImages.length})
              </p>
            </div> */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {generatedImages.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => onImageSelect(index)}
                  className={cn(
                    "relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                    selectedImageIndex === index
                      ? "border-neutral-900 dark:border-neutral-100 ring-2 ring-neutral-900/20 dark:ring-neutral-100/20"
                      : "border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
                  )}
                >
                  <img
                    src={image.thumbnail}
                    alt={`Output ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* IMAGE ACTION BUTTONS */}
        {generatedImages.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    const currentImage = generatedImages[selectedImageIndex];
                    if (currentImage) {
                      onPromptRestore(currentImage.prompt);
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
                    const currentImage = generatedImages[selectedImageIndex];
                    if (currentImage) {
                      navigator.clipboard.writeText(currentImage.prompt);
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

        {/* IMAGE DETAILS */}
        {generatedImages.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                Prompt
              </p>
              <p className="text-sm text-neutral-900 dark:text-white line-clamp-2">
                {generatedImages[selectedImageIndex]?.prompt}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <Palette className="w-3.5 h-3.5" />
                {generatedImages[selectedImageIndex]?.style}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <Monitor className="w-3.5 h-3.5" />
                {generatedImages[selectedImageIndex]?.resolution}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <Clock className="w-3.5 h-3.5" />
                {generatedImages[selectedImageIndex]?.createdAt
                  ? new Date(
                      generatedImages[selectedImageIndex].createdAt
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
