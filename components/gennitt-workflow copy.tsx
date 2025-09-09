// "use client";

// import React, { useState, useCallback, useRef, useEffect } from "react";
// import ReactFlow, {
//   Background,
//   Controls,
//   ReactFlowProvider,
//   type Node,
//   type Edge,
//   type Connection,
//   type NodeChange,
//   type EdgeChange,
//   type NodeMouseHandler,
//   type NodeTypes,
//   type EdgeTypes,
//   applyNodeChanges,
//   applyEdgeChanges,
// } from "reactflow";
// import "reactflow/dist/style.css";

// import { FloatingSidebar } from "./floating-sidebar";
// import { Navbar } from "./navbar";
// import { Button } from "@/components/ui/button";
// import { Plus, Undo2, Redo2, Maximize2, Minus } from "lucide-react";

// // Import all node types
// import { InputNode } from "./nodes/input-node";
// import { ProcessNode } from "./nodes/process-node";
// import { OutputNode } from "./nodes/output-node";
// import { ConditionalNode } from "./nodes/conditional-node";
// import { CodeNode } from "./nodes/code-node";
// import { AIChatNode } from "./nodes/ai-chat-node";
// import { YouTubeNode } from "./nodes/youtube-node";
// import { PDFNode } from "./nodes/pdf-node";
// import { ChatNode } from "./nodes/chat-node";
// import { FolderNode } from "./nodes/folder-node";
// import { InstagramNode } from "./nodes/instagram-node";
// import { DatabaseNode } from "./nodes/database-node";
// import { LinkedInNode } from "./nodes/linkedin-node";
// import { TwitterNode } from "./nodes/twitter-node";
// import { WebsiteNode } from "./nodes/website-node";
// import { ImageNode } from "./nodes/image-node";
// import { AudioNode } from "./nodes/audio-node";
// import { VideoNode } from "./nodes/video-node";
// import { DocumentNode } from "./nodes/document-node";
// import { TextNode } from "./nodes/text-node";

// // Import edge types
// import CustomEdge from "./custom-edge";

// // Define node types
// const nodeTypes: NodeTypes = {
//   input: InputNode,
//   process: ProcessNode,
//   output: OutputNode,
//   conditional: ConditionalNode,
//   code: CodeNode,
//   aiChat: AIChatNode,
//   youtube: YouTubeNode,
//   pdf: PDFNode,
//   chat: ChatNode,
//   folder: FolderNode,
//   instagram: InstagramNode,
//   database: DatabaseNode,
//   linkedin: LinkedInNode,
//   twitter: TwitterNode,
//   website: WebsiteNode,
//   image: ImageNode,
//   audio: AudioNode,
//   video: VideoNode,
//   document: DocumentNode,
//   text: TextNode,
// };

// // Define edge types
// const edgeTypes: EdgeTypes = {
//   custom: CustomEdge,
// };

// export default function GennittWorkflow() {
//   const [selectedWorkflowItems, setSelectedWorkflowItems] = useState<string[]>(
//     []
//   );
//   const [nodes, setNodes] = useState<Node[]>([]);
//   const [edges, setEdges] = useState<Edge[]>([]);
//   const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
//   const [selectedNode, setSelectedNode] = useState<Node | null>(null);
//   const [undoFn, setUndoFn] = useState<(() => void) | null>(null);
//   const [redoFn, setRedoFn] = useState<(() => void) | null>(null);
//   const [zoomToFitFn, setZoomToFitFn] = useState<(() => void) | null>(null);

//   // History management for undo/redo
//   const [history, setHistory] = useState<
//     Array<{ nodes: Node[]; edges: Edge[] }>
//   >([]);
//   const [historyIndex, setHistoryIndex] = useState(-1);
//   const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);

//   // Add current state to history
//   const addToHistory = useCallback(
//     (newNodes: Node[], newEdges: Edge[]) => {
//       if (isUndoRedoAction) return; // Don't add to history during undo/redo

//       // Ensure we have valid arrays
//       const safeNodes = Array.isArray(newNodes) ? newNodes : [];
//       const safeEdges = Array.isArray(newEdges) ? newEdges : [];

