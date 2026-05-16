"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUserContext } from "@/context/AuthenticatedContext";
import { integrationsQueryKey } from "@/hooks/use-integrations";
import { IntegrationPlatform, isPlatformSupported, requestConnectUrl } from "@/lib/integrations-api";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Loader2, Lock, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { type CSSProperties, type ComponentType, useCallback, useEffect, useRef, useState } from "react";












type PopupMessage =
  | {
      type: "gennit:integration:connected";
      platform: IntegrationPlatform;
      integrationId: string;
      accountName?: string;
    }
  | {
      type: "gennit:integration:error";
      platform: IntegrationPlatform;
      message?: string;
    };

interface ConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: IntegrationPlatform | null;
  platformName: string;
  platformDescription: string;
  Icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  glow: string;
}

type Phase = "idle" | "connecting" | "success" | "error";

const PLATFORM_SCOPES: Partial<Record<IntegrationPlatform, string[]>> = {
  facebook: [
    "See the Pages you manage",
    "Publish posts, photos and videos to those Pages",
    "Read engagement on posts you publish",
  ],
  instagram: [
    "Identify your Instagram Business or Creator account",
    "Publish photos, videos, reels and carousels",
    "Read insights for the content we publish",
  ],
};

const REQUIREMENTS: Partial<Record<IntegrationPlatform, string[]>> = {
  instagram: [
    "Instagram account must be Business or Creator",
    "Instagram must be linked to a Facebook Page",
  ],
};

