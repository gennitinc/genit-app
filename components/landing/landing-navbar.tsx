"use client";

import Link from "next/link";
import { ArrowRight, PanelRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "../logo";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PricingDialog } from "@/components/common/pricing-dialog";

import {
  Sparkles,
  BadgeCheck,
  CreditCard,
  Bell,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useState, useEffect } from "react";
import Aurora from "../ui/aurora";
import { usePathname, useRouter } from "next/navigation";
import UserPopOver from "../user/userPopOver";
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
import CategoryAndSearch from "@/components/common/category-and-search";
import { useMediaQuery } from "@/hooks/use-media-query";

export function LandingNavbar() {
  const { theme, setTheme } = useTheme();
  const user = useUserContext().user;
  const [mounted, setMounted] = useState(false);
  const pathName = usePathname();
  const RouteToShowAurora = ["/"];
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("Untitled Project");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 1024px)");

  const navigation = [
    { name: "Design Chat", href: "/" },
    { name: "AI gen", href: "/inspire/create?mode=ai-video-gen" },
    { name: "Company", href: "/company" },
    { name: "Inspirations", href: "/inspirations" },
    {
      name: user ? "Billing" : "Pricing",
      href: user ? "/user/settings?tab=billing" : "/pricing",
    },
    { name: "History", href: user ? "/chat/history" : "/signin" },
    { name: "Community", href: "/community" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="bg-transparent w-full backdrop-blur-sm sticky z-30 top-0">
        <nav className="mx-auto flex h-16 items-center z-50 justify-between px-2 md:px-12 lg:px-20 xl:px-24">
          {/* Replace <img> with new <Image> */}
          <Link href="/" className="flex items-center z-40 gap-2">
            <Logo className="w-12 h-12 flex-shrink-0" />
            <span
              className={`text-xl font-semibold transition-colors duration-300 text-foreground`}
            >
              Gennit
            </span>
          </Link>

          <div className="hidden items-center z-50 gap-4 md:flex">
            {user ? (
              <>
                {/* Right Section - Desktop */}
                {!isSmallScreen && (
                  <div className="flex items-center gap-2 sm:gap-2">
                    {/* Main user avatar with popover */}
                    <div className="flex flex-1 items-center justify-end gap-2 sm:gap-2 md:justify-end">
                      {user && (
                        <Link
                          className="hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors"
                          href="/chat"
                        >
                          Design Chat
                        </Link>
                      )}
                      <Link
                        className="hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors"
                        href="/inspire/create?mode=ai-video-gen"
                      >
                        AI gen
                      </Link>
                      <Link
                        target=""
                        className="hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors"
                        href="/inspirations"
                      >
                        Inspirations
                      </Link>
                      <Link
                        target="__blank"
                        className="hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors"
                        href={user ? "/user/settings?tab=billing" : "/pricing"}
                      >
                        {user ? "Billing" : "Pricing"}
                      </Link>
                      <Link
                        target=""
                        className="hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors"
                        href={user ? "/chat/history" : "/signin"}
                      >
                        History
                      </Link>
                      <Link
                        target="k"
                        className="hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors"
                        href="https://discord.gg/ftZbQvCdN7"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-neutral-500 dark:text-neutral-500"
                        >
                          <path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                          <path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                          <path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3" />
                          <path d="M7 16.5c3.5 1 6.5 1 10 0" />
                        </svg>
                      </Link>
                      <Link
                        target="__blank"
                        className="hover:text-foreground/80 text-foreground/60 text-sm font-medium transition-colors"
                        href="https://twitter.com/gennit_ai"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-neutral-500 dark:text-neutral-500"
                        >
                          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                        </svg>
                      </Link>

                      <button
                        onClick={() => setIsSearchOpen(true)}
                        className="flex relative justify-start items-center text-sm text-muted-foreground dark:border-white/[0.2] py-2 w-fit border border-transparent shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] px-4 rounded-xl bg-muted"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-neutral-500"
                        >
                          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                          <path d="M21 21l-6 -6" />
                        </svg>
                        <span className="transition-colors hover:text-foreground/80 text-foreground/60 rex text-xs sm:text-sm font-medium pl-2 pr-4">
                          Search{" "}
                          <span className="hidden xl:inline-block">
                            Inspirations
                          </span>
                        </span>
                        <kbd className="pointer-events-none  hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                          <span className="text-xs">⌘</span>K
                        </kbd>
                      </button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      className="w-8 h-8 p-0 rounded-lg hover:bg-accent"
                    >
                      {theme === "dark" ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Moon className="w-4 h-4" />
                      )}
                    </Button>

                    <UserPopOver />
                  </div>
                )}
                {/* Mobile Right Section */}
                {isSmallScreen && (
                  <div className="flex items-center gap-2">
                    {/* Search - Mobile/Tablet */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSearchOpen(true)}
                      className="w-8 h-8 p-0 rounded-lg hover:bg-accent"
                      aria-label="Search"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                    {/* Theme Toggle - Mobile */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      className="w-8 h-8 p-0 rounded-lg hover:bg-accent"
                    >
                      {theme === "dark" ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Moon className="w-4 h-4" />
                      )}
                    </Button>

                    {/* User Avatar - Mobile */}
                    <UserPopOver />
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Right Section - Desktop */}
                {!isSmallScreen && (
                  <div className="flex items-center gap-2 sm:gap-2">
                    {/* Main user avatar with popover */}
                    <div className="flex flex-1 items-center justify-end gap-2 sm:gap-2 md:justify-end">
                      {user && (
                        <Link
                          className="hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors"
                          href="/chat"
                        >
                          Create
                        </Link>
                      )}
                      <Link
                        className="hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors"
                        href="/inspire/create?mode=ai-video-gen"
                      >
                        AI gen
                      </Link>
                      <Link
                        target="__blank"
                        className="hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors"
                        href="/inspirations"
                      >
                        Inspirations
                      </Link>
                      <Link
                        target="__blank"
                        className="hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors"
                        href={user ? "/user/settings?tab=billing" : "/pricing"}
                      >
                        {user ? "Billing" : "Pricing"}
                      </Link>

                      <Link
                        target="__blank"
                        className="hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors"
                        href="https://discord.gg/ftZbQvCdN7"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-neutral-500 dark:text-neutral-500"
                        >
                          <path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                          <path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                          <path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3" />
                          <path d="M7 16.5c3.5 1 6.5 1 10 0" />
                        </svg>
                      </Link>
                      <Link
                        target="__blank"
                        className="hover:text-foreground/80 text-foreground/60 text-sm font-medium transition-colors"
                        href="https://twitter.com/gennit_ai"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-neutral-500 dark:text-neutral-500"
                        >
                          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                        </svg>
                      </Link>

                      <button
                        onClick={() => setIsSearchOpen(true)}
                        className="flex relative justify-start items-center text-sm text-muted-foreground dark:border-white/[0.2] py-2 w-fit border border-transparent shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] px-4 rounded-xl bg-muted"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-neutral-500"
                        >
                          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                          <path d="M21 21l-6 -6" />
                        </svg>
                        <span className="transition-colors hover:text-foreground/80 text-foreground/60 rex text-xs sm:text-sm font-medium pl-2 pr-4">
                          Search{" "}
                          <span className="hidden xl:inline-block">
                            Templates
                          </span>
                        </span>
                        <kbd className="pointer-events-none  hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                          <span className="text-xs">⌘</span>K
                        </kbd>
                      </button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      className="w-8 h-8 p-0 rounded-lg hover:bg-accent"
                    >
                      {theme === "dark" ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Moon className="w-4 h-4" />
                      )}
                    </Button>

                    <div className="flex gap-4">
                      <Link
                        className="outline-hidden relative items-center border justify-center select-none rounded-2xl disabled:cursor-not-allowed disabled:opacity-70 transition ease-in-out duration-200 bg-transparent border-transparent text-gray-9 [&_svg]:text-gray-9 hover:text-gray-10 focus-visible:ring-4 focus-visible:ring-gray-a2 focus-visible:outline-hidden text-sm h-10 gap-0 px-4 font-semibold hidden lg:flex"
                        data-state="closed"
                        href="/signin"
                      >
                        Sign in
                      </Link>
                      <Link
                        className='outline-hidden text-foreground relative inline-flex items-center justify-center select-none rounded-2xl disabled:cursor-not-allowed ease-in-out border-[2px] border-white/5 backdrop-blur-[25px] bg-origin-border bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1)_100%)] shadow-sm not-disabled:hover:bg-white/90 not-disabled:hover:text-black not-disabled:hover:shadow-button transition-all duration-200 disabled:opacity-30 disabled:text-white/50 focus-visible:ring-4 focus-visible:ring-white/30 focus-visible:outline-hidden focus-visible:bg-white/90 focus-visible:text-black after:absolute after:w-[calc(100%+4px)] after:h-[calc(100%+4px)] after:top-[-2px] after:left-[-2px] after:rounded-[1rem] after:bg-[url("/static/texture-btn.png")] after:bg-repeat after:pointer-events-none text-sm h-10 gap-0 px-4 font-semibold'
                        href="/signup"
                      >
                        <span>Start for $0</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                )}
                {/* Mobile Right Section */}
                {isSmallScreen && (
                  <div className="flex items-center gap-2">
                    {/* Search - Mobile/Tablet */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSearchOpen(true)}
                      className="w-8 h-8 p-0 rounded-lg hover:bg-accent"
                      aria-label="Search"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                    {/* Theme Toggle - Mobile */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      className="w-8 h-8 p-0 rounded-lg hover:bg-accent"
                    >
                      {theme === "dark" ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Moon className="w-4 h-4" />
                      )}
                    </Button>

                    {/* User Avatar - Mobile */}
                    <div className="flex gap-4">
                      <Link
                        className="outline-hidden relative items-center border justify-center select-none rounded-2xl disabled:cursor-not-allowed disabled:opacity-70 transition ease-in-out duration-200 bg-transparent border-transparent text-gray-9 [&_svg]:text-gray-9 hover:text-gray-10 focus-visible:ring-4 focus-visible:ring-gray-a2 focus-visible:outline-hidden text-sm h-10 gap-0 px-4 font-semibold hidden lg:flex"
                        data-state="closed"
                        href="/signin"
                      >
                        Sign in
                      </Link>
                      <Link
                        className='outline-hidden text-foreground relative inline-flex items-center justify-center select-none rounded-2xl disabled:cursor-not-allowed ease-in-out  border-[2px] border-white/5 backdrop-blur-[25px] bg-origin-border bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1)_100%)] shadow-sm not-disabled:hover:bg-white/90 not-disabled:hover:text-black not-disabled:hover:shadow-button transition-all duration-200 disabled:opacity-30 disabled:text-white/50 focus-visible:ring-4 focus-visible:ring-white/30 focus-visible:outline-hidden focus-visible:bg-white/90 focus-visible:text-black after:absolute after:w-[calc(100%+4px)] after:h-[calc(100%+4px)] after:top-[-2px] after:left-[-2px] after:rounded-[1rem] after:bg-[url("/static/texture-btn.png")] after:bg-repeat after:pointer-events-none text-sm h-10 gap-0 px-4 font-semibold'
                        href="/signup"
                      >
                        <span>Start for $0</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Section */}
          <div className="flex items-center gap-2 md:hidden">
            {user && <UserPopOver />}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="z-50">
                  <PanelRight className="size-4 h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="mt-8 flex flex-col gap-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <hr className="my-4" />
                  {user ? (
                    <Link
                      href={`/creator/${user?.username}`}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.userdp} alt={user?.username} />
                        <AvatarFallback>{user?.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user?.username}</span>
                        <span className="text-xs text-zinc-400">
                          {user?.email}
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex gap-4 items-center">
                      <Link
                        className="hidden relative items-center border justify-center select-none rounded-2xl disabled:cursor-not-allowed disabled:opacity-70 transition ease-in-out duration-200 bg-transparent border-transparent text-gray-9 [&_svg]:text-gray-9 hover:text-gray-10 focus-visible:ring-4 focus-visible:ring-gray-a2 focus-visible:outline-hidden text-sm h-10 gap-0 px-4 font-semibold"
                        data-state="closed"
                        href="/signin"
                      >
                        Sign in
                      </Link>
                      <Link
                        className='outline-hidden text-foreground relative inline-flex items-center justify-center select-none rounded-2xl disabled:cursor-not-allowed ease-in-out border-[2px] border-white/5 backdrop-blur-[25px] bg-origin-border bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1)_100%)] shadow-sm not-disabled:hover:bg-white/90 not-disabled:hover:text-black not-disabled:hover:shadow-button transition-all duration-200 disabled:opacity-30 disabled:text-white/50 focus-visible:ring-4 focus-visible:ring-white/30 focus-visible:outline-hidden focus-visible:bg-white/90 focus-visible:text-black after:absolute after:w-[calc(100%+4px)] after:h-[calc(100%+4px)] after:top-[-2px] after:left-[-2px] after:rounded-[1rem] after:bg-[url("/static/texture-btn.png")] after:bg-repeat after:pointer-events-none text-sm h-10 gap-0 px-4 font-semibold'
                        href="/signup"
                      >
                        <span>Start for $0</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
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
      {isSmallScreen ? (
        <Drawer open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DrawerContent className="h-[85vh]">
            <DrawerHeader className="px-4 py-2 border-b">
              <DrawerTitle>Search Inspirations</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 py-4">
              <CategoryAndSearch />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden">
            <DialogHeader className="px-4 py-3 border-b">
              <DialogTitle>Search Inspirations</DialogTitle>
            </DialogHeader>
            <div className="px-4 py-4">
              <CategoryAndSearch />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
