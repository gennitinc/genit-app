"use client";

import { useEffect, useRef, useState } from "react";

export function MarketingRobot3D() {
  const [isLoaded, setIsLoaded] = useState(false);
  const fallbackTimer = useRef<number | null>(null);

  useEffect(() => {
    const handleReady = (event: MessageEvent) => {
      if (event.data?.type !== "spline-robot-ready") return;
      if (fallbackTimer.current) window.clearTimeout(fallbackTimer.current);
      setIsLoaded(true);
    };

    window.addEventListener("message", handleReady);
    return () => {
      window.removeEventListener("message", handleReady);
      if (fallbackTimer.current) window.clearTimeout(fallbackTimer.current);
    };
  }, []);

  return (
    <div className='relative h-[460px] w-full overflow-hidden sm:h-[560px] lg:h-[620px]'>
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-out ${
          isLoaded ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-hidden='true'
      >
        <div className='bg-muted h-56 w-40 animate-pulse rounded-[40%] opacity-50 blur-2xl motion-reduce:animate-none sm:h-72 sm:w-52' />
        <span className='text-muted-foreground absolute text-xs'>
          Loading interactive 3D…
        </span>
      </div>
      <iframe
        title='Interactive 3D robot'
        src='/api/spline-robot'
        loading='eager'
        allow='fullscreen'
        allowTransparency
        onLoad={() => {
          fallbackTimer.current = window.setTimeout(
            () => setIsLoaded(true),
            8000
          );
        }}
        className={`absolute top-1/2 left-1/2 h-[620px] w-[620px] max-w-none -translate-x-1/2 -translate-y-1/2 scale-[0.72] border-0 bg-transparent transition-opacity duration-200 ease-out sm:scale-[0.9] lg:h-full lg:w-full lg:scale-[0.96] ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
