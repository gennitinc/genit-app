"use client";

import { Logo } from "../logo";
import Aurora from "../ui/aurora";
import UserPopOver from "../user/userPopOver";
import CategoryAndSearch from "@/components/common/category-and-search";
import { PricingDialog } from "@/components/common/pricing-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { ArrowRight, PanelRight, Search } from "lucide-react";
import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LandingNavbar() {
  const { theme, setTheme } = useTheme();
  const user = useUserContext().user;
  const [mounted, setMounted] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 1024px)");

  const currentUser = mounted ? user : null;
  const currentIsSmallScreen = mounted ? isSmallScreen : false;

  const navigation = [
    { name: "Chat", href: "/chat" },
    { name: "Integrations", href: "/integrations" },
    { name: "Apps", href: "/apps" },
    // { name: "Video & Image Gen", href: "/inspire/create?mode=ai-video-gen" },
    { name: "Community", href: "/community" },
    { name: "Blog", href: "/blog" },
    { name: "History", href: currentUser ? "/chat/history" : "/signin" },
    {
      name: "Creator Program",
      href: currentUser ? `/user/referral` : "/creators-program",
    },
    // currentUser && {
    //   name: "Profile",
    //   href: `/creator/${currentUser?.username}`,
    // },
    {
      name: currentUser ? "Billing" : "Pricing",
      href: currentUser ? "/user/settings?tab=billing" : "/pricing",
    },
    { name: "Company", href: "/company" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className='sticky top-0 z-50 w-full bg-transparent backdrop-blur-sm'>
        <nav className='z-50 mx-auto flex h-16 items-center justify-between px-2 md:px-12 lg:px-20 xl:px-24'>
          {/* Replace <img> with new <Image> */}
          <Link href='/' className='z-40 flex items-center'>
            <Logo className='h-12 w-12 flex-shrink-0' />
            <span
              className={`text-foreground text-xl font-semibold transition-colors duration-300`}
            >
              Genit
            </span>
          </Link>

          <div className='z-50 hidden items-center gap-4 lg:flex'>
            <div className='flex items-center gap-2 sm:gap-2'>
              <div className='flex flex-1 items-center justify-end gap-2 sm:gap-2 md:justify-end'>
                <Link
                  className='hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors'
                  href='/chat'
                >
                  Chat
                </Link>
                <Link
                  className='hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors'
                  href='/integrations'
                >
                  Integrations
                </Link>
                <Link
                  className='hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors'
                  href='/apps'
                >
                  Apps
                </Link>
                <Link
                  target='__blank'
                  className='hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors'
                  href='/community'
                >
                  Community
                </Link>
                <Link
                  className='hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors'
                  href='/blog'
                >
                  Blog
                </Link>
                <Link
                  target='__blank'
                  className='hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors'
                  href={currentUser ? "/user/settings?tab=billing" : "/pricing"}
                >
                  {currentUser ? "Billing" : "Pricing"}
                </Link>
                {currentUser && (
                  <Link
                    target=''
                    className='hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors'
                    href='/chat/history'
                  >
                    History
                  </Link>
                )}
                <Link
                  target='_blank'
                  className='hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors'
                  href='https://discord.gg/ftZbQvCdN7'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='h-4 w-4 text-neutral-500 dark:text-neutral-500'
                  >
                    <path d='M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0' />
                    <path d='M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0' />
                    <path d='M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3' />
                    <path d='M7 16.5c3.5 1 6.5 1 10 0' />
                  </svg>
                </Link>
                <Link
                  target='_blank'
                  className='hover:text-foreground/80 text-foreground/60 text-sm font-medium transition-colors'
                  href='https://twitter.com/genit_ai'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='h-4 w-4 text-neutral-500 dark:text-neutral-500'
                  >
                    <path d='M4 4l11.733 16h4.267l-11.733 -16z' />
                    <path d='M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772' />
                  </svg>
                </Link>

                <button
                  onClick={() => setIsSearchOpen(true)}
                  className='text-muted-foreground bg-muted relative flex w-fit items-center justify-start rounded-xl border border-transparent px-4 py-2 text-sm shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] dark:border-white/[0.2]'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='h-4 w-4 text-neutral-500'
                  >
                    <path d='M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' />
                    <path d='M21 21l-6 -6' />
                  </svg>
                  <span className='hover:text-foreground/80 text-foreground/60 rex pr-4 pl-2 text-xs font-medium transition-colors sm:text-sm'>
                    Search{" "}
                    <span className='hidden xl:inline-block'>
                      {currentUser ? "Inspirations" : "Templates"}
                    </span>
                  </span>
                  <kbd className='bg-muted pointer-events-none hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex'>
                    <span className='text-xs'>⌘</span>K
                  </kbd>
                </button>
              </div>

              <Button
                variant='ghost'
                size='sm'
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className='hover:bg-accent h-8 w-8 rounded-lg p-0'
              >
                {mounted ? (
                  theme === "dark" ? (
                    <Sun className='h-4 w-4' />
                  ) : (
                    <Moon className='h-4 w-4' />
                  )
                ) : (
                  <div className='h-4 w-4' />
                )}
              </Button>

              {currentUser ? (
                <UserPopOver />
              ) : (
                <div className='flex items-center gap-2'>
                  <Link
                    className='text-gray-9 [&_svg]:text-gray-9 hover:text-gray-10 focus-visible:ring-gray-a2 relative hidden h-10 items-center justify-center gap-0 rounded-2xl border border-transparent bg-transparent px-4 text-sm font-semibold transition duration-200 ease-in-out select-none focus-visible:ring-4 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-70 lg:flex'
                    data-state='closed'
                    href='/signin'
                  >
                    Sign in
                  </Link>
                  <Link
                    className='hover:shadow-button relative inline-flex h-10 items-center justify-center gap-0 rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-4 text-sm font-semibold text-white shadow-sm shadow-primary/10 outline-hidden backdrop-blur-[25px] transition-all duration-200 ease-in-out select-none focus-visible:ring-4 focus-visible:ring-cyan-500/30 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-30'
                    href='/signup'
                  >
                    <span>Start for $0</span>
                    <ArrowRight className='ml-1 h-4 w-4' />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile/Tablet Menu Section */}
          <div className='flex items-center gap-2 lg:hidden'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsSearchOpen(true)}
              className='hover:bg-accent h-8 w-8 rounded-lg p-0'
              aria-label='Search'
            >
              <Search className='h-4 w-4' />
            </Button>
            
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className='hover:bg-accent h-8 w-8 rounded-lg p-0'
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className='h-4 w-4' />
                ) : (
                  <Moon className='h-4 w-4' />
                )
              ) : (
                <div className='h-4 w-4' />
              )}
            </Button>

            {currentUser ? (
              <UserPopOver />
            ) : (
              <div className='flex items-center gap-2'>
                <Link
                  className='text-gray-9 [&_svg]:text-gray-9 hover:text-gray-10 focus-visible:ring-gray-a2 relative hidden h-10 items-center justify-center gap-0 rounded-2xl border border-transparent bg-transparent px-4 text-sm font-semibold transition duration-200 ease-in-out select-none focus-visible:ring-4 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-70 md:flex'
                  data-state='closed'
                  href='/signin'
                >
                  Sign in
                </Link>
                <Link
                  className='text-primary-foreground border-primary/20 bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-600 hover:bg-indigo-700/90 hover:shadow-button focus-visible:ring-primary/30 relative inline-flex h-10 items-center justify-center gap-0 rounded-2xl border-[2px] px-4 text-sm font-semibold shadow-sm outline-hidden backdrop-blur-[25px] transition-all duration-200 ease-in-out select-none focus-visible:ring-4 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-30'
                  href='/signup'
                >
                  <span>Start for $0</span>
                  <ArrowRight className='ml-1 h-4 w-4' />
                </Link>
              </div>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='z-50'>
                  <PanelRight className='text-muted-foreground size-4 h-4 w-4' />
                  <span className='sr-only'>Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='right'>
                <div className='mt-8 flex flex-col gap-4'>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                    >
                      {item.name}
                    </Link>
                  ))}
                  <hr className='my-4' />
                  {currentUser ? (
                    <Link
                      href={`/creator/${currentUser?.username}`}
                      className='flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    >
                      <Avatar className='h-10 w-10'>
                        <AvatarImage src={currentUser?.userdp} alt={currentUser?.username} />
                        <AvatarFallback>{currentUser?.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='font-medium'>{currentUser?.username}</span>
                        <span className='text-xs text-zinc-400'>
                          {currentUser?.email}
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className='flex w-fit flex-col gap-2'>
                      <Link
                        className='text-gray-9 [&_svg]:text-gray-9 hover:text-gray-10 focus-visible:ring-gray-a2 relative h-10 items-center justify-center gap-0 rounded-2xl border border-transparent bg-transparent px-4 text-sm font-semibold transition duration-200 ease-in-out select-none focus-visible:ring-4 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-70'
                        data-state='closed'
                        href='/signin'
                      >
                        Sign in
                      </Link>
                      <Link
                        className='text-foreground not-disabled:hover:shadow-button relative inline-flex h-10 items-center justify-center gap-0 rounded-2xl border-[2px] border-white/5 bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1)_100%)] bg-origin-border px-4 text-sm font-semibold shadow-sm outline-hidden backdrop-blur-[25px] transition-all duration-200 ease-in-out select-none after:pointer-events-none after:absolute after:top-[-2px] after:left-[-2px] after:h-[calc(100%+4px)] after:w-[calc(100%+4px)] after:rounded-[1rem] after:bg-[url("/static/texture-btn.png")] after:bg-repeat not-disabled:hover:bg-white/90 not-disabled:hover:text-black focus-visible:bg-white/90 focus-visible:text-black focus-visible:ring-4 focus-visible:ring-white/30 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:text-white/50 disabled:opacity-30'
                        href='/signup'
                      >
                        <span>Start for $0</span>
                        <ArrowRight className='ml-1 h-4 w-4' />
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
      {/* Search experience: Drawer on mobile/tablet, Dialog on desktop */}
      {currentIsSmallScreen ? (
        <Drawer open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DrawerContent className='h-[85vh]'>
            <DrawerHeader className='border-b px-4 py-2'>
              <DrawerTitle>Search Inspirations</DrawerTitle>
            </DrawerHeader>
            <div className='px-4 py-4'>
              <CategoryAndSearch />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogContent className='max-w-2xl overflow-hidden p-0'>
            <DialogHeader className='border-b px-4 py-3'>
              <DialogTitle>Search Inspirations</DialogTitle>
            </DialogHeader>
            <div className='px-4 py-4'>
              <CategoryAndSearch />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
