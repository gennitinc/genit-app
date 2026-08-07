"use client";

import { LocalizedText } from "@/components/localized-text";
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
import AccountActionModal from "@/components/user/account-action-modal";
import { useAccountActions } from "@/hooks/use-account-actions";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";

export function NavUser({ user }: any) {
  const { isMobile, state } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { signOut, isSigningOut } = useAccountActions();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const isCollapsed = !isMobile && state === "collapsed";

  const handleSignOutConfirm = async () => {
    await signOut();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className='m-0 p-0'>
            <SidebarMenuButton
              size={isCollapsed ? "sm" : "lg"}
              className={
                isCollapsed
                  ? "data-[state=open]:bg-background data-[state=open]:text-foreground w-full justify-center !px-2"
                  : "data-[state=open]:bg-background data-[state=open]:text-foreground w-full"
              }
            >
              <Avatar className={isCollapsed ? "h-6 w-6 px-0" : "h-8 w-8 px-0"}>
                <AvatarImage
                  src={user?.userdp}
                  alt={user?.username}
                  className='object-cover'
                />
                <AvatarFallback>{user?.username[0]}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className='ml-2 grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {user?.username}
                    </span>
                    <span className='text-muted-foreground truncate text-xs'>
                      {user?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className='ml-auto h-4 w-4' />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='bg-popover text-popover-foreground border-border w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? "bottom" : "right"}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <Link
                href={`/creator/${user?.username}`}
                className='pz-2 hover:bg-accent flex items-center gap-2 rounded-md transition-colors'
              >
                <Avatar className='h-10 w-10'>
                  <AvatarImage
                    src={user?.userdp}
                    alt={user?.username}
                    className='object-cover'
                  />
                  <AvatarFallback>{user?.username[0]}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='font-medium'>{user?.username}</span>
                  <span className='text-muted-foreground text-xs'>
                    {user?.email}
                  </span>
                </div>
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className='bg-border' />
            <DropdownMenuGroup>
              <DropdownMenuItem
                asChild
                className='focus:bg-accent focus:text-accent-foreground'
              >
                <Link href={`/creator/${user?.username}`}>
                  <User className='mr-2 h-4 w-4' />
                  <LocalizedText text={"View Profile"} />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='focus:bg-accent focus:text-accent-foreground'>
                <BadgeCheck className='mr-2 h-4 w-4' />
                <LocalizedText text={"Account"} />
              </DropdownMenuItem>
              <DropdownMenuItem className='focus:bg-accent focus:text-accent-foreground'>
                <CreditCard className='mr-2 h-4 w-4' />
                <LocalizedText text={"Billing"} />
              </DropdownMenuItem>
              {/* <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className='bg-border' />
            <DropdownMenuItem
              className='focus:bg-accent focus:text-accent-foreground'
              onSelect={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <>
                  <Sun className='mr-2 h-4 w-4' />
                  <span>
                    <LocalizedText text={"Switch to light mode"} />
                  </span>
                </>
              ) : (
                <>
                  <Moon className='mr-2 h-4 w-4' />
                  <span>
                    <LocalizedText text={"Switch to dark mode"} />
                  </span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className='focus:bg-accent focus:text-accent-foreground'
              onSelect={(event) => {
                event.preventDefault();
                setIsSignOutModalOpen(true);
              }}
            >
              <LogOut className='mr-2 h-4 w-4' />
              <LocalizedText text={"Log out"} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <AccountActionModal
        open={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={handleSignOutConfirm}
        loading={isSigningOut}
        title='Sign out?'
        description="You'll be signed out of your session on this device."
        confirmLabel='Sign out'
      />
    </SidebarMenu>
  );
}
