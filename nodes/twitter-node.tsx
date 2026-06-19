"use client";

import { Badge } from "@/components/ui/badge";
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
  Edit3,
  ExternalLink,
  ListCheck,
  Loader2,
  Lock,
  MessageSquare,
  Search,
  Sparkles,
  Twitter,
  Unlock,
  X,
} from "lucide-react";
import { TwitterEmbed } from "react-social-media-embed";
import { Handle, type NodeProps, NodeResizer, Position } from "reactflow";
import { memo, useState } from "react";

interface TwitterNodeData {
  url?: string;
  instruction?: string;
  status?: "public" | "private";
  username?: string;
  tweetId?: string;
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

export const TwitterNode = memo(
  ({ data, isConnectable, selected }: NodeProps<TwitterNodeData>) => {
    const {
      url = "",
      instruction = "Twitter Post",
      status = "public",
      username = "",
      analyzed = false,
      analysis = null,
      onAnalyze,
    } = data;

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [editData, setEditData] = useState({
      url: url,
      instruction: instruction || "",
      status: status || "public",
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
        <div className='relative rounded-[1.5rem]'>
          <Handle
            type='target'
            position={Position.Left}
            className='h-3 w-3 border-2 border-white bg-blue-500'
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

          <Card className='bg-card border-border group min-h-[200px] w-80 min-w-[320px] rounded-lg border shadow-sm transition-all duration-300 hover:shadow-md'>
            <CardContent className='p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <svg
                    className='h-6 w-6'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                  </svg>
                  <span className='text-foreground text-sm font-semibold'>
                    Twitter
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
                        <DialogTitle>Edit Twitter Post</DialogTitle>
                      </DialogHeader>
                      <div className='space-y-4'>
                        <div>
                          <Label htmlFor='url'>Twitter URL</Label>
                          <Input
                            id='url'
                            value={editData.url}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                url: e.target.value,
                              }))
                            }
                            placeholder='https://twitter.com/username/status/...'
                          />
                        </div>
                        <div>
                          <Label htmlFor='instruction'>Instruction</Label>
                          <Input
                            id='instruction'
                            value={editData.instruction}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                instruction: e.target.value,
                              }))
                            }
                            placeholder='Document your file so you can remember them'
                          />
                        </div>
                        <div>
                          <Label htmlFor='status'>Status</Label>
                          <select
                            id='status'
                            value={editData.status}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                status: e.target.value as "public" | "private",
                              }))
                            }
                            className='border-border bg-background text-foreground w-full rounded-md border px-3 py-2'
                          >
                            <option value='public'>Public</option>
                            <option value='private'>Private</option>
                          </select>
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
                  <TwitterEmbed url={editData.url} width='100%' />
                </div>
              )}

              <div className='mt-3'>
                <div className='mb-2 flex items-center justify-between'>
                  <p className='text-foreground line-clamp-2 text-sm leading-relaxed font-medium'>
                    {editData.instruction || "Twitter Post"}
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
                  <p className='text-muted-foreground text-[10px]'>
                    @{editData.username}
                  </p>
                )}

                {data.analyzed && data.analysis && (
                  <div className='border-border/50 mt-4 space-y-3 border-t pt-3'>
                    {data.analysis.summary && (
                      <div className='space-y-1'>
                        <div className='text-primary flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase'>
                          <MessageSquare className='h-3 w-3' />
                          AI Summary
                        </div>
                        <p className='text-muted-foreground bg-muted/30 border-border/30 rounded-lg border p-2 text-xs leading-relaxed italic'>
                          "{data.analysis.summary}"
                        </p>
                      </div>
                    )}

                    {(data.analysis.description ||
                      data.analysis.transcription) && (
                      <div className='space-y-1'>
                        <div className='text-primary flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase'>
                          <Search className='h-3 w-3' />
                          Context
                        </div>
                        <p className='text-muted-foreground line-clamp-3 text-xs leading-relaxed'>
                          {data.analysis.description ||
                            data.analysis.transcription}
                        </p>
                      </div>
                    )}

                    {data.analysis.tags && data.analysis.tags.length > 0 && (
                      <div className='mt-1 flex flex-wrap gap-1'>
                        {data.analysis.tags.slice(0, 5).map((tag, i) => (
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
            className='h-3 w-3 border-2 border-white bg-green-500'
            isConnectable={isConnectable}
          />
        </div>
      </>
    );
  }
);

TwitterNode.displayName = "TwitterNode";
