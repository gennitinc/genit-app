"use client";

import type React from "react";

interface MessageContainerProps {
  avatar: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function MessageContainer({
  avatar,
  children,
  actions,
  className = "",
}: MessageContainerProps) {
  return (
    <div className={`space-y-2 text-sm font-normal ${className}`}>
      <div className='flex items-start gap-3'>
        {avatar}
        <div className='min-w-0 flex-1'>{children}</div>
      </div>
      {actions && <div className='ml-11'>{actions}</div>}
    </div>
  );
}
