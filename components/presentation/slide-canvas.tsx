"use client";

import { ChartBlock } from "./chart-block";
import { DraggableBlock } from "./draggable-block";
import { TiptapEditor } from "./tiptap-editor";
import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PresentationBlock, Slide } from "@/types/presentation-schema";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Icon } from "@iconify/react";
import { ImageIcon, Settings, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

interface SlideCanvasProps {
  slide: Slide;
  onUpdate: (blocks: PresentationBlock[]) => void;
  onTitleUpdate?: (title: string) => void;
  onBlockSelect?: (blockId: string) => void;
  onIconEdit?: (blockId: string, iconName: string, color?: string) => void;
  onDeleteSlide?: () => void;
  selectedBlockId?: string;
  theme?: string;
}

export function SlideCanvas({
  slide,
  onUpdate,
  onTitleUpdate,
  onBlockSelect,
  onIconEdit,
  onDeleteSlide,
  selectedBlockId,
  theme = "onyx",
}: SlideCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    const block = slide.blocks.find((b) => b.id === event.active.id);
    if (block && canvasRef.current) {
      dragOffsetRef.current = {
        x: block.position.x,
        y: block.position.y,
      };
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    setActiveId(null);

    if (delta && dragOffsetRef.current && canvasRef.current) {
      const block = slide.blocks.find((b) => b.id === active.id);
      if (block) {
        const newX = Math.max(0, dragOffsetRef.current.x + delta.x);
        const newY = Math.max(0, dragOffsetRef.current.y + delta.y);
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const maxX = canvasRect.width - block.position.width;
        const maxY = canvasRect.height - block.position.height;

        const updatedBlocks = slide.blocks.map((b) =>
          b.id === active.id
            ? {
                ...b,
                position: {
                  ...b.position,
                  x: Math.min(newX, maxX),
                  y: Math.min(newY, maxY),
                },
              }
            : b
        );

        onUpdate(updatedBlocks);
      }
    }
    dragOffsetRef.current = null;
  };

  const handleBlockPositionUpdate = (
    blockId: string,
    position: { x: number; y: number; width: number; height: number }
  ) => {
    const updatedBlocks = slide.blocks.map((block) =>
      block.id === blockId ? { ...block, position } : block
    );
    onUpdate(updatedBlocks);
  };

  const handleZIndexChange = (blockId: string, direction: "front" | "back") => {
    const blockIndex = slide.blocks.findIndex((b) => b.id === blockId);
    if (blockIndex === -1) return;

    const updatedBlocks = [...slide.blocks];
    const [block] = updatedBlocks.splice(blockIndex, 1);

    if (direction === "front") {
      // Bring to front - highest order
      const maxOrder = Math.max(...updatedBlocks.map((b) => b.order), 0);
      block.order = maxOrder + 1;
      updatedBlocks.push(block);
    } else {
      // Send to back - lowest order
      const minOrder = Math.min(...updatedBlocks.map((b) => b.order), 0);
      block.order = minOrder - 1;
      updatedBlocks.unshift(block);
    }

    onUpdate(updatedBlocks);
  };

  const handleBlockUpdate = (blockId: string, content: string) => {
    const newBlocks = slide.blocks.map((block) =>
      block.id === blockId
        ? {
            ...block,
            content:
              typeof block.content === "string" ? content : block.content,
          }
        : block
    );
    onUpdate(newBlocks);
  };

  const handleBlockDelete = (blockId: string) => {
    const newBlocks = slide.blocks.filter((block) => block.id !== blockId);
    onUpdate(newBlocks);
  };

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

  // Sort blocks by order for proper z-index
  const sortedBlocks = [...slide.blocks].sort((a, b) => a.order - b.order);

  return (
    <div
      data-slide-id={slide.id}
      className={cn(
        "border-border group relative h-full w-full overflow-hidden rounded-xl border",
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
              variant='ghost'
              size='sm'
              className='absolute top-2 right-2 z-50 h-7 w-7 p-0 opacity-0 transition-opacity group-hover:opacity-100'
              onClick={(e) => e.stopPropagation()}
              title='Slide settings'
            >
              <Settings className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-40'>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSlide();
              }}
              className='text-destructive focus:text-destructive'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              <LocalizedText text={"Delete Slide"} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          ref={canvasRef}
          className='relative h-full w-full p-8 px-0'
          onClick={(e) => {
            // Deselect when clicking on canvas
            if (e.target === e.currentTarget) {
              onBlockSelect?.(undefined as any);
            }
          }}
        >
          {/* Empty State */}
          {slide.blocks.length === 0 && (
            <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
              <p className={cn("text-muted-foreground", themeStyle.text)}>
                <LocalizedText
                  text={'Click "Text" or "Templates" to add content'}
                />
              </p>
            </div>
          )}

          {/* Blocks - Absolutely Positioned */}
          {/* {sortedBlocks.map((block) => (
            <DraggableBlock
              key={block.id}
              block={block}
              isSelected={selectedBlockId === block.id}
              isDragging={activeId === block.id}
              onSelect={() => onBlockSelect?.(block.id)}
              onUpdate={handleBlockPositionUpdate}
              onDelete={handleBlockDelete}
              onZIndexChange={handleZIndexChange}
            >
              <div
                data-block-container
                className={cn(
                  "w-full h-full",
                  block.type === "icon"
                    ? "flex items-center justify-center"
                    : ""
                )}
                style={{
                  backgroundColor: block.style?.backgroundColor,
                  borderRadius: block.style?.borderRadius
                    ? `${block.style.borderRadius}px`
                    : undefined,
                  border: block.style?.border,
                }}
              >
                {block.type === "text" || block.type === "heading" ? (
                  <TiptapEditor
                    content={
                      typeof block.content === "string" ? block.content : ""
                    }
                    onChange={(content) => handleBlockUpdate(block.id, content)}
                    placeholder={
                      block.type === "heading"
                        ? "Enter heading..."
                        : "Start typing..."
                    }
                    className={cn(
                      "w-full h-full",
                      block.type === "heading" && "text-2xl font-bold",
                      themeStyle.text
                    )}
                    showToolbar={true}
                  />
                ) : block.type === "image" ? (
                  <div className="w-full h-full rounded-lg overflow-hidden border border-border">
                    {block.content && typeof block.content === "string" ? (
                      <img
                        src={block.content}
                        alt="Slide image"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full bg-muted/30 flex items-center justify-center">
                                <svg class="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ) : block.type === "icon" ? (
                  <div
                    className="flex items-center justify-center cursor-pointer"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      const iconName =
                        block.content && typeof block.content === "string"
                          ? block.content
                          : block.iconName;
                      if (iconName && onIconEdit) {
                        const color = block.style?.color || undefined;
                        onIconEdit(block.id, iconName, color);
                      }
                    }}
                    title="Double-click to edit icon"
                  >
                    {block.content && typeof block.content === "string" ? (
                      <Icon
                        icon={block.content}
                        className={cn("w-full h-full", themeStyle.text)}
                        style={{
                          color: block.style?.color,
                          width: block.style?.fontSize || "48px",
                          height: block.style?.fontSize || "48px",
                        }}
                      />
                    ) : block.iconName ? (
                      <Icon
                        icon={block.iconName}
                        className={cn("w-full h-full", themeStyle.text)}
                        style={{
                          color: block.style?.color,
                          width: block.style?.fontSize || "48px",
                          height: block.style?.fontSize || "48px",
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center border border-border">
                        <span className="text-xs text-muted-foreground">
                          Icon
                        </span>
                      </div>
                    )}
                  </div>
                ) : block.type === "chart" ? (
                  <div className="w-full h-full">
                    {(() => {
                      try {
                        const chartConfig =
                          typeof block.content === "string"
                            ? JSON.parse(block.content)
                            : block.chartData || {};
                        return (
                          <ChartBlock
                            chartType={chartConfig.chartType || "bar"}
                            chartData={chartConfig.chartData}
                            config={chartConfig.config}
                          />
                        );
                      } catch (e) {
                        return (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            Invalid chart data
                          </div>
                        );
                      }
                    })()}
                  </div>
                ) : block.type === "list" ? (
                  <TiptapEditor
                    content={
                      typeof block.content === "string" ? block.content : ""
                    }
                    onChange={(content) => handleBlockUpdate(block.id, content)}
                    placeholder="Add list items..."
                    className={cn("w-full h-full", themeStyle.text)}
                    showToolbar={true}
                  />
                ) : block.type === "quote" ? (
                  <TiptapEditor
                    content={
                      typeof block.content === "string" ? block.content : ""
                    }
                    onChange={(content) => handleBlockUpdate(block.id, content)}
                    placeholder="Enter quote..."
                    className={cn("w-full h-full italic", themeStyle.text)}
                    showToolbar={true}
                  />
                ) : (
                  <div className={cn("w-full h-full", themeStyle.text)}>
                    {typeof block.content === "string" ? block.content : ""}
                  </div>
                )}
              </div>
            </DraggableBlock>
          ))} */}
        </div>
      </DndContext>
    </div>
  );
}
