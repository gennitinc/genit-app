"use client";

import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
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
import { TikTokEmbed } from "react-social-media-embed";
import { ExternalLink, Edit3, X, Lock, Unlock } from "lucide-react";

interface TikTokNodeData {
  instruction?: string;
  status?: "public" | "private";
  url?: string;
  username?: string;
  postId?: string;
  onRemoveNode?: (nodeId: string) => void;
  nodeId?: string;
}

export const TikTokNode = memo(
  ({ data, isConnectable, selected }: NodeProps<TikTokNodeData>) => {
    const {
      instruction = "",
      status = "public",
      url = "",
      username = "",
    } = data;

    const [editData, setEditData] = useState({
      instruction: instruction || "",
      status: status || "public",
      url: url || "",
      username: username || "",
    });
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleSave = () => {
      console.log("[v0] Saving TikTok node data:", editData);
      setIsEditOpen(false);
    };

    const handlePostClick = () => {
      if (editData.url) {
        window.open(editData.url, "_blank");
      }
    };

    return (
      <div className="relative rounded-[1.5rem]">
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

        <Card className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group w-full">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <defs>
                    <linearGradient
                      id="tiktok-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#25F4EE" />
                      <stop offset="50%" stopColor="#FE2C55" />
                      <stop offset="100%" stopColor="#000000" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#tiktok-gradient)"
                    d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
                  />
                </svg>
                <span className="text-sm font-semibold text-foreground">
                  TikTok
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
                      <DialogTitle>Edit TikTok Post</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="url">TikTok URL</Label>
                        <Input
                          id="url"
                          value={editData.url}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              url: e.target.value,
                            }))
                          }
                          placeholder="https://www.tiktok.com/..."
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
                          placeholder="Document your file so you can remember them"
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
                      <div>
                        <Label htmlFor="username">Username (Optional)</Label>
                        <Input
                          id="username"
                          value={editData.username}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              username: e.target.value,
                            }))
                          }
                          placeholder="username"
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
                {editData.url && (
                  <button
                    onClick={handlePostClick}
                    className="p-1 hover:bg-muted rounded-md transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {editData.url && (
              <div className="mt-3">
                <TikTokEmbed url={editData.url} width="100%" />
              </div>
            )}

            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed">
                  {editData.instruction || "TikTok Post"}
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
              {editData.username && (
                <p className="text-xs text-muted-foreground mt-1">
                  @{editData.username}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-red-500 border-2 border-white"
          isConnectable={isConnectable}
        />
      </div>
    );
  },
);

TikTokNode.displayName = "TikTokNode";
