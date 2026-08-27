"use client";

import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserContext } from "@/context/AuthenticatedContext";
import {
  integrationsQueryKey,
  useIntegrations,
} from "@/hooks/use-integrations";
import { beginConnectionAttempt } from "@/lib/connection-attempt";
import {
  ConnectUrlResponse,
  InstagramCandidate,
  IntegrationPlatform,
  completeComposioAuth,
  fetchIntegrations,
  isMetaSurface,
  isPlatformSupported,
  provisionFacebookSelected,
  provisionInstagramSelected,
  requestComposioConnectUrl,
  requestConnectUrl,
} from "@/lib/integrations-api";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiOrigin } from "@/utils/apiResponse";
import { GradientFrame } from "@/utils/gradient-frame";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle2,
  CircleFadingArrowUp,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  type CSSProperties,
  type ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type PopupMessage =
  | {
      type: "genit:integration:connected";
      platform: IntegrationPlatform;
      integrationId: string;
      accountName?: string;
    }
  | {
      type: "genit:integration:error";
      platform: IntegrationPlatform;
      message?: string;
    }
  | {
      // Instagram-only: server discovered IG candidates and is waiting
      // for the user to pick which account(s) to provision before any
      // Integration row is written.
      type: "genit:integration:select_target";
      platform: IntegrationPlatform;
      identityId: string;
      candidates: Array<{
        id: string;
        label: string;
        subtitle?: string;
        avatar?: string;
      }>;
    }
  | {
      type: "genit:composio:verify";
      sessionUri: string;
    };

interface ConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: IntegrationPlatform | null;
  platformName: string;
  platformDescription: string;
  Icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  iconUrl?: string;
  glow: string;
  appSlug?: string;
  onConnected?: () => void;
}

// `select` = user must pick which IG account(s) to provision before any
// Integration row is written. Triggered by either the OAuth callback or
// the smart-connect fast path returning candidates.
type Phase = "idle" | "connecting" | "select" | "success" | "error";

