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
import { GradientFrame } from "@/utils/gradient-frame";
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

// Where the user can manage their connected app on the platform's own site
// (to revoke server-side, audit scopes, see device sessions, etc.).
// Meta surfaces share one Business settings page; Google surfaces share the
// account-permissions page. Returns null for platforms without a stable URL.
const PLATFORM_SETTINGS_URL: Partial<Record<IntegrationPlatform, string>> = {
  facebook: "https://www.facebook.com/settings?tab=business_tools",
  instagram: "https://business.facebook.com/settings/instagram-accounts",
  threads: "https://www.threads.net/settings/account",
  linkedin: "https://www.linkedin.com/psettings/permitted-services",
  x: "https://x.com/settings/connected_apps",
  tiktok: "https://www.tiktok.com/setting/apps-and-data",
  youtube: "https://myaccount.google.com/permissions",
  pinterest: "https://www.pinterest.com/settings/apps",
  snapchat: "https://accounts.snapchat.com/accounts/connected-apps",
  meta_ads: "https://business.facebook.com/settings/people",
  google_ads: "https://myaccount.google.com/permissions",
  tiktok_ads: "https://ads.tiktok.com/i18n/account/info",
  linkedin_ads: "https://www.linkedin.com/psettings/permitted-services",
  x_ads: "https://x.com/settings/connected_apps",
  gmail: "https://myaccount.google.com/permissions",
  outlook: "https://account.microsoft.com/privacy/app-access",
  mailchimp: "https://us1.admin.mailchimp.com/account/api/",
  brevo: "https://app.brevo.com/security/login_session",
  whatsapp: "https://business.facebook.com/wa/manage/",
  telegram: "https://my.telegram.org/auth",
  google_calendar: "https://myaccount.google.com/permissions",
  google_drive: "https://myaccount.google.com/permissions",
};

function platformSettingsUrl(
  platform: IntegrationPlatform | null
): string | null {
  if (!platform) return null;
  return PLATFORM_SETTINGS_URL[platform] ?? null;
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
  const { identityBySurface } = useIntegrations();

  // Each Meta surface (FB, IG, Meta Ads, WhatsApp) has its own identity row
  // now. Pull the one for THIS dialog's platform — revoking it should only
  // affect this surface, never the others.
  const surface = platform && isMetaSurface(platform) ? platform : null;
  const identity = surface ? identityBySurface.get(surface) ?? null : null;
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
      toast.success(`${platformName} Meta access revoked`, {
        description: `All ${platformName} connections for this org were removed. Other Meta surfaces (Facebook, Instagram, Meta Ads, WhatsApp) are untouched.`,
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
        className='max-h-[96dvh] w-[calc(100%-1.5rem)] max-w-lg overflow-y-auto border-0 bg-transparent p-0 shadow-none'
        hideDialogClose
      >
        <div className="group relative mx-auto w-full overflow-hidden rounded-3xl bg-black/[0.02] p-2 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10">
          <GradientFrame />
          <div className="relative z-10 flex flex-col overflow-hidden rounded-[1.3rem] bg-white shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10">
            <div className='relative max-h-[calc(85dvh-4rem)] overflow-x-hidden overflow-y-auto px-4 pt-7 pb-6 sm:px-6'>
              <button
                type='button'
                onClick={() => handleClose(false)}
                className='text-muted-foreground hover:text-foreground absolute top-4 right-4 z-20 rounded-full p-1 transition'
                aria-label='Close'
              >
                <X className='h-4 w-4' />
              </button>

              <div className='relative z-10 flex min-w-0 items-center gap-3 pr-6'>
            <div className='border-border flex h-12 w-12 items-center justify-center rounded-xl border bg-white/80 backdrop-blur dark:border-white/10 dark:bg-white/5'>
              <Icon className='h-7 w-7' />
            </div>
            <div className='min-w-0'>
              <DialogHeader className='space-y-0 text-left'>
                <DialogTitle className='text-lg font-semibold tracking-tight'>
                  {platformName} connections
                </DialogTitle>
                <DialogDescription className='text-xs'>
                  {sortedConnections.length === 0
                    ? `No ${label.toLowerCase()}s provisioned yet.`
                    : hasMultiple
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
                This identity is scoped to {platformName} only. Your other
                Meta connections (Facebook, Instagram, Meta Ads, WhatsApp)
                each have their own independent login.
              </p>
            </div>
          )}

          <div className='relative z-10 mt-5 space-y-2'>
            <GradientFrame />
            {sortedConnections.length === 0 && (
              <div className='border-border bg-card/60 rounded-md border px-3 py-4 text-center dark:border-white/10 dark:bg-white/5'>
                <p className='text-foreground text-sm'>
                  No {label.toLowerCase()}s provisioned for {platformName}.
                </p>
                {showIdentitySection ? (
                  <p className='text-muted-foreground mt-1 text-[11px]'>
                    Your Meta login is authorized, but no usable{" "}
                    {label.toLowerCase()}s were found on this account. Fix it
                    on the Meta side and click Connect again, or revoke Meta
                    access below to start clean.
                  </p>
                ) : (
                  <p className='text-muted-foreground mt-1 text-[11px]'>
                    Click Connect from the integrations page to set up{" "}
                    {platformName}.
                  </p>
                )}
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
                  <div className='flex min-w-0 flex-wrap items-center gap-3 sm:flex-nowrap'>
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
                          ? "ml-auto inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-300"
                          : "ml-auto inline-flex shrink-0 items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-xs text-amber-700 ring-1 ring-amber-500/30 dark:text-amber-300"
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
                            className='border-border bg-card/80 inline-flex max-w-full items-center break-all rounded px-1.5 py-0.5 text-[10px] font-medium dark:border-white/10 dark:bg-white/5'
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
                          onClick={() => {
                            setConfirmDisconnectId(null);
                            handleClose(false);
                          }}
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
                      Revoke {platformName} access
                    </p>
                    <p className='text-muted-foreground mt-1 text-[11px]'>
                      Removes the Meta login tied to {platformName} and every{" "}
                      {label.toLowerCase()} provisioned under it. Your other
                      Meta surfaces stay connected.
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
                    Revoke all {platformName} access on this Meta login?
                  </p>
                  <div className='mt-2 flex justify-end gap-2'>
                    <Button
                      type='button'
                      size='sm'
                      variant='ghost'
                      onClick={() => {
                        setConfirmIdentityWipe(false);
                        handleClose(false);
                      }}
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
                        : `Yes, revoke ${platformName}`}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className='flex flex-col items-start justify-between gap-2 border-t border-black/5 px-4 py-3 sm:flex-row sm:items-center sm:px-6 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]'>
          {platformSettingsUrl(platform) ? (
            <a
              href={platformSettingsUrl(platform) as string}
              target='_blank'
              rel='noreferrer'
              className='text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-[11px]'
            >
              {platformName} settings
              <ExternalLink className='h-3 w-3' />
            </a>
          ) : (
            <span />
          )}
          <span className='text-muted-foreground inline-flex items-center gap-1 text-[11px]'>
            <CheckCircle2 className='h-3 w-3' />
            All tokens encrypted at rest
          </span>
        </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
  );
}
