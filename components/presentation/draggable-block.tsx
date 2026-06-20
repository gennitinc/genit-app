"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PresentationBlock } from "@/types/presentation-schema";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DraggableBlockProps {
  block: PresentationBlock;
  children: React.ReactNode;
  isSelected?: boolean;
  isDragging?: boolean;
  onSelect?: () => void;
  onUpdate?: (
    blockId: string,
    position: { x: number; y: number; width: number; height: number }
  ) => void;
  onDelete?: (blockId: string) => void;
  onZIndexChange?: (blockId: string, direction: "front" | "back") => void;
}

export function DraggableBlock({
  block,
  children,
  isSelected,
  isDragging = false,
  onSelect,
  onUpdate,
  onDelete,
  onZIndexChange,
}: DraggableBlockProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: block.id,
    disabled: isResizing,
  });

  const style = {
    position: "absolute" as const,
    left: `${block.position.x}px`,
    top: `${block.position.y}px`,
    width: `${block.position.width}px`,
    height: `${block.position.height}px`,
    transform: CSS.Translate.toString(transform),
    zIndex: isSelected ? 100 : block.order || 1,
    opacity: isDragging ? 0.5 : 1,
  };

  // Handle resizing
  useEffect(() => {
    if (!isResizing || !blockRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!blockRef.current || !startPosRef.current) return;

      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;

      let newWidth = startPosRef.current.width;
      let newHeight = startPosRef.current.height;
      let newX = block.position.x;
      let newY = block.position.y;

      switch (resizeHandle) {
        case "se": // Southeast
          newWidth = Math.max(50, startPosRef.current.width + deltaX);
          newHeight = Math.max(50, startPosRef.current.height + deltaY);
          break;
        case "sw": // Southwest
          newWidth = Math.max(50, startPosRef.current.width - deltaX);
          newHeight = Math.max(50, startPosRef.current.height + deltaY);
          newX = block.position.x + (startPosRef.current.width - newWidth);
          break;
        case "ne": // Northeast
          newWidth = Math.max(50, startPosRef.current.width + deltaX);
          newHeight = Math.max(50, startPosRef.current.height - deltaY);
          newY = block.position.y + (startPosRef.current.height - newHeight);
          break;
        case "nw": // Northwest
          newWidth = Math.max(50, startPosRef.current.width - deltaX);
          newHeight = Math.max(50, startPosRef.current.height - deltaY);
          newX = block.position.x + (startPosRef.current.width - newWidth);
          newY = block.position.y + (startPosRef.current.height - newHeight);
          break;
        case "e": // East
          newWidth = Math.max(50, startPosRef.current.width + deltaX);
          break;
        case "w": // West
          newWidth = Math.max(50, startPosRef.current.width - deltaX);
          newX = block.position.x + (startPosRef.current.width - newWidth);
          break;
        case "s": // South
          newHeight = Math.max(50, startPosRef.current.height + deltaY);
          break;
        case "n": // North
          newHeight = Math.max(50, startPosRef.current.height - deltaY);
          newY = block.position.y + (startPosRef.current.height - newHeight);
          break;
      }

      if (onUpdate) {
        onUpdate(block.id, {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, resizeHandle, block, onUpdate]);

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    if (blockRef.current) {
      const rect = blockRef.current.getBoundingClientRect();
      startPosRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: rect.width,
        height: rect.height,
      };
    }
  };

  const handleDragStart = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("[data-resize-handle]") ||
      target.closest(".ProseMirror") ||
      target.closest("[data-controls]")
    ) {
      return;
    }
    listeners?.onPointerDown?.(e as any);
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        blockRef.current = node;
      }}
      style={style}
      className={cn(
        "group relative cursor-move",
        isSelected && "ring-1 ring-blue-500"
      )}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        // Don't select if clicking on tiptap editor or interactive elements
        if (
          target.closest("button") ||
          target.closest("[data-resize-handle]") ||
          target.closest(".ProseMirror") ||
          target.closest("[data-controls]")
        ) {
          return;
        }
        onSelect?.();
      }}
      onMouseDown={handleDragStart}
      {...attributes}
    >
      {/* Controls Bar */}
      {isSelected && (
        <div
          data-controls
          className='bg-background border-border absolute -top-8 left-0 z-50 flex items-center gap-1 rounded border p-1 shadow-sm'
        >
          {/* Z-Index Controls */}
          {onZIndexChange && (
            <>
              <Button
                variant='ghost'
                size='sm'
                className='h-6 w-6 p-0'
                onClick={(e) => {
                  e.stopPropagation();
                  onZIndexChange(block.id, "front");
                }}
                title='Bring to front'
              >
                <ArrowUp className='h-3 w-3' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='h-6 w-6 p-0'
                onClick={(e) => {
                  e.stopPropagation();
                  onZIndexChange(block.id, "back");
                }}
                title='Send to back'
              >
                <ArrowDown className='h-3 w-3' />
              </Button>
            </>
          )}
          {/* Delete Button */}
          {onDelete && (
            <Button
              variant='ghost'
              size='sm'
              className='text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0'
              onClick={(e) => {
                e.stopPropagation();
                onDelete(block.id);
              }}
              title='Delete'
            >
              <X className='h-3 w-3' />
            </Button>
          )}
        </div>
      )}

      {/* Resize Handles */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <div
            data-resize-handle
            className='absolute -top-0.5 -left-0.5 z-20 h-2 w-2 cursor-nwse-resize border border-white bg-blue-500'
            onMouseDown={(e) => handleResizeStart(e, "nw")}
          />
          <div
            data-resize-handle
            className='absolute -top-0.5 -right-0.5 z-20 h-2 w-2 cursor-nesw-resize border border-white bg-blue-500'
            onMouseDown={(e) => handleResizeStart(e, "ne")}
          />
          <div
            data-resize-handle
            className='absolute -bottom-0.5 -left-0.5 z-20 h-2 w-2 cursor-nesw-resize border border-white bg-blue-500'
            onMouseDown={(e) => handleResizeStart(e, "sw")}
          />
          <div
            data-resize-handle
            className='absolute -right-0.5 -bottom-0.5 z-20 h-2 w-2 cursor-nwse-resize border border-white bg-blue-500'
            onMouseDown={(e) => handleResizeStart(e, "se")}
          />
          {/* Edge handles */}
          <div
            data-resize-handle
            className='absolute -top-0.5 left-1/2 z-20 h-2 w-2 -translate-x-1/2 cursor-ns-resize border border-white bg-blue-500'
            onMouseDown={(e) => handleResizeStart(e, "n")}
          />
          <div
            data-resize-handle
            className='absolute -bottom-0.5 left-1/2 z-20 h-2 w-2 -translate-x-1/2 cursor-ns-resize border border-white bg-blue-500'
            onMouseDown={(e) => handleResizeStart(e, "s")}
          />
          <div
            data-resize-handle
            className='absolute top-1/2 -left-0.5 z-20 h-2 w-2 -translate-y-1/2 cursor-ew-resize border border-white bg-blue-500'
            onMouseDown={(e) => handleResizeStart(e, "w")}
          />
          <div
            data-resize-handle
            className='absolute top-1/2 -right-0.5 z-20 h-2 w-2 -translate-y-1/2 cursor-ew-resize border border-white bg-blue-500'
            onMouseDown={(e) => handleResizeStart(e, "e")}
          />
        </>
      )}

      {/* Content */}
      <div className='h-full w-full overflow-hidden'>{children}</div>
    </div>
  );
}
