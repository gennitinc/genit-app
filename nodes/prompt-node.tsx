"use client";

import { useState, useCallback } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { X } from "lucide-react";
import { WorkflowPremiumInput } from "@/components/ui/workflow-premium-input";
import { cn } from "@/lib/utils";

interface PromptNodeData {
  title?: string;
  messages?: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }>;
  onRemoveNode?: (id: string) => void;
  nodeId?: string;
  contentType?: "text" | "image" | "video" | "audio";
  model?: string;
}

export function PromptNode({ data, isConnectable }: NodeProps<PromptNodeData>) {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState(data.messages || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState(data.contentType || "text");
  const [selectedModel, setSelectedModel] = useState(
    data.model ||
      (contentType === "text"
        ? "gpt-4o"
        : contentType === "image"
          ? "stable-diffusion-3"
          : contentType === "video"
            ? "sora"
            : "elevenlabs"),
  );

  const handleSubmit = useCallback(() => {
    if (!value.trim()) return;

    const newUserMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: value,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setValue("");

    // Simulate AI response
    setIsGenerating(true);
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: `I've received your prompt: "${newUserMessage.content}". How would you like me to process this?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsGenerating(false);
    }, 1000);
  }, [value]);

  return (
    <div className="relative group min-w-[350px] max-w-[500px]">
      <Handle
        type="source"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary border-2 border-background"
      />

      {/* Remove Button */}
      {data.onRemoveNode && data.nodeId && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onRemoveNode?.(data.nodeId!);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors duration-200 shadow-lg z-30 opacity-0 group-hover:opacity-100"
          title="Remove node"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      <div className="bg-background/80 backdrop-blur-md border border-border rounded-3xl shadow-2xl overflow-hidden p-1">
        <div className="flex items-center gap-1 p-2 border-b border-border/50">
          {[
            { id: "text", label: "Text", icon: "Type" },
            { id: "image", label: "Image", icon: "ImageIcon" },
            { id: "video", label: "Video", icon: "Play" },
            { id: "audio", label: "Audio", icon: "Music" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setContentType(t.id as any);
                // Reset model to default for that type
                const defaultModel =
                  t.id === "text"
                    ? "gpt-4o"
                    : t.id === "image"
                      ? "stable-diffusion-3"
                      : t.id === "video"
                        ? "sora"
                        : "elevenlabs";
                setSelectedModel(defaultModel);
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[10px] font-medium transition-all",
                contentType === t.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <WorkflowPremiumInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder="Enter a prompt..."
          isGenerating={isGenerating}
          contentType={contentType}
          selectedModel={selectedModel}
          onModelChange={(model) => setSelectedModel(model)}
          className="border-none shadow-none bg-transparent"
        />

        {messages.length > 0 && (
          <div className="px-4 pb-4 pt-0 max-h-[200px] overflow-y-auto space-y-2 mt-2 scrollbar-none">
            {messages.slice(-3).map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "text-xs p-2 rounded-xl max-w-[90%]",
                  msg.role === "user"
                    ? "bg-primary/10 text-primary self-end ml-auto"
                    : "bg-muted text-muted-foreground self-start mr-auto",
                )}
              >
                {msg.content}
              </div>
            ))}
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
    </div>
  );
}
