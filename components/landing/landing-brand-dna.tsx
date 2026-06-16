import React from 'react';
import { 
  Palette, Image as ImageIcon, Search, 
  Wand2, Fingerprint, LayoutTemplate,
  CheckCircle2, Globe
} from 'lucide-react';
import { GradientFrame } from '@/utils/gradient-frame';

export const LandingBrandDNA = () => {
  return (
    <section className="md:px-10 md:py-24 max-w-6xl mr-auto ml-auto py-16 pr-6 pl-6 relative">

      {/* Header */}
      <div className="flex flex-col items-center mb-16 relative z-10">
      
        
        <h2 className="mt-6 text-center text-4xl md:text-6xl font-semibold tracking-tight text-foreground dark:text-white">
          One URL.
          <span className="block text-purple-600 dark:text-purple-400">
            Full Brand DNA.
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base md:text-lg text-muted-foreground dark:text-white/60 font-normal">
          No tedious forms. No manual uploads. Paste your website and our AI instantly extracts your visual identity, tone of voice, and core assets in seconds.
        </p>
      </div>

      {/* Central Interactive Window */}
      <div className="relative mx-auto max-w-5xl rounded-[2rem] bg-white dark:bg-zinc-950/50 p-2 md:p-4 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-xl shadow-xl dark:shadow-2xl">
        <GradientFrame />
        
        {/* Browser Top Bar */}
        <div className="flex items-center gap-2 mb-4 px-2 pt-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          
          <div className="mx-auto flex w-full max-w-md items-center gap-2 rounded-xl bg-black/5 dark:bg-white/5 px-4 py-2 ring-1 ring-black/5 dark:ring-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-purple-500/10 dark:via-purple-500/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
            
            <Globe className="h-4 w-4 text-muted-foreground dark:text-white/40" />
            <span className="text-sm text-foreground dark:text-white/80 font-mono tracking-tight flex-1">https://your-brand.com</span>
            
            <div className="flex items-center gap-1.5 rounded-full bg-purple-100 dark:bg-purple-500/20 px-2 py-0.5 text-[10px] text-purple-700 dark:text-purple-300 ring-1 ring-purple-200 dark:ring-purple-500/30">
              <Search className="h-3 w-3 animate-pulse" /> Scanning
            </div>
          </div>
        </div>

        {/* Dashboard Grid inside Window */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Left Column: Visuals */}
          <div className="col-span-1 md:col-span-5 space-y-4">
            <div className="rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] ring-1 ring-black/5 dark:ring-white/10 p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-10">
                <Palette className="w-24 h-24 text-black dark:text-white" />
              </div>
              <h3 className="text-lg font-medium text-foreground dark:text-white/90 flex items-center gap-2 mb-4">
                <Palette className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Visual Identity
              </h3>
              
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-muted-foreground dark:text-white/50 mb-2 uppercase tracking-wider font-semibold">Exact Hex Codes</p>
                  <div className="flex gap-2">
                    <div className="group relative w-12 h-12 rounded-full bg-[#FF4500] ring-2 ring-white dark:ring-white/10 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                      <span className="absolute -bottom-6 text-[9px] text-muted-foreground dark:text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">#FF4500</span>
                    </div>
                    <div className="group relative w-12 h-12 rounded-full bg-[#1A1A1A] ring-2 ring-white dark:ring-white/10 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                      <span className="absolute -bottom-6 text-[9px] text-muted-foreground dark:text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">#1A1A1A</span>
                    </div>
                    <div className="group relative w-12 h-12 rounded-full bg-[#F5F5F5] ring-2 ring-black/10 dark:ring-white/10 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                      <span className="absolute -bottom-6 text-[9px] text-muted-foreground dark:text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">#F5F5F5</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <p className="text-xs text-muted-foreground dark:text-white/50 mb-2 uppercase tracking-wider font-semibold">Typography</p>
                     <div className="flex flex-col">
                       <span className="text-2xl font-serif text-foreground dark:text-white leading-none">Inter</span>
                       <span className="text-[10px] text-muted-foreground dark:text-white/40">Primary Font</span>
                     </div>
                  </div>
                  <div>
                     <p className="text-xs text-muted-foreground dark:text-white/50 mb-2 uppercase tracking-wider font-semibold">Logo Vector</p>
                     <div className="h-8 flex items-center">
                       <span className="text-xl font-black tracking-tighter text-foreground dark:text-white">BRAND.</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] ring-1 ring-black/5 dark:ring-white/10 p-5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <ImageIcon className="w-8 h-8 text-muted-foreground dark:text-white/40" />
                 <div>
                   <p className="text-sm font-medium text-foreground dark:text-white/90">Asset Auto-Sync</p>
                   <p className="text-[11px] text-muted-foreground dark:text-white/50">124 images extracted</p>
                 </div>
               </div>
               <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          {/* Right Column: Voice & Profile */}
          <div className="col-span-1 md:col-span-7 space-y-4">
            <div className="rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] ring-1 ring-black/5 dark:ring-white/10 p-5 h-full relative overflow-hidden flex flex-col">
              <div className="absolute bottom-0 right-0 p-4 opacity-[0.03] dark:opacity-5">
                <Fingerprint className="w-48 h-48 text-black dark:text-white" />
              </div>
              
              <h3 className="text-lg font-medium text-foreground dark:text-white/90 flex items-center gap-2 mb-4">
                <LayoutTemplate className="h-4 w-4 text-fuchsia-600 dark:text-fuchsia-400" />
                Tone of Voice Profile
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground dark:text-white/50 mb-2 uppercase tracking-wider font-semibold">Voice Traits</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex px-2.5 py-1 rounded-md bg-fuchsia-100 dark:bg-fuchsia-500/10 text-xs text-fuchsia-700 dark:text-fuchsia-300 ring-1 ring-fuchsia-200 dark:ring-fuchsia-500/20">Authoritative</span>
                      <span className="inline-flex px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/5 text-xs text-foreground dark:text-white/70 ring-1 ring-black/5 dark:ring-white/10">Witty</span>
                      <span className="inline-flex px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/5 text-xs text-foreground dark:text-white/70 ring-1 ring-black/5 dark:ring-white/10">Direct</span>
                      <span className="inline-flex px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/5 text-xs text-foreground dark:text-white/70 ring-1 ring-black/5 dark:ring-white/10">Modern</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground dark:text-white/50 mb-2 uppercase tracking-wider font-semibold">Analysis Source</p>
                    <div className="rounded-lg bg-black/5 dark:bg-black/40 p-3 ring-1 ring-black/5 dark:ring-white/5">
                      <p className="text-xs text-muted-foreground dark:text-white/60 italic line-clamp-3">
                        &quot;We build tools that get out of your way. Our software empowers creators to focus on the art, while we handle the boring stuff. Stop manually updating spreadsheets and start scaling your vision.&quot;
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/5 dark:bg-black/20 rounded-xl p-4 ring-1 ring-black/5 dark:ring-white/5 flex flex-col justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-500/5 to-transparent rounded-xl pointer-events-none" />
                  <LayoutTemplate className="w-6 h-6 text-fuchsia-600 dark:text-fuchsia-400 mb-3" />
                  <p className="text-sm font-medium text-foreground dark:text-white">Ready for Generation</p>
                  <p className="text-xs text-muted-foreground dark:text-white/50 mt-1 relative z-10">
                    Your entire brand DNA is now saved as a profile. You can instantly apply this to any generated ad, social post, or email campaign.
                  </p>
                  <div className="mt-4 h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden relative z-10">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}

export default LandingBrandDNA;
