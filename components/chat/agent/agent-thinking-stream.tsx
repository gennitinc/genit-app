"use client";

import { Brain, ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export function AgentThinkingStream({
  text,
  active,
}: {
  text: string;
  active: boolean;
}) {
  const [userOpen, setUserOpen] = useState(false);
  const open = active || userOpen;

  useEffect(() => {
    if (!active) {
      setUserOpen(false);
    }
  }, [active]);

  if (!text && !active) return null;

  return (
    <div className='border-border/50 bg-muted-foreground/[0.04] mb-2 overflow-hidden rounded-lg border text-[12.5px] dark:border-white/[0.07] dark:bg-white/[0.025]'>
      <button
        type='button'
        onClick={() => {
          if (!active) {
            setUserOpen((o) => !o);
          }
        }}
        aria-expanded={open}
        className='hover:bg-muted-foreground/[0.04] flex w-full items-center gap-2 px-3 py-2 text-left transition-colors dark:hover:bg-white/[0.03]'
      >
        <Brain
          className={
            active
              ? "text-foreground h-3.5 w-3.5 animate-pulse"
              : "text-muted-foreground h-3.5 w-3.5"
          }
        />
        <span className='text-foreground text-[12px] font-medium tracking-tight'>
          {active ? "Thinking…" : "Thought"}
        </span>
        {active && (
          <span className='ml-0.5 inline-flex gap-0.5'>
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className='bg-muted-foreground/50 h-1 w-1 animate-bounce rounded-full'
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </span>
        )}
        <span className='ml-auto'>
          {open ? (
            <ChevronDown className='text-muted-foreground h-3.5 w-3.5' />
          ) : (
            <ChevronRight className='text-muted-foreground h-3.5 w-3.5' />
          )}
        </span>
      </button>

      {open && (
        <div className='border-border/50 border-t px-3 py-2.5 dark:border-white/[0.07]'>
          <div className='text-muted-foreground max-h-60 overflow-y-auto leading-relaxed whitespace-pre-wrap'>
            {text || (active ? "…" : "")}
          </div>
        </div>
      )}
    </div>
  );
}
