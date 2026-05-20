"use client";

import { AvatarDisplay } from "@/components/ui/avatar-display";
import { Response } from "@/components/ai-elements/response";
import { resumeAgentRunUserInput } from "@/lib/agents-api";
import type {
  AgentElicitation,
  AgentIntegrationRequired,
  AgentRunStatus,
  AgentTask,
  AgentToolCall,
} from "@/lib/agents-api";
import { AlertTriangle, CalendarCheck2, Loader2 } from "lucide-react";
import { AgentCard } from "./agent-card";
import { AgentPlan } from "./agent-plan";
import { AgentThinkingStream } from "./agent-thinking-stream";
import { CalendarEventsCard } from "./calendar-events-card";
import { ConnectIntegrationInline } from "./connect-integration-inline";
import { ElicitationCard } from "./elicitation-card";
import { renderToolResult } from "./result-cards";

export interface AgentRunView {
  runId: string;
  status: AgentRunStatus;
  plan: AgentTask[];
  thinking: string;
  thinkingActive: boolean;
  toolCalls: AgentToolCall[];
  text: string;
  elicitation?: AgentElicitation;
  integrationRequired?: AgentIntegrationRequired;
  error?: string;
}

// Humanize a tool name for display — "facebook_publish_post" → "Facebook · publish post".
function humanizeToolName(name: string): string {
  const parts = name.split(/[_.:-]/).filter(Boolean);
  if (parts.length === 0) return name;
  const head = parts[0].replace(/^\w/, (c) => c.toUpperCase());
  const tail = parts.slice(1).join(" ");
  return tail ? `${head} · ${tail}` : head;
}

function ToolCallView({ call }: { call: AgentToolCall }) {
  // Pending — tool still running.
  if (!call.result) {
    return (
      <div className='border-border/70 bg-card text-muted-foreground my-3 flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-[12.5px] shadow-[0_1px_0_rgba(0,0,0,0.02)] dark:border-white/10 dark:bg-white/[0.02] dark:shadow-none'>
        <Loader2 className='text-foreground h-3.5 w-3.5 animate-spin' />
        <span className='text-foreground font-medium'>
          {humanizeToolName(call.name)}
        </span>
        <span className='text-muted-foreground'>running…</span>
      </div>
    );
  }

  // Failed.
  if (!call.result.ok) {
    return (
      <AgentCard
        icon={<AlertTriangle className='h-3.5 w-3.5' />}
        title={`${humanizeToolName(call.name)} failed`}
        tone='error'
      >
        <p className='text-foreground text-[12.5px] leading-relaxed'>
          {call.result.error}
        </p>
      </AgentCard>
    );
  }

  const data = call.result.data || {};

  // Calendar has its own bespoke renderer (richer than the generic ones).
  if (call.render === "calendar_events") {
    return (
      <CalendarEventsCard events={data.events || []} account={data.account} />
    );
  }
  if (call.render === "calendar_event_created") {
    return (
      <AgentCard
        icon={<CalendarCheck2 className='h-3.5 w-3.5' />}
        title='Event created'
        meta={data.account}
        tone='success'
      >
        <div className='text-foreground text-[13.5px] leading-snug font-medium'>
          {data.summary || "(no title)"}
        </div>
        {data.htmlLink && (
          <a
            href={data.htmlLink}
            target='_blank'
            rel='noreferrer'
            className='text-foreground hover:text-foreground/80 mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium underline-offset-2 hover:underline'
          >
            Open in Google Calendar
          </a>
        )}
      </AgentCard>
    );
  }

  // Generic dispatcher covers every other platform tool render hint.
  const rendered = renderToolResult(call.render, data);
  if (rendered) return <>{rendered}</>;

  // Unknown render type — collapsible JSON debug card.
  return (
    <details className='border-border/70 bg-card my-3 rounded-xl border text-[12px] shadow-[0_1px_0_rgba(0,0,0,0.02)] dark:border-white/10 dark:bg-white/[0.02] dark:shadow-none'>
      <summary className='text-muted-foreground hover:text-foreground cursor-pointer list-none px-3.5 py-2.5 transition-colors'>
        <span className='text-foreground font-medium'>
          {humanizeToolName(call.name)}
        </span>{" "}
        · result
      </summary>
      <pre className='border-border/70 -mb-[1px] overflow-x-auto border-t px-3.5 py-2.5 text-[10.5px] leading-relaxed dark:border-white/10'>
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}

function StatusDot({ status }: { status: AgentRunStatus }) {
  const cls =
    status === "running"
      ? "bg-foreground animate-pulse"
      : status === "awaiting_input" || status === "awaiting_integration"
        ? "bg-amber-500"
        : status === "completed"
          ? "bg-emerald-500"
          : status === "failed"
            ? "bg-rose-500"
            : "bg-muted-foreground/40";
  return (
    <span
      aria-hidden
      className={`h-1.5 w-1.5 rounded-full ${cls}`}
    />
  );
}

export function AgentMessage({ run }: { run: AgentRunView }) {
  const active =
    run.status === "running" ||
    run.status === "awaiting_input" ||
    run.status === "awaiting_integration";

  const label =
    active && run.status === "running"
      ? "Working"
      : run.status === "awaiting_integration"
        ? "Waiting on connection"
        : run.status === "awaiting_input"
          ? "Waiting on you"
          : run.status === "completed"
            ? "Done"
            : run.status === "failed"
              ? "Failed"
              : "";

  return (
    <div className='flex flex-col gap-1.5'>
      <div className='flex items-center gap-2.5'>
        <AvatarDisplay
          variant='ai'
          alt='Gennit'
          src='../../resources/images/gennit2.png'
          fallback='../../resources/images/gennit2.png'
        />
        <div className='flex items-center gap-2'>
          <span className='text-foreground text-[12px] font-medium tracking-tight'>
            Gennit
          </span>
          {label && (
            <>
              <span className='text-muted-foreground/50 text-[12px]'>·</span>
              <StatusDot status={run.status} />
              <span className='text-muted-foreground text-[11.5px]'>
                {label}
              </span>
            </>
          )}
        </div>
      </div>

      <div className='ml-9'>
        <AgentPlan tasks={run.plan} />
        <AgentThinkingStream
          text={run.thinking}
          active={run.thinkingActive && run.status === "running"}
        />

        {run.toolCalls.map((tc) => (
          <ToolCallView key={tc.id} call={tc} />
        ))}

        {run.integrationRequired && run.status === "awaiting_integration" && (
          <ConnectIntegrationInline required={run.integrationRequired} />
        )}

        {run.elicitation && run.status === "awaiting_input" && (
          <ElicitationCard
            elicitation={run.elicitation}
            onSubmit={(v) => resumeAgentRunUserInput(run.runId, v)}
          />
        )}

        {run.text && (
          <div className='text-foreground mt-1 text-sm'>
            <Response>{run.text}</Response>
          </div>
        )}

        {run.error && (
          <div className='my-2 rounded-md border border-rose-500/30 bg-rose-500/[0.04] px-3 py-2 text-xs text-rose-700 dark:bg-rose-500/[0.06] dark:text-rose-300'>
            {run.error}
          </div>
        )}
      </div>
    </div>
  );
}
