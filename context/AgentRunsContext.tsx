"use client";

import { useProjectDesign } from "@/context/DesignProject";
import { type AgentRunView, useAgentRuns } from "@/hooks/use-agent-runs";
import { type AgentAttachedFile, startAgentRun } from "@/lib/agents-api";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";

interface AgentRunsContextValue {
  runs: AgentRunView[];
  startAgent: (
    prompt: string,
    attachedFiles?: AgentAttachedFile[],
    selectedIntegrations?: Record<string, string>,
    useBrandIdentity?: boolean
  ) => Promise<{ runId: string } | null>;
  clear: () => void;
}

const AgentRunsContext = createContext<AgentRunsContextValue | null>(null);

export function AgentRunsProvider({ children }: { children: ReactNode }) {
  const { project } = useProjectDesign();
  const projectId = project?._id?.toString();
  const { runs, registerNewRun, clear } = useAgentRuns(projectId);

  const startAgent = useCallback(
    async (
      prompt: string,
      attachedFiles?: AgentAttachedFile[],
      selectedIntegrations?: Record<string, string>,
      useBrandIdentity?: boolean
    ) => {
      if (!projectId) return null;
      try {
        const { runId } = await startAgentRun({
          projectId,
          prompt,
          attachedFiles,
          selectedIntegrations,
          useBrandIdentity,
        });
        registerNewRun(runId, prompt, attachedFiles);
        return { runId };
      } catch (err) {
        console.error("[agent] startAgent failed", err);
        return null;
      }
    },
    [projectId, registerNewRun]
  );

  const value = useMemo<AgentRunsContextValue>(
    () => ({ runs, startAgent, clear }),
    [runs, startAgent, clear]
  );

  return (
    <AgentRunsContext.Provider value={value}>
      {children}
    </AgentRunsContext.Provider>
  );
}

export function useAgentRunsContext() {
  const ctx = useContext(AgentRunsContext);
  if (!ctx)
    throw new Error(
      "useAgentRunsContext must be used inside AgentRunsProvider"
    );
  return ctx;
}
