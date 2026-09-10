"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  description,
  onConfirm,
  loading = false,
  confirmLabel = "Delete",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  description: ReactNode;
  onConfirm: () => void;
  loading?: boolean;
  confirmLabel?: ReactNode;
}) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => !loading && onOpenChange(nextOpen)}
    >
      <AlertDialogContent
        overlayClassName='bg-zinc-950/35 backdrop-blur-sm dark:bg-black/70'
        className='top-auto right-4 bottom-4 left-4 w-auto max-w-none translate-x-0 translate-y-0 gap-0 rounded-2xl border-zinc-200 bg-white p-4 shadow-2xl sm:rounded-2xl md:top-1/2 md:right-auto md:bottom-auto md:left-1/2 md:w-[calc(100%-2rem)] md:max-w-md md:-translate-x-1/2 md:-translate-y-1/2 dark:border-white/10 dark:bg-zinc-950'
      >
        <div className='flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-5'>
          <div className='flex size-16 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-amber-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-amber-400'>
            <AlertTriangle className='size-7' aria-hidden='true' />
          </div>
          <div className='text-center md:text-left'>
            <AlertDialogTitle className='text-base font-bold text-zinc-950 dark:text-white'>
              Warning!
            </AlertDialogTitle>
            <AlertDialogDescription className='mt-1 text-sm leading-5 text-zinc-600 dark:text-zinc-400'>
              {description}
            </AlertDialogDescription>
          </div>
        </div>

        <div className='mt-5 flex flex-col gap-3 md:flex-row-reverse md:justify-start md:gap-2'>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
            disabled={loading}
            className='h-11 w-full rounded-xl bg-red-100 px-4 font-semibold text-red-700 transition-transform duration-150 hover:bg-red-200 active:scale-[0.97] md:h-9 md:w-auto dark:bg-red-950/60 dark:text-red-300 dark:hover:bg-red-950'
          >
            {loading && <Loader2 className='animate-spin' />}
            {confirmLabel}
          </AlertDialogAction>
          <AlertDialogCancel
            disabled={loading}
            className='mt-0 h-11 w-full rounded-xl border-0 bg-zinc-100 px-4 font-semibold text-zinc-800 transition-transform duration-150 hover:bg-zinc-200 active:scale-[0.97] md:h-9 md:w-auto dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/15'
          >
            Cancel
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
