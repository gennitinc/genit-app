"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Model, ModelType } from "@/types/inspire";
import { LoadingFileLoader } from "@/utils/Loading";
import { modelApi } from "@/utils/inspire-api";
import {
  FileText,
  Image as ImageIcon,
  Loader2,
  Music,
  Share2,
  Sparkles,
  Type as TypeIcon,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ModelSelectorProps {
  type: ModelType;
  selectedModel: Model | null;
  onSelectModel: (model: Model) => void;
  initialModelId?: string;
}

// Helper function to render SVG icon
function ModelIcon({
  icon,
  name,
  type,
}: {
  icon?: string;
  name: string;
  type: ModelType;
}) {
  if (icon) {
    // Check if icon is a URL or SVG string
    if (icon.startsWith("<svg") || icon.startsWith("<?xml")) {
      // SVG string - render directly
      return (
        <div
          className='h-4 w-4 flex-shrink-0'
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      );
    } else if (icon.startsWith("http") || icon.startsWith("/")) {
      // URL - render as image
      return (
        <img
          src={icon}
          alt={name}
          className='h-4 w-4 flex-shrink-0 rounded-full object-contain'
          onError={(e) => {
            // Fallback to default icon on error
            e.currentTarget.style.display = "none";
          }}
        />
      );
    }
  }

  // Default icon based on type
  if (type === "general") return <Sparkles className='h-4 w-4 flex-shrink-0' />;
  if (type === "video") return <Video className='h-4 w-4 flex-shrink-0' />;
  if (type === "audio") return <Music className='h-4 w-4 flex-shrink-0' />;
  if (type === "text") return <TypeIcon className='h-4 w-4 flex-shrink-0' />;
  if (type === "social") return <Share2 className='h-4 w-4 flex-shrink-0' />;
  if (type === "docs") return <FileText className='h-4 w-4 flex-shrink-0' />;
  return <ImageIcon className='h-4 w-4 flex-shrink-0' />;
}

export function ModelSelector({
  type,
  selectedModel,
  onSelectModel,
  initialModelId,
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

          // If we have an initialModelId, try to find it first
          if (initialModelId && !selectedModel) {
            const initialModel = filteredModels.find(
              (m) => (m.modelId || m._id || m.id) === initialModelId
            );
            if (initialModel) {
              onSelectModel(initialModel);
              return;
            }
          }

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
  }, [type, initialModelId]);

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
      <div className='space-y-2'>
        <div className='flex items-center justify-center py-2'>
          <LoadingFileLoader size={16} />
        </div>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className='space-y-2'>
        <span className='py-2 text-center text-sm text-neutral-500 dark:text-neutral-400'></span>
      </div>
    );
  }

  const selectedModelId = selectedModel?._id || selectedModel?.id || "";

  return (
    <div className=''>
      <Select value={selectedModelId} onValueChange={handleValueChange}>
        <SelectTrigger className='w-fit border-none !bg-transparent p-0 shadow-none ring-0 outline-none focus:ring-0 focus:ring-offset-0'>
          <SelectValue className=''>
            {selectedModel ? (
              <div className='flex w-full items-center justify-between'>
                <div className='flex min-w-0 flex-1 items-center gap-2'>
                  <ModelIcon
                    icon={selectedModel.icon}
                    name={selectedModel.name}
                    type={selectedModel.type}
                  />
                </div>
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
                  <div className='flex w-full items-center justify-between gap-2'>
                    <div className='flex min-w-0 flex-1 items-start gap-2'>
                      <ModelIcon
                        icon={model.icon}
                        name={model.name}
                        type={model.type}
                      />
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center gap-2'>
                          <span className='truncate text-sm font-medium'>
                            {model.name}
                          </span>
                        </div>
                        {model.description && (
                          <p className='w-30 truncate text-xs text-neutral-500 dark:text-neutral-400'>
                            {model.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
        </SelectContent>
      </Select>
    </div>
  );
}
