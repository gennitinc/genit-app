"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useDisconnectIntegration,
  useDisconnectMetaIdentity,
  useIntegrations,
  useSetPrimaryIntegration,
} from "@/hooks/use-integrations";
import {
  IntegrationConnection,
  IntegrationPlatform,
  isMetaSurface,
} from "@/lib/integrations-api";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Star,
  Unplug,
  X,
} from "lucide-react";
import { type ComponentType, type CSSProperties, useMemo, useState } from "react";
import { toast } from "sonner";

interface ManageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connections: IntegrationConnection[];
  platform: IntegrationPlatform | null;
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

function targetLabel(platform: IntegrationPlatform): string {
  if (platform === "facebook") return "Page";
  if (platform === "instagram") return "Account";
  if (platform === "meta_ads") return "Ad account";
  if (platform === "whatsapp") return "Phone number";
  if (platform === "gmail") return "Mailbox";
  if (platform === "telegram") return "Bot";
  return "Target";
}

export function ManageDialog({
  open,
  onOpenChange,
  connections,
  platform,
  platformName,
  Icon,
  glow,
}: ManageDialogProps) {
  const [confirmDisconnectId, setConfirmDisconnectId] = useState<string | null>(
    null
  );
  const [confirmIdentityWipe, setConfirmIdentityWipe] = useState(false);
  const disconnectOne = useDisconnectIntegration();
  const disconnectIdentity = useDisconnectMetaIdentity();
  const setPrimary = useSetPrimaryIntegration();
  const { identity } = useIntegrations();

  const surface = platform && isMetaSurface(platform) ? platform : null;
  const showIdentitySection = surface !== null && identity;

  const sortedConnections = useMemo(() => {
    return [...connections].sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [connections]);

  function handleClose(next: boolean) {
    if (!next) {
      setConfirmDisconnectId(null);
      setConfirmIdentityWipe(false);
    }
    onOpenChange(next);
  }

  async function handleDisconnectOne(id: string) {
    try {
      await disconnectOne.mutateAsync(id);
      toast.success(`${platformName} target disconnected`);
      setConfirmDisconnectId(null);
      if (sortedConnections.length <= 1) onOpenChange(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to disconnect";
      toast.error("Disconnect failed", { description: msg });
    }
  }

  async function handleSetPrimary(id: string) {
    try {
      await setPrimary.mutateAsync(id);
      toast.success("Primary target updated");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to set primary";
      toast.error("Update failed", { description: msg });
    }
  }

  async function handleDisconnectIdentity() {
    if (!identity) return;
    try {
      await disconnectIdentity.mutateAsync(identity._id);
      toast.success("Meta access revoked", {
        description:
          "All Facebook, Instagram, and Meta Ads connections for this org were removed.",
      });
      onOpenChange(false);
      setConfirmIdentityWipe(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to revoke Meta access";
      toast.error("Revoke failed", { description: msg });
    }
  }

  const hasMultiple = sortedConnections.length > 1;
  const label = platform ? targetLabel(platform) : "Target";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className='border-border bg-card overflow-hidden p-0 sm:max-w-lg'
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
                  {platformName} connections
                </DialogTitle>
                <DialogDescription className='text-xs'>
                  {hasMultiple
                    ? `${sortedConnections.length} ${label.toLowerCase()}s connected for this organization.`
                    : `Manage the connected ${label.toLowerCase()} or revoke access.`}
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>

          {showIdentitySection && (
            <div className='relative z-10 mt-5 rounded-md border border-violet-500/20 bg-violet-500/4 p-3 dark:border-violet-300/20 dark:bg-violet-300/4'>
              <p className='text-foreground text-xs font-medium'>
                Signed in to Meta as{" "}
                <span className='font-semibold'>{identity?.metaUserName}</span>
              </p>
              <p className='text-muted-foreground mt-0.5 text-[11px]'>
                This single Meta identity powers Facebook, Instagram, and Meta
                Ads for your organization.
              </p>
            </div>
          )}

          <div className='relative z-10 mt-5 space-y-2'>
            {sortedConnections.length === 0 && (
              <div className='border-border bg-card/60 text-muted-foreground rounded-md border px-3 py-4 text-center text-sm dark:border-white/10 dark:bg-white/5'>
                No active connections for {platformName}.
              </div>
            )}
            {sortedConnections.map((conn) => {
              const expiresAt = formatDate(conn.expiresAt);
              const connectedAt = formatDate(conn.createdAt);
              const isConfirming = confirmDisconnectId === conn._id;

              return (
                <div
                  key={conn._id}
                  className='border-border bg-card/60 rounded-md border px-3 py-3 dark:border-white/10 dark:bg-white/5'
                >
                  <div className='flex items-center gap-3'>
                    {conn.accountAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={conn.accountAvatar}
                        alt={conn.accountName}
                        className='h-9 w-9 rounded-full'
                      />
                    ) : (
                      <div className='bg-muted h-9 w-9 rounded-full' />
                    )}
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center gap-1.5'>
                        <p className='text-foreground truncate text-sm font-medium'>
                          {conn.accountName}
                        </p>
                        {conn.isPrimary && (
                          <span className='inline-flex items-center gap-0.5 rounded bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-medium text-violet-700 ring-1 ring-violet-500/30 dark:text-violet-300'>
                            <Star className='h-2.5 w-2.5' />
                            Primary
                          </span>
                        )}
                      </div>
                      <p className='text-muted-foreground truncate text-[11px]'>
                        {label} ID: {conn.accountId}
                      </p>
                    </div>
                    <span
                      className={
                        conn.status === "active"
                          ? "inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-300"
                          : "inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-xs text-amber-700 ring-1 ring-amber-500/30 dark:text-amber-300"
                      }
                    >
                      <span
                        className={
                          conn.status === "active"
                            ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
                            : "h-1.5 w-1.5 rounded-full bg-amber-500"
                        }
                      />
                      {conn.status === "active" ? "Active" : conn.status}
                    </span>
                  </div>

                  <dl className='mt-3 grid grid-cols-2 gap-2 text-[11px]'>
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
                  </dl>

                  {conn.scopes.length > 0 && (
                    <div className='mt-2.5'>
                      <p className='text-muted-foreground text-[10px] uppercase tracking-wide'>
                        Scopes
                      </p>
                      <div className='mt-1 flex flex-wrap gap-1'>
                        {conn.scopes.map((s) => (
                          <span
                            key={s}
                            className='border-border bg-card/80 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium dark:border-white/10 dark:bg-white/5'
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {isConfirming && (
                    <div className='mt-3 rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2'>
                      <div className='flex items-start gap-2'>
                        <AlertTriangle className='mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500' />
                        <p className='text-foreground text-[11px]'>
                          Scheduled posts targeting this {label.toLowerCase()}{" "}
                          will stop until you reconnect.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className='mt-3 flex items-center justify-end gap-2'>
                    {hasMultiple && !conn.isPrimary && (
                      <Button
                        type='button'
                        size='sm'
                        variant='ghost'
                        onClick={() => handleSetPrimary(conn._id)}
                        disabled={setPrimary.isPending}
                        className='h-7 px-2 text-[11px]'
                      >
                        <Star className='mr-1 h-3 w-3' />
                        Make primary
                      </Button>
                    )}
                    {!isConfirming ? (
                      <Button
                        type='button'
                        size='sm'
                        variant='outline'
                        onClick={() => setConfirmDisconnectId(conn._id)}
                        className='h-7 px-2 text-[11px] border-red-500/40 text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:border-red-400/40 dark:text-red-300'
                      >
                        <Unplug className='mr-1 h-3 w-3' />
                        Disconnect
                      </Button>
                    ) : (
                      <>
                        <Button
                          type='button'
                          size='sm'
                          variant='ghost'
                          onClick={() => setConfirmDisconnectId(null)}
                          disabled={disconnectOne.isPending}
                          className='h-7 px-2 text-[11px]'
                        >
                          Cancel
                        </Button>
                        <Button
                          type='button'
                          size='sm'
                          onClick={() => handleDisconnectOne(conn._id)}
                          disabled={disconnectOne.isPending}
                          className='h-7 px-2 text-[11px] bg-red-500 text-white hover:bg-red-600'
                        >
                          {disconnectOne.isPending
                            ? "Disconnecting…"
                            : "Confirm"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {showIdentitySection && (
            <div className='relative z-10 mt-5 rounded-md border border-amber-500/30 bg-amber-500/4 p-3'>
              {!confirmIdentityWipe ? (
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <p className='text-foreground text-xs font-medium'>
                      Revoke Meta access entirely
                    </p>
                    <p className='text-muted-foreground mt-1 text-[11px]'>
                      Removes Facebook, Instagram, and Meta Ads connections
                      tied to this Meta login.
                    </p>
                  </div>
                  <Button
                    type='button'
                    size='sm'
                    variant='outline'
                    onClick={() => setConfirmIdentityWipe(true)}
                    className='h-7 shrink-0 border-red-500/40 px-2 text-[11px] text-red-600 hover:bg-red-500/10 dark:border-red-400/40 dark:text-red-300'
                  >
                    Revoke
                  </Button>
                </div>
              ) : (
                <div>
                  <p className='text-foreground text-xs font-medium'>
                    This wipes every Meta connection. Sure?
                  </p>
                  <div className='mt-2 flex justify-end gap-2'>
                    <Button
                      type='button'
                      size='sm'
                      variant='ghost'
                      onClick={() => setConfirmIdentityWipe(false)}
                      disabled={disconnectIdentity.isPending}
                      className='h-7 px-2 text-[11px]'
                    >
                      Cancel
                    </Button>
                    <Button
                      type='button'
                      size='sm'
                      onClick={handleDisconnectIdentity}
                      disabled={disconnectIdentity.isPending}
                      className='h-7 px-2 text-[11px] bg-red-500 text-white hover:bg-red-600'
                    >
                      {disconnectIdentity.isPending
                        ? "Revoking…"
                        : "Yes, revoke Meta"}
                    </Button>
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
          <span className='text-muted-foreground inline-flex items-center gap-1 text-[11px]'>
            <CheckCircle2 className='h-3 w-3' />
            All tokens encrypted at rest
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