//       const currentState = { nodes: safeNodes, edges: safeEdges };

//       setHistory((prevHistory) => {
//         // Remove any future history if we're not at the end
//         const trimmedHistory = prevHistory.slice(0, historyIndex + 1);
//         const newHistory = [...trimmedHistory, currentState];

//         // Limit history to 50 states to prevent memory issues
//         const limitedHistory = newHistory.slice(-50);

//         console.log(
//           "📝 [History] Added state, total history:",
//           limitedHistory.length
//         );
//         return limitedHistory;
//       });

//       setHistoryIndex((prevIndex) => {
//         const newIndex = prevIndex + 1;
//         // Ensure index doesn't exceed history bounds
//         const maxIndex = Math.min(newIndex, 49); // 50 states max, so max index is 49
//         console.log("📊 [History] Index updated to:", maxIndex);
//         return maxIndex;
//       });
//     },
//     [historyIndex, isUndoRedoAction]
//   );

//   // Undo function
//   const undo = useCallback(() => {
//     if (historyIndex > 0 && history.length > 0) {
//       const previousState = history[historyIndex - 1];
//       if (previousState && previousState.nodes && previousState.edges) {
//         setIsUndoRedoAction(true);
//         setNodes(previousState.nodes);
//         setEdges(previousState.edges);
//         setHistoryIndex(historyIndex - 1);
//         setIsUndoRedoAction(false);
//         console.log("✅ [Undo] Restored to history index:", historyIndex - 1);
//       } else {
//         console.warn("⚠️ [Undo] Invalid previous state found");
//       }
//     } else {
//       console.log("ℹ️ [Undo] No history to undo");
//     }
//   }, [history, historyIndex]);

//   // Redo function
//   const redo = useCallback(() => {
//     if (historyIndex < history.length - 1 && history.length > 0) {
//       const nextState = history[historyIndex + 1];
//       if (nextState && nextState.nodes && nextState.edges) {
//         setIsUndoRedoAction(true);
//         setNodes(nextState.nodes);
//         setEdges(nextState.edges);
//         setHistoryIndex(historyIndex + 1);
//         setIsUndoRedoAction(false);
//         console.log("✅ [Redo] Restored to history index:", historyIndex + 1);
//       } else {
//         console.warn("⚠️ [Redo] Invalid next state found");
//       }
//     } else {
//       console.log("ℹ️ [Redo] No history to redo");
//     }
//   }, [history, historyIndex]);

//   // Node creation function - single source of truth
//   const createNode = useCallback((type: string, data: any) => {
//     console.log("🎨 [GennittWorkflow] Creating node:", type, data);

//     const position = {
//       x: Math.random() * 400 + 100,
//       y: Math.random() * 300 + 100,
//     };

//     let newNode: Node;

