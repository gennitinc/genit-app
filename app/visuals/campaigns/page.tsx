"use client";

import { Rocket } from "lucide-react";

export default function CampaignsPage() {
  return (
    <div className='bg-muted/90 flex min-h-[calc(100dvh-7rem)] flex-col items-center justify-center rounded-3xl border border-zinc-200 p-2 text-center shadow-2xl lg:p-6 dark:border-zinc-800/50 dark:bg-[#070707]'>
      <article className='group relative w-full max-w-[420px] overflow-hidden rounded-2xl bg-[url(https://images.unsplash.com/photo-1724525647065-f948fc102e68?w=1080&q=80)] bg-cover shadow-xl lg:rounded-3xl'>
        <div className='relative z-10 flex h-full min-h-[320px] flex-col items-start justify-between bg-black/20 p-6 lg:min-h-[400px] lg:p-2'>
          {/* Top */}
          <div className='flex w-full items-start justify-between'>
            <div className='flex flex-wrap gap-2'>
              <span className='rounded-full bg-white/15 px-3 py-1 text-xs font-medium tracking-wider text-white/90 uppercase ring-1 ring-white/30 backdrop-blur-sm'>
                Multi-Channel
              </span>
              <span className='rounded-full bg-white/15 px-3 py-1 text-xs font-medium tracking-wider text-white/90 uppercase ring-1 ring-white/30 backdrop-blur-sm'>
                AI-Powered
              </span>
            </div>

            <button className='rounded-full bg-white/10 p-2 backdrop-blur-sm transition-colors hover:bg-white/20'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width={24}
                height={24}
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-4 w-4 text-white'
              >
                <path d='M15 3h6v6' />
                <path d='M10 14 21 3' />
                <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
              </svg>
            </button>
          </div>

          {/* Bottom Left */}
          <div className='mt-auto flex flex-col items-start text-left'>
            <h3 className='font-bricolage text-2xl font-normal tracking-tighter text-white'>
              Campaigns
            </h3>

            <span className='mt-3 rounded-full bg-white/15 px-3 py-1 text-xs font-medium tracking-wide text-white uppercase ring-1 ring-white/30 backdrop-blur-sm'>
              Coming Soon
            </span>

            <p className='mt-4 max-w-sm text-sm leading-relaxed text-white/85'>
              Plan, automate, launch, and monitor marketing campaigns across
              multiple channels.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
