"use client";

import { hostHref } from "@/lib/domains";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import genitMark from "@/resources/images/genit-mark.png";

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
      href={hostHref("/chat")}
      aria-label='Open chat'
      title='Chat'
      className='bg-[#4F46E5] text-white active:bg-[#4338CA] dark:bg-[#6366F1] dark:active:bg-[#4F46E5] focus-visible:ring-ring fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 flex size-14 items-center justify-center rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:right-6 md:bottom-6'
    >
      <Image
        src={genitMark}
        alt=''
        width={30}
        height={30}
        className='size-[30px] brightness-0 invert'
      />
    </Link>
  );
}
