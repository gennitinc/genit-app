"use client";

import { cn } from "@/lib/utils";
import type { Resolution, AspectRatio } from "@/app/video/create/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResolutionSelectorProps {
  selectedResolution: Resolution;
  selectedAspectRatio: AspectRatio;
  onResolutionChange: (resolution: Resolution) => void;
  onAspectRatioChange: (aspectRatio: AspectRatio) => void;
}

const RESOLUTIONS: { value: Resolution; label: string; description: string }[] = [
  { value: "4K", label: "4K (3840x2160)", description: "Ultra HD - Best quality" },
  { value: "1080p", label: "1080p (1920x1080)", description: "Full HD - Recommended" },
  { value: "720p", label: "720p (1280x720)", description: "HD - Good quality" },
  { value: "480p", label: "480p (854x480)", description: "SD - Smaller file size" },
];

const ASPECT_RATIOS: { value: AspectRatio; label: string; description: string }[] = [
  { value: "16:9", label: "16:9", description: "Widescreen (YouTube, TV)" },
  { value: "9:16", label: "9:16", description: "Vertical (TikTok, Instagram Reels)" },
  { value: "1:1", label: "1:1", description: "Square (Instagram Posts)" },
  { value: "4:3", label: "4:3", description: "Classic (Presentations)" },
];

export function ResolutionSelector({
  selectedResolution,
  selectedAspectRatio,
  onResolutionChange,
  onAspectRatioChange,
}: ResolutionSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Resolution Selection */}
      <div>
        <label className="text-sm font-medium mb-2 block">Resolution</label>
        <Select
          value={selectedResolution}
          onValueChange={(value) => onResolutionChange(value as Resolution)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RESOLUTIONS.map((res) => (
              <SelectItem key={res.value} value={res.value}>
                <div className="flex flex-col">
                  <span className="font-medium">{res.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {res.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Aspect Ratio Selection */}
      <div>
        <label className="text-sm font-medium mb-2 block">Aspect Ratio</label>
        <div className="grid grid-cols-2 gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => onAspectRatioChange(ratio.value)}
              className={cn(
                "p-3 rounded-lg border-2 text-left transition-all hover:bg-accent",
                selectedAspectRatio === ratio.value
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <div className="font-medium text-sm">{ratio.label}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {ratio.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Info */}
      <div className="pt-4 border-t">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Selected:</span>
            <span className="font-medium">
              {RESOLUTIONS.find((r) => r.value === selectedResolution)?.label}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Format:</span>
            <span className="font-medium">{selectedAspectRatio}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

