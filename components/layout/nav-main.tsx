"use client";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useUserContext } from "@/context/AuthenticatedContext";
import { trackAppOpened, trackFeatureUsed } from "@/lib/mixpanelClient";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  GalleryHorizontal,
  Gift,
  Grid2X2Plus,
  HelpCircle,
  History,
  Image as ImageIcon,
  Palette,
  Settings,
  UserPlus,
  Users,
  Video,
  WandSparklesIcon,
  Workflow,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function NavMain() {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  const user = useUserContext().user;
  const navItems = [
    {
      title: "Design Chat",
      icon: WandSparklesIcon,
      href: "/chat",
    },
    {
      title: "Agents",
      icon: Grid2X2Plus,
      href: "/agents",
    },
    {
      title: "Workflow",
      icon: Workflow,
      href: "/agents/workflow",
      badge: "New",
    },
    // {
    //   title: "Image Generation",
    //   icon: ImageIcon,
    //   href: "/agents/image-generation",
    // },
    // {
    //   title: "Video Generation",
    //   icon: Video,
    //   href: "/agents/video-generation",
    // },
    // {
    //   title: "Presenter",
    //   icon: UserPlus,
    //   href: "/agents/presenter",
    // },

    {
      title: "Community",
      icon: Users,
      href: "/community",
    },
    {
      title: "History",
      icon: History,
      href: "/chat/history",
    },
    {
      title: "Creator Program",
      icon: Gift,
      href: `/user/referral`,
    },
    {
      title: "Profile",
      icon: UserPlus,
      href: `/creator/${user?.username}`,
    },
  ];

  const secondaryNavItems = [
    {
      title: "Pricing",
      icon: CreditCard,
      href: "/pricing",
    },
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

  const handleLinkClick = () => {
    // Close the mobile sidebar when a link is clicked
    setOpenMobile(false);
  };

  // For mobile, always show full content, for desktop use the state
  const shouldShowCollapsed = !isMobile && state === "collapsed";

  // Helper function to check if a route is active (handles query params)
  const isRouteActive = (href: string) => {
    if (href.includes("?")) {
      const [basePath, queryString] = href.split("?");

      // For routes with query params, pathname must exactly match the base path
      if (pathname !== basePath) {
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
    // For routes without query params, use exact pathname matching
    // This prevents parent routes from being active when on child routes
    return pathname === href;
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
                      ? "bg-zinc-800 text-white dark:text-white"
                      : "bg-gray-200 text-black dark:text-black"
                    : theme === "dark"
                      ? "text-zinc-300 hover:bg-zinc-800 hover:text-white dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black dark:text-gray-700 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                )}
                onClick={() => {
                  handleLinkClick();
                  trackAppOpened(
                    item.href.replace(/\//g, "-") || "home",
                    item.title,
                    "sidebar_nav",
                    { href: item.href || "" }
                  );
                }}
              >
                <Link href={item.href} className='flex w-full items-center'>
                  <item.icon
                    className={cn(
                      "h-6 w-6 flex-shrink-0",
                      shouldShowCollapsed ? "mx-auto" : "mr-2",
                      // Make icons more visible on mobile/tablet
                      isMobile && "h-7 w-7",
                      // Theme responsive icon colors - explicit and strong
                      isRouteActive(item.href)
                        ? "text-black dark:text-white"
                        : "text-gray-700 dark:text-zinc-300"
                    )}
                  />
                  {!shouldShowCollapsed && (
                    <span
                      className={cn(
                        "font-normal",
                        // Theme responsive text colors - explicit and strong
                        isRouteActive(item.href)
                          ? "text-black dark:text-white"
                          : "text-gray-800 dark:text-zinc-200"
                      )}
                    >
                      {item.title}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
              {(item as any).badge && !shouldShowCollapsed && (
                <SidebarMenuBadge className='rounded-sm bg-emerald-500 px-1.5 font-bold text-white'>
                  {(item as any).badge}
                </SidebarMenuBadge>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <div className='px-2'>
        <hr className='border-muted/40 flex-grow border-t' />
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
                      ? "bg-zinc-800 text-white dark:text-white"
                      : "bg-gray-200 text-black dark:text-black"
                    : theme === "dark"
                      ? "text-zinc-300 hover:bg-zinc-800 hover:text-white dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black dark:text-gray-700 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                )}
                onClick={() => {
                  handleLinkClick();
                  trackFeatureUsed("secondary_nav_clicked", {
                    nav_item: item.title || "",
                    href: item.href,
                  });
                }}
              >
                <Link
                  href={item.href}
                  className='flex w-full items-center'
                  {...(item.href === "/contact" ? { target: "_blank" } : {})}
                >
                  <item.icon
                    className={cn(
                      "h-10 w-10 flex-shrink-0",
                      shouldShowCollapsed ? "mx-auto" : "mr-2",
                      // Make icons more visible on mobile/tablet
                      isMobile && "h-7 w-7",
                      // Theme responsive icon colors - explicit and strong
                      isRouteActive(item.href)
                        ? "text-black dark:text-white"
                        : "text-gray-700 dark:text-zinc-300"
                    )}
                  />
                  {!shouldShowCollapsed && (
                    <span
                      className={cn(
                        "font-medium",
                        // Theme responsive text colors - explicit and strong
                        isRouteActive(item.href)
                          ? "text-black dark:text-white"
                          : "text-gray-800 dark:text-zinc-200"
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
