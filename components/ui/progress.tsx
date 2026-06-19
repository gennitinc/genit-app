"use client";

import { cn } from "@/lib/utils";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot='progress'
      className={cn(
        "bg-indigo-600 hover:bg-indigo-700/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot='progress-indicator'
        className='bg-indigo-600 hover:bg-indigo-700 h-full w-full flex-1 transition-all'
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
