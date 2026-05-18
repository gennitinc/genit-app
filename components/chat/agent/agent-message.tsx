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
import { Loader2 } from "lucide-react";
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

function ToolCallView({ call }: { call: AgentToolCall }) {
  // Pending — tool still running.
  if (!call.result) {
    return (
      <div className='border-border text-muted-foreground my-2 flex items-center gap-2 rounded-md border px-3 py-2 text-xs dark:border-white/10'>
        <Loader2 className='h-3 w-3 animate-spin' />
        Running {call.name}…
      </div>
    );
  }

  // Failed.
  if (!call.result.ok) {
    return (
      <div className='my-2 rounded-md border border-rose-500/30 bg-rose-500/[0.04] px-3 py-2 text-xs text-rose-700 dark:bg-rose-500/[0.06] dark:text-rose-300'>
        <span className='font-medium'>{call.name} failed:</span>{" "}
        {call.result.error}
      </div>
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
      <div className='border-border bg-card/40 my-2 rounded-md border px-3 py-2 dark:border-white/10 dark:bg-white/[0.02]'>
        <div className='text-foreground text-sm font-medium'>
          Created event · {data.summary}
        </div>
        {data.htmlLink && (
          <a
            href={data.htmlLink}
            target='_blank'
            rel='noreferrer'
            className='text-xs text-blue-500 hover:underline'
          >
            Open in Google Calendar
          </a>
        )}
      </div>
    );
  }

  // Generic dispatcher covers every other platform tool render hint.
  const rendered = renderToolResult(call.render, data);
  if (rendered) return <>{rendered}</>;

  // Unknown render type — collapsible JSON debug card.
  return (
    <details className='border-border bg-card/40 my-2 rounded-md border px-3 py-1.5 text-xs dark:border-white/10 dark:bg-white/[0.02]'>
      <summary className='text-muted-foreground cursor-pointer'>
        {call.name} · result
      </summary>
      <pre className='mt-1 overflow-x-auto text-[10px]'>
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}

export function AgentMessage({
  run,
  userAvatar,
}: {
  run: AgentRunView;
  userAvatar?: string;
}) {
  const active =
    run.status === "running" ||
    run.status === "awaiting_input" ||
    run.status === "awaiting_integration";

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center gap-2'>
        <AvatarDisplay
          variant='ai'
          alt='Gennit'
          src='../../resources/images/gennit2.png'
          fallback='../../resources/images/gennit2.png'
        />
        <span className='text-muted-foreground text-[10px] font-medium tracking-wide uppercase'>
          Gennit
          {active && run.status === "running" && " · working"}
          {run.status === "awaiting_integration" && " · waiting on connection"}
          {run.status === "awaiting_input" && " · waiting on you"}
          {run.status === "completed" && " · done"}
          {run.status === "failed" && " · failed"}
        </span>
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
