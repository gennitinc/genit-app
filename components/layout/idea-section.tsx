"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PointerHighlight } from "@/components/ui/pointer-highlight";

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
  Camera,
  Video,
  Image as ImageIcon,
  FileText,
  Youtube,
  Layout,
  Type,
  Presentation,
  Palette,
  Table,
  Music,
  Workflow,
  User,
  Volume2,
  Play,
  Grid2X2Plus,
  Paintbrush,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/AuthenticatedContext";
import { motion, AnimatePresence } from "framer-motion";
import { PricingDialog } from "@/components/common/pricing-dialog";
import { useProjectDesign } from "@/context/DesignProject";
import ShinyText from "../ui/shiny-text";
import HomeGrid from "../common/templateGrid";
import { HomeInfoGrid } from "../common/homeInfoGrid";
import AnimatedTooltipPreview from "../common/homeAgentsTooltip";
import { AIThinkingContent } from "../chat/messages";
import { ColorManagement } from "../chat/messages/color-management";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { apiResponse } from "@/utils/apiResponse";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { BorderBeam } from "../ui/border-beam";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { div } from "three/src/nodes/math/OperatorNode.js";
import { cn } from "@/lib/utils";

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
    label: "All Apps",
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
    label: "Design Chat",
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
  {
    id: "text-to-speech",
    label: "Text to Speech",
    href: "/apps/text-to-speech",
    icon: Volume2,
    bg: "rgba(20, 184, 166, 0.5)",
    lightBg: "rgba(20, 184, 166, 0.4)",
    darkBg: "rgba(20, 184, 166, 0.6)",
    iconColor: "text-black dark:text-white",
    hoverScale: "md:hover:scale-[1.2]",
  },
];

