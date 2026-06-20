"use client";
import { AIThinkingContent } from "../chat/messages";
import ShinyText from "../ui/shiny-text";
import AnimatedTooltipPreview from "./homeAgentsTooltip";
import { HomeInfoGrid } from "./homeInfoGrid";
import { PricingDialog } from "@/components/common/pricing-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useProjectDesign } from "@/context/DesignProject";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { apiResponse } from "@/utils/apiResponse";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  Image as ImageIcon,
  Loader,
  MessageSquare,
  Mic,
  PaperclipIcon,
  Pencil,
  Sparkles,
  TrendingUp,
  User,
  Users,
  X,
  XIcon,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import React, { useEffect, useMemo, useState } from "react";
import { useCallback, useRef } from "react";

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
  const [limit, setLimit] = useState(20);
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

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      setNewError(null);

      try {
        const res = await apiResponse.get("/templates?limit=50", {
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

  // Input validation (same rules as idea-section)
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
      const maxFileSize = 50 * 1024 * 1024; // 10MB
      const maxFiles = 10;
      const allowedTypes = ["image/*"];

      if (attachedFiles.length + files.length > maxFiles) {
        setInputError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const validFiles = files.filter((file) => {
        if (file.size > maxFileSize) {
          setInputError(`${file.name} is too large (max 50MB)`);
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

      // Prevent submitting with no content new
      if (!inputValue.trim() && attachedFiles.length === 0) {
        setInputError("provide a prompt or attach at least one file.");
        return;
      }

      setIsSubmitting(true);
      setInputError(null);

      try {
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

  const hasEnoughCredits = (user?.creditsRemaining ?? 0) > 10;

  const isSubmitDisabled =
    isGenerating ||
    isSubmitting ||
    (!inputValue.trim() && attachedFiles.length === 0) ||
    !hasEnoughCredits;

  const Header = (
    <div className='mt-8 mb-4 flex items-center justify-between'>
      <h2 className='text-foreground text-base font-semibold'>Inspirations</h2>
      <button
        className='text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm'
        onClick={() => router.push("/community")}
      >
        View all
        <ArrowRight className='h-4 w-4' />
      </button>
    </div>
  );

  return (
    <motion.div
      className='mt-8 mb-20 px-4 md:px-6 lg:px-8'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      {Header}
      <div className='columns-2 gap-4 [column-fill:_balance] md:columns-4'>
        {isLoading && templates.length === 0 && (
          <>
            {[220, 280, 200, 260, 240, 300, 210, 250, 230, 270, 190, 310].map(
              (h, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className='mb-4 inline-block w-full align-top'
                  style={{ breakInside: "avoid" }}
                >
                  <Skeleton
                    className='bg-muted/70 w-full rounded-lg'
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
            className='group border-border relative mb-4 inline-block w-full rounded-lg border align-top'
            style={{ breakInside: "avoid" }}
          >
            <div className='relative'>
              <img
                className='h-auto max-w-full rounded-lg object-cover'
                src={t.src}
                alt={t.alt || "Template"}
              />
              {t.category && (
                <Badge
                  variant='secondary'
                  className='pointer-events-none absolute top-2 left-2 z-10 text-xs'
                >
                  {t.category
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Badge>
              )}
              <div className='pointer-events-none absolute inset-0 rounded-lg bg-black/0 opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100' />
              {/* Creator Info at Bottom */}
              {t.isUserGenerated && (t.userId || t.author) && (
                <div className='pointer-events-auto absolute right-0 bottom-0 left-0 z-10 rounded-b-lg bg-gradient-to-t from-black/80 via-black/60 to-transparent p-2 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100'>
                  <Link
                    href={`/creator/${t.userId?.username || t.author || ""}`}
                    onClick={(e) => e.stopPropagation()}
                    className='flex w-fit items-center gap-2 transition-opacity hover:opacity-80'
                  >
                    {t.userId?.profilePic ? (
                      <img
                        src={t.userId.profilePic}
                        alt={t.userId.username || t.author || "Creator"}
                        className='h-5 w-5 rounded-full object-cover'
                      />
                    ) : (
                      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700'>
                        <User className='h-3 w-3 text-neutral-600 dark:text-neutral-400' />
                      </div>
                    )}
                    <span className='text-xs font-medium text-white/80'>
                      {t.userId?.username || t.author || "Creator"}
                    </span>
                    {t.userId?.isVerified && (
                      <svg
                        viewBox='0 0 22 22'
                        aria-label='Verified account'
                        role='img'
                        className='h-3.5 w-3.5 flex-shrink-0'
                        data-testid='icon-verified'
                        fill='#3b82f6'
                      >
                        <g>
                          <path d='M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z' />
                        </g>
                      </svg>
                    )}
                  </Link>
                </div>
              )}
              <div className='absolute inset-0 flex items-center justify-center gap-2 opacity-100 transition-opacity group-hover:opacity-100 lg:opacity-0'>
                <Button
                  size='icon'
                  variant='secondary'
                  onClick={() => onView(t)}
                  className='pointer-events-auto h-9 w-9 rounded-full p-0'
                  aria-label='View template'
                >
                  <Eye className='h-4 w-4' />
                </Button>
                <Button
                  size='icon'
                  onClick={() => onEdit(t)}
                  className='pointer-events-auto h-9 w-9 rounded-full p-0'
                  aria-label='Edit template'
                >
                  <Pencil className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview UI: Dialog on desktop, Drawer on mobile */}
      {selected && !isMobile && (
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className='flex h-fit w-fit flex-col p-0'>
            <div className='m-0 p-0'>
              <img
                src={selected.src}
                alt={selected.alt || "Template"}
                className='h-[50vh] w-full rounded-md object-contain'
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {selected && isMobile && (
        <Drawer open={viewOpen} onOpenChange={setViewOpen}>
          <DrawerContent className='h-[75vh]'>
            <DialogHeader className='border-b px-4 py-2'>
              <DialogTitle>Preview</DialogTitle>
            </DialogHeader>
            <div className='h-[63%] flex-shrink-0 overflow-hidden border-b'>
              <img
                src={selected.src}
                alt={selected.alt || "Template"}
                className='h-full w-full rounded-md object-contain'
              />
            </div>
            <motion.div
              className='relative flex min-h-0 w-full flex-1 flex-col overflow-hidden pb-0'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* File Attachments */}
              {attachedFiles.length > 0 && (
                <div className='custom-scrollbar-horizontal mb-3 flex flex-shrink-0 flex-wrap gap-2'>
                  {attachedFiles.map((file: any, index: number) => {
                    const fileKey = file.fileKey || `${file.name}-${index}`;
                    return (
                      <div
                        key={fileKey}
                        className='group bg-muted-foreground/5 border-border hover:bg-background/50 relative flex max-w-[200px] items-center gap-2 rounded-lg border p-2 transition-colors'
                      >
                        <div className='bg-background border-border relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded border'>
                          {file.type && file.type.startsWith("image/") ? (
                            <img
                              src={
                                URL.createObjectURL(file) || "/placeholder.svg"
                              }
                              alt={file.name}
                              className='h-full w-full rounded object-cover'
                              onLoad={(e) =>
                                URL.revokeObjectURL(
                                  (e.target as HTMLImageElement).src
                                )
                              }
                            />
                          ) : file.type && file.type.startsWith("video/") ? (
                            <div className='text-muted-foreground grid h-full w-full place-items-center text-[10px]'>
                              🎬
                            </div>
                          ) : (
                            <svg
                              className='text-muted-foreground h-4 w-4'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                              />
                            </svg>
                          )}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='text-foreground truncate text-xs font-medium'>
                            {file.name && file.name.length > 15
                              ? `${file.name.substring(0, 15)}...`
                              : file.name || "Unknown file"}
                          </p>
                          <p className='text-muted-foreground text-xs'>
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleFileRemove(index)}
                          className='bg-muted-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500'
                          disabled={isGenerating}
                          aria-label={`Remove ${file.name}`}
                        >
                          &times;
                        </button>
                        {file.type && file.type.startsWith("image/") && (
                          <div className='pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform opacity-0 transition-opacity group-hover:opacity-100'>
                            <div className='bg-background border-border rounded-lg border p-2 shadow-lg'>
                              <img
                                src={
                                  URL.createObjectURL(file) ||
                                  "/placeholder.svg"
                                }
                                alt={file.name}
                                className='max-h-[150px] max-w-[200px] rounded object-contain'
                                onLoad={(e) =>
                                  URL.revokeObjectURL(
                                    (e.target as HTMLImageElement).src
                                  )
                                }
                              />
                              <div className='text-muted-foreground mt-1 text-center text-xs'>
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
                className="before:bg-radial-gradient relative flex h-full min-h-0 w-full flex-1 overflow-hidden rounded-2xl p-[1.5px] shadow-lg before:absolute before:top-[-10px] before:left-[-10px] before:h-[30px] before:blur-[1px] before:content-[''] md:before:w-[40vh]"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {/* Animated beam with smoother transitions */}
                <motion.div
                  className='pointer-events-none absolute z-0 h-40 w-full rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/20'
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
                <div className='z-10 flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[15px] bg-white/90 shadow-inner backdrop-blur-sm dark:bg-black/80'>
                  <div className='mx-4 flex flex-shrink-0 items-center justify-between text-sm'>
                    {!isGenerating && (
                      <div className='flex w-full items-center justify-between gap-3'>
                        <div className='text-muted-foreground flex items-center dark:text-zinc-400'>
                          <Zap className='mr-2 inline-block h-3 w-3 text-emerald-500' />
                          {user ? (
                            `${(user?.creditsRemaining ?? 0).toLocaleString()} Credits left`
                          ) : (
                            <span className='text-muted-foreground ml-2 text-xs'>
                              Get started for free
                            </span>
                          )}
                        </div>

                        {user && (user?.creditsRemaining ?? 0) === 0 && (
                          <div>
                            {(user?.userPlan as any) === "Basic" ? (
                              <span
                                className='cursor-pointer text-sm font-medium hover:underline'
                                onClick={() => router.push("/pricing")}
                              >
                                Upgrade
                              </span>
                            ) : (
                              <span
                                className='cursor-pointer text-sm font-medium hover:underline'
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
                        text='Thinking...'
                        disabled={false}
                        speed={3}
                        className='custom-class'
                      />
                    )}
                  </div>

                  <div className='relative flex min-h-0 flex-1 flex-col px-4 pb-4'>
                    <form
                      onSubmit={
                        user
                          ? handleSubmit
                          : (e) => {
                              e.preventDefault();
                              router.push("/signin");
                            }
                      }
                      className='relative flex min-h-0 flex-1 flex-col'
                    >
                      <div className='bg-muted-foreground/5 border-border flex min-h-0 flex-1 flex-col gap-3 rounded-xl border p-3 shadow-sm transition-all duration-200 focus-within:ring-1 focus:ring-transparent'>
                        <div className='relative min-h-0 flex-1 overflow-y-auto'>
                          <textarea
                            ref={textareaRef}
                            id='chat_bot'
                            name='chat_bot'
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
                            className='scrollbar-thumb-rounded w-full resize-none scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent overflow-y-auto rounded-2xl border-none bg-transparent p-2 font-sans text-base font-normal text-gray-800 outline-none placeholder:text-gray-500 placeholder:transition-all placeholder:duration-300 hover:scrollbar-thumb-gray-400 focus:placeholder:text-gray-400 md:p-4 dark:scrollbar-thumb-[#888] dark:text-white dark:placeholder:text-gray-400 dark:hover:scrollbar-thumb-[#555] dark:focus:placeholder:text-[#363636]'
                            aria-label='Enter your prompt'
                            aria-describedby={
                              inputError ? "input-error" : undefined
                            }
                          />
                        </div>

                        <div className='flex flex-shrink-0 items-center justify-between gap-2 pt-2'>
                          <div className='flex gap-2'>
                            <button
                              type='button'
                              className='border-border flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border bg-transparent text-gray-500 transition-all duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-white/10'
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isGenerating || isSubmitting}
                              aria-label='Attach files'
                            >
                              <PaperclipIcon className='h-4 w-4' />
                            </button>
                            <Input
                              ref={fileInputRef}
                              type='file'
                              multiple
                              onChange={handleFileInputChange}
                              disabled={isGenerating || isSubmitting}
                              className='hidden'
                              id='file-upload'
                              accept='image/*,.pdf,.txt,.md,.js,.jsx,.ts,.tsx,.css,.html,.json,.xml,.yaml,.yml'
                              aria-label='Select files to upload'
                            />
                          </div>
                          <button
                            type='submit'
                            disabled={isSubmitDisabled}
                            className={`relative inline-flex h-9 overflow-hidden rounded-full p-[1px] transition-opacity focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none ${
                              isSubmitDisabled
                                ? "cursor-not-allowed opacity-50"
                                : "hover:opacity-90"
                            }`}
                          >
                            <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
                            <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-1 text-sm font-medium text-white backdrop-blur-3xl dark:bg-slate-50 dark:text-slate-950'>
                              {isGenerating || isSubmitting ? (
                                <Loader className='h-4 w-4 animate-spin' />
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

      {/* Edit modal/drawer showing item and sticky action */}
      {selected && !isMobile && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className='flex h-[80vh] max-w-3xl flex-col overflow-hidden p-0'>
            <DialogHeader className='flex-shrink-0 border-b px-4 py-3'>
              <DialogTitle>Recreate</DialogTitle>
            </DialogHeader>

            <div className='h-[63%] flex-shrink-0 overflow-hidden'>
              <img
                src={selected.src}
                alt={selected.alt || "Template"}
                className='h-full w-full rounded-md object-contain'
              />
            </div>
            <motion.div
              className='relative flex min-h-0 w-full flex-1 flex-col overflow-hidden pb-0'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* File Attachments */}
              {attachedFiles.length > 0 && (
                <div className='custom-scrollbar-horizontal mb-3 flex flex-shrink-0 flex-wrap gap-2'>
                  {attachedFiles.map((file: any, index: number) => {
                    const fileKey = file.fileKey || `${file.name}-${index}`;
                    return (
                      <div
                        key={fileKey}
                        className='group bg-muted-foreground/5 border-border hover:bg-background/50 relative flex max-w-[200px] items-center gap-2 rounded-lg border p-2 transition-colors'
                      >
                        <div className='bg-background border-border relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded border'>
                          {file.type && file.type.startsWith("image/") ? (
                            <img
                              src={
                                URL.createObjectURL(file) || "/placeholder.svg"
                              }
                              alt={file.name}
                              className='h-full w-full rounded object-cover'
                              onLoad={(e) =>
                                URL.revokeObjectURL(
                                  (e.target as HTMLImageElement).src
                                )
                              }
                            />
                          ) : file.type && file.type.startsWith("video/") ? (
                            <div className='text-muted-foreground grid h-full w-full place-items-center text-[10px]'>
                              🎬
                            </div>
                          ) : (
                            <svg
                              className='text-muted-foreground h-4 w-4'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                              />
                            </svg>
                          )}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='text-foreground truncate text-xs font-medium'>
                            {file.name && file.name.length > 15
                              ? `${file.name.substring(0, 15)}...`
                              : file.name || "Unknown file"}
                          </p>
                          <p className='text-muted-foreground text-xs'>
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleFileRemove(index)}
                          className='bg-muted-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500'
                          disabled={isGenerating}
                          aria-label={`Remove ${file.name}`}
                        >
                          &times;
                        </button>
                        {file.type && file.type.startsWith("image/") && (
                          <div className='pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform opacity-0 transition-opacity group-hover:opacity-100'>
                            <div className='bg-background border-border rounded-lg border p-2 shadow-lg'>
                              <img
                                src={
                                  URL.createObjectURL(file) ||
                                  "/placeholder.svg"
                                }
                                alt={file.name}
                                className='max-h-[150px] max-w-[200px] rounded object-contain'
                                onLoad={(e) =>
                                  URL.revokeObjectURL(
                                    (e.target as HTMLImageElement).src
                                  )
                                }
                              />
                              <div className='text-muted-foreground mt-1 text-center text-xs'>
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
                className="before:bg-radial-gradient relative flex h-full min-h-0 w-full flex-1 overflow-hidden rounded-2xl p-[1.5px] shadow-lg before:absolute before:top-[-10px] before:left-[-10px] before:h-[30px] before:blur-[1px] before:content-[''] md:before:w-[40vh]"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {/* Animated beam with smoother transitions */}
                <motion.div
                  className='pointer-events-none absolute z-0 h-40 w-full rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/20'
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
                <div className='z-10 flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[15px] bg-white/90 shadow-inner backdrop-blur-sm dark:bg-black/80'>
                  <div className='mx-4 flex flex-shrink-0 items-center justify-between text-sm'>
                    {!isGenerating && (
                      <div className='flex w-full items-center justify-between gap-3'>
                        <div className='text-muted-foreground flex items-center dark:text-zinc-400'>
                          <Zap className='mr-2 inline-block h-3 w-3 text-emerald-500' />
                          {user ? (
                            `${(user?.creditsRemaining ?? 0).toLocaleString()} Credits left`
                          ) : (
                            <span className='text-muted-foreground ml-2 text-xs'>
                              Get started for free
                            </span>
                          )}
                        </div>

                        {user && (user?.creditsRemaining ?? 0) === 0 && (
                          <div>
                            {(user?.userPlan as any) === "Basic" ? (
                              <span
                                className='cursor-pointer text-sm font-medium hover:underline'
                                onClick={() => router.push("/pricing")}
                              >
                                Upgrade
                              </span>
                            ) : (
                              <span
                                className='cursor-pointer text-sm font-medium hover:underline'
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
                        text='Thinking...'
                        disabled={false}
                        speed={3}
                        className='custom-class'
                      />
                    )}
                  </div>

                  <div className='relative flex min-h-0 flex-1 flex-col px-4 pb-4'>
                    <form
                      onSubmit={
                        user
                          ? handleSubmit
                          : (e) => {
                              e.preventDefault();
                              router.push("/signin");
                            }
                      }
                      className='relative flex min-h-0 flex-1 flex-col'
                    >
                      <div className='bg-muted-foreground/5 border-border flex min-h-0 flex-1 flex-col gap-3 rounded-xl border p-3 shadow-sm transition-all duration-200 focus-within:ring-1 focus:ring-transparent'>
                        <div className='relative min-h-0 flex-1 overflow-y-auto'>
                          <textarea
                            ref={textareaRef}
                            id='chat_bot'
                            name='chat_bot'
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
                            className='scrollbar-thumb-rounded w-full resize-none scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent overflow-y-auto rounded-2xl border-none bg-transparent p-2 font-sans text-base font-normal text-gray-800 outline-none placeholder:text-gray-500 placeholder:transition-all placeholder:duration-300 hover:scrollbar-thumb-gray-400 focus:placeholder:text-gray-400 md:p-4 dark:scrollbar-thumb-[#888] dark:text-white dark:placeholder:text-gray-400 dark:hover:scrollbar-thumb-[#555] dark:focus:placeholder:text-[#363636]'
                            aria-label='Enter your prompt'
                            aria-describedby={
                              inputError ? "input-error" : undefined
                            }
                          />
                        </div>

                        <div className='flex flex-shrink-0 items-center justify-between gap-2 pt-2'>
                          <div className='flex gap-2'>
                            <button
                              type='button'
                              className='border-border flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border bg-transparent text-gray-500 transition-all duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-white/10'
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isGenerating || isSubmitting}
                              aria-label='Attach files'
                            >
                              <PaperclipIcon className='h-4 w-4' />
                            </button>
                            <Input
                              ref={fileInputRef}
                              type='file'
                              multiple
                              onChange={handleFileInputChange}
                              disabled={isGenerating || isSubmitting}
                              className='hidden'
                              id='file-upload'
                              accept='image/*,.pdf,.txt,.md,.js,.jsx,.ts,.tsx,.css,.html,.json,.xml,.yaml,.yml'
                              aria-label='Select files to upload'
                            />
                          </div>
                          <button
                            type='submit'
                            disabled={isSubmitDisabled}
                            className={`relative inline-flex h-9 overflow-hidden rounded-full p-[1px] transition-opacity focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none ${
                              isSubmitDisabled
                                ? "cursor-not-allowed opacity-50"
                                : "hover:opacity-90"
                            }`}
                          >
                            <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
                            <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-1 text-sm font-medium text-white backdrop-blur-3xl dark:bg-slate-50 dark:text-slate-950'>
                              {isGenerating || isSubmitting ? (
                                <Loader className='h-4 w-4 animate-spin' />
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
          <DrawerContent className='flex h-[85vh] flex-col overflow-hidden'>
            <DrawerHeader className='flex-shrink-0'>
              <DrawerTitle>Recreate</DrawerTitle>
            </DrawerHeader>
            <div className='h-[63%] flex-shrink-0 overflow-hidden border-b'>
              <img
                src={selected.src}
                alt={selected.alt || "Template"}
                className='h-full w-full rounded-md object-contain'
              />
            </div>
            <motion.div
              className='relative flex min-h-0 w-full flex-1 flex-col overflow-hidden pb-0'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* File Attachments */}
              {attachedFiles.length > 0 && (
                <div className='custom-scrollbar-horizontal mb-3 flex flex-shrink-0 flex-wrap gap-2'>
                  {attachedFiles.map((file: any, index: number) => {
                    const fileKey = file.fileKey || `${file.name}-${index}`;
                    return (
                      <div
                        key={fileKey}
                        className='group bg-muted-foreground/5 border-border hover:bg-background/50 relative flex max-w-[200px] items-center gap-2 rounded-lg border p-2 transition-colors'
                      >
                        <div className='bg-background border-border relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded border'>
                          {file.type && file.type.startsWith("image/") ? (
                            <img
                              src={
                                URL.createObjectURL(file) || "/placeholder.svg"
                              }
                              alt={file.name}
                              className='h-full w-full rounded object-cover'
                              onLoad={(e) =>
                                URL.revokeObjectURL(
                                  (e.target as HTMLImageElement).src
                                )
                              }
                            />
                          ) : file.type && file.type.startsWith("video/") ? (
                            <div className='text-muted-foreground grid h-full w-full place-items-center text-[10px]'>
                              🎬
                            </div>
                          ) : (
                            <svg
                              className='text-muted-foreground h-4 w-4'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                              />
                            </svg>
                          )}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='text-foreground truncate text-xs font-medium'>
                            {file.name && file.name.length > 15
                              ? `${file.name.substring(0, 15)}...`
                              : file.name || "Unknown file"}
                          </p>
                          <p className='text-muted-foreground text-xs'>
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleFileRemove(index)}
                          className='bg-muted-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500'
                          disabled={isGenerating}
                          aria-label={`Remove ${file.name}`}
                        >
                          &times;
                        </button>
                        {file.type && file.type.startsWith("image/") && (
                          <div className='pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform opacity-0 transition-opacity group-hover:opacity-100'>
                            <div className='bg-background border-border rounded-lg border p-2 shadow-lg'>
                              <img
                                src={
                                  URL.createObjectURL(file) ||
                                  "/placeholder.svg"
                                }
                                alt={file.name}
                                className='max-h-[150px] max-w-[200px] rounded object-contain'
                                onLoad={(e) =>
                                  URL.revokeObjectURL(
                                    (e.target as HTMLImageElement).src
                                  )
                                }
                              />
                              <div className='text-muted-foreground mt-1 text-center text-xs'>
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
                className="before:bg-radial-gradient relative flex h-full min-h-0 w-full flex-1 overflow-hidden rounded-2xl p-[1.5px] shadow-lg before:absolute before:top-[-10px] before:left-[-10px] before:h-[30px] before:blur-[1px] before:content-[''] md:before:w-[40vh]"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {/* Animated beam with smoother transitions */}
                <motion.div
                  className='pointer-events-none absolute z-0 h-40 w-full rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/20'
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
                <div className='z-10 flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[15px] bg-white/90 shadow-inner backdrop-blur-sm dark:bg-black/80'>
                  <div className='mx-4 flex flex-shrink-0 items-center justify-between text-sm'>
                    {!isGenerating && (
                      <div className='flex w-full items-center justify-between gap-3'>
                        <div className='text-muted-foreground flex items-center dark:text-zinc-400'>
                          <Zap className='mr-2 inline-block h-3 w-3 text-emerald-500' />
                          {user ? (
                            `${(user?.creditsRemaining ?? 0).toLocaleString()} Credits left`
                          ) : (
                            <span className='text-muted-foreground ml-2 text-xs'>
                              Get started for free
                            </span>
                          )}
                        </div>

                        {user && (user?.creditsRemaining ?? 0) === 0 && (
                          <div>
                            {(user?.userPlan as any) === "Basic" ? (
                              <span
                                className='cursor-pointer text-sm font-medium hover:underline'
                                onClick={() => router.push("/pricing")}
                              >
                                Upgrade
                              </span>
                            ) : (
                              <span
                                className='cursor-pointer text-sm font-medium hover:underline'
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
                        text='Thinking...'
                        disabled={false}
                        speed={3}
                        className='custom-class'
                      />
                    )}
                  </div>

                  <div className='relative flex min-h-0 flex-1 flex-col px-4 pb-4'>
                    <form
                      onSubmit={
                        user
                          ? handleSubmit
                          : (e) => {
                              e.preventDefault();
                              router.push("/signin");
                            }
                      }
                      className='relative flex min-h-0 flex-1 flex-col'
                    >
                      <div className='bg-muted-foreground/5 border-border flex min-h-0 flex-1 flex-col gap-3 rounded-xl border p-3 shadow-sm transition-all duration-200 focus-within:ring-1 focus:ring-transparent'>
                        <div className='relative min-h-0 flex-1 overflow-y-auto'>
                          <textarea
                            ref={textareaRef}
                            id='chat_bot'
                            name='chat_bot'
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
                            className='scrollbar-thumb-rounded w-full resize-none scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent overflow-y-auto rounded-2xl border-none bg-transparent p-2 font-sans text-base font-normal text-gray-800 outline-none placeholder:text-gray-500 placeholder:transition-all placeholder:duration-300 hover:scrollbar-thumb-gray-400 focus:placeholder:text-gray-400 md:p-4 dark:scrollbar-thumb-[#888] dark:text-white dark:placeholder:text-gray-400 dark:hover:scrollbar-thumb-[#555] dark:focus:placeholder:text-[#363636]'
                            aria-label='Enter your prompt'
                            aria-describedby={
                              inputError ? "input-error" : undefined
                            }
                          />
                        </div>

                        <div className='flex flex-shrink-0 items-center justify-between gap-2 pt-2'>
                          <div className='flex gap-2'>
                            <button
                              type='button'
                              className='border-border flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border bg-transparent text-gray-500 transition-all duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-white/10'
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isGenerating || isSubmitting}
                              aria-label='Attach files'
                            >
                              <PaperclipIcon className='h-4 w-4' />
                            </button>
                            <Input
                              ref={fileInputRef}
                              type='file'
                              multiple
                              onChange={handleFileInputChange}
                              disabled={isGenerating || isSubmitting}
                              className='hidden'
                              id='file-upload'
                              accept='image/*,.pdf,.txt,.md,.js,.jsx,.ts,.tsx,.css,.html,.json,.xml,.yaml,.yml'
                              aria-label='Select files to upload'
                            />
                          </div>
                          <button
                            type='submit'
                            disabled={isSubmitDisabled}
                            className={`relative inline-flex h-9 overflow-hidden rounded-full p-[1px] transition-opacity focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none ${
                              isSubmitDisabled
                                ? "cursor-not-allowed opacity-50"
                                : "hover:opacity-90"
                            }`}
                          >
                            <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
                            <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-1 text-sm font-medium text-white backdrop-blur-3xl dark:bg-slate-50 dark:text-slate-950'>
                              {isGenerating || isSubmitting ? (
                                <Loader className='h-4 w-4 animate-spin' />
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
      "flex h-[200px] w-full flex-1 rounded-xl bg-cover bg-center",
      disabled && "opacity-60"
    )}
    style={{ backgroundImage: `url(${image})` }}
  ></div>
);
