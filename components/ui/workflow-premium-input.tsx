"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  Loader2,
  AlertCircle,
  Zap,
  Check,
  ChevronDown,
  History,
  Image as ImageIcon,
  Video as VideoIcon,
  Type,
  Music,
  Monitor,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { cn } from "@/lib/utils";
import ShinyText from "./shiny-text";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  modelApi,
  imageGenApi,
  videoGenApi,
  textGenApi,
  audioGenApi,
} from "@/utils/inspire-api";
import { Model } from "@/types/inspire";
import { apiResponse } from "@/utils/apiResponse";
import { ScrollArea } from "./scroll-area";

const MODELS_BY_TYPE = {
  text: [
    { id: "gpt-4o", name: "GPT-4o", icon: "✦" },
    { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", icon: "✦" },
    { id: "gemini-1-5-pro", name: "Gemini 1.5 Pro", icon: "✦" },
    { id: "llama-3", name: "Llama 3", icon: "✦" },
  ],
  image: [
    { id: "stable-diffusion-3", name: "Nano-banana 2", icon: "✦" },
    { id: "midjourney-v6", name: "Midjourney v6", icon: "✦" },
    { id: "dalle-3", name: "DALL-E 3", icon: "✦" },
  ],
  video: [
    { id: "sora", name: "Sora", icon: "✦" },
    { id: "runway-gen-2", name: "Runway Gen-2", icon: "✦" },
    { id: "pika-1-0", name: "Pika 1.0", icon: "✦" },
    { id: "luma-dream-machine", name: "Luma Dream Machine", icon: "✦" },
  ],
  audio: [
    { id: "elevenlabs", name: "ElevenLabs", icon: "✦" },
    { id: "suno-v3", name: "Suno v3", icon: "✦" },
    { id: "udio", name: "Udio", icon: "✦" },
  ],
  social: [
    { id: "gpt-4o", name: "GPT-4o", icon: "✦" },
    { id: "gemini-1-5-pro", name: "Gemini 1.5 Pro", icon: "✦" },
  ],
  docs: [
    { id: "gpt-4o", name: "GPT-4o", icon: "✦" },
    { id: "gemini-1-5-pro", name: "Gemini 1.5 Pro", icon: "✦" },
  ],
  all: [],
};

interface PremiumInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void | Promise<void>;
  placeholder?: string;
  isGenerating?: boolean;
  disabled?: boolean;
  className?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  error?: string;
  minHeight?: string;
  maxHeight?: string;
  contentType?: keyof typeof MODELS_BY_TYPE;
  selectedModel?: string;
  onModelChange?: (modelId: string) => void;
  availableModels?: Model[];
  onSelectHistoryItem?: (item: any) => void;
  aspectRatio?: string;
  onAspectRatioChange?: (value: string) => void;
}

const ASPECT_RATIOS = [
  { value: "auto", label: "Auto Layout" },
  { value: "16:9", label: "Landscape 16:9" },
  { value: "9:16", label: "Portrait 9:16" },
  { value: "1:1", label: "Square 1:1" },
  { value: "4:3", label: "Standard 4:3" },
];

interface HistoryItem {
  id: string;
  type: "image" | "video" | "text" | "audio" | "social" | "docs";
  url?: string;
  thumbnail?: string;
  content?: string;
  prompt: string;
  createdAt: string;
}