//     switch (type) {
//       case "aiChat":
//         newNode = {
//           id: `chat-${Date.now()}`,
//           type: "aiChat",
//           position,
//           draggable: true,
//           data: {
//             title: data.title || "New AI Chat",
//             messages: data.messages || [],
//             onRemoveNode: removeNode,
//             nodeId: `chat-${Date.now()}`,
//           },
//           style: { width: 600, height: 400 },
//         };
//         break;
//       case "youtube":
//         newNode = {
//           id: `youtube-${Date.now()}`,
//           type: "youtube",
//           position,
//           draggable: true,
//           data: {
//             title: data.title || "YouTube Video",
//             url: data.url,
//             videoId: data.videoId,
//             thumbnail: data.thumbnail,
//             transcript: "",
//             onRemoveNode: removeNode,
//             nodeId: `youtube-${Date.now()}`,
//           },
//           style: { width: 400, height: 300 },
//         };
//         break;
//       case "mic":
//         newNode = {
//           id: `audio-${Date.now()}`,
//           type: "audio",
//           position,
//           draggable: true,
//           data: {
//             title: data.title || "Audio File",
//             url: data.url,
//             type: "audio",
//             duration: data.duration,
//             size: data.size,
//             onRemoveNode: removeNode,
//             nodeId: `audio-${Date.now()}`,
//           },
//           style: { width: 300, height: 200 },
//         };
//         break;
//       case "image":
//         newNode = {
//           id: `image-${Date.now()}`,
//           type: "image",
//           position,
//           draggable: true,
//           data: {
//             title: data.title || "Image",
//             url: data.url,
//             type: "image",
//             size: data.size,
//             onRemoveNode: removeNode,
//             nodeId: `image-${Date.now()}`,
//           },
//           style: { width: 300, height: 200 },
//         };
//         break;
//       case "video":
//         newNode = {
//           id: `video-${Date.now()}`,
//           type: "video",
//           position,
//           draggable: true,
//           data: {
//             title: data.title || "Video",
//             url: data.url,
//             type: "video",
//             duration: data.duration,
//             size: data.size,
//             onRemoveNode: removeNode,
//             nodeId: `video-${Date.now()}`,
//           },
//           style: { width: 300, height: 200 },
//         };
//         break;
//       case "text":
//         newNode = {
//           id: `text-${Date.now()}`,
//           type: "text",
//           position,
//           draggable: true,
//           data: {
//             title: data.title || "Text Content",
//             content: data.content,
//             type: "text",
//             onRemoveNode: removeNode,
//             nodeId: `text-${Date.now()}`,
//           },
//           style: { width: 300, height: 200 },
//         };
//         break;
//       case "file":
//         newNode = {
//           id: `file-${Date.now()}`,
//           type: "document",
//           position,
//           draggable: true,
//           data: {
//             title: data.title || "Document",
//             url: data.url,
//             type: "document",
//             size: data.size,
//             onRemoveNode: removeNode,
//             nodeId: `file-${Date.now()}`,
//           },
//           style: { width: 300, height: 200 },
//         };
//         break;
//       case "folder":
//         newNode = {
//           id: `folder-${Date.now()}`,
//           type: "folder",
//           position,
//           draggable: true,
//           data: {
//             title: data.title || "New Folder",
//             onRemoveNode: removeNode,
//             nodeId: `folder-${Date.now()}`,
//           },
//           style: { width: 200, height: 150 },
//         };
//         break;
//       case "instagram":
//         newNode = {
//           id: `instagram-${Date.now()}`,
//           type: "instagram",
//           position,
//           draggable: true,
//           data: {
//             title: data.title || "Instagram Post",
//             url: data.url,
//             platform: "instagram",
//             onRemoveNode: removeNode,
//             nodeId: `instagram-${Date.now()}`,
//           },
//           style: { width: 300, height: 200 },
//         };
//         break;
//       case "twitter":
//         newNode = {
//           id: `twitter-${Date.now()}`,
//           type: "twitter",
//           position,
//           draggable: true,
//           data: {
//             title: data.title || "Twitter Post",
//             url: data.url,
//             platform: "twitter",
//             onRemoveNode: removeNode,
//             nodeId: `twitter-${Date.now()}`,
//           },
//           style: { width: 300, height: 200 },
//         };
//         break;
//       case "linkedin":
//         newNode = {
//           id: `linkedin-${Date.now()}`,
//           type: "linkedin",
//           position,
//           draggable: true,
//           data: {
//             title: data.title || "LinkedIn Post",
//             url: data.url,
//             platform: "linkedin",
//             onRemoveNode: removeNode,
//             nodeId: `linkedin-${Date.now()}`,
//           },
//           style: { width: 300, height: 200 },
//         };
//         break;
//       default:
//         console.warn("Unknown node type:", type);
//         return;
//     }

//     console.log("✅ [GennittWorkflow] Created node:", newNode);
//     addNode(newNode);
//   }, []);

//   // Add node to state
//   const addNode = useCallback(
//     (node: Node) => {
//       console.log("🎯 [GennittWorkflow] Adding node to workflow:", node);
//       setNodes((prevNodes) => {
//         const newNodes = [...prevNodes, node];
//         console.log(
//           "✅ [GennittWorkflow] Updated nodes array length:",
//           newNodes.length
//         );
//         addToHistory(newNodes, edges);
//         return newNodes;
//       });
//     },
//     [edges, addToHistory]
//   );

