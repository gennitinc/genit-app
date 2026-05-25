"use client";

import { Brain, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export function AgentThinkingStream({
  text,
  active,
}: {
  text: string;
  active: boolean;
}) {
  const [open, setOpen] = useState(true);
  if (!text && !active) return null;
  return (
    <div className='border-border/70 bg-card text-card-foreground my-3 overflow-hidden rounded-xl border shadow-[0_1px_0_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-white/[0.02] dark:shadow-none'>
      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className='hover:bg-muted/40 dark:hover:bg-white/[0.03] flex w-full items-center gap-2 px-3.5 py-2.5 text-left transition-colors'
      >
        <Brain
          className={
            active
              ? "text-foreground h-3.5 w-3.5 animate-pulse"
              : "text-muted-foreground h-3.5 w-3.5"
          }
        />
        <span className='text-foreground text-[13px] leading-none font-medium tracking-tight'>
          {active ? "Thinking" : "Thought"}
        </span>
        {active && (
          <span className='bg-foreground/70 ml-1 h-1.5 w-1.5 animate-pulse rounded-full' />
        )}
        {open ? (
          <ChevronDown className='text-muted-foreground ml-auto h-3.5 w-3.5' />
        ) : (
          <ChevronRight className='text-muted-foreground ml-auto h-3.5 w-3.5' />
        )}
      </button>
      {open && (
        <div className='border-border/70 border-t px-3.5 py-3 dark:border-white/10'>
          <div className='text-muted-foreground max-h-72 overflow-y-auto text-[12.5px] leading-relaxed whitespace-pre-wrap'>
            {text || (active ? "…" : "")}
          </div>
        </div>
      )}
    </div>
  );
}
