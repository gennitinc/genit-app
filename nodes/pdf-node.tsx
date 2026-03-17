"use client";

import { Handle, Position, NodeResizer, type NodeProps } from "reactflow";
import { FileText, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PDFNodeData {
  url?: string;
  title?: string;
  description?: string;
  pages?: number;
  size?: string;
  onRemoveNode?: (nodeId: string) => void;
  nodeId?: string;
}

export function PDFNode({ data, selected }: NodeProps<PDFNodeData>) {
  const {
    url = "",
    title = "PDF Document",
    description = "Document content",
    pages = 0,
    size = "",
    onRemoveNode,
    nodeId,
  } = data;

  return (
    <>
      <NodeResizer
        color="#ef4444"
        isVisible={selected}
        minWidth={320}
        minHeight={120}
        handleClassName="w-2 h-2 bg-red-500 border border-white rounded"
      />
      <div
        className={`relative bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 w-80 min-w-[320px] min-h-[120px] ${selected ? "ring-2 ring-primary" : ""}`}
      >
        <Handle type="target" position={Position.Left} className="w-3 h-3" />

        {/* Remove Button */}
        {onRemoveNode && nodeId && (
          <button
            onClick={() => onRemoveNode(nodeId)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors duration-200 shadow-lg z-10"
            title="Remove node"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-red-600" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-sm truncate">{title}</h3>
              <Badge
                variant="secondary"
                className="text-xs bg-red-50 text-red-700"
              >
                PDF
              </Badge>
            </div>

            <div className="flex items-center space-x-3 text-xs text-muted-foreground mb-2">
              {pages > 0 && <span>{pages} pages</span>}
              {size && <span>{size}</span>}
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {description}
            </p>

            {url && (
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs h-7 bg-transparent"
                onClick={() => window.open(url, "_blank")}
              >
                <Download className="w-3 h-3 mr-1" />
                Download PDF
              </Button>
            )}
          </div>
        </div>

        <Handle type="source" position={Position.Right} className="w-3 h-3" />
      </div>
    </>
  );
}
