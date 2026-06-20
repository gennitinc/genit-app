"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  type BrandReport,
  createBrandReport,
  listBrandReports,
  refreshBrandReport,
} from "@/lib/brand-reports-api";
import { LoadingFileLoader } from "@/utils/Loading";
import {
  Activity,
  BarChart3,
  CalendarDays,
  Eye,
  Plus,
  RefreshCw,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useMemo, useState } from "react";

const COLORS = [
  "#4f46e5",
  "#6366f1",
  "#818cf8",
  "#a5b4fc",
  "#c7d2fe",
  "#e0e7ff",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function compact(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value || 0);
}

function errorMessage(error: any) {
  return (
    error?.response?.data?.message || error?.message || "Something went wrong"
  );
}

//new

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className='rounded-xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-zinc-950'>
      <div className='mb-3'>
        <h2 className='text-xs font-semibold'>{title}</h2>
        <p className='text-muted-foreground mt-0.5 text-[11px]'>{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function SummaryPage() {
  const { toast } = useToast();
  const [reports, setReports] = useState<BrandReport[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [period, setPeriod] = useState({ periodStart: "", periodEnd: "" });

  const selected = useMemo(
    () => reports.find((report) => report._id === selectedId) || reports[0],
    [reports, selectedId]
  );

  useEffect(() => {
    listBrandReports()
      .then((items) => {
        setReports(items);
        setSelectedId(items[0]?._id || "");
      })
      .catch((error) =>
        toast({
          title: "Could not load brand metrics",
          description: errorMessage(error),
          variant: "destructive",
        })
      )
      .finally(() => setLoading(false));
  }, [toast]);

  const trendData = useMemo(
    () =>
      [...reports].reverse().map((report) => ({
        name: new Intl.DateTimeFormat("en", {
          month: "short",
          day: "numeric",
        }).format(new Date(report.periodEnd)),
        score: report.score,
        consistency: report.metrics.consistency || 0,
        engagementRate: report.metrics.engagementRate || 0,
      })),
    [reports]
  );

  const channelData = useMemo(() => {
    if (!selected) return [];
    const channels = new Map<
      string,
      { channel: string; posts: number; reach: number; engagement: number }
    >();
    for (const platform of selected.metrics.platforms || []) {
      channels.set(platform, {
        channel: platform,
        posts: 0,
        reach: 0,
        engagement: 0,
      });
    }
    for (const work of selected.work || []) {
      if (!work.platform) continue;
      const item = channels.get(work.platform) || {
        channel: work.platform,
        posts: 0,
        reach: 0,
        engagement: 0,
      };
      item.posts += 1;
      item.reach += Number(
        work.metrics?.impressions || work.metrics?.views || 0
      );
      item.engagement +=
        Number(work.metrics?.likes || 0) +
        Number(work.metrics?.comments || 0) +
        Number(work.metrics?.shares || 0) +
        Number(work.metrics?.clicks || 0);
      channels.set(work.platform, item);
    }
    return [...channels.values()].map((item) => ({
      ...item,
      channel: item.channel.charAt(0).toUpperCase() + item.channel.slice(1),
    }));
  }, [selected]);

  const contentMix = useMemo(
    () =>
      selected
        ? Object.entries(selected.metrics.typeCounts || {}).map(
            ([name, value]) => ({
              name: name
                .replaceAll("_", " ")
                .replace(/\b\w/g, (letter) => letter.toUpperCase()),
              value,
            })
          )
        : [],
    [selected]
  );

  const audienceData = selected
    ? [
        { name: "Impressions", value: selected.metrics.impressions || 0 },
        { name: "Views", value: selected.metrics.views || 0 },
        { name: "Likes", value: selected.metrics.likes || 0 },
        { name: "Comments", value: selected.metrics.comments || 0 },
        { name: "Shares", value: selected.metrics.shares || 0 },
        { name: "Clicks", value: selected.metrics.clicks || 0 },
      ]
    : [];

  const replace = (report: BrandReport) => {
    setReports((current) => [
      report,
      ...current.filter((item) => item._id !== report._id),
    ]);
    setSelectedId(report._id);
  };

  const openCreate = () => {
    const end = new Date();
    const start = new Date(end.getTime() - 30 * 86400000);
    setPeriod({
      periodStart: start.toISOString().slice(0, 10),
      periodEnd: end.toISOString().slice(0, 10),
    });
    setCreateOpen(true);
  };

  const createReport = async () => {
    setBusy(true);
    try {
      replace(await createBrandReport(period));
      setCreateOpen(false);
      toast({ title: "Brand metrics updated" });
    } catch (error) {
      toast({
        title: "Could not create report",
        description: errorMessage(error),
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const refresh = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      replace(await refreshBrandReport(selected._id));
      toast({ title: "Metrics refreshed" });
    } catch (error) {
      toast({
        title: "Could not refresh metrics",
        description: errorMessage(error),
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  if (loading)
    return (
      <div className='flex min-h-[500px] items-center justify-center'>
        <LoadingFileLoader />
      </div>
    );

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 flex w-full flex-col gap-4 pb-12 duration-500'>
      <header className='relative overflow-hidden rounded-3xl border bg-slate-950 p-4'>
        <img
          src='https://i.pinimg.com/1200x/d3/fb/28/d3fb286b8631f66116718fdc97b1d6bf.jpg'
          className='pointer-events-none absolute inset-0 h-full w-full object-cover select-none'
          alt=''
        />
        <div className='relative z-10 grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)] lg:items-center'>
          <div className='flex min-w-0 flex-col items-start justify-center py-1 lg:pl-6'>
            <h1 className='font-instrument-serif text-2xl font-semibold tracking-tight text-white md:text-3xl'>
              Summary and Report
            </h1>
            <p className='mt-1 max-w-xl text-sm leading-5 text-white/70'>
              Performance, audience response, and brand health in one view.
            </p>
            <div className='mt-4 flex max-w-2xl flex-wrap items-center gap-2'>
              {selected && (
                <select
                  value={selected._id}
                  onChange={(event) => setSelectedId(event.target.value)}
                  className='h-9 max-w-56 rounded-sm border border-white/15 bg-black/25 px-3 text-xs font-medium text-white outline-none focus:ring-2 focus:ring-indigo-400/30'
                  aria-label='Report period'
                >
                  {reports.map((report) => (
                    <option
                      key={report._id}
                      value={report._id}
                      className='text-foreground bg-background'
                    >
                      {report.title}
                    </option>
                  ))}
                </select>
              )}
              <Button
                variant='outline'
                size='sm'
                disabled={!selected || busy}
                onClick={refresh}
                className='h-9 rounded-sm border-white/15 bg-black/25 text-white hover:bg-white/10 hover:text-white'
              >
                <RefreshCw
                  className={`h-4 w-4 ${busy ? "animate-spin" : ""}`}
                />{" "}
                Refresh
              </Button>
              <Button
                size='sm'
                onClick={openCreate}
                className='h-9 rounded-sm bg-indigo-600 text-white hover:bg-indigo-700'
              >
                <Plus className='h-4 w-4' /> New period
              </Button>
            </div>
          </div>

          <div className='hidden rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-black/5 sm:block dark:bg-zinc-950/95 dark:shadow-none dark:ring-white/10'>
            <div className='flex items-center justify-between gap-3 border-b border-black/5 pb-3 dark:border-white/10'>
              <div className='flex min-w-0 items-center gap-3'>
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-black/5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10'>
                  <BarChart3 className='h-4 w-4' />
                </div>
                <div className='min-w-0'>
                  <p className='truncate text-sm font-medium'>
                    {selected?.title || "Brand metrics"}
                  </p>
                  <p className='text-muted-foreground truncate text-xs'>
                    {selected
                      ? `${formatDate(selected.periodStart)} — ${formatDate(selected.periodEnd)}`
                      : "No reporting period"}
                  </p>
                </div>
              </div>
              <span className='inline-flex shrink-0 items-center gap-1.5 rounded-sm bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-700 ring-1 ring-indigo-500/15 dark:text-indigo-400'>
                <span className='h-1.5 w-1.5 rounded-sm bg-indigo-500' />
                {selected ? `${selected.score}/100` : "No score"}
              </span>
            </div>
            <div className='mt-3 grid grid-cols-3 gap-2'>
              {[
                {
                  label: "Identity",
                  value: `${selected?.metrics.identityCompleteness || 0}%`,
                },
                {
                  label: "Consistency",
                  value: `${selected?.metrics.consistency || 0}%`,
                },
                {
                  label: "Channels",
                  value: selected?.metrics.platforms.length || 0,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className='rounded-sm bg-black/[0.025] px-3 py-2.5 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10'
                >
                  <p className='text-muted-foreground truncate text-[11px]'>
                    {item.label}
                  </p>
                  <p className='mt-0.5 text-lg font-semibold'>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {!selected ? (
        <div className='flex min-h-[460px] flex-col items-center justify-center rounded-2xl border border-dashed text-center'>
          <BarChart3 className='h-8 w-8 text-indigo-500' />
          <h2 className='mt-4 font-semibold'>No brand metrics yet</h2>
          <p className='text-muted-foreground mt-1 max-w-sm text-sm'>
            Create a reporting period to calculate brand health and channel
            performance.
          </p>
          <Button onClick={openCreate} className='mt-5 rounded-md'>
            Create report
          </Button>
        </div>
      ) : (
        <>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <CalendarDays className='h-3.5 w-3.5' />
            {formatDate(selected.periodStart)} —{" "}
            {formatDate(selected.periodEnd)}
          </div>

          <div className='grid grid-cols-2 gap-2 lg:grid-cols-4'>
            {[
              {
                label: "Brand score",
                value: `${selected.score}/100`,
                icon: Target,
                accent: true,
              },
              {
                label: "Total reach",
                value: compact(
                  (selected.metrics.impressions || 0) +
                    (selected.metrics.views || 0)
                ),
                icon: Eye,
              },
              {
                label: "Engagement",
                value: compact(selected.metrics.engagement || 0),
                icon: Activity,
              },
              {
                label: "Engagement rate",
                value: `${selected.metrics.engagementRate || 0}%`,
                icon: TrendingUp,
              },
            ].map(({ label, value, icon: Icon, accent }) => (
              <div
                key={label}
                className='rounded-xl border border-black/5 bg-white p-3 dark:border-white/10 dark:bg-zinc-950'
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    accent
                      ? 'text-indigo-600 bg-indigo-500/10'
                      : 'text-zinc-500 bg-black/[0.03] dark:text-zinc-400 dark:bg-white/[0.04]'
                  }`}
                >
                  <Icon className='h-3.5 w-3.5' />
                </span>
                <p className='mt-2.5 text-xl font-bold tracking-tight'>
                  {value}
                </p>
                <p className='text-muted-foreground mt-0.5 text-[11px]'>{label}</p>
              </div>
            ))}
          </div>

          <div className='grid gap-3 xl:grid-cols-[1.45fr_.85fr]'>
            <ChartCard
              title='Brand health trend'
              description='Score, consistency, and audience response across report periods.'
            >
              <div className='h-60'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={trendData} margin={{ left: -18, right: 8 }}>
                    <defs>
                      <linearGradient
                        id='scoreFill'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop
                          offset='5%'
                          stopColor='#4f46e5'
                          stopOpacity={0.28}
                        />
                        <stop
                          offset='95%'
                          stopColor='#4f46e5'
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      vertical={false}
                      stroke='currentColor'
                      opacity={0.08}
                    />
                    <XAxis
                      dataKey='name'
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        borderColor: "rgba(0,0,0,.08)",
                        fontSize: 12,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area
                      type='monotone'
                      dataKey='score'
                      name='Brand score'
                      stroke='#4f46e5'
                      strokeWidth={2.5}
                      fill='url(#scoreFill)'
                    />
                    <Area
                      type='monotone'
                      dataKey='consistency'
                      name='Consistency'
                      stroke='#10b981'
                      strokeWidth={2}
                      fill='transparent'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title='Content mix'
              description='The formats contributing to this reporting period.'
            >
              <div className='h-60'>
                {contentMix.length ? (
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={contentMix}
                        dataKey='value'
                        nameKey='name'
                        innerRadius={62}
                        outerRadius={96}
                        paddingAngle={3}
                      >
                        {contentMix.map((item, index) => (
                          <Cell
                            key={item.name}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          borderColor: "rgba(0,0,0,.08)",
                          fontSize: 12,
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className='text-muted-foreground flex h-full items-center justify-center text-sm'>
                    No content data
                  </div>
                )}
              </div>
            </ChartCard>
          </div>

          <div className='grid gap-3 xl:grid-cols-2'>
            <ChartCard
              title='Audience performance'
              description='Reach and engagement actions recorded across connected channels.'
            >
              <div className='h-60'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={audienceData}
                    margin={{ left: -18, right: 8 }}
                  >
                    <CartesianGrid
                      strokeDasharray='3 3'
                      vertical={false}
                      stroke='currentColor'
                      opacity={0.08}
                    />
                    <XAxis
                      dataKey='name'
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                      tickFormatter={compact}
                    />
                    <Tooltip
                      formatter={(value) => Number(value).toLocaleString()}
                      contentStyle={{
                        borderRadius: 12,
                        borderColor: "rgba(0,0,0,.08)",
                        fontSize: 12,
                      }}
                    />
                    <Bar
                      dataKey='value'
                      name='Total'
                      radius={[6, 6, 0, 0]}
                      fill='#4f46e5'
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title='Channel performance'
              description='Reach and engagement contribution by platform.'
            >
              <div className='h-60'>
                {channelData.length ? (
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                      data={channelData}
                      layout='vertical'
                      margin={{ left: 8, right: 8 }}
                    >
                      <CartesianGrid
                        strokeDasharray='3 3'
                        horizontal={false}
                        stroke='currentColor'
                        opacity={0.08}
                      />
                      <XAxis
                        type='number'
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                        tickFormatter={compact}
                      />
                      <YAxis
                        type='category'
                        dataKey='channel'
                        axisLine={false}
                        tickLine={false}
                        width={76}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip
                        formatter={(value) => Number(value).toLocaleString()}
                        contentStyle={{
                          borderRadius: 12,
                          borderColor: "rgba(0,0,0,.08)",
                          fontSize: 12,
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar
                        dataKey='reach'
                        name='Reach'
                        fill='#4f46e5'
                        radius={[0, 5, 5, 0]}
                      />
                      <Bar
                        dataKey='engagement'
                        name='Engagement'
                        fill='#818cf8'
                        radius={[0, 5, 5, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className='text-muted-foreground flex h-full items-center justify-center text-sm'>
                    Connect and publish to a channel to compare performance.
                  </div>
                )}
              </div>
            </ChartCard>
          </div>
        </>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>New reporting period</DialogTitle>
            <DialogDescription>
              Choose the date range used to calculate brand and channel metrics.
            </DialogDescription>
          </DialogHeader>
          <div className='grid grid-cols-2 gap-3'>
            <label className='text-muted-foreground text-xs'>
              From
              <Input
                className='mt-1'
                type='date'
                value={period.periodStart}
                onChange={(event) =>
                  setPeriod({ ...period, periodStart: event.target.value })
                }
              />
            </label>
            <label className='text-muted-foreground text-xs'>
              To
              <Input
                className='mt-1'
                type='date'
                value={period.periodEnd}
                onChange={(event) =>
                  setPeriod({ ...period, periodEnd: event.target.value })
                }
              />
            </label>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={busy || !period.periodStart || !period.periodEnd}
              onClick={createReport}
            >
              {busy && <LoadingFileLoader />}Generate metrics
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
