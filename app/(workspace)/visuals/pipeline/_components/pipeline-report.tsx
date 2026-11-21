"use client";

import { Section, rowClass, tableClass, theadClass } from "../../campaigns/_components/campaign-ui";
import { STAGE_DOT, formatMinutes, formatMoney, formatSlot, pipelineKeys } from "./pipeline-utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntegrations } from "@/hooks/use-integrations";
import { campaignError, formatCompact } from "@/lib/campaign-utils";
import { SOURCE_LABEL, STAGE_LABEL, getPipelineReport } from "@/lib/pipeline-api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const RANGES = [7, 30, 90] as const;

export function PipelineReportView({ onOpen }: { onOpen: (id: string) => void }) {
  const { orgId } = useIntegrations();
  const [days, setDays] = useState<number>(30);
  const report = useQuery({
    queryKey: pipelineKeys.report(orgId, days),
    queryFn: () => getPipelineReport(days),
    enabled: Boolean(orgId),
  });
  const r = report.data;

  if (report.isError)
    return <p className='text-sm text-red-600'>{campaignError(report.error, "The report could not be loaded")}</p>;
  if (!r) return <Skeleton className='h-96' />;

  const top = Math.max(1, r.steps[0]?.count || 0);
  const peak = Math.max(1, ...r.daily.map((d) => d.captured));

  return (
    <div className={cn("space-y-8 transition-opacity", report.isFetching && "opacity-70")}>
      <div className='flex gap-1'>
        {RANGES.map((range) => (
          <button
            key={range}
            type='button'
            onClick={() => setDays(range)}
            aria-pressed={days === range}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs transition-colors",
              days === range
                ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-white/10 dark:text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Last {range} days
          </button>
        ))}
      </div>

      <Section title='Funnel' meta={`Enquiries captured in the last ${days} days and how far they got`}>
        <ol className='space-y-2'>
          {r.steps.map((step, index) => (
            <li key={step.stage} className='grid grid-cols-[9rem_1fr_7rem] items-center gap-3 text-sm'>
              <span className='flex items-center gap-1.5'>
                <span aria-hidden className={cn("size-1.5 rounded-full", STAGE_DOT[step.stage])} />
                {step.stage === "new" ? "Enquiries" : STAGE_LABEL[step.stage]}
              </span>
              <div className='h-6 rounded bg-zinc-100 dark:bg-white/5'>
                <div
                  className='h-6 rounded bg-sky-500/80 transition-[width]'
                  style={{ width: `${(step.count / top) * 100}%` }}
                />
              </div>
              <span className='text-right tabular-nums'>
                {step.count}
                {index > 0 && <span className='text-muted-foreground ml-1.5 text-xs'>{step.fromPrevious}%</span>}
              </span>
            </li>
          ))}
        </ol>
        <p className='text-muted-foreground mt-3 text-xs'>
          Percentages are the share that moved on from the step above. {r.totals.lost} lost in this period.
        </p>
      </Section>

      <Section title='Daily enquiries' meta='Bars are enquiries; the highlighted part reached a booking'>
        <div className='flex h-28 items-end gap-[2px]' role='img' aria-label='Enquiries per day'>
          {r.daily.map((day) => (
            <div
              key={day.date}
              className='relative flex-1 rounded-sm bg-sky-200 dark:bg-sky-500/30'
              style={{ height: `${Math.max(2, (day.captured / peak) * 100)}%` }}
              title={`${day.date}: ${day.captured} enquiries, ${day.booked} booked`}
            >
              {day.booked > 0 && (
                <div
                  className='absolute inset-x-0 bottom-0 rounded-sm bg-sky-600'
                  style={{ height: `${(day.booked / Math.max(1, day.captured)) * 100}%` }}
                />
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section
        title='Speed to lead'
        meta='How fast each enquiry got its first reply, from the AI or a teammate'
      >
        <dl className='grid grid-cols-2 gap-4 text-sm sm:grid-cols-4'>
          <div>
            <dt className='text-muted-foreground text-xs'>Median first reply</dt>
            <dd className='text-lg font-semibold tabular-nums'>{formatMinutes(r.speedToLead.medianMinutes)}</dd>
          </div>
          <div>
            <dt className='text-muted-foreground text-xs'>Answered within 5 min</dt>
            <dd className='text-lg font-semibold tabular-nums'>{r.speedToLead.within5MinutesPct}%</dd>
          </div>
          <div>
            <dt className='text-muted-foreground text-xs'>Answered</dt>
            <dd className='text-lg font-semibold tabular-nums'>{r.speedToLead.responded}</dd>
          </div>
          <div>
            <dt className='text-muted-foreground text-xs'>Never answered</dt>
            <dd className='text-lg font-semibold tabular-nums'>{r.speedToLead.unanswered}</dd>
          </div>
        </dl>
      </Section>

      <Section title='By source'>
        {r.bySource.length ? (
          <div className='overflow-x-auto'>
            <table className={cn(tableClass, "min-w-[560px]")}>
              <thead className={theadClass}>
                <tr>
                  <th>Source</th>
                  <th className='w-24 text-right'>Enquiries</th>
                  <th className='w-24 text-right'>Qualified</th>
                  <th className='w-24 text-right'>Booked</th>
                  <th className='w-24 text-right'>Won</th>
                  <th className='w-28 text-right'>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {r.bySource.map((row) => (
                  <tr key={row.name} className={rowClass}>
                    <td>{SOURCE_LABEL[row.name] || row.name}</td>
                    <td className='text-right tabular-nums'>{row.captured}</td>
                    <td className='text-right tabular-nums'>{row.qualified}</td>
                    <td className='text-right tabular-nums'>
                      {row.booked} <span className='text-muted-foreground text-xs'>{row.bookingRate}%</span>
                    </td>
                    <td className='text-right tabular-nums'>{row.won}</td>
                    <td className='text-right tabular-nums'>{formatCompact(row.wonValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='text-muted-foreground text-sm'>No enquiries in this period.</p>
        )}
      </Section>

      <Section title='Open pipeline' meta='All leads, not only this period'>
        <dl className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6'>
          {(["new", "engaged", "qualified", "booked", "won", "lost"] as const).map((stage) => (
            <div key={stage}>
              <dt className='text-muted-foreground flex items-center gap-1.5 text-xs'>
                <span aria-hidden className={cn("size-1.5 rounded-full", STAGE_DOT[stage])} />
                {STAGE_LABEL[stage]}
              </dt>
              <dd className='text-lg font-semibold tabular-nums'>{r.pipeline[stage]?.count || 0}</dd>
              {!!r.pipeline[stage]?.value && (
                <dd className='text-muted-foreground text-xs tabular-nums'>{formatMoney(r.pipeline[stage]!.value)}</dd>
              )}
            </div>
          ))}
        </dl>
      </Section>

      <Section title='Upcoming bookings'>
        {r.upcomingBookings.length ? (
          <ul className='divide-y border-y text-sm'>
            {r.upcomingBookings.map((lead) => (
              <li key={lead._id}>
                <button
                  type='button'
                  onClick={() => onOpen(lead._id)}
                  className='flex w-full items-center justify-between gap-3 py-2.5 text-left hover:bg-zinc-50 dark:hover:bg-white/[0.03]'
                >
                  <span className='truncate font-medium'>{lead.fullName}</span>
                  <span className='text-muted-foreground shrink-0 text-xs'>
                    {lead.booking ? formatSlot(lead.booking.start, lead.booking.timezone) : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-muted-foreground text-sm'>Nothing booked yet.</p>
        )}
      </Section>
    </div>
  );
}
