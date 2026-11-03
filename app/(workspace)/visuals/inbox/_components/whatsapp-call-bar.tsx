"use client";

import { Button } from "@/components/ui/button";
import { useWhatsAppCalls } from "@/hooks/use-whatsapp-calls";
import { whatsappCallController } from "@/lib/whatsapp-call-controller";
import { Loader2, Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const ENDED_LABELS: Record<string, string> = {
  declined: "Call declined",
  missed: "No answer",
  ended: "Call ended",
  failed: "Call failed",
};

function Duration({ since }: { since: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);
  const seconds = Math.max(0, Math.floor((now - since) / 1_000));
  return (
    <span className='tabular-nums'>
      {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
    </span>
  );
}

/** Global WhatsApp call surface; survives switching conversations. */
export function WhatsAppCallBar() {
  const state = useWhatsAppCalls();
  if (state.phase === "idle") return null;

  const run = (action: () => Promise<unknown>) =>
    void action().catch((error: Error) => toast.error(error.message));

  const status =
    state.phase === "incoming"
      ? "Incoming WhatsApp call"
      : state.phase === "connecting"
        ? "Preparing microphone…"
        : state.phase === "ringing"
          ? "Calling on WhatsApp…"
          : state.phase === "answering"
            ? "Connecting…"
            : state.phase === "active"
              ? null
              : state.error ||
                ENDED_LABELS[state.endedStatus || "ended"] ||
                "Call ended";

  return (
    <div
      role='status'
      aria-live='polite'
      className='bg-background fixed right-4 bottom-4 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border p-4 shadow-xl'
    >
      <div className='flex items-center gap-3'>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ${
            state.phase === "incoming" ? "animate-pulse" : ""
          }`}
        >
          <Phone className='h-5 w-5' />
        </div>
        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-medium'>
            {state.customerName || "WhatsApp call"}
          </p>
          <p
            className={`text-xs ${
              state.phase === "ended" && state.error
                ? "text-red-600"
                : "text-muted-foreground"
            }`}
          >
            {state.phase === "active" && state.connectedAt ? (
              <Duration since={state.connectedAt} />
            ) : (
              status
            )}
          </p>
        </div>
      </div>

      {state.phase === "incoming" && (
        <div className='mt-3 grid grid-cols-2 gap-2'>
          <Button
            variant='outline'
            className='text-red-600'
            onClick={() => run(() => whatsappCallController.decline())}
          >
            <PhoneOff className='mr-1.5 h-4 w-4' /> Decline
          </Button>
          <Button
            className='bg-emerald-600 text-white hover:bg-emerald-700'
            onClick={() => run(() => whatsappCallController.answer())}
          >
            <Phone className='mr-1.5 h-4 w-4' /> Answer
          </Button>
        </div>
      )}

      {["connecting", "ringing", "answering", "active"].includes(
        state.phase
      ) && (
        <div className='mt-3 flex gap-2'>
          {state.phase === "answering" || state.phase === "connecting" ? (
            <Button variant='outline' disabled className='flex-1'>
              <Loader2 className='mr-1.5 h-4 w-4 animate-spin' /> Connecting
            </Button>
          ) : (
            <Button
              variant='outline'
              className='flex-1'
              aria-pressed={state.muted}
              onClick={() => whatsappCallController.toggleMute()}
            >
              {state.muted ? (
                <MicOff className='mr-1.5 h-4 w-4' />
              ) : (
                <Mic className='mr-1.5 h-4 w-4' />
              )}
              {state.muted ? "Unmute" : "Mute"}
            </Button>
          )}
          <Button
            variant='destructive'
            className='flex-1'
            onClick={() => run(() => whatsappCallController.hangup())}
          >
            <PhoneOff className='mr-1.5 h-4 w-4' /> Hang up
          </Button>
        </div>
      )}
    </div>
  );
}
