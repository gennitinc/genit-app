"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({ user }: any) {
  const { isMobile, state } = useSidebar();
  const { theme, setTheme } = useTheme();

  const isCollapsed = !isMobile && state === "collapsed";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="p-0 m-0">
            <SidebarMenuButton
              size={isCollapsed ? "sm" : "lg"}
              className={
                isCollapsed
                  ? "justify-center !px-2 data-[state=open]:bg-background data-[state=open]:text-foreground w-full"
                  : "data-[state=open]:bg-background data-[state=open]:text-foreground w-full"
              }
            >
              <Avatar className={isCollapsed ? "w-6 h-6 px-0" : "w-8 h-8 px-0"}>
                <AvatarImage
                  src={user?.metadata?.userdp}
                  alt={user?.name}
                  className="object-cover"
                />
                <AvatarFallback>{user?.username[0]}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                    <span className="truncate font-semibold">
                      {user?.username}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="w-4 h-4 ml-auto" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-popover text-popover-foreground border-border"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 pz-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user?.metadata?.userdp}
                    alt={user?.name}
                    className="object-cover"
                  />
                  <AvatarFallback>{user?.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground">
                <BadgeCheck className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              className="focus:bg-accent focus:text-accent-foreground"
              onSelect={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Switch to light mode</span>
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Switch to dark mode</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
