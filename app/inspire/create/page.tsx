"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUserContext } from "@/context/AuthenticatedContext";
import { apiResponse, serverUrlSocket } from "@/utils/apiResponse";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader2,
  ArrowLeft,
  Sparkles,
  Video,
  Mic,
  Play,
  Pause,
  RefreshCw,
  History,
  BookOpen,
  ViewIcon,
  Download,
  Share2,
  MoreHorizontal,
  Copy,
  Clock,
  Maximize2,
  Users,
  Image as ImageIcon,
  Wand2,
  Palette,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import withAuth from "@/helper/hoc/withAuth";
import { PresenterSelector } from "@/components/video/presenter-selector";
import { ResolutionSelector } from "@/components/video/resolution-selector";
import { VoiceSelector } from "@/components/video/voice-selector";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { Toaster } from "@/components/ui/sonner";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  User,
  Volume2,
  Monitor,
  Settings,
  Menu,
} from "lucide-react";
import { IconTemplate } from "@tabler/icons-react";
import {
  ImageCommunityTab,
  VideoCommunityTab,
  ImagePreviewTab,
  VideoPreviewTab,
  ImageTemplatesTab,
  VideoTemplatesTab,
  TutorialTab,
} from "@/components/inspire";
import { ModelSelector } from "@/components/inspire/model-selector";
import { Model, Presenter, Voice } from "@/types/inspire";
import { imageGenApi, videoGenApi } from "@/utils/inspire-api";

export type Resolution = "1080p" | "720p" | "480p" | "4K";
export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:3";

// Re-export types from types/inspire for backward compatibility
export type { Presenter, Voice, Model } from "@/types/inspire";

// Preset slides data - replace with your actual video URLs
const PRESET_SLIDES = [
  {
    id: "general",
    title: "General",
    description: "1.5 Pro",
    video:
      "https://video-previews.elements.envatousercontent.com/h264-video-previews/07f8b177-8b26-4863-9ee3-ca914880047a/60857198.mp4",
    poster:
      "https://elements-resized.envatousercontent.com/elements-video-cover-images/files/658848604/Preview.jpg?w=500&amp;cf_fit=cover&amp;q=85&amp;format=auto&amp;s=e83c5c6643f8323aaf4b70e477d523cf6f42170ba97c30fc9eb11dbfa689fb38",
  },
  {
    id: "cinematic",
    title: "Cinematic",
    description: "Film Quality",
    video:
      "https://pikaso.cdnpk.net/private/production/1982745598/ade32d81-64c6-40c5-9158-3a55e043ab03-0.mp4?token=exp=1767052800~hmac=85310bc7f718fb34ce3195a0f1bbc123fcce73a1f547ee755e858068b8495def",
    poster:
      "https://elements-resized.envatousercontent.com/elements-video-cover-images/files/475668830/Image%20Preview.png?w=500&cf_fit=cover&q=85&format=auto&s=408168a1045e2ffd78e224fdc42667d0a995c6556470705689422c2396c97439",
  },
  {
    id: "anime",
    title: "Anime",
    description: "Japanese Style",
    video:
      "https://pikaso.cdnpk.net/private/production/2148868918/7a13c0a7-62d3-4b3d-9c61-42ddf18c3f0c-0.mp4?token=exp=1767052800~hmac=611a892415752a030387ce949b0a91a55de53f2f99a63bb73de94cd27f5b04f1",
    poster: "https://static.higgsfield.ai/seedance-1-5-preset-general.webp",
  },
  {
    id: "realistic",
    title: "Realistic",
    description: "Photo-Real",
    video:
      "https://pikaso.cdnpk.net/private/production/2154869439/ed9b1fb7-c711-4041-a18d-6888b3fc55f5-0.mp4?token=exp=1767052800~hmac=4c0eb068ebe3826c1c2b75735ed1fc57ec22b627198194f11709122c911e97c9",
    poster: "https://static.higgsfield.ai/seedance-1-5-preset-general.webp",
  },
  {
    id: "creative",
    title: "Creative",
    description: "Artistic Style",
    video:
      "https://pikaso.cdnpk.net/private/production/2779811314/89d77d53-d558-4ef8-8fae-33ae26d54307-0.mp4?token=exp=1767052800~hmac=f6602714ec905cf17bef307e091136a451bacfd68ee73b79cb3d8ef2f6cf105d",
    poster: "https://static.higgsfield.ai/seedance-1-5-preset-general.webp",
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

  // Auto-slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      onSlideChange((currentSlide + 1) % PRESET_SLIDES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [currentSlide, onSlideChange]);

  // Scroll to current slide and manage video playback
  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({
        left: currentSlide * slideWidth,
        behavior: "smooth",
      });
    }

    // Pause all videos and play only the current one
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
      {/* Slider Container */}
      <div
        ref={sliderRef}
        className="flex overflow-x-hidden scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {PRESET_SLIDES.map((slide, index) => (
          <div key={slide.id} className="min-w-full snap-center">
            <figure
              className="aspect-[2.3] w-full relative select-none overflow-hidden rounded-xl cursor-pointer"
              onClick={() => onSlideChange(index)}
            >
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
              >
                Your browser does not support the video.
              </video>
              <div className="absolute inset-0 pointer-events-none bg-black/30" />
              <figcaption className="z-10 absolute left-0 bottom-0 w-full pl-3 pb-3 pr-1.5">
                <p className="truncate w-full uppercase text-xs font-semibold text-white">
                  {slide.title}
                </p>
                <p className="text-xs text-white/80">{slide.description}</p>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {PRESET_SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSlideChange(index)}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-300",
              currentSlide === index
                ? "bg-white w-4"
                : "bg-white/50 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={() =>
          onSlideChange(
            (currentSlide - 1 + PRESET_SLIDES.length) % PRESET_SLIDES.length
          )
        }
        className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
        aria-label="Previous slide"
      >
        <ChevronUp className="w-4 h-4 -rotate-90" />
      </button>
      <button
        type="button"
        onClick={() => onSlideChange((currentSlide + 1) % PRESET_SLIDES.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
        aria-label="Next slide"
      >
        <ChevronDown className="w-4 h-4 -rotate-90" />
      </button>
    </div>
  );
}

