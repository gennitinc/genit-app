"use client";

import { LocalizedText } from "@/components/localized-text";
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
import { useUserContext } from "@/context/AuthenticatedContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CommunityContent } from "@/types/inspire";
import GridLoading from "@/utils/girdLoading";
import { communityApi } from "@/utils/inspire-api";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Eye,
  Heart,
  Loader2,
  RefreshCw,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Socket, io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

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
  const { user } = useUserContext();
  const router = useRouter();
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
  const [isCommunityPage, setIsCommunityPage] = useState(false);

  const pathname = usePathname();

  // Initialize socket connection
  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
      {
        transports: ["websocket", "polling"],
      }
    );

    socketRef.current = socket;

    socket.on("connect", () => {});

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

    if (pathname === "/community" || pathname === "/chat") {
      setIsCommunityPage(true);
    } else {
      setIsCommunityPage(false);
    }

    fetchImages();
  }, [pathname]);

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
    if (!hasMore || loadingMore) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollHeight - scrollTop - clientHeight < 300) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore]);

  const handleRecreate = async (image: CommunityContent) => {
    // Check if user is authenticated
    if (!user) {
      router.push("/signin");
      return;
    }

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
        // Store recreate data in localStorage for navigation
        const recreateData = {
          type: "image",
          prompt: image.prompt,
          aspectRatio: image.aspectRatio,
          resolution: image.resolution,
          style: image.style,
          imageCount: image.imageCount,
          modelId: image.modelId,
          referenceImageUrls: image.referenceImageUrls || [],
        };
        localStorage.setItem("recreateData", JSON.stringify(recreateData));

        // Navigate to create page
        onPromptSelect(image.prompt);
        onTabChange("preview");
        toast({
          title: "Settings saved",
          description: "All parameters will be restored on the create page",
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

    // Check if user is authenticated
    if (!user) {
      router.push("/signin");
      return;
    }

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
    return <GridLoading />;
  }

  if (images.length === 0 && !loading) {
    return (
      <section className='p-4'>
        <div className='flex min-h-[60vh] flex-col items-center justify-center text-center'>
          <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800'>
            <Users className='h-8 w-8 text-neutral-400 dark:text-neutral-500' />
          </div>
          <h3 className='mb-2 text-lg font-semibold text-neutral-900 dark:text-white'>
            <LocalizedText text={"No community images yet"} />
          </h3>
          <p className='mb-6 max-w-sm text-sm text-neutral-500 dark:text-neutral-400'>
            <LocalizedText
              text={"Generate an image and publish it to share with others"}
            />
          </p>
          <div className='flex flex-col gap-3 sm:flex-row'>
            <button
              type='button'
              onClick={() => onTabChange("preview")}
              className='rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200'
            >
              <LocalizedText text={"Create Image"} />
            </button>
            <button
              type='button'
              onClick={() => onTabChange("templates")}
              className='rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
            >
              <LocalizedText text={"Browse Templates"} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className='p-4 px-0'>
        <div
          ref={containerRef}
          className={cn(
            "columns-2 gap-4 lg:columns-4",
            isCommunityPage ? "md:columns-3 lg:columns-4" : ""
          )}
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
                className='group relative mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800'
              >
                <div className='relative'>
                  <img
                    src={image.thumbnailUrl}
                    alt={image.prompt}
                    className='w-full object-cover'
                    style={{ aspectRatio }}
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100' />

                  {/* Likes count and heart icon - Top right, centered together */}
                  <div className='absolute top-3 right-3 z-10 flex items-center gap-1.5'>
                    {image.likes > 0 && (
                      <span className='text-xs font-medium text-white'>
                        {image.likes}
                      </span>
                    )}
                    <button
                      type='button'
                      onClick={(e) => handleLike(e, image.id)}
                      disabled={likingImageId === image.id}
                      className='flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-50'
                      title={isLiked ? "Unlike" : "Like"}
                    >
                      <Heart
                        className={`h-4 w-4 transition-all ${
                          isLiked
                            ? "fill-red-500 text-red-500"
                            : "fill-none text-white"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className='absolute right-0 bottom-0 left-0 p-3 opacity-0 transition-opacity group-hover:opacity-100'>
                  <div className='mb-2 hidden'>
                    <p className='line-clamp-2 text-sm font-medium text-white'>
                      {image.prompt}
                    </p>
                  </div>
                  <div className='flex gap-2 lg:flex-col'>
                    <Link
                      href={`/creator/${image.author.name}`}
                      onClick={(e) => e.stopPropagation()}
                      className='flex w-fit items-center gap-2 transition-opacity hover:opacity-80'
                    >
                      {image.author.avatar ? (
                        <img
                          src={image.author.avatar}
                          alt={image.author.name}
                          className='h-5 w-5 rounded-full object-cover'
                        />
                      ) : (
                        <div className='flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700'>
                          <User className='h-3 w-3 text-neutral-600 dark:text-neutral-400' />
                        </div>
                      )}
                      <span className='text-xs font-medium text-white/80'>
                        {image.author.name}
                      </span>
                      {image.author.isVerified && (
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
                        handleRecreate(image);
                      }}
                      className='flex w-fit items-center gap-1 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-cyan-600'
                    >
                      <RefreshCw className='h-3 w-3' />
                      <span className='hidden md:block'>
                        <LocalizedText text={"Recreate"} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {loadingMore && (
            <div className='col-span-full flex items-center justify-center py-8'>
              <div className='text-sm text-neutral-500 dark:text-neutral-400'>
                <LocalizedText text={"Loading more images..."} />
              </div>
            </div>
          )}
          {!hasMore && images.length > 0 && (
            <div className='col-span-full flex items-center justify-center py-4'>
              <div className='text-sm text-neutral-500 dark:text-neutral-400'>
                <LocalizedText text={"No more images to load"} />
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
          <DialogContent className='flex max-h-[90vh] max-w-2xl flex-col overflow-hidden p-0'>
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
          <DrawerContent className='flex max-h-[90vh] flex-col overflow-hidden'>
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
  const [copied, setCopied] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);

  return (
    <div className='flex h-full max-h-[90vh] flex-col overflow-hidden'>
      <div className='min-h-0 flex-1 overflow-y-auto'>
        {/* Image Preview */}
        <div className='relative w-full bg-neutral-100 dark:bg-neutral-800'>
          <img
            src={image.mediaUrl}
            alt={image.prompt}
            className='h-auto w-full object-contain'
          />
        </div>

        <div className='space-y-4 px-6 py-4'>
          {/* Prompt */}
          <div>
            <h3 className='mb-1 text-sm font-medium text-neutral-500 dark:text-neutral-400'>
              <LocalizedText text={"Prompt"} />
            </h3>
            <div>
              <p
                className={`text-sm text-neutral-900 dark:text-white ${
                  !showFullPrompt ? "line-clamp-2" : ""
                }`}
              >
                {image.prompt}
              </p>
              {(image.prompt.split("\n").length > 2 ||
                (image.prompt.length > 200 && !showFullPrompt)) && (
                <button
                  type='button'
                  onClick={() => setShowFullPrompt(!showFullPrompt)}
                  className='mt-1 flex items-center gap-1 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                >
                  {showFullPrompt ? (
                    <>
                      <LocalizedText text={"View less"} />
                      <ChevronUp className='h-3 w-3' />
                    </>
                  ) : (
                    <>
                      <LocalizedText text={"View more"} />
                      <ChevronDown className='h-3 w-3' />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Creator Info */}
          <Link
            href={`/creator/${image.author.name}`}
            className='flex items-center gap-3 rounded-lg bg-neutral-50 p-3 transition-colors hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800'
          >
            {image.author.avatar ? (
              <img
                src={image.author.avatar}
                alt={image.author.name}
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
                  {image.author.name}
                </p>
                {image.author.isVerified && (
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
                <LocalizedText text={"Creator"} />
              </p>
            </div>
          </Link>

          {/* Stats */}
          <div className='flex items-center gap-4'>
            {onLike ? (
              <button
                type='button'
                onClick={(e) => onLike(e, image.id)}
                disabled={isLiking}
                className='flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-red-500 disabled:opacity-50 dark:text-neutral-400'
              >
                <span>{image.likes}</span>
                <Heart
                  className={`h-4 w-4 transition-all ${
                    isLiked || image.isLiked
                      ? "fill-red-500 text-red-500"
                      : "fill-none"
                  }`}
                />
              </button>
            ) : (
              <div className='flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400'>
                <span>{image.likes}</span>
                <Heart className='h-4 w-4' />
              </div>
            )}
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
            <LocalizedText text={"Recreate"} />
          </button>
          <button
            type='button'
            onClick={() => {
              navigator.clipboard.writeText(image.prompt);
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
                const url = image.mediaUrl || image.thumbnailUrl;
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
                link.download = `genit-${image.id}.jpg`;
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
