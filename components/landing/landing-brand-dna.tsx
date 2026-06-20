import { GradientFrame } from "@/utils/gradient-frame";
import {
  CheckCircle2,
  Fingerprint,
  Globe,
  Image as ImageIcon,
  LayoutTemplate,
  Palette,
  Search,
  Wand2,
} from "lucide-react";
import Image from "next/image";
import React from "react";

export const LandingBrandDNA = () => {
  return (
    <section className='relative mr-auto ml-auto max-w-6xl px-2 py-16 pb-20 md:px-6 md:pt-10'>
      {/* Header */}
      <div className='relative z-10 mb-16 flex flex-col items-center'>
        <h2 className='text-foreground mt-6 text-center text-4xl font-semibold tracking-tight md:text-6xl dark:text-white'>
          One URL - Full Brand DNA.
        </h2>
        <p className='text-muted-foreground mx-auto mt-5 max-w-2xl text-center text-base font-normal md:text-lg dark:text-white/60'>
          Just paste your website and our AI instantly extracts your visual
          identity, tone of voice, and core assets in seconds.
        </p>
      </div>

      {/* Central Interactive Window */}
      <div className='relative mx-auto max-w-5xl rounded-[2rem] bg-white p-2 shadow-sm ring-1 ring-black/5 backdrop-blur-xl md:p-4 dark:bg-zinc-950/50 dark:shadow-sm dark:ring-white/10'>
        <GradientFrame />

        {/* Browser Top Bar */}
        <div className='mb-4 flex items-center gap-2 px-2 pt-2'>
          <div className='flex gap-1.5'>
            <div className='h-3 w-3 rounded-full bg-red-500/80' />
            <div className='h-3 w-3 rounded-full bg-yellow-500/80' />
            <div className='h-3 w-3 rounded-full bg-green-500/80' />
          </div>

         <div className='group relative mx-auto flex w-full max-w-md items-center gap-2 overflow-hidden rounded-xl bg-black/5 px-3 py-2 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10 sm:px-4'>
  <div className='pointer-events-none absolute inset-0 h-full w-full -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-orange-500/10 to-transparent dark:via-orange-500/20' />

  <Globe className='text-muted-foreground h-4 w-4 shrink-0 dark:text-white/40' />

  <span className='text-foreground min-w-0 flex-1 truncate font-mono text-xs tracking-tight dark:text-white/80 sm:text-sm'>
    https://your-brand.com
  </span>

  <div className='flex shrink-0 items-center rounded-full bg-gray-800 px-2 py-1 text-[10px] text-gray-200 ring-1 ring-gray-400'>
    <Search className='h-3 w-3 animate-pulse' />
    <span className='ml-1.5 hidden sm:inline'>Scanning</span>
  </div>
</div>
        </div>

        {/* Dashboard Grid inside Window */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
          {/* Left Column: Visuals */}
          <div className='col-span-1 space-y-4 md:col-span-5'>
            <div className='relative overflow-hidden rounded-2xl bg-black/[0.02] p-5 ring-1 ring-black/5 dark:bg-white/[0.02] dark:ring-white/10'>
              <div className='absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-10'>
                <Palette className='h-24 w-24 text-black dark:text-white' />
              </div>
              <h3 className='text-foreground mb-4 flex items-center gap-2 text-lg font-medium dark:text-white/90'>
                <Palette className='h-4 w-4 text-orange-600 dark:text-orange-400' />
                Visual Identity
              </h3>

              <div className='space-y-5'>
                <div>
                  <p className='text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase dark:text-white/50'>
                    Exact Hex Codes
                  </p>
                  <div className='flex gap-2'>
                    <div className='group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#FF4500] shadow-sm ring-2 ring-white transition-transform hover:scale-110 dark:ring-white/10'>
                      <span className='text-muted-foreground absolute -bottom-6 text-[9px] opacity-0 transition-opacity group-hover:opacity-100 dark:text-white/60'>
                        #FF4500
                      </span>
                    </div>
                    <div className='group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1A1A] shadow-sm ring-2 ring-white transition-transform hover:scale-110 dark:ring-white/10'>
                      <span className='text-muted-foreground absolute -bottom-6 text-[9px] opacity-0 transition-opacity group-hover:opacity-100 dark:text-white/60'>
                        #1A1A1A
                      </span>
                    </div>
                    <div className='group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F5] shadow-sm ring-2 ring-black/10 transition-transform hover:scale-110 dark:ring-white/10'>
                      <span className='text-muted-foreground absolute -bottom-6 text-[9px] opacity-0 transition-opacity group-hover:opacity-100 dark:text-white/60'>
                        #F5F5F5
                      </span>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase dark:text-white/50'>
                      Typography
                    </p>
                    <div className='flex flex-col'>
                      <span className='text-foreground font-serif text-2xl leading-none dark:text-white'>
                        Inter
                      </span>
                      <span className='text-muted-foreground text-[10px] dark:text-white/40'>
                        Primary Font
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className='text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase dark:text-white/50'>
                      Logo Vector
                    </p>
                    <div className='flex h-8 items-center'>
                      <span className='text-foreground text-xl font-black tracking-tighter dark:text-white'>
                        BRAND.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-between rounded-2xl bg-black/[0.02] p-5 ring-1 ring-black/5 dark:bg-white/[0.02] dark:ring-white/10'>
              <div className='flex items-center gap-3'>
                <ImageIcon className='text-muted-foreground h-8 w-8 dark:text-white/40' />
                <div>
                  <p className='text-foreground text-sm font-medium dark:text-white/90'>
                    Asset Auto-Sync
                  </p>
                  <p className='text-muted-foreground text-[11px] dark:text-white/50'>
                    124 images extracted
                  </p>
                </div>
              </div>
              <CheckCircle2 className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
            </div>
          </div>

          {/* Right Column: Voice & Profile */}
          <div className='col-span-1 flex flex-col gap-4 md:col-span-7 lg:flex-row'>
            {/* Brand Logo & Verification Card */}
            <div className='flex w-full flex-col items-center justify-center rounded-2xl bg-black/[0.02] p-6 ring-1 ring-black/5 lg:w-[35%] dark:bg-white/[0.02] dark:ring-white/10'>
              <div className='relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10'>
                <Image
                  src='/brandlogo1.png'
                  alt='Brand Logo'
                  width={64}
                  height={64}
                  className='h-16 w-16 rounded-2xl object-cover'
                />
              </div>
              <div className='flex flex-col items-center gap-1.5'>
                <div className='flex items-center gap-1.5'>
                  <span className='text-foreground text-xl leading-tight font-semibold antialiased dark:text-white'>
                    Your Brand
                  </span>
                  <Image
                    src='https://ext.same-assets.com/3322540528/871220803.png'
                    alt='Verified'
                    width={18}
                    height={18}
                    className='shrink-0'
                  />
                </div>
                <span className='text-muted-foreground text-xs dark:text-white/60'>
                  Verified Brand Profile
                </span>
              </div>
            </div>

            {/* Tone of Voice Profile */}
            <div className='relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-black/[0.02] p-5 ring-1 ring-black/5 lg:w-[65%] dark:bg-white/[0.02] dark:ring-white/10'>
              <div className='absolute right-0 bottom-0 p-4 opacity-[0.03] dark:opacity-5'>
                <Fingerprint className='h-48 w-48 text-black dark:text-white' />
              </div>

              <h3 className='text-foreground mb-4 flex items-center gap-2 text-lg font-medium dark:text-white/90'>
                <LayoutTemplate className='h-4 w-4 text-amber-700 dark:text-amber-700' />
                Tone of Voice Profile
              </h3>

              <div className='grid flex-1 grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div>
                    <p className='text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase dark:text-white/50'>
                      Voice Traits
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      <span className='inline-flex rounded-md px-2.5 py-1 text-xs ring-3 ring-amber-200 dark:ring-amber-500/20'>
                        Authoritative
                      </span>
                      <span className='text-foreground inline-flex rounded-md bg-black/5 px-2.5 py-1 text-xs ring-1 ring-black/5 dark:bg-white/5 dark:text-white/70 dark:ring-white/10'>
                        Witty
                      </span>
                      <span className='text-foreground inline-flex rounded-md bg-black/5 px-2.5 py-1 text-xs ring-1 ring-black/5 dark:bg-white/5 dark:text-white/70 dark:ring-white/10'>
                        Direct
                      </span>
                      <span className='text-foreground inline-flex rounded-md bg-black/5 px-2.5 py-1 text-xs ring-1 ring-black/5 dark:bg-white/5 dark:text-white/70 dark:ring-white/10'>
                        Modern
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className='text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase dark:text-white/50'>
                      Analysis Source
                    </p>
                    <div className='rounded-lg bg-black/5 p-3 ring-1 ring-black/5 dark:bg-black/40 dark:ring-white/5'>
                      <p className='text-muted-foreground line-clamp-3 text-xs italic dark:text-white/60'>
                        &quot;We build tools that get out of your way. Our
                        software empowers creators to focus on the art, while we
                        handle the boring stuff. Stop manually updating
                        spreadsheets and start scaling your vision.&quot;
                      </p>
                    </div>
                  </div>
                </div>

                <div className='relative flex flex-col justify-center rounded-xl bg-black/5 p-4 ring-1 ring-black/5 dark:bg-black/20 dark:ring-white/5'>
                  <div className='pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-amber-500/5 to-transparent' />
                  <LayoutTemplate className='mb-3 h-6 w-6 text-amber-700 dark:text-amber-700' />
                  <p className='text-foreground text-sm font-medium dark:text-white'>
                    Ready for Generation
                  </p>
                  <p className='text-muted-foreground relative z-10 mt-1 text-xs dark:text-white/50'>
                    Your entire brand DNA is now saved as an Organization
                  </p>
                  <div className='relative z-10 mt-4 h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10'>
                    <div className='h-full w-full bg-gray-800 dark:bg-gray-600' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingBrandDNA;
