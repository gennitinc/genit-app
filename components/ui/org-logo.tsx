"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

/**
 * An organization's logo: the whole logo fitted on a white rounded tile with a
 * thin ring, so dark or transparent logos stay visible in dark mode and wide
 * logos aren't cropped. Falls back to the name's initial. Same look as mobile.
 */
export function OrgLogo({
  src,
  name,
  className,
  fallbackClassName,
}: {
  src?: string | null;
  name?: string | null;
  /** Size and corner radius, e.g. `h-8 w-8 rounded-md`. */
  className?: string;
  /** Text size for the initial, e.g. `text-xs`. */
  fallbackClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initial = (name || "W").trim().slice(0, 1).toUpperCase();

  if (src && !failed) {
    return (
      <span
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-white p-[12%] ring-1 ring-black/10 dark:ring-white/15",
          className
        )}
      >
        <img
          src={src}
          alt={name ? `${name} logo` : "Organization logo"}
          className='h-full w-full object-contain'
          onError={() => setFailed(true)}
        />
      </span>
    );
  }

  return (
    <span
      aria-label={name || "Organization"}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 font-semibold text-white",
        className,
        fallbackClassName
      )}
    >
      {initial}
    </span>
  );
}
