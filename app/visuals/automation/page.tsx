"use client";

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
import { apiResponse } from "@/utils/apiResponse";
import {
  Bot,
  Clock3,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Workflow,
  Zap,
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
              | AutomationDocument
              | undefined;
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

  const handleCreate = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const result = await createProject(
        "Help me create a new automation",
        undefined,
        undefined,
        "automation"
      );
      if (result.type && result.id) {
        router.push(`/chat/${result.id}`);
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
    <div className='animate-in fade-in slide-in-from-bottom-4 flex w-full flex-col gap-6 duration-500'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-foreground text-2xl font-bold tracking-tight dark:text-white'>
            Automations
          </h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Manage every automation running for your organisation.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          disabled={creating}
          className='gap-2 sm:self-center'
        >
          {creating ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <Plus className='h-4 w-4' />
          )}
          New automation
        </Button>
      </div>

      <div className='grid gap-3 sm:grid-cols-3'>
        <div className='bg-card rounded-xl border p-4 shadow-sm'>
          <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
            Total
          </p>
          <p className='mt-1 text-2xl font-semibold'>{automations.length}</p>
        </div>
        <div className='bg-card rounded-xl border p-4 shadow-sm'>
          <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
            Active
          </p>
          <p className='mt-1 text-2xl font-semibold text-emerald-600 dark:text-emerald-400'>
            {activeCount}
          </p>
        </div>
        <div className='bg-card rounded-xl border p-4 shadow-sm'>
          <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
            Paused
          </p>
          <p className='mt-1 text-2xl font-semibold text-amber-600 dark:text-amber-400'>
            {automations.length - activeCount}
          </p>
        </div>
      </div>

      <div className='relative max-w-md'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='Search automations'
          className='pl-9'
        />
      </div>

      {loading ? (
        <div className='flex min-h-64 items-center justify-center rounded-xl border border-dashed'>
          <div className='text-muted-foreground flex items-center gap-2 text-sm'>
            <Loader2 className='h-4 w-4 animate-spin' /> Loading automations…
          </div>
        </div>
      ) : visibleAutomations.length === 0 ? (
        <div className='bg-muted/20 flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center'>
          <div className='text-primary mb-4 rounded-full bg-indigo-600 p-3 hover:bg-indigo-700/10'>
            <Workflow className='h-6 w-6' />
          </div>
          <h2 className='font-semibold'>
            {query ? "No automations found" : "Build your first automation"}
          </h2>
          <p className='text-muted-foreground mt-1 max-w-sm text-sm'>
            {query
              ? "Try another search term."
              : "Describe what you want to automate in chat and Genit will help you build it."}
          </p>
          {!query && (
            <Button
              onClick={handleCreate}
              disabled={creating}
              className='mt-5 gap-2'
            >
              <Plus className='h-4 w-4' /> Create automation
            </Button>
          )}
        </div>
      ) : (
        <div className='grid gap-4 xl:grid-cols-2'>
          {visibleAutomations.map((automation) => {
            const title =
              automation.title ||
              automation.document?.name ||
              "Untitled automation";
            const isBusy = busyId === automation._id;
            const nodeCount = automation.document?.nodes?.length || 0;

            return (
              <article
                key={automation._id}
                className='group bg-card hover:border-primary/25 rounded-xl border p-5 shadow-sm transition hover:shadow-md'
              >
                <div className='flex items-start gap-4'>
                  <div className='text-primary rounded-xl bg-indigo-600 p-2.5 hover:bg-indigo-700/10'>
                    <Zap className='h-5 w-5' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='min-w-0'>
                        <h2 className='truncate font-semibold'>{title}</h2>
                        <div className='text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs'>
                          <span className='flex items-center gap-1'>
                            <Clock3 className='h-3.5 w-3.5' /> Updated{" "}
                            {relativeDate(automation.updatedAt)}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Bot className='h-3.5 w-3.5' /> {nodeCount}{" "}
                            {nodeCount === 1 ? "step" : "steps"}
                          </span>
                        </div>
                      </div>
                      <div className='flex shrink-0 items-center gap-2'>
                        <span
                          className={`text-xs font-medium ${automation.enabled ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
                        >
                          {automation.enabled ? "Active" : "Paused"}
                        </span>
                        <Switch
                          checked={automation.enabled}
                          disabled={isBusy}
                          onCheckedChange={(checked) =>
                            handleStatusChange(automation, checked)
                          }
                          aria-label={`${automation.enabled ? "Pause" : "Activate"} ${title}`}
                        />
                      </div>
                    </div>

                    <div className='mt-5 flex items-center gap-2 border-t pt-4'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='gap-2'
                        onClick={() => router.push(`/chat/${automation._id}`)}
                      >
                        <Pencil className='h-3.5 w-3.5' /> Edit in chat
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-destructive hover:bg-destructive/10 hover:text-destructive ml-auto gap-2'
                        disabled={isBusy}
                        onClick={() => setDeleteTarget(automation)}
                      >
                        {isBusy ? (
                          <Loader2 className='h-3.5 w-3.5 animate-spin' />
                        ) : (
                          <Trash2 className='h-3.5 w-3.5' />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this automation?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleteTarget?.title || "Untitled automation"}” and its workflow
              will be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete automation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
