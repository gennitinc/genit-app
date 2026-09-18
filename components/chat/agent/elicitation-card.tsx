"use client";

import { AgentButton, AgentCard, AgentInput } from "./agent-card";
import { LocalizedText } from "@/components/localized-text";
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
  const isVisualSizePicker = ["image_size", "video_size"].includes(
    elicitation.presentation || ""
  );

  const imageSizes: Record<
    string,
    { orientation: string; dimensions: string }
  > = {
    "1:1": { orientation: "Square", dimensions: "1024 × 1024" },
    "4:5": { orientation: "Portrait", dimensions: "1024 × 1280" },
    "2:3": { orientation: "Tall portrait", dimensions: "1024 × 1536" },
    "9:16": { orientation: "Story", dimensions: "1080 × 1920" },
    "3:2": { orientation: "Landscape", dimensions: "1536 × 1024" },
    "16:9": { orientation: "Wide", dimensions: "1920 × 1080" },
    "4:3": { orientation: "Standard", dimensions: "1440 × 1080" },
  };
  const videoSizes: typeof imageSizes = {
    "1:1": { orientation: "Square", dimensions: "1080 × 1080" },
    "9:16": { orientation: "Vertical", dimensions: "1080 × 1920" },
    "16:9": { orientation: "Landscape", dimensions: "1920 × 1080" },
    "4:3": { orientation: "Standard", dimensions: "1440 × 1080" },
  };
  const visualSizes =
    elicitation.presentation === "video_size" ? videoSizes : imageSizes;

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
          className={
            isVisualSizePicker
              ? "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3"
              : "mt-3 flex flex-wrap gap-1.5"
          }
          role='radiogroup'
          aria-label='Answer choices'
        >
          {elicitation.options!.map((opt) => {
            const isPicked = pickedValue === opt.value;
            const imageSize = visualSizes[opt.value];
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
                  isVisualSizePicker
                    ? isPicked
                      ? "bg-foreground text-background flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg px-3 py-3 text-xs font-medium transition-colors disabled:opacity-60"
                      : "border-border/70 bg-background text-foreground hover:bg-accent flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border px-3 py-3 text-xs font-medium transition-colors disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                    : isPicked
                      ? "bg-foreground text-background inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-60"
                      : "border-border/70 bg-background text-foreground hover:bg-accent inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                }
              >
                {isPicked && submitting && <LoadingFileLoader size={12} />}
                {isVisualSizePicker && imageSize ? (
                  <>
                    <span
                      className='block max-h-9 max-w-12 rounded-[2px] border border-current/60'
                      style={{
                        aspectRatio: opt.value.replace(":", "/"),
                        height:
                          Number(opt.value.split(":")[0]) <=
                          Number(opt.value.split(":")[1])
                            ? "36px"
                            : "auto",
                        width:
                          Number(opt.value.split(":")[0]) >
                          Number(opt.value.split(":")[1])
                            ? "48px"
                            : "auto",
                      }}
                    />
                    <span>{imageSize.orientation}</span>
                    <span className='opacity-65'>
                      {opt.value} · {imageSize.dimensions}
                    </span>
                  </>
                ) : (
                  opt.label
                )}
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
              <LoadingFileLoader size={12} />
            ) : (
              <Send className='h-3 w-3' />
            )}
            <LocalizedText text={"Send"} />
          </AgentButton>
        </form>
      )}
    </AgentCard>
  );
}
