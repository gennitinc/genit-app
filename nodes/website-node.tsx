"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit3,
  ExternalLink,
  Globe,
  ListCheck,
  Loader2,
  Lock,
  MessageSquare,
  Search,
  Sparkles,
  Trash2,
  Unlock,
  X,
} from "lucide-react";
import { Handle, type NodeProps, NodeResizer, Position } from "reactflow";
import { memo } from "react";
import { useState } from "react";

interface WebsiteNodeData {
  url?: string;
  title?: string;
  description?: string;
  favicon?: string;
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

export const WebsiteNode = memo(
  ({ data, isConnectable, selected }: NodeProps<WebsiteNodeData>) => {
    const {
      url = "",
      title = "Website",
      description = "Web content source",
      analyzed = false,
      analysis = null,
      onAnalyze,
    } = data;

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [editData, setEditData] = useState({
      url: url,
      title: title,
      description: description,
    });
    const [isEditOpen, setIsEditOpen] = useState(false);

    const getDomain = (url: string) => {
      try {
        return new URL(url).hostname.replace("www.", "");
      } catch {
        return url;
      }
    };

    const handleSave = () => {
      setIsEditOpen(false);
    };

    return (
      <div className='relative rounded-[1.5rem]'>
        <NodeResizer
          color='#3b82f6'
          isVisible={selected}
          minWidth={150}
          minHeight={80}
          handleClassName='w-3 h-3 bg-indigo-600 hover:bg-indigo-700 border-2 border-white rounded shadow-lg'
        />
        <div
          className={`bg-card border-border relative min-h-[80px] w-80 min-w-[150px] rounded-lg border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
            selected
              ? "ring-primary ring-2 ring-offset-2"
              : "hover:ring-primary/50 hover:ring-1"
          }`}
        >
          <Handle
            type='target'
            position={Position.Left}
            className='bg-indigo-600 hover:bg-indigo-700 h-3 w-3'
            isConnectable={isConnectable}
          />

          {/* Remove Button */}
          {data.onRemoveNode && data.nodeId && (
            <button
              onClick={() => data.onRemoveNode!(data.nodeId!)}
              className='absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-lg transition-colors duration-200 hover:bg-red-600'
              title='Remove node'
            >
              <X className='h-3 w-3' />
            </button>
          )}

          <div className='flex items-start space-x-3'>
            <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10'>
              <Globe className='h-5 w-5 text-blue-600' />
            </div>

            <div className='min-w-0 flex-1'>
              <div className='mb-2 flex items-center justify-between gap-2'>
                <div className='flex min-w-0 flex-1 items-center space-x-2'>
                  <h3 className='truncate text-sm font-semibold'>
                    {editData.title}
                  </h3>
                  <Badge variant='secondary' className='h-4 px-1 text-[10px]'>
                    Website
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
                      className='borber-primary/20 bg-indigo-600 hover:bg-indigo-700/5 text-primary h-7 gap-1 px-2 text-[10px]'
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
                  <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogTrigger asChild>
                      <Button variant='ghost' size='sm' className='h-auto p-1'>
                        <Edit3 className='text-muted-foreground h-3 w-3' />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-md'>
                      <DialogHeader>
                        <DialogTitle>Edit Website</DialogTitle>
                      </DialogHeader>
                      <div className='space-y-4'>
                        <div>
                          <Label htmlFor='url'>Website URL</Label>
                          <Input
                            id='url'
                            value={editData.url}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                url: e.target.value,
                              }))
                            }
                            placeholder='https://example.com'
                          />
                        </div>
                        <div>
                          <Label htmlFor='title'>Title</Label>
                          <Input
                            id='title'
                            value={editData.title}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder='Website title'
                          />
                        </div>
                        <div>
                          <Label htmlFor='description'>Description</Label>
                          <Textarea
                            id='description'
                            value={editData.description}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder='Website description'
                            rows={3}
                          />
                        </div>
                        <div className='flex justify-end space-x-2'>
                          <Button
                            variant='outline'
                            onClick={() => setIsEditOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSave}>Save Changes</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {editData.url && (
                <div className='text-muted-foreground mb-2 truncate text-xs'>
                  {getDomain(editData.url)}
                </div>
              )}

              <p className='text-muted-foreground mb-3 line-clamp-2 text-xs'>
                {editData.description}
              </p>

              {editData.url && (
                <Button
                  size='sm'
                  variant='outline'
                  className='h-7 w-full bg-transparent text-[10px]'
                  onClick={() => window.open(editData.url, "_blank")}
                >
                  <ExternalLink className='mr-1 h-3 w-3' />
                  Visit Site
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
        </div>

        <Handle
          type='source'
          position={Position.Right}
          className='bg-indigo-600 hover:bg-indigo-700 h-3 w-3'
          isConnectable={isConnectable}
        />
      </div>
    );
  }
);

WebsiteNode.displayName = "WebsiteNode";
