"use client";

import { memo, useState, useEffect } from "react";
import { Handle, Position, NodeResizer, type NodeProps } from "reactflow";
import {
  Mic,
  Trash2,
  Play,
  Pause,
  X,
  ExternalLink,
  Edit3,
  Lock,
  Unlock,
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

interface AudioNodeData {
  instruction?: string;
  status?: "public" | "private";
  url?: string;
  type?: string;
  duration?: string;
  size?: string;
  onRemoveNode?: (nodeId: string) => void;
  nodeId?: string;
}

export const AudioNode = memo(
  ({ data, isConnectable, selected }: NodeProps<AudioNodeData>) => {
    const {
      instruction = "Audio File",
      status = "public",
      url = "",
      type = "audio",
      duration = "",
      size = "",
    } = data;

    const [editData, setEditData] = useState({
      instruction: instruction || "",
      status: status || "public",
      url: url || "",
      hasInstruction: (instruction || "").trim() !== "",
    });
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
    const [isAudioReady, setIsAudioReady] = useState(false);

    const handleSave = () => {
      console.log("Saving audio node data:", editData);
      setIsEditOpen(false);
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

    const handlePlayPause = async () => {
      if (audioRef) {
        try {
          if (isPlaying) {
            audioRef.pause();
            setIsPlaying(false);
          } else {
            // Ensure audio is loaded and ready
            if (audioRef.readyState < 2) {
              // HAVE_CURRENT_DATA
              await audioRef.load();
            }
            await audioRef.play();
            setIsPlaying(true);
          }
        } catch (error) {
          console.error("Audio play error:", error);
          setIsPlaying(false);
        }
      }
    };

    const handleAudioRef = (element: HTMLAudioElement | null) => {
      if (element) {
        setAudioRef(element);

        // Add event listeners for better state management
        element.addEventListener("canplaythrough", () => setIsAudioReady(true));
        element.addEventListener("ended", () => setIsPlaying(false));
        element.addEventListener("error", () => setIsPlaying(false));

        // Clean up function
        return () => {
          element.removeEventListener("canplaythrough", () =>
            setIsAudioReady(true),
          );
          element.removeEventListener("ended", () => setIsPlaying(false));
          element.removeEventListener("error", () => setIsPlaying(false));
        };
      }
    };

    return (
      <div className="relative bg-card border border-border rounded-[1.5rem] shadow-sm p-2 w-80 min-w-[200px] min-h-fit">
        <Handle
          type="target"
          position={Position.Top}
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
                    : "Audio File"}
                </h3>
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
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1 h-auto">
                    <Edit3 className="w-3 h-3 text-muted-foreground" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Audio Content</DialogTitle>
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
                      <Label htmlFor="url">Audio URL</Label>
                      <Input
                        id="url"
                        value={editData.url}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                        placeholder="https://example.com/audio.mp3"
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
                <audio
                  ref={handleAudioRef}
                  src={editData.url}
                  className="w-full"
                  controls
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={(e) => {
                    console.error("Audio error:", e);
                    setIsPlaying(false);
                  }}
                  onLoadedMetadata={() => setIsAudioReady(true)}
                  onCanPlay={() => setIsAudioReady(true)}
                />
              </div>
            )}

            {editData.url && (
              <div className="flex items-center justify-between">
                <div
                  className={`flex-1 text-xs h-7 border border-border rounded-md flex items-center justify-center cursor-pointer mr-2 ${
                    isAudioReady
                      ? "bg-transparent hover:bg-muted"
                      : "bg-muted/50 cursor-not-allowed"
                  }`}
                  onClick={isAudioReady ? handlePlayPause : undefined}
                  title={isAudioReady ? "Play/Pause audio" : "Audio loading..."}
                >
                  {!isAudioReady ? (
                    <>
                      <div className="w-3 h-3 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Loading...
                    </>
                  ) : isPlaying ? (
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
                  className="text-xs h-7 bg-transparent border border-border rounded-md flex items-center justify-center cursor-pointer hover:bg-muted px-2"
                  onClick={() => window.open(editData.url, "_blank")}
                  title="Open audio in new tab"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Open
                </div>
              </div>
            )}
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
        />
      </div>
    );
  },
);

AudioNode.displayName = "AudioNode";
