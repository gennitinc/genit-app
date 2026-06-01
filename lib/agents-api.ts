import { apiResponse } from "@/utils/apiResponse";
import type { IntegrationPlatform } from "./integrations-api";

export type AgentTaskStatus = "pending" | "running" | "done" | "failed";
export type AgentRunStatus =
  | "running"
  | "awaiting_input"
  | "awaiting_integration"
  | "completed"
  | "failed";

export interface AgentTask {
  id: string;
  title: string;
  status: AgentTaskStatus;
  detail?: string;
}

export interface AgentToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
  result?: { ok: boolean; data?: any; error?: string };
  render?: string;
}

export interface AgentElicitation {
  question: string;
  options?: { value: string; label: string; description?: string }[];
}

export interface AgentIntegrationRequired {
  platform: IntegrationPlatform;
  platformName: string;
  reason: string;
}

export async function startAgentRun(input: {
  projectId: string;
  prompt: string;
  attachedFiles?: { name: string; type: string; url: string }[];
  selectedIntegrations?: Record<string, string>;
  useBrandIdentity?: boolean;
}): Promise<{ runId: string }> {
  const { data } = await apiResponse.post<{ success: boolean; runId: string }>(
    "/agents/run",
    input
  );
  return { runId: data.runId };
}

export async function resumeAgentRunUserInput(
  runId: string,
  value: string
): Promise<void> {
  await apiResponse.post(`/agents/${runId}/resume`, {
    kind: "user_input",
    value,
  });
}

export async function resumeAgentRunIntegration(
  runId: string,
  platform: IntegrationPlatform
): Promise<void> {
  await apiResponse.post(`/agents/${runId}/resume`, {
    kind: "integration_connected",
    platform,
  });
}

export async function listAgentRuns(projectId: string): Promise<any[]> {
  const { data } = await apiResponse.get<{ success: boolean; runs: any[] }>(
    `/agents/project/${projectId}`
  );
  return data.runs;
}

export async function classifyPrompt(prompt: string): Promise<boolean> {
  try {
    const { data } = await apiResponse.post<{ success: boolean; isAgentic: boolean }>(
      "/agents/classify",
      { prompt }
    );
    console.debug("[classify] prompt:", prompt.slice(0, 60), "→ isAgentic:", data.isAgentic);
    return !!data.isAgentic;
  } catch (err: any) {
    // Log full error details so we can diagnose in the browser console
    console.warn(
      "[classify] backend unreachable — defaulting to AGENT flow.",
      err?.response?.status,
      err?.response?.data ?? err?.message
    );
    // Fail OPEN: treat as agentic so calender/schedule/etc never silently fall through to chat
    return true;
  }
}


