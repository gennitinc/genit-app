"use client";

import { Rocket } from "lucide-react";

export default function CampaignsPage() {
  return (
    <div className='flex min-h-[calc(100dvh-7rem)] flex-col items-center justify-center rounded-2xl bg-zinc-50 p-6 text-center dark:bg-[#070707]'>
      <div className='relative mb-8'>
        {/* Animated glow ring */}
        <div className='absolute inset-0 animate-ping rounded-full bg-sky-500/20' />
        <div className='absolute inset-0 animate-pulse rounded-full bg-sky-500/10' />
        <div className='relative flex h-20 w-20 items-center justify-center rounded-full border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-blue-600/10 shadow-lg shadow-sky-500/10 dark:border-sky-400/20 dark:from-sky-500/15 dark:to-blue-600/15'>
          <Rocket className='h-9 w-9 text-sky-500 dark:text-sky-400' />
        </div>
      </div>

      <h1 className='font-instrument-serif text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl dark:text-white'>
        Campaigns
      </h1>

      <p className='mt-3 max-w-md text-base text-zinc-500 dark:text-white/55'>
        Powerful campaign management tools are on the way. Create, schedule, and
        track multi-channel marketing campaigns — all from one place.
      </p>

      <div className='mt-6 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-2 text-sm font-medium text-sky-600 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300'>
        <span className='relative flex h-2 w-2'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75' />
          <span className='relative inline-flex h-2 w-2 rounded-full bg-sky-500' />
        </span>
        Coming Soon
      </div>

      <div className='mt-10 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-3'>
        {[
          { label: "Multi-channel", desc: "Launch across all platforms" },
          { label: "Analytics", desc: "Track ROI in real-time" },
          { label: "Automation", desc: "Smart scheduling & flows" },
        ].map((feature) => (
          <div
            key={feature.label}
            className='rounded-xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.035]'
          >
            <p className='text-sm font-semibold text-zinc-900 dark:text-white/90'>
              {feature.label}
            </p>
            <p className='mt-1 text-xs text-zinc-500 dark:text-white/45'>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
