"use client";

import { Handle, Position } from "reactflow";
import { Database, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DatabaseNodeData {
  url?: string;
  title?: string;
  description?: string;
  dbType?: string;
  tables?: number;
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
  } = nodeData;

  return (
    <div
      className={`bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 w-80 ${selected ? "ring-2 ring-primary" : ""}`}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3" />

      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <Database className="w-5 h-5 text-purple-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-sm truncate">{title}</h3>
            <Badge
              variant="secondary"
              className="text-xs bg-purple-50 text-purple-700"
            >
              {dbType}
            </Badge>
          </div>

          {tables > 0 && (
            <div className="text-xs text-muted-foreground mb-2">
              {tables} tables
            </div>
          )}

          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>

          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs h-7 bg-transparent"
            onClick={() => console.log("[v0] Connect to database")}
          >
            <Server className="w-3 h-3 mr-1" />
            Connect
          </Button>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
}
