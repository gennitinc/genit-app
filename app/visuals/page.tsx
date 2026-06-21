"use client";

import { HomeCommandCenter } from "./_components/home-command-center";
import { POST_PLATFORMS } from "./_components/post-editor-dialog";
import {
  FacebookBrand,
  InstagramBrand,
  XBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { ConnectDialog } from "@/app/integrations/_components/connect-dialog";
import { ManageDialog } from "@/app/integrations/_components/manage-dialog";
import {
  INTEGRATIONS,
  type Integration,
  resolveStatus,
} from "@/app/integrations/integrations-explorer";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Organization, useUserContext } from "@/context/AuthenticatedContext";
import { useIntegrations } from "@/hooks/use-integrations";
import { isMetaSurface } from "@/lib/integrations-api";
import { listSocialPosts } from "@/lib/social-posts-api";
import { GradientFrame } from "@/utils/gradient-frame";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  BarChart,
  CalendarCheck,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import React, { useMemo, useState } from "react";

const chartData = [
  { name: "Week 1", Traffic: 15, Engagement: 10 },
  { name: "Week 2", Traffic: 24, Engagement: 30 },
  { name: "Week 3", Traffic: 18, Engagement: 25 },
  { name: "Week 4", Traffic: 45, Engagement: 25 },
];

