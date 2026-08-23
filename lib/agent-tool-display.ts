import type { AgentRunStatus, AgentToolCall } from "./agents-api";

export function shouldDisplayToolCall(
  call: AgentToolCall,
  runStatus: AgentRunStatus
): boolean {
  if (call.name.toUpperCase().startsWith("COMPOSIO_")) return false;
  return !!call.result || runStatus === "running";
}
