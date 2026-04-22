"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserContext } from "@/context/AuthenticatedContext";
import {
  Loader2,
  Play,
  Pause,
  Mic,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Check,
  Search,
  Download,
  AudioWaveform,
  Clock,
  Minus,
  Plus,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { voiceApi, audioGenApi } from "@/utils/inspire-api";
import { Toaster } from "@/components/ui/sonner";
import { Voice } from "@/types/inspire";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, Star } from "lucide-react";

function WaveformVisualizer({
  isPlaying,
  progress,
}: {
  isPlaying: boolean;
  progress: number;
}) {
  const bars = 60;
  return (
    <div className="flex items-center gap-[2px] h-8 w-full">
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
              isPlaying && !isPast && "animate-pulse",
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
    <div className="flex items-center gap-2 group/slider">
      {/* Label */}
      <div
        className="w-[100px] shrink-0 cursor-default select-none group/label"
        title={tooltip}
      >
        <span className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-tight group-hover/label:text-foreground transition-colors">
          {label}
        </span>
      </div>

      <div className="flex-1 flex items-center gap-1.5 min-w-0">
        {/* Minus */}
        <button
          onClick={decrement}
          disabled={value <= min}
          className="size-6 rounded-md flex items-center justify-center bg-muted/40 hover:bg-muted text-muted-foreground/60 hover:text-foreground transition-all active:scale-90 disabled:opacity-20 disabled:pointer-events-none"
        >
          <Minus className="size-3" />
        </button>

        {/* Bar */}
        <div
          className="relative flex-1 h-[22px] rounded-lg bg-muted/30 border border-border/50 overflow-hidden cursor-pointer"
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
            className="absolute left-0 top-0 h-full bg-foreground/5 dark:bg-foreground/10 transition-[width] duration-150 ease-out"
            style={{ width: `${pct}%` }}
          />
          {/* Progress Indicator line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-foreground/40 transition-[left] duration-150 ease-out"
            style={{ left: `${pct}%` }}
          />

          {/* Value Label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] font-bold tabular-nums text-foreground/80">
              {displayValue}
            </span>
          </div>
        </div>

        {/* Plus */}
        <button
          onClick={increment}
          disabled={value >= max}
          className="size-6 rounded-md flex items-center justify-center bg-muted/40 hover:bg-muted text-muted-foreground/60 hover:text-foreground transition-all active:scale-90 disabled:opacity-20 disabled:pointer-events-none"
        >
          <Plus className="size-3" />
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
    "settings",
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
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
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
        "Introducing the all-new Gennit Pro — the fastest way to bring your creative ideas to life with AI.",
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
    <div className="flex relative w-full h-[100dvh] overflow-hidden bg-background font-sans">
      <Toaster />
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopNavWithAurora />

    
        <div
          id="main-content"
          className="flex-1 flex overflow-hidden relative pt-10 lg:pt-0"
        >
      
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Editor */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-10 lg:px-12">
              <div className="max-w-[680px] py-8 min-h-full flex flex-col">
                <textarea
                  ref={textareaRef}
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  placeholder="Start typing here or paste any text you want to turn into lifelike speech..."
                  className={cn(
                    "w-full flex-1 resize-none bg-transparent outline-none transition-all",
                    "text-base sm:text-lg leading-[1.75] tracking-[-0.01em]",
                    "text-foreground placeholder:text-muted-foreground/30",
                    "caret-primary",
                  )}
                  style={{ minHeight: "300px" }}
                />

                {/* Example pills at bottom */}
                {!editorContent && (
                  <div className="mt-auto pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                    <p className="text-sm text-muted-foreground/50 font-medium mb-3">
                      Get started with
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {examples.map((example, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleExampleClick(example.content)}
                          className={cn(
                            "inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-mono transition-all duration-200",
                            "border border-border/60 bg-background",
                            "hover:bg-accent hover:border-border text-foreground/70 hover:text-foreground",
                            "active:scale-95",
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
            <div className="border-t border-border bg-background/80 backdrop-blur-lg px-6 sm:px-10 lg:px-12 py-2.5">
              <div className="max-w-[680px]">
                <div className="flex items-center gap-4">
                  {/* Playback Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => {
                        if (audioRef.current)
                          audioRef.current.currentTime = Math.max(
                            0,
                            audioRef.current.currentTime - 5,
                          );
                      }}
                    >
                      <RotateCcw className="w-4 h-4" />
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
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                        "bg-foreground text-background",
                        "hover:opacity-90 active:scale-90",
                        "disabled:opacity-30 disabled:cursor-not-allowed",
                      )}
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    <button
                      className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => {
                        if (audioRef.current)
                          audioRef.current.currentTime = Math.min(
                            audioRef.current.duration || 0,
                            audioRef.current.currentTime + 5,
                          );
                      }}
                    >
                      <RotateCcw
                        className="w-4 h-4"
                        style={{ transform: "scaleX(-1)" }}
                      />
                    </button>
                  </div>

                  {/* Progress */}
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="cursor-pointer" onClick={handleSeek}>
                      {audioUrl ? (
                        <WaveformVisualizer
                          isPlaying={isPlaying}
                          progress={progress}
                        />
                      ) : (
                        <div className="h-8 flex items-center">
                          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                            {isGenerating && (
                              <div
                                className="h-full bg-primary rounded-full animate-pulse"
                                style={{ width: "60%" }}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground/50 tabular-nums">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Volume & Download */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={toggleMute}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    {audioUrl && (
                      <a
                        href={audioUrl}
                        download
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                      >
                        <Download className="w-4 h-4" />
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
                      "h-9 px-5 rounded-[10px] text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 flex-shrink-0",
                      "text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 hover:opacity-90",
                      "disabled:opacity-30 disabled:cursor-not-allowed",
                      "active:scale-[0.97]",
                    )}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span className="hidden sm:inline">Generating...</span>
                      </>
                    ) : (
                      <>
                        <AudioWaveform className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Generate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

       
          <div className="hidden md:flex flex-col w-[340px] lg:w-[380px] border border-border rounded-l-2xl bg-background overflow-hidden flex-shrink-0">
           
            <div className="sticky top-0 z-10 bg-background px-5 pt-2">
              <div className="flex items-center gap-4 h-11 border-b border-border">
                <button
                  onClick={() => setSettingsTab("settings")}
                  className={cn(
                    "text-sm font-medium pb-3 border-b-[1.5px] transition-all -mb-px",
                    settingsTab === "settings"
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground/70",
                  )}
                >
                  Settings
                </button>
                <button
                  onClick={() => setSettingsTab("history")}
                  className={cn(
                    "text-sm font-medium pb-3 border-b-[1.5px] transition-all -mb-px",
                    settingsTab === "history"
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground/70",
                  )}
                >
                  History
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col gap-4 px-5 pb-5 pt-4">
              {/* ══════ Settings Tab ══════ */}
              {settingsTab === "settings" && (
                <div className="flex flex-col gap-6 pb-4 animate-in fade-in duration-200">
                  {/* Voice Selector */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-foreground font-medium">
                      Voice
                    </label>
                    <button
                      onClick={() => setIsVoiceSelectorOpen(true)}
                      className={cn(
                        "relative flex items-center justify-between w-full h-10 px-3 rounded-[10px] border border-border text-sm font-medium transition-colors",
                        "bg-background hover:bg-accent hover:border-border/80 text-foreground",
                      )}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <div className="relative w-5 h-5 rounded-full overflow-hidden bg-muted flex-shrink-0">
                          {selectedVoice?.imageUrl ? (
                            <img
                              src={selectedVoice.imageUrl}
                              alt={selectedVoice.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-500 via-pink-500 to-orange-500">
                              <Mic className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <span className="truncate">
                          {selectedVoice?.name || "Select voice"}
                        </span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                    </button>
                  </div>

                  {/* Model Selector with Gradient Border */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-foreground font-medium">
                      Model
                    </label>
                    <div className="overflow-hidden rounded-[13px]">
                      <div className="relative p-[3px] bg-background">
                        {/* Aurora gradient border */}
                        <div
                          className="absolute inset-0 rounded-[13px] opacity-80"
                          style={{
                            backgroundImage:
                              "linear-gradient(140deg, transparent 37%, rgba(102, 253, 255, 0.6) 39%, rgba(222, 75, 242, 0.6) 42%, rgb(254, 99, 1) 47%, transparent 60%)",
                            backgroundSize: "400% 400%",
                            backgroundPosition: "38% 0%",
                          }}
                        />
                        {/* Noise overlay */}
                        <div
                          className="absolute inset-0 mix-blend-color-dodge opacity-60 rounded-[13px]"
                          style={{
                            backgroundImage:
                              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
                            backgroundSize: "75%",
                          }}
                        />
                        <button className="relative flex items-center justify-between w-full h-10 px-3 rounded-[10px] bg-background border-none text-sm font-medium text-foreground hover:bg-accent transition-colors">
                          <span className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded border border-border text-[8px] font-black text-muted-foreground">
                              V2
                            </span>
                            <span>Multilingual v2</span>
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                        </button>
                        <div className="flex items-center justify-between relative px-3 py-2 gap-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            The most expressive Text to Speech
                          </p>
                          <button className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium bg-background hover:bg-accent border border-border rounded-lg px-2.5 h-7 transition-colors flex-shrink-0">
                            Try v3
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sliders */}
                  <div className="flex flex-col gap-3 py-1">
                    <TTSSlider
                      label="Speed"
                      tooltip="Controls the speed of the generated speech."
                      value={speed}
                      onValueChange={setSpeed}
                      min={0.7}
                      max={1.2}
                      step={0.05}
                      displayValue={speed.toFixed(2)}
                    />

                    <TTSSlider
                      label="Stability"
                      tooltip="Increasing stability will make the voice more consistent."
                      value={stability}
                      onValueChange={setStability}
                      min={0}
                      max={1}
                      step={0.01}
                      displayValue={`${Math.round(stability * 100)}%`}
                    />

                    <TTSSlider
                      label="Similarity"
                      tooltip="Enhancement boosts clarity and speaker similarity."
                      value={similarity}
                      onValueChange={setSimilarity}
                      min={0}
                      max={1}
                      step={0.01}
                      displayValue={`${Math.round(similarity * 100)}%`}
                    />

                    <TTSSlider
                      label="Style"
                      tooltip="Exaggerate the style of the speech."
                      value={styleExaggeration}
                      onValueChange={setStyleExaggeration}
                      min={0}
                      max={1}
                      step={0.01}
                      displayValue={`${Math.round(styleExaggeration * 100)}%`}
                    />
                  </div>

                  {/* Language Override */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-foreground font-medium underline decoration-dotted underline-offset-2 decoration-muted-foreground/30 select-none">
                      Language Override
                    </label>
                    <Switch
                      checked={languageOverride}
                      onCheckedChange={setLanguageOverride}
                    />
                  </div>

                  {/* Output Format */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-foreground font-medium">
                      Output Format
                    </label>
                    <Select
                      value={outputFormat}
                      onValueChange={setOutputFormat}
                    >
                      <SelectTrigger className="w-full h-10 rounded-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp3_44100_128">
                          MP3 44.1 kHz (128kbps)
                        </SelectItem>
                        <SelectItem value="mp3_44100_192">
                          MP3 44.1 kHz (192kbps)
                        </SelectItem>
                        <SelectItem value="pcm_16000">PCM 16 kHz</SelectItem>
                        <SelectItem value="pcm_22050">PCM 22.05 kHz</SelectItem>
                        <SelectItem value="pcm_24000">PCM 24 kHz</SelectItem>
                        <SelectItem value="pcm_44100">PCM 44.1 kHz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Speaker Boost + Reset */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={speakerBoost}
                        onCheckedChange={setSpeakerBoost}
                      />
                      <label className="text-sm text-foreground font-medium underline decoration-dotted underline-offset-2 decoration-muted-foreground/30 select-none cursor-pointer">
                        Speaker boost
                      </label>
                    </div>
                    <button
                      onClick={resetSettings}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset values</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ══════ History Tab ══════ */}
              {settingsTab === "history" && (
                <div className="flex flex-col gap-2 animate-in fade-in duration-200">
                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                      <Clock className="w-8 h-8 text-muted-foreground/20" />
                      <p className="text-sm text-muted-foreground/40 font-medium">
                        No generations yet
                      </p>
                      <p className="text-xs text-muted-foreground/30">
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
                        className="flex items-center gap-3 p-3 rounded-xl text-left hover:bg-accent transition-colors border border-transparent hover:border-border/50"
                      >
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Play className="w-3.5 h-3.5 text-muted-foreground fill-current" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.text}...
                          </p>
                          <p className="text-xs text-muted-foreground/50">
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
          <DialogContent className="max-w-5xl h-[85vh] p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border shadow-2xl rounded-3xl">
            <div className="flex flex-col h-full overflow-hidden mt-4">
              {/* Tabs & Search Header */}
              <div className="px-8 pb-4 space-y-5">
                <Tabs
                  value={voiceTab}
                  onValueChange={setVoiceTab}
                  className="w-full"
                >
                  <div className="flex items-center justify-between gap-4">
                    <TabsList className="bg-transparent h-auto p-0 gap-6">
                      {["Explore", "My Voice", "Favorites"].map((tab) => (
                        <TabsTrigger
                          key={tab}
                          value={tab.toLowerCase().replace(" ", "-")}
                          className="px-0 py-1 text-sm font-normal bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground/50 border-b border-transparent data-[state=active]:border-primary rounded-none transition-all"
                        >
                          {tab}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <div className="flex items-center gap-2 flex-1 max-w-md ml-auto">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                        <input
                          type="text"
                          placeholder="Search Voices Library..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-muted/40 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                        />
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors text-sm font-medium text-foreground/70">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filter
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors text-sm font-medium text-foreground/70">
                        <RotateCcw className="w-4 h-4" />
                        Default
                      </button>
                    </div>
                  </div>
                </Tabs>
              </div>

              {/* Scrollable Gallery */}
              <div className="flex-1 overflow-y-auto px-8 pb-10 scrollbar-hide">
                {isLoadingVoices ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Loading voices...
                    </span>
                  </div>
                ) : filteredVoices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-40">
                    <AudioWaveform className="w-12 h-12 text-muted-foreground" />
                    <span className="text-sm font-medium">No voices found</span>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Featured Section (on Explore tab) */}
                    {voiceTab === "explore" && searchQuery === "" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {filteredVoices.slice(0, 4).map((voice) => (
                          <div
                            key={voice._id}
                            onClick={() => {
                              setSelectedVoice(voice);
                              setIsVoiceSelectorOpen(false);
                            }}
                            className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-muted border border-border/50 hover:border-primary/40 transition-all"
                          >
                            {voice.imageUrl ? (
                              <img
                                src={voice.imageUrl}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h4 className="text-white font-bold text-lg mb-2 truncate">
                                {voice.name}
                              </h4>
                              <div className="flex flex-wrap gap-1.5 mt-auto">
                                <Badge className="bg-white/10 text-white border-none text-[10px] backdrop-blur-md">
                                  {voice.language}
                                </Badge>
                                <Badge className="bg-white/10 text-white border-none text-[10px] backdrop-blur-md capitalize">
                                  {voice.gender}
                                </Badge>
                                <Badge className="bg-white/10 text-white border-none text-[10px] backdrop-blur-md">
                                  Featured
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Secondary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredVoices
                        .slice(
                          voiceTab === "explore" && searchQuery === "" ? 4 : 0,
                        )
                        .map((voice) => (
                          <div
                            key={voice._id}
                            className="group flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/40 hover:border-primary/30 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                          >
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                              {voice.imageUrl ? (
                                <img
                                  src={voice.imageUrl}
                                  alt={voice.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                                  <Mic className="w-5 h-5 text-primary/40" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-base font-bold text-foreground/90 leading-tight truncate">
                                    {voice.name}
                                  </h4>
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] px-1.5 py-0 font-medium opacity-60"
                                    >
                                      English
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] px-1.5 py-0 font-medium opacity-60 capitalize"
                                    >
                                      {voice.gender}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] px-1.5 py-0 font-medium opacity-60"
                                    >
                                      Natural
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) =>
                                      toggleFavorite(voice._id, e)
                                    }
                                    className={cn(
                                      "p-1.5 rounded-lg transition-colors",
                                      favorites.includes(voice._id)
                                        ? "text-amber-400"
                                        : "text-muted-foreground hover:bg-muted",
                                    )}
                                  >
                                    <Star
                                      className={cn(
                                        "w-4 h-4",
                                        favorites.includes(voice._id) &&
                                          "fill-current",
                                      )}
                                    />
                                  </button>
                                  <button className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                                    <X className="w-4 h-4 opacity-40 hover:opacity-100" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 justify-center">
                              <button
                                onClick={() => {
                                  setSelectedVoice(voice);
                                  setIsVoiceSelectorOpen(false);
                                }}
                                className="px-4 py-1.5 rounded-lg bg-foreground text-background text-sm font-bold hover:opacity-90 active:scale-95 transition-all"
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
