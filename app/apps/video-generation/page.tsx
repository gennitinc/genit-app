"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUserContext } from "@/context/AuthenticatedContext";
import { apiResponse, serverUrlSocket } from "@/utils/apiResponse";
import { io, Socket } from "socket.io-client";
import {
  Loader2,
  Sparkles,
  Video,
  History,
  Users,
  ViewIcon,
  ChevronDown,
  ChevronUp,
  User,
  Volume2,
  Monitor,
  Settings,
  Image as ImageIcon,
  BookOpen,
  LayoutDashboard,
  Search,
  Trash,
  Wand2,
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
import { PresenterSelector } from "@/components/video/presenter-selector";
import { ASPECT_RATIOS, AspectRatioCard, ResolutionSelector } from "@/components/video/resolution-selector";
import { VoiceSelector } from "@/components/video/voice-selector";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { IconTemplate } from "@tabler/icons-react";
import {
  VideoCommunityTab,
  VideoPreviewTab,
  VideoTemplatesTab,
  TutorialTab,
  ImageCommunityTab,
  ImagePreviewTab,
  ImageTemplatesTab,
  ImageHistoryTab,
} from "@/components/inspire";
import { VideoHistoryTab } from "@/components/inspire/video-history-tab";
import { ModelSelector } from "@/components/inspire/model-selector";
import {
  Model,
  Presenter,
  Voice,
  AspectRatio,
  Resolution,
} from "@/types/inspire";
import { videoGenApi, imageGenApi } from "@/utils/inspire-api";
import { Toaster } from "@/components/ui/sonner";
import { LandingFooter } from "@/components/landing/landing-footer";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { PremiumInput } from "@/components/ui/premium-input";

export type { Presenter, Voice, Model } from "@/types/inspire";

// ─── Preset Slides ──────────────────────────────────────────────────────────

const PRESET_SLIDES = [
  {
    id: "general",
    title: "Deep zoom",
    description: "Real expression captured",
    video:
      "https://cdn.leonardo.ai/users/220eee85-2367-43fd-91c1-715ac51afece/generations/ccd8c64a-ae89-49e3-89ef-afab21e2432a/segments/1:1:1/motion2Fast____________________________________________________0.mp4",
    poster:
      "https://cdn.leonardo.ai/users/220eee85-2367-43fd-91c1-715ac51afece/generations/ccd8c64a-ae89-49e3-89ef-afab21e2432a/segments/1:1:1/motion2Fast____________________________________________________0.jpg?w=512",
  },
  {
    id: "cinematic",
    title: "Cinematic Clip",
    description: "Film expression",
    video:
      "https://cdn.leonardo.ai/users/61f1539d-5ab8-4ced-be93-ceaf0ba315c2/generations/1f0e3eed-52a5-6bd0-a90c-dee3f3ca5cea/veo-3.1-fast-generate-preview_CUTE_3D_CLAYMATION_STYLE_DETAILED_MINIATURE_WORLD_SOFT_PLASTICINE_TEXTURE_CINEMA-0.mp4",
    poster:
      "https://cdn.leonardo.ai/users/61f1539d-5ab8-4ced-be93-ceaf0ba315c2/generations/1f0e3eed-52a5-6bd0-a90c-dee3f3ca5cea/veo-3.1-fast-generate-preview_CUTE_3D_CLAYMATION_STYLE_DETAILED_MINIATURE_WORLD_SOFT_PLASTICINE_TEXTURE_CINEMA-0.jpg?w=512",
  },
];

function PresetSlider({
  currentSlide,
  onSlideChange,
}: {
  currentSlide: number;
  onSlideChange: (index: number) => void;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      onSlideChange((currentSlide + 1) % PRESET_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [currentSlide, onSlideChange]);

  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({
        left: currentSlide * slideWidth,
        behavior: "smooth",
      });
    }

    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentSlide) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [currentSlide]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl group">
      <div
        ref={sliderRef}
        className="flex overflow-x-hidden scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {PRESET_SLIDES.map((slide, index) => (
          <div key={slide.id} className="min-w-full snap-center">
            <figure className="aspect-[2.3] w-full relative select-none overflow-hidden rounded-xl cursor-pointer">
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                loop
                muted
                playsInline
                disablePictureInPicture
                preload="metadata"
                poster={slide.poster}
                src={slide.video}
                className="object-cover w-full h-full rounded-xl"
              />
              <div className="absolute inset-0 pointer-events-none bg-black/30" />
              <figcaption className="z-10 absolute left-0 bottom-0 w-full pl-3 pb-3 pr-1.5 text-white">
                <p className="truncate w-full uppercase text-[10px] font-semibold">
                  {slide.title}
                </p>
                <p className="text-[10px] text-white/80">{slide.description}</p>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoGenerationPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const projectId = searchParams.get("projectId");
  const urlContentTab = searchParams.get("tab") as any;

  const [selectedPresenter, setSelectedPresenter] = useState<Presenter | null>(
    null,
  );
  const [selectedResolution, setSelectedResolution] =
    useState<Resolution>("1080p");
  const [selectedAspectRatio, setSelectedAspectRatio] =
    useState<AspectRatio>("1:1");
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCloningVoice, setIsCloningVoice] = useState(false);
  const [clonedVoiceId, setClonedVoiceId] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedVideoModel, setSelectedVideoModel] = useState<Model | null>(
    null,
  );
  const [loadingProject, setLoadingProject] = useState(false);

  // Generation mode: image or video - initialize from URL parameter
  const [generationMode, setGenerationMode] = useState<"image" | "video">(
    searchParams.get("mode") === "ai-image-gen" ? "image" : "video",
  );

  // Listen to URL parameter changes and update generation mode
  useEffect(() => {
    const currentMode = searchParams.get("mode");
    const expectedMode = currentMode === "ai-image-gen" ? "image" : "video";
    if (generationMode !== expectedMode) {
      setGenerationMode(expectedMode);
    }
  }, [searchParams, generationMode]);

  const [startFrame, setStartFrame] = useState<File | null>(null);
  const [endFrame, setEndFrame] = useState<File | null>(null);
  const [startFramePreview, setStartFramePreview] = useState<string | null>(
    null,
  );
  const [endFramePreview, setEndFramePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [promptImages, setPromptImages] = useState<File[]>([]);
  const [promptImagePreviews, setPromptImagePreviews] = useState<string[]>([]);
  const [duration, setDuration] = useState(8);
  const [fixedLens, setFixedLens] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Image-specific states
  type ImageStyle =
    | "realistic"
    | "anime"
    | "digitalArt"
    | "oilPainting"
    | "watercolor"
    | "threeDRrender";
  const [selectedImageStyle, setSelectedImageStyle] =
    useState<ImageStyle>("realistic");
  const [imageCount, setImageCount] = useState(1);
  const [selectedImageModel, setSelectedImageModel] = useState<Model | null>(
    null,
  );

  const [sectionsEnabled, setSectionsEnabled] = useState({
    avatar: false,
    audio: false,
    resolution: false,
    advanced: false,
  });

  const [generatedVideos, setGeneratedVideos] = useState<any[]>([]);
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeContentTab, setActiveContentTab] = useState<any>(
    urlContentTab || "community",
  );
  const [isResultsDrawerOpen, setIsResultsDrawerOpen] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const currentProjectIdRef = useRef<string | null>(null);

  const toggleSection = (section: keyof typeof sectionsEnabled) => {
    setSectionsEnabled((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateContentTab = useCallback(
    (tab: any) => {
      setActiveContentTab(tab);
      const urlParams = new URLSearchParams(searchParams.toString());
      urlParams.set("tab", tab);
      urlParams.set(
        "mode",
        generationMode === "image" ? "ai-image-gen" : "ai-video-gen",
      );
      if (projectId) urlParams.set("projectId", projectId);
      router.replace(`/apps/video-generation?${urlParams.toString()}`, {
        scroll: false,
      });
    },
    [searchParams, router, projectId, generationMode],
  );

  // Switch to image model if mode is image
  useEffect(() => {
    if (generationMode === "image" && selectedVideoModel) {
      setSelectedVideoModel(null);
    } else if (generationMode === "video" && selectedImageModel) {
      setSelectedImageModel(null);
    }
  }, [generationMode, selectedVideoModel, selectedImageModel]);

  // Restore recreate data from localStorage
  useEffect(() => {
    const restoreRecreateData = async () => {
      try {
        const storedData = localStorage.getItem("recreateData");
        if (!storedData) return;
        const recreateData = JSON.parse(storedData);

        if (
          (recreateData.type === "image" && generationMode === "image") ||
          (recreateData.type === "video" && generationMode === "video")
        ) {
          if (recreateData.prompt) setPrompt(recreateData.prompt);
          if (recreateData.aspectRatio)
            setSelectedAspectRatio(recreateData.aspectRatio as AspectRatio);
          if (recreateData.resolution)
            setSelectedResolution(recreateData.resolution as Resolution);

          if (generationMode === "image") {
            if (recreateData.style)
              setSelectedImageStyle(recreateData.style as ImageStyle);
            if (recreateData.imageCount) setImageCount(recreateData.imageCount);
          } else {
            if (recreateData.duration)
              setDuration(parseInt(recreateData.duration) || 8);
          }

          // Handle reference images restoration if URLs provided
          if (recreateData.referenceImageUrls?.length > 0) {
            try {
              const files = await Promise.all(
                recreateData.referenceImageUrls.map(
                  async (url: string, i: number) => {
                    const res = await fetch(url);
                    const blob = await res.blob();
                    return new File([blob], `ref-${i}.jpg`, {
                      type: blob.type,
                    });
                  },
                ),
              );
              setPromptImages(files);
              setPromptImagePreviews(files.map((f) => URL.createObjectURL(f)));
            } catch (e) {
              console.error("Ref restore error", e);
            }
          }

          updateContentTab("preview");
          localStorage.removeItem("recreateData");
          toast("Generation parameters loaded.");
        }
      } catch (e) {
        localStorage.removeItem("recreateData");
      }
    };
    if (!projectId) restoreRecreateData();
  }, [generationMode, projectId, updateContentTab]);

  // Restore animate design data
  useEffect(() => {
    const restoreAnimateData = async () => {
      try {
        const isAnimate = searchParams.get("animate") === "true";
        const urlPrompt = searchParams.get("prompt");
        const urlRef = searchParams.get("referenceImage");
        const storedStr = localStorage.getItem("animateDesignData");

        let data: any = null;
        if (isAnimate && urlPrompt && urlRef) {
          data = {
            type: "video",
            prompt: decodeURIComponent(urlPrompt),
            referenceImageUrls: [decodeURIComponent(urlRef)],
          };
        } else if (storedStr) {
          data = JSON.parse(storedStr);
        }

        if (data && generationMode === "video" && data.type === "video") {
          if (data.prompt) setPrompt(data.prompt);
          if (data.referenceImageUrls?.length > 0) {
            const files = await Promise.all(
              data.referenceImageUrls.map(async (url: string, i: number) => {
                const res = await fetch(url);
                const blob = await res.blob();
                return new File([blob], `animate-ref-${i}.jpg`, {
                  type: blob.type,
                });
              }),
            );
            setPromptImages(files);
            setPromptImagePreviews(files.map((f) => URL.createObjectURL(f)));
          }
          localStorage.removeItem("animateDesignData");
          if (isAnimate) {
            const params = new URLSearchParams(searchParams.toString());
            ["animate", "prompt", "referenceImage", "designType"].forEach((k) =>
              params.delete(k),
            );
            window.history.replaceState(
              {},
              "",
              `${window.location.pathname}?${params.toString()}`,
            );
          }
          toast("Your design has been loaded for animation.");
        }
      } catch (e) {
        localStorage.removeItem("animateDesignData");
      }
    };
    if (!projectId && generationMode === "video") restoreAnimateData();
  }, [generationMode, projectId, searchParams]);

  // Fetch project data if projectId is provided
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId || !user?._id) return;

      try {
        setLoadingProject(true);
        const endpoint = `/inspire/generate/video/${projectId}`;
        const response = await apiResponse.get(endpoint, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.success) {
          const project = response.data.project;

          if (generationMode === "image") {
            const image = {
              id: project._id || project.id,
              generatedImageId: project._id || project.id,
              url: project.url,
              thumbnail: project.thumbnail || project.url,
              aspectRatio: project.aspectRatio as AspectRatio,
              resolution: project.resolution as Resolution,
              prompt: project.prompt || "",
              style: project.style || "realistic",
              createdAt: project.createdAt || new Date().toISOString(),
              referenceImageUrls: project.referenceImageUrls || [],
            };
            setGeneratedImages([image]);
            setSelectedImageIndex(0);
          } else {
            const video = {
              id: project._id || project.id,
              generatedVideoId: project._id || project.id,
              url: project.url,
              thumbnail: project.thumbnail || project.url,
              aspectRatio: (project.aspectRatio || "16:9") as AspectRatio,
              resolution: (project.resolution || "1080p") as Resolution,
              prompt: project.prompt || "",
              duration: project.duration || 8,
              createdAt: project.createdAt || new Date().toISOString(),
              startFrameUrl: project.startFrameUrl,
              endFrameUrl: project.endFrameUrl,
              referenceImageUrls: project.referenceImageUrls || [],
            };
            setGeneratedVideos([video]);
            setSelectedVideoIndex(0);
          }

          setPrompt(project.prompt || "");
          if (project.aspectRatio) setSelectedAspectRatio(project.aspectRatio);
          if (project.resolution) setSelectedResolution(project.resolution);
          if (project.duration) setDuration(project.duration);
          if (project.startFrameUrl)
            setStartFramePreview(project.startFrameUrl);
          if (project.endFrameUrl) setEndFramePreview(project.endFrameUrl);
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

  useEffect(() => {
    if (!serverUrlSocket) return;
    if (!socketRef.current) {
      const socket = io(serverUrlSocket, {
        transports: ["websocket", "polling"],
      });
      socketRef.current = socket;
      socket.on("generatingvideo", (data: any) => {
        if (isGenerating) {
          setGenerationProgress(Math.round(data.progress));
          if (data.progress > 0 && activeContentTab !== "preview") {
            updateContentTab("preview");
          }
        }
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isGenerating, activeContentTab, updateContentTab]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast("Please enter a prompt");
      return;
    }

    if (generationMode === "image") {
      if (!selectedImageModel) {
        toast("Please select an image model");
        return;
      }
      setIsGenerating(true);
      updateContentTab("preview");
      try {
        const response = await imageGenApi.generate(
          {
            prompt: prompt.trim(),
            modelId: selectedImageModel._id,
            aspectRatio: selectedAspectRatio,
            resolution: selectedResolution,
            style: selectedImageStyle,
            imageCount: imageCount,
          },
          promptImages.length > 0 ? promptImages : undefined,
        );
        if (response.success && response.data.images) {
          const newImages = response.data.images.map((img: any, i: number) => ({
            id: img.id || `img-${Date.now()}-${i}`,
            generatedImageId: img.id,
            url: img.url,
            thumbnail: img.url,
            aspectRatio: selectedAspectRatio,
            resolution: selectedResolution,
            prompt: prompt.trim(),
            style: selectedImageStyle,
            createdAt: new Date().toISOString(),
            referenceImageUrls: promptImagePreviews,
          }));
          setGeneratedImages((prev) => [...newImages, ...prev]);
          setSelectedImageIndex(0);
          toast(`Generated ${newImages.length} image(s)`);
        } else {
          toast(response.message || "Failed to generate image");
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    if (!selectedVideoModel) {
      toast("Please select a video model");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    updateContentTab("preview");

    try {
      const videoFiles: any = {};
      if (startFrame) videoFiles.startFrame = startFrame;
      if (endFrame) videoFiles.endFrame = endFrame;
      if (promptImages.length > 0) {
        videoFiles.imageInput = promptImages[0];
        if (promptImages.length > 1)
          videoFiles.referenceImages = promptImages.slice(1);
      }

      const response = await videoGenApi.generate(
        {
          prompt: prompt.trim(),
          modelId: selectedVideoModel._id,
          aspectRatio: selectedAspectRatio,
          resolution: selectedResolution,
          duration: duration,
          startFrameUrl: startFramePreview || undefined,
          endFrameUrl: endFramePreview || undefined,
        },
        Object.keys(videoFiles).length > 0 ? videoFiles : undefined,
      );

      if (response.success && response.data.videos) {
        const newVideos = response.data.videos.map(
          (vid: any, index: number) => ({
            id: vid.id || `vid-${Date.now()}-${index}`,
            generatedVideoId: vid.id,
            url: vid.url,
            thumbnail: vid.thumbnail,
            aspectRatio: selectedAspectRatio,
            resolution: selectedResolution,
            prompt: prompt.trim(),
            duration: vid.duration || duration,
            createdAt: new Date().toISOString(),
            startFrameUrl: startFramePreview,
            endFrameUrl: endFramePreview,
            referenceImageUrls: promptImagePreviews,
          }),
        );

        setGeneratedVideos((prev) => [...newVideos, ...prev]);
        setSelectedVideoIndex(0);
        setGenerationProgress(100);
        toast(`Successfully generated ${newVideos.length} video(s)`);
      } else {
        toast(response.message);
      }
    } catch (error: any) {
      console.error(error);
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
        className="flex-1 relative px-2 md:px-6 lg:px-20 mt-5"
      >
        <div className="bg-grid-black/[0.05] dark:bg-grid-white/[0.05] absolute inset-0 -z-10" />

        <div className="grid grid-cols-1 md:grid-cols-[27rem_1fr] gap-6 relative w-full md:h-[calc(100vh-10rem)] min-h-0">
          <div className="flex flex-col h-full min-h-0 overflow-hidden">
            <div className="flex items-start justify-between py-2 z-20">
              <div
                role="tablist"
                className="rounded-xl p-1 flex gap-4 bg-neutral-100 dark:bg-neutral-900"
              >
                <button
                  type="button"
                  onClick={() => {
                    setGenerationMode("video");
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("mode", "ai-video-gen");
                    router.replace(`${pathname}?${params.toString()}`, {
                      scroll: false,
                    });
                  }}
                  className={cn(
                    "flex items-center gap-2 text-sm py-2 px-3 rounded-lg transition-colors",
                    generationMode === "video"
                      ? "bg-neutral-200 dark:bg-neutral-800 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Video className="w-4 h-4" />
                  Video
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGenerationMode("image");
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("mode", "ai-image-gen");
                    router.replace(`${pathname}?${params.toString()}`, {
                      scroll: false,
                    });
                  }}
                  className={cn(
                    "flex items-center gap-2 text-sm py-2 px-3 rounded-lg transition-colors",
                    generationMode === "image"
                      ? "bg-neutral-200 dark:bg-neutral-800 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <ImageIcon className="w-4 h-4" />
                  Image
                </button>
              </div>

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
                      {activeContentTab === "preview" &&
                        (generationMode === "image" ? (
                          <ImagePreviewTab
                            generatedImages={generatedImages}
                            selectedImageIndex={selectedImageIndex}
                            onImageSelect={setSelectedImageIndex}
                            isGenerating={isGenerating}
                            generationProgress={generationProgress}
                            selectedAspectRatio={selectedAspectRatio}
                            onPromptRestore={(p) => setPrompt(p)}
                          />
                        ) : (
                          <VideoPreviewTab
                            generatedVideos={generatedVideos}
                            selectedVideoIndex={selectedVideoIndex}
                            onVideoSelect={setSelectedVideoIndex}
                            isGenerating={isGenerating}
                            generationProgress={generationProgress}
                            selectedAspectRatio={selectedAspectRatio}
                            onPromptRestore={(p) => setPrompt(p)}
                          />
                        ))}
                      {activeContentTab === "history" &&
                        (generationMode === "image" ? (
                          <ImageHistoryTab
                            onLoadToEditor={(image) => {
                              const urlParams = new URLSearchParams(
                                searchParams.toString(),
                              );
                              urlParams.set("projectId", image._id);
                              router.push(
                                `/apps/video-generation?${urlParams.toString()}`,
                              );
                              setIsResultsDrawerOpen(false);
                            }}
                            onTabChange={updateContentTab}
                          />
                        ) : (
                          <VideoHistoryTab
                            onLoadToEditor={(video) => {
                              const urlParams = new URLSearchParams(
                                searchParams.toString(),
                              );
                              urlParams.set("projectId", video._id);
                              router.push(
                                `/apps/video-generation?${urlParams.toString()}`,
                              );
                              setIsResultsDrawerOpen(false);
                            }}
                            onTabChange={updateContentTab}
                          />
                        ))}
                      {activeContentTab === "community" &&
                        (generationMode === "image" ? (
                          <ImageCommunityTab
                            onPromptSelect={(p) => {
                              setPrompt(p);
                              setIsResultsDrawerOpen(false);
                            }}
                            onTabChange={updateContentTab}
                          />
                        ) : (
                          <VideoCommunityTab
                            onPromptSelect={(p) => {
                              setPrompt(p);
                              setIsResultsDrawerOpen(false);
                            }}
                            onTabChange={updateContentTab}
                          />
                        ))}
                      {activeContentTab === "templates" &&
                        (generationMode === "image" ? (
                          <ImageTemplatesTab
                            onPromptSelect={(p) => {
                              setPrompt(p);
                              setIsResultsDrawerOpen(false);
                            }}
                            onTabChange={updateContentTab}
                          />
                        ) : (
                          <VideoTemplatesTab
                            onPromptSelect={(p) => {
                              setPrompt(p);
                              setIsResultsDrawerOpen(false);
                            }}
                            onTabChange={updateContentTab}
                          />
                        ))}
                      {activeContentTab === "tutorial" && (
                        <TutorialTab type={generationMode} />
                      )}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            <div className="flex flex-col h-full min-h-0 pt-4 overflow-hidden bg-white dark:bg-black/20 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm relative z-10">
              <div className="px-4 pb-4 shrink-0 overflow-y-auto hide-scrollbar space-y-3 flex-1">
                {generationMode === "video" && (
                  <PresetSlider currentSlide={0} onSlideChange={() => {}} />
                )}

                <ModelSelector
                  type={generationMode}
                  selectedModel={
                    generationMode === "image"
                      ? selectedImageModel
                      : selectedVideoModel
                  }
                  onSelectModel={
                    generationMode === "image"
                      ? setSelectedImageModel
                      : setSelectedVideoModel
                  }
                />

                {generationMode === "video" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-neutral-50 dark:bg-neutral-900">
                      {startFramePreview ? (
                        <>
                          <img
                            src={startFramePreview}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setStartFrame(null);
                              setStartFramePreview(null);
                            }}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                          >
                            <Trash size={12} />
                          </button>
                        </>
                      ) : (
                        <span className="text-[14px] text-neutral-500">
                          Start Frame
                        </span>
                      )}
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setStartFrame(f);
                            setStartFramePreview(URL.createObjectURL(f));
                          }
                        }}
                      />
                    </div>
                    <div className="relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-neutral-50 dark:bg-neutral-900">
                      {endFramePreview ? (
                        <>
                          <img
                            src={endFramePreview}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setEndFrame(null);
                              setEndFramePreview(null);
                            }}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                          >
                            <Trash size={12} />
                          </button>
                        </>
                      ) : (
                        <span className="text-[14px] text-neutral-500">
                          End Frame
                        </span>
                      )}
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setEndFrame(f);
                            setEndFramePreview(URL.createObjectURL(f));
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Prompt</label>
                  </div>
                  <PremiumInput
                    value={prompt}
                    onChange={setPrompt}
                    onSubmit={handleGenerate}
                    isGenerating={isGenerating}
                    placeholder={
                      generationMode === "image"
                        ? "Describe your image..."
                        : "Describe the motion..."
                    }
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

                {generationMode === "image" && (
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
                    <div className="flex items-center gap-1.5 pt-2 border-t">
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
                )}

                {generationMode === "video" && (
                  <div className="pb-4 shrink-0 md:overflow-y-auto pt-4 hide-scrollbar space-y-2 md:max-h-[calc(100vh-15rem)]">
                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          setSectionsEnabled({
                            ...sectionsEnabled,
                            avatar: !sectionsEnabled.avatar,
                          })
                        }
                        className="w-full flex justify-between p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-sm font-medium"
                      >
                        Avatar & Presenter
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-transform",
                            sectionsEnabled.avatar && "rotate-180",
                          )}
                        />
                      </button>
                      {sectionsEnabled.avatar && (
                        <div className="p-3 border rounded-lg">
                          <PresenterSelector
                            selectedPresenter={selectedPresenter}
                            onSelectPresenter={setSelectedPresenter}
                            onDrawerClose={() => {}}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          setSectionsEnabled({
                            ...sectionsEnabled,
                            resolution: !sectionsEnabled.resolution,
                          })
                        }
                        className="w-full flex justify-between p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-sm font-medium"
                      >
                        Resolution & Format
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-transform",
                            sectionsEnabled.resolution && "rotate-180",
                          )}
                        />
                      </button>
                      {sectionsEnabled.resolution && (
                        <div className="p-3 border rounded-lg space-y-3">
                          <ResolutionSelector
                            selectedResolution={selectedResolution}
                            selectedAspectRatio={selectedAspectRatio}
                            onResolutionChange={setSelectedResolution}
                            onAspectRatioChange={setSelectedAspectRatio}
                            onDrawerClose={() => {}}
                          />
                          {generationMode === "video" && (
                            <div className="pt-2 border-t">
                              <label className="text-sm font-medium mb-2 block text-font-primary">
                                Duration
                              </label>
                              <select
                                value={duration}
                                onChange={(e) =>
                                  setDuration(Number(e.target.value))
                                }
                                className="w-full px-3 py-2 bg-background border border-neutral-12 rounded-md text-sm"
                              >
                                <option value={4}>4 seconds</option>
                                <option value={8}>8 seconds</option>
                                {/* <option value={12}>12 seconds</option>
                                  <option value={16}>16 seconds</option>
                                  <option value={30}>30 seconds</option> */}
                              </select>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => toggleSection("advanced")}
                        className="w-full flex justify-between p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-sm font-medium"
                      >
                        Advanced Settings
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-transform",
                            sectionsEnabled.advanced && "rotate-180",
                          )}
                        />
                      </button>
                      {sectionsEnabled.advanced && (
                        <div className="p-3 bg-neutral-surface-subtle rounded-lg border border-neutral-12 space-y-3">
                          {/* Fixed Lens Toggle */}
                          <div className="rounded-xl p-3 bg-neutral-100 dark:bg-neutral-800 transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center",
                                    fixedLens
                                      ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                                      : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400",
                                  )}
                                >
                                  <svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                    Fixed Lens
                                  </p>
                                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Lock camera position
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                role="switch"
                                aria-checked={fixedLens}
                                aria-label="Fixed Lens"
                                onClick={() => setFixedLens(!fixedLens)}
                                className={cn(
                                  "relative inline-flex shrink-0 cursor-pointer items-center transition-all duration-200 ring-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 focus-visible:ring-offset-transparent rounded-full h-6 w-11",
                                  fixedLens
                                    ? "bg-neutral-900 dark:bg-neutral-100"
                                    : "bg-neutral-300 dark:bg-neutral-600",
                                )}
                              >
                                <span
                                  aria-hidden="true"
                                  className={cn(
                                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out",
                                    fixedLens
                                      ? "translate-x-5"
                                      : "translate-x-0.5",
                                  )}
                                />
                              </button>
                            </div>
                          </div>

                          {/* Audio Toggle */}
                          <div className="rounded-xl p-3 bg-neutral-100 dark:bg-neutral-800 transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center",
                                    audioEnabled
                                      ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                                      : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400",
                                  )}
                                >
                                  <Volume2 className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                    Include Audio
                                  </p>
                                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Add sound to video
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                role="switch"
                                aria-checked={audioEnabled}
                                aria-label="Audio"
                                onClick={() => setAudioEnabled(!audioEnabled)}
                                className={cn(
                                  "relative inline-flex shrink-0 cursor-pointer items-center transition-all duration-200 ring-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 focus-visible:ring-offset-transparent rounded-full h-6 w-11",
                                  audioEnabled
                                    ? "bg-neutral-900 dark:bg-neutral-100"
                                    : "bg-neutral-300 dark:bg-neutral-600",
                                )}
                              >
                                <span
                                  aria-hidden="true"
                                  className={cn(
                                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out",
                                    audioEnabled
                                      ? "translate-x-5"
                                      : "translate-x-0.5",
                                  )}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-4 py-3 border-t bg-white dark:bg-black z-10 space-y-3">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full h-11 text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      <span>{generationProgress}%</span>
                    </div>
                  ) : (
                    <>
                      {generationMode === "image" ? (
                        <Wand2 size={16} />
                      ) : (
                        <Sparkles size={16} />
                      )}
                      <span>
                        Generate{" "}
                        {generationMode === "image" ? "Image" : "Video"}
                      </span>
                    </>
                  )}
                </button>
              </div>
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
              {activeContentTab === "preview" &&
                (generationMode === "image" ? (
                  <ImagePreviewTab
                    generatedImages={generatedImages}
                    selectedImageIndex={selectedImageIndex}
                    onImageSelect={setSelectedImageIndex}
                    isGenerating={isGenerating}
                    generationProgress={generationProgress}
                    selectedAspectRatio={selectedAspectRatio}
                    onPromptRestore={(p) => setPrompt(p)}
                  />
                ) : (
                  <VideoPreviewTab
                    generatedVideos={generatedVideos}
                    selectedVideoIndex={selectedVideoIndex}
                    onVideoSelect={setSelectedVideoIndex}
                    isGenerating={isGenerating}
                    generationProgress={generationProgress}
                    selectedAspectRatio={selectedAspectRatio}
                    onPromptRestore={(p) => setPrompt(p)}
                  />
                ))}
              {activeContentTab === "history" &&
                (generationMode === "image" ? (
                  <ImageHistoryTab
                    onLoadToEditor={(image) => {
                      const urlParams = new URLSearchParams(
                        searchParams.toString(),
                      );
                      urlParams.set("projectId", image._id);
                      router.push(
                        `/apps/video-generation?${urlParams.toString()}`,
                      );
                    }}
                    onTabChange={updateContentTab}
                  />
                ) : (
                  <VideoHistoryTab
                    onLoadToEditor={(video) => {
                      const urlParams = new URLSearchParams(
                        searchParams.toString(),
                      );
                      urlParams.set("projectId", video._id);
                      router.push(
                        `/apps/video-generation?${urlParams.toString()}`,
                      );
                    }}
                    onTabChange={updateContentTab}
                  />
                ))}
              {activeContentTab === "community" &&
                (generationMode === "image" ? (
                  <ImageCommunityTab
                    onPromptSelect={(p) => setPrompt(p)}
                    onTabChange={updateContentTab}
                  />
                ) : (
                  <VideoCommunityTab
                    onPromptSelect={(p) => setPrompt(p)}
                    onTabChange={updateContentTab}
                  />
                ))}
              {activeContentTab === "templates" &&
                (generationMode === "image" ? (
                  <ImageTemplatesTab
                    onPromptSelect={(p) => setPrompt(p)}
                    onTabChange={updateContentTab}
                  />
                ) : (
                  <VideoTemplatesTab
                    onPromptSelect={(p) => setPrompt(p)}
                    onTabChange={updateContentTab}
                  />
                ))}
              {activeContentTab === "tutorial" && (
                <TutorialTab type={generationMode} />
              )}
            </div>
          </div>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
}

export default VideoGenerationPage;
