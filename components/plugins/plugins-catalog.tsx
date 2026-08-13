"use client";

import { IntegrationsExplorer } from "@/app/integrations/integrations-explorer";
import { LocalizedText } from "@/components/localized-text";
import { ArrowRight, Code, Plus } from "lucide-react";
import Link from "next/link";

export function PluginsCatalog({
  publicView = false,
}: {
  publicView?: boolean;
}) {
  return (
    <section className='relative z-10'>
      <div className='mx-auto max-w-4xl px-4 pt-12 pb-20 sm:px-6 lg:px-8'>
        <div className='mb-10 text-left'>
          <h1 className='text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
            <LocalizedText text={"Plugins"} />
          </h1>
          <p className='mt-2 text-sm text-zinc-500 sm:text-base dark:text-zinc-400'>
            <LocalizedText
              text={"Work with Genit across your favorite tools"}
            />
          </p>
        </div>

        <IntegrationsExplorer publicView={publicView} />

        <section className='mt-12'>
          <div className='mb-4'>
            <h2 className='text-foreground text-lg font-semibold tracking-tight'>
              <LocalizedText text={"Developers"} />
            </h2>
            <p className='text-muted-foreground mt-0.5 text-xs'>
              <LocalizedText text={"Build custom agents"} />
            </p>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <div className='group border-border bg-background rounded-lg border p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm'>
              <div className='flex items-center gap-2'>
                <div className='border-border bg-muted/40 flex h-8 w-8 items-center justify-center rounded-md border'>
                  <Code className='text-foreground h-4 w-4' />
                </div>
                <h3 className='text-foreground text-sm font-semibold'>
                  <LocalizedText text={"Custom Agent"} />
                </h3>
              </div>
              <p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
                <LocalizedText
                  text={
                    "Build and deploy AI agents with full SDK control and plugin hooks."
                  }
                />
              </p>
              <div className='mt-3 flex items-center justify-between'>
                <span className='inline-flex items-center gap-1 text-xs font-medium text-indigo-500'>
                  <LocalizedText text={"SDK Coming soon"} />
                  <ArrowRight className='h-3 w-3' />
                </span>
                <span className='text-muted-foreground text-[10px]'>
                  <LocalizedText text={"SDK"} />
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className='mt-12 text-center'>
          <p className='text-muted-foreground mb-4 text-sm'>
            <LocalizedText text={"Need another plugin?"} />
          </p>
          <button className='border-border bg-card/60 text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10'>
            <Plus className='h-4 w-4' />
            <LocalizedText text={"Request plugin"} />
          </button>
          <p className='text-muted-foreground mt-6 text-xs'>
            <LocalizedText text={"Need to disconnect or delete your data?"} />{" "}
            <Link
              href='/plugin/removal-instructions'
              className='text-foreground underline-offset-4 hover:underline'
            >
              <LocalizedText text={"Removal instructions"} />
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
