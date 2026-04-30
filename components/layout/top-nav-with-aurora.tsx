import { PricingDialog } from "../common/pricing-dialog";
import { Logo } from "../logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarTrigger } from "../ui/sidebar";
import { useSidebar } from "../ui/sidebar";
import UserPopOver from "../user/userPopOver";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { BadgeCheck, Bell, CreditCard, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";

interface TopNavWithAuroraProps {
  scrollContainerRef?: RefObject<HTMLDivElement>;
}

export default function TopNavWithAurora({
  scrollContainerRef,
}: TopNavWithAuroraProps) {
  const { theme, setTheme } = useTheme();
  const user = useUserContext().user;
  const pathName = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { state } = useSidebar();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTargetRef = useRef<HTMLElement | Window | null>(null);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (scrollContainerRef?.current) {
        setIsScrolled(scrollContainerRef.current.scrollTop > 0);
      } else {
        setIsScrolled(window.scrollY > 0);
      }
    }, 16); // ~60fps throttling
  }, [scrollContainerRef]);

  useEffect(() => {
    // Get the current scroll target
    const scrollTarget = scrollContainerRef?.current || window;

    // Clean up previous listener if target changed
    if (scrollTargetRef.current && scrollTargetRef.current !== scrollTarget) {
      scrollTargetRef.current.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    }

    // Store the current target
    scrollTargetRef.current = scrollTarget;

    // Add the listener
    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });

    // Set initial state
    handleScroll();

    return () => {
      // Clear any pending timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
      // Remove listener from the stored target
      if (scrollTargetRef.current) {
        scrollTargetRef.current.removeEventListener("scroll", handleScroll);
        scrollTargetRef.current = null;
      }
    };
  }, [scrollContainerRef, handleScroll]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobile = useIsMobile();

  const params = useParams();
  const isChatIdPage = !!params.id && pathName.startsWith("/chat");

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
          {(!isChatIdPage || isMobile) && (
            <SidebarTrigger className='z-20 -ml-2' />
          )}
          <Link href='/' className='flex items-center gap-1 lg:hidden'>
            <Logo className='h-9 w-9' />
            <span className='text-lg font-semibold'>Gennit</span>
          </Link>
        </div>
        <div className='z-20 flex items-center gap-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className='hover:bg-accent h-8 w-8 rounded-lg p-0'
          >
            {theme === "dark" ? (
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
