"use client";

import {
  ImageCommunityTab,
  ImageHistoryTab,
  ImagePreviewTab,
  ImageTemplatesTab,
  TutorialTab,
  VideoCommunityTab,
  VideoPreviewTab,
  VideoTemplatesTab,
} from "@/components/inspire";
import { ModelSelector } from "@/components/inspire/model-selector";
import { VideoHistoryTab } from "@/components/inspire/video-history-tab";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PremiumInput } from "@/components/ui/premium-input";
import { Toaster } from "@/components/ui/sonner";
import { PresenterSelector } from "@/components/video/presenter-selector";
import {
  ASPECT_RATIOS,
  AspectRatioCard,
  ResolutionSelector,
} from "@/components/video/resolution-selector";
import { VoiceSelector } from "@/components/video/voice-selector";
import { useUserContext } from "@/context/AuthenticatedContext";
import withAuth from "@/helper/hoc/withAuth";
import { trackEvent, trackFeatureUsed } from "@/lib/mixpanelClient";
import { cn } from "@/lib/utils";
import {
  AspectRatio,
  Model,
  Presenter,
  Resolution,
  Voice,
} from "@/types/inspire";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse, serverUrlSocket } from "@/utils/apiResponse";
import { imageGenApi, videoGenApi } from "@/utils/inspire-api";
import { IconTemplate } from "@tabler/icons-react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  CircleFadingArrowUp,
  History,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  Minus,
  Monitor,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash,
  User,
  Users,
  Video,
  ViewIcon,
  Volume2,
  Wand2,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Socket, io } from "socket.io-client";
