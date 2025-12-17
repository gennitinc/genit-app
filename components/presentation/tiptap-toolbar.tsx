"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Palette,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

interface TiptapToolbarProps {
  editor: Editor | null;
  className?: string;
  containerElement?: HTMLElement | null;
}

const FONT_SIZES = [
  { label: "8px", value: "8" },
  { label: "10px", value: "10" },
  { label: "12px", value: "12" },
  { label: "14px", value: "14" },
  { label: "16px", value: "16" },
  { label: "18px", value: "18" },
  { label: "20px", value: "20" },
  { label: "24px", value: "24" },
  { label: "28px", value: "28" },
  { label: "32px", value: "32" },
  { label: "36px", value: "36" },
  { label: "48px", value: "48" },
  { label: "64px", value: "64" },
  { label: "72px", value: "72" },
];

const FONT_FAMILIES = [
  { label: "Default", value: "default" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Helvetica", value: "Helvetica, sans-serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Courier New", value: "Courier New, monospace" },
  { label: "Comic Sans MS", value: "Comic Sans MS, cursive" },
  { label: "Impact", value: "Impact, sans-serif" },
];

const COLORS = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#808080",
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#800080",
  "#008080",
];

export function TiptapToolbar({
  editor,
  className,
  containerElement,
}: TiptapToolbarProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const updateToolbarPosition = () => {
      const { from, to } = editor.state.selection;
      if (from === to) {
        setIsVisible(false);
        return;
      }

      setIsVisible(true);

      // Find the block container element (parent of ProseMirror)
      const editorElement = editor.view.dom.closest(".ProseMirror");
      if (!editorElement) return;

      // Find the block container - look for data-block-container or draggable block
      let blockContainer = editorElement.parentElement;
      while (
        blockContainer &&
        !blockContainer.hasAttribute("data-block-container")
      ) {
        const draggableBlock = blockContainer.closest(
          '[style*="position: absolute"]'
        );
        if (draggableBlock) {
          blockContainer = draggableBlock as HTMLElement;
          break;
        }
        blockContainer = blockContainer.parentElement;
      }

      // If containerElement is provided, use it; otherwise use found block container
      const targetElement = containerElement || blockContainer;

      if (targetElement) {
        const containerRect = targetElement.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft =
          window.pageXOffset || document.documentElement.scrollLeft;

        setPosition({
          top: containerRect.top + scrollTop - 40,
          left: containerRect.left + scrollLeft + containerRect.width / 2,
        });
        return;
      }

      // Fallback to original positioning
      const { view } = editor;
      const { state } = view;
      const { selection } = state;
      const { $anchor } = selection;

      const coords = view.coordsAtPos($anchor.pos);

      if (editorElement) {
        const editorRect = editorElement.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft =
          window.pageXOffset || document.documentElement.scrollLeft;

        setPosition({
          top: coords.top - editorRect.top + scrollTop - 50,
          left: coords.left - editorRect.left + scrollLeft - 100,
        });
      }
    };

    editor.on("selectionUpdate", updateToolbarPosition);
    editor.on("focus", updateToolbarPosition);
    editor.on("blur", () => {
      // Delay hiding to allow clicking toolbar buttons
      setTimeout(() => {
        if (!editor.isFocused) {
          setIsVisible(false);
        }
      }, 200);
    });

    return () => {
      editor.off("selectionUpdate", updateToolbarPosition);
      editor.off("focus", updateToolbarPosition);
      editor.off("blur");
    };
  }, [editor, containerElement]);

  if (!editor || !isVisible) {
    return null;
  }

  const currentFontSize = editor.getAttributes("textStyle").fontSize || "16";
  const currentColor = editor.getAttributes("textStyle").color || "#000000";
  const currentFontFamily =
    editor.getAttributes("textStyle").fontFamily || "default";

  return (
    <div
      ref={toolbarRef}
      className={cn(
        "fixed z-[100] bg-background border border-border rounded shadow-sm p-1 flex items-center gap-1",
        className
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translateX(-50%)",
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Font Family */}
      <Select
        value={currentFontFamily}
        onValueChange={(value) => {
          if (value && value !== "default") {
            editor.chain().focus().setFontFamily(value).run();
          } else {
            editor.chain().focus().unsetFontFamily().run();
          }
        }}
      >
        <SelectTrigger className="h-8 w-[120px] text-xs">
          <SelectValue placeholder="Font" />
        </SelectTrigger>
        <SelectContent>
          {FONT_FAMILIES.map((font) => (
            <SelectItem key={font.value} value={font.value}>
              <span
                style={{
                  fontFamily: font.value === "default" ? "inherit" : font.value,
                }}
              >
                {font.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Font Size */}
      <Select
        value={currentFontSize.replace("px", "")}
        onValueChange={(value) => {
          editor.chain().focus().setFontSize(`${value}px`).run();
        }}
      >
        <SelectTrigger className="h-8 w-[70px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FONT_SIZES.map((size) => (
            <SelectItem key={size.value} value={size.value}>
              {size.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="h-6 w-px bg-border mx-1" />

      {/* Bold */}
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-8 w-8 p-0", editor.isActive("bold") && "bg-muted")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4 h-4" />
      </Button>

      {/* Italic */}
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-8 w-8 p-0", editor.isActive("italic") && "bg-muted")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-4 h-4" />
      </Button>

      {/* Underline */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("underline") && "bg-muted"
        )}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="w-4 h-4" />
      </Button>

      <div className="h-6 w-px bg-border mx-1" />

      {/* Text Align */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive({ textAlign: "left" }) && "bg-muted"
        )}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive({ textAlign: "center" }) && "bg-muted"
        )}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive({ textAlign: "right" }) && "bg-muted"
        )}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive({ textAlign: "justify" }) && "bg-muted"
        )}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustify className="w-4 h-4" />
      </Button>

      <div className="h-6 w-px bg-border mx-1" />

      {/* Color Picker */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => {
            // Toggle color picker or open color selector
            const input = document.createElement("input");
            input.type = "color";
            input.value = currentColor;
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              editor.chain().focus().setColor(target.value).run();
            };
            input.click();
          }}
        >
          <Palette className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
