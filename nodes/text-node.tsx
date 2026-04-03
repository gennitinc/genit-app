"use client";

import { memo, useState, useEffect } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { FileText, Edit3, Save, X, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";

interface TextNodeData {
  label?: string;
  content?: string;
  status?: "public" | "private";
  type?: string;
  onRemoveNode?: (nodeId: string) => void;
  nodeId?: string;
}

export const TextNode = memo(
  ({ data, isConnectable }: NodeProps<TextNodeData>) => {
    const {
      label = "Text Content",
      content = "",
      status = "public",
      type = "text",
    } = data;

    const [editData, setEditData] = useState({
      label: label || "",
      content: content || "",
      status: status || "public",
      hasLabel: (label || "").trim() !== "",
    });
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleSave = () => {
      console.log("Saving text node data:", editData);
      setIsEditOpen(false);
    };

    // Update internal state when node data changes (e.g. after AI generation)
    useEffect(() => {
      setEditData({
        label: label || "",
        content: content || "",
        status: status || "public",
        hasLabel: (label || "").trim() !== "",
      });
    }, [label, content, status]);

    return (
      <div className="relative bg-card border border-border rounded-[1.5rem] shadow-sm p-2 w-[450px] min-w-[300px] min-h-[200px]">
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-blue-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-green-500 border-2 border-white"
        />

        {/* Remove Button */}
        {data.onRemoveNode && data.nodeId && (
          <button
            onClick={() => data.onRemoveNode!(data.nodeId!)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors duration-200 shadow-lg"
            title="Remove node"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        <div className="flex items-start space-x-3 h-full">
          <div className="flex-1 min-w-0 flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <h3 className="font-semibold text-xs truncate">
                  {editData.hasLabel && editData.label.trim()
                    ? editData.label
                    : "Text Content"}
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
                <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
                  <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Edit Text Content</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="label">Label</Label>
                        <button
                          type="button"
                          onClick={() =>
                            setEditData((prev) => ({
                              ...prev,
                              hasLabel: !prev.hasLabel,
                              label: !prev.hasLabel ? prev.label : "",
                            }))
                          }
                          className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none  ${
                            editData.hasLabel ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <span
                            className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                              editData.hasLabel
                                ? "translate-x-3.5"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                      {editData.hasLabel && (
                        <Textarea
                          id="label"
                          value={editData.label}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              label: e.target.value,
                            }))
                          }
                          placeholder="Document your file so you can remember them"
                          className="min-h-[80px] resize-none"
                        />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <div className="flex items-center space-x-3 mt-1">
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
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={editData.content}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        placeholder="Enter your text content..."
                        className="min-h-[400px] mt-1"
                      />
                    </div>
                  </div>
                  <div className="p-6 pt-2 border-t flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="text-xs text-muted-foreground bg-muted p-4 rounded-[1.5rem] border border-border flex-1 overflow-y-auto max-h-[400px] nodrag nowheel cursor-text select-text">
              {editData.content ? (
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2 border-b pb-1" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-base font-bold mb-1 mt-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-[11px] font-bold mb-1 mt-2" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="mb-0.5" {...props} />,
                    code: ({node, ...props}: any) => (
                      <code className="bg-background/50 px-1 rounded text-[10px] font-mono" {...props} />
                    ),
                    pre: ({node, ...props}: any) => (
                      <pre className="bg-background/50 p-2 rounded-lg my-2 overflow-x-auto font-mono text-[10px]" {...props} />
                    ),
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-2 border-primary/30 pl-3 italic my-2" {...props} />
                    ),
                  }}
                >
                  {editData.content}
                </ReactMarkdown>
              ) : (
                "No content available. Click edit to add text."
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

TextNode.displayName = "TextNode";
