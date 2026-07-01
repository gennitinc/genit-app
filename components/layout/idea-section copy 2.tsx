"use client";

import { AIThinkingContent } from "../chat/messages";
import AnimatedTooltipPreview from "../common/homeAgentsTooltip";
import { HomeInfoGrid } from "../common/homeInfoGrid";
import HomeGrid from "../common/templateGrid";
import { BorderBeam } from "../ui/border-beam";
import ShinyText from "../ui/shiny-text";
import { PricingDialog } from "@/components/common/pricing-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Camera,
  CircleFadingArrowUp,
  FileText,
  Image,
  Image as ImageIcon,
  Layout,
  Loader2,
  MessageSquare,
  Mic,
  PaperclipIcon,
  Presentation,
  Settings,
  Settings2,
  Sparkles,
  TrendingUp,
  Type,
  Users,
  Video,
  WandSparklesIcon,
  X,
  XIcon,
  Youtube,
  Zap,
} from "lucide-react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

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

const images = [
  "https://img.freepik.com/free-photo/smiley-woman-outdoors-city_23-2148774316.jpg?ga=GA1.1.1557987898.1750353078&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/freedom-concept-with-hiker-mountain_23-2148107064.jpg?ga=GA1.1.1557987898.1750353078&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-vector/woman-doodle-drawing-sketch-illustration-vector_53876-118.jpg?ga=GA1.1.1557987898.1750353078&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/young-hispanic-man-with-beard-wearing-red-t-shirt-neutral-background-looking-side-relax-profile-pose-with-natural-face-with-confident-smile_839833-2174.jpg?ga=GA1.1.1557987898.1750353078&w=740",
  "https://img.freepik.com/free-photo/smiling-man_1098-15443.jpg?ga=GA1.1.1557987898.1750353078&w=740",
];

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
  } = useProjectDesign();

  const [beamPosition, setBeamPosition] = useState({ x: 50, y: 50 });
  const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDesignTypeId, setSelectedDesignTypeId] =
    useState<string>("flier");
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
    images.map(() => Math.random() * 20 - 10)
  );

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
        (item) => item.id === selectedDesignTypeId
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
          customSize.width && customSize.height ? customSize : undefined
        );

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
      CircleFadingArrowUp,
    },
  ];

  const selectedDesignType = designTypeItems.find(
    (item) => item.id === selectedDesignTypeId
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
    <div className='lg:w-full'>
      <div className='mx-auto max-w-4xl space-y-6'>
        {/* Header */}
        <div className='space-y-2 text-center'>
          <AnimatedTooltipPreview />
          <motion.div
            className='mt-2 mb-6 flex flex-col items-center justify-center md:mb-8 lg:mb-12'
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.6 }}
          >
            <motion.h1
              className='mt-8 text-center text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl'
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
              Idea to
              <PointerHighlight
                rectangleClassName='bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 leading-loose'
                pointerClassName='text-blue-500 h-3 w-3'
                containerClassName='inline-block mx-1'
              >
                <span className='relative z-10'> Design </span>
              </PointerHighlight>{" "}
              in 10.s
            </motion.h1>
            <motion.p
              className='mt-4 max-w-lg text-center text-gray-600 dark:text-gray-300'
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
              Design graphics, videos, and assets with AI.
            </motion.p>
          </motion.div>
        </div>

        <div className='flex flex-row items-center justify-center'>
          {!user ? (
            <>
              <button
                className='group relative flex w-[240px] cursor-pointer items-center justify-between rounded-full border-none bg-neutral-100 shadow-md dark:bg-neutral-700'
                onClick={() => router.push("/signin")}
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

                <span className='flex w-[calc(240px-45px)] items-center justify-center text-sm tracking-[1.2px] text-black dark:text-white'>
                  Start designing!
                </span>

                <span className='flex h-[45px] w-[45px] items-center justify-center rounded-full border-[3px] border-[#1d2129] bg-[#f59aff]'>
                  <svg
                    className='group-hover:animate-arrow transition-all duration-[1500ms]'
                    width='16'
                    height='19'
                    viewBox='0 0 16 19'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <circle cx='1.61321' cy='1.61321' r='1.5' fill='black' />
                    <circle cx='5.73583' cy='1.61321' r='1.5' fill='black' />
                    <circle cx='5.73583' cy='5.5566' r='1.5' fill='black' />
                    <circle cx='9.85851' cy='5.5566' r='1.5' fill='black' />
                    <circle cx='9.85851' cy='9.5' r='1.5' fill='black' />
                    <circle cx='13.9811' cy='9.5' r='1.5' fill='black' />
                    <circle cx='5.73583' cy='13.4434' r='1.5' fill='black' />
                    <circle cx='9.85851' cy='13.4434' r='1.5' fill='black' />
                    <circle cx='1.61321' cy='17.3868' r='1.5' fill='black' />
                    <circle cx='5.73583' cy='17.3868' r='1.5' fill='black' />
                  </svg>
                </span>
              </button>

              <style jsx>{`
                @keyframes arrow {
                  0% {
                    opacity: 0;
                    margin-left: 0px;
                  }
                  100% {
                    opacity: 1;
                    margin-left: 10px;
                  }
                }
                .animate-arrow {
                  animation: arrow 1s linear infinite;
                }
              `}</style>
            </>
          ) : (
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
                className="before:bg-radial-gradient relative flex w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-300 via-gray-200 to-gray-100 p-[1.5px] shadow-lg before:absolute before:top-[-10px] before:left-[-10px] before:h-[30px] before:blur-[1px] before:content-[''] md:before:w-[40vh] dark:from-[#7e7e7e] dark:via-[#363636] dark:to-[#363636]"
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
                <div
                  ref={innerContainerRef}
                  className='relative z-10 flex w-full flex-col overflow-hidden rounded-[15px] bg-white/90 shadow-inner backdrop-blur-sm dark:bg-black/80'
                >
                  {/* Credit info and typing indicator */}
                  <div className='mx-4 mt-3 mb-2 flex items-center justify-between text-sm'>
                    {!isGenerating && (
                      <div className='flex w-full items-center justify-between gap-1'>
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

                        {/* Conditional CTA when credits are zero */}
                        {user && (user?.creditsRemaining ?? 0) === 0 && (
                          <div>
                            {String(user?.userPlan) === "Basic" ? (
                              <span
                                className='cursor-pointer'
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
                      <p className='mx-4 mt-2 flex items-center text-xs font-medium text-red-500'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='14px'
                          height='14px'
                          fill='currentColor'
                          className='mr-2'
                          viewBox='0 0 512 512'
                        >
                          <path
                            d='M256 0C114.833 0 0 114.833 0 256s114.833 256 256 256 256-114.853 256-256S397.167 0 256 0zm0 472.341c-119.275 0-216.341-97.046-216.341-216.341S136.725 39.659 256 39.659c119.295 0 216.341 97.046 216.341 216.341S375.275 472.341 256 472.341z'
                            data-original='#000000'
                          />
                          <path
                            d='M373.451 166.965c-8.071-7.337-20.623-6.762-27.999 1.348L224.491 301.509 166.053 242.1c-7.714-7.813-20.246-7.932-28.039-.238-7.813 7.674-7.932 20.226-.238 28.039l73.151 74.361a19.804 19.804 0 0 0 14.138 5.929c.119 0 .258 0 .377.02a19.842 19.842 0 0 0 14.297-6.504l135.059-148.722c7.358-8.131 6.763-20.663-1.347-28.02z'
                            data-original='#000000'
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
                    className='relative'
                  >
                    <div
                      ref={inputContainerRef}
                      className='bg-muted-foreground/5 border-border flex flex-col gap-3 rounded-xl border p-3 shadow-sm transition-all duration-200 focus-within:border-neutral-300 focus-within:ring-2 focus-within:ring-neutral-500/20'
                    >
                      <div className='relative flex-1'>
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
                              : placeholderText
                                ? placeholderText + " ✦"
                                : "Tell your AI team what to create... ✦"
                          }
                          disabled={
                            isGenerating || isSubmitting || isSettingsOpen
                          }
                          style={{
                            lineHeight: "1.5",
                            fontFamily: "inherit",
                            minHeight: "20px",
                            maxHeight: "300px",
                          }}
                          className='scrollbar-thumb-rounded min-h-[40px] w-full resize-none scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent overflow-y-auto rounded-2xl border-none bg-transparent p-2 font-sans text-base font-normal text-gray-800 outline-none placeholder:text-gray-500 placeholder:transition-all placeholder:duration-300 hover:scrollbar-thumb-gray-400 focus:placeholder:text-gray-400 md:p-4 dark:scrollbar-thumb-[#888] dark:text-white dark:placeholder:text-gray-400 dark:hover:scrollbar-thumb-[#555] dark:focus:placeholder:text-[#363636]'
                          aria-label='Enter your prompt'
                          aria-describedby={
                            inputError ? "input-error" : undefined
                          }
                        />
                      </div>

                      <div className='flex items-center justify-between'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <button
                            type='button'
                            className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-gray-400 transition-all duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white/30 dark:hover:bg-white/5'
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
                            accept='image/*,video/*'
                            aria-label='Select files to upload'
                          />

                          {selectedDesignType && (
                            <Badge
                              variant='secondary'
                              className='flex h-6 cursor-pointer items-center gap-1.5 border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950/30 dark:text-neutral-300 dark:hover:bg-neutral-900/50'
                              onClick={() => {
                                setIsSettingsOpen(true);
                                setShowOrientationSelection(false);
                              }}
                            >
                              <selectedDesignType.icon className='h-3 w-3' />
                              {selectedDesignType.label}
                              {selectedOrientation &&
                                selectedOrientation !== "custom" && (
                                  <span className='text-muted-foreground'>
                                    •{" "}
                                    {
                                      getOrientationOptions(
                                        selectedDesignTypeId
                                      ).find(
                                        (opt) => opt.id === selectedOrientation
                                      )?.label
                                    }
                                  </span>
                                )}
                              {selectedOrientation === "custom" &&
                                customSize.width &&
                                customSize.height && (
                                  <span className='text-muted-foreground'>
                                    • {customSize.width}×{customSize.height}
                                  </span>
                                )}
                            </Badge>
                          )}

                          <button
                            type='button'
                            className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-gray-400 transition-all duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white/30 dark:hover:bg-white/5'
                            onClick={() => {
                              setIsSettingsOpen(!isSettingsOpen);
                              setShowOrientationSelection(true);
                            }}
                            disabled={isGenerating || isSubmitting}
                            aria-label='Settings'
                          >
                            <Settings className='h-4 w-4' />
                          </button>
                        </div>

                        <button className='border-border relative inline-flex h-9 overflow-hidden rounded-full border p-[1px] focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none'>
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
                          <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl'>
                            {isGenerating || isSubmitting ? (
                              <LoadingFileLoader size={16} />
                            ) : (
                              <div className='flex flex-row items-center gap-2'>
                                <WandSparklesIcon className='h-3 w-3' />
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

              {/* Settings Dropdown - overlays content below input section */}
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className='border-border absolute top-full right-0 left-0 z-50 mt-2 max-h-[300px] w-fit overflow-hidden rounded-xl border bg-white shadow-xl dark:bg-black'
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
                      <div className='max-h-[320px] overflow-y-auto'>
                        {!showOrientationSelection ? (
                          <div className='space-y-0.5'>
                            {designTypeItems.map((item) => {
                              const IconComponent = item.icon;
                              const isSelected =
                                selectedDesignTypeId === item.id;
                              const isComingSoon = (item as any).comingSoon;
                              return (
                                <button
                                  key={item.id}
                                  type='button'
                                  onClick={() => {
                                    if (isComingSoon) return;
                                    if (item.id == "video") {
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
                                      setShowOrientationSelection(true);
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
            </motion.div>
          )}
        </div>
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
                <LoadingFileLoader size={16} />
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
                                "minimal" | "concise" | "detailed" | "extensive"
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
                  <LoadingFileLoader size={16} />
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
