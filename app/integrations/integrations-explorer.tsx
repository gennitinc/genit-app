"use client";

import { BrevoBrand, FacebookBrand, GmailBrand, InstagramBrand, LinkedinBrand, MicrosoftOutlookBrand, PinterestBrand, SnapchatBrand, TelegramBrand, TikTokBrand, WhatsAppBrand, XBrand, YoutubeBrand } from "@/app/(auth)/onboarding/_components/social-icons";
import { useIntegrations } from "@/hooks/use-integrations";
import {
  IntegrationConnection,
  IntegrationPlatform,
  isPlatformSupported,
} from "@/lib/integrations-api";
import { ArrowRight, AtSign, CheckCircle2, Megaphone, Search, TrendingUp } from "lucide-react";
import { type CSSProperties, type ComponentType, useMemo, useState } from "react";
import { ConnectDialog } from "./_components/connect-dialog";
import { ManageDialog } from "./_components/manage-dialog";

type BaseStatus = "available" | "soon";
type CardStatus = "connected" | "available" | "soon";

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
    baseStatus: "soon",
    glow: "rgba(244, 244, 245, 0.6)",
  },
  {
    platform: "linkedin",
    name: "LinkedIn",
    description:
      "Post to company pages, publish articles and capture leads from your campaigns.",
    category: "Socials",
    icon: LinkedinBrand,
    baseStatus: "soon",
    glow: "rgba(14, 165, 233, 0.8)",
  },
  {
    platform: "x",
    name: "X (Twitter)",
    description:
      "Compose tweets, threads and media posts. Track replies and surface viral moments.",
    category: "Socials",
    icon: XBrand,
    baseStatus: "soon",
    glow: "rgba(244, 244, 245, 0.7)",
  },
  {
    platform: "tiktok",
    name: "TikTok",
    description:
      "Publish videos, sync creator analytics and grow audiences through trending sounds.",
    category: "Socials",
    icon: TikTokBrand,
    baseStatus: "soon",
    glow: "rgba(12, 12, 12, 1)",
  },
  {
    platform: "youtube",
    name: "YouTube",
    description:
      "Upload videos and shorts, manage thumbnails and respond to comments at scale.",
    category: "Socials",
    icon: YoutubeBrand,
    baseStatus: "soon",
    glow: "rgba(239, 68, 68, 0.8)",
  },
  {
    platform: "pinterest",
    name: "Pinterest",
    description:
      "Publish pins, run shopping ads and surface trend insights for your audience.",
    category: "Socials",
    icon: PinterestBrand,
    baseStatus: "soon",
    glow: "rgba(244, 63, 94, 0.8)",
  },
  {
    platform: "snapchat",
    name: "Snapchat",
    description:
      "Reach Gen Z with story posts and Snap ads, all from one creative pipeline.",
    category: "Socials",
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
    baseStatus: "soon",
    glow: "rgba(59, 130, 246, 0.8)",
  },
  {
    platform: "google_ads",
    name: "Google Ads",
    description:
      "Launch search, YouTube and display ads. Auto-tune bids based on conversion signals.",
    category: "Ads Campaigns",
    icon: TrendingUp,
    baseStatus: "soon",
    glow: "rgba(250, 204, 21, 0.8)",
  },
  {
    platform: "tiktok_ads",
    name: "TikTok Ads",
    description:
      "Promote videos, build look-alike audiences and track creator ad performance.",
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
    baseStatus: "soon",
    glow: "rgba(239, 68, 68, 0.8)",
  },
  {
    platform: "outlook",
    name: "Outlook",
    description:
      "Hook Gennit into Microsoft Graph for enterprise email and calendar workflows.",
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
      "Run transactional and marketing email together — handed to agents to A/B test.",
    category: "Email Campaigns",
    icon: BrevoBrand,
    baseStatus: "soon",
    glow: "rgba(34, 197, 94, 0.8)",
  },
  {
    platform: "whatsapp",
    name: "WhatsApp Business",
    description:
      "Run AI customer chats, broadcast campaigns and reply automatically at scale.",
    category: "Messaging",
    icon: WhatsAppBrand,
    baseStatus: "soon",
    glow: "rgba(34, 197, 94, 0.8)",
  },
  {
    platform: "telegram",
    name: "Telegram",
    description:
      "Deploy bots, broadcast updates and engage community channels conversationally.",
    category: "Messaging",
    icon: TelegramBrand,
    baseStatus: "soon",
    glow: "rgba(14, 165, 233, 0.8)",
  },
];

const CATEGORY_ORDER = [
  "Socials",
  "Ads Campaigns",
  "Email Campaigns",
  "Messaging",
];

