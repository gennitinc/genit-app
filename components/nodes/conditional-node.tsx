"use client";

import { memo } from "react";
import { Handle, Position, NodeResizer, type NodeProps } from "reactflow";
import { GitBranch, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NodeData } from "@/lib/types";

interface ExtendedNodeData extends NodeData {
  onRemoveNode?: (nodeId: string) => void;
  nodeId?: string;
}

export const ConditionalNode = memo(
  ({ data, isConnectable, selected }: NodeProps<ExtendedNodeData>) => {
    return (
      <>
        <NodeResizer
          color="#3b82f6"
          isVisible={selected}
          minWidth={150}
          minHeight={80}
          handleClassName="w-3 h-3 bg-primary border-2 border-white rounded shadow-lg"
        />
        <div
          className={`bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 w-80 min-w-[150px] min-h-[80px] relative ${
            selected
              ? "ring-2 ring-primary ring-offset-2"
              : "hover:ring-1 hover:ring-primary/50"
          }`}
        >
          <div className="flex items-center">
            <div className="rounded-full w-8 h-8 flex items-center justify-center bg-primary/10 text-primary">
              <GitBranch className="h-4 w-4" />
            </div>
            <div className="ml-2">
              <div className="text-sm font-bold text-foreground">
                {data.label || "Condition"}
              </div>
              <div className="text-xs text-muted-foreground">
                {data.description || "Conditional logic node"}
              </div>
            </div>
          </div>

          {data.condition && (
            <div className="mt-2 text-xs bg-muted p-1 rounded text-muted-foreground">
              Condition: {data.condition}
            </div>
          )}

          {/* Delete Button - Only show when selected */}
          {selected && data.onRemoveNode && data.nodeId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => data.onRemoveNode!(data.nodeId!)}
              className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full bg-destructive hover:bg-destructive/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              title="Delete Node"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}

          <Handle
            type="target"
            position={Position.Top}
            isConnectable={isConnectable}
            className="w-3 h-3 bg-primary"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            isConnectable={isConnectable}
            className="w-3 h-3 bg-green-500"
          />
          <Handle
            type="source"
            position={Position.Right}
            id="false"
            isConnectable={isConnectable}
            className="w-3 h-3 bg-red-500"
          />
        </div>
      </>
    );
  }
);

ConditionalNode.displayName = "ConditionalNode";
