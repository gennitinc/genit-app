import Image from "next/image";
import { cn } from "@/lib/utils";
import { safeCoverImageUrl } from "@/lib/image-utils";

interface CoverImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  fallbackColor?: string;
  width?: number;
  height?: number;
}

export function CoverImage({
  src,
  alt,
  className,
  fill = true,
  priority = false,
  fallbackColor = "#1f2937",
  width = 800,
  height = 400,
}: CoverImageProps) {
  const imageSrc = safeCoverImageUrl(src, fallbackColor, width, height);

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={cn("object-cover", className)}
      priority={priority}
    />
  );
}
