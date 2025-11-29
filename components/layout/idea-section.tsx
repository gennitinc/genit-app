"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  X,
  PaperclipIcon,
  XIcon,
  MessageSquare,
  Image,
  TrendingUp,
  Users,
  Sparkles,
  Zap,
  AlertCircle,
  Mic,
  Loader2,
  WandSparklesIcon,
  Settings,
  Settings2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/AuthenticatedContext";
import { motion, AnimatePresence } from "framer-motion";
import { PricingDialog } from "@/components/common/pricing-dialog";
import { useProjectDesign } from "@/context/DesignProject";
import DesignType from "../chat/designType";
import ShinyText from "../ui/shiny-text";
import HomeGrid from "../common/templateGrid";
import { HomeInfoGrid } from "../common/homeInfoGrid";
import AnimatedTooltipPreview from "../common/homeAgentsTooltip";
import { AIThinkingContent } from "../chat/messages";

interface TypewriterEffectProps {
  words: string[];
  typingSpeed?: number;
  delay?: number;
}

function useTypewriterEffect({
  words,
  typingSpeed = 100,
  delay = 1500,
}: TypewriterEffectProps): string {
  const [text, setText] = useState<string>("");
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setText((prev) => prev.slice(0, -1));
      }, typingSpeed / 2);
    } else {
      timeout = setTimeout(() => {
        setText((prev) => currentWord.slice(0, prev.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && text === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, delay]);

  return text;
}

const images = [
  "https://img.freepik.com/free-photo/smiley-woman-outdoors-city_23-2148774316.jpg?ga=GA1.1.1557987898.1750353078&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/freedom-concept-with-hiker-mountain_23-2148107064.jpg?ga=GA1.1.1557987898.1750353078&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-vector/woman-doodle-drawing-sketch-illustration-vector_53876-118.jpg?ga=GA1.1.1557987898.1750353078&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/young-hispanic-man-with-beard-wearing-red-t-shirt-blue-background-looking-side-relax-profile-pose-with-natural-face-with-confident-smile_839833-2174.jpg?ga=GA1.1.1557987898.1750353078&w=740",
  "https://img.freepik.com/free-photo/smiling-man_1098-15443.jpg?ga=GA1.1.1557987898.1750353078&w=740",
];

export function IdeaSection() {
  const placeholders = [
    "Design a minimalist logo for a wellness brand...",
    "Create an Instagram carousel about eco-friendly tips...",
    "Make a bold product promo poster for a new sneaker...",
    "Design a YouTube thumbnail for a tech review...",
    "Create a website hero banner for a SaaS startup...",
    "Design a clean pricing table graphic...",
    "Make Facebook ad creatives for a summer sale...",
    "Create a modern business card layout...",
    "Design an event flyer with a neon vibe...",
    "Create a LinkedIn banner for a personal brand...",
    "Design a product mockup for a coffee brand...",
    "Create an infographic explaining carbon offsets...",
  ];

  const {
    attachedFiles,
    setAttachedFiles,
    clearInput,
    isGenerating,
    error,
    clearError,
    resetGenerationState: resetState,
    createProject,
    inputValue,
    setInputValue,
    processFiles,
    removeAttachedFile,
  } = useProjectDesign();

  const [beamPosition, setBeamPosition] = useState({ x: 50, y: 50 });
  const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDesignTypeId, setSelectedDesignTypeId] = useState<
    string | null
  >("generic_design");
  const [imageRotations] = useState(() =>
    images.map(() => Math.random() * 20 - 10)
  );

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const user = useUserContext().user;

  const placeholderText = useTypewriterEffect({
    words: placeholders,
    typingSpeed: 25,
    delay: 2000,
  });

  // Input validation
  const validateInput = useCallback((value: string, files: File[]) => {
    if (!value.trim() && files.length === 0) {
      return "Please enter a prompt or attach files";
    }
    if (value.trim().length < 10) {
      return "Please provide a more detailed prompt (at least 10 characters)";
    }
    if (value.trim().length > 5000) {
      return "Prompt is too long (maximum 2000 characters)";
    }
    return null;
  }, []);

  // Handle input change with validation
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setInputValue(value);
      setInputError(null);

      // Auto-resize textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
          Math.min(textareaRef.current.scrollHeight, 300) + "px";
      }
    },
    [setInputValue]
  );

  // Handle file processing with validation
  const handleFileProcess = useCallback(
    (files: File[]) => {
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      const maxFiles = 10;

      if (attachedFiles.length + files.length > maxFiles) {
        setInputError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const validFiles = files.filter((file) => {
        const isImageOrVideo =
          file.type?.startsWith("image/") || file.type?.startsWith("video/");
        if (!isImageOrVideo) return false;
        if (file.size > maxFileSize) {
          setInputError(`${file.name} is too large (max 10MB)`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        processFiles(validFiles);
        setInputError(null);
      }
    },
    [attachedFiles.length, processFiles]
  );

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      handleFileProcess(files);
      e.target.value = "";
    },
    [handleFileProcess]
  );

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const files = Array.from(e.dataTransfer.files);
      handleFileProcess(files);
    },
    [handleFileProcess]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Check if user is authenticated
      if (!user) {
        router.push("/signin");
        return;
      }

      const validationError = validateInput(inputValue, attachedFiles);
      if (validationError) {
        setInputError(validationError);
        return;
      }

      if (isGenerating || isSubmitting) return;

      setIsSubmitting(true);
      setInputError(null);

      try {
        const res = await createProject(
          inputValue,
          attachedFiles as any,
          undefined,
          selectedDesignTypeId || undefined
        );

        console.log("Project creation result:", res);

        clearInput();
        setSelectedDesignTypeId(null);

        if (res.type && res.id) {
          // Redirect to chat page with project ID
          router.push(`/chat/${res.id}`);
        }
      } catch (error: any) {
        console.error("Failed to create project:", error);
        setInputError(
          error.message || "Failed to create project. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      inputValue,
      attachedFiles,
      isGenerating,
      isSubmitting,
      validateInput,
      createProject,
      user,
      router,
    ]
  );

  // Handle quick task selection
  const handleQuickTaskSelect = useCallback(
    (text: string, description?: string) => {
      const prompt = description ? `${text}: ${description}` : text;
      setInputValue(prompt);
      setInputError(null);
      textareaRef.current?.focus();
    },
    [setInputValue]
  );

  // Handle file removal
  const handleFileRemove = useCallback(
    (index: number) => {
      removeAttachedFile(index);
      setInputError(null);
    },
    [removeAttachedFile]
  );

  // Handle key press
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        handleSubmit(e as any);
      }
    },
    [handleSubmit]
  );

  useEffect(() => {
    if (!chatContainerRef.current) return;
    const container = chatContainerRef.current;
    const getRandomPosition = () => {
      const padding = 0.2;
      return {
        x: (Math.random() * (1 - padding * 2) + padding) * 100,
        y: (Math.random() * (1 - padding * 2) + padding) * 100,
      };
    };

    setBeamPosition(getRandomPosition());

    const interval = setInterval(() => {
      setBeamPosition(getRandomPosition());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Clear error when input changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [inputValue, error, clearError]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const isSubmitDisabled =
    isGenerating ||
    isSubmitting ||
    (!inputValue.trim() && attachedFiles.length === 0);

  return (
    <div className="">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <AnimatedTooltipPreview />
          <motion.div
            className="mt-2 mb-6 md:mb-8 lg:mb-12 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-3xl md:text-4xl font-bold tracking-tight text-center lg:text-5xl mt-8"
              custom={1}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: (custom: number) => ({
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: custom * 0.1,
                    duration: 0.5,
                  },
                }),
              }}
              initial="hidden"
              animate="visible"
            >
              AI Media Designer
            </motion.h1>
            <motion.p
              className="mt-4 text-center text-gray-600 dark:text-gray-300 max-w-lg"
              custom={2}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: (custom: number) => ({
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: custom * 0.1,
                    duration: 0.5,
                  },
                }),
              }}
              initial="hidden"
              animate="visible"
            >
              Create photo manipulations, stunning graphics, brand assets, and
              marketing visuals in minutes—no design degree required
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          className="flex flex-col relative w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative">
            {/* File Attachments */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 custom-scrollbar-horizontal">
                {attachedFiles.map((file: any, index: number) => {
                  const fileKey = file.fileKey || `${file.name}-${index}`;
                  return (
                    <div
                      key={fileKey}
                      className="relative group bg-muted-foreground/5 border border-border rounded-lg p-2 flex items-center gap-2 hover:bg-background/50 transition-colors max-w-[200px]"
                    >
                      <div className="w-8 h-8 bg-background border border-border rounded flex items-center justify-center flex-shrink-0 relative">
                        {file.type && file.type.startsWith("image/") ? (
                          <img
                            src={
                              URL.createObjectURL(file) || "/placeholder.svg"
                            }
                            alt={file.name}
                            className="w-full h-full object-cover rounded"
                            onLoad={(e) =>
                              URL.revokeObjectURL(
                                (e.target as HTMLImageElement).src
                              )
                            }
                          />
                        ) : file.type && file.type.startsWith("video/") ? (
                          <div className="w-full h-full grid place-items-center text-[10px] text-muted-foreground">
                            🎬
                          </div>
                        ) : (
                          <svg
                            className="w-4 h-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate text-foreground">
                          {file.name && file.name.length > 15
                            ? `${file.name.substring(0, 15)}...`
                            : file.name || "Unknown file"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleFileRemove(index)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-muted-foreground hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        disabled={isGenerating}
                        aria-label={`Remove ${file.name}`}
                      >
                        &times;
                      </button>
                      {file.type && file.type.startsWith("image/") && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          <div className="bg-background border border-border rounded-lg shadow-lg p-2">
                            <img
                              src={
                                URL.createObjectURL(file) || "/placeholder.svg"
                              }
                              alt={file.name}
                              className="max-w-[200px] max-h-[150px] object-contain rounded"
                              onLoad={(e) =>
                                URL.revokeObjectURL(
                                  (e.target as HTMLImageElement).src
                                )
                              }
                            />
                            {/* <div className="mt-1 text-xs text-muted-foreground text-center">
                              {file.name} • {formatFileSize(file.size)}
                            </div> */}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div
            ref={chatContainerRef}
            className="relative flex bg-gradient-to-br from-gray-300 via-gray-200 to-gray-100 dark:from-[#7e7e7e] dark:via-[#363636] dark:to-[#363636] rounded-2xl p-[1.5px] overflow-hidden before:absolute before:content-[''] before:top-[-10px] before:left-[-10px] before:bg-radial-gradient md:before:w-[40vh] before:h-[30px] before:blur-[1px] w-full shadow-lg"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Animated beam with smoother transitions */}
            <motion.div
              className="absolute w-full md:w-40 h-40 rounded-full bg-blue-400/20 dark:bg-blue-500/20 blur-3xl pointer-events-none z-0"
              animate={{
                left: `${beamPosition.x}%`,
                top: `${beamPosition.y}%`,
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
              }}
              style={{ transform: "translate(-50%, -50%)" }}
            />
            <div className="flex flex-col bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-[15px] w-full overflow-hidden z-10 shadow-inner">
              {/* Credit info and typing indicator */}
              <div className="flex items-center mx-4 justify-between text-sm mt-3 mb-2">
                {!isGenerating && (
                  <div className="flex items-center gap-1 justify-between w-full">
                    <div className="text-muted-foreground dark:text-zinc-400 flex items-center">
                      <Zap className="inline-block w-3 h-3  text-emerald-500 mr-2" />
                      {user ? (
                        `${(user?.creditsRemaining ?? 0).toLocaleString()} Credits left`
                      ) : (
                        <span className="ml-2 text-xs text-muted-foreground">
                          Get a 20 free credit
                        </span>
                      )}
                    </div>

                    {/* Conditional CTA when credits are zero */}
                    {user && (user?.creditsRemaining ?? 0) === 0 && (
                      <div>
                        {String(user?.userPlan) === "Basic" ? (
                          <span
                            className="cursor-pointer"
                            onClick={() => router.push("/pricing")}
                          >
                            Upgrade
                          </span>
                        ) : (
                          <span
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
                {isGenerating && (
                  <ShinyText
                    text="Thinking..."
                    disabled={false}
                    speed={3}
                    className="custom-class"
                  />
                )}
              </div>

              {/* Error message */}
              <AnimatePresence>
                {(inputError || error) && (
                  <p className="text-xs text-red-500 font-medium flex items-center mt-2 mx-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14px"
                      height="14px"
                      fill="currentColor"
                      className="mr-2"
                      viewBox="0 0 512 512"
                    >
                      <path
                        d="M256 0C114.833 0 0 114.833 0 256s114.833 256 256 256 256-114.853 256-256S397.167 0 256 0zm0 472.341c-119.275 0-216.341-97.046-216.341-216.341S136.725 39.659 256 39.659c119.295 0 216.341 97.046 216.341 216.341S375.275 472.341 256 472.341z"
                        data-original="#000000"
                      />
                      <path
                        d="M373.451 166.965c-8.071-7.337-20.623-6.762-27.999 1.348L224.491 301.509 166.053 242.1c-7.714-7.813-20.246-7.932-28.039-.238-7.813 7.674-7.932 20.226-.238 28.039l73.151 74.361a19.804 19.804 0 0 0 14.138 5.929c.119 0 .258 0 .377.02a19.842 19.842 0 0 0 14.297-6.504l135.059-148.722c7.358-8.131 6.763-20.663-1.347-28.02z"
                        data-original="#000000"
                      />
                    </svg>
                    {inputError || error}
                  </p>
                )}
              </AnimatePresence>

              <form
                onSubmit={
                  user
                    ? handleSubmit
                    : (e) => {
                        e.preventDefault();
                        router.push("/signin");
                      }
                }
                className="relative"
              >
                <div className="flex flex-col gap-3 bg-muted-foreground/5 border border-border rounded-xl p-3 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-300">
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      id="chat_bot"
                      name="chat_bot"
                      value={isGenerating ? "" : inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      placeholder={
                        isGenerating
                          ? ""
                          : placeholderText + "✦" ||
                            "Tell your AI team what to create...✦"
                      }
                      disabled={isGenerating || isSubmitting}
                      style={{
                        lineHeight: "1.5",
                        fontFamily: "inherit",
                        minHeight: "40px",
                        maxHeight: "300px",
                      }}
                      className="bg-transparent rounded-2xl border-none w-full h-[60px] text-gray-800 dark:text-white font-sans font-normal p-2 md:p-4 resize-none overflow-y-auto outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 placeholder:transition-all placeholder:duration-300 focus:placeholder:text-gray-400 dark:focus:placeholder:text-[#363636] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-[#888] scrollbar-thumb-rounded hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-[#555] text-base"
                      aria-label="Enter your prompt"
                      aria-describedby={inputError ? "input-error" : undefined}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1.5 hover:bg-background/50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                        disabled={isGenerating}
                      >
                        <Mic className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                      <button
                        type="button"
                        className="flex items-center justify-center w-8 h-8 text-gray-400 dark:text-white/30 bg-transparent rounded-full hover:bg-gray-100 dark:hover:bg-white/5 border-none cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isGenerating || isSubmitting}
                        aria-label="Attach files"
                      >
                        <PaperclipIcon className="h-4 w-4" />
                      </button>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileInputChange}
                        disabled={isGenerating || isSubmitting}
                        className="hidden"
                        id="file-upload"
                        accept="image/*,video/*"
                        aria-label="Select files to upload"
                      />
                    </div>
                    {/* <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className={`flex items-center justify-center p-0.5 bg-gradient-to-t from-gray-300 via-gray-200 to-gray-100 dark:from-[#292929] dark:via-[#555555] dark:to-[#292929] rounded-[10px] shadow-[inset_0_6px_2px_-4px_rgba(255,255,255,0.5)] cursor-pointer border-none outline-none transition-all duration-150 active:scale-[0.92] group ${
                      isSubmitDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-md"
                    }`}
                    aria-label="Submit prompt"
                  >
                    <div className="w-[34px] h-[34px] flex items-center justify-center bg-gray-100/50 dark:bg-black/10 rounded-[10px] backdrop-blur-[3px] text-gray-500 dark:text-[#8b8b8b] group-hover:text-gray-700 dark:group-hover:text-white transition-colors">
                      {isGenerating || isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <svg
                          viewBox="0 0 512 512"
                          className="w-5 h-5 transition-all duration-300"
                        >
                          <path
                            fill="currentColor"
                            d="M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05"
                          />
                        </svg>
                      )}
                    </div>
                  </button> */}
                    <button className="relative inline-flex h-9 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                        {isGenerating || isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <div className="flex flex-row items-center gap-2">
                            <WandSparklesIcon className="w-3 h-3" />
                            Create
                          </div>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="space-y-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div>
            <h3 className="text-center text-sm font-medium mb-4 text-muted-foreground dark:text-zinc-400">
              Quick Visual Design Types
            </h3>
            <DesignType
              selectedId={selectedDesignTypeId}
              onSelect={(id) => {
                // Optional: seed prompt based on selection
                const map: Record<string, string> = {
                  social: "Create a social media post about ...",
                  video: "Storyboard a 10s video intro about ...",
                  photo: "Retouch a product photo: ...",
                  gallery: "Create a gallery collage for ...",
                };
                const text = map[id] || "";
                if (text) {
                  setInputValue(text);
                }
                setSelectedDesignTypeId((prev) => (prev === id ? null : id));
              }}
              className="px-2"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
