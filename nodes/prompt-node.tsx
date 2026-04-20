"use client";

import { useState, useCallback, useEffect } from "react";
import { Handle, NodeResizer, Position, type NodeProps } from "reactflow";
import { X, Loader2, Monitor } from "lucide-react";
import { WorkflowPremiumInput } from "@/components/ui/workflow-premium-input";
import { cn } from "@/lib/utils";
import { apiResponse } from "@/utils/apiResponse";
import { modelApi } from "@/utils/inspire-api";
import { Model } from "@/types/inspire";

const CONTENT_TYPES = [
  // { id: "all", label: "All" },
  { id: "text", label: "Text" },
  { id: "image", label: "Image" },
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio" },
];

const ASPECT_RATIOS = [
  { value: "auto", label: "Auto Orientation" },
  { value: "16:9", label: "Landscape 16:9" },
  { value: "9:16", label: "Portrait 9:16" },
  { value: "1:1", label: "Square 1:1" },
  { value: "4:3", label: "Standard 4:3" },
];

interface PromptNodeData {
  title?: string;
  onRemoveNode?: (id: string) => void;
  onAIAction?: (id: string, actions: any[]) => Promise<any[]>;
  onDataChange?: (newData: any) => void;
  nodeId?: string;
  projectId?: string;
  contentType?: "text" | "image" | "video" | "audio";
  model?: string;
  aspectRatio?: string;
}

export function PromptNode({
  data,
  isConnectable,
  selected,
}: NodeProps<PromptNodeData>) {
  const [value, setValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState<string>(
    data.contentType || "text",
  );
  const [selectedModel, setSelectedModel] = useState(data.model || "");
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [aspectRatio, setAspectRatio] = useState(data.aspectRatio || "16:9");

  // Persist state changes to the node data so they survive refresh
  useEffect(() => {
    data.onDataChange?.({
      contentType,
      model: selectedModel,
      aspectRatio,
    });
  }, [contentType, selectedModel, aspectRatio]);

  // Fetch models
  const handleSelectHistoryItem = useCallback(
    (item: any) => {
      console.log("📜 [PromptNode] Selected history item:", item);
      // Create a node based on the history item type
      const nodeType = item.type;
      const nodeData = {
        title: item.prompt || `${nodeType} from history`,
        url: item.url,
        content: item.content,
        instruction: item.prompt,
      };

      // We'll emit an action to the workflow similar to how AI does it
      const action = {
        name: "create_node",
        args: {
          type: nodeType,
          data: nodeData,
        },
      };

      const socket = (window as any).socket;
      if (socket && data.projectId) {
        socket.emit("workflow:ai:update", {
          projectId: data.projectId,
          nodeId: data.nodeId,
          actions: [action],
          text: `Added ${nodeType} from history.`,
        });
      }
    },
    [data.projectId, data.nodeId],
  );

  useEffect(() => {
    modelApi
      .getAll()
      .then((res) => {
        if (res.success && res.data) {
          setAvailableModels(res.data);
          
          // Improved default selection logic
          const relevantModels = res.data.filter((m: any) => m.type === contentType);
          const isCurrentModelValid = relevantModels.some((m: any) => m.modelId === selectedModel);
          
          if (!selectedModel || selectedModel === "" || !isCurrentModelValid) {
            const def = relevantModels.find((m: any) => m.isDefault) || relevantModels[0];
            if (def) setSelectedModel(def.modelId);
          }
        }
      })
      .catch(() => {});
  }, [contentType, data.model, selectedModel]);

  const filteredModels = availableModels.filter((m) => m.type === contentType);

  const handleContentTypeChange = (type: string) => {
    setContentType(type);
    const def = availableModels.find((m: any) => m.type === type && m.isDefault);
    if (def) setSelectedModel(def.modelId);
    else setSelectedModel("");
  };

  const handleSubmit = useCallback(async () => {
    if (!value.trim() || isGenerating) return;

    setIsGenerating(true);
    const currentPrompt = value;
    setValue("");

    try {
      const res = await apiResponse.post(
        "/apps/workflow/ai/process",
        {
          projectId: data.projectId,
          nodeId: data.nodeId,
          prompt: currentPrompt,
          modelId: selectedModel,
          contentType,
          ...(contentType === "video" || contentType === "image"
            ? { aspectRatio }
            : {}),
        },
        { withCredentials: true },
      );

      if (res.data.success && data.onAIAction && data.nodeId) {
        const { text, url, actions } = res.data.data || {};

        // Build create_node action for the output
        const outputAction = {
          name: "create_node",
          args: {
            type: contentType,
            data: {
              title: currentPrompt.slice(0, 40),
              instruction: currentPrompt,
              content: text || "",
              url: url || "",
            },
          },
        };

        const allActions = actions?.length ? actions : [outputAction];
        await data.onAIAction(data.nodeId, allActions);
      }
    } catch (err) {
      console.error("PromptNode AI error:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [value, isGenerating, contentType, selectedModel, aspectRatio, data]);

  return (
    <div className="relative group min-w-[500px] max-w-[600px]">
      <NodeResizer
        color="#3b82f6"
        isVisible={selected}
        minWidth={280}
        minHeight={100}
        handleClassName="w-3 h-3 bg-primary border-2 border-white rounded shadow-lg"
      />

      {/* Input Context Handle (Target) */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500 border-2 border-background"
      />

      {/* Remove button */}
      {data.onRemoveNode && data.nodeId && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onRemoveNode?.(data.nodeId!);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors shadow-lg z-30 opacity-0 group-hover:opacity-100"
          title="Remove node"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      <div className="bg-background/90 backdrop-blur-md border border-border rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Content-type tabs */}
        <div className="flex items-center px-3 border border-gray-200 dark:border-neutral-800 rounded-md w-fit m-2">
          {CONTENT_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => handleContentTypeChange(t.id)}
              className={cn(
                "flex-1 px-2 py-1 my-1 w-full rounded-md text-[10px] font-semibold transition-all",
                contentType === t.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Video orientation picker — shown as leftContent next to model selector */}
        {/* Input */}
        <div className="">
          {isGenerating && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-b-3xl">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Generating…
              </div>
            </div>
          )}
          <WorkflowPremiumInput
            value={value}
            onChange={setValue}
            onSubmit={handleSubmit}
            placeholder={
              contentType === "image"
                ? "Describe the image…"
                : contentType === "video"
                  ? "Describe the video…"
                  : contentType === "audio"
                    ? "Describe the audio…"
                    : "Type your prompt…"
            }
            isGenerating={isGenerating}
            contentType={contentType as any}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            availableModels={filteredModels}
            onSelectHistoryItem={handleSelectHistoryItem}
            className="border-none shadow-none bg-transparent"
            minHeight="120px"
          />
        </div>
      </div>

      {/* Output Results Handle (Source) */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500 border-2 border-background"
      />
    </div>
  );
}
