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
  Play,
  Search,
  Sparkles,
  Trash2,
  Unlock,
  X,
  Youtube,
} from "lucide-react";
import { YouTubeEmbed } from "react-social-media-embed";
import { Handle, type NodeProps, NodeResizer, Position } from "reactflow";
import { memo } from "react";
import { useState } from "react";

interface YouTubeNodeData {
  instruction?: string;
  status?: "public" | "private";
  url?: string;
  videoId?: string;
  thumbnail?: string;
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

export const YouTubeNode = memo(
  ({ data, isConnectable, selected }: NodeProps<YouTubeNodeData>) => {
    const safeData = data || {};
    const {
      instruction = "",
      status = "public",
      url = "",
      videoId: providedVideoId,
      thumbnail,
      analyzed = false,
      analysis = null,
      onAnalyze,
    } = safeData;

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [editData, setEditData] = useState({
      instruction: instruction || "",
      status: status || "public",
      url: url || "",
    });
    const [isEditOpen, setIsEditOpen] = useState(false);

    const getVideoId = (url: string) => {
      if (!url) return null;
      const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
      );
      return match ? match[1] : null;
    };

    const videoId = providedVideoId || getVideoId(editData.url);
    const thumbnailUrl = videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : thumbnail || "/youtube-thumbnail.png";

    const handleVideoClick = () => {
      if (editData.url) {
        window.open(editData.url, "_blank");
      }
    };

    const handleSave = () => {
      // Update the node data (in a real app, this would update the flow state)
      console.log("[v0] Saving YouTube node data:", editData);
      setIsEditOpen(false);
    };

    const displayTitle =
      editData.instruction ||
      (videoId ? `YouTube Video ${videoId.substring(0, 8)}` : "YouTube Video");

    return (
      <>
        <div className='relative rounded-[1.5rem]'>
          <Handle
            type='target'
            position={Position.Left}
            className='h-3 w-3 border-2 border-white bg-red-600'
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
            <CardContent className='p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <svg
                    className='h-6 w-6'
                    viewBox='0 0 256 180'
                    width='256'
                    height='180'
                    xmlns='http://www.w3.org/2000/svg'
                    preserveAspectRatio='xMidYMid'
                  >
                    <path
                      d='M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z'
                      fill='red'
                    />
                    <path
                      fill='#FFF'
                      d='m102.421 128.06 66.328-38.418-66.328-38.418z'
                    />
                  </svg>
                  <span className='text-foreground text-sm font-semibold'>
                    YouTube
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
                      className='border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 text-primary h-8 gap-1.5 px-2 text-xs transition-all duration-300'
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
                        <DialogTitle>Edit YouTube Video</DialogTitle>
                      </DialogHeader>
                      <div className='space-y-4'>
                        <div>
                          <Label htmlFor='url'>YouTube URL</Label>
                          <Input
                            id='url'
                            value={editData.url}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                url: e.target.value,
                              }))
                            }
                            placeholder='https://www.youtube.com/watch?v=...'
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
                      onClick={handleVideoClick}
                      className='hover:bg-muted rounded-md p-1 transition-colors'
                    >
                      <ExternalLink className='text-muted-foreground h-4 w-4' />
                    </button>
                  )}
                </div>
              </div>

              {editData.url && (
                <div className='mt-3'>
                  <YouTubeEmbed url={editData.url} width='100%' />
                </div>
              )}

              <div className='mt-3'>
                <div className='mb-2 flex items-center justify-between'>
                  <p className='text-foreground line-clamp-2 text-sm leading-relaxed font-medium'>
                    {displayTitle}
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
                <p className='text-muted-foreground mt-1 truncate text-xs'>
                  {videoId ? `Video ID: ${videoId}` : "YouTube Content"}
                </p>

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
            className='h-3 w-3 border-2 border-white bg-green-500'
            isConnectable={isConnectable}
          />

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
      </>
    );
  }
);

YouTubeNode.displayName = "YouTubeNode";
