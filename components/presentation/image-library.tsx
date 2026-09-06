"use client";

import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import {
  CircleFadingArrowUp,
  Download,
  ExternalLink,
  Image as ImageIcon,
  ImagePlus,
  Loader2,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface ImageItem {
  id: string;
  url: string;
  thumbnail?: string;
  name?: string;
  source: "upload" | "unsplash" | "pexels" | "ai";
  width?: number;
  height?: number;
  author?: string;
  authorUrl?: string;
  serverId?: string; // Server file ID for uploaded images
}

interface ImageLibraryProps {
  onInsertImage: (imageUrl: string, imageData: ImageItem) => void;
  onClose?: () => void;
  showHeader?: boolean;
}

const IMAGES_PER_PAGE = 20;

// Generic/popular image categories to show by default
const DEFAULT_CATEGORIES = [
  "nature",
  "business",
  "technology",
  "people",
  "abstract",
  "city",
  "landscape",
  "office",
  "team",
  "success",
];

export function ImageLibrary({
  onInsertImage,
  onClose,
  showHeader = true,
}: ImageLibraryProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "library" | "generate">(
    "library"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedImages, setDisplayedImages] = useState<ImageItem[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ImageItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load generic images on mount
  useEffect(() => {
    if (activeTab === "library" && !searchQuery.trim()) {
      loadGenericImages();
    }
  }, [activeTab]);

  // Load generic images from multiple categories
  const loadGenericImages = useCallback(async () => {
    setIsSearching(true);
    try {
      const images: ImageItem[] = [];
      const categories = DEFAULT_CATEGORIES.slice(0, 5); // Show 5 categories

      categories.forEach((category, catIndex) => {
        for (let i = 0; i < 4; i++) {
          images.push({
            id: `generic-${category}-${i}`,
            url: `https://source.unsplash.com/800x600/?${category}&sig=${catIndex * 4 + i}`,
            thumbnail: `https://source.unsplash.com/400x300/?${category}&sig=${catIndex * 4 + i}`,
            name: `${category.charAt(0).toUpperCase() + category.slice(1)} Image ${i + 1}`,
            source: "unsplash",
            width: 800,
            height: 600,
          });
        }
      });

      setDisplayedImages(images);
      setHasMore(false);
    } catch (error) {
      console.error("Error loading generic images:", error);
      setDisplayedImages([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Load uploaded images from server
  const loadUploadedImages = useCallback(async () => {
    try {
      const response = await apiResponse.get("/presentation/files", {
        withCredentials: true,
      });

      if (response.data?.files) {
        const images: ImageItem[] = response.data.files.map((file: any) => ({
          id: file._id || file.id,
          url: file.url || file.path,
          thumbnail: file.thumbnail || file.url || file.path,
          name: file.originalName || file.name,
          source: "upload" as const,
          serverId: file._id || file.id,
        }));
        setUploadedImages(images);
      }
    } catch (error) {
      console.error("Error loading uploaded images:", error);
      // Fallback to localStorage
      const saved = localStorage.getItem("presentation-uploaded-images");
      if (saved) {
        try {
          setUploadedImages(JSON.parse(saved));
        } catch (e) {
          console.error("Error loading from localStorage:", e);
        }
      }
    }
  }, []);

  // Load uploaded images on mount
  useEffect(() => {
    loadUploadedImages();
  }, [loadUploadedImages]);

  // Search Unsplash images
  const searchUnsplash = useCallback(
    async (query: string, page: number = 1) => {
      try {
        const images: ImageItem[] = [];
        for (let i = 0; i < IMAGES_PER_PAGE; i++) {
          images.push({
            id: `unsplash-${Date.now()}-${i}-${page}`,
            url: `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}&sig=${i + page * IMAGES_PER_PAGE}`,
            thumbnail: `https://source.unsplash.com/400x300/?${encodeURIComponent(query)}&sig=${i + page * IMAGES_PER_PAGE}`,
            name: `${query} - Image ${i + 1}`,
            source: "unsplash",
            width: 800,
            height: 600,
          });
        }
        return images;
      } catch (error) {
        console.error("Error searching Unsplash:", error);
        return [];
      }
    },
    []
  );

  // Search Pexels images
  const searchPexels = useCallback(async (query: string, page: number = 1) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
      if (!apiKey) return [];

      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${IMAGES_PER_PAGE}&page=${page}`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return (
          data.photos?.map((photo: any) => ({
            id: `pexels-${photo.id}`,
            url: photo.src.large,
            thumbnail: photo.src.medium,
            name: photo.photographer,
            source: "pexels" as const,
            width: photo.width,
            height: photo.height,
            author: photo.photographer,
            authorUrl: photo.photographer_url,
          })) || []
        );
      }
      return [];
    } catch (error) {
      console.error("Error searching Pexels:", error);
      return [];
    }
  }, []);

  // Search images from APIs
  useEffect(() => {
    if (activeTab !== "library") {
      return;
    }

    if (!searchQuery.trim()) {
      loadGenericImages();
      return;
    }

    const searchImages = async () => {
      setIsSearching(true);
      try {
        const [unsplashResults, pexelsResults] = await Promise.all([
          searchUnsplash(searchQuery, currentPage),
          searchPexels(searchQuery, currentPage),
        ]);

        const allResults = [...unsplashResults, ...pexelsResults];
        setDisplayedImages((prev) =>
          currentPage === 1 ? allResults : [...prev, ...allResults]
        );
        setHasMore(allResults.length >= IMAGES_PER_PAGE);
      } catch (error) {
        console.error("Error searching images:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchImages, 500);
    return () => clearTimeout(timeoutId);
  }, [
    searchQuery,
    currentPage,
    activeTab,
    searchUnsplash,
    searchPexels,
    loadGenericImages,
  ]);

  // Handle file upload to server
  const handleFileUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      setIsUploading(true);
      const newImages: ImageItem[] = [];

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (!file.type.startsWith("image/")) continue;

          const formData = new FormData();
          formData.append("file", file);
          formData.append("type", "presentation");

          try {
            const response = await apiResponse.post(
              "/presentation/upload",
              formData,
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            if (response.data?.url || response.data?.file) {
              const fileData = response.data.file || response.data;
              const imageItem: ImageItem = {
                id: fileData._id || fileData.id || `upload-${Date.now()}-${i}`,
                url: fileData.url || response.data.url,
                thumbnail:
                  fileData.thumbnail || fileData.url || response.data.url,
                name: fileData.originalName || file.name,
                source: "upload",
                serverId: fileData._id || fileData.id,
              };
              newImages.push(imageItem);
            }
          } catch (error: any) {
            console.error("Error uploading file:", error);
            // Fallback to data URL for preview
            const reader = new FileReader();
            const dataUrl = await new Promise<string>((resolve, reject) => {
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });

            const imageItem: ImageItem = {
              id: `upload-${Date.now()}-${i}`,
              url: dataUrl,
              thumbnail: dataUrl,
              name: file.name,
              source: "upload",
            };
            newImages.push(imageItem);
          }
        }

        if (newImages.length > 0) {
          const updated = [...uploadedImages, ...newImages];
          setUploadedImages(updated);
          // Save to localStorage as backup
          localStorage.setItem(
            "presentation-uploaded-images",
            JSON.stringify(updated)
          );
          setActiveTab("upload");
          toast({
            title: "Upload Successful",
            description: `${newImages.length} image(s) uploaded successfully`,
          });
        }
      } catch (error) {
        console.error("Error processing files:", error);
        toast({
          title: "Upload Error",
          description: "Failed to upload some images",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [uploadedImages, toast]
  );

  // Generate AI image
  const handleGenerateImage = useCallback(async () => {
    if (!generatePrompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await apiResponse.post(
        "/presentation/generate-image",
        {
          prompt: generatePrompt,
          aspectRatio: "16:9",
        },
        { withCredentials: true }
      );

      if (response.data?.url || response.data?.imageUrl) {
        const imageUrl = response.data.url || response.data.imageUrl;
        const imageItem: ImageItem = {
          id: `ai-${Date.now()}`,
          url: imageUrl,
          thumbnail: imageUrl,
          name: `AI Generated: ${generatePrompt.substring(0, 30)}...`,
          source: "ai",
        };

        const updated = [...uploadedImages, imageItem];
        setUploadedImages(updated);
        localStorage.setItem(
          "presentation-uploaded-images",
          JSON.stringify(updated)
        );
        setGeneratePrompt("");
        setActiveTab("upload");
        setSelectedImage(imageItem);
        toast({
          title: "Image Generated",
          description: "AI image has been generated successfully",
        });
      }
    } catch (error: any) {
      console.error("Error generating image:", error);
      if (error.response?.status === 404) {
        toast({
          title: "Not Available",
          description: "AI image generation endpoint needs to be configured",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Generation Failed",
          description: "Failed to generate image. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsGenerating(false);
    }
  }, [generatePrompt, uploadedImages, toast]);

  // Delete uploaded image
  const handleDeleteImage = useCallback(
    async (imageId: string, serverId?: string) => {
      try {
        if (serverId) {
          await apiResponse.delete(`/presentation/files/${serverId}`, {
            withCredentials: true,
          });
        }

        const updated = uploadedImages.filter((img) => img.id !== imageId);
        setUploadedImages(updated);
        localStorage.setItem(
          "presentation-uploaded-images",
          JSON.stringify(updated)
        );

        if (selectedImage?.id === imageId) {
          setSelectedImage(null);
        }

        toast({
          title: "Image Deleted",
          description: "Image has been removed",
        });
      } catch (error) {
        console.error("Error deleting image:", error);
        // Still remove from local state
        const updated = uploadedImages.filter((img) => img.id !== imageId);
        setUploadedImages(updated);
        localStorage.setItem(
          "presentation-uploaded-images",
          JSON.stringify(updated)
        );
      }
    },
    [uploadedImages, selectedImage, toast]
  );

  // Handle scroll for pagination
  useEffect(() => {
    if (activeTab !== "library" || !searchQuery.trim()) return;

    const scrollElement =
      scrollAreaRef.current?.closest("[data-radix-scroll-area-viewport]") ||
      scrollAreaRef.current?.parentElement?.querySelector(
        "[data-radix-scroll-area-viewport]"
      );

    if (!scrollElement) return;

    const handleScroll = () => {
      const target = scrollElement as HTMLElement;
      const scrollBottom =
        target.scrollHeight - target.scrollTop - target.clientHeight;

      if (scrollBottom < 200 && hasMore && !isSearching) {
        setCurrentPage((prev) => prev + 1);
      }
    };

    scrollElement.addEventListener("scroll", handleScroll);
    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [activeTab, hasMore, isSearching, searchQuery]);

  const currentImages = useMemo(() => {
    if (activeTab === "upload") return uploadedImages;
    if (activeTab === "library") return displayedImages;
    return [];
  }, [activeTab, uploadedImages, displayedImages]);

  return (
    <div className='flex h-full max-h-[600px] flex-col'>
      {/* Header */}
      {showHeader && (
        <div className='flex-shrink-0 p-2 pb-0'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 dark:bg-blue-500/10'>
                <ImageIcon className='h-5 w-5 text-blue-500 dark:text-blue-400' />
              </div>
              <div>
                <h3 className='text-foreground text-sm font-semibold'>
                  <LocalizedText text={"Image Library"} />
                </h3>
                <p className='text-muted-foreground text-xs'>
                  {activeTab === "upload"
                    ? `${uploadedImages.length} uploaded`
                    : activeTab === "library"
                      ? searchQuery.trim()
                        ? "Search results"
                        : "Popular images"
                      : "Generate with AI"}
                </p>
              </div>
            </div>
            {onClose && (
              <Button
                variant='ghost'
                size='sm'
                onClick={onClose}
                className='hover:bg-muted text-muted-foreground hover:text-foreground h-6 w-6 p-0'
              >
                <X className='h-3 w-3' />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className='flex-shrink-0 px-2 pb-0'>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='upload' className='text-xs'>
              <Upload className='mr-1 h-3 w-3' />
              <LocalizedText text={"Uploads"} />
            </TabsTrigger>
            <TabsTrigger value='library' className='text-xs'>
              <ImageIcon className='mr-1 h-3 w-3' />
              <LocalizedText text={"Library"} />
            </TabsTrigger>
            <TabsTrigger value='generate' className='text-xs'>
              <Sparkles className='mr-1 h-3 w-3' />
              <LocalizedText text={"Generate"} />
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value='upload' className='mt-4 space-y-4'>
            <div>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                multiple
                className='hidden'
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className='w-full'
                variant='outline'
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <LoadingFileLoader size={20} />
                    <LocalizedText text={"Uploading..."} />
                  </>
                ) : (
                  <>
                    <Upload className='mr-2 h-4 w-4' />
                    <LocalizedText text={"Upload Images"} />
                  </>
                )}
              </Button>
            </div>
            {uploadedImages.length === 0 && (
              <div className='text-muted-foreground py-8 text-center text-sm'>
                <ImagePlus className='mx-auto mb-2 h-8 w-8 opacity-50' />
                <p>
                  <LocalizedText text={"No uploaded images"} />
                </p>
                <p className='mt-1 text-xs'>
                  <LocalizedText
                    text={'Click "Upload Images" to get started'}
                  />
                </p>
              </div>
            )}
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value='library' className='mt-4'>
            <div className='relative mb-4'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input
                type='text'
                placeholder='Search free images (nature, business, tech...)'
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                  setDisplayedImages([]);
                }}
                className='h-9 pl-9 text-sm'
              />
              {isSearching && <LoadingFileLoader size={20} />}
            </div>
            {!searchQuery.trim() && (
              <div className='text-muted-foreground mb-2 text-xs'>
                <LocalizedText
                  text={
                    "Showing popular images. Search for specific images above."
                  }
                />
              </div>
            )}
          </TabsContent>

          {/* Generate Tab */}
          <TabsContent value='generate' className='mt-4 space-y-4'>
            <div>
              <label className='text-foreground mb-2 block text-xs font-medium'>
                <LocalizedText
                  text={"Describe the image you want to generate"}
                />
              </label>
              <Textarea
                value={generatePrompt}
                onChange={(e) => setGeneratePrompt(e.target.value)}
                placeholder='e.g., A futuristic cityscape at sunset with flying cars...'
                className='min-h-[100px] text-sm'
              />
            </div>
            <Button
              onClick={handleGenerateImage}
              disabled={!generatePrompt.trim() || isGenerating}
              className='w-full'
            >
              {isGenerating ? (
                <>
                  <LoadingFileLoader size={20} />
                  <LocalizedText text={"Generating..."} />
                </>
              ) : (
                <>
                  <Sparkles className='mr-2 h-4 w-4' />
                  <LocalizedText text={"Generate Image"} />
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* Images Grid */}
      {(activeTab === "upload" || activeTab === "library") && (
        <div
          className='min-h-0 flex-1 overflow-hidden px-1'
          style={{ maxHeight: "400px" }}
        >
          <ScrollArea className='h-full'>
            <div ref={scrollAreaRef}>
              {isSearching && currentImages.length === 0 ? (
                <div className='flex h-32 items-center justify-center'>
                  <LoadingFileLoader size={20} />
                </div>
              ) : currentImages.length === 0 ? (
                <div className='flex h-32 flex-col items-center justify-center'>
                  <ImageIcon className='text-muted-foreground mb-2 h-8 w-8 opacity-50' />
                  <p className='text-muted-foreground text-sm'>
                    {activeTab === "upload"
                      ? "No images uploaded yet"
                      : "No images found. Try a different search term."}
                  </p>
                </div>
              ) : (
                <div className='grid grid-cols-2 gap-3 pb-4'>
                  {currentImages.map((image) => (
                    <div
                      key={image.id}
                      className={cn(
                        "group relative aspect-video cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
                        selectedImage?.id === image.id
                          ? "border-blue-500 ring-2 ring-blue-500/20"
                          : "border-border hover:border-blue-500/50"
                      )}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image.thumbnail || image.url}
                        alt={image.name || "Image"}
                        className='h-full w-full object-cover'
                        loading='lazy'
                        onError={(e) => {
                          e.currentTarget.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      {activeTab === "upload" && (
                        <Button
                          variant='ghost'
                          size='sm'
                          className='bg-destructive/80 hover:bg-destructive absolute top-1 right-1 h-6 w-6 p-0 text-white opacity-0 transition-opacity group-hover:opacity-100'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image.id, image.serverId);
                          }}
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      )}
                      {image.author && (
                        <div className='absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100'>
                          <p className='truncate text-xs text-white'>
                            <LocalizedText text={"Photo by"} />
                            {image.author}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Selected Image Actions */}
      {selectedImage && (
        <div className='border-border flex-shrink-0 border-t p-4 pt-0'>
          <div className='flex items-center gap-2'>
            <Button
              onClick={() => {
                onInsertImage(selectedImage.url, selectedImage);
                setSelectedImage(null);
              }}
              className='flex-1'
              size='sm'
            >
              <Download className='mr-2 h-4 w-4' />
              <LocalizedText text={"Insert Image"} />
            </Button>
            {selectedImage.authorUrl && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => window.open(selectedImage.authorUrl, "_blank")}
              >
                <ExternalLink className='h-4 w-4' />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
