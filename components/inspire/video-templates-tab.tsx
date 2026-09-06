"use client";

import { VideoGenerationParamsCallback } from "./video-community-tab";
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
import { VideoGenTemplate, VideoGenTemplateGroup } from "@/types/inspire";
import { LoadingFileLoader } from "@/utils/Loading";
import { videoGenTemplatesApi } from "@/utils/inspire-api";
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

interface VideoTemplatesTabProps {
  onPromptSelect: (prompt: string) => void;
  onTabChange: (tab: "preview") => void;
  onParamsRestore?: VideoGenerationParamsCallback;
}

function TemplateCard({
  template,
  onClick,
}: {
  template: VideoGenTemplate;
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
        {/* Duration Badge */}
        {template.duration && (
          <div className='absolute top-2 left-2 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white'>
            {template.duration}
          </div>
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

export function VideoTemplatesTab({
  onPromptSelect,
  onTabChange,
  onParamsRestore,
}: VideoTemplatesTabProps) {
  const [categories, setCategories] = useState<VideoGenTemplateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<VideoGenTemplateGroup | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await videoGenTemplatesApi.getAll();
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

  const handleTemplateClick = async (template: VideoGenTemplate) => {
    try {
      // Track usage
      await videoGenTemplatesApi.trackUsage(template._id);

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
        if (params.duration && onParamsRestore.setDuration) {
          onParamsRestore.setDuration(params.duration);
        }

        // Switch to preview tab
        onParamsRestore.onTabChange("preview");

        toast({
          title: "Template loaded",
          description:
            "All generation parameters have been loaded. Click Generate to create your video.",
        });
      } else {
        // Fallback to just setting prompt
        onPromptSelect(template.prompt);
        onTabChange("preview");
        toast({
          title: "Template loaded",
          description: "Click Generate to create your video",
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
          <LoadingFileLoader size={20} />
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
                    onClick={() => setSelectedCategory(category)}
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
                {selectedCategory.templates.length === 0 ? (
                  <div className='flex min-h-[40vh] flex-col items-center justify-center p-8 text-center'>
                    <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30'>
                      <IconTemplate className='h-8 w-8 text-cyan-500 dark:text-cyan-400' />
                    </div>
                    <h3 className='mb-2 text-lg font-semibold text-neutral-900 dark:text-white'>
                      <LocalizedText text={"No Templates in This Category"} />
                    </h3>
                    <p className='max-w-sm text-sm text-neutral-600 dark:text-neutral-400'>
                      <LocalizedText
                        text={"This category doesn't have any templates yet."}
                      />
                    </p>
                  </div>
                ) : (
                  <div className='grid grid-cols-3 gap-4 overflow-y-auto p-4'>
                    {selectedCategory.templates.map((template) => (
                      <TemplateCard
                        key={template._id}
                        template={template}
                        onClick={() => handleTemplateClick(template)}
                      />
                    ))}
                  </div>
                )}
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
                {selectedCategory.templates.length === 0 ? (
                  <div className='flex min-h-[40vh] flex-col items-center justify-center p-8 text-center'>
                    <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800'>
                      <IconTemplate className='h-8 w-8 text-neutral-400 dark:text-neutral-500' />
                    </div>
                    <h3 className='mb-2 text-lg font-semibold text-neutral-900 dark:text-white'>
                      <LocalizedText text={"No templates in this category"} />
                    </h3>
                    <p className='max-w-sm text-sm text-neutral-500 dark:text-neutral-400'>
                      <LocalizedText
                        text={"This category doesn't have any templates yet."}
                      />
                    </p>
                  </div>
                ) : (
                  <div className='grid max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto p-4'>
                    {selectedCategory.templates.map((template) => (
                      <TemplateCard
                        key={template._id}
                        template={template}
                        onClick={() => handleTemplateClick(template)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
