"use client";

import { LocalizedText } from "@/components/localized-text";
import { LoadingFileLoader } from "@/utils/Loading";

export function AgentThinkingOverlay({ status }: { status?: string | null }) {
  return (
    <div className='absolute inset-0 z-50 rounded-b-3xl border border-white/10 bg-white/5 backdrop-blur-2xl dark:bg-black/10'>
      <div className='pointer-events-none absolute inset-0 rounded-b-3xl bg-gradient-to-br from-white/10 to-transparent' />
      <div className='flex h-full w-full items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <LoadingFileLoader size={20} />
          <div className='flex flex-col items-center gap-1.5 px-2'>
            <p className='text-[11px] font-bold tracking-[0.2em] text-black uppercase dark:text-white/80'>
              <LocalizedText text={"Agent Thinking"} />
            </p>
            <p className='text-center text-[9px] leading-relaxed text-black italic dark:text-white/60'>
              {status || "Crafting unique design concepts..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
