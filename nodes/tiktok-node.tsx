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
import {
  Captions,
  Edit3,
  ExternalLink,
  ListCheck,
  Loader2,
  Lock,
  MessageSquare,
  Search,
  Sparkles,
  Unlock,
  X,
} from "lucide-react";
import { TikTokEmbed } from "react-social-media-embed";
import { Handle, type NodeProps, Position } from "reactflow";
import { memo, useState } from "react";

interface TikTokNodeData {
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

export const TikTokNode = memo(
  ({ data, isConnectable, selected }: NodeProps<TikTokNodeData>) => {
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
      <div className='relative rounded-[1.5rem]'>
        <Handle
          type='target'
          position={Position.Left}
          className='h-3 w-3 border-2 border-white bg-red-600 shadow-sm transition-all'
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

        <Card className='bg-card border-border group w-full rounded-lg border shadow-sm transition-all duration-300 hover:shadow-md'>
          <CardContent className='p-4'>
            <div className='mb-3 flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <svg
                  className='h-6 w-6'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <defs>
                    <linearGradient
                      id='tiktok-gradient'
                      x1='0%'
                      y1='0%'
                      x2='100%'
                      y2='100%'
                    >
                      <stop offset='0%' stopColor='#25F4EE' />
                      <stop offset='50%' stopColor='#FE2C55' />
                      <stop offset='100%' stopColor='#000000' />
                    </linearGradient>
                  </defs>
                  <path
                    fill='url(#tiktok-gradient)'
                    d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z'
                  />
                </svg>
                <span className='text-foreground text-sm font-semibold'>
                  TikTok
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
                    className='border-primary/20 hover:border-primary/50 bg-indigo-600 hover:bg-indigo-700/5 hover:bg-indigo-600 hover:bg-indigo-700/10 text-primary h-8 gap-1.5 px-2 text-xs transition-all duration-300'
                  >
                    {isAnalyzing ? (
                      <Loader2 className='h-3.5 w-3.5 animate-spin' />
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
                      <DialogTitle>Edit TikTok Post</DialogTitle>
                    </DialogHeader>
                    <div className='space-y-4'>
                      <div>
                        <Label htmlFor='url'>TikTok URL</Label>
                        <Input
                          id='url'
                          value={editData.url}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              url: e.target.value,
                            }))
                          }
                          placeholder='https://www.tiktok.com/...'
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
                      <div>
                        <Label htmlFor='username'>Username (Optional)</Label>
                        <Input
                          id='username'
                          value={editData.username}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              username: e.target.value,
                            }))
                          }
                          placeholder='username'
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
                <TikTokEmbed url={editData.url} width='100%' />
              </div>
            )}

            <div className='mt-3'>
              <div className='mb-2 flex items-center justify-between'>
                <p className='text-foreground line-clamp-2 text-sm leading-relaxed font-medium'>
                  {editData.instruction || "TikTok Post"}
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
              {editData.username && (
                <p className='text-muted-foreground mt-1 text-xs'>
                  @{editData.username}
                </p>
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

                  {analysis.transcription && (
                    <div className='space-y-1'>
                      <div className='text-primary flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase'>
                        <Captions className='h-3 w-3' />
                        Transcription
                      </div>
                      <p className='text-muted-foreground line-clamp-4 rounded-md bg-black/5 p-2 font-mono text-[11px] leading-relaxed dark:bg-white/5'>
                        {analysis.transcription}
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
    );
  }
);

TikTokNode.displayName = "TikTokNode";
