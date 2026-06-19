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
import {
  Activity,
  BarChart3,
  CalendarDays,
  Eye,
  Loader2,
  Plus,
  RefreshCw,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function compact(value: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value || 0);
}

function errorMessage(error: any) {
  return error?.response?.data?.message || error?.message || "Something went wrong";
}

function ChartCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className='rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950'>
      <div className='mb-5'>
        <h2 className='text-sm font-semibold'>{title}</h2>
        <p className='mt-1 text-xs text-muted-foreground'>{description}</p>
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
      .catch((error) => toast({ title: "Could not load brand metrics", description: errorMessage(error), variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [toast]);

  const trendData = useMemo(
    () => [...reports].reverse().map((report) => ({
      name: new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(report.periodEnd)),
      score: report.score,
      consistency: report.metrics.consistency || 0,
      engagementRate: report.metrics.engagementRate || 0,
    })),
    [reports]
  );

  const channelData = useMemo(() => {
    if (!selected) return [];
    const channels = new Map<string, { channel: string; posts: number; reach: number; engagement: number }>();
    for (const platform of selected.metrics.platforms || []) {
      channels.set(platform, { channel: platform, posts: 0, reach: 0, engagement: 0 });
    }
    for (const work of selected.work || []) {
      if (!work.platform) continue;
      const item = channels.get(work.platform) || { channel: work.platform, posts: 0, reach: 0, engagement: 0 };
      item.posts += 1;
      item.reach += Number(work.metrics?.impressions || work.metrics?.views || 0);
      item.engagement += Number(work.metrics?.likes || 0) + Number(work.metrics?.comments || 0) + Number(work.metrics?.shares || 0) + Number(work.metrics?.clicks || 0);
      channels.set(work.platform, item);
    }
    return [...channels.values()].map((item) => ({ ...item, channel: item.channel.charAt(0).toUpperCase() + item.channel.slice(1) }));
  }, [selected]);

  const contentMix = useMemo(
    () => selected ? Object.entries(selected.metrics.typeCounts || {}).map(([name, value]) => ({
      name: name.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
      value,
    })) : [],
    [selected]
  );

  const audienceData = selected ? [
    { name: "Impressions", value: selected.metrics.impressions || 0 },
    { name: "Views", value: selected.metrics.views || 0 },
    { name: "Likes", value: selected.metrics.likes || 0 },
    { name: "Comments", value: selected.metrics.comments || 0 },
    { name: "Shares", value: selected.metrics.shares || 0 },
    { name: "Clicks", value: selected.metrics.clicks || 0 },
  ] : [];

  const replace = (report: BrandReport) => {
    setReports((current) => [report, ...current.filter((item) => item._id !== report._id)]);
    setSelectedId(report._id);
  };

  const openCreate = () => {
    const end = new Date();
    const start = new Date(end.getTime() - 30 * 86400000);
    setPeriod({ periodStart: start.toISOString().slice(0, 10), periodEnd: end.toISOString().slice(0, 10) });
    setCreateOpen(true);
  };

  const createReport = async () => {
    setBusy(true);
    try {
      replace(await createBrandReport(period));
      setCreateOpen(false);
      toast({ title: "Brand metrics updated" });
    } catch (error) {
      toast({ title: "Could not create report", description: errorMessage(error), variant: "destructive" });
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
      toast({ title: "Could not refresh metrics", description: errorMessage(error), variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className='flex min-h-[500px] items-center justify-center'><Loader2 className='h-6 w-6 animate-spin text-indigo-500' /></div>;

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 flex w-full flex-col gap-5 pb-12 duration-500'>
      <header className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Brand analytics</h1>
          <p className='mt-1 text-sm text-muted-foreground'>Performance, audience response, and brand health in one view.</p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          {selected && (
            <select
              value={selected._id}
              onChange={(event) => setSelectedId(event.target.value)}
              className='h-9 max-w-56 rounded-md border bg-background px-3 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500/20'
              aria-label='Report period'
            >
              {reports.map((report) => <option key={report._id} value={report._id}>{report.title}</option>)}
            </select>
          )}
          <Button variant='outline' size='sm' disabled={!selected || busy} onClick={refresh} className='rounded-md'>
            <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size='sm' onClick={openCreate} className='rounded-md bg-indigo-600 text-white hover:bg-indigo-700'>
            <Plus className='h-4 w-4' /> New period
          </Button>
        </div>
      </header>

      {!selected ? (
        <div className='flex min-h-[460px] flex-col items-center justify-center rounded-2xl border border-dashed text-center'>
          <BarChart3 className='h-8 w-8 text-indigo-500' />
          <h2 className='mt-4 font-semibold'>No brand metrics yet</h2>
          <p className='mt-1 max-w-sm text-sm text-muted-foreground'>Create a reporting period to calculate brand health and channel performance.</p>
          <Button onClick={openCreate} className='mt-5 rounded-md'>Create report</Button>
        </div>
      ) : (
        <>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <CalendarDays className='h-3.5 w-3.5' />
            {formatDate(selected.periodStart)} — {formatDate(selected.periodEnd)}
          </div>

          <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
            {[
              { label: "Brand score", value: `${selected.score}/100`, icon: Target, tone: "text-indigo-600 bg-indigo-500/10" },
              { label: "Total reach", value: compact((selected.metrics.impressions || 0) + (selected.metrics.views || 0)), icon: Eye, tone: "text-cyan-600 bg-cyan-500/10" },
              { label: "Engagement", value: compact(selected.metrics.engagement || 0), icon: Activity, tone: "text-emerald-600 bg-emerald-500/10" },
              { label: "Engagement rate", value: `${selected.metrics.engagementRate || 0}%`, icon: TrendingUp, tone: "text-violet-600 bg-violet-500/10" },
            ].map(({ label, value, icon: Icon, tone }) => (
              <div key={label} className='rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950'>
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}><Icon className='h-4 w-4' /></span>
                <p className='mt-4 text-2xl font-bold tracking-tight'>{value}</p>
                <p className='mt-1 text-xs text-muted-foreground'>{label}</p>
              </div>
            ))}
          </div>

          <div className='grid gap-5 xl:grid-cols-[1.45fr_.85fr]'>
            <ChartCard title='Brand health trend' description='Score, consistency, and audience response across report periods.'>
              <div className='h-72'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={trendData} margin={{ left: -18, right: 8 }}>
                    <defs>
                      <linearGradient id='scoreFill' x1='0' y1='0' x2='0' y2='1'><stop offset='5%' stopColor='#6366f1' stopOpacity={0.28} /><stop offset='95%' stopColor='#6366f1' stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='currentColor' opacity={0.08} />
                    <XAxis dataKey='name' axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, borderColor: "rgba(0,0,0,.08)", fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type='monotone' dataKey='score' name='Brand score' stroke='#6366f1' strokeWidth={2.5} fill='url(#scoreFill)' />
                    <Area type='monotone' dataKey='consistency' name='Consistency' stroke='#10b981' strokeWidth={2} fill='transparent' />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title='Content mix' description='The formats contributing to this reporting period.'>
              <div className='h-72'>
                {contentMix.length ? (
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie data={contentMix} dataKey='value' nameKey='name' innerRadius={62} outerRadius={96} paddingAngle={3}>
                        {contentMix.map((item, index) => <Cell key={item.name} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12, borderColor: "rgba(0,0,0,.08)", fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <div className='flex h-full items-center justify-center text-sm text-muted-foreground'>No content data</div>}
              </div>
            </ChartCard>
          </div>

          <div className='grid gap-5 xl:grid-cols-2'>
            <ChartCard title='Audience performance' description='Reach and engagement actions recorded across connected channels.'>
              <div className='h-72'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={audienceData} margin={{ left: -18, right: 8 }}>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='currentColor' opacity={0.08} />
                    <XAxis dataKey='name' axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={compact} />
                    <Tooltip formatter={(value) => Number(value).toLocaleString()} contentStyle={{ borderRadius: 12, borderColor: "rgba(0,0,0,.08)", fontSize: 12 }} />
                    <Bar dataKey='value' name='Total' radius={[6, 6, 0, 0]} fill='#6366f1' />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title='Channel performance' description='Reach and engagement contribution by platform.'>
              <div className='h-72'>
                {channelData.length ? (
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={channelData} layout='vertical' margin={{ left: 8, right: 8 }}>
                      <CartesianGrid strokeDasharray='3 3' horizontal={false} stroke='currentColor' opacity={0.08} />
                      <XAxis type='number' axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={compact} />
                      <YAxis type='category' dataKey='channel' axisLine={false} tickLine={false} width={76} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value) => Number(value).toLocaleString()} contentStyle={{ borderRadius: 12, borderColor: "rgba(0,0,0,.08)", fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey='reach' name='Reach' fill='#6366f1' radius={[0, 5, 5, 0]} />
                      <Bar dataKey='engagement' name='Engagement' fill='#10b981' radius={[0, 5, 5, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <div className='flex h-full items-center justify-center text-sm text-muted-foreground'>Connect and publish to a channel to compare performance.</div>}
              </div>
            </ChartCard>
          </div>
        </>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>New reporting period</DialogTitle>
            <DialogDescription>Choose the date range used to calculate brand and channel metrics.</DialogDescription>
          </DialogHeader>
          <div className='grid grid-cols-2 gap-3'>
            <label className='text-xs text-muted-foreground'>From<Input className='mt-1' type='date' value={period.periodStart} onChange={(event) => setPeriod({ ...period, periodStart: event.target.value })} /></label>
            <label className='text-xs text-muted-foreground'>To<Input className='mt-1' type='date' value={period.periodEnd} onChange={(event) => setPeriod({ ...period, periodEnd: event.target.value })} /></label>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button disabled={busy || !period.periodStart || !period.periodEnd} onClick={createReport}>{busy && <Loader2 className='h-4 w-4 animate-spin' />}Generate metrics</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
