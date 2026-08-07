"use client";

import { GenerationParamsCallback } from "./image-community-tab";
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
import { toast } from "@/hooks/use-toast";
import { ImageGenTemplate, ImageGenTemplateGroup } from "@/types/inspire";
import { LoadingFileLoader } from "@/utils/Loading";
import { imageGenTemplatesApi } from "@/utils/inspire-api";
import { IconTemplate } from "@tabler/icons-react";
import { ChevronRight, Loader2 } from "lucide-react";
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

interface ImageTemplatesTabProps {
  onPromptSelect: (prompt: string) => void;
  onTabChange: (tab: "preview") => void;
  onParamsRestore?: GenerationParamsCallback;
}

function CategoryTemplatesList({
  templates,
  loading,
  hasMore,
  onLoadMore,
  onTemplateClick,
}: {
  templates: ImageGenTemplate[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onTemplateClick: (template: ImageGenTemplate) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      if (
        scrollHeight - scrollTop - clientHeight < 100 &&
        hasMore &&
        !loading
      ) {
        onLoadMore();
      }
    };

    scrollElement.addEventListener("scroll", handleScroll);
    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, onLoadMore]);

  if (templates.length === 0 && !loading) {
    return (
      <div className='flex min-h-[50vh] flex-col items-center justify-center p-8 text-center'>
        <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800'>
          <IconTemplate className='h-8 w-8 text-neutral-400 dark:text-neutral-500' />
        </div>
        <h3 className='mb-2 text-lg font-semibold text-neutral-900 dark:text-white'>
          <LocalizedText text={"No templates in this category"} />
        </h3>
        <p className='max-w-sm text-sm text-neutral-500 dark:text-neutral-400'>
          <LocalizedText
            text={
              "This category doesn't have any templates yet. Try browsing other categories!"
            }
          />
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className='grid max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto p-4 md:max-h-[70vh] md:grid-cols-3'
    >
      {templates.map((template) => (
        <TemplateCard
          key={template._id}
          template={template}
          onClick={() => onTemplateClick(template)}
        />
      ))}
      {loading && (
        <div className='col-span-3 flex items-center justify-center py-8'>
          <div className='text-sm text-neutral-500 dark:text-neutral-400'>
            <LocalizedText text={"Loading more templates..."} />
          </div>
        </div>
      )}
      {!hasMore && templates.length > 0 && (
        <div className='col-span-3 flex items-center justify-center py-4'>
          <div className='text-sm text-neutral-500 dark:text-neutral-400'>
            <LocalizedText text={"No more templates"} />
          </div>
        </div>
      )}
    </div>
  );
}

