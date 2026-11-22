import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { SmartPhone01Icon, Tablet01Icon, ComputerIcon, ArrowLeft02Icon, ArrowRight02Icon, RotateRight01Icon, LockIcon, ArrowDown01Icon, Layers01Icon, LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";

// Added React import

export type DeviceType = "mobile" | "tablet" | "desktop";

interface BrowserBarProps {
  onDeviceChange?: (device: DeviceType) => void;
  currentUrl: string;
  onUrlChange: (url: string) => void;
  onNavigate: (action: "back" | "forward" | "refresh") => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

export function BrowserBar({
  onDeviceChange,
  currentUrl,
  onUrlChange,
  onNavigate,
  canGoBack,
  canGoForward,
}: BrowserBarProps) {
  const [currentDevice, setCurrentDevice] = useState<DeviceType>("desktop");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

  const handleDeviceChange = (device: DeviceType) => {
    setCurrentDevice(device);
    onDeviceChange?.(device);
  };

  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUrlChange(e.target.value);
  };

  const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onNavigate("refresh");
  };

  const getDeviceIcon = (device: DeviceType) => {
    switch (device) {
      case "mobile":
        return <HugeiconsIcon icon={SmartPhone01Icon} className='h-4 w-4' />;
      case "tablet":
        return <HugeiconsIcon icon={Tablet01Icon} className='h-4 w-4' />;
      case "desktop":
        return <HugeiconsIcon icon={ComputerIcon} className='h-4 w-4' />;
    }
  };

  return (
    <div className='bg-background border-border flex h-10 items-center space-x-2 rounded-t-xl border-b px-2'>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8'
        onClick={() => onNavigate("back")}
        disabled={!canGoBack}
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8'
        onClick={() => onNavigate("forward")}
        disabled={!canGoForward}
      >
        <HugeiconsIcon icon={ArrowRight02Icon} className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8'
        onClick={() => onNavigate("refresh")}
      >
        <HugeiconsIcon icon={RotateRight01Icon} className='h-4 w-4' />
      </Button>
      <form
        onSubmit={handleUrlSubmit}
        className='bg-muted-foreground/10 flex h-8 flex-1 items-center rounded-md px-3'
      >
        <HugeiconsIcon icon={LockIcon} className='text-muted-foreground/50 mr-2 h-4 w-4' />
        <Input
          className='h-full border-0 bg-transparent text-sm focus:ring-0'
          value={currentUrl}
          onChange={handleUrlInputChange}
        />
      </form>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='flex h-8 items-center gap-2 px-2'
          >
            {getDeviceIcon(currentDevice)}
            <HugeiconsIcon icon={ArrowDown01Icon} className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => handleDeviceChange("desktop")}>
            <HugeiconsIcon icon={ComputerIcon} className='mr-2 h-4 w-4' />
            <LocalizedText text={"Desktop"} />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDeviceChange("tablet")}>
            <HugeiconsIcon icon={Tablet01Icon} className='mr-2 h-4 w-4' />
            <LocalizedText text={"Tablet"} />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDeviceChange("mobile")}>
            <HugeiconsIcon icon={SmartPhone01Icon} className='mr-2 h-4 w-4' />
            <LocalizedText text={"Mobile"} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant='ghost' size='icon' className='h-8 w-8'>
        <HugeiconsIcon icon={Layers01Icon} className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8'
        onClick={() => window.open(currentUrl, "_blank")}
      >
        <HugeiconsIcon icon={LinkSquare02Icon} className='h-4 w-4' />
      </Button>
    </div>
  );
}
