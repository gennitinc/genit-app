"use client";

import { DeleteConfirmation } from "../messages/delete-confirmation";
import { DesignInspirationResults } from "../messages/design-inspiration-results";
import { AgentCard } from "./agent-card";
import { AgentPlan } from "./agent-plan";
import { AgentThinkingStream } from "./agent-thinking-stream";
import { AutomationWorkflowSummaryCard } from "./automation-cards";
import { CalendarEventsCard } from "./calendar-events-card";
import { ConnectIntegrationInline } from "./connect-integration-inline";
import { ElicitationCard } from "./elicitation-card";
import { renderToolResult } from "./result-cards";
import { Response } from "@/components/ai-elements/response";
import { MessageActions } from "@/components/chat/messages/message-actions";
import { MessageContainer } from "@/components/chat/messages/message-container";
import { MessageContent } from "@/components/chat/messages/message-content";
import { UserMessage } from "@/components/chat/messages/user-message";
import { PluginConnectionLink } from "@/components/chat/plugin-connection-link";
import { LocalizedText } from "@/components/localized-text";
import { AvatarDisplay } from "@/components/ui/avatar-display";
import { shouldDisplayToolCall } from "@/lib/agent-tool-display";
import {
  resumeAgentRunIntegration,
  resumeAgentRunUserInput,
} from "@/lib/agents-api";
import type {
  AgentAttachedFile,
  AgentElicitation,
  AgentIntegrationRequired,
  AgentRunStatus,
  AgentTask,
  AgentToolCall,
} from "@/lib/agents-api";
import { getAutomationWorkflowSummary } from "@/lib/automation-workflow-summary";
import { type ResultLink, extractResultLinks } from "@/lib/result-links";
import { LoadingFileLoader } from "@/utils/Loading";
import {
  CalendarCheck2,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

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

  return error.length <= 500
    ? error
    : "We couldn't complete this request. Please try again.";
}

function ResultLinkAnchor({ link }: { link: ResultLink }) {
  return (
    <a
      href={link.url}
      target='_blank'
      rel='noopener noreferrer'
      className='text-foreground hover:text-foreground/80 inline-flex items-center gap-1 text-[12px] font-medium underline-offset-2 hover:underline'
    >
      {link.label}
      <ExternalLink className='h-3 w-3' />
    </a>
  );
}

