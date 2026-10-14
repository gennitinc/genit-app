"use client";

import { ActionNode } from "./automation/action-node";
import { AIGenerateNode } from "./automation/ai-generate-node";
import { AutomationNodeView } from "./automation/automation-node-view";
import {
  ADD_NODE_MENU,
  type AddNodeCategory,
  type AddNodeItem,
  type AutomationNodeType,
} from "./automation/automation-types";
import { ConditionNode } from "./automation/condition-node";
import { DelayNode } from "./automation/delay-node";
import { HttpRequestNode } from "./automation/http-request-node";
import { PromptNode } from "./automation/prompt-node";
import { TransformNode } from "./automation/transform-node";
import { TriggerNode } from "./automation/trigger-node";
import { UploadNode } from "./automation/upload-node";
import { Button } from "./ui/button";
import {
  BrevoBrand,
  EyeIcon as Eye,
  FacebookBrand,
  GoogleCalendarBrand,
  GoogleDriveBrand,
  InstagramBrand,
  LinkedinBrand,
  TikTokBrand,
  WhatsAppBrand,
  XBrand,
  YoutubeBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { ConnectDialog } from "@/app/integrations/_components/connect-dialog";
import { LocalizedText } from "@/components/localized-text";
import { useProjectDesign } from "@/context/DesignProject";
import {
  type AutomationGraph,
  automationConnectionCreatesCycle,
  automationEdgeKey,
  cleanAutomationGraph,
  diffAutomationGraph,
  isEmptyAutomationDiff,
  rebaseAutomationGraph,
} from "@/lib/automation-graph-sync";
import {
  type ComposioToolkit,
  type IntegrationPlatform,
  fetchComposioToolkits,
  fetchIntegrations,
} from "@/lib/integrations-api";
import { cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse, serverUrlSocket } from "@/utils/apiResponse";
import cookie from "js-cookie";
import {
  AlertTriangle,
  ArrowLeftRight,
  AtSign,
  CalendarDays,
  CalendarPlus,
  Check,
  ChevronDown,
  CircleFadingArrowUp,
  ClipboardList,
  Clock,
  Edit2,
  FileText,
  GitBranch,
  GitBranchIcon,
  Globe,
  Image,
  ImagePlus,
  Inbox,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  Maximize2,
  MessageCircle,
  MessageSquare,
  Mic,
  Minus,
  Music2,
  Play,
  Plus,
  Redo2,
  SaveAll,
  Search,
  Send,
  Settings,
  Share2,
  Sparkles,
  Twitter,
  Undo2,
  Upload,
  UserPlus,
  Video,
  View,
  Webhook,
  X,
  Zap,
} from "lucide-react";
import ReactFlow, {
  Background,
  BaseEdge,
  type Connection,
  type Edge,
  type EdgeChange,
  EdgeLabelRenderer,
  type EdgeProps,
  type EdgeTypes,
  MarkerType,
  type Node,
  type NodeChange,
  type NodeTypes,
  applyEdgeChanges,
  applyNodeChanges,
  getSmoothStepPath,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { io } from "socket.io-client";
import { toast } from "sonner";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const MENU_ICONS: Record<string, React.ComponentType<any>> = {
  Clock,
  Webhook,
  Play,
  MessageCircle,
  Mail,
  UserPlus,
  MessageSquare,
  Send,
  Image,
  Inbox,
  CalendarDays,
  ClipboardList,
  AtSign,
  FileText,
  Share2,
  Twitter,
  Music2,
  ImagePlus,
  Video,
  Mic,
  CalendarPlus,
  Upload,
  GitBranch,
  Sparkles,
  Zap,
  CircleFadingArrowUp,
  ArrowLeftRight,
  Globe,
  WhatsApp: WhatsAppBrand,
  Brevo: BrevoBrand,
  Facebook: FacebookBrand,
  Instagram: InstagramBrand,
  GoogleCalendar: GoogleCalendarBrand,
  X: XBrand,
  TikTok: TikTokBrand,
  YouTube: YoutubeBrand,
  Linkedin: LinkedinBrand,
  GoogleDrive: GoogleDriveBrand,
};

const MANAGED_STATIC_ACTIONS = new Set([
  "send_gmail",
  "send_brevo_email",
  "send_outlook_email",
  "whatsapp_reply",
  "whatsapp_template",
  "messenger_reply",
  "post_facebook",
  "post_instagram",
  "post_linkedin",
  "post_x",
  "post_tiktok",
  "post_youtube",
  "add_calendar_event",
  "google_drive_upload",
]);

const automationNode = (
  EditNode: React.ComponentType<any>,
  kind: React.ComponentProps<typeof AutomationNodeView>["kind"]
) => {
  const NodeRenderer = (props: any) =>
    props.data.isEditMode ? (
      <EditNode {...props} />
    ) : (
      <AutomationNodeView data={props.data} kind={kind} />
    );
  NodeRenderer.displayName = `${kind}AutomationNode`;
  return NodeRenderer;
};

const nodeTypes: NodeTypes = {
  trigger: automationNode(TriggerNode, "trigger"),
  action: automationNode(ActionNode, "action"),
  prompt: automationNode(PromptNode, "prompt"),
  condition: automationNode(ConditionNode, "condition"),
  delay: automationNode(DelayNode, "delay"),
  ai_generate: automationNode(AIGenerateNode, "ai_generate"),
  transform: automationNode(TransformNode, "transform"),
  http_request: automationNode(HttpRequestNode, "http_request"),
  upload: automationNode(UploadNode, "upload"),
};

function automationTraceSummary(trace: any[] = []) {
  return trace
    .map((step) => {
      if (step.type === "condition")
        return step.outcome
          ? `${step.nodeId}: ${step.outcome} branch`
          : `${step.nodeId}: ${step.detail || step.status || "validated"}`;
      if (step.type === "delay")
        return `${step.nodeId}: ${step.detail || "delay validated without waiting"}`;
      if (step.status) return `${step.nodeId}: ${step.status}`;
      return `${step.nodeId}: ${step.type}`;
    })
    .join("\n");
}

const newNodeId = (type: string) =>
  `${type}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const isEditableTarget = (target: EventTarget | null) =>
  Boolean(
    (target as HTMLElement | null)?.closest?.(
      "input, textarea, select, [contenteditable='true']"
    )
  );

const AutomationCanvasContext = React.createContext<{
  isEditMode: boolean;
  removeEdge: (edgeId: string) => void;
}>({ isEditMode: false, removeEdge: () => {} });

/** Connection line with an inline remove control while editing. */
function RemovableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  selected,
}: EdgeProps) {
  const { isEditMode, removeEdge } = React.useContext(AutomationCanvasContext);
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />
      {isEditMode && (
        <EdgeLabelRenderer>
          <button
            type='button'
            onClick={(event) => {
              event.stopPropagation();
              removeEdge(id);
            }}
            title='Remove connection'
            aria-label='Remove connection'
            className={cn(
              "nodrag nopan border-border bg-background text-muted-foreground hover:border-destructive/60 hover:text-destructive absolute flex h-5 w-5 items-center justify-center rounded-full border shadow-sm transition-[opacity,color,border-color] duration-150",
              selected ? "opacity-100" : "opacity-60 hover:opacity-100"
            )}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
          >
            <X className='h-3 w-3' />
          </button>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

const edgeTypes: EdgeTypes = { removable: RemovableEdge };

// ── MAIN AUTOMATION WORKFLOW COMPONENT ──────────────────────────────────────

interface AutomationWorkflowProps {
  slug?: string;
  embedMode?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export default function AutomationWorkflow({
  slug,
  embedMode = false,
  isFullscreen,
  onToggleFullscreen,
}: AutomationWorkflowProps) {
  const { focusedGenerationId, messages } = useProjectDesign();
  const projectId = slug || null;
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 0.8 });
  const viewportRef = useRef(viewport);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const isEditModeRef = useRef(isEditMode);
  isEditModeRef.current = isEditMode;
  const [showAddComponent, setShowAddComponent] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [composioToolkits, setComposioToolkits] = useState<ComposioToolkit[]>(
    []
  );
  const [connectedToolkits, setConnectedToolkits] = useState<Set<string>>(
    new Set()
  );
  const [connectedPlatforms, setConnectedPlatforms] = useState<Set<string>>(
    new Set()
  );
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [pendingConnectedApp, setPendingConnectedApp] =
    useState<AddNodeItem | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const reactFlowRef = useRef<any>(null);
  reactFlowRef.current = reactFlowInstance;
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const validationCount = nodes.filter(
    (node) => (node.data?.validationErrors as string[] | undefined)?.length
  ).length;

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [workflowReady, setWorkflowReady] = useState<boolean | null>(null);

  const nodesRef = useRef<Node[]>(nodes);
  const edgesRef = useRef<Edge[]>(edges);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  // The last graph the server confirmed. Local edits are diffs against it, so
  // agent updates and saves can be merged instead of overwriting each other.
  const syncedRef = useRef<{ revision: number; graph: AutomationGraph } | null>(
    null
  );
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const saveQueuedRef = useRef(false);
  const saveFailuresRef = useRef(0);
  const validationRef = useRef(new Map<string, string[]>());
  const performSaveRef = useRef<() => Promise<void>>(async () => {});

  const localGraph = useCallback(
    () => cleanAutomationGraph(nodesRef.current, edgesRef.current),
    []
  );

  // Every node change goes through these so the refs read by saves, socket
  // merges, and history are never behind the rendered canvas.
  const updateNodes = useCallback(
    (update: (current: Node[]) => Node[]) => {
      const next = update(nodesRef.current);
      nodesRef.current = next;
      setNodes(next);
      return next;
    },
    [setNodes]
  );
  const updateEdges = useCallback(
    (update: (current: Edge[]) => Edge[]) => {
      const next = update(edgesRef.current);
      edgesRef.current = next;
      setEdges(next);
      return next;
    },
    [setEdges]
  );

  // ── History ─────────────────────────────────────────────────────────────

  const historyRef = useRef<{ stack: AutomationGraph[]; index: number }>({
    stack: [],
    index: -1,
  });
  const [history, setHistory] = useState({ canUndo: false, canRedo: false });
  const syncHistory = useCallback(() => {
    const { stack, index } = historyRef.current;
    setHistory({ canUndo: index > 0, canRedo: index < stack.length - 1 });
  }, []);
  const resetHistory = useCallback(
    (graph: AutomationGraph) => {
      historyRef.current = { stack: [graph], index: 0 };
      syncHistory();
    },
    [syncHistory]
  );
  const recordHistory = useCallback(
    (graph: AutomationGraph) => {
      const { stack, index } = historyRef.current;
      if (
        stack[index] &&
        JSON.stringify(stack[index]) === JSON.stringify(graph)
      )
        return;
      const next = [...stack.slice(0, index + 1), graph].slice(-50);
      historyRef.current = { stack: next, index: next.length - 1 };
      syncHistory();
    },
    [syncHistory]
  );

  // ── Node callbacks ──────────────────────────────────────────────────────

  // Nodes receive stable wrappers; the latest implementations live in a ref.
  const handlersRef = useRef({
    removeNode: (_nodeId: string) => {},
    onNodeDataChange: (_nodeId: string, _fields: any) => {},
    onTestRun: async (_nodeId: string) => {},
  });
  const nodeHandlers = useMemo(
    () => ({
      onRemoveNode: (nodeId: string) => handlersRef.current.removeNode(nodeId),
      onNodeDataChange: (nodeId: string, fields: any) =>
        handlersRef.current.onNodeDataChange(nodeId, fields),
      onTestRun: (nodeId: string) => handlersRef.current.onTestRun(nodeId),
    }),
    []
  );

  const showGraph = useCallback(
    (graph: AutomationGraph) => {
      const previous = new Map(nodesRef.current.map((node) => [node.id, node]));
      const previousEdges = new Map(
        edgesRef.current.map((edge) => [automationEdgeKey(edge), edge])
      );
      updateNodes(() =>
        graph.nodes.map((node) => {
          const legacyEmailTrigger =
            node.type === "trigger" &&
            (node.data?.triggerType === "email_received" ||
              (!node.data?.triggerType &&
                /(?:incoming|new)?\s*email\s+received/i.test(
                  node.data?.title || ""
                )));
          return {
            ...node,
            position: node.position || { x: 0, y: 0 },
            draggable: true,
            selected: previous.get(node.id)?.selected,
            data: {
              ...node.data,
              ...(legacyEmailTrigger ? { triggerType: "gmail_received" } : {}),
              ...nodeHandlers,
              isEditMode: isEditModeRef.current,
              isTesting: previous.get(node.id)?.data?.isTesting,
              validationErrors: validationRef.current.get(node.id) || [],
            },
          } as Node;
        })
      );
      updateEdges(
        () =>
          graph.edges.map((edge) => ({
            ...edge,
            id:
              edge.id ||
              `edge-${edge.source}-${edge.sourceHandle || ""}-${edge.target}`,
            selected: previousEdges.get(automationEdgeKey(edge))?.selected,
          })) as Edge[]
      );
    },
    [nodeHandlers, updateNodes, updateEdges]
  );

  const setValidation = useCallback((errors?: any[], ready?: boolean) => {
    validationRef.current = new Map(
      (errors || []).map((item: any) => [item.nodeId, item.errors || []])
    );
    if (ready !== undefined) setWorkflowReady(Boolean(ready));
  }, []);

  const fitSoon = useCallback((duration = 600) => {
    setTimeout(() => {
      if (nodesRef.current.length)
        reactFlowRef.current?.fitView({ duration, padding: 0.25 });
    }, 150);
  }, []);

  const scheduleAutoSave = useCallback((delay = 1500) => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(
      () => void performSaveRef.current(),
      delay
    );
  }, []);

  /** Adopts a graph from the server, replaying any unsaved local edits. */
  const applyServerGraph = useCallback(
    (
      payload: { revision?: number; nodes?: any[]; edges?: any[] },
      options: { validationErrors?: any[]; ready?: boolean; fit?: boolean } = {}
    ) => {
      const revision = Number(payload.revision ?? 0);
      const synced = syncedRef.current;
      if (synced && revision < synced.revision) return;
      const remote = cleanAutomationGraph(payload.nodes, payload.edges);
      const next = synced
        ? rebaseAutomationGraph(synced.graph, localGraph(), remote)
        : remote;
      const nodeCountChanged = next.nodes.length !== nodesRef.current.length;
      syncedRef.current = { revision, graph: remote };
      if (options.validationErrors)
        setValidation(options.validationErrors, options.ready);
      showGraph(next);
      recordHistory(next);
      if (!isEmptyAutomationDiff(diffAutomationGraph(remote, next)))
        scheduleAutoSave();
      if (options.fit || nodeCountChanged) fitSoon();
    },
    [
      fitSoon,
      localGraph,
      recordHistory,
      scheduleAutoSave,
      setValidation,
      showGraph,
    ]
  );

  const refetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refetchGraph = useCallback(
    async ({ fit = false }: { fit?: boolean } = {}) => {
      if (!projectId || !syncedRef.current) return;
      try {
        const res = await apiResponse.get(
          `/apps/automation/${projectId}?layout=1`,
          { withCredentials: true }
        );
        if (res.data?.success && res.data.data)
          applyServerGraph(
            {
              ...res.data.data,
              revision: res.data.revision ?? res.data.data.revision,
            },
            {
              validationErrors: res.data.validationErrors || [],
              ready: res.data.ready,
              fit,
            }
          );
      } catch (error) {
        console.error("Failed to refresh the automation:", error);
      }
    },
    [projectId, applyServerGraph]
  );
  // Bursts of socket events collapse into a single refresh.
  const requestRefetch = useCallback(
    (options: { fit?: boolean } = {}) => {
      if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
      refetchTimerRef.current = setTimeout(
        () => void refetchGraph(options),
        250
      );
    },
    [refetchGraph]
  );

  // ── Auto-save ───────────────────────────────────────────────────────────

  const performSave = useCallback(async () => {
    const synced = syncedRef.current;
    if (!projectId || !synced) return;
    if (savingRef.current) {
      saveQueuedRef.current = true;
      return;
    }
    const sent = localGraph();
    if (isEmptyAutomationDiff(diffAutomationGraph(synced.graph, sent))) {
      setSaveStatus((status) => (status === "error" ? "idle" : status));
      return;
    }

    savingRef.current = true;
    setSaveStatus("saving");
    setWorkflowReady(null);
    try {
      const res = await apiResponse.put(
        `/apps/automation/${projectId}`,
        {
          ...sent,
          viewport: viewportRef.current,
          baseRevision: synced.revision,
        },
        { withCredentials: true }
      );
      const saved = res.data?.data;
      if (!res.data?.success || !saved)
        throw new Error(res.data?.message || "The workflow was not saved");
      const remote = cleanAutomationGraph(saved.nodes, saved.edges);
      // Keep anything edited while the request was in flight.
      const next = rebaseAutomationGraph(sent, localGraph(), remote);
      syncedRef.current = {
        revision: Number(res.data.revision ?? saved.revision ?? 0),
        graph: remote,
      };
      setValidation(res.data.validationErrors || [], res.data.ready);
      showGraph(next);
      if (res.data.dropped?.length)
        toast.warning("Some invalid connections were removed", {
          description: res.data.dropped.join("\n"),
        });
      saveFailuresRef.current = 0;
      setSaveStatus("saved");
      setTimeout(
        () => setSaveStatus((status) => (status === "saved" ? "idle" : status)),
        2000
      );
    } catch (err: any) {
      const conflict = err?.response?.status === 409 && err.response.data?.data;
      if (conflict) {
        // The agent (or another tab) changed the workflow first: replay these
        // edits on top of its version and save again.
        const data = err.response.data;
        const remote = cleanAutomationGraph(data.data.nodes, data.data.edges);
        const next = rebaseAutomationGraph(synced.graph, localGraph(), remote);
        syncedRef.current = {
          revision: Number(data.revision ?? data.data.revision ?? 0),
          graph: remote,
        };
        showGraph(next);
        recordHistory(next);
        saveQueuedRef.current = true;
      } else {
        saveFailuresRef.current += 1;
        setSaveStatus("error");
        console.error("Auto-save error:", err);
        if (saveFailuresRef.current === 1)
          toast.error("Couldn't save the workflow", {
            description:
              err?.response?.data?.message ||
              "Your changes are kept here and will be retried automatically.",
          });
        scheduleAutoSave(Math.min(30000, 2000 * 2 ** saveFailuresRef.current));
      }
    } finally {
      savingRef.current = false;
      if (saveQueuedRef.current) {
        saveQueuedRef.current = false;
        scheduleAutoSave(0);
      }
    }
  }, [
    projectId,
    localGraph,
    recordHistory,
    scheduleAutoSave,
    setValidation,
    showGraph,
  ]);
  performSaveRef.current = performSave;

  /** Flushes pending edits so server-side checks see the current canvas. */
  const saveNow = useCallback(async () => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    for (let waited = 0; savingRef.current && waited < 100; waited += 1)
      await new Promise((resolve) => setTimeout(resolve, 100));
    await performSaveRef.current();
  }, []);

  // Any canvas change schedules a save; unchanged graphs are skipped there.
  useEffect(() => {
    if (isLoading || !syncedRef.current) return;
    scheduleAutoSave();
  }, [nodes, edges, isLoading, scheduleAutoSave]);

  // Leaving the preview must not drop edits still waiting for the debounce.
  useEffect(
    () => () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
      void performSaveRef.current();
    },
    []
  );

  // ── Node callbacks ──────────────────────────────────────────────────────

  const removeNode = useCallback(
    (nodeId: string) => {
      updateNodes((current) => current.filter((node) => node.id !== nodeId));
      updateEdges((current) =>
        current.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        )
      );
      recordHistory(localGraph());
    },
    [localGraph, recordHistory, updateEdges, updateNodes]
  );

  const removeEdge = useCallback(
    (edgeId: string) => {
      updateEdges((current) => current.filter((edge) => edge.id !== edgeId));
      recordHistory(localGraph());
    },
    [localGraph, recordHistory, updateEdges]
  );

  const onNodeDataChange = useCallback(
    (nodeId: string, updatedFields: any) => {
      updateNodes((current) =>
        current.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updatedFields } }
            : node
        )
      );
    },
    [updateNodes]
  );

  const onTestRun = useCallback(
    async (nodeId: string) => {
      if (!projectId) {
        toast.error("Project ID is missing. Cannot run test.");
        return;
      }
      try {
        onNodeDataChange(nodeId, { isTesting: true });
        toast.loading("Running zero-credit dry run...", {
          id: `test-run-${nodeId}`,
        });
        // The dry run reads the stored workflow, so save pending edits first.
        await saveNow();
        const res = await apiResponse.post(
          `/apps/automation/${projectId}/test-run`,
          { nodeId }
        );
        if (res.data?.success) {
          const trace = automationTraceSummary(res.data?.data?.trace);
          toast.success(res.data.message || `Zero-credit dry run passed.`, {
            id: `test-run-${nodeId}`,
            description: trace || undefined,
          });
        } else {
          toast.error("Dry run found issues", { id: `test-run-${nodeId}` });
        }
      } catch (err: any) {
        console.error(err);
        const data = err.response?.data;
        const errorMessage = data?.message || "Dry run failed";
        const errorDetails =
          data?.errors?.length > 0 ? data.errors.join("\n") : undefined;
        const trace = automationTraceSummary(data?.data?.trace);

        toast.error(errorMessage, {
          id: `test-run-${nodeId}`,
          description: [errorDetails, trace].filter(Boolean).join("\n"),
        });
      } finally {
        onNodeDataChange(nodeId, { isTesting: false });
      }
    },
    [projectId, onNodeDataChange, saveNow]
  );
  handlersRef.current = { removeNode, onNodeDataChange, onTestRun };

  const undo = useCallback(() => {
    const current = historyRef.current;
    if (current.index <= 0) return;
    current.index -= 1;
    showGraph(current.stack[current.index]);
    syncHistory();
  }, [showGraph, syncHistory]);

  const redo = useCallback(() => {
    const current = historyRef.current;
    if (current.index >= current.stack.length - 1) return;
    current.index += 1;
    showGraph(current.stack[current.index]);
    syncHistory();
  }, [showGraph, syncHistory]);

  // ── Keyboard shortcuts for undo/redo ────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Never hijack undo inside text fields, the chat box, or other panels.
      if (!isEditModeRef.current || isEditableTarget(e.target)) return;
      const target = e.target as HTMLElement | null;
      if (target !== document.body && !rootRef.current?.contains(target))
        return;
      const key = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.metaKey || e.ctrlKey) && key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  // ── Fetch automation state ──────────────────────────────────────────────

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    syncedRef.current = null;
    setIsLoading(true);
    setLoadError(null);
    apiResponse
      .get(`/apps/automation/${projectId}?layout=1`, { withCredentials: true })
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data;
        if (!res.data?.success || !data)
          throw new Error(res.data?.message || "Automation not found");
        if (data.viewport) {
          setViewport(data.viewport);
          viewportRef.current = data.viewport;
        }
        const graph = cleanAutomationGraph(data.nodes, data.edges);
        syncedRef.current = {
          revision: Number(res.data.revision ?? data.revision ?? 0),
          graph,
        };
        setValidation(res.data.validationErrors || [], res.data.ready);
        showGraph(graph);
        resetHistory(graph);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load automation:", err);
        setLoadError(
          err?.response?.data?.message || "Failed to load automation canvas"
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // showGraph and friends are stable for a given project.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, loadAttempt]);

  // Update nodes isEditMode state when edit mode toggles
  useEffect(() => {
    updateNodes((current) =>
      current.map((node) => ({
        ...node,
        data: { ...node.data, isEditMode },
      }))
    );
  }, [isEditMode, updateNodes]);

  // Node dimensions and handle direction change between edit and view modes.
  // Refit after that render so the complete workflow stays comfortably visible.
  useEffect(() => {
    if (isLoading || !reactFlowInstance || nodes.length === 0) return;
    const timer = setTimeout(
      () => reactFlowInstance.fitView({ duration: 500, padding: 0.25 }),
      100
    );
    return () => clearTimeout(timer);
  }, [isLoading, isEditMode, reactFlowInstance, nodes.length]);

  // ── Live updates from the agent ─────────────────────────────────────────

  const applyServerGraphRef = useRef(applyServerGraph);
  applyServerGraphRef.current = applyServerGraph;
  const requestRefetchRef = useRef(requestRefetch);
  requestRefetchRef.current = requestRefetch;

  // One socket per canvas. It rejoins the project room after every reconnect
  // and refetches, so updates emitted while disconnected are never lost.
  useEffect(() => {
    if (!projectId) return;
    const socket = io(serverUrlSocket, {
      auth: { token: cookie.get("genituToken") || "" },
      withCredentials: true,
    });
    const join = () =>
      socket.emit("joinProject", projectId, () => {
        if (syncedRef.current) requestRefetchRef.current();
      });
    socket.on("connect", join);
    // Every agent edit carries the complete persisted graph.
    socket.on("automation:graph:update", (data: any) => {
      if (String(data?.projectId) !== String(projectId)) return;
      if (!syncedRef.current) return;
      applyServerGraphRef.current(data);
    });
    // Older servers send partial actions; the stored graph is authoritative.
    socket.on("automation:ai:update", (data: any) => {
      if (String(data?.projectId) === String(projectId))
        requestRefetchRef.current();
    });
    // Final verification can repair the graph after the last tool call.
    socket.on("agent:run:end", (data: any) => {
      if (String(data?.projectId) === String(projectId))
        requestRefetchRef.current({ fit: true });
    });
    return () => {
      socket.off("connect", join);
      socket.off("automation:graph:update");
      socket.off("automation:ai:update");
      socket.off("agent:run:end");
      socket.disconnect();
    };
  }, [projectId]);

  // ── Load snapshot version ───────────────────────────────────────────────

  const appliedSnapshotRef = useRef<string | null>(null);
  useEffect(() => {
    if (
      !focusedGenerationId ||
      isLoading ||
      appliedSnapshotRef.current === focusedGenerationId
    )
      return;
    let snapshot: any = null;
    for (const msg of messages || []) {
      for (const group of msg.generationGroups || []) {
        const item = group.items?.find(
          (entry: any) => entry.id === focusedGenerationId
        );
        if (item?.type === "application/json+automation" && item.data) {
          snapshot = item.data;
          break;
        }
      }
      if (snapshot) break;
    }
    // Restore a version once when it is selected, not on every new message.
    if (!snapshot) return;
    appliedSnapshotRef.current = focusedGenerationId;
    const graph = cleanAutomationGraph(snapshot.nodes, snapshot.edges);
    showGraph(graph);
    recordHistory(graph);
    fitSoon(400);
  }, [
    focusedGenerationId,
    messages,
    isLoading,
    showGraph,
    recordHistory,
    fitSoon,
  ]);

  // ── Manual editing ──────────────────────────────────────────────────────

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      updateNodes((current) => applyNodeChanges(changes, current));
      if (changes.some((change) => change.type === "remove"))
        recordHistory(localGraph());
    },
    [localGraph, recordHistory, updateNodes]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      updateEdges((current) => applyEdgeChanges(changes, current));
      if (changes.some((change) => change.type === "remove"))
        recordHistory(localGraph());
    },
    [localGraph, recordHistory, updateEdges]
  );

  // Rejects connections the server would refuse, so a bad drag can never
  // leave the canvas in a state that fails every later save.
  const isValidConnection = useCallback((connection: Connection) => {
    const { source, target } = connection;
    if (!source || !target) return false;
    const sourceNode = nodesRef.current.find((node) => node.id === source);
    if (!sourceNode || !nodesRef.current.some((node) => node.id === target))
      return false;
    if (
      sourceNode.type === "condition" &&
      !["true", "false"].includes(String(connection.sourceHandle))
    )
      return false;
    if (
      edgesRef.current.some(
        (edge) =>
          edge.source === source &&
          edge.target === target &&
          (edge.sourceHandle || null) === (connection.sourceHandle || null)
      )
    )
      return false;
    return !automationConnectionCreatesCycle(edgesRef.current, source, target);
  }, []);

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!isValidConnection(connection)) return;
      updateEdges((current) => [
        ...current,
        {
          id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
          source: connection.source!,
          target: connection.target!,
          ...(connection.sourceHandle
            ? { sourceHandle: connection.sourceHandle }
            : {}),
          animated: true,
        },
      ]);
      recordHistory(localGraph());
    },
    [isValidConnection, localGraph, recordHistory, updateEdges]
  );

  // ── Node drag stop → capture history ────────────────────────────────────

  const onNodeDragStop = useCallback(() => {
    recordHistory(localGraph());
  }, [localGraph, recordHistory]);

  const onMoveEnd = useCallback(
    (_event: any, vp: { x: number; y: number; zoom: number }) => {
      viewportRef.current = vp;
      setViewport(vp);
    },
    []
  );

  // ── Add Component ───────────────────────────────────────────────────────

  const addComponent = (
    type: AutomationNodeType,
    subtype?: string,
    initialData: Record<string, unknown> = {}
  ) => {
    const nodeId = newNodeId(type);

    let position = {
      x: 200 + ((nodesRef.current.length * 40) % 200),
      y: 150 + ((nodesRef.current.length * 40) % 200),
    };

    // Place it in the middle of the visible canvas, which in the chat preview
    // is only part of the window.
    const bounds = canvasRef.current?.getBoundingClientRect();
    if (reactFlowInstance && bounds) {
      const center = reactFlowInstance.project({
        x: bounds.width / 2,
        y: bounds.height / 2,
      });
      position = {
        x: center.x - 140 + (Math.random() * 60 - 30),
        y: center.y - 80 + (Math.random() * 60 - 30),
      };
    }

    // Build type-specific default data
    const baseData: any = {
      title: `${type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ")}`,
      nodeId,
    };

    switch (type) {
      case "trigger":
        baseData.triggerType = subtype || "schedule";
        baseData.scheduleFrequency = "Every Monday";
        baseData.filterField = "";
        baseData.filterValue = "";
        if (subtype === "composio_event") {
          baseData.composioToolkit = "";
          baseData.composioTriggerSlug = "";
          baseData.composioTriggerConfig = {};
        }
        break;
      case "action":
        baseData.actionType = subtype || "send_gmail";
        baseData.dynamicMode = "static";
        baseData.recipientEmail = "";
        baseData.subject = "";
        baseData.messageBody = "";
        baseData.contentText = "";
        baseData.instruction = "";
        if (subtype === "composio_action") {
          baseData.composioToolkit = "";
          baseData.composioToolSlug = "";
          baseData.composioToolArguments = {};
        }
        break;
      case "prompt":
        baseData.instruction = "";
        break;
      case "condition":
        baseData.field = "";
        baseData.operator = "equals";
        baseData.value = "";
        break;
      case "delay":
        baseData.duration = 5;
        baseData.unit = "minutes";
        break;
      case "ai_generate":
        baseData.contentType = "text";
        baseData.prompt = "";
        baseData.model = "";
        baseData.aspectRatio = "16:9";
        baseData.dynamicMode = "static";
        break;
      case "transform":
        baseData.mappings = [{ key: "", value: "" }];
        baseData.expression = "";
        break;
      case "http_request":
        baseData.method = "GET";
        baseData.url = "";
        baseData.headers = [];
        baseData.body = "";
        break;
      case "upload":
        baseData.fileName = undefined;
        baseData.fileSize = undefined;
        baseData.fileType = undefined;
        baseData.fileUrl = undefined;
        break;
    }
    Object.assign(baseData, initialData);

    // Inject interactive callbacks immediately so the node is fully
    // functional in edit mode without needing a toggle cycle.
    const newNode: Node = {
      id: nodeId,
      type,
      position,
      draggable: true,
      data: {
        ...baseData,
        ...nodeHandlers,
        isEditMode,
        validationErrors: [],
      },
    };

    updateNodes((current) => [...current, newNode]);
    recordHistory(localGraph());
    setShowAddComponent(false);
    setAddSearch("");
  };

  useEffect(() => {
    if (!showAddComponent) return;
    setCatalogLoading(true);
    Promise.all([fetchComposioToolkits(), fetchIntegrations()])
      .then(([toolkits, connections]) => {
        setComposioToolkits(toolkits);
        setConnectedToolkits(
          new Set(
            connections.integrations
              .filter(
                (item) =>
                  item.platform === "composio" && item.status === "active"
              )
              .map((item) =>
                String(item.metadata?.toolkitSlug || "").toLowerCase()
              )
              .filter(Boolean)
          )
        );
        setConnectedPlatforms(
          new Set(
            connections.integrations
              .filter((item) => item.status === "active")
              .filter((item) => item.platform !== "composio")
              .map((item) => String(item.platform).toLowerCase())
          )
        );
      })
      .catch(() => setComposioToolkits([]))
      .finally(() => setCatalogLoading(false));
  }, [showAddComponent]);

  const addNodeMenu = useMemo<AddNodeCategory[]>(() => {
    const query = addSearch.trim().toLowerCase();
    const matching = composioToolkits.filter(
      (item) =>
        (!query ||
          item.name.toLowerCase().includes(query) ||
          item.slug.includes(query)) &&
        (query || connectedToolkits.has(item.slug) || item.verifiedByGenit)
    );
    const visible = matching
      .sort(
        (a, b) =>
          Number(connectedToolkits.has(b.slug)) -
          Number(connectedToolkits.has(a.slug))
      )
      .slice(0, query ? 20 : 8);
    const appCategory = (type: "trigger" | "action"): AddNodeCategory => ({
      label:
        type === "trigger" ? "Connected app triggers" : "Connected app actions",
      items: visible.map((item) => ({
        type,
        subtype: type === "trigger" ? "composio_event" : "composio_action",
        label: `${item.name} ${type === "trigger" ? "event" : "action"}`,
        iconName: "Zap",
        iconUrl: item.logo,
        connected: connectedToolkits.has(item.slug),
        initialData: {
          title: `${item.name} ${type === "trigger" ? "Event" : "Action"}`,
          composioToolkit: item.slug,
          composioToolkitName: item.name,
          composioLogo: item.logo,
        },
      })),
    });
    const staticMenu = ADD_NODE_MENU.map((category) => ({
      ...category,
      items: category.items
        .filter((item) => {
          const toolkit = String(
            item.initialData?.connectionToolkit ||
              item.initialData?.connectionPlatform ||
              ""
          ).toLowerCase();
          return (
            (!visible.length ||
              (item.subtype !== "composio_event" &&
                item.subtype !== "composio_action")) &&
            (!query || item.label.toLowerCase().includes(query)) &&
            !(
              item.type === "action" &&
              connectedToolkits.has(toolkit) &&
              !MANAGED_STATIC_ACTIONS.has(String(item.subtype || ""))
            )
          );
        })
        .map((item) => {
          const platform = String(
            item.initialData?.connectionPlatform || ""
          ).toLowerCase();
          const toolkit = String(
            item.initialData?.connectionToolkit || platform
          ).toLowerCase();
          return {
            ...item,
            ...(platform
              ? {
                  connected:
                    connectedPlatforms.has(platform) ||
                    ((item.type === "action" ||
                      ["gmail", "outlook"].includes(platform)) &&
                      connectedToolkits.has(toolkit)),
                }
              : {}),
          };
        }),
    })).filter((category) => category.items.length);
    return visible.length
      ? [appCategory("trigger"), appCategory("action"), ...staticMenu]
      : staticMenu;
  }, [addSearch, composioToolkits, connectedPlatforms, connectedToolkits]);

  // ── Close dropdown on outside click ─────────────────────────────────────

  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as HTMLElement)
      ) {
        setShowAddComponent(false);
      }
    };
    if (showAddComponent) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [showAddComponent]);

  // ── Render ──────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className='bg-background flex h-full min-h-[300px] flex-col items-center justify-center'>
        <LoadingFileLoader size={20} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className='bg-background flex h-full min-h-[300px] flex-col items-center justify-center gap-3 px-4 text-center'>
        <AlertTriangle className='h-5 w-5 text-amber-500' />
        <p className='text-muted-foreground text-sm'>{loadError}</p>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setLoadAttempt((attempt) => attempt + 1)}
        >
          <LocalizedText text={"Try again"} />
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className='bg-background relative flex h-full w-full flex-col'
    >
      {/* ── Header with Title & Toolbar (side-by-side) ──────────────── */}
      <div className='border-border/80 bg-background/50 z-10 flex shrink-0 items-center justify-between border-b px-4 py-1 backdrop-blur-sm'>
        <div className='text-foreground flex items-center gap-2'>
          <div className='flex h-fit w-full items-center justify-start space-x-1.5 px-2'>
            <span className='h-2 w-2 rounded-full bg-red-400' />
            <span className='h-2 w-2 rounded-full bg-yellow-400' />
            <span className='h-2 w-2 rounded-full bg-green-400' />
          </div>

          <span className='text-sm font-semibold'>
            <LocalizedText text={"Automation"} />
          </span>
        </div>

        {/* Toolbar items at the far right */}
        <div className='bg-background/80 border-border flex items-center space-x-1 rounded-md border p-1 shadow-sm backdrop-blur-sm'>
          {/* Fullscreen Toggle */}
          {onToggleFullscreen && (
            <>
              <Button
                variant='ghost'
                size='sm'
                onClick={onToggleFullscreen}
                className={cn(
                  "text-muted-foreground hover:text-foreground h-7 gap-1.5 rounded px-2 text-xs font-medium transition-colors",
                  isFullscreen && "bg-muted text-foreground"
                )}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                <Maximize2 className='h-3.5 w-3.5' />
              </Button>
              <div className='bg-border h-5 w-px' />
            </>
          )}

          {/* Edit / View toggle */}
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsEditMode(!isEditMode)}
            className={cn(
              "h-7 gap-1.5 rounded px-2 text-xs font-medium transition-colors",
              isEditMode
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isEditMode ? (
              <>
                <Eye className='h-3.5 w-3.5' />
                <LocalizedText text={"View"} />
              </>
            ) : (
              <>
                <Edit2 className='h-3.5 w-3.5' />
                <LocalizedText text={"Edit"} />
              </>
            )}
          </Button>

          <div className='bg-border h-5 w-px' />

          {/* Undo */}
          <Button
            variant='ghost'
            size='sm'
            onClick={undo}
            disabled={!isEditMode || !history.canUndo}
            className='hover:bg-accent h-7 w-7 rounded p-0 disabled:cursor-not-allowed disabled:opacity-40'
            title='Undo (Ctrl+Z)'
          >
            <Undo2 className='h-3.5 w-3.5' />
          </Button>

          {/* Redo */}
          <Button
            variant='ghost'
            size='sm'
            onClick={redo}
            disabled={!isEditMode || !history.canRedo}
            className='hover:bg-accent h-7 w-7 rounded p-0 disabled:cursor-not-allowed disabled:opacity-40'
            title='Redo (Ctrl+Y)'
          >
            <Redo2 className='h-3.5 w-3.5' />
          </Button>

          <div className='bg-border h-5 w-px' />

          {/* Zoom In */}
          <Button
            variant='ghost'
            size='sm'
            onClick={() => reactFlowInstance?.zoomIn({ duration: 200 })}
            className='hover:bg-accent h-7 w-7 rounded p-0'
            title='Zoom In'
          >
            <Plus className='h-3.5 w-3.5' />
          </Button>

          {/* Zoom Out */}
          <Button
            variant='ghost'
            size='sm'
            onClick={() => reactFlowInstance?.zoomOut({ duration: 200 })}
            className='hover:bg-accent h-7 w-7 rounded p-0'
            title='Zoom Out'
          >
            <Minus className='h-3.5 w-3.5' />
          </Button>

          {/* Fit View */}
          <Button
            variant='ghost'
            size='sm'
            onClick={() =>
              reactFlowInstance?.fitView({ padding: 0.2, duration: 200 })
            }
            className='hover:bg-accent h-7 w-7 rounded p-0'
            title='Fit View'
          >
            <View className='h-3.5 w-3.5' />
          </Button>

          {/* Add Node (edit mode only) */}
          {isEditMode && (
            <>
              <div className='bg-border h-5 w-px' />
              <div className='relative' ref={dropdownRef}>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowAddComponent(!showAddComponent)}
                  className='text-muted-foreground hover:text-foreground h-7 gap-1 rounded px-2 text-xs font-medium'
                >
                  <Plus className='h-3.5 w-3.5' />
                  <LocalizedText text={"Add"} />
                  <ChevronDown className='h-3 w-3' />
                </Button>

                {showAddComponent && (
                  <div className='border-border bg-popover text-popover-foreground absolute right-0 z-50 mt-1.5 flex max-h-[480px] w-72 origin-top-right flex-col overflow-hidden rounded-lg border text-xs shadow-lg'>
                    <div className='border-border/60 bg-popover sticky top-0 z-10 border-b p-2'>
                      <div className='relative'>
                        <Search className='text-muted-foreground pointer-events-none absolute top-2 left-2 h-3.5 w-3.5' />
                        <input
                          autoFocus
                          value={addSearch}
                          onChange={(event) => setAddSearch(event.target.value)}
                          placeholder='Search nodes and 1,000+ apps'
                          className='border-border bg-muted/40 text-foreground placeholder:text-muted-foreground h-8 w-full rounded-md border pr-2 pl-7 text-xs transition-[border-color] duration-150 outline-none focus:border-violet-500/60'
                        />
                      </div>
                    </div>
                    <div className='overflow-y-auto py-1'>
                      {catalogLoading && !composioToolkits.length && (
                        <div className='text-muted-foreground flex items-center gap-2 px-3 py-2 text-[10px]'>
                          <LoadingFileLoader size={12} /> Loading connected apps
                        </div>
                      )}
                      {addNodeMenu.map((category, catIdx) => (
                        <div key={category.label}>
                          <div
                            className={cn(
                              "text-muted-foreground px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase",
                              catIdx > 0 ? "border-border/50 border-t" : ""
                            )}
                          >
                            {category.label}
                          </div>
                          {category.items.map((item) => {
                            const IconComponent =
                              MENU_ICONS[item.iconName] || Sparkles;
                            return (
                              <button
                                key={`${item.type}-${item.subtype || item.label}`}
                                onClick={() => {
                                  if (
                                    item.connected === false &&
                                    (item.initialData?.composioToolkit ||
                                      item.initialData?.connectionPlatform)
                                  ) {
                                    setPendingConnectedApp(item);
                                    setShowAddComponent(false);
                                    setAddSearch("");
                                    return;
                                  }
                                  addComponent(
                                    item.type,
                                    item.subtype,
                                    item.initialData
                                  );
                                }}
                                className='hover:bg-muted text-foreground flex w-full items-center gap-2.5 px-3 py-1.5 text-left transition-[background-color,transform] duration-150 active:scale-[0.98]'
                              >
                                {item.iconUrl ? (
                                  <img
                                    src={item.iconUrl}
                                    alt=''
                                    className='h-4 w-4 rounded object-contain'
                                  />
                                ) : (
                                  <IconComponent className='text-muted-foreground h-3.5 w-3.5' />
                                )}
                                <span className='min-w-0 flex-1 truncate'>
                                  {item.label}
                                </span>
                                {item.connected ? (
                                  <span className='bg-neutral inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:text-emerald-400'>
                                    <Check className='h-2.5 w-2.5' />
                                  </span>
                                ) : item.initialData?.composioToolkit ? (
                                  <span className='rounded bg-black px-1.5 py-0.5 text-[9px] font-semibold text-white dark:bg-white dark:text-black'>
                                    Connect
                                  </span>
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                      {!catalogLoading && !addNodeMenu.length && (
                        <p className='text-muted-foreground px-3 py-5 text-center text-[10px]'>
                          No matching node or connected app
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Auto-save indicator */}
          <div className='bg-border h-5 w-px' />
          {workflowReady !== null && (
            <div
              className={cn(
                "flex items-center gap-1 rounded px-1.5 py-1 text-[10px] font-medium",
                workflowReady
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              )}
              title={
                workflowReady
                  ? "All fields and connections are verified; this workflow can run"
                  : "Saved as a draft; complete the highlighted configuration before it can run"
              }
            >
              {workflowReady ? (
                <Check className='h-3 w-3' />
              ) : (
                <AlertTriangle className='h-3 w-3' />
              )}
              {workflowReady ? "Verified" : "Draft"}
            </div>
          )}
          {validationCount > 0 && (
            <div
              className='flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-1 text-[10px] font-medium text-amber-600 dark:text-amber-400'
              title={`${validationCount} node${validationCount === 1 ? "" : "s"} need configuration`}
            >
              <AlertTriangle className='h-3 w-3' />
              {validationCount}
            </div>
          )}
          <div className='text-muted-foreground flex items-center gap-1 px-1.5 text-[10px]'>
            {saveStatus === "saving" && (
              <>
                <LoadingFileLoader size={12} />
                {/* <span>Saving</span> */}
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <Check className='h-3 w-3 text-emerald-500' />
                {/* <span className='text-emerald-600 dark:text-emerald-400'>Saved</span> */}
              </>
            )}
            {saveStatus === "idle" && (
              <>
                <SaveAll className='h-3 w-3' />
              </>
            )}
            {saveStatus === "error" && (
              <button
                type='button'
                onClick={() => void saveNow()}
                className='flex items-center gap-1 text-red-500 hover:text-red-400'
                title="Couldn't save; retrying automatically. Click to retry now."
              >
                <AlertTriangle className='h-3 w-3' />
                <span>Not saved</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── React Flow Canvas ──────────────────────────────────────── */}
      <div
        ref={canvasRef}
        className={cn(
          "relative z-0 min-h-0 flex-1 transition-colors",
          !isEditMode && "bg-[#101113]"
        )}
      >
        <AutomationCanvasContext.Provider value={{ isEditMode, removeEdge }}>
          <ReactFlow
            proOptions={{ hideAttribution: true }}
            nodes={nodes}
            edges={edges}
            onNodesChange={isEditMode ? handleNodesChange : undefined}
            onEdgesChange={isEditMode ? handleEdgesChange : undefined}
            onConnect={isEditMode ? handleConnect : undefined}
            isValidConnection={isValidConnection}
            deleteKeyCode={isEditMode ? ["Backspace", "Delete"] : null}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodesDraggable={isEditMode}
            nodesConnectable={isEditMode}
            edgesFocusable={isEditMode}
            nodesFocusable={isEditMode}
            elementsSelectable={isEditMode}
            onNodeDragStop={isEditMode ? onNodeDragStop : undefined}
            onInit={setReactFlowInstance}
            onMoveEnd={onMoveEnd}
            defaultViewport={viewport}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            defaultEdgeOptions={{
              type: "removable",
              animated: false,
              markerEnd: { type: MarkerType.ArrowClosed, color: "#a1a1aa" },
              style: { stroke: "#a1a1aa", strokeWidth: 1.6 },
            }}
            minZoom={0.1}
            maxZoom={2}
            panOnDrag={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
          >
            <Background
              color={isEditMode ? "#d4d4d8" : "#34363b"}
              gap={24}
              size={1}
            />
          </ReactFlow>
        </AutomationCanvasContext.Provider>
      </div>

      <ConnectDialog
        open={Boolean(pendingConnectedApp)}
        onOpenChange={(open) => !open && setPendingConnectedApp(null)}
        platform={
          String(
            pendingConnectedApp?.initialData?.composioToolkit
              ? "composio"
              : pendingConnectedApp?.initialData?.connectionPlatform || ""
          ) as IntegrationPlatform
        }
        platformName={String(
          pendingConnectedApp?.initialData?.composioToolkitName ||
            pendingConnectedApp?.initialData?.connectionPlatformName ||
            "Connected app"
        )}
        platformDescription='Connect this app to use this automation node.'
        Icon={Zap}
        iconUrl={String(pendingConnectedApp?.initialData?.composioLogo || "")}
        glow='rgba(139,92,246,0.35)'
        appSlug={String(
          pendingConnectedApp?.initialData?.composioToolkit || ""
        )}
        onConnected={() => {
          const item = pendingConnectedApp;
          if (!item) return;
          const toolkit = String(item.initialData?.composioToolkit || "");
          const platform = String(item.initialData?.connectionPlatform || "");
          if (toolkit)
            setConnectedToolkits((current) => new Set(current).add(toolkit));
          if (platform)
            setConnectedPlatforms((current) => new Set(current).add(platform));
          addComponent(item.type, item.subtype, item.initialData);
          setPendingConnectedApp(null);
        }}
      />
    </div>
  );
}
