"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface ColorShadeScaleProps {
  shades: { [key: number]: string };
  defaultSelected?: number;
  onSelect?: (shade: number, hex: string) => void;
  className?: string;
}

const SHADE_KEYS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function getContrastText(shade: number) {
  return shade <= 300 ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.85)";
}

export function ColorShadeScale({
  shades,
  defaultSelected = 600,
  onSelect,
  className,
}: ColorShadeScaleProps) {
  const [selectedShade, setSelectedShade] = useState(defaultSelected);

  const handleClick = (key: number) => {
    setSelectedShade(key);
    const hex = shades[key] || "cccccc";
    onSelect?.(key, hex.startsWith("#") ? hex : `#${hex}`);
  };

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-white/5",
        className
      )}
    >
      <div className='flex w-full'>
        {SHADE_KEYS.map((key) => {
          const raw = shades[key] || "cccccc";
          const hex = raw.startsWith("#") ? raw : `#${raw}`;
          const isSelected = selectedShade === key;
          const textColor = getContrastText(key);

          return (
            <button
              key={key}
              onClick={() => handleClick(key)}
              title={`${key} — ${hex}`}
              className='relative flex h-10 flex-1 origin-bottom items-end justify-center pb-1.5 transition-all duration-200 hover:z-10 hover:scale-y-110 focus:outline-none'
              style={{ backgroundColor: hex }}
            >
              {isSelected && (
                <span
                  className='absolute bottom-2 left-1/2 mb-0.5 h-1 w-1 -translate-x-1/2 rounded-full'
                  style={{ backgroundColor: textColor }}
                />
              )}
              <span
                className='absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[8px] whitespace-nowrap opacity-0 group-hover:opacity-60'
                style={{ color: textColor }}
              >
                {key}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
