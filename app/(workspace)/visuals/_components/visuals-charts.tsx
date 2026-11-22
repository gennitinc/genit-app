"use client";

import { LocalizedText } from "@/components/localized-text";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type Activity = {
  name: string;
  Drafted: number;
  Published: number;
  Projects: number;
  Engagement: number;
};

type MetricKey = keyof Omit<Activity, "name">;

const METRICS: MetricKey[] = ["Projects", "Published", "Engagement", "Drafted"];

/** The one accent on the board: the activity line. Everything else is neutral. */
const ACCENT = "#6366f1";

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  color: "var(--popover-foreground)",
  fontSize: 12,
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat(undefined, {
    notation: value >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);

/**
 * Change over the most recent half of the range against the half before it.
 * Shown only when each half covers at least a week.
 */
function trend(values: number[]) {
  const half = Math.floor(values.length / 2);
  if (half < 7) return null;
  const sum = (list: number[]) => list.reduce((total, value) => total + value, 0);
  const recent = sum(values.slice(-half));
  const before = sum(values.slice(-2 * half, -half));
  if (before === 0) return recent === 0 ? { change: 0, days: half } : null;
  return { change: (recent - before) / before, days: half };
}

/** Long ranges are summed into at most `max` periods so the curve reads as a trend. */
function bucket(data: Activity[], max: number) {
  const size = Math.max(1, Math.ceil(data.length / max));
  if (size === 1) return data;
  const buckets: Activity[] = [];
  for (let start = 0; start < data.length; start += size) {
    const slice = data.slice(start, start + size);
    const total = (key: MetricKey) =>
      slice.reduce((sum, day) => sum + day[key], 0);
    buckets.push({
      name:
        slice.length > 1
          ? `${slice[0].name} – ${slice[slice.length - 1].name}`
          : slice[0].name,
      Drafted: total("Drafted"),
      Published: total("Published"),
      Projects: total("Projects"),
      Engagement: total("Engagement"),
    });
  }
  return buckets;
}

function Delta({ values }: { values: number[] }) {
  const result = trend(values);
  if (!result) return <p className='h-4' />;
  const percent = Math.round(result.change * 100);
  return (
    <p className='flex h-4 items-center gap-1 text-xs tabular-nums'>
      <span className='font-medium text-zinc-900 dark:text-white'>
        {percent > 0 ? "↑" : percent < 0 ? "↓" : ""} {Math.abs(percent)}%
      </span>
      <span className='text-zinc-400 dark:text-white/40'>
        vs prior {result.days}d
      </span>
    </p>
  );
}

function Kpi({
  label,
  value,
  dataKey,
  data,
  caption,
}: {
  label: string;
  value?: number;
  dataKey?: MetricKey;
  data: Activity[];
  caption?: string;
}) {
  const values = dataKey ? data.map((day) => day[dataKey]) : [];
  const sparkData = useMemo(() => bucket(data, 15), [data]);
  return (
    <div className='flex min-w-0 flex-col gap-1.5 p-5'>
      <p className='text-[13px] font-medium text-zinc-500 dark:text-white/55'>
        <LocalizedText text={label} />
      </p>
      <p className='text-3xl leading-tight font-semibold tracking-tight tabular-nums'>
        {value === undefined ? "—" : formatNumber(value)}
      </p>
      {dataKey ? (
        <Delta values={values} />
      ) : (
        <p className='h-4 text-xs text-zinc-400 dark:text-white/40'>
          {caption ? <LocalizedText text={caption} /> : null}
        </p>
      )}
      <div className='mt-2 h-9'>
        {dataKey && values.some(Boolean) ? (
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={sparkData}
              margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
            >
              <YAxis hide domain={[0, "dataMax"]} />
              <Line
                type='monotone'
                dataKey={dataKey}
                stroke='currentColor'
                className='text-zinc-400 dark:text-white/40'
                strokeWidth={1.75}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </div>
  );
}

/**
 * The home dashboard: four headline numbers in one ruled panel, and an
 * activity chart showing one metric at a time. Neutral tones throughout;
 * the accent appears only on the chart line.
 */
export default function VisualsCharts({
  activityData,
  stats,
  channels,
}: {
  activityData: Activity[];
  stats?: { drafted?: number; activeProjects?: number; engagement?: number };
  channels?: number;
}) {
  const [metric, setMetric] = useState<MetricKey>("Projects");
  const chartData = useMemo(() => bucket(activityData, 16), [activityData]);
  const total = activityData.reduce((sum, day) => sum + day[metric], 0);
  const range =
    activityData.length > 1
      ? `${activityData[0].name} – ${activityData[activityData.length - 1].name}`
      : activityData[0]?.name;
  const panel =
    "rounded-xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-[#0b0b0b]";

  return (
    <>
      {/* A 1px gap over a border-colored backdrop draws the dividers at every breakpoint. */}
      <div className='grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 xl:grid-cols-4 dark:border-white/10 dark:bg-white/10 [&>*]:bg-white dark:[&>*]:bg-[#0b0b0b]'>
        <Kpi
          label='Posts drafted'
          value={stats?.drafted}
          dataKey='Drafted'
          data={activityData}
        />
        <Kpi
          label='Active projects'
          value={stats?.activeProjects}
          dataKey='Projects'
          data={activityData}
        />
        <Kpi
          label='Engagement'
          value={stats?.engagement}
          dataKey='Engagement'
          data={activityData}
        />
        <Kpi
          label='Channels'
          value={channels}
          caption='Ready to publish'
          data={activityData}
        />
      </div>

      <section className={`${panel} mt-4 p-5`}>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-[13px] font-medium text-zinc-500 dark:text-white/55'>
              <LocalizedText text={"Activity"} />
            </p>
            <p className='mt-1 flex items-baseline gap-2'>
              <span className='text-3xl font-semibold tracking-tight tabular-nums'>
                {formatNumber(total)}
              </span>
              <span className='text-sm text-zinc-500 dark:text-white/50'>
                {metric.toLowerCase()} · {range}
              </span>
            </p>
          </div>
          <div
            role='tablist'
            aria-label='Metric'
            className='flex border-b border-zinc-200 dark:border-white/10'
          >
            {METRICS.map((key) => {
              const active = key === metric;
              return (
                <button
                  key={key}
                  type='button'
                  role='tab'
                  aria-selected={active}
                  onClick={() => setMetric(key)}
                  className={[
                    "-mb-px border-b-2 px-3 pb-2 text-[13px] transition-colors",
                    active
                      ? "border-zinc-900 font-semibold text-zinc-900 dark:border-white dark:text-white"
                      : "border-transparent font-medium text-zinc-500 hover:text-zinc-900 dark:text-white/50 dark:hover:text-white",
                  ].join(" ")}
                >
                  <LocalizedText text={key} />
                </button>
              );
            })}
          </div>
        </div>

        <div className='mt-6 h-[320px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={chartData}
              margin={{ left: -16, right: 8, top: 8, bottom: 0 }}
            >
              <defs>
                <linearGradient id='activityArea' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor={ACCENT} stopOpacity={0.18} />
                  <stop offset='100%' stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey='name'
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickFormatter={(name: string) => name.split(" – ")[0]}
                axisLine={false}
                tickLine={false}
                minTickGap={32}
                tickMargin={10}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                tickCount={5}
                width={48}
                tickFormatter={formatNumber}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{
                  color: "var(--popover-foreground)",
                  fontSize: 12,
                  marginBottom: 2,
                }}
                itemStyle={{ color: "var(--popover-foreground)", fontSize: 12 }}
                cursor={{ stroke: "var(--border)" }}
              />
              <Area
                type='monotone'
                dataKey={metric}
                stroke={ACCENT}
                strokeWidth={2.25}
                fill='url(#activityArea)'
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: ACCENT }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}
