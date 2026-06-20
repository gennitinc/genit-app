"use client";

import { cn } from "@/lib/utils";
import { Slide } from "@/types/presentation-schema";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { ReactNode } from "react";

interface DraggableSlideProps {
  slide: Slide;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  children: ReactNode;
}

export function DraggableSlide({
  slide,
  index,
  isSelected,
  onSelect,
  children,
}: DraggableSlideProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: slide.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative",
        isSelected
          ? "rounded-lg ring-2 ring-purple-500"
          : "opacity-60 hover:opacity-80"
      )}
      onClick={(e) => {
        // Only select if not clicking on drag handle or interactive elements
        const target = e.target as HTMLElement;
        if (
          !target.closest("[data-drag-handle]") &&
          !target.closest("button") &&
          !target.closest("input") &&
          !target.closest(".ProseMirror")
        ) {
          onSelect();
        }
      }}
    >
      {/* Drag Handle */}
      <div
        data-drag-handle
        {...attributes}
        {...listeners}
        className='bg-background/80 border-border absolute top-1/2 -left-12 z-50 flex h-12 w-8 -translate-y-1/2 cursor-grab items-center justify-center rounded-lg border opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 active:cursor-grabbing'
      >
        <GripVertical className='text-muted-foreground h-4 w-4' />
      </div>

      {/* Slide Number Badge */}
      <div
        className={cn(
          "absolute -top-4 left-0 rounded-md px-2 py-1 text-xs font-medium transition-colors",
          isSelected
            ? "bg-purple-500 text-white"
            : "bg-muted text-muted-foreground"
        )}
      >
        Slide {index + 1}
      </div>

      {children}
    </div>
  );
}
