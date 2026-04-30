"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import type { AspectRatio, Resolution } from "@/types/inspire";
import {
  Check,
  ChevronDown,
  Monitor,
  Plus,
  RectangleHorizontal,
  Smartphone,
  Square,
} from "lucide-react";
import { useState } from "react";

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

export const ASPECT_RATIOS: {
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
        "group relative w-full overflow-hidden rounded-xl p-3 text-left transition-all",
        "bg-neutral-100 dark:bg-neutral-800",
        isSelected
          ? "ring-1 ring-neutral-900 dark:ring-neutral-500"
          : "hover:ring-1 hover:ring-neutral-500 dark:hover:ring-neutral-600"
      )}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              isSelected
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400"
            )}
          >
            <Monitor className='h-5 w-5' />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <p className='text-sm font-medium text-neutral-900 dark:text-white'>
                {resolution.label}
              </p>
              {resolution.badge && (
                <span className='rounded bg-neutral-900 px-1.5 py-0.5 text-[10px] font-medium text-white dark:bg-neutral-100 dark:text-neutral-900'>
                  {resolution.badge}
                </span>
              )}
            </div>
            <p className='text-xs text-neutral-500 dark:text-neutral-400'>
              {resolution.description}
            </p>
          </div>
        </div>
        {isSelected ? (
          <div className='flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 dark:bg-neutral-100'>
            <Check className='h-3 w-3 text-white dark:text-neutral-900' />
          </div>
        ) : (
          <div className='h-5 w-5 rounded-full border-2 border-neutral-300 dark:border-neutral-600' />
        )}
      </div>
    </button>
  );
}

export function AspectRatioCard({
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
        return <Smartphone className='h-4 w-4' />;
      case "square":
        return <Square className='h-4 w-4' />;
      default:
        return <RectangleHorizontal className='h-4 w-4' />;
    }
  };

  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative overflow-hidden rounded-xl p-3 text-center transition-all",
        "shrink-0 border-2 border-dashed border-neutral-300 bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700",
        isSelected
          ? "ring-1 ring-neutral-400 dark:ring-neutral-500"
          : "hover:ring-1 hover:ring-neutral-300 dark:hover:ring-neutral-600"
      )}
    >
      <div className='flex flex-col items-center gap-2'>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            isSelected
              ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
              : "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400"
          )}
        >
          {getIcon()}
        </div>
        <div>
          <p className='text-sm font-medium text-neutral-900 dark:text-white'>
            {ratio.label}
          </p>
          <p className='text-xs text-neutral-500 dark:text-neutral-400'>
            {ratio.description}
          </p>
        </div>
      </div>
      {isSelected && (
        <div className='absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 dark:bg-neutral-100'>
          <Check className='h-2.5 w-2.5 text-white dark:text-neutral-900' />
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
    <div className='space-y-6'>
      {/* Resolution Selection */}
      <div className='space-y-3'>
        <h4 className='text-sm font-medium text-neutral-900 dark:text-white'>
          Resolution
        </h4>
        <div className='space-y-2'>
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
      <div className='space-y-3'>
        <h4 className='text-sm font-medium text-neutral-900 dark:text-white'>
          Aspect Ratio
        </h4>
        <div className='grid grid-cols-2 gap-2'>
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
    <div className='space-y-3'>
      <h3 className='text-sm font-medium text-neutral-500 dark:text-neutral-400'>
        Video Settings
      </h3>

      {/* Quick Selection Cards */}
      <div className='space-y-2'>
        {/* Resolution Preview */}
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "group relative w-full overflow-hidden rounded-xl p-3 text-left transition-all",
            "bg-neutral-100 hover:ring-1 hover:ring-neutral-300 dark:bg-neutral-800 dark:hover:ring-neutral-600"
          )}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-200 dark:bg-neutral-700'>
                <Monitor className='h-5 w-5 text-neutral-600 dark:text-neutral-300' />
              </div>
              <div>
                <p className='text-sm font-medium text-neutral-900 dark:text-white'>
                  {currentResolution?.label || "Select Resolution"}
                </p>
                <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                  {currentResolution?.description}
                </p>
              </div>
            </div>
            <ChevronDown className='h-4 w-4 text-neutral-500 dark:text-neutral-400' />
          </div>
        </button>

        {/* Aspect Ratio Preview */}
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "group relative w-full overflow-hidden rounded-xl p-3 text-left transition-all",
            "bg-neutral-100 hover:ring-1 hover:ring-neutral-300 dark:bg-neutral-800 dark:hover:ring-neutral-600"
          )}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-200 dark:bg-neutral-700'>
                {currentAspectRatio?.icon === "vertical" ? (
                  <Smartphone className='h-5 w-5 text-neutral-600 dark:text-neutral-300' />
                ) : currentAspectRatio?.icon === "square" ? (
                  <Square className='h-5 w-5 text-neutral-600 dark:text-neutral-300' />
                ) : (
                  <RectangleHorizontal className='h-5 w-5 text-neutral-600 dark:text-neutral-300' />
                )}
              </div>
              <div>
                <p className='text-sm font-medium text-neutral-900 dark:text-white'>
                  {currentAspectRatio?.label || "Select Aspect Ratio"}
                </p>
                <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                  {currentAspectRatio?.description}
                </p>
              </div>
            </div>
            <ChevronDown className='h-4 w-4 text-neutral-500 dark:text-neutral-400' />
          </div>
        </button>

        {/* More Options Button */}
        <button
          onClick={() => setIsOpen(true)}
          className='group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100 p-3 text-left transition-all hover:border-neutral-400 dark:border-neutral-600 dark:bg-neutral-800 dark:hover:border-neutral-500'
        >
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700'>
            <Plus className='h-4 w-4 text-neutral-600 dark:text-neutral-300' />
          </div>
          <span className='text-sm font-medium text-neutral-600 dark:text-neutral-400'>
            More Options
          </span>
        </button>
      </div>

      {/* Dialog for Desktop */}
      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className='max-w-lg'>
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
          <DrawerContent className='max-h-[85vh]'>
            <DrawerHeader>
              <DrawerTitle>Video Settings</DrawerTitle>
              <DrawerDescription>
                Configure resolution and aspect ratio for your video
              </DrawerDescription>
            </DrawerHeader>
            <div className='overflow-y-auto px-4 pb-6'>
              <FullSettingsPanel />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
