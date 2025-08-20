/**
 * Utility functions for handling images and fallbacks
 */

/**
 * Checks if an image URL is empty, null, or just whitespace
 */
export function isEmptyImageUrl(url?: string | null): boolean {
  return !url || url.trim() === "";
}

/**
 * Generates a fallback avatar URL using UI Avatars service
 */
export function generateAvatarUrl(name: string, size: number = 128): string {
  const encodedName = encodeURIComponent(name || "User");
  return `https://ui-avatars.com/api/?background=8b878e&color=fff&name=${encodedName}&size=${size}`;
}

/**
 * Generates a plain background fallback for cover images
 */
export function generatePlainBackgroundUrl(
  color: string = "#1f2937",
  width: number = 800,
  height: number = 400
): string {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Gets the appropriate image source, falling back to avatar if the original is empty
 */
export function getImageSource(
  originalUrl?: string | null,
  fallbackName?: string,
  size: number = 128
): string {
  if (isEmptyImageUrl(originalUrl)) {
    return generateAvatarUrl(fallbackName || "User", size);
  }
  return originalUrl!;
}

/**
 * Gets the appropriate cover image source, falling back to plain background if the original is empty
 */
export function getCoverImageSource(
  originalUrl?: string | null,
  color: string = "#1f2937",
  width: number = 800,
  height: number = 400
): string {
  if (isEmptyImageUrl(originalUrl)) {
    return generatePlainBackgroundUrl(color, width, height);
  }
  return originalUrl!;
}

/**
 * Validates if a URL is a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Safely gets an image URL with fallback
 */
export function safeImageUrl(
  url?: string | null,
  fallbackName?: string,
  size: number = 128
): string {
  if (isEmptyImageUrl(url) || !isValidImageUrl(url!)) {
    return generateAvatarUrl(fallbackName || "User", size);
  }
  return url!;
}

/**
 * Safely gets a cover image URL with plain background fallback
 */
export function safeCoverImageUrl(
  url?: string | null,
  color: string = "#1f2937",
  width: number = 800,
  height: number = 400
): string {
  if (isEmptyImageUrl(url) || !isValidImageUrl(url!)) {
    return generatePlainBackgroundUrl(color, width, height);
  }
  return url!;
}
