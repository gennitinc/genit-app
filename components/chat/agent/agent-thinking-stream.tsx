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
    <div className='my-2 overflow-hidden rounded-lg border border-border/50 bg-muted-foreground/[0.04] text-[12.5px] dark:border-white/[0.07] dark:bg-white/[0.025]'>
      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className='flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-muted-foreground/[0.04] dark:hover:bg-white/[0.03]'
      >
        <Brain
          className={
            active
              ? "h-3.5 w-3.5 animate-pulse text-foreground"
              : "h-3.5 w-3.5 text-muted-foreground"
          }
        />
        <span className='text-[12px] font-medium tracking-tight text-foreground'>
          {active ? "Thinking…" : "Thought"}
        </span>
        {active && (
          <span className='ml-0.5 inline-flex gap-0.5'>
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className='h-1 w-1 animate-bounce rounded-full bg-muted-foreground/50'
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </span>
        )}
        <span className='ml-auto'>
          {open ? (
            <ChevronDown className='h-3.5 w-3.5 text-muted-foreground' />
          ) : (
            <ChevronRight className='h-3.5 w-3.5 text-muted-foreground' />
          )}
        </span>
      </button>

      {open && (
        <div className='border-t border-border/50 px-3 py-2.5 dark:border-white/[0.07]'>
          <div className='max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed text-muted-foreground'>
            {text || (active ? "…" : "")}
          </div>
        </div>
      )}
    </div>
  );
}
