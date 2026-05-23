"use client";

import { startAgentRun } from "@/lib/agents-api";
import { useProjectDesign } from "@/context/DesignProject";
import { useAgentRuns, type AgentRunView } from "@/hooks/use-agent-runs";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

interface AgentRunsContextValue {
  runs: AgentRunView[];
  startAgent: (
    prompt: string,
    selectedIntegrations?: Record<string, string>
  ) => Promise<{ runId: string } | null>;
  isAgenticQuery: (prompt: string) => boolean;
  clear: () => void;
}

const AgentRunsContext = createContext<AgentRunsContextValue | null>(null);

// Keyword router. The existing /generate flow stays the default for pure
// design/image generation (no integration verbs). Anything that names a
// platform, asks about scheduling, publishing, sending, reading insights,
// or interacting with connected accounts goes to the Claude agent.
const AGENTIC_KEYWORDS = [
  // verbs that imply taking action across integrations
  "post",
  "publish",
  "schedule",
  "send",
  "email",
  "dm",
  "message",
  "reply",
  "broadcast",
  "tweet",
  "draft",
  "upload",
  "share",
  // calendar / drive / docs
  "calendar",
  "meeting",
  "event",
  "appointment",
  "today",
  "tomorrow",
  "this week",
  "next week",
  "drive",
  "folder",
  "file",
  // analytics / insights
  "insights",
  "analytics",
  "report",
  "stats",
  "metrics",
  "performance",
  // platforms (catch any prompt that names one)
  "facebook",
  "instagram",
  "threads",
  "linkedin",
  "twitter",
  " x ",
  "tiktok",
  "youtube",
  "pinterest",
  "snapchat",
  "meta ads",
  "google ads",
  "tiktok ads",
  "gmail",
  "outlook",
  "brevo",
  "mailchimp",
  "whatsapp",
  "telegram",
  // generic content workflow
  "campaign",
  "content",
  "audience",
  "followers",
  "comments",
  // brand & strategy
  "brand",
  "strategy",
  "strategies",
  "growth",
  "grow",
  "analysis",
  "analyze",
];

function detectAgentic(prompt: string): boolean {
  const p = ` ${prompt.toLowerCase()} `;
  return AGENTIC_KEYWORDS.some((k) => p.includes(k));
}

export function AgentRunsProvider({ children }: { children: ReactNode }) {
  const { project } = useProjectDesign();
  const projectId = project?._id?.toString();
  const { runs, registerNewRun, clear } = useAgentRuns(projectId);

  const startAgent = useCallback(
    async (prompt: string, selectedIntegrations?: Record<string, string>) => {
      if (!projectId) return null;
      try {
        const { runId } = await startAgentRun({
          projectId,
          prompt,
          selectedIntegrations,
        });
        registerNewRun(runId, prompt);
        return { runId };
      } catch (err) {
        console.error("[agent] startAgent failed", err);
        return null;
      }
    },
    [projectId, registerNewRun]
  );

  const value = useMemo<AgentRunsContextValue>(
    () => ({ runs, startAgent, isAgenticQuery: detectAgentic, clear }),
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
    throw new Error("useAgentRunsContext must be used inside AgentRunsProvider");
  return ctx;
}
