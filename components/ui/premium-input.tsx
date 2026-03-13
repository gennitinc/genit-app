"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { cn } from "@/lib/utils";

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
}

export function PremiumInput({
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
}: PremiumInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize logic
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, parseInt(maxHeight))}px`;
    }
  }, [maxHeight]);

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
