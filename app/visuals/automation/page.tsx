"use client";

import {
  BrevoBrand,
  FacebookBrand,
  GoogleCalendarBrand,
  GoogleDriveBrand,
  InstagramBrand,
  LinkedinBrand,
  TelegramBrand,
  TikTokBrand,
  WhatsAppBrand,
  XBrand,
  YoutubeBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { LocalizedText } from "@/components/localized-text";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useProjectDesign } from "@/context/DesignProject";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CircleDashed,
  CircleFadingArrowUp,
  Clock,
  Code2,
  GitBranch,
  Globe,
  Loader2,
  Mail,
  Play,
  Plus,
  Search,
  Sliders,
  Sparkles,
  Trash2,
  Upload,
  Webhook,
  Workflow,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCallback, useEffect, useMemo, useState } from "react";

interface AutomationDocument {
  nodes: Array<{
    id: string;
    type?: string;
    position?: { x: number; y: number };
    data?: Record<string, unknown>;
  }>;
  edges: Array<Record<string, unknown>>;
  viewport?: Record<string, unknown>;
  name?: string;
}

interface AutomationProject {
  _id: string;
  title: string;
  category?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  document?: AutomationDocument;
}

function getNodeIconAndName(node: any) {
  const type = node.type;
  const data = node.data || {};

  if (type === "trigger") {
    const triggerType = data.triggerType || "";
    switch (triggerType) {
      case "schedule":
        return { IconComponent: Clock, label: "Schedule" };
      case "webhook":
        return { IconComponent: Webhook, label: "Webhook" };
      case "manual":
        return { IconComponent: Play, label: "Manual" };
      case "instagram":
        return { IconComponent: InstagramBrand, label: "Instagram" };
      case "facebook":
        return { IconComponent: FacebookBrand, label: "Facebook" };
      case "twitter":
      case "x":
        return { IconComponent: XBrand, label: "X" };
      case "tiktok":
        return { IconComponent: TikTokBrand, label: "TikTok" };
      case "linkedin":
        return { IconComponent: LinkedinBrand, label: "LinkedIn" };
      case "youtube":
        return { IconComponent: YoutubeBrand, label: "YouTube" };
      case "google_calendar":
        return { IconComponent: GoogleCalendarBrand, label: "Calendar" };
      case "google_drive":
        return { IconComponent: GoogleDriveBrand, label: "Drive" };
      case "telegram":
        return { IconComponent: TelegramBrand, label: "Telegram" };
      case "whatsapp":
        return { IconComponent: WhatsAppBrand, label: "WhatsApp" };
      case "brevo":
        return { IconComponent: BrevoBrand, label: "Brevo" };
      default:
        return { IconComponent: Webhook, label: "Trigger" };
    }
  }

  if (type === "action") {
    const actionType = data.actionType || "";
    switch (actionType) {
      case "send_email":
        return { IconComponent: Mail, label: "Email" };
      case "post_social":
        return { IconComponent: Globe, label: "Post" };
      default:
        if (data.platform) {
          return getNodeIconAndName({
            type: "trigger",
            data: { triggerType: data.platform },
          });
        }
        return { IconComponent: Sliders, label: "Action" };
    }
  }

  if (type === "prompt") {
    return { IconComponent: Bot, label: "AI Prompt" };
  }
  if (type === "ai_generate") {
    return { IconComponent: Sparkles, CircleFadingArrowUp, label: "AI Gen" };
  }
  if (type === "condition") {
    return { IconComponent: GitBranch, label: "Condition" };
  }
  if (type === "delay") {
    return { IconComponent: Clock, label: "Delay" };
  }
  if (type === "transform") {
    return { IconComponent: Code2, label: "Transform" };
  }
  if (type === "http_request") {
    return { IconComponent: Globe, label: "API Call" };
  }
  if (type === "upload") {
    return { IconComponent: Upload, label: "Upload" };
  }

  return { IconComponent: Workflow, label: type || "Step" };
}

