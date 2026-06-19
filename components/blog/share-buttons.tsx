"use client";

import { clientUrl } from "@/utils/apiResponse";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import React from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const url = `${clientUrl || "https://www.trygenit.com"}/blog/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className='flex items-center gap-4'>
      <a
        href='https://discord.gg/ftZbQvCdN7'
        target='_blank'
        rel='noopener noreferrer'
        className='cursor-pointer rounded-xl border border-zinc-200 bg-white p-3 text-zinc-700 transition-all hover:border-zinc-300 hover:text-cyan-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-cyan-400'
        aria-label='Share on Discord'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={20}
          height={20}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0' />
          <path d='M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0' />
          <path d='M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3' />
          <path d='M7 16.5c3.5 1 6.5 1 10 0' />
        </svg>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`}
        target='_blank'
        rel='noopener noreferrer'
        className='cursor-pointer rounded-xl border border-zinc-200 bg-white p-3 text-zinc-700 transition-all hover:border-zinc-300 hover:text-cyan-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-cyan-400'
        aria-label='Share on X'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={20}
          height={20}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M4 4l11.733 16h4.267l-11.733 -16z' />
          <path d='M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772' />
        </svg>
      </a>
      <button
        type='button'
        onClick={handleCopyLink}
        className='cursor-pointer rounded-xl border border-zinc-200 bg-white p-3 text-zinc-700 transition-all hover:border-zinc-300 hover:text-cyan-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-cyan-400'
        aria-label='Copy Link'
      >
        <Copy className='h-5 w-5' />
      </button>
    </div>
  );
}