//   // Remove node from state
//   const removeNode = useCallback(
//     (nodeId: string) => {
//       console.log("🗑️ [GennittWorkflow] Removing node:", nodeId);
//       setNodes((prevNodes) => {
//         const newNodes = prevNodes.filter((node) => node.id !== nodeId);
//         console.log(
//           "✅ [GennittWorkflow] Node removed, remaining nodes:",
//           newNodes.length
//         );
//         addToHistory(newNodes, edges);
//         return newNodes;
//       });
//     },
//     [edges, addToHistory]
//   );

//   // Handle node changes from React Flow
//   const handleNodesChange = useCallback((changes: NodeChange[]) => {
//     setNodes((nds) => applyNodeChanges(changes, nds));
//   }, []);

//   // Handle edge changes
//   const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
//     setEdges((eds) => applyEdgeChanges(changes, eds));
//   }, []);

//   // Handle connections
//   const handleConnect = useCallback(
//     (connection: Connection) => {
//       console.log("🔗 [GennittWorkflow] Connection:", connection);
//       if (connection.source && connection.target) {
//         const newEdge: Edge = {
//           id: `edge-${Date.now()}`,
//           source: connection.source,
//           target: connection.target,
//           type: "custom",
//         };
//         setEdges((prevEdges) => {
//           const newEdges = [...prevEdges, newEdge];
//           addToHistory(nodes, newEdges);
//           return newEdges;
//         });
//       }
//     },
//     [nodes, addToHistory]
//   );

//   // Handle node selection
//   const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
//     setSelectedNode(node);
//   }, []);

//   // Handle canvas click to deselect
//   const onPaneClick = useCallback(() => {
//     setSelectedNode(null);
//   }, []);

//   // Handle node drag events
//   const onNodeDragStart = useCallback((event: any, node: Node) => {
//     console.log("🎯 [GennittWorkflow] Node drag started:", node.id);
//   }, []);

//   const onNodeDrag = useCallback((event: any, node: Node) => {
//     console.log("🎯 [GennittWorkflow] Node dragging:", node.id, node.position);
//   }, []);

//   const onNodeDragStop = useCallback(
//     (event: any, node: Node) => {
//       setNodes((nds) => {
//         const newNodes = nds.map((n) =>
//           n.id === node.id ? { ...n, position: node.position } : n
//         );
//         addToHistory(newNodes, edges); // history only on drag stop
//         return newNodes;
//       });
//     },
//     [edges, addToHistory]
//   );

//   // Undo/Redo/Zoom functions
//   const memoizedHandleUndo = useCallback(() => {
//     console.log("Undo");
//     undo();
//   }, [undo]);

//   const memoizedHandleRedo = useCallback(() => {
//     console.log("Redo");
//     redo();
//   }, [redo]);

//   const memoizedHandleZoomToFit = useCallback(() => {
//     if (reactFlowInstance) {
//       reactFlowInstance.fitView({ padding: 0.1 });
//     }
//   }, [reactFlowInstance]);

//   // Set up callbacks for parent component
//   useEffect(() => {
//     setUndoFn(memoizedHandleUndo);
//     setRedoFn(memoizedHandleRedo);
//     setZoomToFitFn(memoizedHandleZoomToFit);
//   }, [memoizedHandleUndo, memoizedHandleRedo, memoizedHandleZoomToFit]);

//   // Initialize history with initial state
//   useEffect(() => {
//     if (history.length === 0 && nodes.length === 0 && edges.length === 0) {
//       // Only initialize if we have no history and no current state
//       console.log("🚀 [History] Initializing with empty state");
//       addToHistory([], []);
//     }
//   }, [history.length, nodes.length, edges.length, addToHistory]);

//   // Handle keyboard shortcuts
//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       // Don't handle keyboard events if user is typing in an input field
//       const target = event.target as HTMLElement;
//       if (
//         target.tagName === "INPUT" ||
//         target.tagName === "TEXTAREA" ||
//         target.contentEditable === "true"
//       ) {
//         return;
//       }

