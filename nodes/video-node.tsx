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
  Captions,
  CircleFadingArrowUp,
  Download,
  Edit3,
  ExternalLink,
  ListCheck,
  Loader2,
  Lock,
  MessageSquare,
  Pause,
  Play,
  Search,
  Sparkles,
  Trash2,
  Unlock,
  Video,
  X,
} from "lucide-react";
import { Handle, type NodeProps, NodeResizer, Position } from "reactflow";
import { memo, useEffect, useState } from "react";
import { LoadingFileLoader } from "@/utils/Loading";

interface VideoNodeData {
  instruction?: string;
  status?: "public" | "private";
  url?: string;
  type?: string;
  duration?: string;
  size?: string;
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

export const VideoNode = memo(
  ({ data, isConnectable, selected }: NodeProps<VideoNodeData>) => {
    const {
      instruction = "Video",
      status = "public",
      url = "",
      type = "video",
      duration = "",
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
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

    const handleSave = () => {
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
        link.download = editData.instruction || "video.mp4";
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

    const handlePlayPause = () => {
      if (videoRef) {
        if (isPlaying) {
          videoRef.pause();
        } else {
          videoRef.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    return (
      <div className='bg-card border-border relative min-h-[150px] w-80 min-w-[200px] rounded-[1.5rem] border p-2 shadow-sm'>
        <Handle
          type='target'
          position={Position.Left}
          className='h-3 w-3 bg-indigo-600 hover:bg-indigo-700'
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
                    : "Video"}
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
                <DialogContent className='sm:max-w-md'>
                  <DialogHeader>
                    <DialogTitle>Edit Video Content</DialogTitle>
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
                      <Label htmlFor='url'>Video URL</Label>
                      <Input
                        id='url'
                        value={editData.url}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                        placeholder='https://example.com/video.mp4'
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

            {size && (
              <div className='text-muted-foreground mb-2 text-xs'>
                Size: {size}
              </div>
            )}

            {editData.url && (
              <div className='mb-3'>
                <video
                  ref={setVideoRef}
                  src={editData.url}
                  className='border-border h-full w-full rounded-md border object-cover'
                  controls
                  preload='metadata'
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={(e) => {
                    console.error("Video error:", e);
                  }}
                />
              </div>
            )}

            {editData.url && (
              <div className='flex items-center justify-between'>
                <div
                  className={`border-border mr-2 flex h-7 flex-1 cursor-pointer items-center justify-center rounded-md border text-xs ${
                    isPlaying
                      ? "bg-indigo-600 hover:bg-indigo-600 hover:bg-indigo-700/10 hover:bg-indigo-700/20"
                      : "hover:bg-muted bg-transparent"
                  }`}
                  onClick={handlePlayPause}
                  title={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? (
                    <>
                      <Pause className='mr-1 h-3 w-3' />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className='mr-1 h-3 w-3' />
                      Play
                    </>
                  )}
                </div>
                <div
                  className='border-border hover:bg-muted mr-2 flex h-7 cursor-pointer items-center justify-center rounded-md border bg-transparent px-2 text-xs'
                  onClick={handleDownload}
                  title='Download video'
                >
                  <Download className='mr-1 h-3 w-3' />
                  Download
                </div>
                <div
                  className='border-border hover:bg-muted flex h-7 cursor-pointer items-center justify-center rounded-md border bg-transparent px-2 text-xs'
                  onClick={() => window.open(editData.url, "_blank")}
                  title='Open video in new tab'
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

VideoNode.displayName = "VideoNode";
