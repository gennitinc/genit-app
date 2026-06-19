"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserContext } from "@/context/AuthenticatedContext";
import { cn } from "@/lib/utils";
import { Voice } from "@/types/inspire";
import { audioGenApi, voiceApi } from "@/utils/inspire-api";
import {
  AudioWaveform,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Loader2,
  Mic,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { SlidersHorizontal, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

function WaveformVisualizer({
  isPlaying,
  progress,
}: {
  isPlaying: boolean;
  progress: number;
}) {
  const bars = 60;
  return (
    <div className='flex h-8 w-full items-center gap-[2px]'>
      {Array.from({ length: bars }).map((_, i) => {
        const position = i / bars;
        const isPast = position <= progress;
        const baseHeight = Math.sin(i * 0.5) * 0.35 + 0.55;
        return (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-full transition-all duration-150",
              isPast ? "bg-foreground" : "bg-muted-foreground/20",
              isPlaying && !isPast && "animate-pulse"
            )}
            style={{
              height: `${baseHeight * 100}%`,
              animationDelay: `${i * 25}ms`,
              minWidth: "2px",
            }}
          />
        );
      })}
    </div>
  );
}

function TTSSlider({
  label,
  tooltip,
  value,
  onValueChange,
  min = 0,
  max = 1,
  step = 0.01,
  displayValue,
}: {
  label: string;
  tooltip?: string;
  value: number;
  onValueChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  displayValue?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  const decrement = () => {
    const newVal = Math.max(min, value - step);
    onValueChange(parseFloat(newVal.toFixed(step < 0.1 ? 2 : 1)));
  };

  const increment = () => {
    const newVal = Math.min(max, value + step);
    onValueChange(parseFloat(newVal.toFixed(step < 0.1 ? 2 : 1)));
  };

  return (
    <div className='group/slider flex items-center gap-2'>
      {/* Label */}
      <div
        className='group/label w-[100px] shrink-0 cursor-default select-none'
        title={tooltip}
      >
        <span className='text-muted-foreground/50 group-hover/label:text-foreground text-[11px] font-bold tracking-tight uppercase transition-colors'>
          {label}
        </span>
      </div>

      <div className='flex min-w-0 flex-1 items-center gap-1.5'>
        {/* Minus */}
        <button
          onClick={decrement}
          disabled={value <= min}
          className='bg-muted/40 hover:bg-muted text-muted-foreground/60 hover:text-foreground flex size-6 items-center justify-center rounded-md transition-all active:scale-90 disabled:pointer-events-none disabled:opacity-20'
        >
          <Minus className='size-3' />
        </button>

        {/* Bar */}
        <div
          className='bg-muted/30 border-border/50 relative h-[22px] flex-1 cursor-pointer overflow-hidden rounded-lg border'
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const raw = (x / rect.width) * (max - min) + min;
            const final = Math.max(min, Math.min(max, raw));
            onValueChange(parseFloat(final.toFixed(step < 0.1 ? 2 : 1)));
          }}
        >
          {/* Fill */}
          <div
            className='bg-foreground/5 dark:bg-foreground/10 absolute top-0 left-0 h-full transition-[width] duration-150 ease-out'
            style={{ width: `${pct}%` }}
          />
          {/* Progress Indicator line */}
          <div
            className='bg-foreground/40 absolute top-0 bottom-0 w-0.5 transition-[left] duration-150 ease-out'
            style={{ left: `${pct}%` }}
          />

          {/* Value Label */}
          <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
            <span className='text-foreground/80 text-[10px] font-bold tabular-nums'>
              {displayValue}
            </span>
          </div>
        </div>

        {/* Plus */}
        <button
          onClick={increment}
          disabled={value >= max}
          className='bg-muted/40 hover:bg-muted text-muted-foreground/60 hover:text-foreground flex size-6 items-center justify-center rounded-md transition-all active:scale-90 disabled:pointer-events-none disabled:opacity-20'
        >
          <Plus className='size-3' />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════ MAIN PAGE ═══════════════════════════ */
function TextToSpeechPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const searchParams = useSearchParams();

  // --- Voices ---
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [isVoiceSelectorOpen, setIsVoiceSelectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [voiceTab, setVoiceTab] = useState("explore");
  const [favorites, setFavorites] = useState<string[]>([]);

  // --- Text & Generation ---
  const [editorContent, setEditorContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // --- Settings ---
  const [settingsTab, setSettingsTab] = useState<"settings" | "history">(
    "settings"
  );
  const [speed, setSpeed] = useState(1.0);
  const [stability, setStability] = useState(0.5);
  const [similarity, setSimilarity] = useState(0.75);
  const [styleExaggeration, setStyleExaggeration] = useState(0);
  const [languageOverride, setLanguageOverride] = useState(false);
  const [outputFormat, setOutputFormat] = useState("mp3_44100_128");
  const [speakerBoost, setSpeakerBoost] = useState(true);

  // --- History ---
  const [history, setHistory] = useState<
    { id: string; text: string; audioUrl: string; voice: string; date: Date }[]
  >([]);

  // Fetch voices on mount
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        setIsLoadingVoices(true);
        const response = await voiceApi.getAll();
        if (response.success && response.data) {
          setVoices(response.data);
          const defaultVoice =
            response.data.find((v) => v.name === "Paige") || response.data[0];
          setSelectedVoice(defaultVoice);
        }
      } catch (error) {
        console.error("Failed to fetch voices:", error);
        toast.error("Failed to load voices");
      } finally {
        setIsLoadingVoices(false);
      }
    };
    fetchVoices();
  }, []);

  // Audio progress tracking
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    const handleMeta = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", handleMeta);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", handleMeta);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const handleGenerate = async () => {
    if (!editorContent.trim()) {
      toast.error("Please enter some text to speak.");
      return;
    }
    if (!selectedVoice) {
      toast.error("Please select a voice.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await audioGenApi.generate({
        prompt: editorContent.trim(),
        voiceId: selectedVoice._id,
      });

      if (response.success && response.data?.url) {
        setAudioUrl(response.data.url);
        setHistory((prev) => [
          {
            id: Date.now().toString(),
            text: editorContent.trim().slice(0, 80),
            audioUrl: response.data!.url,
            voice: selectedVoice.name,
            date: new Date(),
          },
          ...prev,
        ]);
        toast.success("Audio generated successfully!");
      } else {
        throw new Error(response.message || "Failed to generate audio");
      }
    } catch (error: any) {
      console.error("TTS generation error:", error);
      toast.error(error.message || "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pos * audioRef.current.duration;
    setProgress(pos);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const resetSettings = () => {
    setSpeed(1.0);
    setStability(0.5);
    setSimilarity(0.75);
    setStyleExaggeration(0);
    setSpeakerBoost(true);
  };

  const filteredVoices = voices.filter((v) => {
    const matchesSearch = v.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (voiceTab === "favorites") {
      return favorites.includes(v._id);
    }
    if (voiceTab === "my-voice") {
      return v.category === "cloned" || v.userId !== undefined;
    }
    return true;
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleExampleClick = (text: string) => {
    setEditorContent(text);
    textareaRef.current?.focus();
  };

  const examples = [
    {
      icon: "🎙",
      text: "Narrate a story",
      content:
        "Once upon a time, in a land far, far away, there lived a small dragon who dreamed of flying to the stars...",
    },
    {
      icon: "😄",
      text: "Tell a silly joke",
      content:
        "Why don't scientists trust atoms? Because they make up everything! But seriously, folks...",
    },
    {
      icon: "📢",
      text: "Record an advertisement",
      content:
        "Introducing the all-new genit Pro — the fastest way to bring your creative ideas to life with AI.",
    },
    {
      icon: "🌍",
      text: "Speak in different languages",
      content:
        "Bonjour tout le monde! Aujourd'hui, nous allons explorer les merveilles de l'intelligence artificielle.",
    },
    {
      icon: "🎬",
      text: "Direct a dramatic movie scene",
      content:
        "Commander, the shields are failing! We need to initiate the hyperdrive immediately or we won't make it!",
    },
    {
      icon: "🎮",
      text: "Hear from a video game character",
      content:
        "Listen well, adventurer. The path ahead is treacherous, but within you burns a fire that no darkness can quench.",
    },
    {
      icon: "🎧",
      text: "Introduce your podcast",
      content:
        "Welcome to The Tech Future podcast. Today, we're joined by experts from across the globe to discuss AI and ethics.",
    },
    {
      icon: "🧘",
      text: "Guide a meditation class",
      content:
        "Close your eyes. Take a deep breath in... and slowly let it out. Feel the tension leaving your body.",
    },
  ];

  return (
    <div className='bg-background relative flex h-[100dvh] w-full overflow-hidden font-sans'>
      <Toaster />
      <AppSidebar />
      <div className='relative flex flex-1 flex-col overflow-hidden'>
        <TopNavWithAurora />

        <div
          id='main-content'
          className='relative flex flex-1 overflow-hidden rounded-t-4xl border-2 pt-10 lg:pt-0'
        >
          <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
            {/* Editor */}
            <div className='flex-1 overflow-y-auto px-6 sm:px-10 lg:px-12'>
              <div className='flex min-h-full max-w-[680px] flex-col py-8'>
                <textarea
                  ref={textareaRef}
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  placeholder='Start typing here or paste any text you want to turn into lifelike speech...'
                  className={cn(
                    "w-full flex-1 resize-none bg-transparent transition-all outline-none",
                    "text-base leading-[1.75] tracking-[-0.01em] sm:text-lg",
                    "text-foreground placeholder:text-muted-foreground/30",
                    "caret-primary"
                  )}
                  style={{ minHeight: "300px" }}
                />

                {/* Example pills at bottom */}
                {!editorContent && (
                  <div className='animate-in fade-in slide-in-from-bottom-4 mt-auto pb-6 delay-200 duration-500'>
                    <p className='text-muted-foreground/50 mb-3 text-sm font-medium'>
                      Get started with
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {examples.map((example, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleExampleClick(example.content)}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-md px-3.5 py-2 font-mono text-sm transition-all duration-200",
                            "border-border/60 bg-background border",
                            "hover:bg-accent hover:border-border text-foreground/70 hover:text-foreground",
                            "active:scale-95"
                          )}
                        >
                          <span>{example.icon}</span>
                          <span>{example.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ═══════════════ PLAYER BAR ═══════════════ */}
            <div className='border-border bg-background/80 border-t px-6 py-2.5 backdrop-blur-lg sm:px-10 lg:px-12'>
              <div className='max-w-[680px]'>
                <div className='flex items-center gap-4'>
                  {/* Playback Controls */}
                  <div className='flex items-center gap-1.5'>
                    <button
                      className='text-muted-foreground hover:text-foreground p-1.5 transition-colors'
                      onClick={() => {
                        if (audioRef.current)
                          audioRef.current.currentTime = Math.max(
                            0,
                            audioRef.current.currentTime - 5
                          );
                      }}
                    >
                      <RotateCcw className='h-4 w-4' />
                    </button>

                    <button
                      onClick={
                        isGenerating
                          ? undefined
                          : audioUrl
                            ? handlePlayAudio
                            : handleGenerate
                      }
                      disabled={
                        isGenerating || (!editorContent.trim() && !audioUrl)
                      }
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
                        "bg-foreground text-background",
                        "hover:opacity-90 active:scale-90",
                        "disabled:cursor-not-allowed disabled:opacity-30"
                      )}
                    >
                      {isGenerating ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : isPlaying ? (
                        <Pause className='h-4 w-4 fill-current' />
                      ) : (
                        <Play className='ml-0.5 h-4 w-4 fill-current' />
                      )}
                    </button>

                    <button
                      className='text-muted-foreground hover:text-foreground p-1.5 transition-colors'
                      onClick={() => {
                        if (audioRef.current)
                          audioRef.current.currentTime = Math.min(
                            audioRef.current.duration || 0,
                            audioRef.current.currentTime + 5
                          );
                      }}
                    >
                      <RotateCcw
                        className='h-4 w-4'
                        style={{ transform: "scaleX(-1)" }}
                      />
                    </button>
                  </div>

                  {/* Progress */}
                  <div className='flex flex-1 flex-col gap-1'>
                    <div className='cursor-pointer' onClick={handleSeek}>
                      {audioUrl ? (
                        <WaveformVisualizer
                          isPlaying={isPlaying}
                          progress={progress}
                        />
                      ) : (
                        <div className='flex h-8 items-center'>
                          <div className='bg-muted h-1 w-full overflow-hidden rounded-full'>
                            {isGenerating && (
                              <div
                                className='h-full animate-pulse rounded-full bg-indigo-600 hover:bg-indigo-700'
                                style={{ width: "60%" }}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className='text-muted-foreground/50 flex items-center justify-between text-[10px] tabular-nums'>
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Volume & Download */}
                  <div className='flex items-center gap-1'>
                    <button
                      onClick={toggleMute}
                      className='text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors'
                    >
                      {isMuted ? (
                        <VolumeX className='h-4 w-4' />
                      ) : (
                        <Volume2 className='h-4 w-4' />
                      )}
                    </button>
                    {audioUrl && (
                      <a
                        href={audioUrl}
                        download
                        className='text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors'
                      >
                        <Download className='h-4 w-4' />
                      </a>
                    )}
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerate}
                    disabled={
                      isGenerating || !editorContent.trim() || !selectedVoice
                    }
                    className={cn(
                      "flex h-9 flex-shrink-0 items-center justify-center gap-2 rounded-[10px] px-5 text-sm font-semibold transition-all duration-200",
                      "focus:ring-primary/30 dark:focus:ring-primary/40 bg-indigo-600 text-white hover:bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-700/90 hover:opacity-90 focus:ring-4 focus:outline-none",
                      "disabled:cursor-not-allowed disabled:opacity-30",
                      "active:scale-[0.97]"
                    )}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className='h-3.5 w-3.5 animate-spin' />
                        <span className='hidden sm:inline'>Generating...</span>
                      </>
                    ) : (
                      <>
                        <AudioWaveform className='h-3.5 w-3.5' />
                        <span className='hidden sm:inline'>Generate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='border-border bg-background hidden w-[340px] flex-shrink-0 flex-col overflow-hidden rounded-l-2xl border md:flex lg:w-[380px]'>
            <div className='bg-background sticky top-0 z-10 px-5 pt-2'>
              <div className='border-border flex h-11 items-center gap-4 border-b'>
                <button
                  onClick={() => setSettingsTab("settings")}
                  className={cn(
                    "-mb-px border-b-[1.5px] pb-3 text-sm font-medium transition-all",
                    settingsTab === "settings"
                      ? "border-foreground text-foreground"
                      : "text-muted-foreground hover:text-foreground/70 border-transparent"
                  )}
                >
                  Settings
                </button>
                <button
                  onClick={() => setSettingsTab("history")}
                  className={cn(
                    "-mb-px border-b-[1.5px] pb-3 text-sm font-medium transition-all",
                    settingsTab === "history"
                      ? "border-foreground text-foreground"
                      : "text-muted-foreground hover:text-foreground/70 border-transparent"
                  )}
                >
                  History
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className='flex min-h-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto px-5 pt-4 pb-5'>
              {/* ══════ Settings Tab ══════ */}
              {settingsTab === "settings" && (
                <div className='animate-in fade-in flex flex-col gap-6 pb-4 duration-200'>
                  {/* Voice Selector */}
                  <div className='flex flex-col gap-2'>
                    <label className='text-foreground text-sm font-medium'>
                      Voice
                    </label>
                    <button
                      onClick={() => setIsVoiceSelectorOpen(true)}
                      className={cn(
                        "border-border relative flex h-10 w-full items-center justify-between rounded-[10px] border px-3 text-sm font-medium transition-colors",
                        "bg-background hover:bg-accent hover:border-border/80 text-foreground"
                      )}
                    >
                      <span className='flex items-center gap-2 truncate'>
                        <div className='bg-muted relative h-5 w-5 flex-shrink-0 overflow-hidden rounded-full'>
                          {selectedVoice?.imageUrl ? (
                            <img
                              src={selectedVoice.imageUrl}
                              alt={selectedVoice.name}
                              className='h-full w-full object-cover'
                            />
                          ) : (
                            <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500 via-pink-500 to-orange-500'>
                              <Mic className='h-2.5 w-2.5 text-white' />
                            </div>
                          )}
                        </div>
                        <span className='truncate'>
                          {selectedVoice?.name || "Select voice"}
                        </span>
                      </span>
                      <ChevronRight className='text-muted-foreground/40 h-4 w-4 flex-shrink-0' />
                    </button>
                  </div>

                  {/* Model Selector with Gradient Border */}
                  <div className='flex flex-col gap-2'>
                    <label className='text-foreground text-sm font-medium'>
                      Model
                    </label>
                    <div className='overflow-hidden rounded-[13px]'>
                      <div className='bg-background relative p-[3px]'>
                        {/* Aurora gradient border */}
                        <div
                          className='absolute inset-0 rounded-[13px] opacity-80'
                          style={{
                            backgroundImage:
                              "linear-gradient(140deg, transparent 37%, rgba(102, 253, 255, 0.6) 39%, rgba(222, 75, 242, 0.6) 42%, rgb(254, 99, 1) 47%, transparent 60%)",
                            backgroundSize: "400% 400%",
                            backgroundPosition: "38% 0%",
                          }}
                        />
                        {/* Noise overlay */}
                        <div
                          className='absolute inset-0 rounded-[13px] opacity-60 mix-blend-color-dodge'
                          style={{
                            backgroundImage:
                              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
                            backgroundSize: "75%",
                          }}
                        />
                        <button className='bg-background text-foreground hover:bg-accent relative flex h-10 w-full items-center justify-between rounded-[10px] border-none px-3 text-sm font-medium transition-colors'>
                          <span className='flex items-center gap-2'>
                            <span className='border-border text-muted-foreground flex h-5 w-5 items-center justify-center rounded border text-[8px] font-black'>
                              V2
                            </span>
                            <span>Multilingual v2</span>
                          </span>
                          <ChevronRight className='text-muted-foreground/40 h-4 w-4' />
                        </button>
                        <div className='relative flex items-center justify-between gap-2 px-3 py-2'>
                          <p className='text-muted-foreground text-sm font-medium'>
                            The most expressive Text to Speech
                          </p>
                          <button className='bg-background hover:bg-accent border-border inline-flex h-7 flex-shrink-0 items-center justify-center rounded-lg border px-2.5 text-xs font-medium whitespace-nowrap transition-colors'>
                            Try v3
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sliders */}
                  <div className='flex flex-col gap-3 py-1'>
                    <TTSSlider
                      label='Speed'
                      tooltip='Controls the speed of the generated speech.'
                      value={speed}
                      onValueChange={setSpeed}
                      min={0.7}
                      max={1.2}
                      step={0.05}
                      displayValue={speed.toFixed(2)}
                    />

                    <TTSSlider
                      label='Stability'
                      tooltip='Increasing stability will make the voice more consistent.'
                      value={stability}
                      onValueChange={setStability}
                      min={0}
                      max={1}
                      step={0.01}
                      displayValue={`${Math.round(stability * 100)}%`}
                    />

                    <TTSSlider
                      label='Similarity'
                      tooltip='Enhancement boosts clarity and speaker similarity.'
                      value={similarity}
                      onValueChange={setSimilarity}
                      min={0}
                      max={1}
                      step={0.01}
                      displayValue={`${Math.round(similarity * 100)}%`}
                    />

                    <TTSSlider
                      label='Style'
                      tooltip='Exaggerate the style of the speech.'
                      value={styleExaggeration}
                      onValueChange={setStyleExaggeration}
                      min={0}
                      max={1}
                      step={0.01}
                      displayValue={`${Math.round(styleExaggeration * 100)}%`}
                    />
                  </div>

                  {/* Language Override */}
                  <div className='flex items-center justify-between'>
                    <label className='text-foreground decoration-muted-foreground/30 text-sm font-medium underline decoration-dotted underline-offset-2 select-none'>
                      Language Override
                    </label>
                    <Switch
                      checked={languageOverride}
                      onCheckedChange={setLanguageOverride}
                    />
                  </div>

                  {/* Output Format */}
                  <div className='flex flex-col gap-1.5'>
                    <label className='text-foreground text-sm font-medium'>
                      Output Format
                    </label>
                    <Select
                      value={outputFormat}
                      onValueChange={setOutputFormat}
                    >
                      <SelectTrigger className='h-10 w-full rounded-[10px]'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='mp3_44100_128'>
                          MP3 44.1 kHz (128kbps)
                        </SelectItem>
                        <SelectItem value='mp3_44100_192'>
                          MP3 44.1 kHz (192kbps)
                        </SelectItem>
                        <SelectItem value='pcm_16000'>PCM 16 kHz</SelectItem>
                        <SelectItem value='pcm_22050'>PCM 22.05 kHz</SelectItem>
                        <SelectItem value='pcm_24000'>PCM 24 kHz</SelectItem>
                        <SelectItem value='pcm_44100'>PCM 44.1 kHz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Speaker Boost + Reset */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Switch
                        checked={speakerBoost}
                        onCheckedChange={setSpeakerBoost}
                      />
                      <label className='text-foreground decoration-muted-foreground/30 cursor-pointer text-sm font-medium underline decoration-dotted underline-offset-2 select-none'>
                        Speaker boost
                      </label>
                    </div>
                    <button
                      onClick={resetSettings}
                      className='text-muted-foreground hover:text-foreground hover:bg-accent inline-flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-sm font-medium transition-colors'
                    >
                      <RotateCcw className='h-3.5 w-3.5' />
                      <span>Reset values</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ══════ History Tab ══════ */}
              {settingsTab === "history" && (
                <div className='animate-in fade-in flex flex-col gap-2 duration-200'>
                  {history.length === 0 ? (
                    <div className='flex flex-col items-center justify-center gap-3 py-16 text-center'>
                      <Clock className='text-muted-foreground/20 h-8 w-8' />
                      <p className='text-muted-foreground/40 text-sm font-medium'>
                        No generations yet
                      </p>
                      <p className='text-muted-foreground/30 text-xs'>
                        Generated audio will appear here
                      </p>
                    </div>
                  ) : (
                    history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setAudioUrl(item.audioUrl);
                          setProgress(0);
                          setCurrentTime(0);
                        }}
                        className='hover:bg-accent hover:border-border/50 flex items-center gap-3 rounded-xl border border-transparent p-3 text-left transition-colors'
                      >
                        <div className='bg-muted flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg'>
                          <Play className='text-muted-foreground h-3.5 w-3.5 fill-current' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='text-foreground truncate text-sm font-medium'>
                            {item.text}...
                          </p>
                          <p className='text-muted-foreground/50 text-xs'>
                            {item.voice} ·{" "}
                            {item.date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <Dialog
          open={isVoiceSelectorOpen}
          onOpenChange={setIsVoiceSelectorOpen}
        >
          <DialogContent className='bg-background/95 border-border h-[85vh] max-w-5xl gap-0 overflow-hidden rounded-3xl p-0 shadow-2xl backdrop-blur-xl'>
            <div className='mt-4 flex h-full flex-col overflow-hidden'>
              {/* Tabs & Search Header */}
              <div className='space-y-5 px-8 pb-4'>
                <Tabs
                  value={voiceTab}
                  onValueChange={setVoiceTab}
                  className='w-full'
                >
                  <div className='flex items-center justify-between gap-4'>
                    <TabsList className='h-auto gap-6 bg-transparent p-0'>
                      {["Explore", "My Voice", "Favorites"].map((tab) => (
                        <TabsTrigger
                          key={tab}
                          value={tab.toLowerCase().replace(" ", "-")}
                          className='data-[state=active]:text-foreground text-muted-foreground/50 data-[state=active]:border-primary rounded-none border-b border-transparent bg-transparent px-0 py-1 text-sm font-normal transition-all data-[state=active]:bg-transparent'
                        >
                          {tab}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <div className='ml-auto flex max-w-md flex-1 items-center gap-2'>
                      <div className='relative flex-1'>
                        <Search className='text-muted-foreground/40 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                        <input
                          type='text'
                          placeholder='Search Voices Library...'
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className='bg-muted/40 focus:ring-primary/20 w-full rounded-xl border-none py-2.5 pr-4 pl-10 text-sm font-medium transition-all outline-none focus:ring-1'
                        />
                      </div>
                      <button className='bg-muted/40 hover:bg-muted/60 text-foreground/70 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors'>
                        <SlidersHorizontal className='h-4 w-4' />
                        Filter
                      </button>
                      <button className='bg-muted/40 hover:bg-muted/60 text-foreground/70 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors'>
                        <RotateCcw className='h-4 w-4' />
                        Default
                      </button>
                    </div>
                  </div>
                </Tabs>
              </div>

              {/* Scrollable Gallery */}
              <div className='scrollbar-hide flex-1 overflow-y-auto px-8 pb-10'>
                {isLoadingVoices ? (
                  <div className='flex flex-col items-center justify-center gap-3 py-20'>
                    <Loader2 className='text-primary/40 h-8 w-8 animate-spin' />
                    <span className='text-muted-foreground text-sm font-medium'>
                      Loading voices...
                    </span>
                  </div>
                ) : filteredVoices.length === 0 ? (
                  <div className='flex flex-col items-center justify-center gap-3 py-20 opacity-40'>
                    <AudioWaveform className='text-muted-foreground h-12 w-12' />
                    <span className='text-sm font-medium'>No voices found</span>
                  </div>
                ) : (
                  <div className='space-y-8'>
                    {/* Featured Section (on Explore tab) */}
                    {voiceTab === "explore" && searchQuery === "" && (
                      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                        {filteredVoices.slice(0, 4).map((voice) => (
                          <div
                            key={voice._id}
                            onClick={() => {
                              setSelectedVoice(voice);
                              setIsVoiceSelectorOpen(false);
                            }}
                            className='group bg-muted border-border/50 hover:border-primary/40 relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border transition-all'
                          >
                            {voice.imageUrl ? (
                              <img
                                src={voice.imageUrl}
                                alt=''
                                className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
                              />
                            ) : (
                              <div className='absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20' />
                            )}
                            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
                            <div className='absolute right-0 bottom-0 left-0 p-4'>
                              <h4 className='mb-2 truncate text-lg font-bold text-white'>
                                {voice.name}
                              </h4>
                              <div className='mt-auto flex flex-wrap gap-1.5'>
                                <Badge className='border-none bg-white/10 text-[10px] text-white backdrop-blur-md'>
                                  {voice.language}
                                </Badge>
                                <Badge className='border-none bg-white/10 text-[10px] text-white capitalize backdrop-blur-md'>
                                  {voice.gender}
                                </Badge>
                                <Badge className='border-none bg-white/10 text-[10px] text-white backdrop-blur-md'>
                                  Featured
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Secondary Grid */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      {filteredVoices
                        .slice(
                          voiceTab === "explore" && searchQuery === "" ? 4 : 0
                        )
                        .map((voice) => (
                          <div
                            key={voice._id}
                            className='group bg-muted/30 border-border/40 hover:border-primary/30 flex gap-4 rounded-2xl border p-4 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
                          >
                            <div className='bg-muted relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl'>
                              {voice.imageUrl ? (
                                <img
                                  src={voice.imageUrl}
                                  alt={voice.name}
                                  className='h-full w-full object-cover'
                                />
                              ) : (
                                <div className='from-primary/10 to-accent/10 flex h-full w-full items-center justify-center bg-gradient-to-br'>
                                  <Mic className='text-primary/40 h-5 w-5' />
                                </div>
                              )}
                            </div>

                            <div className='flex min-w-0 flex-1 flex-col justify-between py-0.5'>
                              <div className='flex items-start justify-between gap-2'>
                                <div>
                                  <h4 className='text-foreground/90 truncate text-base leading-tight font-bold'>
                                    {voice.name}
                                  </h4>
                                  <div className='mt-1.5 flex flex-wrap gap-1'>
                                    <Badge
                                      variant='outline'
                                      className='px-1.5 py-0 text-[10px] font-medium opacity-60'
                                    >
                                      English
                                    </Badge>
                                    <Badge
                                      variant='outline'
                                      className='px-1.5 py-0 text-[10px] font-medium capitalize opacity-60'
                                    >
                                      {voice.gender}
                                    </Badge>
                                    <Badge
                                      variant='outline'
                                      className='px-1.5 py-0 text-[10px] font-medium opacity-60'
                                    >
                                      Natural
                                    </Badge>
                                  </div>
                                </div>
                                <div className='flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                                  <button
                                    onClick={(e) =>
                                      toggleFavorite(voice._id, e)
                                    }
                                    className={cn(
                                      "rounded-lg p-1.5 transition-colors",
                                      favorites.includes(voice._id)
                                        ? "text-amber-400"
                                        : "text-muted-foreground hover:bg-muted"
                                    )}
                                  >
                                    <Star
                                      className={cn(
                                        "h-4 w-4",
                                        favorites.includes(voice._id) &&
                                          "fill-current"
                                      )}
                                    />
                                  </button>
                                  <button className='text-muted-foreground hover:bg-muted rounded-lg p-1.5 transition-colors'>
                                    <X className='h-4 w-4 opacity-40 hover:opacity-100' />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className='flex flex-col justify-center gap-2'>
                              <button
                                onClick={() => {
                                  setSelectedVoice(voice);
                                  setIsVoiceSelectorOpen(false);
                                }}
                                className='bg-foreground text-background rounded-lg px-4 py-1.5 text-sm font-bold transition-all hover:opacity-90 active:scale-95'
                              >
                                Use
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <audio
          ref={audioRef}
          src={audioUrl || ""}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}

export default TextToSpeechPage;
