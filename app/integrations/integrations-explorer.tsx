"use client";

import { ConnectDialog } from "./_components/connect-dialog";
import { ManageDialog } from "./_components/manage-dialog";
import {
  BrevoBrand,
  FacebookBrand,
  GmailBrand,
  GoogleCalendarBrand,
  GoogleDriveBrand,
  InstagramBrand,
  LinkedinBrand,
  MicrosoftOutlookBrand,
  MessengerBrand,
  PinterestBrand,
  SnapchatBrand,
  TelegramBrand,
  TikTokBrand,
  WhatsAppBrand,
  XBrand,
  YoutubeBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { useIntegrations } from "@/hooks/use-integrations";
import {
  IntegrationConnection,
  IntegrationPlatform,
  isMetaSurface,
} from "@/lib/integrations-api";
import { GradientFrame } from "@/utils/gradient-frame";
import {
  AlertTriangle,
  ArrowRight,
  AtSign,
  Calendar,
  CheckCircle2,
  Cog,
  Megaphone,
  Search,
  TrendingUp,
} from "lucide-react";
import {
  type CSSProperties,
  type ComponentType,
  useMemo,
  useState,
} from "react";

type BaseStatus = "available" | "soon";
// `partial` = the user has authorized Meta (identity row exists) but the
// per-surface provisioning produced zero Integration rows — e.g. they
// granted scopes but have no Facebook Page / no IG Business account /
// no Ad account. The card shows Manage (so they can revoke or retry)
// instead of Connect (which would just hit the same dead-end again).
type CardStatus = "connected" | "partial" | "available" | "soon";

type IntegrationIcon = ComponentType<{
  className?: string;
  style?: CSSProperties;
}>;

type Integration = {
  platform: IntegrationPlatform;
  name: string;
  description: string;
  category: string;
  icon: IntegrationIcon;
  baseStatus: BaseStatus;
  glow: string;
};

const INTEGRATIONS: Integration[] = [
  {
    platform: "facebook",
    name: "Facebook",
    description:
      "Publish posts, reels and stories. Manage comments and Page DMs from your AI agent.",
    category: "Socials",
    icon: FacebookBrand,
    baseStatus: "available",
    glow: "rgba(59, 130, 246, 0.8)",
  },
  {
    platform: "instagram",
    name: "Instagram",
    description:
      "Schedule reels, carousels and stories. Pull insights and reply to DMs automatically.",
    category: "Socials",
    icon: InstagramBrand,
    baseStatus: "available",
    glow: "rgba(236, 72, 153, 0.8)",
  },
  {
    platform: "threads",
    name: "Threads",
    description:
      "Publish threads, replies and quotes. Track conversation reach in real time.",
    category: "Socials",
    icon: AtSign,
    baseStatus: "available",
    glow: "rgba(244, 244, 245, 0.6)",
  },
  {
    platform: "linkedin",
    name: "LinkedIn",
    description:
      "Post to your profile and company pages. Read comments and track post analytics.",
    category: "Socials",
    icon: LinkedinBrand,
    baseStatus: "soon",
    glow: "rgba(14, 165, 233, 0.8)",
  },
  {
    platform: "x",
    name: "X (Twitter)",
    description:
      "Compose tweets and threads. Pull mentions, replies and per-tweet analytics.",
    category: "Socials",
    icon: XBrand,
    baseStatus: "soon",
    glow: "rgba(244, 244, 245, 0.7)",
  },
  {
    platform: "tiktok",
    name: "TikTok",
    description:
      "Direct-publish videos, track per-video metrics and read viewer comments.",
    category: "Socials",
    icon: TikTokBrand,
    baseStatus: "soon",
    glow: "rgba(12, 12, 12, 1)",
  },
  {
    platform: "youtube",
    name: "YouTube",
    description:
      "Resumable video uploads, comment moderation and channel + per-video analytics.",
    category: "Socials",
    icon: YoutubeBrand,
    baseStatus: "available",
    glow: "rgba(239, 68, 68, 0.8)",
  },
  {
    platform: "pinterest",
    name: "Pinterest",
    description:
      "Create pins on your boards, list recent pins and pull per-pin + account analytics.",
    category: "Socials",
    icon: PinterestBrand,
    baseStatus: "soon",
    glow: "rgba(244, 63, 94, 0.8)",
  },
  {
    platform: "snapchat",
    name: "Snapchat Ads",
    description:
      "Manage Snap ad campaigns and read account-level + per-campaign performance stats.",
    category: "Ads Campaigns",
    icon: SnapchatBrand,
    baseStatus: "soon",
    glow: "rgba(250, 204, 21, 0.8)",
  },
  {
    platform: "meta_ads",
    name: "Meta Ads",
    description:
      "Spin up campaigns, ad sets and creatives. Let agents optimize budgets across Meta.",
    category: "Ads Campaigns",
    icon: FacebookBrand,
    baseStatus: "available",
    glow: "rgba(59, 130, 246, 0.8)",
  },
  {
    platform: "google_ads",
    name: "Google Ads",
    description:
      "List Google Ads campaigns across your manager + child accounts and pull per-day performance metrics.",
    category: "Ads Campaigns",
    icon: TrendingUp,
    baseStatus: "soon",
    glow: "rgba(250, 204, 21, 0.8)",
  },
  {
    platform: "tiktok_ads",
    name: "TikTok Ads",
    description:
      "List authorized advertiser campaigns and pull TikTok Marketing API reports for any date range.",
    category: "Ads Campaigns",
    icon: TikTokBrand,
    baseStatus: "soon",
    glow: "rgba(12, 12, 12, 1)",
  },
  {
    platform: "linkedin_ads",
    name: "LinkedIn Ads",
    description:
      "Target by job, industry and seniority. Drive B2B pipeline with AI-built campaigns.",
    category: "Ads Campaigns",
    icon: LinkedinBrand,
    baseStatus: "soon",
    glow: "rgba(14, 165, 233, 0.8)",
  },
  {
    platform: "x_ads",
    name: "X Ads",
    description:
      "Run promoted posts and trend takeovers with autonomous creative iteration.",
    category: "Ads Campaigns",
    icon: XBrand,
    baseStatus: "soon",
    glow: "rgba(244, 244, 245, 0.6)",
  },
  {
    platform: "gmail",
    name: "Gmail",
    description:
      "Send broadcasts and replies. AI drafts responses from your brand voice memory.",
    category: "Email Campaigns",
    icon: GmailBrand,
    baseStatus: "available",
    glow: "rgba(239, 68, 68, 0.8)",
  },
  {
    platform: "outlook",
    name: "Outlook",
    description:
      "Hook genit into Microsoft Graph for enterprise email and calendar workflows.",
    category: "Email Campaigns",
    icon: MicrosoftOutlookBrand,
    baseStatus: "soon",
    glow: "rgba(14, 165, 233, 0.8)",
  },
  {
    platform: "mailchimp",
    name: "Mailchimp",
    description:
      "Build newsletters and automations. Generate drip sequences from a single prompt.",
    category: "Email Campaigns",
    icon: Megaphone,
    baseStatus: "soon",
    glow: "rgba(250, 204, 21, 0.8)",
  },
  {
    platform: "brevo",
    name: "Brevo",
    description:
      "Send transactional email, sync contacts and pull aggregated delivery + open + click stats.",
    category: "Email Campaigns",
    icon: BrevoBrand,
    baseStatus: "available",
    glow: "rgba(34, 197, 94, 0.8)",
  },
  {
    platform: "whatsapp",
    name: "WhatsApp Business",
    description:
      "Run AI customer chats, broadcast campaigns and reply automatically at scale.",
    category: "Messaging",
    icon: WhatsAppBrand,
    baseStatus: "available",
    glow: "rgba(34, 197, 94, 0.8)",
  },
  {
    platform: "messenger",
    name: "Messenger",
    description:
      "Automate Messenger replies, handle DMs, and build chat workflows from your AI agent.",
    category: "Messaging",
    icon: MessengerBrand,
    baseStatus: "available",
    glow: "rgba(10, 124, 255, 0.8)",
  },
  {
    platform: "telegram",
    name: "Telegram",
    description:
      "Deploy bots, broadcast updates and engage community channels conversationally.",
    category: "Messaging",
    icon: TelegramBrand,
    baseStatus: "available",
    glow: "rgba(14, 165, 233, 0.8)",
  },
  {
    platform: "google_calendar",
    name: "Google Calendar",
    description:
      "List and create events on your Google calendars. Let agents schedule meetings and read upcoming events.",
    category: "Productivity",
    icon: GoogleCalendarBrand,
    baseStatus: "available",
    glow: "rgba(59, 130, 246, 0.8)",
  },
  {
    platform: "google_drive",
    name: "Google Drive",
    description:
      "Browse, upload and share files on your Drive. Let agents fetch assets and save generated content into folders.",
    category: "Productivity",
    icon: GoogleDriveBrand,
    baseStatus: "available",
    glow: "rgba(34, 197, 94, 0.8)",
  },
];

const CATEGORY_ORDER = [
  "Socials",
  "Ads Campaigns",
  "Email Campaigns",
  "Messaging",
  "Productivity",
];

function resolveStatus(
  integration: Integration,
  connections: IntegrationConnection[] | undefined,
  hasIdentityForSurface: boolean
): CardStatus {
  if (connections && connections.some((c) => c.status === "active"))
    return "connected";
  // Meta surface with a stored identity for THIS specific surface but no
  // provisioned targets — user authorized FB/IG/Ads/WhatsApp but no Pages /
  // IG accounts / Ad accounts / WA numbers were available. Let them open
  // Manage to revoke the identity or try again after fixing their Meta
  // setup. Each surface checks its own identity independently now.
  if (hasIdentityForSurface && isMetaSurface(integration.platform))
    return "partial";
  // Drive the connect button purely off the explorer's `baseStatus`. This
  // way a platform's card stays disabled until the operator has set the
  // backend env vars and flipped it to "available" here, even if the
  // controllers / routes ship.
  return integration.baseStatus;
}

function ConnectButton({
  status,
  name,
  onConnect,
  onManage,
}: {
  status: CardStatus;
  name: string;
  onConnect: () => void;
  onManage: () => void;
}) {
  if (status === "connected") {
    return (
      <button
        type='button'
        aria-label={`Manage ${name} connection`}
        onClick={onManage}
        className='inline-flex items-center gap-1 rounded-md bg-linear-to-r from-emerald-500 to-teal-500 px-2.5 py-1 text-xs font-medium text-white transition-all hover:bg-linear-to-bl focus:ring-4 focus:ring-emerald-300 focus:outline-none dark:focus:ring-emerald-800'
      >
  <Cog className="size-4" />
        Manage
      </button>
    );
  }
  if (status === "partial") {
    return (
      <button
        type='button'
        aria-label={`Manage ${name} Meta access`}
        onClick={onManage}
        className='inline-flex items-center gap-1 rounded-md bg-linear-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-xs font-medium text-white transition-all hover:bg-linear-to-bl focus:ring-4 focus:ring-amber-300 focus:outline-none dark:focus:ring-amber-800'
      >
              <Cog className="size-4" />
        Manage
      </button>
    );
  }
  const isSoon = status === "soon";
  return (
    <button
      type='button'
      disabled={isSoon}
      aria-label={isSoon ? `${name} is coming soon` : `Connect ${name}`}
      title={isSoon ? `${name} is coming soon` : undefined}
      onClick={isSoon ? undefined : onConnect}
      className={
        isSoon
          ? "border-border bg-card/40 text-muted-foreground inline-flex cursor-not-allowed items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium opacity-60 dark:border-white/5 dark:bg-white/[0.02] dark:text-zinc-500"
          : "inline-flex items-center gap-1 rounded-md bg-linear-to-r from-cyan-500 to-blue-500 px-2.5 py-1 text-xs font-medium text-white transition-all hover:bg-linear-to-bl focus:ring-4 focus:ring-cyan-300 focus:outline-none dark:focus:ring-cyan-800"
      }
    >
      Connect
      <ArrowRight className='h-3 w-3' />
    </button>
  );
}

function StatusBadge({
  status,
  count,
}: {
  status: CardStatus;
  count?: number;
}) {
  if (status === "connected") {
    return (
      <span className='inline-flex items-center gap-1.5 rounded-md bg-background px-2 py-1 text-xs text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-300 '>
        <CheckCircle2 className='h-3 w-3' />
        {count && count > 1 ? `Connected · ${count}` : "Connected"}
      </span>
    );
  }
  if (status === "partial") {
    return (
      <span className='inline-flex items-center gap-1.5 rounded-md bg-background px-2 py-1 text-xs text-zinc-700 ring-1 ring-zinc-500/20 dark:text-zinc-300 dark:ring-zinc-400/20'>
        <AlertTriangle className='h-3 w-3' />
        Needs setup
      </span>
    );
  }
  if (status === "soon") {
    return (
      <span className='inline-flex items-center gap-1.5 rounded-md bg-background px-2 py-1 text-xs text-zinc-700 ring-1 ring-zinc-500/20 dark:text-zinc-300 dark:ring-zinc-400/20'>
        Coming soon
      </span>
    );
  }
  return (
    <span className='inline-flex items-center gap-1.5 rounded-md bg-background px-2 py-1 text-xs text-zinc-700 ring-1 ring-zinc-500/20 dark:text-zinc-300 dark:ring-zinc-400/20'>
      Available
    </span>
  );
}

function IntegrationCard({
  integration,
  status,
  connectionCount,
  onConnect,
  onManage,
}: {
  integration: Integration;
  status: CardStatus;
  connectionCount: number;
  onConnect: () => void;
  onManage: () => void;
}) {
  const Icon = integration.icon;
  return (
    <div className='integration-card relative z-10 rounded-md p-px [background:radial-gradient(circle_230px_at_0%_0%,rgba(0,0,0,0.08),#ffffff)] dark:[background:radial-gradient(circle_230px_at_0%_0%,rgba(113,113,122,0.4),#0c0d0d)]'>
      <div
        className='animated-dot absolute z-2 h-[5px] w-[5px] rounded-full bg-zinc-500 dark:bg-zinc-400'
        style={{
          boxShadow: `${integration.glow} 0px 0px 10px`,
          right: "10%",
          top: "10%",
          animation: "6s linear 0s infinite normal none paused moveDot",
        }}
      />
      <div className='group border-border relative z-1 h-full rounded-md border bg-white px-9 py-7 backdrop-blur transition-all duration-300 [background:radial-gradient(circle_280px_at_0%_0%,rgba(0,0,0,0.04),#ffffff)] hover:[background:radial-gradient(circle_280px_at_0%_0%,rgba(0,0,0,0.06),#ffffff)] dark:border-[#202222] dark:bg-white/5 dark:[background:radial-gradient(circle_280px_at_0%_0%,rgba(68,68,68,0.3),#0c0d0d)] dark:hover:bg-white/10'>
        <div
          className='absolute top-0 left-0 z-10 h-[45px] w-[220px] rounded-full opacity-30 blur-[10px] dark:opacity-40'
          style={{
            backgroundColor: "rgba(113, 113, 122, 0.3)",
            boxShadow: "0 0 50px rgba(113, 113, 122, 0.5)",
            transform: "rotate(40deg)",
            transformOrigin: "10%",
          }}
        />
        <div className='relative z-10 flex items-start justify-between'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl'>
            <Icon className='h-6 w-6 text-slate-700 dark:text-slate-300' />
          </div>
          <StatusBadge status={status} count={connectionCount} />
        </div>
        <h3 className='text-foreground relative z-10 mt-4 text-lg font-semibold tracking-tight'>
          {integration.name}
        </h3>
        <p className='text-muted-foreground relative z-10 mt-1 text-sm'>
          {integration.description}
        </p>
        <div className='relative z-10 mt-4 flex items-center justify-between gap-2'>
          <span className='border-border bg-card/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs ring-1 ring-transparent dark:border-transparent dark:bg-white/5 dark:text-zinc-400 dark:ring-white/10'>
            {integration.category}
          </span>
          <ConnectButton
            status={status}
            name={integration.name}
            onConnect={onConnect}
            onManage={onManage}
          />
        </div>
        <GradientFrame />
      </div>
    </div>
  );
}

export function IntegrationsExplorer() {
  const [query, setQuery] = useState("");
  const [connectFor, setConnectFor] = useState<Integration | null>(null);
  const [manageFor, setManageFor] = useState<Integration | null>(null);
  const { byPlatform, identityBySurface } = useIntegrations();

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? INTEGRATIONS.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.category.toLowerCase().includes(q)
        )
      : INTEGRATIONS;

    const byCategory = new Map<string, Integration[]>();
    for (const item of filtered) {
      const list = byCategory.get(item.category) ?? [];
      list.push(item);
      byCategory.set(item.category, list);
    }

    return CATEGORY_ORDER.filter((c) => byCategory.has(c)).map(
      (c) => [c, byCategory.get(c) as Integration[]] as const
    );
  }, [query]);

  const manageConnections = manageFor
    ? (byPlatform.get(manageFor.platform) ?? [])
    : [];

  return (
    <>
      <div className='mx-auto mb-12 max-w-md'>
        <div className='relative'>
          <Search className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <input
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search integrations...'
            className='border-border bg-card/60 text-foreground placeholder:text-muted-foreground w-full rounded-lg border py-2.5 pr-4 pl-10 text-sm backdrop-blur transition focus:ring-1 focus:ring-violet-500/40 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/20'
          />
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className='py-16 text-center'>
          <p className='text-muted-foreground text-sm'>
            No integrations match &ldquo;{query}&rdquo;.
          </p>
        </div>
      ) : (
        <div className='space-y-16'>
          {grouped.map(([category, items]) => (
            <section key={category}>
              <div className='mb-6 flex items-baseline gap-3'>
                <h3 className='text-foreground text-xl font-semibold tracking-tight'>
                  {category}
                </h3>
                <span className='text-muted-foreground text-xs'>
                  {items.length}{" "}
                  {items.length === 1 ? "integration" : "integrations"}
                </span>
              </div>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {items.map((integration) => {
                  const connections = byPlatform.get(integration.platform);
                  const hasIdentityForSurface = isMetaSurface(
                    integration.platform
                  )
                    ? identityBySurface.has(integration.platform)
                    : false;
                  const status = resolveStatus(
                    integration,
                    connections,
                    hasIdentityForSurface
                  );
                  return (
                    <IntegrationCard
                      key={integration.name}
                      integration={integration}
                      status={status}
                      connectionCount={connections?.length ?? 0}
                      onConnect={() => setConnectFor(integration)}
                      onManage={() => setManageFor(integration)}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <ConnectDialog
        open={Boolean(connectFor)}
        onOpenChange={(o) => !o && setConnectFor(null)}
        platform={connectFor?.platform ?? null}
        platformName={connectFor?.name ?? ""}
        platformDescription={connectFor?.description ?? ""}
        Icon={connectFor?.icon ?? (() => null)}
        glow={connectFor?.glow ?? "rgba(113,113,122,0.4)"}
      />

      <ManageDialog
        open={Boolean(manageFor)}
        onOpenChange={(o) => !o && setManageFor(null)}
        connections={manageConnections}
        platform={manageFor?.platform ?? null}
        platformName={manageFor?.name ?? ""}
        Icon={manageFor?.icon ?? (() => null)}
        glow={manageFor?.glow ?? "rgba(113,113,122,0.4)"}
      />
    </>
  );
}
