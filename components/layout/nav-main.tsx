"use client";
import {
  History,
  Layout,
  Users,
  Sparkles,
  Settings,
  HelpCircle,
  BookOpen,
  Palette,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useUserContext } from "@/context/AuthenticatedContext";

const navItems = [
  {
    title: "History",
    icon: History,
    href: "/history",
  },
  {
    title: "Community",
    icon: Palette,
    href: "/community",
  },
  {
    title: "Creators",
    icon: Users,
    href: "/creators",
  },
  {
    title: "Documentation",
    icon: BookOpen,
    href: "/documentation",
  },
  {
    title: "Upgrade",
    icon: Sparkles,
    href: "/upgrade",
  },
];

const secondaryNavItems = [
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    title: "Help",
    icon: HelpCircle,
    href: "/help",
  },
];

export function NavMain() {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const pathname = usePathname();
  const { theme } = useTheme();
  const user = useUserContext();

  const handleLinkClick = () => {
    // Close the mobile sidebar when a link is clicked
    setOpenMobile(false);
  };

  // For mobile, always show full content, for desktop use the state
  const shouldShowCollapsed = !isMobile && state === "collapsed";

  return (
    <>
      <SidebarGroup>
        <SidebarMenu className={cn(shouldShowCollapsed ? "items-center" : "")}>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={shouldShowCollapsed ? item.title : undefined}
                className={cn(
                  "transition-colors duration-300",
                  pathname === item.href
                    ? theme === "dark"
                      ? "bg-zinc-800 text-white"
                      : "bg-gray-200 text-black"
                    : theme === "dark"
                      ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                )}
              >
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className="flex items-center w-full text-gray-800 dark:text-gray-100"
                >
                  <item.icon
                    className={cn(
                      "w-4 h-4",
                      shouldShowCollapsed ? "mr-0" : "mr-2"
                    )}
                  />
                  <span
                    className={cn(
                      "transition-all duration-200",
                      shouldShowCollapsed ? "hidden" : "block"
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarMenu
          className={cn(
            shouldShowCollapsed ? "items-center gap-y-2" : "gap-y-2"
          )}
        >
          {secondaryNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={shouldShowCollapsed ? item.title : undefined}
                className={cn(
                  "transition-colors duration-300",
                  pathname === item.href
                    ? theme === "dark"
                      ? "bg-zinc-800 text-white"
                      : "bg-gray-200 text-black"
                    : theme === "dark"
                      ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                )}
              >
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className="flex items-center w-full text-gray-800 dark:text-gray-200"
                >
                  <item.icon
                    className={cn(
                      "w-4 h-4",
                      shouldShowCollapsed ? "mr-0" : "mr-2"
                    )}
                  />
                  <span
                    className={cn(
                      "transition-all duration-200",
                      shouldShowCollapsed ? "hidden" : "block"
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
