"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit01Icon, Tick02Icon, Copy01Icon } from "@hugeicons/core-free-icons";
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
      className={`bg-background border-border absolute top-2 right-2 z-10 flex items-center gap-0.5 rounded-md border p-0.5 shadow-sm transition-all duration-200 ease-in-out ${
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-1 scale-95 opacity-0"
      } ${className}`}
    >
      <Button
        variant='ghost'
        size='sm'
        className='text-muted-foreground hover:text-foreground h-auto px-1.5 py-1'
        onClick={onEdit}
      >
        <HugeiconsIcon icon={PencilEdit01Icon} className='h-3.5 w-3.5' />
      </Button>
      <div className='bg-border h-4 w-px'></div>

      <Button
        variant='ghost'
        size='sm'
        className='text-muted-foreground hover:text-foreground px-1.5 py-1 transition-colors'
        onClick={onCopy}
        disabled={copied}
      >
        {copied ? (
          <HugeiconsIcon icon={Tick02Icon} className='h-4 w-4 text-green-500' />
        ) : (
          <HugeiconsIcon icon={Copy01Icon} className='h-4 w-4' />
        )}
      </Button>
    </div>
  );
}
