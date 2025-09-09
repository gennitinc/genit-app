"use client";

import { memo, useState } from "react";
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
import { LinkedInEmbed } from "react-social-media-embed";
import { Linkedin, ExternalLink, Edit3, X, Lock, Unlock } from "lucide-react";

interface LinkedInNodeData {
  instruction?: string;
  status?: "public" | "private";
  url?: string;
  username?: string;
  postId?: string;
  onRemoveNode?: (nodeId: string) => void;
  nodeId?: string;
}

export const LinkedInNode = memo(
  ({ data, isConnectable, selected }: NodeProps<LinkedInNodeData>) => {
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
      console.log("[v0] Saving LinkedIn node data:", editData);
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
            className="w-3 h-3 bg-blue-700 border-2 border-white"
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
                  <div className="p-1.5 bg-blue-700/10 rounded-lg">
                    <Linkedin className="w-4 h-4 text-blue-700" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    LinkedIn
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
                        <DialogTitle>Edit LinkedIn Post</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="url">LinkedIn URL</Label>
                          <Input
                            id="url"
                            value={editData.url}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                url: e.target.value,
                              }))
                            }
                            placeholder="https://www.linkedin.com/posts/..."
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
                  <LinkedInEmbed url={editData.url} width="100%" />
                </div>
              )}

              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed">
                    {editData.instruction || "LinkedIn Post"}
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
            className="w-3 h-3 bg-blue-700 border-2 border-white"
            isConnectable={isConnectable}
          />
        </div>
      </>
    );
  }
);

LinkedInNode.displayName = "LinkedInNode";
