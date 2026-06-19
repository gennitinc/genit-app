"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Activity,
  CreditCard,
  ExternalLink,
  Layout,
  LayoutDashboard,
  Palette,
  Settings,
  Sparkles,
  Users,
  FileText,
  Cpu,
  Mic,
  UserSquare,
  Library,
} from "lucide-react";
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
    {
      title: "Blog Posts",
      icon: FileText,
      href: "/admin/blog",
    },
    {
      title: "Media Library",
      icon: Library,
      href: "/admin/blog/library",
    },
    {
      title: "AI Models",
      icon: Cpu,
      href: "/admin/inspire/models",
    },
    {
      title: "AI Voices",
      icon: Mic,
      href: "/admin/inspire/voices",
    },
    {
      title: "AI Presenters",
      icon: UserSquare,
      href: "/admin/inspire/presenters",
    },
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
                    ? "bg-indigo-600 hover:bg-indigo-700/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={handleLinkClick}
              >
                <Link href={item.href} className='flex w-full items-center'>
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
                    ? "bg-indigo-600 hover:bg-indigo-700/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={handleLinkClick}
              >
                <Link href={item.href} className='flex w-full items-center'>
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
