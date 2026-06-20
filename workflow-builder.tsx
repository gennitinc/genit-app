"use client";

import NodeLibrary from "./node-library";
import { CodeNode } from "./nodes/code-node";
import { ConditionalNode } from "./nodes/conditional-node";
import { InputNode } from "./nodes/input-node";
import { OutputNode } from "./nodes/output-node";
import { ProcessNode } from "./nodes/process-node";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import type { WorkflowNode } from "@/lib/types";
import { createNode, generateNodeId } from "@/lib/workflow-utils";
import { Play, Save, Upload } from "lucide-react";
import ReactFlow, {
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeTypes,
  MiniMap,
  type Node,
  type NodeTypes,
  Panel,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import type React from "react";
import { useCallback, useRef, useState } from "react";

const nodeTypes: NodeTypes = {
  input: InputNode,
  output: OutputNode,
  process: ProcessNode,
  conditional: ConditionalNode,
  code: CodeNode,
};

export default function WorkflowBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) => addEdge({ ...params, type: "custom" }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // Check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      if (reactFlowBounds && reactFlowInstance) {
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const newNode = createNode({
          type,
          position,
          id: generateNodeId(type),
        });

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeData = useCallback(
    (nodeId: string, data: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...data,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const saveWorkflow = () => {
    if (nodes.length === 0) {
      toast({
        title: "Nothing to save",
        description: "Add some nodes to your workflow first",
        variant: "destructive",
      });
      return;
    }

    const workflow = {
      nodes,
      edges,
    };

    const workflowString = JSON.stringify(workflow);
    localStorage.setItem("workflow", workflowString);

    toast({
      title: "Workflow saved",
      description: "Your workflow has been saved successfully",
    });
  };

  const loadWorkflow = () => {
    const savedWorkflow = localStorage.getItem("workflow");

    if (!savedWorkflow) {
      toast({
        title: "No saved workflow",
        description: "There is no workflow saved in your browser",
        variant: "destructive",
      });
      return;
    }

    try {
      const { nodes: savedNodes, edges: savedEdges } =
        JSON.parse(savedWorkflow);
      setNodes(savedNodes);
      setEdges(savedEdges);
      toast({
        title: "Workflow loaded",
        description: "Your workflow has been loaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error loading workflow",
        description: "There was an error loading your workflow",
        variant: "destructive",
      });
    }
  };

  const executeWorkflow = () => {
    if (nodes.length === 0) {
      toast({
        title: "Nothing to execute",
        description: "Add some nodes to your workflow first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Executing workflow",
      description:
        "Your workflow is being executed (simulation only in this MVP)",
    });

    // In a real implementation, we would traverse the graph and execute each node
    // For the MVP, we'll just simulate execution with a success message
    setTimeout(() => {
      toast({
        title: "Workflow executed",
        description: "Your workflow has been executed successfully",
      });
    }, 2000);
  };

  return (
    <div className='flex h-screen'>
      <div className='w-64 border-r border-gray-200 bg-gray-50 p-4'>
        <h2 className='mb-4 text-lg font-semibold'>Node Library</h2>
        <NodeLibrary />
      </div>

      <div className='flex flex-1 flex-col'>
        <div className='flex-1' ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              fitView
              snapToGrid
              snapGrid={[15, 15]}
              defaultEdgeOptions={{ type: "custom" }}
            >
              <Background />
              <Controls />
              <MiniMap />
              <Panel position='top-right'>
                <div className='flex gap-2'>
                  <Button onClick={saveWorkflow} size='sm' variant='outline'>
                    <Save className='mr-2 h-4 w-4' />
                    Save
                  </Button>
                  <Button onClick={loadWorkflow} size='sm' variant='outline'>
                    <Upload className='mr-2 h-4 w-4' />
                    Load
                  </Button>
                  <Button onClick={executeWorkflow} size='sm' variant='default'>
                    <Play className='mr-2 h-4 w-4' />
                    Execute
                  </Button>
                </div>
              </Panel>
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
}
