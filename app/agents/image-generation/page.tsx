"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AspectRatio, Resolution } from "@/types/inspire";
import { useUserContext } from "@/context/AuthenticatedContext";
import { apiResponse } from "@/utils/apiResponse";
import { PremiumInput } from "@/components/ui/premium-input";


import {
  Loader2,
  Image as ImageIcon,
  Wand2,
  History,
  Users,
  ViewIcon,
  BookOpen,
  LayoutDashboard,
  Trash,
  Plus,
  Minus,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import withAuth from "@/helper/hoc/withAuth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { IconTemplate } from "@tabler/icons-react";
import {
  ImageCommunityTab,
  ImagePreviewTab,
  ImageTemplatesTab,
  TutorialTab,
} from "@/components/inspire";
import { ImageHistoryTab } from "@/components/inspire/image-history-tab";
import { ModelSelector } from "@/components/inspire/model-selector";
import { Model } from "@/types/inspire";
import { imageGenApi } from "@/utils/inspire-api";
import { Toaster } from "@/components/ui/sonner";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { GridPattern } from "@/components/ui/grid-pattern";
import { trackFeatureUsed, trackEvent } from "@/lib/mixpanelClient";
import {
  ASPECT_RATIOS,
  AspectRatioCard,
} from "@/components/video/resolution-selector";

export type ImageStyle =
  | "realistic"
  | "anime"
  | "digitalArt"
  | "oilPainting"
  | "watercolor"
  | "threeDRrender";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string;
function ImageGenerationPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const projectId = searchParams.get("projectId");
  const urlContentTab = searchParams.get("tab") as
    | "preview"
    | "history"
    | "community"
    | "templates"
    | "tutorial"
    | null;

  const [selectedResolution, setSelectedResolution] =
    useState<Resolution>("1080p");
  const [selectedAspectRatio, setSelectedAspectRatio] =
    useState<AspectRatio>("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingProject, setLoadingProject] = useState(false);

  const [generatedImages, setGeneratedImages] = useState<
    {
      id: string;
      url: string;
      thumbnail: string;
      aspectRatio: AspectRatio;
      resolution: Resolution;
      prompt: string;
      style: ImageStyle;
      createdAt: string;
      generatedImageId?: string;
      referenceImageUrls?: string[];
    }[]
  >([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImageStyle, setSelectedImageStyle] =
    useState<ImageStyle>("realistic");
  const [imageCount, setImageCount] = useState(1);
  const [selectedImageModel, setSelectedImageModel] = useState<Model | null>(
    null,
  );

  const [prompt, setPrompt] = useState("");
  const [promptImages, setPromptImages] = useState<File[]>([]);
  const [promptImagePreviews, setPromptImagePreviews] = useState<string[]>([]);

  const [activeContentTab, setActiveContentTab] = useState<
    "community" | "preview" | "history" | "templates" | "tutorial"
  >(urlContentTab || "community");
  const [isResultsDrawerOpen, setIsResultsDrawerOpen] = useState(false);

  const updateContentTab = useCallback(
    (tab: "preview" | "history" | "community" | "templates" | "tutorial") => {
      setActiveContentTab(tab);
      trackFeatureUsed(MIXPANEL_TOKEN, "image_gen_tab_switched", { tab });
      const urlParams = new URLSearchParams(searchParams.toString());
      urlParams.set("tab", tab);
      if (projectId) urlParams.set("projectId", projectId);
      router.replace(`/agents/image-generation?${urlParams.toString()}`, {
        scroll: false,
      });
    },
    [searchParams, router, projectId],
  );

  // Fetch project data if projectId is provided
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId || !user?._id) return;

      try {
        setLoadingProject(true);
        const endpoint = `/inspire/generate/image/${projectId}`;
        const response = await apiResponse.get(endpoint, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.success) {
          const project = response.data.project;
          const image = {
            id: project._id || project.id,
            generatedImageId: project._id || project.id,
            url: project.url,
            thumbnail: project.thumbnail || project.url,
            aspectRatio: (project.aspectRatio || "16:9") as AspectRatio,
            resolution: (project.resolution || "1080p") as Resolution,
            prompt: project.prompt || "",
            style: (project.style || "realistic") as ImageStyle,
            createdAt: project.createdAt || new Date().toISOString(),
            referenceImageUrls: project.referenceImageUrls || [],
          };

          setGeneratedImages([image]);
          setSelectedImageIndex(0);
          setPrompt(project.prompt || "");
          if (project.aspectRatio) setSelectedAspectRatio(project.aspectRatio);
          if (project.resolution) setSelectedResolution(project.resolution);
          if (project.style) setSelectedImageStyle(project.style);
          updateContentTab("preview");
        }
      } catch (error: any) {
        console.error("Error fetching project:", error);
        toast("Could not load project data");
      } finally {
        setLoadingProject(false);
      }
    };

    fetchProject();
  }, [projectId, user?._id]);

  const handleLoadFromHistory = useCallback(
    (image: {
      _id: string;
      imageData: {
        url: string;
        thumbnail: string;
        prompt: string;
        aspectRatio: string;
        resolution: string;
        style?: string;
        referenceImageUrls?: string[];
      };
      createdAt: string;
    }) => {
      const { imageData } = image;
      const loadedImage = {
        id: image._id,
        generatedImageId: image._id,
        url: imageData.url,
        thumbnail: imageData.thumbnail || imageData.url,
        aspectRatio: (imageData.aspectRatio || "1:1") as AspectRatio,
        resolution: (imageData.resolution || "1080p") as Resolution,
        prompt: imageData.prompt || "",
        style: (imageData.style || "realistic") as ImageStyle,
        createdAt: image.createdAt || new Date().toISOString(),
        referenceImageUrls: imageData.referenceImageUrls || [],
      };

      setGeneratedImages([loadedImage]);
      setSelectedImageIndex(0);
      setPrompt(imageData.prompt || "");
      if (imageData.aspectRatio)
        setSelectedAspectRatio(imageData.aspectRatio as AspectRatio);
      if (imageData.resolution)
        setSelectedResolution(imageData.resolution as Resolution);
      if (imageData.style) setSelectedImageStyle(imageData.style as ImageStyle);
      updateContentTab("preview");
    },
    [updateContentTab],
  );

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast("Please enter a prompt");
      return;
    }

    if (!selectedImageModel) {
      toast("Please select an image model");
      return;
    }

    setIsGenerating(true);
    updateContentTab("preview");
    trackEvent(MIXPANEL_TOKEN, "image_generation_started", {
      model_id: selectedImageModel?._id,
      style: selectedImageStyle,
      image_count: imageCount,
      aspect_ratio: selectedAspectRatio,
      resolution: selectedResolution,
      has_reference_images: promptImages.length > 0,
    });

    try {
      const files: File[] = [...promptImages];

      const response = await imageGenApi.generate(
        {
          prompt: prompt.trim(),
          modelId: selectedImageModel._id,
          aspectRatio: selectedAspectRatio,
          resolution: selectedResolution,
          style: selectedImageStyle,
          imageCount: imageCount,
        },
        files.length > 0 ? files : undefined,
      );

      if (response.success && response.data.images) {
        const newImages = response.data.images.map((img, index) => ({
          id: img.id || `img-${Date.now()}-${index}`,
          generatedImageId: img.id || undefined,
          url: img.url,
          thumbnail: img.url,
          aspectRatio: selectedAspectRatio,
          resolution: selectedResolution,
          prompt: prompt.trim(),
          style: selectedImageStyle,
          createdAt: new Date().toISOString(),
          referenceImageUrls:
            promptImages.length > 0
              ? promptImagePreviews
              : (img as any).referenceImageUrls || [],
        }));

        setGeneratedImages((prev) => [...newImages, ...prev]);
        setSelectedImageIndex(0);
        toast(`Successfully generated ${newImages.length} image(s)`);
        trackEvent(MIXPANEL_TOKEN, "image_generation_succeeded", {
          generated_count: newImages.length,
          model_id: selectedImageModel?._id,
        });
      } else {
        throw new Error(response.message || "Failed to generate image");
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      trackEvent(MIXPANEL_TOKEN,  "image_generation_failed", {
        reason: error?.message || "unknown",
        model_id: selectedImageModel?._id,
      });
      const creditsRemaining = user?.creditsRemaining ?? 0;
      if (creditsRemaining <= 10) {
        const isBasic = String(user?.userPlan) === "Basic";
        toast.error(`Low Credits`, {
          description: `You have ${creditsRemaining} credits remaining.`,
          action: {
            label: isBasic ? "Upgrade" : "Buy Credits",
            onClick: () =>
              router.push(isBasic ? "/pricing" : "/user/settings?tab=billing"),
          },
        });
      } else {
        toast.error(error.message || "Generation failed");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex relative w-full h-[100dvh] overflow-hidden bg-white dark:bg-black">
      <Toaster />
      <AppSidebar />
      <div
        // ref={scrollContainerRef}
        className="flex-1 flex flex-col overflow-auto will-change-scroll scroll-container"
      >
        <TopNavWithAurora
        // scrollContainerRef={
        //   scrollContainerRef as React.RefObject<HTMLDivElement>
        // }
        />
        <div
          id="main-content"
          className="flex-1 mt-10 lg:mt-0"
          // style={{
          //   transform: "translateZ(0)",
          //   willChange: "transform",
          // }}
        >
          <div className="flex flex-col md:h-[calc(100vh-4rem)] min-h-0 overflow-hidden px-2 md:px-6 lg:px-5">
            <div className="flex flex-row items-center gap-2 justify-between px-2 py-2 shrink-0">
              <h1 className="font-bold tracking-tight md:text-2xl lg:text-5xl lg:hidden">
                AI Image{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Gen
                </span>
              </h1>
              <Drawer
                open={isResultsDrawerOpen}
                onOpenChange={setIsResultsDrawerOpen}
              >
                <DrawerTrigger asChild>
                  <button className="w-fit h-fit py-1 px-2 md:hidden bg-neutral-100 dark:bg-neutral-800 rounded-sm text-sm font-semibold flex items-center justify-center gap-2 border border-neutral-200 dark:border-neutral-700">
                    <LayoutDashboard size={16} />
                    <span>view</span>
                  </button>
                </DrawerTrigger>
                <DrawerContent className="h-[85vh] px-2">
                  <DrawerHeader className="px-0">
                    <DrawerTitle>Explore & Results</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex flex-col flex-1 min-h-0 overflow-hidden pb-6">
                    <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-4 shrink-0">
                      {[
                        { id: "preview", icon: ViewIcon, label: "Preview" },
                        { id: "history", icon: History, label: "History" },
                        { id: "community", icon: Users, label: "Community" },
                        {
                          id: "templates",
                          icon: IconTemplate,
                          label: "Templates",
                        },
                        { id: "tutorial", icon: BookOpen, label: "Tutorial" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => updateContentTab(t.id as any)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full whitespace-nowrap transition-colors border",
                            activeContentTab === t.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-neutral-50 dark:bg-neutral-900 text-neutral-500 border-neutral-200 dark:border-neutral-800",
                          )}
                        >
                          <t.icon size={14} />
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {activeContentTab === "preview" && (
                        <ImagePreviewTab
                          generatedImages={generatedImages}
                          selectedImageIndex={selectedImageIndex}
                          onImageSelect={setSelectedImageIndex}
                          isGenerating={isGenerating}
                          generationProgress={0}
                          selectedAspectRatio={selectedAspectRatio}
                          onPromptRestore={(p) => {
                            setPrompt(p);
                            setIsResultsDrawerOpen(false);
                          }}
                        />
                      )}
                      {activeContentTab === "history" && (
                        <ImageHistoryTab
                          onLoadToEditor={(image) => {
                            handleLoadFromHistory(image);
                            setIsResultsDrawerOpen(false);
                          }}
                        />
                      )}
                      {activeContentTab === "community" && (
                        <ImageCommunityTab
                          onPromptSelect={(p) => {
                            setPrompt(p);
                            setIsResultsDrawerOpen(false);
                          }}
                          onTabChange={updateContentTab}
                        />
                      )}
                      {activeContentTab === "templates" && (
                        <ImageTemplatesTab
                          onPromptSelect={(p) => {
                            setPrompt(p);
                            setIsResultsDrawerOpen(false);
                          }}
                          onTabChange={updateContentTab}
                        />
                      )}
                      {activeContentTab === "tutorial" && (
                        <TutorialTab type="image" />
                      )}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[27rem_1fr] gap-6 relative w-full flex-1 min-h-0">
              <div className="flex flex-col h-full min-h-0 pt-4 overflow-hidden bg-white dark:bg-black/20 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                <div className="px-4 pb-4 shrink-0 overflow-y-auto hide-scrollbar space-y-4 flex-1">
                  <ModelSelector
                    type="image"
                    selectedModel={selectedImageModel}
                    onSelectModel={(model) => {
                      setSelectedImageModel(model);
                      trackFeatureUsed(MIXPANEL_TOKEN, "image_model_selected", {
                        model_id: model?._id,
                        model_name: model?.name,
                      });
                    }}
                  />

                  <div className="space-y-2">
                    <PremiumInput
                      value={prompt}
                      onChange={setPrompt}
                      onSubmit={handleGenerate}
                      isGenerating={isGenerating}
                      placeholder="Describe your image..."
                      minHeight="50px"
                    />
                  </div>

                  {/* Reference Images Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Reference Images (Optional)
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {promptImagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          className="relative w-16 h-16 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700"
                        >
                          <img
                            src={preview}
                            alt={`Reference ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newFiles = [...promptImages];
                              const newPreviews = [...promptImagePreviews];
                              newFiles.splice(index, 1);
                              newPreviews.splice(index, 1);
                              setPromptImages(newFiles);
                              setPromptImagePreviews(newPreviews);
                            }}
                            className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5"
                          >
                            <Trash size={10} />
                          </button>
                        </div>
                      ))}
                      {promptImagePreviews.length < 5 && (
                        <label className="w-16 h-16 border border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setPromptImages([...promptImages, file]);
                                setPromptImagePreviews([
                                  ...promptImagePreviews,
                                  URL.createObjectURL(file),
                                ]);
                              }
                            }}
                          />
                          <ImageIcon className="w-4 h-4 text-neutral-400" />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 ">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Style</label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          value: "realistic",
                          label: "Realistic",
                          image:
                            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
                        },
                        {
                          value: "anime",
                          label: "Anime",
                          image:
                            "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&h=200&fit=crop",
                        },
                        {
                          value: "digitalArt",
                          label: "Digital Art",
                          image:
                            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop",
                        },
                        {
                          value: "oilPainting",
                          label: "Oil Painting",
                          image:
                            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&h=200&fit=crop",
                        },
                        {
                          value: "watercolor",
                          label: "Watercolor",
                          image:
                            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=200&fit=crop",
                        },
                        {
                          value: "threeDRrender",
                          label: "3D Render",
                          image:
                            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=200&fit=crop",
                        },
                      ].map((style) => (
                        <button
                          key={style.value}
                          type="button"
                          onClick={() =>
                            setSelectedImageStyle(style.value as ImageStyle)
                          }
                          className={cn(
                            "relative rounded-xl overflow-hidden transition-all group",
                            selectedImageStyle === style.value
                              ? "ring-2 ring-cyan-500 ring-offset-2 ring-offset-background"
                              : "hover:ring-2 hover:ring-neutral-300 dark:hover:ring-neutral-600",
                          )}
                        >
                          <div className="aspect-square relative">
                            <img
                              src={style.image}
                              alt={style.label}
                              className="w-full h-full object-cover"
                            />
                            {/* Overlay */}
                            <div
                              className={cn(
                                "absolute inset-0 transition-all",
                                selectedImageStyle === style.value
                                  ? "bg-cyan-500/20"
                                  : "bg-black/40 group-hover:bg-black/30",
                              )}
                            />
                            {/* Checkmark for selected */}
                            {selectedImageStyle === style.value && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-neutral-500 flex items-center justify-center">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M10 3L4.5 8.5L2 6"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          {/* Label */}
                          <div
                            className={cn(
                              "absolute bottom-0 left-0 right-0 p-2 text-center",
                              selectedImageStyle === style.value
                                ? "bg-black/60"
                                : "bg-black/60",
                            )}
                          >
                            <span className="text-xs font-medium text-white">
                              {style.label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium mt-4">
                        No of Images
                      </label>
                    </div>
                    <div className="flex items-center gap-1.5 pt-2 border-t w-[40%]">
                      <button
                        onClick={() =>
                          setImageCount(Math.max(1, imageCount - 1))
                        }
                        className="size-5 rounded-md flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 transition-colors shrink-0"
                      >
                        <Minus className="size-2.5" />
                      </button>

                      <div
                        className="relative flex-1 h-[18px] rounded-md bg-neutral-100 dark:bg-neutral-800 overflow-hidden cursor-pointer"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const raw = Math.round(
                            ((e.clientX - rect.left) / rect.width) * 3 + 1,
                          );
                          setImageCount(Math.max(1, Math.min(4, raw)));
                        }}
                      >
                        <div
                          className="absolute left-0 top-0 h-full rounded-l-md bg-neutral-300 dark:bg-neutral-700 transition-[width] duration-100"
                          style={{ width: `${((imageCount - 1) / 3) * 100}%` }}
                        />

                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-medium tabular-nums text-neutral-700 dark:text-neutral-200">
                            {imageCount}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setImageCount(Math.min(4, imageCount + 1))
                        }
                        className="size-5 rounded-md flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 transition-colors shrink-0"
                      >
                        <Plus className="size-2.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium mt-4">
                      Aspect Ratio
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {ASPECT_RATIOS.map((ratio) => (
                      <AspectRatioCard
                        key={ratio.value}
                        ratio={ratio}
                        isSelected={selectedAspectRatio === ratio.value}
                        onSelect={() =>
                          setSelectedAspectRatio(ratio.value as AspectRatio)
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="px-4 py-3 border-t bg-white dark:bg-black z-10 space-y-3">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full h-11 text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                  >
                    {isGenerating ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Wand2 size={16} />
                    )}
                    Generate Image
                  </button>

                  {/* Mobile Drawer Trigger */}
                </div>
              </div>

              <div className="hidden md:flex flex-col flex-1 min-h-0 relative gap-2.5 pb-3 overflow-hidden">
                <div className="flex justify-end gap-2 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl self-end shrink-0">
                  {[
                    { id: "preview", icon: ViewIcon, label: "Preview" },
                    { id: "history", icon: History, label: "History" },
                    { id: "community", icon: Users, label: "Community" },
                    { id: "templates", icon: IconTemplate, label: "Templates" },
                    { id: "tutorial", icon: BookOpen, label: "Tutorial" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => updateContentTab(t.id as any)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                        activeContentTab === t.id
                          ? "bg-white dark:bg-neutral-800 shadow-sm"
                          : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
                      )}
                    >
                      <t.icon size={14} />
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto pr-1">
                  {activeContentTab === "preview" && (
                    <ImagePreviewTab
                      generatedImages={generatedImages}
                      selectedImageIndex={selectedImageIndex}
                      onImageSelect={setSelectedImageIndex}
                      isGenerating={isGenerating}
                      generationProgress={0}
                      selectedAspectRatio={selectedAspectRatio}
                      onPromptRestore={(p) => setPrompt(p)}
                    />
                  )}
                  {activeContentTab === "history" && (
                    <ImageHistoryTab onLoadToEditor={handleLoadFromHistory} />
                  )}
                  {activeContentTab === "community" && (
                    <ImageCommunityTab
                      onPromptSelect={(p) => setPrompt(p)}
                      onTabChange={updateContentTab}
                    />
                  )}
                  {activeContentTab === "templates" && (
                    <ImageTemplatesTab
                      onPromptSelect={(p) => setPrompt(p)}
                      onTabChange={updateContentTab}
                    />
                  )}
                  {activeContentTab === "tutorial" && (
                    <TutorialTab type="image" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const XIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export default withAuth(ImageGenerationPage);
