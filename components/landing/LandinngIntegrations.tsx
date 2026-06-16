import React from 'react';
import { 
  BarChart3, Activity, Globe2, Repeat, ShieldCheck, 
  Boxes, MessageSquare, Calendar, Database, 
  Workflow, Clock, Image as ImageIcon, Mail, 
  Megaphone, Target, Send, Layers, CheckCircle2
} from 'lucide-react';
import { InstagramBrand, FacebookBrand, XBrand, LinkedinBrand, TikTokBrand, BrevoBrand } from '@/app/(auth)/onboarding/_components/social-icons';
import { GradientFrame } from '@/utils/gradient-frame';

const LandinngIntegrations = () => {
  return (
    <section className="px-2 md:px-6 md:pt-5 max-w-6xl mr-auto ml-auto pt-20">
      
      {/* Heading */}
      <h1 className="mt-6 text-center text-4xl md:text-6xl font-semibold tracking-tight text-foreground dark:text-white">
        Scaling just got easier
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-center text-base md:text-lg text-muted-foreground dark:text-white/70 font-normal">
        From content creation and scheduling to ads and analytics, Genit streamlines your entire workflow.
      </p>

      {/* Grid */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* Card 1: Track Performance */}
        <section
          id="card-realtime"
          className="group relative bg-black/[0.02] dark:bg-white/[0.04] ring-1 ring-black/5 dark:ring-white/10 rounded-3xl p-5 md:p-6"
        >
          <GradientFrame />
          
          {/* Inset UI preview */}
          <div className="rounded-2xl bg-white dark:bg-white/5 p-4 ring-1 ring-black/5 dark:ring-white/10 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 text-foreground dark:text-white/80 text-sm mb-3">
              <BarChart3 className="h-4 w-4 text-sky-500 dark:text-sky-300" />
              <span className="font-medium">Campaign Monitor</span>
            </div>
            
            <div className="space-y-3">
              {/* Row 1 */}
              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.04] p-3 ring-1 ring-black/5 dark:ring-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white ring-1 ring-black/5 dark:ring-0">
                    <FacebookBrand className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground dark:text-white/90">Meta Ads</p>
                      <p className="text-xs text-muted-foreground dark:text-white/60">24.5k Clicks</p>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-sky-500 w-[75%]" />
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground dark:text-white/50">Summer Promo Campaign</p>
              </div>
              
              {/* Row 2 */}
              <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.04] p-3 ring-1 ring-black/5 dark:ring-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                    <TikTokBrand className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground dark:text-white/90">TikTok Ads</p>
                      <p className="text-xs text-muted-foreground dark:text-white/60">12.8k Clicks</p>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500 w-[45%]" />
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground dark:text-white/50">Product Launch Video</p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <button className="inline-flex items-center gap-2 rounded-full bg-sky-100 dark:bg-sky-500/15 px-3 py-1.5 text-xs text-sky-700 dark:text-sky-200 ring-1 ring-sky-200 dark:ring-sky-400/30 hover:bg-sky-200 dark:hover:bg-sky-500/20 transition">
                <Target className="h-4 w-4" />
                Optimize Ads
              </button>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground dark:text-white/50">
                <Activity className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-300" />
                Live
              </div>
            </div>
          </div>
          
          <h3 className="mt-5 text-xl md:text-2xl font-semibold tracking-tight text-foreground dark:text-white">Track Campaign Performance</h3>
          <p className="mt-1.5 text-sm text-muted-foreground dark:text-white/70">
            Monitor your ad spend, clicks, and conversions across Meta, Google, and TikTok in real-time.
          </p>
        </section>

        {/* Card 2: Publish Anywhere */}
        <section
          id="card-borders"
          className="group relative bg-black/[0.02] dark:bg-white/[0.04] ring-1 ring-black/5 dark:ring-white/10 rounded-3xl p-5 md:p-6"
        >
          <GradientFrame />
          
          {/* Inset UI preview */}
          <div className="rounded-2xl bg-white dark:bg-white/5 p-4 ring-1 ring-black/5 dark:ring-white/10 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground dark:text-white/80 text-sm">
                <Globe2 className="h-4 w-4 text-indigo-500 dark:text-indigo-300" />
                <span className="font-medium">Cross-Platform Publishing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground dark:text-white/60">Auto-sync</span>
                <Repeat className="h-4 w-4 text-muted-foreground dark:text-white/40" />
              </div>
            </div>
            
            {/* Sliding list */}
            <div className="overflow-hidden h-37 rounded-xl ring-black/5 dark:ring-white/10 ring-1 mt-3">
              <ul className="relative flex flex-col gap-1 p-2">
                <li className="flex items-center justify-between rounded-lg bg-black/[0.02] dark:bg-white/[0.04] p-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                      <InstagramBrand className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground dark:text-white/90">Instagram Story</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Published • 2m ago</p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </li>
                <li className="flex items-center justify-between rounded-lg bg-black/[0.02] dark:bg-white/[0.04] p-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                      <LinkedinBrand className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground dark:text-white/90">LinkedIn Post</p>
                      <p className="text-[11px] text-sky-600 dark:text-sky-400">Scheduled • Tomorrow</p>
                    </div>
                  </div>
                  <Clock className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                </li>
                <li className="flex items-center justify-between rounded-lg bg-black/[0.02] dark:bg-white/[0.04] p-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                      <XBrand className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground dark:text-white/90">X (Twitter) Thread</p>
                      <p className="text-[11px] text-amber-600 dark:text-amber-400">Draft • Pending review</p>
                    </div>
                  </div>
                  <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </li>
              </ul>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground dark:text-white/60">
              <Layers className="h-3.5 w-3.5" />
              Format once, publish everywhere
            </div>
          </div>
          
          <h3 className="mt-5 text-xl md:text-2xl font-semibold tracking-tight text-foreground dark:text-white">Publish Anywhere</h3>
          <p className="mt-1.5 text-sm text-muted-foreground dark:text-white/70">
            Generate tailored content for each platform and schedule it to publish directly to your social accounts.
          </p>
        </section>

        {/* Card 3: Connect Your Tools */}
        <section
          id="card-collab"
          className="group relative bg-black/[0.02] dark:bg-white/[0.04] ring-1 ring-black/5 dark:ring-white/10 rounded-3xl p-5 md:p-6"
        >
          <GradientFrame />
          
          <div className="rounded-2xl bg-white dark:bg-white/5 p-4 ring-1 ring-black/5 dark:ring-white/10 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 text-foreground dark:text-white/80 text-sm">
              <Boxes className="h-4 w-4 text-emerald-500 dark:text-emerald-300" />
              <span className="font-medium">Connects with your stack</span>
            </div>
            
            <div className="mt-3 grid grid-cols-4 gap-3">
              <div className="flex flex-col items-center gap-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] p-3 ring-1 ring-black/5 dark:ring-white/10">
                <Database className="h-5 w-5 text-foreground dark:text-white/80" />
                <span className="text-xs text-muted-foreground dark:text-white/70">Products</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] p-3 ring-1 ring-black/5 dark:ring-white/10">
                <ImageIcon className="h-5 w-5 text-foreground dark:text-white/80" />
                <span className="text-xs text-muted-foreground dark:text-white/70">Assets</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] p-3 ring-1 ring-black/5 dark:ring-white/10">
                <Mail className="h-5 w-5 text-foreground dark:text-white/80" />
                <span className="text-xs text-muted-foreground dark:text-white/70">Email</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] p-3 ring-1 ring-black/5 dark:ring-white/10">
                <Megaphone className="h-5 w-5 text-foreground dark:text-white/80" />
                <span className="text-xs text-muted-foreground dark:text-white/70">Ads</span>
              </div>
            </div>
            
            <div className="mt-3 overflow-hidden rounded-xl bg-black/[0.02] dark:bg-white/[0.04] ring-1 ring-black/5 dark:ring-white/10">
              <div className="relative grid grid-cols-6 gap-2 p-3">
                <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 col-span-2" />
                <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 col-span-3" />
                <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 col-span-1" />
                <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 col-span-4" />
                <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 col-span-2" />
              </div>
              <div className="flex items-center gap-2 border-t border-black/5 dark:border-white/10 px-3 py-2">
                <div className="flex -space-x-2">
                  <img src="https://i.pinimg.com/736x/a0/cb/f8/a0cbf895e3e033b27a823ef8bb5b6a31.jpg" alt="User 1" className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-[#0a0a0a]" />
                  <img src="https://i.pinimg.com/736x/74/3d/88/743d88dd2675cd87baa1b560f500c69c.jpg" alt="User 2" className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-[#0a0a0a]" />
                  <img src="https://i.pinimg.com/736x/5f/5f/3c/5f5f3c82349c1dd8552ffa7e97423fb2.jpg" alt="User 3" className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-[#0a0a0a]" />
                  {/* <img src="https://i.pinimg.com/736x/29/5f/f5/295ff586f4725e8b56b6ba08017e4a6d.jpg" alt="User 4" className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-[#0a0a0a]" />
                  <img src="https://i.pinimg.com/1200x/3e/f3/50/3ef350dc86cc82a092463e5d795654b5.jpg" alt="User 5" className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-[#0a0a0a]" /> */}
                  {/* <img src="https://i.pinimg.com/736x/eb/76/a4/eb76a46ab920d056b02d203ca95e9a22.jpg" alt="User 6" className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-[#0a0a0a]" /> */}
                  <img src="https://i.pinimg.com/736x/48/08/6e/48086ebb8989d9d6dde7d12d9f2939fd.jpg" alt="User 7" className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-[#0a0a0a]" />
                  <img src="https://i.pinimg.com/1200x/b2/db/80/b2db80290f2aba3567213d4eab1117a5.jpg" alt="User 8" className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-[#0a0a0a]" />
                </div>
                <span className="ml-2 text-[11px] text-muted-foreground dark:text-white/60">
                  Synced across tools
                </span>
              </div>
            </div>
          </div>
          
          <h3 className="mt-5 text-xl md:text-2xl font-semibold tracking-tight text-foreground dark:text-white">Connect Your Stack</h3>
          <p className="mt-1.5 text-sm text-muted-foreground dark:text-white/70">
            Integrate with the tools you already use. Pull products from Shopify, sync with Google Drive, and publish directly.
          </p>
        </section>

        {/* Card 4: Automate Workflows */}
        <section
          id="card-automation"
          className="group relative bg-black/[0.02] dark:bg-white/[0.04] ring-1 ring-black/5 dark:ring-white/10 rounded-3xl p-5 md:p-6"
        >
          <GradientFrame />
          
          <div className="rounded-2xl bg-white dark:bg-white/5 p-4 ring-1 ring-black/5 dark:ring-white/10 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground dark:text-white/80 text-sm">
                <Workflow className="h-4 w-4 text-fuchsia-500 dark:text-fuchsia-300" />
                <span className="font-medium">Content Calendar</span>
              </div>
              <button className="inline-flex items-center gap-1 rounded-full bg-black/5 dark:bg-white/5 px-2 py-1 text-[11px] text-foreground dark:text-white/80 ring-1 ring-black/5 dark:ring-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition">
                <Calendar className="h-3.5 w-3.5" />
                View All
              </button>
            </div>
            
            <div className="mt-3 flex items-center gap-2 text-xs">
              <button className="rounded-full bg-black/5 dark:bg-white/10 px-2 py-1 text-foreground dark:text-white/90 ring-1 ring-black/5 dark:ring-white/10">Today</button>
              <button className="rounded-full bg-transparent px-2 py-1 text-muted-foreground dark:text-white/60 ring-1 ring-black/5 dark:ring-white/10">Tomorrow</button>
              <button className="rounded-full bg-transparent px-2 py-1 text-muted-foreground dark:text-white/60 ring-1 ring-black/5 dark:ring-white/10">Next Week</button>
            </div>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-black/[0.02] dark:bg-white/[0.04] p-3 ring-1 ring-black/5 dark:ring-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                    <TikTokBrand className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground dark:text-white/90">Summer Promo Video</p>
                    <p className="text-[11px] text-muted-foreground dark:text-white/50">TikTok • 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-sky-600 dark:text-sky-400">
                  <Clock className="h-3.5 w-3.5" />
                  Scheduled
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-xl bg-black/[0.02] dark:bg-white/[0.04] p-3 ring-1 ring-black/5 dark:ring-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                    <BrevoBrand className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground dark:text-white/90">New Shoe Collection</p>
                    <p className="text-[11px] text-muted-foreground dark:text-white/50">Brevo • 12:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400">
                  <Send className="h-3.5 w-3.5" />
                  Sent
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-xl bg-black/[0.02] dark:bg-white/[0.04] p-3 ring-1 ring-black/5 dark:ring-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white ring-1 ring-black/5 dark:ring-0">
                    <FacebookBrand className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground dark:text-white/90">Retargeting Campaign</p>
                    <p className="text-[11px] text-muted-foreground dark:text-white/50">Meta Ads • Ongoing</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400">
                  <Activity className="h-3.5 w-3.5" />
                  Active
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="mt-5 text-xl md:text-2xl font-semibold tracking-tight text-foreground dark:text-white">Automated Workflows</h3>
          <p className="mt-1.5 text-sm text-muted-foreground dark:text-white/70">
            Schedule weeks of content in advance. Our agents handle the publishing, ad management, and email sending automatically.
          </p>
        </section>
      </div>
    </section>
  )
}

export default LandinngIntegrations;