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
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/AuthenticatedContext";
import { motion, AnimatePresence } from "framer-motion";
import { PricingDialog } from "@/components/common/pricing-dialog";
import { useProjectContext } from "@/context/Chat-Context";
import ShinyText from "../ui/shiny-text";
import HomeGrid from "../common/homeGrid";
import { HomeInfoGrid } from "../common/homeInfoGrid";
import AnimatedTooltipPreview from "../common/homeAgentsTooltip";

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
    isGenerating,
    error,
    clearError,
    resetGenerationState: resetState,
    createProject,
    inputValue,
    setInputValue,
    processFiles,
    removeAttachedFile,
  } = useProjectContext();

  const [beamPosition, setBeamPosition] = useState({ x: 50, y: 50 });
  const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFileList, setShowFileList] = useState(false);
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

  // Social media platform icons
  const socialIcons = [
    { name: "Instagram", icon: "📸", color: "from-pink-500 to-purple-600" },
    { name: "Twitter", icon: "🐦", color: "from-blue-400 to-blue-600" },
    { name: "LinkedIn", icon: "💼", color: "from-blue-600 to-blue-800" },
    { name: "TikTok", icon: "🎵", color: "from-pink-400 to-red-500" },
    { name: "YouTube", icon: "📺", color: "from-red-500 to-red-700" },
  ];

  // Input validation
  const validateInput = useCallback((value: string, files: File[]) => {
    if (!value.trim() && files.length === 0) {
      return "Please enter a prompt or attach files";
    }
    if (value.trim().length < 10) {
      return "Please provide a more detailed prompt (at least 10 characters)";
    }
    if (value.trim().length > 2000) {
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
      const allowedTypes = [
        "image/*",
        ".pdf",
        ".txt",
        ".md",
        ".js",
        ".jsx",
        ".ts",
        ".tsx",
        ".css",
        ".html",
        ".json",
        ".xml",
        ".yaml",
        ".yml",
      ];

      if (attachedFiles.length + files.length > maxFiles) {
        setInputError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const validFiles = files.filter((file) => {
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

      const validationError = validateInput(inputValue, attachedFiles);
      if (validationError) {
        setInputError(validationError);
        return;
      }

      if (isGenerating || isSubmitting) return;

      setIsSubmitting(true);
      setInputError(null);

      try {
        console.log("Creating project with:", { inputValue, attachedFiles });
        await createProject(inputValue, attachedFiles);
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
    ]
  );

  // Handle quick task selection
  const handleQuickTaskSelect = useCallback(
    (task: string, agent?: string) => {
      const prompt = agent
        ? `Create ${task.toLowerCase()} using the ${agent}`
        : `Create ${task.toLowerCase()}`;
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

  // Show file list when files are attached
  useEffect(() => {
    setShowFileList(attachedFiles.length > 0);
  }, [attachedFiles.length]);

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
          {/* <div className="flex justify-center items-center">
            {images.map((image, idx) => (
              <motion.div
                key={"images" + idx}
                style={{
                  rotate: imageRotations[idx],
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 0,
                  zIndex: 100,
                }}
                whileTap={{
                  scale: 1.1,
                  rotate: 0,
                  zIndex: 100,
                }}
                className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 shrink-0 overflow-hidden"
              >
                <img
                  src={image}
                  alt="User avatars"
                  width="500"
                  height="500"
                  className="rounded-lg h-12 w-12 md:h-16 md:w-16 object-cover shrink-0"
                />
              </motion.div>
            ))}
          </div> */}
          <AnimatedTooltipPreview />
          <motion.div
            className="mt-4 mb-6 md:mb-8 lg:mb-12 flex flex-col items-center justify-center"
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
              Your AI Media Designer
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
              Create stunning graphics, brand assets, and marketing visuals in
              minutes—no design degree required
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          className="flex flex-col relative w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
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
                  <div className="text-muted-foreground dark:text-zinc-400 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                    50 AI Credits left
                  </div>
                )}
                {isGenerating && (
                  <div className="flex items-start">
                    <div className="chat chat-start p-0 m-0 w-full">
                      <div className="chat-bubble text-sm flex flex-row gap-2 items-center text-gray-900">
                        <p className="text-sm text-muted-foreground dark:text-zinc-400">
                          Your AI team is
                        </p>
                        <ShinyText
                          text="working..."
                          speed={2}
                          className="text-sm font-medium text-muted-foreground"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <PricingDialog
                    open={isPricingDialogOpen}
                    className="text-primary dark:text-teal-400 hover:text-primary/80 dark:hover:text-teal-300 transition-colors cursor-pointer text-sm font-medium"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white"
                    onClick={resetState}
                    aria-label="Clear input"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {(inputError || error) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mx-4 mb-2"
                  >
                    <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm text-red-700 dark:text-red-300">
                        {inputError || error}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setInputError(null)}
                        className="h-6 w-6 p-0 ml-auto text-red-500 hover:text-red-700"
                        aria-label="Dismiss error"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="relative">
                <div className="relative flex">
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
                    className="bg-transparent rounded-2xl border-none w-full h-[60px] text-gray-800 dark:text-white font-sans font-normal p-4 resize-none overflow-y-auto outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 placeholder:transition-all placeholder:duration-300 focus:placeholder:text-gray-400 dark:focus:placeholder:text-[#363636] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-[#888] scrollbar-thumb-rounded hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-[#555] text-base"
                    aria-label="Enter your prompt"
                    aria-describedby={inputError ? "input-error" : undefined}
                  />
                </div>

                {/* File list */}
                <AnimatePresence>
                  {showFileList && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mx-4 mb-2"
                    >
                      <div className="space-y-2 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">
                            Selected Files ({attachedFiles.length})
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setAttachedFiles([])}
                            disabled={isGenerating}
                            className="h-6 px-2 text-xs"
                          >
                            Clear all
                          </Button>
                        </div>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {attachedFiles.map((file, index) => (
                            <motion.div
                              key={file.fileKey || index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600"
                            >
                              <div className="flex items-center space-x-2 min-w-0 flex-1">
                                <div className="text-sm font-medium text-foreground truncate">
                                  {file.name}
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="text-xs flex-shrink-0"
                                >
                                  {formatFileSize(file.size)}
                                </Badge>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFileRemove(index)}
                                disabled={isGenerating}
                                className="h-6 w-6 p-0 flex-shrink-0"
                                aria-label={`Remove ${file.name}`}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between items-center p-3">
                  <div className="flex gap-2">
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
                      accept="image/*,.pdf,.txt,.md,.js,.jsx,.ts,.tsx,.css,.html,.json,.xml,.yaml,.yml"
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
                        "Create"
                      )}
                    </span>
                  </button>
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
            <h3 className="text-center text-sm font-medium mb-3 text-muted-foreground dark:text-zinc-400">
              Quick Social Media Tasks
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                {
                  text: "Social Media Content",
                  agent: "Social Media Manager",
                },
                {
                  text: "Customer Support",
                  agent: "Customer Support",
                },
                { text: "Blog Posts", agent: "Content Writer" },
                { text: "Ad Campaigns", agent: "Ads Manager" },
                {
                  text: "Growth Strategy",
                  agent: "Growth Specialist",
                },
                {
                  text: "Email Marketing",
                  agent: "Content Writer",
                },
                {
                  text: "Social Media Strategy",
                  agent: "Social Media Manager",
                },
                {
                  text: "Customer Engagement",
                  agent: "Customer Support",
                },
              ].map((item, index) => (
                <motion.button
                  key={item.text}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-[#1b1b1b] border border-gray-200 dark:border-[#363636] rounded-[5px] cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-[#2a2a2a] transition-colors text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  onClick={() => handleQuickTaskSelect(item.text, item.agent)}
                  disabled={isGenerating || isSubmitting}
                  aria-label={`Create ${item.text.toLowerCase()} using ${
                    item.agent || "AI"
                  }`}
                >
                  {item.text}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
