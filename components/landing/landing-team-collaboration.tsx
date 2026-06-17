import React from "react";
import { GradientFrame } from "@/utils/gradient-frame";
import { MousePointer2, Plus, CheckCircle2, UserPlus } from "lucide-react";

const TEAM_MEMBERS = [
  "https://i.pinimg.com/736x/a0/cb/f8/a0cbf895e3e033b27a823ef8bb5b6a31.jpg",
  "https://i.pinimg.com/736x/74/3d/88/743d88dd2675cd87baa1b560f500c69c.jpg",
  "https://i.pinimg.com/736x/29/5f/f5/295ff586f4725e8b56b6ba08017e4a6d.jpg",
  "https://i.pinimg.com/1200x/3e/f3/50/3ef350dc86cc82a092463e5d795654b5.jpg"
];

const LandingTeamCollaboration = () => {
  return (
    <section className="px-2 md:px-6 md:pt-5 max-w-7xl mr-auto ml-auto pt-20 overflow-hidden">
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text */}
        <div className="flex flex-col text-left md:pl-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground dark:text-white leading-tight">
            Multiplayer marketing
          </h2>
          <p className="mt-5 max-w-xl text-base md:text-lg text-muted-foreground dark:text-white/70 font-normal">
            Bring your entire team together. Review drafts, leave comments, and approve campaigns in real-time.
          </p>
        </div>

        {/* Right: Card */}
        <div className="relative w-full">
          {/* Main Card */}
        <div className="group relative rounded-3xl bg-black/[0.02] p-5 ring-1 ring-black/5 md:p-8 dark:bg-white/[0.04] dark:ring-white/10">
          <GradientFrame />
          
          <div className="relative rounded-2xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:shadow-2xl dark:ring-white/10 overflow-hidden h-[400px]">
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-black/5 px-4 py-3 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {TEAM_MEMBERS.map((avatar, i) => (
                    <img key={i} src={avatar} alt={`Team member ${i}`} className="h-7 w-7 rounded-full ring-2 ring-white object-cover dark:ring-[#0a0a0a]" />
                  ))}
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/5 ring-2 ring-white dark:bg-white/10 dark:ring-[#0a0a0a]">
                    <Plus className="h-3 w-3 text-foreground dark:text-white" />
                  </div>
                </div>
                <button className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 transition">
                  <UserPlus className="h-3.5 w-3.5" />
                  Invite
                </button>
              </div>
            </div>

            {/* Mock Body */}
            <div className="p-6 md:p-10 relative h-full">
              {/* Document Mock */}
              <div className="mx-auto max-w-lg space-y-4">
                <div className="h-8 w-3/4 rounded-lg bg-black/5 dark:bg-white/10" />
                <div className="h-4 w-full rounded-md bg-black/[0.03] dark:bg-white/5" />
                <div className="h-4 w-5/6 rounded-md bg-black/[0.03] dark:bg-white/5" />
                <div className="h-4 w-full rounded-md bg-black/[0.03] dark:bg-white/5" />
                <div className="mt-8 h-48 w-full rounded-xl bg-indigo-50 dark:bg-indigo-500/5 ring-1 ring-indigo-100 dark:ring-indigo-500/20" />
              </div>

              {/* Fake Cursors & Comments */}
              <div className="absolute left-[15%] top-[25%] hidden md:block animate-[bounce_4s_infinite]">
                <MousePointer2 className="h-5 w-5 text-emerald-500 fill-emerald-500 rotate-[-15deg]" />
                <div className="ml-4 mt-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">
                  Sarah J.
                </div>
              </div>

              <div className="absolute right-[20%] top-[45%] hidden md:block" style={{ transform: "translateY(-10px)" }}>
                <div className="flex items-start gap-2">
                  <div className="relative">
                    <MousePointer2 className="h-5 w-5 text-fuchsia-500 fill-fuchsia-500 rotate-[-15deg] absolute -left-2 -top-2 z-10" />
                    <div className="flex w-52 flex-col gap-2 rounded-xl rounded-tl-none bg-white p-3 shadow-xl ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10 relative z-20">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-foreground dark:text-white">Alex M.</span>
                        <span className="text-[9px] text-muted-foreground dark:text-white/50">Just now</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground dark:text-white/70">
                        Let's change this copy to be more punchy.
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button className="flex h-6 items-center justify-center rounded bg-emerald-500/10 px-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium transition hover:bg-emerald-500/20">
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Resolve
                        </button>
                        <button className="flex h-6 items-center justify-center rounded bg-black/5 px-2 text-[10px] text-muted-foreground dark:bg-white/10 dark:text-white/70 transition hover:bg-black/10 dark:hover:bg-white/20">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-[#0a0a0a]" />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default LandingTeamCollaboration;
