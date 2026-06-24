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
  MessengerBrand,
  MicrosoftOutlookBrand,
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
  MoreHorizontal,
} from "lucide-react";
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
      "Hook genit into Microsoft Graph for enterprise email and calendar workflows. ",
    category: "Email Campaigns",
    icon: MicrosoftOutlookBrand,
    baseStatus: "available",
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
    <div className="flex items-center justify-between py-4 group border-b border-zinc-100/40 dark:border-zinc-900/50 last:border-b-0">
      <div className="flex items-center min-w-0 flex-1">
        {/* Brand Icon wrapper */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 flex items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-200/60 dark:bg-zinc-950 dark:border-zinc-800/80 shadow-xs">
          <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-zinc-800 dark:text-zinc-200" />
        </div>

        {/* Text Area */}
        <div className="flex-1 min-w-0 pl-4 pr-3 flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base tracking-tight truncate">
              {integration.name}
            </h3>
            {status === "partial" && (
              <span className="inline-flex items-center text-amber-500" title="Setup incomplete">
                <AlertTriangle className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm line-clamp-2 leading-snug mt-0.5">
            {integration.description}
          </p>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex-shrink-0 ml-3">
        {status === "soon" ? (
          <button
            type="button"
            disabled
            className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900/40 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 rounded-full text-xs font-semibold select-none cursor-not-allowed"
          >
            Soon
          </button>
        ) : status === "connected" || status === "partial" ? (
          <button
            type="button"
            onClick={onManage}
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-all active:scale-95"
            title={`Manage ${integration.name}`}
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800 rounded-full text-xs font-semibold transition-all active:scale-95"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}

export function IntegrationsExplorer() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [connectFor, setConnectFor] = useState<Integration | null>(null);
  const [manageFor, setManageFor] = useState<Integration | null>(null);
  const { byPlatform, identityBySurface } = useIntegrations();

  // Find all active/connected integrations to show in the "Added" bar
  const connectedIntegrations = useMemo(() => {
    return INTEGRATIONS.filter((integration) => {
      const connections = byPlatform.get(integration.platform);
      const hasIdentity = isMetaSurface(integration.platform)
        ? identityBySurface.has(integration.platform)
        : false;
      const status = resolveStatus(integration, connections, hasIdentity);
      return status === "connected" || status === "partial";
    });
  }, [byPlatform, identityBySurface]);

  const categories = useMemo(() => ["All", ...CATEGORY_ORDER], []);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    // First query filter
    let filtered = q
      ? INTEGRATIONS.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.category.toLowerCase().includes(q)
        )
      : INTEGRATIONS;

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
  }, [query, selectedCategory]);

  const manageConnections = manageFor
    ? (byPlatform.get(manageFor.platform) ?? [])
    : [];

  return (
    <>
      {/* "Added" integrations section */}
      {connectedIntegrations.length > 0 && (
        <div className="mb-10">
          <div className="flex justify-between items-baseline mb-4">
            <h3 className="text-zinc-500 dark:text-zinc-400 font-semibold text-xs uppercase tracking-wider">Added</h3>
            <button
              type="button"
              onClick={() => {
                if (connectedIntegrations[0]) {
                  setManageFor(connectedIntegrations[0]);
                }
              }}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            >
              Manage
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {connectedIntegrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <button
                  key={`added-${integration.platform}`}
                  onClick={() => setManageFor(integration)}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 transition-all active:scale-95 shadow-xs"
                  title={`Manage ${integration.name}`}
                >
                  <Icon className="h-6 w-6 text-zinc-800 dark:text-zinc-200" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and filter slider bar */}
      <div className="flex gap-3 mb-8 items-center">
        <div className="relative flex-1">
          <Search className="text-zinc-400 pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search plugins and skills"
            className="w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 pr-4 pl-10 text-sm placeholder:text-zinc-400 text-zinc-900 focus:border-zinc-300 focus:outline-none dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700/80 transition-colors shadow-xs"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setSelectedCategory("All");
          }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50/50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-all active:scale-95 shadow-xs"
          title="Clear search and filters"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="4" y1='21' x2='4' y2='14' />
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
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar scroll-smooth">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const displayLabel = cat === "Ads Campaigns" ? "Ads" : cat === "Email Campaigns" ? "Email" : cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 select-none whitespace-nowrap ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900/60"
              }`}
            >
              {displayLabel}
            </button>
          );
        })}
      </div>

      {grouped.length === 0 ? (
        <div className='py-16 text-center'>
          <p className='text-zinc-500 dark:text-zinc-400 text-sm'>
            No integrations match &ldquo;{query}&rdquo;.
          </p>
        </div>
      ) : (
        <div className='space-y-12'>
          {grouped.map(([category, items]) => (
            <section key={category}>
              <div className='mb-2 border-b border-zinc-100/80 dark:border-zinc-900/80 pb-3'>
                <h3 className='text-zinc-900 dark:text-zinc-100 font-semibold tracking-tight text-sm uppercase tracking-wider'>
                  {category}
                </h3>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1'>
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
