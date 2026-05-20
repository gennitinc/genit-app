"use client";

import { AIThinkingContent } from "../chat/messages";
import { BrandIdentityPanel } from "../chat/messages/brand-identity-panel";
import { BrandIndicator } from "../common/brand-indicator";
import AnimatedTooltipPreview from "../common/homeAgentsTooltip";
import { HomeInfoGrid } from "../common/homeInfoGrid";
import HomeGrid from "../common/templateGrid";
import { ModelSelector } from "../inspire/model-selector";
import { AnimatedShinyText } from "../ui/animated-shinny-text";
import { BorderBeam } from "../ui/border-beam";
import ShinyText from "../ui/shiny-text";
import {
  BrevoBrand,
  FacebookBrand,
  GmailBrand,
  GoogleCalendarBrand,
  GoogleDriveBrand,
  InstagramBrand,
  LinkedinBrand,
  MicrosoftOutlookBrand,
  PinterestBrand,
  SnapchatBrand,
  TelegramBrand,
  TikTokBrand,
  WhatsAppBrand,
  XBrand,
  YoutubeBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { PricingDialog } from "@/components/common/pricing-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { BorderBeam } from "@/registry/magicui/border-beam"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useProjectDesign } from "@/context/DesignProject";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { APP_SECTIONS, type AppCardProps } from "@/lib/apps-config";
import {
  trackAppOpened,
  trackEvent,
  trackFeatureUsed,
} from "@/lib/mixpanelClient";
import { cn } from "@/lib/utils";
import { apiResponse } from "@/utils/apiResponse";
import { GradientFrame } from "@/utils/gradient-frame";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRightIcon,
  Camera,
  CheckCircle2,
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
  Presentation,
  Settings,
  Settings2,
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
import { GripVertical, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { div } from "three/src/nodes/math/OperatorNode.js";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const INTEGRATION_BRANDS = [
  { name: "Instagram", Icon: InstagramBrand },
  { name: "Facebook", Icon: FacebookBrand },
  { name: "LinkedIn", Icon: LinkedinBrand },
  { name: "YouTube", Icon: YoutubeBrand },
  { name: "X", Icon: XBrand },
  { name: "TikTok", Icon: TikTokBrand },
  { name: "Pinterest", Icon: PinterestBrand },
  { name: "Snapchat", Icon: SnapchatBrand },
  { name: "WhatsApp", Icon: WhatsAppBrand },
  { name: "Telegram", Icon: TelegramBrand },
  { name: "Brevo", Icon: BrevoBrand },
  { name: "Gmail", Icon: GmailBrand },
  { name: "Outlook", Icon: MicrosoftOutlookBrand },
  { name: "Google Calendar", Icon: GoogleCalendarBrand },
  { name: "Google Drive", Icon: GoogleDriveBrand },
] as const;

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
    label: "Agentic Chat",
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
            "relative flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300",
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
          <div className='absolute inset-0 rounded-2xl ring-1 ring-black/[0.07] ring-inset dark:ring-white/[0.06]' />

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

export function IdeaSection() {
  const placeholders = [
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
    "Design clean presentation slides",
    "Generate brand style guidelines",
    "Create short promotional animation",
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
    selectedColorScales,
    primaryFont,
    imageModel,
    setImageModel,
    project,
    brandSaveStatus,
  } = useProjectDesign();

  const [beamPosition, setBeamPosition] = useState({ x: 50, y: 50 });
  const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDesignTypeId, setSelectedDesignTypeId] =
    useState<string>("auto");
  const [selectedOrientation, setSelectedOrientation] = useState<string | null>(
    "portrait"
  );
  const [customSize, setCustomSize] = useState<{
    width: string;
    height: string;
  }>({ width: "", height: "" });
  const [showOrientationSelection, setShowOrientationSelection] =
    useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBrandSettingsOpen, setIsBrandSettingsOpen] = useState(false);
  const [isPresentationDrawerOpen, setIsPresentationDrawerOpen] =
    useState(false);
  const [presentationOutline, setPresentationOutline] = useState<
    Array<{ title: string; content: string[]; id: string }>
  >([]);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [textAmount, setTextAmount] = useState<
    "minimal" | "concise" | "detailed" | "extensive"
  >("concise");
  const [selectedTheme, setSelectedTheme] = useState<string>("bubble-gum");
  const [imageStyle, setImageStyle] = useState<
    "illustration" | "photorealistic" | "abstract" | "3d" | "line-art"
  >("illustration");
  const [extraKeywords, setExtraKeywords] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<any>(null);

  useEffect(() => {
    setSelectedModel(null);
  }, [project?._id]);
  const [imageRotations] = useState(() =>
    images.map(() => Math.random() * 20 - 10)
  );

  const [initialInputValue, setInitialInputValue] = useState("");

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
  const user = useUserContext().user;

  const placeholderText = useTypewriterEffect({
    words: placeholders,
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

  // Generate presentation outline using AI
  const generatePresentationOutline = useCallback(
    async (prompt: string) => {
      setIsGeneratingOutline(true);
      try {
        const response = await apiResponse.post(
          "/presentation/generate-outline",
          { prompt },
          { withCredentials: true }
        );

        if (response.data && response.data.outline) {
          const outline = response.data.outline.map(
            (slide: any, index: number) => ({
              id: `slide-${index + 1}`,
              title: slide.title || `Slide ${index + 1}`,
              content: slide.content || slide.bulletPoints || [],
            })
          );
          setPresentationOutline(outline);
          setIsPresentationDrawerOpen(true);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error: any) {
        console.error("Failed to generate outline:", error);
        toast("Failed to generate presentation outline.");
        // Fallback: create a simple outline
        setPresentationOutline([
          {
            id: "slide-1",
            title: "Introduction",
            content: ["Introduction to the topic"],
          },
          {
            id: "slide-2",
            title: "Main Content",
            content: ["Key points and details"],
          },
          {
            id: "slide-3",
            title: "Conclusion",
            content: ["Summary and next steps"],
          },
        ]);
        setIsPresentationDrawerOpen(true);
      } finally {
        setIsGeneratingOutline(false);
      }
    },
    [toast]
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

      // Handle presentation projects differently
      if (selectedDesignTypeId === "presentation") {
        trackFeatureUsed("idea_presentation_outline_requested", {
          prompt_length: inputValue.trim().length,
        });
        setIsSubmitting(true);
        setInputError(null);
        await generatePresentationOutline(inputValue);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(true);
      setInputError(null);

      try {
        const isAuto = selectedDesignTypeId === "auto";
        const res = await createProject(
          inputValue,
          attachedFiles as any,
          undefined,
          selectedDesignTypeId || undefined,
          isAuto || selectedOrientation === "auto"
            ? undefined
            : selectedOrientation || undefined,
          isAuto || selectedOrientation === "auto"
            ? undefined
            : customSize.width && customSize.height
              ? customSize
              : undefined,
          {
            finalizedSelections: {
              selectedColorScales,
              primaryFont,
            },
          }
        );

        trackEvent("idea_project_created", {
          design_type: selectedDesignTypeId,
          orientation: selectedOrientation,
          has_custom_size: Boolean(customSize.width && customSize.height),
          prompt_length: inputValue.trim().length,
          attached_files_count: attachedFiles.length,
        });

        clearInput();
        setSelectedDesignTypeId("auto");
        setSelectedOrientation(null);
        setShowOrientationSelection(false);
        setCustomSize({ width: "", height: "" });

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
      generatePresentationOutline,
      toast,
      selectedModel,
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
      id: "presentation",
      label: "Presentation",
      icon: Presentation,
      comingSoon: true,
    },
    {
      id: "generic_design",
      label: "Generic Design",
      icon: Sparkles,
    },
  ];

  const selectedDesignType = designTypeItems.find(
    (item) => item.id === selectedDesignTypeId
  );

  // Orientation options for different design types
  const getOrientationOptions = (designTypeId: string | null) => {
    if (!designTypeId) return [];

    const options: { id: string; label: string; dimensions?: string }[] = [
      { id: "auto", label: "Auto" },
    ];

    switch (designTypeId) {
      case "video":
        options.push(
          { id: "reels", label: "Reels", dimensions: "9:16" },
          { id: "video", label: "Video", dimensions: "16:9" },
          { id: "square", label: "Square", dimensions: "1:1" },
          { id: "story", label: "Story", dimensions: "9:16" }
        );
        break;
      case "instagram_post":
        options.push(
          { id: "square", label: "Square", dimensions: "1:1" },
          { id: "portrait", label: "Portrait", dimensions: "4:5" },
          { id: "landscape", label: "Landscape", dimensions: "1.91:1" }
        );
        break;
      case "youtube_thumbnail":
        options.push({ id: "standard", label: "Standard", dimensions: "16:9" });
        break;
      case "facebook_post":
      case "facebook_cover":
        options.push(
          { id: "landscape", label: "Landscape", dimensions: "16:9" },
          { id: "square", label: "Square", dimensions: "1:1" }
        );
        break;
      case "poster":
      case "banner":
        options.push(
          { id: "portrait", label: "Portrait", dimensions: "2:3" },
          { id: "landscape", label: "Landscape", dimensions: "3:2" },
          { id: "square", label: "Square", dimensions: "1:1" }
        );
        break;
      case "presentation":
        options.push(
          { id: "standard", label: "Standard", dimensions: "16:9" },
          { id: "widescreen", label: "Widescreen", dimensions: "16:10" },
          { id: "square", label: "Square", dimensions: "1:1" }
        );
        break;
      case "flier":
        options.push(
          { id: "portrait", label: "Portrait", dimensions: "8.5:11" },
          { id: "landscape", label: "Landscape", dimensions: "11:8.5" }
        );
        break;
      default:
        options.push(
          { id: "portrait", label: "Portrait", dimensions: "2:3" },
          { id: "landscape", label: "Landscape", dimensions: "3:2" },
          { id: "square", label: "Square", dimensions: "1:1" }
        );
    }

    return options;
  };

  const orientationOptions = getOrientationOptions(selectedDesignTypeId);

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
              <span className='text-xs'>✨ Introducing Gennit v2</span>
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
              <span>Ai</span>

              <PointerHighlight
                rectangleClassName='
      bg-blue-100 dark:bg-blue-900
      border-blue-300 dark:border-blue-700
      rounded-base
      px-1 sm:px-2
      py-0.5
    '
                pointerClassName='text-blue-500 h-2.5 w-2.5 sm:h-3 sm:w-3'
                containerClassName='inline-flex items-center'
              >
                <span className='relative z-10 px-1 sm:px-2'>Design</span>
              </PointerHighlight>

              <span>& Marketing</span>
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
              Agents that designs, post, run ads, & handles <br /> your brand
              marketing across every channel.
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
                              Get a 50 free credit
                            </span>
                          )}
                        </div>

                        <div className='flex items-center gap-3'>
                          <BrandIndicator
                            onClick={() => {
                              setIsBrandSettingsOpen(!isBrandSettingsOpen);
                              setIsSettingsOpen(false);
                            }}
                          />
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
                    {/* <BorderBeam
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
                    /> */}
                    <div className='w-full min-w-0'>
                      <div className='relative flex flex-1 items-center'>
                        <textarea
                          ref={textareaRef}
                          id='chatinput'
                          value={isGenerating ? "" : inputValue}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyPress}
                          className='placeholder:text-muted-foreground/60 scrollbar-none flex max-h-[300px] min-h-[95px] w-full flex-1 resize-none border-none bg-transparent px-3 py-2 text-[16px] leading-snug transition-colors duration-150 ease-in-out outline-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base'
                          placeholder={
                            isGenerating
                              ? ""
                              : isListening
                                ? "Listening... speak now ✦"
                                : placeholderText
                                  ? placeholderText + " |"
                                  : "Ask Gennit to create a design... ✦"
                          }
                          disabled={isGenerating || isSubmitting}
                        />
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

                      {selectedDesignType && (
                        <Badge
                          variant='secondary'
                          className='flex h-7 cursor-pointer items-center gap-1.5 rounded-full border border-neutral-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-neutral-700 transition-colors hover:bg-neutral-200 md:text-xs dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10'
                          onClick={() => {
                            setIsSettingsOpen(true);
                            setShowOrientationSelection(false);
                          }}
                        >
                          <selectedDesignType.icon className='h-3 w-3' />
                          {selectedDesignType.label}
                          {selectedOrientation &&
                            selectedOrientation !== "custom" &&
                            selectedOrientation !== "auto" &&
                            selectedDesignTypeId !== "auto" && (
                              <span className='font-normal opacity-60'>
                                • {selectedOrientation}
                              </span>
                            )}
                        </Badge>
                      )}

                      <div className='ml-auto flex items-center gap-1.5'>
                        {brandSaveStatus !== "idle" && (
                          <div className='animate-in fade-in slide-in-from-right-1 flex items-center gap-1.5 px-1.5 text-[10px] font-medium duration-300'>
                            {brandSaveStatus === "saving" ? (
                              <>
                                <Loader2 className='text-primary size-3 animate-spin' />
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className='size-3 text-green-500' />
                              </>
                            )}
                          </div>
                        )}
                        <div className='flex items-center gap-1.5'>
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

                        <button
                          className='focus-visible:ring-ring text-muted-foreground hover:text-foreground hover:bg-primary/5 relative box-border hidden h-8 w-8 min-w-fit items-center justify-center gap-2 rounded-full bg-transparent !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/5'
                          type='button'
                          aria-label='Settings'
                          onClick={() => {
                            setIsSettingsOpen(!isSettingsOpen);
                            setShowOrientationSelection(true);
                            trackFeatureUsed("idea_advanced_settings_opened", {
                              source: "input_toolbar",
                            });
                          }}
                        >
                          <Settings className='size-4 shrink-0' />
                        </button>
                        <button
                          className={cn(
                            "focus-visible:ring-ring relative box-border inline-flex h-8 w-8 min-w-fit items-center justify-center gap-2 rounded-full bg-transparent !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                            isBrandSettingsOpen
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-primary/5 dark:hover:bg-white/5"
                          )}
                          type='button'
                          aria-label='Brand settings'
                          onClick={() => {
                            setIsBrandSettingsOpen(!isBrandSettingsOpen);
                            setIsSettingsOpen(false);
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
                              : "text-muted-foreground hover:text-foreground hover:bg-primary/5 dark:hover:bg-white/5"
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
                          className='focus-visible:ring-ring bg-primary text-primary-foreground relative ml-1 box-border inline-flex h-8 w-8 min-w-fit shrink-0 items-center justify-center gap-2 rounded-full !p-0 px-4 py-2 text-sm font-normal whitespace-nowrap shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.2),0_1px_2px_0_rgba(0,0,0,0.05)] brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out focus-visible:ring-1 focus-visible:outline-none active:brightness-[0.65] disabled:cursor-not-allowed disabled:opacity-50 disabled:brightness-100 dark:shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.2),inset_0_0_0_0.5px_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.05)]'
                          type='submit'
                          disabled={isSubmitDisabled}
                        >
                          {isGenerating || isSubmitting ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='currentColor'
                              viewBox='0 0 24 24'
                              width='100%'
                              height='100%'
                              className='size-5 shrink-0'
                              aria-hidden='true'
                            >
                              <path
                                fill='currentColor'
                                d='M11 19V7.415l-3.293 3.293a1 1 0 1 1-1.414-1.414l5-5 .074-.067a1 1 0 0 1 1.34.067l5 5a1 1 0 1 1-1.414 1.414L13 7.415V19a1 1 0 1 1-2 0'
                              />
                            </svg>
                          )}
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

            {/* Settings Dropdown - overlays content below input section */}

            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className='border-border absolute top-full right-0 left-0 z-50 mt-2 max-h-[450px] w-full overflow-y-auto rounded-xl border bg-white shadow-md dark:bg-black'
                >
                  <div className='flex flex-col p-4'>
                    {/* Header */}
                    <div className='border-border mb-4 flex items-center justify-between border-b pb-3'>
                      <div className='flex items-center gap-2'>
                        <h3 className='text-foreground text-sm font-semibold'>
                          Advanced Settings
                        </h3>
                      </div>
                      <button
                        type='button'
                        onClick={() => {
                          setIsSettingsOpen(false);
                          setShowOrientationSelection(false);
                        }}
                        className='flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                        aria-label='Close settings'
                      >
                        <X className='h-4 w-4' />
                      </button>
                    </div>

                    {/* Design Type Selection or Orientation Selection */}
                    <div className='flex-1'>
                      {!showOrientationSelection ? (
                        <div className='space-y-0.5'>
                          {designTypeItems.map((item) => {
                            const IconComponent = item.icon;
                            const isSelected = selectedDesignTypeId === item.id;
                            const isComingSoon = (item as any).comingSoon;
                            return (
                              <button
                                key={item.id}
                                type='button'
                                onClick={() => {
                                  if (isComingSoon) return;
                                  trackFeatureUsed(
                                    "idea_design_type_selected",
                                    {
                                      design_type: item.id,
                                    }
                                  );
                                  if (item.id == "video") {
                                    trackAppOpened(
                                      "video-generation",
                                      "AI Video",
                                      "idea_settings",
                                      {
                                        design_type: item.id,
                                      }
                                    );
                                    router.push(
                                      "/inspire/create?mode=ai-video-gen"
                                    );
                                  }
                                  // else if (item.id == "image") {
                                  //   router.push(
                                  //     "/inspire/create?mode=ai-image-gen",
                                  //   );
                                  // }
                                  else {
                                    setSelectedDesignTypeId(item.id);
                                    setSelectedOrientation(null);
                                    if (item.id === "auto") {
                                      setIsSettingsOpen(false);
                                      setShowOrientationSelection(false);
                                    } else {
                                      setShowOrientationSelection(true);
                                    }
                                  }
                                }}
                                disabled={isComingSoon}
                                className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                                  isComingSoon
                                    ? "cursor-not-allowed opacity-50"
                                    : isSelected
                                      ? "text-foreground"
                                      : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  disabled={isComingSoon}
                                  className='flex-shrink-0'
                                  onCheckedChange={() => {}}
                                />
                                <IconComponent
                                  className={`h-4 w-4 flex-shrink-0 ${
                                    isComingSoon
                                      ? "text-muted-foreground/50"
                                      : isSelected
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                  }`}
                                />
                                <span className='flex-1 text-sm font-normal'>
                                  {item.label}
                                </span>
                                {isComingSoon && (
                                  <Badge
                                    variant='secondary'
                                    className='bg-muted text-muted-foreground px-2 py-0.5 text-xs'
                                  >
                                    Coming Soon
                                  </Badge>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className='space-y-4'>
                          {/* Back button */}
                          <button
                            type='button'
                            onClick={() => {
                              setShowOrientationSelection(false);
                            }}
                            className='text-muted-foreground hover:text-foreground mb-2 flex items-center gap-2 text-sm transition-colors'
                          >
                            <svg
                              className='h-4 w-4'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M15 19l-7-7 7-7'
                              />
                            </svg>
                            Change Design Type
                          </button>
                          <div className='text-muted-foreground mb-3 px-3 text-xs'>
                            {selectedDesignType?.label} Settings
                          </div>

                          {/* Orientation Options */}
                          <div className='space-y-0.5'>
                            {orientationOptions.length > 0 && (
                              <>
                                <p className='text-muted-foreground mb-2 px-3 text-xs'>
                                  Select orientation
                                </p>
                                {orientationOptions.map((option) => (
                                  <button
                                    key={option.id}
                                    type='button'
                                    onClick={() => {
                                      setSelectedOrientation(option.id);
                                      trackFeatureUsed(
                                        "idea_orientation_selected",
                                        {
                                          orientation: option.id,
                                          design_type: selectedDesignTypeId,
                                        }
                                      );
                                      setIsSettingsOpen(false);
                                      setShowOrientationSelection(false);
                                    }}
                                    className={`flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors ${
                                      selectedOrientation === option.id
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                                  >
                                    <div className='flex items-center gap-3'>
                                      <Checkbox
                                        checked={
                                          selectedOrientation === option.id
                                        }
                                        className='flex-shrink-0'
                                        onCheckedChange={() => {}}
                                      />
                                      <span className='text-sm font-normal'>
                                        {option.label}
                                      </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                      {option.dimensions && (
                                        <span className='text-muted-foreground text-xs'>
                                          {option.dimensions}
                                        </span>
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </>
                            )}

                            {/* Custom Size Option */}
                            <div
                              className={`${orientationOptions.length > 0 ? "border-border mt-2 border-t pt-2" : ""}`}
                            >
                              <button
                                type='button'
                                onClick={() => {
                                  setSelectedOrientation("custom");
                                }}
                                className={`flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors ${
                                  selectedOrientation === "custom"
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                <div className='flex items-center gap-3'>
                                  <Checkbox
                                    checked={selectedOrientation === "custom"}
                                    className='flex-shrink-0'
                                    onCheckedChange={() => {}}
                                  />
                                  <span className='text-sm font-normal'>
                                    Custom Size
                                  </span>
                                </div>
                              </button>

                              {selectedOrientation === "custom" && (
                                <div className='space-y-2 px-3 py-3'>
                                  <div className='flex items-center gap-2'>
                                    <Input
                                      type='number'
                                      placeholder='px width'
                                      value={customSize.width}
                                      onChange={(e) =>
                                        setCustomSize((prev) => ({
                                          ...prev,
                                          width: e.target.value,
                                        }))
                                      }
                                      className='h-8 text-sm'
                                      min='1'
                                    />
                                    <span className='text-muted-foreground text-xs'>
                                      ×
                                    </span>
                                    <Input
                                      type='number'
                                      placeholder='px height'
                                      value={customSize.height}
                                      onChange={(e) =>
                                        setCustomSize((prev) => ({
                                          ...prev,
                                          height: e.target.value,
                                        }))
                                      }
                                      className='h-8 text-sm'
                                      min='1'
                                    />
                                  </div>
                                  <button
                                    type='button'
                                    onClick={() => {
                                      if (
                                        customSize.width &&
                                        customSize.height
                                      ) {
                                        setIsSettingsOpen(false);
                                        setShowOrientationSelection(false);
                                      }
                                    }}
                                    className='bg-foreground text-background w-full rounded px-3 py-1.5 text-xs transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
                                    disabled={
                                      !customSize.width || !customSize.height
                                    }
                                  >
                                    Apply
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isBrandSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className='border-border absolute top-full right-0 left-0 z-50 mx-auto mt-2 max-h-[500px] w-full max-w-md overflow-hidden rounded-xl border bg-white shadow-md md:mx-0 dark:bg-black'
                >
                  <div className='flex flex-col p-4'>
                    {/* Header */}
                    <div className='border-border mb-4 flex items-center justify-between border-b pb-3'>
                      <div className='flex items-center gap-2'>
                        <Palette className='text-primary h-4 w-4' />
                        <h3 className='text-foreground text-sm font-semibold'>
                          Brand Identity
                        </h3>
                      </div>
                      <button
                        type='button'
                        onClick={() => setIsBrandSettingsOpen(false)}
                        className='flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                        aria-label='Close brand settings'
                      >
                        <X className='h-4 w-4' />
                      </button>
                    </div>

                    <div className='custom-scrollbar max-h-[400px] overflow-y-auto'>
                      <BrandIdentityPanel />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Task Search - only show when not generating and no input */}
            <div className='absolute'></div>
          </motion.div>
        </div>

        {/* <div className="relative w-full max-w-4xl mx-auto mt-10 px-4">
       
          <div className="flex flex-row items-start gap-2 lg:gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide px-0 pl-0 pr-2 md:px-2">
            {IDEA_ITEMS.map((item) => (
              <IdeaItem key={item.id} item={item} />
            ))}
          </div>

          <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none rounded-r-3xl" />
        </div> */}

        {/* <div className='mx-auto mt-8 w-full max-w-4xl min-w-0 px-4'>
          <div className='mb-2 flex items-center justify-between'>
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
              className='pointer-events-auto col-start-1 row-start-1 w-full min-w-0'
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
                              className='focus-visible:ring-f-primary/30 group flex flex-col items-center justify-center gap-2 rounded-xl bg-transparent p-0 text-center focus-visible:ring-2 focus-visible:outline-none'
                              style={{ width: 128 }}
                            >
                              <span className='support-hover:group-hover:-translate-y-3 flex w-full flex-col items-center gap-2 transition-transform duration-300 active:-translate-y-3'>
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
                                      <div className='absolute top-1 left-2 z-10 flex flex-wrap gap-2'>
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
                                      className='relative h-full w-full rounded-lg object-cover'
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

        <section className='relative mt-5 space-y-4 border-t pt-6 pb-10 lg:mt-10'>
          <h2 className='text-muted-foreground text-center text-sm tracking-tight md:text-base'>
            with over 23+ marketing{" "}
            <Link
              href='/integrations'
              target='_blank'
              className='text-foreground text-sm font-medium md:text-base'
            >
              Integrations
            </Link>
          </h2>
          <div className='relative z-10 mx-auto max-w-5xl'>
            <div className='overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-4'>
              <div className='animate-marquee flex w-max gap-10 hover:[animation-play-state:paused]'>
                {[...INTEGRATION_BRANDS, ...INTEGRATION_BRANDS].map(
                  ({ name, Icon }, i) => (
                    <Link
                      key={`${name}-${i}`}
                      href={`/integrations#${name.toLowerCase().replace(/\s+/g, "-")}`}
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
      </div>

      {/* Presentation Organization Drawer */}
      <Drawer
        open={isPresentationDrawerOpen}
        onOpenChange={setIsPresentationDrawerOpen}
      >
        <DrawerContent className='max-h-[90vh] lg:px-82'>
          <DrawerHeader>
            <DrawerTitle>Organize Your Presentation</DrawerTitle>
            <DrawerDescription>
              Review and modify your presentation structure before generating
            </DrawerDescription>
          </DrawerHeader>
          <div className='space-y-4 overflow-y-auto px-4 pb-4'>
            {isGeneratingOutline ? (
              <div className='flex flex-col items-center justify-center py-12'>
                <Loader2 className='text-muted-foreground mb-4 h-8 w-8 animate-spin' />
                <p className='text-muted-foreground text-sm'>
                  Generating presentation outline...
                </p>
              </div>
            ) : (
              <div className='space-y-3'>
                {presentationOutline.map((slide, index) => (
                  <div
                    key={slide.id}
                    className='border-border bg-muted/30 rounded-lg border p-4'
                  >
                    <div className='flex items-start gap-3'>
                      <div className='flex flex-shrink-0 items-center gap-2 pt-1'>
                        <GripVertical className='text-muted-foreground h-4 w-4 cursor-move' />
                        <span className='text-muted-foreground w-8 text-xs font-medium'>
                          {index + 1}
                        </span>
                      </div>
                      <div className='flex-1 space-y-2'>
                        <Input
                          value={slide.title}
                          onChange={(e) => {
                            const newOutline = [...presentationOutline];
                            newOutline[index].title = e.target.value;
                            setPresentationOutline(newOutline);
                          }}
                          className='font-medium'
                          placeholder='Slide title'
                        />
                        <div className='space-y-1'>
                          {slide.content.map((point, pointIndex) => (
                            <div
                              key={pointIndex}
                              className='flex items-center gap-2'
                            >
                              <span className='text-muted-foreground text-xs'>
                                •
                              </span>
                              <Input
                                value={point}
                                onChange={(e) => {
                                  const newOutline = [...presentationOutline];
                                  newOutline[index].content[pointIndex] =
                                    e.target.value;
                                  setPresentationOutline(newOutline);
                                }}
                                className='text-sm'
                                placeholder='Bullet point'
                              />
                              <button
                                type='button'
                                onClick={() => {
                                  const newOutline = [...presentationOutline];
                                  newOutline[index].content.splice(
                                    pointIndex,
                                    1
                                  );
                                  setPresentationOutline(newOutline);
                                }}
                                className='text-muted-foreground hover:text-destructive transition-colors'
                              >
                                <Trash2 className='h-4 w-4' />
                              </button>
                            </div>
                          ))}
                          <button
                            type='button'
                            onClick={() => {
                              const newOutline = [...presentationOutline];
                              newOutline[index].content.push("");
                              setPresentationOutline(newOutline);
                            }}
                            className='text-muted-foreground hover:text-foreground mt-2 flex items-center gap-2 text-sm transition-colors'
                          >
                            <Plus className='h-4 w-4' />
                            Add bullet point
                          </button>
                        </div>
                      </div>
                      <button
                        type='button'
                        onClick={() => {
                          const newOutline = presentationOutline.filter(
                            (_, i) => i !== index
                          );
                          setPresentationOutline(newOutline);
                        }}
                        className='text-muted-foreground hover:text-destructive flex-shrink-0 transition-colors'
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type='button'
                  onClick={() => {
                    setPresentationOutline([
                      ...presentationOutline,
                      {
                        id: `slide-${presentationOutline.length + 1}`,
                        title: "",
                        content: [""],
                      },
                    ]);
                  }}
                  className='border-border text-muted-foreground hover:text-foreground hover:border-foreground/50 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 transition-colors'
                >
                  <Plus className='h-4 w-4' />
                  Add Slide
                </button>

                {/* Customization Sections */}
                <div className='border-border space-y-6 border-t pt-6'>
                  {/* Text Content Section */}
                  <div className='space-y-3'>
                    <div>
                      <h3 className='mb-1 text-sm font-semibold'>
                        Text Content
                      </h3>
                      <p className='text-muted-foreground text-xs'>
                        Amount of text per card
                      </p>
                    </div>
                    <div className='grid grid-cols-4 gap-2'>
                      {[
                        { id: "minimal", label: "Minimal", lines: 1 },
                        { id: "concise", label: "Concise", lines: 2 },
                        { id: "detailed", label: "Detailed", lines: 3 },
                        { id: "extensive", label: "Extensive", lines: 4 },
                      ].map((option) => (
                        <button
                          key={option.id}
                          type='button'
                          onClick={() =>
                            setTextAmount(
                              option.id as
                                | "minimal"
                                | "concise"
                                | "detailed"
                                | "extensive"
                            )
                          }
                          className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-all ${
                            textAmount === option.id
                              ? "border-foreground bg-foreground/5"
                              : "border-border hover:border-foreground/50"
                          }`}
                        >
                          <div className='flex flex-col gap-0.5'>
                            {Array.from({ length: option.lines }).map(
                              (_, i) => (
                                <div
                                  key={i}
                                  className={`h-1 rounded ${
                                    textAmount === option.id
                                      ? "bg-foreground w-8"
                                      : "bg-muted-foreground w-6"
                                  }`}
                                />
                              )
                            )}
                          </div>
                          <span className='text-xs font-medium'>
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme Selection */}
                  <div className='space-y-3'>
                    <div>
                      <h3 className='mb-1 text-sm font-semibold'>Visuals</h3>
                      <p className='text-muted-foreground text-xs'>Theme</p>
                    </div>
                    <div className='grid grid-cols-3 gap-2'>
                      {[
                        {
                          id: "bubble-gum",
                          label: "Bubble Gum",
                          bg: "bg-pink-900",
                          text: "text-pink-300",
                        },
                        {
                          id: "blueberry",
                          label: "Blueberry",
                          bg: "bg-purple-900",
                          text: "text-purple-300",
                        },
                        {
                          id: "onyx",
                          label: "Onyx",
                          bg: "bg-gray-900",
                          text: "text-gray-300",
                        },
                        {
                          id: "electric",
                          label: "Electric",
                          bg: "bg-blue-900",
                          text: "text-blue-300",
                        },
                        {
                          id: "moss-mist",
                          label: "Moss & Mist",
                          bg: "bg-green-900",
                          text: "text-green-300",
                        },
                        {
                          id: "wine",
                          label: "Wine",
                          bg: "bg-red-900",
                          text: "text-red-300",
                        },
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          type='button'
                          onClick={() => setSelectedTheme(theme.id)}
                          className={`relative rounded-lg border-2 p-3 transition-all ${
                            selectedTheme === theme.id
                              ? "border-foreground"
                              : "border-border hover:border-foreground/50"
                          }`}
                        >
                          <div
                            className={`${theme.bg} min-h-[60px] space-y-1 rounded p-2`}
                          >
                            <div
                              className={`${theme.text} text-xs font-medium`}
                            >
                              Title
                            </div>
                            <div className='text-xs text-white'>
                              Body & <span className={theme.text}>link</span>
                            </div>
                          </div>
                          <span className='mt-2 block text-center text-xs font-medium'>
                            {theme.label}
                          </span>
                          {selectedTheme === theme.id && (
                            <div className='bg-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full'>
                              <svg
                                className='text-background h-3 w-3'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={3}
                                  d='M5 13l4 4L19 7'
                                />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Style Selection */}
                  <div className='space-y-3'>
                    <div>
                      <h3 className='mb-1 text-sm font-semibold'>
                        Image art style
                      </h3>
                    </div>
                    <div className='grid grid-cols-3 gap-2'>
                      {[
                        { id: "illustration", label: "Illustration" },
                        { id: "photorealistic", label: "Photorealistic" },
                        { id: "abstract", label: "Abstract" },
                        { id: "3d", label: "3D" },
                        { id: "line-art", label: "Line Art" },
                      ].map((style) => (
                        <button
                          key={style.id}
                          type='button'
                          onClick={() =>
                            setImageStyle(
                              style.id as
                                | "illustration"
                                | "photorealistic"
                                | "abstract"
                                | "3d"
                                | "line-art"
                            )
                          }
                          className={`flex items-center justify-center gap-2 rounded-lg border p-3 transition-all ${
                            imageStyle === style.id
                              ? "border-foreground bg-foreground/5"
                              : "border-border hover:border-foreground/50"
                          }`}
                        >
                          <span className='text-sm font-medium'>
                            {style.label}
                          </span>
                          {imageStyle === style.id && (
                            <div className='bg-foreground flex h-4 w-4 items-center justify-center rounded-full'>
                              <svg
                                className='text-background h-2.5 w-2.5'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={3}
                                  d='M5 13l4 4L19 7'
                                />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Extra Keywords */}
                  <div className='space-y-2'>
                    <div>
                      <h3 className='mb-1 text-sm font-semibold'>
                        Add extra keywords
                      </h3>
                      <p className='text-muted-foreground text-xs'>
                        Optional: Add keywords to maintain consistency in image
                        style
                      </p>
                    </div>
                    <Input
                      value={extraKeywords}
                      onChange={(e) => setExtraKeywords(e.target.value)}
                      placeholder='e.g. minimalism, colorful'
                      className='text-sm'
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <DrawerFooter>
            <Button
              onClick={async () => {
                if (presentationOutline.length === 0) {
                  toast("Please add at least one slide");
                  return;
                }

                setIsSubmitting(true);
                try {
                  // Create presentation project
                  const presentationData = {
                    title: inputValue,
                    type: "presentation",
                    outline: presentationOutline,
                    orientation: selectedOrientation,
                    customSize:
                      customSize.width && customSize.height ? customSize : null,
                    textAmount,
                    theme: selectedTheme,
                    imageStyle,
                    extraKeywords: extraKeywords.trim() || undefined,
                  };

                  const response = await apiResponse.post(
                    "/presentation/create",
                    presentationData,
                    { withCredentials: true }
                  );

                  if (response.data && response.data.project) {
                    clearInput();
                    setSelectedDesignTypeId("generic_design");
                    setSelectedOrientation(null);
                    setShowOrientationSelection(false);
                    setCustomSize({ width: "", height: "" });
                    setPresentationOutline([]);
                    setIsPresentationDrawerOpen(false);

                    // Navigate to presentation studio
                    router.push(
                      `/presentation/${response.data.project._id || response.data.project.id}/studio`
                    );
                  }
                } catch (error: any) {
                  console.error("Failed to create presentation:", error);
                  toast("Failed to create presentation. Please try again.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className='w-full'
              disabled={isSubmitting || presentationOutline.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating...
                </>
              ) : (
                <>
                  <WandSparklesIcon className='mr-2 h-4 w-4' />
                  Generate Presentation
                </>
              )}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
