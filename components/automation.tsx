"use client";

import { ActionNode } from "./automation/action-node";
import { AIGenerateNode } from "./automation/ai-generate-node";
import { ADD_NODE_MENU, type AutomationNodeType } from "./automation/automation-types";
import { ConditionNode } from "./automation/condition-node";
import { DelayNode } from "./automation/delay-node";
import { HttpRequestNode } from "./automation/http-request-node";
import { PromptNode } from "./automation/prompt-node";
import { TransformNode } from "./automation/transform-node";
import { TriggerNode } from "./automation/trigger-node";
import { UploadNode } from "./automation/upload-node";
import { Button } from "./ui/button";
import { useProjectDesign } from "@/context/DesignProject";
import { cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse, serverUrlSocket } from "@/utils/apiResponse";
import {
  Check,
  ChevronDown,
  Edit2,
  Loader2,
  Maximize2,
  Minus,
  Plus,
  Redo2,
  Undo2,
  Settings,
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
  Instagram,
  Linkedin,
  Twitter,
  Music2,
  ImagePlus,
  Video,
  Mic,
  CalendarPlus,
  Upload,
  GitBranch,
  Sparkles,
  ArrowLeftRight,
  Globe,
  View,
} from "lucide-react";
import {
  EyeIcon as Eye,
  WhatsAppBrand,
  BrevoBrand,
  FacebookBrand,
  InstagramBrand,
  GoogleCalendarBrand,
  XBrand,
  TikTokBrand,
  LinkedinBrand,
  GoogleDriveBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";

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
import React, { useCallback, useEffect, useRef, useState } from "react";

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
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Auto-save
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasUnsavedChanges = useRef(false);
  const initialLoadDone = useRef(false);

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

  const injectNodeCallbacks = useCallback(
    (nodesList: Node[]) => {
      return nodesList.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isEditMode,
          onRemoveNode: removeNode,
          onNodeDataChange: onNodeDataChange,
        },
      }));
    },
    [isEditMode, removeNode, onNodeDataChange]
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
  }, [focusedGenerationId, messages, injectNodeCallbacks, setNodes, setEdges, reactFlowInstance]);

  // ── Final fit-view when AI agent run completes ──────────────────────────

  useEffect(() => {
    if (!projectId) return;

    const socket = io(serverUrlSocket, { withCredentials: true });

    socket.on("agent:run:end", (data: any) => {
      // Only act if this event is for our project and run succeeded
      if (data.projectId !== projectId) return;
      if (data.status !== "completed") return;

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
  }, [projectId, reactFlowInstance]);

  // ── Handle manual connection between nodes ──────────────────────────────

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      setEdges((eds) => {
        const isDuplicate = eds.some(
          (e) =>
            e.source === connection.source && e.target === connection.target
        );
        if (isDuplicate) return eds;

        const newEdge: Edge = {
          id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
          source: connection.source!,
          target: connection.target!,
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
    subtype?: string
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
        break;
      case "action":
        baseData.actionType = subtype || "send_email";
        baseData.recipientEmail = "";
        baseData.subject = "";
        baseData.messageBody = "";
        baseData.contentText = "";
        baseData.instruction = "";
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
      },
    };

    setNodes((nds) => {
      const next = [...nds, newNode];
      addToHistory(next, edgesRef.current);
      return next;
    });
    setShowAddComponent(false);
  };

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
        <p className='text-muted-foreground mt-2 text-sm'>
          Loading automation...
        </p>
      </div>
    );
  }

  return (
    <div className='bg-background relative flex h-full w-full flex-col'>
      {/* ── Header with Title & Toolbar (side-by-side) ──────────────── */}
      <div className='flex items-center justify-between px-4 py-2 border-b border-border/80 bg-background/50 backdrop-blur-sm shrink-0 z-10'>
        <div className='flex items-center gap-2 text-foreground'>
          <Settings className='text-primary h-4 w-4 animate-spin-slow text-amber-500' />
          <span className='text-sm font-semibold'>Automation</span>
        </div>

        {/* Toolbar items at the far right */}
        <div className='flex items-center p-1 space-x-1 border rounded-md bg-background/80 border-border backdrop-blur-sm shadow-sm'>
          {/* Fullscreen Toggle */}
          {onToggleFullscreen && (
            <>
              <Button
                variant='ghost'
                size='sm'
                onClick={onToggleFullscreen}
                className={cn(
                  'h-7 gap-1.5 rounded px-2 text-xs font-medium transition-colors text-muted-foreground hover:text-foreground',
                  isFullscreen && 'bg-muted text-foreground'
                )}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                <View className='h-3.5 w-3.5' />
              </Button>
              <div className='w-px h-5 bg-border' />
            </>
          )}

          {/* Edit / View toggle */}
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsEditMode(!isEditMode)}
            className={cn(
              'h-7 gap-1.5 rounded px-2 text-xs font-medium transition-colors',
              isEditMode
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {isEditMode ? (
              <>
                <Eye className='h-3.5 w-3.5' />
                View
              </>
            ) : (
              <>
                <Edit2 className='h-3.5 w-3.5' />
                Edit
              </>
            )}
          </Button>

          <div className='w-px h-5 bg-border' />

          {/* Undo */}
          <Button
            variant='ghost'
            size='sm'
            onClick={undo}
            disabled={historyIndex <= 0}
            className='w-7 h-7 p-0 rounded hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40'
            title='Undo (Ctrl+Z)'
          >
            <Undo2 className='w-3.5 h-3.5' />
          </Button>

          {/* Redo */}
          <Button
            variant='ghost'
            size='sm'
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className='w-7 h-7 p-0 rounded hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40'
            title='Redo (Ctrl+Y)'
          >
            <Redo2 className='w-3.5 h-3.5' />
          </Button>

          <div className='w-px h-5 bg-border' />

          {/* Zoom In */}
          <Button
            variant='ghost'
            size='sm'
            onClick={() => reactFlowInstance?.zoomIn({ duration: 200 })}
            className='w-7 h-7 p-0 rounded hover:bg-accent'
            title='Zoom In'
          >
            <Plus className='w-3.5 h-3.5' />
          </Button>

          {/* Zoom Out */}
          <Button
            variant='ghost'
            size='sm'
            onClick={() => reactFlowInstance?.zoomOut({ duration: 200 })}
            className='w-7 h-7 p-0 rounded hover:bg-accent'
            title='Zoom Out'
          >
            <Minus className='w-3.5 h-3.5' />
          </Button>

          {/* Fit View */}
          <Button
            variant='ghost'
            size='sm'
            onClick={() =>
              reactFlowInstance?.fitView({ padding: 0.2, duration: 200 })
            }
            className='w-7 h-7 p-0 rounded hover:bg-accent'
            title='Fit View'
          >
            <Maximize2 className='w-3.5 h-3.5' />
          </Button>

          {/* Add Node (edit mode only) */}
          {isEditMode && (
            <>
              <div className='w-px h-5 bg-border' />
              <div className='relative' ref={dropdownRef}>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowAddComponent(!showAddComponent)}
                  className='h-7 gap-1 rounded px-2 text-xs font-medium text-muted-foreground hover:text-foreground'
                >
                  <Plus className='h-3.5 w-3.5' />
                  Add
                  <ChevronDown className='h-3 w-3' />
                </Button>

                {showAddComponent && (
                  <div className='absolute right-0 z-50 mt-1.5 w-52 max-h-[400px] overflow-y-auto rounded-lg border border-border bg-popover text-popover-foreground py-1 text-xs shadow-lg'>
                    {ADD_NODE_MENU.map((category, catIdx) => (
                      <div key={category.label}>
                        <div className={cn(
                          'text-muted-foreground px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase',
                          catIdx > 0 ? 'border-t border-border/50' : ''
                        )}>
                          {category.label}
                        </div>
                        {category.items.map((item) => {
                          const IconComponent = MENU_ICONS[item.iconName] || Sparkles;
                          return (
                            <button
                              key={`${item.type}-${item.subtype || item.label}`}
                              onClick={() => addComponent(item.type, item.subtype)}
                              className='hover:bg-muted flex w-full items-center gap-2.5 px-3 py-1.5 text-left transition-colors text-foreground'
                            >
                              <IconComponent className='h-3.5 w-3.5 text-muted-foreground' />
                              <span>{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Auto-save indicator */}
          <div className='w-px h-5 bg-border' />
          <div className='flex items-center gap-1 px-1.5 text-[10px] text-muted-foreground'>
            {saveStatus === "saving" && (
              <>
                <Loader2 className='h-3 w-3 animate-spin' />
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
              <span className='opacity-50'>Auto-save</span>
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
    </div>
  );
}
