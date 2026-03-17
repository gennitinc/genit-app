"use client";

import { memo, useState } from "react";
import { Handle, Position, NodeResizer, type NodeProps } from "reactflow";
import { Card, CardContent } from "@/components/ui/card";
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
import { TwitterEmbed } from "react-social-media-embed";
import { Twitter, ExternalLink, Edit3, X, Lock, Unlock } from "lucide-react";

interface TwitterNodeData {
  url?: string;
  instruction?: string;
  status?: "public" | "private";
  username?: string;
  tweetId?: string;
  onRemoveNode?: (nodeId: string) => void;
  nodeId?: string;
}

export const TwitterNode = memo(
  ({ data, isConnectable, selected }: NodeProps<TwitterNodeData>) => {
    const {
      url = "",
      instruction = "Twitter Post",
      status = "public",
      username = "",
    } = data;

    const [editData, setEditData] = useState({
      url: url,
      instruction: instruction || "",
      status: status || "public",
      username: username || "",
    });
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleSave = () => {
      console.log("[v0] Saving Twitter node data:", editData);
      setIsEditOpen(false);
    };

    const handlePostClick = () => {
      if (editData.url) {
        window.open(editData.url, "_blank");
      }
    };

    return (
      <>
        <div className="relative">
          <Handle
            type="target"
            position={Position.Left}
            className="w-3 h-3 bg-blue-500 border-2 border-white"
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

          <Card className="w-80 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group min-w-[320px] min-h-[200px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-sm font-semibold text-foreground">
                    Twitter
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
                        <DialogTitle>Edit Twitter Post</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="url">Twitter URL</Label>
                          <Input
                            id="url"
                            value={editData.url}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                url: e.target.value,
                              }))
                            }
                            placeholder="https://twitter.com/username/status/..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="instruction">Instruction</Label>
                          <Input
                            id="instruction"
                            value={editData.instruction}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                instruction: e.target.value,
                              }))
                            }
                            placeholder="How should AI handle this content?"
                          />
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <select
                            id="status"
                            value={editData.status}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                status: e.target.value as "public" | "private",
                              }))
                            }
                            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                          >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                          </select>
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
                  <TwitterEmbed url={editData.url} width="100%" />
                </div>
              )}

              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed">
                    {editData.instruction || "Twitter Post"}
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
                  <p className="text-xs text-muted-foreground">
                    @{editData.username}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Handle
            type="source"
            position={Position.Right}
            className="w-3 h-3 bg-blue-500 border-2 border-white"
            isConnectable={isConnectable}
          />
        </div>
      </>
    );
  },
);

TwitterNode.displayName = "TwitterNode";
