"use client";

import { memo, useState, useEffect } from "react";
import { Handle, Position, NodeResizer, type NodeProps } from "reactflow";
import {
  FileText,
  Trash2,
  ExternalLink,
  Download,
  X,
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

interface DocumentNodeData {
  instruction?: string;
  status?: "public" | "private";
  url?: string;
  type?: string;
  docType?: string;
  size?: string;
  onRemoveNode?: (nodeId: string) => void;
  nodeId?: string;
}

export const DocumentNode = memo(
  ({ data, isConnectable, selected }: NodeProps<DocumentNodeData>) => {
    const {
      instruction = "Document",
      status = "public",
      url = "",
      type = "document",
      docType = "Document",
      size = "",
    } = data;

    const [editData, setEditData] = useState({
      instruction: instruction || "",
      status: status || "public",
      url: url || "",
      hasInstruction: (instruction || "").trim() !== "",
    });
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleSave = () => {
      console.log("Saving document node data:", editData);
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
        link.download = editData.instruction || "document";
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

    const getFileIcon = (fileName: string) => {
      const extension = fileName.split(".").pop()?.toLowerCase();
      switch (extension) {
        case "pdf":
          return "📄";
        case "doc":
        case "docx":
          return "📝";
        case "xls":
        case "xlsx":
          return "📊";
        case "ppt":
        case "pptx":
          return "📈";
        case "txt":
          return "📄";
        default:
          return "📄";
      }
    };

    return (
      <div className="relative rounded-[1.5rem]">
        <NodeResizer
          color="#3b82f6"
          isVisible={selected}
          minWidth={200}
          minHeight={120}
          handleClassName="w-3 h-3 bg-primary border-2 border-white rounded shadow-lg"
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

        <div
          className={`bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 w-80 min-w-[200px] min-h-[120px] relative cursor-grab active:cursor-grabbing ${
            selected
              ? "ring-2 ring-primary ring-offset-2"
              : "hover:ring-1 hover:ring-primary/50"
          }`}
          style={{ userSelect: "none" }}
        >
          <Handle
            type="target"
            position={Position.Top}
            className="w-3 h-3 bg-primary"
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

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <h3 className="font-semibold text-xs truncate">
                    {editData.hasInstruction && editData.instruction.trim()
                      ? editData.instruction
                      : "Document"}
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
                      <DialogTitle>Edit Document Content</DialogTitle>
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
                              editData.hasInstruction
                                ? "bg-primary"
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
                        <Label htmlFor="url">Document URL</Label>
                        <Input
                          id="url"
                          value={editData.url}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              url: e.target.value,
                            }))
                          }
                          placeholder="https://example.com/document.pdf"
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

              <div className="flex items-center space-x-2 mb-2">
                <Badge
                  variant="secondary"
                  className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                >
                  {docType}
                </Badge>
              </div>

              <div className="space-y-1 mb-3">
                {size && (
                  <div className="text-xs text-muted-foreground">
                    Size: {size}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Type: {type}
                </div>
              </div>

              <div className="mb-3">
                <div className="w-full h-16 bg-muted rounded-md border border-border flex items-center justify-center text-2xl">
                  {getFileIcon(editData.instruction)}
                </div>
              </div>

              {editData.url && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs h-7 bg-transparent"
                    onClick={() => window.open(editData.url, "_blank")}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 bg-transparent"
                    onClick={handleDownload}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

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

          <Handle
            type="source"
            position={Position.Bottom}
            className="w-3 h-3 bg-primary"
            isConnectable={isConnectable}
          />
        </div>
      </div>
    );
  },
);

DocumentNode.displayName = "DocumentNode";
