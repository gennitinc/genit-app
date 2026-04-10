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
import { videoGenTemplatesApi } from "@/utils/inspire-api";
import { VideoGenTemplate, VideoGenTemplateGroup } from "@/types/inspire";

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

import { VideoGenerationParamsCallback } from "./video-community-tab";

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
        {/* Duration Badge */}
        {template.duration && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/70 text-white text-xs font-medium">
            {template.duration}
          </div>
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

export function VideoTemplatesTab({
  onPromptSelect,
  onTabChange,
  onParamsRestore,
}: VideoTemplatesTabProps) {
  const [categories, setCategories] = useState<VideoGenTemplateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<VideoGenTemplateGroup | null>(null);
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
          description: "All generation parameters have been loaded. Click Generate to create your video.",
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
      <section className="p-4 px-0">
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
                    onClick={() => setSelectedCategory(category)}
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
        <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            {selectedCategory && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {selectedCategory.title} Templates
                  </DialogTitle>
                </DialogHeader>
                {selectedCategory.templates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 flex items-center justify-center mb-4">
                      <IconTemplate className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                      No Templates in This Category
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm">
                      This category doesn't have any templates yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 overflow-y-auto p-4">
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
        <Drawer open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
          <DrawerContent>
            {selectedCategory && (
              <>
                <DrawerHeader>
                  <DrawerTitle className="text-xl font-semibold">
                    {selectedCategory.title} Templates
                  </DrawerTitle>
                </DrawerHeader>
                {selectedCategory.templates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8">
                    <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                      <IconTemplate className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                      No templates in this category
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
                      This category doesn't have any templates yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 overflow-y-auto p-4 max-h-[60vh]">
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
