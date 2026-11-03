"use client";

import { LocalizedText } from "@/components/localized-text";
import { LoadingFileLoader } from "@/utils/Loading";

export function AgentThinkingOverlay({
  status,
  thinking,
  active = false,
}: {
  status?: string | null;
  thinking?: string;
  active?: boolean;
}) {
  const detail = thinking?.trim() || status || "Understanding your request…";

  return (
    <div className='relative flex h-full w-full overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 shadow-2xl dark:border-zinc-800/70 dark:bg-zinc-950'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(99,102,241,0.14),transparent_42%)]' />
      <div className='relative flex h-full w-full items-center justify-center p-8'>
        <div className='border-border/70 bg-background/90 flex w-full max-w-xl flex-col gap-4 rounded-2xl border p-6 shadow-xl backdrop-blur'>
          <div className='flex items-center gap-3'>
            {active && <LoadingFileLoader size={20} />}
            <div className='min-w-0'>
              <p className='text-sm font-semibold'>
                <LocalizedText text={active ? "Thinking" : "Ready"} />
              </p>
              <p className='text-muted-foreground text-xs'>
                <LocalizedText
                  text={
                    active
                      ? "Working through your request"
                      : "Your next result will appear here"
                  }
                />
              </p>
            </div>
          </div>
          <div className='bg-muted/60 max-h-72 overflow-y-auto rounded-xl px-4 py-3'>
            <p className='text-foreground/85 text-sm leading-6 whitespace-pre-wrap'>
              {detail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
