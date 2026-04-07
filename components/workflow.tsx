"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Navbar } from "./navbar";
import { createNode as createNodeUtil } from "@/lib/workflow-utils";
import {
  Maximize2,
  Minus,
  Plus,
  Redo2,
  Undo2,
  FolderOpen,
  PlusCircle,
  Loader2,
  History as HistoryIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { apiResponse, serverUrlSocket } from "@/utils/apiResponse";
import { io } from "socket.io-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import ReactFlow, {
  Background,
  type EdgeTypes,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type NodeMouseHandler,
  useNodesState,
  useEdgesState,
  Node,
  NodeTypes,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";
import { BrandNode } from "@/nodes/brand-node";
// Import all node types
import { InputNode } from "@/nodes/input-node";
import { ProcessNode } from "@/nodes/process-node";
import { OutputNode } from "@/nodes/output-node";
import { ConditionalNode } from "@/nodes/conditional-node";
import { CodeNode } from "@/nodes/code-node";
import { AIChatNode } from "@/nodes/ai-chat-node";
import { YouTubeNode } from "@/nodes/youtube-node";
import { PDFNode } from "@/nodes/pdf-node";
import { ChatNode } from "@/nodes/chat-node";
import { FolderNode } from "@/nodes/folder-node";
import { InstagramNode } from "@/nodes/instagram-node";
import { DatabaseNode } from "@/nodes/database-node";
import { LinkedInNode } from "@/nodes/linkedin-node";
import { TwitterNode } from "@/nodes/twitter-node";
import { FacebookNode } from "@/nodes/facebook-node";
import { TikTokNode } from "@/nodes/tiktok-node";
import { WebsiteNode } from "@/nodes/website-node";
import { ImageNode } from "@/nodes/image-node";
import { AudioNode } from "@/nodes/audio-node";
import { VideoNode } from "@/nodes/video-node";
import { DocumentNode } from "@/nodes/document-node";
import { TextNode } from "@/nodes/text-node";
import { FloatingSidebar } from "@/floating-sidebar";
import { PromptNode } from "@/nodes/prompt-node";
import { LoadingFileLoader } from "@/utils/Loading";

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
    slug === "create" || !slug,
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
          console.log("🧠 [Workflow] Loaded brain items:", res.data.data.length);
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

  // Add current state to history
  const addToHistory = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      if (isUndoRedoAction) return;

      // Ensure we have valid arrays and deep copy to prevent reference issues
      const safeNodes = Array.isArray(newNodes) ? JSON.parse(JSON.stringify(newNodes)) : [];
      const safeEdges = Array.isArray(newEdges) ? JSON.parse(JSON.stringify(newEdges)) : [];

      const currentState = { nodes: safeNodes, edges: safeEdges };

      setHistory((prevHistory) => {
        // Remove any future history if we're not at the end
        const trimmedHistory = prevHistory.slice(0, historyIndex + 1);
        const newHistory = [...trimmedHistory, currentState];

        // Limit history to 50 states to prevent memory issues
        return newHistory.slice(-50);
      });

      setHistoryIndex((prevIndex) => {
        const nextIndex = Math.min(prevIndex + 1, 49);
        console.log("📜 [History] Added state. New index:", nextIndex);
        return nextIndex;
      });
    },
    [historyIndex, isUndoRedoAction],
  );

  const addNode = useCallback(
    (node: Node) => {
      console.log("🎯 [GennittWorkflow] Adding node:", node);
      setNodes((prevNodes) => {
        const newNodes = [...prevNodes, node];
        // Use a functional update to ensure we have the absolute latest state for history
        addToHistory(newNodes, edgesRef.current);
        return newNodes;
      });
    },
    [setNodes, addToHistory],
  );

  // Remove node from state
  const removeNode = useCallback(
    (nodeId: string) => {
      console.log("🗑️ [GennittWorkflow] Removing node:", nodeId);
      const newNodes = nodesRef.current.filter((node) => node.id !== nodeId);
      setNodes(newNodes);
      addToHistory(newNodes, edgesRef.current);
    },
    [setNodes, addToHistory],
  );

  // Handle connections
  const handleConnect = useCallback(
    (connection: Connection) => {
      console.log("🔗 [GennittWorkflow] Connection:", connection);
      if (connection.source && connection.target) {
        const newEdge: Edge = {
          id: `edge-${Date.now()}`,
          source: connection.source,
          target: connection.target,
          animated: true,
        };
        setEdges((prevEdges) => [...prevEdges, newEdge]);
        addToHistory(nodesRef.current, [...edgesRef.current, newEdge]);
      }
    },
    [setEdges, addToHistory],
  );

  // Node creation function - single source of truth
  const createNode = useCallback(
    async (type: string, data: any) => {
      console.log("🎨 [GennittWorkflow] Creating node:", type, data);

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
          position = { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 };
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
              { withCredentials: true },
            );
            console.log("✅ [GennittWorkflow] Item saved to database");
            if (res.data.success) {
              setBrainItems((prev) => [res.data.data, ...prev]);
            }
          } catch (error) {
            console.error("Failed to save item to database:", error);
          }
        } else {
          console.log("ℹ️ [GennittWorkflow] Item already exists in brain, skipping save");
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

      console.log("✅ [GennittWorkflow] Created node:", newNode);
      addNode(newNode);
      return newNode;
    },
    [projectId, slug, addNode, removeNode, brainItems],
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
    [setNodes],
  );

  const applyAIActions = useCallback(
    async (sourceNodeId: string, actions: any[]): Promise<any[]> => {
      console.log("🤖 [Workflow] Applying AI actions:", actions);
      const results = [];

      // Track how many create_node actions we process so we can offset vertically
      let createIndex = 0;

      for (const action of actions) {
        if (action.name === "create_node") {
          const { type, data, position } = action.args;

          const sourceNode = nodesRef.current.find(
            (n) => n.id === sourceNodeId,
          );

          // Place the generated node to the right of the source, with vertical offset
          const finalPosition = position || {
            x: (sourceNode?.position.x || 0) + 450,
            y: (sourceNode?.position.y || 0) + (createIndex * 250),
          };

          const newNode = await createNode(type, {
            ...data,
            position: finalPosition,
          });
          
          if (newNode && sourceNodeId) {
            console.log(`🔗 [Workflow] Auto-connecting ${sourceNodeId} -> ${newNode.id}`);
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
    [createNode, handleConnect],
  );

  // Helper to re-inject functional properties into nodes loaded from serializable state
  const injectNodeCallbacks = useCallback(
    (nodesToInject: Node[]) => {
      console.log(
        "💉 [Workflow] Injecting callbacks into nodes:",
        nodesToInject.length,
      );
      return nodesToInject.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onRemoveNode: removeNode,
          onAIAction: applyAIActions,
          onDataChange: (newData: any) => updateNodeData(node.id, newData),
          onMaximize: () =>
            reactFlowInstance?.fitView({
              nodes: [{ id: node.id }],
              padding: 0.5,
              duration: 400,
            }),
          nodeId: node.id,
          projectId: (node as any).data?.projectId || projectId || slug,
        },
      }));
    },
    [
      removeNode,
      applyAIActions,
      updateNodeData,
      reactFlowInstance,
      projectId,
      slug,
    ],
  );

  // Re-inject callbacks when projectId is finally set (from loading or creation)
  useEffect(() => {
    if (projectId && nodes.length > 0) {
      const someNodeMissingId = nodes.some(
        (n) => n.type === "prompt" && !n.data.projectId,
      );
      if (someNodeMissingId) {
        console.log("🔄 [Workflow] Re-injecting project properties into nodes");
        setNodes((nds) => injectNodeCallbacks(nds));
      }
    }
  }, [projectId, injectNodeCallbacks, nodes.length, setNodes]);

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0 && history.length > 0) {
      const previousState = history[historyIndex - 1];
      if (previousState && previousState.nodes && previousState.edges) {
        setIsUndoRedoAction(true);
        setNodes(injectNodeCallbacks(previousState.nodes));
        setEdges(previousState.edges);
        setHistoryIndex(historyIndex - 1);
        setIsUndoRedoAction(false);
        console.log("✅ [Undo] Restored to history index:", historyIndex - 1);
      } else {
        console.warn("⚠️ [Undo] Invalid previous state found");
      }
    } else {
      console.log("ℹ️ [Undo] No history to undo");
    }
  }, [history, historyIndex, injectNodeCallbacks, setNodes, setEdges]);

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1 && history.length > 0) {
      const nextState = history[historyIndex + 1];
      if (nextState && nextState.nodes && nextState.edges) {
        setIsUndoRedoAction(true);
        setNodes(injectNodeCallbacks(nextState.nodes));
        setEdges(nextState.edges);
        setHistoryIndex(historyIndex + 1);
        setIsUndoRedoAction(false);
        console.log("✅ [Redo] Restored to history index:", historyIndex + 1);
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
    console.log("🎯 [GennittWorkflow] Node drag started:", node.id);
  }, []);

  const onNodeDrag = useCallback((event: any, node: Node) => {
    console.log("🎯 [GennittWorkflow] Node dragging:", node.id, node.position);
  }, []);

  const onNodeDragStop = useCallback(
    (event: any, node: Node) => {
      setNodes((nds) => {
        const newNodes = nds.map((n) =>
          n.id === node.id ? { ...n, position: node.position } : n,
        );
        addToHistory(newNodes, edgesRef.current);
        return newNodes;
      });
    },
    [setNodes, addToHistory],
  );

  const onMoveEnd = useCallback(
    (event: any, viewport: { x: number; y: number; zoom: number }) => {
      setViewport(viewport);
    },
    [],
  );

  const onNodesDelete = useCallback(
    (deletedNodes: Node[]) => {
      console.log("🗑️ [Workflow] Nodes deleted:", deletedNodes.map(n => n.id));
      // useNodesState handles the deletion, but we need to capture the state AFTER deletion
      // Since setNodes is async, we use the functional update to get the latest state
      setNodes((nds) => {
        // ReactFlow already updated the state, but we need to push it
        addToHistory(nds, edgesRef.current);
        return nds;
      });
    },
    [setNodes, addToHistory],
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      console.log("✂️ [Workflow] Edges deleted:", deletedEdges.map(e => e.id));
      setEdges((eds) => {
        addToHistory(nodesRef.current, eds);
        return eds;
      });
    },
    [setEdges, addToHistory],
  );

  // Undo/Redo/Zoom functions
  const memoizedHandleUndo = useCallback(() => {
    console.log("Undo");
    undo();
  }, [undo]);

  const memoizedHandleRedo = useCallback(() => {
    console.log("Redo");
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
            setHistory([{ nodes: JSON.parse(JSON.stringify(loadedNodes)), edges: JSON.parse(JSON.stringify(loadedEdges)) }]);
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
      console.log("📍 [Workflow] Applying saved viewport:", viewport);
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
            { withCredentials: true },
          );
          console.log("💾 [Workflow] Auto-saved project state");
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
    try {
      const res = await apiResponse.post(
        "/apps/workflow",
        { name: projectName },
        { withCredentials: true },
      );
      if (res.data.success) {
        const newProject = res.data.data;
        setProjectId(newProject._id);
        router.push(`/apps/workflow/${newProject.slug}`);
      }
    } catch (error) {
      console.error("Failed to create workflow:", error);
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
  useEffect(() => {
    if (!projectId) return;

    if (!socketRef.current) {
      socketRef.current = io(serverUrlSocket);
    }

    const socket = socketRef.current;

    socket.emit("join", projectId);

    socket.on("workflow:ai:update", (data: any) => {
      console.log("📡 [Workflow] Received real-time AI update:", data);
      if (data.actions && data.actions.length > 0) {
        applyAIActions(data.nodeId, data.actions);
      }
    });

    return () => {
      socket.off("workflow:ai:update");
    };
  }, [projectId, applyAIActions]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <LoadingFileLoader />
        <p className="text-muted-foreground animate-pulse">
          Loading your workflow...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <Navbar title={projectName} />

      <div className="flex flex-1 relative">
        <FloatingSidebar
          onAddIntegration={createNode}
          onUndo={memoizedHandleUndo}
          onRedo={memoizedHandleRedo}
          onZoomToFit={undefined}
          slug={slug}
        />

        <div className="flex flex-1 flex-col">
          {/* React Flow Canvas - All functionality moved here */}
          <div className="flex-1 bg-background relative w-full h-full min-h-[600px]">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-2">
              <div className="bg-muted/50 backdrop-blur-sm border border-border rounded-xl shadow-lg p-2 flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={memoizedHandleUndo}
                  disabled={historyIndex <= 0}
                  className="w-8 h-8 p-0 rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={memoizedHandleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="w-8 h-8 p-0 rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1"></div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => reactFlowInstance?.zoomIn({ duration: 200 })}
                  className="w-8 h-8 p-0 rounded-lg hover:bg-accent"
                  title="Zoom In"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => reactFlowInstance?.zoomOut({ duration: 200 })}
                  className="w-8 h-8 p-0 rounded-lg hover:bg-accent"
                  title="Zoom Out"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    reactFlowInstance?.fitView({ padding: 0.1, duration: 200 })
                  }
                  className="w-8 h-8 p-0 rounded-lg hover:bg-accent"
                  title="Fit View"
                >
                  <Maximize2 className="w-4 h-4" />
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
                // Enable edge disconnection by clicking
                setEdges((eds) => {
                  const newEdges = eds.filter((e) => e.id !== edge.id);
                  addToHistory(nodesRef.current, newEdges);
                  return newEdges;
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
          className="sm:max-w-[500px] border-border bg-neutral-300 rounded-4xl dark:bg-neutral-900 backdrop-blur-xl"
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
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-primary" />
              Workflow Engine
            </DialogTitle>
            <DialogDescription>
              Create a new workflow project or open existing one.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground px-1">
                New Project Name
              </label>
              <div className="flex space-x-2">
                <Input
                  placeholder="e.g. My Awesome Workflow"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-muted/50 border-border"
                />
                <Button
                  onClick={handleCreateWorkflow}
                  disabled={!projectName.trim() || isCreating}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground rounded-full">
                  Or open existing
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground px-1 flex items-center gap-2">
                <HistoryIcon className="w-4 h-4" />
                Project History
              </label>
              <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {isHistoryLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : historyProjects.length > 0 ? (
                  historyProjects.map((project) => (
                    <div
                      key={project._id}
                      onClick={() =>
                        router.push(`/apps/workflow/${project.slug}`)
                      }
                      className="group flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <HistoryIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {project.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Last edited{" "}
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <FolderOpen className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
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
