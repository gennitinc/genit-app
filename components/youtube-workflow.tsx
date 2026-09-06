"use client";

import { Navbar } from "./navbar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { createYoutubeTimeline } from "@/lib/youtube-timeline";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import {
  ArrowLeft,
  ArrowUp,
  Bot,
  Camera,
  Check,
  ChevronDown,
  Clock3,
  Download,
  Film,
  Image as ImageIcon,
  MapPin,
  Mic2,
  Pause,
  Play,
  Plus,
  RefreshCw,
  SkipBack,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
  Users,
  Volume2,
  WandSparkles,
  Youtube,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";

type Character = {
  id: string;
  name: string;
  description: string;
  voice: string;
  scenes: number[];
  imageUrl?: string;
};

type Scene = {
  number: number;
  title: string;
  description: string;
  location: string;
  environment: string;
  characterIds: string[];
  action: string;
  emotion: string;
  dialogue: string;
  narration: string;
  camera: string;
  visualPrompt: string;
  audio: string;
  durationSeconds: number;
  assetUrl?: string;
  audioUrl?: string;
  assetType?: "image" | "video";
  generationStatus?: "pending" | "generating" | "ready" | "failed";
};

type Storyboard = {
  title: string;
  logline: string;
  summary: string;
  estimatedDuration: string;
  characters: Character[];
  scenes: Scene[];
};

type WorkflowData = {
  brief: string;
  contentKind: string;
  productionMode: "image" | "video";
  aspectRatio: string;
  targetLength: string;
  visualStyle: string;
  storyboard: Storyboard;
  exportUrl?: string;
};

type CharacterUpload = { file: File; name: string; preview: string };
type ChatMessage = { role: "user" | "assistant"; content: string };

const CONTENT_TYPES = [
  ["story", "Story"],
  ["motivational", "Motivational"],
  ["educational", "Educational"],
  ["documentary", "Documentary"],
  ["faceless", "Faceless"],
  ["explainer", "Explainer"],
] as const;

const fieldClass =
  "h-11 rounded-xl border-white/10 bg-white/[0.04] text-sm text-white outline-none transition-[border-color,background-color] duration-150 focus:border-red-500/60 focus:bg-white/[0.06]";