function TemplateCard({
  template,
  onClick,
}: {
  template: ImageGenTemplate;
  onClick: () => void;
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

  return (
    <div
      onClick={onClick}
      className='group relative w-64 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800'
    >
      <div className='relative aspect-video'>
        {template.videoUrl ? (
          <video
            ref={videoRef}
            src={template.videoUrl}
            poster={template.thumbnailUrl}
            loop
            muted
            playsInline
            className='h-full w-full object-cover'
          />
        ) : (
          <img
            src={template.thumbnailUrl}
            alt={template.title}
            className='h-full w-full object-cover'
          />
        )}
        {/* Use Button */}
        <div className='absolute right-2 bottom-2 opacity-0 transition-opacity group-hover:opacity-100'>
          <button className='rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100'>
            <LocalizedText text={"Use"} />
          </button>
        </div>
      </div>
      <div className='p-3'>
        <h3 className='line-clamp-1 text-sm font-medium text-neutral-900 dark:text-white'>
          {template.title}
        </h3>
      </div>
    </div>
  );
}

export function ImageTemplatesTab({
  onPromptSelect,
  onTabChange,
  onParamsRestore,
}: ImageTemplatesTabProps) {
  const [categories, setCategories] = useState<ImageGenTemplateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<ImageGenTemplateGroup | null>(null);
  const [categoryTemplates, setCategoryTemplates] = useState<
    ImageGenTemplate[]
  >([]);
  const [categoryPage, setCategoryPage] = useState(1);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [hasMoreCategory, setHasMoreCategory] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await imageGenTemplatesApi.getAll();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
        toast({
          title: "Error",
          description: "Failed to load templates. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Fetch more templates for selected category
  useEffect(() => {
    if (!selectedCategory) {
      setCategoryTemplates([]);
      setCategoryPage(1);
      setHasMoreCategory(true);
      return;
    }

    const fetchCategoryTemplates = async () => {
      try {
        setCategoryLoading(true);
        const response = await imageGenTemplatesApi.getByCategory(
          selectedCategory.id,
          categoryPage,
          20
        );
        if (response.success && response.data) {
          if (categoryPage === 1) {
            setCategoryTemplates(response.data.templates);
          } else {
            setCategoryTemplates((prev) => [
              ...prev,
              ...response.data.templates,
            ]);
          }
          setHasMoreCategory(response.data.pagination.hasNextPage);
        }
      } catch (error) {
        console.error("Error fetching category templates:", error);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategoryTemplates();
  }, [selectedCategory, categoryPage]);

  const handleCategoryOpen = (category: ImageGenTemplateGroup) => {
    setSelectedCategory(category);
    setCategoryPage(1);
    setCategoryTemplates([]);
  };

  const loadMoreCategoryTemplates = () => {
    if (!categoryLoading && hasMoreCategory) {
      setCategoryPage((prev) => prev + 1);
    }
  };

  const handleTemplateClick = async (template: ImageGenTemplate) => {
    try {
      // Track usage
      await imageGenTemplatesApi.trackUsage(template._id);

      // Restore all generation parameters from metadata if available
      if (onParamsRestore && template.metadata?.generationParams) {
        const params = template.metadata.generationParams;
        onParamsRestore.setPrompt(params.prompt || template.prompt);

        if (params.aspectRatio && onParamsRestore.setAspectRatio) {
          onParamsRestore.setAspectRatio(params.aspectRatio);
        }
        if (params.resolution && onParamsRestore.setResolution) {
          onParamsRestore.setResolution(params.resolution);
        }
        if (params.style && onParamsRestore.setStyle) {
          onParamsRestore.setStyle(params.style);
        }
        if (params.imageCount && onParamsRestore.setImageCount) {
          onParamsRestore.setImageCount(params.imageCount);
        }

        // Switch to preview tab
        onParamsRestore.onTabChange("preview");

        toast({
          title: "Template loaded",
          description:
            "All generation parameters have been loaded. Click Generate to create your image.",
        });
      } else {
        // Fallback to just setting prompt
        onPromptSelect(template.prompt);
        onTabChange("preview");
        toast({
          title: "Template loaded",
          description: "Click Generate to create your image",
        });
      }
      setSelectedCategory(null);
    } catch (error) {
      // Still allow using the template even if tracking fails
      onPromptSelect(template.prompt);
      onTabChange("preview");
      setSelectedCategory(null);
    }
  };

  if (loading) {
    return (
      <section className='p-4'>
        <div className='flex min-h-[60vh] flex-col items-center justify-center'>
          <LoadingFileLoader size={16} />
          <p className='text-sm text-neutral-500 dark:text-neutral-400'>
            <LocalizedText text={"Loading templates"} />
          </p>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className='p-4'>
        <div className='flex min-h-[60vh] flex-col items-center justify-center text-center'>
          <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800'>
            <IconTemplate className='h-8 w-8 text-neutral-400 dark:text-neutral-500' />
          </div>
          <h3 className='mb-2 text-lg font-semibold text-neutral-900 dark:text-white'>
            <LocalizedText text={"No templates available"} />
          </h3>
          <p className='mb-6 max-w-sm text-sm text-neutral-500 dark:text-neutral-400'>
            <LocalizedText
              text={"Templates are being added regularly. Check back soon!"}
            />
          </p>
          <button
            type='button'
            onClick={() => onTabChange("preview")}
            className='rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200'
          >
            <LocalizedText text={"Start Creating"} />
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className='p-4 px-0'>
        <div className='space-y-8'>
          {categories.map((category) => (
            <div key={category.id}>
              {/* Category Header */}
              <div className='mb-4 flex items-center justify-between'>
                <h2 className='text-lg font-semibold text-neutral-900 dark:text-white'>
                  {category.title}
                </h2>
                {category.templates.length > 4 && (
                  <button
                    onClick={() => handleCategoryOpen(category)}
                    className='flex items-center gap-1 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  >
                    <LocalizedText text={"See all"} />
                    <ChevronRight className='h-4 w-4' />
                  </button>
                )}
              </div>

              {/* Horizontal Scrolling Templates */}
              <div className='scrollbar-hide flex gap-4 overflow-x-auto pb-2'>
                {category.templates.map((template) => (
                  <TemplateCard
                    key={template._id}
                    template={template}
                    onClick={() => handleTemplateClick(template)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>

      {/* Desktop Dialog */}
      {isDesktop ? (
        <Dialog
          open={!!selectedCategory}
          onOpenChange={() => setSelectedCategory(null)}
        >
          <DialogContent className='flex max-h-[80vh] max-w-4xl flex-col overflow-hidden'>
            {selectedCategory && (
              <>
                <DialogHeader>
                  <DialogTitle className='text-xl font-semibold'>
                    {selectedCategory.title}{" "}
                    <LocalizedText text={"Templates"} />
                  </DialogTitle>
                </DialogHeader>
                <CategoryTemplatesList
                  templates={categoryTemplates}
                  loading={categoryLoading}
                  hasMore={hasMoreCategory}
                  onLoadMore={loadMoreCategoryTemplates}
                  onTemplateClick={handleTemplateClick}
                />
              </>
            )}
          </DialogContent>
        </Dialog>
      ) : (
        /* Mobile/Tablet Drawer */
        <Drawer
          open={!!selectedCategory}
          onOpenChange={() => setSelectedCategory(null)}
        >
          <DrawerContent>
            {selectedCategory && (
              <>
                <DrawerHeader>
                  <DrawerTitle className='text-xl font-semibold'>
                    {selectedCategory.title}{" "}
                    <LocalizedText text={"Templates"} />
                  </DrawerTitle>
                </DrawerHeader>
                <CategoryTemplatesList
                  templates={categoryTemplates}
                  loading={categoryLoading}
                  hasMore={hasMoreCategory}
                  onLoadMore={loadMoreCategoryTemplates}
                  onTemplateClick={handleTemplateClick}
                />
              </>
            )}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
