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

