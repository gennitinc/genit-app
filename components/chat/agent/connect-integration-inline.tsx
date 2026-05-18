"use client";

import { requestConnectUrl } from "@/lib/integrations-api";
import type {
  AgentIntegrationRequired,
} from "@/lib/agents-api";
import { ArrowRight, Loader2, Plug } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Inline "Connect this integration to continue" card shown inside an
// in-progress agent message. After successful OAuth, the server's callback
// auto-resumes the paused run — this component just drives the popup.
export function ConnectIntegrationInline({
  required,
  onConnected,
}: {
  required: AgentIntegrationRequired;
  onConnected?: () => void;
}) {
  const [phase, setPhase] = useState<"idle" | "connecting" | "connected" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const closePopup = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
    popupRef.current = null;
  }, []);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      const data = e.data as any;
      if (!data || typeof data !== "object") return;
      if (
        data.type !== "gennit:integration:connected" &&
        data.type !== "gennit:integration:error"
      )
        return;
      if (data.platform !== required.platform) return;
      closePopup();
      if (data.type === "gennit:integration:connected") {
        setPhase("connected");
        toast.success(`Connected ${required.platformName}`);
        onConnected?.();
      } else {
        setPhase("error");
        setErrorMessage(data.message || "Connection failed");
      }
    }
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      closePopup();
    };
  }, [required.platform, required.platformName, onConnected, closePopup]);

  const handleConnect = useCallback(async () => {
    setPhase("connecting");
    setErrorMessage(null);
    try {
      const response = await requestConnectUrl(required.platform);
      if (response.skipOAuth) {
        setPhase("connected");
        onConnected?.();
        return;
      }
      const width = 600;
      const height = 720;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(
        response.authorizeUrl,
        "gennit_oauth",
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
      );
      if (!popup) throw new Error("Popup blocked. Allow popups and try again.");
      popupRef.current = popup;
      pollRef.current = setInterval(() => {
        if (popupRef.current && popupRef.current.closed) {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          setPhase((p) => (p === "connecting" ? "error" : p));
          setErrorMessage((m) => m ?? "Window closed before connecting");
        }
      }, 600);
    } catch (err: any) {
      setPhase("error");
      setErrorMessage(err?.message || "Failed to start connection");
    }
  }, [required.platform, onConnected]);

  return (
    <div className='border-border bg-card/40 my-2 rounded-md border p-3 dark:border-white/10 dark:bg-white/[0.02]'>
      <div className='flex items-start gap-3'>
        <div className='bg-card/60 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ring-1 ring-violet-500/30 dark:bg-white/5'>
          <Plug className='h-4 w-4 text-violet-500' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='text-foreground text-sm font-medium'>
            Connect {required.platformName} to continue
          </div>
          <p className='text-muted-foreground mt-0.5 text-xs'>
            {required.reason}
          </p>
          {errorMessage && (
            <p className='mt-1 text-xs text-rose-600 dark:text-rose-400'>
              {errorMessage}
            </p>
          )}
          {phase === "connected" ? (
            <div className='mt-2 text-xs text-emerald-600 dark:text-emerald-400'>
              Connected — resuming…
            </div>
          ) : (
            <button
              type='button'
              onClick={handleConnect}
              disabled={phase === "connecting"}
              className='mt-2 inline-flex items-center gap-1.5 rounded-md bg-linear-to-r from-violet-500 to-fuchsia-500 px-2.5 py-1 text-xs font-medium text-white transition-all hover:bg-linear-to-bl disabled:opacity-60'
            >
              {phase === "connecting" ? (
                <>
                  <Loader2 className='h-3 w-3 animate-spin' />
                  Connecting…
                </>
              ) : (
                <>
                  Connect {required.platformName}
                  <ArrowRight className='h-3 w-3' />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
