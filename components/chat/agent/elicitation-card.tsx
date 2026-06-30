"use client";

import { AgentButton, AgentCard, AgentInput } from "./agent-card";
import { BorderBeam } from "@/components/ui/border-beam";
import type { AgentElicitation } from "@/lib/agents-api";
import { LoadingFileLoader } from "@/utils/Loading";
import { Loader2, MessageCircleQuestion, Send } from "lucide-react";
import { useState } from "react";

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
  const [pickedValue, setPickedValue] = useState<string | null>(null);

  const submit = async (v: string) => {
    if (!v.trim()) return;
    setSubmitting(true);
    setPickedValue(v);
    try {
      await onSubmit(v);
    } finally {
      setSubmitting(false);
    }
  };

  const hasOptions = !!elicitation.options && elicitation.options.length > 0;

  return (
    <AgentCard
      icon={<MessageCircleQuestion className='h-3.5 w-3.5' />}
      title='Needs your input'
      tone='neutral'
      className='relative'
    >
      <BorderBeam
        duration={6}
        size={90}
        className='from-transparent via-red-500 to-transparent'
      />
      <BorderBeam
        duration={6}
        delay={10}
        size={90}
        borderWidth={2}
        className='from-transparent via-blue-500 to-transparent'
      />

      <p className='text-foreground text-sm leading-relaxed'>
        {elicitation.question}
      </p>

      {hasOptions ? (
        <div
          className='mt-3 flex flex-wrap gap-1.5'
          role='radiogroup'
          aria-label='Answer choices'
        >
          {elicitation.options!.map((opt) => {
            const isPicked = pickedValue === opt.value;
            return (
              <button
                key={opt.value}
                type='button'
                role='radio'
                aria-checked={isPicked}
                disabled={disabled || submitting}
                onClick={() => submit(opt.value)}
                title={opt.description}
                className={
                  isPicked
                    ? "bg-foreground text-background inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-60"
                    : "border-border/70 bg-background text-foreground hover:bg-accent inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                }
              >
                {isPicked && submitting && (
                  <LoadingFileLoader size={14} />
                )}
                {opt.label}
              </button>
            );
          })}
        </div>
      ) : (
        <form
          className='mt-3 flex items-center gap-2'
          onSubmit={(e) => {
            e.preventDefault();
            submit(value);
          }}
        >
          <AgentInput
            type='text'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled || submitting}
            placeholder='Type your answer…'
            autoFocus
          />
          <AgentButton
            type='submit'
            variant='primary'
            disabled={disabled || submitting || !value.trim()}
            className='h-8'
            aria-label='Send'
          >
            {submitting ? (
             <LoadingFileLoader size={14} />
            ) : (
              <Send className='h-3 w-3' />
            )}
            Send
          </AgentButton>
        </form>
      )}
    </AgentCard>
  );
}
