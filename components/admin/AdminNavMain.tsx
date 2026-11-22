"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { DashboardSquare01Icon, UserGroupIcon, Activity01Icon, CreditCardIcon, Layout01Icon, PaintBoardIcon, File02Icon, BookOpen01Icon, LibraryIcon, CpuIcon, Mic01Icon, UserSquareIcon, Settings01Icon, LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNavMain() {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const pathname = usePathname();
  const { theme } = useTheme();

  const navItems = [
    {
      title: "Dashboard",
      icon: DashboardSquare01Icon,
      href: "/admin",
    },
    {
      title: "User Management",
      icon: UserGroupIcon,
      href: "/admin/users",
    },
    {
      title: "Activity Logs",
      icon: Activity01Icon,
      href: "/admin/activity",
    },
    {
      title: "Revenue",
      icon: CreditCardIcon,
      href: "/admin/revenue",
    },
    {
      title: "Asset Templates",
      icon: Layout01Icon,
      href: "/admin/templates",
    },
    {
      title: "Design Inspirations",
      icon: PaintBoardIcon,
      href: "/admin/designinspirations",
    },
    {
      title: "Blog Posts",
      icon: File02Icon,
      href: "/admin/blog",
    },
    {
      title: "Docs",
      icon: BookOpen01Icon,
      href: "/admin/docs",
    },
    {
      title: "Media Library",
      icon: LibraryIcon,
      href: "/admin/blog/library",
    },
    {
      title: "AI Models",
      icon: CpuIcon,
      href: "/admin/inspire/models",
    },
    {
      title: "AI Voices",
      icon: Mic01Icon,
      href: "/admin/inspire/voices",
    },
    {
      title: "AI Presenters",
      icon: UserSquareIcon,
      href: "/admin/inspire/presenters",
    },
  ];

  const secondaryNavItems = [
    {
      title: "Platform Settings",
      icon: Settings01Icon,
      href: "/admin/settings",
    },
    {
      title: "Back to User View",
      icon: LinkSquare02Icon,
      href: "/apps",
    },
  ];

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  const shouldShowCollapsed = !isMobile && state === "collapsed";
  const isRouteActive = (href: string) => pathname === href;

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
                    ? "text-primary bg-indigo-600 font-semibold hover:bg-indigo-700/10"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={handleLinkClick}
              >
                <Link href={item.href} className='flex w-full items-center'>
                  <HugeiconsIcon icon={item.icon}
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      shouldShowCollapsed ? "mx-auto" : "mr-3"
                    )}
                  />
                  {!shouldShowCollapsed && <span>{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      <div className='px-4 py-2'>
        <div className='bg-border/50 h-px' />
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
                    ? "text-primary bg-indigo-600 font-semibold hover:bg-indigo-700/10"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={handleLinkClick}
              >
                <Link href={item.href} className='flex w-full items-center'>
                  <HugeiconsIcon icon={item.icon}
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      shouldShowCollapsed ? "mx-auto" : "mr-3"
                    )}
                  />
                  {!shouldShowCollapsed && <span>{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
