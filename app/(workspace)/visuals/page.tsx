"use client";

import {
  INTEGRATIONS,
  type Integration,
  connectionsForIntegration,
  resolveStatus,
} from "@/app/integrations/integrations-explorer";
import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import {
  DAY_MS,
  DateRangePicker,
  dateFromIso,
  isoDate,
} from "@/components/ui/date-range-picker";
import { Organization, useUserContext } from "@/context/AuthenticatedContext";
import { useIntegrations } from "@/hooks/use-integrations";
import {
  effectiveIntegrationPlatform,
  isMetaSurface,
} from "@/lib/integrations-api";
import { POST_PLATFORMS, getSocialPostStats } from "@/lib/social-posts-api";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Folder, Layers3, PenLine, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

const ConnectDialog = dynamic(() =>
  import("@/app/integrations/_components/connect-dialog").then(
    (module) => module.ConnectDialog
  )
);
const ManageDialog = dynamic(() =>
  import("@/app/integrations/_components/manage-dialog").then(
    (module) => module.ManageDialog
  )
);
const VisualsCharts = dynamic(() => import("./_components/visuals-charts"));

export default function VisualsHomePage() {
  const [chartsReady, setChartsReady] = useState(false);
  const today = useMemo(() => new Date(), []);
  const [from, setFrom] = useState(() =>
    isoDate(new Date(Date.now() - DAY_MS * 29))
  );
  const [to, setTo] = useState(() => isoDate(today));
  const [rangeStart, rangeEnd] = useMemo(() => {
    const start = dateFromIso(from);
    const end = dateFromIso(to);
    return start <= end ? [start, end] : [end, start];
  }, [from, to]);
  const [connectFor, setConnectFor] = useState<Integration | null>(null);
  const [manageFor, setManageFor] = useState<Integration | null>(null);
  const {
    orgId,
    byPlatform,
    identityBySurface,
    integrations,
    isLoading: integrationsLoading,
  } = useIntegrations();
  const { user } = useUserContext();

  useEffect(() => {
    const show = () => setChartsReady(true);
    const requestIdle = window.requestIdleCallback;
    if (requestIdle) {
      const id = requestIdle(show, { timeout: 2_000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(show, 500);
    return () => clearTimeout(id);
  }, []);

  const organizations = useMemo<Organization[]>(() => {
    const list = user?.allOrganizations || [];
    if (list.length > 0) return list;
    return user?.business && typeof user.business === "object"
      ? [user.business as Organization]
      : [];
  }, [user]);

  const current = useMemo<Organization | null>(() => {
    if (
      user?.currentOrganization &&
      typeof user.currentOrganization === "object"
    ) {
      return user.currentOrganization;
    }
    return organizations[0] || null;
  }, [organizations, user?.currentOrganization]);

  const statsRange = useMemo(() => {
    const start = new Date(
      rangeStart.getFullYear(),
      rangeStart.getMonth(),
      rangeStart.getDate()
    );
    const end = new Date(
      rangeEnd.getFullYear(),
      rangeEnd.getMonth(),
      rangeEnd.getDate(),
      23,
      59,
      59,
      999
    );
    return {
      from: start.toISOString(),
      to: end.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    };
  }, [rangeEnd, rangeStart]);
  const statsQuery = useQuery({
    queryKey: ["social-post-stats", orgId || "none", statsRange],
    queryFn: () => getSocialPostStats(statsRange),
    enabled: Boolean(orgId),
  });
  const stats = statsQuery.data;

  const connectedChannels = integrations.filter(
    (item) =>
      item.status === "active" &&
      POST_PLATFORMS.includes(effectiveIntegrationPlatform(item))
  ).length;
  const activityData = useMemo(() => {
    const byDate = new Map(
      (stats?.activity || []).map((day) => [day.date, day])
    );
    const days =
      Math.round((rangeEnd.getTime() - rangeStart.getTime()) / DAY_MS) + 1;
    return Array.from({ length: Math.max(1, days) }, (_, index) => {
      const date = new Date(rangeStart);
      date.setDate(rangeStart.getDate() + index);
      const key = isoDate(date);
      const day = byDate.get(key);
      return {
        name: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        Drafted: day?.drafted || 0,
        Published: day?.published || 0,
        Projects: day?.projects || 0,
        Channels: connectedChannels,
        Engagement: day?.engagement || 0,
      };
    });
  }, [connectedChannels, rangeEnd, rangeStart, stats?.activity]);

  const connectedIntegrations = useMemo(() => {
    return INTEGRATIONS.filter((integration) => {
      const hasIdentity = isMetaSurface(integration.platform)
        ? identityBySurface.has(integration.platform)
        : false;
      return (
        resolveStatus(
          integration,
          connectionsForIntegration(integration, byPlatform),
          hasIdentity
        ) === "connected"
      );
    });
  }, [byPlatform, identityBySurface]);

  const pluginCards = useMemo(() => {
    const slack = INTEGRATIONS.find((item) => item.appSlug === "slack");
    return [...INTEGRATIONS.slice(0, 7), ...(slack ? [slack] : [])];
  }, []);
  const manageConnections = manageFor
    ? connectionsForIntegration(manageFor, byPlatform)
    : [];

  const statCards = [
    {
      label: "Posts drafted",
      value: stats?.drafted ?? "—",
      detail: "In selected range",
      Icon: PenLine,
      dataKey: "Drafted" as const,
      color: "#60a5fa",
    },
    {
      label: "Active projects",
      value: stats?.activeProjects ?? "—",
      detail: "Updated in selected range",
      Icon: Folder,
      dataKey: "Projects" as const,
      color: "#60a5fa",
    },
    {
      label: "Engagement",
      value: stats?.engagement ?? "—",
      detail: "Likes, replies, shares, clicks",
      Icon: BarChart3,
      dataKey: "Engagement" as const,
      color: "#60a5fa",
    },
    {
      label: "Channels",
      value: integrationsLoading ? "—" : connectedChannels,
      detail: "Ready to publish",
      Icon: Layers3,
      dataKey: "Channels" as const,
      color: "#60a5fa",
    },
  ];

  return (
    <div className='min-h-[calc(100dvh-7rem)] rounded-lg bg-zinc-50 px-0 text-zinc-950 md:p-2 lg:p-6 lg:px-0 dark:bg-[#070707] dark:text-white'>
      <div className='mb-8 flex flex-col gap-y-4 md:flex-row md:items-start md:justify-between'>
        <div>
          <h1 className='font-instrument-serif text-2xl font-semibold tracking-tight sm:text-3xl'>
            <LocalizedText text={"Hello "} />
            {current?.businessName || user?.username || "User"} 👋
          </h1>
          <div className='mt-4 flex items-center'>
            {connectedIntegrations.slice(0, 6).map((integration, index) => (
              <span
                key={integration.name}
                className='relative -ml-2 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-50 bg-white shadow-sm ring-1 ring-zinc-200 first:ml-0 dark:border-[#070707] dark:bg-[#151515] dark:ring-white/10'
                style={{
                  zIndex: connectedIntegrations.length - index,
                }}
                title={integration.name}
              >
                <integration.icon className='h-6 w-6' />
              </span>
            ))}
            <Link
              href='/plugins'
              className='relative -ml-2 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-50 bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 transition hover:bg-zinc-100 dark:border-[#070707] dark:bg-[#151515] dark:text-white dark:ring-white/10 dark:hover:bg-white/10'
              style={{ zIndex: 0 }}
              title='Add plugin'
              aria-label='Add plugin'
            >
              <Plus className='h-5 w-5' />
            </Link>
            {connectedIntegrations.length === 0 && (
              <span className='text-xs text-zinc-500 dark:text-white/45'>
                <LocalizedText text={"No channels connected yet"} />
              </span>
            )}
          </div>
        </div>

        <DateRangePicker
          from={from}
          to={to}
          onChange={(nextFrom, nextTo) => {
            setFrom(nextFrom);
            setTo(nextTo);
          }}
        />
      </div>

      {chartsReady ? (
        <VisualsCharts activityData={activityData} statCards={statCards} />
      ) : (
        <div className='h-[460px] animate-pulse rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.035]' />
      )}

      <section className='mt-5 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <h2 className='text-base font-semibold'>
              <LocalizedText text={"Plugins"} />
            </h2>
            <p className='mt-1 text-sm text-zinc-500 dark:text-white/55'>
              <LocalizedText
                text={"Add channels and tools for this organization."}
              />
            </p>
          </div>
          <Link
            href='/plugins'
            className='inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200 px-3 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white'
          >
            <LocalizedText text={"View all"} />
          </Link>
        </div>

        <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
          {pluginCards.map((integration) => {
            const connections = connectionsForIntegration(
              integration,
              byPlatform
            );
            const hasIdentityForSurface = isMetaSurface(integration.platform)
              ? identityBySurface.has(integration.platform)
              : false;
            const status = resolveStatus(
              integration,
              connections,
              hasIdentityForSurface
            );
            const Icon = integration.icon;
            const isManageable = status === "connected" || status === "partial";
            const isSoon = status === "soon";
            const statusLabel =
              status === "connected"
                ? "Connected"
                : status === "partial"
                  ? "Needs setup"
                  : status === "soon"
                    ? "Soon"
                    : "Available";
            return (
              <article
                key={integration.name}
                className='rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-[#0c0c0c]'
              >
                <div className='flex items-start justify-between gap-3'>
                  <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-zinc-200 dark:bg-white/10 dark:ring-white/10'>
                    <Icon className='h-5 w-5' />
                  </span>
                  <span
                    className={[
                      "rounded-full px-2.5 py-1 text-xs",
                      isManageable
                        ? "bg-sky-500/10 text-sky-700 dark:text-sky-200"
                        : "bg-zinc-200/70 text-zinc-600 dark:bg-white/10 dark:text-white/55",
                    ].join(" ")}
                  >
                    {statusLabel}
                  </span>
                </div>
                <h3 className='mt-4 font-semibold'>{integration.name}</h3>
                <p className='mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-zinc-500 dark:text-white/50'>
                  {integration.description}
                </p>
                <Button
                  type='button'
                  disabled={isSoon}
                  onClick={() =>
                    isManageable
                      ? setManageFor(integration)
                      : setConnectFor(integration)
                  }
                  variant={isManageable ? "outline" : "default"}
                  className='mt-4 w-full rounded-xl disabled:cursor-not-allowed'
                >
                  {isManageable ? "Manage" : isSoon ? "Coming soon" : "Add"}
                </Button>
              </article>
            );
          })}
        </div>
      </section>

      {connectFor && (
        <ConnectDialog
          open
          onOpenChange={(open) => !open && setConnectFor(null)}
          platform={connectFor.platform}
          platformName={connectFor.name}
          platformDescription={connectFor.description}
          Icon={connectFor.icon}
          glow={connectFor.glow}
          appSlug={connectFor.appSlug}
        />
      )}

      {manageFor && (
        <ManageDialog
          open
          onOpenChange={(open) => !open && setManageFor(null)}
          connections={manageConnections}
          platform={manageFor.platform}
          platformName={manageFor.name}
          Icon={manageFor.icon}
          glow={manageFor.glow}
        />
      )}
    </div>
  );
}
