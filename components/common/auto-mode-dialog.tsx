"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/components/ui/use-mobile";
import { CalendarClock, Settings2, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";

export function AutoModeDialog({
  open,
  onOpenChange,
  onApprove,
  approving = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void | Promise<void>;
  approving?: boolean;
}) {
  const isMobile = useIsMobile();

  const content = (
    <div className='max-h-[88dvh] overflow-y-auto rounded-t-3xl bg-white border sm:grid sm:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.4fr)] sm:rounded-3xl dark:bg-black'>
      <div className='relative h-28 overflow-hidden sm:h-auto'>
        <Image
          src='/genit-auto.png'
          alt='Genit Auto'
          fill
          sizes='(max-width: 640px) 100vw, 320px'
          className='object-cover object-[center_26%] sm:object-center'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-white dark:from-zinc-950 sm:dark:from-transparent sm:dark:to-zinc-950' />
      </div>

      <div className='flex min-w-0 flex-col'>
        <div className='border-b border-zinc-200  px-5 py-4 sm:px-6 dark:border-white/10 dark:from-indigo-500/15 dark:via-zinc-950 dark:to-violet-500/10'>
          <h2 className='mt-1 text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl dark:text-white'>
            Autonomous marketing?
          </h2>
          <p className='mt-2 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-300'>
            Genit runs your marketing operations, end to end.
          </p>
        </div>

        <div className='flex-1 space-y-1 p-4 sm:p-2'>
          {[
            {
              icon: CalendarClock,
              title: "Runs on your schedule",
              description:
                "Auto keeps evaluating goals, campaigns, posts, and performance until you turn it off.",
            },
            {
              icon: Settings2,
              title: "Uses workspace credits",
              description:
                "Planning and generated specialist work can consume credits within your configured limits.",
            },
            {
              icon: ShieldCheck,
              title: "Your guardrails still apply",
              description:
                "Publishing, sending, spending, and destructive actions follow the approval policy in Settings.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className='flex items-start gap-3 rounded-2xl px-2 py-2 sm:px-3'
              >
                <span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-white/[0.06] dark:text-zinc-300'>
                  <Icon className='size-4' />
                </span>
                <div>
                  <p className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
                    {item.title}
                  </p>
                  <p className='mt-0.5 text-sm leading-5 text-zinc-500 dark:text-zinc-500'>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className='flex gap-3 border-t border-zinc-200 p-2 sm:justify-end sm:px-6 dark:border-white/10'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={approving}
            className='flex-1 rounded-md active:scale-[0.97] sm:flex-none'
          >
            Cancel
          </Button>
          <Button
            onClick={() => void onApprove()}
            disabled={approving}
            className='flex-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.97] sm:flex-none'
          >
            {approving ? "Turning on…" : "Approve & turn on"}
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className='border-none bg-transparent p-0 shadow-none'>
          <DrawerTitle className='sr-only'>Genit Auto</DrawerTitle>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='overflow-hidden border-none bg-transparent p-0 shadow-2xl sm:max-w-3xl [&>button]:hidden'>
        <DialogTitle className='sr-only'>Genit Auto</DialogTitle>
        {content}
      </DialogContent>
    </Dialog>
  );
}
