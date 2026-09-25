import type { IntegrationPlatform } from "./integrations-api";
import { apiResponse } from "@/utils/apiResponse";

export type AgentTaskStatus = "pending" | "running" | "done" | "failed";
export type AgentRunStatus =
  | "running"
  | "awaiting_input"
  | "awaiting_integration"
  | "completed"
  | "failed"
  | "cancelled";

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
  result?: {
    ok: boolean;
    data?: any;
    error?: string;
    providerLogId?: string;
    verification?: {
      status: "verified";
      evidence: string[];
      checkedAt: string;
    };
  };
  render?: string;
}

export interface AgentElicitation {
  question: string;
  options?: {
    value: string;
    label: string;
    description?: string;
    icon?: string;
    connected?: boolean;
  }[];
  presentation?: "buttons" | "image_size" | "video_size" | "plugin_choice";
  allowOther?: boolean;
}

export interface AgentIntegrationRequired {
  platform: IntegrationPlatform;
  platformName: string;
  reason: string;
  toolkitSlug?: string;
}

export interface AgentAttachedFile {
  name: string;
  type: string;
  url: string;
  size?: number;
}

export async function startAgentRun(input: {
  projectId: string;
  prompt: string;
  requestId?: string;
  attachedFiles?: AgentAttachedFile[];
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
  value: string,
  metadata?: { isOther: boolean }
): Promise<void> {
  await apiResponse.post(`/agents/${runId}/resume`, {
    kind: "user_input",
    value,
    isOther: metadata?.isOther,
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

export async function stopAgentRun(runId: string): Promise<void> {
  await apiResponse.post(`/agents/${runId}/stop`);
}

export async function continueAgentRun(runId: string): Promise<void> {
  await apiResponse.post(`/agents/${runId}/continue`);
}

export async function listAgentRuns(projectId: string): Promise<any[]> {
  const { data } = await apiResponse.get<{ success: boolean; runs: any[] }>(
    `/agents/project/${projectId}`
  );
  return data.runs;
}

export async function deleteAgentRun(runId: string): Promise<void> {
  await apiResponse.delete(`/agents/${runId}`);
}
