"use client";

import { Section, rowClass, tableClass, theadClass } from "./campaign-ui";
import { Button } from "@/components/ui/button";
import { campaignReadiness, formatCompact } from "@/lib/campaign-utils";
import type { GtmCampaign } from "@/lib/gtm-api";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type Props = {
  campaign: GtmCampaign;
  linkedPosts: number;
  onNavigate: (tab: "content" | "performance" | "outreach") => void;
};

const NEXT_STEP = {
  content: { tab: "content", copy: "Link the first post to this campaign" },
  outreach: { tab: "outreach", copy: "Set up email or message outreach" },
  tracking: { tab: "performance", copy: "Start tracking conversions" },
} as const;

export function CampaignOverview({ campaign, linkedPosts, onNavigate }: Props) {
  const readiness = campaignReadiness(campaign, linkedPosts);
  const next =
    readiness.next && readiness.next.id in NEXT_STEP
      ? NEXT_STEP[readiness.next.id as keyof typeof NEXT_STEP]
      : undefined;
  const brief = [
    ["Objective", campaign.objective],
    ["Audience", campaign.audience],
    ["Offer", campaign.offer],
    ["Success metric", campaign.successMetric],
    ["Timeline", campaign.timeline],
    ["Budget", campaign.budget ? formatCompact(campaign.budget) : undefined],
    ["Channels", campaign.channels.join(", ")],
  ].filter((item): item is [string, string] => Boolean(item[1]));
  const calendar = [...campaign.plan.calendar].sort((a, b) => a.day - b.day);

  return (
    <div className='space-y-8'>
      {next && (
        <div className='flex flex-wrap items-center justify-between gap-3 rounded-md bg-zinc-50 px-4 py-3 dark:bg-white/[0.03]'>
          <p className='text-sm'>
            <span className='text-muted-foreground'>
              {readiness.completed} of {readiness.steps.length} set up ·{" "}
            </span>
            Next: {next.copy}
          </p>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => onNavigate(next.tab)}
            className='-mr-2'
          >
            Continue <ArrowRight />
          </Button>
        </div>
      )}

      <div className='grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_300px]'>
        <div className='min-w-0 space-y-10'>
          {campaign.plan.summary && (
            <p className='max-w-prose text-[15px] leading-7 whitespace-pre-line'>
              {campaign.plan.summary}
            </p>
          )}

          {campaign.plan.funnel.length > 0 && (
            <Section
              title='Funnel'
              meta={`${campaign.plan.funnel.length} stages`}
            >
              <ol className='divide-y'>
                {campaign.plan.funnel.map((stage, index) => (
                  <li
                    key={`${stage.stage}-${index}`}
                    className='grid grid-cols-[2rem_minmax(0,1fr)] gap-y-1 py-4 first:pt-0'
                  >
                    <span className='text-muted-foreground text-sm tabular-nums'>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className='text-sm font-medium'>{stage.stage}</p>
                      {stage.goal && (
                        <p className='text-muted-foreground mt-0.5 text-sm'>
                          {stage.goal}
                        </p>
                      )}
                      {stage.actions.length > 0 && (
                        <ul className='mt-2 space-y-1 text-sm'>
                          {stage.actions.map((action) => (
                            <li
                              key={action}
                              className='before:text-muted-foreground flex gap-2 before:content-["–"]'
                            >
                              {action}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {calendar.length > 0 && (
            <Section title='Calendar' meta='Planned actions by campaign day'>
              <div className='overflow-x-auto'>
                <table className={cn(tableClass, "min-w-[480px]")}>
                  <thead className={theadClass}>
                    <tr>
                      <th className='w-16'>Day</th>
                      <th className='w-32'>Channel</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calendar.map((item, index) => (
                      <tr key={`${item.day}-${index}`} className={rowClass}>
                        <td className='text-muted-foreground tabular-nums'>
                          {item.day}
                        </td>
                        <td className='capitalize'>{item.channel}</td>
                        <td>{item.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {campaign.research?.summary && (
            <Section title='Research'>
              <p className='text-muted-foreground max-w-prose text-sm leading-6 whitespace-pre-line'>
                {campaign.research.summary}
              </p>
              {campaign.research.sources.length > 0 && (
                <ul className='mt-4 divide-y border-t'>
                  {campaign.research.sources.map((source) => (
                    <li key={source.url} className='py-3'>
                      <a
                        href={source.url}
                        target='_blank'
                        rel='noreferrer'
                        className='group inline-flex items-center gap-1 text-sm font-medium'
                      >
                        <span className='group-hover:underline'>
                          {source.title}
                        </span>
                        <ArrowUpRight className='text-muted-foreground size-3' />
                      </a>
                      {source.insight && (
                        <p className='text-muted-foreground mt-0.5 text-sm'>
                          {source.insight}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          )}
        </div>

        <aside className='space-y-8 lg:border-l lg:pl-8'>
          <dl className='space-y-4'>
            {brief.map(([label, value]) => (
              <div key={label}>
                <dt className='text-muted-foreground text-xs'>{label}</dt>
                <dd
                  className={cn(
                    "mt-0.5 text-sm leading-6 whitespace-pre-line",
                    label === "Channels" && "capitalize"
                  )}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          {campaign.plan.kpis.length > 0 && (
            <div>
              <p className='text-muted-foreground text-xs'>KPIs</p>
              <ul className='mt-1.5 space-y-1 text-sm'>
                {campaign.plan.kpis.map((kpi) => (
                  <li key={kpi}>{kpi}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
