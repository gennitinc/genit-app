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
  FileText,
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
import { memo, useEffect, useState } from "react";

interface DocumentNodeData {
  instruction?: string;
  status?: "public" | "private";
  url?: string;
  type?: string;
  docType?: string;
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

export const DocumentNode = memo(
  ({ data, isConnectable, selected }: NodeProps<DocumentNodeData>) => {
    const {
      instruction = "Document",
      status = "public",
      url = "",
      type = "document",
      docType = "Document",
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
        link.download = editData.instruction || "document";
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

    const getFileIcon = (fileName: string) => {
      const extension = fileName.split(".").pop()?.toLowerCase();
      switch (extension) {
        case "pdf":
          return "📄";
        case "doc":
        case "docx":
          return "📝";
        case "xls":
        case "xlsx":
          return "📊";
        case "ppt":
        case "pptx":
          return "📈";
        case "txt":
          return "📄";
        default:
          return "📄";
      }
    };

    return (
      <div className='relative rounded-[1.5rem]'>
        <NodeResizer
          color='#3b82f6'
          isVisible={selected}
          minWidth={200}
          minHeight={120}
          handleClassName='w-3 h-3 bg-indigo-600 hover:bg-indigo-700 border-2 border-white rounded shadow-lg'
        />

        <div
          className={`bg-card border-border relative min-h-[120px] w-80 min-w-[200px] cursor-grab rounded-lg border p-4 shadow-sm transition-all duration-200 hover:shadow-md active:cursor-grabbing ${
            selected
              ? "ring-primary ring-2 ring-offset-2"
              : "hover:ring-primary/50 hover:ring-1"
          }`}
          style={{ userSelect: "none" }}
        >
          <Handle
            type='target'
            position={Position.Left}
            className='bg-indigo-600 hover:bg-indigo-700 h-3 w-3'
            isConnectable={isConnectable}
          />

          <div className='flex items-start space-x-3'>
            <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/10'>
              <FileText className='h-5 w-5 text-purple-600' />
            </div>

            <div className='min-w-0 flex-1'>
              <div className='mb-1 flex items-center justify-between gap-2'>
                <div className='min-w-0 flex-1'>
                  <h3 className='truncate text-xs font-semibold'>
                    {editData.hasInstruction && editData.instruction.trim()
                      ? editData.instruction
                      : "Document"}
                  </h3>
                  <div className='mt-0.5 flex items-center space-x-1'>
                    {editData.status === "private" ? (
                      <Lock className='h-2.5 w-2.5 text-red-500' />
                    ) : (
                      <Unlock className='h-2.5 w-2.5 text-green-500' />
                    )}
                    <span className='text-muted-foreground text-[10px]'>
                      {editData.status}
                    </span>
                  </div>
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
                        <DialogTitle>Edit Document Content</DialogTitle>
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
                                  ? "bg-indigo-600 hover:bg-indigo-700"
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
                                  ? "bg-indigo-600 hover:bg-indigo-700"
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
                          <Label htmlFor='url'>Document URL</Label>
                          <Input
                            id='url'
                            value={editData.url}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                url: e.target.value,
                              }))
                            }
                            placeholder='https://example.com/document.pdf'
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

              <div className='mb-2 flex items-center space-x-2'>
                <Badge
                  variant='secondary'
                  className='h-4 bg-purple-100 px-1 text-[10px] text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                >
                  {docType}
                </Badge>
              </div>

              <div className='mb-3 space-y-1'>
                {size && (
                  <div className='text-muted-foreground text-[10px]'>
                    Size: {size}
                  </div>
                )}
                <div className='text-muted-foreground text-[10px]'>
                  Type: {type}
                </div>
              </div>

              <div className='mb-3'>
                <div className='bg-muted border-border flex h-16 w-full items-center justify-center rounded-md border text-2xl'>
                  {getFileIcon(editData.instruction)}
                </div>
              </div>

              {editData.url && (
                <div className='flex space-x-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    className='h-7 flex-1 bg-transparent text-[10px]'
                    onClick={() => window.open(editData.url, "_blank")}
                  >
                    <ExternalLink className='mr-1 h-3 w-3' />
                    View
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    className='h-7 bg-transparent text-[10px]'
                    onClick={handleDownload}
                  >
                    <Download className='h-3 w-3' />
                  </Button>
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

          <Handle
            type='source'
            position={Position.Right}
            className='bg-indigo-600 hover:bg-indigo-700 h-3 w-3'
            isConnectable={isConnectable}
          />
        </div>
      </div>
    );
  }
);

DocumentNode.displayName = "DocumentNode";
