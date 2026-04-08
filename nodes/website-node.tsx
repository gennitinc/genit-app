"use client";

import { memo } from "react";
import { Handle, Position, NodeResizer, type NodeProps } from "reactflow";
import { Globe, ExternalLink, Edit3, Trash2, X, Sparkles, Loader2, MessageSquare, ListCheck, Search, Lock, Unlock } from "lucide-react";
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
import { useState } from "react";

interface WebsiteNodeData {
  url?: string;
  title?: string;
  description?: string;
  favicon?: string;
  onRemoveNode?: (nodeId: string) => void;
  onAnalyze?: () => void;
  nodeId?: string;
  analyzed?: boolean;
  analysis?: {
    summary?: string;
    description?: string;
    tags?: string[];
  };
}

export const WebsiteNode = memo(
  ({ data, isConnectable, selected }: NodeProps<WebsiteNodeData>) => {
    const {
      url = "",
      title = "Website",
      description = "Web content source",
      analyzed = false,
      analysis = null,
      onAnalyze,
    } = data;

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [editData, setEditData] = useState({
      url: url,
      title: title,
      description: description,
    });
    const [isEditOpen, setIsEditOpen] = useState(false);

    const getDomain = (url: string) => {
      try {
        return new URL(url).hostname.replace("www.", "");
      } catch {
        return url;
      }
    };

    const handleSave = () => {
      console.log("[v0] Saving website node data:", editData);
      setIsEditOpen(false);
    };

    return (
      <div className="relative rounded-[1.5rem]">
        <NodeResizer
          color="#3b82f6"
          isVisible={selected}
          minWidth={150}
          minHeight={80}
          handleClassName="w-3 h-3 bg-primary border-2 border-white rounded shadow-lg"
        />
        <div
          className={`bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 w-80 min-w-[150px] min-h-[80px] relative ${
            selected
              ? "ring-2 ring-primary ring-offset-2"
              : "hover:ring-1 hover:ring-primary/50"
          }`}
        >
          <Handle
            type="target"
            position={Position.Left}
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
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">
                    {editData.title}
                  </h3>
                  <Badge variant="secondary" className="text-[10px] h-4 px-1">
                    Website
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  {!analyzed && onAnalyze && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async (e) => {
                        e.stopPropagation();
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
                        <DialogTitle>Edit Website</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="url">Website URL</Label>
                          <Input
                            id="url"
                            value={editData.url}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                url: e.target.value,
                              }))
                            }
                            placeholder="https://example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={editData.title}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Website title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={editData.description}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Website description"
                            rows={3}
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
              </div>

              {editData.url && (
                <div className="text-xs text-muted-foreground mb-2 truncate">
                  {getDomain(editData.url)}
                </div>
              )}

              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {editData.description}
              </p>

              {editData.url && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-[10px] h-7 bg-transparent"
                  onClick={() => window.open(editData.url, "_blank")}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Visit Site
                </Button>
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
                  
                  {analysis.description && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
                        <Search className="w-3 h-3" />
                        Key Insights
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed bg-black/5 dark:bg-white/5 p-2 rounded-md">
                        {analysis.description}
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

        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-primary"
          isConnectable={isConnectable}
        />
      </div>
    );
  }
);

WebsiteNode.displayName = "WebsiteNode";