import { toast } from "sonner";
import { useCallback, useEffect, useRef, useState } from "react";

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
    <div className='group relative w-full overflow-hidden rounded-xl'>
      <div
        ref={sliderRef}
        className='flex snap-x snap-mandatory overflow-x-hidden scroll-smooth'
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {PRESET_SLIDES.map((slide, index) => (
          <div key={slide.id} className='min-w-full snap-center'>
            <figure className='relative aspect-[2.3] w-full cursor-pointer overflow-hidden rounded-xl select-none'>
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                loop
                muted
                playsInline
                disablePictureInPicture
                preload='metadata'
                poster={slide.poster}
                src={slide.video}
                className='h-full w-full rounded-xl object-cover'
              />
              <div className='pointer-events-none absolute inset-0 bg-black/30' />
              <figcaption className='absolute bottom-0 left-0 z-10 w-full pr-1.5 pb-3 pl-3 text-white'>
                <p className='w-full truncate text-[10px] font-semibold uppercase'>
                  {slide.title}
                </p>
                <p className='text-[10px] text-white/80'>{slide.description}</p>
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
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedVideoModel, setSelectedVideoModel] = useState<Model | null>(
    null
  );
  const [loadingProject, setLoadingProject] = useState(false);

  // Generation mode: image or video - initialize from URL parameter
  const [generationMode, setGenerationMode] = useState<"image" | "video">(
    searchParams.get("mode") === "ai-image-gen" ? "image" : "video"
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
    null
  );
  const [endFramePreview, setEndFramePreview] = useState<string | null>(null);
  const [referenceVideo, setReferenceVideo] = useState<File | null>(null);
  const [referenceVideoPreview, setReferenceVideoPreview] = useState<
    string | null
  >(null);
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
    null
  );

  const [sectionsEnabled, setSectionsEnabled] = useState({
    avatar: false,
    audio: false,
    videoRef: false,
    resolution: false,
    advanced: false,
  });

  const [generatedVideos, setGeneratedVideos] = useState<any[]>([]);
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeContentTab, setActiveContentTab] = useState<any>(
    urlContentTab || "community"
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
      trackFeatureUsed("video_gen_tab_switched", {
        tab,
        generation_mode: generationMode,
      });
      const urlParams = new URLSearchParams(searchParams.toString());
      urlParams.set("tab", tab);
      urlParams.set(
        "mode",
        generationMode === "image" ? "ai-image-gen" : "ai-video-gen"
      );
      if (projectId) urlParams.set("projectId", projectId);
      router.replace(`/apps/video-generation?${urlParams.toString()}`, {
        scroll: false,
      });
    },
    [searchParams, router, projectId, generationMode]
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
                  }
                )
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
              })
            );
            setPromptImages(files);
            setPromptImagePreviews(files.map((f) => URL.createObjectURL(f)));
          }
          localStorage.removeItem("animateDesignData");
          if (isAnimate) {
            const params = new URLSearchParams(searchParams.toString());
            ["animate", "prompt", "referenceImage", "designType"].forEach((k) =>
              params.delete(k)
            );
            window.history.replaceState(
              {},
              "",
              `${window.location.pathname}?${params.toString()}`
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
          if (project.endFrameUrl) setEndFramePreview(project.endFrameUrl);
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

  // Load an image history item directly into the editor without any extra API call.
  const handleLoadImageFromHistory = useCallback(
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
      setGeneratedImages([
        {
          id: image._id,
          generatedImageId: image._id,
          url: imageData.url,
          thumbnail: imageData.thumbnail || imageData.url,
          aspectRatio: (imageData.aspectRatio || "1:1") as AspectRatio,
          resolution: (imageData.resolution || "1080p") as Resolution,
          prompt: imageData.prompt || "",
          style: imageData.style || "realistic",
          createdAt: image.createdAt || new Date().toISOString(),
          referenceImageUrls: imageData.referenceImageUrls || [],
        },
      ]);
      setSelectedImageIndex(0);
      setPrompt(imageData.prompt || "");
      if (imageData.aspectRatio)
        setSelectedAspectRatio(imageData.aspectRatio as AspectRatio);
      if (imageData.resolution)
        setSelectedResolution(imageData.resolution as Resolution);
      if (imageData.style) setSelectedImageStyle(imageData.style as ImageStyle);
      updateContentTab("preview");
    },
    [updateContentTab]
  );

  // Load a video history item directly into the editor without any extra API call.
  const handleLoadVideoFromHistory = useCallback(
    (video: {
      _id: string;
      videoData: {
        url: string;
        thumbnail: string;
        prompt: string;
        aspectRatio: string;
        resolution: string;
        duration?: number;
        startFrameUrl?: string;
        endFrameUrl?: string;
        referenceImageUrls?: string[];
      };
      createdAt: string;
    }) => {
      const { videoData } = video;
      setGeneratedVideos([
        {
          id: video._id,
          generatedVideoId: video._id,
          url: videoData.url,
          thumbnail: videoData.thumbnail || "",
          aspectRatio: (videoData.aspectRatio || "16:9") as AspectRatio,
          resolution: (videoData.resolution || "1080p") as Resolution,
          prompt: videoData.prompt || "",
          duration: videoData.duration || 8,
          createdAt: video.createdAt || new Date().toISOString(),
          startFrameUrl: videoData.startFrameUrl,
          endFrameUrl: videoData.endFrameUrl,
          referenceImageUrls: videoData.referenceImageUrls || [],
        },
      ]);
      setSelectedVideoIndex(0);
      setPrompt(videoData.prompt || "");
      if (videoData.aspectRatio)
        setSelectedAspectRatio(videoData.aspectRatio as AspectRatio);
      if (videoData.resolution)
        setSelectedResolution(videoData.resolution as Resolution);
      if (videoData.duration) setDuration(videoData.duration);
      if (videoData.startFrameUrl)
        setStartFramePreview(videoData.startFrameUrl);
      if (videoData.endFrameUrl) setEndFramePreview(videoData.endFrameUrl);
      updateContentTab("preview");
    },
    [updateContentTab]
  );

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
      trackEvent("inspire_image_generation_started", {
        model_id: selectedImageModel?._id,
        style: selectedImageStyle,
        image_count: imageCount,
        aspect_ratio: selectedAspectRatio,
      });
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
          promptImages.length > 0 ? promptImages : undefined
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
          trackEvent("inspire_image_generation_succeeded", {
            generated_count: newImages.length,
            model_id: selectedImageModel?._id,
          });
        } else {
          throw new Error(response.message || "Failed to generate image");
        }
      } catch (error: any) {
        console.error(error);
        trackEvent("inspire_image_generation_failed", {
          reason: error?.message || "unknown",
          model_id: selectedImageModel?._id,
        });
        toast.error(error.message || "Image generation failed");
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
    trackEvent("video_generation_started", {
      model_id: selectedVideoModel?._id,
      duration,
      aspect_ratio: selectedAspectRatio,
      has_start_frame: Boolean(startFrame || startFramePreview),
      has_end_frame: Boolean(endFrame || endFramePreview),
      has_reference_video: Boolean(referenceVideo || referenceVideoPreview),
      reference_images_count: promptImages.length,
    });

    try {
      const videoFiles: any = {};
      if (startFrame) videoFiles.startFrame = startFrame;
      if (endFrame) videoFiles.endFrame = endFrame;
      if (referenceVideo) videoFiles.referenceVideo = referenceVideo;
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
          referenceVideoUrl: referenceVideoPreview || undefined,
        },
        Object.keys(videoFiles).length > 0 ? videoFiles : undefined
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
          })
        );

        setGeneratedVideos((prev) => [...newVideos, ...prev]);
        setSelectedVideoIndex(0);
        setGenerationProgress(100);
        toast(`Successfully generated ${newVideos.length} video(s)`);
        trackEvent("video_generation_succeeded", {
          generated_count: newVideos.length,
          model_id: selectedVideoModel?._id,
        });
      } else {
        throw new Error(response.message || "Failed to generate video");
      }
    } catch (error: any) {
      console.error(error);
      trackEvent("video_generation_failed", {
        reason: error?.message || "unknown",
        model_id: selectedVideoModel?._id,
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
        toast.error(error.message || "Video generation failed");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className='relative flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-black'>
      <Toaster />
      <AppSidebar />
      <div
        // ref={scrollContainerRef}
        className='scroll-container flex flex-1 flex-col overflow-auto will-change-scroll'
      >
        <TopNavWithAurora
        // scrollContainerRef={
        //   scrollContainerRef as React.RefObject<HTMLDivElement>
        // }
        />
        <div
          id='main-content'
          className='mr-2 ml-0 flex-1 rounded-t-2xl md:mr-4 lg:border-2 lg:border-b-0'
          // style={{
          //   transform: "translateZ(0)",
          //   willChange: "transform",
          // }}
        >
          <div
            id='main-content'
            className='relative flex-1 px-2 md:px-6 lg:px-5'
          >
            <div className='bg-grid-black/[0.05] dark:bg-grid-white/[0.05] absolute inset-0 -z-10' />

            <div className='relative grid min-h-0 w-full grid-cols-1 gap-6 md:h-[calc(100vh-5rem)] md:grid-cols-[27rem_1fr]'>
              <div className='flex h-full min-h-0 flex-col overflow-hidden'>
                <div className='z-20 flex items-baseline justify-between py-2'>
                  <div
                    role='tablist'
                    className='flex gap-4 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-900'
                  >
                    <button
                      type='button'
                      onClick={() => {
                        setGenerationMode("video");
                        trackFeatureUsed("generation_mode_switched", {
                          mode: "video",
                          source: "video_page_toggle",
                        });
                        const params = new URLSearchParams(
                          searchParams.toString()
                        );
                        params.set("mode", "ai-video-gen");
                        router.replace(`${pathname}?${params.toString()}`, {
                          scroll: false,
                        });
                      }}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                        generationMode === "video"
                          ? "text-foreground bg-neutral-200 dark:bg-neutral-800"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Video className='h-4 w-4' />
                      Video
                    </button>
                    <button
                      type='button'
                      onClick={() => {
                        setGenerationMode("image");
                        trackFeatureUsed("generation_mode_switched", {
                          mode: "image",
                          source: "video_page_toggle",
                        });
                        const params = new URLSearchParams(
                          searchParams.toString()
                        );
                        params.set("mode", "ai-image-gen");
                        router.replace(`${pathname}?${params.toString()}`, {
                          scroll: false,
                        });
                      }}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                        generationMode === "image"
                          ? "text-foreground bg-neutral-200 dark:bg-neutral-800"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <ImageIcon className='h-4 w-4' />
                      Image
                    </button>
                  </div>

                  <Drawer
                    open={isResultsDrawerOpen}
                    onOpenChange={setIsResultsDrawerOpen}
                  >
                    <DrawerTrigger asChild>
                      <button className='flex h-fit w-fit items-center justify-center gap-2 rounded-sm border border-neutral-200 bg-neutral-100 px-2 py-1 text-sm font-semibold md:hidden dark:border-neutral-700 dark:bg-neutral-800'>
                        <LayoutDashboard size={16} />
                        <span>view</span>
                      </button>
                    </DrawerTrigger>
                    <DrawerContent className='h-[85vh] px-2'>
                      <DrawerHeader className='px-0'>
                        <DrawerTitle>Explore & Results</DrawerTitle>
                      </DrawerHeader>
                      <div className='flex min-h-0 flex-1 flex-col overflow-hidden pb-6'>
                        <div className='hide-scrollbar mb-4 flex shrink-0 gap-2 overflow-x-auto'>
                          {[
                            { id: "preview", icon: ViewIcon, label: "Preview" },
                            { id: "history", icon: History, label: "History" },
                            {
                              id: "community",
                              icon: Users,
                              label: "Community",
                            },
                            {
                              id: "templates",
                              icon: IconTemplate,
                              label: "Templates",
                            },
                            {
                              id: "tutorial",
                              icon: BookOpen,
                              label: "Tutorial",
                            },
                          ].map((t) => (
                            <button
                              key={t.id}
                              onClick={() => updateContentTab(t.id as any)}
                              className={cn(
                                "flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors",
                                activeContentTab === t.id
                                  ? "text-primary-foreground border-primary bg-indigo-600 hover:bg-indigo-700"
                                  : "border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900"
                              )}
                            >
                              <t.icon size={14} />
                              {t.label}
                            </button>
                          ))}
                        </div>
                        <div className='flex-1 overflow-y-auto'>
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
                                  handleLoadImageFromHistory(image);
                                  setIsResultsDrawerOpen(false);
                                }}
                                onTabChange={updateContentTab}
                              />
                            ) : (
                              <VideoHistoryTab
                                onLoadToEditor={(video) => {
                                  handleLoadVideoFromHistory(video);
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

                <div className='relative z-10 flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-neutral-100 bg-white pt-4 shadow-sm dark:border-neutral-800 dark:bg-black/20'>
                  <div className='hide-scrollbar flex-1 shrink-0 space-y-3 overflow-y-auto px-4 pb-4'>
                    {generationMode === "video" && (
                      <PresetSlider currentSlide={0} onSlideChange={() => {}} />
                    )}

                    {/* ModelSelector removed from here */}

                    {generationMode === "video" && (
                      <div className='grid grid-cols-2 gap-2'>
                        <div className='relative flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-neutral-50 dark:bg-neutral-900'>
                          {startFramePreview ? (
                            <>
                              <img
                                src={startFramePreview}
                                className='h-full w-full object-cover'
                              />
                              <button
                                type='button'
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setStartFrame(null);
                                  setStartFramePreview(null);
                                }}
                                className='absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white'
                              >
                                <Trash size={12} />
                              </button>
                            </>
                          ) : (
                            <span className='text-[14px] text-neutral-500'>
                              Start Frame
                            </span>
                          )}
                          <input
                            type='file'
                            className='absolute inset-0 cursor-pointer opacity-0'
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                setStartFrame(f);
                                setStartFramePreview(URL.createObjectURL(f));
                              }
                            }}
                          />
                        </div>
                        <div className='relative flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-neutral-50 dark:bg-neutral-900'>
                          {endFramePreview ? (
                            <>
                              <img
                                src={endFramePreview}
                                className='h-full w-full object-cover'
                              />
                              <button
                                type='button'
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setEndFrame(null);
                                  setEndFramePreview(null);
                                }}
                                className='absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white'
                              >
                                <Trash size={12} />
                              </button>
                            </>
                          ) : (
                            <span className='text-[14px] text-neutral-500'>
                              End Frame
                            </span>
                          )}
                          <input
                            type='file'
                            className='absolute inset-0 cursor-pointer opacity-0'
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

                    <div className='space-y-2'>
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
                        minHeight='50px'
                        modelSelector={
                          <ModelSelector
                            type={generationMode}
                            selectedModel={
                              generationMode === "image"
                                ? selectedImageModel
                                : selectedVideoModel
                            }
                            onSelectModel={(model) => {
                              if (generationMode === "image") {
                                setSelectedImageModel(model);
                                trackFeatureUsed(
                                  "inspire_image_model_selected",
                                  {
                                    model_id: model?._id,
                                    model_name: model?.name,
                                  }
                                );
                                return;
                              }
                              setSelectedVideoModel(model);
                              trackFeatureUsed("video_model_selected", {
                                model_id: model?._id,
                                model_name: model?.name,
                              });
                            }}
                          />
                        }
                      />
                    </div>

                    {/* Reference Images Section */}
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <label className='text-sm font-medium'>
                          Reference Images (Optional)
                        </label>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {promptImagePreviews.map((preview, index) => (
                          <div
                            key={index}
                            className='relative h-16 w-16 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700'
                          >
                            <img
                              src={preview}
                              alt={`Reference ${index + 1}`}
                              className='h-full w-full object-cover'
                            />
                            <button
                              type='button'
                              onClick={() => {
                                const newFiles = [...promptImages];
                                const newPreviews = [...promptImagePreviews];
                                newFiles.splice(index, 1);
                                newPreviews.splice(index, 1);
                                setPromptImages(newFiles);
                                setPromptImagePreviews(newPreviews);
                              }}
                              className='absolute top-0.5 right-0.5 rounded-full bg-black/50 p-0.5 text-white'
                            >
                              <Trash size={10} />
                            </button>
                          </div>
                        ))}
                        {promptImagePreviews.length < 5 && (
                          <label className='flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border border-dashed border-neutral-300 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-900'>
                            <input
                              type='file'
                              accept='image/*'
                              className='sr-only'
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
                            <ImageIcon className='h-4 w-4 text-neutral-400' />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Reference Video Section */}

                    {generationMode === "image" && (
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <label className='text-sm font-medium'>Style</label>
                        </div>
                        <div className='grid grid-cols-3 gap-2'>
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
                              type='button'
                              onClick={() =>
                                setSelectedImageStyle(style.value as ImageStyle)
                              }
                              className={cn(
                                "group relative overflow-hidden rounded-xl transition-all",
                                selectedImageStyle === style.value
                                  ? "ring-offset-background ring-2 ring-cyan-500 ring-offset-2"
                                  : "hover:ring-2 hover:ring-neutral-300 dark:hover:ring-neutral-600"
                              )}
                            >
                              <div className='relative aspect-square'>
                                <img
                                  src={style.image}
                                  alt={style.label}
                                  className='h-full w-full object-cover'
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
                                  <div className='absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-500'>
                                    <svg
                                      width='12'
                                      height='12'
                                      viewBox='0 0 12 12'
                                      fill='none'
                                      xmlns='http://www.w3.org/2000/svg'
                                    >
                                      <path
                                        d='M10 3L4.5 8.5L2 6'
                                        stroke='white'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              {/* Label */}
                              <div
                                className={cn(
                                  "absolute right-0 bottom-0 left-0 p-2 text-center",
                                  selectedImageStyle === style.value
                                    ? "bg-black/60"
                                    : "bg-black/60"
                                )}
                              >
                                <span className='text-xs font-medium text-white'>
                                  {style.label}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className='flex items-center justify-between'>
                          <label className='mt-4 text-sm font-medium'>
                            No of Images
                          </label>
                        </div>
                        <div className='flex w-[40%] items-center gap-1.5 border-t pt-2'>
                          <button
                            onClick={() =>
                              setImageCount(Math.max(1, imageCount - 1))
                            }
                            className='flex size-5 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                          >
                            <Minus className='size-2.5' />
                          </button>

                          <div
                            className='relative h-[18px] flex-1 cursor-pointer overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800'
                            onClick={(e) => {
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              const raw = Math.round(
                                ((e.clientX - rect.left) / rect.width) * 3 + 1
                              );
                              setImageCount(Math.max(1, Math.min(4, raw)));
                            }}
                          >
                            <div
                              className='absolute top-0 left-0 h-full rounded-l-md bg-neutral-300 transition-[width] duration-100 dark:bg-neutral-700'
                              style={{
                                width: `${((imageCount - 1) / 3) * 100}%`,
                              }}
                            />

                            <div className='absolute inset-0 flex items-center justify-center'>
                              <span className='text-[10px] font-medium text-neutral-700 tabular-nums dark:text-neutral-200'>
                                {imageCount}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              setImageCount(Math.min(4, imageCount + 1))
                            }
                            className='flex size-5 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                          >
                            <Plus className='size-2.5' />
                          </button>
                        </div>

                        <div className='flex items-center justify-between'>
                          <label className='mt-4 text-sm font-medium'>
                            Aspect Ratio
                          </label>
                        </div>

                        <div className='grid grid-cols-2 gap-2'>
                          {ASPECT_RATIOS.map((ratio) => (
                            <AspectRatioCard
                              key={ratio.value}
                              ratio={ratio}
                              isSelected={selectedAspectRatio === ratio.value}
                              onSelect={() =>
                                setSelectedAspectRatio(
                                  ratio.value as AspectRatio
                                )
                              }
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {generationMode === "video" && (
                      <div className='space-y-2 pt-4 pb-4'>
                        {selectedVideoModel?.capabilities
                          ?.supportsVideoReference && (
                          <div className='space-y-2'>
                            <button
                              type='button'
                              onClick={() => toggleSection("videoRef")}
                              className='bg-neutral-surface-subtle hover:bg-neutral-surface-subtle/80 flex w-full items-center justify-between rounded-lg p-3 transition-colors'
                            >
                              <div className='flex items-center gap-2'>
                                <Video className='text-text-secondary h-4 w-4' />
                                <span className='text-font-primary text-sm font-medium'>
                                  Reference Video
                                </span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <button
                                  type='button'
                                  role='switch'
                                  aria-checked={sectionsEnabled.videoRef}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSection("videoRef");
                                  }}
                                  className={cn(
                                    "relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-200",
                                    sectionsEnabled.videoRef
                                      ? "bg-neutral-900 dark:bg-neutral-100"
                                      : "bg-neutral-300 dark:bg-neutral-600"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
                                      sectionsEnabled.videoRef
                                        ? "translate-x-4"
                                        : "translate-x-0.5"
                                    )}
                                  />
                                </button>
                                {sectionsEnabled.videoRef ? (
                                  <ChevronUp className='text-text-secondary h-4 w-4' />
                                ) : (
                                  <ChevronDown className='text-text-secondary h-4 w-4' />
                                )}
                              </div>
                            </button>
                            {sectionsEnabled.videoRef && (
                              <div className='bg-neutral-surface-subtle border-neutral-12 rounded-lg border p-3'>
                                {referenceVideoPreview ? (
                                  <div className='group relative flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-neutral-50 dark:bg-neutral-900'>
                                    <video
                                      src={referenceVideoPreview}
                                      className='h-full w-full object-cover'
                                      controls={false}
                                      autoPlay
                                      loop
                                      muted
                                    />
                                    <button
                                      type='button'
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setReferenceVideo(null);
                                        setReferenceVideoPreview(null);
                                      }}
                                      className='absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100'
                                    >
                                      <Trash size={14} />
                                    </button>
                                  </div>
                                ) : (
                                  <label className='relative flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900'>
                                    <input
                                      type='file'
                                      accept='video/*'
                                      className='sr-only'
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          setReferenceVideo(file);
                                          setReferenceVideoPreview(
                                            URL.createObjectURL(file)
                                          );
                                        }
                                      }}
                                    />
                                    <Video className='mb-2 h-8 w-8 text-neutral-400' />
                                    <span className='text-sm font-medium text-neutral-500'>
                                      Upload reference video
                                    </span>
                                    <p className='mt-1 text-xs text-neutral-400'>
                                      Max size: 50MB
                                    </p>
                                  </label>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {selectedVideoModel?.allowCustomAudio && (
                          <div className='mt-2 space-y-2'>
                            <button
                              type='button'
                              onClick={() => toggleSection("audio")}
                              className='bg-neutral-surface-subtle hover:bg-neutral-surface-subtle/80 flex w-full items-center justify-between rounded-lg p-3 transition-colors'
                            >
                              <div className='flex items-center gap-2'>
                                <Volume2 className='text-text-secondary h-4 w-4' />
                                <span className='text-font-primary text-sm font-medium'>
                                  Audio & Voice
                                </span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <button
                                  type='button'
                                  role='switch'
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
                                  <ChevronUp className='text-text-secondary h-4 w-4' />
                                ) : (
                                  <ChevronDown className='text-text-secondary h-4 w-4' />
                                )}
                              </div>
                            </button>
                            {sectionsEnabled.audio && (
                              <div className='bg-neutral-surface-subtle border-neutral-12 rounded-lg border p-3'>
                                <VoiceSelector
                                  selectedVoice={selectedVoice}
                                  clonedVoiceId={clonedVoiceId}
                                  onSelectVoice={setSelectedVoice}
                                  onCloneVoice={setClonedVoiceId}
                                  isCloning={isCloningVoice}
                                  onCloningChange={setIsCloningVoice}
                                  onDrawerClose={() => {}}
                                />
                              </div>
                            )}
                          </div>
                        )}

                        <div className='space-y-2'>
                          <button
                            onClick={() =>
                              setSectionsEnabled({
                                ...sectionsEnabled,
                                avatar: !sectionsEnabled.avatar,
                              })
                            }
                            className='flex w-full justify-between rounded-lg bg-neutral-100 p-3 text-sm font-medium dark:bg-neutral-900'
                          >
                            Avatar & Presenter
                            <ChevronDown
                              size={16}
                              className={cn(
                                "transition-transform",
                                sectionsEnabled.avatar && "rotate-180"
                              )}
                            />
                          </button>
                          {sectionsEnabled.avatar && (
                            <div className='rounded-lg border p-3'>
                              <PresenterSelector
                                selectedPresenter={selectedPresenter}
                                onSelectPresenter={setSelectedPresenter}
                                onDrawerClose={() => {}}
                              />
                            </div>
                          )}
                        </div>

                        <div className='space-y-2'>
                          <button
                            onClick={() =>
                              setSectionsEnabled({
                                ...sectionsEnabled,
                                resolution: !sectionsEnabled.resolution,
                              })
                            }
                            className='flex w-full justify-between rounded-lg bg-neutral-100 p-3 text-sm font-medium dark:bg-neutral-900'
                          >
                            Resolution & Format
                            <ChevronDown
                              size={16}
                              className={cn(
                                "transition-transform",
                                sectionsEnabled.resolution && "rotate-180"
                              )}
                            />
                          </button>
                          {sectionsEnabled.resolution && (
                            <div className='space-y-3 rounded-lg border p-3'>
                              <ResolutionSelector
                                selectedResolution={selectedResolution}
                                selectedAspectRatio={selectedAspectRatio}
                                onResolutionChange={setSelectedResolution}
                                onAspectRatioChange={setSelectedAspectRatio}
                                onDrawerClose={() => {}}
                              />
                              {generationMode === "video" && (
                                <div className='border-t pt-2'>
                                  <label className='text-font-primary mb-2 block text-sm font-medium'>
                                    Duration
                                  </label>
                                  <select
                                    value={duration}
                                    onChange={(e) =>
                                      setDuration(Number(e.target.value))
                                    }
                                    className='bg-background border-neutral-12 w-full rounded-md border px-3 py-2 text-sm'
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

                        <div className='space-y-2'>
                          <button
                            onClick={() => toggleSection("advanced")}
                            className='flex w-full justify-between rounded-lg bg-neutral-100 p-3 text-sm font-medium dark:bg-neutral-900'
                          >
                            Advanced Settings
                            <ChevronDown
                              size={16}
                              className={cn(
                                "transition-transform",
                                sectionsEnabled.advanced && "rotate-180"
                              )}
                            />
                          </button>
                          {sectionsEnabled.advanced && (
                            <div className='bg-neutral-surface-subtle border-neutral-12 space-y-3 rounded-lg border p-3'>
                              {/* Fixed Lens Toggle */}
                              <div className='rounded-xl bg-neutral-100 p-3 transition-all dark:bg-neutral-800'>
                                <div className='flex items-center justify-between'>
                                  <div className='flex items-center gap-3'>
                                    <div
                                      className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-lg",
                                        fixedLens
                                          ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                                          : "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400"
                                      )}
                                    >
                                      <svg
                                        width={20}
                                        height={20}
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                      >
                                        <circle cx='12' cy='12' r='10' />
                                        <circle cx='12' cy='12' r='3' />
                                      </svg>
                                    </div>
                                    <div>
                                      <p className='text-sm font-medium text-neutral-900 dark:text-white'>
                                        Fixed Lens
                                      </p>
                                      <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                                        Lock camera position
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type='button'
                                    role='switch'
                                    aria-checked={fixedLens}
                                    aria-label='Fixed Lens'
                                    onClick={() => setFixedLens(!fixedLens)}
                                    className={cn(
                                      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full ring-0 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:focus-visible:ring-neutral-100",
                                      fixedLens
                                        ? "bg-neutral-900 dark:bg-neutral-100"
                                        : "bg-neutral-300 dark:bg-neutral-600"
                                    )}
                                  >
                                    <span
                                      aria-hidden='true'
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
                              <div className='rounded-xl bg-neutral-100 p-3 transition-all dark:bg-neutral-800'>
                                <div className='flex items-center justify-between'>
                                  <div className='flex items-center gap-3'>
                                    <div
                                      className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-lg",
                                        audioEnabled
                                          ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                                          : "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400"
                                      )}
                                    >
                                      <Volume2 className='h-5 w-5' />
                                    </div>
                                    <div>
                                      <p className='text-sm font-medium text-neutral-900 dark:text-white'>
                                        Include Audio
                                      </p>
                                      <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                                        Add sound to video
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type='button'
                                    role='switch'
                                    aria-checked={audioEnabled}
                                    aria-label='Audio'
                                    onClick={() =>
                                      setAudioEnabled(!audioEnabled)
                                    }
                                    className={cn(
                                      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full ring-0 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:focus-visible:ring-neutral-100",
                                      audioEnabled
                                        ? "bg-neutral-900 dark:bg-neutral-100"
                                        : "bg-neutral-300 dark:bg-neutral-600"
                                    )}
                                  >
                                    <span
                                      aria-hidden='true'
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
                    )}
                  </div>

                  <div className='z-10 space-y-3 border-t bg-white px-4 py-3 dark:bg-black'>
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className='flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-transform hover:bg-indigo-700 active:scale-95'
                    >
                      {isGenerating ? (
                        <div className='flex items-center gap-2'>
                          <LoadingFileLoader size={16} />
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

              <div className='relative hidden min-h-0 flex-1 flex-col gap-2.5 overflow-hidden pb-3 md:flex'>
                <div className='flex shrink-0 justify-end gap-2 self-end rounded-xl bg-neutral-100 p-1 dark:bg-neutral-900'>
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
                        "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                        activeContentTab === t.id
                          ? "bg-white shadow-sm dark:bg-neutral-800"
                          : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                      )}
                    >
                      <t.icon size={14} />
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className='flex-1 overflow-y-auto pr-1'>
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
                        onLoadToEditor={handleLoadImageFromHistory}
                        onTabChange={updateContentTab}
                      />
                    ) : (
                      <VideoHistoryTab
                        onLoadToEditor={handleLoadVideoFromHistory}
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
        </div>
      </div>
    </div>
  );
}

export default VideoGenerationPage;
