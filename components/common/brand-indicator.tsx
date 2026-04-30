"use client";

import { useProjectDesign } from "@/context/DesignProject";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Info, Palette, Type } from "lucide-react";

export function BrandIndicator({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  const { selectedColorScales, primaryFont } = useProjectDesign();

  if (selectedColorScales.length === 0 && !primaryFont) return null;

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 px-2 transition-colors hover:bg-white/10",
        className
      )}
      onClick={onClick}
    >
      <div className="flex -space-x-2">
        {selectedColorScales.map((scale, i) => (
          <div
            key={i}
            className="h-4 w-4 rounded-full border border-white/20 shadow-sm"
            style={{ backgroundColor: scale.base }}
            title={i === 0 ? "Primary Color" : "Secondary Color"}
          />
        ))}
      </div>
      {primaryFont && (
        <span className="text-[10px] font-medium text-zinc-400 hidden md:inline-block">
          {primaryFont}
        </span>
      )}
    </div>
  );
}
