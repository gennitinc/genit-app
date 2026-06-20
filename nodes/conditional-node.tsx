"use client";

import { Button } from "@/components/ui/button";
import type { NodeData } from "@/lib/types";
import { GitBranch, Trash2, X } from "lucide-react";
import { Handle, type NodeProps, NodeResizer, Position } from "reactflow";
import { memo } from "react";

interface ExtendedNodeData extends NodeData {
  onRemoveNode?: (nodeId: string) => void;
  nodeId?: string;
}

export const ConditionalNode = memo(
  ({ data, isConnectable, selected }: NodeProps<ExtendedNodeData>) => {
    return (
      <div className='relative rounded-[1.5rem]'>
        <NodeResizer
          color='#3b82f6'
          isVisible={selected}
          minWidth={150}
          minHeight={80}
          handleClassName='w-3 h-3 bg-indigo-600 hover:bg-indigo-700 border-2 border-white rounded shadow-lg'
        />

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
        <div
          className={`bg-card border-border relative min-h-[80px] w-80 min-w-[150px] rounded-lg border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
            selected
              ? "ring-primary ring-2 ring-offset-2"
              : "hover:ring-primary/50 hover:ring-1"
          }`}
        >
          <div className='flex items-center'>
            <div className='text-primary flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700/10'>
              <GitBranch className='h-4 w-4' />
            </div>
            <div className='ml-2'>
              <div className='text-foreground text-sm font-bold'>
                {data.label || "Condition"}
              </div>
              <div className='text-muted-foreground text-xs'>
                {data.description || "Conditional logic node"}
              </div>
            </div>
          </div>

          {data.condition && (
            <div className='bg-muted text-muted-foreground mt-2 rounded p-1 text-xs'>
              Condition: {data.condition}
            </div>
          )}

          {/* Delete Button - Only show when selected */}
          {selected && data.onRemoveNode && data.nodeId && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => data.onRemoveNode!(data.nodeId!)}
              className='bg-destructive hover:bg-destructive/90 absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 text-white shadow-lg transition-all duration-200 hover:shadow-xl'
              title='Delete Node'
            >
              <Trash2 className='h-3 w-3' />
            </Button>
          )}

          <Handle
            type='target'
            position={Position.Top}
            isConnectable={isConnectable}
            className='h-3 w-3 bg-indigo-600 hover:bg-indigo-700'
          />
          <Handle
            type='source'
            position={Position.Bottom}
            id='true'
            isConnectable={isConnectable}
            className='h-3 w-3 bg-green-500'
          />
          <Handle
            type='source'
            position={Position.Right}
            id='false'
            isConnectable={isConnectable}
            className='h-3 w-3 bg-red-500'
          />
        </div>
      </div>
    );
  }
);

ConditionalNode.displayName = "ConditionalNode";
