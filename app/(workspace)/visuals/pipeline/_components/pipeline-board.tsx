"use client";

import {
  STAGE_DOT,
  formatMoney,
  formatSlot,
  leadStage,
  pipelineKeys,
  relativeTime,
} from "./pipeline-utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntegrations } from "@/hooks/use-integrations";
import { campaignError } from "@/lib/campaign-utils";
import {
  LEAD_STAGES,
  type LeadStage,
  type PipelineLead,
  SOURCE_LABEL,
  STAGE_LABEL,
  updatePipelineLead,
} from "@/lib/pipeline-api";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarCheck, Clock, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function PipelineBoard({
  leads,
  loading,
  searching,
  onOpen,
  onSetup,
}: {
  leads: PipelineLead[];
  loading: boolean;
  searching: boolean;
  onOpen: (id: string) => void;
  onSetup: () => void;
}) {
  const { orgId } = useIntegrations();
  const queryClient = useQueryClient();
  const [dragOver, setDragOver] = useState<LeadStage | null>(null);

  const move = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: LeadStage }) => updatePipelineLead(id, { stage }),
    onMutate: async ({ id, stage }) => {
      await queryClient.cancelQueries({ queryKey: pipelineKeys.all(orgId) });
      const snapshots = queryClient.getQueriesData<PipelineLead[]>({ queryKey: [...pipelineKeys.all(orgId), "list"] });
      for (const [key, data] of snapshots)
        queryClient.setQueryData(key, data?.map((lead) => (lead._id === id ? { ...lead, stage } : lead)));
      return { snapshots };
    },
    onError: (error, _vars, context) => {
      for (const [key, data] of context?.snapshots || []) queryClient.setQueryData(key, data);
      toast.error(campaignError(error, "Could not move lead"));
    },
    onSettled: () => void queryClient.invalidateQueries({ queryKey: pipelineKeys.all(orgId) }),
  });

  if (loading)
    return (
      <div className='grid gap-3 md:grid-cols-3 xl:grid-cols-6'>
        {LEAD_STAGES.map((stage) => (
          <Skeleton key={stage} className='h-64' />
        ))}
      </div>
    );

  if (!leads.length && !searching)
    return (
      <div className='border-t py-16'>
        <h2 className='text-base font-semibold'>No leads yet</h2>
        <p className='text-muted-foreground mt-1 max-w-lg text-sm'>
          New conversations in your inbox, website form submissions and Meta lead ads land here automatically.
          Pick your industry and connect a calendar so Genit can qualify enquiries and book them in.
        </p>
        <Button className='mt-5' onClick={onSetup}>
          <Settings2 /> Set up the sales agent
        </Button>
      </div>
    );

  const byStage = Object.fromEntries(LEAD_STAGES.map((stage) => [stage, [] as PipelineLead[]])) as Record<
    LeadStage,
    PipelineLead[]
  >;
  for (const lead of leads) byStage[leadStage(lead)].push(lead);

  return (
    <div className='flex snap-x gap-3 overflow-x-auto pt-0.5 pb-2'>
      {LEAD_STAGES.map((stage) => {
        const items = byStage[stage];
        const value = items.reduce((sum, lead) => sum + (lead.dealValue || 0), 0);
        return (
          <section
            key={stage}
            aria-label={STAGE_LABEL[stage]}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(stage);
            }}
            onDragLeave={() => setDragOver((current) => (current === stage ? null : current))}
            onDrop={(event) => {
              event.preventDefault();
              setDragOver(null);
              const id = event.dataTransfer.getData("text/lead-id");
              const lead = leads.find((item) => item._id === id);
              if (lead && leadStage(lead) !== stage) move.mutate({ id, stage });
            }}
            className={cn(
              "flex w-64 shrink-0 snap-start flex-col rounded-lg bg-zinc-50 p-2 transition-colors dark:bg-white/[0.03]",
              dragOver === stage && "ring-2 ring-sky-400/60"
            )}
          >
            <header className='flex items-baseline justify-between px-1.5 pt-1 pb-2'>
              <h2 className='flex items-center gap-1.5 text-xs font-semibold'>
                <span aria-hidden className={cn("size-1.5 rounded-full", STAGE_DOT[stage])} />
                {STAGE_LABEL[stage]}
                <span className='text-muted-foreground font-normal tabular-nums'>{items.length}</span>
              </h2>
              {value > 0 && (
                <span className='text-muted-foreground text-[11px] tabular-nums'>
                  {formatMoney(value, items.find((l) => l.currency)?.currency)}
                </span>
              )}
            </header>
            <ol className='flex min-h-24 flex-col gap-1.5'>
              {items.map((lead) => (
                <li key={lead._id}>
                  <LeadCard lead={lead} onOpen={() => onOpen(lead._id)} />
                </li>
              ))}
              {!items.length && (
                <li className='text-muted-foreground px-1.5 py-6 text-center text-[11px]'>
                  {searching ? "No matches" : "Drop a lead here"}
                </li>
              )}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

function LeadCard({ lead, onOpen }: { lead: PipelineLead; onOpen: () => void }) {
  const stage = leadStage(lead);
  const answered = Object.keys(lead.qualification?.answers || {}).length;
  const missing = lead.qualification?.missing?.length || 0;
  return (
    <button
      type='button'
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/lead-id", lead._id);
        event.dataTransfer.effectAllowed = "move";
      }}
      onClick={onOpen}
      className='bg-background w-full cursor-grab rounded-md border p-2.5 text-left shadow-xs transition-shadow hover:shadow-sm focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none active:cursor-grabbing'
    >
      <div className='flex items-start justify-between gap-2'>
        <p className='truncate text-sm font-medium'>{lead.fullName}</p>
        {lead.score > 0 && (
          <span
            className='text-muted-foreground shrink-0 text-[11px] tabular-nums'
            title='Lead score from qualification answers and intent'
          >
            {lead.score}
          </span>
        )}
      </div>
      <p className='text-muted-foreground mt-0.5 truncate text-xs'>
        {lead.qualification?.summary || SOURCE_LABEL[lead.source] || lead.source}
        {lead.channel && lead.qualification?.summary ? "" : lead.channel ? ` · ${lead.channel}` : ""}
      </p>
      <div className='text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]'>
        {stage === "booked" && lead.booking?.start ? (
          <span className='inline-flex items-center gap-1 text-amber-700 dark:text-amber-400'>
            <CalendarCheck className='size-3' />
            {formatSlot(lead.booking.start)}
          </span>
        ) : (
          (answered > 0 || missing > 0) &&
          !["won", "lost"].includes(stage) && (
            <span title='Qualifying questions answered'>
              {answered}/{answered + missing} answered
            </span>
          )
        )}
        {lead.followUp?.nextAt && (
          <span className='inline-flex items-center gap-1' title='Next automatic follow-up'>
            <Clock className='size-3' />
            {relativeTime(lead.followUp.nextAt)}
          </span>
        )}
        {lead.dealValue ? <span className='tabular-nums'>{formatMoney(lead.dealValue, lead.currency)}</span> : null}
        {lead.agentSkippedReason === "plan_limit" && (
          <span className='text-red-600 dark:text-red-400' title='Over this month’s AI lead limit for your plan'>
            Not worked by AI
          </span>
        )}
      </div>
    </button>
  );
}
