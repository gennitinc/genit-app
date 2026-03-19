"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Settings, X } from "lucide-react";
import type { NodeData } from "@/lib/types";

interface ExtendedNodeData extends NodeData {
  onRemoveNode?: (nodeId: string) => void;
  nodeId?: string;
}

export const ProcessNode = memo(
  ({ data, isConnectable }: NodeProps<ExtendedNodeData>) => {
    return (
      <div className="relative rounded-[1.5rem] bg-card border border-border shadow-sm p-4 w-80 min-w-[150px] min-h-[80px]">
        {/* Remove Button */}
        {data.onRemoveNode && data.nodeId && (
          <button
            onClick={() => data.onRemoveNode?.(data.nodeId as string)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors duration-200 shadow-lg z-10"
            title="Remove node"
          >
            <X className="w-3 h-3" />
          </button>
        )}
        <div className="flex items-center">
          <div className="rounded-full w-8 h-8 flex items-center justify-center bg-primary/10 text-primary">
            <Settings className="h-4 w-4" />
          </div>
          <div className="ml-2">
            <div className="text-sm font-bold text-foreground">
              {data.label || "Process"}
            </div>
            <div className="text-xs text-muted-foreground">
              {data.description || "Data processing node"}
            </div>
          </div>
        </div>

        {data.processType && (
          <div className="mt-2 text-xs bg-muted p-1 rounded text-muted-foreground">
            Type: {data.processType}
          </div>
        )}

        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
        />
      </div>
    );
  },
);

ProcessNode.displayName = "ProcessNode";
