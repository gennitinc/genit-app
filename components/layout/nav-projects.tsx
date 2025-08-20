"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";

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
        Projects
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              tooltip={state === "collapsed" ? item.name : undefined}
            >
              <a
                href={item.url}
                className="flex items-center"
                onClick={handleLinkClick}
              >
                <item.icon
                  className={cn(state === "collapsed" ? "w-5 h-5" : "w-4 h-4")}
                />
                <span
                  className={cn(
                    "transition-all",
                    state === "collapsed"
                      ? "opacity-0 w-0"
                      : "opacity-100 w-auto ml-2"
                  )}
                >
                  {item.name}
                </span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className={cn(state === "collapsed" && "hidden")}
                >
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton
            className="text-sidebar-foreground/70"
            tooltip={state === "collapsed" ? "More" : undefined}
          >
            <MoreHorizontal
              className={cn(state === "collapsed" ? "w-5 h-5" : "w-4 h-4")}
            />
            <span
              className={cn(
                "transition-all",
                state === "collapsed"
                  ? "opacity-0 w-0"
                  : "opacity-100 w-auto ml-2"
              )}
            >
              More
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
