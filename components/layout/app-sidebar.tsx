"use client";

import type * as React from "react";
import {
  History,
  Layout,
  Users,
  Sparkles,
  Settings,
  HelpCircle,
  BookOpen,
  Crown,
  TrendingUp,
  Plus,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useMediaQuery } from "@/hooks/use-media-query";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
// import { TeamSwitcher } from "./team-switcher" // Removed import
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo"; // Updated import
import { useUserContext } from "@/context/AuthenticatedContext";
import { useUrlState } from "@/hooks/use-url-state";

export function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile, setOpen } = useSidebar();
  const { theme } = useTheme();
  const user = useUserContext().user;
  const creditPercentage = 100;
  const usedCredits = 100;
  const totalCredits = 100;
  const currentCredits = 100;
  const { setUrlState } = useUrlState();
  const isTablet = useMediaQuery("(max-width: 1024px)");

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "h-full border-border transition-colors duration-300 bg-background",
        className
      )}
      {...props}
    >
      <SidebarHeader className="flex-row justify-start">
        <div
          className={cn(
            "flex items-center gap-2 pb-2",
            state === "collapsed" && !isMobile && "justify-start"
          )}
        >
          {/* <Logo className="w-8 h-8 flex-shrink-0" /> */}
          <Logo className="w-12 h-12 flex-shrink-0" />
          <span
            className={cn(
              "font-semibold text-lg transition-opacity duration-200",
              (state === "collapsed" && !isMobile) || isTablet
                ? "hidden"
                : "block"
            )}
          >
            Gennit
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>

      {state !== "collapsed" || isMobile ? (
        <div className="mx-2 mb-4">
          <div className="relative bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl p-3 text-white overflow-hidden shadow-lg cursor-pointer hover:from-cyan-600/90 hover:to-blue-600/90 transition-all">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -translate-y-12 translate-x-12" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8" />
            </div>

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
                  backgroundSize: "20px 20px",
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <Crown className="w-3 h-3 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Pro Plan
                    </div>
                    <div className="text-xs text-white/70">API Credits</div>
                  </div>
                </div>
              </div>

              {/* Usage Stats now */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/80">This month</span>
                  <span className="text-xs font-semibold text-white">
                    {usedCredits.toLocaleString()} /{" "}
                    {totalCredits.toLocaleString()}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="w-full bg-white/20 rounded-full h-1.5 backdrop-blur-sm border border-white/10">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-500 relative overflow-hidden shadow-sm"
                      style={{ width: `${100 - creditPercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-white/70">
                    <TrendingUp className="w-3 h-3" strokeWidth={1.5} />
                    <span>{currentCredits.toLocaleString()} left</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/70">
                    <Sparkles className="w-3 h-3" strokeWidth={1.5} />
                    <span>Pro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mb-4 mt-2 w-full">
          <div
            className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg hover:bg-cyan-500/90 transition-colors cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Crown className="w-4 h-4 text-white" strokeWidth={1.5} />
            {creditPercentage < 20 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse border border-white" />
            )}
          </div>
        </div>
      )}

      <SidebarFooter className="border-t border-border pt-4">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail className="border-border" />
    </Sidebar>
  );
}
