import type { GtmCampaign } from "@/lib/gtm-api";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/*
 * Campaign surfaces share a deliberately quiet vocabulary: hairline rules
 * instead of cards, one ruled metric strip instead of tile grids, and colour
 * reserved for status. Keep new campaign UI on these primitives.
 */

const STATUS_DOT: Record<string, string> = {
  draft: "bg-zinc-400",
  active: "bg-emerald-500",
  running: "bg-emerald-500",
  paused: "bg-amber-500",
  completed: "bg-sky-500",
  published: "bg-emerald-500",
  scheduled: "bg-sky-500",
  sent: "bg-sky-500",
  delivered: "bg-sky-500",
  read: "bg-emerald-500",
  replied: "bg-emerald-500",
  failed: "bg-red-500",
  suppressed: "bg-red-500",
};

export function StatusDot({
  status,
  className,
}: {
  status: GtmCampaign["status"] | string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs capitalize",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          STATUS_DOT[status] || STATUS_DOT.draft
        )}
      />
      {status}
    </span>
  );
}

export type Metric = {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
};

export function MetricStrip({
  metrics,
  className,
}: {
  metrics: Metric[];
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 border-y sm:grid-cols-3 lg:flex lg:divide-x",
        className
      )}
    >
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className='min-w-0 py-4 pr-4 lg:flex-1 lg:px-5 lg:first:pl-0'
        >
          <dt className='text-muted-foreground text-xs'>{metric.label}</dt>
          <dd className='mt-1 text-xl font-semibold tracking-tight tabular-nums'>
            {metric.value}
          </dd>
          {metric.hint && (
            <dd className='text-muted-foreground mt-0.5 truncate text-[11px]'>
              {metric.hint}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}

export function Section({
  title,
  meta,
  action,
  children,
  className,
}: {
  title: string;
  meta?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-t pt-5", className)}>
      <div className='mb-4 flex min-h-8 flex-wrap items-center justify-between gap-x-4 gap-y-2'>
        <div className='flex min-w-0 items-baseline gap-3'>
          <h2 className='text-sm font-semibold'>{title}</h2>
          {meta && (
            <p className='text-muted-foreground truncate text-xs'>{meta}</p>
          )}
        </div>
        {action && <div className='flex shrink-0 gap-2'>{action}</div>}
      </div>
      {children}
    </section>
  );
}

export function Empty({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className='text-muted-foreground flex flex-wrap items-center justify-between gap-3 rounded-md bg-zinc-50 px-4 py-5 text-sm dark:bg-white/[0.03]'>
      <p>{children}</p>
      {action}
    </div>
  );
}

/** Underline tab styling applied to the shared Radix Tabs primitives. */
export const tabListClass =
  "h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent p-0";
export const tabTriggerClass =
  "relative h-10 flex-none rounded-none border-0 bg-transparent px-0 text-sm font-medium text-muted-foreground shadow-none after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:after:bg-foreground";

export const tableClass = "w-full text-left text-sm";
export const theadClass =
  "text-muted-foreground border-b text-xs [&_th]:py-2 [&_th]:pr-4 [&_th]:font-normal [&_th:last-child]:pr-0";
export const rowClass =
  "border-b last:border-0 [&>td]:py-3 [&>td]:pr-4 [&>td:last-child]:pr-0 align-top";
