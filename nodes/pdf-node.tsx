"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CircleFadingArrowUp,
  Download,
  Edit3,
  FileText,
  ListCheck,
  Loader2,
  MessageSquare,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Handle, type NodeProps, NodeResizer, Position } from "reactflow";
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
    <div className='relative rounded-[1.5rem]'>
      <NodeResizer
        color='#ef4444'
        isVisible={selected}
        minWidth={320}
        minHeight={120}
        handleClassName='w-2 h-2 bg-red-500 border border-white rounded'
      />
      <div
        className={`bg-card border-border relative min-h-[120px] w-80 min-w-[320px] rounded-lg border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${selected ? "ring-primary ring-2" : ""}`}
      >
        <Handle
          type='target'
          position={Position.Left}
          className='h-3 w-3 border-2 border-white bg-blue-500'
        />

        {/* Remove Button */}
        {onRemoveNode && nodeId && (
          <button
            onClick={() => onRemoveNode(nodeId)}
            className='absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-lg transition-colors duration-200 hover:bg-red-600'
            title='Remove node'
          >
            <X className='h-3 w-3' />
          </button>
        )}

        <div className='flex items-start space-x-3'>
          <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/10'>
            <FileText className='h-5 w-5 text-red-600' />
          </div>

          <div className='min-w-0 flex-1'>
            <div className='mb-2 flex items-center justify-between gap-2'>
              <div className='flex min-w-0 flex-1 items-center space-x-2'>
                <h3 className='truncate text-sm font-semibold'>{title}</h3>
                <Badge
                  variant='secondary'
                  className='h-4 bg-red-50 px-1 text-[10px] text-red-700'
                >
                  PDF
                </Badge>
              </div>
              <div className='flex items-center space-x-1'>
                {!analyzed && onAnalyze && (
                  <Button
                    variant='outline'
                    size='sm'
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
                    className='borber-primary/20 text-primary h-7 gap-1 bg-indigo-600 px-2 text-[10px] hover:bg-indigo-700/5'
                  >
                    {isAnalyzing ? (
                      <Loader2 className='h-3 w-3 animate-spin' />
                    ) : (
                      <Sparkles className='h-3 w-3' />
                    )}
                    Analyze
                  </Button>
                )}
                {analyzed && (
                  <div className='flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-1.5 py-0.5 text-[9px] font-medium text-green-600'>
                    <ListCheck className='h-2.5 w-2.5' />
                    Analyzed
                  </div>
                )}
              </div>
            </div>

            <div className='text-muted-foreground mb-2 flex items-center space-x-3 text-xs'>
              {pages > 0 && <span>{pages} pages</span>}
              {size && <span>{size}</span>}
            </div>

            <p className='text-muted-foreground mb-3 line-clamp-2 text-xs'>
              {description}
            </p>

            {url && (
              <Button
                size='sm'
                variant='outline'
                className='h-7 w-full bg-transparent text-xs'
                onClick={() => window.open(url, "_blank")}
              >
                <Download className='mr-1 h-3 w-3' />
                Download PDF
              </Button>
            )}

            {analyzed && analysis && (
              <div className='border-border/50 mt-4 space-y-3 border-t pt-3'>
                {analysis.summary && (
                  <div className='space-y-1'>
                    <div className='text-primary flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase'>
                      <MessageSquare className='h-3 w-3' />
                      AI Summary
                    </div>
                    <p className='text-muted-foreground bg-muted/30 border-border/30 rounded-lg border p-2 text-xs leading-relaxed italic'>
                      "{analysis.summary}"
                    </p>
                  </div>
                )}

                {analysis.description && (
                  <div className='space-y-1'>
                    <div className='text-primary flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase'>
                      <Search className='h-3 w-3' />
                      Key Insights
                    </div>
                    <p className='text-muted-foreground line-clamp-4 rounded-md bg-black/5 p-2 text-xs leading-relaxed dark:bg-white/5'>
                      {analysis.description}
                    </p>
                  </div>
                )}

                {analysis.tags && analysis.tags.length > 0 && (
                  <div className='mt-1 flex flex-wrap gap-1'>
                    {analysis.tags.slice(0, 5).map((tag, i) => (
                      <span
                        key={i}
                        className='bg-muted text-muted-foreground border-border/50 rounded border px-1.5 py-0.5 text-[9px]'
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Handle
          type='source'
          position={Position.Right}
          className='h-3 w-3 border-2 border-white bg-green-500'
        />
      </div>
    </div>
  );
}
