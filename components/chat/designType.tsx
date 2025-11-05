import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Camera,
  Video,
  Image as ImageIcon,
  FileText,
  Youtube,
  Layout,
  Type,
} from "lucide-react";

type DesignTypeItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  bg: string; // background utility classes
};

const ITEMS: DesignTypeItem[] = [
  {
    id: "flier",
    label: "Flier",
    icon: <FileText className="w-5 h-5 text-white" />,
    bg: "bg-gradient-to-br from-[#ef4444] to-[#f97316]",
  },
  {
    id: "youtube_thumbnail",
    label: "Youtube thumbnail",
    icon: <Youtube className="w-5 h-5 text-white" />,
    bg: "bg-gradient-to-br from-[#a855f7] to-[#6366f1]",
  },
  {
    id: "poster",
    label: "Poster",
    icon: <ImageIcon className="w-5 h-5 text-white" />,
    bg: "bg-gradient-to-br from-[#10b981] to-[#06b6d4]",
  },
  {
    id: "instagram_post",
    label: "Instagram post",
    icon: <Camera className="w-5 h-5 text-white" />,
    bg: "bg-gradient-to-br from-[#ec4899] to-[#f43f5e]",
  },
  {
    id: "facebook_post",
    label: "Facebook post",
    icon: <Layout className="w-5 h-5 text-white" />,
    bg: "bg-gradient-to-br from-[#60a5fa] to-[#3b82f6]",
  },
  {
    id: "facebook_cover",
    label: "Facebook cover",
    icon: <Layout className="w-5 h-5 text-white" />,
    bg: "bg-gradient-to-br from-[#0ea5e9] to-[#22d3ee]",
  },
  {
    id: "banner",
    label: "Banner",
    icon: <Layout className="w-5 h-5 text-white" />,
    bg: "bg-gradient-to-br from-[#f59e0b] to-[#f97316]",
  },
  {
    id: "logo",
    label: "Logo",
    icon: <Type className="w-5 h-5 text-white" />,
    bg: "bg-gradient-to-br from-[#14b8a6] to-[#22c55e]",
  },
];

interface Props {
  onSelect?: (id: string) => void;
  selectedId?: string | null;
  className?: string;
}

const DesignType: React.FC<Props> = ({
  onSelect,
  selectedId,
  className = "",
}) => {
  return (
    <div className={`w-full relative ${className}`}>
      <Carousel
        opts={{ align: "start", loop: true }}
        className="w-full max-w-4xl mx-auto select-none px-2 sm:px-3 md:px-4"
      >
        <CarouselContent className="-ml-3">
          {ITEMS.map((item) => (
            <CarouselItem
              key={item.id}
              className="pl-3 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
            >
              <button
                type="button"
                onClick={() => onSelect?.(item.id)}
                className="group flex flex-col items-center gap-3 focus:outline-none"
              >
                <div className="relative">
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${item.bg} grid place-items-center shadow-md transition-transform duration-200 group-active:scale-95`}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/15 rounded-2xl grid place-items-center">
                      {item.icon}
                    </div>
                  </div>
                  {selectedId === item.id && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] shadow">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-xs md:text-sm font-semibold text-foreground/90 text-center leading-tight">
                  {item.label}
                </span>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden lg:flex items-center justify-center gap-2 mt-4">
          <CarouselPrevious className="h-8 w-8" />
          <CarouselNext className="h-8 w-8" />
        </div>
      </Carousel>
      {/* Edge gradients for scroll hint on mobile/tablet */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-8 md:w-10 bg-gradient-to-r from-background to-transparent rounded-l-lg lg:hidden" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-8 md:w-10 bg-gradient-to-l from-background to-transparent rounded-r-lg lg:hidden" />
    </div>
  );
};

export default DesignType;
