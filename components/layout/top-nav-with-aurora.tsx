import { SidebarTrigger } from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PricingDialog } from "../common/pricing-dialog";
import { Sparkles } from "lucide-react";
import { BadgeCheck, CreditCard, Bell, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useUserContext } from "@/context/AuthenticatedContext";
import { usePathname, useParams } from "next/navigation";
import { useState, useEffect, RefObject, useCallback, useRef } from "react";
import { Logo } from "../logo";
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import UserPopOver from "../user/userPopOver";
import Link from "next/link";

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

  const params = useParams();
  const isChatIdPage = !!params.id && pathName.startsWith("/chat");

  return (
   
      <header
        className={cn(
          "sticky top-0 z-30 transition-all duration-300 bg-transparent",
          pathName == "/chat" ? "backdrop-blur-sm" : "backdrop-blur-md",
          "h-fit shrink-0 w-full"
        )}
      >
        <div className="flex px-4 py-1.5 items-center justify-between w-full">
          <div className="flex z-20 items-center flex-1 gap-4">
            {!isChatIdPage && <SidebarTrigger className="-ml-2 z-20" />}
            <Link href="/" className="lg:hidden flex items-center gap-1">
              <Logo className="w-9 h-9" />
              <span className="font-semibold text-lg">Gennit</span>
            </Link>
          </div>
          <div className="flex z-20 items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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
        </div>
      </header>
  );
}
