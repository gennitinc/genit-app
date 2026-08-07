"use client";

import { ModelSelector } from "../inspire/model-selector";
import { BorderBeam } from "../ui/border-beam";
import ShinyText from "../ui/shiny-text";
import { BrandIdentityPanel } from "./messages/brand-identity-panel";
import { LocalizedText } from "@/components/localized-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAgentRunsContext } from "@/context/AgentRunsContext";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useProjectDesign } from "@/context/DesignProject";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { classifyPrompt } from "@/lib/agents-api";
import { trackEvent } from "@/lib/mixpanelClient";
import { appendClientTimeContext, cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponseFileUpload } from "@/utils/apiResponseFileUpload";
import { GradientFrame } from "@/utils/gradient-frame";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Mic,
  MicOff,
  Palette,
  Paperclip,
  Plus,
  SendHorizontal,
  Settings,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface ChatInputProps {
  children?: React.ReactNode;
  placeholder?: string;
  className?: string;
  onHeightChange?: (height: number) => void;
}

export function ChatInput({
  children,
  placeholder = "Ask a follow up message...",
  className = "",
  onHeightChange,
}: ChatInputProps) {
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
    imageModel,
    setImageModel,
    updateProjectModel,
    brandSaveStatus,
    isProcessingDraft,
    brandIdentityEnabled,
    setBrandIdentityEnabled,
    selectedFiles,
  } = useProjectDesign();

  const { startAgent, runs } = useAgentRunsContext();
  // Spin + disable while the agent is actively processing tool calls in the background.
  const isAgentRunning = runs.some((r) => r.status === "running");
  // Disable (no spin) when the agent is paused waiting for the user to reply in-thread.
  const isAgentAwaitingInput = runs.some(
    (r) => r.status === "awaiting_input" || r.status === "awaiting_integration"
  );
  const [isClassifying, setIsClassifying] = useState(false);
  const isAiResponding = isGenerating || isClassifying || isAgentRunning;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputSectionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUserContext();
  const router = useRouter();
  const hasEnoughCredits = (user?.creditsRemaining ?? 0) > 10;
  const activeOrg =
    user?.currentOrganization && typeof user.currentOrganization === "object"
      ? user.currentOrganization
      : user?.business && typeof user.business === "object"
        ? user.business
        : null;
  const orgBrandColors = (activeOrg?.brandColors ?? [])
    .filter(Boolean)
    .slice(0, 3);
  const hasOrgBrand = orgBrandColors.length > 0;
  const showAppliedSwatches = hasOrgBrand && brandIdentityEnabled;
  const validateInput = useCallback((value: string, files: File[]) => {
    if (!value.trim() && files.length === 0) {
      return "Please enter a prompt or attach files";
    }
    if (value.trim().length < 2) {
      return "Please provide a more detailed prompt (at least 2 characters)";
    }
    if (value.trim().length > 5000) {
      return "Prompt is too long (maximum 5000 characters)";
    }
    return null;
  }, []);

  const [initialInputValue, setInitialInputValue] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBrandSettingsOpen, setIsBrandSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);

  useEffect(() => {
    setSelectedModel(null);
  }, [project?._id]);

  const { isListening, startListening, stopListening, isSupported } =
    useSpeechToText({
      onTranscript: (transcript) => {
        setInputValue(
          initialInputValue ? `${initialInputValue} ${transcript}` : transcript
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
      // If input is empty, force the minimum height to prevent browser miscalculation on mount/refresh
      const newHeight = !inputValue ? 60 : textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [inputValue]);

  // Effect to resize textarea on inputValue change
  useEffect(() => {
    autoResize();
  }, [inputValue, autoResize]);

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
      attachedFiles as unknown as File[]
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
      trackEvent("generation_requested", {
        prompt_length: inputValue.trim().length,
        attachment_count: attachedFiles.length,
        project_id: project._id,
      });

      // Ask the backend AI classifier to decide routing — reasoning-based, not keyword-based.
      // This handles typos ("calender"), short follow-ups ("delete them", "yes", "do it"), etc.
      setIsClassifying(true);
      const isAgentic = await classifyPrompt(inputValue);
      setIsClassifying(false);

      const formattedInput = appendClientTimeContext(inputValue);

      if (isAgentic) {
        // Build uploaded file list for the agent
        let uploadedFiles:
          | { name: string; type: string; url: string; size?: number }[]
          | undefined;

        if (attachedFiles.length > 0) {
          const formData = new FormData();
          for (const file of attachedFiles as any[]) {
            if (file instanceof File || file instanceof Blob) {
              formData.append("files", file);
            } else if (file && (file.url || file.filePath)) {
              if (!uploadedFiles) uploadedFiles = [];
              uploadedFiles.push({
                name: file.name || "file",
                type: file.type || "application/octet-stream",
                url: file.url || file.filePath,
                size: file.size,
              });
            }
          }

          if (formData.has("files")) {
            toast.loading("Uploading files...", { id: "agent-upload" });
            try {
              const res = await apiResponseFileUpload.post(
                "/agents/upload",
                formData
              );
              if (!uploadedFiles) uploadedFiles = [];
              uploadedFiles.push(...res.data.files);
              toast.dismiss("agent-upload");
            } catch (err) {
              toast.dismiss("agent-upload");
              toast.error("Failed to upload files");
              throw err;
            }
          }
        }

        await startAgent(
          formattedInput,
          uploadedFiles,
          undefined,
          brandIdentityEnabled
        );
      } else {
        // Design/image/text generation flow
        await generateMessage(
          formattedInput,
          attachedFiles,
          project._id,
          selectedFiles,
          { useBrandIdentity: brandIdentityEnabled }
        );
      }

      trackEvent("generation_request_submitted", {
        project_id: project._id,
        routed_to: isAgentic ? "agent" : "design",
      });

      clearInput();

      setTimeout(() => {
        window.dispatchEvent(new Event("scroll-chat-to-bottom"));
      }, 100);
    } catch (error) {
      setIsClassifying(false);
      console.error("Failed to send message:", error);
      trackEvent("generation_request_failed", {
        project_id: project?._id,
      });
    }
  };

  // Enhanced key down handler
  const handleEnhancedKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
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
    <div className={cn("flex flex-col bg-transparent", className)}>
      {/* Chat Content Area */}
      <div className='relative flex min-h-0 flex-1 flex-col overflow-hidden'>
        {children}
      </div>

      {/* Bottom Input Area - with drag and drop handlers */}
      <div
        ref={inputSectionRef}
        className='sticky bottom-0 z-10 w-full flex-none p-2 backdrop-blur-sm'
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Scroll to Bottom Button */}
        <div
          className={`absolute -top-12 left-1/2 z-20 -translate-x-1/2 transform transition-opacity duration-300 ${
            showScrollButton ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <button
            onClick={() => {
              window.dispatchEvent(new Event("scroll-chat-to-bottom"));
            }}
            className='bg-background/80 border-border rounded-full border p-1.5 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95'
            style={{
              animation: showScrollButton
                ? "gentle-bounce 2s infinite"
                : "none",
            }}
          >
            <ChevronDown className='text-muted-foreground h-5 w-5' />
          </button>
        </div>

        {/* File Attachments Previews */}
        {attachedFiles.length > 0 && !isGenerating && (
          <div className='mb-1 flex flex-wrap gap-2 px-3'>
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className='group bg-muted-foreground/5 border-border relative flex max-w-[150px] items-center gap-2 rounded-lg border p-1.5'
              >
                <div className='bg-background flex h-6 w-6 items-center justify-center overflow-hidden rounded'>
                  {file.type && file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file as any)}
                      alt={file.name}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <Paperclip className='text-muted-foreground h-3 w-3' />
                  )}
                </div>
                <span className='max-w-[80px] truncate text-[10px]'>
                  {file.name}
                </span>
                <button
                  type='button'
                  onClick={() => removeAttachedFile(index)}
                  className='text-muted-foreground hover:text-red-500'
                >
                  <Plus className='h-3 w-3 rotate-45' />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className='mx-auto w-full max-w-4xl'>
          {/* Thinking / Credits Status */}
          <div className='mb-2 flex h-6 items-center justify-between px-4'>
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
                        onClick={() =>
                          router.push("/user/settings?tab=billing")
                        }
                      >
                        <LocalizedText text={"Buy Credits"} />
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
                className='mx-4 mb-2 flex items-center text-xs font-medium text-red-500'
              >
                <AlertCircle className='mr-2 size-3.5' />
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlegenerateMessage();
            }}
            className='group flex w-full flex-col gap-2 rounded-[1.5rem] border border-white bg-white/80 p-3 text-base shadow-xl ring-1 ring-black/[0.08] backdrop-blur-xl transition-all duration-150 ease-in-out focus-within:ring-black/[0.16] hover:ring-black/[0.12] focus-within:hover:ring-black/[0.16] dark:border-white/[0.08] dark:bg-zinc-900/50 dark:ring-black/[0.88] dark:focus-within:ring-black/[0.96]'
          >
            <div className='w-full min-w-0'>
              <div className='relative flex items-center'>
                <textarea
                  ref={textareaRef}
                  value={isGenerating || isProcessingDraft ? "" : inputValue}
                  onChange={handleInput}
                  onKeyDown={handleEnhancedKeyDown}
                  onPaste={handlePaste}
                  placeholder={
                    isGenerating || isProcessingDraft
                      ? ""
                      : isListening
                        ? "Listening... speak now ✦"
                        : placeholder
                  }
                  disabled={isGenerating || isProcessingDraft}
                  className='placeholder:text-muted-foreground/60 max-h-[300px] w-full resize-none scrollbar-none border-none bg-transparent px-3 py-2 pr-10 text-[16px] leading-snug transition-colors duration-150 ease-in-out outline-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base'
                  style={{ height: "60px", minHeight: "60px" }}
                />
              </div>
            </div>

            <div className='flex items-center gap-1.5'>
              <button
                type='button'
                className='bg-secondary text-primary relative box-border inline-flex h-8 w-8 min-w-fit flex-shrink-0 items-center justify-center gap-2 rounded-full !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap shadow-sm brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out'
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating || isProcessingDraft}
              >
                <Plus className='size-5 shrink-0' />
              </button>
              <input
                ref={fileInputRef}
                type='file'
                multiple
                accept='image/*,video/*'
                onChange={handleFileSelect}
                className='hidden'
              />

              <div className='flex items-center gap-1.5'>
                <ModelSelector
                  type='general'
                  selectedModel={selectedModel}
                  initialModelId={imageModel}
                  onSelectModel={(model) => {
                    setSelectedModel(model);
                    setImageModel(model.modelId);
                    if (project?._id) {
                      updateProjectModel(project._id, model.modelId);
                    }
                  }}
                />
              </div>

              <div className='ml-auto flex items-center gap-1.5'>
                {brandSaveStatus !== "idle" && (
                  <div className='animate-in fade-in slide-in-from-right-1 flex items-center gap-1.5 px-1.5 text-[10px] font-medium duration-300'>
                    {brandSaveStatus === "saving" ? (
                      <>
                        <LoadingFileLoader size={14} />
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className='size-3 text-green-500' />
                      </>
                    )}
                  </div>
                )}
                <button
                  type='button'
                  className={cn(
                    "relative box-border inline-flex h-fit min-w-fit items-center justify-center gap-1.5 rounded-full bg-transparent p-0.5 text-sm font-normal whitespace-nowrap brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    showAppliedSwatches
                      ? "ring-primary/40 ring-1"
                      : isBrandSettingsOpen
                        ? "text-primary bg-indigo-600 hover:bg-indigo-700/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-indigo-600 hover:bg-indigo-700/5 dark:hover:bg-white/5",
                    !showAppliedSwatches && "p-0.5"
                  )}
                  aria-label={
                    showAppliedSwatches
                      ? "Brand applied"
                      : hasOrgBrand
                        ? "Apply brand"
                        : "Add brand"
                  }
                  onClick={() => {
                    setIsBrandSettingsOpen(!isBrandSettingsOpen);
                    setIsSettingsOpen(false);
                    trackEvent("chat_brand_settings_toggled", {
                      is_opening: !isBrandSettingsOpen,
                      project_id: project?._id,
                    });
                  }}
                >
                  {showAppliedSwatches ? (
                    <div className='flex -space-x-1.5'>
                      {orgBrandColors.map((color, i) => (
                        <span
                          key={`${color}-${i}`}
                          className='border-background h-4 w-4 rounded-full border-2 shadow-sm'
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  ) : (
                    <Palette className='size-4 shrink-0' />
                  )}
                </button>
                <button
                  type='button'
                  className={`relative box-border inline-flex h-8 w-8 min-w-fit items-center justify-center gap-2 rounded-full !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out ${
                    isListening
                      ? "animate-pulse bg-red-500/10 text-red-500"
                      : "text-muted-foreground hover:text-foreground hover:bg-indigo-600 hover:bg-indigo-700/5 dark:hover:bg-white/5"
                  }`}
                  onClick={handleMicClick}
                  disabled={
                    !isSupported ||
                    isGenerating ||
                    isAgentRunning ||
                    isAgentAwaitingInput ||
                    isClassifying ||
                    isProcessingDraft
                  }
                >
                  <Mic className='size-4 shrink-0' />
                </button>

                <button
                  type='submit'
                  disabled={
                    isGenerating ||
                    isClassifying ||
                    isAgentRunning ||
                    isAgentAwaitingInput ||
                    isProcessingDraft ||
                    (inputValue.trim().length < 2 && attachedFiles.length === 0)
                  }
                  className='relative cursor-pointer rounded-[10px] bg-[linear-gradient(to_top,#292929,#555555,#292929)] p-[2px] shadow-[inset_0_6px_2px_-4px_rgba(255,255,255,.5)] transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {/* Border effects behind content */}
                  <div className='absolute inset-0 overflow-hidden rounded-[10px]'>
                    <BorderBeam
                      duration={6}
                      size={40}
                      className='from-transparent via-red-500 to-transparent'
                    />
                    <BorderBeam
                      duration={6}
                      delay={10}
                      size={40}
                      borderWidth={2}
                      className='from-transparent via-blue-500 to-transparent'
                    />
                  </div>

                  {/* Button content */}
                  <div className='relative z-10 flex h-[30px] w-[30px] items-center justify-center rounded-[10px] bg-black/10 backdrop-blur-[3px] transition-all duration-300 hover:drop-shadow-[0_0_5px_white]'>
                    {isAiResponding ? (
                      <LoadingFileLoader size={14} />
                    ) : (
                      <svg
                        className='h-4 w-4 text-white'
                        viewBox='0 0 512 512'
                        fill='currentColor'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05' />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            </div>
            <GradientFrame />
          </form>

          <AnimatePresence>
            {isBrandSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className='border-border absolute right-0 bottom-full left-0 z-50 mx-auto mb-2 max-h-[500px] w-full max-w-md overflow-hidden rounded-xl border bg-white shadow-md md:mx-0 dark:bg-black'
              >
                <div className='flex flex-col p-4'>
                  {/* Header */}
                  <div className='border-border mb-4 flex items-center justify-between border-b pb-3'>
                    <div className='flex items-center gap-2'>
                      <Palette className='text-primary h-4 w-4' />
                      <h3 className='text-foreground text-sm font-semibold'>
                        <LocalizedText text={"Brand Identity"} />
                      </h3>
                    </div>
                    <button
                      type='button'
                      onClick={() => setIsBrandSettingsOpen(false)}
                      className='flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-zinc-800 dark:hover:text-gray-300'
                      aria-label='Close settings'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>

                  {/* Brand Settings Content */}
                  <div className='custom-scrollbar max-h-[400px] overflow-y-auto pr-1'>
                    <BrandIdentityPanel
                      disabled={isGenerating || isAgentRunning}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
