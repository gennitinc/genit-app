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
  Download,
  Edit3,
  ExternalLink,
  Image,
  ListCheck,
  Loader2,
  Lock,
  MessageSquare,
  Search,
  Sparkles,
  Unlock,
  X,
} from "lucide-react";
import { Handle, type NodeProps, Position } from "reactflow";
import { memo, useEffect, useState } from "react";

interface ImageNodeData {
  instruction?: string;
  status?: "public" | "private";
  url?: string;
  type?: string;
  size?: string;
  onRemoveNode?: (nodeId: string) => void;
  onDataChange?: (newData: any) => void;
  onAnalyze?: () => void;
  nodeId?: string;
  analyzed?: boolean;
  analysis?: {
    summary?: string;
    description?: string;
    tags?: string[];
  };
}

export const ImageNode = memo(
  ({ data, isConnectable }: NodeProps<ImageNodeData>) => {
    const {
      instruction = "Image",
      status = "public",
      url = "",
      type = "image",
      size = "",
      analyzed = false,
      analysis = null,
      onAnalyze,
    } = data;

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [editData, setEditData] = useState({
      instruction: instruction || "",
      status: status || "public",
      url: url || "",
      hasInstruction: (instruction || "").trim() !== "",
    });
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleSave = () => {
      console.log("Saving image node data:", editData);
      data.onDataChange?.(editData);
      setIsEditOpen(false);
    };

    const handleDownload = async () => {
      if (!editData.url) return;
      try {
        const response = await fetch(editData.url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = editData.instruction || "image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Download failed:", error);
        window.open(editData.url, "_blank");
      }
    };

    // Update internal state when node data changes (e.g. after AI generation)
    useEffect(() => {
      setEditData({
        instruction: data.instruction || "",
        status: data.status || "public",
        url: data.url || "",
        hasInstruction: (data.instruction || "").trim() !== "",
      });
    }, [data.instruction, data.status, data.url]);

    return (
      <div className='bg-card border-border relative min-h-[150px] w-80 min-w-[200px] rounded-[1.5rem] border p-2 shadow-sm'>
        <Handle
          type='target'
          position={Position.Left}
          className='bg-primary h-3 w-3'
          isConnectable={isConnectable}
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

        <div className='flex items-start space-x-3'>
          <div className='min-w-0 flex-1'>
            <div className='mb-1 flex items-center justify-between'>
              <div className='flex min-w-0 flex-1 items-center space-x-2'>
                <h3 className='truncate text-xs font-semibold'>
                  {editData.hasInstruction && editData.instruction.trim()
                    ? editData.instruction
                    : "Image"}
                </h3>
                <span className='text-muted-foreground text-xs'>
                  {editData.status}
                </span>
              </div>
              <div className='ml-auto flex items-center space-x-1'>
                {!analyzed && onAnalyze && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={async () => {
                      setIsAnalyzing(true);
                      try {
                        await onAnalyze();
                      } finally {
                        setIsAnalyzing(false);
                      }
                    }}
                    disabled={isAnalyzing}
                    className='borber-primary/20 bg-primary/5 text-primary h-7 gap-1 px-2 text-[10px]'
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
                      <DialogTitle>Edit Image Content</DialogTitle>
                    </DialogHeader>
                    <div className='space-y-4'>
                      <div>
                        <div className='mb-2 flex items-center justify-between'>
                          <Label htmlFor='instruction'>Instruction</Label>
                          <button
                            type='button'
                            onClick={() =>
                              setEditData((prev) => ({
                                ...prev,
                                hasInstruction: !prev.hasInstruction,
                                instruction: !prev.hasInstruction
                                  ? prev.instruction
                                  : "",
                              }))
                            }
                            className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${
                              editData.hasInstruction
                                ? "bg-primary"
                                : "bg-muted"
                            }`}
                          >
                            <span
                              className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                                editData.hasInstruction
                                  ? "translate-x-3.5"
                                  : "translate-x-0.5"
                              }`}
                            />
                          </button>
                        </div>
                        {editData.hasInstruction && (
                          <Textarea
                            id='instruction'
                            value={editData.instruction}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                instruction: e.target.value,
                              }))
                            }
                            placeholder='Document your file so you can remember them'
                            className='min-h-[80px] resize-none'
                          />
                        )}
                      </div>
                      <div>
                        <Label htmlFor='status'>Status</Label>
                        <div className='flex items-center space-x-3'>
                          <span className='text-muted-foreground text-xs'>
                            Public
                          </span>
                          <button
                            type='button'
                            onClick={() =>
                              setEditData((prev) => ({
                                ...prev,
                                status:
                                  prev.status === "public"
                                    ? "private"
                                    : "public",
                              }))
                            }
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                              editData.status === "private"
                                ? "bg-primary"
                                : "bg-muted"
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                editData.status === "private"
                                  ? "translate-x-5"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                          <span className='text-muted-foreground text-xs'>
                            Private
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor='url'>Image URL</Label>
                        <Input
                          id='url'
                          value={editData.url}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              url: e.target.value,
                            }))
                          }
                          placeholder='https://example.com/image.jpg'
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

            {size && (
              <div className='text-muted-foreground mb-2 text-xs'>
                Size: {size}
              </div>
            )}

            {(editData.url || url) && (
              <div className='mb-3 space-y-2'>
                <div className='border-border bg-muted/30 overflow-hidden rounded-md border'>
                  <img
                    src={editData.url || url}
                    alt={editData.instruction || instruction}
                    className='h-auto max-h-[300px] w-full object-contain'
                    loading='lazy'
                    onError={(e) => {
                      console.error(
                        "Image failed to load:",
                        editData.url || url
                      );
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div
                  className='border-border hover:bg-muted flex h-7 cursor-pointer items-center justify-center rounded-md border bg-transparent px-2 text-xs'
                  onClick={() => window.open(editData.url || url, "_blank")}
                  title='Open image in new tab'
                >
                  <ExternalLink className='mr-1 h-3 w-3' />
                  Open
                </div>
              </div>
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
                      Visual Description
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
          isConnectable={isConnectable}
        />
      </div>
    );
  }
);

ImageNode.displayName = "ImageNode";
