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
    label: "Design Flier",
    icon: <FileText className="w-5 h-5 text-white" />,
    bg: "bg-gradient-to-br from-[#ef4444] to-[#f97316]",
  },
  {
    id: "youtube_thumbnail",
    label: "YT thumbnail",
    icon: <Youtube className="w-5 h-5 text-white" />,
    bg: "bg-gradient-to-br from-[#a855f7] to-[#6366f1]",
  },
  {
    id: "poster",
    label: "Design Poster",
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
    label: "Design Banner",
    icon: <Layout className="w-5 h-5 text-white" />,
    bg: "bg-gradient-to-br from-[#f59e0b] to-[#f97316]",
  },
  {
    id: "logo",
    label: "Design Logo",
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
                    <span className="absolute -top-[-5px] -right-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-white text-[10px] shadow">
                      <svg
                        className=""
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
                          fill="#2196F3"
                        />{" "}
                      </svg>
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
