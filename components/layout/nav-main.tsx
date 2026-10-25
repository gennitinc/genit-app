"use client";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useLanguage } from "@/context/LanguageContext";
import { useMediaQuery } from "@/hooks/use-media-query";
import { trackAppOpened, trackFeatureUsed } from "@/lib/mixpanelClient";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Cog,
  GalleryHorizontal,
  Gift,
  GitBranchPlus,
  HelpCircle,
  History,
  Image as ImageIcon,
  Palette,
  Settings,
  SquarePen,
  UserPlus,
  Video,
  WandSparklesIcon,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function NavMain() {
  const { t } = useLanguage();
  const { state, setOpenMobile, isMobile } = useSidebar();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  const navItems = [
    {
      title: t("Visual"),
      icon: GalleryHorizontal,
      href: "/visuals",
      badge: t("New"),
    },
    {
      title: t("Chat"),
      icon: SquarePen,
      href: "/chat",
    },
    {
      title: t("Plugins"),
      icon: GitBranchPlus,
      href: "/plugins",
      // badge: "New",
    },
    // {
    //   title: t("Apps"),
    //   icon: Grid2X2Plus,
    //   href: "/apps",
    // },
    // {
    //   title: t("Community"),
    //   icon: Users,
    //   href: "/community",
    // },
    {
      title: t("History"),
      icon: History,
      href: "/chat/history",
    },
    {
      title: t("Creator"),
      icon: Gift,
      href: `/user/referral`,
    },
    // {
    //   title: t("Profile"),
    //   icon: UserPlus,
    //   href: `/creator/${user?.username}`,
    // },
  ];

  const secondaryNavItems = [
    // {
    //   title: t("Billing"),
    //   icon: CreditCard,
    //   href: "/user/settings?tab=billing",
    // },
    // {
    //   title: t("Blog"),
    //   icon: BookMarked,
    //   href: "/blog",
    // },
    {
      title: t("Settings"),
      icon: Cog,
      href: "/user/settings",
    },
    {
      title: t("Support"),
      icon: HelpCircle,
      href: "/feedback",
    },
  ];

  const handleLinkClick = () => {
    // Close the mobile sidebar when a link is clicked
    setOpenMobile(false);
  };

  // For mobile, always show full content, for desktop use the state
  const shouldShowCollapsed = !isMobile && state === "collapsed";
  const showDesktopCollapsedLabels = isDesktop && state === "collapsed";

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
    // Routes without query params stay active across their tab query values.
    return (
      pathname === href ||
      (href === "/visuals" && pathname.startsWith("/visuals/")) ||
      (href === "/chat" &&
        pathname !== "/chat/history" &&
        /^\/chat\/[^/]+$/.test(pathname))
    );
  };

  return (
    <div className='flex min-h-full flex-1 flex-col'>
      <SidebarGroup>
        <SidebarMenu className={cn(shouldShowCollapsed ? "items-center" : "")}>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isRouteActive(item.href)}
                tooltip={
                  shouldShowCollapsed && !showDesktopCollapsedLabels
                    ? item.title
                    : undefined
                }
                className={cn(
                  "transition-colors duration-300",
                  showDesktopCollapsedLabels &&
                    "!h-16 !w-14 !bg-transparent !p-1 hover:!bg-transparent",
                  !showDesktopCollapsedLabels && isRouteActive(item.href)
                    ? "bg-gray-200 text-black dark:bg-zinc-800 dark:text-white"
                    : !showDesktopCollapsedLabels &&
                        "text-gray-700 hover:bg-gray-100 hover:text-black dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
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
                <Link
                  href={item.href}
                  className={cn(
                    "flex w-full items-center",
                    showDesktopCollapsedLabels &&
                      "flex-col justify-center gap-1"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-6 w-6 flex-shrink-0 rounded-full",
                      showDesktopCollapsedLabels
                        ? "mx-auto !h-9 !w-9 rounded-lg p-2"
                        : shouldShowCollapsed
                          ? "mx-auto"
                          : "mr-2",
                      // Make icons more visible on mobile/tablet
                      isMobile && "h-7 w-7",
                      // Theme responsive icon colors - explicit and strong
                      isRouteActive(item.href)
                        ? cn(
                            "text-black dark:text-white",
                            showDesktopCollapsedLabels &&
                              "bg-gray-200 dark:bg-zinc-800"
                          )
                        : "text-gray-700 dark:text-zinc-300"
                    )}
                  />
                  {(!shouldShowCollapsed || showDesktopCollapsedLabels) && (
                    <span
                      className={cn(
                        "font-normal",
                        showDesktopCollapsedLabels &&
                          "max-w-14 truncate text-center text-[10px] leading-tight",
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
      <div className='mt-auto'>
        <div className='px-2'>
          <hr className='border-muted/40 flex-grow border-t' />
        </div>
        <SidebarGroup>
          <SidebarMenu
            className={cn(shouldShowCollapsed ? "items-center" : "")}
          >
            {secondaryNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isRouteActive(item.href)}
                  tooltip={
                    shouldShowCollapsed && !showDesktopCollapsedLabels
                      ? item.title
                      : undefined
                  }
                  className={cn(
                    "transition-colors duration-300",
                    showDesktopCollapsedLabels &&
                      "!h-16 !w-14 !bg-transparent !p-1 hover:!bg-transparent",
                    !showDesktopCollapsedLabels && isRouteActive(item.href)
                      ? "bg-gray-200 text-black dark:bg-zinc-800 dark:text-white"
                      : !showDesktopCollapsedLabels &&
                          "text-gray-700 hover:bg-gray-100 hover:text-black dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
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
                    className={cn(
                      "flex w-full items-center",
                      showDesktopCollapsedLabels &&
                        "flex-col justify-center gap-1"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-10 w-10 flex-shrink-0",
                        showDesktopCollapsedLabels
                          ? "mx-auto !h-9 !w-9 rounded-lg p-2"
                          : shouldShowCollapsed
                            ? "mx-auto"
                            : "mr-2",
                        // Make icons more visible on mobile/tablet
                        isMobile && "h-7 w-7",
                        // Theme responsive icon colors - explicit and strong
                        isRouteActive(item.href)
                          ? cn(
                              "text-black dark:text-white",
                              showDesktopCollapsedLabels &&
                                "bg-gray-200 dark:bg-zinc-800"
                            )
                          : "text-gray-700 dark:text-zinc-300"
                      )}
                    />
                    {(!shouldShowCollapsed || showDesktopCollapsedLabels) && (
                      <span
                        className={cn(
                          "font-medium",
                          showDesktopCollapsedLabels &&
                            "max-w-14 truncate text-center text-[10px] leading-tight",
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
      </div>
    </div>
  );
}