const PLATFORM_SCOPES: Partial<Record<IntegrationPlatform, string[]>> = {
  facebook: [
    "See the Pages you manage",
    "Publish posts, photos and videos to those Pages",
    "Read engagement and comments on posts",
    "Reply to Page direct messages",
  ],
  instagram: [
    "Identify your Instagram Business or Creator account",
    "Publish photos, videos, reels and carousels",
    "Read insights for the content we publish",
    "Manage comments and direct messages",
  ],
  messenger: [
    "Identify the Facebook Page connected to Messenger",
    "Reply to direct messages sent to your Page",
    "Build automated chat workflows and read incoming messages",
  ],
  meta_ads: [
    "List your ad accounts in Business Manager",
    "Create and manage campaigns, ad sets and ads",
    "Read ad performance, spend and conversions",
  ],
  threads: [
    "Identify your Threads profile",
    "Publish text, image, video and carousel posts",
    "Read and reply to comments on your threads",
    "Read insights on your threads and profile",
  ],
  whatsapp: [
    "List the WhatsApp Business phone numbers you manage",
    "Send template, text and media messages on your behalf",
    "Read message templates and approval status",
    "Read messaging analytics for your numbers",
  ],
  gmail: [
    "Identify your Google account (email + profile picture)",
    "Send email on your behalf via Gmail",
    "Read your inbox to surface replies and threads",
    "Modify labels on messages we send and receive",
  ],
  telegram: [
    "Send messages, photos, documents and videos from your bot",
    "Read recent updates to surface known chats",
    "Reply automatically to users who message your bot",
  ],
  x: [
    "Identify your X account (handle, name, profile picture)",
    "Post tweets, threads and replies on your behalf",
    "Read your recent tweets, mentions and replies",
    "Pull per-tweet impressions and engagement metrics",
  ],
  linkedin: [
    "Identify your LinkedIn profile (name, email, picture)",
    "Post to your personal feed and any company pages you admin",
    "Read comments on the posts we publish",
    "Pull share analytics for company-page posts",
  ],
  tiktok: [
    "Identify your TikTok account (handle, display name, avatar)",
    "Publish videos directly to your TikTok account",
    "List your recent videos with view, like, comment and share counts",
    "Read comments on videos posted to your account",
  ],
  youtube: [
    "Identify your YouTube channel (title, avatar, subscriber count)",
    "Upload videos and manage their privacy status",
    "List your videos and read viewer comments",
    "Reply to comments and pull view/watch-time analytics",
  ],
  brevo: [
    "Identify the Brevo account (email + plan info)",
    "Send transactional emails on your behalf",
    "Read and create contacts in your Brevo lists",
    "List your marketing campaigns and pull delivery / open / click stats",
  ],
  outlook: [
    "Identify your Microsoft account (email + profile)",
    "Send email on your behalf via Outlook",
    "Read your inbox to surface replies and threads",
  ],
  mailchimp: [
    "Identify your Mailchimp account and audiences",
    "Create and send marketing campaigns",
    "Read subscriber lists and campaign analytics",
  ],
  pinterest: [
    "Identify your Pinterest account (handle, avatar, business name)",
    "List your boards and create pins from image URLs",
    "List, update and delete pins on your account",
    "Pull per-pin and account-level impressions, clicks, saves and outbound clicks",
  ],
  snapchat: [
    "Identify the connected Snap Business user",
    "List the organizations and ad accounts you can manage",
    "List ad campaigns and read account + campaign performance stats",
    "Read spend, impressions, swipes and view metrics in your reporting timezone",
  ],
  google_ads: [
    "List the Google Ads customers your Google account can access (managers + child accounts)",
    "Read campaign metadata via GAQL — status, channel type, budget pacing",
    "Pull per-day metrics: impressions, clicks, cost, conversions, conversion value",
    "Filter analytics down to a single campaign id",
  ],
  tiktok_ads: [
    "Identify the TikTok Business advertiser accounts you authorized at connect time",
    "List campaigns under each advertiser",
    "Pull /report/integrated/get/ data at campaign, ad-group, or ad level",
    "Filter reports by campaign id and choose your own metrics + dimensions",
  ],
  linkedin_ads: [
    "List your LinkedIn ad accounts and company pages",
    "Create and manage campaigns, ad sets and creatives",
    "Read ad performance and lead generation metrics",
  ],
  x_ads: [
    "List your X ad accounts",
    "Create and manage promoted tweets and campaigns",
    "Pull ad performance and engagement metrics",
  ],
  google_calendar: [
    "Identify your Google account (email + profile picture)",
    "List events on your primary and secondary calendars",
    "Create events with attendees, locations and timezones",
    "Send invitation emails on your behalf when you add attendees",
  ],
  google_drive: [
    "Identify your Google account (email + profile picture)",
    "Browse files and folders across My Drive and shared drives",
    "Create folders and upload new files to locations you choose",
    "Update or delete files genit creates on your behalf",
  ],
  google_meet: [
    "Create and launch meeting spaces",
    "Read meeting details",
    "End active conferences",
  ],
  google_sheets: [
    "Create and read spreadsheets",
    "Write values and apply batch formatting",
    "Invite collaborators and assign viewer, commenter, editor or owner roles",
  ],
  google_slides: [
    "Create and read presentations",
    "Add and edit slides with batch updates",
    "Invite collaborators and manage their roles",
  ],
  google_docs: [
    "Create and read documents",
    "Insert, replace and format document content",
    "Invite collaborators and manage their roles",
  ],
  google_forms: [
    "Create surveys and quizzes",
    "Add and edit questions",
    "Read responses and invite collaborators",
  ],
  composio: [
    "Connect the selected account through Composio's managed authentication",
    "Let Genit discover and run the toolkit's supported tools",
    "Revoke the connection at any time from Genit",
  ],
};

const REQUIREMENTS = [
  "Sign in or enter your account credentials in the secure Composio window",
  "Approve the permissions required for the actions you want Genit to perform",
  "If Composio requires app setup, an administrator must configure it in the Composio dashboard",
];

// Turn any URL embedded in a requirement string into a clickable blue link.
// Matches both full https:// URLs and bare domain forms like
// "app.brevo.com/security/authorised_ips" — the latter gets an implicit
// https:// prefix when used as the anchor href.
const URL_PATTERN =
  /(https?:\/\/[^\s]+|(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s]*)?)/gi;

function renderRequirement(text: string): React.ReactNode {
  const parts = text.split(URL_PATTERN);
  return parts.map((part, i) => {
    if (i % 2 === 0) return part;
    const href = part.startsWith("http") ? part : `https://${part}`;
    return (
      <a
        key={i}
        href={href}
        target='_blank'
        rel='noreferrer'
        className='text-blue-500 underline underline-offset-2 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300'
      >
        {part}
      </a>
    );
  });
}