export function ConnectDialog({
  open,
  onOpenChange,
  platform,
  platformName,
  platformDescription,
  Icon,
  glow,
}: ConnectDialogProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const qc = useQueryClient();
  const { user, fetchCurrentUser } = useUserContext();
  const currentOrg = user?.currentOrganization;
  const orgId =
    typeof currentOrg === "object" && currentOrg ? currentOrg._id : undefined;

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
    if (!open) {
      closePopup();
      setPhase("idle");
      setErrorMessage(null);
      setConnectedAccount(null);
    }
  }, [open, closePopup]);

  useEffect(() => {
    if (!platform) return;
    function handleMessage(e: MessageEvent) {
      const data = e.data as PopupMessage | undefined;
      if (!data || typeof data !== "object") return;
      if (
        data.type !== "gennit:integration:connected" &&
        data.type !== "gennit:integration:error"
      )
        return;
      if (data.platform !== platform) return;

      closePopup();

      if (data.type === "gennit:integration:connected") {
        setConnectedAccount(data.accountName || null);
        setPhase("success");
        qc.invalidateQueries({ queryKey: integrationsQueryKey(orgId) });
        toast.success(`Connected ${platformName}`, {
          description: data.accountName ? `@${data.accountName}` : undefined,
        });
      } else {
        setErrorMessage(data.message || "Connection failed");
        setPhase("error");
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [platform, platformName, qc, orgId, closePopup]);

  const handleConnect = useCallback(async () => {
    if (!platform) return;
    if (!isPlatformSupported(platform)) {
      toast.info(`${platformName} integration is coming soon`);
      return;
    }
    setPhase("connecting");
    setErrorMessage(null);
    
    try {
      const url = await requestConnectUrl(platform);
      const width = 600;
      const height = 720;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      console.log("hitting connection btn")
      const popup = window.open(
        url,
        "gennit_oauth",
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
      );
      if (!popup) {
        throw new Error(
          "Popup blocked. Allow popups for this site and try again."
        );
      }
      popupRef.current = popup;
      pollRef.current = setInterval(() => {
        if (popupRef.current && popupRef.current.closed) {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          setPhase((current) => (current === "connecting" ? "error" : current));
          setErrorMessage(
            (prev) => prev ?? "Window closed before the connection completed"
          );
        }
      }, 600);

    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to start OAuth";
      setErrorMessage(msg);
      setPhase("error");
      toast.error("Could not start connection", { description: msg });
    }
  }, [platform, platformName]);

  function handleDone() {
    onOpenChange(false);
    if (fetchCurrentUser) fetchCurrentUser();
  }

  const isSupported = platform ? isPlatformSupported(platform) : false;
  const scopes = platform ? (PLATFORM_SCOPES[platform] ?? []) : [];
  const requirements = platform ? (REQUIREMENTS[platform] ?? []) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='border-border bg-card overflow-hidden p-0 sm:max-w-md'
        hideDialogClose
      >
        <div
          className='relative px-6 pt-7 pb-6'
          style={{
            background: `radial-gradient(circle 280px at 12% 0%, ${glow}, transparent 60%)`,
          }}
        >
          <button
            type='button'
            onClick={() => onOpenChange(false)}
            className='text-muted-foreground hover:text-foreground absolute top-4 right-4 rounded-full p-1 transition'
            aria-label='Close'
          >
            <X className='h-4 w-4' />
          </button>

          <div className='relative z-10 flex items-center gap-3'>
            <div className='border-border flex h-10 w-15 items-center justify-center rounded-sm border bg-white/80 backdrop-blur dark:border-white/10 dark:bg-white/5'>
              <Icon className='h-7 w-7 rounded-none' />
            </div>
            <div>
              <DialogHeader className='space-y-0 text-left'>
                <DialogTitle className='text-lg font-semibold tracking-tight'>
                  Connect {platformName}
                </DialogTitle>
                <DialogDescription className='text-xs'>
                  {platformDescription}
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>

          {phase === "idle" && (
            <div className='relative z-10 mt-5'>
              {!isSupported ? (
                <div className='border-border bg-card/60 text-muted-foreground rounded-md border px-3 py-3 text-xs dark:border-white/10 dark:bg-white/5'>
                  We're still building the {platformName} connection. We'll
                  enable it for your organization as soon as it's ready.
                </div>
              ) : (
                <>
                  <p className='text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase'>
                    Gennit will be able to
                  </p>
                  <ul className='space-y-2'>
                    {scopes.map((scope) => (
                      <li
                        key={scope}
                        className='text-foreground flex items-start gap-2 text-sm'
                      >
                        <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0 text-emerald-500' />
                        <span>{scope}</span>
                      </li>
                    ))}
                  </ul>

                  {requirements.length > 0 && (
                    <div className='mt-4 rounded-md border border-neutral-300 bg-neutral-50 px-3 py-3 dark:border-neutral-700 dark:bg-neutral-800'>
                      <p className='text-foreground mb-1 text-xs font-medium'>
                        Before you continue
                      </p>
                      <ul className='text-muted-foreground space-y-1 text-xs'>
                        {requirements.map((r) => (
                          <li key={r}>
                            {"• "}
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {phase === "connecting" && (
            <div className='relative z-10 mt-6 flex flex-col items-center justify-center py-6'>
              <div className='relative h-14 w-14'>
                <div
                  className='absolute inset-0 animate-ping rounded-full'
                  style={{ background: glow, opacity: 0.5 }}
                />
                <div className='border-border bg-card relative flex h-14 w-14 items-center justify-center rounded-full border dark:border-white/10'>
                  <Loader2 className='h-6 w-6 animate-spin' />
                </div>
              </div>
              <p className='text-foreground mt-4 text-sm font-medium'>
                Waiting for {platformName}…
              </p>
              <p className='text-muted-foreground mt-1 text-center text-xs'>
                Complete sign-in in the popup window. This dialog will update
                automatically.
              </p>
            </div>
          )}

          {phase === "success" && (
            <div className='relative z-10 mt-6 flex flex-col items-center justify-center py-6'>
              <div className='flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/40'>
                <CheckCircle2 className='h-7 w-7 text-emerald-500' />
              </div>
              <p className='text-foreground mt-4 text-sm font-medium'>
                {platformName} connected
              </p>
              {connectedAccount && (
                <p className='text-muted-foreground mt-1 text-xs'>
                  {connectedAccount}
                </p>
              )}
            </div>
          )}

          {phase === "error" && (
            <div className='relative z-10 mt-6'>
              <div className='0 rounded-md border-neutral-300 bg-neutral-50 px-3 py-3 text-sm dark:bg-neutral-800'>
                <p className='text-foreground font-medium'>Connection failed</p>
                <p className='text-muted-foreground mt-1 text-xs'>
                  {errorMessage}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className='border-border bg-muted/30 flex items-center justify-between gap-3 border-t px-6 py-3 dark:border-white/10 dark:bg-white/[0.02]'>
          <div className='text-muted-foreground flex items-center gap-1.5 text-[11px]'>
            <ShieldCheck className='h-3.5 w-3.5' />
            <span>Tokens encrypted at rest (AES-256)</span>
          </div>

          {phase === "idle" && (
            <Button
              type='button'
              size='sm'
              onClick={handleConnect}
              disabled={!isSupported}
              className='bg-linear-to-r from-cyan-500 to-blue-500 text-white transition-all hover:bg-linear-to-bl'
            >
              {isSupported ? (
                <>
                  Continue
                  <ArrowRight className='ml-1 h-3.5 w-3.5' />
                </>
              ) : (
                <>
                  <Lock className='mr-1 h-3.5 w-3.5' />
                  Coming soon
                </>
              )}
            </Button>
          )}

          {phase === "connecting" && (
            <Button
              type='button'
              size='sm'
              variant='ghost'
              onClick={() => {
                closePopup();
                setPhase("idle");
              }}
            >
              Cancel
            </Button>
          )}

          {phase === "success" && (
            <Button
              type='button'
              size='sm'
              onClick={handleDone}
              className='bg-linear-to-r from-emerald-500 to-teal-500 text-white'
            >
              Done
            </Button>
          )}

          {phase === "error" && (
            <div className='flex gap-2'>
              <Button
                type='button'
                size='sm'
                variant='ghost'
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button
                type='button'
                size='sm'
                onClick={handleConnect}
                className='bg-linear-to-r from-cyan-500 to-blue-500 text-white'
              >
                Try again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
