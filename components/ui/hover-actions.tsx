"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2, Copy, Check } from "lucide-react";
import { useState } from "react";

interface HoverActionsProps {
  visible: boolean;
  copied: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  className?: string;
}

export function HoverActions({
  visible,
  onEdit,
  onDelete,
  onCopy,
  copied,
  className = "",
}: HoverActionsProps) {
  
  return (
    <div
      className={`absolute top-2 right-2 flex items-center gap-0.5 bg-background border border-border rounded-md shadow-sm p-0.5 z-10 transition-all duration-200 ease-in-out ${
        visible
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 translate-y-1 pointer-events-none"
      } ${className}`}
    >
      <Button
        variant="ghost"
        size="sm"
        className="px-1.5 py-1 text-muted-foreground hover:text-foreground h-auto"
        onClick={onEdit}
      >
        <Edit className="w-3.5 h-3.5" />
      </Button>
      <div className="w-px h-4 bg-border"></div>
      <Button
        variant="ghost"
        size="sm"
        className="px-1.5 py-1 text-muted-foreground hover:text-foreground h-auto"
        onClick={onDelete}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
      <div className="w-px h-4 bg-border"></div>
      
      <Button
        variant="ghost"
        size="sm"
        className="px-1.5 py-1 text-muted-foreground hover:text-foreground transition-colors"
        onClick={onCopy}
        disabled={copied}
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
