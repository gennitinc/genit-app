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
    label: "Y-thumbnail",
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
  className?: string;
}

const DesignType: React.FC<Props> = ({ onSelect, className = "" }) => {
  return (
    <div className={`w-full ${className}`}>
      <Carousel
        opts={{ align: "start", loop: true }}
        className="w-full max-w-4xl mx-auto select-none"
      >
        <CarouselContent className="-ml-4">
          {ITEMS.map((item) => (
            <CarouselItem
              key={item.id}
              className="pl-3 basis-1/4 sm:basis-1/5 md:basis-1/5 lg:basis-1/7"
            >
              <button
                type="button"
                onClick={() => onSelect?.(item.id)}
                className="group flex flex-col items-center gap-3 focus:outline-none"
              >
                <div
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${item.bg} grid place-items-center shadow-md transition-transform duration-200 group-active:scale-95`}
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/15 rounded-2xl grid place-items-center">
                    {item.icon}
                  </div>
                </div>
                <span className="text-xs md:text-sm font-semibold text-foreground/90 text-center">
                  {item.label}
                </span>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center gap-2 mt-3">
          <CarouselPrevious className="h-8 w-8" />
          <CarouselNext className="h-8 w-8" />
        </div>
      </Carousel>
    </div>
  );
};

export default DesignType;
