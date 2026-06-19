"use client";

import { NavMain } from "./nav-main";
import { OrgSwitcher } from "./org-switcher";
import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useMediaQuery } from "@/hooks/use-media-query";
import { trackEvent } from "@/lib/mixpanelClient";
import { cn } from "@/lib/utils";
import { GradientFrame } from "@/utils/gradient-frame";
import { Bolt, Crown, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import type * as React from "react";
import { useEffect, useRef } from "react";

export function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile, setOpen } = useSidebar();
  const user = useUserContext().user;
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isLargeDesktop = useMediaQuery("(min-width: 1280px)");
  const pathname = usePathname();
  const params = useParams();

  const isChatIdPage = !!params.id && pathname.startsWith("/chat");
  const isVisualsPage = pathname.startsWith("/visuals");

  const lastCheckedPathname = useRef<string | null>(null);

  useEffect(() => {
    // Auto-collapse on desktop and tablets if navigating to specific pages.
    // By tracking the pathname, we allow the user to manually open the sidebar afterwards.
    if (pathname !== lastCheckedPathname.current) {
      lastCheckedPathname.current = pathname;

      if (isVisualsPage && !isMobile) {
        setOpen(false);
      } else if (isChatIdPage && !isMobile && !isLargeDesktop) {
        setOpen(false);
      }
    }
  }, [
    pathname,
    isVisualsPage,
    isChatIdPage,
    isMobile,
    isLargeDesktop,
    setOpen,
  ]);

  // Calculate credit stats from user data
  const creditsRemaining = user?.creditsRemaining || 0;
  const creditsUsed = user?.creditsUsed || 0;
  const totalCredits = creditsRemaining + creditsUsed || 0;
  const creditPercentage =
    totalCredits > 0 ? (creditsRemaining / totalCredits) * 100 : 0;
  const usedCreditsDisplay = totalCredits > 0 ? creditsUsed : 0;
  const currentCredits = creditsRemaining;

  const router = useRouter();

  return (
    <Sidebar
      collapsible='icon'
      className={cn(
        "h-full border-none bg-white transition-colors duration-300 dark:bg-black [&_[data-sidebar=sidebar]]:bg-white dark:[&_[data-sidebar=sidebar]]:bg-black",
        className
      )}
      {...props}
    >
      <SidebarHeader className='flex-row justify-start'>
        <Link
          href='/'
          className={cn(
            "flex items-center pb-2",
            state === "collapsed" && !isMobile && "justify-start"
          )}
        >
          <Logo className='h-12 w-12 flex-shrink-0' />
          <span
            className={cn(
              "text-lg font-semibold transition-opacity duration-200",
              (state === "collapsed" && !isMobile) || isTablet
                ? "hidden"
                : "block"
            )}
          >
            Genit
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>

      {state !== "collapsed" || isMobile ? (
        <div className='border-border mx-2 mb-4 border-t pt-2'>
          <div className='relative cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 p-3 text-white shadow-lg transition-all hover:from-cyan-600/90 hover:to-blue-600/90'>
            {/* Background Pattern */}
            <div className='absolute inset-0 opacity-10'>
              <div className='absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full bg-white' />
              <div className='absolute bottom-0 left-0 h-16 w-16 -translate-x-8 translate-y-8 rounded-full bg-white' />
            </div>

            {/* Subtle Grid Pattern */}
            <div className='absolute inset-0 opacity-5'>
              <div
                className='h-full w-full'
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
            <div className='relative z-10'>
              <div className='mb-3 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-white/20 backdrop-blur-sm'>
                    <Crown className='h-3 w-3 text-white' strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className='text-xs font-semibold text-white'>
                      Pro Plan
                    </div>
                    <div className='text-xs text-white/70'>Design Credits</div>
                  </div>
                </div>
              </div>

              {/* Usage Stats now */}
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs text-white/80'>This month</span>
                  <span className='text-xs font-semibold text-white'>
                    {usedCreditsDisplay.toLocaleString()} /{" "}
                    {totalCredits.toLocaleString()}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className='relative'>
                  <div className='h-1.5 w-full rounded-full border border-white/10 bg-white/20 backdrop-blur-sm'>
                    <div
                      className='relative h-1.5 overflow-hidden rounded-full bg-white shadow-sm transition-all duration-500'
                      style={{ width: `${creditPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className='flex items-center justify-between text-xs'>
                  <div className='flex items-center gap-1 text-white/70'>
                    <TrendingUp className='h-3 w-3' strokeWidth={1.5} />
                    <span>{currentCredits.toLocaleString()} left</span>
                  </div>
                  <div className='flex items-center gap-1 text-white/70'>
                    <Sparkles className='h-3 w-3' strokeWidth={1.5} />
                    <span>{user?.userPlan || "Basic"}</span>
                  </div>
                </div>

                <button
                  type='button'
                  onClick={() => {
                    if (user?.userPlan === "Basic") {
                      trackEvent("upgrade_cta_clicked", {
                        source: "sidebar_card",
                        destination: "/pricing",
                      });
                      router.push("/pricing");
                    } else {
                      trackEvent("buy_credits_cta_clicked", {
                        source: "sidebar_card",
                        destination: "/user/settings?tab=billing",
                      });
                      router.push("/user/settings?tab=billing");
                    }
                  }}
                  className='group mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-black bg-black px-5 py-2 text-xs font-medium text-white transition-all duration-200 ease-in-out hover:border-neutral-800 hover:bg-neutral-800 focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none dark:border-white dark:bg-white dark:text-black dark:hover:border-neutral-200 dark:hover:bg-neutral-200 dark:focus:ring-white'
                >
                  <Bolt className='h-4 w-4 transition-transform duration-200 group-hover:scale-110' />
                  {user?.userPlan === "Basic" &&
                  user?.creditsRemaining &&
                  user?.creditsRemaining <= 20
                    ? "Upgrade Account"
                    : "Get More Credits"}
                </button>
              </div>
              <GradientFrame />
            </div>
          </div>
        </div>
      ) : (
        !isChatIdPage && (
          <div className='mt-2 mb-4 flex w-full justify-center'>
            <div
              className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-cyan-500 shadow-lg transition-colors hover:bg-cyan-500/90'
              onClick={() => {
                if (user?.userPlan === "Basic") {
                  trackEvent("upgrade_cta_clicked", {
                    source: "sidebar_collapsed",
                    destination: "/pricing",
                  });
                  router.push("/pricing");
                } else {
                  trackEvent("buy_credits_cta_clicked", {
                    source: "sidebar_collapsed",
                    destination: "/user/settings?tab=billing",
                  });
                  router.push("/user/settings?tab=billing");
                }
              }}
            >
              <Crown className='h-4 w-4 text-white' strokeWidth={1.5} />
            </div>
          </div>
        )
      )}

      <SidebarFooter className='border-border border-t pt-2'>
        <OrgSwitcher />
      </SidebarFooter>
    </Sidebar>
  );
}
