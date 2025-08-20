import { useState, useEffect } from "react";
import { safeImageUrl } from "@/lib/image-utils";

interface UseImageOptions {
  fallbackName?: string;
  size?: number;
}

interface UseImageReturn {
  src: string;
  isLoading: boolean;
  hasError: boolean;
  retry: () => void;
}

export function useImage(
  originalSrc?: string | null,
  options: UseImageOptions = {}
): UseImageReturn {
  const { fallbackName = "User", size = 128 } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Get the safe image source
  const src = safeImageUrl(originalSrc, fallbackName, size);

  useEffect(() => {
    if (!originalSrc || originalSrc.trim() === "") {
      setIsLoading(false);
      setHasError(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };
    img.src = originalSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [originalSrc, retryCount]);

  const retry = () => {
    setRetryCount((prev) => prev + 1);
  };

  return {
    src,
    isLoading,
    hasError,
    retry,
  };
}
