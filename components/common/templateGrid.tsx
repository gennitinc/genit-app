"use client"
import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Users,
  Sparkles,
  TrendingUp,
  Zap,
  Image as ImageIcon,
  ArrowRight,
  Eye,
  Pencil,
  AlertCircle,
  X,
  XIcon,
  Mic,
  PaperclipIcon,
  Loader,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthenticatedContext";
import { motion, AnimatePresence } from "framer-motion";
import { PricingDialog } from "@/components/common/pricing-dialog";
import ShinyText from "../ui/shiny-text";
import { HomeInfoGrid } from "./homeInfoGrid";
import AnimatedTooltipPreview from "./homeAgentsTooltip";
import { apiResponse } from "@/utils/apiResponse";
import { useProjectDesign } from "@/context/DesignProject";
import { Skeleton } from "@/components/ui/skeleton";
import { AIThinkingContent } from "../chat/messages";

type TemplateItem = {
  id: string;
  src: string;
  alt?: string;
};

export default function TemplateGrid() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<TemplateItem | null>(null);
  const [editMessage, setEditMessage] = useState<string>("");
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [new_error, setNewError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState("fliers");
  const [limit, setLimit] = useState(20);
  const [pins, setPins] = useState([]);

  const fetchPins = async () => {
    setLoading(true);
    setNewError(null);

    try {
      // 👇 Fetch from your Express backend
      const res = await apiResponse.get(
        "/templates/scrape/pins/search?q=fliers&limit=12",
        {
          withCredentials: true,
        }
      );

      const data = await res.data();

      if (data.success) {
        setPins(data.pins || []);
      } else {
        setNewError(data.error || "Failed to load");
      }
    } catch (err) {
      setNewError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPins();
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      setNewError(null);

      try {
        const res = await apiResponse.get("/templates?limit=50", {
          withCredentials: true,
        });

        const data = res.data;

        console.log("res", data);

        if (data.success && data.data?.templates) {
          const mapped: TemplateItem[] = data.data.templates.map(
            (template: any) => ({
              id: template._id || template.assetId,
              src: template.mediaUrl,
              alt: template.alt || template.title || "Template",
            })
          );

          setTemplates(mapped.length > 0 ? mapped : []);
        } else {
          setTemplates([]);
        }
      } catch (err: any) {
        console.error("Failed to fetch inspirations:", err);
        setNewError(err.message || "Failed to load inspirations.");
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const onView = (item: TemplateItem) => {
    setSelected(item);
    setViewOpen(true);
  };

  const onEdit = (item: TemplateItem) => {
    setSelected(item);
    setEditOpen(true);

    // Add the template URL to selectedFiles only if it's not already included
    setSelectedFiles((prev) => (prev.includes(item.src) ? prev : [item.src]));
  };

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
    selectedFiles,
    setSelectedFiles,
    clearInput,
    error,
    isGenerating,
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

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useUserContext().user;

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

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Check if user is authenticated
      if (!user) {
        router.push("/signin");
        return;
      }

      // Validate input before proceeding
      try {
        const validationError = validateInput?.(inputValue, attachedFiles);
        if (validationError) {
          setInputError(validationError);
          return;
        }
      } catch (err) {
        console.error("Validation error:", err);
        setInputError("An unexpected validation error occurred.");
        return;
      }

      // Prevent double submissions or when generating
      if (isGenerating || isSubmitting) return;

      // Prevent submitting with no content
      if (!inputValue.trim() && attachedFiles.length === 0) {
        setInputError("Please provide a title or attach at least one file.");
        return;
      }

      setIsSubmitting(true);
      setInputError(null);

      try {
        console.log("Creating project with:", {
          inputValue,
          attachedFiles,
          selectedFiles,
        });

        const result = await createProject(
          inputValue,
          attachedFiles,
          selectedFiles
        );

        clearInput();

        if (result.type && result.id) {
          // Redirect to chat page with project ID
          router.push(`/chat/${result.id}`);
        }
      } catch (error: any) {
        console.error("Failed to create project:", error);
        setInputError(
          error?.message || "Failed to create project. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      inputValue,
      attachedFiles,
      selectedFiles,
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

  // Clear error when input changes
  useEffect(() => {
    if (new_error) {
      clearError();
    }
  }, [inputValue, new_error, clearError]);

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

  const Header = (
    <div className="mt-8 mb-4 flex items-center justify-between">
      <h2 className="text-base font-semibold text-foreground">Inspirations</h2>
      <button
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        onClick={() => router.push("/inspirations")}
      >
        View all
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <motion.div
      className="mt-8 mb-20 px-4 md:px-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      {Header}
      <div className="columns-2 md:columns-4 gap-4 [column-fill:_balance]">
        {isLoading && templates.length === 0 && (
          <>
            {[220, 280, 200, 260, 240, 300, 210, 250, 230, 270, 190, 310].map(
              (h, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className="mb-4 inline-block w-full align-top"
                  style={{ breakInside: "avoid" }}
                >
                  <Skeleton
                    className="w-full rounded-lg bg-muted/70"
                    style={{ height: h }}
                  />
                </div>
              )
            )}
          </>
        )}
        {templates.map((t) => (
          <div
            key={t.id}
            className="group relative mb-4 inline-block w-full align-top"
            style={{ breakInside: "avoid" }}
          >
            <img
              className="h-auto max-w-full rounded-lg object-cover"
              src={t.src}
              alt={t.alt || "Template"}
            />
            <div className="pointer-events-none absolute inset-0 rounded-lg bg-black/0 opacity-0 transition-opacity group-hover:opacity-100 group-hover:bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-100 lg:opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                size="icon"
                variant="secondary"
                onClick={() => onView(t)}
                className="pointer-events-auto rounded-full h-9 w-9 p-0"
                aria-label="View template"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                onClick={() => onEdit(t)}
                className="pointer-events-auto rounded-full h-9 w-9 p-0"
                aria-label="Edit template"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview UI: Dialog on desktop, Drawer on mobile */}
      {selected && !isMobile && (
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="w-fit h-fit p-0 flex flex-col">
            <div className="p-0 m-0">
              <img
                src={selected.src}
                alt={selected.alt || "Template"}
                className="w-full h-[50vh] object-contain rounded-md"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {selected && isMobile && (
        <Drawer open={viewOpen} onOpenChange={setViewOpen}>
          <DrawerContent className="h-[75vh]">
            <DialogHeader className="px-4 py-2 border-b">
              <DialogTitle>Preview</DialogTitle>
            </DialogHeader>
            <div className="px-4 pt-2">
              <img
                src={selected.src}
                alt={selected.alt || "Template"}
                className="w-full h-[65vh] object-contain rounded-lg"
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Edit modal/drawer showing item and sticky action */}
      {selected && !isMobile && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-3xl h-[80vh] p-0 flex flex-col">
            <DialogHeader className="px-4 py-3 border-b">
              <DialogTitle>Recreate</DialogTitle>
            </DialogHeader>
            <div className="">
              <img
                src={selected.src}
                alt={selected.alt || "Template"}
                className="w-full h-[50vh] object-contain rounded-md"
              />
            </div>
            <motion.div
              className="flex flex-col relative w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="absolute top-[-50] left-2">
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
                                    URL.createObjectURL(file) ||
                                    "/placeholder.svg"
                                  }
                                  alt={file.name}
                                  className="w-full h-full object-cover rounded"
                                  onLoad={(e) =>
                                    URL.revokeObjectURL(
                                      (e.target as HTMLImageElement).src
                                    )
                                  }
                                />
                              ) : file.type &&
                                file.type.startsWith("video/") ? (
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
                              className="absolute -top-1 -right-1 w-4 h-4 bg-muted-foreground hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
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
                                      URL.createObjectURL(file) ||
                                      "/placeholder.svg"
                                    }
                                    alt={file.name}
                                    className="max-w-[200px] max-h-[150px] object-contain rounded"
                                    onLoad={(e) =>
                                      URL.revokeObjectURL(
                                        (e.target as HTMLImageElement).src
                                      )
                                    }
                                  />
                                  <div className="mt-1 text-xs text-muted-foreground text-center">
                                    {file.name} • {formatFileSize(file.size)}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div
                ref={chatContainerRef}
                className="relative flex bg-gradient-to-br from-gray-300 via-gray-200 to-gray-100 dark:from-[#7e7e7e] dark:via-[#363636] dark:to-[#363636] rounded-2xl p-[1.5px] overflow-hidden before:absolute before:content-[''] before:top-[-10px] before:left-[-10px] before:bg-radial-gradient md:before:w-[40vh] before:h-[30px] before:blur-[1px] w-full shadow-lg"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {/* Animated beam with smoother transitions */}
                <motion.div
                  className="absolute w-full h-40 rounded-full bg-blue-400/20 dark:bg-blue-500/20 blur-3xl pointer-events-none z-0"
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
                      <ShinyText
                        text="Thinking..."
                        disabled={false}
                        speed={3}
                        className="custom-class"
                      />
                    )}
                    {/* <div className="flex items-center gap-2">
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
                    </div> */}
                  </div>

                  <div className="relative">
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
                                : "Tell your AI Designer what to create...✦"
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
                            aria-describedby={
                              inputError ? "input-error" : undefined
                            }
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
                        <Loader className="w-5 h-5 animate-spin" />
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
                                <Loader className="w-5 h-5 animate-spin" />
                              ) : (
                                "Create"
                              )}
                            </span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}

      {selected && isMobile && (
        <Drawer open={editOpen} onOpenChange={setEditOpen}>
          <DrawerContent className="h-[85vh]">
            <DrawerHeader className="">
              <DrawerTitle>Recreate</DrawerTitle>
            </DrawerHeader>
            <div className="px-4">
              <img
                src={selected.src}
                alt={selected.alt || "Template"}
                className="w-full h-[55vh] object-contain rounded-md"
              />
            </div>
            <motion.div
              className="flex flex-col w-full relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="absolute top-[-50] left-2">
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
                                    URL.createObjectURL(file) ||
                                    "/placeholder.svg"
                                  }
                                  alt={file.name}
                                  className="w-full h-full object-cover rounded"
                                  onLoad={(e) =>
                                    URL.revokeObjectURL(
                                      (e.target as HTMLImageElement).src
                                    )
                                  }
                                />
                              ) : file.type &&
                                file.type.startsWith("video/") ? (
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
                              className="absolute -top-1 -right-1 w-4 h-4 bg-muted-foreground hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity text-xs"
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
                                      URL.createObjectURL(file) ||
                                      "/placeholder.svg"
                                    }
                                    alt={file.name}
                                    className="max-w-[200px] max-h-[150px] object-contain rounded"
                                    onLoad={(e) =>
                                      URL.revokeObjectURL(
                                        (e.target as HTMLImageElement).src
                                      )
                                    }
                                  />
                                  <div className="mt-1 text-xs text-muted-foreground text-center">
                                    {file.name} • {formatFileSize(file.size)}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div
                ref={chatContainerRef}
                className="relative flex bg-gradient-to-br from-gray-300 via-gray-200 to-gray-100 dark:from-[#7e7e7e] dark:via-[#363636] dark:to-[#363636] rounded-2xl p-[1.5px] overflow-hidden before:absolute before:content-[''] before:top-[-10px] before:left-[-10px] before:bg-radial-gradient md:before:w-[40vh] before:h-[30px] before:blur-[1px] w-full shadow-lg"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {/* Animated beam with smoother transitions */}
                <motion.div
                  className="absolute w-full h-40 rounded-full bg-blue-400/20 dark:bg-blue-500/20 blur-3xl pointer-events-none z-0"
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
                      <ShinyText
                        text="Thinking..."
                        disabled={false}
                        speed={3}
                        className="custom-class"
                      />
                    )}

                    {/* <div className="flex items-center gap-2">
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
                    </div> */}
                  </div>

                  <div className="relative">
                    <form
                      onSubmit={
                        user
                          ? handleSubmit
                          : () => {
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
                                : (placeholders?.[0] ??
                                    "Tell your AI Designer what to create...") +
                                  "✦"
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
                            aria-describedby={
                              inputError ? "input-error" : undefined
                            }
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
                        <Loader className="w-5 h-5 animate-spin" />
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
                                <Loader className="w-5 h-5 animate-spin" />
                              ) : (
                                "Create"
                              )}
                            </span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </DrawerContent>
        </Drawer>
      )}
    </motion.div>
  );
}

const AgentHeader = ({
  image,
  disabled = false,
}: {
  image: string;
  disabled?: boolean;
}) => (
  <div
    className={cn(
      "flex flex-1 w-full h-[200px] rounded-xl bg-cover bg-center",
      disabled && "opacity-60"
    )}
    style={{ backgroundImage: `url(${image})` }}
  ></div>
);
