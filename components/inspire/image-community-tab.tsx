"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, RefreshCw, Heart, User, Users, Loader2 } from "lucide-react";
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

export interface GenerationParamsCallback {
  // Common
  setPrompt: (prompt: string) => void;
  setAspectRatio?: (aspectRatio: string) => void;
  setResolution?: (resolution: string) => void;
  setModel?: (model: any) => void;

  // Image specific
  setStyle?: (style: string) => void;
  setImageCount?: (count: number) => void;
  setReferenceImages?: (images: File[]) => void;

  // Switch to preview tab
  onTabChange: (
    tab: "preview" | "community" | "templates" | "tutorial"
  ) => void;
}

interface ImageCommunityTabProps {
  onPromptSelect: (prompt: string) => void;
  onTabChange: (
    tab: "preview" | "community" | "templates" | "tutorial"
  ) => void;
  onParamsRestore?: GenerationParamsCallback;
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

export function ImageCommunityTab({
  onPromptSelect,
  onTabChange,
  onParamsRestore,
}: ImageCommunityTabProps) {
  const [images, setImages] = useState<CommunityContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState<CommunityContent | null>(
    null
  );
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());
  const [likingImageId, setLikingImageId] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const containerRef = useRef<HTMLDivElement>(null);
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
        setImages((prev) =>
          prev.map((img) =>
            img.id === data.contentId
              ? { ...img, likes: data.likes, isLiked: data.liked }
              : img
          )
        );
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await communityApi.getContent({
          type: "image",
          page: 1,
          limit: 20,
          sort: "recent",
        });
        if (response.success && response.data) {
          const fetchedImages = response.data.content || [];
          setImages(fetchedImages);
          setHasMore(response.data.pagination?.hasNextPage || false);

          // Initialize liked images set from API response
          const liked = new Set<string>();
          fetchedImages.forEach((img) => {
            if (img.isLiked) {
              liked.add(img.id);
            }
          });
          setLikedImages(liked);
        } else {
          console.error("Failed to fetch images:", response);
          setImages([]);
        }
      } catch (error) {
        console.error("Error fetching community images:", error);
        toast({
          title: "Error",
          description: "Failed to load community images. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (page === 1) return;

    const fetchMoreImages = async () => {
      try {
        setLoadingMore(true);
        const response = await communityApi.getContent({
          type: "image",
          page,
          limit: 20,
          sort: "recent",
        });
        if (response.success && response.data) {
          setImages((prev) => [...prev, ...response.data.content]);
          setHasMore(response.data.pagination.hasNextPage);
        }
      } catch (error) {
        console.error("Error fetching more images:", error);
      } finally {
        setLoadingMore(false);
      }
    };

    fetchMoreImages();
  }, [page]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !hasMore || loadingMore) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 300) {
        setPage((prev) => prev + 1);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore]);

  const handleRecreate = async (image: CommunityContent) => {
    try {
      if (onParamsRestore) {
        // Restore prompt
        onParamsRestore.setPrompt(image.prompt);

        // Restore aspect ratio
        if (image.aspectRatio && onParamsRestore.setAspectRatio) {
          onParamsRestore.setAspectRatio(image.aspectRatio);
        }

        // Restore resolution
        if (image.resolution && onParamsRestore.setResolution) {
          onParamsRestore.setResolution(image.resolution);
        }

        // Restore style
        if (image.style && onParamsRestore.setStyle) {
          onParamsRestore.setStyle(image.style);
        }

        // Restore image count
        if (image.imageCount && onParamsRestore.setImageCount) {
          onParamsRestore.setImageCount(image.imageCount);
        }

        // Restore model if available
        if (image.modelId && onParamsRestore.setModel) {
          // Model will be set by fetching the model object
          // The modelId is available for the parent to fetch and set
        }

        // Restore reference images if available
        if (
          image.referenceImageUrls &&
          image.referenceImageUrls.length > 0 &&
          onParamsRestore.setReferenceImages
        ) {
          try {
            const imageFiles = await Promise.all(
              image.referenceImageUrls.map(async (url, index) => {
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
        onPromptSelect(image.prompt);
        onTabChange("preview");
        toast({
          title: "Prompt copied",
          description: "Ready to generate your version",
        });
      }
    } catch (error) {
      // Still allow recreating even if there's an error
      onPromptSelect(image.prompt);
      onTabChange("preview");
    }
  };

  const handleImageClick = async (image: CommunityContent) => {
    try {
      // Fetch full details
      const response = await communityApi.getById(image.id);
      if (response.success && response.data) {
        setSelectedImage(response.data);
      } else {
        setSelectedImage(image);
      }
    } catch (error) {
      // Fallback to basic image data
      setSelectedImage(image);
    }
  };

  const handleLike = async (e: React.MouseEvent, imageId: string) => {
    e.stopPropagation();

    if (likingImageId === imageId) return; // Prevent double clicks

    try {
      setLikingImageId(imageId);
      const response = await communityApi.toggleLike(imageId);

      if (response.success && response.data) {
        const isLiked = response.data.liked;

        // Update local state
        setLikedImages((prev) => {
          const newSet = new Set(prev);
          if (isLiked) {
            newSet.add(imageId);
          } else {
            newSet.delete(imageId);
          }
          return newSet;
        });

        // Update images array
        if (response.data) {
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageId
                ? { ...img, likes: response.data!.likes, isLiked: isLiked }
                : img
            )
          );

          // Update selected image if it's the same
          if (selectedImage?.id === imageId) {
            setSelectedImage((prev) =>
              prev
                ? { ...prev, likes: response.data!.likes, isLiked: isLiked }
                : null
            );
          }
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
      setLikingImageId(null);
    }
  };

  if (loading) {
    return (
      <section className="p-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 text-neutral-400 dark:text-neutral-500 animate-spin mb-3" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Loading community images...
          </p>
        </div>
      </section>
    );
  }

  if (images.length === 0 && !loading) {
    return (
      <section className="p-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
            No community images yet
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6">
            Generate an image and publish it to share with others
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => onTabChange("preview")}
              className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-sm font-medium text-white dark:text-neutral-900 transition-colors"
            >
              Create Image
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
        {/* <div className="mb-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
            Community Images
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Get inspired by what others have created
          </p>
        </div> */}

        <div
          ref={containerRef}
          className="columns-2 lg:columns-3 gap-4 overflow-y-auto max-h-[calc(100vh-12rem)]"
        >
          {images.map((image, index) => {
            // Use aspectRatio from API or randomize for masonry effect
            const aspectRatios = ["1/1", "3/4", "4/5", "9/16", "3/2"];
            const aspectRatio =
              image.aspectRatio?.replace(":", "/") ||
              aspectRatios[index % aspectRatios.length];

            const isLiked = likedImages.has(image.id) || image.isLiked;

            return (
              <div
                key={image.id}
                onClick={() => handleImageClick(image)}
                className="group relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer break-inside-avoid mb-4"
              >
                <div className="relative">
                  <img
                    src={image.thumbnailUrl}
                    alt={image.prompt}
                    className="w-full object-cover"
                    style={{ aspectRatio }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Likes count and heart icon - Top right, centered together */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    {image.likes > 0 && (
                      <span className="text-white text-xs font-medium">
                        {image.likes}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleLike(e, image.id)}
                      disabled={likingImageId === image.id}
                      className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title={isLiked ? "Unlike" : "Like"}
                    >
                      <Heart
                        className={`w-4 h-4 transition-all ${
                          isLiked
                            ? "fill-red-500 text-red-500"
                            : "fill-none text-white"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium line-clamp-2 mb-2">
                    {image.prompt}
                  </p>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {image.author.avatar ? (
                        <img
                          src={image.author.avatar}
                          alt={image.author.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                          <User className="w-3 h-3 text-neutral-600 dark:text-neutral-400" />
                        </div>
                      )}
                      <span className="text-xs text-white/80 font-medium">
                        {image.author.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRecreate(image);
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
          })}
          {loadingMore && (
            <div className="col-span-full flex items-center justify-center py-8">
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                Loading more images...
              </div>
            </div>
          )}
          {!hasMore && images.length > 0 && (
            <div className="col-span-full flex items-center justify-center py-4">
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                No more images to load
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Desktop Dialog */}
      {isDesktop ? (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
            {selectedImage && (
              <ImageDetailContent
                image={selectedImage}
                onRecreate={() => {
                  handleRecreate(selectedImage);
                  setSelectedImage(null);
                }}
                onClose={() => setSelectedImage(null)}
                onLike={handleLike}
                isLiked={
                  likedImages.has(selectedImage.id) || selectedImage.isLiked
                }
                isLiking={likingImageId === selectedImage.id}
              />
            )}
          </DialogContent>
        </Dialog>
      ) : (
        /* Mobile/Tablet Drawer */
        <Drawer
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DrawerContent className="max-h-[90vh] overflow-hidden flex flex-col">
            {selectedImage && (
              <ImageDetailContent
                image={selectedImage}
                onRecreate={() => {
                  handleRecreate(selectedImage);
                  setSelectedImage(null);
                }}
                onClose={() => setSelectedImage(null)}
                onLike={handleLike}
                isLiked={
                  likedImages.has(selectedImage.id) || selectedImage.isLiked
                }
                isLiking={likingImageId === selectedImage.id}
              />
            )}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

function ImageDetailContent({
  image,
  onRecreate,
  onClose,
  onLike,
  isLiked,
  isLiking,
}: {
  image: CommunityContent;
  onRecreate: () => void;
  onClose: () => void;
  onLike?: (e: React.MouseEvent, imageId: string) => void;
  isLiked?: boolean;
  isLiking?: boolean;
}) {
  return (
    <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
      <DialogHeader className="px-6 pt-6 pb-4 shrink-0 border-b">
        <DialogTitle className="text-xl font-semibold">
          Image Details
        </DialogTitle>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {/* Image Preview */}
        <div className="relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <img
            src={image.mediaUrl}
            alt={image.prompt}
            className="w-full h-auto object-contain max-h-[50vh]"
          />
        </div>

        {/* Prompt */}
        <div>
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
            Prompt
          </h3>
          <p className="text-sm text-neutral-900 dark:text-white">
            {image.prompt}
          </p>
        </div>

        {/* Creator Info */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900">
          {image.author.avatar ? (
            <img
              src={image.author.avatar}
              alt={image.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
              <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {image.author.name}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Creator
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          {onLike ? (
            <button
              type="button"
              onClick={(e) => onLike(e, image.id)}
              disabled={isLiking}
              className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              <span>{image.likes}</span>
              <Heart
                className={`w-4 h-4 transition-all ${
                  isLiked || image.isLiked
                    ? "fill-red-500 text-red-500"
                    : "fill-none"
                }`}
              />
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <span>{image.likes}</span>
              <Heart className="w-4 h-4" />
            </div>
          )}
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
              navigator.clipboard.writeText(image.prompt);
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