export default function VisualsHomePage() {
  const [connectFor, setConnectFor] = useState<Integration | null>(null);
  const [manageFor, setManageFor] = useState<Integration | null>(null);
  const [postComposerRequest, setPostComposerRequest] = useState(0);
  const { byPlatform, identityBySurface, integrations } = useIntegrations();
  const postsQuery = useQuery({
    queryKey: ["social-posts"],
    queryFn: listSocialPosts,
  });

  const { user } = useUserContext();
  const router = useRouter();

  const organizations = useMemo<Organization[]>(() => {
    const list = user?.allOrganizations || [];
    if (list.length > 0) return list;
    return user?.business && typeof user.business === "object"
      ? [user.business as Organization]
      : [];
  }, [user]);

  const current: Organization | null = useMemo(() => {
    if (
      user?.currentOrganization &&
      typeof user.currentOrganization === "object"
    ) {
      return user.currentOrganization;
    }
    return organizations[0] || null;
  }, [user?.currentOrganization, organizations]);

  const sortedIntegrations = useMemo(() => {
    return [...INTEGRATIONS].sort((a, b) => {
      const aHasId = isMetaSurface(a.platform)
        ? identityBySurface.has(a.platform)
        : false;
      const bHasId = isMetaSurface(b.platform)
        ? identityBySurface.has(b.platform)
        : false;
      const aStatus = resolveStatus(a, byPlatform.get(a.platform), aHasId);
      const bStatus = resolveStatus(b, byPlatform.get(b.platform), bHasId);

      const order = { connected: 0, available: 1, partial: 2, soon: 3 };
      return (
        order[aStatus as keyof typeof order] -
        order[bStatus as keyof typeof order]
      );
    });
  }, [byPlatform, identityBySurface]);

  const manageConnections = manageFor
    ? (byPlatform.get(manageFor.platform) ?? [])
    : [];
  const homePosts = postsQuery.data || [];
  const connectedChannels = integrations.filter(
    (item) => item.status === "active" && POST_PLATFORMS.includes(item.platform)
  ).length;
  const homeStats = [
    {
      label: "Drafts",
      value: homePosts.filter((post) => post.status === "draft").length,
    },
    {
      label: "Scheduled",
      value: homePosts.filter((post) => post.status === "scheduled").length,
    },
    {
      label: "Published",
      value: homePosts.filter((post) => post.status === "published").length,
    },
  ];

  const image = "./visual-flow.jpg";

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 flex w-full flex-col gap-2 duration-500'>
      <div className='relative overflow-hidden rounded-3xl border p-4'>
        {/* Background image */}
        <img
          src='https://i.pinimg.com/1200x/d3/fb/28/d3fb286b8631f66116718fdc97b1d6bf.jpg'
          className='pointer-events-none absolute inset-0 h-full w-full object-cover select-none'
          alt=''
        />

        {/* Content */}
        <div className='relative z-10 grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)] lg:items-center'>
          <div className='flex min-w-0 flex-col items-start justify-center py-1 lg:pl-6'>
            <div>
              <h3 className='font-instrument-serif text-2xl font-bold tracking-tight text-white'>
                Hello, {`${current?.businessName || "Organization"}`} 👋
              </h3>
              <p className='mt-1 text-sm leading-5 text-white/70'>
                Welcome back, here is the latest overview of your brand.
              </p>
            </div>
            <Button
              className='mt-4 h-9 rounded-sm bg-indigo-600 px-4 text-white hover:bg-indigo-700'
              onClick={() => setPostComposerRequest((request) => request + 1)}
            >
              New Post <Plus className='h-4 w-4' />
            </Button>
          </div>

          <div className='rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-black/5 dark:bg-zinc-950/95 dark:shadow-none dark:ring-white/10'>
            <div className='flex items-center justify-between gap-3 border-b border-black/5 pb-3 dark:border-white/10'>
              <div className='flex min-w-0 items-center gap-3'>
                <div className='h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-black/5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10'>
                  {current?.businessLogo ? (
                    <img
                      src={current.businessLogo}
                      alt={`${current.businessName || "Brand"} logo`}
                      className='block h-full w-full bg-white object-contain'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center'>
                      <span className='text-foreground text-sm font-bold dark:text-white'>
                        {(current?.businessName || "B")
                          .slice(0, 1)
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className='min-w-0'>
                  <p className='text-foreground truncate text-sm font-semibold dark:text-white'>
                    {current?.businessName || "Brand overview"}
                  </p>
                  <p className='text-muted-foreground truncate text-xs dark:text-white/50'>
                    {connectedChannels} connected channel
                    {connectedChannels === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            </div>
            <div className='mt-3 grid grid-cols-3 gap-2'>
              {homeStats.map((stat) => (
                <div
                  key={stat.label}
                  className='rounded-sm bg-black/[0.025] px-3 py-2.5 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10'
                >
                  <p className='text-muted-foreground truncate text-[11px] dark:text-white/50'>
                    {stat.label}
                  </p>
                  <p className='text-foreground mt-0.5 text-lg font-semibold dark:text-white'>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Integrations Carousel */}
      <div className='mt-2 flex flex-col shadow-sm'>
        <div className='mb-6 flex items-start justify-between lg:mx-6'>
          <div>
            <h3 className='text-foreground text-base font-bold dark:text-white'>
              Integration Status
            </h3>
            <p className='text-muted-foreground mt-1 text-xs'>
              Manage your connected channels
            </p>
          </div>
          <Button
            variant='outline'
            size='sm'
            className='h-8 rounded-full border-zinc-200 text-xs dark:border-zinc-800'
            onClick={() => {
              router.push("/integrations");
            }}
          >
            View more
          </Button>
        </div>

        <Carousel
          opts={{ align: "start", loop: false }}
          className='group/carousel mt-2 w-full'
        >
          <CarouselContent className='-ml-1'>
            {sortedIntegrations.map((integration, i) => {
              const hasIdentityForSurface = isMetaSurface(integration.platform)
                ? identityBySurface.has(integration.platform)
                : false;
              const status = resolveStatus(
                integration,
                byPlatform.get(integration.platform),
                hasIdentityForSurface
              );
              const isSoon = status === "soon";

              return (
                <CarouselItem
                  key={integration.name}
                  className='basis-full p-2 pl-[-5] sm:basis-1/2 lg:basis-1/4 xl:basis-1/4'
                >
                  <div className='group relative h-full w-full overflow-hidden rounded-2xl bg-zinc-50/50 border border-zinc-200/50 p-5 dark:bg-zinc-950/30 dark:border-zinc-900/60 transition-all hover:border-zinc-300 dark:hover:border-zinc-800 shadow-xs'>
                    <div className='relative z-10 flex h-full flex-col'>
                      <div className='flex items-start justify-between'>
                        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-200/60 dark:bg-zinc-950 dark:border-zinc-800/80 shadow-xs">
                          <integration.icon
                            className={
                              integration.name === "Shopify"
                                ? "h-6 w-6 text-[#95BF47]"
                                : "h-6 w-6 text-zinc-800 dark:text-zinc-200"
                            }
                          />
                        </div>
                        <div
                          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium border ${
                            status === "connected"
                              ? "bg-emerald-50/5 border-emerald-50/20 text-emerald-600 dark:text-emerald-400"
                              : status === "partial"
                                ? "bg-amber-50/5 border-amber-50/20 text-amber-600 dark:text-amber-400"
                                : "bg-zinc-100 border-zinc-200 text-zinc-500 dark:bg-zinc-900/40 dark:border-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          <div
                            className={`h-1 w-1 rounded-full ${
                              status === "connected"
                                ? "bg-emerald-500"
                                : status === "partial"
                                  ? "bg-amber-500"
                                  : "bg-zinc-400"
                            }`}
                          />
                          {status === "connected"
                            ? "Connected"
                            : status === "partial"
                              ? "Needs Setup"
                              : status === "soon"
                                ? "Coming Soon"
                                : "Available"}
                        </div>
                      </div>

                      <div className='mt-5 flex-1'>
                        <h4 className='text-zinc-900 dark:text-zinc-100 line-clamp-1 text-sm sm:text-base font-semibold tracking-tight'>
                          {integration.name}
                        </h4>
                        <p className='text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 text-xs leading-normal'>
                          {integration.description}
                        </p>
                      </div>

                      <div className='mt-auto pt-5 flex w-full items-center'>
                        {status === "connected" || status === "partial" ? (
                          <button
                            type="button"
                            onClick={() => setManageFor(integration)}
                            className="h-8 w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800 rounded-full text-xs font-semibold transition-all active:scale-95"
                          >
                            Manage
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isSoon}
                            onClick={() => setConnectFor(integration)}
                            className={`h-8 w-full rounded-full text-xs font-semibold transition-all ${
                              isSoon
                                ? "bg-zinc-100 dark:bg-zinc-900/40 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 cursor-not-allowed select-none"
                                : "bg-zinc-900 hover:bg-black text-white dark:bg-zinc-850 dark:hover:bg-zinc-800 dark:text-zinc-200 border border-zinc-800 dark:border-zinc-700/60 active:scale-95"
                            }`}
                          >
                            {isSoon ? "Soon" : "Add"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className='mt-4 flex justify-end gap-1.5 opacity-0 transition-opacity duration-200 group-hover/carousel:opacity-100'>
            <CarouselPrevious className='border-border/50 bg-background/50 hover:bg-background/80 static h-8 w-8 translate-y-0 rounded-full' />
            <CarouselNext className='border-border/50 bg-background/50 hover:bg-background/80 static h-8 w-8 translate-y-0 rounded-full' />
          </div>
        </Carousel>
      </div>

      <HomeCommandCenter createRequest={postComposerRequest} />

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
    </div>
  );
}
