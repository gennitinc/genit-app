"use client";

import { AIThinkingContent } from "../chat/messages";
import { BrandIdentityPanel } from "../chat/messages/brand-identity-panel";
import { AutoModeDialog } from "../common/auto-mode-dialog";
import { BrandIndicator } from "../common/brand-indicator";
import AnimatedTooltipPreview from "../common/homeAgentsTooltip";
import { HomeInfoGrid } from "../common/homeInfoGrid";
import HomeGrid from "../common/templateGrid";
import { ModelSelector } from "../inspire/model-selector";
import { AnimatedShinyText } from "../ui/animated-shinny-text";
import { BorderBeam } from "../ui/border-beam";
import ShinyText from "../ui/shiny-text";
import { INTEGRATIONS } from "@/app/integrations/integrations-explorer";
import { PricingDialog } from "@/components/common/pricing-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useProjectDesign } from "@/context/DesignProject";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { APP_SECTIONS, type AppCardProps } from "@/lib/apps-config";
import {
  trackAppOpened,
  trackEvent,
  trackFeatureUsed,
} from "@/lib/mixpanelClient";
import { enhancePromptText } from "@/lib/prompt-enhancement-api";
import { appendClientTimeContext, cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import { GradientFrame } from "@/utils/gradient-frame";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRightIcon,
  Camera,
  CheckCircle2,
  CircleFadingArrowUp,
  FileText,
  Grid2X2Plus,
  Image,
  Image as ImageIcon,
  Layout,
  Loader2,
  MessageSquare,
  Mic,
  Music,
  Paintbrush,
  Palette,
  PaperclipIcon,
  Play,
  Sparkles,
  Table,
  TrendingUp,
  Type,
  User,
  Users,
  Video,
  Volume2,
  Wand2,
  WandSparklesIcon,
  Workflow,
  X,
  XIcon,
  Youtube,
  Zap,
} from "lucide-react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { div } from "three/src/nodes/math/OperatorNode.js";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export const INTEGRATION_BRANDS = INTEGRATIONS.map(({ name, icon }) => ({
  name,
  Icon: icon,
}));

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
  }, [text, isDeleting, wordIndex, words, typingSpeed, delay, isDeleting]);

  return text;
}

interface IdeaItemData {
  id: string;
  label: string;
  href: string;
  icon: any;
  bg: string;
  lightBg: string;
  darkBg: string;
  iconColor: string;
  hoverScale: string;
  isImage?: boolean;
  hasDot?: boolean;
  isExternal?: boolean;
  badge?: string;
  badgeBg?: string;
  badgeClass?: string;
  iconContainerClass?: string;
  imageClass?: string;
}

const images = [
  "https://img.freepik.com/free-photo/smiley-woman-outdoors-city_23-2148774316.jpg?ga=GA1.1.1557987898.1750353078&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/freedom-concept-with-hiker-mountain_23-2148107064.jpg?ga=GA1.1.1557987898.1750353078&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-vector/woman-doodle-drawing-sketch-illustration-vector_53876-118.jpg?ga=GA1.1.1557987898.1750353078&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/smiling-man_1098-15443.jpg?ga=GA1.1.1557987898.1750353078&w=740",
];

const PLACEHOLDERS = [
  "Design high converting logo",
  "Create viral Instagram carousel",
  "Generate bold product poster",
  "Design clickable YouTube thumbnail",
  "Create SaaS landing banner",
  "Design clear pricing graphic",
  "Generate scroll stopping Facebook ads",
  "Create professional business card",
  "Design eye catching event flyer",
  "Create personal brand banner",
  "Design realistic product mockup",
  "Create simple data infographic",
  "Generate engaging video ad",
  "Create animated social video",
  "Design modern app interface",
  "Generate product launch visuals",
  "Create email marketing banner",
  "Generate brand style guidelines",
  "Create short promotional animation",
];