function resolveStatus(
  integration: Integration,
  connection?: IntegrationConnection
): CardStatus {
  if (connection && connection.status === "active") return "connected";
  // Allow already-supported platforms even if the user hasn't connected yet.
  if (isPlatformSupported(integration.platform)) return "available";
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
        Manage
      </button>
    );
  }
  if (status === "soon") {
    return (
      <button
        type='button'
        disabled
        aria-label={`${name} is coming soon`}
        className='border-border bg-card/40 text-muted-foreground inline-flex cursor-not-allowed items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium dark:border-white/5 dark:bg-white/[0.02] dark:text-zinc-500'
      >
        Coming soon
      </button>
    );
  }
  return (
    <button
      type='button'
      aria-label={`Connect ${name}`}
      onClick={onConnect}
      className='inline-flex items-center gap-1 rounded-md bg-linear-to-r from-cyan-500 to-blue-500 px-2.5 py-1 text-xs font-medium text-white transition-all hover:bg-linear-to-bl focus:ring-4 focus:ring-cyan-300 focus:outline-none dark:focus:ring-cyan-800'
    >
      Connect
      <ArrowRight className='h-3 w-3' />
    </button>
  );
}

function StatusBadge({ status }: { status: CardStatus }) {
  if (status === "connected") {
    return (
      <span className='inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1 text-xs text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-300 dark:ring-emerald-400/20'>
        <CheckCircle2 className='h-3 w-3' />
        Connected
      </span>
    );
  }
  if (status === "soon") {
    return (
      <span className='text-muted-foreground inline-flex items-center gap-1.5 rounded-md bg-zinc-500/10 px-2 py-1 text-xs ring-1 ring-zinc-500/20 dark:text-zinc-400 dark:ring-zinc-400/20'>
        Coming soon
      </span>
    );
  }
  return (
    <span className='inline-flex items-center gap-1.5 rounded-md bg-zinc-500/10 px-2 py-1 text-xs text-zinc-700 ring-1 ring-zinc-500/20 dark:text-zinc-300 dark:ring-zinc-400/20'>
      Available
    </span>
  );
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
          <StatusBadge status={status} />
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
        <div
          className='absolute h-px w-full [background:linear-gradient(90deg,rgba(0,0,0,0.15)_30%,rgba(0,0,0,0.04)_70%)] dark:[background:linear-gradient(90deg,rgba(136,136,136,0.3)_30%,rgb(29,31,31)_70%)]'
          style={{
            top: "10%",
            left: "0%",
            maskImage:
              "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
          }}
        />
        <div
          className='absolute h-full w-px [background:linear-gradient(rgba(0,0,0,0.15)_30%,rgba(0,0,0,0.04)_70%)] dark:[background:linear-gradient(rgba(116,116,116,0.3)_30%,rgb(34,36,36)_70%)]'
          style={{
            left: "10%",
            top: "0%",
            maskImage:
              "linear-gradient(0deg, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage:
              "linear-gradient(0deg, transparent, black 15%, black 85%, transparent)",
          }}
        />
        <div
          className='absolute z-1 h-px w-full bg-zinc-200 dark:bg-white/[0.05]'
          style={{
            bottom: "10%",
            left: "0%",
            maskImage:
              "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
          }}
        />
        <div
          className='absolute h-full w-px bg-zinc-200 dark:bg-white/[0.05]'
          style={{
            right: "10%",
            top: "0%",
            maskImage:
              "linear-gradient(0deg, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage:
              "linear-gradient(0deg, transparent, black 15%, black 85%, transparent)",
          }}
        />
      </div>
    </div>
  );
}

export function IntegrationsExplorer() {
  const [query, setQuery] = useState("");
  const [connectFor, setConnectFor] = useState<Integration | null>(null);
  const [manageFor, setManageFor] = useState<Integration | null>(null);
  const { byPlatform } = useIntegrations();

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? INTEGRATIONS.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.category.toLowerCase().includes(q),
        )
      : INTEGRATIONS;

    const byCategory = new Map<string, Integration[]>();
    for (const item of filtered) {
      const list = byCategory.get(item.category) ?? [];
      list.push(item);
      byCategory.set(item.category, list);
    }

    return CATEGORY_ORDER.filter((c) => byCategory.has(c)).map(
      (c) => [c, byCategory.get(c) as Integration[]] as const,
    );
  }, [query]);

  const manageConnection = manageFor ? byPlatform.get(manageFor.platform) : null;

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
                  const connection = byPlatform.get(integration.platform);
                  const status = resolveStatus(integration, connection);
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
        connection={manageConnection ?? null}
        platformName={manageFor?.name ?? ""}
        Icon={manageFor?.icon ?? (() => null)}
        glow={manageFor?.glow ?? "rgba(113,113,122,0.4)"}
      />
    </>
  );
}
