"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  CircleFadingArrowUp,
  Edit3,
  ExternalLink,
  Instagram,
  ListCheck,
  Loader2,
  Lock,
  MessageSquare,
  Search,
  Sparkles,
  Unlock,
  X,
} from "lucide-react";
import { InstagramEmbed } from "react-social-media-embed";
import { Handle, type NodeProps, Position } from "reactflow";
import { memo, useState } from "react";

interface InstagramNodeData {
  instruction?: string;
  status?: "public" | "private";
  url?: string;
  username?: string;
  postId?: string;
  onRemoveNode?: (nodeId: string) => void;
  onAnalyze?: () => void;
  nodeId?: string;
  analyzed?: boolean;
  analysis?: {
    transcription?: string;
    summary?: string;
    description?: string;
    tags?: string[];
  };
}

export const InstagramNode = memo(
  ({ data, isConnectable, selected }: NodeProps<InstagramNodeData>) => {
    const {
      instruction = "",
      status = "public",
      url = "",
      username = "",
      analyzed = false,
      analysis = null,
      onAnalyze,
    } = data;

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [editData, setEditData] = useState({
      instruction: instruction || "",
      status: status || "public",
      url: url || "",
      username: username || "",
    });
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleSave = () => {
      setIsEditOpen(false);
    };

    const handlePostClick = () => {
      if (editData.url) {
        window.open(editData.url, "_blank");
      }
    };

    return (
      <>
        <div className='relative w-fit rounded-[1.5rem]'>
          <Handle
            type='target'
            position={Position.Left}
            className='h-3 w-3 border-2 border-white bg-red-500 shadow-sm transition-all'
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

          <Card className='bg-card border-border group rounded-lg border shadow-sm transition-all duration-300 hover:shadow-md'>
            <CardContent className='w-fit p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <svg
                    className='h-6 w-6'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <defs>
                      <linearGradient
                        id='instagram-gradient'
                        x1='0%'
                        y1='0%'
                        x2='100%'
                        y2='100%'
                      >
                        <stop offset='0%' stopColor='#f09433' />
                        <stop offset='25%' stopColor='#e6683c' />
                        <stop offset='50%' stopColor='#dc2743' />
                        <stop offset='75%' stopColor='#cc2366' />
                        <stop offset='100%' stopColor='#bc1888' />
                      </linearGradient>
                    </defs>
                    <path
                      fill='url(#instagram-gradient)'
                      d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
                    />
                  </svg>
                  <span className='text-foreground text-sm font-semibold'>
                    Instagram
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
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
                      className='border-primary/20 hover:border-primary/50 text-primary h-8 gap-1.5 bg-indigo-600 px-2 text-xs transition-all duration-300 hover:bg-indigo-600 hover:bg-indigo-700/5 hover:bg-indigo-700/10'
                    >
                      {isAnalyzing ? (
                        <LoadingFileLoader size={20} />
                      ) : (
                        <Sparkles className='h-3.5 w-3.5' />
                      )}
                      Analyze
                    </Button>
                  )}
                  {analyzed && (
                    <div className='flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-1 text-[10px] font-medium text-green-600 dark:text-green-400'>
                      <ListCheck className='h-3 w-3' />
                      Analyzed
                    </div>
                  )}
                  <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogTrigger asChild>
                      <Button variant='ghost' size='sm' className='h-auto p-1'>
                        <Edit3 className='text-muted-foreground h-4 w-4' />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-md'>
                      <DialogHeader>
                        <DialogTitle>Edit Instagram Post</DialogTitle>
                      </DialogHeader>
                      <div className='space-y-4'>
                        <div>
                          <Label htmlFor='url'>Instagram URL</Label>
                          <Input
                            id='url'
                            value={editData.url}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                url: e.target.value,
                              }))
                            }
                            placeholder='https://www.instagram.com/...'
                          />
                        </div>
                        <div>
                          <Label htmlFor='instruction'>Instruction</Label>
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
                  {editData.url && (
                    <button
                      onClick={handlePostClick}
                      className='hover:bg-muted rounded-md p-1 transition-colors'
                    >
                      <ExternalLink className='text-muted-foreground h-4 w-4' />
                    </button>
                  )}
                </div>
              </div>

              {editData.url && (
                <div className='mt-3'>
                  <InstagramEmbed url={editData.url} width='100%' />
                </div>
              )}

              <div className='mt-3'>
                <div className='mb-2 flex items-center justify-between'>
                  <p className='text-foreground line-clamp-2 text-sm leading-relaxed font-medium'>
                    {editData.instruction || "Instagram Post"}
                  </p>
                  <div className='ml-2 flex items-center space-x-1'>
                    {editData.status === "private" ? (
                      <Lock className='h-3 w-3 text-red-500' />
                    ) : (
                      <Unlock className='h-3 w-3 text-green-500' />
                    )}
                    <span className='text-muted-foreground text-xs'>
                      {editData.status}
                    </span>
                  </div>
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

                    {(analysis.description || analysis.transcription) && (
                      <div className='space-y-1'>
                        <div className='text-primary flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase'>
                          <Search className='h-3 w-3' />
                          Context
                        </div>
                        <p className='text-muted-foreground line-clamp-3 text-xs leading-relaxed'>
                          {analysis.description || analysis.transcription}
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
            </CardContent>
          </Card>

          <Handle
            type='source'
            position={Position.Right}
            className='h-3 w-3 border-2 border-white bg-green-500 shadow-sm transition-all'
            isConnectable={isConnectable}
          />
        </div>
      </>
    );
  }
);

InstagramNode.displayName = "InstagramNode";
