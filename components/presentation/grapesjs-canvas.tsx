"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Editor } from "grapesjs";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import GjsBlockBasic from "grapesjs-blocks-basic";
import gjsForms from "grapesjs-plugin-forms";
import pluginTooltip from "grapesjs-tooltip";
import pluginImageEditor from "grapesjs-tui-image-editor";
import pluginStyleBg from "grapesjs-style-bg";
import pluginStyleGradient from "grapesjs-style-gradient";
import customCodePlugin from "grapesjs-custom-code";
import styleFilter from "grapesjs-style-filter";
import MaterialIcon from "grapesjs-google-material-icons";
import grapesjsClick from "grapesjs-click";
import { PresentationBlock, Slide } from "@/types/presentation-schema";
import { cn } from "@/lib/utils";
import { Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Grid } from "lucide-react";

interface GrapesJSCanvasProps {
  slide: Slide;
  onUpdate: (blocks: PresentationBlock[]) => void;
  onTitleUpdate?: (title: string) => void;
  onBlockSelect?: (blockId: string) => void;
  onIconEdit?: (blockId: string, iconName: string, color?: string) => void;
  onDeleteSlide?: () => void;
  onLayoutChange?: (layout: Slide["layout"]) => void;
  selectedBlockId?: string;
  theme?: string;
}

