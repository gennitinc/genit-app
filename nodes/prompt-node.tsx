"use client";

import { WorkflowPremiumInput } from "@/components/ui/workflow-premium-input";
import { cn } from "@/lib/utils";
import { Model } from "@/types/inspire";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import { modelApi } from "@/utils/inspire-api";
import { Loader2, Monitor, X } from "lucide-react";
import { Handle, type NodeProps, NodeResizer, Position } from "reactflow";
import { useCallback, useEffect, useState } from "react";

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
    data.contentType || "text"
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
    [data.projectId, data.nodeId]
  );

  useEffect(() => {
    modelApi
      .getAll()
      .then((res) => {
        if (res.success && res.data) {
          setAvailableModels(res.data);

          // Improved default selection logic
          const relevantModels = res.data.filter(
            (m: any) => m.type === contentType
          );
          const isCurrentModelValid = relevantModels.some(
            (m: any) => m.modelId === selectedModel
          );

          if (!selectedModel || selectedModel === "" || !isCurrentModelValid) {
            const def =
              relevantModels.find((m: any) => m.isDefault) || relevantModels[0];
            if (def) setSelectedModel(def.modelId);
          }
        }
      })
      .catch(() => {});
  }, [contentType, data.model, selectedModel]);

  const filteredModels = availableModels.filter((m) => m.type === contentType);

  const handleContentTypeChange = (type: string) => {
    setContentType(type);
    const def = availableModels.find(
      (m: any) => m.type === type && m.isDefault
    );
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
        { withCredentials: true }
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
    <div className='group relative max-w-[600px] min-w-[500px]'>
      <NodeResizer
        color='#3b82f6'
        isVisible={selected}
        minWidth={280}
        minHeight={100}
        handleClassName='w-3 h-3 bg-indigo-600 hover:bg-indigo-700 border-2 border-white rounded shadow-lg'
      />

      {/* Input Context Handle (Target) */}
      <Handle
        type='target'
        position={Position.Left}
        isConnectable={isConnectable}
        className='border-background h-3 w-3 border-2 bg-blue-500'
      />

      {/* Remove button */}
      {data.onRemoveNode && data.nodeId && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onRemoveNode?.(data.nodeId!);
          }}
          className='absolute -top-2 -right-2 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 shadow-lg transition-colors group-hover:opacity-100 hover:bg-red-600'
          title='Remove node'
        >
          <X className='h-3 w-3' />
        </button>
      )}

      <div className='bg-background/90 border-border relative overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-md'>
        {/* Content-type tabs */}
        <div className='m-2 flex w-fit items-center rounded-md border border-gray-200 px-3 dark:border-neutral-800'>
          {CONTENT_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => handleContentTypeChange(t.id)}
              className={cn(
                "my-1 w-full flex-1 rounded-md px-2 py-1 text-[10px] font-semibold transition-all",
                contentType === t.id
                  ? "text-primary-foreground bg-indigo-600 shadow-sm hover:bg-indigo-700"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Video orientation picker — shown as leftContent next to model selector */}
        {/* Input */}
        <div className=''>
          {isGenerating && (
            <div className='bg-background/60 absolute inset-0 z-10 flex items-center justify-center rounded-b-3xl backdrop-blur-sm'>
              <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                <LoadingFileLoader size={16} />
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
            className='border-none bg-transparent shadow-none'
            minHeight='120px'
          />
        </div>
      </div>

      {/* Output Results Handle (Source) */}
      <Handle
        type='source'
        position={Position.Right}
        isConnectable={isConnectable}
        className='border-background h-3 w-3 border-2 bg-green-500'
      />
    </div>
  );
}
