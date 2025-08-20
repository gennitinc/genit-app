"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  Bell,
  Search,
  BadgeCheck,
  CreditCard,
  Sparkles,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { PricingDialog } from "@/components/common/pricing-dialog";
import { Logo } from "@/components/logo";
import { useUserContext } from "@/context/AuthenticatedContext";
import Aurora from "@/components/ui/aurora";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import PartnerLogos from "@/components/landing/Partners-Logos";
import { LandingFooter } from "@/components/landing/landing-footer";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import withAuth from "@/helper/hoc/withAuth";
import { useUrlState } from "@/hooks/use-url-state";
import { ProjectPreview } from "../community/project-preview";

function Wrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getUrlState } = useUrlState();
  const url = getUrlState().getValue("gen");
  const { theme, setTheme } = useTheme();
  const user = useUserContext().user;
  const pathName = usePathname();
  const RouteToShowAurora = ["/", "/chat"];
  const authRoutes = [
    "/auth",
    "/auth/signup",
    "/auth/recover",
    "/login",
    "/recover",
    "/signup",
  ];

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    // Set initial state
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {pathName.startsWith("/chat/") ? (
        <div className="min-h-dvh text-foreground w-full">{children}</div>
      ) : (
        <SidebarProvider defaultOpen={false}>
          <div className="flex min-h-dvh text-foreground w-full">
            {user && <AppSidebar />}
            <SidebarInset
              className={cn(
                "flex flex-col flex-1 bg-transparent border-none shadow-none w-full"
                // !user && "overflow-hidden"
              )}
            >
              {!authRoutes.includes(pathName) && user ? (
                <>
                  <header
                    className={`sticky top-0 z-50 transition-all duration-300 bg-transparent backdrop-blur-sm flex h-16 shrink-0 items-center w-full`}
                  >
                    <div className="flex z-30 px-4 items-center justify-between w-full">
                      <div className="flex items-center flex-1 gap-4">
                        <SidebarTrigger className="-ml-2" />
                        <div className="lg:hidden flex items-center gap-1">
                          <Logo className="w-9 h-9" />
                          <span className="font-semibold text-lg">Gennit</span>
                        </div>
                        {/* <div className="hidden lg:block flex-1 max-w-xl">
                  <div className="relative w-full max-w-md xl:max-w-xl">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="w-full pl-10" placeholder="Search" type="sea  rch" />
                  </div>
                </div> */}
                      </div>
                      <div className="flex items-center gap-4">
                        {/* <Button variant="ghost" size="icon" className="lg:hidden">
                  <Search className="h-5 w-5" />
                </Button> */}
                        {/* <div className="hidden md:block">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                </div> */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={user.userdp}
                                  alt={user?.username}
                                />
                                <AvatarFallback>
                                  {user?.username[0]}
                                </AvatarFallback>
                              </Avatar>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="font-normal">
                              <div className="flex items-center gap-2 pz-2">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={user.userdp}
                                    alt={user?.username}
                                  />
                                  <AvatarFallback>
                                    {user?.username[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {user?.username}
                                  </span>
                                  <span className="text-xs text-zinc-400">
                                    {user?.email}
                                  </span>
                                </div>
                              </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <PricingDialog>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Sparkles className="mr-2 h-4 w-4" />
                                  <span>Upgrade to Pro</span>
                                </DropdownMenuItem>
                              </PricingDialog>
                            </DropdownMenuGroup>
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
                              onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                              }
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
                    {RouteToShowAurora.includes(pathName) && (
                      <div
                        className={`transition-opacity duration-700 absolute top-0 w-full ease-in-out ${
                          isScrolled ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <Aurora
                          colorStops={["#d849d0", "#f59307", "#3bc7fc"]}
                          blend={1.0}
                          amplitude={1.0}
                          speed={0.8}
                        />
                      </div>
                    )}
                  </header>
                </>
              ) : (
                !authRoutes.includes(pathName) && (
                  <>
                    <LandingNavbar />
                    {RouteToShowAurora.includes(pathName) && (
                      <div
                        className={`transition-opacity duration-700 w-full ease-in-out ${
                          isScrolled ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <Aurora
                          colorStops={["#d849d0", "#f59307", "#3bc7fc"]}
                          blend={1.0}
                          amplitude={1.0}
                          speed={0.8}
                        />
                      </div>
                    )}
                  </>
                )
              )}
              <div
                id="main-content"
                className="flex-1 overflow-y-auto h-full w-full bg-background"
              >
                {children}
              </div>

              {!user && !authRoutes.includes(pathName) && (
                <>
                  <PartnerLogos />
                  <LandingFooter />
                </>
              )}
            </SidebarInset>
          </div>
          {url && <ProjectPreview />}
        </SidebarProvider>
      )}
    </>
  );
}

export default withAuth(Wrapper);
