"use client";

import { memo } from "react";
import { Handle, Position, NodeResizer, type NodeProps } from "reactflow";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Youtube,
  Play,
  ExternalLink,
  Edit3,
  Trash2,
  X,
  Lock,
  Unlock,
} from "lucide-react";
import { useState } from "react";
import { YouTubeEmbed } from "react-social-media-embed";

interface YouTubeNodeData {
  instruction?: string;
  status?: "public" | "private";
  url?: string;
  videoId?: string;
  thumbnail?: string;
  onRemoveNode?: (nodeId: string) => void;
  nodeId?: string;
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
    } = safeData;

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
        <div className="relative">
          <Handle
            type="target"
            position={Position.Left}
            className="w-3 h-3 bg-red-500 border-2 border-white"
            isConnectable={isConnectable}
          />

          {/* Remove Button */}
          {data.onRemoveNode && data.nodeId && (
            <button
              onClick={() => data.onRemoveNode!(data.nodeId!)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors duration-200 shadow-lg z-10"
              title="Remove node"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          <Card className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 256 180"
                    width="256"
                    height="180"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid"
                  >
                    <path
                      d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z"
                      fill="red"
                    />
                    <path
                      fill="#FFF"
                      d="m102.421 128.06 66.328-38.418-66.328-38.418z"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-foreground">
                    YouTube
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-1 h-auto">
                        <Edit3 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit YouTube Video</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="url">YouTube URL</Label>
                          <Input
                            id="url"
                            value={editData.url}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                url: e.target.value,
                              }))
                            }
                            placeholder="https://www.youtube.com/watch?v=..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="instruction">Instruction</Label>
                          <Textarea
                            id="instruction"
                            value={editData.instruction}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                instruction: e.target.value,
                              }))
                            }
                            placeholder="How should AI handle this content?"
                            className="min-h-[80px] resize-none"
                          />
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
                                    prev.status === "public"
                                      ? "private"
                                      : "public",
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
                  {editData.url && (
                    <button
                      onClick={handleVideoClick}
                      className="p-1 hover:bg-muted rounded-md transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>

              {editData.url && (
                <div className="mt-3">
                  <YouTubeEmbed url={editData.url} width="100%" />
                </div>
              )}

              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed">
                    {displayTitle}
                  </p>
                  <div className="flex items-center space-x-1 ml-2">
                    {editData.status === "private" ? (
                      <Lock className="w-3 h-3 text-red-500" />
                    ) : (
                      <Unlock className="w-3 h-3 text-green-500" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {editData.status}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {videoId ? `Video ID: ${videoId}` : "YouTube Content"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Handle
            type="source"
            position={Position.Right}
            className="w-3 h-3 bg-red-500 border-2 border-white"
            isConnectable={isConnectable}
          />

          {/* Delete Button - Only show when selected */}
          {selected && data.onRemoveNode && data.nodeId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => data.onRemoveNode!(data.nodeId!)}
              className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full bg-destructive hover:bg-destructive/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              title="Delete Node"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </>
    );
  }
);

YouTubeNode.displayName = "YouTubeNode";
