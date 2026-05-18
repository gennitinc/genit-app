"use client";

import { Loader2, MessageCircleQuestion, Send } from "lucide-react";
import { useState } from "react";
import type { AgentElicitation } from "@/lib/agents-api";

export function ElicitationCard({
  elicitation,
  onSubmit,
  disabled,
}: {
  elicitation: AgentElicitation;
  onSubmit: (value: string) => Promise<void> | void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (v: string) => {
    if (!v.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(v);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='my-2 rounded-md border border-violet-500/30 bg-violet-500/[0.04] p-3 dark:bg-violet-500/[0.06]'>
      <div className='flex items-start gap-2'>
        <MessageCircleQuestion className='mt-0.5 h-4 w-4 shrink-0 text-violet-500' />
        <div className='min-w-0 flex-1'>
          <div className='text-foreground text-sm font-medium'>
            {elicitation.question}
          </div>
          {elicitation.options && elicitation.options.length > 0 ? (
            <div className='mt-2 flex flex-wrap gap-1.5'>
              {elicitation.options.map((opt) => (
                <button
                  key={opt.value}
                  type='button'
                  disabled={disabled || submitting}
                  onClick={() => submit(opt.value)}
                  className='border-border bg-card/60 hover:bg-card text-foreground rounded-md border px-2.5 py-1 text-xs transition-colors disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
                  title={opt.description}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : (
            <form
              className='mt-2 flex gap-2'
              onSubmit={(e) => {
                e.preventDefault();
                submit(value);
              }}
            >
              <input
                type='text'
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={disabled || submitting}
                placeholder='Type your answer…'
                className='border-border bg-card/60 placeholder:text-muted-foreground flex-1 rounded-md border px-2.5 py-1 text-xs focus:ring-1 focus:ring-violet-500/40 focus:outline-none dark:border-white/10 dark:bg-white/5'
              />
              <button
                type='submit'
                disabled={disabled || submitting || !value.trim()}
                className='inline-flex items-center gap-1 rounded-md bg-linear-to-r from-violet-500 to-fuchsia-500 px-2.5 py-1 text-xs font-medium text-white transition-all hover:bg-linear-to-bl disabled:opacity-60'
              >
                {submitting ? (
                  <Loader2 className='h-3 w-3 animate-spin' />
                ) : (
                  <Send className='h-3 w-3' />
                )}
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
