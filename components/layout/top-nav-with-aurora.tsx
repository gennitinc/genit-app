"use client";

import { Logo } from "../logo";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import UserPopOver from "../user/userPopOver";
import { LocalizedText } from "@/components/localized-text";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { RefObject, useEffect, useState } from "react";

interface TopNavWithAuroraProps {
  scrollContainerRef?: RefObject<HTMLDivElement>;
  isPreviewOpen?: boolean;
}

export default function TopNavWithAurora({
  scrollContainerRef: _scrollContainerRef,
  isPreviewOpen = false,
}: TopNavWithAuroraProps) {
  const { theme, setTheme } = useTheme();
  const pathName = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobile = useIsMobile();
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const params = useParams();
  const isChatIdPage = !!params.id && pathName.startsWith("/chat");
  const isVisualsPage = pathName.startsWith("/visuals");
  const keepsDesktopSidebarCollapsed =
    isVisualsPage || pathName.startsWith("/user/settings");

  return (
    <header
      className={cn(
        "sticky top-0 z-30 bg-transparent transition-all duration-300",
        pathName == "/chat" ? "backdrop-blur-sm" : "backdrop-blur-md",
        "h-fit w-full shrink-0"
      )}
    >
      <div className='flex w-full items-center justify-between px-4 py-1.5'>
        <div className='z-20 flex flex-1 items-center'>
          {(!isChatIdPage || isMobile || !isPreviewOpen) && (
            <SidebarTrigger
              className='z-20 -ml-2'
              disabled={keepsDesktopSidebarCollapsed && !isTablet}
            />
          )}
          <Link href='/' className='flex items-center gap-1 lg:hidden'>
            <Logo className='h-9 w-9' />
            <span className='text-lg font-semibold'>
              <LocalizedText text={"Genit"} />
            </span>
          </Link>
        </div>
        <div className='z-20 flex items-center gap-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className='hover:bg-accent h-8 w-8 rounded-lg p-0'
          >
            {mounted && theme === "dark" ? (
              <Sun className='h-4 w-4' />
            ) : (
              <Moon className='h-4 w-4' />
            )}
          </Button>

          <UserPopOver />
        </div>
      </div>
    </header>
  );
}