export function GrapesJSCanvas({
  slide,
  onUpdate,
  onTitleUpdate,
  onBlockSelect,
  onIconEdit,
  onDeleteSlide,
  onLayoutChange,
  selectedBlockId,
  theme = "onyx",
}: GrapesJSCanvasProps) {
  const editorRef = useRef<Editor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showGrid, setShowGrid] = useState(false);

  const themeColors = {
    "bubble-gum": {
      bg: "bg-pink-900 dark:bg-pink-900",
      text: "text-pink-300 dark:text-pink-300",
    },
    blueberry: {
      bg: "bg-purple-900 dark:bg-purple-900",
      text: "text-purple-300 dark:text-purple-300",
    },
    onyx: {
      bg: "bg-gray-900 dark:bg-gray-900",
      text: "text-gray-300 dark:text-gray-300",
    },
    electric: {
      bg: "bg-blue-900 dark:bg-blue-900",
      text: "text-blue-300 dark:text-blue-300",
    },
    "moss-mist": {
      bg: "bg-green-900 dark:bg-green-900",
      text: "text-green-300 dark:text-green-300",
    },
    wine: {
      bg: "bg-red-900 dark:bg-red-900",
      text: "text-red-300 dark:text-red-300",
    },
  };

  const themeStyle =
    themeColors[theme as keyof typeof themeColors] || themeColors.onyx;

  // Convert GrapesJS components to PresentationBlocks
  const grapesToBlocks = (editor: Editor): PresentationBlock[] => {
    const components = editor.getComponents();
    const blocks: PresentationBlock[] = [];

    const traverse = (component: any, index: number = 0) => {
      if (!component) return;

      const tagName = component.get("tagName");
      const type = component.get("type");
      const content = component.get("content");
      const attributes = component.get("attributes") || {};
      const style = component.get("style") || {};

      // Get position from style
      const left = parseFloat(style.left || attributes["data-x"] || "0");
      const top = parseFloat(style.top || attributes["data-y"] || "0");
      const width = parseFloat(style.width || attributes["data-width"] || "200");
      const height = parseFloat(style.height || attributes["data-height"] || "100");

      let blockType: PresentationBlock["type"] = "text";
      let blockContent: string | any = content || "";

      // Determine block type
      if (tagName === "img" || type === "image") {
        blockType = "image";
        blockContent = attributes.src || content || "";
      } else if (tagName === "h1" || tagName === "h2" || tagName === "h3") {
        blockType = "heading";
      } else if (tagName === "ul" || tagName === "ol") {
        blockType = "list";
      } else if (tagName === "blockquote") {
        blockType = "quote";
      }

      // Only create block if it has meaningful content or is an image
      if (blockContent || blockType === "image") {
        blocks.push({
          id: component.get("id") || `block-${Date.now()}-${index}`,
          type: blockType,
          content: blockContent,
          position: {
            x: left,
            y: top,
            width,
            height,
          },
          style: {
            fontSize: style["font-size"] ? parseFloat(style["font-size"]) : undefined,
            fontWeight: style["font-weight"],
            color: style.color,
            backgroundColor: style["background-color"],
            textAlign: style["text-align"] as any,
            padding: style.padding ? parseFloat(style.padding) : undefined,
            borderRadius: style["border-radius"] ? parseFloat(style["border-radius"]) : undefined,
            border: style.border,
          },
          order: index,
        });
      }

      // Traverse children
      const children = component.get("components");
      if (children && children.length > 0) {
        children.forEach((child: any, childIndex: number) => {
          traverse(child, index + childIndex + 1);
        });
      }
    };

    traverse(components, 0);
    return blocks;
  };

  // Convert PresentationBlocks to GrapesJS components
  const blocksToGrapes = (blocks: PresentationBlock[], editor: Editor) => {
    const components = blocks.map((block) => {
      const style: any = {
        position: "absolute",
        left: `${block.position.x}px`,
        top: `${block.position.y}px`,
        width: `${block.position.width}px`,
        height: `${block.position.height}px`,
      };

      if (block.style) {
        if (block.style.fontSize) style["font-size"] = `${block.style.fontSize}px`;
        if (block.style.fontWeight) style["font-weight"] = block.style.fontWeight;
        if (block.style.color) style.color = block.style.color;
        if (block.style.backgroundColor) style["background-color"] = block.style.backgroundColor;
        if (block.style.textAlign) style["text-align"] = block.style.textAlign;
        if (block.style.padding) style.padding = `${block.style.padding}px`;
        if (block.style.borderRadius) style["border-radius"] = `${block.style.borderRadius}px`;
        if (block.style.border) style.border = block.style.border;
      }

      let tagName = "div";
      let content = typeof block.content === "string" ? block.content : "";

      switch (block.type) {
        case "heading":
          tagName = "h1";
          break;
        case "image":
          tagName = "img";
          return {
            tagName: "img",
            type: "image",
            attributes: {
              src: content,
              alt: "Slide image",
              "data-block-id": block.id,
            },
            style,
          };
        case "list":
          tagName = "ul";
          break;
        case "quote":
          tagName = "blockquote";
          break;
      }

      return {
        tagName,
        type: "text",
        content,
        attributes: {
          "data-block-id": block.id,
        },
        style,
      };
    });

    return components;
  };

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    // Initialize GrapesJS Editor with all plugins
    const editor = grapesjs.init({
      container: containerRef.current,
      height: "100%",
      width: "100%",
      fromElement: true, // Allow components from HTML
      allowScripts: 1,
      storageManager: false, // We'll handle storage ourselves
      plugins: [
        gjsPresetWebpage,
        GjsBlockBasic,
        gjsForms,
        pluginTooltip,
        customCodePlugin,
        pluginImageEditor,
        grapesjsClick,
        pluginStyleBg,
        styleFilter,
        pluginStyleGradient,
        MaterialIcon,
      ],
      pluginsOpts: {
        gjsPresetWebpage: {},
        grapesjsClick: true,
        "gjs-blocks-basic": {
          videoBlock: {
            attributes: { controls: true },
          },
        },
      },
      canvas: {
        styles: [
          "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        ],
      },
      deviceManager: {
        devices: [
          {
            name: "Desktop",
            width: "",
          },
        ],
      },
      // Hide default panels - we'll use our own UI
      panels: {
        defaults: [],
      },
      // Disable block manager UI
      blockManager: {
        appendTo: "",
      },
      // Disable layer manager UI
      layerManager: {
        appendTo: "",
      },
      // Style manager for inline editing
      styleManager: {
        appendTo: "",
        sectors: [
          {
            name: "Dimension",
            open: false,
            buildProps: ["width", "height", "min-height", "padding"],
            properties: [
              {
                type: "integer",
                name: "Width",
                property: "width",
                units: ["px", "%"],
                defaults: "auto",
                min: 0,
              },
              {
                type: "integer",
                name: "Height",
                property: "height",
                units: ["px", "%"],
                defaults: "auto",
                min: 0,
              },
            ],
          },
          {
            name: "Typography",
            open: false,
            buildProps: [
              "font-family",
              "font-size",
              "font-weight",
              "letter-spacing",
              "color",
              "line-height",
              "text-align",
              "text-decoration",
              "text-shadow",
            ],
          },
          {
            name: "Decorations",
            open: false,
            buildProps: [
              "opacity",
              "border-radius",
              "border",
              "box-shadow",
              "background",
            ],
          },
        ],
      },
    });

    editorRef.current = editor;

    // Load blocks into editor
    if (slide.blocks && slide.blocks.length > 0) {
      const components = blocksToGrapes(slide.blocks, editor);
      editor.setComponents(components);
    }

    // Handle component updates with debouncing
    let updateTimeout: NodeJS.Timeout;
    const scheduleUpdate = () => {
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => {
        const blocks = grapesToBlocks(editor);
        onUpdate(blocks);
      }, 300);
    };

    editor.on("component:update", scheduleUpdate);
    editor.on("component:add", scheduleUpdate);
    editor.on("component:remove", scheduleUpdate);
    editor.on("component:styleUpdate", scheduleUpdate);

    editor.on("component:selected", (component: any) => {
      const blockId = component.getAttributes()?.["data-block-id"];
      if (blockId) {
        onBlockSelect?.(blockId);
      }
    });

    // Add Tailwind CSS and other resources to canvas on load
    editor.on("load", () => {
      try {
        const frameEl = editor.Canvas.getFrameEl();
        if (!frameEl) return;

        const addElementsToHead = () => {
          const frameDoc = frameEl.contentDocument || frameEl.contentWindow?.document;
          if (!frameDoc || !frameDoc.head) {
            setTimeout(addElementsToHead, 50);
            return;
          }

          const head = frameDoc.head;

          // Add Tailwind CSS
          const tailwindLink = document.createElement("link");
          tailwindLink.rel = "stylesheet";
          tailwindLink.href =
            "https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css";
          if (!head.querySelector(`link[href="${tailwindLink.href}"]`)) {
            head.appendChild(tailwindLink);
          }

          // Add Tailwind CDN script
          const tailwindScript = document.createElement("script");
          tailwindScript.src = "https://cdn.tailwindcss.com/3.4.3";
          if (!head.querySelector(`script[src="${tailwindScript.src}"]`)) {
            head.appendChild(tailwindScript);
          }

          // Add viewport meta
          let viewport = head.querySelector('meta[name="viewport"]');
          if (!viewport) {
            viewport = document.createElement("meta");
            viewport.setAttribute("name", "viewport");
            viewport.setAttribute("content", "width=device-width, initial-scale=1.0");
            head.appendChild(viewport);
          }

          // Add Google Fonts
          const googleFontLink = document.createElement("link");
          googleFontLink.rel = "stylesheet";
          googleFontLink.href =
            "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
          if (!head.querySelector(`link[href="${googleFontLink.href}"]`)) {
            head.appendChild(googleFontLink);
          }

          // Toggle grid if enabled
          if (frameDoc.body && showGrid) {
            frameDoc.body.style.backgroundImage =
              "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)";
            frameDoc.body.style.backgroundSize = "10px 10px";
          }
        };

        addElementsToHead();
      } catch (error) {
        console.warn("Could not access canvas frame on load:", error);
      }
    });

    return () => {
      clearTimeout(updateTimeout);
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // Update editor when blocks change externally
  useEffect(() => {
    if (!editorRef.current) return;
    const currentBlocks = grapesToBlocks(editorRef.current);
    const blocksChanged =
      JSON.stringify(currentBlocks) !== JSON.stringify(slide.blocks);
    
    if (blocksChanged && slide.blocks) {
      const components = blocksToGrapes(slide.blocks, editorRef.current);
      editorRef.current.setComponents(components);
    }
  }, [slide.blocks]);

  // Toggle grid and ensure Tailwind is loaded
  useEffect(() => {
    if (!editorRef.current) return;
    
    try {
      const frameEl = editorRef.current.Canvas.getFrameEl();
      if (!frameEl) return;

      const updateFrame = () => {
        const frameDoc = frameEl.contentDocument || frameEl.contentWindow?.document;
        if (!frameDoc || !frameDoc.head) {
          setTimeout(updateFrame, 50);
          return;
        }

        const head = frameDoc.head;
        const body = frameDoc.body;

        // Ensure Tailwind CSS is loaded
        if (!head.querySelector('link[href*="tailwind"]')) {
          const tailwindLink = document.createElement("link");
          tailwindLink.rel = "stylesheet";
          tailwindLink.href =
            "https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css";
          head.appendChild(tailwindLink);
        }

        if (!head.querySelector('script[src*="tailwindcss"]')) {
          const tailwindScript = document.createElement("script");
          tailwindScript.src = "https://cdn.tailwindcss.com/3.4.3";
          head.appendChild(tailwindScript);
        }

        // Toggle grid
        if (body) {
          if (showGrid) {
            body.style.backgroundImage =
              "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)";
            body.style.backgroundSize = "10px 10px";
          } else {
            body.style.backgroundImage = "none";
          }
        }
      };

      updateFrame();
    } catch (error) {
      console.warn("Could not access canvas frame:", error);
    }
  }, [showGrid]);

  const applyLayout = (layout: Slide["layout"]) => {
    if (!editorRef.current) return;
    // Layout logic would go here
    if (onLayoutChange) {
      onLayoutChange(layout);
    }
  };

  return (
    <div
      data-slide-id={slide.id}
      className={cn(
        "w-full h-full border border-border relative overflow-hidden group",
        slide.background?.color || themeStyle.bg
      )}
      style={{
        backgroundImage: slide.background?.image
          ? `url(${slide.background.image})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Slide Settings Menu */}
      {onDeleteSlide && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-50"
              onClick={(e) => e.stopPropagation()}
              title="Slide settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {onLayoutChange && (
              <>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Grid className="w-4 h-4 mr-2" />
                    Layout
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => applyLayout("default")}>
                      Default
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => applyLayout("title-only")}>
                      Title Only
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => applyLayout("two-column")}>
                      Two Column
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => applyLayout("image-left")}>
                      Image Left
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => applyLayout("image-right")}>
                      Image Right
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => applyLayout("centered")}>
                      Centered
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setShowGrid(!showGrid);
              }}
            >
              <Grid className="w-4 h-4 mr-2" />
              {showGrid ? "Hide" : "Show"} Grid
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSlide();
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Slide
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Slide Title */}
      {onTitleUpdate && (
        <div className="absolute top-8 left-8 right-8 z-10 pointer-events-none">
          <input
            type="text"
            value={slide.title || ""}
            onChange={(e) => onTitleUpdate(e.target.value)}
            placeholder="Slide title"
            className={cn(
              "text-5xl font-bold bg-transparent border-none outline-none w-full",
              themeStyle.text
            )}
            style={{ pointerEvents: "auto" }}
          />
        </div>
      )}

      {/* GrapesJS Editor Container */}
      <div
        ref={containerRef}
        className="w-full h-full p-8"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
}