export default function YouTubeWorkflow({ slug }: { slug?: string }) {
  const router = useRouter();
  const isNew = !slug || slug === "create";
  const [projectName, setProjectName] = useState("YouTube Studio");
  const [loading, setLoading] = useState(!isNew);
  const [generating, setGenerating] = useState(false);
  const [generatingAssets, setGeneratingAssets] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [brief, setBrief] = useState("");
  const [contentKind, setContentKind] = useState("story");
  const [productionMode, setProductionMode] = useState<"image" | "video">(
    "video"
  );
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [targetLength, setTargetLength] = useState("3-5 minutes");
  const [visualStyle, setVisualStyle] = useState("Cinematic realistic");
  const [characters, setCharacters] = useState<CharacterUpload[]>([]);
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  const [activeTab, setActiveTab] = useState<
    "storyboard" | "characters" | "editor"
  >("storyboard");
  const [playhead, setPlayhead] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatSettingsOpen, setChatSettingsOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "I can edit scenes, generate one scene or the full production, change format, reorder the timeline, and export the final video.",
    },
  ]);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const previewAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isNew) return;

    apiResponse
      .get(`/apps/workflow/${slug}`, { withCredentials: true })
      .then((response) => {
        const project = response.data.data;
        setProjectName(project.name);
        const saved = project.nodes?.find(
          (node: any) => node.type === "youtubeStoryboard"
        )?.data as WorkflowData | undefined;
        if (!saved) return;
        setBrief(saved.brief || "");
        setContentKind(saved.contentKind || "story");
        setProductionMode(saved.productionMode || "video");
        setAspectRatio(saved.aspectRatio || "16:9");
        setTargetLength(saved.targetLength || "3-5 minutes");
        setVisualStyle(saved.visualStyle || "Cinematic realistic");
        setStoryboard(saved.storyboard);
        setExportUrl(saved.exportUrl || null);
      })
      .catch(() => toast.error("Could not load this YouTube project"))
      .finally(() => setLoading(false));
  }, [isNew, slug]);

  useEffect(
    () => () =>
      characters.forEach((character) => URL.revokeObjectURL(character.preview)),
    [characters]
  );

  const timeline = useMemo(
    () => createYoutubeTimeline(storyboard?.scenes || []),
    [storyboard]
  );

  const totalSeconds = useMemo(() => timeline.at(-1)?.end || 0, [timeline]);

  const activeScene =
    timeline.find(({ start, end }) => playhead >= start && playhead < end) ||
    timeline.at(-1);

  useEffect(() => {
    if (!playing || totalSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setPlayhead((current) => {
        if (current >= totalSeconds) {
          setPlaying(false);
          return 0;
        }
        return Math.min(totalSeconds, current + 0.1);
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [playing, totalSeconds]);

  useEffect(() => {
    if (!activeScene) return;
    const sceneTime = Math.max(0, playhead - activeScene.start);
    [previewVideoRef.current, previewAudioRef.current].forEach((media) => {
      if (!media) return;
      if (Math.abs(media.currentTime - sceneTime) > 0.35) {
        media.currentTime = sceneTime;
      }
      if (playing) media.play().catch(() => {});
      else media.pause();
    });
  }, [activeScene, playhead, playing]);

  const addCharacters = (files: FileList | null) => {
    if (!files) return;
    const selected = Array.from(files);
    const valid = selected.filter(
      (file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024
    );
    if (valid.length !== selected.length) {
      toast.error("Character references must be images smaller than 10 MB");
    }
    const accepted = valid.slice(0, Math.max(0, 20 - characters.length));
    if (accepted.length !== valid.length) {
      toast.error("You can add up to 20 character references");
    }
    const additions = accepted.map((file) => ({
      file,
      name: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      preview: URL.createObjectURL(file),
    }));
    setCharacters((current) => [...current, ...additions]);
  };

  const removeCharacter = (index: number) => {
    setCharacters((current) => {
      URL.revokeObjectURL(current[index].preview);
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const generateStoryboard = async () => {
    if (!brief.trim()) {
      toast.error("Add a title, idea, storyline, or script first");
      return;
    }

    setGenerating(true);
    try {
      let projectSlug = slug;
      if (isNew) {
        const name =
          brief.trim().split("\n")[0].slice(0, 64) || "YouTube Story";
        const projectResponse = await apiResponse.post(
          "/apps/workflow",
          { name },
          { withCredentials: true }
        );
        projectSlug = projectResponse.data.data.slug;
        setProjectName(name);
      }

      const form = new FormData();
      form.append("brief", brief.trim());
      form.append("contentKind", contentKind);
      form.append("productionMode", productionMode);
      form.append("aspectRatio", aspectRatio);
      form.append("targetLength", targetLength);
      form.append("visualStyle", visualStyle);
      form.append(
        "characterNames",
        JSON.stringify(characters.map((character) => character.name))
      );
      form.append(
        "existingCharacters",
        JSON.stringify(storyboard?.characters || [])
      );
      characters.forEach((character) =>
        form.append("characters", character.file)
      );

      const response = await apiResponse.post(
        `/apps/workflow/${projectSlug}/youtube-storyboard`,
        form,
        { withCredentials: true }
      );
      setStoryboard(response.data.data.storyboard);
      toast.success("Your storyboard is ready");

      if (isNew && projectSlug) {
        router.replace(`/apps/workflow/${projectSlug}`);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Storyboard generation failed"
      );
    } finally {
      setGenerating(false);
    }
  };

  const saveStoryboard = async (nextStoryboard: Storyboard) => {
    if (!slug || slug === "create") return;
    await apiResponse.put(
      `/apps/workflow/${slug}`,
      {
        nodes: [
          {
            id: "youtube-storyboard",
            type: "youtubeStoryboard",
            position: { x: 0, y: 0 },
            data: {
              brief,
              contentKind,
              productionMode,
              aspectRatio,
              targetLength,
              visualStyle,
              storyboard: nextStoryboard,
              exportUrl: null,
            },
          },
        ],
        edges: [],
      },
      { withCredentials: true }
    );
  };

  const readAudioDuration = (url: string) =>
    new Promise<number>((resolve) => {
      const audio = new Audio();
      const timeout = window.setTimeout(() => resolve(0), 15000);
      audio.preload = "metadata";
      audio.onloadedmetadata = () => {
        window.clearTimeout(timeout);
        resolve(Number.isFinite(audio.duration) ? audio.duration : 0);
      };
      audio.onerror = () => {
        window.clearTimeout(timeout);
        resolve(0);
      };
      audio.src = url;
    });

  const generateSceneAssets = async (
    working: Storyboard,
    index: number,
    options: {
      target?: "visual" | "audio" | "both";
      mode?: "image" | "video";
      force?: boolean;
    } = {}
  ) => {
    if (!slug || slug === "create") throw new Error("Project is not saved");
    const target = options.target || "both";
    const mode = options.mode || productionMode;
    const scene = working.scenes[index];
    setExportUrl(null);
    const spokenText = scene.narration || scene.dialogue;
    working.scenes[index] = { ...scene, generationStatus: "generating" };
    setStoryboard({ ...working, scenes: [...working.scenes] });

    let audioUrl =
      target !== "visual" && options.force ? undefined : scene.audioUrl;
    if (target !== "visual" && spokenText && !audioUrl) {
      const audioForm = new FormData();
      audioForm.append("projectId", slug);
      audioForm.append("nodeId", "youtube-storyboard");
      audioForm.append("contentType", "audio");
      audioForm.append("prompt", spokenText);
      const audioResponse = await apiResponse.post(
        "/apps/workflow/ai/process",
        audioForm,
        { withCredentials: true }
      );
      audioUrl = audioResponse.data.data.url;
    }

    const audioDuration = audioUrl ? await readAudioDuration(audioUrl) : 0;
    const sceneDuration = Math.max(
      1,
      scene.durationSeconds,
      Math.ceil(audioDuration)
    );
    let assetUrl =
      target !== "audio" && options.force ? undefined : scene.assetUrl;

    if (target !== "audio" && !assetUrl) {
      const visualForm = new FormData();
      visualForm.append("projectId", slug);
      visualForm.append("nodeId", "youtube-storyboard");
      visualForm.append("contentType", mode);
      visualForm.append("prompt", scene.visualPrompt);
      visualForm.append("aspectRatio", aspectRatio);
      visualForm.append("duration", String(sceneDuration));
      scene.characterIds.forEach((characterId) => {
        const imageUrl = working.characters.find(
          (character) => character.id === characterId
        )?.imageUrl;
        if (imageUrl) visualForm.append("referenceImages", imageUrl);
      });
      const visualResponse = await apiResponse.post(
        "/apps/workflow/ai/process",
        visualForm,
        { withCredentials: true }
      );
      assetUrl = visualResponse.data.data.url;
    }

    working.scenes[index] = {
      ...scene,
      assetUrl,
      audioUrl,
      assetType: target === "audio" ? scene.assetType : mode,
      durationSeconds: sceneDuration,
      generationStatus:
        assetUrl && (!spokenText || audioUrl) ? "ready" : "pending",
    };
    const next = { ...working, scenes: [...working.scenes] };
    setStoryboard(next);
    await saveStoryboard(next);
    return next;
  };

  const generateSingleScene = async (
    sceneNumber: number,
    target: "visual" | "audio" | "both" = "both",
    mode: "image" | "video" = productionMode
  ) => {
    if (!storyboard) return;
    const index = storyboard.scenes.findIndex(
      (scene) => scene.number === sceneNumber
    );
    if (index < 0) {
      toast.error("Scene not found");
      return;
    }
    setGeneratingAssets(true);
    setPlaying(false);
    let working = {
      ...storyboard,
      scenes: storyboard.scenes.map((scene) => ({ ...scene })),
    };
    try {
      working = await generateSceneAssets(working, index, {
        target,
        mode,
        force: true,
      });
      setActiveTab("editor");
      setPlayhead(createYoutubeTimeline(working.scenes)[index]?.start || 0);
      toast.success(`Scene ${sceneNumber} is ready on the timeline`);
    } catch (error: any) {
      working.scenes[index] = {
        ...working.scenes[index],
        generationStatus: "failed",
      };
      setStoryboard({ ...working, scenes: [...working.scenes] });
      await saveStoryboard(working).catch(() => {});
      toast.error(error.response?.data?.message || "Scene generation failed");
    } finally {
      setGeneratingAssets(false);
    }
  };

  const generateProduction = async () => {
    if (!storyboard || !slug || slug === "create") {
      toast.error("Save the storyboard before generating production assets");
      return;
    }

    setGeneratingAssets(true);
    setGenerationProgress(0);
    setPlaying(false);
    let working: Storyboard = {
      ...storyboard,
      scenes: storyboard.scenes.map((scene) => ({ ...scene })),
    };

    try {
      for (let index = 0; index < working.scenes.length; index++) {
        const scene = working.scenes[index];
        const spokenText = scene.narration || scene.dialogue;
        if (!(
          scene.generationStatus === "ready" &&
          scene.assetUrl &&
          (!spokenText || scene.audioUrl)
        )) {
          working = await generateSceneAssets(working, index);
        }
        setGenerationProgress(
          Math.round(((index + 1) / working.scenes.length) * 100)
        );
      }
      setActiveTab("editor");
      setPlayhead(0);
      toast.success("All scenes and voiceovers are placed on the timeline");
    } catch (error: any) {
      const failedIndex = working.scenes.findIndex(
        (scene) => scene.generationStatus === "generating"
      );
      if (failedIndex >= 0) {
        working.scenes[failedIndex] = {
          ...working.scenes[failedIndex],
          generationStatus: "failed",
        };
        setStoryboard({ ...working, scenes: [...working.scenes] });
        await saveStoryboard(working).catch(() => {});
      }
      toast.error(
        error.response?.data?.message || "Production generation stopped"
      );
    } finally {
      setGeneratingAssets(false);
    }
  };

  const exportVideo = async () => {
    if (!storyboard || !slug || slug === "create") return;
    if (storyboard.scenes.some((scene) => !scene.assetUrl)) {
      toast.error("Generate every scene before exporting");
      return;
    }
    setExporting(true);
    setExportProgress(0);
    try {
      const response = await apiResponse.post(
        `/apps/workflow/${slug}/youtube-export`,
        {},
        { withCredentials: true }
      );
      const jobId = response.data.data.id;
      while (true) {
        await new Promise((resolve) => window.setTimeout(resolve, 1500));
        const statusResponse = await apiResponse.get(
          `/apps/workflow/${slug}/youtube-export/${jobId}`,
          { withCredentials: true }
        );
        const job = statusResponse.data.data;
        setExportProgress(job.progress || 0);
        if (job.status === "failed")
          throw new Error(job.error || "Export failed");
        if (job.status === "complete") {
          setExportUrl(job.url);
          toast.success("MP4 export is ready");
          break;
        }
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "Export failed"
      );
    } finally {
      setExporting(false);
    }
  };

  const downloadExport = () => {
    if (!exportUrl) return;
    const link = document.createElement("a");
    link.href = exportUrl;
    link.download = `${projectName || "youtube-video"}.mp4`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  const sendChatMessage = async () => {
    const message = chatInput.trim();
    if (!message || chatBusy || !slug || slug === "create") return;
    setChatInput("");
    setChatOpen(true);
    setChatBusy(true);
    setChatMessages((current) => [
      ...current,
      { role: "user", content: message },
    ]);
    try {
      const response = await apiResponse.post(
        `/apps/workflow/${slug}/youtube-agent`,
        {
          message,
          selectedSceneNumber: activeScene?.scene.number,
        },
        { withCredentials: true }
      );
      const result = response.data.data;
      if (result.workflowData?.storyboard) {
        setStoryboard(result.workflowData.storyboard);
        setProductionMode(result.workflowData.productionMode || productionMode);
        setExportUrl(result.workflowData.exportUrl || null);
      }
      setChatMessages((current) => [
        ...current,
        { role: "assistant", content: result.reply },
      ]);
      if (result.action === "generate_scene") {
        await generateSingleScene(
          result.sceneNumber,
          result.target,
          result.productionMode || productionMode
        );
      } else if (result.action === "generate_all") {
        await generateProduction();
      } else if (result.action === "export") {
        await exportVideo();
      }
    } catch (error: any) {
      setChatMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error.response?.data?.message ||
            "I could not complete that command.",
        },
      ]);
    } finally {
      setChatBusy(false);
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#09090b]'>
        <LoadingFileLoader />
      </div>
    );
  }

  if (!storyboard) {
    return (
      <div className='min-h-screen bg-[#09090b] text-white'>
        <Navbar title='YouTube Studio' />
        <main className='relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-4 py-16'>
          <button
            onClick={() => router.push("/apps")}
            className='absolute top-6 left-6 flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors duration-150 hover:text-zinc-200'
          >
            <ArrowLeft className='h-3.5 w-3.5' /> Apps
          </button>

          <div className='w-full max-w-3xl'>
            <div className='mb-10 text-center'>
              <span className='mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 shadow-[0_0_36px_rgba(220,38,38,0.25)]'>
                <Youtube className='h-6 w-6' />
              </span>
              <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
                Create your next YouTube story
              </h1>
              <p className='mt-3 text-sm text-zinc-500'>
                Start with a title, an idea, or paste your complete story.
              </p>
            </div>

            <div className='relative'>
              {chatSettingsOpen && (
                <div className='absolute right-0 bottom-[calc(100%+12px)] z-20 w-full origin-bottom-right rounded-3xl border border-white/10 bg-[#151515] p-4 shadow-2xl shadow-black/60 sm:w-[520px]'>
                  <div className='grid grid-cols-2 gap-2'>
                    {(["image", "video"] as const).map((mode) => (
                      <button
                        type='button'
                        key={mode}
                        onClick={() => setProductionMode(mode)}
                        className={cn(
                          "flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-[background-color,color,transform] duration-150 active:scale-[0.97]",
                          productionMode === mode
                            ? "bg-zinc-100 text-zinc-950"
                            : "bg-white/[0.04] text-zinc-300 hover:bg-white/[0.07]"
                        )}
                      >
                        {mode === "image" ? (
                          <ImageIcon className='h-4 w-4' />
                        ) : (
                          <Film className='h-4 w-4' />
                        )}
                        {mode === "image" ? "Image" : "Video"}
                      </button>
                    ))}
                  </div>

                  <div className='mt-2 grid grid-cols-3 gap-2'>
                    {["16:9", "9:16", "1:1"].map((ratio) => (
                      <button
                        type='button'
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={cn(
                          "h-10 rounded-xl text-sm transition-[background-color,color,transform] duration-150 active:scale-[0.97]",
                          aspectRatio === ratio
                            ? "bg-zinc-600 text-white"
                            : "bg-white/[0.04] text-zinc-400 hover:text-white"
                        )}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>

                  <div className='my-4 h-px bg-white/10' />
                  <div className='grid gap-2 sm:grid-cols-3'>
                    <select
                      aria-label='Content type'
                      value={contentKind}
                      onChange={(event) => setContentKind(event.target.value)}
                      className={cn(fieldClass, "px-3")}
                    >
                      {CONTENT_TYPES.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label='Target length'
                      value={targetLength}
                      onChange={(event) => setTargetLength(event.target.value)}
                      className={cn(fieldClass, "px-3")}
                    >
                      <option>30-60 seconds</option>
                      <option>1-3 minutes</option>
                      <option>3-5 minutes</option>
                      <option>5-10 minutes</option>
                      <option>10-20 minutes</option>
                    </select>
                    <select
                      aria-label='Visual style'
                      value={visualStyle}
                      onChange={(event) => setVisualStyle(event.target.value)}
                      className={cn(fieldClass, "px-3")}
                    >
                      <option>Cinematic realistic</option>
                      <option>3D animation</option>
                      <option>Anime</option>
                      <option>Documentary</option>
                      <option>Illustrated</option>
                      <option>Minimal faceless</option>
                    </select>
                  </div>
                </div>
              )}

              {characters.length > 0 && (
                <div className='mb-3 flex flex-wrap gap-2'>
                  {characters.map((character, index) => (
                    <div
                      key={`${character.file.name}-${index}`}
                      className='flex items-center gap-2 rounded-xl border border-white/10 bg-[#151515] p-1.5'
                    >
                      <img
                        src={character.preview}
                        alt=''
                        className='h-9 w-9 rounded-lg object-cover'
                      />
                      <Input
                        value={character.name}
                        onChange={(event) =>
                          setCharacters((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, name: event.target.value }
                                : item
                            )
                          )
                        }
                        aria-label={`Character ${index + 1} name`}
                        className='h-8 w-32 border-0 bg-transparent px-1 text-xs focus-visible:ring-0'
                      />
                      <button
                        type='button'
                        onClick={() => removeCharacter(index)}
                        aria-label={`Remove ${character.name}`}
                        className='rounded-lg p-2 text-zinc-600 transition-colors duration-150 hover:bg-red-500/10 hover:text-red-400'
                      >
                        <Trash2 className='h-3.5 w-3.5' />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setChatSettingsOpen(false);
                  generateStoryboard();
                }}
                className='rounded-[28px] border border-white/15 bg-[#151515] p-3 shadow-2xl shadow-black/50 transition-[border-color] duration-150 focus-within:border-white/25'
              >
                <textarea
                  value={brief}
                  onChange={(event) => setBrief(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                  placeholder='What story do you want to create?'
                  aria-label='YouTube story idea'
                  className='min-h-28 w-full resize-none bg-transparent px-4 py-3 text-base leading-6 text-white outline-none placeholder:text-zinc-600'
                />

                <div className='flex flex-wrap items-center justify-between gap-3 px-1'>
                  <div className='flex items-center gap-2'>
                    <label className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/[0.05] text-zinc-300 transition-[background-color,transform] duration-150 hover:bg-white/[0.09] active:scale-[0.97]'>
                      <Plus className='h-5 w-5' />
                      <span className='sr-only'>Upload character images</span>
                      <input
                        type='file'
                        accept='image/*'
                        multiple
                        className='sr-only'
                        onChange={(event) => addCharacters(event.target.files)}
                      />
                    </label>
                    <span className='rounded-full bg-white/[0.05] px-4 py-2.5 text-xs font-medium text-zinc-300'>
                      Story agent
                    </span>
                  </div>

                  <div className='flex min-w-0 items-center gap-2'>
                    <button
                      type='button'
                      onClick={() => setChatSettingsOpen((open) => !open)}
                      aria-expanded={chatSettingsOpen}
                      className='max-w-[250px] truncate rounded-full bg-white/[0.05] px-4 py-2.5 text-xs text-zinc-400 transition-[background-color,color,transform] duration-150 hover:bg-white/[0.09] hover:text-white active:scale-[0.97]'
                    >
                      {productionMode === "video" ? "Video" : "Image"} ·{" "}
                      {aspectRatio} · {targetLength}
                    </button>
                    <button
                      type='submit'
                      disabled={generating || !brief.trim()}
                      aria-label='Generate story'
                      className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 transition-[background-color,transform,opacity] duration-150 hover:bg-white active:scale-[0.97] disabled:opacity-30'
                    >
                      {generating ? (
                        <LoadingFileLoader size={17} />
                      ) : (
                        <ArrowUp className='h-5 w-5' />
                      )}
                    </button>
                  </div>
                </div>
              </form>
              <p className='mt-3 text-center text-[11px] text-zinc-700'>
                Send generates the story and turns it into editable scenes.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#09090b] text-white'>
      <Navbar title={projectName} />

      <main className='mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8'>
        <div className='mb-6 flex flex-wrap items-end justify-between gap-4'>
          <div>
            <button
              onClick={() => router.push("/apps")}
              className='mb-3 flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors duration-150 hover:text-zinc-200'
            >
              <ArrowLeft className='h-3.5 w-3.5' /> Apps
            </button>
            <div className='flex items-center gap-3'>
              <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 shadow-[0_0_28px_rgba(220,38,38,0.22)]'>
                <Youtube className='h-5 w-5' />
              </span>
              <div>
                <h1 className='text-xl font-semibold tracking-tight sm:text-2xl'>
                  YouTube Studio AI
                </h1>
                <p className='mt-0.5 text-sm text-zinc-500'>
                  Idea to production-ready storyboard, scene by scene.
                </p>
              </div>
            </div>
          </div>
          {storyboard && (
            <div className='flex items-center gap-2 text-xs text-zinc-400'>
              <span className='rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5'>
                {storyboard.scenes.length} scenes
              </span>
              <span className='rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5'>
                {Math.floor(totalSeconds / 60)}m {totalSeconds % 60}s
              </span>
            </div>
          )}
        </div>

        <div className='grid items-start gap-6'>
          {!storyboard && (
            <aside className='rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-2xl shadow-black/20 lg:sticky lg:top-4'>
              <div className='mb-4 flex items-center justify-between'>
                <div>
                  <h2 className='text-sm font-semibold'>Create your story</h2>
                  <p className='mt-1 text-xs text-zinc-500'>
                    A title is enough. A full script works too.
                  </p>
                </div>
                <Sparkles className='h-4 w-4 text-red-400' />
              </div>

              <label className='mb-2 block text-xs font-medium text-zinc-400'>
                Title, idea, storyline, or script
              </label>
              <textarea
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                placeholder='A young Nigerian man discovers that his pastor has been secretly stealing people’s destinies...'
                className='min-h-40 w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-white transition-[border-color,background-color] duration-150 outline-none placeholder:text-zinc-600 focus:border-red-500/60 focus:bg-white/[0.06]'
              />

              <div className='mt-4 grid grid-cols-2 gap-3'>
                <label className='space-y-2 text-xs font-medium text-zinc-400'>
                  Content type
                  <span className='relative block'>
                    <select
                      value={contentKind}
                      onChange={(event) => setContentKind(event.target.value)}
                      className={cn(
                        fieldClass,
                        "w-full appearance-none px-3 pr-8"
                      )}
                    >
                      {CONTENT_TYPES.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className='pointer-events-none absolute top-3.5 right-3 h-4 w-4 text-zinc-500' />
                  </span>
                </label>
                <label className='space-y-2 text-xs font-medium text-zinc-400'>
                  Target length
                  <span className='relative block'>
                    <select
                      value={targetLength}
                      onChange={(event) => setTargetLength(event.target.value)}
                      className={cn(
                        fieldClass,
                        "w-full appearance-none px-3 pr-8"
                      )}
                    >
                      <option>30-60 seconds</option>
                      <option>1-3 minutes</option>
                      <option>3-5 minutes</option>
                      <option>5-10 minutes</option>
                      <option>10-20 minutes</option>
                    </select>
                    <ChevronDown className='pointer-events-none absolute top-3.5 right-3 h-4 w-4 text-zinc-500' />
                  </span>
                </label>
              </div>

              <div className='mt-4'>
                <label className='mb-2 block text-xs font-medium text-zinc-400'>
                  Production mode
                </label>
                <div className='grid grid-cols-2 rounded-xl border border-white/10 bg-black/30 p-1'>
                  {(["image", "video"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setProductionMode(mode)}
                      className={cn(
                        "flex h-9 items-center justify-center gap-2 rounded-lg text-xs font-medium transition-[background-color,color,transform] duration-150 active:scale-[0.97]",
                        productionMode === mode
                          ? "bg-white text-black"
                          : "text-zinc-500 hover:text-zinc-200"
                      )}
                    >
                      {mode === "image" ? (
                        <ImageIcon className='h-3.5 w-3.5' />
                      ) : (
                        <Film className='h-3.5 w-3.5' />
                      )}
                      {mode === "image" ? "Image scenes" : "Video scenes"}
                    </button>
                  ))}
                </div>
              </div>

              <div className='mt-4 grid grid-cols-2 gap-3'>
                <label className='space-y-2 text-xs font-medium text-zinc-400'>
                  Aspect ratio
                  <select
                    value={aspectRatio}
                    onChange={(event) => setAspectRatio(event.target.value)}
                    className={cn(fieldClass, "w-full px-3")}
                  >
                    <option>16:9</option>
                    <option>9:16</option>
                    <option>1:1</option>
                  </select>
                </label>
                <label className='space-y-2 text-xs font-medium text-zinc-400'>
                  Visual style
                  <select
                    value={visualStyle}
                    onChange={(event) => setVisualStyle(event.target.value)}
                    className={cn(fieldClass, "w-full px-3")}
                  >
                    <option>Cinematic realistic</option>
                    <option>3D animation</option>
                    <option>Anime</option>
                    <option>Documentary</option>
                    <option>Illustrated</option>
                    <option>Minimal faceless</option>
                  </select>
                </label>
              </div>

              <div className='mt-5 border-t border-white/10 pt-4'>
                <div className='mb-3 flex items-center justify-between'>
                  <div>
                    <p className='text-xs font-medium text-zinc-300'>
                      Character references{" "}
                      <span className='text-zinc-600'>(optional)</span>
                    </p>
                    <p className='mt-1 text-[11px] text-zinc-600'>
                      Upload a clear image and name each person.
                    </p>
                  </div>
                  <span className='text-[10px] text-zinc-600'>
                    {characters.length}/20
                  </span>
                </div>

                <label className='flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.025] px-3 py-4 text-xs font-medium text-zinc-400 transition-[border-color,background-color,color] duration-150 hover:border-red-500/40 hover:bg-red-500/[0.04] hover:text-zinc-200'>
                  <Upload className='h-4 w-4' /> Upload character images
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    className='sr-only'
                    onChange={(event) => addCharacters(event.target.files)}
                  />
                </label>

                {characters.length > 0 && (
                  <div className='mt-3 space-y-2'>
                    {characters.map((character, index) => (
                      <div
                        key={`${character.file.name}-${index}`}
                        className='flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 p-2'
                      >
                        {/* Blob previews are local and do not benefit from Next image optimization. */}
                        <img
                          src={character.preview}
                          alt=''
                          className='h-10 w-10 rounded-lg object-cover'
                        />
                        <Input
                          value={character.name}
                          onChange={(event) =>
                            setCharacters((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, name: event.target.value }
                                  : item
                              )
                            )
                          }
                          aria-label={`Character ${index + 1} name`}
                          className='h-9 flex-1 rounded-lg border-white/10 bg-transparent text-xs'
                        />
                        <button
                          onClick={() => removeCharacter(index)}
                          aria-label={`Remove ${character.name}`}
                          className='rounded-lg p-2 text-zinc-600 transition-colors duration-150 hover:bg-red-500/10 hover:text-red-400'
                        >
                          <Trash2 className='h-3.5 w-3.5' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={generateStoryboard}
                disabled={generating || !brief.trim()}
                className='mt-5 h-12 w-full rounded-xl bg-red-600 font-semibold text-white shadow-[0_10px_30px_rgba(220,38,38,0.2)] transition-[background-color,transform] duration-150 hover:bg-red-500 active:scale-[0.97] disabled:opacity-50'
              >
                {generating ? (
                  <>
                    <LoadingFileLoader size={18} /> Directing your story...
                  </>
                ) : (
                  <>
                    <WandSparkles className='mr-2 h-4 w-4' />{" "}
                    {storyboard
                      ? "Regenerate storyboard"
                      : "Generate storyboard"}
                  </>
                )}
              </Button>
            </aside>
          )}

          <section className='min-w-0'>
            {!storyboard ? (
              <div className='flex min-h-[680px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 text-center'>
                <div className='relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04]'>
                  <Film className='h-8 w-8 text-zinc-500' />
                  <span className='absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-xl bg-red-600'>
                    <Sparkles className='h-4 w-4' />
                  </span>
                </div>
                <h2 className='text-lg font-semibold'>
                  Your storyboard will appear here
                </h2>
                <p className='mt-2 max-w-md text-sm leading-6 text-zinc-500'>
                  Add your idea and optional character references. AI will write
                  the story, map recurring characters, and direct every scene.
                </p>
                <div className='mt-8 grid w-full max-w-xl grid-cols-3 gap-3 text-left'>
                  {[
                    [Users, "Consistent cast", "Persistent character IDs"],
                    [Camera, "Scene direction", "Action, emotion & camera"],
                    [Mic2, "Complete audio", "Dialogue & narration"],
                  ].map(([Icon, title, copy]) => {
                    const FeatureIcon = Icon as typeof Users;
                    return (
                      <div
                        key={title as string}
                        className='rounded-xl border border-white/10 bg-white/[0.025] p-3'
                      >
                        <FeatureIcon className='mb-3 h-4 w-4 text-red-400' />
                        <p className='text-xs font-medium'>{title as string}</p>
                        <p className='mt-1 text-[10px] leading-4 text-zinc-600'>
                          {copy as string}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <div className='mb-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.055] to-white/[0.015] p-5'>
                  <div className='mb-4 flex flex-wrap items-start justify-between gap-4'>
                    <div className='max-w-3xl'>
                      <div className='mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-red-400 uppercase'>
                        <Check className='h-3.5 w-3.5' /> Storyboard ready
                      </div>
                      <h2 className='text-xl font-semibold tracking-tight sm:text-2xl'>
                        {storyboard.title}
                      </h2>
                      <p className='mt-2 text-sm leading-6 text-zinc-400'>
                        {storyboard.logline}
                      </p>
                    </div>
                    <div className='flex flex-wrap items-center justify-end gap-2'>
                      <span className='rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-zinc-400'>
                        {productionMode === "video"
                          ? "Video production"
                          : "Image production"}
                      </span>
                      <Button
                        onClick={generateProduction}
                        disabled={generatingAssets}
                        className='h-9 rounded-xl bg-red-600 px-3 text-xs font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-red-500 active:scale-[0.97] disabled:opacity-60'
                      >
                        {generatingAssets ? (
                          <>
                            <LoadingFileLoader size={20} /> Generating{" "}
                            {generationProgress}%
                          </>
                        ) : (
                          <>
                            <WandSparkles className='mr-1.5 h-3.5 w-3.5' />
                            Generate production
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={exportUrl ? downloadExport : exportVideo}
                        disabled={exporting || generatingAssets}
                        variant='outline'
                        className='h-9 rounded-xl border-white/10 bg-white/[0.035] px-3 text-xs font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-white/[0.08] active:scale-[0.97] disabled:opacity-60'
                      >
                        {exporting ? (
                          <>
                            <LoadingFileLoader size={20} /> Exporting{" "}
                            {exportProgress}%
                          </>
                        ) : (
                          <>
                            <Download className='mr-1.5 h-3.5 w-3.5' />
                            {exportUrl ? "Download MP4" : "Export MP4"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className='border-t border-white/10 pt-4 text-sm leading-6 text-zinc-500'>
                    {storyboard.summary}
                  </p>
                </div>

                <div className='mb-4 flex gap-1 rounded-xl border border-white/10 bg-white/[0.025] p-1'>
                  {(["storyboard", "characters", "editor"] as const).map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "flex h-9 items-center gap-2 rounded-lg px-4 text-xs font-medium capitalize transition-[background-color,color] duration-150",
                          activeTab === tab
                            ? "bg-white text-black"
                            : "text-zinc-500 hover:text-zinc-200"
                        )}
                      >
                        {tab === "storyboard" ? (
                          <Film className='h-3.5 w-3.5' />
                        ) : tab === "characters" ? (
                          <Users className='h-3.5 w-3.5' />
                        ) : (
                          <Camera className='h-3.5 w-3.5' />
                        )}
                        {tab}
                      </button>
                    )
                  )}
                </div>

                {activeTab === "characters" ? (
                  <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
                    {storyboard.characters.map((character) => (
                      <article
                        key={character.id}
                        className='overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]'
                      >
                        {character.imageUrl ? (
                          <img
                            src={character.imageUrl}
                            alt={character.name}
                            className='aspect-video w-full object-cover'
                          />
                        ) : (
                          <div className='flex aspect-video items-center justify-center bg-gradient-to-br from-red-500/10 to-transparent'>
                            <Users className='h-8 w-8 text-zinc-700' />
                          </div>
                        )}
                        <div className='p-4'>
                          <div className='flex items-center justify-between gap-2'>
                            <h3 className='text-sm font-semibold'>
                              {character.name}
                            </h3>
                            <code className='rounded bg-red-500/10 px-2 py-1 text-[10px] text-red-400'>
                              {character.id}
                            </code>
                          </div>
                          <p className='mt-2 text-xs leading-5 text-zinc-500'>
                            {character.description}
                          </p>
                          <div className='mt-3 flex items-center justify-between text-[10px] text-zinc-600'>
                            <span>{character.voice}</span>
                            <span>
                              Scenes {character.scenes?.join(", ") || "—"}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : activeTab === "editor" ? (
                  <div className='overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d10]'>
                    <div className='grid min-h-[360px] lg:grid-cols-[minmax(0,1fr)_250px]'>
                      <div className='flex min-h-[320px] items-center justify-center bg-black p-5'>
                        <div className='relative flex aspect-video w-full max-w-3xl items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-zinc-950'>
                          {activeScene?.scene.assetUrl ? (
                            (activeScene.scene.assetType || productionMode) ===
                            "video" ? (
                              <video
                                key={activeScene.scene.assetUrl}
                                ref={previewVideoRef}
                                src={activeScene.scene.assetUrl}
                                className='h-full w-full object-contain'
                                muted
                                playsInline
                              />
                            ) : (
                              <img
                                src={activeScene.scene.assetUrl}
                                alt={activeScene.scene.title}
                                className='h-full w-full object-contain'
                              />
                            )
                          ) : (
                            <div className='max-w-md px-6 text-center'>
                              <Film className='mx-auto mb-4 h-9 w-9 text-zinc-700' />
                              <p className='text-sm font-medium text-zinc-300'>
                                {activeScene?.scene.title || "Timeline preview"}
                              </p>
                              <p className='mt-2 text-xs leading-5 text-zinc-600'>
                                Generate production assets to replace scene
                                placeholders.
                              </p>
                            </div>
                          )}
                          <div className='absolute right-3 bottom-3 rounded-md bg-black/70 px-2 py-1 font-mono text-[10px] text-white/70'>
                            {playhead.toFixed(1)}s / {totalSeconds.toFixed(1)}s
                          </div>
                          {activeScene?.scene.audioUrl && (
                            <audio
                              key={activeScene.scene.audioUrl}
                              ref={previewAudioRef}
                              src={activeScene.scene.audioUrl}
                              preload='metadata'
                            />
                          )}
                        </div>
                      </div>
                      <aside className='border-t border-white/10 p-4 lg:border-t-0 lg:border-l'>
                        <p className='text-[10px] font-semibold tracking-wider text-zinc-600 uppercase'>
                          Current scene
                        </p>
                        <h3 className='mt-2 text-sm font-semibold'>
                          {activeScene?.scene.title || "No scene selected"}
                        </h3>
                        <p className='mt-2 text-xs leading-5 text-zinc-500'>
                          {activeScene?.scene.description}
                        </p>
                        <div className='mt-4 space-y-2 text-[11px] text-zinc-500'>
                          <p className='flex items-center gap-2'>
                            <Camera className='h-3.5 w-3.5' />{" "}
                            {activeScene?.scene.camera}
                          </p>
                          <p className='flex items-center gap-2'>
                            <MapPin className='h-3.5 w-3.5' />{" "}
                            {activeScene?.scene.location}
                          </p>
                          <p className='flex items-center gap-2'>
                            <Clock3 className='h-3.5 w-3.5' />{" "}
                            {activeScene
                              ? `${activeScene.start.toFixed(1)}s – ${activeScene.end.toFixed(1)}s`
                              : "—"}
                          </p>
                        </div>
                        <div className='mt-5 rounded-xl border border-white/10 bg-white/[0.025] p-3'>
                          <p className='text-[10px] font-semibold text-zinc-600 uppercase'>
                            Voiceover
                          </p>
                          <p className='mt-2 text-xs leading-5 text-zinc-400'>
                            {activeScene?.scene.narration ||
                              activeScene?.scene.dialogue ||
                              "No spoken audio in this scene."}
                          </p>
                        </div>
                      </aside>
                    </div>

                    <div className='border-t border-white/10'>
                      <div className='flex h-12 items-center gap-3 border-b border-white/10 px-4'>
                        <button
                          onClick={() => {
                            setPlaying(false);
                            setPlayhead(0);
                          }}
                          aria-label='Go to beginning'
                          className='rounded-lg p-2 text-zinc-500 transition-colors duration-150 hover:bg-white/5 hover:text-white'
                        >
                          <SkipBack className='h-4 w-4' />
                        </button>
                        <button
                          onClick={() => setPlaying((current) => !current)}
                          aria-label={playing ? "Pause" : "Play"}
                          className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-transform duration-150 active:scale-[0.94]'
                        >
                          {playing ? (
                            <Pause className='h-3.5 w-3.5 fill-current' />
                          ) : (
                            <Play className='ml-0.5 h-3.5 w-3.5 fill-current' />
                          )}
                        </button>
                        <input
                          type='range'
                          min={0}
                          max={Math.max(1, totalSeconds)}
                          step={0.1}
                          value={Math.min(playhead, totalSeconds)}
                          onChange={(event) => {
                            setPlaying(false);
                            setPlayhead(Number(event.target.value));
                          }}
                          aria-label='Timeline playhead'
                          className='h-1 flex-1 accent-red-600'
                        />
                        <Volume2 className='h-4 w-4 text-zinc-600' />
                      </div>

                      <div className='overflow-x-auto'>
                        <div className='min-w-[760px] p-4'>
                          <div className='relative ml-24 h-6 border-b border-white/10 text-[9px] text-zinc-700'>
                            {Array.from({ length: 6 }, (_, index) => (
                              <span
                                key={index}
                                className='absolute -translate-x-1/2'
                                style={{ left: `${index * 20}%` }}
                              >
                                {((totalSeconds * index) / 5).toFixed(0)}s
                              </span>
                            ))}
                          </div>
                          {(
                            [
                              [
                                "Visuals",
                                ImageIcon,
                                "bg-blue-500/20 border-blue-400/25 text-blue-200",
                              ],
                              [
                                "Voiceover",
                                Mic2,
                                "bg-emerald-500/20 border-emerald-400/25 text-emerald-200",
                              ],
                              [
                                "Audio cues",
                                Volume2,
                                "bg-violet-500/20 border-violet-400/25 text-violet-200",
                              ],
                            ] as const
                          ).map(([label, TrackIcon, clipClass]) => (
                            <div
                              key={label}
                              className='mt-2 flex h-12 items-center gap-3'
                            >
                              <div className='flex w-[84px] shrink-0 items-center gap-2 text-[10px] font-medium text-zinc-500'>
                                <TrackIcon className='h-3.5 w-3.5' /> {label}
                              </div>
                              <div className='relative h-10 flex-1 overflow-hidden rounded-lg bg-white/[0.025]'>
                                <div
                                  className='pointer-events-none absolute top-0 bottom-0 z-20 w-px bg-red-500'
                                  style={{
                                    left: `${totalSeconds ? (playhead / totalSeconds) * 100 : 0}%`,
                                  }}
                                />
                                {timeline.map(({ scene, start }) => {
                                  const hasClip =
                                    label === "Visuals" ||
                                    (label === "Voiceover"
                                      ? Boolean(
                                          scene.narration || scene.dialogue
                                        )
                                      : Boolean(scene.audio));
                                  if (!hasClip) return null;
                                  return (
                                    <button
                                      key={`${label}-${scene.number}`}
                                      onClick={() => {
                                        setPlaying(false);
                                        setPlayhead(start);
                                      }}
                                      className={cn(
                                        "absolute top-1 bottom-1 overflow-hidden rounded-md border px-2 text-left text-[9px] font-medium transition-[filter,transform] duration-150 hover:brightness-125 active:scale-[0.99]",
                                        clipClass,
                                        scene.generationStatus ===
                                          "generating" && "animate-pulse"
                                      )}
                                      style={{
                                        left: `${(start / Math.max(1, totalSeconds)) * 100}%`,
                                        width: `${(Math.max(1, scene.durationSeconds) / Math.max(1, totalSeconds)) * 100}%`,
                                      }}
                                      title={`Scene ${scene.number}: ${scene.title}`}
                                    >
                                      <span className='block truncate'>
                                        S{scene.number} · {scene.title}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {storyboard.scenes.map((scene) => (
                      <article
                        key={scene.number}
                        className='rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition-[border-color,background-color] duration-150 hover:border-white/15 hover:bg-white/[0.035] sm:p-5'
                      >
                        <div className='flex items-start gap-4'>
                          <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-sm font-bold'>
                            {String(scene.number).padStart(2, "0")}
                          </span>
                          <div className='min-w-0 flex-1'>
                            <div className='flex flex-wrap items-start justify-between gap-2'>
                              <div>
                                <h3 className='text-sm font-semibold'>
                                  {scene.title}
                                </h3>
                                <p className='mt-1 text-xs leading-5 text-zinc-500'>
                                  {scene.description}
                                </p>
                              </div>
                              <div className='flex items-center gap-1.5 text-[10px] text-zinc-500'>
                                <Clock3 className='h-3 w-3' />{" "}
                                {scene.durationSeconds}s
                              </div>
                            </div>
                            <div className='mt-4 flex flex-wrap gap-2 text-[10px] text-zinc-400'>
                              <span className='flex items-center gap-1.5 rounded-md bg-white/[0.045] px-2 py-1.5'>
                                <MapPin className='h-3 w-3 text-zinc-600' />
                                {scene.location}
                              </span>
                              <span className='flex items-center gap-1.5 rounded-md bg-white/[0.045] px-2 py-1.5'>
                                <Camera className='h-3 w-3 text-zinc-600' />
                                {scene.camera}
                              </span>
                              {scene.characterIds.map((id) => (
                                <code
                                  key={id}
                                  className='rounded-md bg-red-500/10 px-2 py-1.5 text-red-400'
                                >
                                  {id}
                                </code>
                              ))}
                            </div>
                            <div className='mt-4 grid gap-3 md:grid-cols-2'>
                              <div className='rounded-xl border border-white/[0.07] bg-black/20 p-3'>
                                <p className='mb-1.5 text-[10px] font-semibold tracking-wide text-zinc-600 uppercase'>
                                  Action & emotion
                                </p>
                                <p className='text-xs leading-5 text-zinc-400'>
                                  {scene.action}{" "}
                                  <span className='text-zinc-600'>
                                    · {scene.emotion}
                                  </span>
                                </p>
                              </div>
                              <div className='rounded-xl border border-white/[0.07] bg-black/20 p-3'>
                                <p className='mb-1.5 text-[10px] font-semibold tracking-wide text-zinc-600 uppercase'>
                                  Audio
                                </p>
                                <p className='text-xs leading-5 text-zinc-400'>
                                  {scene.dialogue ||
                                    scene.narration ||
                                    scene.audio}
                                </p>
                              </div>
                            </div>
                            <div className='mt-3 rounded-xl border border-red-500/10 bg-red-500/[0.035] p-3'>
                              <p className='mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-red-400 uppercase'>
                                <WandSparkles className='h-3 w-3' /> Generation
                                prompt
                              </p>
                              <p className='text-xs leading-5 text-zinc-400'>
                                {scene.visualPrompt}
                              </p>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {storyboard && !isNew && (
        <div className='fixed right-4 bottom-4 z-50 w-[min(760px,calc(100vw-2rem))] sm:right-6 sm:bottom-6'>
          {(chatOpen || chatSettingsOpen) && (
            <div className='mb-2 ml-auto w-full max-w-xl origin-bottom-right overflow-hidden rounded-3xl border border-white/10 bg-[#151517]/95 shadow-2xl shadow-black/60 backdrop-blur-xl transition-[opacity,transform] duration-200 ease-out starting:translate-y-2 starting:scale-[0.98] starting:opacity-0'>
              {chatSettingsOpen && (
                <div className='border-b border-white/10 p-3'>
                  <div className='grid grid-cols-2 gap-2 rounded-2xl bg-black/25 p-1'>
                    {(["image", "video"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setProductionMode(mode)}
                        className={cn(
                          "flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-[background-color,color,transform] duration-150 active:scale-[0.97]",
                          productionMode === mode
                            ? "bg-zinc-100 text-zinc-950"
                            : "text-zinc-400 hover:text-white"
                        )}
                      >
                        {mode === "image" ? (
                          <ImageIcon className='h-4 w-4' />
                        ) : (
                          <Film className='h-4 w-4' />
                        )}
                        {mode === "image" ? "Image" : "Video"}
                      </button>
                    ))}
                  </div>
                  <div className='mt-2 grid grid-cols-2 gap-2 rounded-2xl bg-black/25 p-1'>
                    {["9:16", "16:9"].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={cn(
                          "h-10 rounded-xl text-sm font-medium transition-[background-color,color,transform] duration-150 active:scale-[0.97]",
                          aspectRatio === ratio
                            ? "bg-white/25 text-white"
                            : "text-zinc-500 hover:text-zinc-200"
                        )}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                  <div className='mt-3 grid grid-cols-3 gap-2'>
                    <button
                      onClick={() =>
                        activeScene &&
                        generateSingleScene(
                          activeScene.scene.number,
                          "both",
                          productionMode
                        )
                      }
                      disabled={generatingAssets || !activeScene}
                      className='flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-medium text-zinc-300 transition-[background-color,transform] duration-150 hover:bg-white/[0.08] active:scale-[0.97] disabled:opacity-40'
                    >
                      <RefreshCw className='h-3.5 w-3.5' /> Scene{" "}
                      {activeScene?.scene.number}
                    </button>
                    <button
                      onClick={generateProduction}
                      disabled={generatingAssets}
                      className='flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-medium text-zinc-300 transition-[background-color,transform] duration-150 hover:bg-white/[0.08] active:scale-[0.97] disabled:opacity-40'
                    >
                      <WandSparkles className='h-3.5 w-3.5' /> All scenes
                    </button>
                    <button
                      onClick={exportUrl ? downloadExport : exportVideo}
                      disabled={exporting}
                      className='flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-medium text-zinc-300 transition-[background-color,transform] duration-150 hover:bg-white/[0.08] active:scale-[0.97] disabled:opacity-40'
                    >
                      <Download className='h-3.5 w-3.5' />
                      {exportUrl ? "Download" : "Export"}
                    </button>
                  </div>
                </div>
              )}

              {chatOpen && (
                <div className='max-h-64 space-y-3 overflow-y-auto p-4'>
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex gap-2.5",
                        message.role === "user" && "justify-end"
                      )}
                    >
                      {message.role === "assistant" && (
                        <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-600/15 text-red-400'>
                          <Bot className='h-3.5 w-3.5' />
                        </span>
                      )}
                      <p
                        className={cn(
                          "max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-5",
                          message.role === "user"
                            ? "bg-white text-black"
                            : "bg-white/[0.055] text-zinc-300"
                        )}
                      >
                        {message.content}
                      </p>
                    </div>
                  ))}
                  {chatBusy && (
                    <div className='flex items-center gap-2 text-xs text-zinc-500'>
                      <LoadingFileLoader size={20} /> Agent is working…
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className='rounded-[28px] border border-white/15 bg-[#141416]/95 p-2 shadow-2xl shadow-black/70 backdrop-blur-xl'>
            <textarea
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              onFocus={() => setChatOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendChatMessage();
                }
              }}
              placeholder='Ask the agent to edit, generate, reorder, or export…'
              rows={2}
              className='w-full resize-none bg-transparent px-3 pt-2 text-sm leading-5 text-white outline-none placeholder:text-zinc-600'
            />
            <div className='flex items-center justify-between gap-2 px-1 pb-1'>
              <div className='flex min-w-0 items-center gap-2'>
                <button
                  onClick={() => setChatSettingsOpen((current) => !current)}
                  aria-label='Generation settings'
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-[background-color,color,transform] duration-150 active:scale-[0.94]",
                    chatSettingsOpen
                      ? "bg-white text-black"
                      : "text-zinc-500 hover:bg-white/[0.06] hover:text-white"
                  )}
                >
                  {chatSettingsOpen ? (
                    <SlidersHorizontal className='h-4 w-4' />
                  ) : (
                    <Plus className='h-5 w-5' />
                  )}
                </button>
                <span className='flex h-9 min-w-0 items-center gap-1.5 rounded-full bg-white/[0.055] px-3 text-[11px] text-zinc-400'>
                  <Bot className='h-3.5 w-3.5 shrink-0' />
                  <span className='truncate'>
                    Scene {activeScene?.scene.number || 1} · {productionMode} ·{" "}
                    {aspectRatio}
                  </span>
                </span>
              </div>
              <button
                onClick={() => void sendChatMessage()}
                disabled={!chatInput.trim() || chatBusy}
                aria-label='Send command'
                className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 transition-[background-color,transform] duration-150 hover:bg-white active:scale-[0.94] disabled:bg-white/5 disabled:text-zinc-700'
              >
                <ArrowUp className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
