"use client";

import type React from "react";
import {
  Paperclip,
  Mic,
  ChevronDown,
  Plus,
  Settings,
  Loader2,
  AlertCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useCallback, useState } from "react";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useProjectDesign } from "@/context/DesignProject";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import ShinyText from "../ui/shiny-text";
import { trackEvent } from "@/lib/mixpanelClient";

interface ChatInterfaceProps {
  children?: React.ReactNode;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  children,
  placeholder = "Ask a follow up message...",
  className = "",
}: ChatInterfaceProps) {
  const {
    inputValue,
    attachedFiles,
    fileLoadingStates,
    isDragOver,
    showScrollButton,
    setInputValue,
    setAttachedFiles,
    setFileLoadingStates,
    setIsDragOver,
    setDragCounter,
    setShowScrollButton,
    handleInput,
    handleKeyDown,
    handlePaste,
    processFiles,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    scrollToBottom: contextScrollToBottom,
    autoResize: contextAutoResize,
    clearInput,
    removeAttachedFile,
    generateMessage,
    isGenerating,
    project,
    error,
  } = useProjectDesign();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputSectionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUserContext();
  const router = useRouter();

  const hasEnoughCredits = (user?.creditsRemaining ?? 0) > 10;
  const validateInput = useCallback((value: string, files: File[]) => {
    if (!value.trim() && files.length === 0) {
      return "Please enter a prompt or attach files";
    }
    if (value.trim().length < 10) {
      return "Please provide a more detailed prompt (at least 10 characters)";
    }
    if (value.trim().length > 5000) {
      return "Prompt is too long (maximum 5000 characters)";
    }
    return null;
  }, []);

  const [initialInputValue, setInitialInputValue] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { isListening, startListening, stopListening, isSupported } =
    useSpeechToText({
      onTranscript: (transcript) => {
        setInputValue(
          initialInputValue ? `${initialInputValue} ${transcript}` : transcript,
        );
      },
    });

  const handleMicClick = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      setInitialInputValue(inputValue.trim());
      startListening();
    }
  }, [isListening, startListening, stopListening, inputValue]);

  // Local autoResize implementation using textareaRef
  const autoResize = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, []);

  // Effect to resize textarea on inputValue change
  useEffect(() => {
    autoResize();
  }, [inputValue, autoResize]);

  //     let scrollTimeout: NodeJS.Timeout;
  //     const handleScroll = () => {
  //       clearTimeout(scrollTimeout);
  //       scrollTimeout = setTimeout(() => {
  //         checkScrollPosition();
  //       }, 50);
  //     };

  //     chatContentElement.addEventListener("scroll", handleScroll, {
  //       passive: true,
  //     });
  //     checkScrollPosition();

  //     return () => {
  //       chatContentElement.removeEventListener("scroll", handleScroll);
  //       clearTimeout(scrollTimeout);
  //     };
  //   }
  // }, [checkScrollPosition]);

  // FIXED: Handle sending messages with proper project identification
  const handlegenerateMessage = async () => {
    // Check for low credits
    const creditsRemaining = user?.creditsRemaining ?? 0;
    if (creditsRemaining <= 10) {
      const isBasic = String(user?.userPlan) === "Basic";
      trackEvent("low_credits_prompt_shown", {
        credits_remaining: creditsRemaining,
        user_plan: user?.userPlan,
      });
      toast.error(`Low Credits`, {
        description: `You have ${creditsRemaining} credit${creditsRemaining !== 1 ? "s" : ""} remaining.`,
        action: {
          label: isBasic ? "Upgrade" : "Buy Credits",
          onClick: () => {
            router.push(isBasic ? "/pricing" : "/user/settings?tab=billing");
          },
        },
      });
      return;
    }

    const validationError = validateInput(
      inputValue,
      attachedFiles as unknown as File[],
    );
    if (validationError) {
      console.error("Validation error:", validationError);
      return;
    }

    if (!project?._id) {
      console.error("No project ID available");
      return;
    }

    try {
      // Use projectId for proper server routing
      trackEvent("generation_requested", {
        prompt_length: inputValue.trim().length,
        attachment_count: attachedFiles.length,
        project_id: project._id,
      });
      await generateMessage(inputValue, attachedFiles, project._id);
      trackEvent("generation_request_submitted", {
        project_id: project._id,
      });

      clearInput();

      // Force scroll to bottom when sending a new message
      setTimeout(() => {
        window.dispatchEvent(new Event("scroll-chat-to-bottom"));
      }, 100);
    } catch (error) {
      console.error("Failed to send message:", error);
      trackEvent("generation_request_failed", {
        project_id: project?._id,
      });
    }
  };

  // Enhanced key down handler
  const handleEnhancedKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handlegenerateMessage();
    }
    handleKeyDown(event);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className={`h-full flex flex-col bg-transparent ${className}`}>
      {/* Chat Content Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {children}
      </div>

      {/* Bottom Input Area - with drag and drop handlers */}
      <div
        ref={inputSectionRef}
        className="sticky bottom-0 p-2 backdrop-blur-sm z-10 w-full"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Scroll to Bottom Button */}
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 -top-12 z-20 transition-opacity duration-300 ${
            showScrollButton ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={() => {
              window.dispatchEvent(new Event("scroll-chat-to-bottom"));
            }}
            className="bg-background/80 backdrop-blur-sm border border-border rounded-full p-1.5 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
            style={{
              animation: showScrollButton
                ? "gentle-bounce 2s infinite"
                : "none",
            }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* File Attachments Previews */}
        {attachedFiles.length > 0 && !isGenerating && (
          <div className="flex flex-wrap gap-2 px-3 mb-1">
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="relative group bg-muted-foreground/5 border border-border rounded-lg p-1.5 flex items-center gap-2 max-w-[150px]"
              >
                <div className="w-6 h-6 bg-background rounded flex items-center justify-center overflow-hidden">
                  {file.type && file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file as any)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Paperclip className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                <span className="text-[10px] truncate max-w-[80px]">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachedFile(index)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Plus className="w-3 h-3 rotate-45" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="w-full max-w-4xl mx-auto">
          {/* Thinking / Credits Status */}
          <div className="flex items-center justify-between mb-2 px-4 h-6">
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
                        onClick={() =>
                          router.push("/user/settings?tab=billing")
                        }
                      >
                        Buy Credits
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error message */}
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlegenerateMessage();
            }}
            className="group flex flex-col gap-2 p-3 w-full rounded-[1.5rem] border border-white bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl text-base shadow-xl ring-1 ring-black/[0.08] transition-all focus-within:ring-black/[0.16] hover:ring-black/[0.12] focus-within:hover:ring-black/[0.16] dark:border-white/[0.08] dark:ring-black/[0.88] dark:focus-within:ring-black/[0.96] duration-150 ease-in-out"
          >
            <div className="min-w-0 w-full">
              <div className="relative flex flex-1 items-center">
                <textarea
                  ref={textareaRef}
                  value={isGenerating ? "" : inputValue}
                  onChange={handleInput}
                  onKeyDown={handleEnhancedKeyDown}
                  onPaste={handlePaste}
                  placeholder={
                    isGenerating
                      ? ""
                      : isListening
                        ? "Listening... speak now ✦"
                        : placeholder
                  }
                  disabled={isGenerating}
                  className="flex w-full px-3 py-2 transition-colors duration-150 ease-in-out placeholder:text-muted-foreground/60 resize-none border-none text-[16px] leading-snug md:text-base focus-visible:ring-0 focus-visible:ring-offset-0 max-h-[300px] bg-transparent flex-1 outline-none scrollbar-none"
                  style={{ minHeight: "60px" }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="relative box-border inline-flex min-w-fit items-center justify-center gap-2 whitespace-nowrap text-sm font-normal brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out px-4 py-2 rounded-full !p-0 bg-secondary text-primary h-8 w-8 shadow-sm flex-shrink-0"
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating}
              >
                <Plus className="shrink-0 size-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="ml-auto flex items-center gap-1.5">
                <button
                  type="button"
                  className={`relative box-border inline-flex min-w-fit items-center justify-center gap-2 whitespace-nowrap text-sm font-normal brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out px-4 py-2 rounded-full !p-0 h-8 w-8 ${
                    isListening
                      ? "text-red-500 bg-red-500/10 animate-pulse"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/5 dark:hover:bg-white/5"
                  }`}
                  onClick={handleMicClick}
                  disabled={!isSupported || isGenerating}
                >
                  <Mic className="shrink-0 size-4" />
                </button>
                <button
                  type="submit"
                  disabled={
                    isGenerating ||
                    (!inputValue.trim() && attachedFiles.length === 0)
                  }
                  className="relative box-border inline-flex min-w-fit items-center justify-center gap-2 whitespace-nowrap text-sm font-normal brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out px-4 py-2 rounded-full !p-0 bg-primary text-primary-foreground h-8 w-8 shadow-md flex-shrink-0"
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
          </form>
        </div>
      </div>
    </div>
  );
}
