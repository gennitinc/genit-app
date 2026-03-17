"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  Loader2,
  AlertCircle,
  Zap,
  Check,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { cn } from "@/lib/utils";
import ShinyText from "./shiny-text";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { modelApi } from "@/utils/inspire-api";
import { Model } from "@/types/inspire";

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
}: PremiumInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [serverModels, setServerModels] = useState<Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  useEffect(() => {
    if (contentType === "image" || contentType === "video") {
      const fetchModels = async () => {
        setIsLoadingModels(true);
        try {
          const response = await modelApi.getAll({ type: contentType });
          if (response.success && response.data) {
            setServerModels(response.data);
            // If no model is selected or the selected model is not in the new list, pick the default
            if (
              !selectedModel ||
              !response.data.find((m: any) => selectedModel === (m._id || m.id))
            ) {
              const defaultModel =
                response.data.find((m: any) => m.isDefault) || response.data[0];
              if (defaultModel) {
                onModelChange?.(
                  String(defaultModel._id || defaultModel.id || ""),
                );
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
  }, [contentType]);

  const currentModels =
    contentType === "image" || contentType === "video"
      ? serverModels.map((m) => ({
          id: m._id || m.id || "",
          name: m.name,
          icon: m.type === "image" ? "🎨" : "🎬",
        }))
      : MODELS_BY_TYPE[contentType as keyof typeof MODELS_BY_TYPE] || [];

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isGenerating && !disabled) {
        onSubmit();
      }
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

      <div className="flex items-center justify-between mb-2 px-4 h-fit">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Prompt</label>
          <div className="h-4 w-px bg-border mx-1" />

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
              "flex w-full px-3 py-2 transition-colors duration-150 ease-in-out placeholder:text-muted-foreground/60 resize-none border-none text-[16px] leading-snug md:text-base focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent outline-none scrollbar-none",
              isGenerating && "placeholder:opacity-0",
            )}
            style={{ minHeight }}
          />
        </div>

        {footerContent && <div className="px-1">{footerContent}</div>}

        <div className="flex items-center gap-1.5">
          {leftContent}

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
              onClick={onSubmit}
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
