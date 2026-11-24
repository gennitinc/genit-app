"use client";

import {
  INTEGRATIONS,
  type Integration,
  connectionsForIntegration,
  resolveStatus,
} from "@/app/integrations/integrations-explorer";
import { LocalizedText } from "@/components/localized-text";
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
import { isFreePlan, isProPlugin } from "@/lib/plan";
import { POST_PLATFORMS, getSocialPostStats } from "@/lib/social-posts-api";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, CrownIcon, MoreHorizontalIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { IconSourceView } from "@/components/ui/icon-source";
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

const RANGE_PRESETS = [7, 30, 90] as const;

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

  // A preset is active when the range ends today and spans exactly that many days.
  const activePreset = RANGE_PRESETS.find(
    (days) =>
      to === isoDate(today) &&
      Math.round((rangeEnd.getTime() - rangeStart.getTime()) / DAY_MS) + 1 ===
        days
  );

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
        Engagement: day?.engagement || 0,
      };
    });
  }, [rangeEnd, rangeStart, stats?.activity]);

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

  const pluginCards = INTEGRATIONS.filter((item) => item.category === "Socials");
  const manageConnections = manageFor
    ? connectionsForIntegration(manageFor, byPlatform)
    : [];


  return (
    <div className='min-h-[calc(100dvh-7rem)] rounded-lg bg-zinc-50 px-0 text-zinc-950 md:p-2 lg:p-6 lg:px-0 dark:bg-[#070707] dark:text-white'>
      <div className='mb-8 flex flex-col gap-y-4 md:flex-row md:items-start md:justify-between md:gap-x-6'>
        <div className='w-full md:flex-1'>
          <h1 className='font-instrument-serif text-2xl font-semibold tracking-tight sm:text-3xl'>
            <LocalizedText text={"Hello "} />
            {current?.businessName || user?.username || "User"} 👋
          </h1>
          {/* Connected plugins on the left, each leaning slightly clockwise; the add button sits at the far right on small screens and right after the icons on desktop. */}
          <div className='mt-4 flex w-full items-center justify-between gap-3 lg:justify-start'>
            <div className='flex items-center'>
              {connectedIntegrations.slice(0, 6).map((integration, index) => (
                <span
                  key={integration.name}
                  className='relative -ml-2 flex h-10 w-10 rotate-[8deg] items-center justify-center overflow-hidden rounded-xl border-2 border-zinc-50 bg-white shadow-sm ring-1 ring-zinc-200 first:ml-0 dark:border-[#070707] dark:bg-[#151515] dark:ring-white/10'
                  style={{
                    zIndex: connectedIntegrations.length - index,
                  }}
                  title={integration.name}
                >
                  <IconSourceView icon={integration.icon} className='h-full w-full' />
                </span>
              ))}
              {connectedIntegrations.length === 0 && (
                <span className='text-xs text-zinc-500 dark:text-white/45'>
                  <LocalizedText text={"No channels connected yet"} />
                </span>
              )}
            </div>
            <Link
              href='/plugins'
              className='relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-50 bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 transition hover:bg-zinc-100 dark:border-[#070707] dark:bg-[#151515] dark:text-white dark:ring-white/10 dark:hover:bg-white/10'
              title='Add plugin'
              aria-label='Add plugin'
            >
              <HugeiconsIcon icon={PlusSignIcon} className='h-5 w-5' />
            </Link>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <div
            role='group'
            aria-label='Date range'
            className='flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 dark:border-white/10 dark:bg-white/5'
          >
            {RANGE_PRESETS.map((days) => {
              const active = activePreset === days;
              return (
                <button
                  key={days}
                  type='button'
                  aria-pressed={active}
                  onClick={() => {
                    setFrom(isoDate(new Date(Date.now() - DAY_MS * (days - 1))));
                    setTo(isoDate(new Date()));
                  }}
                  className={[
                    "h-8 rounded-md px-3 text-[13px] tabular-nums transition-colors",
                    active
                      ? "bg-white font-semibold text-zinc-900 shadow-sm ring-1 ring-zinc-200 dark:bg-[#1a1a1a] dark:text-white dark:ring-white/10"
                      : "font-medium text-zinc-500 hover:text-zinc-900 dark:text-white/50 dark:hover:text-white",
                  ].join(" ")}
                >
                  {days}D
                </button>
              );
            })}
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
      </div>

      {chartsReady ? (
        <VisualsCharts
          activityData={activityData}
          stats={stats}
          channels={integrationsLoading ? undefined : connectedChannels}
        />
      ) : (
        <div className='h-[460px] animate-pulse rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.035]' />
      )}

      <section className='mt-5'>
        <div className='flex items-center justify-between gap-3 sm:items-start'>
          <div>
            <h2 className='text-base font-semibold'>
              <LocalizedText text={"Plugins"} />
            </h2>
            <p className='mt-1 hidden text-sm text-zinc-500 sm:block dark:text-white/55'>
              <LocalizedText
                text={"Add channels and tools for this organization."}
              />
            </p>
          </div>
          <Link
            href='/plugins'
            className='inline-flex h-9 shrink-0 items-center justify-center rounded-xl px-3 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 sm:border sm:border-zinc-200 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white sm:dark:border-white/10'
          >
            <LocalizedText text={"View all"} />
          </Link>
        </div>

        <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-0'>
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
            const pro = isFreePlan(user?.userPlan) && isProPlugin(integration) && !isManageable && !isSoon;
            return (
              <React.Fragment key={integration.name}>
                <button
                  type='button'
                  disabled={isSoon}
                  onClick={() => isManageable ? setManageFor(integration) : setConnectFor(integration)}
                  className='flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed sm:hidden dark:bg-[#151515] dark:hover:bg-white/10'
                >
                  <IconSourceView icon={Icon} className='size-[26px] shrink-0' />
                  <span className='min-w-0 flex-1'>
                    <span className='flex items-center gap-1.5 text-base font-semibold'>
                      <span className='truncate'>{integration.name}</span>
                      {pro && <HugeiconsIcon icon={CrownIcon} className='size-3.5 shrink-0 text-amber-500' />}
                    </span>
                    <span className='mt-0.5 block truncate text-[13px] text-zinc-500 dark:text-white/50'>{integration.description}</span>
                  </span>
                  {status === "connected" ? (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className='size-6 shrink-0 text-emerald-600 dark:text-emerald-400' aria-label='Connected' />
                  ) : (
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${isSoon || pro || isManageable ? "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-white/60" : "bg-primary/10 text-primary"}`}>
                      <LocalizedText text={isManageable ? "Needs setup" : isSoon ? "Soon" : pro ? "Pro" : "Add"} />
                    </span>
                  )}
                </button>
                <article className='hidden min-w-0 items-center gap-4 border-b border-zinc-100 py-6 sm:flex dark:border-zinc-900'>
                  <span className='flex size-14 shrink-0 items-center justify-center rounded-[10px] border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950'>
                    <IconSourceView icon={Icon} className='size-7 text-zinc-800 dark:text-zinc-200' />
                  </span>
                  <div className='min-w-0 flex-1'>
                    <h3 className='truncate text-base font-semibold tracking-tight'>{integration.name}</h3>
                    <p className='mt-1 line-clamp-2 text-sm leading-5 text-zinc-500 dark:text-zinc-400'>
                      {integration.description}
                    </p>
                  </div>
                  {isManageable ? (
                    <button
                      type='button'
                      onClick={() => setManageFor(integration)}
                      aria-label={`Manage ${integration.name}${status === "partial" ? " (needs setup)" : ""}`}
                      title={status === "partial" ? "Needs setup" : `Manage ${integration.name}`}
                      className='shrink-0 rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-zinc-400 dark:hover:bg-zinc-900'
                    >
                      <HugeiconsIcon icon={MoreHorizontalIcon} className='size-5' />
                    </button>
                  ) : (
                    <button
                      type='button'
                      disabled={isSoon}
                      onClick={() => setConnectFor(integration)}
                      className='shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:border disabled:border-zinc-200 disabled:bg-zinc-50 disabled:text-zinc-400 dark:disabled:border-zinc-800 dark:disabled:bg-zinc-950 dark:disabled:text-zinc-500'
                    >
                      <LocalizedText text={isSoon ? "Soon" : "Connect"} />
                    </button>
                  )}
                </article>
              </React.Fragment>
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
