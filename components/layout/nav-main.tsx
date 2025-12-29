"use client";
import {
  History,
  Settings,
  HelpCircle,
  Palette,
  CreditCard,
  WandSparklesIcon,
  UserPlus,
  Video,
  Image as ImageIcon,
  Users,
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
import { usePathname, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useUserContext } from "@/context/AuthenticatedContext";

const navItems = [
  {
    title: "Design Chat",
    icon: WandSparklesIcon,
    href: "/chat",
  },
  {
    title: "Ai Video Gen",
    icon: Video,
    href: "/inspire/create?mode=ai-video-gen",
  },
  {
    title: "Ai Image Gen",
    icon: ImageIcon,
    href: "/inspire/create?mode=ai-image-gen",
  },
  {
    title: "History",
    icon: History,
    href: "/chat/history",
  },
  {
    title: "Community",
    icon: Users,
    href: "/community",
  },
  {
    title: "Inspirations",
    icon: Palette,
    href: "/inspirations",
  },
  {
    title: "Creator",
    icon: UserPlus,
    href: "/user/referral",
  },
  {
    title: "Billing",
    icon: CreditCard,
    href: "/user/settings?tab=billing",
  },
];

const secondaryNavItems = [
  {
    title: "Settings",
    icon: Settings,
    href: "/user/settings",
  },
  {
    title: "Help",
    icon: HelpCircle,
    href: "/contact",
  },
];

export function NavMain() {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const user = useUserContext();

  const handleLinkClick = () => {
    // Close the mobile sidebar when a link is clicked
    setOpenMobile(false);
  };

  // For mobile, always show full content, for desktop use the state
  const shouldShowCollapsed = !isMobile && state === "collapsed";

  // Helper function to check if a route is active (handles query params)
  const isRouteActive = (href: string) => {
    // First check if pathname matches
    if (href.includes("?")) {
      const [basePath, queryString] = href.split("?");

      // Check if pathname matches
      if (pathname !== basePath && !pathname.startsWith(basePath + "/")) {
        return false;
      }

      // Parse query parameters from href
      const hrefParams = new URLSearchParams(queryString);

      // Check if all query params in href match current search params
      for (const [key, value] of hrefParams.entries()) {
        const currentValue = searchParams.get(key);
        if (currentValue !== value) {
          return false;
        }
      }

      return true;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      <SidebarGroup>
        <SidebarMenu className={cn(shouldShowCollapsed ? "items-center" : "")}>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isRouteActive(item.href)}
                tooltip={shouldShowCollapsed ? item.title : undefined}
                className={cn(
                  "transition-colors duration-300",
                  isRouteActive(item.href)
                    ? theme === "dark"
                      ? "bg-zinc-800 text-white"
                      : "bg-gray-200 text-black"
                    : theme === "dark"
                      ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                )}
                onClick={handleLinkClick}
              >
                <Link href={item.href}>
                  <item.icon
                    className={cn(
                      "h-6 w-6 flex-shrink-0",
                      shouldShowCollapsed ? "mx-auto" : "mr-2",
                      // Make icons more visible on mobile/tablet
                      isMobile && "h-7 w-7",
                      // Theme responsive icon colors
                      isRouteActive(item.href)
                        ? theme === "dark"
                          ? "text-white"
                          : "text-black"
                        : theme === "dark"
                          ? "text-zinc-300"
                          : "text-gray-600"
                    )}
                  />
                  {!shouldShowCollapsed && (
                    <span
                      className={cn(
                        // Theme responsive text colors
                        isRouteActive(item.href)
                          ? theme === "dark"
                            ? "text-white"
                            : "text-black"
                          : theme === "dark"
                            ? "text-zinc-300"
                            : "text-gray-700"
                      )}
                    >
                      {item.title}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <div className="px-2">
        <hr className="flex-grow border-t border-muted/40" />
      </div>
      <SidebarGroup>
        <SidebarMenu className={cn(shouldShowCollapsed ? "items-center" : "")}>
          {secondaryNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isRouteActive(item.href)}
                tooltip={shouldShowCollapsed ? item.title : undefined}
                className={cn(
                  "transition-colors duration-300",
                  isRouteActive(item.href)
                    ? theme === "dark"
                      ? "bg-zinc-800 text-white"
                      : "bg-gray-200 text-black"
                    : theme === "dark"
                      ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                )}
                onClick={handleLinkClick}
              >
                <Link
                  href={item.href}
                  {...(item.href === "/contact" ? { target: "_blank" } : {})}
                >
                  <item.icon
                    className={cn(
                      "h-6 w-6 flex-shrink-0",
                      shouldShowCollapsed ? "mx-auto" : "mr-2",
                      // Make icons more visible on mobile/tablet
                      isMobile && "h-7 w-7",
                      // Theme responsive icon colors
                      isRouteActive(item.href)
                        ? theme === "dark"
                          ? "text-white"
                          : "text-black"
                        : theme === "dark"
                          ? "text-zinc-300"
                          : "text-gray-600"
                    )}
                  />
                  {!shouldShowCollapsed && (
                    <span
                      className={cn(
                        // Theme responsive text colors
                        isRouteActive(item.href)
                          ? theme === "dark"
                            ? "text-white"
                            : "text-black"
                          : theme === "dark"
                            ? "text-zinc-300"
                            : "text-gray-700"
                      )}
                    >
                      {item.title}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
