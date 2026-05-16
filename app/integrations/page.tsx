import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import {
  ArrowRight,
  Code,
  GitBranchPlus,
  Plus,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import { IntegrationsExplorer } from "./integrations-explorer";

export const metadata: Metadata = {
  title: "Integrations – Gennit AI",
  description:
    "Gennit connects to every channel your brand lives on — social, ads, email, CRM, commerce, and the AI infrastructure that powers autonomous marketing.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function IntegrationsPage() {
  return (
    <div className='bg-white dark:bg-black'>
      <LandingNavbar />
      <div className='mx-auto w-full max-w-5xl space-y-8 px-6 pb-16 md:max-w-7xl'>
        <section className='relative z-10'>
          <div className='mr-auto ml-auto max-w-6xl pt-20 pr-4 pb-20 pl-4 sm:px-6 lg:px-8'>
            <div className='mb-16 text-center'>
              <div className='border-border bg-card/60 text-muted-foreground mb-6 inline-flex items-center gap-2 rounded-md border px-3 py-1 text-xs font-medium backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-zinc-200'>
                <GitBranchPlus className='h-3.5 w-3.5 text-violet-500 dark:text-violet-300' />
                Integrations
              </div>
              <h2 className='text-foreground text-3xl font-semibold tracking-tight sm:text-4xl'>
                Works with your favorite tools
              </h2>
              <p className='text-muted-foreground mt-3 text-base'>
                Connect Gennit with the tools you already use every day
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
                <div
                  className='integration-card relative z-1 rounded-md p-px [background:radial-gradient(230px_at_0%_0%,rgba(0,0,0,0.08),#ffffff)] dark:[background:radial-gradient(230px_at_0%_0%,rgba(113,113,122,0.4),rgb(12,13,13))]'
                >
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
                      <span className='inline-flex items-center gap-1.5 rounded-md bg-zinc-500/10 px-2 py-1 text-xs text-zinc-700 ring-1 ring-zinc-500/20 dark:text-zinc-300 dark:ring-zinc-400/20'>
                        <Zap className='h-3 w-3' />
                        API
                      </span>
                    </div>
                    <h3 className='text-foreground relative z-10 mt-4 text-lg font-semibold tracking-tight'>
                      Custom Integration
                    </h3>
                    <p className='text-muted-foreground relative z-10 mt-1 text-sm'>
                      Build your own integration with our REST API and webhooks.
                      Full documentation included.
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
                    <div
                      className='absolute h-px w-full [background:linear-gradient(90deg,rgba(0,0,0,0.15)_30%,rgba(0,0,0,0.04)_70%)] dark:[background:linear-gradient(90deg,rgba(136,136,136,0.3)_30%,#1d1f1f_70%)]'
                      style={{
                        top: "10%",
                        left: "0%",
                        maskImage:
                          "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
                        WebkitMaskImage:
                          "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
                      }}
                    />
                    <div
                      className='absolute z-1 h-full w-px [background:linear-gradient(180deg,rgba(0,0,0,0.15)_30%,rgba(0,0,0,0.04)_70%)] dark:[background:linear-gradient(180deg,rgba(116,116,116,0.3)_30%,#222424_70%)]'
                      style={{
                        left: "10%",
                        top: "0%",
                        maskImage:
                          "linear-gradient(0deg, transparent, black 15%, black 85%, transparent)",
                        WebkitMaskImage:
                          "linear-gradient(0deg, transparent, black 15%, black 85%, transparent)",
                      }}
                    />
                    <div
                      className='absolute h-px w-full bg-zinc-200 dark:bg-[#2c2c2c]'
                      style={{
                        bottom: "10%",
                        left: "0%",
                        maskImage:
                          "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
                        WebkitMaskImage:
                          "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
                      }}
                    />
                    <div
                      className='absolute h-full w-px bg-zinc-200 dark:bg-[#2c2c2c]'
                      style={{
                        right: "10%",
                        top: "0%",
                        maskImage:
                          "linear-gradient(10deg, transparent, black 15%, black 85%, transparent)",
                        WebkitMaskImage:
                          "linear-gradient(10deg, transparent, black 15%, black 85%, transparent)",
                      }}
                    />
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

      <LandingFooter />
    </div>
  );
}