function ToolResultLinks({ links }: { links: ResultLink[] }) {
  if (!links.length) return null;
  const primary = links.slice(0, 6);
  const remaining = links.slice(6);
  return (
    <div className='border-border/70 bg-card my-2 flex flex-wrap items-center gap-2 rounded-xl border px-3.5 py-2.5 dark:border-white/10 dark:bg-white/[0.02]'>
      {primary.map((link) => (
        <ResultLinkAnchor key={link.url} link={link} />
      ))}
      {remaining.length > 0 && (
        <details className='w-full text-[12px]'>
          <summary className='text-muted-foreground hover:text-foreground cursor-pointer select-none'>
            {remaining.length} more {remaining.length === 1 ? "link" : "links"}
          </summary>
          <div className='mt-2 flex flex-wrap gap-2'>
            {remaining.map((link) => (
              <ResultLinkAnchor key={link.url} link={link} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function ToolCallView({
  call,
  onInspirationSelect,
}: {
  call: AgentToolCall;
  onInspirationSelect?: (image: string) => void | Promise<void>;
}) {
  // Hide request_user_input tool calls from the tool call UI list completely,
  // since the elicitation card itself handles asking the user, and a tool card
  // for "request_user_input" is redundant and clutters the UI.
  if (call.name === "request_user_input") {
    return null;
  }

  // Keep provider plumbing private; useful result links render separately.
  if (call.name.toUpperCase().startsWith("COMPOSIO_")) {
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
        <LoadingFileLoader size={12} />
        <span className='text-foreground font-medium'>{pendingLabel}</span>
        <span className='text-muted-foreground'>
          <LocalizedText text={"running…"} />
        </span>
      </div>
    );
  }

  // Failed.
  if (!call.result.ok) {
    return null;
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
            <LocalizedText text={"Open in Google Calendar"} />
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
  if (call.render === "design_inspiration") {
    const results = Array.isArray(data)
      ? data
      : data?.pins || data?.inspirations || [];
    return (
      <DesignInspirationResults
        results={results}
        query={call.args?.query || "design inspiration"}
        onSelect={onInspirationSelect}
      />
    );
  }

  // Generic dispatcher covers every other platform tool render hint.
  const rendered = renderToolResult(call.render, data);
  if (rendered) return <>{rendered}</>;

  // Unknown render type — confirm completion without exposing provider payloads.
  return (
    <AgentCard
      icon={<CheckCircle2 className='h-3.5 w-3.5' />}
      title={humanizeToolName(call.name)}
      tone='success'
    />
  );
}

/** Run status shown opposite the agent identity while attention is still useful. */
function StatusBadge({ status }: { status: AgentRunStatus }) {
  if (status === "running") {
    return (
      <span className='bg-foreground/[0.06] text-muted-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium dark:bg-white/[0.06]'>
        <LoadingFileLoader size={12} />
        <LocalizedText text={"Working"} />
      </span>
    );
  }
  if (status === "awaiting_input") {
    return (
      <span className='inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10.5px] font-medium text-amber-600 dark:text-amber-400'>
        <span className='h-1.5 w-1.5 rounded-full bg-amber-500' />
        <LocalizedText text={"Waiting on you"} />
      </span>
    );
  }
  if (status === "awaiting_integration") {
    return (
      <span className='inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10.5px] font-medium text-amber-600 dark:text-amber-400'>
        <span className='h-1.5 w-1.5 rounded-full bg-amber-500' />
        <LocalizedText text={"Connect account"} />
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className='bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium'>
        <CircleAlert className='h-2.5 w-2.5 text-amber-500' />
        <LocalizedText text={"Needs attention"} />
      </span>
    );
  }
  return null;
}

export function AgentMessage({
  run,
  userAvatar,
  userName,
  onCopy,
  onLike,
  onDislike,
  onDelete,
}: {
  run: AgentRunView;
  userAvatar?: string;
  userName?: string;
  onCopy?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onDelete?: () => void;
}) {
  const isDone = run.status !== "running";
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const inspirationCalls = run.toolCalls.filter(
    (call) => call.render === "design_inspiration"
  );
  const awaitsInspiration =
    run.status === "awaiting_input" &&
    !!run.elicitation?.question.toLowerCase().includes("inspiration");
  const safeText =
    /\b(gpt-|input_fidelity|api error|[45]\d\d the model)\b/i.test(run.text)
      ? "I couldn't complete this request. Please try again."
      : run.text;
  const displayedToolCalls =
    inspirationCalls.length <= 1
      ? run.toolCalls
      : run.toolCalls
          .filter((call, index) => {
            if (call.render !== "design_inspiration") return true;
            return (
              index ===
              run.toolCalls.findIndex(
                (candidate) => candidate.render === "design_inspiration"
              )
            );
          })
          .map((call) => {
            if (call.render !== "design_inspiration") return call;
            const seen = new Set<string>();
            const data = inspirationCalls
              .flatMap((candidate) =>
                Array.isArray(candidate.result?.data)
                  ? candidate.result.data
                  : []
              )
              .filter((item) => {
                if (!item?.image || seen.has(item.image)) return false;
                seen.add(item.image);
                return true;
              });
            return { ...call, result: { ok: true, data } };
          });
  const automationSummary = getAutomationWorkflowSummary(displayedToolCalls);
  const nonAutomationToolCalls = displayedToolCalls.filter(
    (call) =>
      call.render !== "automation_node_created" &&
      call.render !== "automation_nodes_connected"
  );

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
        name={<LocalizedText text={"genit"} />}
        status={<StatusBadge status={run.status} />}
        actions={
          isDone ? (
            <MessageActions
              onCopy={onCopy}
              onLike={onLike}
              onDislike={onDislike}
              onDelete={onDelete ? () => setShowDeleteConfirm(true) : undefined}
            />
          ) : undefined
        }
      >
        <MessageContent variant='ai' className='bg-transparent p-0'>
          <div className='space-y-1'>
            <AgentThinkingStream
              text={run.thinking}
              active={run.thinkingActive && run.status === "running"}
            />

            {/* Plan — only shown while running or if not all done */}
            <AgentPlan tasks={run.plan} />

            {/* Tool calls */}
            {nonAutomationToolCalls
              .filter((tc) => shouldDisplayToolCall(tc, run.status))
              .map((tc) => (
                <div key={tc.id}>
                  <ToolCallView
                    call={tc}
                    onInspirationSelect={
                      awaitsInspiration
                        ? (image) => resumeAgentRunUserInput(run.runId, image)
                        : undefined
                    }
                  />
                  {tc.result?.ok &&
                    tc.name !== "request_user_input" &&
                    tc.render !== "design_inspiration" &&
                    tc.render !== "web_search_results" && (
                      <ToolResultLinks
                        links={extractResultLinks(tc.result.data)}
                      />
                    )}
                </div>
              ))}

            {(automationSummary.nodes.length > 0 ||
              automationSummary.connectionCount > 0) && (
              <AutomationWorkflowSummaryCard {...automationSummary} />
            )}

            {/* Integration connect prompt */}
            {run.integrationRequired &&
              run.status === "awaiting_integration" && (
                <ConnectIntegrationInline
                  required={run.integrationRequired}
                  onConnected={() =>
                    resumeAgentRunIntegration(
                      run.runId,
                      run.integrationRequired!.platform
                    )
                  }
                />
              )}

            {/* Elicitation — user clarification needed */}
            {run.elicitation &&
              run.status === "awaiting_input" &&
              !awaitsInspiration && (
                <ElicitationCard
                  elicitation={run.elicitation}
                  onSubmit={(v, metadata) =>
                    resumeAgentRunUserInput(run.runId, v, metadata)
                  }
                />
              )}

            {/* Final text response */}
            {safeText && !(run.status === "failed" && run.error) && (
              <div className='text-foreground mt-1 text-sm'>
                <Response components={{ a: PluginConnectionLink }}>
                  {safeText}
                </Response>
              </div>
            )}

            {/* Error */}
            {run.error && (
              <div className='border-border/70 bg-muted/30 my-2 flex items-start gap-2.5 rounded-lg border px-3 py-2.5'>
                <CircleAlert className='mt-0.5 size-4 shrink-0 text-amber-500' />
                <div className='min-w-0'>
                  <p className='text-foreground text-xs font-medium'>
                    Action needs attention
                  </p>
                  <p className='text-muted-foreground mt-0.5 text-xs leading-relaxed'>
                    {formatErrorMessage(run.error)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </MessageContent>
      </MessageContainer>

      {onDelete && (
        <DeleteConfirmation
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          onConfirm={onDelete}
          message='Are you sure you want to delete this agent run? This will delete both the prompt and all associated tool executions.'
        />
      )}
    </div>
  );
}