const getPipelineNodes = (document?: AutomationDocument) => {
  if (!document || !document.nodes || document.nodes.length === 0) return [];
  const nodes = document.nodes;
  const edges = document.edges || [];

  const triggers = nodes.filter((n) => n.type === "trigger");

  if (triggers.length === 0) {
    return [...nodes]
      .sort((a, b) => (a.position?.x ?? 0) - (b.position?.x ?? 0))
      .slice(0, 4);
  }

  const pipeline: typeof nodes = [];
  const visited = new Set<string>();

  triggers.forEach((t) => {
    pipeline.push(t);
    visited.add(t.id);
  });

  let currentRound = [...triggers];
  while (currentRound.length > 0 && pipeline.length < 4) {
    const nextRound: typeof nodes = [];
    for (const curr of currentRound) {
      const connectedEdges = edges.filter((e) => e.source === curr.id);
      for (const edge of connectedEdges) {
        const targetId = edge.target as string;
        if (!visited.has(targetId)) {
          const targetNode = nodes.find((n) => n.id === targetId);
          if (targetNode) {
            pipeline.push(targetNode);
            visited.add(targetId);
            nextRound.push(targetNode);
          }
        }
      }
    }
    currentRound = nextRound;
    if (nextRound.length === 0) break;
  }

  if (pipeline.length < 4) {
    for (const node of nodes) {
      if (!visited.has(node.id) && pipeline.length < 4) {
        pipeline.push(node);
        visited.add(node.id);
      }
    }
  }

  return pipeline.slice(0, 4);
};

const TEMPLATES = [
  {
    title: "Cross-Platform Scheduler",
    description:
      "Generate and schedule posts to Instagram, X, and LinkedIn automatically when new content is ready.",
    prompt:
      "Create a brand automation workflow that triggers on a content approval event, uses AI to generate customized image posts and captions for Instagram, X, and LinkedIn, and auto-schedules them.",
    icon: Globe,
    badge: "Social Media",
  },
  {
    title: "Lead Nurture Campaign",
    description:
      "Capture new leads from your webhook, delay for a custom grace period, then send a tailored email with Brevo.",
    prompt:
      "Create a lead nurturing workflow that triggers when a webhook receives new sign-up data, delays for 15 minutes, generates a personalized onboarding email template, and sends it using Brevo.",
    icon: Mail,
    badge: "Email Marketing",
  },
  {
    title: "Smart YouTube Repurposer",
    description:
      "Auto-extract transcripts from YouTube videos to write scripts, summaries, and social promo threads.",
    prompt:
      "Create a content repurposing workflow that triggers on YouTube video uploads, calls the video transcript analyzer, generates a short thread post for X, and saves it in a brand folder.",
    icon: CircleDashed,
    CircleFadingArrowUp,
    badge: "AI Workflow",
  },
];

function relativeDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isDocumentEnabled(document?: AutomationDocument) {
  const triggers =
    document?.nodes?.filter((node) => node.type === "trigger") || [];
  return (
    triggers.length === 0 ||
    triggers.some((node) => node.data?.isActive !== false)
  );
}

