"use client";

import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useUserContext } from "@/context/AuthenticatedContext";
import { NavUser } from "../layout/nav-user";
import { AdminNavMain } from "./AdminNavMain";
import Link from "next/link";

export function AdminSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile } = useSidebar();
  const user = useUserContext().user;

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "h-full border-border transition-colors duration-300 bg-white dark:bg-black [&_[data-sidebar=sidebar]]:bg-white dark:[&_[data-sidebar=sidebar]]:bg-black",
        className
      )}
      {...props}
    >
      <SidebarHeader className="flex-row justify-start py-4">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-2",
            state === "collapsed" && !isMobile && "justify-start"
          )}
        >
          <Logo className="w-10 h-10 flex-shrink-0" />
          <div
            className={cn(
              "flex flex-col transition-opacity duration-200",
              state === "collapsed" && !isMobile ? "hidden" : "block"
            )}
          >
            <span className="font-bold text-lg leading-tight">Admin</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <AdminNavMain />
      </SidebarContent>

      <SidebarFooter className="border-t border-border pt-4">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail className="border-border" />
    </Sidebar>
  );
}
