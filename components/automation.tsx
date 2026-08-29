"use client";

import { ActionNode } from "./automation/action-node";
import { AIGenerateNode } from "./automation/ai-generate-node";
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
} from "@/app/(auth)/onboarding/_components/social-icons";
import { ConnectDialog } from "@/app/integrations/_components/connect-dialog";
import { LocalizedText } from "@/components/localized-text";
import { useProjectDesign } from "@/context/DesignProject";
import {
  type ComposioToolkit,
  type IntegrationPlatform,
  fetchComposioToolkits,
  fetchIntegrations,
} from "@/lib/integrations-api";
import { cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse, serverUrlSocket } from "@/utils/apiResponse";
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
  Zap,
} from "lucide-react";
import ReactFlow, {
  Background,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  Position,
  applyEdgeChanges,
  applyNodeChanges,
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
  Linkedin: LinkedinBrand,
  GoogleDrive: GoogleDriveBrand,
};

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  prompt: PromptNode,
  condition: ConditionNode,
  delay: DelayNode,
  ai_generate: AIGenerateNode,
  transform: TransformNode,
  http_request: HttpRequestNode,
  upload: UploadNode,
};

function automationTraceSummary(trace: any[] = []) {
  return trace
    .map((step) => {
      if (step.type === "condition")
        return `${step.nodeId}: ${step.outcome} branch`;
      if (step.type === "delay")
        return `${step.nodeId}: delay checked${step.skippedDuringTest ? " (not waited during test)" : ""}`;
      if (step.status) return `${step.nodeId}: ${step.status}`;
      return `${step.nodeId}: ${step.type}`;
    })
    .join("\n");
}

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
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 0.8 });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
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
  const validationCount = nodes.filter(
    (node) => (node.data?.validationErrors as string[] | undefined)?.length
  ).length;

  // Auto-save
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasUnsavedChanges = useRef(false);
  const initialLoadDone = useRef(false);
  const suppressNextAutoSave = useRef(false);

  // Undo / Redo
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);
  const [history, setHistory] = useState<
    Array<{ nodes: Node[]; edges: Edge[] }>
  >([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const historyIndexRef = useRef(-1);

  const nodesRef = useRef<Node[]>(nodes);
  const edgesRef = useRef<Edge[]>(edges);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  // ── History helpers ─────────────────────────────────────────────────────

  const addToHistory = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      if (isUndoRedoAction) return;

      const safeNodes = Array.isArray(newNodes)
        ? JSON.parse(JSON.stringify(newNodes))
        : [];
      const safeEdges = Array.isArray(newEdges)
        ? JSON.parse(JSON.stringify(newEdges))
        : [];

      const currentState = { nodes: safeNodes, edges: safeEdges };

      setHistory((prev) => {
        const trimmed = prev.slice(0, historyIndexRef.current + 1);
        const next = [...trimmed, currentState];
        return next.slice(-50);
      });

      setHistoryIndex((prev) => {
        const nextIdx = Math.min(prev + 1, 49);
        historyIndexRef.current = nextIdx;
        return nextIdx;
      });
    },
    [isUndoRedoAction]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0 && history.length > 0) {
      const previousState = history[historyIndex - 1];
      if (previousState?.nodes && previousState?.edges) {
        setIsUndoRedoAction(true);
        setNodes(injectNodeCallbacks(previousState.nodes));
        setEdges(previousState.edges);
        setHistoryIndex(historyIndex - 1);
        historyIndexRef.current = historyIndex - 1;
        setIsUndoRedoAction(false);
        hasUnsavedChanges.current = true;
        scheduleAutoSave();
      }
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1 && history.length > 0) {
      const nextState = history[historyIndex + 1];
      if (nextState?.nodes && nextState?.edges) {
        setIsUndoRedoAction(true);
        setNodes(injectNodeCallbacks(nextState.nodes));
        setEdges(nextState.edges);
        setHistoryIndex(historyIndex + 1);
        historyIndexRef.current = historyIndex + 1;
        setIsUndoRedoAction(false);
        hasUnsavedChanges.current = true;
        scheduleAutoSave();
      }
    }
  }, [history, historyIndex]);

  // ── Keyboard shortcuts for undo/redo ────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  // ── Auto-save ───────────────────────────────────────────────────────────

  const performSave = useCallback(async () => {
    if (!projectId || !hasUnsavedChanges.current) return;

    try {
      setSaveStatus("saving");
      const res = await apiResponse.put(
        `/apps/automation/${projectId}`,
        {
          nodes: nodesRef.current.map((n) => {
            const cleanData = { ...n.data };
            delete cleanData.onRemoveNode;
            delete cleanData.onNodeDataChange;
            delete cleanData.isEditMode;
            delete cleanData.onTestRun;
            delete cleanData.isTesting;
            return {
              id: n.id,
              type: n.type,
              position: n.position,
              data: cleanData,
            };
          }),
          edges: edgesRef.current,
          viewport,
        },
        { withCredentials: true }
      );

      if (res.data?.success) {
        const serverNodes = res.data.data?.nodes || [];
        const serverEdges = res.data.data?.edges || [];
        if (serverNodes.length) {
          const validationByNode = new Map<string, string[]>(
            (res.data.validationErrors || []).map((item: any) => [
              item.nodeId,
              item.errors || [],
            ])
          );
          suppressNextAutoSave.current = true;
          setNodes((current) =>
            current.map((node) => {
              const saved = serverNodes.find(
                (item: any) => item.id === node.id
              );
              if (!saved) return node;
              return {
                ...node,
                data: {
                  ...node.data,
                  composioStatus: saved.data?.composioStatus,
                  composioError: saved.data?.composioError,
                  composioTriggerId: saved.data?.composioTriggerId,
                  integrationId:
                    saved.data?.integrationId || node.data?.integrationId,
                  composioToolkitName:
                    saved.data?.composioToolkitName ||
                    node.data?.composioToolkitName,
                  composioLogo:
                    saved.data?.composioLogo || node.data?.composioLogo,
                  webhookUrl: saved.data?.webhookUrl || node.data?.webhookUrl,
                  validationErrors: validationByNode.get(node.id) || [],
                },
              };
            })
          );
          edgesRef.current = serverEdges;
          setEdges(serverEdges);
        }
        hasUnsavedChanges.current = false;
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    } catch (err) {
      console.error("Auto-save error:", err);
      setSaveStatus("idle");
    }
  }, [projectId, viewport]);

  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      performSave();
    }, 2000);
  }, [performSave]);

  // Mark unsaved on node/edge changes
  useEffect(() => {
    if (!initialLoadDone.current) return;
    if (suppressNextAutoSave.current) {
      suppressNextAutoSave.current = false;
      return;
    }
    hasUnsavedChanges.current = true;
    scheduleAutoSave();
  }, [nodes, edges, scheduleAutoSave]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, []);

  // ── Node callbacks ──────────────────────────────────────────────────────

  const removeNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  const onNodeDataChange = useCallback(
    (nodeId: string, updatedFields: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...updatedFields,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const onTestRun = useCallback(
    async (nodeId: string) => {
      if (!projectId) {
        toast.error("Project ID is missing. Cannot run test.");
        return;
      }
      try {
        onNodeDataChange(nodeId, { isTesting: true });
        toast.loading("Triggering test run...", { id: `test-run-${nodeId}` });
        const res = await apiResponse.post(
          `/apps/automation/${projectId}/test-run`,
          { nodeId }
        );
        if (res.data?.success) {
          const trace = automationTraceSummary(res.data?.data?.trace);
          toast.success(
            res.data.message || `Test run completed successfully.`,
            { id: `test-run-${nodeId}`, description: trace || undefined }
          );
        } else {
          toast.error("Test run failed", { id: `test-run-${nodeId}` });
        }
      } catch (err: any) {
        console.error(err);
        const data = err.response?.data;
        const errorMessage = data?.message || "Failed to trigger test run";
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
    [projectId, onNodeDataChange]
  );

  const injectNodeCallbacks = useCallback(
    (nodesList: Node[]) => {
      return nodesList.map((node) => {
        const legacyEmailTrigger =
          node.type === "trigger" &&
          (node.data?.triggerType === "email_received" ||
            (!node.data?.triggerType &&
              /(?:incoming|new)?\s*email\s+received/i.test(
                node.data?.title || ""
              )));
        return {
          ...node,
          data: {
            ...node.data,
            ...(legacyEmailTrigger ? { triggerType: "gmail_received" } : {}),
            isEditMode,
            onRemoveNode: removeNode,
            onNodeDataChange: onNodeDataChange,
            onTestRun: onTestRun,
          },
        };
      });
    },
    [isEditMode, removeNode, onNodeDataChange, onTestRun]
  );

  // ── Fetch automation state ──────────────────────────────────────────────

  useEffect(() => {
    if (!slug) return;
    setProjectId(slug);

    const fetchAutomation = async () => {
      try {
        setIsLoading(true);
        const res = await apiResponse.get(`/apps/automation/${slug}`, {
          withCredentials: true,
        });

        if (res.data?.success && res.data.data) {
          const autoData = res.data.data;
          setProjectName(autoData.name || "Automation");
          const loadedNodes = injectNodeCallbacks(autoData.nodes || []);
          const loadedEdges = autoData.edges || [];
          setNodes(loadedNodes);
          setEdges(loadedEdges);
          if (autoData.viewport) {
            setViewport(autoData.viewport);
          }

          // Capture initial history state
          setHistory([
            {
              nodes: JSON.parse(JSON.stringify(loadedNodes)),
              edges: JSON.parse(JSON.stringify(loadedEdges)),
            },
          ]);
          setHistoryIndex(0);
          historyIndexRef.current = 0;

          // Mark initial load complete so auto-save doesn't fire immediately
          setTimeout(() => {
            initialLoadDone.current = true;
          }, 500);
        }
      } catch (err) {
        console.error("Failed to load automation:", err);
        toast.error("Failed to load automation canvas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAutomation();
  }, [slug, injectNodeCallbacks, setNodes, setEdges]);

  // Update nodes isEditMode state when edit mode toggles
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isEditMode,
        },
      }))
    );
  }, [isEditMode, setNodes]);

  // ── Socket listener for AI updates ──────────────────────────────────────

  useEffect(() => {
    if (!projectId) return;

    const socket = io(serverUrlSocket, { withCredentials: true });
    socket.emit("joinProject", projectId);

    socket.on("automation:ai:update", (data: any) => {
      if (data.projectId !== projectId) return;

      if (!data.actions || data.actions.length === 0) return;

      // Process the full batch — collect all new nodes/edges in local arrays
      // so we can apply them together and then call fitView once.
      const createdNodes: Node[] = [];
      const createdEdges: Edge[] = [];

      data.actions.forEach((action: any) => {
        if (action.name === "create_node") {
          const nodeArgs = action.args;
          const newNodeId = nodeArgs.nodeId || `${nodeArgs.type}-${Date.now()}`;

          // Merge ALL data fields the AI provided — don't cherry-pick.
          // Then layer on the interactive callbacks and nodeId.
          const nodeData: any = {
            // Spread every field from the AI payload first
            ...nodeArgs.data,
            // Ensure nodeId is always set
            nodeId: newNodeId,
            // Inject interactive callbacks so nodes are fully functional
            isEditMode,
            onRemoveNode: removeNode,
            onNodeDataChange,
            onTestRun,
          };

          const newNode: Node = {
            id: newNodeId,
            type: nodeArgs.type,
            position: nodeArgs.position || {
              // Fallback layout if backend didn't send position: match backend spacing
              x: 400,
              y: 80 + (nodesRef.current.length + createdNodes.length) * 320,
            },
            draggable: true,
            data: nodeData,
          };

          createdNodes.push(newNode);
        } else if (action.name === "connect_nodes") {
          const edgeArgs = action.args;
          const newEdge: Edge = {
            id: `edge-${edgeArgs.sourceId}-${edgeArgs.targetId}-${Date.now()}`,
            source: edgeArgs.sourceId,
            target: edgeArgs.targetId,
            // Forward sourceHandle so condition true/false branches work
            ...(edgeArgs.sourceHandle
              ? { sourceHandle: edgeArgs.sourceHandle }
              : {}),
            animated: true,
          };
          createdEdges.push(newEdge);
        }
      });

      // Apply nodes then edges atomically
      if (createdNodes.length > 0) {
        setNodes((nds) => [...nds, ...createdNodes]);
      }
      if (createdEdges.length > 0) {
        setEdges((eds) => [...eds, ...createdEdges]);
      }

      // After nodes settle, fit the view so the user sees the full canvas
      if (createdNodes.length > 0 && reactFlowInstance) {
        setTimeout(() => {
          reactFlowInstance.fitView({ duration: 600, padding: 0.25 });
        }, 150);
      }
    });

    return () => {
      socket.off("automation:ai:update");
      socket.disconnect();
    };
  }, [
    projectId,
    setNodes,
    setEdges,
    isEditMode,
    removeNode,
    onNodeDataChange,
    onTestRun,
    reactFlowInstance,
  ]);

  // ── Load snapshot version ───────────────────────────────────────────────

  useEffect(() => {
    if (focusedGenerationId && messages) {
      let foundSnapshot = null;
      for (const msg of messages) {
        if (msg.generationGroups) {
          for (const group of msg.generationGroups) {
            const item = group.items?.find(
              (it: any) => it.id === focusedGenerationId
            );
            if (
              item &&
              item.type === "application/json+automation" &&
              item.data
            ) {
              foundSnapshot = item.data;
              break;
            }
          }
        }
        if (foundSnapshot) break;
      }

      if (foundSnapshot) {
        const loadedNodes = injectNodeCallbacks(foundSnapshot.nodes || []);
        const loadedEdges = foundSnapshot.edges || [];
        setNodes(loadedNodes);
        setEdges(loadedEdges);
        if (reactFlowInstance) {
          setTimeout(() => {
            reactFlowInstance.fitView({ duration: 400, padding: 0.2 });
          }, 100);
        }
      }
    }
  }, [
    focusedGenerationId,
    messages,
    injectNodeCallbacks,
    setNodes,
    setEdges,
    reactFlowInstance,
  ]);

  // ── Final fit-view when AI agent run completes ──────────────────────────

  useEffect(() => {
    if (!projectId) return;

    const socket = io(serverUrlSocket, { withCredentials: true });

    socket.on("agent:run:end", async (data: any) => {
      // Only act if this event is for our project and run succeeded
      if (data.projectId !== projectId) return;
      if (data.status !== "completed") return;

      // The server persists AI-created nodes and edges. Reload that graph so
      // socket timing or a stale autosave can never leave the canvas unwired.
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      hasUnsavedChanges.current = false;
      try {
        const res = await apiResponse.get(`/apps/automation/${projectId}`, {
          withCredentials: true,
        });
        if (res.data?.success && res.data.data) {
          const serverNodes = injectNodeCallbacks(res.data.data.nodes || []);
          const serverEdges = res.data.data.edges || [];
          nodesRef.current = serverNodes;
          edgesRef.current = serverEdges;
          suppressNextAutoSave.current = true;
          setNodes(serverNodes);
          setEdges(serverEdges);
        }
      } catch (error) {
        console.error("Failed to refresh the completed automation:", error);
      }

      // Give React a moment to flush all node/edge state updates, then fit
      setTimeout(() => {
        if (reactFlowInstance && nodesRef.current.length > 0) {
          reactFlowInstance.fitView({ duration: 800, padding: 0.25 });
        }
      }, 400);
    });

    return () => {
      socket.off("agent:run:end");
      socket.disconnect();
    };
  }, [
    projectId,
    reactFlowInstance,
    injectNodeCallbacks,
    setNodes,
    setEdges,
  ]);

  // ── Handle manual connection between nodes ──────────────────────────────

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      setEdges((eds) => {
        const isDuplicate = eds.some(
          (e) =>
            e.source === connection.source &&
            e.target === connection.target &&
            (e.sourceHandle || null) === (connection.sourceHandle || null)
        );
        if (isDuplicate) return eds;

        const newEdge: Edge = {
          id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
          source: connection.source!,
          target: connection.target!,
          ...(connection.sourceHandle
            ? { sourceHandle: connection.sourceHandle }
            : {}),
          animated: true,
        };
        return [...eds, newEdge];
      });
    },
    [setEdges]
  );

  // ── Node drag stop → capture history ────────────────────────────────────

  const onNodeDragStop = useCallback(
    (_event: any, _node: Node) => {
      addToHistory(nodesRef.current, edgesRef.current);
    },
    [addToHistory]
  );

  const onMoveEnd = useCallback(
    (_event: any, vp: { x: number; y: number; zoom: number }) => {
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
    const nodeId = `${type}-${Date.now()}`;

    let position = {
      x: 200 + ((nodes.length * 40) % 200),
      y: 150 + ((nodes.length * 40) % 200),
    };

    // Place in centre of viewport if instance available
    if (reactFlowInstance) {
      const vp = reactFlowInstance.getViewport();
      const centerX = (-vp.x + window.innerWidth / 2) / vp.zoom;
      const centerY = (-vp.y + window.innerHeight / 2) / vp.zoom;
      position = {
        x: centerX + (Math.random() * 80 - 40),
        y: centerY + (Math.random() * 80 - 40),
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
        isEditMode,
        onRemoveNode: removeNode,
        onNodeDataChange,
        onTestRun,
      },
    };

    setNodes((nds) => {
      const next = [...nds, newNode];
      addToHistory(next, edgesRef.current);
      return next;
    });
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
      items: category.items.filter(
        (item) =>
          (!visible.length ||
            (item.subtype !== "composio_event" &&
              item.subtype !== "composio_action")) &&
          (!query || item.label.toLowerCase().includes(query))
      ).map((item) => {
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
        <LoadingFileLoader />
      </div>
    );
  }

  return (
    <div className='bg-background relative flex h-full w-full flex-col'>
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
            disabled={historyIndex <= 0}
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
            disabled={historyIndex >= history.length - 1}
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
                          <Loader2 className='h-3 w-3 animate-spin' /> Loading
                          connected apps
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
                                  <span className='inline-flex shrink-0 items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:text-emerald-400'>
                                    <Check className='h-2.5 w-2.5' /> Connected
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
                <LoadingFileLoader size={16} />
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
          </div>
        </div>
      </div>

      {/* ── React Flow Canvas ──────────────────────────────────────── */}
      <div className='relative z-0 min-h-0 flex-1'>
        <ReactFlow
          proOptions={{ hideAttribution: true }}
          nodes={nodes}
          edges={edges}
          onNodesChange={isEditMode ? onNodesChange : undefined}
          onEdgesChange={isEditMode ? onEdgesChange : undefined}
          onConnect={isEditMode ? handleConnect : undefined}
          nodeTypes={nodeTypes}
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
          minZoom={0.1}
          maxZoom={2}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
        >
          <Background color='#e5e5e5' gap={20} size={1} />
        </ReactFlow>
      </div>

      <ConnectDialog
        open={Boolean(pendingConnectedApp)}
        onOpenChange={(open) => !open && setPendingConnectedApp(null)}
        platform={String(
          pendingConnectedApp?.initialData?.composioToolkit
            ? "composio"
            : pendingConnectedApp?.initialData?.connectionPlatform || ""
        ) as IntegrationPlatform}
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
          const platform = String(
            item.initialData?.connectionPlatform || ""
          );
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
