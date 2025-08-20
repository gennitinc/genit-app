import Image from "next/image";
import { cn } from "@/lib/utils";
import { useImage } from "@/hooks/use-image";
import { Skeleton } from "./skeleton";

interface EnhancedFallbackImageProps {
  src?: string | null;
  alt: string;
  fallbackText?: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  showLoadingState?: boolean;
  showErrorState?: boolean;
}

export function EnhancedFallbackImage({
  src,
  alt,
  fallbackText,
  width = 128,
  height = 128,
  className,
  fill = false,
  priority = false,
  showLoadingState = true,
  showErrorState = true,
}: EnhancedFallbackImageProps) {
  const {
    src: imageSrc,
    isLoading,
    hasError,
    retry,
  } = useImage(src, {
    fallbackName: fallbackText || alt,
    size: Math.max(width, height),
  });

  // Show loading skeleton
  if (showLoadingState && isLoading && src && src.trim() !== "") {
    if (fill) {
      return <Skeleton className={cn("w-full h-full", className)} />;
    }
    return <Skeleton className={cn(`w-${width} h-${height}`, className)} />;
  }

  // Show error state with retry button
  if (showErrorState && hasError && src && src.trim() !== "") {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          fill ? "w-full h-full" : `w-${width} h-${height}`,
          className
        )}
        onClick={retry}
        role="button"
        tabIndex={0}
      >
        <div className="text-center">
          <div className="text-xs mb-1">Failed to load</div>
          <button
            className="text-xs underline hover:no-underline"
            onClick={(e) => {
              e.stopPropagation();
              retry();
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render the image
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
