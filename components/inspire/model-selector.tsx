"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2, Image as ImageIcon, Video, Crown } from "lucide-react";
import { modelApi } from "@/utils/inspire-api";
import { Model } from "@/types/inspire";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectorProps {
  type: "image" | "video";
  selectedModel: Model | null;
  onSelectModel: (model: Model) => void;
}

// Helper function to render SVG icon
function ModelIcon({
  icon,
  name,
  type,
}: {
  icon?: string;
  name: string;
  type: "image" | "video";
}) {
  if (icon) {
    // Check if icon is a URL or SVG string
    if (icon.startsWith("<svg") || icon.startsWith("<?xml")) {
      // SVG string - render directly
      return (
        <div
          className="w-4 h-4 flex-shrink-0"
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      );
    } else if (icon.startsWith("http") || icon.startsWith("/")) {
      // URL - render as image
      return (
        <img
          src={icon}
          alt={name}
          className="w-4 h-4 flex-shrink-0 object-contain rounded-full"
          onError={(e) => {
            // Fallback to default icon on error
            e.currentTarget.style.display = "none";
          }}
        />
      );
    }
  }

  // Default icon based on type
  return type === "image" ? (
    <ImageIcon className="w-4 h-4 flex-shrink-0" />
  ) : (
    <Video className="w-4 h-4 flex-shrink-0" />
  );
}

export function ModelSelector({
  type,
  selectedModel,
  onSelectModel,
}: ModelSelectorProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await modelApi.getAll({ type });
        if (response.success && response.data) {
          const modelsArray = Array.isArray(response.data) ? response.data : [];
          // Filter by type on client side as a safety measure
          const filteredModels = modelsArray.filter((m) => m.type === type);
          setModels(filteredModels);

          // Check if current selected model matches the type
          const currentModelMatchesType =
            selectedModel && selectedModel.type === type;

          // Auto-select default model if:
          // 1. No model is selected, OR
          // 2. Current selected model doesn't match the type
          if (!currentModelMatchesType) {
            const defaultModel = filteredModels.find((m) => m.isDefault);
            if (defaultModel) {
              onSelectModel(defaultModel);
            } else if (filteredModels.length > 0) {
              onSelectModel(filteredModels[0]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        toast({
          title: "Error",
          description: "Failed to load models. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleValueChange = async (value: string) => {
    const model = models.find((m) => (m._id || m.id) === value);
    if (model) {
      onSelectModel(model);
      try {
        const modelId = model._id || model.id || "";
        await modelApi.trackUsage(modelId);
      } catch (error) {
        // Continue even if tracking fails
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Model
        </label>
        <div className="flex items-center justify-center py-2">
          <Loader2 className="w-4 h-4 text-neutral-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Model
        </label>
        <div className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-2">
          No models available
        </div>
      </div>
    );
  }

  const selectedModelId = selectedModel?._id || selectedModel?.id || "";

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Model
      </label>
      <Select value={selectedModelId} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue>
            {selectedModel ? (
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <ModelIcon
                    icon={selectedModel.icon}
                    name={selectedModel.name}
                    type={selectedModel.type}
                  />
                  <span className="truncate">{selectedModel.name}</span>
                  {selectedModel.isDefault && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400">
                      Default
                    </span>
                  )}
                </div>
                {selectedModel.isPremium && (
                  <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                )}
              </div>
            ) : (
              "Select a model"
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {models
            .filter((model) => model.type === type)
            .map((model) => {
              const modelId = model._id || model.id || "";
              return (
                <SelectItem key={modelId} value={modelId}>
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <ModelIcon
                        icon={model.icon}
                        name={model.name}
                        type={model.type}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">
                            {model.name}
                          </span>
                          {model.isDefault && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400">
                              Default
                            </span>
                          )}
                        </div>
                        {model.description && (
                          <p className="text-xs text-neutral-500 w-30 dark:text-neutral-400 truncate">
                            {model.description}
                          </p>
                        )}
                        {/* <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {model.provider}
                          </span>
                        
                        </div> */}
                      </div>
                    </div>
                    {model.isPremium && (
                      <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                </SelectItem>
              );
            })}
        </SelectContent>
      </Select>
    </div>
  );
}
