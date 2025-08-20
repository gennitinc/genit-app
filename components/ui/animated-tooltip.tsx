"use client";

import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";
import { cn } from "@/lib/utils";

export const AnimatedTooltip = ({
  hideTooltip = false,
  AnimateFromBottom = false,
  items,
}: {
  hideTooltip?: boolean;
  AnimateFromBottom?: boolean;
  items: {
    id: number;
    name: string;
    designation?: string;
    image?: string;
  }[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );
  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  return (
    <>
      {items.map((item, idx) => (
        <div
          className="group relative -mr-4"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && !hideTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className={cn(
                  "absolute left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl",
                  AnimateFromBottom ? "-bottom-16" : "-top-16"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-x-10 z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent",
                    !AnimateFromBottom ? "-bottom-px" : "-top-px"
                  )}
                />
                <div
                  className={cn(
                    "absolute left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent",
                    !AnimateFromBottom ? "-bottom-px" : "-top-px"
                  )}
                />
                <div className="relative z-30 text-base font-bold text-white">
                  {item.name}
                </div>
                {item.designation && (
                  <div className="text-xs text-white">{item.designation}</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <img
            onMouseMove={handleMouseMove}
            height={100}
            width={100}
            src={item.image}
            alt={item.name}
            className="relative !m-0 h-10 w-10 sm:w-12 sm:h-12 rounded-full border-2 border-foreground object-cover object-top !p-0 transition bg-background duration-500 group-hover:z-30 group-hover:scale-105"
          />
        </div>
      ))}
    </>
  );
};
