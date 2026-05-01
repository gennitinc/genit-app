"use client";

import { Button } from "../ui/button";
import { useProjectDesign } from "@/context/DesignProject";
import { DesignNode } from "@/nodes/design-node";
import { LoadingFileLoader } from "@/utils/Loading";
import {
  LayoutGrid,
  Maximize2,
  Minus,
  MousePointer2,
  Move,
  Plus,
  Redo2,
  Undo2,
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

export const GraphicsCanvas = () => {
  return (
    <ReactFlowProvider>
      <GraphicsCanvasContent />
    </ReactFlowProvider>
  );
};

const GraphicsCanvasContent = () => {
  const {
    project,
    messages,
    focusedGenerationId,
    liveNodes,
    isGenerating,
    isGeneratingImage,
    aiStatus,
  } = useProjectDesign();
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
          if (
            (item.type === "image" || item.type?.startsWith("image/")) &&
            item.filePath
          ) {
            const nodeId = `node-${item.id || item.filePath}`;

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
                  item.filePath === focusedGenerationId,
                position: existingNode?.position || {
                  x: xOffset + (groupItemCount % itemsPerRow) * colGap,
                  y: yOffset + rowIndex * rowGap,
                },
                data: {
                  url: item.filePath,
                  title: `${cleanTitle} (v${rowIndex + 1})`,
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
              title: `${live.name.replace(/^(gennit-design-|image|variant)-/i, "")} (Live)`,
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
  }, [messages, liveNodes, setNodes, nodes.length, focusedGenerationId]);

  // Handle focusing on the set generation
  useEffect(() => {
    if (focusedGenerationId && nodes.length > 0) {
      const nodeId = `node-${focusedGenerationId}`;
      const exists = nodes.find((n) => n.id === nodeId);
      if (exists) {
        fitView({ nodes: [{ id: nodeId }], duration: 800, padding: 0.5 });
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
    <div className='group relative h-full'>
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
        className='rounded-3xl border border-zinc-200 bg-[#09090b] shadow-xl dark:border-zinc-800/50 dark:bg-[#fafafa]'
      >
        <Background
          gap={25}
          size={1}
          className='opacity-[0.4] dark:opacity-[0.15]'
          color='currentColor'
        />

        {/* Floating Toolkit: Glassmorphic refinement to match Workflow */}
        <Panel
          position='top-right'
          className='m-6 flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white/90 p-1.5 shadow-2xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90'
        >
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-50 cursor-not-allowed"
            title="Undo (Not implemented)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-50 cursor-not-allowed"
            title="Redo (Not implemented)"
          >
            <Redo2 className="h-4 w-4" />
          </Button> */}
          <div className='mx-1 h-4 w-px bg-zinc-200 dark:bg-zinc-800' />
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            title='Fit View'
            onClick={() =>
              reactFlowInstance?.fitView({ duration: 400, padding: 0.2 })
            }
          >
            <Maximize2 className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            title='Zoom In'
            onClick={() => reactFlowInstance?.zoomIn({ duration: 200 })}
          >
            <Plus className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            title='Zoom Out'
            onClick={() => reactFlowInstance?.zoomOut({ duration: 200 })}
          >
            <Minus className='h-4 w-4' />
          </Button>
        </Panel>

        {/* { (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-2 opacity-20 select-none text-foreground">
              <LayoutGrid className="w-12 h-12 mx-auto text-neutral-200 dark:text-neutral-900" />
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-200 dark:text-neutral-900">
                Design Workspace
              </p>
              <p className="text-xs text-neutral-200 dark:text-neutral-900">
                Generated designs will appear here
              </p>
            </div>
          </div>
        )} */}

        {nodes.length === 0 &&  (
          <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
            <div className='text-foreground space-y-2 text-center opacity-20 select-none'>
              <LayoutGrid className='mx-auto h-12 w-12 text-neutral-200 dark:text-neutral-900' />
              <p className='text-sm font-medium tracking-[0.2em] text-neutral-200 uppercase dark:text-neutral-900'>
                Design Workspace
              </p>
              <p className='text-xs text-neutral-200 dark:text-neutral-900'>
                Generated designs will appear here
              </p>
            </div>
          </div>
        )}
        {/* Loading State Overlay */}
      </ReactFlow>
      {(isGenerating || isGeneratingImage) && (
        <div className='absolute inset-0 z-50 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl dark:bg-black/10'>
          {/* subtle light gradient for glass depth */}
          <div className='pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent' />

          <div className='flex h-full w-full items-center justify-center'>
            <div className='flex flex-col items-center gap-4'>
              <LoadingFileLoader />

              <div className='flex flex-col items-center gap-1.5 px-2'>
                <p className='text-[11px] font-bold tracking-[0.2em] text-white/80 uppercase dark:text-black'>
                  Agent Thinking
                </p>

                <p className='text-center text-[9px] leading-relaxed text-white/60 italic dark:text-black'>
                  {aiStatus || "Crafting unique design concepts..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
