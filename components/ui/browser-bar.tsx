import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  ChevronDown,
  Smartphone,
  Tablet,
  Monitor,
  Layers,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react"; // Added React import

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
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      case "desktop":
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center space-x-2 h-10 bg-background border-b border-border px-2 rounded-t-xl">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onNavigate("back")}
        disabled={!canGoBack}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onNavigate("forward")}
        disabled={!canGoForward}
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onNavigate("refresh")}
      >
        <RotateCw className="h-4 w-4" />
      </Button>
      <form
        onSubmit={handleUrlSubmit}
        className="flex-1 flex items-center bg-muted-foreground/10 rounded-md px-3 h-8"
      >
        <Lock className="h-4 w-4 text-muted-foreground/50 mr-2" />
        <Input
          className="border-0 bg-transparent h-full focus:ring-0 text-sm"
          value={currentUrl}
          onChange={handleUrlInputChange}
        />
      </form>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 flex items-center gap-2"
          >
            {getDeviceIcon(currentDevice)}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleDeviceChange("desktop")}>
            <Monitor className="h-4 w-4 mr-2" />
            Desktop
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDeviceChange("tablet")}>
            <Tablet className="h-4 w-4 mr-2" />
            Tablet
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDeviceChange("mobile")}>
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Layers className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => window.open(currentUrl, "_blank")}
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  );
}
