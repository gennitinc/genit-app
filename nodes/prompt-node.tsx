"use client";

import { useState, useCallback, useEffect } from "react";
import { Handle, NodeResizer, Position, type NodeProps } from "reactflow";
import { Maximize, Plus, Minus, X } from "lucide-react";
import { WorkflowPremiumInput } from "@/components/ui/workflow-premium-input";
import { cn } from "@/lib/utils";
import { apiResponse } from "@/utils/apiResponse";
import { modelApi } from "@/utils/inspire-api";
import { Model } from "@/types/inspire";
import {
  Sheet,
  SheetContent,
  SheetOverlay,
  SheetPortal,
} from "@/components/ui/sheet";

interface PromptNodeData {
  title?: string;
  messages?: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }>;
  onRemoveNode?: (id: string) => void;
  onAIAction?: (id: string, actions: any[]) => void;
  onDataChange?: (newData: any) => void;
  onMaximize?: () => void;
  nodeId?: string;
  projectId?: string;
  contentType?: "text" | "image" | "video" | "audio";
  model?: string;
  addedNodes?: Record<string, string>; // messageId -> nodeId
}

export function PromptNode({
  data,
  isConnectable,
  selected,
}: NodeProps<PromptNodeData>) {
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
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [addedNodes, setAddedNodes] = useState<Record<string, string>>(
    data.addedNodes || {},
  );
  const [isMaximized, setIsMaximized] = useState(false);

  // Sync messages with parent state for persistence
  const { onDataChange } = data;

  useEffect(() => {
    if (onDataChange) {
      onDataChange({ messages, addedNodes, contentType, model: selectedModel });
    }
  }, [messages, addedNodes, contentType, selectedModel, onDataChange]);

  // Fetch models from database
  useEffect(() => {
    const fetchModels = async () => {
      setIsLoadingModels(true);
      try {
        const res = await modelApi.getAll();
        if (res.success && res.data) {
          setAvailableModels(res.data);

          // Set default model for current content type if not already set
          if (!data.model) {
            const defaultModel = res.data.find(
              (m) => m.type === contentType && m.isDefault,
            );
            if (defaultModel) {
              setSelectedModel(defaultModel.modelId);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch models in PromptNode:", err);
      } finally {
        setIsLoadingModels(false);
      }
    };
    fetchModels();
  }, [contentType, data.model]);

  // Filter models based on content type
  const filteredModels = availableModels.filter((m) => m.type === contentType);

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

    // Call real AI API
    setIsGenerating(true);
    const currentPrompt = value;
    setValue("");

    apiResponse
      .post(
        "/apps/workflow/ai/process",
        {
          projectId: data.projectId,
          nodeId: data.nodeId,
          prompt: currentPrompt,
          modelId: selectedModel,
        },
        { withCredentials: true },
      )
      .then((res) => {
        if (res.data.success) {
          const { text, actions } = res.data.data;

          const assistantMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant" as const,
            content: text || "Processing your request...",
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, assistantMessage]);

          // Handle AI actions (creating nodes, connecting them)
          if (actions && actions.length > 0 && data.onAIAction && data.nodeId) {
            data.onAIAction(data.nodeId, actions);
          }
        }
      })
      .catch((error) => {
        console.error("Failed to process AI request in PromptNode:", error);
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: "Sorry, I encountered an error processing your request.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      })
      .finally(() => {
        setIsGenerating(false);
      });
  }, [value, data.projectId, data.nodeId, data.onAIAction, selectedModel]);

  const handleAddNodeToCanvas = useCallback(
    async (msgId: string, content: string) => {
      if (data.onAIAction && data.nodeId) {
        const results = await (data.onAIAction(data.nodeId, [
          {
            name: "create_node",
            args: {
              type: contentType,
              data: {
                title: `From AI: ${content.slice(0, 20)}...`,
                instruction: content,
                content: content,
              },
            },
          },
        ]) as unknown as Promise<any[]>);

        if (results && results.length > 0 && results[0].id) {
          setAddedNodes((prev) => ({
            ...prev,
            [msgId]: results[0].id,
          }));
        }
      }
    },
    [data.onAIAction, data.nodeId, contentType],
  );

  const handleRemoveNodeFromCanvas = useCallback(
    (msgId: string) => {
      const nodeIdToRemove = addedNodes[msgId];
      if (nodeIdToRemove && data.onRemoveNode) {
        data.onRemoveNode(nodeIdToRemove);
        setAddedNodes((prev) => {
          const newState = { ...prev };
          delete newState[msgId];
          return newState;
        });
      }
    },
    [addedNodes, data.onRemoveNode],
  );

  return (
    <div className="relative group min-w-[350px] max-w-[500px] rounded-[1.5rem]">
      <NodeResizer
        color="#3b82f6"
        isVisible={selected}
        minWidth={150}
        minHeight={80}
        handleClassName="w-3 h-3 bg-primary border-2 border-white rounded shadow-lg"
      />
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
        <div className="flex flex-row items-center justify-between">
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
                  // Reset model to default for that type from available models
                  const defaultModel = availableModels.find(
                    (m) => m.type === t.id && m.isDefault,
                  );
                  if (defaultModel) {
                    setSelectedModel(defaultModel.modelId);
                  } else {
                    // Fallback to hardcoded defaults
                    const fallbackModel =
                      t.id === "text"
                        ? "gpt-4o"
                        : t.id === "image"
                          ? "stable-diffusion-3"
                          : t.id === "video"
                            ? "sora"
                            : "elevenlabs";
                    setSelectedModel(fallbackModel);
                  }
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
          <button
            onClick={() => setIsMaximized(true)}
            className="p-1 hover:bg-muted rounded-md w-fit transition-colors mr-8"
          >
            <Maximize className="size-4 text-muted-foreground" />
          </button>
        </div>
        {messages.length > 0 && (
          <div className="px-4 pb-4 pt-0 max-h-[200px] overflow-y-auto space-y-2 mt-2 scrollbar-none">
            {messages.slice(-3).map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "text-xs p-2 rounded-xl max-w-[90%] relative group",
                  msg.role === "user"
                    ? "bg-primary/10 text-primary self-end ml-auto"
                    : "bg-muted text-muted-foreground self-start mr-auto",
                )}
              >
                {msg.content}
                {msg.role === "assistant" && (
                  <div className="absolute -bottom-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!addedNodes[msg.id] ? (
                      <button
                        onClick={() =>
                          handleAddNodeToCanvas(msg.id, msg.content)
                        }
                        className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
                        title="Add to canvas"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRemoveNodeFromCanvas(msg.id)}
                        className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md"
                        title="Remove from canvas"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <WorkflowPremiumInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder="Enter a prompt..."
          isGenerating={isGenerating}
          contentType={contentType}
          selectedModel={selectedModel}
          onModelChange={(model) => setSelectedModel(model)}
          availableModels={filteredModels}
          className="border-none shadow-none bg-transparent"
        />
      </div>

      <Sheet open={isMaximized} onOpenChange={setIsMaximized}>
        <SheetPortal>
          {/* <SheetOverlay className="backdrop-blur-xl bg-black/60" /> */}
          <SheetContent
            side="right"
            className="p-0 overflow-hidden border-none bg-transparent shadow-none w-full sm:max-w-lg h-full"
          >
            <div className="w-full h-full bg-background/95 backdrop-blur-1xl rounded-l-2xl border border-white/20 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] p-0 flex flex-col relative">
              {/* Close/Minimize button */}
              {/* <button
                onClick={() => setIsMaximized(false)}
                className="absolute top-1 right-2 p-2 z-0 text-muted-foreground hover:text-foreground"
              >
                <X className="size-6" />
              </button> */}

              <div className="flex-1 flex flex-col p-1 overflow-hidden">
                <div className="flex items-center justify-between mb-8 p-4">
                  <div className="flex items-center gap-2">
                    {/* <div className="size-3 rounded-full bg-primary animate-pulse" /> */}
                    <h2 className="text-xl font-semibold tracking-tight">
                      Chat node
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 pr-4">
                    {[
                      { id: "text", label: "Text" },
                      { id: "image", label: "Image" },
                      { id: "video", label: "Video" },
                      { id: "audio", label: "Audio" },
                    ].map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setContentType(t.id as any);
                          // Reset model to default for that type from available models
                          const defaultModel = availableModels.find(
                            (m) => m.type === t.id && m.isDefault,
                          );
                          if (defaultModel) {
                            setSelectedModel(defaultModel.modelId);
                          } else {
                            // Fallback to hardcoded defaults
                            const fallbackModel =
                              t.id === "text"
                                ? "gpt-4o"
                                : t.id === "image"
                                  ? "stable-diffusion-3"
                                  : t.id === "video"
                                    ? "sora"
                                    : "elevenlabs";
                            setSelectedModel(fallbackModel);
                          }
                        }}
                        className={cn(
                          "px-1 py-0 rounded-xs text-sm font-medium transition-all cursor-pointer",
                          contentType === t.id
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {t.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 pr-4 mb-8 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent px-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "p-2 rounded-sm max-w-[85%] relative group text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-primary/10 text-primary self-end ml-auto"
                          : "bg-muted text-muted-foreground self-start mr-auto",
                      )}
                    >
                      {msg.content}
                      {msg.role === "assistant" && (
                        <div className="absolute -bottom-3 -right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!addedNodes[msg.id] ? (
                            <button
                              onClick={() =>
                                handleAddNodeToCanvas(msg.id, msg.content)
                              }
                              className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                              title="Add to canvas"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRemoveNodeFromCanvas(msg.id)}
                              className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                              title="Remove from canvas"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="bg-muted text-muted-foreground self-start mr-auto p-6 rounded-[2rem] max-w-[85%] animate-pulse">
                      Generating...
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  <WorkflowPremiumInput
                    value={value}
                    onChange={setValue}
                    onSubmit={handleSubmit}
                    placeholder="Enter a prompt... Shift+Enter for new line"
                    isGenerating={isGenerating}
                    contentType={contentType}
                    selectedModel={selectedModel}
                    onModelChange={(model) => setSelectedModel(model)}
                    availableModels={filteredModels}
                    className="border-none shadow-none bg-transparent"
                  />
                </div>
              </div>
            </div>
          </SheetContent>
        </SheetPortal>
      </Sheet>

      <Handle
        type="target"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
    </div>
  );
}