const IdeaItem = ({ item }: { item: IdeaItemData }) => {
  const Icon = item.icon;
  const isImage = item.isImage;

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex flex-col items-center group relative",
        item.id === "all-agents" ? "sticky left-0 z-30 pr-4 md:pr-0" : "z-10",
      )}
    >
      {/* Background Glow for All Apps when sticky */}
      {item.id === "all-agents" && (
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-background via-background to-transparent md:hidden -my-2" />
      )}

      <Link
        href={item.href || "#"}
        className="flex flex-col items-center relative z-20"
      >
        <div
          className={cn(
            "relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
            "shadow-md overflow-hidden",
            "group-hover:shadow-lg",
          )}
          style={{
            backgroundColor: item.lightBg,
          }}
        >
          {/* Dark-mode override via a pseudo-layer — swap background inline */}
          <div
            className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-300"
            style={{ backgroundColor: item.darkBg }}
          />

          {/* Subtle inner highlight */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-60 dark:opacity-30 pointer-events-none" />

          {/* Border: visible in light, subtle in dark */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/[0.07] dark:ring-white/[0.06]" />

          {isImage ? (
            <img
              src={Icon as string}
              className={cn(
                "relative z-10 w-7 h-7 object-contain transition-transform duration-300 group-hover:scale-110",
                item.imageClass,
              )}
              alt={item.label}
            />
          ) : (
            <Icon
              className={cn(
                "relative z-10 w-6 h-6 transition-transform duration-300 group-hover:scale-110",
                item.iconColor,
              )}
            />
          )}

          {item.hasDot && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#0F7FFF] rounded-full shadow-[0_0_8px_#0F7FFF] z-10" />
          )}

          {/* Border Beam Effect on Hover */}
          <BorderBeam
            size={60}
            duration={4}
            className="opacity-0 group-hover:opacity-100"
          />
        </div>

        <span className="mt-3 text-[12px] font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors whitespace-nowrap">
          {item.label}
        </span>
      </Link>

      {item.badge && (
        <div className="absolute -top-1 -right-1 z-30">
          <Badge className="bg-[#FFCB0F] text-black text-[9px] px-1.5 py-0 border-none shadow-sm">
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
  } = useProjectDesign();

  const [beamPosition, setBeamPosition] = useState({ x: 50, y: 50 });
  const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDesignTypeId, setSelectedDesignTypeId] =
    useState<string>("flier");
  const [selectedOrientation, setSelectedOrientation] = useState<string | null>(
    "portrait",
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
  const [imageRotations] = useState(() =>
    images.map(() => Math.random() * 20 - 10),
  );

  const [initialInputValue, setInitialInputValue] = useState("");

  const { isListening, startListening, stopListening, isSupported } =
    useSpeechToText({
      onTranscript: (transcript) => {
        setInputValue(
          initialInputValue ? `${initialInputValue} ${transcript}` : transcript,
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

  // Effect to resize textarea on inputValue change
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
    [setInputValue],
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
    [attachedFiles.length, processFiles],
  );

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      handleFileProcess(files);
      e.target.value = "";
    },
    [handleFileProcess],
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
    [handleFileProcess],
  );

  // Generate presentation outline using AI
  const generatePresentationOutline = useCallback(
    async (prompt: string) => {
      setIsGeneratingOutline(true);
      try {
        const response = await apiResponse.post(
          "/presentation/generate-outline",
          { prompt },
          { withCredentials: true },
        );

        if (response.data && response.data.outline) {
          const outline = response.data.outline.map(
            (slide: any, index: number) => ({
              id: `slide-${index + 1}`,
              title: slide.title || `Slide ${index + 1}`,
              content: slide.content || slide.bulletPoints || [],
            }),
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
    [toast],
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

      // Check if selected design type is coming soon
      const selectedItem = designTypeItems.find(
        (item) => item.id === selectedDesignTypeId,
      );
      if (selectedItem && (selectedItem as any).comingSoon) {
        toast(`${selectedItem.label} is coming soon.`);
        return;
      }

      if (isGenerating || isSubmitting) return;

      // Handle presentation projects differently
      if (selectedDesignTypeId === "presentation") {
        setIsSubmitting(true);
        setInputError(null);
        await generatePresentationOutline(inputValue);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(true);
      setInputError(null);

      try {
        const res = await createProject(
          inputValue,
          attachedFiles as any,
          undefined,
          selectedDesignTypeId || undefined,
          selectedOrientation || undefined,
          customSize.width && customSize.height ? customSize : undefined,
          {
            finalizedSelections: {
              selectedColorScales,
              primaryFont,
            },
          },
        );

        console.log("Project creation result:", res);

        clearInput();
        setSelectedDesignTypeId("flier");
        setSelectedOrientation(null);
        setShowOrientationSelection(false);
        setCustomSize({ width: "", height: "" });

        if (res.type && res.id) {
          // Redirect to chat page with project ID
          router.push(`/chat/${res.id}`);
        }
      } catch (error: any) {
        console.error("Failed to create project:", error);
        setInputError(
          error.message || "Failed to create project. Please try again.",
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
    ],
  );

  // Handle quick task selection
  const handleQuickTaskSelect = useCallback(
    (text: string, description?: string) => {
      const prompt = description ? `${text}: ${description}` : text;
      setInputValue(prompt);
      setInputError(null);
      textareaRef.current?.focus();
    },
    [setInputValue],
  );

  // Handle file removal
  const handleFileRemove = useCallback(
    (index: number) => {
      removeAttachedFile(index);
      setInputError(null);
    },
    [removeAttachedFile],
  );

  // Handle key press
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        handleSubmit(e as any);
      }
    },
    [handleSubmit],
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
    (item) => item.id === selectedDesignTypeId,
  );

  // Orientation options for different design types
  const getOrientationOptions = (designTypeId: string | null) => {
    if (!designTypeId) return [];

    const options: { id: string; label: string; dimensions?: string }[] = [];

    switch (designTypeId) {
      case "video":
        options.push(
          { id: "reels", label: "Reels", dimensions: "9:16" },
          { id: "video", label: "Video", dimensions: "16:9" },
          { id: "square", label: "Square", dimensions: "1:1" },
          { id: "story", label: "Story", dimensions: "9:16" },
        );
        break;
      case "instagram_post":
        options.push(
          { id: "square", label: "Square", dimensions: "1:1" },
          { id: "portrait", label: "Portrait", dimensions: "4:5" },
          { id: "landscape", label: "Landscape", dimensions: "1.91:1" },
        );
        break;
      case "youtube_thumbnail":
        options.push({ id: "standard", label: "Standard", dimensions: "16:9" });
        break;
      case "facebook_post":
      case "facebook_cover":
        options.push(
          { id: "landscape", label: "Landscape", dimensions: "16:9" },
          { id: "square", label: "Square", dimensions: "1:1" },
        );
        break;
      case "poster":
      case "banner":
        options.push(
          { id: "portrait", label: "Portrait", dimensions: "2:3" },
          { id: "landscape", label: "Landscape", dimensions: "3:2" },
          { id: "square", label: "Square", dimensions: "1:1" },
        );
        break;
      case "presentation":
        options.push(
          { id: "standard", label: "Standard", dimensions: "16:9" },
          { id: "widescreen", label: "Widescreen", dimensions: "16:10" },
          { id: "square", label: "Square", dimensions: "1:1" },
        );
        break;
      case "flier":
        options.push(
          { id: "portrait", label: "Portrait", dimensions: "8.5:11" },
          { id: "landscape", label: "Landscape", dimensions: "11:8.5" },
        );
        break;
      default:
        options.push(
          { id: "portrait", label: "Portrait", dimensions: "2:3" },
          { id: "landscape", label: "Landscape", dimensions: "3:2" },
          { id: "square", label: "Square", dimensions: "1:1" },
        );
    }

    return options;
  };

  const orientationOptions = getOrientationOptions(selectedDesignTypeId);

  return (
    <div className="w-full md:px-4">
      <div className="w-full mx-auto space-y-2 lg:space-y-6 items-center justify-center flex flex-col ">
        {/* Header */}
        <div className="text-center space-y-2">
          {/* <AnimatedTooltipPreview /> */}
          <motion.div
            className="mt-2 mb-2 md:mt-8 lg:mb-6 lg:mt-24 flex flex-col items-center justify-center"
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="mb-2 flex items-center gap-1 text-3xl font-semibold leading-none text-foreground sm:text-3xl md:mb-2.5 md:gap-0 md:text-5xl mt-8"
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
              Idea to
              <PointerHighlight
                rectangleClassName="bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 leading-loose"
                pointerClassName="text-blue-500 h-3 w-3"
                containerClassName="inline-block mx-1"
              >
                <span className="relative z-10"> Design </span>
              </PointerHighlight>{" "}
              in 10.s
            </motion.h1>
            <motion.p
              className="mb-6 max-w-[25ch] text-center text-lg leading-tight text-foreground/65 md:max-w-full md:text-xl"
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
              Design graphics, videos, and assets with AI.
            </motion.p>
          </motion.div>
        </div>

        <div className="flex flex-row items-center justify-center w-full">
          <motion.div
            className="flex flex-col relative w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative">
              {/* File Attachments */}
              {attachedFiles.length > 0 && !isGenerating && (
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
                                  (e.target as HTMLImageElement).src,
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
                            <div className="bg-background border border-border rounded-lg shadow-md p-2">
                              <img
                                src={
                                  URL.createObjectURL(file) ||
                                  "/placeholder.svg"
                                }
                                alt={file.name}
                                className="max-w-[200px] max-h-[150px] object-contain rounded"
                                onLoad={(e) =>
                                  URL.revokeObjectURL(
                                    (e.target as HTMLImageElement).src,
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
              className="relative flex w-full max-w-3xl mx-auto"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {/* Animated beam with smoother transitions */}
              <motion.div
                className="absolute w-full md:w-40 h-40 rounded-full bg-neutral-400/20 dark:bg-neutral-500/20 blur-3xl pointer-events-none z-0"
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

              <div className="flex w-full flex-col items-center z-10">
                <div className="relative size-full">
                  {/* Credit info and typing indicator */}
                  <div className="flex items-center mx-4 justify-between text-sm mt-3 mb-2">
                    {!isGenerating && (
                      <div className="flex items-center gap-1 justify-between w-full">
                        <div className="text-muted-foreground dark:text-zinc-400 flex items-center">
                          <Zap className="inline-block w-3 h-3 text-emerald-500 mr-2" />
                          {user ? (
                            <span className="text-xs text-muted-foreground">
                              {(user?.creditsRemaining ?? 0).toLocaleString()}{" "}
                              Credits left
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
                      <p className="text-xs text-red-500 font-medium flex items-center mb-2 mx-4">
                        <AlertCircle className="size-3.5 mr-2" />
                        {inputError || error}
                      </p>
                    )}
                  </AnimatePresence>

                  <form
                    id="chat-input"
                    onSubmit={
                      user
                        ? handleSubmit
                        : (e) => {
                            e.preventDefault();
                            router.push("/signin");
                          }
                    }
                    className="group flex flex-col gap-2 p-3 w-full rounded-lg border border-white bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl text-base shadow-md ring-1 ring-black/[0.08] transition-all focus-within:ring-black/[0.16] hover:ring-black/[0.12] focus-within:hover:ring-black/[0.16] dark:border-white/[0.08] dark:ring-black/[0.88] dark:focus-within:ring-black/[0.96] duration-150 ease-in-out relative"
                  >
                    <div className="min-w-0 w-full">
                      <div className="relative flex flex-1 items-center">
                        <textarea
                          ref={textareaRef}
                          id="chatinput"
                          value={isGenerating ? "" : inputValue}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyPress}
                          className="flex w-full px-3 py-2 transition-colors duration-150 ease-in-out placeholder:text-muted-foreground/60 resize-none border-none text-[16px] leading-snug md:text-base focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[95px] max-h-[300px] bg-transparent flex-1 outline-none scrollbar-none"
                          placeholder={
                            isGenerating
                              ? ""
                              : isListening
                                ? "Listening... speak now ✦"
                                : placeholderText
                                  ? placeholderText + " ✦"
                                  : "Ask Gennit to create a design... ✦"
                          }
                          disabled={isGenerating || isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="flex-wrap gap-1 flex items-center">
                      <button
                        className="relative box-border inline-flex min-w-fit items-center justify-center gap-2 whitespace-nowrap text-sm font-normal brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.2),0_1px_2px_0_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.2),inset_0_0_0_0.5px_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.05)] active:brightness-[0.65] disabled:brightness-100 px-4 py-2 rounded-full !p-0 bg-secondary text-primary h-8 w-8"
                        type="button"
                        aria-label="Attach files"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isGenerating || isSubmitting}
                      >
                        <Plus className="shrink-0 size-5" />
                      </button>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileInputChange}
                        disabled={isGenerating || isSubmitting}
                        className="hidden"
                        accept="image/*,video/*"
                      />

                      {selectedDesignType && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] md:text-xs px-2 py-0.5 h-7 font-medium flex items-center gap-1.5 bg-zinc-100 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 cursor-pointer hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors rounded-full"
                          onClick={() => {
                            setIsSettingsOpen(true);
                            setShowOrientationSelection(false);
                          }}
                        >
                          <selectedDesignType.icon className="w-3 h-3" />
                          {selectedDesignType.label}
                          {selectedOrientation &&
                            selectedOrientation !== "custom" && (
                              <span className="opacity-60 font-normal">
                                • {selectedOrientation}
                              </span>
                            )}
                        </Badge>
                      )}

                      <div className="ml-auto flex items-center gap-1.5">
                        <button
                          className="relative box-border inline-flex min-w-fit items-center justify-center gap-2 whitespace-nowrap text-sm font-normal brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-transparent px-4 py-2 rounded-full !p-0 text-muted-foreground hover:text-foreground hover:bg-primary/5 dark:hover:bg-white/5 h-8 w-8"
                          type="button"
                          aria-label="Settings"
                          onClick={() => {
                            setIsSettingsOpen(!isSettingsOpen);
                            setShowOrientationSelection(true);
                          }}
                        >
                          <Settings className="shrink-0 size-4" />
                        </button>
                        <button
                          className={cn(
                            "relative box-border inline-flex min-w-fit items-center justify-center gap-2 whitespace-nowrap text-sm font-normal brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-transparent px-4 py-2 rounded-full !p-0 h-8 w-8",
                            isBrandSettingsOpen
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-primary/5 dark:hover:bg-white/5",
                          )}
                          type="button"
                          aria-label="Brand settings"
                          onClick={() => {
                            setIsBrandSettingsOpen(!isBrandSettingsOpen);
                            setIsSettingsOpen(false);
                          }}
                        >
                          <Palette className="shrink-0 size-4" />
                        </button>
                        <button
                          className={`relative box-border inline-flex min-w-fit items-center justify-center gap-2 whitespace-nowrap text-sm font-normal brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-transparent px-4 py-2 rounded-full !p-0 h-8 w-8 ${
                            isListening
                              ? "text-red-500 bg-red-500/10 animate-pulse"
                              : "text-muted-foreground hover:text-foreground hover:bg-primary/5 dark:hover:bg-white/5"
                          }`}
                          type="button"
                          aria-label={
                            isListening ? "Stop listening" : "Voice input"
                          }
                          onClick={handleMicClick}
                          disabled={
                            !isSupported || isGenerating || isSubmitting
                          }
                        >
                          <Mic className="shrink-0 size-4" />
                        </button>
                        <button
                          className="relative box-border inline-flex min-w-fit items-center justify-center gap-2 whitespace-nowrap text-sm font-normal brightness-100 transition-[background-color,opacity,color,filter] duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.2),0_1px_2px_0_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.2),inset_0_0_0_0.5px_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.05)] active:brightness-[0.65] disabled:brightness-100 px-4 py-2 rounded-full !p-0 bg-primary text-primary-foreground h-8 w-8 shrink-0 ml-1"
                          type="submit"
                          disabled={isSubmitDisabled}
                        >
                          <BorderBeam
                            duration={6}
                            size={40}
                            className="from-transparent via-red-500 to-transparent"
                          />
                          <BorderBeam
                            duration={6}
                            delay={3}
                            size={40}
                            borderWidth={2}
                            className="from-transparent via-blue-500 to-transparent"
                          />
                          {isGenerating || isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              width="100%"
                              height="100%"
                              className="shrink-0 size-5"
                              aria-hidden="true"
                            >
                              <path
                                fill="currentColor"
                                d="M11 19V7.415l-3.293 3.293a1 1 0 1 1-1.414-1.414l5-5 .074-.067a1 1 0 0 1 1.34.067l5 5a1 1 0 1 1-1.414 1.414L13 7.415V19a1 1 0 1 1-2 0"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    {!user && (
                      <div
                        className="w-full h-full absolute top-0 left-0 right-0 bottom-0 z-50  bg-transparent"
                        onClick={() => router.push("/signin")}
                      ></div>
                    )}
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
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-black border border-border rounded-xl shadow-md z-50 max-h-[300px] w-fit overflow-hidden"
                >
                  <div className="flex flex-col p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">
                          Advanced Settings
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSettingsOpen(false);
                          setShowOrientationSelection(false);
                        }}
                        className="flex items-center justify-center w-6 h-6 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        aria-label="Close settings"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Design Type Selection or Orientation Selection */}
                    <div className="overflow-y-auto max-h-[320px]">
                      {!showOrientationSelection ? (
                        <div className="space-y-0.5">
                          {designTypeItems.map((item) => {
                            const IconComponent = item.icon;
                            const isSelected = selectedDesignTypeId === item.id;
                            const isComingSoon = (item as any).comingSoon;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  if (isComingSoon) return;
                                  if (item.id == "video") {
                                    router.push(
                                      "/inspire/create?mode=ai-video-gen",
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
                                    setShowOrientationSelection(true);
                                  }
                                }}
                                disabled={isComingSoon}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                                  isComingSoon
                                    ? "opacity-50 cursor-not-allowed"
                                    : isSelected
                                      ? "text-foreground"
                                      : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  disabled={isComingSoon}
                                  className="flex-shrink-0"
                                  onCheckedChange={() => {}}
                                />
                                <IconComponent
                                  className={`w-4 h-4 flex-shrink-0 ${
                                    isComingSoon
                                      ? "text-muted-foreground/50"
                                      : isSelected
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                  }`}
                                />
                                <span className="text-sm font-normal flex-1">
                                  {item.label}
                                </span>
                                {isComingSoon && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-2 py-0.5 bg-muted text-muted-foreground"
                                  >
                                    Coming Soon
                                  </Badge>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Back button */}
                          <button
                            type="button"
                            onClick={() => {
                              setShowOrientationSelection(false);
                            }}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                            Change Design Type
                          </button>
                          <div className="text-xs text-muted-foreground mb-3 px-3">
                            {selectedDesignType?.label} Settings
                          </div>

                          {/* Orientation Options */}
                          <div className="space-y-0.5">
                            {orientationOptions.length > 0 && (
                              <>
                                <p className="text-xs text-muted-foreground mb-2 px-3">
                                  Select orientation
                                </p>
                                {orientationOptions.map((option) => (
                                  <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedOrientation(option.id);
                                      setIsSettingsOpen(false);
                                      setShowOrientationSelection(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors ${
                                      selectedOrientation === option.id
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <Checkbox
                                        checked={
                                          selectedOrientation === option.id
                                        }
                                        className="flex-shrink-0"
                                        onCheckedChange={() => {}}
                                      />
                                      <span className="text-sm font-normal">
                                        {option.label}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {option.dimensions && (
                                        <span className="text-xs text-muted-foreground">
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
                              className={`${orientationOptions.length > 0 ? "pt-2 border-t border-border mt-2" : ""}`}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrientation("custom");
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors ${
                                  selectedOrientation === "custom"
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    checked={selectedOrientation === "custom"}
                                    className="flex-shrink-0"
                                    onCheckedChange={() => {}}
                                  />
                                  <span className="text-sm font-normal">
                                    Custom Size
                                  </span>
                                </div>
                              </button>

                              {selectedOrientation === "custom" && (
                                <div className="px-3 py-3 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="number"
                                      placeholder="px width"
                                      value={customSize.width}
                                      onChange={(e) =>
                                        setCustomSize((prev) => ({
                                          ...prev,
                                          width: e.target.value,
                                        }))
                                      }
                                      className="h-8 text-sm"
                                      min="1"
                                    />
                                    <span className="text-xs text-muted-foreground">
                                      ×
                                    </span>
                                    <Input
                                      type="number"
                                      placeholder="px height"
                                      value={customSize.height}
                                      onChange={(e) =>
                                        setCustomSize((prev) => ({
                                          ...prev,
                                          height: e.target.value,
                                        }))
                                      }
                                      className="h-8 text-sm"
                                      min="1"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (
                                        customSize.width &&
                                        customSize.height
                                      ) {
                                        setIsSettingsOpen(false);
                                        setShowOrientationSelection(false);
                                      }
                                    }}
                                    className="w-full text-xs px-3 py-1.5 bg-foreground text-background rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-black border border-border rounded-xl shadow-md z-50 max-h-[500px] w-full max-w-md mx-auto md:mx-0 overflow-hidden"
                >
                  <div className="flex flex-col p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">
                          Brand Identity
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsBrandSettingsOpen(false)}
                        className="flex items-center justify-center w-6 h-6 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        aria-label="Close brand settings"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
                      <ColorManagement />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Task Search - only show when not generating and no input */}
            <div className="absolute"></div>
          </motion.div>
        </div>

        <div className="relative w-full max-w-4xl mx-auto mb-8 px-4">
          {/* Scroll Area */}
          <div className="flex flex-row items-start gap-2 lg:gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide px-2">
            {IDEA_ITEMS.map((item) => (
              <IdeaItem key={item.id} item={item} />
            ))}
          </div>

          {/* Right Edge Fade */}
          <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none rounded-r-3xl" />
        </div>
      </div>

      {/* Presentation Organization Drawer */}
      <Drawer
        open={isPresentationDrawerOpen}
        onOpenChange={setIsPresentationDrawerOpen}
      >
        <DrawerContent className="max-h-[90vh] lg:px-82">
          <DrawerHeader>
            <DrawerTitle>Organize Your Presentation</DrawerTitle>
            <DrawerDescription>
              Review and modify your presentation structure before generating
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-4 space-y-4">
            {isGeneratingOutline ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Generating presentation outline...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {presentationOutline.map((slide, index) => (
                  <div
                    key={slide.id}
                    className="border border-border rounded-lg p-4 bg-muted/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2 flex-shrink-0 pt-1">
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                        <span className="text-xs font-medium text-muted-foreground w-8">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          value={slide.title}
                          onChange={(e) => {
                            const newOutline = [...presentationOutline];
                            newOutline[index].title = e.target.value;
                            setPresentationOutline(newOutline);
                          }}
                          className="font-medium"
                          placeholder="Slide title"
                        />
                        <div className="space-y-1">
                          {slide.content.map((point, pointIndex) => (
                            <div
                              key={pointIndex}
                              className="flex items-center gap-2"
                            >
                              <span className="text-muted-foreground text-xs">
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
                                className="text-sm"
                                placeholder="Bullet point"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newOutline = [...presentationOutline];
                                  newOutline[index].content.splice(
                                    pointIndex,
                                    1,
                                  );
                                  setPresentationOutline(newOutline);
                                }}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newOutline = [...presentationOutline];
                              newOutline[index].content.push("");
                              setPresentationOutline(newOutline);
                            }}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add bullet point
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newOutline = presentationOutline.filter(
                            (_, i) => i !== index,
                          );
                          setPresentationOutline(newOutline);
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
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
                  className="w-full border-2 border-dashed border-border rounded-lg p-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Slide
                </button>

                {/* Customization Sections */}
                <div className="pt-6 border-t border-border space-y-6">
                  {/* Text Content Section */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold mb-1">
                        Text Content
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Amount of text per card
                      </p>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: "minimal", label: "Minimal", lines: 1 },
                        { id: "concise", label: "Concise", lines: 2 },
                        { id: "detailed", label: "Detailed", lines: 3 },
                        { id: "extensive", label: "Extensive", lines: 4 },
                      ].map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            setTextAmount(
                              option.id as
                                | "minimal"
                                | "concise"
                                | "detailed"
                                | "extensive",
                            )
                          }
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                            textAmount === option.id
                              ? "border-foreground bg-foreground/5"
                              : "border-border hover:border-foreground/50"
                          }`}
                        >
                          <div className="flex flex-col gap-0.5">
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
                              ),
                            )}
                          </div>
                          <span className="text-xs font-medium">
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme Selection */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Visuals</h3>
                      <p className="text-xs text-muted-foreground">Theme</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
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
                          type="button"
                          onClick={() => setSelectedTheme(theme.id)}
                          className={`relative p-3 rounded-lg border-2 transition-all ${
                            selectedTheme === theme.id
                              ? "border-foreground"
                              : "border-border hover:border-foreground/50"
                          }`}
                        >
                          <div
                            className={`${theme.bg} rounded p-2 space-y-1 min-h-[60px]`}
                          >
                            <div
                              className={`${theme.text} text-xs font-medium`}
                            >
                              Title
                            </div>
                            <div className="text-white text-xs">
                              Body & <span className={theme.text}>link</span>
                            </div>
                          </div>
                          <span className="text-xs font-medium mt-2 block text-center">
                            {theme.label}
                          </span>
                          {selectedTheme === theme.id && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-foreground rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-background"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Style Selection */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold mb-1">
                        Image art style
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "illustration", label: "Illustration" },
                        { id: "photorealistic", label: "Photorealistic" },
                        { id: "abstract", label: "Abstract" },
                        { id: "3d", label: "3D" },
                        { id: "line-art", label: "Line Art" },
                      ].map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() =>
                            setImageStyle(
                              style.id as
                                | "illustration"
                                | "photorealistic"
                                | "abstract"
                                | "3d"
                                | "line-art",
                            )
                          }
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                            imageStyle === style.id
                              ? "border-foreground bg-foreground/5"
                              : "border-border hover:border-foreground/50"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {style.label}
                          </span>
                          {imageStyle === style.id && (
                            <div className="w-4 h-4 rounded-full bg-foreground flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-background"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Extra Keywords */}
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-sm font-semibold mb-1">
                        Add extra keywords
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Optional: Add keywords to maintain consistency in image
                        style
                      </p>
                    </div>
                    <Input
                      value={extraKeywords}
                      onChange={(e) => setExtraKeywords(e.target.value)}
                      placeholder="e.g. minimalism, colorful"
                      className="text-sm"
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
                    { withCredentials: true },
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
                      `/presentation/${response.data.project._id || response.data.project.id}/studio`,
                    );
                  }
                } catch (error: any) {
                  console.error("Failed to create presentation:", error);
                  toast("Failed to create presentation. Please try again.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="w-full"
              disabled={isSubmitting || presentationOutline.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <WandSparklesIcon className="w-4 h-4 mr-2" />
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
