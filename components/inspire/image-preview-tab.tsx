"use client";

import { LocalizedText } from "@/components/localized-text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/types/inspire";
import { LoadingFileLoader } from "@/utils/Loading";
import { communityApi } from "@/utils/inspire-api";
import {
  Clock,
  Copy,
  Download,
  ImageIcon,
  Loader2,
  Maximize2,
  Monitor,
  Palette,
  RefreshCw,
  Share2,
  Upload,
  Wand2,
} from "lucide-react";
import { useEffect, useState } from "react";

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
  referenceImageUrls?: string[]; // Reference images for style/context
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
  const [publishedImageIds, setPublishedImageIds] = useState<Set<string>>(
    new Set()
  );
  const [publishedContentMap, setPublishedContentMap] = useState<
    Map<string, string>
  >(new Map()); // Map of generatedImageId -> communityContentId
  const [checkingPublished, setCheckingPublished] = useState(false);

  // Check if images have been published on mount and when selected image changes
  useEffect(() => {
    const checkPublishedStatus = async () => {
      if (generatedImages.length === 0) return;

      try {
        setCheckingPublished(true);
        // Fetch user's own community content to check for published images
        const response = await communityApi.getUserContent("image", 1, 100);

        if (response.success && response.data?.content) {
          const publishedIds = new Set<string>();
          const contentMap = new Map<string, string>();
          response.data.content.forEach((content: any) => {
            if (content.generatedImageId) {
              publishedIds.add(content.generatedImageId);
              contentMap.set(content.generatedImageId, content.id);
            }
          });
          setPublishedImageIds(publishedIds);
          setPublishedContentMap(contentMap);
        }
      } catch (error) {
        console.error("Error checking published status:", error);
      } finally {
        setCheckingPublished(false);
      }
    };

    checkPublishedStatus();
  }, [generatedImages.length]); // Re-check when images change

  // Get current image
  const currentImage = generatedImages[selectedImageIndex];

  // Check if current image is published
  const isPublished = Boolean(
    currentImage?.generatedImageId &&
    publishedImageIds.has(currentImage.generatedImageId)
  );

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

    // If already published, unpublish it
    if (
      currentImage.generatedImageId &&
      publishedImageIds.has(currentImage.generatedImageId)
    ) {
      const communityContentId = publishedContentMap.get(
        currentImage.generatedImageId
      );
      if (communityContentId) {
        try {
          setPublishing(true);
          await communityApi.delete(communityContentId);
          setPublishedImageIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(currentImage.generatedImageId!);
            return newSet;
          });
          setPublishedContentMap((prev) => {
            const newMap = new Map(prev);
            newMap.delete(currentImage.generatedImageId!);
            return newMap;
          });
          toast({
            title: "Unpublished",
            description: "Image has been removed from the community",
          });
        } catch (error: any) {
          console.error("Error unpublishing image:", error);
          toast({
            title: "Unpublish failed",
            description:
              error?.response?.data?.message ||
              error?.message ||
              "Failed to unpublish image. Please try again.",
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

      // Use aspect ratio from image object if available, otherwise use selected aspect ratio
      const aspectRatio = currentImage.aspectRatio || selectedAspectRatio;

      const response = await communityApi.submit({
        contentType: "image",
        generatedImageId: currentImage.generatedImageId || currentImage.id, // Use generatedImageId if available
        prompt: currentImage.prompt,
        thumbnailUrl: currentImage.thumbnail || currentImage.url,
        mediaUrl: currentImage.url,
        aspectRatio,
        style: currentImage.style,
        resolution: currentImage.resolution,
        referenceImageUrls: currentImage.referenceImageUrls || [],
        isPublic: true,
      });

      // Update published status
      if (currentImage.generatedImageId && response.data?.id) {
        setPublishedImageIds((prev) =>
          new Set(prev).add(currentImage.generatedImageId!)
        );
        setPublishedContentMap((prev) =>
          new Map(prev).set(currentImage.generatedImageId!, response.data.id)
        );
      }

      toast({
        title: "Post published",
        description: "Your image has been published to the community",
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
              <LoadingFileLoader size={16} />
              <h3 className='mb-2 text-base font-semibold text-neutral-900 dark:text-white'>
                <LocalizedText text={"Generating image"} />
              </h3>
              <p className='mb-4 text-sm text-neutral-500 dark:text-neutral-400'>
                {generationProgress}
                <LocalizedText text={"% complete"} />
              </p>
              <div className='h-1 w-48 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700'>
                <div
                  className='h-full rounded-full bg-neutral-900 transition-all duration-300 dark:bg-neutral-100'
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Image Display */}
          {!isGenerating && generatedImages.length > 0 && (
            <div className='group relative flex items-center justify-center'>
              <img
                src={generatedImages[selectedImageIndex]?.url}
                alt={generatedImages[selectedImageIndex]?.prompt}
                className='h-auto max-h-[60vh] w-auto max-w-full object-contain'
              />
              <div className='absolute top-3 right-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
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

          {/* Empty State - only show when not generating and no images */}
          {!isGenerating && generatedImages.length === 0 && (
            <div className='absolute inset-0 flex flex-col items-center justify-center p-8 text-center'>
              <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800'>
                <ImageIcon className='h-8 w-8 text-neutral-400 dark:text-neutral-500' />
              </div>
              <h3 className='mb-2 text-lg font-semibold text-neutral-900 dark:text-white'>
                <LocalizedText text={"No images yet"} />
              </h3>
              <p className='mb-6 max-w-sm text-sm text-neutral-500 dark:text-neutral-400'>
                <LocalizedText
                  text={
                    "Enter a prompt in the left panel and click Generate to create your image"
                  }
                />
              </p>
              <div className='flex flex-col gap-3 sm:flex-row'>
                <button
                  type='button'
                  onClick={() =>
                    onPromptRestore(
                      "A majestic mountain landscape at sunset with dramatic clouds and golden hour lighting"
                    )
                  }
                  className='rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                >
                  <LocalizedText text={"Try Example Prompt"} />
                </button>
                {onTabChange && (
                  <button
                    type='button'
                    onClick={() => onTabChange("templates")}
                    className='rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200'
                  >
                    <LocalizedText text={"Browse Templates"} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* IMAGE THUMBNAILS */}
        {generatedImages.length > 1 && (
          <div className='mt-4'>
            {/* <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Generated images ({generatedImages.length})
              </p>
            </div> */}
            <div className='flex gap-2 overflow-x-auto pb-2'>
              {generatedImages.map((image, index) => (
                <button
                  key={image.id}
                  type='button'
                  onClick={() => onImageSelect(index)}
                  className={cn(
                    "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                    selectedImageIndex === index
                      ? "border-neutral-900 ring-2 ring-neutral-900/20 dark:border-neutral-100 dark:ring-neutral-100/20"
                      : "border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
                  )}
                >
                  <img
                    src={image.thumbnail}
                    alt={`Output ${index + 1}`}
                    className='h-full w-full object-cover'
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* IMAGE ACTION BUTTONS */}
        {generatedImages.length > 0 && (
          <div className='mt-4 flex flex-wrap items-center gap-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type='button'
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
                  className='flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                >
                  <RefreshCw className='h-4 w-4' />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  <LocalizedText text={"Recreate"} />
                </p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type='button'
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
                  className='flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                >
                  <Copy className='h-4 w-4' />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  <LocalizedText text={"Copy prompt"} />
                </p>
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
                <p>
                  <LocalizedText text={"Download"} />
                </p>
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
                <p>
                  <LocalizedText text={"Share"} />
                </p>
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
                  <LoadingFileLoader size={16} />
                  <LocalizedText text={"Publishing..."} />
                </>
              ) : isPublished ? (
                <>
                  <Upload className='h-4 w-4' />
                  <LocalizedText text={"Published"} />
                </>
              ) : (
                <>
                  <Upload className='h-4 w-4' />
                  <LocalizedText text={"Publish"} />
                </>
              )}
            </button>
          </div>
        )}

        {/* IMAGE DETAILS */}
        {generatedImages.length > 0 && (
          <div className='mt-4 rounded-xl border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-700 dark:bg-neutral-800'>
            <div className='min-w-0 flex-1'>
              <p className='mb-1 text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400'>
                <LocalizedText text={"Prompt"} />
              </p>
              <p className='line-clamp-2 text-sm text-neutral-900 dark:text-white'>
                {generatedImages[selectedImageIndex]?.prompt}
              </p>
            </div>
            <div className='mt-3 flex flex-wrap gap-3 border-t border-neutral-200 pt-3 dark:border-neutral-700'>
              <div className='flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400'>
                <Palette className='h-3.5 w-3.5' />
                {generatedImages[selectedImageIndex]?.style}
              </div>
              <div className='flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400'>
                <Monitor className='h-3.5 w-3.5' />
                {generatedImages[selectedImageIndex]?.resolution}
              </div>
              <div className='flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400'>
                <Clock className='h-3.5 w-3.5' />
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
