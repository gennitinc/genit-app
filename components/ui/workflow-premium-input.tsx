"use client";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea } from "./scroll-area";
import ShinyText from "./shiny-text";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { LocalizedText } from "@/components/localized-text";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { enhancePromptText } from "@/lib/prompt-enhancement-api";
import { cn } from "@/lib/utils";
import { Model } from "@/types/inspire";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import {
  audioGenApi,
  imageGenApi,
  modelApi,
  textGenApi,
  videoGenApi,
} from "@/utils/inspire-api";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  ChevronDown,
  CircleFadingArrowUp,
  History,
  Image as ImageIcon,
  Loader2,
  Mic,
  Monitor,
  Music,
  Type,
  Video as VideoIcon,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import React, { useCallback, useEffect, useRef, useState } from "react";

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
  aspectRatio?: string;
  onAspectRatioChange?: (ratio: string) => void;
  availableModels?: Model[];
  onSelectHistoryItem?: (item: any) => void;
}

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
  aspectRatio,
  onAspectRatioChange,
  availableModels: propModels,
  onSelectHistoryItem,
}: PremiumInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [serverModels, setServerModels] = useState<Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);

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
          { withCredentials: true }
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
          { withCredentials: true }
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

      if (
        contentType === "all" ||
        contentType === "text" ||
        contentType === "social" ||
        contentType === "docs"
      ) {
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
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  const handleEnhancePrompt = useCallback(async () => {
    const prompt = value.trim();
    if (!prompt || isGenerating || disabled || isEnhancingPrompt) return;
    setIsEnhancingPrompt(true);
    try {
      const enhancedPrompt = await enhancePromptText(prompt);
      onChange(enhancedPrompt);
      if (textareaRef.current) {
        textareaRef.current.value = enhancedPrompt;
      }
      requestAnimationFrame(() => {
        adjustHeight();
        textareaRef.current?.focus();
      });
    } catch (error: any) {
      toast.error("Could not enhance prompt", {
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Please try again.",
      });
    } finally {
      setIsEnhancingPrompt(false);
    }
  }, [
    value,
    isGenerating,
    disabled,
    isEnhancingPrompt,
    onChange,
    adjustHeight,
  ]);

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
            className='mx-4 mb-2 flex items-center text-xs font-medium text-red-500'
          >
            <AlertCircle className='mr-2 size-3.5' />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className='my-1 flex h-fit items-center justify-between px-4'>
        <div className='flex items-center gap-2'>
          <label className='text-sm font-medium'>
            <LocalizedText text={"Prompt"} />
          </label>
          <div className='bg-border mx-1 h-4 w-px' />
        </div>
        <div className='flex h-fit items-center justify-between px-4'>
          <div className='flex items-center gap-2'>
            {isGenerating && (
              <ShinyText
                text='Thinking...'
                disabled={false}
                speed={3}
                className='text-xs font-medium'
              />
            )}
          </div>
          {!isGenerating && (
            <div className='flex w-full items-center justify-between gap-1'>
              <div className='text-muted-foreground flex items-center dark:text-zinc-400'>
                <Zap className='mr-2 inline-block h-3 w-3 text-emerald-500' />
                {user ? (
                  <span className='text-muted-foreground text-xs'>
                    {(user?.creditsRemaining ?? 0).toLocaleString()}{" "}
                    <LocalizedText text={"Credits left"} />
                  </span>
                ) : (
                  <span className='text-muted-foreground text-xs'>
                    <LocalizedText text={"Get started for free"} />
                  </span>
                )}
              </div>

              {user && (user?.creditsRemaining ?? 0) === 0 && (
                <div className='text-xs font-medium'>
                  {String(user?.userPlan) === "Basic" ? (
                    <span
                      className='cursor-pointer text-blue-500 hover:underline'
                      onClick={() => router.push("/pricing")}
                    >
                      <LocalizedText text={"Upgrade"} />
                    </span>
                  ) : (
                    <span
                      className='cursor-pointer text-blue-500 hover:underline'
                      onClick={() => router.push("/user/settings?tab=billing")}
                    >
                      <LocalizedText text={"Buy Credits"} />
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
          "group flex w-full flex-col gap-2 rounded-[1.5rem] border p-3 shadow-xl transition-all duration-150 ease-in-out",
          "border-white bg-white/80 backdrop-blur-xl dark:border-white/[0.08] dark:bg-zinc-900/50",
          "ring-1 ring-black/[0.08] dark:ring-black/[0.88]",
          "focus-within:ring-black/[0.16] dark:focus-within:ring-black/[0.96]",
          "hover:ring-black/[0.12]",
          "dark:focus-within:border-foreground/[0.16] focus-within:border-white",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <div className='relative w-full min-w-0'>
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
              "placeholder:text-muted-foreground/60 flex w-full resize-none scrollbar-none border-none bg-transparent px-3 py-2 pr-10 text-[16px] leading-snug transition-colors duration-150 ease-in-out outline-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base",
              isGenerating && "placeholder:opacity-0"
            )}
            style={{ minHeight }}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type='button'
                aria-label='Enhance with AI'
                className='text-muted-foreground hover:text-foreground absolute top-1.5 right-1.5 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-indigo-600/10 disabled:cursor-not-allowed disabled:opacity-50'
                onClick={handleEnhancePrompt}
                disabled={
                  isGenerating || disabled || isEnhancingPrompt || !value.trim()
                }
              >
                {isEnhancingPrompt ? (
                  <LoadingFileLoader size={16} />
                ) : (
                  <CircleFadingArrowUp className='h-3.5 w-3.5' />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side='top'>
              <LocalizedText text={"Enhance with AI"} />
            </TooltipContent>
          </Tooltip>
        </div>

        {footerContent && <div className='px-1'>{footerContent}</div>}

        <div className='flex items-center justify-between gap-1.5'>
          <Popover>
            <PopoverTrigger asChild>
              <button className='hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors'>
                <span className='opacity-70'>
                  {isLoadingModels ? (
                    <LoadingFileLoader size={16} />
                  ) : (
                    activeModel?.icon || "✦"
                  )}
                </span>
                {isLoadingModels
                  ? "Loading..."
                  : activeModel?.name || "Select Model"}
                <ChevronDown className='h-3 w-3 opacity-50' />
              </button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-1' align='start'>
              <div className='space-y-1'>
                {isLoadingModels ? (
                  <div className='flex items-center justify-center p-4'>
                    <LoadingFileLoader size={16} />
                  </div>
                ) : (
                  currentModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => onModelChange?.(model.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-xs transition-colors",
                        selectedModel === model.id
                          ? "text-primary bg-indigo-600 font-medium hover:bg-indigo-700/10"
                          : "hover:bg-muted"
                      )}
                    >
                      <div className='flex items-center gap-2'>
                        <span className='opacity-70'>{model.icon}</span>
                        {model.name}
                      </div>
                      {selectedModel === model.id && (
                        <Check className='h-3 w-3' />
                      )}
                    </button>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          {(contentType === "image" || contentType === "video") && (
            <Popover>
              <PopoverTrigger asChild>
                <button className='hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors'>
                  <Monitor className='h-3.5 w-3.5 opacity-70' />
                  {aspectRatio === "auto" ? "Auto" : aspectRatio || "16:9"}
                  <ChevronDown className='h-3 w-3 opacity-50' />
                </button>
              </PopoverTrigger>
              <PopoverContent className='w-[180px] p-1' align='start'>
                <div className='space-y-1'>
                  {[
                    { value: "auto", label: "Auto Orientation" },
                    { value: "16:9", label: "Landscape 16:9" },
                    { value: "9:16", label: "Portrait 9:16" },
                    { value: "1:1", label: "Square 1:1" },
                    { value: "4:3", label: "Standard 4:3" },
                  ].map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => onAspectRatioChange?.(ratio.value)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-xs transition-colors",
                        aspectRatio === ratio.value
                          ? "text-primary bg-indigo-600 font-medium hover:bg-indigo-700/10"
                          : "hover:bg-muted"
                      )}
                    >
                      {ratio.label}
                      {aspectRatio === ratio.value && (
                        <Check className='h-3 w-3' />
                      )}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {leftContent}

          <Popover open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <PopoverTrigger asChild>
              <button className='hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors'>
                <History className='h-3.5 w-3.5 opacity-70' />
                <LocalizedText text={"History"} />
              </button>
            </PopoverTrigger>
            <PopoverContent className='w-[320px] p-0' align='start'>
              <div className='bg-muted/30 border-b p-3'>
                <h4 className='flex items-center gap-2 text-xs font-semibold'>
                  <History className='h-3 w-3' />
                  {contentType === "all"
                    ? "Combined History"
                    : `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} History`}
                </h4>
              </div>
              <ScrollArea className='h-[300px]'>
                <div className='p-2'>
                  {isLoadingHistory ? (
                    <div className='flex flex-col items-center justify-center gap-2 py-8'>
                      <LoadingFileLoader size={16} />
                      <span className='text-muted-foreground text-[10px]'>
                        <LocalizedText text={"Loading history..."} />
                      </span>
                    </div>
                  ) : history.length === 0 ? (
                    <div className='flex flex-col items-center justify-center px-4 py-8 text-center'>
                      <History className='text-muted-foreground/20 mb-2 h-8 w-8' />
                      <p className='text-muted-foreground text-[10px]'>
                        <LocalizedText
                          text={
                            "No generation history found for this category."
                          }
                        />
                      </p>
                    </div>
                  ) : (
                    <div className='grid grid-cols-2 gap-2'>
                      {history.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            onSelectHistoryItem?.(item);
                            setIsHistoryOpen(false);
                          }}
                          className='group bg-muted hover:border-primary/50 relative aspect-video cursor-pointer overflow-hidden rounded-md border transition-all'
                        >
                          {item.thumbnail || item.url ? (
                            <>
                              {item.type === "video" ? (
                                <video
                                  src={item.url}
                                  className='h-full w-full object-cover'
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
                                  className='h-full w-full object-cover'
                                />
                              )}
                              <div className='absolute top-1 right-1'>
                                {item.type === "image" ? (
                                  <ImageIcon className='h-3 w-3 text-white drop-shadow-md' />
                                ) : (
                                  <VideoIcon className='h-3 w-3 text-white drop-shadow-md' />
                                )}
                              </div>
                            </>
                          ) : (
                            <div className='bg-muted/50 flex h-full w-full items-center justify-center p-2'>
                              {item.type === "audio" ? (
                                <Music className='text-muted-foreground h-4 w-4' />
                              ) : (
                                <Type className='text-muted-foreground h-4 w-4' />
                              )}
                            </div>
                          )}
                          <div className='absolute inset-0 flex flex-col justify-end bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100'>
                            <p className='line-clamp-2 text-[9px] leading-tight text-white'>
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

          <div className='ml-auto flex items-center gap-1.5'>
            {rightContent}

            <button
              type='button'
              className={cn(
                "relative box-border inline-flex h-8 w-8 min-w-fit items-center justify-center gap-2 rounded-full !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out",
                isListening
                  ? "animate-pulse bg-red-500/10 text-red-500"
                  : "text-muted-foreground hover:text-foreground hover:bg-indigo-600 hover:bg-indigo-700/5 dark:hover:bg-white/5"
              )}
              onClick={handleMicClick}
              disabled={!isSupported || isGenerating || disabled}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              <Mic className='size-4 shrink-0' />
            </button>

            <button
              type='button'
              onClick={handleSubmit}
              disabled={isGenerating || !value.trim() || disabled}
              className='text-primary-foreground relative box-border inline-flex h-8 w-8 min-w-fit flex-shrink-0 items-center justify-center gap-2 rounded-full bg-indigo-600 !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap shadow-md brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out hover:bg-indigo-700 disabled:opacity-50'
            >
              {isGenerating ? (
                <LoadingFileLoader size={16} />
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  className='size-5 shrink-0'
                >
                  <path d='M11 19V7.415l-3.293 3.293a1 1 0 1 1-1.414-1.414l5-5 .074-.067a1 1 0 0 1 1.34.067l5 5a1 1 0 1 1-1.414 1.414L13 7.415V19a1 1 0 1 1-2 0' />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
