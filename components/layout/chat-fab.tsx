"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";

/** Floating shortcut to the AI chat, shown everywhere except the inbox and the chat itself. */
export function ChatFab() {
  const pathname = usePathname() ?? "";

  const inInbox = pathname.startsWith("/visuals/inbox");
  const inChat =
    pathname === "/chat" ||
    (pathname.startsWith("/chat/") && pathname !== "/chat/history");
  if (inInbox || inChat) return null;

  return (
    <Link
      href='/chat'
      aria-label='Open chat'
      title='Chat'
      className='bg-primary text-primary-foreground focus-visible:ring-ring fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 md:right-6 md:bottom-6'
    >
      <HugeiconsIcon icon={SparklesIcon} className='size-6' />
    </Link>
  );
}
