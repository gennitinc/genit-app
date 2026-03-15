"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AspectRatio, Resolution } from "@/types/inspire";
import { useUserContext } from "@/context/AuthenticatedContext";
import { apiResponse } from "@/utils/apiResponse";
import { PremiumInput } from "@/components/ui/premium-input";

// ─── Main Page ────────────────────────────────────────────────────────────────
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

export type ImageStyle =
  | "realistic"
  | "anime"
  | "digitalArt"
  | "oilPainting"
  | "watercolor"
  | "threeDRrender";

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
      const urlParams = new URLSearchParams(searchParams.toString());
      urlParams.set("tab", tab);
      if (projectId) urlParams.set("projectId", projectId);
      router.replace(`/apps/image-generation?${urlParams.toString()}`, {
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
      } else {
        throw new Error(response.message || "Failed to generate image");
      }
    } catch (error: any) {
      console.error("Generation error:", error);
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
    <div className="relative w-full bg-white dark:bg-black">
      <Toaster />
      <LandingPageBanner />
      <LandingNavbar />
      <div
        id="main-content"
        className="flex-1 relative py-12 px-2 md:px-6 lg:px-20"
      >
        <div className="bg-grid-black/[0.05] dark:bg-grid-white/[0.05] absolute inset-0 -z-10" />
        {/* <div className="text-center animate-fadeInUp mb-10">
          <h1 className="text-xl font-bold tracking-tight md:text-2xl lg:text-5xl">
            AI Image{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Generation
            </span>
          </h1>
          <p
            className="my-5 text-muted-foreground text-sm md:text-lg animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            Generate high-quality images from text prompts with ease.
          </p>
        </div> */}

        <div className="flex flex-col md:h-fit min-h-0 overflow-hidden">
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
              <DrawerContent className="h-[85vh] px-4">
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
                          const urlParams = new URLSearchParams(
                            searchParams.toString(),
                          );
                          urlParams.set("projectId", image._id);
                          router.push(
                            `/apps/image-generation?${urlParams.toString()}`,
                          );
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
            <div className="flex flex-col h-full min-h-fit pt-4 overflow-hidden bg-white dark:bg-black/20 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
              <div className="px-4 pb-4 shrink-0 overflow-y-auto hide-scrollbar space-y-4 flex-1">
                <ModelSelector
                  type="image"
                  selectedModel={selectedImageModel}
                  onSelectModel={setSelectedImageModel}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Prompt
                  </label>
                  <PremiumInput
                    value={prompt}
                    onChange={setPrompt}
                    onSubmit={handleGenerate}
                    isGenerating={isGenerating}
                    placeholder="Describe your image..."
                    minHeight="100px"
                  />

                  <div className="space-y-2">
                    <label className="text-xs text-neutral-500">
                      Reference Images (Optional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {promptImagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-neutral-300 dark:border-neutral-600"
                        >
                          <img
                            src={preview}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => {
                              const next = [...promptImages];
                              const nextP = [...promptImagePreviews];
                              next.splice(index, 1);
                              nextP.splice(index, 1);
                              setPromptImages(next);
                              setPromptImagePreviews(nextP);
                            }}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                          >
                            <Trash size={12} />
                          </button>
                        </div>
                      ))}
                      {promptImagePreviews.length < 5 && (
                        <label className="w-20 h-20 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-cyan-500">
                          <input
                            type="file"
                            className="sr-only"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                setPromptImages([...promptImages, f]);
                                setPromptImagePreviews([
                                  ...promptImagePreviews,
                                  URL.createObjectURL(f),
                                ]);
                              }
                            }}
                          />
                          <ImageIcon className="w-5 h-5 text-neutral-400" />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        value: "realistic",
                        label: "Realistic",
                        img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200",
                      },
                      {
                        value: "anime",
                        label: "Anime",
                        img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200",
                      },
                      {
                        value: "digitalArt",
                        label: "Digital Art",
                        img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
                      },
                    ].map((s) => (
                      <button
                        key={s.value}
                        onClick={() =>
                          setSelectedImageStyle(s.value as ImageStyle)
                        }
                        className={cn(
                          "relative rounded-xl overflow-hidden aspect-square",
                          selectedImageStyle === s.value &&
                            "ring-2 ring-cyan-500",
                        )}
                      >
                        <img
                          src={s.img}
                          alt={s.label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-2">
                          <span className="text-[10px] text-white font-medium">
                            {s.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Aspect Ratio</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["16:9", "9:16", "1:1", "4:3"].map((r) => (
                      <button
                        key={r}
                        onClick={() => setSelectedAspectRatio(r as AspectRatio)}
                        className={cn(
                          "p-2 rounded-lg text-xs font-medium",
                          selectedAspectRatio === r
                            ? "bg-cyan-500 text-white"
                            : "bg-neutral-100 dark:bg-neutral-800",
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
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
                  <ImageHistoryTab
                    onLoadToEditor={(image) => {
                      const urlParams = new URLSearchParams(
                        searchParams.toString(),
                      );
                      urlParams.set("projectId", image._id);
                      router.push(
                        `/apps/image-generation?${urlParams.toString()}`,
                      );
                    }}
                  />
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

      {/* <LandingFooter /> */}
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
