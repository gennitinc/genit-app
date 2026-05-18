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
    <div className='border-border bg-card/40 my-2 rounded-md border dark:border-white/10 dark:bg-white/[0.02]'>
      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        className='hover:bg-card/60 flex w-full items-center gap-2 px-3 py-2 text-left dark:hover:bg-white/[0.04]'
      >
        <Brain
          className={`h-3.5 w-3.5 ${active ? "animate-pulse text-violet-500" : "text-muted-foreground"}`}
        />
        <span className='text-muted-foreground text-[10px] font-medium tracking-wide uppercase'>
          {active ? "Thinking…" : "Thought"}
        </span>
        {open ? (
          <ChevronDown className='text-muted-foreground ml-auto h-3.5 w-3.5' />
        ) : (
          <ChevronRight className='text-muted-foreground ml-auto h-3.5 w-3.5' />
        )}
      </button>
      {open && (
        <div className='text-muted-foreground border-border border-t px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap dark:border-white/10'>
          {text || (active ? "…" : "")}
        </div>
      )}
    </div>
  );
}
