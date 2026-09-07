import type { AgentRunStatus, AgentToolCall } from "./agents-api";
import { extractResultLinks } from "./result-links";

export function shouldDisplayToolCall(
  call: AgentToolCall,
  runStatus: AgentRunStatus
): boolean {
  if (call.name.toUpperCase().startsWith("COMPOSIO_")) {
    return Boolean(
      call.result?.ok && extractResultLinks(call.result.data).length
    );
  }
  return !!call.result || runStatus === "running";
}
