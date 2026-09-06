"use client";

import { Button } from "../ui/button";
import { LocalizedText } from "@/components/localized-text";
import { useAgentRunsContext } from "@/context/AgentRunsContext";
import { useProjectDesign } from "@/context/DesignProject";
import { cn } from "@/lib/utils";
import { DesignNode } from "@/nodes/design-node";
import { LoadingFileLoader } from "@/utils/Loading";
import {
  Image as ImageIcon,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  View,
} from "lucide-react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  NodeTypes,
  Panel,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";

// Define custom node types
const nodeTypes: NodeTypes = {
  design: DesignNode,
};

interface GraphicsCanvasProps {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const GraphicsCanvas = ({
  isFullscreen,
  onToggleFullscreen,
}: GraphicsCanvasProps) => {
  return (
    <ReactFlowProvider>
      <GraphicsCanvasContent
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
      />
    </ReactFlowProvider>
  );
};

const GraphicsCanvasContent = ({
  isFullscreen,
  onToggleFullscreen,
}: GraphicsCanvasProps) => {
  const {
    project,
    messages,
    focusedGenerationId,
    liveNodes,
    isGenerating,
    isGeneratingImage,
    aiStatus,
  } = useProjectDesign();
  const { runs } = useAgentRunsContext();
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Extract images from project messages and convert to nodes
  useEffect(() => {
    if (!messages) return;

    const newNodes: Node[] = [];
    let xOffset = 100;
    let yOffset = 100;
    const rowGap = 750;
    const colGap = 500;
    const itemsPerRow = 3;

    let rowIndex = 0;
    let imageCount = 0;

    messages.forEach((msg: any) => {
      // 1. Process Generation Groups (Versions)
      msg.generationGroups?.forEach((group: any) => {
        let groupItemCount = 0;

        group.items?.forEach((item: any) => {
          const mediaUrl = item.filePath || item.url;
          if (
            (item.type === "image" ||
              item.type?.startsWith("image/") ||
              item.type === "video" ||
              item.type?.startsWith("video/")) &&
            mediaUrl
          ) {
            const nodeId = `node-${item.id || mediaUrl}`;

            // Check if node already exists in the current state to preserve its position
            const existingNode = nodes.find((n) => n.id === nodeId);

            if (!newNodes.find((n) => n.id === nodeId)) {
              const cleanTitle = (item.name || group.title || "Design")
                .replace(/^(image|variant|design)-/i, "")
                .trim();

              newNodes.push({
                id: nodeId,
                type: "design",
                selected:
                  item.id === focusedGenerationId ||
                  mediaUrl === focusedGenerationId,
                position: existingNode?.position || {
                  x: xOffset + (groupItemCount % itemsPerRow) * colGap,
                  y: yOffset + rowIndex * rowGap,
                },
                data: {
                  url: mediaUrl,
                  type: item.type,
                  title: `v${rowIndex + 1} - ${cleanTitle}`,
                  instruction: item.name || group.title || "AI Generation",
                  status: "public",
                  generationGroupId: group.id,
                },
              });
              groupItemCount++;
              imageCount++;
            }
          }
        });

        // After completing a group, increment row index for the next version
        if (groupItemCount > 0) {
          rowIndex++;
        }
      });
    });

    // Agent results are available immediately and may not exist in legacy
    // message generation groups until the project is refreshed.
    runs.forEach((run) => {
      run.toolCalls.forEach((call) => {
        if (call.render !== "generated_design" || !call.result?.ok) return;
        const item = call.result.data as any;
        const mediaUrl = item?.url || item?.filePath;
        if (!mediaUrl) return;
        const itemId = item.id || mediaUrl;
        const nodeId = `node-${itemId}`;
        if (newNodes.some((node) => node.id === nodeId)) return;
        const existingNode = nodes.find((node) => node.id === nodeId);
        newNodes.push({
          id: nodeId,
          type: "design",
          selected:
            itemId === focusedGenerationId || mediaUrl === focusedGenerationId,
          position: existingNode?.position || {
            x: xOffset + (imageCount % itemsPerRow) * colGap,
            y: yOffset + rowIndex * rowGap,
          },
          data: {
            url: mediaUrl,
            type:
              item.type ||
              (mediaUrl.endsWith(".mp4") ? "video/mp4" : "image/png"),
            title: item.name || "Generated design",
            instruction: item.prompt || item.message || "AI Generation",
            status: "public",
            generationGroupId: item.generationGroupId,
          },
        });
        imageCount++;
      });
    });

    // 2. Merge live nodes (newest version being generated)
    if (liveNodes.length > 0) {
      let liveGroupCount = 0;
      liveNodes.forEach((live) => {
        const nodeId = `node-${live.id}`;
        const existingNode = nodes.find((n) => n.id === nodeId);

        if (!newNodes.find((n) => n.id === nodeId)) {
          newNodes.push({
            id: nodeId,
            type: "design",
            position: existingNode?.position || {
              x: xOffset + (liveGroupCount % itemsPerRow) * colGap,
              y: yOffset + rowIndex * rowGap,
            },
            data: {
              url: live.filePath,
              type:
                live.name?.toLowerCase().includes("video") ||
                live.filePath?.toLowerCase().endsWith(".mp4")
                  ? "video/mp4"
                  : "image/png",
              title: `Live - ${live.name.replace(/^(genit-design-|image|variant)-/i, "")}`,
              instruction: live.prompt || "Generating...",
              status: "public",
            },
          });
          liveGroupCount++;
          imageCount++;
        }
      });
    }

    // Only update if nodes list has changed (by ID) or selection changed
    const hasIdChanges =
      JSON.stringify(newNodes.map((n) => n.id)) !==
      JSON.stringify(nodes.map((n) => n.id));
    const hasSelectionChanges = newNodes.some(
      (n, i) => n.selected !== nodes[i]?.selected
    );

    if (hasIdChanges || hasSelectionChanges) {
      setNodes(newNodes);
    }
  }, [messages, runs, liveNodes, setNodes, nodes.length, focusedGenerationId]);

  // Handle focusing on the set generation
  useEffect(() => {
    if (focusedGenerationId && nodes.length > 0) {
      const nodeId = `node-${focusedGenerationId}`;
      let targetNode = nodes.find((n) => n.id === nodeId);

      // Fallback: search by matching the file URL or matching the ID directly
      if (!targetNode) {
        targetNode = nodes.find(
          (n) =>
            n.data?.url === focusedGenerationId || n.id === focusedGenerationId
        );
      }

      if (targetNode) {
        fitView({
          nodes: [{ id: targetNode.id }],
          duration: 800,
          padding: 0.5,
        });
      }
    }
  }, [focusedGenerationId, nodes, fitView]);

  // Handle fitView after generation finishes
  useEffect(() => {
    const isWorking = isGenerating || isGeneratingImage;
    if (!isWorking && nodes.length > 0) {
      // Small timeout to ensure last node is fully rendered before fitting
      const timer = setTimeout(() => {
        fitView({ duration: 800, padding: 0.2 });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, isGeneratingImage, nodes.length, fitView]);

  return (
    <div className='bg-background relative flex h-full w-full flex-col overflow-hidden'>
      {/* ── Header with Title & Toolbar (side-by-side) ──────────────── */}
      <div className='border-border/80 bg-background/50 z-10 flex shrink-0 items-center justify-between border-b px-4 py-1 backdrop-blur-sm'>
        <div className='text-foreground flex items-center gap-2'>
          <div className='flex items-center space-x-1.5 px-2'>
            <span className='h-2 w-2 rounded-full bg-red-400' />
            <span className='h-2 w-2 rounded-full bg-yellow-400' />
            <span className='h-2 w-2 rounded-full bg-green-400' />
          </div>

          <span className='text-sm font-semibold'>
            <LocalizedText text={"Design Studio"} />
          </span>
        </div>

        {/* Toolbar items at the far right */}
        <div className='bg-background/80 border-border flex items-center space-x-1 rounded-md border p-1 shadow-sm backdrop-blur-sm'>
          {/* Fullscreen Toggle */}

          {/* Zoom In */}
          <Button
            variant='ghost'
            size='sm'
            onClick={() => reactFlowInstance?.zoomIn({ duration: 200 })}
            className='text-muted-foreground hover:text-foreground h-7 w-7 rounded-md p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            title='Zoom In'
          >
            <Plus className='h-3.5 w-3.5' />
          </Button>

          {/* Zoom Out */}
          <Button
            variant='ghost'
            size='sm'
            onClick={() => reactFlowInstance?.zoomOut({ duration: 200 })}
            className='text-muted-foreground hover:text-foreground h-7 w-7 rounded-md p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            title='Zoom Out'
          >
            <Minus className='h-3.5 w-3.5' />
          </Button>
          {/* Fit View */}
          <Button
            variant='ghost'
            size='sm'
            onClick={() =>
              reactFlowInstance?.fitView({ duration: 400, padding: 0.2 })
            }
            className='text-muted-foreground hover:text-foreground h-7 w-7 rounded-md p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            title='Fit View'
          >
            <View className='h-3.5 w-3.5' />
          </Button>
          {onToggleFullscreen && (
            <>
              <Button
                variant='ghost'
                size='sm'
                onClick={onToggleFullscreen}
                className={cn(
                  "text-muted-foreground hover:text-foreground h-7 w-7 rounded-md p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  isFullscreen && "bg-muted text-foreground"
                )}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className='h-3.5 w-3.5' />
                ) : (
                  <Maximize2 className='h-3.5 w-3.5' />
                )}
              </Button>
              <div className='bg-border mx-1 h-5 w-px' />
            </>
          )}
        </div>
      </div>

      <div className='relative min-h-0 w-full flex-1'>
        <ReactFlow
          proOptions={{ hideAttribution: true }}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onInit={setReactFlowInstance}
          fitView={!focusedGenerationId}
          fitViewOptions={{ padding: 0.2 }}
          maxZoom={1.5}
          minZoom={0.1}
          className='h-full w-full bg-transparent'
        >
          <Background
            gap={25}
            size={1}
            // className='opacity-[0.4] dark:opacity-[0.15]'
            color='currentColor'
          />

          {nodes.length === 0 && (
            <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
              <div className='text-foreground space-y-2 text-center opacity-20 select-none'>
                <LayoutGrid className='mx-auto h-12 w-12 text-neutral-200 dark:text-neutral-900' />
                <p className='text-sm font-medium tracking-[0.2em] text-neutral-200 uppercase dark:text-neutral-900'>
                  <LocalizedText text={"genit Workspace"} />
                </p>
                <p className='text-xs text-neutral-200 dark:text-neutral-900'>
                  <LocalizedText
                    text={"Project files will appear here if any"}
                  />
                </p>
              </div>
            </div>
          )}
          {/* Loading State Overlay */}
        </ReactFlow>
        {(isGenerating || isGeneratingImage) && (
          <div className='absolute inset-0 z-50 rounded-b-3xl border border-white/10 bg-white/5 backdrop-blur-2xl dark:bg-black/10'>
            {/* subtle light gradient for glass depth */}
            <div className='pointer-events-none absolute inset-0 rounded-b-3xl bg-gradient-to-br from-white/10 to-transparent' />

            <div className='flex h-full w-full items-center justify-center'>
              <div className='flex flex-col items-center gap-4'>
                <LoadingFileLoader size={20} />

                <div className='flex flex-col items-center gap-1.5 px-2'>
                  <p className='text-[11px] font-bold tracking-[0.2em] text-black uppercase dark:text-white/80'>
                    <LocalizedText text={"Agent Thinking"} />
                  </p>

                  <p className='text-center text-[9px] leading-relaxed text-black italic dark:text-white/60'>
                    {aiStatus || "Crafting unique design concepts..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