const IDEA_ITEMS: IdeaItemData[] = [
  {
    id: "all-agents",
    label: "All Agents",
    href: "/apps",
    icon: Grid2X2Plus,
    bg: "rgba(30, 30, 30, 30)",
    lightBg: "rgba(255, 255, 255, 0.7)",
    darkBg: "rgba(30, 30, 30, 30)",
    iconColor: "text-black dark:text-white",
    hoverScale: "hover:scale-[1.2]",
  },
  {
    id: "design-chat",
    label: "Chat",
    href: "/chat",
    icon: WandSparklesIcon,
    bg: "rgba(255, 183, 77, 0.45)",
    lightBg: "rgba(255, 183, 77, 0.35)",
    darkBg: "rgba(255, 183, 77, 0.55)",
    iconColor: "text-black dark:text-white",
    hoverScale: "md:hover:scale-[1.2]",
  },
  {
    id: "workflow",
    label: "AI Workflow",
    href: "/apps/workflow",
    icon: Workflow,
    bg: "rgba(34, 197, 94, 0.45)",
    lightBg: "rgba(34, 197, 94, 0.35)",
    darkBg: "rgba(34, 197, 94, 0.55)",
    iconColor: "text-black dark:text-white",
    hoverScale: "md:hover:scale-[1.2]",
  },
  {
    id: "video",
    label: "AI Video",
    href: "/apps/video-generation",
    icon: Video,
    bg: "rgba(255, 99, 132, 0.45)",
    lightBg: "rgba(255, 99, 132, 0.35)",
    darkBg: "rgba(255, 99, 132, 0.55)",
    iconColor: "text-black dark:text-white",
    hoverScale: "md:hover:scale-[1.2]",
  },
  {
    id: "image",
    label: "AI Image",
    href: "/apps/image-generation",
    icon: Image,
    bg: "rgba(99, 102, 241, 0.5)",
    lightBg: "rgba(99, 102, 241, 0.4)",
    darkBg: "rgba(99, 102, 241, 0.6)",
    iconColor: "text-black dark:text-white",
    hoverScale: "md:hover:scale-[1.2]",
  },
  {
    id: "character",
    label: "AI Character",
    href: "/apps/character",
    icon: User,
    bg: "rgba(168, 85, 247, 0.5)",
    lightBg: "rgba(168, 85, 247, 0.4)",
    darkBg: "rgba(168, 85, 247, 0.6)",
    iconColor: "text-black dark:text-white",
    hoverScale: "md:hover:scale-[1.2]",
  },
  {
    id: "skin-enhancer",
    label: "AI Enhancer",
    href: "/apps/skin-enhancer",
    icon: Paintbrush,
    bg: "rgba(59, 130, 246, 0.5)",
    lightBg: "rgba(59, 130, 246, 0.4)",
    darkBg: "rgba(59, 130, 246, 0.6)",
    iconColor: "text-black dark:text-white",
    hoverScale: "md:hover:scale-[1.2]",
  },
  {
    id: "angles-reshape",
    label: "Angle Reshape",
    href: "/apps/angles-reshape",
    icon: Camera,
    bg: "rgba(255, 204, 0, 0.5)",
    lightBg: "rgba(255, 204, 0, 0.4)",
    darkBg: "rgba(255, 204, 0, 0.6)",
    iconColor: "text-black dark:text-white",
    hoverScale: "md:hover:scale-[1.2]",
  },
  {
    id: "logo-animation",
    label: "AI Animation",
    href: "/apps/logo-animation2",
    icon: Play,
    bg: "rgba(0, 122, 255, 0.5)",
    lightBg: "rgba(0, 122, 255, 0.4)",
    darkBg: "rgba(0, 122, 255, 0.6)",
    iconColor: "text-black dark:text-white",
    hoverScale: "md:hover:scale-[1.2]",
  },
  // {
  //   id: "text-to-speech",
  //   label: "Text to Speech",
  //   href: "/apps/text-to-speech",
  //   icon: Volume2,
  //   bg: "rgba(20, 184, 166, 0.5)",
  //   lightBg: "rgba(20, 184, 166, 0.4)",
  //   darkBg: "rgba(20, 184, 166, 0.6)",
  //   iconColor: "text-black dark:text-white",
  //   hoverScale: "md:hover:scale-[1.2]",
  // },
];
const IdeaItem = ({ item }: { item: IdeaItemData }) => {
  const Icon = item.icon;
  const isImage = item.isImage;

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "group relative flex flex-col items-center",
        item.id === "all-agents" ? "sticky left-0 z-30 pr-4 md:pr-0" : "z-10"
      )}
    >
      {/* Background Glow for All Apps when sticky */}
      {item.id === "all-agents" && (
        <div className='from-background via-background absolute inset-y-0 left-0 -my-2 w-full bg-gradient-to-r to-transparent md:hidden' />
      )}

      <Link
        href={item.href || "#"}
        onClick={() => {
          trackAppOpened(item.id, item.label, "idea_section_quick_apps", {
            href: item.href,
          });
        }}
        className='relative z-20 flex flex-col items-center'
      >
        <div
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-lg transition-all duration-300",
            "overflow-hidden shadow-md",
            "group-hover:shadow-lg"
          )}
          style={{
            backgroundColor: item.lightBg,
          }}
        >
          {/* Dark-mode override via a pseudo-layer — swap background inline */}
          <div
            className='absolute inset-0 opacity-0 transition-opacity duration-300 dark:opacity-100'
            style={{ backgroundColor: item.darkBg }}
          />

          {/* Subtle inner highlight */}
          <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-60 dark:opacity-30' />

          {/* Border: visible in light, subtle in dark */}
          <div className='absolute inset-0 rounded-lg ring-1 ring-black/[0.07] ring-inset dark:ring-white/[0.06]' />

          {isImage ? (
            <img
              src={Icon as string}
              className={cn(
                "relative z-10 h-7 w-7 object-contain transition-transform duration-300 group-hover:scale-110",
                item.imageClass
              )}
              alt={item.label}
            />
          ) : (
            <Icon
              className={cn(
                "relative z-10 h-6 w-6 transition-transform duration-300 group-hover:scale-110",
                item.iconColor
              )}
            />
          )}

          {item.hasDot && (
            <div className='absolute top-2 right-2 z-10 h-2 w-2 rounded-full bg-[#0F7FFF] shadow-[0_0_8px_#0F7FFF]' />
          )}

          {/* Border Beam Effect on Hover */}
          <BorderBeam
            size={60}
            duration={4}
            className='opacity-0 group-hover:opacity-100'
          />
        </div>

        <span className='mt-3 text-[12px] font-medium whitespace-nowrap text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100'>
          {item.label}
        </span>
      </Link>

      {item.badge && (
        <div className='absolute -top-1 -right-1 z-30'>
          <Badge className='border-none bg-[#FFCB0F] px-1.5 py-0 text-[9px] text-black shadow-sm'>
            {item.badge}
          </Badge>
        </div>
      )}
    </motion.div>
  );
};

