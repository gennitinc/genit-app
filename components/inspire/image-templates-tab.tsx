"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { IconTemplate } from "@tabler/icons-react";
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
import { imageGenTemplatesApi } from "@/utils/inspire-api";
import { ImageGenTemplate, ImageGenTemplateGroup } from "@/types/inspire";

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

import { GenerationParamsCallback } from "./image-community-tab";

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
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
          <IconTemplate className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
          No templates in this category
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
          This category doesn't have any templates yet. Try browsing other
          categories!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto p-4 max-h-[60vh] md:max-h-[70vh]"
    >
      {templates.map((template) => (
        <TemplateCard
          key={template._id}
          template={template}
          onClick={() => onTemplateClick(template)}
        />
      ))}
      {loading && (
        <div className="col-span-3 flex items-center justify-center py-8">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            Loading more templates...
          </div>
        </div>
      )}
      {!hasMore && templates.length > 0 && (
        <div className="col-span-3 flex items-center justify-center py-4">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            No more templates
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
      className="group relative flex-shrink-0 w-64 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer"
    >
      <div className="relative aspect-video">
        {template.videoUrl ? (
          <video
            ref={videoRef}
            src={template.videoUrl}
            poster={template.thumbnailUrl}
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={template.thumbnailUrl}
            alt={template.title}
            className="w-full h-full object-cover"
          />
        )}
        {/* Use Button */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="px-3 py-1.5 rounded-lg bg-white text-neutral-900 text-sm font-medium hover:bg-neutral-100 transition-colors">
            Use
          </button>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-1">
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
      <section className="p-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 text-neutral-400 dark:text-neutral-500 animate-spin mb-3" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Loading templates
          </p>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="p-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
            <IconTemplate className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
            No templates available
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6">
            Templates are being added regularly. Check back soon!
          </p>
          <button
            type="button"
            onClick={() => onTabChange("preview")}
            className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-sm font-medium text-white dark:text-neutral-900 transition-colors"
          >
            Start Creating
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="p-4">
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.id}>
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {category.title}
                </h2>
                {category.templates.length > 4 && (
                  <button
                    onClick={() => handleCategoryOpen(category)}
                    className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    See all
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Horizontal Scrolling Templates */}
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
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
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            {selectedCategory && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {selectedCategory.title} Templates
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
                  <DrawerTitle className="text-xl font-semibold">
                    {selectedCategory.title} Templates
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
