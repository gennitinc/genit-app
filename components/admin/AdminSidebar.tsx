"use client";

import { NavUser } from "../layout/nav-user";
import { AdminNavMain } from "./AdminNavMain";
import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserContext } from "@/context/AuthenticatedContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type * as React from "react";

export function AdminSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile } = useSidebar();
  const user = useUserContext().user;

  return (
    <Sidebar
      collapsible='icon'
      className={cn(
        "border-border h-full bg-white transition-colors duration-300 dark:bg-black [&_[data-sidebar=sidebar]]:bg-white dark:[&_[data-sidebar=sidebar]]:bg-black",
        className
      )}
      {...props}
    >
      <SidebarHeader className='flex-row justify-start py-4'>
        <Link
          href='/admin'
          className={cn(
            "flex items-center gap-2",
            state === "collapsed" && !isMobile && "justify-start"
          )}
        >
          <Logo className='h-10 w-10 flex-shrink-0' />
          <div
            className={cn(
              "flex flex-col transition-opacity duration-200",
              state === "collapsed" && !isMobile ? "hidden" : "block"
            )}
          >
            <span className='text-lg leading-tight font-bold'>Admin</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <AdminNavMain />
      </SidebarContent>

      <SidebarFooter className='border-border border-t pt-4'>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
