"use client";

import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import UserPopOver from "../user/userPopOver";
import { LocalizedText } from "@/components/localized-text";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useUserContext } from "@/context/AuthenticatedContext";
import { cn } from "@/lib/utils";
import { Bell, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminTopNav() {
  const { theme, setTheme } = useTheme();
  const { user } = useUserContext();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <header className='border-border/50 bg-background/60 sticky top-0 z-30 w-full border-b backdrop-blur-xl transition-all duration-300'>
      {/* Aurora Background Effect */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden opacity-20'>
        <div className='from-primary/30 absolute -top-1/2 -left-1/4 h-full w-full animate-pulse bg-gradient-to-br via-transparent to-transparent blur-[120px]' />
        <div className='from-primary/20 absolute -right-1/4 -bottom-1/2 h-full w-full animate-pulse bg-gradient-to-tl via-transparent to-transparent blur-[120px] delay-700' />
      </div>

      <div className='relative z-10 flex h-16 items-center justify-between px-4 md:px-8'>
        <div className='flex items-center gap-4'>
          <SidebarTrigger className='h-9 w-9' />
          <div className='bg-border/50 hidden h-6 w-px md:block' />

          <Breadcrumb className='hidden md:flex'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/admin'>
                  <LocalizedText text={"Admin"} />
                </BreadcrumbLink>
              </BreadcrumbItem>
              {pathSegments.length > 1 && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className='font-semibold capitalize'>
                      {pathSegments[pathSegments.length - 1].replace(/-/g, " ")}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className='flex items-center gap-2 md:gap-4'>
          {/* Quick Search */}
          <div className='group relative hidden lg:block'>
            <Search className='text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors' />
            <input
              type='text'
              placeholder='Quick search...'
              className='bg-muted/50 focus:border-primary/50 focus:bg-background h-9 w-64 rounded-full border border-transparent pr-4 pl-10 text-sm transition-all outline-none'
            />
          </div>

          <div className='flex items-center gap-1 md:gap-2'>
            <Button
              variant='ghost'
              size='icon'
              className='h-9 w-9 rounded-full'
            >
              <Bell className='h-4 w-4' />
            </Button>

            <Button
              variant='ghost'
              size='icon'
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className='h-9 w-9 rounded-full'
            >
              {theme === "dark" ? (
                <Sun className='h-4 w-4' />
              ) : (
                <Moon className='h-4 w-4' />
              )}
            </Button>

            <div className='bg-border/50 mx-1 h-8 w-px' />

            <div className='origin-right scale-95 md:scale-100'>
              <UserPopOver />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
