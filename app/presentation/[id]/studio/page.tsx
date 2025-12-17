"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiResponse } from "@/utils/apiResponse";
import { useUserContext } from "@/context/AuthenticatedContext";
import {
  Loader2,
  ChevronLeft,
  Grid3x3,
  List,
  X,
  Plus,
  Type,
  List as ListIcon,
  Table,
  MessageSquare,
  Hash,
  CheckSquare,
  AlertCircle,
  Info,
  TriangleAlert,
  HelpCircle,
  CheckCircle2,
  Columns,
  Square,
  ArrowRight,
  Image as ImageIcon,
  Layout,
  GripVertical,
  Save,
  MoreVertical,
  Trash2,
  Copy,
  FileText,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { PresentationNavbar } from "@/components/presentation/navbar";
import { SlideCanvas } from "@/components/presentation/slide-canvas";
import { DraggableSlide } from "@/components/presentation/draggable-slide";
import { IconLibrary } from "@/components/presentation/icon-library";
import { ImageLibrary } from "@/components/presentation/image-library";
import { ChartLibrary } from "@/components/presentation/chart-library";
import { PresentationBlock } from "@/types/presentation-schema";
import { exportToPPTX, exportToPDF } from "@/utils/presentation-export";
import { Download, Palette } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Slide {
  id: string;
  title: string;
  content: string[];
  order: number;
  blocks?: PresentationBlock[];
  background?: {
    color?: string;
    image?: string;
    gradient?: string;
  };
  layout?:
    | "default"
    | "title-only"
    | "two-column"
    | "image-left"
    | "image-right"
    | "centered";
}

interface PresentationProject {
  _id: string;
  title: string;
  outline: Slide[];
  status: string;
  theme?: string;
  textAmount?: string;
  imageStyle?: string;
  orientation?: string | null;
  customSize?: { width: string; height: string } | null;
}

type ContentBlock = {
  id: string;
  type: string;
  content: string | string[];
};

export default function PresentationStudioPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUserContext();
  const { toast } = useToast();
  const [presentation, setPresentation] = useState<PresentationProject | null>(
    null
  );
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const slideRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [blocksMenuOpen, setBlocksMenuOpen] = useState(false);
  const [blocksMenuType, setBlocksMenuType] = useState<
    | "basic"
    | "smart-layouts"
    | "templates"
    | "icons"
    | "images"
    | "charts"
    | null
  >(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingContentIndex, setEditingContentIndex] = useState<number | null>(
    null
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingIconBlockId, setEditingIconBlockId] = useState<string | null>(
    null
  );
  const [editingIconName, setEditingIconName] = useState<string | null>(null);
  const [editingIconColor, setEditingIconColor] = useState<string | undefined>(
    undefined
  );
  const [isExporting, setIsExporting] = useState(false);
  const slideCanvasRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  // Undo/Redo state
  const [history, setHistory] = useState<Slide[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoingRef = useRef(false);

  // Fetch presentation
  useEffect(() => {
    if (!user) {
      router.push("/signin");
      return;
    }

    const fetchPresentation = async () => {
      try {
        const response = await apiResponse.get(`/presentation/${params.id}`, {
          withCredentials: true,
        });

        if (response.data && response.data.project) {
          setPresentation(response.data.project);
          // Debug: Log presentation settings to verify dimensions are loaded
          if (
            response.data.project.customSize ||
            response.data.project.orientation
          ) {
            console.log("Presentation dimensions:", {
              customSize: response.data.project.customSize,
              orientation: response.data.project.orientation,
            });
          }
          // Initialize slides with blocks from content if blocks don't exist
          const loadedSlides = (response.data.project.outline || []).map(
            (slide: Slide) => {
              // If slide has blocks, use them; otherwise, create blocks from content
              if (slide.blocks && slide.blocks.length > 0) {
                return slide;
              }
              // Convert content array to blocks
              const blocks: PresentationBlock[] = slide.content.map(
                (content, index) => ({
                  id: `block-${slide.id}-${index}`,
                  type: "text" as const,
                  content,
                  position: {
                    x: 10,
                    y: 30 + index * 15,
                    width: 80,
                    height: 30,
                  },
                  order: index,
                })
              );
              return {
                ...slide,
                blocks,
              };
            }
          );
          setSlides(loadedSlides);
          // Initialize history with initial state
          setHistory([loadedSlides]);
          setHistoryIndex(0);
        } else {
          throw new Error("Presentation not found");
        }
      } catch (error: any) {
        console.error("Error fetching presentation:", error);
        toast({
          title: "Error",
          description:
            error.response?.data?.message ||
            "Failed to load presentation. Please try again.",
          variant: "destructive",
        });
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPresentation();
    }
  }, [params.id, user, router, toast]);

  // Track window size for responsive scaling
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  // Auto-save functionality
  const savePresentation = useCallback(
    async (slidesToSave: Slide[]) => {
      if (!presentation) return;

      setSaving(true);
      try {
        await apiResponse.patch(
          `/presentation/${params.id}`,
          { outline: slidesToSave },
          { withCredentials: true }
        );
      } catch (error: any) {
        console.error("Error saving presentation:", error);
        toast({
          title: "Error",
          description: "Failed to save changes",
          variant: "destructive",
        });
      } finally {
        setSaving(false);
      }
    },
    [presentation, params.id, toast]
  );

  // Add to history when slides change (but not when undoing/redoing)
  const addToHistory = useCallback(
    (newSlides: Slide[]) => {
      if (isUndoingRef.current) {
        isUndoingRef.current = false;
        return;
      }

      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(newSlides))); // Deep clone
        // Limit history to 50 states
        if (newHistory.length > 50) {
          newHistory.shift();
          return newHistory;
        }
        return newHistory;
      });
      setHistoryIndex((prev) => {
        const newIndex = prev + 1;
        // Limit history index
        return newIndex >= 50 ? 49 : newIndex;
      });
    },
    [historyIndex]
  );

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoingRef.current = true;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setSlides(JSON.parse(JSON.stringify(history[newIndex]))); // Deep clone
    }
  }, [history, historyIndex]);

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoingRef.current = true;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setSlides(JSON.parse(JSON.stringify(history[newIndex]))); // Deep clone
    }
  }, [history, historyIndex]);

  // Debounced save
  useEffect(() => {
    if (slides.length === 0 || !presentation) return;
    const timer = setTimeout(() => {
      savePresentation(slides);
    }, 1000);
    return () => clearTimeout(timer);
  }, [slides, savePresentation, presentation]);

  // Update slide title
  const updateSlideTitle = useCallback(
    (index: number, title: string) => {
      const newSlides = [...slides];
      newSlides[index] = { ...newSlides[index], title };
      setSlides(newSlides);
      addToHistory(newSlides);
    },
    [slides, addToHistory]
  );

  // Update slide content
  const updateSlideContent = useCallback(
    (index: number, contentIndex: number, value: string) => {
      const newSlides = [...slides];
      const newContent = [...newSlides[index].content];
      newContent[contentIndex] = value;
      newSlides[index] = { ...newSlides[index], content: newContent };
      setSlides(newSlides);
    },
    [slides]
  );

  // Add content point
  const addContentPoint = useCallback(
    (slideIndex: number) => {
      const newSlides = [...slides];
      newSlides[slideIndex].content.push("");
      setSlides(newSlides);
    },
    [slides]
  );

  // Remove content point
  const removeContentPoint = useCallback(
    (slideIndex: number, contentIndex: number) => {
      const newSlides = [...slides];
      newSlides[slideIndex].content.splice(contentIndex, 1);
      setSlides(newSlides);
    },
    [slides]
  );

  // Add new slide
  const addSlide = useCallback(() => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: "",
      content: [""],
      order: slides.length,
    };
    const newSlides = [...slides, newSlide];
    setSlides(newSlides);
    setSelectedSlideIndex(slides.length);
    addToHistory(newSlides);
  }, [slides, addToHistory]);

  // Delete slide
  const deleteSlide = useCallback(
    (index: number) => {
      if (slides.length <= 1) {
        toast({
          title: "Error",
          description: "Cannot delete the last slide",
          variant: "destructive",
        });
        return;
      }
      const newSlides = slides.filter((_, i) => i !== index);
      setSlides(newSlides);
      if (selectedSlideIndex >= newSlides.length) {
        setSelectedSlideIndex(newSlides.length - 1);
      }
      addToHistory(newSlides);
    },
    [slides, selectedSlideIndex, toast, addToHistory]
  );

  // Duplicate slide
  const duplicateSlide = useCallback(
    (index: number) => {
      const slideToDuplicate = slides[index];
      const newSlide: Slide = {
        ...slideToDuplicate,
        id: `slide-${Date.now()}`,
        order: slides.length,
      };
      const newSlides = [...slides];
      newSlides.splice(index + 1, 0, newSlide);
      setSlides(newSlides);
      addToHistory(newSlides);
    },
    [slides, addToHistory]
  );

  // Insert content block
  const insertBlock = useCallback(
    (blockType: string, blockId: string) => {
      const currentSlide = slides[selectedSlideIndex];
      if (!currentSlide) return;

      // Initialize blocks array if it doesn't exist
      if (!currentSlide.blocks) {
        currentSlide.blocks = [];
      }

      let blockTypeMap: "text" | "heading" | "list" | "quote" = "text";
      let newContent: string = "";
      // Default position in pixels (assuming 16:9 aspect ratio, ~1280x720 canvas)
      let position = { x: 100, y: 200, width: 400, height: 150 };

      switch (blockType) {
        case "title":
        case "h1":
          blockTypeMap = "heading";
          newContent = "<h1>Heading 1</h1>";
          position = { x: 100, y: 100, width: 600, height: 80 };
          break;
        case "h2":
          blockTypeMap = "heading";
          newContent = "<h2>Heading 2</h2>";
          position = { x: 100, y: 100, width: 500, height: 60 };
          break;
        case "h3":
          blockTypeMap = "heading";
          newContent = "<h3>Heading 3</h3>";
          position = { x: 100, y: 100, width: 400, height: 50 };
          break;
        case "h4":
          blockTypeMap = "heading";
          newContent = "<h4>Heading 4</h4>";
          position = { x: 100, y: 100, width: 350, height: 40 };
          break;
        case "blockquote":
          blockTypeMap = "quote";
          newContent = "<blockquote>Quote</blockquote>";
          position = { x: 100, y: 200, width: 500, height: 100 };
          break;
        case "bullet-list":
        case "numbered-list":
        case "todo-list":
          blockTypeMap = "list";
          newContent = "<ul><li>Item 1</li><li>Item 2</li></ul>";
          position = { x: 100, y: 200, width: 400, height: 120 };
          break;
        default:
          newContent = "<p>Text content</p>";
          position = { x: 100, y: 200, width: 400, height: 150 };
      }

      const newBlock: PresentationBlock = {
        id: `block-${Date.now()}-${Math.random()}`,
        type: blockTypeMap,
        content: newContent,
        position,
        order: currentSlide.blocks.length,
      };

      const newSlides = [...slides];
      newSlides[selectedSlideIndex] = {
        ...newSlides[selectedSlideIndex],
        blocks: [...(newSlides[selectedSlideIndex].blocks || []), newBlock],
      };
      setSlides(newSlides);
      setBlocksMenuOpen(false);
      setSelectedBlockId(newBlock.id);
      addToHistory(newSlides);
    },
    [slides, selectedSlideIndex, addToHistory]
  );

  // Update slide blocks
  const updateSlideBlocks = useCallback(
    (slideIndex: number, blocks: PresentationBlock[]) => {
      const newSlides = [...slides];
      newSlides[slideIndex] = {
        ...newSlides[slideIndex],
        blocks,
      };
      setSlides(newSlides);
      addToHistory(newSlides);
    },
    [slides, addToHistory]
  );

  // Export handlers
  const handleExportPPTX = useCallback(async () => {
    if (!presentation) return;
    setIsExporting(true);
    try {
      // Convert local presentation format to export format
      const exportPresentation: import("@/types/presentation-schema").PresentationProject =
        {
          _id: presentation._id,
          title: presentation.title,
          slides: slides.map((s) => ({
            ...s,
            blocks: s.blocks || [],
            layout: s.layout || "default",
          })),
          theme: presentation.theme,
          textAmount: presentation.textAmount,
          imageStyle: presentation.imageStyle,
        };
      await exportToPPTX(
        exportPresentation,
        slides.map((s) => ({
          ...s,
          blocks: s.blocks || [],
          layout: s.layout || "default",
        }))
      );
      toast({
        title: "Success",
        description: "Presentation exported to PowerPoint",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export presentation",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }, [presentation, slides, toast]);

  const handleExportPDF = useCallback(async () => {
    if (!presentation || !slideCanvasRef.current) return;
    setIsExporting(true);
    try {
      // Convert local presentation format to export format
      const exportPresentation: import("@/types/presentation-schema").PresentationProject =
        {
          _id: presentation._id,
          title: presentation.title,
          slides: slides.map((s) => ({
            ...s,
            blocks: s.blocks || [],
            layout: s.layout || "default",
          })),
          theme: presentation.theme,
          textAmount: presentation.textAmount,
          imageStyle: presentation.imageStyle,
        };
      await exportToPDF(
        exportPresentation,
        slides.map((s) => ({
          ...s,
          blocks: s.blocks || [],
          layout: s.layout || "default",
        })),
        slideCanvasRef.current
      );
      toast({
        title: "Success",
        description: "Presentation exported to PDF",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export presentation",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }, [presentation, slides, toast]);

  // Apply template to current slide
  const applyTemplate = useCallback(
    (templateId: string) => {
      const currentSlide = slides[selectedSlideIndex];
      if (!currentSlide) return;

      const templates: Record<
        string,
        { title: string; blocks: PresentationBlock[]; layout?: Slide["layout"] }
      > = {
        "title-only": {
          title: "Slide Title",
          blocks: [],
          layout: "title-only",
        },
        "title-content": {
          title: "Slide Title",
          blocks: [
            {
              id: `block-${Date.now()}-1`,
              type: "text",
              content: "<p>Key point 1</p>",
              position: { x: 10, y: 30, width: 80, height: 30 },
              order: 0,
            },
            {
              id: `block-${Date.now()}-2`,
              type: "text",
              content: "<p>Key point 2</p>",
              position: { x: 10, y: 40, width: 80, height: 30 },
              order: 1,
            },
            {
              id: `block-${Date.now()}-3`,
              type: "text",
              content: "<p>Key point 3</p>",
              position: { x: 10, y: 50, width: 80, height: 30 },
              order: 2,
            },
          ],
        },
        "title-two-columns": {
          title: "Slide Title",
          layout: "two-column",
          blocks: [
            {
              id: `block-${Date.now()}-1`,
              type: "text",
              content: "<p>Left column:<br>• Point 1<br>• Point 2</p>",
              position: { x: 5, y: 30, width: 40, height: 50 },
              order: 0,
            },
            {
              id: `block-${Date.now()}-2`,
              type: "text",
              content: "<p>Right column:<br>• Point 1<br>• Point 2</p>",
              position: { x: 55, y: 30, width: 40, height: 50 },
              order: 1,
            },
          ],
        },
        quote: {
          title: "",
          layout: "centered",
          blocks: [
            {
              id: `block-${Date.now()}-1`,
              type: "quote",
              content:
                "<blockquote>Inspirational quote or testimonial</blockquote>",
              position: { x: 10, y: 30, width: 80, height: 40 },
              order: 0,
            },
          ],
        },
        "image-title": {
          title: "Slide Title",
          layout: "image-left",
          blocks: [
            {
              id: `block-${Date.now()}-1`,
              type: "image",
              content: "",
              position: { x: 10, y: 25, width: 80, height: 50 },
              order: 0,
            },
            {
              id: `block-${Date.now()}-2`,
              type: "text",
              content: "<p>Description or caption for the image</p>",
              position: { x: 10, y: 75, width: 80, height: 20 },
              order: 1,
            },
          ],
        },
        "number-stats": {
          title: "Key Metrics",
          blocks: [
            {
              id: `block-${Date.now()}-1`,
              type: "text",
              content: "<p><strong>Stat 1:</strong> 100%</p>",
              position: { x: 10, y: 30, width: 25, height: 30 },
              order: 0,
            },
            {
              id: `block-${Date.now()}-2`,
              type: "text",
              content: "<p><strong>Stat 2:</strong> 50%</p>",
              position: { x: 37.5, y: 30, width: 25, height: 30 },
              order: 1,
            },
            {
              id: `block-${Date.now()}-3`,
              type: "text",
              content: "<p><strong>Stat 3:</strong> 75%</p>",
              position: { x: 65, y: 30, width: 25, height: 30 },
              order: 2,
            },
          ],
        },
        timeline: {
          title: "Timeline",
          blocks: [
            {
              id: `block-${Date.now()}-1`,
              type: "list",
              content:
                "<ul><li>Step 1: First milestone</li><li>Step 2: Second milestone</li><li>Step 3: Third milestone</li></ul>",
              position: { x: 10, y: 30, width: 80, height: 50 },
              order: 0,
            },
          ],
        },
        comparison: {
          title: "Comparison",
          layout: "two-column",
          blocks: [
            {
              id: `block-${Date.now()}-1`,
              type: "text",
              content:
                "<p><strong>Option A:</strong><br>• Feature 1<br>• Feature 2</p>",
              position: { x: 5, y: 30, width: 40, height: 50 },
              order: 0,
            },
            {
              id: `block-${Date.now()}-2`,
              type: "text",
              content:
                "<p><strong>Option B:</strong><br>• Feature 1<br>• Feature 2</p>",
              position: { x: 55, y: 30, width: 40, height: 50 },
              order: 1,
            },
          ],
        },
        process: {
          title: "Process Flow",
          blocks: [
            {
              id: `block-${Date.now()}-1`,
              type: "list",
              content:
                "<ol><li>First step</li><li>Second step</li><li>Third step</li><li>Final step</li></ol>",
              position: { x: 10, y: 30, width: 80, height: 50 },
              order: 0,
            },
          ],
        },
        "thank-you": {
          title: "Thank You",
          blocks: [
            {
              id: `block-${Date.now()}-1`,
              type: "text",
              content: "<p>Questions?</p>",
              position: { x: 10, y: 40, width: 80, height: 30 },
              order: 0,
            },
          ],
        },
      };

      const template = templates[templateId];
      if (!template) return;

      const newSlides = [...slides];
      newSlides[selectedSlideIndex] = {
        ...newSlides[selectedSlideIndex],
        title: template.title || newSlides[selectedSlideIndex].title,
        blocks: template.blocks,
        layout:
          template.layout || newSlides[selectedSlideIndex].layout || "default",
        content: [], // Keep for backward compatibility
      };
      setSlides(newSlides);
      setBlocksMenuOpen(false);
      toast({
        title: "Template Applied",
        description: "Template has been applied to the current slide",
      });
    },
    [slides, selectedSlideIndex, toast]
  );

  // Drag and drop sensors for slide reordering
  const slideSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle slide reordering
  const handleSlideDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = slides.findIndex((s) => s.id === active.id);
        const newIndex = slides.findIndex((s) => s.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newSlides = arrayMove(slides, oldIndex, newIndex).map(
            (slide, index) => ({
              ...slide,
              order: index,
            })
          );

          setSlides(newSlides);
          addToHistory(newSlides);

          // Update selectedSlideIndex if the selected slide was moved
          if (selectedSlideIndex === oldIndex) {
            setSelectedSlideIndex(newIndex);
          } else if (
            selectedSlideIndex > oldIndex &&
            selectedSlideIndex <= newIndex
          ) {
            setSelectedSlideIndex(selectedSlideIndex - 1);
          } else if (
            selectedSlideIndex < oldIndex &&
            selectedSlideIndex >= newIndex
          ) {
            setSelectedSlideIndex(selectedSlideIndex + 1);
          }

          toast({
            title: "Slides Reordered",
            description: "Slide order has been updated",
          });
        }
      }
    },
    [slides, selectedSlideIndex, toast]
  );

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  // Auto-scroll to selected slide
  useEffect(() => {
    const slideElement = slideRefs.current.get(selectedSlideIndex);
    if (slideElement) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        slideElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 100);
    }
  }, [selectedSlideIndex]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-foreground" />
      </div>
    );
  }

  if (!presentation || slides.length === 0) {
    return null;
  }

  const currentSlide = slides[selectedSlideIndex];
  const themeColors = {
    "bubble-gum": {
      bg: "bg-pink-900 dark:bg-pink-900",
      text: "text-pink-300 dark:text-pink-300",
      accent: "text-pink-400 dark:text-pink-400",
    },
    blueberry: {
      bg: "bg-purple-900 dark:bg-purple-900",
      text: "text-purple-300 dark:text-purple-300",
      accent: "text-purple-400 dark:text-purple-400",
    },
    onyx: {
      bg: "bg-gray-900 dark:bg-gray-900",
      text: "text-gray-300 dark:text-gray-300",
      accent: "text-gray-400 dark:text-gray-400",
    },
    electric: {
      bg: "bg-blue-900 dark:bg-blue-900",
      text: "text-blue-300 dark:text-blue-300",
      accent: "text-blue-400 dark:text-blue-400",
    },
    "moss-mist": {
      bg: "bg-green-900 dark:bg-green-900",
      text: "text-green-300 dark:text-green-300",
      accent: "text-green-400 dark:text-green-400",
    },
    wine: {
      bg: "bg-red-900 dark:bg-red-900",
      text: "text-red-300 dark:text-red-300",
      accent: "text-red-400 dark:text-red-400",
    },
  };
  const theme =
    themeColors[presentation.theme as keyof typeof themeColors] ||
    themeColors.onyx;

  const basicBlocks = [
    {
      category: "Text",
      items: [
        { id: "title", label: "Title", icon: Type, shortcut: "/Title" },
        { id: "h1", label: "Heading 1", icon: Hash, shortcut: "# Heading 1" },
        { id: "h2", label: "Heading 2", icon: Hash, shortcut: "## Heading 2" },
        { id: "h3", label: "Heading 3", icon: Hash, shortcut: "### Heading 3" },
        {
          id: "h4",
          label: "Heading 4",
          icon: Hash,
          shortcut: "#### Heading 4",
        },
        {
          id: "blockquote",
          label: "Blockquote",
          icon: MessageSquare,
          shortcut: "> Quote",
        },
      ],
    },
    {
      category: "Lists",
      items: [
        {
          id: "bullet-list",
          label: "Bulleted list",
          icon: ListIcon,
          shortcut: "- Item",
        },
        {
          id: "numbered-list",
          label: "Numbered list",
          icon: ListIcon,
          shortcut: "1. Item",
        },
        {
          id: "todo-list",
          label: "Todo list",
          icon: CheckSquare,
          shortcut: "[ ] Item",
        },
      ],
    },
    {
      category: "Callout boxes",
      items: [
        {
          id: "note",
          label: "Note box",
          icon: MessageSquare,
          shortcut: "/note",
        },
        { id: "info", label: "Info box", icon: Info, shortcut: "/info" },
        {
          id: "warning",
          label: "Warning box",
          icon: TriangleAlert,
          shortcut: "/warning",
        },
        {
          id: "caution",
          label: "Caution box",
          icon: AlertCircle,
          shortcut: "/caution",
        },
        {
          id: "success",
          label: "Success box",
          icon: CheckCircle2,
          shortcut: "/success",
        },
        {
          id: "question",
          label: "Question box",
          icon: HelpCircle,
          shortcut: "/question",
        },
      ],
    },
  ];

  const smartLayouts = [
    {
      category: "Columns",
      items: [
        { id: "2cols", label: "2 columns", icon: Columns },
        { id: "3cols", label: "3 columns", icon: Columns },
        { id: "4cols", label: "4 columns", icon: Columns },
      ],
    },
    {
      category: "Boxes",
      items: [
        { id: "solid-boxes", label: "Solid boxes", icon: Square },
        { id: "outline-boxes", label: "Outline boxes", icon: Square },
        { id: "joined-boxes", label: "Joined boxes", icon: Square },
      ],
    },
    {
      category: "Bullets",
      items: [
        { id: "large-bullets", label: "Large bullets", icon: ListIcon },
        { id: "small-bullets", label: "Small bullets", icon: ListIcon },
        { id: "arrow-bullets", label: "Arrow bullets", icon: ArrowRight },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Navigation Bar */}

      <PresentationNavbar
        title={presentation.title}
        saving={saving}
        onBack={() => router.back()}
        onExportPPTX={handleExportPPTX}
        onExportPDF={handleExportPDF}
        isExporting={isExporting}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />
      <div className="flex-1 flex relative z-10">
        {/* Left Toolbar - Floating Sidebar Pattern */}
        <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex items-center">
          {/* Main Toolbar */}
          <div className="bg-background/80 dark:bg-gray-950/80 backdrop-blur-sm border border-border rounded-xl shadow-lg p-2 flex flex-col items-center space-y-2">
            {/* Slides Section */}
            <div className="flex flex-col items-center space-y-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={cn(
                  "w-8 h-8 p-0 rounded-lg transition-all duration-200",
                  sidebarOpen
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                )}
                title="Slides"
              >
                <FileText className="w-4 h-4" />
              </Button>
              <span className="text-[10px] text-muted-foreground">Slides</span>
            </div>
          </div>

          {/* Sleek Modal - Slides List */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0, x: -20 }}
                animate={{ width: 305, opacity: 1, x: 0 }}
                exit={{ width: 0, opacity: 0, x: -20 }}
                transition={{
                  duration: 0.35,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="ml-3 w-80 bg-background/95 dark:bg-gray-950/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl flex flex-col h-[600px] max-h-[calc(100vh-8rem)]"
              >
                <div className="p-4 pb-0 flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/10 dark:bg-purple-500/10">
                        <FileText className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          Slides
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {slides.length} slide{slides.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarOpen(false)}
                      className="h-6 w-6 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden px-4 pb-4 flex flex-col min-h-0">
                  {/* Add Slide Button */}
                  <div className="mb-3 flex-shrink-0">
                    <Button
                      variant="ghost"
                      onClick={addSlide}
                      className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 h-9 text-sm font-medium rounded-lg border border-border hover:border-purple-500/30 transition-all duration-200 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300" />
                      <Plus className="w-4 h-4 mr-2 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                      <span className="relative z-10">New Slide</span>
                    </Button>
                  </div>

                  {/* Slides List - Scrollable */}
                  <ScrollArea className="flex-1 min-h-0 w-full">
                    <div className="space-y-2 pb-4 pr-2">
                      {slides.map((slide, index) => (
                        <motion.div
                          key={slide.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className={cn(
                            "group relative rounded-lg w-fit transition-all duration-300 cursor-pointer overflow-hidden",
                            selectedSlideIndex === index
                              ? "bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-purple-500/20 border-2 border-purple-500/40 shadow-lg shadow-purple-500/20"
                              : "bg-muted/40 border border-border hover:border-foreground/20 hover:bg-muted/60"
                          )}
                        >
                          {/* Selected Indicator Glow */}
                          {selectedSlideIndex === index && (
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-purple-500/10 animate-pulse" />
                          )}

                          <button
                            onClick={() => setSelectedSlideIndex(index)}
                            className="w-full p-2.5 text-left relative z-10"
                          >
                            {/* Slide Number Badge */}
                            <div
                              className={cn(
                                "absolute bottom-2.5 left-2.5 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold transition-all duration-300 z-20",
                                selectedSlideIndex === index
                                  ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30"
                                  : "bg-muted backdrop-blur-sm text-muted-foreground border border-border group-hover:bg-muted/90 group-hover:text-foreground"
                              )}
                            >
                              {index + 1}
                            </div>

                            {/* Slide Title */}
                            <p
                              className={cn(
                                "text-xs font-semibold w-52 line-clamp-1 truncate mb-1.5 transition-colors pr-8",
                                selectedSlideIndex === index
                                  ? "text-foreground"
                                  : "text-muted-foreground group-hover:text-foreground"
                              )}
                            >
                              {slide.title || `Slide ${index + 1}`}
                            </p>

                            {/* Slide Preview - Compact Image Snapshot */}
                            <div
                              className={cn(
                                "w-62 h-32 rounded-lg border overflow-hidden relative transition-all duration-300 bg-gradient-to-br",
                                selectedSlideIndex === index
                                  ? "border-purple-500/30 shadow-inner from-muted/60 to-muted/80"
                                  : "border-border group-hover:border-foreground/20 from-muted/30 to-muted/50"
                              )}
                            >
                              {/* Visual Snapshot Representation */}
                              {slide.title || slide.content.length > 0 ? (
                                <div className="h-full p-2 flex flex-col gap-1">
                                  {/* Title Bar */}
                                  {slide.title && (
                                    <div className="h-2 bg-foreground/20 dark:bg-foreground/30 rounded w-3/4" />
                                  )}
                                  {/* Content Lines */}
                                  {slide.content
                                    .slice(0, 3)
                                    .map((content, idx) => (
                                      <div
                                        key={idx}
                                        className="h-1.5 bg-foreground/15 dark:bg-foreground/25 rounded"
                                        style={{
                                          width: `${Math.min(100, 60 + idx * 10)}%`,
                                        }}
                                      />
                                    ))}
                                  {slide.content.length === 0 && (
                                    <div className="h-1.5 bg-foreground/10 dark:bg-foreground/20 rounded w-1/2" />
                                  )}
                                </div>
                              ) : (
                                <div className="h-full flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="w-6 h-6 mx-auto mb-1 rounded bg-muted border border-border flex items-center justify-center">
                                      <Layout className="w-3 h-3 text-muted-foreground" />
                                    </div>
                                    <span className="text-[9px] text-muted-foreground">
                                      Empty
                                    </span>
                                  </div>
                                </div>
                              )}
                              {/* Subtle gradient overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
                            </div>
                          </button>

                          {/* Action Buttons */}
                          {selectedSlideIndex === index && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/90 dark:bg-gray-950/90 backdrop-blur-sm rounded-lg p-0.5 border border-border shadow-xl"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicateSlide(index);
                                }}
                                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
                                title="Duplicate"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteSlide(index);
                                }}
                                className="p-1 hover:bg-red-500/20 rounded text-muted-foreground hover:text-red-500 transition-all duration-200 hover:scale-110"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative bg-background">
          <div ref={slideCanvasRef} className="flex-1 p-8">
            <DndContext
              sensors={slideSensors}
              collisionDetection={closestCenter}
              onDragEnd={handleSlideDragEnd}
            >
              <SortableContext
                items={slides.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="lg:max-w-5xl mx-auto space-y-8">
                  {slides.map((slide, index) => {
                    // Calculate slide dimensions based on customSize/orientation
                    // Use fixed pixel dimensions to maintain consistent appearance across all devices
                    // This follows the dimensions set during project creation
                    const getSlideDimensions = () => {
                      // Priority 1: Use customSize if provided (from project creation settings)
                      if (
                        presentation?.customSize?.width &&
                        presentation?.customSize?.height
                      ) {
                        const width = parseFloat(presentation.customSize.width);
                        const height = parseFloat(
                          presentation.customSize.height
                        );
                        return {
                          width: `${width}px`,
                          height: `${height}px`,
                          aspectRatio: width / height,
                        };
                      }
                      // Priority 2: Use orientation if provided (from project creation settings)
                      if (presentation?.orientation === "portrait") {
                        // Portrait: 720x1280 (9:16)
                        return {
                          width: "720px",
                          height: "1280px",
                          aspectRatio: 9 / 16,
                        };
                      }
                      // Default: Landscape 1280x720 (16:9)
                      return {
                        width: "1280px",
                        height: "720px",
                        aspectRatio: 16 / 9,
                      };
                    };

                    const dimensions = getSlideDimensions();
                    const slideWidth = parseFloat(dimensions.width);
                    const slideHeight = parseFloat(dimensions.height);

                    // Calculate scale factor to fit viewport while maintaining aspect ratio
                    // This ensures the slide maintains the same visual appearance across all devices
                    const isDesktop = windowSize.width >= 1024;
                    const maxHeightPx = isDesktop
                      ? windowSize.height * 0.65 // 65vh max on desktop to show next slide
                      : windowSize.height - 200; // Full height minus navbar/padding on mobile

                    const availableWidth = windowSize.width - 96; // Account for padding
                    const availableHeight = maxHeightPx;

                    // Calculate scale to fit both width and height constraints
                    const scaleX = availableWidth / slideWidth;
                    const scaleY = availableHeight / slideHeight;
                    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down

                    return (
                      <div key={slide.id} className="relative group">
                        <DraggableSlide
                          slide={{
                            ...slide,
                            blocks: slide.blocks || [],
                            layout: slide.layout || "default",
                          }}
                          index={index}
                          isSelected={selectedSlideIndex === index}
                          onSelect={() => setSelectedSlideIndex(index)}
                        >
                          <div
                            className={cn(
                              "mx-auto transition-all duration-300 overflow-hidden",
                              // On desktop, constrain height to show ~20% of next slide
                              "lg:max-h-[65vh]"
                            )}
                            style={{
                              // Container dimensions adjusted for scale
                              width:
                                scale < 1
                                  ? `${slideWidth * scale}px`
                                  : dimensions.width,
                              height:
                                scale < 1
                                  ? `${slideHeight * scale}px`
                                  : dimensions.height,
                              maxWidth: "100%",
                            }}
                          >
                            <div
                              ref={(el) => {
                                if (el) {
                                  slideRefs.current.set(index, el);
                                } else {
                                  slideRefs.current.delete(index);
                                }
                              }}
                              className="transition-all duration-300 w-full h-full"
                              style={{
                                width: dimensions.width,
                                height: dimensions.height,
                                // Scale down on smaller screens to fit viewport while maintaining aspect ratio
                                transform:
                                  scale < 1 ? `scale(${scale})` : undefined,
                                transformOrigin: "top left",
                              }}
                            >
                              <SlideCanvas
                                slide={{
                                  ...slide,
                                  blocks: slide.blocks || [],
                                  layout: slide.layout || "default",
                                }}
                                onUpdate={(blocks) =>
                                  updateSlideBlocks(index, blocks)
                                }
                                onTitleUpdate={(title) =>
                                  updateSlideTitle(index, title)
                                }
                                onBlockSelect={setSelectedBlockId}
                                onIconEdit={(blockId, iconName, color) => {
                                  setEditingIconBlockId(blockId);
                                  setEditingIconName(iconName);
                                  setEditingIconColor(color);
                                  setBlocksMenuOpen(true);
                                  setBlocksMenuType("icons");
                                }}
                                onDeleteSlide={() => deleteSlide(index)}
                                selectedBlockId={
                                  selectedSlideIndex === index
                                    ? selectedBlockId || undefined
                                    : undefined
                                }
                                theme={presentation?.theme || "onyx"}
                              />
                            </div>
                          </div>
                        </DraggableSlide>

                        {/* Add Slide Button Between Slides */}
                        {index < slides.length - 1 && (
                          <div className="flex justify-center -my-4 relative z-10">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newSlide: Slide = {
                                  id: `slide-${Date.now()}`,
                                  title: "",
                                  content: [""],
                                  order: index + 1,
                                };
                                const newSlides = [...slides];
                                newSlides.splice(index + 1, 0, newSlide);
                                setSlides(newSlides);
                                setSelectedSlideIndex(index + 1);
                                addToHistory(newSlides);
                              }}
                              className={cn(
                                "rounded-full border border-border bg-background hover:bg-muted transition-all",
                                // Mobile/Tablet: always visible, tiny
                                "h-5 w-5 md:h-6 md:w-6 opacity-100",
                                // Desktop: visible on hover, normal size
                                "lg:h-8 lg:w-8 lg:opacity-0 lg:group-hover:opacity-100"
                              )}
                              title="Add slide"
                            >
                              <Plus className="h-3 w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add Slide Button After Last Slide */}
                  <div className="relative group flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newSlide: Slide = {
                          id: `slide-${Date.now()}`,
                          title: "",
                          content: [""],
                          order: slides.length,
                        };
                        const newSlides = [...slides, newSlide];
                        setSlides(newSlides);
                        setSelectedSlideIndex(slides.length);
                        addToHistory(newSlides);
                      }}
                      className={cn(
                        "rounded-full border border-border bg-background hover:bg-muted transition-all",
                        // Mobile/Tablet: always visible, tiny
                        "h-5 w-5 md:h-6 md:w-6 opacity-100",
                        // Desktop: visible on hover, normal size
                        "lg:h-8 lg:w-8 lg:opacity-0 lg:group-hover:opacity-100"
                      )}
                      title="Add slide"
                    >
                      <Plus className="h-3 w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4" />
                    </Button>
                  </div>
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Right Toolbar - Floating Sidebar Pattern */}
          <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex items-center">
            {/* Main Toolbar */}
            <div className="bg-background/80 dark:bg-gray-950/80 backdrop-blur-sm border border-border rounded-xl shadow-lg p-2 flex flex-col items-center space-y-2">
              {/* Text/Blocks Section */}
              <div className="flex flex-col items-center space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setBlocksMenuOpen(
                      !blocksMenuOpen || blocksMenuType !== "basic"
                    );
                    setBlocksMenuType("basic");
                  }}
                  className={cn(
                    "w-8 h-8 p-0 rounded-lg transition-all duration-200",
                    blocksMenuOpen && blocksMenuType === "basic"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  )}
                  title="Text & Blocks"
                >
                  <Type className="w-4 h-4" />
                </Button>
                <span className="text-[10px] text-muted-foreground">Text</span>
              </div>

              {/* Layout Section */}
              <div className="flex flex-col items-center space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setBlocksMenuOpen(
                      !blocksMenuOpen || blocksMenuType !== "smart-layouts"
                    );
                    setBlocksMenuType("smart-layouts");
                  }}
                  className={cn(
                    "w-8 h-8 p-0 rounded-lg transition-all duration-200",
                    blocksMenuOpen && blocksMenuType === "smart-layouts"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  )}
                  title="Layouts"
                >
                  <Layout className="w-4 h-4" />
                </Button>
                <span className="text-[10px] text-muted-foreground">
                  Layout
                </span>
              </div>

              {/* Templates Section */}
              <div className="flex flex-col items-center space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setBlocksMenuOpen(
                      !blocksMenuOpen || blocksMenuType !== "templates"
                    );
                    setBlocksMenuType("templates");
                  }}
                  className={cn(
                    "w-8 h-8 p-0 rounded-lg transition-all duration-200",
                    blocksMenuOpen && blocksMenuType === "templates"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  )}
                  title="Templates"
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <span className="text-[10px] text-muted-foreground">
                  Templates
                </span>
              </div>

              {/* Image Section */}
              <div className="flex flex-col items-center space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setBlocksMenuOpen(
                      !blocksMenuOpen || blocksMenuType !== "images"
                    );
                    setBlocksMenuType("images");
                  }}
                  className={cn(
                    "w-8 h-8 p-0 rounded-lg transition-all duration-200",
                    blocksMenuOpen && blocksMenuType === "images"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  )}
                  title="Images"
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <span className="text-[10px] text-muted-foreground">Image</span>
              </div>

              {/* Icon Library Section */}
              <div className="flex flex-col items-center space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setBlocksMenuOpen(
                      !blocksMenuOpen || blocksMenuType !== "icons"
                    );
                    setBlocksMenuType("icons");
                  }}
                  className={cn(
                    "w-8 h-8 p-0 rounded-lg transition-all duration-200",
                    blocksMenuOpen && blocksMenuType === "icons"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  )}
                  title="Icons"
                >
                  <Palette className="w-4 h-4" />
                </Button>
                <span className="text-[10px] text-muted-foreground">Icons</span>
              </div>

              {/* Chart Library Section */}
              <div className="flex flex-col items-center space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setBlocksMenuOpen(
                      !blocksMenuOpen || blocksMenuType !== "charts"
                    );
                    setBlocksMenuType("charts");
                  }}
                  className={cn(
                    "w-8 h-8 p-0 rounded-lg transition-all duration-200",
                    blocksMenuOpen && blocksMenuType === "charts"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  )}
                  title="Charts"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
                <span className="text-[10px] text-muted-foreground">
                  Charts
                </span>
              </div>
            </div>

            {/* Sleek Modal - Content Blocks Menu */}
            <AnimatePresence>
              {blocksMenuOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0, x: 20 }}
                  animate={{ width: 320, opacity: 1, x: 0 }}
                  exit={{ width: 0, opacity: 0, x: 20 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="ml-3 w-80 bg-background/95 dark:bg-gray-950/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl flex flex-col max-h-[600px]"
                >
                  <div className="p-4 pb-0 flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {blocksMenuType === "basic" && (
                          <>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/10 dark:bg-purple-500/10">
                              <Type className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-foreground">
                                Text & Blocks
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                Add common elements
                              </p>
                            </div>
                          </>
                        )}
                        {blocksMenuType === "smart-layouts" && (
                          <>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10 dark:bg-blue-500/10">
                              <Layout className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-foreground">
                                Smart Layouts
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                Visual layouts
                              </p>
                            </div>
                          </>
                        )}
                        {blocksMenuType === "templates" && (
                          <>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500/10 dark:bg-green-500/10">
                              <Grid3x3 className="w-5 h-5 text-green-500 dark:text-green-400" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-foreground">
                                Slide Templates
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                Design patterns
                              </p>
                            </div>
                          </>
                        )}
                        {blocksMenuType === "icons" && (
                          <>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-500/10 dark:bg-orange-500/10">
                              <Palette className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-foreground">
                                Icon Library
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                Search and insert icons
                              </p>
                            </div>
                          </>
                        )}
                        {blocksMenuType === "charts" && (
                          <>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/10 dark:bg-purple-500/10">
                              <BarChart3 className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-foreground">
                                Chart Library
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                Create data visualizations
                              </p>
                            </div>
                          </>
                        )}
                        {blocksMenuType === "images" && (
                          <>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10 dark:bg-blue-500/10">
                              <ImageIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-foreground">
                                Image Library
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                Upload, browse, or generate
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setBlocksMenuOpen(false);
                          setBlocksMenuType(null);
                        }}
                        className="h-6 w-6 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden px-4">
                    <ScrollArea className="flex-1 h-full">
                      <div className="space-y-6 pb-4 pr-2">
                        {blocksMenuType === "basic" &&
                          basicBlocks.map((category) => (
                            <div
                              key={category.category}
                              className="space-y-1.5"
                            >
                              <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                {category.category}
                              </h3>
                              {category.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <button
                                    key={item.id}
                                    onClick={() =>
                                      insertBlock(item.id, item.id)
                                    }
                                    className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted transition-colors text-left group"
                                  >
                                    <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-foreground">
                                        {item.label}
                                      </p>
                                      {item.shortcut && (
                                        <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                                          {item.shortcut}
                                        </p>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          ))}

                        {blocksMenuType === "smart-layouts" &&
                          smartLayouts.map((category) => (
                            <div
                              key={category.category}
                              className="space-y-1.5"
                            >
                              <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                {category.category}
                              </h3>
                              {category.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <button
                                    key={item.id}
                                    className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted transition-colors text-left group"
                                  >
                                    <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground flex-shrink-0" />
                                    <p className="text-sm text-foreground">
                                      {item.label}
                                    </p>
                                  </button>
                                );
                              })}
                            </div>
                          ))}

                        {blocksMenuType === "charts" && (
                          <ChartLibrary
                            showHeader={false}
                            onInsertChart={(chartType, chartData, config) => {
                              const currentSlide = slides[selectedSlideIndex];
                              if (!currentSlide) return;

                              if (!currentSlide.blocks) {
                                currentSlide.blocks = [];
                              }

                              // Create a chart block
                              const newBlock: PresentationBlock = {
                                id: `block-${Date.now()}-${Math.random()}`,
                                type: "chart",
                                content: JSON.stringify({
                                  chartType,
                                  chartData,
                                  config,
                                }),
                                position: {
                                  x: 200,
                                  y: 200,
                                  width: 500,
                                  height: 300,
                                },
                                order: currentSlide.blocks.length,
                              };

                              const newSlides = [...slides];
                              newSlides[selectedSlideIndex] = {
                                ...newSlides[selectedSlideIndex],
                                blocks: [
                                  ...(newSlides[selectedSlideIndex].blocks ||
                                    []),
                                  newBlock,
                                ],
                              };
                              setSlides(newSlides);
                              setSelectedBlockId(newBlock.id);
                              addToHistory(newSlides);
                              toast({
                                title: "Chart Inserted",
                                description: `${chartType} chart has been added to the slide`,
                              });
                            }}
                            onClose={() => {
                              setBlocksMenuOpen(false);
                              setBlocksMenuType(null);
                            }}
                          />
                        )}

                        {blocksMenuType === "images" && (
                          <ImageLibrary
                            showHeader={false}
                            onInsertImage={(imageUrl, imageData) => {
                              const currentSlide = slides[selectedSlideIndex];
                              if (!currentSlide) return;

                              if (!currentSlide.blocks) {
                                currentSlide.blocks = [];
                              }

                              // Create an image block
                              const newBlock: PresentationBlock = {
                                id: `block-${Date.now()}-${Math.random()}`,
                                type: "image",
                                content: imageUrl,
                                position: {
                                  x: 200,
                                  y: 200,
                                  width: 400,
                                  height: 300,
                                },
                                order: currentSlide.blocks.length,
                              };

                              const newSlides = [...slides];
                              newSlides[selectedSlideIndex] = {
                                ...newSlides[selectedSlideIndex],
                                blocks: [
                                  ...(newSlides[selectedSlideIndex].blocks ||
                                    []),
                                  newBlock,
                                ],
                              };
                              setSlides(newSlides);
                              setSelectedBlockId(newBlock.id);
                              addToHistory(newSlides);
                              toast({
                                title: "Image Inserted",
                                description:
                                  "Image has been added to the slide",
                              });
                            }}
                            onClose={() => {
                              setBlocksMenuOpen(false);
                              setBlocksMenuType(null);
                            }}
                          />
                        )}

                        {blocksMenuType === "templates" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              {/* Title Only Template */}
                              <button
                                onClick={() => applyTemplate("title-only")}
                                className="group relative aspect-video rounded-lg border border-border hover:border-purple-500/50 bg-muted/30 hover:bg-muted/50 transition-all p-3 flex flex-col items-center justify-center overflow-hidden"
                              >
                                <div className="w-full space-y-2">
                                  <div className="h-2 bg-foreground/30 rounded w-3/4 mx-auto" />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2 group-hover:text-foreground">
                                  Title Only
                                </p>
                              </button>

                              {/* Title + Content Template */}
                              <button
                                onClick={() => applyTemplate("title-content")}
                                className="group relative aspect-video rounded-lg border border-border hover:border-purple-500/50 bg-muted/30 hover:bg-muted/50 transition-all p-3 flex flex-col overflow-hidden"
                              >
                                <div className="w-full space-y-1.5">
                                  <div className="h-2 bg-foreground/30 rounded w-2/3" />
                                  <div className="h-1 bg-foreground/20 rounded w-full" />
                                  <div className="h-1 bg-foreground/20 rounded w-5/6" />
                                  <div className="h-1 bg-foreground/20 rounded w-4/5" />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-auto group-hover:text-foreground">
                                  Title + Content
                                </p>
                              </button>

                              {/* Two Columns Template */}
                              <button
                                onClick={() =>
                                  applyTemplate("title-two-columns")
                                }
                                className="group relative aspect-video rounded-lg border border-border hover:border-purple-500/50 bg-muted/30 hover:bg-muted/50 transition-all p-3 flex flex-col overflow-hidden"
                              >
                                <div className="h-1.5 bg-foreground/30 rounded w-2/3 mb-2" />
                                <div className="flex gap-2 flex-1">
                                  <div className="flex-1 space-y-1">
                                    <div className="h-1 bg-foreground/20 rounded w-full" />
                                    <div className="h-1 bg-foreground/20 rounded w-3/4" />
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <div className="h-1 bg-foreground/20 rounded w-full" />
                                    <div className="h-1 bg-foreground/20 rounded w-3/4" />
                                  </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-auto group-hover:text-foreground">
                                  Two Columns
                                </p>
                              </button>

                              {/* Quote Template */}
                              <button
                                onClick={() => applyTemplate("quote")}
                                className="group relative aspect-video rounded-lg border border-border hover:border-purple-500/50 bg-muted/30 hover:bg-muted/50 transition-all p-3 flex flex-col items-center justify-center overflow-hidden"
                              >
                                <div className="w-full space-y-2">
                                  <div className="h-1.5 bg-foreground/25 rounded w-full" />
                                  <div className="h-1.5 bg-foreground/25 rounded w-5/6 mx-auto" />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2 group-hover:text-foreground">
                                  Quote
                                </p>
                              </button>

                              {/* Image + Title Template */}
                              <button
                                onClick={() => applyTemplate("image-title")}
                                className="group relative aspect-video rounded-lg border border-border hover:border-purple-500/50 bg-muted/30 hover:bg-muted/50 transition-all p-3 flex flex-col overflow-hidden"
                              >
                                <div className="w-full h-12 bg-foreground/10 rounded mb-2 flex items-center justify-center">
                                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="h-1.5 bg-foreground/30 rounded w-2/3 mb-1" />
                                <div className="h-1 bg-foreground/20 rounded w-full" />
                                <p className="text-[10px] text-muted-foreground mt-auto group-hover:text-foreground">
                                  Image + Title
                                </p>
                              </button>

                              {/* Stats Template */}
                              <button
                                onClick={() => applyTemplate("number-stats")}
                                className="group relative aspect-video rounded-lg border border-border hover:border-purple-500/50 bg-muted/30 hover:bg-muted/50 transition-all p-3 flex flex-col overflow-hidden"
                              >
                                <div className="h-1.5 bg-foreground/30 rounded w-1/2 mb-2" />
                                <div className="grid grid-cols-3 gap-1 flex-1">
                                  <div className="bg-foreground/10 rounded flex items-center justify-center">
                                    <span className="text-[8px] text-foreground">
                                      100%
                                    </span>
                                  </div>
                                  <div className="bg-foreground/10 rounded flex items-center justify-center">
                                    <span className="text-[8px] text-foreground">
                                      50%
                                    </span>
                                  </div>
                                  <div className="bg-foreground/10 rounded flex items-center justify-center">
                                    <span className="text-[8px] text-foreground">
                                      75%
                                    </span>
                                  </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-auto group-hover:text-foreground">
                                  Stats
                                </p>
                              </button>

                              {/* Timeline Template */}
                              <button
                                onClick={() => applyTemplate("timeline")}
                                className="group relative aspect-video rounded-lg border border-border hover:border-purple-500/50 bg-muted/30 hover:bg-muted/50 transition-all p-3 flex flex-col overflow-hidden"
                              >
                                <div className="h-1.5 bg-foreground/30 rounded w-1/2 mb-2" />
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-foreground/30" />
                                    <div className="h-1 bg-foreground/20 rounded flex-1" />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-foreground/30" />
                                    <div className="h-1 bg-foreground/20 rounded flex-1" />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-foreground/30" />
                                    <div className="h-1 bg-foreground/20 rounded flex-1" />
                                  </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-auto group-hover:text-foreground">
                                  Timeline
                                </p>
                              </button>

                              {/* Comparison Template */}
                              <button
                                onClick={() => applyTemplate("comparison")}
                                className="group relative aspect-video rounded-lg border border-border hover:border-purple-500/50 bg-muted/30 hover:bg-muted/50 transition-all p-3 flex flex-col overflow-hidden"
                              >
                                <div className="h-1.5 bg-foreground/30 rounded w-1/2 mb-2" />
                                <div className="flex gap-2 flex-1">
                                  <div className="flex-1 space-y-0.5">
                                    <div className="h-1 bg-foreground/20 rounded w-full" />
                                    <div className="h-1 bg-foreground/20 rounded w-3/4" />
                                  </div>
                                  <div className="w-px bg-border" />
                                  <div className="flex-1 space-y-0.5">
                                    <div className="h-1 bg-foreground/20 rounded w-full" />
                                    <div className="h-1 bg-foreground/20 rounded w-3/4" />
                                  </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-auto group-hover:text-foreground">
                                  Comparison
                                </p>
                              </button>

                              {/* Process Template */}
                              <button
                                onClick={() => applyTemplate("process")}
                                className="group relative aspect-video rounded-lg border border-border hover:border-purple-500/50 bg-muted/30 hover:bg-muted/50 transition-all p-3 flex flex-col overflow-hidden"
                              >
                                <div className="h-1.5 bg-foreground/30 rounded w-1/2 mb-2" />
                                <div className="flex-1 flex items-center gap-1">
                                  <div className="flex-1 h-1 bg-foreground/20 rounded" />
                                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                  <div className="flex-1 h-1 bg-foreground/20 rounded" />
                                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                  <div className="flex-1 h-1 bg-foreground/20 rounded" />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-auto group-hover:text-foreground">
                                  Process
                                </p>
                              </button>

                              {/* Thank You Template */}
                              <button
                                onClick={() => applyTemplate("thank-you")}
                                className="group relative aspect-video rounded-lg border border-border hover:border-purple-500/50 bg-muted/30 hover:bg-muted/50 transition-all p-3 flex flex-col items-center justify-center overflow-hidden"
                              >
                                <div className="w-full space-y-2">
                                  <div className="h-2 bg-foreground/30 rounded w-2/3 mx-auto" />
                                  <div className="h-1 bg-foreground/20 rounded w-1/2 mx-auto" />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2 group-hover:text-foreground">
                                  Thank You
                                </p>
                              </button>
                            </div>
                          </div>
                        )}

                        {blocksMenuType === "icons" && (
                          <IconLibrary
                            showHeader={false}
                            preSelectedIcon={editingIconName || undefined}
                            preSelectedColor={editingIconColor}
                            onInsertIcon={(iconName, iconData, color, size) => {
                              const currentSlide = slides[selectedSlideIndex];
                              if (!currentSlide) return;

                              if (editingIconBlockId) {
                                // Update existing icon
                                const newSlides = [...slides];
                                const blockIndex =
                                  currentSlide.blocks?.findIndex(
                                    (b) => b.id === editingIconBlockId
                                  ) ?? -1;
                                if (
                                  blockIndex !== -1 &&
                                  newSlides[selectedSlideIndex].blocks
                                ) {
                                  newSlides[selectedSlideIndex].blocks[
                                    blockIndex
                                  ] = {
                                    ...newSlides[selectedSlideIndex].blocks[
                                      blockIndex
                                    ],
                                    content: iconData,
                                    iconName: iconName,
                                    style: {
                                      ...(newSlides[selectedSlideIndex].blocks[
                                        blockIndex
                                      ]?.style || {}),
                                      color: color,
                                    },
                                  };
                                  setSlides(newSlides);
                                  addToHistory(newSlides);
                                  toast({
                                    title: "Icon Updated",
                                    description: `${iconName} icon has been updated`,
                                  });
                                }
                                setEditingIconBlockId(null);
                                setEditingIconName(null);
                                setEditingIconColor(undefined);
                              } else {
                                // Insert new icon block
                                if (!currentSlide.blocks) {
                                  currentSlide.blocks = [];
                                }

                                const newBlock: PresentationBlock = {
                                  id: `block-${Date.now()}-${Math.random()}`,
                                  type: "icon",
                                  content: iconData,
                                  iconName: iconName,
                                  position: {
                                    x: 200,
                                    y: 200,
                                    width: 64,
                                    height: 64,
                                  },
                                  order: currentSlide.blocks.length,
                                  style: {
                                    ...(color ? { color } : {}),
                                    ...(size ? { fontSize: size } : {}),
                                  },
                                };

                                const newSlides = [...slides];
                                newSlides[selectedSlideIndex] = {
                                  ...newSlides[selectedSlideIndex],
                                  blocks: [
                                    ...(newSlides[selectedSlideIndex].blocks ||
                                      []),
                                    newBlock,
                                  ],
                                };
                                setSlides(newSlides);
                                setSelectedBlockId(newBlock.id);
                                addToHistory(newSlides);
                                toast({
                                  title: "Icon Inserted",
                                  description: `${iconName} icon has been added to the slide`,
                                });
                              }
                            }}
                            onClose={() => {
                              setBlocksMenuOpen(false);
                              setBlocksMenuType(null);
                              setEditingIconBlockId(null);
                              setEditingIconName(null);
                              setEditingIconColor(undefined);
                            }}
                          />
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
