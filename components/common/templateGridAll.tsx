"use client";

import { AIThinkingContent } from "../chat/messages";
import { BrandIdentityPanel } from "../chat/messages/brand-identity-panel";
import { BorderBeam } from "../ui/border-beam";
import ShinyText from "../ui/shiny-text";
import AnimatedTooltipPreview from "./homeAgentsTooltip";
import { HomeInfoGrid } from "./homeInfoGrid";
import CategoryAndSearch from "@/components/common/category-and-search";
import { PricingDialog } from "@/components/common/pricing-dialog";
import { LocalizedText } from "@/components/localized-text";
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
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { appendClientTimeContext, cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import Loading from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import { GradientFrame } from "@/utils/gradient-frame";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CircleFadingArrowUp,
  Eye,
  Image as ImageIcon,
  Loader,
  MessageSquare,
  Mic,
  Palette,
  PaperclipIcon,
  Pencil,
  Plus,
  TrendingUp,
  User,
  Users,
  WandSparklesIcon,
  X,
  XIcon,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  isPendingPublished?: boolean;
};

const keepPendingPublished = (
  current: TemplateItem[],
  fetched: TemplateItem[]
) => {
  const fetchedUrls = new Set(fetched.map((item) => item.src));
  return [
    ...current.filter(
      (item) => item.isPendingPublished && !fetchedUrls.has(item.src)
    ),
    ...fetched,
  ];
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
  const [isBrandSettingsOpen, setIsBrandSettingsOpen] = useState(false);
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
    // "poster",
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
        `/designinspirations/scrape/pins/search?q=${encodeURIComponent(randomDesignType)}&limit=12&category=${randomDesignType}`,
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
            setTemplates((prev) => {
              const existingIds = new Set(prev.map((t) => t.id));
              const uniqueNewItems = mapped.filter(
                (item) => !existingIds.has(item.id)
              );
              return uniqueNewItems.length
                ? [...prev, ...uniqueNewItems]
                : prev;
            });
          } else {
            setTemplates((prev) => keepPendingPublished(prev, mapped));
          }

          // pagination flags
          setHasNextPage(Boolean(data.data?.pagination?.hasNextPage));
        } else {
          if (!append) {
            setTemplates((prev) => keepPendingPublished(prev, []));
          }
          setHasNextPage(false);
        }
      } catch (err: any) {
        console.error("Failed to fetch inspirations:", err);
        setNewError(err.message || "Failed to load inspirations.");
        if (!append) {
          setTemplates((prev) => keepPendingPublished(prev, []));
        }
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

  // On mount: drain any templates published from other pages (e.g. chat) that
  // were written to localStorage before this component was mounted.
  useEffect(() => {
    const flushPending = () => {
      try {
        const raw = localStorage.getItem("gennit:pending_published_templates");
        if (!raw) return;
        const pending: TemplateItem[] = JSON.parse(raw);
        if (!Array.isArray(pending) || pending.length === 0) return;
        localStorage.removeItem("gennit:pending_published_templates");
        pending.forEach((template) => {
          if (!template?.src) return;
          setTemplates((prev) => {
            if (prev.some((item) => item.src === template.src)) return prev;
            return [{ ...template, isPendingPublished: true }, ...prev];
          });
        });
      } catch {
        // ignore JSON parse errors
      }
    };

    flushPending();
  }, []);

  useEffect(() => {
    const handlePublished = (event: Event) => {
      const template = (event as CustomEvent<{ template?: TemplateItem }>)
        .detail?.template;
      if (!template?.src) return;

      setTemplates((prev) => {
        if (prev.some((item) => item.src === template.src)) return prev;
        return [{ ...template, isPendingPublished: true }, ...prev];
      });
    };

    const handleUnpublished = (event: Event) => {
      const mediaUrl = (event as CustomEvent<{ mediaUrl?: string }>).detail
        ?.mediaUrl;
      if (!mediaUrl) return;

      setTemplates((prev) =>
        prev.filter((item) => item.src !== mediaUrl || !item.isUserGenerated)
      );
    };

    // Also handle cross-page publishes via the storage event (fires when
    // another tab/page writes to localStorage).
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== "gennit:pending_published_templates") return;
      if (!event.newValue) return;
      try {
        const pending: TemplateItem[] = JSON.parse(event.newValue);
        if (!Array.isArray(pending)) return;
        localStorage.removeItem("gennit:pending_published_templates");
        pending.forEach((template) => {
          if (!template?.src) return;
          setTemplates((prev) => {
            if (prev.some((item) => item.src === template.src)) return prev;
            return [{ ...template, isPendingPublished: true }, ...prev];
          });
        });
      } catch {
        // ignore
      }
    };

    window.addEventListener("template:published", handlePublished);
    window.addEventListener("template:unpublished", handleUnpublished);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("template:published", handlePublished);
      window.removeEventListener("template:unpublished", handleUnpublished);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

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

  const baseValueRef = useRef("");

  const { isListening, startListening, stopListening, isSupported } =
    useSpeechToText({
      onTranscript: (transcript) => {
        const base = baseValueRef.current;
        setInputValue(base ? `${base} ${transcript}` : transcript);
      },
    });

  const handleMicClick = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      baseValueRef.current = inputValue.trim();
      startListening();
    }
  }, [isListening, startListening, stopListening, inputValue]);

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
          Math.min(textareaRef.current.scrollHeight, 200) + "px";
      }
    },
    [setInputValue]
  );

  // Handle file processing with validation
  const handleFileProcess = useCallback(
    (files: File[]) => {
      const maxFileSize = 50 * 1024 * 1024; // 50MB
      const maxFiles = 10;
      const allowedTypes = ["image/*", "video/*"];

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
      if (creditsRemaining === 0) {
        const isBasic = String(user?.userPlan) === "Basic";
        toast.error(`Low Credits`, {
          description: `You have ${creditsRemaining} credits remaining.`,
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
        const formattedInput = appendClientTimeContext(inputValue);
        const result = await createProject(
          formattedInput,
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

  const hasEnoughCredits = (user?.creditsRemaining ?? 0) > 0;

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
      className='mt-2 mb-20'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      {/* <div className="mt-4 mb-4 flex flex-row items-center">
        <CategoryAndSearch />
      </div> */}
      <div className='columns-2 gap-4 [column-fill:_balance] md:columns-4'>
        {isLoading && templates.length === 0 && (
          <>
            {[220, 280, 200, 260, 240, 300, 210, 250, 230, 270, 190, 310].map(
              (h, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className='border-border/50 bg-muted/5 group mb-4 inline-block w-full overflow-hidden rounded-lg border align-top'
                  style={{ breakInside: "avoid" }}
                >
                  <div className='relative'>
                    {/* Image Placeholder */}
                    <Skeleton
                      className='bg-muted/50 w-full transition-colors'
                      style={{ height: h }}
                    />

                    {/* Creator Info Skeleton (Bottom) */}
                    <div className='absolute right-0 bottom-0 left-0 flex items-center gap-2 bg-gradient-to-t from-black/20 to-transparent p-2'>
                      <Skeleton className='bg-muted-foreground/20 h-5 w-5 rounded-full' />
                      <Skeleton className='bg-muted-foreground/20 h-2 w-16 rounded' />
                    </div>

                    {/* Action Button Skeleton (Center) */}
                    <div className='absolute inset-0 flex items-center justify-center opacity-40'>
                      <Skeleton className='bg-muted-foreground/20 h-9 w-9 rounded-full' />
                    </div>
                  </div>
                </div>
              )
            )}
          </>
        )}
        {templates.map((t) => {
          return (
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
                    className='pointer-events-none absolute top-2 left-2 z-2 hidden text-xs'
                  >
                    {t.category
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </Badge>
                )}
                <div className='pointer-events-none absolute inset-0 rounded-lg bg-black/0 opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100' />
                {/* Creator Info at Bottom */}
                {t.isUserGenerated && (t.userId || t.author) && (
                  <div className='pointer-events-auto absolute right-0 bottom-0 left-0 z-10 hidden rounded-b-lg bg-gradient-to-t from-black/80 via-black/60 to-transparent p-2 opacity-100 transition-opacity lg:block lg:opacity-0 lg:group-hover:opacity-100'>
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
                    className='pointer-events-auto h-9 w-9 rounded-full bg-white/90 p-0 opacity-90 backdrop-blur-sm dark:bg-black/20'
                    aria-label='View template'
                  >
                    <Eye className='h-4 w-4 text-black dark:text-white' />
                  </Button>
                  <Button
                    size='icon'
                    onClick={() => onEdit(t)}
                    className='pointer-events-auto h-9 w-9 rounded-full bg-white/90 p-0 opacity-50 backdrop-blur-sm dark:bg-black/20'
                    aria-label='Edit template'
                  >
                    <Pencil className='h-4 w-4 text-black dark:text-white' />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        {/* Sentinel for infinite scroll */}
        <div ref={loadMoreRef} className='col-span-full h-10'></div>
      </div>
      {isFetchingMore && (
        <div className='mt-4 flex justify-center'>
          <Loading size={20} />
        </div>
      )}

      {selected && !isMobile && (
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className='flex h-fit w-fit flex-col p-0'>
            <div className='m-0 p-0'>
              <img
                src={selected.src}
                alt={selected.alt || "Template"}
                className='h-[75vh] w-full rounded-md object-contain'
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {selected && isMobile && (
        <Drawer open={viewOpen} onOpenChange={setViewOpen}>
          <DrawerContent className='h-[75vh]'>
            <DrawerHeader className='border-b px-4 py-2'>
              <DrawerTitle>
                <LocalizedText text={"Preview"} />
              </DrawerTitle>
            </DrawerHeader>
            <div className='min-h-0 flex-1 overflow-hidden'>
              <img
                src={selected.src}
                alt={selected.alt || "Template"}
                className='h-full w-full rounded-md object-contain'
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {selected && !isMobile && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className='flex h-[85vh] max-w-3xl flex-col overflow-hidden p-0'>
            <DialogHeader className='flex-shrink-0 border-b px-4 py-3'>
              <DialogTitle>
                <LocalizedText text={"Recreate"} />
              </DialogTitle>
            </DialogHeader>

            {/* Image container with relative positioning */}
            <div className='relative h-auto max-h-[63%] flex-shrink-0 overflow-hidden'>
              <img
                src={selected.src}
                alt={selected.alt || "Template"}
                className='h-full w-full rounded-md object-contain'
              />

              {/* File Attachments - Positioned absolutely over the image */}
              {attachedFiles.length > 0 && (
                <div className='absolute right-0 bottom-0 left-0 z-20 ml-2 bg-gradient-to-t from-black/60 to-transparent'>
                  <div className='custom-scrollbar-horizontal flex flex-wrap gap-2'>
                    {attachedFiles.map((file: any, index: number) => {
                      const fileKey = file.fileKey || `${file.name}-${index}`;
                      return (
                        <div
                          key={fileKey}
                          className='group border-border relative flex max-w-[200px] items-center gap-2 rounded-lg border bg-white/90 p-2 backdrop-blur-sm transition-colors hover:bg-white dark:bg-black/80 dark:hover:bg-black/90'
                        >
                          <div className='bg-background border-border relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded border'>
                            {file.type && file.type.startsWith("image/") ? (
                              <img
                                src={
                                  URL.createObjectURL(file) ||
                                  "/placeholder.svg"
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
                          {/* <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate text-foreground">
                              {file.name && file.name.length > 15
                                ? `${file.name.substring(0, 15)}...`
                                : file.name || "Unknown file"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div> */}
                          <button
                            onClick={() => handleFileRemove(index)}
                            className='bg-muted-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500'
                            disabled={isGenerating}
                            aria-label={`Remove ${file.name}`}
                          >
                            <LocalizedText text={"&times;"} />
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
                </div>
              )}
            </div>

            <motion.div
              className='relative flex min-h-0 w-full flex-1 flex-col overflow-hidden pb-0'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div
                ref={chatContainerRef}
                className="before:bg-radial-gradient relative flex h-full min-h-0 w-full flex-1 overflow-hidden rounded-lg p-[1.5px] shadow-lg before:absolute before:top-[-10px] before:left-[-10px] before:h-[30px] before:blur-[1px] before:content-[''] md:before:w-[40vh]"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className='z-10 flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[15px] bg-white/90 shadow-inner backdrop-blur-sm dark:bg-black/80'>
                  {/* <div className="flex items-center mx-4 justify-between text-sm flex-shrink-0">
                    {!isGenerating && (
                      <div className="flex items-center gap-3 justify-between w-full">
                        <div className="text-muted-foreground dark:text-zinc-400 flex items-center">
                          <Zap className="inline-block w-3 h-3 text-emerald-500 mr-2" />
                          {user ? (
                            `${(user?.creditsRemaining ?? 0).toLocaleString()} Credits left`
                          ) : (
                            <span className="ml-2 text-xs text-muted-foreground">
                              Get started for free
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
                  </div> */}

                  <div className='relative flex min-h-0 flex-1 flex-col justify-end px-4 pb-4'>
                    <form
                      onSubmit={
                        user
                          ? handleSubmit
                          : (e) => {
                              e.preventDefault();
                              router.push("/signin");
                            }
                      }
                      className='group flex w-full flex-col gap-2 rounded-lg border border-white bg-white/80 p-3 text-base shadow-xl ring-1 ring-black/[0.08] backdrop-blur-xl transition-all duration-150 ease-in-out focus-within:ring-black/[0.16] hover:ring-black/[0.12] focus-within:hover:ring-black/[0.16] dark:border-white/[0.08] dark:bg-zinc-900/50 dark:ring-black/[0.88] dark:focus-within:ring-black/[0.96]'
                    >
                      <div className='w-full min-w-0'>
                        <div className='relative flex flex-1 items-center'>
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
                                : isListening
                                  ? "Listening... speak now ✦"
                                  : "Tell your AI Designer what to create...✦"
                            }
                            disabled={isGenerating || isSubmitting}
                            className='placeholder:text-muted-foreground/60 flex max-h-[300px] w-full flex-1 resize-none scrollbar-none border-none bg-transparent px-3 py-2 text-[16px] leading-snug transition-colors duration-150 ease-in-out outline-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base'
                            style={{
                              minHeight: "60px",
                            }}
                            aria-label='Enter your prompt'
                            aria-describedby={
                              inputError ? "input-error" : undefined
                            }
                          />
                        </div>
                      </div>

                      <div className='flex items-center gap-1.5'>
                        <button
                          type='button'
                          className='bg-secondary text-primary relative box-border inline-flex h-8 w-8 min-w-fit flex-shrink-0 items-center justify-center gap-2 rounded-full !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap shadow-sm brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out'
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isGenerating || isSubmitting}
                          aria-label='Attach files'
                        >
                          <Plus className='size-5 shrink-0' />
                        </button>
                        <Input
                          ref={fileInputRef}
                          type='file'
                          multiple
                          onChange={handleFileInputChange}
                          disabled={isGenerating || isSubmitting}
                          className='hidden'
                          id='file-upload'
                          accept='image/*,video/*'
                        />

                        <div className='ml-auto flex items-center gap-1.5'>
                          <button
                            type='button'
                            className={cn(
                              "relative box-border inline-flex h-8 w-8 min-w-fit items-center justify-center gap-2 rounded-full !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out",
                              isBrandSettingsOpen
                                ? "text-primary bg-indigo-600 hover:bg-indigo-700/10 dark:bg-white/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-indigo-600 hover:bg-indigo-700/5 dark:hover:bg-white/5"
                            )}
                            onClick={() =>
                              setIsBrandSettingsOpen(!isBrandSettingsOpen)
                            }
                            title='Brand settings'
                          >
                            <Palette className='size-4 shrink-0' />
                          </button>
                          <button
                            type='button'
                            className={cn(
                              "relative box-border inline-flex h-8 w-8 min-w-fit items-center justify-center gap-2 rounded-full !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out",
                              isListening
                                ? "animate-pulse bg-red-500/10 text-red-500"
                                : "text-muted-foreground hover:text-foreground hover:bg-indigo-600 hover:bg-indigo-700/5 dark:hover:bg-white/5"
                            )}
                            onClick={handleMicClick}
                            disabled={!isSupported || isGenerating}
                            title={
                              isListening
                                ? "Stop listening"
                                : "Start voice input"
                            }
                          >
                            <Mic className='size-4 shrink-0' />
                          </button>
                          {/* <button
                            type='submit'
                            className='text-primary-foreground relative box-border inline-flex h-8 w-8 min-w-fit flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-indigo-600 !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap shadow-md brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out hover:bg-indigo-700'
                            disabled={isSubmitDisabled}
                          >
                            <BorderBeam
                              duration={6}
                              size={40}
                              className='from-transparent via-red-500 to-transparent'
                            />
                            <BorderBeam
                              duration={6}
                              delay={3}
                              size={40}
                              borderWidth={2}
                              className='from-transparent via-blue-500 to-transparent'
                            />
                            {isGenerating || isSubmitting ? (
                              <LoadingFileLoader size={16} />
                            ) : (
                              <WandSparklesIcon className='h-4 w-4' />
                            )}
                          </button> */}
                          <button
                            type='submit'
                            disabled={isSubmitDisabled}
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
                              {isGenerating || isSubmitting ? (
                                <LoadingFileLoader size={16} />
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
                  </div>
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {isBrandSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className='border-border absolute right-4 bottom-[90px] left-4 z-[9999] mx-auto max-h-[500px] w-[calc(100%-32px)] max-w-md overflow-hidden rounded-xl border bg-white shadow-2xl md:right-8 md:left-auto md:mx-0 dark:bg-zinc-950'
                >
                  <div className='flex flex-col p-4'>
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
                        className='flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                      >
                        <X className='h-4 w-4' />
                      </button>
                    </div>
                    <div className='custom-scrollbar max-h-[300px] overflow-y-auto'>
                      <BrandIdentityPanel />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      )}
      {/* Mobile Drawer Version - Same structure */}
      {selected && isMobile && (
        <Drawer open={editOpen} onOpenChange={setEditOpen}>
          <DrawerContent className='flex h-[85vh] flex-col overflow-hidden'>
            <DrawerHeader className='flex-shrink-0'>
              <DrawerTitle>
                <LocalizedText text={"Recreate"} />
              </DrawerTitle>
            </DrawerHeader>

            {/* Image container with relative positioning */}
            <div className='relative h-auto max-h-[63%] flex-shrink-0 overflow-hidden'>
              <img
                src={selected.src}
                alt={selected.alt || "Template"}
                className='h-full w-full rounded-md object-contain'
              />

              {/* File Attachments - Positioned absolutely over the image */}
              {attachedFiles.length > 0 && (
                <div className='absolute right-0 bottom-0 left-0 z-20 ml-2 bg-gradient-to-t from-black/60 to-transparent'>
                  <div className='custom-scrollbar-horizontal flex flex-wrap gap-2'>
                    {attachedFiles.map((file: any, index: number) => {
                      const fileKey = file.fileKey || `${file.name}-${index}`;
                      return (
                        <div
                          key={fileKey}
                          className='group border-border relative flex max-w-[200px] items-center gap-2 rounded-lg border bg-white/90 p-2 backdrop-blur-sm transition-colors hover:bg-white dark:bg-black/80 dark:hover:bg-black/90'
                        >
                          <div className='bg-background border-border relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded border'>
                            {file.type && file.type.startsWith("image/") ? (
                              <img
                                src={
                                  URL.createObjectURL(file) ||
                                  "/placeholder.svg"
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
                          {/* <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate text-foreground">
                              {file.name && file.name.length > 15
                                ? `${file.name.substring(0, 15)}...`
                                : file.name || "Unknown file"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div> */}
                          <button
                            onClick={() => handleFileRemove(index)}
                            className='bg-muted-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500'
                            disabled={isGenerating}
                            aria-label={`Remove ${file.name}`}
                          >
                            <LocalizedText text={"&times;"} />
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
                </div>
              )}
            </div>

            <motion.div
              className='relative flex min-h-0 w-full flex-1 flex-col overflow-hidden pb-0'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div
                ref={chatContainerRef}
                className="before:bg-radial-gradient relative flex h-full min-h-0 w-full flex-1 overflow-hidden rounded-lg p-[1.5px] shadow-lg before:absolute before:top-[-10px] before:left-[-10px] before:h-[30px] before:blur-[1px] before:content-[''] md:before:w-[40vh]"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className='z-10 flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[15px] bg-white/90 shadow-inner backdrop-blur-sm dark:bg-black/80'>
                  {/* <div className="flex items-center mx-4 justify-between text-sm flex-shrink-0">
                    {!isGenerating && (
                      <div className="flex items-center gap-3 justify-between w-full">
                        <div className="text-muted-foreground dark:text-zinc-400 flex items-center">
                          <Zap className="inline-block w-3 h-3 text-emerald-500 mr-2" />
                          {user ? (
                            `${(user?.creditsRemaining ?? 0).toLocaleString()} Credits left`
                          ) : (
                            <span className="ml-2 text-xs text-muted-foreground">
                              Get started for free
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
                  </div> */}

                  <div className='relative flex min-h-0 flex-1 flex-col justify-end px-4 pb-4'>
                    <form
                      onSubmit={
                        user
                          ? handleSubmit
                          : (e) => {
                              e.preventDefault();
                              router.push("/signin");
                            }
                      }
                      className='group flex w-full flex-col gap-2 rounded-lg border border-white bg-white/80 p-3 text-base shadow-xl ring-1 ring-black/[0.08] backdrop-blur-xl transition-all duration-150 ease-in-out focus-within:ring-black/[0.16] hover:ring-black/[0.12] focus-within:hover:ring-black/[0.16] dark:border-white/[0.08] dark:bg-zinc-900/50 dark:ring-black/[0.88] dark:focus-within:ring-black/[0.96]'
                    >
                      <div className='w-full min-w-0'>
                        <div className='relative flex flex-1 items-center'>
                          <textarea
                            ref={textareaRef}
                            id='chat_bot_mobile'
                            name='chat_bot_mobile'
                            value={isGenerating ? "" : inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                            placeholder={
                              isGenerating
                                ? ""
                                : isListening
                                  ? "Listening... speak now ✦"
                                  : "Tell your AI Designer what to create...✦"
                            }
                            disabled={isGenerating || isSubmitting}
                            className='placeholder:text-muted-foreground/60 flex max-h-[300px] w-full flex-1 resize-none scrollbar-none border-none bg-transparent px-3 py-2 text-[16px] leading-snug transition-colors duration-150 ease-in-out outline-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base'
                            style={{
                              minHeight: "60px",
                            }}
                            aria-label='Enter your prompt'
                          />
                        </div>
                      </div>

                      <div className='flex items-center gap-1.5'>
                        <button
                          type='button'
                          className='bg-secondary text-primary relative box-border inline-flex h-8 w-8 min-w-fit flex-shrink-0 items-center justify-center gap-2 rounded-full !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap shadow-sm brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out'
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isGenerating || isSubmitting}
                          aria-label='Attach files'
                        >
                          <Plus className='size-5 shrink-0' />
                        </button>
                        <Input
                          ref={fileInputRef}
                          type='file'
                          multiple
                          onChange={handleFileInputChange}
                          disabled={isGenerating || isSubmitting}
                          className='hidden'
                          id='file-upload-mobile'
                          accept='image/*,video/*'
                        />

                        <div className='ml-auto flex items-center gap-1.5'>
                          <button
                            type='button'
                            className={cn(
                              "relative box-border inline-flex h-8 w-8 min-w-fit items-center justify-center gap-2 rounded-full !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out",
                              isBrandSettingsOpen
                                ? "text-primary bg-indigo-600 hover:bg-indigo-700/10 dark:bg-white/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-indigo-600 hover:bg-indigo-700/5 dark:hover:bg-white/5"
                            )}
                            onClick={() =>
                              setIsBrandSettingsOpen(!isBrandSettingsOpen)
                            }
                            title='Brand settings'
                          >
                            <Palette className='size-4 shrink-0' />
                          </button>
                          <button
                            type='button'
                            className={cn(
                              "relative box-border inline-flex h-8 w-8 min-w-fit items-center justify-center gap-2 rounded-full !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out",
                              isListening
                                ? "animate-pulse bg-red-500/10 text-red-500"
                                : "text-muted-foreground hover:text-foreground hover:bg-indigo-600 hover:bg-indigo-700/5 dark:hover:bg-white/5"
                            )}
                            onClick={handleMicClick}
                            disabled={!isSupported || isGenerating}
                            title={
                              isListening
                                ? "Stop listening"
                                : "Start voice input"
                            }
                          >
                            <Mic className='size-4 shrink-0' />
                          </button>
                          {/* <button
                            type='submit'
                            className='text-primary-foreground relative box-border inline-flex h-8 w-8 min-w-fit flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-indigo-600 !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap shadow-md brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out hover:bg-indigo-700'
                            disabled={isSubmitDisabled}
                          >
                            <BorderBeam
                              duration={6}
                              size={40}
                              className='from-transparent via-red-500 to-transparent'
                            />
                            <BorderBeam
                              duration={6}
                              delay={3}
                              size={40}
                              borderWidth={2}
                              className='from-transparent via-blue-500 to-transparent'
                            />
                            {isGenerating || isSubmitting ? (
                              <LoadingFileLoader size={16} />
                            ) : (
                              <WandSparklesIcon className='h-4 w-4' />
                            )}
                          </button> */}
                          <button
                            type='submit'
                            disabled={isSubmitDisabled}
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
                              {isGenerating || isSubmitting ? (
                                <LoadingFileLoader size={16} />
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
                  </div>
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {isBrandSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className='border-border absolute right-4 bottom-[90px] left-4 z-[9999] mx-auto max-h-[500px] w-[calc(100%-32px)] max-w-md overflow-hidden rounded-xl border bg-white shadow-2xl dark:bg-zinc-950'
                >
                  <div className='flex flex-col p-4'>
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
                        className='flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                      >
                        <X className='h-4 w-4' />
                      </button>
                    </div>
                    <div className='custom-scrollbar max-h-[300px] overflow-y-auto'>
                      <BrandIdentityPanel />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </DrawerContent>
        </Drawer>
      )}
    </motion.div>
  );
}