export default function AutomationPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const { createProject } = useProjectDesign();
  const [automations, setAutomations] = useState<AutomationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AutomationProject | null>(
    null
  );
  const [query, setQuery] = useState("");

  const organizationId =
    user?.currentOrganization?._id ||
    (user?.business && typeof user.business === "object"
      ? user.business._id
      : "");

  const fetchAutomations = useCallback(async () => {
    setLoading(true);
    try {
      const collected: Omit<AutomationProject, "enabled">[] = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await apiResponse.get(
          `/project/myprojects?type=chat&page=${page}&limit=100`
        );
        const projects = response.data?.projects || [];
        collected.push(
          ...projects.filter(
            (project: AutomationProject) => project.category === "automation"
          )
        );
        hasNextPage = Boolean(response.data?.pagination?.hasNextPage);
        page += 1;
      }

      const hydrated = await Promise.all(
        collected.map(async (project) => {
          try {
            const response = await apiResponse.get(
              `/apps/automation/${project._id}`,
              {
                withCredentials: true,
              }
            );
            const document = response.data?.data as
              AutomationDocument | undefined;
            return {
              ...project,
              document,
              enabled: isDocumentEnabled(document),
            };
          } catch {
            return { ...project, enabled: project.status !== "paused" };
          }
        })
      );

      setAutomations(hydrated);
    } catch (error: any) {
      console.error("Failed to load automations:", error);
      toast.error(
        error.response?.data?.message || "Could not load automations"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchAutomations();
  }, [fetchAutomations, organizationId, user]);

  const visibleAutomations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return automations;
    return automations.filter((automation) =>
      (automation.title || automation.document?.name || "automation")
        .toLowerCase()
        .includes(normalized)
    );
  }, [automations, query]);

  const handleCreate = async (initialPrompt?: string) => {
    if (creating) return;
    setCreating(true);
    try {
      const result = await createProject(
        initialPrompt || "Help me create a new automation",
        undefined,
        undefined,
        "automation"
      );
      if (result.type && result.id) {
        router.push(`/chat/${result.id}?preview=automation`);
        return;
      }
      toast.error(result.message || "Could not create automation");
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (
    automation: AutomationProject,
    enabled: boolean
  ) => {
    setBusyId(automation._id);
    setAutomations((items) =>
      items.map((item) =>
        item._id === automation._id ? { ...item, enabled } : item
      )
    );

    try {
      let document = automation.document;
      if (!document) {
        const response = await apiResponse.get(
          `/apps/automation/${automation._id}`,
          {
            withCredentials: true,
          }
        );
        document = response.data?.data;
      }

      if (!document) throw new Error("Automation workflow was not found");

      const nodes = document.nodes.map((node) =>
        node.type === "trigger"
          ? { ...node, data: { ...node.data, isActive: enabled } }
          : node
      );

      await apiResponse.put(
        `/apps/automation/${automation._id}`,
        { nodes, edges: document.edges || [], viewport: document.viewport },
        { withCredentials: true }
      );

      const nextDocument = { ...document, nodes };
      setAutomations((items) =>
        items.map((item) =>
          item._id === automation._id
            ? { ...item, enabled, document: nextDocument }
            : item
        )
      );
      toast.success(enabled ? "Automation activated" : "Automation paused");
    } catch (error: any) {
      setAutomations((items) =>
        items.map((item) =>
          item._id === automation._id
            ? { ...item, enabled: automation.enabled }
            : item
        )
      );
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Could not update automation"
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget._id);
    try {
      await apiResponse.delete(`/project/${deleteTarget._id}`);
      setAutomations((items) =>
        items.filter((item) => item._id !== deleteTarget._id)
      );
      toast.success("Automation deleted");
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Could not delete automation"
      );
    } finally {
      setBusyId(null);
    }
  };

  const activeCount = automations.filter(
    (automation) => automation.enabled
  ).length;

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 flex min-h-[calc(100dvh-7rem)] w-full flex-col gap-5 rounded-lg bg-zinc-50 p-2 text-zinc-950 duration-500 lg:p-6 lg:px-0 dark:bg-[#070707] dark:text-white'>
      <section className='p-1'>
        <div className='grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)] lg:items-center'>
          <div className='flex min-w-0 flex-col items-start justify-center py-1'>
            <h1 className='font-instrument-serif text-2xl font-semibold tracking-tight md:text-3xl'>
              <LocalizedText text={"Brand automations"} />
            </h1>
            <p className='mt-1 max-w-xl text-sm leading-5 text-zinc-500 dark:text-white/55'>
              <LocalizedText
                text={
                  "Build, monitor, and manage every workflow running for your brand."
                }
              />
            </p>
            <div className='mt-4 flex w-full max-w-xl items-center gap-2'>
              <div className='relative min-w-0 flex-1 sm:max-w-64'>
                <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-white/45' />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder='Search automations'
                  className='h-9 rounded-xl border-zinc-200 bg-white pl-9 text-zinc-950 placeholder:text-zinc-400 focus-visible:ring-sky-400/30 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/35'
                />
              </div>
              <Button
                onClick={() => handleCreate()}
                disabled={creating}
                className='h-9 shrink-0 gap-2 rounded-xl px-4'
              >
                {creating ? (
                  <LoadingFileLoader size={16} />
                ) : (
                  <Plus className='h-4 w-4' />
                )}
                <span className=''>
                  <LocalizedText text={"New"} />
                </span>
              </Button>
            </div>
          </div>

          <div className='flex min-w-0 flex-col gap-3'>
            <div className='hidden rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:block dark:border-white/10 dark:bg-[#0c0c0c] dark:shadow-none'>
              <div className='flex items-center justify-between gap-3 border-b border-zinc-200 pb-3 dark:border-white/10'>
                <div className='flex min-w-0 items-center gap-3'>
                  <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/10'>
                    <Workflow className='h-4 w-4 text-zinc-500 dark:text-white/70' />
                  </div>
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-medium'>
                      <LocalizedText text={"Automation overview"} />
                    </p>
                    <p className='truncate text-xs text-zinc-500 dark:text-white/50'>
                      <LocalizedText text={"Live workflow status"} />
                    </p>
                  </div>
                </div>
                {/* <span className='inline-flex shrink-0 items-center gap-1.5 rounded-sm bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-500/15'>
                  <span className='h-1.5 w-1.5 rounded-sm bg-emerald-500' />
                  {activeCount} active
                </span> */}
              </div>
              <div className='mt-3 grid grid-cols-3 gap-2'>
                {[
                  { label: "Total", value: automations.length },
                  { label: "Active", value: activeCount },
                  { label: "Paused", value: automations.length - activeCount },
                ].map((item) => (
                  <div
                    key={item.label}
                    className='rounded-xl bg-zinc-50 px-3 py-2.5 ring-1 ring-zinc-200 dark:bg-white/[0.04] dark:ring-white/10'
                  >
                    <p className='truncate text-[11px] text-zinc-500 dark:text-white/50'>
                      {item.label}
                    </p>
                    <p className='mt-0.5 text-lg font-semibold'>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className='flex min-h-64 items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.035]'>
          <div className='flex items-center gap-2.5 text-sm font-medium text-zinc-500 dark:text-white/50'>
            <LoadingFileLoader />
          </div>
        </div>
      ) : visibleAutomations.length === 0 ? (
        <div className='flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-white px-6 py-10 text-center dark:border-white/10 dark:bg-white/[0.035]'>
          <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-white/[0.06] dark:text-white/50'>
            <Workflow className='h-5 w-5' />
          </div>
          <h2 className='text-sm font-semibold'>
            {query ? "No automations found" : "Build your first automation"}
          </h2>
          <p className='mt-1.5 max-w-sm text-xs leading-relaxed text-zinc-500 dark:text-white/50'>
            {query
              ? "Try another search term."
              : "Describe what you want to automate in chat and Genit will help you build it."}
          </p>
          {!query && (
            <Button
              onClick={() => handleCreate()}
              disabled={creating}
              className='mt-5 gap-2 rounded-xl px-5 text-xs'
            >
              {creating ? (
                <LoadingFileLoader size={16} />
              ) : (
                <Plus className='h-3.5 w-3.5' />
              )}
              <LocalizedText text={"Create automation"} />
            </Button>
          )}
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {visibleAutomations.map((automation) => {
            const title =
              automation.title ||
              automation.document?.name ||
              "Untitled automation";
            const isBusy = busyId === automation._id;
            const nodeCount = automation.document?.nodes?.length || 0;
            const pipeline = getPipelineNodes(automation.document);

            return (
              <article
                key={automation._id}
                className='group flex flex-col rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition-colors duration-200 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none dark:hover:bg-white/[0.055]'
              >
                {/* Header: status + actions */}
                <div className='mb-3 flex items-center justify-between gap-3'>
                  <div className='flex items-center gap-2'>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-medium ${
                        automation.enabled
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : "bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-white/50"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${automation.enabled ? "bg-emerald-500" : "bg-neutral-400 dark:bg-neutral-500"}`}
                      />
                      {automation.enabled ? "Active" : "Paused"}
                    </span>
                    <span className='text-[10px] text-zinc-500 dark:text-white/40'>
                      {relativeDate(automation.updatedAt)}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h2 className='mb-1 line-clamp-2 text-sm font-semibold'>
                  {title}
                </h2>
                <p className='text-[11px] text-zinc-500 dark:text-white/45'>
                  {nodeCount} {nodeCount === 1 ? "step" : "steps"}
                </p>

                {/* Pipeline preview */}
                <div className='mt-3 flex-1'>
                  {pipeline.length > 0 ? (
                    <div className='no-scrollbar flex items-center gap-1 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 py-2 dark:border-white/10 dark:bg-[#0c0c0c]'>
                      {pipeline.map((node, i) => {
                        const { IconComponent, label } =
                          getNodeIconAndName(node);
                        const isLast = i === pipeline.length - 1;

                        return (
                          <div
                            key={node.id}
                            className='flex shrink-0 items-center'
                          >
                            <div className='flex shrink-0 flex-col items-center gap-0.5'>
                              <div
                                title={label}
                                className='flex h-7 w-7 items-center justify-center rounded-lg bg-white text-zinc-600 ring-1 ring-zinc-200 dark:bg-white/10 dark:text-white/70 dark:ring-0'
                              >
                                <IconComponent className='h-3.5 w-3.5' />
                              </div>
                              <span className='max-w-[48px] truncate text-center text-[8px] text-zinc-500 dark:text-white/40'>
                                {label}
                              </span>
                            </div>
                            {!isLast && (
                              <div className='relative mx-1 h-px w-4 shrink-0 bg-zinc-300 dark:bg-white/15'>
                                {automation.enabled && (
                                  <span className='animate-flow-line absolute -top-[3px] left-0 h-1.5 w-1.5 rounded-full bg-emerald-500' />
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className='flex h-10 items-center justify-center rounded-lg border border-dashed border-zinc-200 text-[10px] text-zinc-500 dark:border-white/10 dark:text-white/40'>
                      <LocalizedText text={"No steps configured"} />
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className='mt-4 flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-white/10'>
                  <div className='flex items-center gap-1.5'>
                    <Switch
                      checked={automation.enabled}
                      disabled={isBusy}
                      className='scale-[0.8] data-[state=checked]:bg-white'
                      onCheckedChange={(checked) =>
                        handleStatusChange(automation, checked)
                      }
                      aria-label={`${automation.enabled ? "Pause" : "Activate"} ${title}`}
                    />
                    <button
                      type='button'
                      disabled={isBusy}
                      onClick={() => setDeleteTarget(automation)}
                      className='flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-red-600 disabled:opacity-50 dark:text-white/45 dark:hover:bg-white/10 dark:hover:text-red-300'
                      aria-label={`Delete ${title}`}
                    >
                      {isBusy ? (
                        <LoadingFileLoader size={16} />
                      ) : (
                        <Trash2 className='h-3.5 w-3.5' />
                      )}
                    </button>
                  </div>

                  <Button
                    size='sm'
                    type='button'
                    onClick={() =>
                      router.push(`/chat/${automation._id}?preview=automation`)
                    }
                    className='rounded-lg'
                  >
                    <span>
                      <LocalizedText text={"Configure"} />
                    </span>
                    <ArrowUpRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Automation Templates */}
      <section className='mt-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
        <div className='mb-5'>
          <h2 className='text-base font-semibold'>
            <LocalizedText text={"Templates"} />
          </h2>
          <p className='mt-0.5 text-xs text-zinc-500 dark:text-white/50'>
            <LocalizedText
              text={
                "Start with a pre-built workflow and customize it for your brand."
              }
            />
          </p>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {TEMPLATES.map((tmpl, idx) => {
            const IconComponent = tmpl.icon;
            return (
              <div
                key={idx}
                className='group flex flex-col rounded-lg border border-zinc-200 bg-zinc-50 p-5 transition-colors duration-200 hover:bg-white dark:border-white/10 dark:bg-[#0c0c0c] dark:hover:bg-white/[0.05]'
              >
                <div className='mb-3 flex items-center gap-2'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-white text-zinc-600 ring-1 ring-zinc-200 dark:bg-white/10 dark:text-white/70 dark:ring-0'>
                    <IconComponent className='h-4 w-4' />
                  </div>
                  <span className='rounded-md bg-zinc-200/70 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-white/10 dark:text-white/50'>
                    {tmpl.badge}
                  </span>
                </div>

                <h3 className='text-sm font-semibold'>{tmpl.title}</h3>
                <p className='mt-1 flex-1 text-xs leading-relaxed text-zinc-500 dark:text-white/50'>
                  {tmpl.description}
                </p>

                <div className='mt-4 border-t border-zinc-200 pt-3 dark:border-white/10'>
                  <Button
                    onClick={() => handleCreate(tmpl.prompt)}
                    disabled={creating}
                    className='group rounded-lg px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    <span>{creating ? "Creating..." : "Use Template"}</span>
                    <ArrowRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <LocalizedText text={"Delete this automation?"} />
            </AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title || "Untitled automation"}
              <LocalizedText
                text={
                  '" and its workflow will be permanently deleted. This cannot be undone.'
                }
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <LocalizedText text={"Cancel"} />
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              <LocalizedText text={"Delete automation"} />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
