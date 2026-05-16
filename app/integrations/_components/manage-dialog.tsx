"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDisconnectIntegration } from "@/hooks/use-integrations";
import { IntegrationConnection } from "@/lib/integrations-api";
import { AlertTriangle, ExternalLink, Unplug, X } from "lucide-react";
import { type ComponentType, type CSSProperties, useState } from "react";
import { toast } from "sonner";

interface ManageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connection: IntegrationConnection | null;
  platformName: string;
  Icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  glow: string;
}

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

export function ManageDialog({
  open,
  onOpenChange,
  connection,
  platformName,
  Icon,
  glow,
}: ManageDialogProps) {
  const [confirming, setConfirming] = useState(false);
  const disconnect = useDisconnectIntegration();

  function handleClose(next: boolean) {
    if (!next) setConfirming(false);
    onOpenChange(next);
  }

  async function handleDisconnect() {
    if (!connection) return;
    try {
      await disconnect.mutateAsync(connection._id);
      toast.success(`${platformName} disconnected`);
      onOpenChange(false);
      setConfirming(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to disconnect";
      toast.error("Disconnect failed", { description: msg });
    }
  }

  const expiresAt = formatDate(connection?.expiresAt);
  const connectedAt = formatDate(connection?.createdAt);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='border-border bg-card overflow-hidden p-0 sm:max-w-md' hideDialogClose>
        <div
          className='relative px-6 pt-7 pb-6'
          style={{
            background: `radial-gradient(circle 280px at 12% 0%, ${glow}, transparent 60%)`,
          }}
        >
          <button
            type='button'
            onClick={() => handleClose(false)}
            className='text-muted-foreground hover:text-foreground absolute top-4 right-4 rounded-full p-1 transition'
            aria-label='Close'
          >
            <X className='h-4 w-4' />
          </button>

          <div className='relative z-10 flex items-center gap-3'>
            <div className='border-border flex h-12 w-12 items-center justify-center rounded-xl border bg-white/80 backdrop-blur dark:border-white/10 dark:bg-white/5'>
              <Icon className='h-7 w-7' />
            </div>
            <div>
              <DialogHeader className='space-y-0 text-left'>
                <DialogTitle className='text-lg font-semibold tracking-tight'>
                  {platformName} connection
                </DialogTitle>
                <DialogDescription className='text-xs'>
                  Manage this account or revoke access for your organization.
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>

          {connection && (
            <div className='relative z-10 mt-5'>
              <div className='border-border bg-card/60 flex items-center gap-3 rounded-md border px-3 py-3 dark:border-white/10 dark:bg-white/5'>
                {connection.accountAvatar ? (
                  <img
                    src={connection.accountAvatar}
                    alt={connection.accountName}
                    className='h-9 w-9 rounded-full'
                  />
                ) : (
                  <div className='bg-muted h-9 w-9 rounded-full' />
                )}
                <div className='min-w-0 flex-1'>
                  <p className='text-foreground truncate text-sm font-medium'>
                    {connection.accountName}
                  </p>
                  <p className='text-muted-foreground truncate text-xs'>
                    ID {connection.accountId}
                  </p>
                </div>
                <span className='inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1 text-xs text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-300 dark:ring-emerald-400/20'>
                  <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                  {connection.status === "active" ? "Active" : connection.status}
                </span>
              </div>

              <dl className='mt-4 grid grid-cols-2 gap-3 text-xs'>
                {connectedAt && (
                  <div>
                    <dt className='text-muted-foreground'>Connected</dt>
                    <dd className='text-foreground mt-0.5'>{connectedAt}</dd>
                  </div>
                )}
                {expiresAt && (
                  <div>
                    <dt className='text-muted-foreground'>Token expires</dt>
                    <dd className='text-foreground mt-0.5'>{expiresAt}</dd>
                  </div>
                )}
                <div className='col-span-2'>
                  <dt className='text-muted-foreground'>Scopes granted</dt>
                  <dd className='text-foreground mt-1 flex flex-wrap gap-1'>
                    {connection.scopes.length === 0 && (
                      <span className='text-muted-foreground'>—</span>
                    )}
                    {connection.scopes.map((s) => (
                      <span
                        key={s}
                        className='border-border bg-card/80 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium dark:border-white/10 dark:bg-white/5'
                      >
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>

              {confirming && (
                <div className='mt-4 rounded-md border border-red-500/30 bg-red-500/5 px-3 py-3 dark:border-red-400/30'>
                  <div className='flex items-start gap-2'>
                    <AlertTriangle className='mt-0.5 h-4 w-4 shrink-0 text-red-500' />
                    <div className='text-xs'>
                      <p className='text-foreground font-medium'>
                        Disconnect {platformName}?
                      </p>
                      <p className='text-muted-foreground mt-1'>
                        Scheduled posts and automations that depend on this
                        account will stop until you reconnect.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className='border-border bg-muted/30 flex items-center justify-between gap-3 border-t px-6 py-3 dark:border-white/10 dark:bg-white/[0.02]'>
          <a
            href='https://www.facebook.com/settings?tab=business_tools'
            target='_blank'
            rel='noreferrer'
            className='text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-[11px]'
          >
            Platform settings
            <ExternalLink className='h-3 w-3' />
          </a>

          {!confirming ? (
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={() => setConfirming(true)}
              className='border-red-500/40 text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:border-red-400/40 dark:text-red-300 dark:hover:text-red-200'
            >
              <Unplug className='mr-1 h-3.5 w-3.5' />
              Disconnect
            </Button>
          ) : (
            <div className='flex gap-2'>
              <Button
                type='button'
                size='sm'
                variant='ghost'
                onClick={() => setConfirming(false)}
                disabled={disconnect.isPending}
              >
                Cancel
              </Button>
              <Button
                type='button'
                size='sm'
                onClick={handleDisconnect}
                disabled={disconnect.isPending}
                className='bg-red-500 text-white hover:bg-red-600'
              >
                {disconnect.isPending ? "Disconnecting…" : "Yes, disconnect"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
