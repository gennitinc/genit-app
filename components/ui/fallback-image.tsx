import Image from "next/image";
import { cn } from "@/lib/utils";
import { safeImageUrl } from "@/lib/image-utils";

interface FallbackImageProps {
  src?: string | null;
  alt: string;
  fallbackText?: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  usePlainFallback?: boolean;
  fallbackColor?: string;
}

export function FallbackImage({
  src,
  alt,
  fallbackText,
  width = 128,
  height = 128,
  className,
  fill = false,
  priority = false,
  usePlainFallback = false,
  fallbackColor = "#8b878e",
}: FallbackImageProps) {
  let imageSrc: string;

  if (usePlainFallback) {
    // For cover images, use a plain colored background
    imageSrc =
      src && src.trim() !== ""
        ? src
        : `data:image/svg+xml;base64,${btoa(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${fallbackColor}"/>
      </svg>
    `)}`;
  } else {
    // Use the utility function to get the appropriate image source with avatar fallback
    imageSrc = safeImageUrl(src, fallbackText || alt, Math.max(width, height));
  }

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
