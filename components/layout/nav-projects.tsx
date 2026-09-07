"use client";

import { LocalizedText } from "@/components/localized-text";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Folder,
  Forward,
  type LucideIcon,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const { isMobile, state, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    // Close the mobile sidebar when a link is clicked
    setOpenMobile(false);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel
        className={cn("text-zinc-400", state === "collapsed" && "sr-only")}
      >
        <LocalizedText text={"Projects"} />
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              tooltip={state === "collapsed" ? item.name : undefined}
            >
              <Link
                href={item.url}
                className='flex items-center'
                onClick={handleLinkClick}
              >
                <item.icon
                  className={cn(state === "collapsed" ? "h-5 w-5" : "h-4 w-4")}
                />
                <span
                  className={cn(
                    "transition-all",
                    state === "collapsed"
                      ? "w-0 opacity-0"
                      : "ml-2 w-auto opacity-100"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className={cn(state === "collapsed" && "hidden")}
                >
                  <MoreHorizontal />
                  <span className='sr-only'>
                    <LocalizedText text={"More"} />
                  </span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-48 rounded-lg'
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className='text-muted-foreground' />
                  <span>
                    <LocalizedText text={"View Project"} />
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className='text-muted-foreground' />
                  <span>
                    <LocalizedText text={"Share Project"} />
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className='text-muted-foreground' />
                  <span>
                    <LocalizedText text={"Delete Project"} />
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton
            className='text-sidebar-foreground/70'
            tooltip={state === "collapsed" ? "More" : undefined}
          >
            <MoreHorizontal
              className={cn(state === "collapsed" ? "h-5 w-5" : "h-4 w-4")}
            />
            <span
              className={cn(
                "transition-all",
                state === "collapsed"
                  ? "w-0 opacity-0"
                  : "ml-2 w-auto opacity-100"
              )}
            >
              <LocalizedText text={"More"} />
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
