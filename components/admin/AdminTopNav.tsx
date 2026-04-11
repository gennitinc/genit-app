"use client";

import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Sun, Moon, Bell, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useUserContext } from "@/context/AuthenticatedContext";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import UserPopOver from "../user/userPopOver";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
    <header className="sticky top-0 z-30 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl transition-all duration-300">
      {/* Aurora Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-br from-primary/30 via-transparent to-transparent blur-[120px] animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-gradient-to-tl from-primary/20 via-transparent to-transparent blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="flex h-16 items-center px-4 md:px-8 justify-between relative z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-9 w-9" />
          <div className="h-6 w-px bg-border/50 hidden md:block" />
          
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              {pathSegments.length > 1 && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="capitalize font-semibold">
                      {pathSegments[pathSegments.length - 1].replace(/-/g, " ")}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Quick Search */}
          <div className="relative hidden lg:block group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="h-9 w-64 pl-10 pr-4 rounded-full bg-muted/50 border border-transparent focus:border-primary/50 focus:bg-background transition-all outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
            >
              <Bell className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-full"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <div className="h-8 w-px bg-border/50 mx-1" />
            
            <div className="scale-95 md:scale-100 origin-right">
              <UserPopOver />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