export function WorkflowPremiumInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Type a message...",
  isGenerating = false,
  disabled = false,
  className,
  leftContent,
  rightContent,
  footerContent,
  error,
  minHeight = "30px",
  maxHeight = "300px",
  contentType = "text",
  selectedModel,
  onModelChange,
  availableModels: propModels,
  onSelectHistoryItem,
  aspectRatio,
  onAspectRatioChange,
}: PremiumInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [serverModels, setServerModels] = useState<Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    if (propModels) {
      setServerModels(propModels);
      return;
    }

    if (
      contentType === "image" ||
      contentType === "video" ||
      contentType === "audio" ||
      contentType === "text" ||
      contentType === "social" ||
      contentType === "docs"
    ) {
      const fetchModels = async () => {
        setIsLoadingModels(true);
        try {
          const response = await modelApi.getAll({ type: contentType });
          if (response.data) {
            setServerModels(response.data);
            // If no model is selected or the selected model is not in the new list, pick the default
            if (
              !selectedModel ||
              !response.data.find((m: any) => selectedModel === (m._id || m.id))
            ) {
              const defaultModel =
                response.data.find((m: any) => m.isDefault) || response.data[0];
              if (defaultModel) {
                onModelChange?.(defaultModel.modelId);
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch models:", error);
        } finally {
          setIsLoadingModels(false);
        }
      };
      fetchModels();
    } else {
      setServerModels([]);
    }
  }, [contentType, propModels]);

  const fetchHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      let items: HistoryItem[] = [];

      if (contentType === "all" || contentType === "image") {
        const res = await apiResponse.get(
          `/project/myprojects?type=ai-image-gen&limit=20`,
          { withCredentials: true },
        );
        if (res.data?.projects) {
          const imageItems = res.data.projects
            .filter((p: any) => p.imageData)
            .map((p: any) => ({
              id: p._id,
              type: "image",
              url: p.imageData.url,
              thumbnail: p.imageData.thumbnail,
              prompt: p.imageData.prompt,
              createdAt: p.createdAt,
            }));
          items = [...items, ...imageItems];
        }
      }

      if (contentType === "all" || contentType === "video") {
        const res = await apiResponse.get(
          `/project/myprojects?type=ai-video-gen&limit=20`,
          { withCredentials: true },
        );
        if (res.data?.projects) {
          const videoItems = res.data.projects
            .filter((p: any) => p.videoData)
            .map((p: any) => ({
              id: p._id,
              type: "video",
              url: p.videoData.url,
              thumbnail: p.videoData.thumbnail,
              prompt: p.videoData.prompt,
              createdAt: p.createdAt,
            }));
          items = [...items, ...videoItems];
        }
      }

      if (contentType === "all" || contentType === "text" || contentType === "social" || contentType === "docs") {
        // If "all", passing undefined to getHistory might fetch all text-based items
        const textType = contentType === "all" ? undefined : contentType;
        const res = await textGenApi.getHistory(textType);
        if (res.success && res.data) {
          const textItems = res.data.map((p: any) => ({
            id: p._id,
            type: p.type || "text",
            content: p.content,
            prompt: p.prompt,
            createdAt: p.createdAt,
          }));
          items = [...items, ...textItems];
        }
      }

      if (contentType === "all" || contentType === "audio") {
        const res = await audioGenApi.getHistory();
        if (res.success && res.data) {
          const audioItems = res.data.map((p: any) => ({
            id: p._id,
            type: "audio",
            url: p.url,
            prompt: p.prompt,
            createdAt: p.createdAt,
          }));
          items = [...items, ...audioItems];
        }
      }

      // Sort by creation date descending
      items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setHistory(items);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [contentType]);

  useEffect(() => {
    if (isHistoryOpen) {
      fetchHistory();
    }
  }, [isHistoryOpen, fetchHistory]);

  const currentModels = serverModels.map((m) => ({
    id: m.modelId,
    name: m.name,
    icon: "✦",
  }));

  // contentType === "image" || contentType === "video"
  //   ? serverModels.map((m) => ({
  //       id: m._id || m.id || "",
  //       name: m.name,
  //       icon: m.type === "image" ? "🎨" : "🎬",
  //     }))
  //   : MODELS_BY_TYPE[contentType as keyof typeof MODELS_BY_TYPE] || [];

  const activeModel = currentModels.find((m) => m.id === selectedModel);

  // Auto-resize logic
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, parseInt(maxHeight))}px`;
    }
  }, [maxHeight]);

  const { user } = useUserContext();

  const router = useRouter();

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const [baseValue, setBaseValue] = useState("");

  // Speech to text integration
  const { isListening, isSupported, startListening, stopListening } =
    useSpeechToText({
      onTranscript: (transcript) => {
        onChange(baseValue + (baseValue ? " " : "") + transcript);
      },
    });

  const handleMicClick = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      setBaseValue(value);
      startListening();
    }
  }, [isListening, startListening, stopListening, value]);

  const handleSubmit = useCallback(() => {
    if (!value.trim() || isGenerating || disabled) return;
    onSubmit();
    // Reset height back to minHeight after submit
    if (textareaRef.current) {
      textareaRef.current.style.height = minHeight;
    }
  }, [value, isGenerating, disabled, onSubmit, minHeight]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Plain Enter or Shift+Enter adds a new line (default behavior).
    // Accidental plain Enter should not submit.
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      // Do nothing, let it add a new line
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn("w-full transition-all duration-300", className)}>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-xs text-red-500 font-medium flex items-center mb-2 mx-4"
          >
            <AlertCircle className="size-3.5 mr-2" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between my-1 px-4 h-fit">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Prompt</label>
          <div className="h-4 w-px bg-border mx-1" />
        </div>
        <div className="flex items-center justify-between px-4 h-fit">
          <div className="flex items-center gap-2">
            {isGenerating && (
              <ShinyText
                text="Thinking..."
                disabled={false}
                speed={3}
                className="text-xs font-medium"
              />
            )}
          </div>
          {!isGenerating && (
            <div className="flex items-center gap-1 justify-between w-full">
              <div className="text-muted-foreground dark:text-zinc-400 flex items-center">
                <Zap className="inline-block w-3 h-3 text-emerald-500 mr-2" />
                {user ? (
                  <span className="text-xs text-muted-foreground">
                    {(user?.creditsRemaining ?? 0).toLocaleString()} Credits
                    left
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Get a 50 free credit
                  </span>
                )}
              </div>

              {user && (user?.creditsRemaining ?? 0) === 0 && (
                <div className="text-xs font-medium">
                  {String(user?.userPlan) === "Basic" ? (
                    <span
                      className="cursor-pointer text-blue-500 hover:underline"
                      onClick={() => router.push("/pricing")}
                    >
                      Upgrade
                    </span>
                  ) : (
                    <span
                      className="cursor-pointer text-blue-500 hover:underline"
                      onClick={() => router.push("/user/settings?tab=billing")}
                    >
                      Buy Credits
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          "group flex flex-col gap-2 p-3 w-full rounded-[1.5rem] border transition-all duration-150 ease-in-out shadow-xl",
          "bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border-white dark:border-white/[0.08]",
          "ring-1 ring-black/[0.08] dark:ring-black/[0.88]",
          "focus-within:ring-black/[0.16] dark:focus-within:ring-black/[0.96]",
          "hover:ring-black/[0.12]",
          "focus-within:border-white dark:focus-within:border-foreground/[0.16]",
          disabled && "opacity-60 cursor-not-allowed",
        )}
      >
        <div className="min-w-0 w-full">
          <textarea
            ref={textareaRef}
            value={isGenerating ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isGenerating
                ? ""
                : isListening
                  ? "Listening... speak now ✦"
                  : placeholder
            }
            disabled={isGenerating || disabled}
            className={cn(
              " flex w-full px-3 py-2 transition-colors duration-150 ease-in-out placeholder:text-muted-foreground/60 resize-none border-none text-[16px] leading-snug md:text-base focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent outline-none scrollbar-none",
              isGenerating && "placeholder:opacity-0",
            )}
            style={{ minHeight }}
          />
        </div>

        {footerContent && <div className="px-1">{footerContent}</div>}

        <div className="flex items-center justify-between gap-1.5">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted transition-colors text-xs font-medium text-muted-foreground hover:text-foreground">
                <span className="opacity-70">
                  {isLoadingModels ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    activeModel?.icon || "✦"
                  )}
                </span>
                {isLoadingModels
                  ? "Loading..."
                  : activeModel?.name || "Select Model"}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-1" align="start">
              <div className="space-y-1">
                {isLoadingModels ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  currentModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => onModelChange?.(model.id)}
                      className={cn(
                        "flex items-center justify-between w-full px-2 py-1.5 rounded-sm text-xs transition-colors",
                        selectedModel === model.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="opacity-70">{model.icon}</span>
                        {model.name}
                      </div>
                      {selectedModel === model.id && (
                        <Check className="h-3 w-3" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          {onAspectRatioChange && (contentType === "video" || contentType === "image") && (
            <div className="flex items-center gap-1 ml-1 px-2 py-1 rounded-md hover:bg-muted transition-colors w-fit">
              <Monitor className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <select
                value={aspectRatio}
                onChange={(e) => onAspectRatioChange(e.target.value)}
                className="text-[11px] font-medium text-muted-foreground bg-transparent border-none outline-none cursor-pointer hover:text-foreground transition-colors pr-1 w-fit"
              >
                {ASPECT_RATIOS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {leftContent}

          <Popover open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted transition-colors text-xs font-medium text-muted-foreground hover:text-foreground">
                <History className="h-3.5 w-3.5 opacity-70" />
                History
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0" align="start">
              <div className="p-3 border-b bg-muted/30">
                <h4 className="text-xs font-semibold flex items-center gap-2">
                  <History className="h-3 w-3" />
                  {contentType === "all"
                    ? "Combined History"
                    : `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} History`}
                </h4>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="p-2">
                  {isLoadingHistory ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        Loading history...
                      </span>
                    </div>
                  ) : history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                      <History className="h-8 w-8 text-muted-foreground/20 mb-2" />
                      <p className="text-[10px] text-muted-foreground">
                        No generation history found for this category.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {history.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            onSelectHistoryItem?.(item);
                            setIsHistoryOpen(false);
                          }}
                          className="group relative aspect-video rounded-md overflow-hidden bg-muted cursor-pointer border hover:border-primary/50 transition-all"
                        >
                          {item.thumbnail || item.url ? (
                            <>
                              {item.type === "video" ? (
                                <video
                                  src={item.url}
                                  className="w-full h-full object-cover"
                                  muted
                                  playsInline
                                  autoPlay
                                  onLoadedData={(e) => {
                                    const video = e.currentTarget;
                                    video.play().catch(() => {});
                                    setTimeout(() => {
                                      if (video) video.pause();
                                    }, 2000);
                                  }}
                                />
                              ) : (
                                <img
                                  src={item.thumbnail || item.url}
                                  alt={item.prompt}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              <div className="absolute top-1 right-1">
                                {item.type === "image" ? (
                                  <ImageIcon className="h-3 w-3 text-white drop-shadow-md" />
                                ) : (
                                  <VideoIcon className="h-3 w-3 text-white drop-shadow-md" />
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center p-2 bg-muted/50">
                              {item.type === "audio" ? (
                                <Music className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Type className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                            <p className="text-[9px] text-white line-clamp-2 leading-tight">
                              {item.prompt}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <div className="ml-auto flex items-center gap-1.5">
            {rightContent}

            <button
              type="button"
              className={cn(
                "relative box-border inline-flex min-w-fit items-center justify-center gap-2 whitespace-nowrap text-sm font-normal brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out px-4 py-2 rounded-full !p-0 h-8 w-8",
                isListening
                  ? "text-red-500 bg-red-500/10 animate-pulse"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/5 dark:hover:bg-white/5",
              )}
              onClick={handleMicClick}
              disabled={!isSupported || isGenerating || disabled}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              <Mic className="shrink-0 size-4" />
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isGenerating || !value.trim() || disabled}
              className="relative box-border inline-flex min-w-fit items-center justify-center gap-2 whitespace-nowrap text-sm font-normal brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out px-4 py-2 rounded-full !p-0 bg-primary text-primary-foreground h-8 w-8 shadow-md flex-shrink-0 disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="shrink-0 size-5"
                >
                  <path d="M11 19V7.415l-3.293 3.293a1 1 0 1 1-1.414-1.414l5-5 .074-.067a1 1 0 0 1 1.34.067l5 5a1 1 0 1 1-1.414 1.414L13 7.415V19a1 1 0 1 1-2 0" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
