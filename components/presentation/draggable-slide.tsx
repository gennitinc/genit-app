"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slide } from "@/types/presentation-schema";
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
        "relative group",
        isSelected
          ? "ring-2 ring-purple-500 rounded-lg"
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
        className="absolute -left-12 top-1/2 -translate-y-1/2 h-12 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-50 bg-background/80 backdrop-blur-sm rounded-lg border border-border"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Slide Number Badge */}
      <div
        className={cn(
          "absolute -top-4 left-0 px-2 py-1 rounded-md text-xs font-medium transition-colors",
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

