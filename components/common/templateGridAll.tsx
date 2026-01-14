"use client";

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
  User,
} from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useRouter, useSearchParams } from "next/navigation";
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
import CategoryAndSearch from "@/components/common/category-and-search";
import { useProjectDesign } from "@/context/DesignProject";
import { Skeleton } from "@/components/ui/skeleton";
import { AIThinkingContent } from "../chat/messages";
import { toast } from "sonner";

type TemplateItem = {
  id: string;
  src: string;
  alt?: string;
  category?: string;
  userId?: {
    _id?: string;
    username?: string;
    email?: string;
    profilePic?: string;
    isVerified?: boolean;
  };
  author?: string;
  isUserGenerated?: boolean;
};

type ImageDesignType =
  | "logo"
  | "flier"
  | "poster"
  | "youtube_thumbnail"
  | "instagram_post"
  | "generic_design"
  | "banner"
  | "facebook_post"
  | "facebook_cover";

export default function TemplateGridAll() {
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
  const [limit, setLimit] = useState(20);
  // Pagination & search
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchParams = useSearchParams();
  const [pins, setPins] = useState([]);

  const [designType, setDesigntype] = useState<ImageDesignType[]>([
    "logo",
    "flier",
    "poster",
    "youtube_thumbnail",
    // "instagram_post",
    // "generic_design",
    "banner",
    // "facebook_post",
    // "facebook_cover",
  ]);

  const fetchPins = async () => {
    setLoading(true);
    setNewError(null);

    try {
      const randomDesignType =
        designType[Math.floor(Math.random() * designType.length)];

      // 👇 Fetch from your Express backend with randomized query and category
      const res = await apiResponse.get(
        `/templates/scrape/pins/search?q=${encodeURIComponent(randomDesignType)}&limit=12&category=${randomDesignType}`,
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

  // useEffect(() => {
  //   fetchPins();
  // }, []);

  // Fetch a page of templates
  const fetchTemplatesPage = useCallback(
    async (pageToFetch: number, currentSearch: string, append: boolean) => {
      if (append) {
        setIsFetchingMore(true);
      } else {
        setIsLoading(true);
      }
      setNewError(null);

      try {
        const params = new URLSearchParams();
        params.set("limit", "30");
        params.set("page", String(pageToFetch));
        if (currentSearch && currentSearch.trim().length > 0) {
          params.set("search", currentSearch.trim());
        }

        const res = await apiResponse.get(`/templates?${params.toString()}`, {
          withCredentials: true,
        });

        const data = res.data;

        if (data.success && data.data?.templates) {
          const mapped: TemplateItem[] = data.data.templates.map(
            (template: any) => ({
              id: template._id || template.assetId,
              src: template.mediaUrl,
              alt: template.alt || template.title || "Template",
              category: template.category,
              userId: template.userId
                ? {
                    ...template.userId,
                    profilePic:
                      template.userId.profilePic || template.userId.userdp,
                  }
                : undefined,
              author: template.author,
              isUserGenerated: template.isUserGenerated,
            })
          );

          if (append) {
            setTemplates((prev) =>
              mapped.length ? [...prev, ...mapped] : prev
            );
          } else {
            setTemplates(mapped.length > 0 ? mapped : []);
          }

          // pagination flags
          setHasNextPage(Boolean(data.data?.pagination?.hasNextPage));
        } else {
          if (!append) setTemplates([]);
          setHasNextPage(false);
        }
      } catch (err: any) {
        console.error("Failed to fetch inspirations:", err);
        setNewError(err.message || "Failed to load inspirations.");
        if (!append) setTemplates([]);
        setHasNextPage(false);
      } finally {
        if (append) {
          setIsFetchingMore(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [apiResponse]
  );

  // Initial and when search changes
  useEffect(() => {
    setPage(1);
    fetchTemplatesPage(1, searchTerm, false);
  }, [searchTerm, fetchTemplatesPage]);

  // Load more when page increments
  useEffect(() => {
    if (page === 1) return;
    fetchTemplatesPage(page, searchTerm, true);
  }, [page, searchTerm, fetchTemplatesPage]);

  // Infinite scroll observer
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const el = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          hasNextPage &&
          !isFetchingMore &&
          !isLoading
        ) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [hasNextPage, isFetchingMore, isLoading]);

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
    if (value.trim().length > 5000) {
      return "Prompt is too long (maximum 5000 characters)";
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
      const allowedTypes = ["image/*", "video/*"];

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

      // Check if user is authenticated
      if (!user) {
        router.push("/signin");
        return;
      }

      // Check for low credits
      const creditsRemaining = user?.creditsRemaining ?? 0;
      if (creditsRemaining <= 10) {
        const isBasic = String(user?.userPlan) === "Basic";
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

      const validationError = validateInput(inputValue, attachedFiles);
      if (validationError) {
        setInputError(validationError);
        return;
      }

      if (isGenerating || isSubmitting) return;

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
          error.message || "Failed to create project. Please try again."
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

  const hasEnoughCredits = (user?.creditsRemaining ?? 0) > 10;

  const isSubmitDisabled =
    isGenerating ||
    isSubmitting ||
    (!inputValue.trim() && attachedFiles.length === 0) ||
    !hasEnoughCredits;

  // Sync search term from URL (?q= or ?search=)
  useEffect(() => {
    const q = searchParams?.get("q") || searchParams?.get("search") || "";
    setSearchTerm(q);
  }, [searchParams]);

  return (
    <motion.div
      className="mt-2 mb-20 px-4 md:px-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      {/* <div className="mt-4 mb-4 flex flex-row items-center">
        <CategoryAndSearch />
      </div> */}
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
            className="group relative mb-4 inline-block w-full align-top border border-border rounded-lg"
            style={{ breakInside: "avoid" }}
          >
            <div className="relative">
              <img
                className="h-auto max-w-full rounded-lg object-cover"
                src={t.src}
                alt={t.alt || "Template"}
              />
              {t.category && (
                <Badge
                  variant="secondary"
                  className="absolute top-2 left-2 text-xs pointer-events-none z-10 hidden lg:block"
                >
                  {t.category
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Badge>
              )}
              <div className="pointer-events-none absolute inset-0 rounded-lg bg-black/0 opacity-0 transition-opacity group-hover:opacity-100 group-hover:bg-black/30" />
              {/* Creator Info at Bottom */}
              {t.isUserGenerated && (t.userId || t.author) && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 via-black/60 to-transparent rounded-b-lg opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity pointer-events-auto z-10 hidden lg:block">
                  <Link
                    href={`/creator/${t.userId?.username || t.author || ""}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit"
                  >
                    {t.userId?.profilePic ? (
                      <img
                        src={t.userId.profilePic}
                        alt={t.userId.username || t.author || "Creator"}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                        <User className="w-3 h-3 text-neutral-600 dark:text-neutral-400" />
                      </div>
                    )}
                    <span className="text-xs text-white/80 font-medium">
                      {t.userId?.username || t.author || "Creator"}
                    </span>
                    {t.userId?.isVerified && (
                      <svg
                        viewBox="0 0 22 22"
                        aria-label="Verified account"
                        role="img"
                        className="w-3.5 h-3.5 flex-shrink-0"
                        data-testid="icon-verified"
                        fill="#3b82f6"
                      >
                        <g>
                          <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                        </g>
                      </svg>
                    )}
                  </Link>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-100 lg:opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="icon"
                  onClick={() => onEdit(t)}
                  className="pointer-events-auto rounded-full h-9 w-9 p-0 bg-white/90 dark:bg-black/20 backdrop-blur-sm opacity-50"
                  aria-label="Edit template"
                >
                  <Pencil className="h-4 w-4 text-black dark:text-white" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {/* Sentinel for infinite scroll */}
        <div ref={loadMoreRef} className="col-span-full h-10"></div>
      </div>

      {isFetchingMore && (
        <div className="mt-4 flex justify-center">
          <Loader className="h-5 w-5 animate-spin" />
        </div>
      )}

      {/* Edit modal/drawer showing item and sticky action */}
      {selected && !isMobile && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-3xl h-[85vh] p-0 flex flex-col overflow-hidden">
            <DialogHeader className="px-4 py-3 border-b flex-shrink-0">
              <DialogTitle>Recreate</DialogTitle>
            </DialogHeader>
            <div
              className={cn(
                "flex-shrink-0 overflow-hidden h-auto max-h-[58%]",
                attachedFiles.length > 0 ? "h-[60%]" : "h-[63%]"
              )}
            >
              <img
                src={selected.src}
                alt={selected.alt || "Template"}
                className="w-full h-full object-contain rounded-md"
              />
            </div>
            <motion.div
              className="flex flex-col relative w-full flex-1 min-h-0 overflow-hidden pb-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* File Attachments */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 custom-scrollbar-horizontal flex-shrink-0">
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
                          className="absolute -top-1 -right-1 w-5 h-5 bg-muted-foreground hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
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
              <div
                ref={chatContainerRef}
                className="relative flex rounded-2xl p-[1.5px] overflow-hidden before:absolute before:content-[''] before:top-[-10px] before:left-[-10px] before:bg-radial-gradient md:before:w-[40vh] before:h-[30px] before:blur-[1px] w-full shadow-lg h-full flex-1 min-h-0"
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
                <div className="flex flex-col bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-[15px] w-full overflow-hidden z-10 shadow-inner h-full flex-1 min-h-0">
                  <div className="flex items-center mx-4 justify-between text-sm flex-shrink-0">
                    {!isGenerating && (
                      <div className="flex items-center gap-3 justify-between w-full">
                        <div className="text-muted-foreground dark:text-zinc-400 flex items-center">
                          <Zap className="inline-block w-3 h-3 text-emerald-500 mr-2" />
                          {user ? (
                            `${(user?.creditsRemaining ?? 0).toLocaleString()} Credits left`
                          ) : (
                            <span className="ml-2 text-xs text-muted-foreground">
                              Get a 20 free credit
                            </span>
                          )}
                        </div>

                        {user && (user?.creditsRemaining ?? 0) === 0 && (
                          <div>
                            {(user?.userPlan as any) === "Basic" ? (
                              <span
                                className="cursor-pointer text-sm font-medium hover:underline"
                                onClick={() => router.push("/pricing")}
                              >
                                Upgrade
                              </span>
                            ) : (
                              <span
                                className="cursor-pointer text-sm font-medium hover:underline"
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

                  <div className="relative flex-1 min-h-0 flex flex-col px-4 pb-4">
                    <form
                      onSubmit={
                        user
                          ? handleSubmit
                          : (e) => {
                              e.preventDefault();
                              router.push("/signin");
                            }
                      }
                      className="relative flex-1 min-h-0 flex flex-col"
                    >
                      <div className="flex flex-col gap-3 bg-muted-foreground/5 border border-border rounded-xl p-3 shadow-sm transition-all duration-200 focus-within:ring-1 focus:ring-transparent flex-1 min-h-0">
                        <div className="flex-1 relative min-h-0 overflow-y-auto">
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
                              minHeight: "60px",
                            }}
                            className="bg-transparent rounded-2xl border-none w-full text-gray-800 dark:text-white font-sans font-normal p-2 md:p-4 resize-none overflow-y-auto outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 placeholder:transition-all placeholder:duration-300 focus:placeholder:text-gray-400 dark:focus:placeholder:text-[#363636] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-[#888] scrollbar-thumb-rounded hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-[#555] text-base"
                            aria-label="Enter your prompt"
                            aria-describedby={
                              inputError ? "input-error" : undefined
                            }
                          />
                        </div>

                        <div className="flex justify-between items-center gap-2 flex-shrink-0 pt-2">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="flex items-center justify-center w-9 h-9 text-gray-500 dark:text-gray-400 bg-transparent rounded-full hover:bg-gray-100 dark:hover:bg-white/10 border border-border cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          <button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className={`relative inline-flex h-9 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 transition-opacity ${
                              isSubmitDisabled
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:opacity-90"
                            }`}
                          >
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 dark:bg-slate-50 px-4 py-1 text-sm font-medium text-white dark:text-slate-950 backdrop-blur-3xl">
                              {isGenerating || isSubmitting ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                "Recreate"
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
          <DrawerContent className="h-[85vh] flex flex-col overflow-hidden">
            <DrawerHeader className="flex-shrink-0">
              <DrawerTitle>Recreate</DrawerTitle>
            </DrawerHeader>
            <div
              className={cn(
                "flex-shrink-0 overflow-hidden h-auto max-h-[58%]",
                attachedFiles.length > 0 ? "h-[61%]" : "h-[63%]"
              )}
            >
              <img
                src={selected.src}
                alt={selected.alt || "Template"}
                className="w-full h-full object-contain rounded-md"
              />
            </div>
            <motion.div
              className="flex flex-col relative w-full flex-1 min-h-0 overflow-hidden pb-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* File Attachments */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 custom-scrollbar-horizontal flex-shrink-0">
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
                          className="absolute -top-1 -right-1 w-5 h-5 bg-muted-foreground hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
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
              <div
                ref={chatContainerRef}
                className="relative flex rounded-2xl p-[1.5px] overflow-hidden before:absolute before:content-[''] before:top-[-10px] before:left-[-10px] before:bg-radial-gradient md:before:w-[40vh] before:h-[30px] before:blur-[1px] w-full shadow-lg h-full flex-1 min-h-0"
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
                <div className="flex flex-col bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-[15px] w-full overflow-hidden z-10 shadow-inner h-full flex-1 min-h-0">
                  <div className="flex items-center mx-4 justify-between text-sm flex-shrink-0">
                    {!isGenerating && (
                      <div className="flex items-center gap-3 justify-between w-full">
                        <div className="text-muted-foreground dark:text-zinc-400 flex items-center">
                          <Zap className="inline-block w-3 h-3 text-emerald-500 mr-2" />
                          {user ? (
                            `${(user?.creditsRemaining ?? 0).toLocaleString()} Credits left`
                          ) : (
                            <span className="ml-2 text-xs text-muted-foreground">
                              Get a 20 free credit
                            </span>
                          )}
                        </div>

                        {user && (user?.creditsRemaining ?? 0) === 0 && (
                          <div>
                            {(user?.userPlan as any) === "Basic" ? (
                              <span
                                className="cursor-pointer text-sm font-medium hover:underline"
                                onClick={() => router.push("/pricing")}
                              >
                                Upgrade
                              </span>
                            ) : (
                              <span
                                className="cursor-pointer text-sm font-medium hover:underline"
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

                  <div className="relative flex-1 min-h-0 flex flex-col px-4 pb-4">
                    <form
                      onSubmit={
                        user
                          ? handleSubmit
                          : (e) => {
                              e.preventDefault();
                              router.push("/signin");
                            }
                      }
                      className="relative flex-1 min-h-0 flex flex-col"
                    >
                      <div className="flex flex-col gap-3 bg-muted-foreground/5 border border-border rounded-xl p-3 shadow-sm transition-all duration-200 focus-within:ring-1 focus:ring-transparent flex-1 min-h-0">
                        <div className="flex-1 relative min-h-0 overflow-y-auto">
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
                              minHeight: "60px",
                            }}
                            className="bg-transparent rounded-2xl border-none w-full text-gray-800 dark:text-white font-sans font-normal p-2 md:p-4 resize-none overflow-y-auto outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 placeholder:transition-all placeholder:duration-300 focus:placeholder:text-gray-400 dark:focus:placeholder:text-[#363636] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-[#888] scrollbar-thumb-rounded hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-[#555] text-base"
                            aria-label="Enter your prompt"
                            aria-describedby={
                              inputError ? "input-error" : undefined
                            }
                          />
                        </div>

                        <div className="flex justify-between items-center gap-2 flex-shrink-0 pt-2">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="flex items-center justify-center w-9 h-9 text-gray-500 dark:text-gray-400 bg-transparent rounded-full hover:bg-gray-100 dark:hover:bg-white/10 border border-border cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          <button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className={`relative inline-flex h-9 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 transition-opacity ${
                              isSubmitDisabled
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:opacity-90"
                            }`}
                          >
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 dark:bg-slate-50 px-4 py-1 text-sm font-medium text-white dark:text-slate-950 backdrop-blur-3xl">
                              {isGenerating || isSubmitting ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                "Recreate"
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
