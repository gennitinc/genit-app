"use client";

import { AgentCard } from "./agent-card";
import { AgentPlan } from "./agent-plan";
import { AgentThinkingStream } from "./agent-thinking-stream";
import { CalendarEventsCard } from "./calendar-events-card";
import { ConnectIntegrationInline } from "./connect-integration-inline";
import { ElicitationCard } from "./elicitation-card";
import { renderToolResult } from "./result-cards";
import { Response } from "@/components/ai-elements/response";
import { MessageContainer } from "@/components/chat/messages/message-container";
import { MessageContent } from "@/components/chat/messages/message-content";
import { UserMessage } from "@/components/chat/messages/user-message";
import { AvatarDisplay } from "@/components/ui/avatar-display";
import { resumeAgentRunUserInput } from "@/lib/agents-api";
import type {
  AgentAttachedFile,
  AgentElicitation,
  AgentIntegrationRequired,
  AgentRunStatus,
  AgentTask,
  AgentToolCall,
} from "@/lib/agents-api";
import { LoadingFileLoader } from "@/utils/Loading";
import {
  AlertTriangle,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";

export interface AgentRunView {
  runId: string;
  prompt: string;
  status: AgentRunStatus;
  plan: AgentTask[];
  thinking: string;
  thinkingActive: boolean;
  toolCalls: AgentToolCall[];
  text: string;
  elicitation?: AgentElicitation;
  integrationRequired?: AgentIntegrationRequired;
  error?: string;
  attachedFiles?: AgentAttachedFile[];
}

// Humanize a tool name for display — "facebook_publish_post" → "Facebook · publish post".
function humanizeToolName(name: string): string {
  const parts = name.split(/[_.:-]/).filter(Boolean);
  if (parts.length === 0) return name;
  const head = parts[0].replace(/^\w/, (c) => c.toUpperCase());
  const tail = parts.slice(1).join(" ");
  return tail ? `${head} · ${tail}` : head;
}

function formatErrorMessage(error: string | undefined): string {
  if (!error) return "";
  try {
    let parsed = JSON.parse(error);

    // Sometimes the message itself is a stringified JSON from nested API errors
    if (parsed.error && typeof parsed.error.message === "string") {
      try {
        let innerParsed = JSON.parse(parsed.error.message);
        parsed = innerParsed;
      } catch (e) {
        // ignore
      }
    }

    if (parsed.error) {
      let msg = parsed.error.message || parsed.error.code;
      if (
        parsed.error.status === "RESOURCE_EXHAUSTED" ||
        parsed.error.code === 429
      ) {
        return "We're currently experiencing high demand and have reached our API limits. Please try again in a few moments.";
      }
      return typeof msg === "string" ? msg : JSON.stringify(msg);
    }

    if (parsed.message) {
      return parsed.message;
    }
  } catch (e) {
    // If it's not JSON, or parsing fails, check if it contains common quota/rate limit text
    const lowerError = error.toLowerCase();
    if (
      lowerError.includes("429") ||
      lowerError.includes("resource_exhausted") ||
      lowerError.includes("quota") ||
      lowerError.includes("rate limit")
    ) {
      return "We're currently experiencing high demand and have reached our API limits. Please try again in a few moments.";
    }
  }

  return error;
}

function ToolCallView({ call }: { call: AgentToolCall }) {
  // Hide request_user_input tool calls from the tool call UI list completely,
  // since the elicitation card itself handles asking the user, and a tool card
  // for "request_user_input" is redundant and clutters the UI.
  if (call.name === "request_user_input") {
    return null;
  }

  // Friendlier in-progress label for automation tools
  const pendingLabel = (() => {
    if (call.name === "web_search") {
      return "Searching the web";
    }
    if (call.name === "create_automation_node") {
      const title = call.args?.data?.title || call.args?.type || "node";
      return `Creating ${title}`;
    }
    if (call.name === "connect_automation_nodes") {
      return "Connecting nodes";
    }
    return humanizeToolName(call.name);
  })();

  // Pending — tool still running.
  if (!call.result) {
    return (
      <div className='border-border/70 bg-card text-muted-foreground my-3 flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-[12.5px] shadow-[0_1px_0_rgba(0,0,0,0.02)] dark:border-white/10 dark:bg-white/[0.02] dark:shadow-none'>
        <LoadingFileLoader size={14} />
        <span className='text-foreground font-medium'>{pendingLabel}</span>
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
          {formatErrorMessage(call.result.error)}
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
  if (call.render === "web_search_results") {
    const results = Array.isArray(data.results) ? data.results : [];
    return (
      <AgentCard
        icon={<CheckCircle2 className='h-3.5 w-3.5' />}
        title='Web sources'
        tone='success'
      >
        <div className='space-y-2'>
          {results.slice(0, 5).map((result: any, index: number) => (
            <a
              key={`${result.url || index}`}
              href={result.url}
              target='_blank'
              rel='noreferrer'
              className='text-foreground hover:text-foreground/80 block text-[12.5px] leading-snug underline-offset-2 hover:underline'
            >
              {result.title || result.url}
            </a>
          ))}
        </div>
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

/** Small inline status badge that sits right next to the "genit" name in the header. */
function StatusBadge({ status }: { status: AgentRunStatus }) {
  if (status === "running") {
    return (
      <span className='bg-foreground/[0.06] text-muted-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium dark:bg-white/[0.06]'>
        <LoadingFileLoader size={14} />
        Working
      </span>
    );
  }
  if (status === "awaiting_input") {
    return (
      <span className='inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10.5px] font-medium text-amber-600 dark:text-amber-400'>
        <span className='h-1.5 w-1.5 rounded-full bg-amber-500' />
        Waiting on you
      </span>
    );
  }
  if (status === "awaiting_integration") {
    return (
      <span className='inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10.5px] font-medium text-amber-600 dark:text-amber-400'>
        <span className='h-1.5 w-1.5 rounded-full bg-amber-500' />
        Connect account
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10.5px] font-medium text-emerald-600 dark:text-emerald-400'>
        <CheckCircle2 className='h-2.5 w-2.5' />
        Done
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className='inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10.5px] font-medium text-rose-600 dark:text-rose-400'>
        <XCircle className='h-2.5 w-2.5' />
        Failed
      </span>
    );
  }
  return null;
}

export function AgentMessage({
  run,
  userAvatar,
  userName,
}: {
  run: AgentRunView;
  userAvatar?: string;
  userName?: string;
}) {
  return (
    <div className='flex flex-col gap-4'>
      {/* User prompt bubble — same as a regular user message */}
      {(run.prompt || (run.attachedFiles && run.attachedFiles.length > 0)) && (
        <UserMessage
          message={{
            type: "user",
            parts: [{ type: "text", text: run.prompt || "" }],
            attachedFiles:
              run.attachedFiles?.map((f, i) => ({
                id: `file-${Date.now()}-${i}`,
                name: f.name,
                type: f.type,
                filePath: f.url,
                status: "uploaded",
              })) || [],
          }}
          userAvatar={userAvatar}
          userName={userName}
        />
      )}

      {/* Agent response — wrapped in the same MessageContainer as AIMessage */}
      <MessageContainer
        avatar={
          <AvatarDisplay
            variant='ai'
            alt='genit'
            src='../../resources/images/genit2.png'
            fallback='../../resources/images/genit2.png'
          />
        }
      >
        {/* Header row: name + inline status badge */}
        <div className='mb-2 flex items-center gap-2'>
          <span className='text-foreground text-[12px] font-medium tracking-tight'>
            genit
          </span>
          <StatusBadge status={run.status} />
        </div>

        <MessageContent variant='ai' className='bg-transparent'>
          <div className='space-y-1'>
            {/* Thinking stream — collapsible, same border/bg style as the rest */}
            <AgentThinkingStream
              text={run.thinking}
              active={run.thinkingActive && run.status === "running"}
            />

            {/* Plan — only shown while running or if not all done */}
            <AgentPlan tasks={run.plan} />

            {/* Tool calls */}
            {run.toolCalls.map((tc) => (
              <ToolCallView key={tc.id} call={tc} />
            ))}

            {/* Integration connect prompt */}
            {run.integrationRequired &&
              run.status === "awaiting_integration" && (
                <ConnectIntegrationInline required={run.integrationRequired} />
              )}

            {/* Elicitation — user clarification needed */}
            {run.elicitation && run.status === "awaiting_input" && (
              <ElicitationCard
                elicitation={run.elicitation}
                onSubmit={(v) => resumeAgentRunUserInput(run.runId, v)}
              />
            )}

            {/* Final text response */}
            {run.text && (
              <div className='text-foreground mt-1 text-sm'>
                <Response>{run.text}</Response>
              </div>
            )}

            {/* Error */}
            {run.error && (
              <div className='my-2 rounded-md border border-rose-500/30 bg-rose-500/[0.04] px-3 py-2 text-xs text-rose-700 dark:bg-rose-500/[0.06] dark:text-rose-300'>
                {formatErrorMessage(run.error)}
              </div>
            )}
          </div>
        </MessageContent>
      </MessageContainer>
    </div>
  );
}
