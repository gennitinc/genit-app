"use client";

import type {
  AgentAttachedFile,
  AgentElicitation,
  AgentErrorCode,
  AgentIntegrationRequired,
  AgentRunStatus,
  AgentTask,
  AgentToolCall,
} from "@/lib/agents-api";
import {
  deleteAgentRun as deleteAgentRunApi,
  listAgentRuns,
} from "@/lib/agents-api";
import { serverUrlSocket } from "@/utils/apiResponse";
import cookie from "js-cookie";
import { Socket, io as ioClient } from "socket.io-client";
import { useCallback, useEffect, useRef, useState } from "react";

export interface AgentRunView {
  runId: string;
  prompt: string;
  attachedFiles?: AgentAttachedFile[];
  status: AgentRunStatus;
  plan: AgentTask[];
  thinking: string;
  thinkingActive: boolean;
  toolCalls: AgentToolCall[];
  text: string;
  elicitation?: AgentElicitation;
  integrationRequired?: AgentIntegrationRequired;
  error?: string;
  errorCode?: AgentErrorCode;
  errorProvider?: string;
  createdAt: number;
}

interface AnyEvent {
  type: string;
  runId: string;
  projectId: string;
  [k: string]: any;
}

// Hook that subscribes to agent:* socket events and exposes an ordered list
// of in-progress + completed runs for the current project.
export function useAgentRuns(projectId: string | undefined) {
  const [runs, setRuns] = useState<AgentRunView[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const projectIdRef = useRef<string | undefined>(projectId);

  useEffect(() => {
    projectIdRef.current = projectId;
  }, [projectId]);

  const reconcileFromServer = useCallback(async (id?: string) => {
    if (!id) return;
    try {
      const historyRuns = await listAgentRuns(id);
      if (projectIdRef.current !== id) return;
      setRuns(
        (historyRuns as AgentRunView[]).sort(
          (a, b) => a.createdAt - b.createdAt
        )
      );
    } catch (err) {
      console.error("Failed to reconcile agent history:", err);
    }
  }, []);

  useEffect(() => {
    if (!projectId) return;
    void reconcileFromServer(projectId);
  }, [projectId, reconcileFromServer]);

  // Socket events are fast, while this reconciliation closes the small gap
  // around room authorization, reconnects, and brief network outages.
  useEffect(() => {
    if (!projectId || !runs.some((run) => run.status === "running")) return;
    const timer = window.setInterval(
      () => void reconcileFromServer(projectId),
      5000
    );
    return () => window.clearInterval(timer);
  }, [projectId, reconcileFromServer, runs]);

  const upsert = useCallback(
    (
      runId: string,
      prompt: string | undefined,
      mut: (r: AgentRunView) => AgentRunView
    ) => {
      setRuns((prev) => {
        const idx = prev.findIndex((r) => r.runId === runId);
        if (idx === -1) {
          const seed: AgentRunView = {
            runId,
            prompt: prompt || "",
            status: "running",
            plan: [],
            thinking: "",
            thinkingActive: false,
            toolCalls: [],
            text: "",
            createdAt: Date.now(),
          };
          return [...prev, mut(seed)];
        }
        const next = [...prev];
        next[idx] = mut(next[idx]);
        return next;
      });
    },
    []
  );

  useEffect(() => {
    if (!serverUrlSocket) return;
    const socket = ioClient(serverUrlSocket, {
      auth: { token: cookie.get("genituToken") || "" },
      withCredentials: true,
    });
    socketRef.current = socket;
    const onConnect = () => {
      const activeProjectId = projectIdRef.current;
      if (activeProjectId) socket.emit("joinProject", activeProjectId);
      void reconcileFromServer(activeProjectId);
    };

    const matchProject = (payload: AnyEvent) => {
      const pid = projectIdRef.current;
      if (!pid) return false;
      return payload.projectId === pid;
    };

    const onRunStart = (p: AnyEvent) => {
      if (!matchProject(p)) return;
      upsert(p.runId, p.prompt, (r) => ({
        ...r,
        prompt: p.prompt,
        status: "running",
      }));
    };
    const onPlan = (p: AnyEvent) => {
      if (!matchProject(p)) return;
      upsert(p.runId, undefined, (r) => ({ ...r, plan: p.tasks }));
    };
    const onTaskUpdate = (p: AnyEvent) => {
      if (!matchProject(p)) return;
      upsert(p.runId, undefined, (r) => ({
        ...r,
        plan: r.plan.map((t) =>
          t.id === p.taskId
            ? {
                ...t,
                status: p.status,
                detail:
                  p.status === "done" ? undefined : (p.detail ?? t.detail),
              }
            : t
        ),
      }));
    };
    const onThinkingDelta = (p: AnyEvent) => {
      if (!matchProject(p)) return;
      upsert(p.runId, undefined, (r) => ({
        ...r,
        thinking: r.thinking + (p.delta || ""),
        thinkingActive: true,
      }));
    };
    const onThinkingEnd = (p: AnyEvent) => {
      if (!matchProject(p)) return;
      upsert(p.runId, undefined, (r) => ({ ...r, thinkingActive: false }));
    };
    const onToolCall = (p: AnyEvent) => {
      if (!matchProject(p)) return;
      upsert(p.runId, undefined, (r) => ({
        ...r,
        toolCalls: [
          ...r.toolCalls.filter((c) => c.id !== p.toolCallId),
          { id: p.toolCallId, name: p.name, args: p.args },
        ],
      }));
    };
    const onToolResult = (p: AnyEvent) => {
      if (!matchProject(p)) return;
      upsert(p.runId, undefined, (r) => ({
        ...r,
        toolCalls: r.toolCalls.map((c) =>
          c.id === p.toolCallId
            ? {
                ...c,
                result: {
                  ok: !!p.ok,
                  data: p.data,
                  error: p.error,
                  errorCode: p.errorCode,
                  provider: p.provider,
                  verification: p.verification,
                },
                render: p.render,
              }
            : c
        ),
      }));
    };
    const onElicit = (p: AnyEvent) => {
      if (!matchProject(p)) return;
      upsert(p.runId, undefined, (r) => ({
        ...r,
        elicitation: {
          question: p.question,
          options: p.options,
          presentation: p.presentation,
          allowOther: p.allowOther,
          multiple: p.multiple,
        },
        status: "awaiting_input",
      }));
    };
    const onIntegrationRequired = (p: AnyEvent) => {
      if (!matchProject(p)) return;
      upsert(p.runId, undefined, (r) => ({
        ...r,
        integrationRequired: {
          platform: p.platform,
          platformName: p.platformName,
          reason: p.reason,
          toolkitSlug: p.toolkitSlug,
        },
        status: "awaiting_integration",
      }));
    };
    const onTextDelta = (p: AnyEvent) => {
      if (!matchProject(p)) return;
      upsert(p.runId, undefined, (r) => ({
        ...r,
        text: r.text + (p.delta || ""),
      }));
    };
    const onRunResume = (p: AnyEvent) => {
      if (!matchProject(p)) return;
      upsert(p.runId, undefined, (r) => ({
        ...r,
        status: "running",
        thinkingActive: false,
        text: r.status === "cancelled" ? "" : r.text,
        error: undefined,
        errorCode: undefined,
        errorProvider: undefined,
        plan: r.plan.map((task) =>
          task.status === "failed" || task.status === "running"
            ? { ...task, status: "pending", detail: undefined }
            : task
        ),
        elicitation: undefined,
        integrationRequired: undefined,
      }));
    };
    const onRunEnd = (p: AnyEvent) => {
      if (!matchProject(p)) return;
      upsert(p.runId, undefined, (r) => ({
        ...r,
        status: p.status,
        thinkingActive: false,
        text: p.finalText || r.text,
        error: p.error,
        errorCode: p.errorCode,
        errorProvider: p.provider,
        // When run resumes (e.g. integration_connected), clear the awaiting flags.
        ...(p.status === "running" || p.status === "completed"
          ? {
              integrationRequired:
                p.status === "completed" ? undefined : r.integrationRequired,
              elicitation: p.status === "completed" ? undefined : r.elicitation,
            }
          : {}),
      }));
      void reconcileFromServer(projectIdRef.current);
    };

    socket.on("connect", onConnect);
    socket.on("agent:run:start", onRunStart);
    socket.on("agent:run:resume", onRunResume);
    socket.on("agent:plan", onPlan);
    socket.on("agent:task:update", onTaskUpdate);
    socket.on("agent:thinking:delta", onThinkingDelta);
    socket.on("agent:thinking:end", onThinkingEnd);
    socket.on("agent:tool:call", onToolCall);
    socket.on("agent:tool:result", onToolResult);
    socket.on("agent:elicit", onElicit);
    socket.on("agent:integration_required", onIntegrationRequired);
    socket.on("agent:text:delta", onTextDelta);
    socket.on("agent:run:end", onRunEnd);

    return () => {
      socket.emit("leaveProject", projectId);
      socket.off("connect", onConnect);
      socket.off("agent:run:start", onRunStart);
      socket.off("agent:run:resume", onRunResume);
      socket.off("agent:plan", onPlan);
      socket.off("agent:task:update", onTaskUpdate);
      socket.off("agent:thinking:delta", onThinkingDelta);
      socket.off("agent:thinking:end", onThinkingEnd);
      socket.off("agent:tool:call", onToolCall);
      socket.off("agent:tool:result", onToolResult);
      socket.off("agent:elicit", onElicit);
      socket.off("agent:integration_required", onIntegrationRequired);
      socket.off("agent:text:delta", onTextDelta);
      socket.off("agent:run:end", onRunEnd);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [projectId, reconcileFromServer, upsert]);

  // Insert a placeholder so the UI can render immediately after the POST.
  const registerNewRun = useCallback(
    (runId: string, prompt: string, attachedFiles?: AgentAttachedFile[]) => {
      upsert(runId, prompt, (r) => ({
        ...r,
        prompt,
        attachedFiles,
        status: "running",
      }));
    },
    [upsert]
  );

  const clear = useCallback(() => setRuns([]), []);

  const deleteRun = useCallback(async (runId: string) => {
    try {
      await deleteAgentRunApi(runId);
      setRuns((prev) => prev.filter((r) => r.runId !== runId));
    } catch (err) {
      console.error("[agent] failed to delete run", err);
      throw err;
    }
  }, []);

  return { runs, registerNewRun, clear, deleteRun };
}
