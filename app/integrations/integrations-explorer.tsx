"use client";

import { ConnectDialog } from "./_components/connect-dialog";
import { ManageDialog } from "./_components/manage-dialog";
import {
  BrevoBrand,
  FacebookBrand,
  GmailBrand,
  GoogleCalendarBrand,
  GoogleDocsBrand,
  GoogleDriveBrand,
  GoogleFormsBrand,
  GoogleMeetBrand,
  GoogleSheetsBrand,
  GoogleSlidesBrand,
  InstagramBrand,
  LinkedinBrand,
  MailChimpBrand,
  MessengerBrand,
  MicrosoftOutlookBrand,
  PinterestBrand,
  SlackBrand,
  SnapchatBrand,
  TelegramBrand,
  TikTokBrand,
  WhatsAppBrand,
  XBrand,
  YoutubeBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { LocalizedText } from "@/components/localized-text";
import { useIntegrations, usePipedreamApps } from "@/hooks/use-integrations";
import {
  IntegrationConnection,
  IntegrationPlatform,
  isMetaSurface,
  isNativeOnlyPipedreamApp,
  isNativeOnlyPlatform,
} from "@/lib/integrations-api";
import { GradientFrame } from "@/utils/gradient-frame";
import {
  AlertTriangle,
  ArrowRight,
  AtSign,
  Blocks,
  Calendar,
  CheckCircle2,
  Cog,
  Megaphone,
  MessageSquare,
  MoreHorizontal,
  Search,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type CSSProperties,
  type ComponentType,
  useMemo,
  useState,
} from "react";

export type BaseStatus = "available" | "soon";
// `partial` = the user has authorized Meta (identity row exists) but the
// per-surface provisioning produced zero Integration rows — e.g. they
// granted scopes but have no Facebook Page / no IG Business account /
// no Ad account. The card shows Manage (so they can revoke or retry)
// instead of Connect (which would just hit the same dead-end again).
export type CardStatus = "connected" | "partial" | "available" | "soon";

export type IntegrationIcon = ComponentType<{
  className?: string;
  style?: CSSProperties;
}>;

export type Integration = {
  platform: IntegrationPlatform;
  name: string;
  description: string;
  category: string;
  icon: IntegrationIcon;
  baseStatus: BaseStatus;
  glow: string;
  appSlug?: string;
  remoteIcon?: string;
};

export const INTEGRATIONS: Integration[] = [
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
    description: "Meta Threads is not available through Pipedream yet.",
    category: "Socials",
    icon: AtSign,
    baseStatus: "soon",
    glow: "rgba(244, 244, 245, 0.6)",
  },
  {
    platform: "linkedin",
    name: "LinkedIn",
    description:
      "Post to your profile and company pages. Read comments and track post analytics.",
    category: "Socials",
    icon: LinkedinBrand,
    baseStatus: "available",
    glow: "rgba(14, 165, 233, 0.8)",
  },
  {
    platform: "x",
    name: "X (Twitter)",
    description:
      "Compose tweets and threads. Pull mentions, replies and per-tweet analytics.",
    category: "Socials",
    icon: XBrand,
    baseStatus: "available",
    glow: "rgba(244, 244, 245, 0.7)",
  },
  {
    platform: "tiktok",
    name: "TikTok",
    description:
      "Direct-publish videos, track per-video metrics and read viewer comments.",
    category: "Socials",
    icon: TikTokBrand,
    baseStatus: "available",
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
    baseStatus: "available",
    glow: "rgba(244, 63, 94, 0.8)",
  },
  {
    platform: "snapchat",
    name: "Snapchat Ads",
    description:
      "Manage Snap ad campaigns and read account-level + per-campaign performance stats.",
    category: "Ads Campaigns",
    icon: SnapchatBrand,
    baseStatus: "available",
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
    baseStatus: "available",
    glow: "rgba(250, 204, 21, 0.8)",
  },
  {
    platform: "tiktok_ads",
    name: "TikTok Ads",
    description:
      "List authorized advertiser campaigns and pull TikTok Marketing API reports for any date range.",
    category: "Ads Campaigns",
    icon: TikTokBrand,
    baseStatus: "available",
    glow: "rgba(12, 12, 12, 1)",
  },
  {
    platform: "linkedin_ads",
    name: "LinkedIn Ads",
    description:
      "Target by job, industry and seniority. Drive B2B pipeline with AI-built campaigns.",
    category: "Ads Campaigns",
    icon: LinkedinBrand,
    baseStatus: "available",
    glow: "rgba(14, 165, 233, 0.8)",
  },
  {
    platform: "x_ads",
    name: "X Ads",
    description:
      "Run promoted posts and trend takeovers with autonomous creative iteration.",
    category: "Ads Campaigns",
    icon: XBrand,
    baseStatus: "available",
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
    baseStatus: "available",
    glow: "rgba(14, 165, 233, 0.8)",
  },
  {
    platform: "mailchimp",
    name: "Mailchimp",
    description:
      "Build newsletters and automation. Generate drip sequences from a single prompt.",
    category: "Email Campaigns",
    icon: MailChimpBrand,
    baseStatus: "available",
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
    name: "Telegram Business",
    description:
      "Manage customer chats from your Telegram Business account with an authorized AI or human agent.",
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
  {
    platform: "google_meet",
    name: "Google Meet",
    description:
      "Schedule, manage and launch video meetings directly. Auto-generate calendar invites and link details.",
    category: "Productivity",
    icon: GoogleMeetBrand,
    baseStatus: "available",
    glow: "rgba(52, 168, 83, 0.8)",
  },
  {
    platform: "google_sheets",
    name: "Google Sheets",
    description:
      "Create, edit and read spreadsheets. Sync contacts, track campaign performance data or log items automatically.",
    category: "Productivity",
    icon: GoogleSheetsBrand,
    baseStatus: "available",
    glow: "rgba(15, 157, 88, 0.8)",
  },
  {
    platform: "google_slides",
    name: "Google Slides",
    description:
      "Generate presentations, modify decks and export layouts with structured design templates.",
    category: "Productivity",
    icon: GoogleSlidesBrand,
    baseStatus: "available",
    glow: "rgba(244, 180, 0, 0.8)",
  },
  {
    platform: "google_docs",
    name: "Google Docs",
    description:
      "Create and edit text documents. Export copy, write blog posts or compile summaries directly.",
    category: "Productivity",
    icon: GoogleDocsBrand,
    baseStatus: "available",
    glow: "rgba(66, 133, 244, 0.8)",
  },
  {
    platform: "google_forms",
    name: "Google Forms",
    description:
      "Create forms, surveys and quizzes. Collect responses and automate workflows from your AI agent.",
    category: "Productivity",
    icon: GoogleFormsBrand,
    baseStatus: "available",
    glow: "rgba(103, 58, 183, 0.8)",
  },
  {
    platform: "pipedream",
    appSlug: "slack",
    name: "Slack",
    description:
      "Read channels, send messages, create reminders and let Genit act in your workspace.",
    category: "Productivity",
    icon: SlackBrand,
    baseStatus: "available",
    glow: "rgba(99, 102, 241, 0.8)",
  },
];

const CATEGORY_ORDER = [
  "Socials",
  "Ads Campaigns",
  "Email Campaigns",
  "Messaging",
  "Productivity",
  "More Plugins",
];

export function resolveStatus(
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

export function connectionsForIntegration(
  integration: Integration,
  byPlatform: Map<IntegrationPlatform, IntegrationConnection[]>
): IntegrationConnection[] {
  const connections = byPlatform.get(integration.platform) ?? [];
  if (integration.appSlug) {
    return connections.filter(
      (connection) => connection.metadata?.appSlug === integration.appSlug
    );
  }
  if (isNativeOnlyPlatform(integration.platform)) return connections;
  const managed = (byPlatform.get("pipedream") ?? []).filter(
    (connection) => connection.metadata?.nativePlatform === integration.platform
  );
  return [...connections, ...managed];
}

function IntegrationCard({
  integration,
  status,
  onConnect,
  onManage,
}: {
  integration: Integration;
  status: CardStatus;
  onConnect: () => void;
  onManage: () => void;
}) {
  const Icon = integration.icon;
  return (
    <div className='group flex items-center justify-between border-b border-zinc-100/40 py-4 last:border-b-0 dark:border-zinc-900/50'>
      <div className='flex min-w-0 flex-1 items-center'>
        {/* Brand Icon wrapper */}
        <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-zinc-200/60 bg-zinc-50 shadow-xs sm:h-14 sm:w-14 dark:border-zinc-800/80 dark:bg-zinc-950'>
          {integration.remoteIcon ? (
            <img
              src={integration.remoteIcon}
              alt=''
              className='h-7 w-7 rounded object-contain'
            />
          ) : (
            <Icon className='h-6 w-6 text-zinc-800 sm:h-7 sm:w-7 dark:text-zinc-200' />
          )}
        </div>

        {/* Text Area */}
        <div className='flex min-w-0 flex-1 flex-col justify-center pr-3 pl-4'>
          <div className='flex items-center gap-1.5'>
            <h3 className='truncate text-sm font-semibold tracking-tight text-zinc-900 sm:text-base dark:text-zinc-100'>
              {integration.name}
            </h3>
            {status === "partial" && (
              <span
                className='inline-flex items-center text-amber-500'
                title='Setup incomplete'
              >
                <AlertTriangle className='h-3.5 w-3.5' />
              </span>
            )}
          </div>
          <p className='mt-0.5 line-clamp-2 text-xs leading-snug text-zinc-500 sm:text-sm dark:text-zinc-400'>
            {integration.description}
          </p>
        </div>
      </div>

      {/* Action Area */}
      <div className='ml-3 flex-shrink-0'>
        {status === "soon" ? (
          <button
            type='button'
            disabled
            className='cursor-not-allowed rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-400 select-none dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-500'
          >
            <LocalizedText text={"Soon"} />
          </button>
        ) : status === "connected" || status === "partial" ? (
          <button
            type='button'
            onClick={onManage}
            className='rounded-full p-2 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-900 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200'
            title={`Manage ${integration.name}`}
          >
            <MoreHorizontal className='h-5 w-5' />
          </button>
        ) : (
          <button
            type='button'
            onClick={onConnect}
            className='rounded-full border border-zinc-200/80 bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-900 transition-all hover:bg-zinc-200 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-800'
          >
            <LocalizedText text={"Add"} />
          </button>
        )}
      </div>
    </div>
  );
}

export function IntegrationsExplorer({
  publicView = false,
}: {
  publicView?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [connectFor, setConnectFor] = useState<Integration | null>(null);
  const [manageFor, setManageFor] = useState<Integration | null>(null);
  const { byPlatform, identityBySurface, integrations } = useIntegrations();
  const normalizedQuery = query.trim();
  const { data: discoveredApps = [] } = usePipedreamApps(
    publicView ? "" : normalizedQuery
  );

  const catalog = useMemo(() => {
    const items = [...INTEGRATIONS];
    const known = new Set(items.map((item) => item.appSlug).filter(Boolean));
    for (const connection of integrations) {
      if (connection.platform !== "pipedream") continue;
      const slug = String(connection.metadata?.appSlug || "");
      if (!slug || known.has(slug)) continue;
      known.add(slug);
      const nativePlatform = connection.metadata?.nativePlatform;
      if (
        nativePlatform &&
        items.some((item) => item.platform === nativePlatform)
      )
        continue;
      items.push({
        platform: "pipedream",
        appSlug: slug,
        name: String(connection.metadata?.appName || slug),
        description: `Use ${connection.metadata?.appName || slug} actions from your Genit agent.`,
        category: "More Plugins",
        icon: Blocks,
        remoteIcon: connection.accountAvatar,
        baseStatus: "available",
        glow: "rgba(99, 102, 241, 0.7)",
      });
    }
    for (const app of discoveredApps) {
      if (known.has(app.name_slug) || isNativeOnlyPipedreamApp(app.name_slug))
        continue;
      known.add(app.name_slug);
      items.push({
        platform: "pipedream",
        appSlug: app.name_slug,
        name: app.name,
        description:
          app.description ||
          `Connect ${app.name} and use its actions from Genit.`,
        category: "More Plugins",
        icon: Blocks,
        remoteIcon: app.img_src,
        baseStatus: "available",
        glow: "rgba(99, 102, 241, 0.7)",
      });
    }
    return items;
  }, [discoveredApps, integrations]);

  // Find all active/connected integrations to show in the "Added" bar
  const connectedIntegrations = useMemo(() => {
    return catalog.filter((integration) => {
      const connections = connectionsForIntegration(integration, byPlatform);
      const hasIdentity = isMetaSurface(integration.platform)
        ? identityBySurface.has(integration.platform)
        : false;
      const status = resolveStatus(integration, connections, hasIdentity);
      return status === "connected" || status === "partial";
    });
  }, [byPlatform, identityBySurface, catalog]);

  const categories = useMemo(() => ["All", ...CATEGORY_ORDER], []);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();

    // First query filter
    let filtered = q
      ? catalog.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.category.toLowerCase().includes(q)
        )
      : catalog;

    // Second category tab filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((i) => i.category === selectedCategory);
    }

    const byCategory = new Map<string, Integration[]>();
    for (const item of filtered) {
      const list = byCategory.get(item.category) ?? [];
      list.push(item);
      byCategory.set(item.category, list);
    }

    return CATEGORY_ORDER.filter((c) => byCategory.has(c)).map(
      (c) => [c, byCategory.get(c) as Integration[]] as const
    );
  }, [query, selectedCategory, catalog]);

  const manageConnections = manageFor
    ? connectionsForIntegration(manageFor, byPlatform)
    : [];

  return (
    <>
      {/* "Added" plugins section */}
      {connectedIntegrations.length > 0 && (
        <div className='mb-10'>
          <div className='mb-4 flex items-baseline justify-between'>
            <h3 className='text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400'>
              <LocalizedText text={"Added"} />
            </h3>
            <button
              type='button'
              onClick={() => {
                if (connectedIntegrations[0]) {
                  setManageFor(connectedIntegrations[0]);
                }
              }}
              className='text-xs text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'
            >
              <LocalizedText text={"Manage"} />
            </button>
          </div>
          <div className='flex flex-wrap gap-3'>
            {connectedIntegrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <button
                  key={`added-${integration.platform}-${integration.appSlug || integration.name}`}
                  onClick={() => setManageFor(integration)}
                  className='flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-200/60 bg-zinc-50 shadow-xs transition-all hover:bg-zinc-100 active:scale-95 dark:border-zinc-800/80 dark:bg-zinc-950 dark:hover:bg-zinc-900'
                  title={`Manage ${integration.name}`}
                >
                  {integration.remoteIcon ? (
                    <img
                      src={integration.remoteIcon}
                      alt=''
                      className='h-6 w-6 rounded object-contain'
                    />
                  ) : (
                    <Icon className='h-6 w-6 text-zinc-800 dark:text-zinc-200' />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and filter slider bar */}
      <div className='mb-8 flex items-center gap-3'>
        <div className='relative flex-1'>
          <Search className='pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400' />
          <input
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search plugins and skills'
            className='w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 pr-4 pl-10 text-sm text-zinc-900 shadow-xs transition-colors placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700/80'
          />
        </div>
        <button
          type='button'
          onClick={() => {
            setQuery("");
            setSelectedCategory("All");
          }}
          className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50/50 text-zinc-500 shadow-xs transition-all hover:bg-zinc-100 hover:text-zinc-800 active:scale-95 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
          title='Clear search and filters'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-4 w-4'
          >
            <line x1='4' y1='21' x2='4' y2='14' />
            <line x1='4' y1='10' x2='4' y2='3' />
            <line x1='12' y1='21' x2='12' y2='12' />
            <line x1='12' y1='8' x2='12' y2='3' />
            <line x1='20' y1='21' x2='20' y2='16' />
            <line x1='20' y1='12' x2='20' y2='3' />
            <line x1='1' y1='14' x2='7' y2='14' />
            <line x1='9' y1='8' x2='15' y2='8' />
            <line x1='17' y1='16' x2='23' y2='16' />
          </svg>
        </button>
      </div>

      {/* Categories Tabs Bar */}
      <div className='no-scrollbar mb-8 flex gap-2 overflow-x-auto scroll-smooth pb-2'>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const displayLabel =
            cat === "Ads Campaigns"
              ? "Ads"
              : cat === "Email Campaigns"
                ? "Email"
                : cat;
          return (
            <button
              key={cat}
              type='button'
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-200 select-none sm:text-sm ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200"
              }`}
            >
              {displayLabel}
            </button>
          );
        })}
      </div>

      {grouped.length === 0 ? (
        <div className='py-16 text-center'>
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>
            <LocalizedText text={"No plugins match &ldquo;"} />
            {query}
            <LocalizedText text={"&rdquo;."} />
          </p>
        </div>
      ) : (
        <div className='space-y-12'>
          {grouped.map(([category, items]) => (
            <section key={category}>
              <div className='mb-2 border-b border-zinc-100/80 pb-3 dark:border-zinc-900/80'>
                <h3 className='text-sm font-semibold tracking-tight tracking-wider text-zinc-900 uppercase dark:text-zinc-100'>
                  {category}
                </h3>
              </div>
              <div className='grid grid-cols-1 gap-x-12 gap-y-1 md:grid-cols-2'>
                {items.map((integration) => {
                  const connections = connectionsForIntegration(
                    integration,
                    byPlatform
                  );
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
                      key={`${integration.platform}-${integration.appSlug || integration.name}`}
                      integration={integration}
                      status={status}
                      onConnect={() =>
                        publicView
                          ? router.push("/signin?redirect=/plugins")
                          : setConnectFor(integration)
                      }
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
        appSlug={connectFor?.appSlug}
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