const BrandIdentityDialog = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const isMobileOrTablet = useMediaQuery("(max-width: 1023px)");

  const content = (
    <div
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-xs bg-white/95 ring-1 ring-black/5 backdrop-blur-xl dark:bg-black/95 dark:ring-white/10",
        isMobileOrTablet ? "h-[80vh]" : "h-[64vh] max-h-[540px]"
      )}
    >
      <GradientFrame />

      <div className='border-border/70 relative z-10 flex shrink-0 items-center justify-between border-b px-4 py-3 md:px-5'>
        <div className='flex min-w-0 items-center gap-2'>
          <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300'>
            <Palette className='h-4 w-4' />
          </div>
          <div className='min-w-0'>
            <h3 className='text-foreground truncate text-sm font-semibold'>
              Brand Identity
            </h3>
            <p className='text-muted-foreground truncate text-[11px]'>
              Voice, colors, logo, and brand memory
            </p>
          </div>
        </div>
        <button
          type='button'
          onClick={() => onOpenChange(false)}
          className='text-muted-foreground hover:text-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10'
          aria-label='Close brand identity'
        >
          <X className='h-4 w-4' />
        </button>
      </div>

      <div className='relative z-10 min-h-0 flex-1'>
        <BrandIdentityPanel />
      </div>
    </div>
  );

  if (isMobileOrTablet) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className='max-h-[80vh] border-none bg-transparent p-0 shadow-none'>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='border-none bg-transparent p-0 shadow-none sm:max-w-lg md:max-w-xl [&>button]:hidden'>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export function IdeaSection() {
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
    selectedColorScales,
    primaryFont,
    imageModel,
    setImageModel,
    project,
    brandSaveStatus,
    brandIdentityEnabled,
    setBrandIdentityEnabled,
  } = useProjectDesign();

  const { user, updateOrganization } = useUserContext();

  const [mode, setMode] = useState<"chat" | "auto">("chat");

  useEffect(() => {
    if (user?.currentOrganization) {
      setMode(user.currentOrganization.autoModeEnabled ? "auto" : "chat");
    }
  }, [user?.currentOrganization?.autoModeEnabled]);

  const [beamPosition, setBeamPosition] = useState({ x: 50, y: 50 });
  const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);
  const [isAutoModeDialogOpen, setIsAutoModeDialogOpen] = useState(false);
  const [isEnablingAuto, setIsEnablingAuto] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDesignTypeId, setSelectedDesignTypeId] =
    useState<string>("auto");
  const [isBrandSettingsOpen, setIsBrandSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);

  useEffect(() => {
    setSelectedModel(null);
  }, [project?._id]);
  const [imageRotations] = useState(() =>
    images.map(() => Math.random() * 20 - 10)
  );

  const [initialInputValue, setInitialInputValue] = useState("");

  const enableAutoMode = async () => {
    if (!user?.currentOrganization?._id) return;
    setIsEnablingAuto(true);
    try {
      await updateOrganization(user.currentOrganization._id, {
        autoModeEnabled: true,
      });
      setMode("auto");
      setIsAutoModeDialogOpen(false);
    } catch (error) {
      console.error("Failed to enable auto mode", error);
      toast.error("Could not turn on Genit Auto");
    } finally {
      setIsEnablingAuto(false);
    }
  };

  const { isListening, startListening, stopListening, isSupported } =
    useSpeechToText({
      onTranscript: (transcript) => {
        setInputValue(
          initialInputValue ? `${initialInputValue} ${transcript}` : transcript
        );
      },
    });

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const innerContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const placeholderText = useTypewriterEffect({
    words: PLACEHOLDERS,
    typingSpeed: 40,
    delay: 1000,
  });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 300) + "px";
    }
  }, [inputValue]);

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

  const handleMicClick = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      setInitialInputValue(inputValue.trim());
      startListening();
    }
  }, [isListening, startListening, stopListening, inputValue]);

  const handleEnhancePrompt = useCallback(async () => {
    const prompt = inputValue.trim();
    if (!prompt || isGenerating || isSubmitting || isEnhancingPrompt) return;
    setIsEnhancingPrompt(true);
    try {
      const enhancedPrompt = await enhancePromptText(prompt);
      setInputValue(enhancedPrompt);
      setInputError(null);
      if (textareaRef.current) {
        textareaRef.current.value = enhancedPrompt;
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
          Math.min(textareaRef.current.scrollHeight, 300) + "px";
      }
      trackFeatureUsed("idea_prompt_enhanced", {
        prompt_length: prompt.length,
      });
      requestAnimationFrame(() => textareaRef.current?.focus());
    } catch (error: any) {
      toast.error("Could not enhance prompt", {
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Please try again.",
      });
    } finally {
      setIsEnhancingPrompt(false);
    }
  }, [
    inputValue,
    isGenerating,
    isSubmitting,
    isEnhancingPrompt,
    setInputValue,
  ]);

  // Handle file processing with validation
  const handleFileProcess = useCallback(
    (files: File[]) => {
      const maxFileSize = 50 * 1024 * 1024; // 50MB
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
        trackFeatureUsed("idea_submit_requires_auth", {
          source: "idea_section",
        });
        router.push("/signin");
        return;
      }

      // Check for low credits
      const creditsRemaining = user?.creditsRemaining ?? 0;
      if (creditsRemaining <= 10) {
        const isBasic = String(user?.userPlan) === "Basic";
        trackFeatureUsed("idea_low_credits_blocked_submit", {
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

      const validationError = validateInput(inputValue, attachedFiles);
      if (validationError) {
        trackFeatureUsed("idea_submit_validation_failed", {
          reason: validationError,
        });
        setInputError(validationError);
        return;
      }

      // Check if selected design type is coming soon
      const selectedItem = designTypeItems.find(
        (item) => item.id === selectedDesignTypeId
      );
      if (selectedItem && (selectedItem as any).comingSoon) {
        trackFeatureUsed("idea_coming_soon_feature_clicked", {
          design_type: selectedDesignTypeId,
        });
        toast(`${selectedItem.label} is coming soon.`);
        return;
      }

      if (isGenerating || isSubmitting) return;

      setIsSubmitting(true);
      setInputError(null);

      try {
        const formattedInput = appendClientTimeContext(inputValue);
        const isAuto = selectedDesignTypeId === "auto";
        const res = await createProject(
          formattedInput,
          attachedFiles as any,
          undefined,
          selectedDesignTypeId || undefined,
          undefined,
          undefined,
          {
            finalizedSelections: {
              selectedColorScales,
              primaryFont,
              useBrandIdentity: brandIdentityEnabled,
            },
          }
        );

        trackEvent("idea_project_created", {
          design_type: selectedDesignTypeId,
          prompt_length: inputValue.trim().length,
          attached_files_count: attachedFiles.length,
        });

        clearInput();
        setSelectedDesignTypeId("auto");

        if (res.type && res.id) {
          // Redirect to chat page with project ID
          router.push(`/chat/${res.id}`);
        }
      } catch (error: any) {
        console.error("Failed to create project:", error);
        trackEvent("idea_project_creation_failed", {
          design_type: selectedDesignTypeId || "",
          reason: error?.message || "unknown",
        });
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
      selectedDesignTypeId,
      toast,
      selectedModel,
      brandIdentityEnabled,
      selectedColorScales,
      primaryFont,
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

  // Design type items with clean design (no gradients)
  const designTypeItems = [
    {
      id: "auto",
      label: "Auto",
      icon: Wand2,
    },
    {
      id: "flier",
      label: "Flier",
      icon: FileText,
    },
    {
      id: "animation",
      label: "Animation",
      icon: Video,
      comingSoon: true,
    },
    {
      id: "video",
      label: "Video",
      icon: Video,
    },
    {
      id: "image",
      label: "HD Images",
      icon: ImageIcon,
    },
    {
      id: "instagram_post",
      label: "Instagram",
      icon: Camera,
    },
    {
      id: "poster",
      label: "Poster",
      icon: ImageIcon,
    },
    {
      id: "youtube_thumbnail",
      label: "YouTube Thumbnail",
      icon: Youtube,
    },
    {
      id: "facebook_post",
      label: "Facebook Post",
      icon: Layout,
    },
    {
      id: "facebook_cover",
      label: "Facebook Cover",
      icon: Layout,
    },
    {
      id: "banner",
      label: "Banner",
      icon: Layout,
    },
    {
      id: "logo",
      label: "Logo",
      icon: Type,
    },
    {
      id: "generic_design",
      label: "Generic Design",
      icon: Sparkles,
    },
  ];

  return (
    <div className='w-full md:px-4'>
      <div className='mx-auto flex w-full flex-col items-center justify-center space-y-2 lg:space-y-6'>
        {/* Header */}
        <div className='mt4 space-y-2 text-center lg:mt-0'>
          {/* <AnimatedTooltipPreview /> */}
          <motion.div
            className='mt-2 mb-2 flex flex-col items-center justify-center md:mt-8 lg:mt-24 lg:mb-2'
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.6 }}
          >
            <AnimatedShinyText className='inline-flex items-center justify-center rounded-full border-2 px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400'>
              <span className='text-xs'>✨ Introducing genit v2</span>
              <ArrowRightIcon className='ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5' />
            </AnimatedShinyText>

            <motion.h1
              className='text-foreground xs:text-5xl mt-6 mb-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-center text-4xl leading-[0.95] font-semibold tracking-tight sm:mt-8 sm:mb-2 sm:text-6xl md:mb-2.5 md:justify-start md:gap-x-1 md:text-left md:text-2xl lg:text-5xl'
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
              initial='hidden'
              animate='visible'
            >
              Marketing Agents
              {/* <span>Humans</span> */}
            </motion.h1>
            <motion.h1
              className='text-foreground xs:text-5xl mb-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-center text-4xl leading-[0.95] font-semibold tracking-tight sm:text-6xl md:mb-2.5 md:justify-start md:gap-x-1 md:text-left md:text-2xl lg:text-5xl'
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
              initial='hidden'
              animate='visible'
            >
              That Never
              <PointerHighlight
                rectangleClassName='
      bg-blue-100 dark:bg-blue-900
      border-blue-300 dark:border-blue-700
      rounded-base
      px-1 sm:px-2 ml-1
      py-0.5
    '
                pointerClassName='text-blue-500 h-2.5 w-2.5 sm:h-3 sm:w-3'
                containerClassName='inline-flex items-center'
              >
                <span className='relative z-10 px-1 sm:px-2'>Sleep</span>
              </PointerHighlight>
              {/* <span>Humans</span> */}
            </motion.h1>

            <motion.p
              className='text-foreground/80 mt-2 mb-6 max-w-full text-center text-sm lg:text-base'
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
              initial='hidden'
              animate='visible'
            >
              Autonomous AI agents that work 24/7, so you don't have to.
            </motion.p>
          </motion.div>
        </div>

        <div className='flex w-full flex-row items-center justify-center'>
          <motion.div
            className='relative mx-auto flex w-full max-w-2xl flex-col'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className='relative'>
              {/* File Attachments */}
              {attachedFiles.length > 0 && !isGenerating && (
                <div className='custom-scrollbar-horizontal mb-3 flex flex-wrap gap-2'>
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
                          className='bg-muted-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs text-white opacity-100 transition-opacity group-hover:opacity-100 hover:bg-red-500 lg:opacity-0'
                          disabled={isGenerating}
                          aria-label={`Remove ${file.name}`}
                        >
                          &times;
                        </button>
                        {file.type && file.type.startsWith("image/") && (
                          <div className='pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform opacity-0 transition-opacity group-hover:opacity-100'>
                            <div className='bg-background border-border rounded-lg border p-2 shadow-md'>
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
                              {/* <div className="mt-1 text-xs text-center text-muted-foreground">
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
              className='relative mx-auto flex w-full max-w-3xl'
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {/* Animated beam with smoother transitions */}
              <motion.div
                className='pointer-events-none absolute z-0 h-40 w-full rounded-full bg-neutral-400/20 blur-3xl md:w-40 dark:bg-neutral-500/20'
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

              <div className='z-10 flex w-full flex-col items-center'>
                <div className='relative size-full'>
                  {/* Credit info and typing indicator */}
                  <div className='mx-4 mt-3 mb-2 flex items-center justify-between text-sm'>
                    {!isGenerating && (
                      <div className='flex w-full items-center justify-between gap-1'>
                        <div className='text-muted-foreground flex items-center dark:text-zinc-400'>
                          <Zap className='mr-2 inline-block h-3 w-3 text-emerald-500' />
                          {user ? (
                            <span className='text-muted-foreground text-xs'>
                              {(user?.creditsRemaining ?? 0).toLocaleString()}{" "}
                              Credits left
                            </span>
                          ) : (
                            <span className='text-muted-foreground text-xs'>
                              Get started for free
                            </span>
                          )}
                        </div>

                        <div className='flex items-center gap-3'>
                          <div className='flex rounded-full bg-zinc-100 p-0.5 dark:bg-zinc-800'>
                            <button
                              type='button'
                              onClick={async () => {
                                setMode("chat");
                                if (user?.currentOrganization?._id) {
                                  try {
                                    await updateOrganization(
                                      user.currentOrganization._id,
                                      { autoModeEnabled: false }
                                    );
                                  } catch (err) {
                                    console.error(
                                      "Failed to disable auto mode",
                                      err
                                    );
                                  }
                                }
                              }}
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors",
                                mode === "chat"
                                  ? "bg-white text-black shadow-sm dark:bg-zinc-600 dark:text-white"
                                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                              )}
                            >
                              Chat
                            </button>
                            <button
                              type='button'
                              onClick={() => {
                                if (mode !== "auto")
                                  setIsAutoModeDialogOpen(true);
                              }}
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors",
                                mode === "auto"
                                  ? "bg-white text-black shadow-sm dark:bg-zinc-600 dark:text-white"
                                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                              )}
                            >
                              Auto
                            </button>
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

                  {/* Error message */}
                  <AnimatePresence>
                    {(inputError || error) && (
                      <p className='mx-4 mb-2 flex items-center text-xs font-medium text-red-500'>
                        <AlertCircle className='mr-2 size-3.5' />
                        {inputError || error}
                      </p>
                    )}
                  </AnimatePresence>

                  <form
                    id='chat-input'
                    onSubmit={
                      user
                        ? handleSubmit
                        : (e) => {
                            e.preventDefault();
                            router.push("/signin");
                          }
                    }
                    className='group relative flex w-full flex-col gap-2 rounded-lg border border-white bg-white/80 p-3 text-base shadow-md ring-1 ring-black/[0.08] backdrop-blur-xl transition-all duration-150 ease-in-out focus-within:ring-black/[0.16] hover:ring-black/[0.12] focus-within:hover:ring-black/[0.16] dark:border-white/[0.08] dark:bg-zinc-900/50 dark:ring-black/[0.88] dark:focus-within:ring-black/[0.96]'
                  >
                    <div className='w-full min-w-0'>
                      <div className='relative flex flex-1 items-center'>
                        <textarea
                          ref={textareaRef}
                          id='chatinput'
                          value={isGenerating ? "" : inputValue}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyPress}
                          className='placeholder:text-muted-foreground/60 flex max-h-[300px] min-h-[95px] w-full flex-1 resize-none scrollbar-none border-none bg-transparent px-3 py-2 pr-10 text-[16px] leading-snug transition-colors duration-150 ease-in-out outline-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base'
                          placeholder={
                            isGenerating
                              ? ""
                              : isListening
                                ? "Listening... speak now ✦"
                                : placeholderText
                                  ? placeholderText + " |"
                                  : "Ask genit to create a design... ✦"
                          }
                          disabled={isGenerating || isSubmitting}
                        />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type='button'
                              aria-label='Enhance with AI'
                              className='text-muted-foreground hover:text-foreground absolute top-1.5 right-1.5 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-indigo-600/10 disabled:cursor-not-allowed disabled:opacity-50'
                              onClick={handleEnhancePrompt}
                              disabled={
                                isGenerating ||
                                isSubmitting ||
                                isEnhancingPrompt ||
                                !inputValue.trim()
                              }
                            >
                              {isEnhancingPrompt ? (
                                <LoadingFileLoader size={16} />
                              ) : (
                                <CircleFadingArrowUp className='h-3.5 w-3.5' />
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side='top'>
                            Enhance with AI
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <div className='flex flex-wrap items-center gap-1'>
                      <button
                        className='focus-visible:ring-ring bg-secondary text-primary relative box-border inline-flex h-8 w-8 min-w-fit items-center justify-center gap-2 rounded-full !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.2),0_1px_2px_0_rgba(0,0,0,0.05)] brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out focus-visible:ring-1 focus-visible:outline-none active:brightness-[0.65] disabled:cursor-not-allowed disabled:opacity-50 disabled:brightness-100 dark:shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.2),inset_0_0_0_0.5px_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.05)]'
                        type='button'
                        aria-label='Attach files'
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isGenerating || isSubmitting}
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
                        accept='image/*,video/*'
                      />

                      <div className='ml-2 flex items-center gap-1.5'>
                        <ModelSelector
                          type='general'
                          selectedModel={selectedModel}
                          initialModelId={imageModel}
                          onSelectModel={(model) => {
                            setSelectedModel(model);
                            setImageModel(model.modelId);
                          }}
                        />
                      </div>

                      <div className='ml-auto flex items-center gap-1.5'>
                        {brandSaveStatus !== "idle" && (
                          <div className='animate-in fade-in slide-in-from-right-1 flex items-center gap-1.5 px-1.5 text-[10px] font-medium duration-300'>
                            {brandSaveStatus === "saving" ? (
                              <>
                                <LoadingFileLoader size={16} />
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className='size-3 text-green-500' />
                              </>
                            )}
                          </div>
                        )}
                        <button
                          className={cn(
                            "focus-visible:ring-ring h-h-fit relative box-border inline-flex min-w-fit items-center justify-center gap-2 rounded-full bg-transparent p-0.5 p-2 text-sm font-normal whitespace-nowrap brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                            isBrandSettingsOpen
                              ? "text-primary bg-indigo-600 hover:bg-indigo-700/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-indigo-600 hover:bg-indigo-700/5 dark:hover:bg-white/5"
                          )}
                          type='button'
                          aria-label='Brand settings'
                          onClick={() => {
                            setIsBrandSettingsOpen(!isBrandSettingsOpen);
                            trackFeatureUsed("idea_brand_settings_toggled", {
                              is_opening: !isBrandSettingsOpen,
                            });
                          }}
                        >
                          <Palette className='size-4 shrink-0' />
                        </button>
                        <button
                          className={`focus-visible:ring-ring relative box-border inline-flex h-8 w-8 min-w-fit items-center justify-center gap-2 rounded-full bg-transparent !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                            isListening
                              ? "animate-pulse bg-red-500/10 text-red-500"
                              : "text-muted-foreground hover:text-foreground hover:bg-indigo-600 hover:bg-indigo-700/5 dark:hover:bg-white/5"
                          }`}
                          type='button'
                          aria-label={
                            isListening ? "Stop listening" : "Voice input"
                          }
                          onClick={handleMicClick}
                          disabled={
                            !isSupported || isGenerating || isSubmitting
                          }
                        >
                          <Mic className='size-4 shrink-0' />
                        </button>
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
                    {!user && (
                      <div
                        className='absolute top-0 right-0 bottom-0 left-0 z-50 h-full w-full bg-transparent'
                        onClick={() => router.push("/signin")}
                      ></div>
                    )}
                    <GradientFrame />
                  </form>
                </div>
              </div>
            </div>

            {/* Quick Task Search - only show when not generating and no input */}
            <div className='absolute'></div>
          </motion.div>
        </div>

        {/* <div className="relative w-full max-w-4xl px-4 mx-auto mt-10">
       
          <div className="flex flex-row items-start gap-2 px-0 pt-2 pb-6 pl-0 pr-2 overflow-x-auto lg:gap-6 scrollbar-hide md:px-2">
            {IDEA_ITEMS.map((item) => (
              <IdeaItem key={item.id} item={item} />
            ))}
          </div>

          <div className="absolute top-0 bottom-0 right-0 z-20 w-20 pointer-events-none bg-gradient-to-l from-background to-transparent rounded-r-3xl" />
        </div> */}

        <section className='relative mt-16 space-y-4 pt-6 pb-10 lg:mt-6'>
          <h2 className='text-muted-foreground text-center text-sm tracking-tight md:text-base'>
            with over {INTEGRATIONS.length}+ marketing{" "}
            <Link
              href='/plugin'
              target='_blank'
              className='text-foreground text-sm font-medium underline md:text-base'
            >
              Plugins
            </Link>
          </h2>
          <div className='relative z-10 mx-auto max-w-5xl'>
            <div className='overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-4'>
              <div className='animate-marquee flex w-max gap-10 hover:[animation-play-state:paused]'>
                {[...INTEGRATION_BRANDS, ...INTEGRATION_BRANDS].map(
                  ({ name, Icon }, i) => (
                    <Link
                      key={`${name}-${i}`}
                      href={`/plugin#${name.toLowerCase().replace(/\s+/g, "-")}`}
                      className='group text-muted-foreground hover:text-foreground flex shrink-0 items-center gap-2 transition-colors'
                    >
                      <span className='flex h-6 items-center md:h-7'>
                        <Icon className='h-full w-auto' />
                      </span>
                      <span className='text-sm font-medium whitespace-nowrap md:text-base'>
                        {name}
                      </span>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* <div className='w-full max-w-4xl min-w-0 px-4 mx-auto mt-8'>
          <div className='flex items-center justify-between mb-2'>
            <h2 className='text-sm font-bold text-black lg:ml-4 lg:text-lg dark:text-white'>
              Feature Apps
            </h2>
            <Link
              href='/apps'
              className='text-primary font-mono text-[11px] font-bold transition-all hover:underline'
            >
              View all →
            </Link>
          </div>
          <div className='grid w-full min-w-0'>
            <div
              aria-hidden='false'
              className='w-full min-w-0 col-start-1 row-start-1 pointer-events-auto'
              style={{ transform: "none", opacity: 1 }}
            >
              <div className='relative w-full min-w-0'>
                <div className='relative py-4'>
                  <div className='flex flex-row items-start gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                    {APP_SECTIONS.flatMap((section) => section.apps).map(
                      (app) => (
                        <Link key={app.id} href={app.href} className='shrink-0'>
                          <div
                            onClick={() =>
                              trackAppOpened(
                                app.id,
                                app.title,
                                "idea_feature_agents",
                                {
                                  href: app.href,
                                  app_type: app.type,
                                }
                              )
                            }
                          >
                            <div
                              className='flex flex-col items-center justify-center gap-2 p-0 text-center bg-transparent focus-visible:ring-f-primary/30 group rounded-xl focus-visible:ring-2 focus-visible:outline-none'
                              style={{ width: 128 }}
                            >
                              <span className='flex flex-col items-center w-full gap-2 transition-transform duration-300 support-hover:group-hover:-translate-y-3 active:-translate-y-3'>
                                <div className='liquid-glass-border bg-f-other-3 relative w-full overflow-hidden rounded-xl border-[1.8px] border-dotted border-gray-500 p-1 shadow-sm backdrop-blur-md dark:border-gray-600'>
                                  <div className='relative aspect-[60/50] w-full overflow-hidden rounded-lg'>
                                    {app.badge && (
                                      // <div className="absolute top-0 left-1.5 z-20">
                                      //   <span
                                      //     className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-mono shadow-sm"
                                      //     style={{
                                      //       backgroundColor: app.badge.bgColor,
                                      //       color: app.badge.textColor,
                                      //     }}
                                      //   >
                                      //     {app.badge.text}
                                      //   </span>
                                      // </div>
                                      <div className='absolute z-10 flex flex-wrap gap-2 top-1 left-2'>
                                        <span
                                          className='relative inline-flex skew-x-[-10deg] items-center justify-center overflow-hidden rounded px-1.5 text-[10px] text-white'
                                          style={{
                                            fontFamily: '"Space Grotesk"',
                                            backgroundColor: app.badge.bgColor,
                                            color: app.badge.textColor,
                                          }}
                                        >
                                          <span>{app.badge.text}</span>
                                        </span>
                                      </div>
                                    )}
                                    <img
                                      alt={app.title}
                                      loading='lazy'
                                      decoding='async'
                                      className='relative object-cover w-full h-full rounded-lg'
                                      src={app.imageSrc}
                                    />
                                  </div>
                                </div>
                                <span className='support-hover:group-hover:text-primary support-hover:group-hover:font-semibold text-f-text block w-full truncate font-mono text-[10px] leading-4 md:text-sm'>
                                  {app.title}
                                </span>
                              </span>
                            </div>
                          </div>
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      <AutoModeDialog
        open={isAutoModeDialogOpen}
        onOpenChange={setIsAutoModeDialogOpen}
        onApprove={enableAutoMode}
        approving={isEnablingAuto}
      />
      <BrandIdentityDialog
        isOpen={isBrandSettingsOpen}
        onOpenChange={setIsBrandSettingsOpen}
      />
    </div>
  );
}
