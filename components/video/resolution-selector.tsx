"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Check,
  Monitor,
  Smartphone,
  Square,
  RectangleHorizontal,
  Plus,
  ChevronDown,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import type { Resolution, AspectRatio } from "@/app/inspire/create/page";

interface ResolutionSelectorProps {
  selectedResolution: Resolution;
  selectedAspectRatio: AspectRatio;
  onResolutionChange: (resolution: Resolution) => void;
  onAspectRatioChange: (aspectRatio: AspectRatio) => void;
  onDrawerClose?: () => void;
}

const RESOLUTIONS: {
  value: Resolution;
  label: string;
  description: string;
  badge?: string;
}[] = [
  {
    value: "4K",
    label: "4K Ultra HD",
    description: "3840 × 2160",
    badge: "Premium",
  },
  {
    value: "1080p",
    label: "Full HD",
    description: "1920 × 1080",
    badge: "Recommended",
  },
  {
    value: "720p",
    label: "HD",
    description: "1280 × 720",
  },
  {
    value: "480p",
    label: "SD",
    description: "854 × 480",
  },
];

const ASPECT_RATIOS: {
  value: AspectRatio;
  label: string;
  description: string;
  icon: "horizontal" | "vertical" | "square";
}[] = [
  {
    value: "16:9",
    label: "16:9",
    description: "YouTube, TV",
    icon: "horizontal",
  },
  {
    value: "9:16",
    label: "9:16",
    description: "TikTok, Reels",
    icon: "vertical",
  },
  { value: "1:1", label: "1:1", description: "Instagram", icon: "square" },
  {
    value: "4:3",
    label: "4:3",
    description: "Presentations",
    icon: "horizontal",
  },
];

function ResolutionCard({
  resolution,
  isSelected,
  onSelect,
}: {
  resolution: (typeof RESOLUTIONS)[0];
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative overflow-hidden rounded-xl p-3 transition-all group text-left w-full",
        "bg-neutral-100 dark:bg-neutral-800",
        isSelected
          ? "ring-1 ring-neutral-900 dark:ring-neutral-500"
          : "hover:ring-1 hover:ring-neutral-500 dark:hover:ring-neutral-600"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              isSelected
                ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
            )}
          >
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {resolution.label}
              </p>
              {resolution.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900">
                  {resolution.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {resolution.description}
            </p>
          </div>
        </div>
        {isSelected ? (
          <div className="w-5 h-5 bg-neutral-900 dark:bg-neutral-100 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-white dark:text-neutral-900" />
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-neutral-600" />
        )}
      </div>
    </button>
  );
}

function AspectRatioCard({
  ratio,
  isSelected,
  onSelect,
}: {
  ratio: (typeof ASPECT_RATIOS)[0];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const getIcon = () => {
    switch (ratio.icon) {
      case "vertical":
        return <Smartphone className="w-4 h-4" />;
      case "square":
        return <Square className="w-4 h-4" />;
      default:
        return <RectangleHorizontal className="w-4 h-4" />;
    }
  };

  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative overflow-hidden rounded-xl p-3 transition-all text-center",
        "bg-neutral-200 dark:bg-neutral-800",
        isSelected
          ? "ring-1 ring-neutral-400 dark:ring-neutral-500"
          : "hover:ring-1 hover:ring-neutral-300 dark:hover:ring-neutral-600"
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            isSelected
              ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
              : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
          )}
        >
          {getIcon()}
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            {ratio.label}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {ratio.description}
          </p>
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 w-4 h-4 bg-neutral-900 dark:bg-neutral-100 rounded-full flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white dark:text-neutral-900" />
        </div>
      )}
    </button>
  );
}

export function ResolutionSelector({
  selectedResolution,
  selectedAspectRatio,
  onResolutionChange,
  onAspectRatioChange,
  onDrawerClose,
}: ResolutionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleResolutionChange = (resolution: Resolution) => {
    onResolutionChange(resolution);
    onDrawerClose?.(); // Close drawer on mobile after selection
  };

  const handleAspectRatioChange = (aspectRatio: AspectRatio) => {
    onAspectRatioChange(aspectRatio);
    onDrawerClose?.(); // Close drawer on mobile after selection
  };

  const FullSettingsPanel = () => (
    <div className="space-y-6">
      {/* Resolution Selection */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-neutral-900 dark:text-white">
          Resolution
        </h4>
        <div className="space-y-2">
          {RESOLUTIONS.map((res) => (
            <ResolutionCard
              key={res.value}
              resolution={res}
              isSelected={selectedResolution === res.value}
              onSelect={() => handleResolutionChange(res.value)}
            />
          ))}
        </div>
      </div>

      {/* Aspect Ratio Selection */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-neutral-900 dark:text-white">
          Aspect Ratio
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <AspectRatioCard
              key={ratio.value}
              ratio={ratio}
              isSelected={selectedAspectRatio === ratio.value}
              onSelect={() => handleAspectRatioChange(ratio.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Get current selections for display
  const currentResolution = RESOLUTIONS.find(
    (r) => r.value === selectedResolution
  );
  const currentAspectRatio = ASPECT_RATIOS.find(
    (r) => r.value === selectedAspectRatio
  );

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        Video Settings
      </h3>

      {/* Quick Selection Cards */}
      <div className="space-y-2">
        {/* Resolution Preview */}
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "relative overflow-hidden rounded-xl p-3 transition-all group text-left w-full",
            "bg-neutral-100 dark:bg-neutral-800 hover:ring-1 hover:ring-neutral-300 dark:hover:ring-neutral-600"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                <Monitor className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {currentResolution?.label || "Select Resolution"}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {currentResolution?.description}
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </div>
        </button>

        {/* Aspect Ratio Preview */}
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "relative overflow-hidden rounded-xl p-3 transition-all group text-left w-full",
            "bg-neutral-100 dark:bg-neutral-800 hover:ring-1 hover:ring-neutral-300 dark:hover:ring-neutral-600"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                {currentAspectRatio?.icon === "vertical" ? (
                  <Smartphone className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                ) : currentAspectRatio?.icon === "square" ? (
                  <Square className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                ) : (
                  <RectangleHorizontal className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {currentAspectRatio?.label || "Select Aspect Ratio"}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {currentAspectRatio?.description}
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </div>
        </button>

        {/* More Options Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative overflow-hidden rounded-lg p-3 transition-all group text-left w-full bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 flex items-center justify-center gap-2"
        >
          <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
            <Plus className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
          </div>
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            More Options
          </span>
        </button>
      </div>

      {/* Dialog for Desktop */}
      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Video Settings</DialogTitle>
              <DialogDescription>
                Configure resolution and aspect ratio for your video
              </DialogDescription>
            </DialogHeader>
            <FullSettingsPanel />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader>
              <DrawerTitle>Video Settings</DrawerTitle>
              <DrawerDescription>
                Configure resolution and aspect ratio for your video
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-6 overflow-y-auto">
              <FullSettingsPanel />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
