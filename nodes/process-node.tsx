"use client";

import type { NodeData } from "@/lib/types";
import { Settings, X } from "lucide-react";
import { Handle, type NodeProps, Position } from "reactflow";
import { memo } from "react";

interface ExtendedNodeData extends NodeData {
  onRemoveNode?: (nodeId: string) => void;
  nodeId?: string;
}

export const ProcessNode = memo(
  ({ data, isConnectable }: NodeProps<ExtendedNodeData>) => {
    return (
      <div className='bg-card border-border relative min-h-[80px] w-80 min-w-[150px] rounded-[1.5rem] border p-4 shadow-sm'>
        {/* Remove Button */}
        {data.onRemoveNode && data.nodeId && (
          <button
            onClick={() => data.onRemoveNode?.(data.nodeId as string)}
            className='absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-lg transition-colors duration-200 hover:bg-red-600'
            title='Remove node'
          >
            <X className='h-3 w-3' />
          </button>
        )}
        <div className='flex items-center'>
          <div className='text-primary flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700/10'>
            <Settings className='h-4 w-4' />
          </div>
          <div className='ml-2'>
            <div className='text-foreground text-sm font-bold'>
              {data.label || "Process"}
            </div>
            <div className='text-muted-foreground text-xs'>
              {data.description || "Data processing node"}
            </div>
          </div>
        </div>

        {data.processType && (
          <div className='bg-muted text-muted-foreground mt-2 rounded p-1 text-xs'>
            Type: {data.processType}
          </div>
        )}

        <Handle
          type='target'
          position={Position.Left}
          isConnectable={isConnectable}
        />
        <Handle
          type='source'
          position={Position.Right}
          isConnectable={isConnectable}
        />
      </div>
    );
  }
);

ProcessNode.displayName = "ProcessNode";
