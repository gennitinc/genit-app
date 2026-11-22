"use client";

import {
  STAGE_DOT,
  STOP_REASON,
  formatMinutes,
  formatSlot,
  leadStage,
  pipelineKeys,
  relativeTime,
} from "./pipeline-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useIntegrations } from "@/hooks/use-integrations";
import { campaignError } from "@/lib/campaign-utils";
import {
  LEAD_STAGES,
  type LeadPatch,
  type LeadStage,
  SOURCE_LABEL,
  STAGE_LABEL,
  getPipelineLead,
  updatePipelineLead,
} from "@/lib/pipeline-api";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { Message02Icon, CalendarCheckIn01Icon, LinkSquare02Icon, BotIcon, UserIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { toast } from "sonner";
import { type ReactNode, useEffect, useState } from "react";

export function LeadSheet({ leadId, onClose }: { leadId: string; onClose: () => void }) {
  const { orgId } = useIntegrations();
  const queryClient = useQueryClient();
  const detail = useQuery({
    queryKey: pipelineKeys.lead(orgId, leadId),
    queryFn: () => getPipelineLead(leadId),
    enabled: Boolean(orgId && leadId),
  });
  const lead = detail.data?.lead;
  const [draft, setDraft] = useState({ dealValue: "", notes: "", lostReason: "", answers: {} as Record<string, string> });

  useEffect(() => {
    if (!lead) return;
    setDraft({
      dealValue: lead.dealValue !== undefined && lead.dealValue !== null ? String(lead.dealValue) : "",
      notes: lead.notes || "",
      lostReason: lead.lostReason || "",
      answers: { ...(lead.qualification?.answers || {}) },
    });
  }, [lead]);

  const save = useMutation({
    mutationFn: (patch: LeadPatch) => updatePipelineLead(leadId, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: pipelineKeys.all(orgId) });
    },
    onError: (error) => toast.error(campaignError(error, "Could not update lead")),
  });

  const stage = lead ? leadStage(lead) : "new";
  const dirty =
    lead &&
    (draft.dealValue !== (lead.dealValue !== undefined && lead.dealValue !== null ? String(lead.dealValue) : "") ||
      draft.notes !== (lead.notes || "") ||
      draft.lostReason !== (lead.lostReason || "") ||
      JSON.stringify(draft.answers) !== JSON.stringify(lead.qualification?.answers || {}));

  function saveDetails() {
    const value = draft.dealValue.trim();
    if (value && (!Number.isFinite(Number(value)) || Number(value) < 0)) {
      toast.error("Deal value must be a positive number");
      return;
    }
    save.mutate(
      {
        dealValue: value ? Number(value) : null,
        notes: draft.notes,
        lostReason: draft.lostReason,
        answers: draft.answers,
      },
      { onSuccess: () => toast.success("Lead saved") }
    );
  }

  return (
    <Sheet open={Boolean(leadId)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className='flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg'>
        {!lead ? (
          <div className='space-y-3 p-6'>
            <SheetHeader>
              <SheetTitle className='sr-only'>Lead</SheetTitle>
            </SheetHeader>
            {detail.isError ? (
              <p className='text-sm text-red-600'>{campaignError(detail.error, "Lead could not be loaded")}</p>
            ) : (
              <>
                <Skeleton className='h-6 w-40' />
                <Skeleton className='h-40' />
              </>
            )}
          </div>
        ) : (
          <>
            <SheetHeader className='border-b p-6 pb-4'>
              <SheetTitle className='pr-6'>{lead.fullName}</SheetTitle>
              <SheetDescription className='text-xs'>
                {[lead.email, lead.phone].filter(Boolean).join(" · ") || "No contact details yet"}
              </SheetDescription>
              <div className='flex flex-wrap items-center gap-2 pt-2'>
                <Select
                  value={stage}
                  onValueChange={(value) => save.mutate({ stage: value as LeadStage })}
                  disabled={save.isPending}
                >
                  <SelectTrigger className='h-8 w-44 text-xs' aria-label='Stage'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STAGES.map((value) => (
                      <SelectItem key={value} value={value} className='text-xs'>
                        <span className='flex items-center gap-1.5'>
                          <span aria-hidden className={cn("size-1.5 rounded-full", STAGE_DOT[value])} />
                          {STAGE_LABEL[value]}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {lead.conversation && (
                  <Button asChild variant='outline' size='sm' className='h-8 text-xs'>
                    <Link href={`/visuals/inbox?conversation=${lead.conversation}`}>
                      <HugeiconsIcon icon={Message02Icon} /> Open in inbox
                    </Link>
                  </Button>
                )}
                {lead.score > 0 && (
                  <span className='text-muted-foreground text-xs'>Score {lead.score}/100</span>
                )}
              </div>
            </SheetHeader>

            <div className='space-y-6 p-6'>
              {lead.booking?.status === "booked" && (
                <div className='flex items-start gap-3 rounded-md bg-amber-50 p-3 text-sm dark:bg-amber-500/10'>
                  <HugeiconsIcon icon={CalendarCheckIn01Icon} className='mt-0.5 size-4 text-amber-600' />
                  <div className='min-w-0 flex-1'>
                    <p className='font-medium'>{formatSlot(lead.booking.start, lead.booking.timezone)}</p>
                    <p className='text-muted-foreground text-xs'>Booked by the AI assistant · invite sent if email known</p>
                  </div>
                  {lead.booking.eventLink && (
                    <a
                      href={lead.booking.eventLink}
                      target='_blank'
                      rel='noreferrer'
                      className='text-muted-foreground hover:text-foreground'
                      aria-label='Open calendar event'
                    >
                      <HugeiconsIcon icon={LinkSquare02Icon} className='size-4' />
                    </a>
                  )}
                </div>
              )}

              <Block title='Overview'>
                <dl className='grid grid-cols-2 gap-x-4 gap-y-2 text-xs'>
                  <Fact label='Source'>{SOURCE_LABEL[lead.source] || lead.source}</Fact>
                  <Fact label='Channel'>{lead.channel || "—"}</Fact>
                  <Fact label='Captured'>{new Date(lead.createdAt).toLocaleString()}</Fact>
                  <Fact label='First reply'>
                    {lead.firstResponseAt
                      ? `after ${formatMinutes((new Date(lead.firstResponseAt).getTime() - new Date(lead.createdAt).getTime()) / 60_000)}`
                      : "Not yet"}
                  </Fact>
                  <Fact label='Follow-up'>
                    {lead.followUp?.nextAt
                      ? `Next ${relativeTime(lead.followUp.nextAt)}`
                      : lead.followUp?.stoppedReason
                        ? STOP_REASON[lead.followUp.stoppedReason] || lead.followUp.stoppedReason
                        : "None planned"}
                    {lead.followUp?.count ? ` · ${lead.followUp.count} sent` : ""}
                  </Fact>
                  {lead.attribution?.utmCampaign || lead.attribution?.adId ? (
                    <Fact label='Campaign'>{lead.attribution.utmCampaign || `Ad ${lead.attribution.adId}`}</Fact>
                  ) : null}
                </dl>
                <div className='mt-3 flex gap-2'>
                  {lead.followUp?.nextAt ? (
                    <Button variant='outline' size='sm' className='h-7 text-xs' onClick={() => save.mutate({ followUp: "stop" })}>
                      Stop follow-ups
                    </Button>
                  ) : (
                    !["booked", "won", "lost"].includes(stage) && (
                      <Button variant='outline' size='sm' className='h-7 text-xs' onClick={() => save.mutate({ followUp: "resume" })}>
                        Follow up now
                      </Button>
                    )
                  )}
                </div>
                {lead.agentSkippedReason === "plan_limit" && (
                  <p className='mt-3 text-xs text-red-600 dark:text-red-400'>
                    Your plan’s monthly AI lead limit was reached, so this lead was captured but not qualified or followed up
                    automatically.
                  </p>
                )}
              </Block>

              <Block title='Qualification' meta={lead.qualification?.summary}>
                <div className='space-y-2.5'>
                  {(detail.data?.questions || []).map((question) => (
                    <div key={question.key} className='grid grid-cols-[8rem_1fr] items-center gap-2'>
                      <Label htmlFor={`answer-${question.key}`} className='text-muted-foreground text-xs font-normal'>
                        {question.label}
                        {question.required && <span aria-hidden> *</span>}
                      </Label>
                      <Input
                        id={`answer-${question.key}`}
                        value={draft.answers[question.key] || ""}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            answers: { ...current.answers, [question.key]: event.target.value },
                          }))
                        }
                        placeholder='Not known yet'
                        className='h-8 text-sm'
                      />
                    </div>
                  ))}
                </div>
              </Block>

              <Block title='Deal'>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='space-y-1'>
                    <Label htmlFor='deal-value' className='text-xs'>
                      Value{lead.currency ? ` (${lead.currency})` : ""}
                    </Label>
                    <Input
                      id='deal-value'
                      inputMode='decimal'
                      value={draft.dealValue}
                      onChange={(event) => setDraft((current) => ({ ...current, dealValue: event.target.value }))}
                      placeholder='0'
                      className='h-8 text-sm'
                    />
                  </div>
                  {stage === "lost" && (
                    <div className='space-y-1'>
                      <Label htmlFor='lost-reason' className='text-xs'>
                        Lost reason
                      </Label>
                      <Input
                        id='lost-reason'
                        value={draft.lostReason}
                        onChange={(event) => setDraft((current) => ({ ...current, lostReason: event.target.value }))}
                        className='h-8 text-sm'
                      />
                    </div>
                  )}
                </div>
                <div className='mt-3 space-y-1'>
                  <Label htmlFor='lead-notes' className='text-xs'>
                    Notes
                  </Label>
                  <Textarea
                    id='lead-notes'
                    value={draft.notes}
                    onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
                    rows={3}
                    className='text-sm'
                  />
                </div>
                <Button className='mt-3' size='sm' onClick={saveDetails} disabled={!dirty || save.isPending}>
                  {save.isPending ? "Saving…" : "Save"}
                </Button>
              </Block>

              {!!detail.data?.messages.length && (
                <Block title='Conversation' meta='Latest 50 messages'>
                  <ol className='space-y-2'>
                    {detail.data.messages.map((message) => (
                      <li
                        key={message._id}
                        className={cn(
                          "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                          message.senderType === "customer"
                            ? "bg-zinc-100 dark:bg-white/10"
                            : "ml-auto bg-sky-50 dark:bg-sky-500/10"
                        )}
                      >
                        <p className='text-muted-foreground mb-0.5 flex items-center gap-1 text-[10px]'>
                          {message.senderType === "bot" ? <HugeiconsIcon icon={BotIcon} className='size-3' /> : message.senderType === "agent" ? <HugeiconsIcon icon={UserIcon} className='size-3' /> : null}
                          {message.senderType === "customer" ? lead.fullName : message.senderType === "bot" ? "AI assistant" : "Teammate"}
                          {message.metadata?.ai?.followUp ? ` · follow-up ${message.metadata.ai.followUp}` : ""}
                          {" · "}
                          {new Date(message.createdAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}
                        </p>
                        <p className='whitespace-pre-wrap'>{message.content || "(attachment)"}</p>
                      </li>
                    ))}
                  </ol>
                </Block>
              )}

              {!!lead.stageHistory?.length && (
                <Block title='History'>
                  <ol className='space-y-1.5 text-xs'>
                    {[...lead.stageHistory].reverse().map((entry, index) => (
                      <li key={index} className='flex items-baseline gap-2'>
                        <span aria-hidden className={cn("size-1.5 shrink-0 translate-y-[-1px] rounded-full", STAGE_DOT[entry.stage])} />
                        <span className='font-medium'>{STAGE_LABEL[entry.stage]}</span>
                        <span className='text-muted-foreground truncate'>
                          {entry.by === "agent" ? "by AI" : entry.by === "user" ? "by teammate" : ""}
                          {entry.note ? ` · ${entry.note}` : ""}
                        </span>
                        <span className='text-muted-foreground ml-auto shrink-0'>{relativeTime(entry.at)}</span>
                      </li>
                    ))}
                  </ol>
                </Block>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Block({ title, meta, children }: { title: string; meta?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <div className='mb-2.5 flex items-baseline gap-2'>
        <h3 className='text-sm font-semibold'>{title}</h3>
        {meta && <p className='text-muted-foreground truncate text-xs'>{meta}</p>}
      </div>
      {children}
    </section>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className='min-w-0'>
      <dt className='text-muted-foreground'>{label}</dt>
      <dd className='truncate'>{children}</dd>
    </div>
  );
}
