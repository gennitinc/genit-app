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
import { usePathname } from "next/navigation";
import { useState, useEffect, RefObject, useCallback, useRef } from "react";
import { Logo } from "../logo";
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";

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
    const scrollTarget = scrollContainerRef?.current || window;
    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });

    // Set initial state
    handleScroll();

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTarget.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef, handleScroll]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* blur's shown on some routes cos of a reason, don't change it */}
      <header
        className={cn(
          "sticky top-0 z-10 transition-all duration-300 bg-transparent",
          pathName == "/chat" ? "backdrop-blur-sm" : "backdrop-blur-md",
          "h-16 shrink-0 w-full"
        )}
      >
        <div className="flex px-4 py-2 items-center justify-between w-full">
          <div className="flex z-20 items-center flex-1 gap-4">
            <SidebarTrigger className="-ml-2 z-20" />
            <div className="lg:hidden flex items-center gap-1">
              <Logo className="w-9 h-9" />
              <span className="font-semibold text-lg">Gennit</span>
            </div>
          </div>
          <div className="flex z-20 items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={(user?.metadata as any)?.userdp}
                      alt={user?.username}
                      className="object-cover"
                    />
                    <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-2 pz-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        className="object-cover"
                        src={(user?.metadata as any)?.userdp}
                        alt={user?.username}
                      />
                      <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.username}</span>
                      <span className="text-xs text-zinc-400">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuGroup>
                  <PricingDialog>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      <span>Upgrade to Pro</span>
                    </DropdownMenuItem>
                  </PricingDialog>
                </DropdownMenuGroup> */}
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {mounted &&
                    (theme === "dark" ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Switch to light mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Switch to dark mode</span>
                      </>
                    ))}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}
