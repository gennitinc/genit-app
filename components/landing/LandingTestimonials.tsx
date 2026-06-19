"use client";

import React, { useState } from "react";

const testimonials = [
  {
    quote:
      "We replaced three separate marketing tools with Genit. The unified dashboard alone saved our team 15 hours a week. Campaign launches went from days to minutes.",
    stat1: "15h",
    stat1Label: "Weekly time saved",
    stat2: "<5 min",
    stat2Label: "Campaign launch",
    authorName: "Sarah Jenkins",
    authorRole: "CMO, Bright Horizons",
    avatar:
      "https://i.pinimg.com/736x/a0/cb/f8/a0cbf895e3e033b27a823ef8bb5b6a31.jpg",
  },
  {
    quote:
      "The brand DNA extractor is magical. It learned our exact tone of voice and color palette in seconds. Our generated ads perform 3x better than our manual ones.",
    stat1: "3x",
    stat1Label: "Higher ROAS",
    stat2: "100%",
    stat2Label: "Brand alignment",
    authorName: "Marcus Chen",
    authorRole: "Growth Lead, Relay",
    avatar:
      "https://i.pinimg.com/736x/74/3d/88/743d88dd2675cd87baa1b560f500c69c.jpg",
  },
  {
    quote:
      "Cross-platform scheduling used to take us days of manual formatting. With Genit, we generate and schedule weeks of content in one click. Absolutely game-changing.",
    stat1: "1 click",
    stat1Label: "Multi-platform sync",
    stat2: "10x",
    stat2Label: "Content output",
    authorName: "Priya Patel",
    authorRole: "Content Director, Quantus",
    avatar:
      "https://i.pinimg.com/736x/29/5f/f5/295ff586f4725e8b56b6ba08017e4a6d.jpg",
  },
  {
    quote:
      "Genit's autonomous agents handle everything from ad copy to email sequences. It's like having a full-time marketing team that never sleeps and never makes a mistake.",
    stat1: "24/7",
    stat1Label: "Autonomous execution",
    stat2: "Zero",
    stat2Label: "Manual oversight",
    authorName: "Alex Mercer",
    authorRole: "Founder, NexusTech",
    avatar:
      "https://i.pinimg.com/1200x/3e/f3/50/3ef350dc86cc82a092463e5d795654b5.jpg",
  },
];

const LandingTestimonials = () => {
  const [stopScroll, setStopScroll] = useState(false);

  return (
    <div className='mt-20 overflow-hidden py-16'>
      <div className='mr-auto ml-auto max-w-6xl px-6'>
        <h2 className='text-foreground mt-6 text-center text-4xl font-semibold tracking-tight md:text-6xl dark:text-white'>
          Testimonials
        </h2>
        <p className='text-muted-foreground mx-auto mt-5 max-w-2xl text-center text-base font-normal md:text-lg dark:text-white/70'>
          Real teams, real results. See how Genit is transforming modern
          marketing.
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .marquee-inner {
          animation: marqueeScroll linear infinite;
        }
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `,
        }}
      />

      <div
        className='relative mt-16 mr-auto ml-auto w-full max-w-7xl overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]'
        onMouseEnter={() => setStopScroll(true)}
        onMouseLeave={() => setStopScroll(false)}
      >
        <div
          className='marquee-inner flex w-fit'
          style={{
            animationPlayState: stopScroll ? "paused" : "running",
            animationDuration: "40s",
          }}
        >
          <div className='flex items-stretch'>
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className='group text-foreground mx-4 flex w-[300px] shrink-0 flex-col overflow-hidden rounded-3xl border border-black/5 bg-black/[0.02] shadow-sm transition-all duration-500 hover:border-black/10 hover:bg-black/5 md:w-[400px] dark:border-white/10 dark:bg-white/5 dark:text-white dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] dark:hover:border-white/20 dark:hover:bg-white/10'
              >
                <div className='relative flex flex-1 flex-col p-6 md:p-8'>
                  <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-white/5'></div>
                  <div className='relative z-10 flex flex-1 gap-4'>
                    <span className='text-muted-foreground/30 mt-2 font-serif text-5xl leading-none dark:text-white/20'>
                      “
                    </span>
                    <p className='text-muted-foreground mt-2 text-sm leading-relaxed font-normal md:text-base dark:font-light dark:text-zinc-200'>
                      {t.quote}
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-2 border-t border-black/5 bg-black/5 backdrop-blur-md dark:border-white/10 dark:bg-black/20'>
                  <div className='relative overflow-hidden border-r border-black/5 p-4 md:p-5 dark:border-white/10'>
                    <div className='text-foreground mb-1 text-[22px] font-bold drop-shadow-sm dark:text-white dark:drop-shadow-md'>
                      {t.stat1}
                    </div>
                    <div className='text-muted-foreground text-[10px] font-medium tracking-wide uppercase dark:text-zinc-400'>
                      {t.stat1Label}
                    </div>
                  </div>
                  <div className='relative overflow-hidden p-4 md:p-5'>
                    <div className='text-foreground mb-1 text-[22px] font-bold drop-shadow-sm dark:text-white dark:drop-shadow-md'>
                      {t.stat2}
                    </div>
                    <div className='text-muted-foreground text-[10px] font-medium tracking-wide uppercase dark:text-zinc-400'>
                      {t.stat2Label}
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-3 border-t border-black/5 bg-white p-4 backdrop-blur-lg md:p-5 dark:border-white/10 dark:bg-black/40'>
                  <div className='relative'>
                    <div className='absolute inset-0 rounded-full border border-black/10 shadow-sm dark:border-white/20 dark:shadow-[0_0_10px_rgba(255,255,255,0.1)]'></div>
                    <img
                      src={t.avatar}
                      alt={t.authorName}
                      className='h-10 w-10 rounded-full border-[2px] border-transparent object-cover brightness-100 dark:brightness-90 dark:grayscale'
                    />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-foreground text-sm font-semibold tracking-tight drop-shadow-sm dark:text-white'>
                      {t.authorName}
                    </span>
                    <span className='text-muted-foreground mt-0.5 text-[11px] dark:text-zinc-400'>
                      {t.authorRole}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingTestimonials;
