"use client";

import ShinyText from "./shiny-text";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Loader2, Mic, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

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
  modelSelector?: React.ReactNode;
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
  modelSelector,
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
            className='mx-4 mb-2 flex items-center text-xs font-medium text-red-500'
          >
            <AlertCircle className='mr-2 size-3.5' />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className='mb-2 flex h-fit items-center justify-between px-4'>
        <div className='flex items-center gap-2'>
          <label className='text-sm font-medium'>Prompt</label>
        </div>
        <div className='flex h-fit items-center justify-between px-4'>
          {/* <div className="flex items-center gap-2">
            {isGenerating && (
              <ShinyText
                text="Thinking..."
                disabled={false}
                speed={3}
                className="text-xs font-medium"
              />
            )}
          </div> */}
          {!isGenerating && (
            <div className='flex w-full items-center justify-between gap-1'>
              <div className='text-muted-foreground flex items-center dark:text-zinc-400'>
                <Zap className='mr-2 inline-block h-3 w-3 text-emerald-500' />
                {user ? (
                  <span className='text-muted-foreground text-xs'>
                    {(user?.creditsRemaining ?? 0).toLocaleString()} Credits
                    left
                  </span>
                ) : (
                  <span className='text-muted-foreground text-xs'>
                    Get a 50 free credit
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
                      Upgrade
                    </span>
                  ) : (
                    <span
                      className='cursor-pointer text-blue-500 hover:underline'
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
          "group flex w-full flex-col gap-2 rounded-[1.5rem] border p-3 shadow-xl transition-all duration-150 ease-in-out",
          "border-white bg-white/80 backdrop-blur-xl dark:border-white/[0.08] dark:bg-zinc-900/50",
          "ring-1 ring-black/[0.08] dark:ring-black/[0.88]",
          "focus-within:ring-black/[0.16] dark:focus-within:ring-black/[0.96]",
          "hover:ring-black/[0.12]",
          "dark:focus-within:border-foreground/[0.16] focus-within:border-white",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <div className='w-full min-w-0'>
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
              "placeholder:text-muted-foreground/60 scrollbar-none flex w-full resize-none border-none bg-transparent px-3 py-2 text-[16px] leading-snug transition-colors duration-150 ease-in-out outline-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base",
              isGenerating && "placeholder:opacity-0"
            )}
            style={{ minHeight }}
          />
        </div>

        {footerContent && <div className='px-1'>{footerContent}</div>}

        <div className='flex items-center gap-1.5'>
          {modelSelector}
          {leftContent}
          

          <div className='ml-auto flex items-center gap-1.5'>
            {rightContent}

            <button
              type='button'
              className={cn(
                "relative box-border inline-flex h-8 w-8 min-w-fit items-center justify-center gap-2 rounded-full !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out",
                isListening
                  ? "animate-pulse bg-red-500/10 text-red-500"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/5 dark:hover:bg-white/5"
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
              className='bg-primary text-primary-foreground relative box-border inline-flex h-8 w-8 min-w-fit flex-shrink-0 items-center justify-center gap-2 rounded-full !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap shadow-md brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out disabled:opacity-50'
            >
              {isGenerating ? (
                <Loader2 className='h-4 w-4 animate-spin' />
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
