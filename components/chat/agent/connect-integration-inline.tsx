"use client";

import { requestConnectUrl } from "@/lib/integrations-api";
import type { AgentIntegrationRequired } from "@/lib/agents-api";
import { ArrowRight, CheckCircle2, Loader2, Plug, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AgentButton, AgentCard } from "./agent-card";

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
        data.type !== "genit:integration:connected" &&
        data.type !== "genit:integration:error"
      )
        return;
      if (data.platform !== required.platform) return;
      closePopup();
      if (data.type === "genit:integration:connected") {
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
        "genit_oauth",
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
    <AgentCard
      icon={<Plug className='h-3.5 w-3.5' />}
      title='Connection required'
      meta={required.platformName}
      tone='neutral'
    >
      <div className='flex items-start gap-3'>
        <div className='border-border/70 bg-muted/40 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border dark:border-white/10 dark:bg-white/[0.04]'>
          <Plug className='text-foreground h-4 w-4' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='text-foreground text-sm leading-snug font-medium'>
            Connect {required.platformName} to continue
          </div>
          <p className='text-muted-foreground mt-1 text-[12.5px] leading-relaxed'>
            {required.reason}
          </p>
          <div className='text-muted-foreground mt-2 flex items-center gap-1.5 text-[11px]'>
            <ShieldCheck className='h-3 w-3' />
            <span>
              You'll authorize in a popup. We never see your password.
            </span>
          </div>

          {errorMessage && phase === "error" && (
            <p className='text-rose-600 mt-2 text-[12px] dark:text-rose-400'>
              {errorMessage}
            </p>
          )}

          <div className='mt-3 flex items-center gap-2'>
            {phase === "connected" ? (
              <div className='inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-600 dark:text-emerald-400'>
                <CheckCircle2 className='h-3.5 w-3.5' />
                Connected — resuming
              </div>
            ) : (
              <>
                <AgentButton
                  type='button'
                  variant='primary'
                  onClick={handleConnect}
                  disabled={phase === "connecting"}
                  className='h-8 px-3'
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
                </AgentButton>
                {phase === "error" && (
                  <AgentButton
                    type='button'
                    variant='ghost'
                    onClick={() => {
                      setPhase("idle");
                      setErrorMessage(null);
                    }}
                  >
                    Dismiss
                  </AgentButton>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AgentCard>
  );
}
