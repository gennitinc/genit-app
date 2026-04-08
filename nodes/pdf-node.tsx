"use client";

import { Handle, Position, NodeResizer, type NodeProps } from "reactflow";
import { FileText, Download, X, Sparkles, Loader2, MessageSquare, ListCheck, Search, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface PDFNodeData {
  url?: string;
  title?: string;
  description?: string;
  pages?: number;
  size?: string;
  onRemoveNode?: (nodeId: string) => void;
  onAnalyze?: () => void;
  nodeId?: string;
  analyzed?: boolean;
  analysis?: {
    summary?: string;
    description?: string;
    tags?: string[];
  };
}

export function PDFNode({ data, selected }: NodeProps<PDFNodeData>) {
  const {
    url = "",
    title = "PDF Document",
    description = "Document content",
    pages = 0,
    size = "",
    onRemoveNode,
    onAnalyze,
    nodeId,
    analyzed = false,
    analysis = null,
  } = data;

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="relative rounded-[1.5rem]">
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
        <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 border-2 border-white" />

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
            <div className="flex items-center justify-between mb-2 gap-2">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{title}</h3>
                <Badge
                  variant="secondary"
                  className="text-[10px] h-4 px-1 bg-red-50 text-red-700"
                >
                  PDF
                </Badge>
              </div>
              <div className="flex items-center space-x-1">
                {!analyzed && onAnalyze && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async (e) => {
                      e.stopPropagation();
                      setIsAnalyzing(true);
                      try {
                        await onAnalyze();
                      } finally {
                        setIsAnalyzing(false);
                      }
                    }}
                    disabled={isAnalyzing}
                    className="h-7 px-2 text-[10px] gap-1 borber-primary/20 bg-primary/5 text-primary"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    Analyze
                  </Button>
                )}
                {analyzed && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-[9px] font-medium">
                    <ListCheck className="w-2.5 h-2.5" />
                    Analyzed
                  </div>
                )}
              </div>
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

            {analyzed && analysis && (
              <div className="mt-4 space-y-3 pt-3 border-t border-border/50">
                {analysis.summary && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
                      <MessageSquare className="w-3 h-3" />
                      AI Summary
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic bg-muted/30 p-2 rounded-lg border border-border/30">
                      "{analysis.summary}"
                    </p>
                  </div>
                )}
                
                {analysis.description && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
                      <Search className="w-3 h-3" />
                      Key Insights
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed bg-black/5 dark:bg-white/5 p-2 rounded-md">
                      {analysis.description}
                    </p>
                  </div>
                )}

                {analysis.tags && analysis.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.tags.slice(0, 5).map((tag, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-muted text-[9px] text-muted-foreground border border-border/50">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-white" />
      </div>
    </div>
  );
}