//       if (event.ctrlKey || event.metaKey) {
//         switch (event.key) {
//           case "z":
//             event.preventDefault();
//             if (event.shiftKey) {
//               // Ctrl+Shift+Z or Cmd+Shift+Z - Redo
//               memoizedHandleRedo();
//             } else {
//               // Ctrl+Z or Cmd+Z - Undo
//               memoizedHandleUndo();
//             }
//             break;
//           case "y":
//             event.preventDefault();
//             // Ctrl+Y or Cmd+Y - Redo
//             memoizedHandleRedo();
//             break;
//         }
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [memoizedHandleUndo, memoizedHandleRedo]);

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-muted/10">
//       <Navbar />

//       <div className="flex flex-1 relative">
//         <FloatingSidebar
//           onAddIntegration={createNode}
//           onUndo={undoFn || undefined}
//           onRedo={redoFn || undefined}
//           onZoomToFit={zoomToFitFn || undefined}
//         />

//         <div className="flex flex-1 flex-col">
//           {/* React Flow Canvas - All functionality moved here */}
//           <div className="flex-1 bg-background relative w-full h-full min-h-[600px]">
//             <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-2">
//               <div className="bg-muted/50 backdrop-blur-sm border border-border rounded-xl shadow-lg p-2 flex items-center space-x-1">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={memoizedHandleUndo}
//                   disabled={historyIndex <= 0}
//                   className="w-8 h-8 p-0 rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
//                   title="Undo (Ctrl+Z)"
//                 >
//                   <Undo2 className="w-4 h-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={memoizedHandleRedo}
//                   disabled={historyIndex >= history.length - 1}
//                   className="w-8 h-8 p-0 rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
//                   title="Redo (Ctrl+Y)"
//                 >
//                   <Redo2 className="w-4 h-4" />
//                 </Button>
//                 <div className="w-px h-6 bg-border mx-1"></div>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => reactFlowInstance?.zoomIn()}
//                   className="w-8 h-8 p-0 rounded-lg hover:bg-accent"
//                   title="Zoom In"
//                 >
//                   <Plus className="w-4 h-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => reactFlowInstance?.zoomOut()}
//                   className="w-8 h-8 p-0 rounded-lg hover:bg-accent"
//                   title="Zoom Out"
//                 >
//                   <Minus className="w-4 h-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={memoizedHandleZoomToFit}
//                   className="w-8 h-8 p-0 rounded-lg hover:bg-accent"
//                   title="Fit View"
//                 >
//                   <Maximize2 className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>

//             <ReactFlowProvider>
//               <ReactFlow
//                 nodes={nodes}
//                 edges={edges}
//                 onNodesChange={handleNodesChange}
//                 onEdgesChange={handleEdgesChange}
//                 onConnect={handleConnect}
//                 onNodeClick={onNodeClick}
//                 onPaneClick={onPaneClick}
//                 onNodeDragStart={onNodeDragStart}
//                 onNodeDrag={onNodeDrag}
//                 onNodeDragStop={onNodeDragStop}
//                 onEdgeClick={(event, edge) => {
//                   // Enable edge disconnection by clicking
//                   setEdges((eds) => eds.filter((e) => e.id !== edge.id));
//                 }}
//                 nodeTypes={nodeTypes}
//                 edgeTypes={edgeTypes}
//                 onInit={setReactFlowInstance}
//                 defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
//                 panOnDrag={true}
//                 zoomOnScroll={true}
//                 zoomOnPinch={true}
//                 zoomOnDoubleClick={false}
//                 minZoom={0.1}
//                 maxZoom={2}
//                 selectNodesOnDrag={false}
//                 nodesDraggable={true}
//                 nodesConnectable={true}
//                 elementsSelectable={true}
//                 fitView={false}
//                 fitViewOptions={{ padding: 0.1 }}
//                 style={{ width: "100%", height: "100%" }}
//                 proOptions={{ hideAttribution: true }}
//               >
//                 <Background className="opacity-60" />
//                 {/* <Controls /> */}
//               </ReactFlow>
//             </ReactFlowProvider>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
