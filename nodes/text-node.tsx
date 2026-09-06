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
import { LoadingFileLoader } from "@/utils/Loading";
import {
  CheckCheck,
  CircleFadingArrowUp,
  Copy,
  Edit3,
  FileText,
  ListCheck,
  Loader2,
  Lock,
  MessageSquare,
  Save,
  Search,
  Sparkles,
  Unlock,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Handle, type NodeProps, Position } from "reactflow";
import { memo, useEffect, useState } from "react";

interface TextNodeData {
  label?: string;
  content?: string;
  status?: "public" | "private";
  type?: string;
  onRemoveNode?: (nodeId: string) => void;
  onAnalyze?: () => void;
  nodeId?: string;
  analyzed?: boolean;
  analysis?: {
    summary?: string;
    tags?: string[];
  };
}

export const TextNode = memo(
  ({ data, isConnectable }: NodeProps<TextNodeData>) => {
    const {
      label = "Text Content",
      content = "",
      status = "public",
      type = "text",
      analyzed = false,
      analysis = null,
      onAnalyze,
    } = data;

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [editData, setEditData] = useState({
      label: label || "",
      content: content || "",
      status: status || "public",
      hasLabel: (label || "").trim() !== "",
    });
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(editData.content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text:", err);
      }
    };

    const handleSave = () => {
      setIsEditOpen(false);
    };

    // Update internal state when node data changes (e.g. after AI generation)
    useEffect(() => {
      setEditData({
        label: label || "",
        content: content || "",
        status: status || "public",
        hasLabel: (label || "").trim() !== "",
      });
    }, [label, content, status]);

    return (
      <div className='bg-card border-border relative min-h-[200px] w-[450px] min-w-[300px] rounded-[1.5rem] border p-2 shadow-sm'>
        <Handle
          type='target'
          position={Position.Left}
          className='h-3 w-3 border-2 border-white bg-blue-500'
        />
        <Handle
          type='source'
          position={Position.Right}
          className='h-3 w-3 border-2 border-white bg-green-500'
        />

        {/* Remove Button */}
        {data.onRemoveNode && data.nodeId && (
          <button
            onClick={() => data.onRemoveNode!(data.nodeId!)}
            className='absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-lg transition-colors duration-200 hover:bg-red-600'
            title='Remove node'
          >
            <X className='h-3 w-3' />
          </button>
        )}

        <div className='flex h-full items-start space-x-3'>
          <div className='flex h-full min-w-0 flex-1 flex-col'>
            <div className='mb-2 flex items-center justify-between'>
              <div className='flex min-w-0 flex-1 items-center space-x-2'>
                <h3 className='truncate text-xs font-semibold'>
                  {editData.hasLabel && editData.label.trim()
                    ? editData.label
                    : "Text Content"}
                </h3>
                <span className='text-muted-foreground text-xs'>
                  {editData.status}
                </span>
              </div>
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
                  className='borber-primary/20 text-primary h-7 gap-1 bg-indigo-600 px-2 text-[10px] hover:bg-indigo-700/5'
                >
                  {isAnalyzing ? (
                    <LoadingFileLoader size={20} />
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
                <DialogContent className='flex max-h-[85vh] flex-col overflow-hidden p-0 sm:max-w-2xl'>
                  <DialogHeader className='p-6 pb-2'>
                    <DialogTitle>Edit Text Content</DialogTitle>
                  </DialogHeader>
                  <div className='flex-1 space-y-6 overflow-y-auto p-6 pt-2'>
                    <div>
                      <div className='mb-2 flex items-center justify-between'>
                        <Label htmlFor='label'>Label</Label>
                        <button
                          type='button'
                          onClick={() =>
                            setEditData((prev) => ({
                              ...prev,
                              hasLabel: !prev.hasLabel,
                              label: !prev.hasLabel ? prev.label : "",
                            }))
                          }
                          className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${
                            editData.hasLabel
                              ? "bg-indigo-600 hover:bg-indigo-700"
                              : "bg-muted"
                          }`}
                        >
                          <span
                            className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                              editData.hasLabel
                                ? "translate-x-3.5"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                      {editData.hasLabel && (
                        <Textarea
                          id='label'
                          value={editData.label}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              label: e.target.value,
                            }))
                          }
                          placeholder='Document your file so you can remember them'
                          className='min-h-[80px] resize-none'
                        />
                      )}
                    </div>
                    <div>
                      <Label htmlFor='status'>Status</Label>
                      <div className='mt-1 flex items-center space-x-3'>
                        <span className='text-muted-foreground text-xs'>
                          Public
                        </span>
                        <button
                          type='button'
                          onClick={() =>
                            setEditData((prev) => ({
                              ...prev,
                              status:
                                prev.status === "public" ? "private" : "public",
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
                      <Label htmlFor='content'>Content</Label>
                      <Textarea
                        id='content'
                        value={editData.content}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        placeholder='Enter your text content...'
                        className='mt-1 min-h-[400px]'
                      />
                    </div>
                  </div>
                  <div className='flex justify-end space-x-2 border-t p-6 pt-2'>
                    <Button
                      variant='outline'
                      onClick={() => setIsEditOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className='text-muted-foreground bg-muted border-border nodrag nowheel group relative max-h-[400px] flex-1 cursor-text overflow-y-auto rounded-[1.5rem] border p-4 text-xs select-text'>
              {editData.content ? (
                <>
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1
                          className='mb-2 border-b pb-1 text-lg font-bold'
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2
                          className='mt-3 mb-1 text-base font-bold'
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          className='mt-2 mb-1 text-[11px] font-bold'
                          {...props}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p
                          className='mb-2 leading-relaxed last:mb-0'
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          className='mb-2 ml-4 list-disc space-y-1'
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className='mb-2 ml-4 list-decimal space-y-1'
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li className='mb-0.5' {...props} />
                      ),
                      code: ({ node, ...props }: any) => (
                        <code
                          className='bg-background/50 rounded px-1 font-mono text-[10px]'
                          {...props}
                        />
                      ),
                      pre: ({ node, ...props }: any) => (
                        <pre
                          className='bg-background/50 my-2 overflow-x-auto rounded-lg p-2 font-mono text-[10px]'
                          {...props}
                        />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className='border-primary/30 my-2 border-l-2 pl-3 italic'
                          {...props}
                        />
                      ),
                    }}
                  >
                    {editData.content}
                  </ReactMarkdown>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='bg-background/50 border-border absolute right-2 bottom-2 h-7 w-7 rounded-lg border p-0 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100'
                    onClick={handleCopy}
                    title='Copy to clipboard'
                  >
                    {isCopied ? (
                      <CheckCheck className='h-3.5 w-3.5 text-green-500' />
                    ) : (
                      <Copy className='h-3.5 w-3.5' />
                    )}
                  </Button>
                </>
              ) : (
                "No content available. Click edit to add text."
              )}
            </div>

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
      </div>
    );
  }
);

TextNode.displayName = "TextNode";
