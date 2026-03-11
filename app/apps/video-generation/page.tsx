"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { ResolutionSelector } from "@/components/video/resolution-selector";
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
import { videoGenApi } from "@/utils/inspire-api";
import { Toaster } from "@/components/ui/sonner";
import { LandingFooter } from "@/components/landing/landing-footer";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingNavbar } from "@/components/landing/landing-navbar";

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

  const [sectionsEnabled, setSectionsEnabled] = useState({
    avatar: false,
    audio: false,
    resolution: false,
    advanced: false,
  });

  const [generatedVideos, setGeneratedVideos] = useState<any[]>([]);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [activeContentTab, setActiveContentTab] = useState<any>(
    urlContentTab || "community",
  );
  const [isResultsDrawerOpen, setIsResultsDrawerOpen] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  const updateContentTab = useCallback(
    (tab: any) => {
      setActiveContentTab(tab);
      const urlParams = new URLSearchParams(searchParams.toString());
      urlParams.set("tab", tab);
      if (projectId) urlParams.set("projectId", projectId);
      router.replace(`/apps/video-generation?${urlParams.toString()}`, {
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
        const endpoint = `/inspire/generate/video/${projectId}`;
        const response = await apiResponse.get(endpoint, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.success) {
          const project = response.data.project;
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
        className="flex-1 relative py-12 md:py-20 px-2 md:px-6 lg:px-20 mt-5"
      >
        <div className="bg-grid-black/[0.05] dark:bg-grid-white/[0.05] absolute inset-0 -z-10" />
        {/* <div className="text-center animate-fadeInUp mb-10 hidden lg:block">
          <h1 className="font-bold tracking-tight md:text-2xl lg:text-5xl">
            AI Video{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Generation
            </span>
          </h1>
          <p
            className="my-5 text-muted-foreground text-sm md:text-lg animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            Generate high-quality videos from text prompts with ease.
          </p>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-[27rem_1fr] gap-6 relative w-full md:h-[calc(100vh-10rem)] min-h-0">
          <div className="flex flex-col h-full min-h-0 overflow-hidden">
            <div className="flex flex-row items-center gap-2 justify-between px-2 py-2">
              <h1 className="font-bold tracking-tight md:text-2xl lg:text-5xl lg:hidden">
                AI Video{" "}
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
                        <VideoPreviewTab
                          generatedVideos={generatedVideos}
                          selectedVideoIndex={selectedVideoIndex}
                          onVideoSelect={setSelectedVideoIndex}
                          isGenerating={isGenerating}
                          generationProgress={generationProgress}
                          selectedAspectRatio={selectedAspectRatio}
                          onPromptRestore={(p) => setPrompt(p)}
                        />
                      )}
                      {activeContentTab === "history" && (
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
                        />
                      )}
                      {activeContentTab === "community" && (
                        <VideoCommunityTab
                          onPromptSelect={(p) => {
                            setPrompt(p);
                            setIsResultsDrawerOpen(false);
                          }}
                          onTabChange={updateContentTab}
                        />
                      )}
                      {activeContentTab === "templates" && (
                        <VideoTemplatesTab
                          onPromptSelect={(p) => {
                            setPrompt(p);
                            setIsResultsDrawerOpen(false);
                          }}
                          onTabChange={updateContentTab}
                        />
                      )}
                      {activeContentTab === "tutorial" && (
                        <TutorialTab type="video" />
                      )}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            <div className="flex flex-col h-full min-h-0 pt-4 overflow-hidden bg-white dark:bg-black/20 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
              <div className="px-4 pb-4 shrink-0 overflow-y-auto hide-scrollbar space-y-3 flex-1">
                <PresetSlider currentSlide={0} onSlideChange={() => {}} />

                <ModelSelector
                  type="video"
                  selectedModel={selectedVideoModel}
                  onSelectModel={setSelectedVideoModel}
                />

                <div className="grid grid-cols-2 gap-2">
                  <div className="relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-neutral-50 dark:bg-neutral-900">
                    {startFramePreview ? (
                      <img
                        src={startFramePreview}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-neutral-500">
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
                      <img
                        src={endFramePreview}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-neutral-500">
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the motion..."
                    className="w-full min-h-[100px] p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-600 text-sm resize-none focus:outline-none"
                  />
                </div>

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
                    <div className="p-3 border rounded-lg space-y-2">
                      <ResolutionSelector
                        selectedResolution={selectedResolution}
                        selectedAspectRatio={selectedAspectRatio}
                        onResolutionChange={setSelectedResolution}
                        onAspectRatioChange={setSelectedAspectRatio}
                        onDrawerClose={() => {}}
                      />
                    </div>
                  )}
                </div>
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
                      <Sparkles size={16} />
                      <span>Generate Video</span>
                    </>
                  )}
                </button>

                {/* Mobile Drawer Trigger */}
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
              {activeContentTab === "preview" && (
                <VideoPreviewTab
                  generatedVideos={generatedVideos}
                  selectedVideoIndex={selectedVideoIndex}
                  onVideoSelect={setSelectedVideoIndex}
                  isGenerating={isGenerating}
                  generationProgress={generationProgress}
                  selectedAspectRatio={selectedAspectRatio}
                  onPromptRestore={(p) => setPrompt(p)}
                />
              )}
              {activeContentTab === "history" && (
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
                />
              )}
              {activeContentTab === "community" && (
                <VideoCommunityTab
                  onPromptSelect={(p) => setPrompt(p)}
                  onTabChange={updateContentTab}
                />
              )}
              {activeContentTab === "templates" && (
                <VideoTemplatesTab
                  onPromptSelect={(p) => setPrompt(p)}
                  onTabChange={updateContentTab}
                />
              )}
              {activeContentTab === "tutorial" && <TutorialTab type="video" />}
            </div>
          </div>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
}

export default withAuth(VideoGenerationPage);
