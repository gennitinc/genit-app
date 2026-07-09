"use client";

import { OrgSwitcher } from "@/components/layout/org-switcher";
import {
  CalendarFold,
  FolderSync,
  Home,
  Inbox,
  Layers,
  Library,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const CATEGORIES = [
  { id: "home", label: "Home", icon: Home, href: "/visuals" },
  {
    id: "calendar",
    label: "Calendar",
    icon: CalendarFold,
    href: "/visuals/calendar",
  },
  {
    id: "library",
    label: "Media Library",
    icon: Library,
    href: "/visuals/library",
  },
  {
    id: "posts",
    label: "Posts",
    icon: Layers,
    href: "/visuals/posts",
  },
  { id: "inbox", label: "Unified Inbox", icon: Inbox, href: "/visuals/inbox" },
  {
    id: "automation",
    label: "Automation",
    icon: Workflow,
    href: "/visuals/automation",
  },
];

export function VisualsSidebar() {
  const pathname = usePathname();

  return (
    <div className='scrollbar-hide top-14 flex w-full shrink-0 flex-col md:sticky md:max-h-[calc(100vh-8rem)] md:w-64 md:self-start'>
      {/* Org Switcher (Desktop only) */}
      <div className='relative -mx-2 mb-4 hidden w-full border-b border-black/5 px-2 pb-2 md:flex dark:border-white/10'>
        <OrgSwitcher forceExpanded={true} />
      </div>

      {/* Navigation */}
      <nav className='scrollbar-hide flex flex-row gap-1 overflow-x-auto border-b border-zinc-200 pb-4 md:flex-col md:gap-2 md:overflow-x-visible md:border-b-0 md:pb-0 dark:border-zinc-800'>
        {CATEGORIES.map((cat) => {
          const isActive = pathname === cat.href;
          return (
            <Link
              href={cat.href}
              key={cat.id}
              className={`flex cursor-pointer items-center gap-3 rounded-sm px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? "text-foreground dark:text-foreground bg-white shadow-sm ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10"
                  : "text-zinc-500 hover:bg-white/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200"
              }`}
            >
              <cat.icon
                className={`h-4 w-4 ${isActive ? "text-sky-500 dark:text-sky-300" : ""}`}
              />
              {cat.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