export function ConnectDialog({
  open,
  onOpenChange,
  platform,
  platformName,
  platformDescription,
  Icon,
  iconUrl,
  glow,
  appSlug,
  onConnected,
}: ConnectDialogProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  // Instagram selection flow: candidates discovered by the server, the IDs
  // the user picks, and the in-flight POST state.
  const [igCandidates, setIgCandidates] = useState<InstagramCandidate[]>([]);
  const [selectedIgIds, setSelectedIgIds] = useState<Set<string>>(new Set());
  const [provisionLoading, setProvisionLoading] = useState(false);
  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Tracks whether a terminal postMessage (connected / error / select_target)
  // has been received. Prevents the popup-closed poll from racing with
  // the message handler and showing a false "error" flash.
  const connectionResolvedRef = useRef(false);
  const connectionStartedAtRef = useRef(0);
  const connectionAttemptRef = useRef(0);
  const qc = useQueryClient();
  const { user } = useUserContext();
  const { identityBySurface } = useIntegrations();
  const currentOrg = user?.currentOrganization;
  const orgId =
    typeof currentOrg === "object" && currentOrg ? currentOrg._id : undefined;

  // Smart-connect eligibility is now per-surface: only valid when THIS
  // specific Meta surface already has its own identity row. Other Meta
  // logins don't count.
  const isSmartConnectEligible = useMemo(() => {
    if (!platform || !isMetaSurface(platform)) return false;
    const identity = identityBySurface.get(platform);
    return Boolean(identity && identity.status === "active");
  }, [platform, identityBySurface]);

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
      connectionAttemptRef.current += 1;
      closePopup();
      setPhase("idle");
      setErrorMessage(null);
      setConnectedAccount(null);
      // NOTE: we intentionally do NOT reset connectionResolvedRef here.
      // It is only reset when a new connection attempt starts (handleConnect).
      // Resetting here would allow a stale setTimeout from the poll to
      // flash an error after the dialog re-opens.
    }
  }, [open, closePopup]);

  const markConnected = useCallback(
    (accountName?: string) => {
      connectionResolvedRef.current = true;
      closePopup();
      setConnectedAccount(accountName || null);
      setPhase("success");
      qc.invalidateQueries({ queryKey: integrationsQueryKey(orgId) });
      toast.success(`Connected ${platformName}`, {
        description: accountName ? `@${accountName}` : undefined,
      });
      onConnected?.();
    },
    [closePopup, onConnected, orgId, platformName, qc]
  );

  useEffect(() => {
    if (!platform) return;
    const activePlatform = platform;
    function handleMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin && e.origin !== apiOrigin) return;
      if (e.source !== popupRef.current) return;
      const data = e.data as PopupMessage | undefined;
      if (!data || typeof data !== "object") return;
      if (
        data.type !== "genit:integration:connected" &&
        data.type !== "genit:integration:error" &&
        data.type !== "genit:integration:select_target" &&
        data.type !== "genit:composio:verify"
      )
        return;
      if (data.type === "genit:composio:verify") {
        void completeComposioAuth(data.sessionUri, activePlatform)
          .then((integration) => markConnected(integration.accountName))
          .catch((error: any) => {
            connectionResolvedRef.current = true;
            closePopup();
            setErrorMessage(
              error?.response?.data?.message ||
                error?.message ||
                "Composio verification failed"
            );
            setPhase("error");
          });
        return;
      }
      if (data.platform !== activePlatform) return;

      // Mark as resolved BEFORE any React state updates so the popup poll
      // can never race ahead and flash an error.
      connectionResolvedRef.current = true;
      closePopup();

      if (data.type === "genit:integration:select_target") {
        // Instagram-only path: server discovered candidates and asks the
        // user to pick which IG account(s) to actually connect. The popup
        // sends a compact { id, label, subtitle, avatar } shape; expand
        // back into InstagramCandidate.
        const expanded: InstagramCandidate[] = data.candidates.map((c) => ({
          igAccountId: c.id,
          username: c.label.replace(/^@/, ""),
          profilePictureUrl: c.avatar,
          parentPageId: "",
          parentPageName: c.subtitle?.replace(/^via /, "") ?? "",
        }));
        setIgCandidates(expanded);
        // Pre-select if there's only one candidate so the button is
        // immediately actionable.
        setSelectedIgIds(
          new Set(expanded.length === 1 ? [expanded[0].igAccountId] : [])
        );
        setPhase("select");
        return;
      }

      if (data.type === "genit:integration:connected") {
        markConnected(data.accountName);
        // Managed providers persist from a server webhook, which can arrive a
        // moment after the browser redirect. Recheck without blocking the UI.
        window.setTimeout(
          () => qc.invalidateQueries({ queryKey: integrationsQueryKey(orgId) }),
          1_500
        );
        window.setTimeout(
          () => qc.invalidateQueries({ queryKey: integrationsQueryKey(orgId) }),
          4_000
        );
      } else {
        setErrorMessage(data.message || "Connection failed");
        setPhase("error");
        qc.invalidateQueries({ queryKey: integrationsQueryKey(orgId) });
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [platform, qc, orgId, closePopup, markConnected]);

  const handleConnect = useCallback(async () => {
    if (!platform) return;
    if (!isPlatformSupported(platform)) {
      toast.info(`${platformName} integration is coming soon`);
      return;
    }
    closePopup();
    const isCurrentAttempt = beginConnectionAttempt(connectionAttemptRef);
    setPhase("connecting");
    setErrorMessage(null);
    connectionResolvedRef.current = false;
    connectionStartedAtRef.current = Date.now();

    let response: ConnectUrlResponse;
    try {
      response = appSlug
        ? await requestComposioConnectUrl(appSlug)
        : await requestConnectUrl(platform);
    } catch (err: any) {
      if (!isCurrentAttempt()) return;
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to start connection";
      setErrorMessage(msg);
      setPhase("error");
      toast.error("Could not start connection", { description: msg });
      return;
    }
    if (!isCurrentAttempt()) return;

    // Smart-connect fast path: the org already has a Meta identity with
    // sufficient scopes for this surface. No popup needed.
    if (response.skipOAuth) {
      // Instagram fast-path: server returns candidates instead of
      // provisioned rows. Show the picker, same as the OAuth route.
      if (response.surface === "instagram" && "candidates" in response) {
        setIgCandidates(response.candidates);
        setSelectedIgIds(new Set());
        setPhase("select");
        return;
      }
      const provisioned =
        "provisioned" in response ? response.provisioned : undefined;
      const name =
        provisioned?.pages?.[0]?.pageName ||
        provisioned?.instagram?.[0]?.username ||
        provisioned?.adAccounts?.[0]?.name ||
        provisioned?.whatsapp?.[0]?.displayPhoneNumber ||
        null;
      setConnectedAccount(name);
      setPhase("success");
      qc.invalidateQueries({ queryKey: integrationsQueryKey(orgId) });
      toast.success(`Connected ${platformName}`, {
        description: name ? `@${name}` : undefined,
      });
      return;
    }

    try {
      const width = 600;
      const height = 720;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(
        response.authorizeUrl,
        "genit_oauth",
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
      );
      if (!popup) {
        throw new Error(
          "Popup blocked. Allow popups for this site and try again."
        );
      }
      popupRef.current = popup;
      connectionResolvedRef.current = false;
      const poll = setInterval(() => {
        if (!isCurrentAttempt()) {
          clearInterval(poll);
          return;
        }
        if (popup.closed) {
          clearInterval(poll);
          if (pollRef.current === poll) pollRef.current = null;

          // The popup closed — but a postMessage may still be in flight.
          // If we already resolved (message was received), do nothing.
          if (connectionResolvedRef.current) return;

          void (async () => {
            for (let attempt = 0; attempt < 4; attempt += 1) {
              await new Promise((resolve) => window.setTimeout(resolve, 1500));
              if (!isCurrentAttempt()) return;
              if (connectionResolvedRef.current) return;
              try {
                const { integrations } = await fetchIntegrations();
                if (!isCurrentAttempt()) return;
                const connected = integrations.find(
                  (item) =>
                    item.status === "active" &&
                    item.metadata?.provider === "composio" &&
                    (appSlug
                      ? item.metadata?.toolkitSlug === appSlug
                      : item.metadata?.nativePlatform === platform) &&
                    Date.parse(item.updatedAt) >=
                      connectionStartedAtRef.current - 2_000
                );
                if (connected) {
                  markConnected(connected.accountName);
                  return;
                }
              } catch {
                // A transient refresh error should not mask the OAuth result.
              }
            }
            if (!isCurrentAttempt()) return;
            if (connectionResolvedRef.current) return;
            setPhase((current) => {
              if (!isCurrentAttempt() || current !== "connecting")
                return current;
              setErrorMessage(
                (prev) =>
                  prev ?? "Window closed before the connection completed"
              );
              return "error";
            });
          })();
        }
      }, 600);
      pollRef.current = poll;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to open popup";
      setErrorMessage(msg);
      setPhase("error");
      toast.error("Could not start connection", { description: msg });
    }
  }, [platform, platformName, appSlug, qc, orgId, markConnected, closePopup]);

  function handleDone() {
    onOpenChange(false);
  }

  useEffect(() => {
    if (!open || phase !== "success") return;

    const timeout = setTimeout(() => {
      onOpenChange(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [open, phase, onOpenChange]);

  // Final step of the connect flow: user picked accounts in the
  // select phase, now ask the server to actually create Integration rows
  // for those accounts only.
  const handleProvisionSelected = useCallback(async () => {
    if (selectedIgIds.size === 0) return;
    setProvisionLoading(true);
    setErrorMessage(null);
    try {
      if (platform === "facebook") {
        const result = await provisionFacebookSelected(
          Array.from(selectedIgIds)
        );
        const first = result.provisioned[0];
        setConnectedAccount(first ? first.pageName : null);
        setPhase("success");
        qc.invalidateQueries({ queryKey: integrationsQueryKey(orgId) });
        toast.success(
          `Connected ${result.provisioned.length} Facebook ${
            result.provisioned.length === 1 ? "page" : "pages"
          }`,
          { description: first ? first.pageName : undefined }
        );
      } else {
        const result = await provisionInstagramSelected(
          Array.from(selectedIgIds)
        );
        const first = result.provisioned[0];
        setConnectedAccount(first ? `@${first.username}` : null);
        setPhase("success");
        qc.invalidateQueries({ queryKey: integrationsQueryKey(orgId) });
        const warning = result.provisioned.find(
          (account) => account.warning
        )?.warning;
        const message = `Connected ${result.provisioned.length} Instagram ${
          result.provisioned.length === 1 ? "account" : "accounts"
        }`;
        if (warning) {
          toast.warning(`${message} with limited inbox access`, {
            description: warning,
          });
        } else {
          toast.success(message, {
            description: first ? `@${first.username}` : undefined,
          });
        }
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to connect the selected account";
      setErrorMessage(msg);
      setPhase("error");
      toast.error("Connection failed", { description: msg });
    } finally {
      setProvisionLoading(false);
    }
  }, [selectedIgIds, qc, orgId, platform]);

  const isSupported = platform ? isPlatformSupported(platform) : false;
  const scopes = platform ? (PLATFORM_SCOPES[platform] ?? []) : [];
  const requirements = platform ? REQUIREMENTS : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='max-h-[96dvh] w-[calc(100%-1.5rem)] max-w-md overflow-y-auto border-0 bg-transparent p-0 shadow-none'
        hideDialogClose
      >
        <div className='group relative mx-auto w-full overflow-hidden rounded-3xl bg-black/[0.02] p-2 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10'>
          <GradientFrame />
          <div className='relative z-10 flex flex-col overflow-hidden rounded-[1.3rem] bg-white shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10'>
            <div className='relative max-h-[calc(85dvh-4rem)] overflow-x-hidden overflow-y-auto px-4 pt-7 pb-6 sm:px-6'>
              <button
                type='button'
                onClick={() => onOpenChange(false)}
                className='text-muted-foreground hover:text-foreground absolute top-4 right-4 z-20 rounded-full p-1 transition'
                aria-label='Close'
              >
                <X className='h-4 w-4' />
              </button>

              <div className='relative z-10 flex min-w-0 items-center gap-3 pr-6'>
                <div className='border-border flex h-10 w-15 shrink-0 items-center justify-center rounded-sm border bg-white/80 backdrop-blur dark:border-white/10 dark:bg-white/5'>
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt=''
                      className='h-7 w-7 rounded object-contain'
                    />
                  ) : (
                    <Icon className='h-7 w-7 rounded-none' />
                  )}
                </div>
                <div className='min-w-0'>
                  <DialogHeader className='space-y-0 text-left'>
                    <DialogTitle className='text-lg font-semibold tracking-tight'>
                      <LocalizedText text={"Connect"} /> {platformName}
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
                      <LocalizedText text={"We're still building the"} />
                      {platformName}{" "}
                      <LocalizedText
                        text={
                          "connection. We'll enable it for your organization as soon as it's ready."
                        }
                      />
                    </div>
                  ) : (
                    <>
                      <div className='relative bg-neutral-50 px-3 py-3 dark:bg-neutral-800'>
                        <GradientFrame />
                        <p className='text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase'>
                          <LocalizedText text={"genit will be able to"} />
                        </p>
                        <ul className='space-y-2'>
                          {scopes.map((scope) => (
                            <li
                              key={scope}
                              className='text-foreground flex items-start gap-2 text-sm'
                            >
                              <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0 text-emerald-500' />
                              <span className='min-w-0 [overflow-wrap:anywhere]'>
                                {scope}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {requirements.length > 0 && (
                        <div className='relative mt-4 bg-neutral-50 px-3 py-3 dark:bg-neutral-800'>
                          <GradientFrame />
                          <p className='text-foreground mb-1 text-xs font-medium'>
                            <LocalizedText text={"Before you continue"} />
                          </p>
                          <ul className='text-muted-foreground space-y-1 text-xs [overflow-wrap:anywhere]'>
                            {requirements.map((r) => (
                              <li key={r}>
                                {"• "}
                                {renderRequirement(r)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {isSmartConnectEligible &&
                        platform &&
                        isMetaSurface(platform) && (
                          <div className='mt-4 flex items-start gap-2 rounded-md border border-violet-500/30 bg-violet-500/4 px-3 py-2.5 dark:border-violet-300/30'>
                            <Sparkles className='mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500 dark:text-violet-300' />
                            <p className='text-foreground text-xs'>
                              <LocalizedText
                                text={
                                  "You&apos;re already signed in to Meta for"
                                }
                              />{" "}
                              {platformName} <LocalizedText text={"as"} />{" "}
                              <span className='font-medium'>
                                {identityBySurface.get(platform)?.metaUserName}
                              </span>
                              <LocalizedText
                                text={
                                  ". We&apos;ll reuse that login when possible — you may not see a popup."
                                }
                              />
                            </p>
                          </div>
                        )}
                    </>
                  )}
                </div>
              )}

              {phase === "select" && (
                <div className='relative z-10 mt-5'>
                  <div className='relative bg-neutral-50 px-3 py-3 text-sm dark:bg-neutral-800'>
                    <GradientFrame />
                    <p className='text-foreground font-medium'>
                      <LocalizedText text={"Select accounts to connect"} />
                    </p>
                    <p className='text-muted-foreground mt-1 text-xs'>
                      <LocalizedText
                        text={
                          "Choose which accounts you want to manage with genit."
                        }
                      />
                    </p>
                  </div>
                  <div className='mt-4 space-y-2'>
                    {igCandidates.map((c) => (
                      <div
                        key={c.igAccountId}
                        className='border-border bg-card/60 hover:bg-muted/50 flex cursor-pointer items-center space-x-3 rounded-md border p-3 transition-colors dark:border-white/10 dark:bg-white/5'
                        onClick={() => {
                          const newSet = new Set(selectedIgIds);
                          if (newSet.has(c.igAccountId))
                            newSet.delete(c.igAccountId);
                          else newSet.add(c.igAccountId);
                          setSelectedIgIds(newSet);
                        }}
                      >
                        <input
                          type='checkbox'
                          className='h-4 w-4 rounded border-gray-300 bg-transparent text-cyan-600 focus:ring-cyan-500'
                          checked={selectedIgIds.has(c.igAccountId)}
                          readOnly
                        />
                        {c.profilePictureUrl ? (
                          <img
                            src={c.profilePictureUrl}
                            alt={c.username}
                            className='bg-muted h-8 w-8 rounded-full'
                          />
                        ) : (
                          <div className='bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold'>
                            {c.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className='flex min-w-0 flex-1 flex-col'>
                          <span className='text-foreground truncate text-sm font-medium'>
                            {c.username}
                          </span>
                          {c.parentPageName && (
                            <span className='text-muted-foreground truncate text-[11px]'>
                              {c.parentPageName}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {phase === "connecting" && (
                <div className='relative z-10 mt-6 flex flex-col items-center justify-center py-6'>
                  <div className='relative h-14 w-14'>
                    <div
                      className='absolute inset-0 animate-ping rounded-full'
                      // style={{ background: glow, opacity: 0.5 }}
                    />
                    <div className='border-border bg-card relative flex h-14 w-14 items-center justify-center rounded-full border dark:border-white/10'>
                      <LoadingFileLoader size={16} />
                    </div>
                  </div>
                  <p className='text-foreground mt-4 text-sm font-medium'>
                    {`Waiting for ${platformName}…`}
                  </p>
                  <p className='text-muted-foreground mt-1 text-center text-xs'>
                    Complete sign-in in the Composio popup. This dialog will
                    update automatically.
                  </p>
                </div>
              )}

              {phase === "success" && (
                <div className='relative z-10 mt-6 flex flex-col items-center justify-center py-6'>
                  <div className='flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/40'>
                    <CheckCircle2 className='h-7 w-7 text-emerald-500' />
                  </div>
                  <p className='text-foreground mt-4 text-sm font-medium'>
                    {platformName} <LocalizedText text={"connected"} />
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
                  <div className='relative bg-neutral-50 px-3 py-3 text-sm dark:bg-neutral-800'>
                    <GradientFrame />
                    <p className='text-foreground font-medium'>
                      <LocalizedText text={"Connection failed"} />
                    </p>
                    <p className='text-muted-foreground mt-1 text-xs'>
                      {errorMessage}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className='flex flex-col items-stretch justify-between gap-3 border-t border-black/5 bg-black/[0.02] px-4 py-3 sm:flex-row sm:items-center sm:px-6 dark:border-white/10 dark:bg-white/[0.02]'>
              <div className='text-muted-foreground flex min-w-0 items-center gap-1.5 text-[11px]'>
                <ShieldCheck className='h-3.5 w-3.5' />
                <span className='min-w-0'>
                  <LocalizedText text={"Tokens are encrypted at rest."} />
                </span>
              </div>

              {phase === "idle" && (
                <Button
                  type='button'
                  size='sm'
                  onClick={handleConnect}
                  disabled={!isSupported}
                  className='w-full bg-indigo-600 text-white transition-all hover:bg-linear-to-bl sm:w-auto'
                >
                  {isSupported ? (
                    <>
                      Continue
                      <ArrowRight className='ml-1 h-3.5 w-3.5' />
                    </>
                  ) : (
                    <>
                      <Lock className='mr-1 h-3.5 w-3.5' />
                      <LocalizedText text={"Coming soon"} />
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
                    onOpenChange(false);
                  }}
                >
                  <LocalizedText text={"Cancel"} />
                </Button>
              )}

              {phase === "select" && (
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    size='sm'
                    variant='ghost'
                    onClick={() => onOpenChange(false)}
                    disabled={provisionLoading}
                  >
                    <LocalizedText text={"Cancel"} />
                  </Button>
                  <Button
                    type='button'
                    size='sm'
                    onClick={handleProvisionSelected}
                    disabled={provisionLoading || selectedIgIds.size === 0}
                    className='bg-linear-to-r from-fuchsia-500 to-pink-500 text-white'
                  >
                    {provisionLoading ? (
                      <>
                        <LoadingFileLoader size={16} />
                        <LocalizedText text={"Connecting…"} />
                      </>
                    ) : (
                      `Connect ${selectedIgIds.size || ""} ${
                        selectedIgIds.size === 1 ? "account" : "accounts"
                      }`.trim()
                    )}
                  </Button>
                </div>
              )}

              {phase === "success" && (
                <Button
                  type='button'
                  size='sm'
                  onClick={handleDone}
                  className='bg-linear-to-r from-emerald-500 to-teal-500 text-white'
                >
                  <LocalizedText text={"Done"} />
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
                    <LocalizedText text={"Close"} />
                  </Button>
                  <Button
                    type='button'
                    size='sm'
                    onClick={() => {
                      setPhase("idle");
                      handleConnect();
                    }}
                    className='bg-linear-to-r from-cyan-500 to-blue-500 text-white'
                  >
                    <LocalizedText text={"Try again"} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
