"use client";
import { Navbar } from "./navbar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { FloatingSidebar } from "@/floating-sidebar";
import { trackEvent, trackFeatureUsed } from "@/lib/mixpanelClient";
import { createNode as createNodeUtil } from "@/lib/workflow-utils";
import { AIChatNode } from "@/nodes/ai-chat-node";
import { AudioNode } from "@/nodes/audio-node";
import { BrandNode } from "@/nodes/brand-node";
import { ChatNode } from "@/nodes/chat-node";
import { CodeNode } from "@/nodes/code-node";
import { ConditionalNode } from "@/nodes/conditional-node";
import { DatabaseNode } from "@/nodes/database-node";
import { DocumentNode } from "@/nodes/document-node";
import { FacebookNode } from "@/nodes/facebook-node";
import { FolderNode } from "@/nodes/folder-node";
import { ImageNode } from "@/nodes/image-node";
// Import all node types
import { InputNode } from "@/nodes/input-node";
import { InstagramNode } from "@/nodes/instagram-node";
import { LinkedInNode } from "@/nodes/linkedin-node";
import { OutputNode } from "@/nodes/output-node";
import { PDFNode } from "@/nodes/pdf-node";
import { ProcessNode } from "@/nodes/process-node";
import { PromptNode } from "@/nodes/prompt-node";
import { TextNode } from "@/nodes/text-node";
import { TikTokNode } from "@/nodes/tiktok-node";
import { TwitterNode } from "@/nodes/twitter-node";
import { VideoNode } from "@/nodes/video-node";
import { WebsiteNode } from "@/nodes/website-node";
import { YouTubeNode } from "@/nodes/youtube-node";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse, serverUrlSocket } from "@/utils/apiResponse";
import {
  FolderOpen,
  History as HistoryIcon,
  Loader2,
  Maximize2,
  Minus,
  Plus,
  PlusCircle,
  Redo2,
  Undo2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ReactFlow, {
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeChange,
  type EdgeTypes,
  Node,
  type NodeChange,
  type NodeMouseHandler,
  NodeTypes,
  applyEdgeChanges,
  applyNodeChanges,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { io } from "socket.io-client";
import { toast } from "sonner";
import React, { useCallback, useEffect, useState } from "react";

// Import edge types
const nodeTypes: NodeTypes = {
  brand: BrandNode,
  input: InputNode,
  process: ProcessNode,
  output: OutputNode,
  conditional: ConditionalNode,
  code: CodeNode,
  aiChat: AIChatNode,
  youtube: YouTubeNode,
  pdf: PDFNode,
  chat: ChatNode,
  folder: FolderNode,
  instagram: InstagramNode,
  database: DatabaseNode,
  linkedin: LinkedInNode,
  twitter: TwitterNode,
  facebook: FacebookNode,
  tiktok: TikTokNode,
  website: WebsiteNode,
  image: ImageNode,
  audio: AudioNode,
  video: VideoNode,
  document: DocumentNode,
  text: TextNode,
  prompt: PromptNode,
};

// Using default ReactFlow edges with built-in animation

const getDocumentType = (url: string, fileName?: string) => {
  const file = fileName || url.split("/").pop()?.split("?")[0] || "";
  const extension = file.toLowerCase().split(".").pop();

  switch (extension) {
    case "pdf":
      return "PDF";
    case "doc":
    case "docx":
      return "Word";
    case "xls":
    case "xlsx":
      return "Excel";
    case "ppt":
    case "pptx":
      return "PowerPoint";
    case "txt":
      return "Text";
    default:
      return "Document";
  }
};

const GennittWorkflow = ({ slug }: { slug?: string }) => {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(
    slug === "create" || !slug
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(!!slug && slug !== "create");
  const [historyProjects, setHistoryProjects] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const nodesRef = React.useRef(nodes);
  const edgesRef = React.useRef(edges);
  const [brainItems, setBrainItems] = useState<any[]>([]);
  // Fetch user's brain items for duplicate checking
  useEffect(() => {
    const fetchBrainItems = async () => {
      try {
        const res = await apiResponse.get("/apps/workflow/items", {
          withCredentials: true,
        });
        if (res.data.success) {
          setBrainItems(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch brain items:", error);
      }
    };
    fetchBrainItems();
  }, []);

  // Keep refs in sync with state
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const socketRef = React.useRef<any>(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 0.8 });
  const [initialViewportApplied, setInitialViewportApplied] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);

  // History management for undo/redo
  const [history, setHistory] = useState<
    Array<{ nodes: Node[]; edges: Edge[] }>
  >([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  // Ref mirrors historyIndex so addToHistory never needs it as a dep (prevents cascade)
  const historyIndexRef = React.useRef(-1);

  // Add current state to history
  const addToHistory = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      if (isUndoRedoAction) return;

      // Ensure we have valid arrays and deep copy to prevent reference issues
      const safeNodes = Array.isArray(newNodes)
        ? JSON.parse(JSON.stringify(newNodes))
        : [];
      const safeEdges = Array.isArray(newEdges)
        ? JSON.parse(JSON.stringify(newEdges))
        : [];

      const currentState = { nodes: safeNodes, edges: safeEdges };

      setHistory((prevHistory) => {
        // Use ref so this callback does not depend on historyIndex state
        const trimmedHistory = prevHistory.slice(
          0,
          historyIndexRef.current + 1
        );
        const newHistory = [...trimmedHistory, currentState];
        return newHistory.slice(-50);
      });

      setHistoryIndex((prevIndex) => {
        const nextIndex = Math.min(prevIndex + 1, 49);
        historyIndexRef.current = nextIndex; // keep ref in sync immediately
        return nextIndex;
      });
    },
    [isUndoRedoAction] // historyIndex removed — we read it from historyIndexRef
  );

  const addNode = useCallback(
    (node: Node) => {
      trackFeatureUsed("workflow_node_added", {
        node_type: node.type,
      });
      setNodes((prevNodes) => {
        const newNodes = [...prevNodes, node];
        // Use a functional update to ensure we have the absolute latest state for history
        addToHistory(newNodes, edgesRef.current);
        return newNodes;
      });
    },
    [setNodes, addToHistory]
  );

  // Remove node from state
  const removeNode = useCallback(
    (nodeId: string) => {
      const newNodes = nodesRef.current.filter((node) => node.id !== nodeId);
      setNodes(newNodes);
      addToHistory(newNodes, edgesRef.current);
    },
    [setNodes, addToHistory]
  );

  // Handle connections
  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      trackFeatureUsed("workflow_node_connection_attempted", {
        source: connection.source,
        target: connection.target,
      });

      const edgeId = `edge-${connection.source}-${connection.target}-${connection.sourceHandle || "default"}-${connection.targetHandle || "default"}`;

      // Use functional setEdges so we ALWAYS check the true latest edge list
      // (edgesRef.current can be stale within the same render cycle)
      setEdges((prevEdges) => {
        // Check for any existing edge between same source+target+handles
        const isDuplicate = prevEdges.some(
          (edge) =>
            edge.source === connection.source &&
            edge.target === connection.target &&
            edge.sourceHandle === connection.sourceHandle &&
            edge.targetHandle === connection.targetHandle
        );
        if (isDuplicate) {
          return prevEdges;
        }

        // Enforce 3-item limit
        const incomingEdges = prevEdges.filter(
          (e) => e.target === connection.target
        );
        if (incomingEdges.length >= 3) {
          toast.error("Maximum of 3 inputs reached");
          return prevEdges;
        }

        const newEdge: Edge = {
          id: edgeId,
          source: connection.source!,
          target: connection.target!,
          sourceHandle: connection.sourceHandle,
          targetHandle: connection.targetHandle,
          animated: true,
        };

        return [...prevEdges, newEdge];
      });

      // Update target node's connectedItems (separate, non-cascading update)
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === connection.target) {
            const currentItems = node.data.connectedItems || [];
            if (!currentItems.includes(connection.source!)) {
              return {
                ...node,
                data: {
                  ...node.data,
                  connectedItems: [...currentItems, connection.source],
                },
              };
            }
          }
          return node;
        })
      );
    },
    [setEdges, setNodes] // addToHistory removed — breaks the cascade that causes re-registration
  );

  // Node creation function - single source of truth
  const createNode = useCallback(
    async (type: string, data: any) => {

      // Place node at the center of the current viewport so it's always visible
      let position = data.position;
      if (!position) {
        if (reactFlowInstance) {
          const vp = reactFlowInstance.getViewport();
          // Compute canvas-space center of the visible area
          const centerX = (-vp.x + window.innerWidth / 2) / vp.zoom;
          const centerY = (-vp.y + window.innerHeight / 2) / vp.zoom;
          // Add a small jitter so stacked nodes don't perfectly overlap
          position = {
            x: centerX + (Math.random() * 80 - 40),
            y: centerY + (Math.random() * 80 - 40),
          };
        } else {
          position = {
            x: Math.random() * 400 + 100,
            y: Math.random() * 300 + 100,
          };
        }
      }

      let newNode: Node;

      // Map sidebar types to category for database
      const categoryMap: Record<string, string> = {
        mic: "audio",
        audio: "audio",
        image: "image",
        video: "video",
        youtube: "video",
        file: "document",
        document: "document",
        text: "text",
        instagram: "social",
        twitter: "social",
        facebook: "social",
        linkedin: "social",
        tiktok: "social",
      };

      // Save to database if it's a media/content item AND not already in the brain
      if (categoryMap[type] && slug && !data.alreadyInBrain) {
        // Check for duplicates in brainItems
        const existingItem = brainItems.find((item) => {
          if (data.url && item.url === data.url) return true;
          if (
            data.content &&
            item.content === data.content &&
            item.category === categoryMap[type]
          )
            return true;
          return false;
        });

        if (!existingItem) {
          try {
            const res = await apiResponse.post(
              "/apps/workflow/items",
              {
                name: data.title || data.name || `${type} Item`,
                category: categoryMap[type],
                url: data.url,
                content: data.content,
                projectId,
                metadata: { ...data },
              },
              { withCredentials: true }
            );
            if (res.data.success) {
              const savedItem = res.data.data;
              setBrainItems((prev) => [savedItem, ...prev]);
              // Store DB ID and analysis status in node data
              data.dbId = savedItem._id;
              data.analyzed = savedItem.analyzed;
              data.analysis = savedItem.analysis;
            }
          } catch (error) {
            console.error("Failed to save item to database:", error);
          }
        } else {
          data.dbId = existingItem._id;
          data.analyzed = existingItem.analyzed;
          data.analysis = existingItem.analysis;
        }
      }

      switch (type) {
        case "aiChat":
          newNode = {
            id: `chat-${Date.now()}`,
            type: "aiChat",
            position,
            draggable: true,
            data: {
              title: data.title || "New AI Chat",
              messages: data.messages || [],
              onRemoveNode: removeNode,
              nodeId: `chat-${Date.now()}`,
            },
            style: { width: 600, height: 400 },
          };
          break;
        case "youtube":
          newNode = {
            id: `youtube-${Date.now()}`,
            type: "youtube",
            position,
            draggable: true,
            data: {
              title: data.title || "YouTube Video",
              url: data.url,
              videoId: data.videoId,
              thumbnail: data.thumbnail,
              transcript: "",
              onRemoveNode: removeNode,
              nodeId: `youtube-${Date.now()}`,
            },
            style: { width: 400, height: 300 },
          };
          break;
        case "mic":
        case "audio":
          newNode = {
            id: `audio-${Date.now()}`,
            type: "audio",
            position,
            draggable: true,
            data: {
              instruction: data.title || "",
              status: data.status || "public",
              url: data.url,
              type: "audio",
              duration: data.duration,
              size: data.size,
              onRemoveNode: removeNode,
              nodeId: `audio-${Date.now()}`,
            },
            style: { width: 300, height: 200 },
          };
          break;
        case "image":
          newNode = {
            id: `image-${Date.now()}`,
            type: "image",
            position,
            draggable: true,
            data: {
              instruction: data.title || "",
              status: data.status || "public",
              url: data.url,
              type: "image",
              size: data.size,
              onRemoveNode: removeNode,
              nodeId: `image-${Date.now()}`,
            },
            style: { width: 300, height: 200 },
          };
          break;
        case "video":
          newNode = {
            id: `video-${Date.now()}`,
            type: "video",
            position,
            draggable: true,
            data: {
              instruction: data.title || "",
              status: data.status || "public",
              url: data.url,
              type: "video",
              duration: data.duration,
              size: data.size,
              onRemoveNode: removeNode,
              nodeId: `video-${Date.now()}`,
            },
            style: { width: 300, height: 200 },
          };
          break;
        case "text":
          newNode = {
            id: `text-${Date.now()}`,
            type: "text",
            position,
            draggable: true,
            data: {
              instruction: data.instruction || "",
              status: data.status || "public",
              content: data.content,
              type: "text",
              onRemoveNode: removeNode,
              nodeId: `text-${Date.now()}`,
            },
            style: { width: 300, height: 200 },
          };
          break;
        case "file":
        case "document":
          const docType = data.url
            ? getDocumentType(data.url, data.title)
            : "Document";
          newNode = {
            id: `file-${Date.now()}`,
            type: "document",
            position,
            draggable: true,
            data: {
              instruction: data.title || "",
              status: data.status || "public",
              url: data.url,
              type: "document",
              docType: docType,
              size: data.size,
              onRemoveNode: removeNode,
              nodeId: `file-${Date.now()}`,
            },
            style: { width: 300, height: 200 },
          };
          break;
        case "folder":
          newNode = {
            id: `folder-${Date.now()}`,
            type: "folder",
            position,
            draggable: true,
            data: {
              title: data.title || "New Folder",
              onRemoveNode: removeNode,
              nodeId: `folder-${Date.now()}`,
            },
            style: { width: 200, height: 150 },
          };
          break;
        case "instagram":
          newNode = {
            id: `instagram-${Date.now()}`,
            type: "instagram",
            position,
            draggable: true,
            data: {
              instruction: data.instruction || "",
              status: data.status || "public",
              url: data.url,
              platform: "instagram",
              onRemoveNode: removeNode,
              nodeId: `instagram-${Date.now()}`,
            },
            style: { width: 300, height: 200 },
          };
          break;
        case "twitter":
          newNode = {
            id: `twitter-${Date.now()}`,
            type: "twitter",
            position,
            draggable: true,
            data: {
              instruction: data.instruction || "",
              status: data.status || "public",
              url: data.url,
              platform: "twitter",
              onRemoveNode: removeNode,
              nodeId: `twitter-${Date.now()}`,
            },
            style: { width: 300, height: 200 },
          };
          break;
        case "linkedin":
          newNode = {
            id: `linkedin-${Date.now()}`,
            type: "linkedin",
            position,
            draggable: true,
            data: {
              instruction: data.instruction || "",
              status: data.status || "public",
              url: data.url,
              platform: "linkedin",
              onRemoveNode: removeNode,
              nodeId: `linkedin-${Date.now()}`,
            },
            style: { width: 300, height: 200 },
          };
          break;
        case "facebook":
          newNode = {
            id: `facebook-${Date.now()}`,
            type: "facebook",
            position,
            draggable: true,
            data: {
              instruction: data.instruction || "",
              status: data.status || "public",
              url: data.url,
              platform: "facebook",
              onRemoveNode: removeNode,
              nodeId: `facebook-${Date.now()}`,
            },
            style: { width: 300, height: 200 },
          };
          break;
        case "tiktok":
          newNode = {
            id: `tiktok-${Date.now()}`,
            type: "tiktok",
            position,
            draggable: true,
            data: {
              instruction: data.instruction || "",
              status: data.status || "public",
              url: data.url,
              platform: "tiktok",
              onRemoveNode: removeNode,
              nodeId: `tiktok-${Date.now()}`,
            },
            style: { width: 300, height: 200 },
          };
          break;
        case "prompt":
          newNode = {
            id: `prompt-${Date.now()}`,
            type: "prompt",
            position,
            draggable: true,
            data: {
              onRemoveNode: removeNode,
              nodeId: `prompt-${Date.now()}`,
              projectId,
              onAIAction: applyAIActions,
            },
          };
          break;
        default:
          console.warn("Unknown node type:", type);
          return;
      }

      addNode(newNode);
      return newNode;
    },
    [projectId, slug, addNode, removeNode, brainItems]
  );

  const updateNodeData = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((nds) => {
        const newNodes = nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            };
          }
          return node;
        });
        // We don't necessarily want to add to history on EVERY keystroke if this is used for inputs
        // but for "data" updates (like renaming), we should.
        // For now, let's keep it manual or call it where needed.
        return newNodes;
      });
    },
    [setNodes]
  );

  const handleAnalyze = useCallback(
    async (nodeId: string) => {
      const node = nodesRef.current.find((n) => n.id === nodeId);
      if (!node) return;

      const dbId = node.data.dbId;
      if (!dbId) {
        toast.error("Item must be saved to the brain before analysis");
        return;
      }

      toast.loading("Analyzing content...", { id: "analyze" });
      try {
        const res = await apiResponse.post(
          `/apps/workflow/items/${dbId}/analyze`,
          {},
          { withCredentials: true }
        );
        if (res.data.success) {
          toast.success("Analysis complete", { id: "analyze" });
          updateNodeData(nodeId, {
            analyzed: true,
            analysis: res.data.data,
          });
        }
      } catch (error: any) {
        console.error("Analysis failed:", error);
        toast.error(error.response?.data?.message || "Analysis failed", {
          id: "analyze",
        });
      }
    },
    [updateNodeData]
  );

  const applyAIActions = useCallback(
    async (sourceNodeId: string, actions: any[]): Promise<any[]> => {
      const results = [];

      // Track how many create_node actions we process so we can offset vertically
      let createIndex = 0;

      for (const action of actions) {
        if (action.name === "create_node") {
          const { type, data, position } = action.args;

          const sourceNode = nodesRef.current.find(
            (n) => n.id === sourceNodeId
          );

          // Place the generated node to the right of the source, with vertical offset
          const finalPosition = position || {
            x: (sourceNode?.position.x || 0) + 450,
            y: (sourceNode?.position.y || 0) + createIndex * 250,
          };

          const newNode = await createNode(type, {
            ...data,
            position: finalPosition,
          });

          if (newNode && sourceNodeId) {
            handleConnect({ source: sourceNodeId, target: newNode.id } as any);
          }

          results.push(newNode);
          createIndex++;
        } else if (action.name === "connect_nodes") {
          const { sourceId, targetId } = action.args;
          handleConnect({ source: sourceId, target: targetId } as any);
          results.push({ type: "edge", source: sourceId, target: targetId });
        }
      }
      return results;
    },
    [createNode, handleConnect]
  );

  // Helper to re-inject functional properties into nodes loaded from serializable state
  const injectNodeCallbacks = useCallback(
    (nodesToInject: Node[]) => {
      return nodesToInject.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onRemoveNode: removeNode,
          onAIAction: applyAIActions,
          onDataChange: (newData: any) => updateNodeData(node.id, newData),
          onAnalyze: () => handleAnalyze(node.id),
          onMaximize: () =>
            reactFlowInstance?.fitView({
              nodes: [{ id: node.id }],
              padding: 0.5,
              duration: 400,
            }),
          nodeId: node.id,
          projectId: (node as any).data?.projectId || projectId || slug,
          analyzed: (node as any).data?.analyzed || false,
          analysis: (node as any).data?.analysis || null,
          dbId: (node as any).data?.dbId || null,
        },
      }));
    },
    [
      removeNode,
      applyAIActions,
      updateNodeData,
      handleAnalyze,
      reactFlowInstance,
      projectId,
      slug,
    ]
  );

  // Re-inject callbacks when projectId is finally set (from loading or creation)
  useEffect(() => {
    if (projectId && nodes.length > 0) {
      const someNodeMissingId = nodes.some(
        (n) => n.type === "prompt" && !n.data.projectId
      );
      if (someNodeMissingId) {
        setNodes((nds) => injectNodeCallbacks(nds));
      }
    }
  }, [projectId, injectNodeCallbacks, nodes.length, setNodes]);

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0 && history.length > 0) {
      trackFeatureUsed("workflow_undo_used");
      const previousState = history[historyIndex - 1];
      if (previousState && previousState.nodes && previousState.edges) {
        setIsUndoRedoAction(true);
        setNodes(injectNodeCallbacks(previousState.nodes));
        setEdges(previousState.edges);
        setHistoryIndex(historyIndex - 1);
        setIsUndoRedoAction(false);
      } else {
        console.warn("⚠️ [Undo] Invalid previous state found");
      }
    } else {
    }
  }, [history, historyIndex, injectNodeCallbacks, setNodes, setEdges]);

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1 && history.length > 0) {
      trackFeatureUsed("workflow_redo_used");
      const nextState = history[historyIndex + 1];
      if (nextState && nextState.nodes && nextState.edges) {
        setIsUndoRedoAction(true);
        setNodes(injectNodeCallbacks(nextState.nodes));
        setEdges(nextState.edges);
        setHistoryIndex(historyIndex + 1);
        setIsUndoRedoAction(false);
      }
    }
  }, [history, historyIndex, injectNodeCallbacks, setNodes, setEdges]);

  // Handle node selection
  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Handle canvas click to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle node drag events
  const onNodeDragStart = useCallback((event: any, node: Node) => {
  }, []);

  const onNodeDrag = useCallback((event: any, node: Node) => {
    // No-op: React Flow handles position updates via onNodesChange
  }, []);

  const onNodeDragStop = useCallback(
    (event: any, node: Node) => {
      // React Flow already updated node positions via onNodesChange.
      // We only need to capture a history snapshot here.
      addToHistory(nodesRef.current, edgesRef.current);
    },
    [addToHistory]
  );

  const onMoveEnd = useCallback(
    (event: any, viewport: { x: number; y: number; zoom: number }) => {
      setViewport(viewport);
    },
    []
  );

  const onNodesDelete = useCallback(
    (deletedNodes: Node[]) => {
      const deletedNodeIds = new Set(deletedNodes.map((n) => n.id));

      // Find edges that are being removed because their source/target nodes were deleted
      const deletedEdges = edgesRef.current.filter(
        (e) => deletedNodeIds.has(e.source) || deletedNodeIds.has(e.target)
      );

      setNodes((nds) => {
        const updatedNodes = nds.map((node) => {
          // Find if this node was a target of any deleted edges
          // But node itself must not be one of the deleted nodes
          const relevantDeletedEdges = deletedEdges.filter(
            (e) => e.target === node.id && !deletedNodeIds.has(node.id)
          );

          if (relevantDeletedEdges.length > 0) {
            const deletedSourceIds = relevantDeletedEdges.map((e) => e.source);
            return {
              ...node,
              data: {
                ...node.data,
                connectedItems: (node.data.connectedItems || []).filter(
                  (id: string) => !deletedSourceIds.includes(id)
                ),
              },
            };
          }
          return node;
        });

        // The edges will be updated by ReactFlow, but we need to push to history correctly
        const remainingEdges = edgesRef.current.filter(
          (e: any) =>
            !deletedNodeIds.has(e.source) && !deletedNodeIds.has(e.target)
        );

        addToHistory(updatedNodes, remainingEdges);
        return updatedNodes;
      });
    },
    [setNodes, addToHistory]
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {

      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.map((node) => {
          // Find if this node was a target of any deleted edges
          const relevantDeletedEdges = deletedEdges.filter(
            (e) => e.target === node.id
          );
          if (relevantDeletedEdges.length > 0) {
            const deletedSourceIds = relevantDeletedEdges.map((e) => e.source);
            return {
              ...node,
              data: {
                ...node.data,
                connectedItems: (node.data.connectedItems || []).filter(
                  (id: any) => !deletedSourceIds.includes(id)
                ),
              },
            };
          }
          return node;
        });

        setEdges((eds) => {
          addToHistory(updatedNodes, eds);
          return eds;
        });

        return updatedNodes;
      });
    },
    [setEdges, setNodes, addToHistory]
  );

  // Undo/Redo/Zoom functions
  const memoizedHandleUndo = useCallback(() => {
    undo();
  }, [undo]);

  const memoizedHandleRedo = useCallback(() => {
    redo();
  }, [redo]);

  // Reset flag when slug changes
  useEffect(() => {
    if (slug && slug !== "create") {
      const fetchProject = async () => {
        setIsLoading(true);
        try {
          const res = await apiResponse.get(`/apps/workflow/${slug}`, {
            withCredentials: true,
          });
          if (res.data.success) {
            const project = res.data.data;
            setProjectName(project.name);
            setProjectId(project._id);
            const loadedNodes = injectNodeCallbacks(project.nodes || []);
            const loadedEdges = project.edges || [];
            setNodes(loadedNodes);
            setEdges(loadedEdges);

            // Capture initial state in history
            setHistory([
              {
                nodes: JSON.parse(JSON.stringify(loadedNodes)),
                edges: JSON.parse(JSON.stringify(loadedEdges)),
              },
            ]);
            setHistoryIndex(0);

            if (project.viewport) {
              setViewport(project.viewport);
              // We'll apply this in a separate effect once instance is ready
            }
            setIsSetupDialogOpen(false);
          } else {
            setIsSetupDialogOpen(true);
          }
        } catch (error) {
          console.error("Failed to fetch project:", error);
          setIsSetupDialogOpen(true);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProject();
    }
  }, [slug]);

  // Apply saved viewport once instance is ready and project is loaded
  useEffect(() => {
    if (
      reactFlowInstance &&
      !isLoading &&
      !initialViewportApplied &&
      slug &&
      slug !== "create"
    ) {
      reactFlowInstance.setViewport(viewport);
      setInitialViewportApplied(true);
    }
  }, [reactFlowInstance, isLoading, viewport, initialViewportApplied, slug]);

  // Reset flag when slug changes
  useEffect(() => {
    setInitialViewportApplied(false);
  }, [slug]);

  // Fetch workflow history
  useEffect(() => {
    if (isSetupDialogOpen) {
      const fetchHistory = async () => {
        setIsHistoryLoading(true);
        try {
          const res = await apiResponse.get("/apps/workflow/history", {
            withCredentials: true,
          });
          if (res.data.success) {
            setHistoryProjects(res.data.data);
          }
        } catch (error) {
          console.error("Failed to fetch history:", error);
        } finally {
          setIsHistoryLoading(false);
        }
      };
      fetchHistory();
    }
  }, [isSetupDialogOpen]);

  // Auto-save logic
  useEffect(() => {
    if (slug && nodes.length > 0) {
      const saveTimeout = setTimeout(async () => {
        try {
          await apiResponse.put(
            `/apps/workflow/${slug}`,
            { nodes, edges, viewport },
            { withCredentials: true }
          );
        } catch (error) {
          console.error("Failed to auto-save workflow:", error);
        }
      }, 2000); // 2 second debounce

      return () => clearTimeout(saveTimeout);
    }
  }, [nodes, edges, viewport, slug]);

  const handleCreateWorkflow = async () => {
    if (!projectName.trim()) return;
    setIsCreating(true);
    trackEvent("workflow_create_attempted", {
      has_name: Boolean(projectName.trim()),
    });
    try {
      const res = await apiResponse.post(
        "/apps/workflow",
        { name: projectName },
        { withCredentials: true }
      );
      if (res.data.success) {
        const newProject = res.data.data;
        trackEvent("workflow_create_succeeded", {
          workflow_id: newProject._id,
          workflow_slug: newProject.slug,
        });
        setProjectId(newProject._id);
        router.push(`/apps/workflow/${newProject.slug}`);
      }
    } catch (error) {
      console.error("Failed to create workflow:", error);
      trackEvent("workflow_create_failed", {});
    } finally {
      setIsCreating(false);
    }
  };

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "z":
            event.preventDefault();
            if (event.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case "y":
            event.preventDefault();
            redo();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  // Socket.IO for real-time AI updates
  // Stable ref so the socket listener always calls the latest applyAIActions
  // without needing to re-register every time applyAIActions recreates
  const applyAIActionsRef = React.useRef<typeof applyAIActions>(applyAIActions);
  applyAIActionsRef.current = applyAIActions;

  useEffect(() => {
    if (!projectId) return;

    if (!socketRef.current) {
      socketRef.current = io(serverUrlSocket);
    }

    const socket = socketRef.current;

    socket.emit("join", projectId);

    // Use ref so the handler is never stale but the effect only runs when projectId changes
    socket.on("workflow:ai:update", (data: any) => {
      if (data.actions && data.actions.length > 0) {
        applyAIActionsRef.current(data.nodeId, data.actions);
      }
    });

    return () => {
      socket.off("workflow:ai:update");
    };
  }, [projectId]); // removed applyAIActions — prevents listener re-registration on every drag

  if (isLoading) {
    return (
      <div className='bg-background flex h-screen flex-col items-center justify-center'>
        <LoadingFileLoader />
        <p className='text-muted-foreground animate-pulse'>
          Loading your workflow...
        </p>
      </div>
    );
  }

  return (
    <div className='from-background via-background to-muted/10 flex h-screen flex-col bg-gradient-to-br'>
      <Navbar title={projectName} />

      <div className='relative flex flex-1'>
        <FloatingSidebar
          onAddIntegration={createNode}
          onUndo={memoizedHandleUndo}
          onRedo={memoizedHandleRedo}
          onZoomToFit={undefined}
          slug={slug}
        />

        <div className='flex flex-1 flex-col'>
          {/* React Flow Canvas - All functionality moved here */}
          <div className='bg-background relative h-full min-h-[600px] w-full flex-1'>
            <div className='absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center space-x-2'>
              <div className='bg-muted/50 border-border flex items-center space-x-1 rounded-xl border p-2 shadow-lg backdrop-blur-sm'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={memoizedHandleUndo}
                  disabled={historyIndex <= 0}
                  className='hover:bg-accent h-8 w-8 rounded-lg p-0 disabled:cursor-not-allowed disabled:opacity-50'
                  title='Undo (Ctrl+Z)'
                >
                  <Undo2 className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={memoizedHandleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className='hover:bg-accent h-8 w-8 rounded-lg p-0 disabled:cursor-not-allowed disabled:opacity-50'
                  title='Redo (Ctrl+Y)'
                >
                  <Redo2 className='h-4 w-4' />
                </Button>
                <div className='bg-border mx-1 h-6 w-px'></div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => reactFlowInstance?.zoomIn({ duration: 200 })}
                  className='hover:bg-accent h-8 w-8 rounded-lg p-0'
                  title='Zoom In'
                >
                  <Plus className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => reactFlowInstance?.zoomOut({ duration: 200 })}
                  className='hover:bg-accent h-8 w-8 rounded-lg p-0'
                  title='Zoom Out'
                >
                  <Minus className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() =>
                    reactFlowInstance?.fitView({ padding: 0.1, duration: 200 })
                  }
                  className='hover:bg-accent h-8 w-8 rounded-lg p-0'
                  title='Fit View'
                >
                  <Maximize2 className='h-4 w-4' />
                </Button>
              </div>
            </div>
            <ReactFlow
              proOptions={{ hideAttribution: true }}
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodesDelete={onNodesDelete}
              onEdgesDelete={onEdgesDelete}
              onConnect={handleConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onNodeDragStart={onNodeDragStart}
              onNodeDrag={onNodeDrag}
              onNodeDragStop={onNodeDragStop}
              onEdgeClick={(event, edge) => {
                // Enable edge disconnection by clicking — also sync connectedItems
                setNodes((prevNodes) => {
                  const updatedNodes = prevNodes.map((node) => {
                    if (node.id === edge.target) {
                      return {
                        ...node,
                        data: {
                          ...node.data,
                          connectedItems: (
                            node.data.connectedItems || []
                          ).filter((id: string) => id !== edge.source),
                        },
                      };
                    }
                    return node;
                  });

                  setEdges((eds) => {
                    const newEdges = eds.filter((e) => e.id !== edge.id);
                    addToHistory(updatedNodes, newEdges);
                    return newEdges;
                  });

                  return updatedNodes;
                });
              }}
              onInit={setReactFlowInstance}
              onMoveEnd={onMoveEnd}
              defaultViewport={viewport}
              panOnDrag={true}
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}
              minZoom={0.1}
              maxZoom={2}
              selectNodesOnDrag={false}
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
              fitView={false}
              fitViewOptions={{ padding: 0.1 }}
              preventScrolling={true}
              zoomActivationKeyCode={null}
              multiSelectionKeyCode={null}
            >
              <Background />
              {/* <Controls /> */}
            </ReactFlow>
          </div>
        </div>
      </div>

      <Dialog
        open={isSetupDialogOpen}
        onOpenChange={(open) => {
          // If there is no active project (no slug or projectId),
          // don't allow closing the dialog manually.
          if (!open && (!slug || !projectId)) return;
          setIsSetupDialogOpen(open);
        }}
      >
        <DialogContent
          className='border-border rounded-4xl bg-neutral-300 backdrop-blur-xl sm:max-w-[500px] dark:bg-neutral-900'
          onPointerDownOutside={(e) => {
            // Prevent closing by clicking outside if no project is active
            if (!slug || !projectId) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            // Prevent closing with Escape key if no project is active
            if (!slug || !projectId) e.preventDefault();
          }}
          hideDialogClose={!slug && !projectId}
        >
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-2xl font-bold'>
              <PlusCircle className='text-primary h-6 w-6' />
              Workflow Engine
            </DialogTitle>
            <DialogDescription>
              Create a new workflow project or open existing one.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-6 py-4'>
            <div className='space-y-2'>
              <label className='text-muted-foreground px-1 text-sm font-medium'>
                New Project Name
              </label>
              <div className='flex space-x-2'>
                <Input
                  placeholder='e.g. My Awesome Workflow'
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className='bg-muted/50 border-border'
                />
                <Button
                  onClick={handleCreateWorkflow}
                  disabled={!projectName.trim() || isCreating}
                  className='bg-primary text-primary-foreground hover:bg-primary/90'
                >
                  {isCreating ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </div>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <span className='border-border w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background text-muted-foreground rounded-full px-2'>
                  Or open existing
                </span>
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-muted-foreground flex items-center gap-2 px-1 text-sm font-medium'>
                <HistoryIcon className='h-4 w-4' />
                Project History
              </label>
              <div className='custom-scrollbar max-h-[200px] space-y-2 overflow-y-auto pr-1'>
                {isHistoryLoading ? (
                  <div className='flex justify-center p-4'>
                    <Loader2 className='text-muted-foreground h-6 w-6 animate-spin' />
                  </div>
                ) : historyProjects.length > 0 ? (
                  historyProjects.map((project) => (
                    <div
                      key={project._id}
                      onClick={() =>
                        router.push(`/apps/workflow/${project.slug}`)
                      }
                      className='group border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/30 flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg'>
                          <HistoryIcon className='text-primary h-4 w-4' />
                        </div>
                        <div>
                          <p className='text-foreground group-hover:text-primary text-sm font-medium transition-colors'>
                            {project.name}
                          </p>
                          <p className='text-muted-foreground text-[10px]'>
                            Last edited{" "}
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <FolderOpen className='text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors' />
                    </div>
                  ))
                ) : (
                  <div className='text-muted-foreground border-border rounded-xl border border-dashed py-8 text-center text-sm'>
                    No existing workflows found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GennittWorkflow;
