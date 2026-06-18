"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Inbox, CalendarDays, Zap, BarChart, FileText, Sparkles, Home 
} from "lucide-react";
import { OrgSwitcher } from "@/components/layout/org-switcher";

const CATEGORIES = [
  { id: "home", label: "Home", icon: Home, href: "/visuals" },
  { id: "calendar", label: "Calendar", icon: CalendarDays, href: "/visuals/calendar" },
  { id: "inbox", label: "Unified Inbox", icon: Inbox, href: "/visuals/inbox" },
  { id: "automation", label: "Automation", icon: Zap, href: "/visuals/automation" },
  { id: "posts", label: "Post & Analytics", icon: BarChart, href: "/visuals/posts" },
  { id: "summary", label: "Summary & Report", icon: FileText, href: "/visuals/summary" },
  { id: "ai", label: "AI Recommendations", icon: Sparkles, href: "/visuals/ai" },
];

export function VisualsSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full md:w-64 shrink-0 flex flex-col md:sticky md:top-24 md:self-start md:max-h-[calc(100vh-8rem)] scrollbar-hide">
      
      {/* Org Switcher (Desktop only) */}
      <div className="hidden md:flex mb-4 pb-2 border-b border-black/5 dark:border-white/10 w-full relative -mx-2 px-2">
        <OrgSwitcher forceExpanded={true} />
      </div>

      {/* Navigation */}
      <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 gap-1 md:gap-2 border-b border-zinc-200 dark:border-zinc-800 md:border-b-0 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isActive = pathname === cat.href;
          return (
            <Link
              href={cat.href}
              key={cat.id}
              className={`flex items-center gap-3 px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-white/5"
              }`}
            >
              <cat.icon className={`w-4 h-4 ${isActive ? 'text-indigo-500 dark:text-indigo-400' : ''}`} />
              {cat.label}
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