function VideoCreatePage() {
  const router = useRouter();
  const { user } = useUserContext();
  const { toast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Get mode and project ID from URL parameters
  const urlMode = searchParams.get("mode");
  const projectId = searchParams.get("projectId");

  const [selectedPresenter, setSelectedPresenter] = useState<Presenter | null>(
    null
  );
  const [selectedResolution, setSelectedResolution] =
    useState<Resolution>("1080p");
  const [selectedAspectRatio, setSelectedAspectRatio] =
    useState<AspectRatio>("1:1");
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCloningVoice, setIsCloningVoice] = useState(false);
  const [clonedVoiceId, setClonedVoiceId] = useState<string | null>(null);

  // Generated videos state
  const [generatedVideos, setGeneratedVideos] = useState<
    {
      id: string;
      url: string;
      thumbnail: string;
      aspectRatio: AspectRatio;
      resolution: Resolution;
      prompt: string;
      createdAt: string;
    }[]
  >([]);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [loadingProject, setLoadingProject] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const currentProjectIdRef = useRef<string | null>(null);

  // Generated images state
  type ImageStyle =
    | "realistic"
    | "anime"
    | "digital-art"
    | "oil-painting"
    | "watercolor"
    | "3d-render";
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
    }[]
  >([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImageStyle, setSelectedImageStyle] =
    useState<ImageStyle>("realistic");
  const [imageCount, setImageCount] = useState(1);
  const [selectedImageModel, setSelectedImageModel] = useState<Model | null>(
    null
  );
  const [selectedVideoModel, setSelectedVideoModel] = useState<Model | null>(
    null
  );

  const pathname = usePathname();

  // Generation mode: image or video - initialize from URL parameter
  const [generationMode, setGenerationMode] = useState<"image" | "video">(
    urlMode === "ai-image-gen" ? "image" : "video"
  );

  // Listen to URL parameter changes and update generation mode (for browser back/forward navigation)
  useEffect(() => {
    const currentMode = searchParams.get("mode");
    const expectedMode = currentMode === "ai-image-gen" ? "image" : "video";

    // Only update if the URL mode differs from current state
    if (generationMode !== expectedMode) {
      setGenerationMode(expectedMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only run when URL changes (not when state changes to avoid loops)

  // Clear selected models when switching modes to prevent showing wrong type
  useEffect(() => {
    if (generationMode === "image") {
      // Clear video model selection when switching to image mode
      if (selectedVideoModel) {
        setSelectedVideoModel(null);
      }
    } else {
      // Clear image model selection when switching to video mode
      if (selectedImageModel) {
        setSelectedImageModel(null);
      }
    }
  }, [generationMode]);

  // Fetch project data if projectId is provided
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId || !user?._id) return;

      try {
        setLoadingProject(true);

        // Use the correct endpoint based on generation mode
        let endpoint = "";
        if (generationMode === "image") {
          endpoint = `/inspire/generate/image/${projectId}`;
        } else {
          endpoint = `/inspire/generate/video/${projectId}`;
        }

        const response = await apiResponse.get(endpoint, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.success) {
          const project = response.data.project;

          // Handle image generation
          if (generationMode === "image") {
            // For GeneratedImage, the project itself is the image
            const image = {
              id: project._id || project.id,
              url: project.url,
              thumbnail: project.thumbnail || project.url,
              aspectRatio: (project.aspectRatio || "16:9") as AspectRatio,
              resolution: (project.resolution || "1080p") as Resolution,
              prompt: project.prompt || "",
              style: (project.style || "realistic") as ImageStyle,
              createdAt: project.createdAt || new Date().toISOString(),
            };

            setGeneratedImages([image]);
            setSelectedImageIndex(0);

            // Restore prompt
            if (project.prompt) {
              setPrompt(project.prompt);
            }

            // Restore aspect ratio and resolution if available
            if (project.aspectRatio) {
              setSelectedAspectRatio(project.aspectRatio as AspectRatio);
            }
            if (project.resolution) {
              setSelectedResolution(project.resolution as Resolution);
            }
            if (project.style) {
              setSelectedImageStyle(project.style as ImageStyle);
            }

            // Load the model if modelId is available
            if (project.modelId) {
              // You might want to fetch and set the model here
              // For now, we'll just store the modelId
            }
          } else {
            // Handle video generation
            // For GeneratedVideo, the project itself is the video
            const video = {
              id: project._id || project.id,
              url: project.url,
              thumbnail: project.thumbnail || project.url,
              aspectRatio: (project.aspectRatio || "16:9") as AspectRatio,
              resolution: (project.resolution || "1080p") as Resolution,
              prompt: project.prompt || "",
              createdAt: project.createdAt || new Date().toISOString(),
            };

            setGeneratedVideos([video]);
            setSelectedVideoIndex(0);

            // Restore prompt
            if (project.prompt) {
              setPrompt(project.prompt);
            }

            // Restore aspect ratio and resolution if available
            if (project.aspectRatio) {
              setSelectedAspectRatio(project.aspectRatio as AspectRatio);
            }
            if (project.resolution) {
              setSelectedResolution(project.resolution as Resolution);
            }

            // Load presenter, voice if available
            if (project.presenterId) {
              // You might want to fetch and set the presenter here
            }
            if (project.voiceId) {
              // You might want to fetch and set the voice here
            }
          }
        }
      } catch (error: any) {
        console.error("Error fetching project:", error);
        toast({
          title: "Failed to load project",
          description:
            error?.response?.data?.message || "Could not load project data",
          variant: "destructive",
        });
      } finally {
        setLoadingProject(false);
      }
    };

    fetchProject();
  }, [projectId, user?._id, generationMode, toast]);

  // Tab states
  const [activeContentTab, setActiveContentTab] = useState<
    "community" | "preview" | "templates" | "tutorial"
  >("preview");

  // Sidebar drawer state for mobile/tablet
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  // Set up socket connection for video generation progress
  useEffect(() => {
    if (!serverUrlSocket) {
      console.warn("Socket URL not configured");
      return;
    }

    // Only create socket if it doesn't exist
    if (!socketRef.current) {
      const socket = io(serverUrlSocket, {
        transports: ["websocket", "polling"],
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Socket connected for video generation");
      });

      socket.on(
        "generatingvideo",
        (data: { projectId: string; progress: number }) => {
          // Update progress if we're currently generating (either matching projectId or if isGenerating is true)
          // The server generates its own projectId, so we track by isGenerating state
          if (isGenerating && generationMode === "video") {
            setGenerationProgress(Math.round(data.progress));

            // Switch to preview tab when generation starts
            if (data.progress > 0 && activeContentTab !== "preview") {
              setActiveContentTab("preview");
            }
          }
        }
      );

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [serverUrlSocket, activeContentTab, isGenerating, generationMode]);

  // Form states
  const [startFrame, setStartFrame] = useState<File | null>(null);
  const [endFrame, setEndFrame] = useState<File | null>(null);
  const [startFramePreview, setStartFramePreview] = useState<string | null>(
    null
  );
  const [endFramePreview, setEndFramePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [promptImages, setPromptImages] = useState<File[]>([]);
  const [promptImagePreviews, setPromptImagePreviews] = useState<string[]>([]);
  const [duration, setDuration] = useState(8);
  const [aspectRatio, setAspectRatio] = useState("auto");
  const [resolution, setResolution] = useState("720p");
  const [fixedLens, setFixedLens] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Section toggle states
  const [sectionsEnabled, setSectionsEnabled] = useState({
    avatar: false,
    audio: false,
    resolution: false,
    advanced: false,
  });

  // Preset slider state
  const [currentPresetSlide, setCurrentPresetSlide] = useState(0);

  const toggleSection = (section: keyof typeof sectionsEnabled) => {
    setSectionsEnabled((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle file uploads with preview
  const handleFileUpload = (
    file: File | null,
    setFile: (file: File | null) => void,
    setPreview: (preview: string | null) => void
  ) => {
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  return (
    <div className="flex relative w-full h-[100dvh] overflow-hidden bg-white dark:bg-black">
      <Toaster />
      <AppSidebar />
      <div
        ref={scrollContainerRef}
        className="flex-1 flex flex-col overflow-auto will-change-scroll scroll-container"
      >
        <TopNavWithAurora
          scrollContainerRef={
            scrollContainerRef as React.RefObject<HTMLDivElement>
          }
        />
        <div id="main-content" className="flex-1 px-2 lg:px-8">
          <div className="grid grid-cols-[1fr] md:grid-cols-[27rem_1fr] gap-2 md:h-[calc(100vh-4rem)] relative w-full">
            <div className="flex flex-col max-h-full min-h-0">
              {/* Mode Selector: Video / Image Tabs */}
              <div className="flex items-start justify-between lg:px-4 py-2 mb-1 z-40">
                <div
                  role="tablist"
                  aria-orientation="horizontal"
                  className="rounded-xl p-1 flex gap-4 bg-neutral-100 dark:bg-neutral-900"
                  tabIndex={0}
                  data-orientation="horizontal"
                  style={{ outline: "none" }}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={generationMode === "video"}
                    data-state={
                      generationMode === "video" ? "active" : "inactive"
                    }
                    onClick={() => {
                      setGenerationMode("video");
                      const urlParams = new URLSearchParams();
                      urlParams.set("mode", "ai-video-gen");
                      if (projectId) {
                        urlParams.set("projectId", projectId);
                      }
                      router.replace(
                        `/inspire/create?${urlParams.toString()}`,
                        { scroll: false }
                      );
                    }}
                    className={cn(
                      "relative min-w-fit cursor-pointer transition-colors flex items-center justify-center gap-2 text-sm py-2 px-3",
                      generationMode === "video"
                        ? "text-font-primary border border-separator-card flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 rounded-lg"
                        : "text-font-secondary hover:text-font-primary flex items-center justify-center"
                    )}
                    tabIndex={generationMode === "video" ? -1 : 0}
                    data-orientation="horizontal"
                  >
                    <Video className="w-4 h-4" />
                    Video
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={generationMode === "image"}
                    data-state={
                      generationMode === "image" ? "active" : "inactive"
                    }
                    onClick={() => {
                      setGenerationMode("image");
                      const urlParams = new URLSearchParams();
                      urlParams.set("mode", "ai-image-gen");
                      if (projectId) {
                        urlParams.set("projectId", projectId);
                      }
                      router.replace(
                        `/inspire/create?${urlParams.toString()}`,
                        { scroll: false }
                      );
                    }}
                    className={cn(
                      "relative min-w-fit cursor-pointer transition-colors flex items-center justify-center gap-2 text-sm py-2 px-3",
                      generationMode === "image"
                        ? "text-font-primary border border-separator-card flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 rounded-lg"
                        : "text-font-secondary hover:text-font-primary flex items-center justify-center"
                    )}
                    tabIndex={generationMode === "image" ? -1 : 0}
                    data-orientation="horizontal"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Image
                  </button>
                </div>
                {/* Sidebar toggle button for mobile/tablet */}
                <button
                  type="button"
                  onClick={() => setSidebarDrawerOpen(true)}
                  className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="Open sidebar"
                >
                  <Menu className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                </button>
              </div>

              <div
                className={cn(
                  "absolute w-full lg:w-[27rem]",
                  generationMode === "video" ? "top-[50px]" : "top-[50px]"
                )}
              >
                <form
                  className="generate-form generate-form--asset flex flex-col shrink-0 max-h-[calc(100vh-7rem)] relative z-10 border-t-0 rounded-b-2xl px-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Trigger the generate button click
                    const generateBtn = document.getElementById(
                      "react-aria3512376871-_r_1f_"
                    );
                    if (generateBtn) {
                      (generateBtn as HTMLButtonElement).click();
                    }
                  }}
                >
                  {/* Image Generation Form */}
                  {generationMode === "image" && (
                    <div className="md:px-4 pb-4 shrink-0 md:overflow-y-auto pt-4 hide-scrollbar space-y-4 md:max-h-[calc(100vh-15rem)]">
                      {/* Model Selection */}
                      <ModelSelector
                        type="image"
                        selectedModel={selectedImageModel}
                        onSelectModel={setSelectedImageModel}
                      />

                      {/* Prompt Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Prompt
                        </label>
                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Describe the image you want to generate..."
                          className="w-full min-h-[100px] p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-600 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 resize-none focus:outline-none focus:ring-2 focus:ring-transparent focus:border-transparent"
                        />

                        {/* Reference Images (Optional) */}
                        <div className="space-y-2">
                          <label className="text-xs text-neutral-500 dark:text-neutral-400">
                            Reference Images{" "}
                            <span className="text-neutral-400">
                              (optional - for style/context)
                            </span>
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {promptImagePreviews.map((preview, index) => (
                              <div
                                key={index}
                                className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-neutral-300 dark:border-neutral-600"
                              >
                                <img
                                  src={preview}
                                  alt={`Reference ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImages = [...promptImages];
                                    const newPreviews = [
                                      ...promptImagePreviews,
                                    ];
                                    newImages.splice(index, 1);
                                    newPreviews.splice(index, 1);
                                    setPromptImages(newImages);
                                    setPromptImagePreviews(newPreviews);
                                  }}
                                  className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 z-10"
                                >
                                  <svg
                                    width={12}
                                    height={12}
                                    viewBox="0 0 16 16"
                                    fill="none"
                                  >
                                    <path
                                      d="M12 4L4 12M4 4l8 8"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                            {promptImagePreviews.length < 5 && (
                              <label className="w-20 h-20 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-cyan-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                <input
                                  type="file"
                                  accept="image/jpeg,image/jpg,image/png,image/webp"
                                  className="sr-only"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setPromptImages([
                                          ...promptImages,
                                          file,
                                        ]);
                                        setPromptImagePreviews([
                                          ...promptImagePreviews,
                                          reader.result as string,
                                        ]);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <ImageIcon className="w-5 h-5 text-neutral-400" />
                              </label>
                            )}
                          </div>
                          {promptImagePreviews.length > 0 && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              These images provide style/context reference for
                              image generation.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Style Selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Style
                        </label>
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
                              value: "digital-art",
                              label: "Digital Art",
                              image:
                                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop",
                            },
                            {
                              value: "oil-painting",
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
                              value: "3d-render",
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
                                  : "hover:ring-2 hover:ring-neutral-300 dark:hover:ring-neutral-600"
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
                                      : "bg-black/40 group-hover:bg-black/30"
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
                                    : "bg-black/60"
                                )}
                              >
                                <span className="text-xs font-medium text-white">
                                  {style.label}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Aspect Ratio */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Aspect Ratio
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            {
                              value: "16:9" as const,
                              label: "16:9",
                              desc: "YouTube, TV",
                            },
                            {
                              value: "9:16" as const,
                              label: "9:16",
                              desc: "TikTok, Reels",
                            },
                            {
                              value: "1:1" as const,
                              label: "1:1",
                              desc: "Instagram",
                            },
                            {
                              value: "4:3" as const,
                              label: "4:3",
                              desc: "Presentations",
                            },
                          ].map((ratio) => (
                            <button
                              key={ratio.value}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedAspectRatio(ratio.value);
                              }}
                              className={cn(
                                "p-3 rounded-lg text-xs font-medium transition-all text-left",
                                selectedAspectRatio === ratio.value
                                  ? "bg-cyan-500 text-white"
                                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                              )}
                            >
                              <div className="font-semibold">{ratio.label}</div>
                              <div
                                className={cn(
                                  "text-[10px] mt-0.5",
                                  selectedAspectRatio === ratio.value
                                    ? "text-white/80"
                                    : "text-neutral-500 dark:text-neutral-400"
                                )}
                              >
                                {ratio.desc}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Number of Images */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Number of Images
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[1, 2, 3, 4].map((count) => (
                            <button
                              key={count}
                              type="button"
                              onClick={() => setImageCount(count)}
                              className={cn(
                                "p-2 rounded-lg text-xs font-medium transition-all",
                                imageCount === count
                                  ? "bg-cyan-500 text-white"
                                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                              )}
                            >
                              {count}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Video Generation Form */}
                  {generationMode === "video" && (
                    <div className="md:px-4 pb-4 shrink-0 md:overflow-y-auto pt-4 hide-scrollbar space-y-2 md:max-h-[calc(100vh-15rem)]">
                      <fieldset>
                        <PresetSlider
                          currentSlide={currentPresetSlide}
                          onSlideChange={setCurrentPresetSlide}
                        />
                      </fieldset>

                      {/* Model Selection */}
                      <div className="mb-2">
                        <ModelSelector
                          type="video"
                          selectedModel={selectedVideoModel}
                          onSelectModel={setSelectedVideoModel}
                        />
                      </div>

                      <div className="md:overflow-y-auto relative">
                        <div
                          id="form-video-dropzones"
                          className="grid grid-cols-2 gap-2 mb-4"
                        >
                          <label className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 size-full rounded-xl grid grid-cols-1 grid-rows-1 justify-center items-center p-3 md:py-6 md:px-9 transition cursor-pointer hover:border-cyan-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 relative overflow-hidden">
                            {startFramePreview ? (
                              <>
                                <img
                                  src={startFramePreview}
                                  alt="Start frame preview"
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setStartFrame(null);
                                    setStartFramePreview(null);
                                  }}
                                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 z-10"
                                >
                                  <svg
                                    width={16}
                                    height={16}
                                    viewBox="0 0 16 16"
                                    fill="none"
                                  >
                                    <path
                                      d="M12 4L4 12M4 4l8 8"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                              </>
                            ) : (
                              <>
                                <input
                                  className="sr-only"
                                  accept="image/jpeg,image/jpg,image/png"
                                  type="file"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleFileUpload(
                                      file,
                                      setStartFrame,
                                      setStartFramePreview
                                    );
                                  }}
                                />
                                <div
                                  id="radix-_r_3_"
                                  aria-haspopup="menu"
                                  aria-expanded="false"
                                  data-state="closed"
                                  className="@container text-center w-full text-nowrap text-sm *:flex *:flex-col *:justify-center *:items-center"
                                >
                                  <div className="grid justify-center">
                                    <div
                                      aria-hidden="true"
                                      className="grid justify-center items-center rounded-full backdrop-blur-xs mix-blend-luminosity bg-white-4 aspect-square border-white-50 svg:text-font-secondary size-8 @[15rem]:size-12 svg:size-4! @[15rem]:svg:size-6!"
                                      style={{
                                        boxShadow:
                                          "rgba(0, 0, 0, 0) 0px 128.852px 36.007px 0px, rgba(0, 0, 0, 0.01) 0px 82.429px 33.031px 0px, rgba(0, 0, 0, 0.05) 0px 46.422px 27.972px 0px, rgba(0, 0, 0, 0.09) 0px 20.533px 20.533px 0px, rgba(0, 0, 0, 0.1) 0px 5.059px 11.308px 0px, rgba(185, 185, 185, 0.35) 0px -0.298px 5.356px 0px inset",
                                      }}
                                    >
                                      <div className="flex items-center justify-center p-1.5 size-9 rounded-lg bg-surface-primary shadow-[0_-1.872px_0_0_rgba(20,1,8,0.30)_inset,0_3.744px_3.744px_0_rgba(0,0,0,0.25)]">
                                        <svg
                                          className="size-5! text-white!"
                                          aria-hidden="true"
                                          width="24px"
                                          height="24px"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M3.75 16L7.64677 12.3325C7.84356 12.1472 8.15191 12.1519 8.343 12.343L12 16L13.6464 14.3536C13.8417 14.1583 14.1583 14.1583 14.3536 14.3536L19.5 19.5M4.75 20.25H19.25C19.8023 20.25 20.25 19.8023 20.25 19.25V4.75C20.25 4.19772 19.8023 3.75 19.25 3.75H4.75C4.19772 3.75 3.75 4.19772 3.75 4.75V19.25C3.75 19.8023 4.19772 20.25 4.75 20.25ZM15.75 9C15.75 9.82843 15.0784 10.5 14.25 10.5C13.4216 10.5 12.75 9.82843 12.75 9C12.75 8.17157 13.4216 7.5 14.25 7.5C15.0784 7.5 15.75 8.17157 15.75 9Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-2 @[15rem]:mt-4 text-sm font-medium text-font-secondary">
                                    <p className="md:text-font-primary text-sm">
                                      Start frame
                                    </p>
                                    <p className="text-font-secondary text-xs">
                                      (Optional)
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}
                          </label>
                          <label className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 size-full rounded-xl grid grid-cols-1 grid-rows-1 justify-center items-center p-3 md:py-6 md:px-9 transition cursor-pointer hover:border-cyan-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 relative overflow-hidden">
                            {endFramePreview ? (
                              <>
                                <img
                                  src={endFramePreview}
                                  alt="End frame preview"
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setEndFrame(null);
                                    setEndFramePreview(null);
                                  }}
                                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 z-10"
                                >
                                  <svg
                                    width={16}
                                    height={16}
                                    viewBox="0 0 16 16"
                                    fill="none"
                                  >
                                    <path
                                      d="M12 4L4 12M4 4l8 8"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                              </>
                            ) : (
                              <>
                                <input
                                  className="sr-only"
                                  accept="image/jpeg,image/jpg,image/png"
                                  type="file"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleFileUpload(
                                      file,
                                      setEndFrame,
                                      setEndFramePreview
                                    );
                                  }}
                                />
                                <div
                                  id="radix-_r_8_"
                                  aria-haspopup="menu"
                                  aria-expanded="false"
                                  data-state="closed"
                                  className="@container text-center w-full text-nowrap text-sm *:flex *:flex-col *:justify-center *:items-center"
                                >
                                  <div className="grid justify-center">
                                    <div
                                      aria-hidden="true"
                                      className="grid justify-center items-center rounded-full backdrop-blur-xs mix-blend-luminosity bg-white-4 aspect-square border-white-50 svg:text-font-secondary size-8 @[15rem]:size-12 svg:size-4! @[15rem]:svg:size-6!"
                                      style={{
                                        boxShadow:
                                          "rgba(0, 0, 0, 0) 0px 128.852px 36.007px 0px, rgba(0, 0, 0, 0.01) 0px 82.429px 33.031px 0px, rgba(0, 0, 0, 0.05) 0px 46.422px 27.972px 0px, rgba(0, 0, 0, 0.09) 0px 20.533px 20.533px 0px, rgba(0, 0, 0, 0.1) 0px 5.059px 11.308px 0px, rgba(185, 185, 185, 0.35) 0px -0.298px 5.356px 0px inset",
                                      }}
                                    >
                                      <div className="flex items-center justify-center p-1.5 size-9 rounded-lg bg-surface-primary shadow-[0_-1.872px_0_0_rgba(20,1,8,0.30)_inset,0_3.744px_3.744px_0_rgba(0,0,0,0.25)]">
                                        <svg
                                          className="size-5! text-white!"
                                          aria-hidden="true"
                                          width="24px"
                                          height="24px"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M3.75 16L7.64677 12.3325C7.84356 12.1472 8.15191 12.1519 8.343 12.343L12 16L13.6464 14.3536C13.8417 14.1583 14.1583 14.1583 14.3536 14.3536L19.5 19.5M4.75 20.25H19.25C19.8023 20.25 20.25 19.8023 20.25 19.25V4.75C20.25 4.19772 19.8023 3.75 19.25 3.75H4.75C4.19772 3.75 3.75 4.19772 3.75 4.75V19.25C3.75 19.8023 4.19772 20.25 4.75 20.25ZM15.75 9C15.75 9.82843 15.0784 10.5 14.25 10.5C13.4216 10.5 12.75 9.82843 12.75 9C12.75 8.17157 13.4216 7.5 14.25 7.5C15.0784 7.5 15.75 8.17157 15.75 9Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-2 @[15rem]:mt-4 text-sm font-medium text-font-secondary">
                                    <p className="md:text-font-primary text-sm">
                                      End frame
                                    </p>
                                    <p className="text-font-secondary block text-xs">
                                      (Optional)
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}
                          </label>
                        </div>

                        {/* Prompt Input */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Prompt
                          </label>
                          <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the scene you imagine, with details..."
                            className="w-full min-h-[100px] p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-600 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 resize-none focus:outline-none focus:ring-2 focus:ring-transparent focus:border-transparent"
                          />

                          {/* Reference Images (Optional) */}
                          <div className="space-y-2">
                            <label className="text-xs text-neutral-500 dark:text-neutral-400">
                              Reference Images{" "}
                              <span className="text-neutral-400">
                                (optional - for style/context)
                              </span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {promptImagePreviews.map((preview, index) => (
                                <div
                                  key={index}
                                  className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-neutral-300 dark:border-neutral-600"
                                >
                                  <img
                                    src={preview}
                                    alt={`Reference ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newImages = [...promptImages];
                                      const newPreviews = [
                                        ...promptImagePreviews,
                                      ];
                                      newImages.splice(index, 1);
                                      newPreviews.splice(index, 1);
                                      setPromptImages(newImages);
                                      setPromptImagePreviews(newPreviews);
                                    }}
                                    className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 z-10"
                                  >
                                    <svg
                                      width={12}
                                      height={12}
                                      viewBox="0 0 16 16"
                                      fill="none"
                                    >
                                      <path
                                        d="M12 4L4 12M4 4l8 8"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                              {promptImagePreviews.length < 5 && (
                                <label className="w-20 h-20 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-cyan-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    className="sr-only"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          setPromptImages([
                                            ...promptImages,
                                            file,
                                          ]);
                                          setPromptImagePreviews([
                                            ...promptImagePreviews,
                                            reader.result as string,
                                          ]);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                  <ImageIcon className="w-5 h-5 text-neutral-400" />
                                </label>
                              )}
                            </div>
                            {promptImagePreviews.length > 0 && (
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                These images provide style/context reference.
                                They differ from start/end frames which are used
                                for video generation.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Collapsible Section: Avatar/Presenter */}
                        <div className="mt-3 space-y-2">
                          <button
                            type="button"
                            onClick={() => toggleSection("avatar")}
                            className="w-full flex items-center justify-between p-3 bg-neutral-surface-subtle rounded-lg hover:bg-neutral-surface-subtle/80 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-text-secondary" />
                              <span className="text-sm font-medium text-font-primary">
                                Avatar/Presenter
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                role="switch"
                                aria-checked={sectionsEnabled.avatar}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSection("avatar");
                                }}
                                className={cn(
                                  "relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-200",
                                  sectionsEnabled.avatar
                                    ? "bg-neutral-900 dark:bg-neutral-100"
                                    : "bg-neutral-300 dark:bg-neutral-600"
                                )}
                              >
                                <span
                                  className={cn(
                                    "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
                                    sectionsEnabled.avatar
                                      ? "translate-x-4"
                                      : "translate-x-0.5"
                                  )}
                                />
                              </button>
                              {sectionsEnabled.avatar ? (
                                <ChevronUp className="w-4 h-4 text-text-secondary" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-text-secondary" />
                              )}
                            </div>
                          </button>
                          {sectionsEnabled.avatar && (
                            <div className="p-3 bg-neutral-surface-subtle rounded-lg border border-neutral-12">
                              <PresenterSelector
                                selectedPresenter={selectedPresenter}
                                onSelectPresenter={setSelectedPresenter}
                              />
                            </div>
                          )}
                        </div>

                        {/* Collapsible Section: Audio/Voice */}
                        {selectedVideoModel?.allowCustomAudio && (
                          <div className="mt-2 space-y-2">
                            <button
                              type="button"
                              onClick={() => toggleSection("audio")}
                              className="w-full flex items-center justify-between p-3 bg-neutral-surface-subtle rounded-lg hover:bg-neutral-surface-subtle/80 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <Volume2 className="w-4 h-4 text-text-secondary" />
                                <span className="text-sm font-medium text-font-primary">
                                  Audio & Voice
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  role="switch"
                                  aria-checked={sectionsEnabled.audio}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSection("audio");
                                  }}
                                  className={cn(
                                    "relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-200",
                                    sectionsEnabled.audio
                                      ? "bg-neutral-900 dark:bg-neutral-100"
                                      : "bg-neutral-300 dark:bg-neutral-600"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
                                      sectionsEnabled.audio
                                        ? "translate-x-4"
                                        : "translate-x-0.5"
                                    )}
                                  />
                                </button>
                                {sectionsEnabled.audio ? (
                                  <ChevronUp className="w-4 h-4 text-text-secondary" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-text-secondary" />
                                )}
                              </div>
                            </button>
                            {sectionsEnabled.audio && (
                              <div className="p-3 bg-neutral-surface-subtle rounded-lg border border-neutral-12">
                                <VoiceSelector
                                  selectedVoice={selectedVoice}
                                  clonedVoiceId={clonedVoiceId}
                                  onSelectVoice={setSelectedVoice}
                                  onCloneVoice={setClonedVoiceId}
                                  isCloning={isCloningVoice}
                                  onCloningChange={setIsCloningVoice}
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Collapsible Section: Resolution & Settings */}
                        <div className="mt-2 space-y-2">
                          <button
                            type="button"
                            onClick={() => toggleSection("resolution")}
                            className="w-full flex items-center justify-between p-3 bg-neutral-surface-subtle rounded-lg hover:bg-neutral-surface-subtle/80 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Monitor className="w-4 h-4 text-text-secondary" />
                              <span className="text-sm font-medium text-font-primary">
                                Resolution & Format
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                role="switch"
                                aria-checked={sectionsEnabled.resolution}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSection("resolution");
                                }}
                                className={cn(
                                  "relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-200",
                                  sectionsEnabled.resolution
                                    ? "bg-neutral-900 dark:bg-neutral-100"
                                    : "bg-neutral-300 dark:bg-neutral-600"
                                )}
                              >
                                <span
                                  className={cn(
                                    "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
                                    sectionsEnabled.resolution
                                      ? "translate-x-4"
                                      : "translate-x-0.5"
                                  )}
                                />
                              </button>
                              {sectionsEnabled.resolution ? (
                                <ChevronUp className="w-4 h-4 text-text-secondary" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-text-secondary" />
                              )}
                            </div>
                          </button>
                          {sectionsEnabled.resolution && (
                            <div className="p-3 bg-neutral-surface-subtle rounded-lg border border-neutral-12 space-y-3">
                              <ResolutionSelector
                                selectedResolution={selectedResolution}
                                selectedAspectRatio={selectedAspectRatio}
                                onResolutionChange={setSelectedResolution}
                                onAspectRatioChange={setSelectedAspectRatio}
                              />
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
                                  <option value={12}>12 seconds</option>
                                  <option value={16}>16 seconds</option>
                                  <option value={30}>30 seconds</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Advanced Settings */}
                        <div className="mt-2 space-y-2">
                          <button
                            type="button"
                            onClick={() => toggleSection("advanced")}
                            className="w-full flex items-center justify-between p-3 bg-neutral-surface-subtle rounded-lg hover:bg-neutral-surface-subtle/80 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Settings className="w-4 h-4 text-text-secondary" />
                              <span className="text-sm font-medium text-font-primary">
                                Advanced Settings
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {sectionsEnabled.advanced ? (
                                <ChevronUp className="w-4 h-4 text-text-secondary" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-text-secondary" />
                              )}
                            </div>
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
                                          : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
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
                                        : "bg-neutral-300 dark:bg-neutral-600"
                                    )}
                                  >
                                    <span
                                      aria-hidden="true"
                                      className={cn(
                                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out",
                                        fixedLens
                                          ? "translate-x-5"
                                          : "translate-x-0.5"
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
                                          : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
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
                                    onClick={() =>
                                      setAudioEnabled(!audioEnabled)
                                    }
                                    className={cn(
                                      "relative inline-flex shrink-0 cursor-pointer items-center transition-all duration-200 ring-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 focus-visible:ring-offset-transparent rounded-full h-6 w-11",
                                      audioEnabled
                                        ? "bg-neutral-900 dark:bg-neutral-100"
                                        : "bg-neutral-300 dark:bg-neutral-600"
                                    )}
                                  >
                                    <span
                                      aria-hidden="true"
                                      className={cn(
                                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out",
                                        audioEnabled
                                          ? "translate-x-5"
                                          : "translate-x-0.5"
                                      )}
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generate Button */}
                  <div className="px-4 relative bottom-0 shrink-0 w-full pt-3 pb-3 rounded-b-2xl">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!prompt.trim()) {
                          toast({
                            title: "Error",
                            description: "Please enter a prompt",
                            variant: "destructive",
                          });
                          return;
                        }

                        setIsGenerating(true);
                        try {
                          if (generationMode === "image") {
                            // Image generation
                            if (!selectedImageModel) {
                              toast({
                                title: "Error",
                                description: "Please select an image model",
                                variant: "destructive",
                              });
                              setIsGenerating(false);
                              return;
                            }

                            // Collect uploaded files (reference images for style/context)
                            const files: File[] = [];
                            // Add reference images (promptImages) for style/context
                            if (promptImages && promptImages.length > 0) {
                              files.push(...promptImages);
                            }

                            const response = await imageGenApi.generate(
                              {
                                prompt: prompt.trim(),
                                modelId: selectedImageModel._id,
                                aspectRatio: selectedAspectRatio,
                                resolution: selectedResolution,
                                style: selectedImageStyle,
                                imageCount: imageCount,
                              },
                              files.length > 0 ? files : undefined
                            );

                            if (response.success && response.data.images) {
                              // Add generated images to state
                              const newImages = response.data.images.map(
                                (img, index) => ({
                                  id: img.id || `img-${Date.now()}-${index}`,
                                  generatedImageId: img.id || undefined, // Store the database ID if available
                                  url: img.url,
                                  thumbnail: img.url,
                                  aspectRatio: selectedAspectRatio,
                                  resolution: selectedResolution,
                                  prompt: prompt.trim(),
                                  style: selectedImageStyle,
                                  createdAt: new Date().toISOString(),
                                })
                              );

                              setGeneratedImages((prev) => [
                                ...newImages,
                                ...prev,
                              ]);
                              setSelectedImageIndex(0);
                              setActiveContentTab("preview");

                              toast({
                                title: "Success",
                                description: `Successfully generated ${newImages.length} image(s)`,
                              });
                            } else {
                              throw new Error(
                                response.message || "Failed to generate image"
                              );
                            }
                          } else {
                            // Video generation
                            if (!selectedVideoModel) {
                              toast({
                                title: "Error",
                                description: "Please select a video model",
                                variant: "destructive",
                              });
                              setIsGenerating(false);
                              return;
                            }

                            // Reset progress and switch to preview tab
                            setGenerationProgress(0);
                            setActiveContentTab("preview");

                            // Collect files for video generation
                            const videoFiles: {
                              startFrame?: File;
                              endFrame?: File;
                              imageInput?: File;
                              referenceImages?: File[];
                            } = {};

                            if (startFrame) {
                              videoFiles.startFrame = startFrame;
                            }
                            if (endFrame) {
                              videoFiles.endFrame = endFrame;
                            }

                            // Use promptImages as imageInput for image-to-video generation
                            if (promptImages && promptImages.length > 0) {
                              videoFiles.imageInput = promptImages[0]; // Use first image as input
                              if (promptImages.length > 1) {
                                videoFiles.referenceImages =
                                  promptImages.slice(1);
                              }
                            }

                            // Set up project ID for tracking generation progress
                            const videoProjectId = `vid-${Date.now()}`;
                            currentProjectIdRef.current = videoProjectId;
                            setGenerationProgress(0);
                            setActiveContentTab("preview");

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
                              Object.keys(videoFiles).length > 0
                                ? videoFiles
                                : undefined
                            );

                            if (response.success && response.data.videos) {
                              // Add generated videos to state
                              const newVideos = response.data.videos.map(
                                (vid, index) => ({
                                  id: vid.id || `vid-${Date.now()}-${index}`,
                                  generatedVideoId: vid.id || undefined,
                                  url: vid.url,
                                  thumbnail: vid.thumbnail,
                                  aspectRatio: selectedAspectRatio,
                                  resolution: selectedResolution,
                                  prompt: prompt.trim(),
                                  duration: vid.duration || duration,
                                  createdAt: new Date().toISOString(),
                                })
                              );

                              setGeneratedVideos((prev) => [
                                ...newVideos,
                                ...prev,
                              ]);
                              setSelectedVideoIndex(0);
                              setActiveContentTab("preview");
                              setGenerationProgress(100);
                              currentProjectIdRef.current = null;

                              toast({
                                title: "Success",
                                description: `Successfully generated ${newVideos.length} video(s)`,
                              });
                            } else {
                              throw new Error(
                                response.message || "Failed to generate video"
                              );
                            }
                          }
                        } catch (error: any) {
                          console.error("Generation error:", error);
                          setGenerationProgress(0);
                          currentProjectIdRef.current = null;
                          toast({
                            title: "Error",
                            description:
                              error?.response?.data?.message ||
                              error?.message ||
                              (generationMode === "image"
                                ? "Failed to generate image"
                                : "Failed to generate video"),
                            variant: "destructive",
                          });
                        } finally {
                          setIsGenerating(false);
                        }
                      }}
                      disabled={isGenerating}
                      tabIndex={0}
                      className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all flex flex-row items-center justify-center gap-2"
                      data-rac=""
                      id="react-aria3512376871-_r_1f_"
                      style={{ touchAction: "pan-x pan-y pinch-zoom" }}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          {generationMode === "image" ? (
                            <>
                              <Wand2 className="w-4 h-4" />
                              Generate Image
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              Generate Video
                            </>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* Right Section - Desktop: always visible, Mobile/Tablet: in drawer */}
            <div className="hidden md:flex md:flex-1 min-h-0 relative flex-col gap-2.5 pb-3 overflow-hidden">
              <div
                dir="ltr"
                data-orientation="horizontal"
                className="z-10 flex w-full items-end justify-end"
              >
                <div
                  role="tablist"
                  aria-orientation="horizontal"
                  className="rounded-xl p-1 flex gap-4 bg-page-primary border-separator-card bg-neutral-100 dark:bg-neutral-900"
                  tabIndex={0}
                  data-orientation="horizontal"
                  style={{ outline: "none" }}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeContentTab === "preview"}
                    data-state={
                      activeContentTab === "preview" ? "active" : "inactive"
                    }
                    onClick={() => setActiveContentTab("preview")}
                    className={cn(
                      "relative button button-sm active:brightness-60 min-w-[100px] cursor-pointer transition-colors flex items-center justify-center gap-2 text-sm py-2",
                      activeContentTab === "preview"
                        ? "text-font-primary border border-separator-card flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 rounded-lg px-2"
                        : "text-font-secondary hover:text-font-primary flex items-center justify-center"
                    )}
                    tabIndex={activeContentTab === "preview" ? -1 : 0}
                    data-orientation="horizontal"
                  >
                    <ViewIcon className="size-4" />
                    Preview
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeContentTab === "community"}
                    data-state={
                      activeContentTab === "community" ? "active" : "inactive"
                    }
                    onClick={() => setActiveContentTab("community")}
                    className={cn(
                      "relative button button-sm active:brightness-60 min-w-[100px] cursor-pointer transition-colors flex items-center justify-center gap-2 text-sm py-2",
                      activeContentTab === "community"
                        ? "text-font-primary border border-separator-card flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 rounded-lg px-2"
                        : "text-font-secondary hover:text-font-primary flex items-center justify-center"
                    )}
                    tabIndex={activeContentTab === "community" ? -1 : 0}
                    data-orientation="horizontal"
                  >
                    <Users className="size-4" />
                    Community
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeContentTab === "templates"}
                    data-state={
                      activeContentTab === "templates" ? "active" : "inactive"
                    }
                    onClick={() => setActiveContentTab("templates")}
                    className={cn(
                      "relative button button-sm active:brightness-60 min-w-[100px] cursor-pointer transition-colors flex items-center justify-center gap-2 text-sm py-2",
                      activeContentTab === "templates"
                        ? "text-font-primary border border-separator-card flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 rounded-lg px-2"
                        : "text-font-secondary hover:text-font-primary flex items-center justify-center"
                    )}
                    tabIndex={activeContentTab === "templates" ? -1 : 0}
                    data-orientation="horizontal"
                  >
                    <IconTemplate className="size-4" />
                    Templates
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeContentTab === "tutorial"}
                    data-state={
                      activeContentTab === "tutorial" ? "active" : "inactive"
                    }
                    onClick={() => setActiveContentTab("tutorial")}
                    className={cn(
                      "relative button button-sm active:brightness-60 min-w-[100px] cursor-pointer transition-colors flex items-center justify-center gap-2 text-sm py-2",
                      activeContentTab === "tutorial"
                        ? "text-font-primary border border-separator-card flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 rounded-lg px-2"
                        : "text-font-secondary hover:text-font-primary flex items-center justify-center"
                    )}
                    tabIndex={activeContentTab === "tutorial" ? -1 : 0}
                    data-orientation="horizontal"
                  >
                    <BookOpen className="size-4" />
                    Learn how
                  </button>
                </div>
              </div>

              <div className="flex-1 md:overflow-auto">
                {/* Community Tab */}
                {activeContentTab === "community" && (
                  <>
                    {generationMode === "image" ? (
                      <ImageCommunityTab
                        onPromptSelect={setPrompt}
                        onTabChange={setActiveContentTab}
                        onParamsRestore={{
                          setPrompt,
                          setAspectRatio: (ratio: string) =>
                            setAspectRatio(ratio as AspectRatio),
                          setResolution: (res: string) =>
                            setResolution(res as Resolution),
                          setModel: setSelectedImageModel,
                          setStyle: (style: string) =>
                            setSelectedImageStyle(style as ImageStyle),
                          setImageCount,
                          setReferenceImages: async (images: File[]) => {
                            setPromptImages(images);
                            // Create previews for the images
                            const previews = await Promise.all(
                              images.map((file) => {
                                return new Promise<string>((resolve) => {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    resolve(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                });
                              })
                            );
                            setPromptImagePreviews(previews);
                          },
                          onTabChange: setActiveContentTab,
                        }}
                      />
                    ) : (
                      <VideoCommunityTab
                        onPromptSelect={setPrompt}
                        onTabChange={setActiveContentTab}
                        onParamsRestore={{
                          setPrompt,
                          setAspectRatio: (ratio: string) =>
                            setAspectRatio(ratio as AspectRatio),
                          setResolution: (res: string) =>
                            setResolution(res as Resolution),
                          setModel: setSelectedVideoModel,
                          setPresenter: setSelectedPresenter,
                          setVoice: setSelectedVoice,
                          setDuration,
                          setStartFrame: async (file: File | null) => {
                            if (file) {
                              setStartFrame(file);
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setStartFramePreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            } else {
                              setStartFrame(null);
                              setStartFramePreview(null);
                            }
                          },
                          setEndFrame: async (file: File | null) => {
                            if (file) {
                              setEndFrame(file);
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEndFramePreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            } else {
                              setEndFrame(null);
                              setEndFramePreview(null);
                            }
                          },
                          setReferenceImages: async (images: File[]) => {
                            setPromptImages(images);
                            // Create previews for the images
                            const previews = await Promise.all(
                              images.map((file) => {
                                return new Promise<string>((resolve) => {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    resolve(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                });
                              })
                            );
                            setPromptImagePreviews(previews);
                          },
                          onTabChange: setActiveContentTab,
                        }}
                      />
                    )}
                  </>
                )}

                {activeContentTab === "preview" && (
                  <>
                    {generationMode === "image" ? (
                      <ImagePreviewTab
                        isGenerating={isGenerating}
                        generationProgress={generationProgress}
                        generatedImages={generatedImages}
                        selectedImageIndex={selectedImageIndex}
                        selectedAspectRatio={selectedAspectRatio}
                        onImageSelect={setSelectedImageIndex}
                        onPromptRestore={setPrompt}
                        onTabChange={setActiveContentTab}
                      />
                    ) : (
                      <VideoPreviewTab
                        isGenerating={isGenerating}
                        generationProgress={generationProgress}
                        generatedVideos={generatedVideos}
                        selectedVideoIndex={selectedVideoIndex}
                        selectedAspectRatio={selectedAspectRatio}
                        onVideoSelect={setSelectedVideoIndex}
                        onPromptRestore={setPrompt}
                        onTabChange={setActiveContentTab}
                      />
                    )}
                  </>
                )}
                {activeContentTab === "templates" && (
                  <>
                    {generationMode === "image" ? (
                      <ImageTemplatesTab
                        onPromptSelect={setPrompt}
                        onTabChange={setActiveContentTab}
                        onParamsRestore={{
                          setPrompt,
                          setAspectRatio: (ratio: string) =>
                            setAspectRatio(ratio as AspectRatio),
                          setResolution: (res: string) =>
                            setResolution(res as Resolution),
                          setModel: setSelectedImageModel,
                          setStyle: (style: string) =>
                            setSelectedImageStyle(style as ImageStyle),
                          setImageCount,
                          onTabChange: setActiveContentTab,
                        }}
                      />
                    ) : (
                      <VideoTemplatesTab
                        onPromptSelect={setPrompt}
                        onTabChange={setActiveContentTab}
                        onParamsRestore={{
                          setPrompt,
                          setAspectRatio: (ratio: string) =>
                            setAspectRatio(ratio as AspectRatio),
                          setResolution: (res: string) =>
                            setResolution(res as Resolution),
                          setModel: setSelectedVideoModel,
                          setPresenter: setSelectedPresenter,
                          setVoice: setSelectedVoice,
                          setDuration,
                          onTabChange: setActiveContentTab,
                        }}
                      />
                    )}
                  </>
                )}
                {activeContentTab === "tutorial" && <TutorialTab />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section Drawer for Mobile/Tablet */}
      {isMobile && (
        <Drawer open={sidebarDrawerOpen} onOpenChange={setSidebarDrawerOpen}>
          <DrawerContent className="h-[85vh] max-h-[85vh]">
            <div className="flex flex-1 min-h-0 relative flex-col gap-2.5 pb-3 overflow-hidden">
              <div
                dir="ltr"
                data-orientation="horizontal"
                className="z-10 flex w-full items-end justify-end pt-4 overflow-x-auto scrollbar-hide"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div
                  role="tablist"
                  aria-orientation="horizontal"
                  className="rounded-xl p-1 flex gap-4 bg-page-primary border-separator-card bg-neutral-100 dark:bg-neutral-900 shrink-0"
                  tabIndex={0}
                  data-orientation="horizontal"
                  style={{ outline: "none" }}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeContentTab === "preview"}
                    data-state={
                      activeContentTab === "preview" ? "active" : "inactive"
                    }
                    onClick={() => setActiveContentTab("preview")}
                    className={cn(
                      "relative button button-sm active:brightness-60 min-w-[100px] cursor-pointer transition-colors flex items-center justify-center gap-2 text-sm py-2",
                      activeContentTab === "preview"
                        ? "text-font-primary border border-separator-card flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 rounded-lg px-2"
                        : "text-font-secondary hover:text-font-primary flex items-center justify-center"
                    )}
                    tabIndex={activeContentTab === "preview" ? -1 : 0}
                    data-orientation="horizontal"
                  >
                    <ViewIcon className="size-4" />
                    Preview
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeContentTab === "community"}
                    data-state={
                      activeContentTab === "community" ? "active" : "inactive"
                    }
                    onClick={() => setActiveContentTab("community")}
                    className={cn(
                      "relative button button-sm active:brightness-60 min-w-[100px] cursor-pointer transition-colors flex items-center justify-center gap-2 text-sm py-2",
                      activeContentTab === "community"
                        ? "text-font-primary border border-separator-card flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 rounded-lg px-2"
                        : "text-font-secondary hover:text-font-primary flex items-center justify-center"
                    )}
                    tabIndex={activeContentTab === "community" ? -1 : 0}
                    data-orientation="horizontal"
                  >
                    <Users className="size-4" />
                    Community
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeContentTab === "templates"}
                    data-state={
                      activeContentTab === "templates" ? "active" : "inactive"
                    }
                    onClick={() => setActiveContentTab("templates")}
                    className={cn(
                      "relative button button-sm active:brightness-60 min-w-[100px] cursor-pointer transition-colors flex items-center justify-center gap-2 text-sm py-2",
                      activeContentTab === "templates"
                        ? "text-font-primary border border-separator-card flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 rounded-lg px-2"
                        : "text-font-secondary hover:text-font-primary flex items-center justify-center"
                    )}
                    tabIndex={activeContentTab === "templates" ? -1 : 0}
                    data-orientation="horizontal"
                  >
                    <IconTemplate className="size-4" />
                    Templates
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeContentTab === "tutorial"}
                    data-state={
                      activeContentTab === "tutorial" ? "active" : "inactive"
                    }
                    onClick={() => setActiveContentTab("tutorial")}
                    className={cn(
                      "relative button button-sm active:brightness-60 min-w-[100px] cursor-pointer transition-colors flex items-center justify-center gap-2 text-sm py-2",
                      activeContentTab === "tutorial"
                        ? "text-font-primary border border-separator-card flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 rounded-lg px-2"
                        : "text-font-secondary hover:text-font-primary flex items-center justify-center"
                    )}
                    tabIndex={activeContentTab === "tutorial" ? -1 : 0}
                    data-orientation="horizontal"
                  >
                    <BookOpen className="size-4" />
                    Learn how
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto px-4">
                {/* Community Tab */}
                {activeContentTab === "community" && (
                  <>
                    {generationMode === "image" ? (
                      <ImageCommunityTab
                        onPromptSelect={setPrompt}
                        onTabChange={setActiveContentTab}
                        onParamsRestore={{
                          setPrompt,
                          setAspectRatio: (ratio: string) =>
                            setAspectRatio(ratio as AspectRatio),
                          setResolution: (res: string) =>
                            setResolution(res as Resolution),
                          setModel: setSelectedImageModel,
                          setStyle: (style: string) =>
                            setSelectedImageStyle(style as ImageStyle),
                          setImageCount,
                          setReferenceImages: async (images: File[]) => {
                            setPromptImages(images);
                            const previews = await Promise.all(
                              images.map((file) => {
                                return new Promise<string>((resolve) => {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    resolve(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                });
                              })
                            );
                            setPromptImagePreviews(previews);
                          },
                          onTabChange: setActiveContentTab,
                        }}
                      />
                    ) : (
                      <VideoCommunityTab
                        onPromptSelect={setPrompt}
                        onTabChange={setActiveContentTab}
                        onParamsRestore={{
                          setPrompt,
                          setAspectRatio: (ratio: string) =>
                            setAspectRatio(ratio as AspectRatio),
                          setResolution: (res: string) =>
                            setResolution(res as Resolution),
                          setModel: setSelectedVideoModel,
                          setPresenter: setSelectedPresenter,
                          setVoice: setSelectedVoice,
                          setDuration,
                          setStartFrame: async (file: File | null) => {
                            if (file) {
                              setStartFrame(file);
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setStartFramePreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            } else {
                              setStartFrame(null);
                              setStartFramePreview(null);
                            }
                          },
                          setEndFrame: async (file: File | null) => {
                            if (file) {
                              setEndFrame(file);
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEndFramePreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            } else {
                              setEndFrame(null);
                              setEndFramePreview(null);
                            }
                          },
                          setReferenceImages: async (images: File[]) => {
                            setPromptImages(images);
                            const previews = await Promise.all(
                              images.map((file) => {
                                return new Promise<string>((resolve) => {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    resolve(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                });
                              })
                            );
                            setPromptImagePreviews(previews);
                          },
                          onTabChange: setActiveContentTab,
                        }}
                      />
                    )}
                  </>
                )}

                {activeContentTab === "preview" && (
                  <>
                    {generationMode === "image" ? (
                      <ImagePreviewTab
                        isGenerating={isGenerating}
                        generationProgress={generationProgress}
                        generatedImages={generatedImages}
                        selectedImageIndex={selectedImageIndex}
                        selectedAspectRatio={selectedAspectRatio}
                        onImageSelect={setSelectedImageIndex}
                        onPromptRestore={setPrompt}
                        onTabChange={setActiveContentTab}
                      />
                    ) : (
                      <VideoPreviewTab
                        isGenerating={isGenerating}
                        generationProgress={generationProgress}
                        generatedVideos={generatedVideos}
                        selectedVideoIndex={selectedVideoIndex}
                        selectedAspectRatio={selectedAspectRatio}
                        onVideoSelect={setSelectedVideoIndex}
                        onPromptRestore={setPrompt}
                        onTabChange={setActiveContentTab}
                      />
                    )}
                  </>
                )}
                {activeContentTab === "templates" && (
                  <>
                    {generationMode === "image" ? (
                      <ImageTemplatesTab
                        onPromptSelect={setPrompt}
                        onTabChange={setActiveContentTab}
                        onParamsRestore={{
                          setPrompt,
                          setAspectRatio: (ratio: string) =>
                            setAspectRatio(ratio as AspectRatio),
                          setResolution: (res: string) =>
                            setResolution(res as Resolution),
                          setModel: setSelectedImageModel,
                          setStyle: (style: string) =>
                            setSelectedImageStyle(style as ImageStyle),
                          setImageCount,
                          onTabChange: setActiveContentTab,
                        }}
                      />
                    ) : (
                      <VideoTemplatesTab
                        onPromptSelect={setPrompt}
                        onTabChange={setActiveContentTab}
                        onParamsRestore={{
                          setPrompt,
                          setAspectRatio: (ratio: string) =>
                            setAspectRatio(ratio as AspectRatio),
                          setResolution: (res: string) =>
                            setResolution(res as Resolution),
                          setModel: setSelectedVideoModel,
                          setPresenter: setSelectedPresenter,
                          setVoice: setSelectedVoice,
                          setDuration,
                          onTabChange: setActiveContentTab,
                        }}
                      />
                    )}
                  </>
                )}
                {activeContentTab === "tutorial" && <TutorialTab />}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

export default withAuth(VideoCreatePage);
