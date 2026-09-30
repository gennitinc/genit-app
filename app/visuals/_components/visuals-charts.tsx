"use client";

import { LocalizedText } from "@/components/localized-text";
import type { LucideIcon } from "lucide-react";
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

type Activity = {
  name: string;
  Drafted: number;
  Published: number;
  Projects: number;
  Channels: number;
  Engagement: number;
};

type StatCard = {
  label: string;
  value: string | number;
  detail: string;
  Icon: LucideIcon;
  dataKey: keyof Omit<Activity, "name">;
  color: string;
};

export default function VisualsCharts({
  activityData,
  statCards,
}: {
  activityData: Activity[];
  statCards: StatCard[];
}) {
  const tooltipStyle = {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--popover-foreground)",
    fontSize: 12,
  };

  return (
    <>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        {statCards.map(({ label, value, detail, Icon, dataKey, color }) => (
          <section
            key={label}
            className='rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'
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
                      contentStyle={tooltipStyle}
                      labelStyle={{
                        color: "var(--popover-foreground)",
                        fontSize: 12,
                      }}
                      itemStyle={{
                        color: "var(--popover-foreground)",
                        fontSize: 12,
                      }}
                      cursor={{ stroke: "var(--border)" }}
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

      <section className='mt-5 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
        <div>
          <h2 className='text-base font-semibold'>
            <LocalizedText text={"Content activity"} />
          </h2>
          <p className='mt-1 text-sm text-zinc-500 dark:text-white/55'>
            <LocalizedText
              text={"Posts drafted vs posts published in selected range"}
            />
          </p>
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
              <CartesianGrid stroke='var(--border)' vertical={false} />
              <XAxis
                dataKey='name'
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{
                  color: "var(--popover-foreground)",
                  fontSize: 12,
                }}
                itemStyle={{
                  color: "var(--popover-foreground)",
                  fontSize: 12,
                }}
                cursor={{ stroke: "var(--border)" }}
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
            <LocalizedText text={"Drafted"} />
          </span>
          <span className='flex items-center gap-2'>
            <span className='h-2 w-2 rounded-sm bg-sky-400' />
            <LocalizedText text={"Published"} />
          </span>
        </div>
      </section>
    </>
  );
}
