"use client";

import {
  LayoutDashboard,
  Users,
  Activity,
  CreditCard,
  Settings,
  ExternalLink,
  Layout,
  Palette,
  Sparkles,
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

export function AdminNavMain() {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const pathname = usePathname();
  const { theme } = useTheme();

  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      title: "User Management",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Activity Logs",
      icon: Activity,
      href: "/admin/activity",
    },
    {
      title: "Revenue",
      icon: CreditCard,
      href: "/admin/revenue",
    },
    {
      title: "Asset Templates",
      icon: Layout,
      href: "/admin/templates",
    },
    {
      title: "Design Inspirations",
      icon: Palette,
      href: "/admin/designinspirations",
    },
    // {
    //   title: "Inspire Management",
    //   icon: Sparkles,
    //   href: "/admin/inspire",
    // },
  ];

  const secondaryNavItems = [
    {
      title: "Platform Settings",
      icon: Settings,
      href: "/admin/settings",
    },
    {
      title: "Back to User View",
      icon: ExternalLink,
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
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={handleLinkClick}
              >
                <Link href={item.href} className="flex items-center w-full">
                  <item.icon
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

      <div className="px-4 py-2">
        <div className="h-px bg-border/50" />
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
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={handleLinkClick}
              >
                <Link href={item.href} className="flex items-center w-full">
                  <item.icon
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
