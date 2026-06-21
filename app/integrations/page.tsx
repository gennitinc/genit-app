"use client";

import { IntegrationsExplorer } from "./integrations-explorer";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { Toaster } from "@/components/ui/toaster";
import { GradientFrame } from "@/utils/gradient-frame";
import { ArrowRight, Code, GitBranchPlus, Plus, Zap } from "lucide-react";
import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Integrations – Genit AI",
//   description:
//     "genit connects to every channel your brand lives on — social, ads, email, CRM, commerce, and the AI infrastructure that powers autonomous marketing.",
//   robots: {
//     index: true,
//     follow: true,
//   },
// };

export default function IntegrationsPage() {
  return (
    <div className='relative flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-black'>
      <Toaster />
      <AppSidebar />
      <div className='scroll-container flex flex-1 flex-col overflow-x-hidden overflow-y-auto will-change-scroll'>
        <TopNavWithAurora />

        <div
          id='main-content'
          className='mr-2 ml-0 flex-1 rounded-t-2xl md:mr-4 lg:border-2 lg:border-b-0'
        >
          <div className='mx-auto w-full max-w-4xl space-y-8 px-6 pb-16'>
            <section className='relative z-10'>
              <div className='mr-auto ml-auto max-w-4xl pt-12 pr-4 pb-20 pl-4 sm:px-6 lg:px-8'>
                <div className='mb-10 text-left'>
                  <h1 className='text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
                    Plugins
                  </h1>
                  <p className='text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base'>
                    Work with Gennit across your favorite tools
                  </p>
                </div>
                <IntegrationsExplorer />
                <section className='mt-16'>
                  <div className='mb-6 flex items-baseline gap-3'>
                    <h3 className='text-foreground text-xl font-semibold tracking-tight'>
                      Developers
                    </h3>
                    <span className='text-muted-foreground text-xs'>
                      Build your own
                    </span>
                  </div>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    <div className='integration-card relative z-1 rounded-md p-px [background:radial-gradient(230px_at_0%_0%,rgba(0,0,0,0.08),#ffffff)] dark:[background:radial-gradient(230px_at_0%_0%,rgba(113,113,122,0.4),rgb(12,13,13))]'>
                      <div
                        className='animated-dot absolute z-2 h-[5px] w-[5px] rounded-full bg-zinc-400 dark:bg-zinc-400'
                        style={{
                          boxShadow: "0 0 10px rgba(113, 113, 122, 0.8)",
                          right: "10%",
                          top: "10%",
                          animation: "moveDot 6s linear infinite",
                          animationPlayState: "paused",
                        }}
                      />
                      <div className='group border-border relative z-1 h-full rounded-md border bg-white px-9 py-7 backdrop-blur transition-all duration-300 [background:radial-gradient(circle_280px_at_0%_0%,rgba(0,0,0,0.04),#ffffff)] hover:[background:radial-gradient(circle_280px_at_0%_0%,rgba(0,0,0,0.06),#ffffff)] dark:border-[#202222] dark:bg-white/5 dark:[background:radial-gradient(circle_280px_at_0%_0%,rgba(68,68,68,0.3),#0c0d0d)] dark:hover:bg-white/10'>
                        <div
                          className='absolute top-0 left-0 h-[45px] w-[220px] rounded-full opacity-30 blur-[10px] dark:opacity-40'
                          style={{
                            backgroundColor: "rgba(113, 113, 122, 0.3)",
                            boxShadow: "0 0 50px rgba(113, 113, 122, 0.5)",
                            transform: "rotate(40deg)",
                            transformOrigin: "10%",
                          }}
                        />
                        <div className='relative z-10 flex items-start justify-between'>
                          <div className='flex h-12 w-12 items-center justify-center rounded-xl'>
                            <Code className='h-6 w-6 text-slate-700 dark:text-slate-300' />
                          </div>
                          {/* <span className='inline-flex items-center gap-1.5 rounded-md bg-zinc-500/10 px-2 py-1 text-xs text-zinc-700 ring-1 ring-zinc-500/20 dark:text-zinc-300 dark:ring-zinc-400/20'>
                            <Zap className='h-3 w-3' />
                            API - Coming Soon
                          </span> */}
                        </div>
                        <h3 className='text-foreground relative z-10 mt-4 text-lg font-semibold tracking-tight'>
                          Custom Integration
                        </h3>
                        <p className='text-muted-foreground relative z-10 mt-1 text-sm'>
                          Build your own integration with our REST API and
                          webhooks.
                        </p>
                        <div className='relative z-10 mt-4 flex items-center gap-2'>
                          <a
                            href='#'
                            className='text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs'
                          >
                            View API docs
                            <ArrowRight className='h-3 w-3' />
                          </a>
                        </div>
                        <GradientFrame />
                      </div>
                    </div>
                  </div>
                </section>
                <div className='mt-12 text-center'>
                  <p className='text-muted-foreground mb-4 text-sm'>
                    Need another integration?
                  </p>
                  <button className='border-border bg-card/60 text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10'>
                    <Plus className='h-4 w-4' />
                    Request integration
                  </button>
                  <p className='text-muted-foreground mt-6 text-xs'>
                    Need to disconnect or delete your data?{" "}
                    <a
                      href='/integrations/removal-instructions'
                      className='text-foreground underline-offset-4 hover:underline'
                    >
                      Removal instructions
                    </a>
                    .
                  </p>
                </div>
                <style
                  dangerouslySetInnerHTML={{
                    __html:
                      "\n      @keyframes moveDot {\n\n        0%,\n        100% {\n          top: 10%;\n          right: 10%;\n        }\n\n        25% {\n          top: 10%;\n          right: calc(100% - 35px);\n        }\n\n        50% {\n          top: calc(100% - 30px);\n          right: calc(100% - 35px);\n        }\n\n        75% {\n          top: calc(100% - 30px);\n          right: 10%;\n        }\n      }\n\n      .integration-card:hover .animated-dot {\n        animation-play-state: running !important;\n      }\n    ",
                  }}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
