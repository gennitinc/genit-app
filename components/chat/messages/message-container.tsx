"use client";

import type React from "react";

interface MessageContainerProps {
  avatar: React.ReactNode;
  name: React.ReactNode;
  status?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function MessageContainer({
  avatar,
  name,
  status,
  children,
  actions,
  className = "",
}: MessageContainerProps) {
  return (
    <div className={`w-full space-y-2 text-sm font-normal ${className}`}>
      <div className='flex w-full items-center justify-between gap-3'>
        <div className='flex min-w-0 items-center gap-2'>
          <span className='shrink-0'>{avatar}</span>
          <span className='text-foreground truncate text-xs font-medium tracking-tight'>
            {name}
          </span>
        </div>
        {status && <div className='shrink-0'>{status}</div>}
      </div>
      <div className='w-full min-w-0'>{children}</div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
