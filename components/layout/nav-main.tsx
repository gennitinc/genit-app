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
  Workflow,
  CardSim,
  CreditCard,
  Home,
  ChevronDown,
  Bot,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useUserContext } from "@/context/AuthenticatedContext";

const navItems = [
  {
    title: "Home",
    icon: Home,
    href: "/chat",
  },
  {
    title: "AI Brain",
    icon: Workflow,
    href: "/workflow",
  },
  {
    title: "Documentation",
    icon: BookOpen,
    href: "/documentation",
  },
  {
    title: "Billing",
    icon: CreditCard,
    href: "/billing",
  },
];

// Sample agents data - you can replace this with actual data from your backend
const availableAgents = [
  {
    id: 1,
    name: "Chat Assistant",
    href: "/agents/chat",
  },
  {
    id: 2,
    name: "Code Helper",
    href: "/agents/code",
  },
  {
    id: 3,
    name: "Content Writer",
    href: "/agents/writer",
  },
  {
    id: 4,
    name: "Data Analyst",
    href: "/agents/analyst",
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
                onClick={handleLinkClick}
              >
                <Link href={item.href}>
                  <item.icon
                    className={cn(
                      "h-4 w-4",
                      shouldShowCollapsed ? "mx-auto" : "mr-2"
                    )}
                  />
                  {!shouldShowCollapsed && <span>{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarMenu className={cn(shouldShowCollapsed ? "items-center" : "")}>
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
                onClick={handleLinkClick}
              >
                <Link href={item.href}>
                  <item.icon
                    className={cn(
                      "h-4 w-4",
                      shouldShowCollapsed ? "mx-auto" : "mr-2"
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
