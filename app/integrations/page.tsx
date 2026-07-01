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
                    Integration
                  </h1>
                  <p className='mt-2 text-sm text-zinc-500 sm:text-base dark:text-zinc-400'>
                    Work with Genit across your favorite tools
                  </p>
                </div>
                <IntegrationsExplorer />
                <section className='mt-12'>
                  <div className='mb-4'>
                    <h3 className='text-foreground text-lg font-semibold tracking-tight'>
                      Developers
                    </h3>
                    <p className='text-muted-foreground mt-0.5 text-xs'>
                      Build custom agents
                    </p>
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    <div className='group border-border bg-background rounded-lg border p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm'>
                      {/* icon + title row */}
                      <div className='flex items-center gap-2'>
                        <div className='border-border bg-muted/40 flex h-8 w-8 items-center justify-center rounded-md border'>
                          <Code className='text-foreground h-4 w-4' />
                        </div>

                        <h3 className='text-foreground text-sm font-semibold'>
                          Custom Agent
                        </h3>
                      </div>

                      {/* description */}
                      <p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
                        Build and deploy AI agents with full SDK control and
                        integration hooks.
                      </p>

                      {/* CTA */}
                      <div className='mt-3 flex items-center justify-between'>
                        <a
                          href='#'
                          className='inline-flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-400'
                        >
                          SDK Coming soon
                          <ArrowRight className='h-3 w-3' />
                        </a>

                        <span className='text-muted-foreground text-[10px]'>
                          SDK
                        </span>
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
