"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, Server, X } from "lucide-react";
import { Handle, Position } from "reactflow";

interface DatabaseNodeData {
  url?: string;
  title?: string;
  description?: string;
  dbType?: string;
  tables?: number;
  onRemoveNode?: (nodeId: string) => void;
  nodeId?: string;
}

interface DatabaseNodeProps {
  data: DatabaseNodeData | null;
  selected?: boolean;
}

export function DatabaseNode({ data, selected }: DatabaseNodeProps) {
  const nodeData = data || {};
  const {
    url = "",
    title = "Database",
    description = "Data source",
    dbType = "SQL",
    tables = 0,
    onRemoveNode,
    nodeId,
  } = nodeData;

  return (
    <div
      className={`bg-card border-border w-80 rounded-[1.5rem] border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${selected ? "ring-primary ring-2" : ""}`}
    >
      <Handle type='target' position={Position.Left} className='h-3 w-3' />

      {/* Remove Button */}
      {onRemoveNode && nodeId && (
        <button
          onClick={() => onRemoveNode?.(nodeId as string)}
          className='absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-lg transition-colors duration-200 hover:bg-red-600'
          title='Remove node'
        >
          <X className='h-3 w-3' />
        </button>
      )}

      <div className='flex items-start space-x-3'>
        <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/10'>
          <Database className='h-5 w-5 text-purple-600' />
        </div>

        <div className='min-w-0 flex-1'>
          <div className='mb-2 flex items-center space-x-2'>
            <h3 className='truncate text-sm font-semibold'>{title}</h3>
            <Badge
              variant='secondary'
              className='bg-purple-50 text-xs text-purple-700'
            >
              {dbType}
            </Badge>
          </div>

          {tables > 0 && (
            <div className='text-muted-foreground mb-2 text-xs'>
              {tables} tables
            </div>
          )}

          <p className='text-muted-foreground mb-3 line-clamp-2 text-xs'>
            {description}
          </p>

          <Button
            size='sm'
            variant='outline'
            className='h-7 w-full bg-transparent text-xs'
            onClick={() => console.log("[v0] Connect to database")}
          >
            <Server className='mr-1 h-3 w-3' />
            Connect
          </Button>
        </div>
      </div>

      <Handle type='source' position={Position.Right} className='h-3 w-3' />
    </div>
  );
}
