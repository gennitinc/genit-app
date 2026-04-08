"use client";

import { memo, useState, useEffect } from "react";
import { Handle, Position, NodeResizer, type NodeProps } from "reactflow";
import {
  Video,
  Trash2,
  Play,
  Pause,
  ExternalLink,
  X,
  Edit3,
  Lock,
  Unlock,
  Download,
  Sparkles,
  Loader2,
  MessageSquare,
  ListCheck,
  Search,
  Captions
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
      console.log("Saving video node data:", editData);
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
      <div className="relative bg-card border border-border rounded-[1.5rem] shadow-sm p-2 w-80 min-w-[200px] min-h-[150px]">
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-primary"
          isConnectable={isConnectable}
        />

        {/* Remove Button */}
        {data.onRemoveNode && data.nodeId && (
          <button
            onClick={() => data.onRemoveNode?.(data.nodeId as string)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors duration-200 shadow-lg z-10"
            title="Remove node"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        <div className="flex items-start space-x-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <h3 className="font-semibold text-xs truncate">
                  {editData.hasInstruction && editData.instruction.trim()
                    ? editData.instruction
                    : "Video"}
                </h3>
                  <span className="text-xs text-muted-foreground">
                    {editData.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1 ml-auto">
                {!analyzed && onAnalyze && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      setIsAnalyzing(true);
                      try {
                        await onAnalyze();
                      } finally {
                        setIsAnalyzing(false);
                      }
                    }}
                    disabled={isAnalyzing}
                    className="h-7 px-2 text-[10px] gap-1 borber-primary/20 bg-primary/5 text-primary"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    Analyze
                  </Button>
                )}
                {analyzed && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-[9px] font-medium">
                    <ListCheck className="w-2.5 h-2.5" />
                    Analyzed
                  </div>
                )}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1 h-auto">
                    <Edit3 className="w-3 h-3 text-muted-foreground" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Video Content</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="instruction">Instruction</Label>
                        <button
                          type="button"
                          onClick={() =>
                            setEditData((prev) => ({
                              ...prev,
                              hasInstruction: !prev.hasInstruction,
                              instruction: !prev.hasInstruction
                                ? prev.instruction
                                : "",
                            }))
                          }
                          className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none  ${
                            editData.hasInstruction ? "bg-primary" : "bg-muted"
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
                          id="instruction"
                          value={editData.instruction}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              instruction: e.target.value,
                            }))
                          }
                          placeholder="Document your file so you can remember them"
                          className="min-h-[80px] resize-none"
                        />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-muted-foreground">
                          Public
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditData((prev) => ({
                              ...prev,
                              status:
                                prev.status === "public" ? "private" : "public",
                            }))
                          }
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none  ${
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
                        <span className="text-xs text-muted-foreground">
                          Private
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="url">Video URL</Label>
                      <Input
                        id="url"
                        value={editData.url}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                        placeholder="https://example.com/video.mp4"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
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
              <div className="text-xs text-muted-foreground mb-2">
                Size: {size}
              </div>
            )}

            {editData.url && (
              <div className="mb-3">
                <video
                  ref={setVideoRef}
                  src={editData.url}
                  className="w-full h-full object-cover rounded-md border border-border"
                  controls
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={(e) => {
                    console.error("Video error:", e);
                  }}
                />
              </div>
            )}

            {editData.url && (
              <div className="flex items-center justify-between">
                <div
                  className={`flex-1 text-xs h-7 border border-border rounded-md flex items-center justify-center cursor-pointer mr-2 ${
                    isPlaying
                      ? "bg-primary/10 hover:bg-primary/20"
                      : "bg-transparent hover:bg-muted"
                  }`}
                  onClick={handlePlayPause}
                  title={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 mr-1" />
                      Play
                    </>
                  )}
                </div>
                <div
                  className="text-xs h-7 bg-transparent border border-border rounded-md flex items-center justify-center cursor-pointer hover:bg-muted px-2 mr-2"
                  onClick={handleDownload}
                  title="Download video"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </div>
                <div
                  className="text-xs h-7 bg-transparent border border-border rounded-md flex items-center justify-center cursor-pointer hover:bg-muted px-2"
                  onClick={() => window.open(editData.url, "_blank")}
                  title="Open video in new tab"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Open
                </div>
              </div>
            )}

            {analyzed && analysis && (
              <div className="mt-4 space-y-3 pt-3 border-t border-border/50">
                {analysis.summary && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
                      <MessageSquare className="w-3 h-3" />
                      AI Summary
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic bg-muted/30 p-2 rounded-lg border border-border/30">
                      "{analysis.summary}"
                    </p>
                  </div>
                )}
                
                {analysis.transcription && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
                      <Captions className="w-3 h-3" />
                      Transcription
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-4 leading-relaxed bg-black/5 dark:bg-white/5 p-2 rounded-md font-mono">
                      {analysis.transcription}
                    </p>
                  </div>
                )}

                {analysis.tags && analysis.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.tags.slice(0, 5).map((tag, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-muted text-[9px] text-muted-foreground border border-border/50">
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
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
        />
      </div>
    );
  },
);

VideoNode.displayName = "VideoNode";
