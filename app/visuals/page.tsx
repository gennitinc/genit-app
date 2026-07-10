"use client";

import { POST_PLATFORMS } from "./_components/post-editor-dialog";
import { ConnectDialog } from "@/app/integrations/_components/connect-dialog";
import { ManageDialog } from "@/app/integrations/_components/manage-dialog";
import {
  INTEGRATIONS,
  type Integration,
  resolveStatus,
} from "@/app/integrations/integrations-explorer";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Organization, useUserContext } from "@/context/AuthenticatedContext";
import { useIntegrations } from "@/hooks/use-integrations";
import { isMetaSurface } from "@/lib/integrations-api";
import { listSocialPosts } from "@/lib/social-posts-api";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Folder,
  Layers3,
  PenLine,
  Plus,
} from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React, { useMemo, useState } from "react";

const dayMs = 86_400_000;

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dateFromIso(value: string) {
  return new Date(`${value}T12:00:00`);
}

function prettyDateRange(from: string, to: string) {
  const format = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${format.format(dateFromIso(from))} - ${format.format(
    dateFromIso(to)
  )}`;
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function monthTitle(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function sameDay(a: Date, b: Date) {
  return isoDate(a) === isoDate(b);
}

function isBetween(day: Date, from: Date, to: Date) {
  return day.getTime() > from.getTime() && day.getTime() < to.getTime();
}

function monthCells(month: Date) {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const first = new Date(start);
  first.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(first);
    date.setDate(first.getDate() + index);
    return date;
  });
}

function DateRangeMonth({
  month,
  from,
  to,
  onSelect,
}: {
  month: Date;
  from: Date;
  to: Date;
  onSelect: (date: Date) => void;
}) {
  return (
    <div>
      <h3 className='mb-4 text-center text-sm font-semibold text-zinc-950 dark:text-white'>
        {monthTitle(month)}
      </h3>
      <div className='mb-2 grid grid-cols-7 text-center text-xs text-zinc-500 dark:text-white/45'>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className='grid grid-cols-7 gap-y-1'>
        {monthCells(month).map((day) => {
          const muted = day.getMonth() !== month.getMonth();
          const selected = sameDay(day, from) || sameDay(day, to);
          const ranged = isBetween(day, from, to);
          return (
            <button
              key={day.toISOString()}
              type='button'
              onClick={() => onSelect(day)}
              className={[
                "mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-sm transition",
                muted
                  ? "text-zinc-300 dark:text-white/25"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-white/65 dark:hover:bg-white/10",
                ranged ? "bg-sky-500/10 text-sky-600 dark:text-sky-300" : "",
                selected
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-500/20 hover:bg-sky-500 dark:bg-sky-500 dark:text-white"
                  : "",
              ].join(" ")}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function VisualsHomePage() {
  const today = useMemo(() => new Date(), []);
  const [from, setFrom] = useState(() =>
    isoDate(new Date(Date.now() - dayMs * 29))
  );
  const [to, setTo] = useState(() => isoDate(today));
  const [isPickingRangeEnd, setIsPickingRangeEnd] = useState(false);
  const [rangeStart, rangeEnd] = useMemo(() => {
    const start = dateFromIso(from);
    const end = dateFromIso(to);
    return start <= end ? [start, end] : [end, start];
  }, [from, to]);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [connectFor, setConnectFor] = useState<Integration | null>(null);
  const [manageFor, setManageFor] = useState<Integration | null>(null);
  const { byPlatform, identityBySurface, integrations } = useIntegrations();
  const postsQuery = useQuery({
    queryKey: ["social-posts"],
    queryFn: listSocialPosts,
  });
  const { user } = useUserContext();

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

  const posts = postsQuery.data || [];
  const filteredPosts = useMemo(() => {
    const start = new Date(
      rangeStart.getFullYear(),
      rangeStart.getMonth(),
      rangeStart.getDate()
    ).getTime();
    const end = new Date(
      rangeEnd.getFullYear(),
      rangeEnd.getMonth(),
      rangeEnd.getDate(),
      23,
      59,
      59
    ).getTime();
    return posts.filter((post) => {
      const time = new Date(
        post.publishedAt || post.scheduledFor || post.createdAt
      ).getTime();
      return time >= start && time <= end;
    });
  }, [posts, rangeEnd, rangeStart]);

  const connectedChannels = integrations.filter(
    (item) => item.status === "active" && POST_PLATFORMS.includes(item.platform)
  ).length;
  const activeProjects = new Set(
    filteredPosts.map((post) => post.project).filter(Boolean)
  ).size;
  const totalEngagement = filteredPosts.reduce(
    (sum, post) =>
      sum +
      (post.metrics?.likes || 0) +
      (post.metrics?.comments || 0) +
      (post.metrics?.shares || 0) +
      (post.metrics?.clicks || 0),
    0
  );
  const activityData = useMemo(() => {
    const days =
      Math.round((rangeEnd.getTime() - rangeStart.getTime()) / dayMs) + 1;
    return Array.from({ length: Math.max(1, days) }, (_, index) => {
      const date = new Date(rangeStart.getTime() + dayMs * index);
      const key = isoDate(date);
      const dayPosts = filteredPosts.filter(
        (post) =>
          isoDate(
            new Date(post.publishedAt || post.scheduledFor || post.createdAt)
          ) === key
      );
      return {
        name: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        Drafted: dayPosts.filter((post) => post.status === "draft").length,
        Published: dayPosts.filter((post) => post.status === "published")
          .length,
        Projects: new Set(dayPosts.map((post) => post.project).filter(Boolean))
          .size,
        Channels: connectedChannels,
        Engagement: dayPosts.reduce(
          (sum, post) =>
            sum +
            (post.metrics?.likes || 0) +
            (post.metrics?.comments || 0) +
            (post.metrics?.shares || 0) +
            (post.metrics?.clicks || 0),
          0
        ),
      };
    });
  }, [connectedChannels, filteredPosts, rangeEnd, rangeStart]);

  const connectedIntegrations = useMemo(() => {
    return INTEGRATIONS.filter((integration) => {
      const hasIdentity = isMetaSurface(integration.platform)
        ? identityBySurface.has(integration.platform)
        : false;
      return (
        resolveStatus(
          integration,
          byPlatform.get(integration.platform),
          hasIdentity
        ) === "connected"
      );
    });
  }, [byPlatform, identityBySurface]);

  const pluginCards = useMemo(() => INTEGRATIONS.slice(0, 8), []);
  const manageConnections = manageFor
    ? (byPlatform.get(manageFor.platform) ?? [])
    : [];

  const selectRangeDate = (date: Date) => {
    if (!isPickingRangeEnd) {
      setFrom(isoDate(date));
      setTo(isoDate(date));
      setIsPickingRangeEnd(true);
      return;
    }
    if (date < rangeStart) {
      setFrom(isoDate(date));
      setIsPickingRangeEnd(false);
      return;
    }
    setTo(isoDate(date));
    setIsPickingRangeEnd(false);
  };

  const statCards = [
    {
      label: "Posts drafted",
      value: filteredPosts.filter((post) => post.status === "draft").length,
      detail: "In selected range",
      Icon: PenLine,
      dataKey: "Drafted",
      color: "#60a5fa",
    },
    {
      label: "Active projects",
      value: activeProjects,
      detail: "With content activity",
      Icon: Folder,
      dataKey: "Projects",
      color: "#60a5fa",
    },
    {
      label: "Engagement",
      value: totalEngagement,
      detail: "Likes, replies, shares, clicks",
      Icon: BarChart3,
      dataKey: "Engagement",
      color: "#60a5fa",
    },
    {
      label: "Channels",
      value: connectedChannels,
      detail: "Ready to publish",
      Icon: Layers3,
      dataKey: "Channels",
      color: "#60a5fa",
    },
  ];

  const chartTooltipStyle = {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--popover-foreground)",
    fontSize: 12,
  };
  const chartTextColor = "var(--muted-foreground)";
  const chartGridColor = "var(--border)";

  return (
    <div className='min-h-[calc(100dvh-7rem)] rounded-2xl bg-zinc-50 p-2 text-zinc-950 lg:p-6 lg:px-0 dark:bg-[#070707] dark:text-white'>
      <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
        <div>
          <h1 className='font-instrument-serif text-2xl font-semibold tracking-tight sm:text-3xl'>
            Hello {current?.businessName || user?.username || "User"} 👋
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
              href='/plugin'
              className='relative -ml-2 flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-50 bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 transition hover:bg-zinc-100 dark:border-[#070707] dark:bg-[#151515] dark:text-white dark:ring-white/10 dark:hover:bg-white/10'
              style={{ zIndex: 0 }}
              title='Add plugin'
              aria-label='Add plugin'
            >
              <Plus className='h-5 w-5' />
            </Link>
            {connectedIntegrations.length === 0 && (
              <span className='text-xs text-zinc-500 dark:text-white/45'>
                No channels connected yet
              </span>
            )}
          </div>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type='button'
              className='flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-700 shadow-sm transition hover:bg-zinc-100 sm:w-auto dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80 dark:shadow-none dark:hover:bg-white/[0.07]'
            >
              <CalendarDays className='h-4 w-4 text-zinc-500 dark:text-white/55' />
              {prettyDateRange(from, to)}
            </button>
          </PopoverTrigger>
          <PopoverContent
            align='end'
            className='w-[min(calc(100vw-2rem),760px)] rounded-2xl border-zinc-200 bg-white p-4 text-zinc-950 dark:border-white/10 dark:bg-[#0b0b0b] dark:text-white'
          >
            <div className='mb-4 flex items-center justify-between'>
              <button
                type='button'
                onClick={() => setVisibleMonth((month) => addMonths(month, -1))}
                className='flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10'
                aria-label='Previous month'
              >
                <ChevronLeft className='h-4 w-4' />
              </button>
              <p className='text-sm font-medium text-zinc-600 dark:text-white/60'>
                {prettyDateRange(from, to)}
              </p>
              <button
                type='button'
                onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
                className='flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10'
                aria-label='Next month'
              >
                <ChevronRight className='h-4 w-4' />
              </button>
            </div>
            <div className='grid gap-6 md:grid-cols-2'>
              <DateRangeMonth
                month={visibleMonth}
                from={rangeStart}
                to={rangeEnd}
                onSelect={selectRangeDate}
              />
              <DateRangeMonth
                month={addMonths(visibleMonth, 1)}
                from={rangeStart}
                to={rangeEnd}
                onSelect={selectRangeDate}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className='grid grid-cols-2 gap-3 xl:grid-cols-4'>
        {statCards.map(({ label, value, detail, Icon, dataKey, color }) => (
          <section
            key={label}
            className='rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'
          >
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='text-xs font-medium text-zinc-500 dark:text-white/55'>
                  {label}
                </p>
                <p className='mt-1 text-xl leading-none font-semibold'>
                  {value}
                </p>
              </div>
              <span className='flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/10'>
                <Icon className='h-3.5 w-3.5 text-zinc-500 dark:text-white/70' />
              </span>
            </div>
            <div className='mt-3 h-14'>
              {dataKey === "Channels" || value === 0 ? (
                <div
                  className='flex h-full items-end pb-1'
                  title={`${label}: ${value}`}
                >
                  <div
                    className='h-0.5 w-full rounded-full'
                    style={{ background: color }}
                  />
                </div>
              ) : (
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart
                    data={activityData}
                    margin={{ top: 4, right: 2, bottom: 2, left: 2 }}
                  >
                    <YAxis
                      hide
                      domain={[
                        0,
                        (dataMax: number) => Math.max(10, dataMax * 1.4),
                      ]}
                    />
                    <Tooltip
                      contentStyle={chartTooltipStyle}
                      labelStyle={{
                        color: "var(--popover-foreground)",
                        fontSize: 12,
                      }}
                      itemStyle={{
                        color: "var(--popover-foreground)",
                        fontSize: 12,
                      }}
                      cursor={{ stroke: chartGridColor }}
                    />
                    <Line
                      type='monotone'
                      dataKey={dataKey}
                      stroke={color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            <p className='mt-2 text-[11px] text-zinc-500 dark:text-white/42'>
              {detail}
            </p>
          </section>
        ))}
      </div>

      <div className='mt-5'>
        <section className='rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
            <div>
              <h2 className='text-base font-semibold'>Content activity</h2>
              <p className='mt-1 text-sm text-zinc-500 dark:text-white/55'>
                Posts drafted vs posts published in selected range
              </p>
            </div>
          </div>
          <div className='mt-5 h-[360px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart
                data={activityData}
                margin={{ left: -24, right: 12, top: 12, bottom: 20 }}
              >
                <defs>
                  <linearGradient
                    id='contentActivityDrafted'
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop offset='5%' stopColor='#94a3b8' stopOpacity={0.22} />
                    <stop offset='95%' stopColor='#94a3b8' stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id='contentActivityPublished'
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop offset='5%' stopColor='#60a5fa' stopOpacity={0.35} />
                    <stop offset='95%' stopColor='#60a5fa' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartGridColor} vertical={false} />
                <XAxis
                  dataKey='name'
                  tick={{ fill: chartTextColor, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: chartTextColor, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  labelStyle={{
                    color: "var(--popover-foreground)",
                    fontSize: 12,
                  }}
                  itemStyle={{
                    color: "var(--popover-foreground)",
                    fontSize: 12,
                  }}
                  cursor={{ stroke: chartGridColor }}
                />
                <Area
                  type='monotone'
                  dataKey='Drafted'
                  stroke='#94a3b8'
                  strokeWidth={2}
                  fill='url(#contentActivityDrafted)'
                  dot={false}
                />
                <Area
                  type='monotone'
                  dataKey='Published'
                  stroke='#60a5fa'
                  strokeWidth={2}
                  fill='url(#contentActivityPublished)'
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className='flex items-center justify-center gap-2 text-xs text-zinc-600 dark:text-white/65'>
            <span className='flex items-center gap-2'>
              <span className='h-2 w-2 rounded-sm bg-slate-400' />
              Drafted
            </span>
            <span className='flex items-center gap-2'>
              <span className='h-2 w-2 rounded-sm bg-sky-400' />
              Published
            </span>
          </div>
        </section>
      </div>

      <section className='mt-5 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <h2 className='text-base font-semibold'>Plugins</h2>
            <p className='mt-1 text-sm text-zinc-500 dark:text-white/55'>
              Add channels and tools for this organization.
            </p>
          </div>
          <Link
            href='/plugin'
            className='inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200 px-3 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white'
          >
            View all
          </Link>
        </div>

        <div className='mt-4 grid gap-3 grid-cols-2 xl:grid-cols-4'>
          {pluginCards.map((integration) => {
            const connections = byPlatform.get(integration.platform);
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
                className='rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-[#0c0c0c]'
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

      <ConnectDialog
        open={Boolean(connectFor)}
        onOpenChange={(open) => !open && setConnectFor(null)}
        platform={connectFor?.platform ?? null}
        platformName={connectFor?.name ?? ""}
        platformDescription={connectFor?.description ?? ""}
        Icon={connectFor?.icon ?? (() => null)}
        glow={connectFor?.glow ?? "rgba(96,165,250,0.5)"}
      />

      <ManageDialog
        open={Boolean(manageFor)}
        onOpenChange={(open) => !open && setManageFor(null)}
        connections={manageConnections}
        platform={manageFor?.platform ?? null}
        platformName={manageFor?.name ?? ""}
        Icon={manageFor?.icon ?? (() => null)}
        glow={manageFor?.glow ?? "rgba(96,165,250,0.5)"}
      />
    </div>
  );
}
