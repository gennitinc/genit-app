"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeTypes,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { useProjectDesign } from "@/context/DesignProject";
import { DesignNode } from "@/nodes/design-node";
import {
  Maximize2,
  Plus,
  Minus,
  MousePointer2,
  Move,
  LayoutGrid,
  Undo2,
  Redo2,
} from "lucide-react";
import { Button } from "../ui/button";
import { LoadingFileLoader } from "@/utils/Loading";

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
      (n, i) => n.selected !== nodes[i]?.selected,
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
    <div className="h-full relative group">
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
        className="dark:bg-[#fafafa] bg-[#09090b] shadow-xl border border-zinc-200 dark:border-zinc-800/50 rounded-3xl"
      >
        <Background
          gap={25}
          size={1}
          className="dark:opacity-[0.15] opacity-[0.4]"
          color="currentColor"
        />

        {/* Floating Toolkit: Glassmorphic refinement to match Workflow */}
        <Panel
          position="top-right"
          className="flex items-center gap-1.5 p-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl m-6"
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
          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="Fit View"
            onClick={() =>
              reactFlowInstance?.fitView({ duration: 400, padding: 0.2 })
            }
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="Zoom In"
            onClick={() => reactFlowInstance?.zoomIn({ duration: 200 })}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="Zoom Out"
            onClick={() => reactFlowInstance?.zoomOut({ duration: 200 })}
          >
            <Minus className="h-4 w-4" />
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

        {nodes.length === 0 && (
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
        )}
        {/* Loading State Overlay */}
      </ReactFlow>
      {(isGenerating || isGeneratingImage) && (
        <div
          className="absolute inset-0 z-50 rounded-3xl
    bg-white/5 dark:bg-black/10
    backdrop-blur-2xl
    border border-white/10"
        >
          {/* subtle light gradient for glass depth */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <LoadingFileLoader />

              <div className="flex flex-col items-center gap-1.5 px-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 dark:text-black">
                  Agent Thinking
                </p>

                <p className="text-[9px] text-white/60 dark:text-black italic text-center leading-relaxed">
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
