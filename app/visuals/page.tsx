"use client";

import {
  FacebookBrand,
  InstagramBrand,
  XBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { ConnectDialog } from "@/app/integrations/_components/connect-dialog";
import { ManageDialog } from "@/app/integrations/_components/manage-dialog";
import {
  INTEGRATIONS,
  type Integration,
  resolveStatus,
} from "@/app/integrations/integrations-explorer";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Organization, useUserContext } from "@/context/AuthenticatedContext";
import { useIntegrations } from "@/hooks/use-integrations";
import { isMetaSurface } from "@/lib/integrations-api";
import { GradientFrame } from "@/utils/gradient-frame";
import {
  Activity,
  BarChart,
  CalendarCheck,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import React, { useMemo, useState } from "react";

const chartData = [
  { name: "Week 1", Traffic: 15, Engagement: 10 },
  { name: "Week 2", Traffic: 24, Engagement: 30 },
  { name: "Week 3", Traffic: 18, Engagement: 25 },
  { name: "Week 4", Traffic: 45, Engagement: 25 },
];

export default function VisualsHomePage() {
  const [connectFor, setConnectFor] = useState<Integration | null>(null);
  const [manageFor, setManageFor] = useState<Integration | null>(null);
  const { byPlatform, identityBySurface } = useIntegrations();

  const { user } = useUserContext();

  const organizations = useMemo<Organization[]>(() => {
    const list = user?.allOrganizations || [];
    if (list.length > 0) return list;
    return user?.business && typeof user.business === "object"
      ? [user.business as Organization]
      : [];
  }, [user]);

  const current: Organization | null = useMemo(() => {
    if (
      user?.currentOrganization &&
      typeof user.currentOrganization === "object"
    ) {
      return user.currentOrganization;
    }
    return organizations[0] || null;
  }, [user?.currentOrganization, organizations]);

  const sortedIntegrations = useMemo(() => {
    return [...INTEGRATIONS].sort((a, b) => {
      const aHasId = isMetaSurface(a.platform)
        ? identityBySurface.has(a.platform)
        : false;
      const bHasId = isMetaSurface(b.platform)
        ? identityBySurface.has(b.platform)
        : false;
      const aStatus = resolveStatus(a, byPlatform.get(a.platform), aHasId);
      const bStatus = resolveStatus(b, byPlatform.get(b.platform), bHasId);

      const order = { connected: 0, available: 1, partial: 2, soon: 3 };
      return (
        order[aStatus as keyof typeof order] -
        order[bStatus as keyof typeof order]
      );
    });
  }, [byPlatform, identityBySurface]);

  const manageConnections = manageFor
    ? (byPlatform.get(manageFor.platform) ?? [])
    : [];

  const image = "./visual-flow.jpg";

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 flex w-full flex-col gap-6 duration-500'>
      <div className='relative overflow-hidden rounded-3xl bg-slate-950 p-8 md:p-12'>
        {/* Background image */}
        <img
          src='/flow-bg.jpg'
          alt=''
          className='absolute inset-0 h-full w-full object-cover object-center opacity-30'
        />

        {/* Content */}
        <div className='relative z-10 flex flex-col gap-4'>
          

          {/* Heading */}
          <div>
            <h3 className='font-instrument-serif text-2xl tracking-tight text-white font-bold'>
              Hello, {`${current?.businessName || "Organization"}`} 👋
            </h3>
            <p className='mt-2 text-sm text-slate-500 dark:text-slate-200'>
              Welcome back, we've curated an overview of your brand.
            </p>
          </div>

          {/* Buttons */}
          <div className='mt-2 flex flex-col gap-3 sm:flex-row'>
            {/* Primary CTA */}
            <button
              type='button'
              className='button'
              style={{ minHeight: 44, padding: "10px 20px" }}
            >
              <div className='points_wrapper'>
                {Array.from({ length: 10 }).map((_, i) => (
                  <i key={i} className='point' />
                ))}
              </div>
              <span className='inner'>
                Get started free
                <svg
                  className='icon'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1.5'
                >
                  <path d='M5 12h14' />
                  <path d='m12 5 7 7-7 7' />
                </svg>
              </span>
              <style
                dangerouslySetInnerHTML={{
                  __html: `
          .button {
            cursor: pointer;
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            transition: all 0.25s ease;
            background: radial-gradient(65.28% 65.28% at 50% 100%,
                rgba(34, 211, 238, 0.8) 0%,
                rgba(34, 211, 238, 0) 100%),
              linear-gradient(0deg, #2563eb, #2563eb);
            border-radius: 0.75rem;
            border: none;
            outline: none;
            padding: 10px 20px;
            min-height: 44px;
            min-width: 102px;
          }
          .button::before, .button::after {
            content: "";
            position: absolute;
            transition: all 0.5s ease-in-out;
            z-index: 0;
          }
          .button::before {
            inset: 1px;
            background: linear-gradient(177.95deg, rgba(255,255,255,0.19) 0%, rgba(255,255,255,0) 100%);
            border-radius: calc(0.75rem - 1px);
          }
          .button::after {
            inset: 2px;
            background: radial-gradient(65.28% 65.28% at 50% 100%,
                rgba(34, 211, 238, 0.8) 0%,
                rgba(34, 211, 238, 0) 100%),
              linear-gradient(0deg, #2563eb, #2563eb);
            border-radius: calc(0.75rem - 2px);
          }
          .button:active { transform: scale(0.95); }
          .points_wrapper {
            overflow: hidden;
            width: 100%;
            height: 100%;
            pointer-events: none;
            position: absolute;
            z-index: 1;
          }
          .points_wrapper .point {
            bottom: -10px;
            position: absolute;
            animation: floating-points infinite ease-in-out;
            pointer-events: none;
            width: 2px;
            height: 2px;
            background-color: #fff;
            border-radius: 9999px;
          }
          @keyframes floating-points {
            0% { transform: translateY(0); }
            85% { opacity: 0; }
            100% { transform: translateY(-55px); opacity: 0; }
          }
          .points_wrapper .point:nth-child(1)  { left: 10%; opacity: 1;   animation-duration: 2.35s; animation-delay: 0.2s; }
          .points_wrapper .point:nth-child(2)  { left: 30%; opacity: 0.7; animation-duration: 2.5s;  animation-delay: 0.5s; }
          .points_wrapper .point:nth-child(3)  { left: 25%; opacity: 0.8; animation-duration: 2.2s;  animation-delay: 0.1s; }
          .points_wrapper .point:nth-child(4)  { left: 44%; opacity: 0.6; animation-duration: 2.05s; }
          .points_wrapper .point:nth-child(5)  { left: 50%; opacity: 1;   animation-duration: 1.9s;  }
          .points_wrapper .point:nth-child(6)  { left: 75%; opacity: 0.5; animation-duration: 1.5s;  }
          .points_wrapper .point:nth-child(7)  { left: 88%; opacity: 0.9; animation-duration: 2.2s;  animation-delay: 0.2s; }
          .points_wrapper .point:nth-child(8)  { left: 58%; opacity: 0.8; animation-duration: 2.25s; animation-delay: 0.2s; }
          .points_wrapper .point:nth-child(9)  { left: 98%; opacity: 0.6; animation-duration: 2.6s;  animation-delay: 0.1s; }
          .points_wrapper .point:nth-child(10) { left: 65%; opacity: 1;   animation-duration: 2.5s;  animation-delay: 0.2s; }
          .inner {
            z-index: 2;
            gap: 6px;
            position: relative;
            width: 100%;
            color: white;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            font-weight: 500;
            line-height: 1.5;
            transition: color 0.2s ease-in-out;
          }
          .inner svg.icon {
            width: 16px;
            height: 16px;
            transition: transform 0.3s ease;
            stroke: white;
            fill: none;
          }
          .button:hover svg.icon { transform: translateX(2px); }
          .button:hover svg.icon path {
            animation: dash 0.8s linear forwards;
          }
          @keyframes dash {
            0%   { stroke-dasharray: 0, 20;  stroke-dashoffset: 0;   }
            50%  { stroke-dasharray: 10, 10; stroke-dashoffset: -5;  }
            100% { stroke-dasharray: 20, 0;  stroke-dashoffset: -10; }
          }
        `,
                }}
              />
            </button>

            {/* Secondary ghost button */}
          <button className="group relative inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:text-white active:scale-95">
  
  {/* hover background only */}
  <div className="pointer-events-none absolute inset-0 rounded-xl bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

  {/* icon */}
  <svg
    className="relative z-10 h-4 w-4 text-white/60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
  </svg>

  <span className="relative z-10">Watch demo</span>

</button>
          </div>
        </div>
      </div>

      {/* Integrations Carousel */}
      <div className='mt-2 flex flex-col bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10'>
        <div className='mb-6 flex items-start justify-between'>
          <div>
            <h3 className='text-foreground text-base font-bold dark:text-white'>
              Integration Status
            </h3>
            <p className='text-muted-foreground mt-1 text-xs'>
              Manage your connected channels
            </p>
          </div>
          <Button
            variant='outline'
            size='sm'
            className='h-8 rounded-full border-zinc-200 text-xs dark:border-zinc-800'
          >
            Connect New
          </Button>
        </div>

        <Carousel
          opts={{ align: "start", loop: false }}
          className='group/carousel mt-2 w-full'
        >
          <CarouselContent className='-ml-4'>
            {sortedIntegrations.map((integration, i) => {
              const hasIdentityForSurface = isMetaSurface(integration.platform)
                ? identityBySurface.has(integration.platform)
                : false;
              const status = resolveStatus(
                integration,
                byPlatform.get(integration.platform),
                hasIdentityForSurface
              );
              const isSoon = status === "soon";

              return (
                <CarouselItem
                  key={integration.name}
                  className='basis-full pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4'
                >
                  <div className='group relative h-full w-full overflow-hidden bg-black/[0.02] p-4 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10'>
                    <GradientFrame />
                    <div className='relative z-10 flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10'>
                      <div className='flex items-start justify-between'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-black/5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10'>
                          <integration.icon
                            className={
                              integration.name === "Shopify"
                                ? "h-6 w-6 text-[#95BF47]"
                                : "h-6 w-6"
                            }
                          />
                        </div>
                        <div
                          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                            status === "connected"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : status === "partial"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : status === "soon"
                                  ? "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                                  : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${
                              status === "connected"
                                ? "bg-emerald-500"
                                : status === "partial"
                                  ? "bg-amber-500"
                                  : "bg-zinc-400"
                            }`}
                          />
                          {status === "connected"
                            ? "Connected"
                            : status === "partial"
                              ? "Needs Setup"
                              : status === "soon"
                                ? "Coming Soon"
                                : "Available"}
                        </div>
                      </div>

                      <div className='mt-5'>
                        <h4 className='text-foreground line-clamp-1 text-base font-semibold tracking-tight dark:text-white'>
                          {integration.name}
                        </h4>
                        <p className='text-muted-foreground mt-1 line-clamp-2 text-xs dark:text-white/60'>
                          {integration.description}
                        </p>
                      </div>

                      <div className='mt-auto flex w-full items-center gap-2 pt-6'>
                        {status === "connected" || status === "partial" ? (
                          <Button
                            variant='outline'
                            onClick={() => setManageFor(integration)}
                            className='h-8 w-full border-black/10 bg-black/5 text-xs hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10'
                          >
                            Manage
                          </Button>
                        ) : (
                          <Button
                            disabled={isSoon}
                            onClick={() => setConnectFor(integration)}
                            className='h-8 w-full bg-indigo-600 text-xs text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700'
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className='mt-4 flex justify-end gap-1.5 opacity-0 transition-opacity duration-200 group-hover/carousel:opacity-100'>
            <CarouselPrevious className='border-border/50 bg-background/50 hover:bg-background/80 static h-8 w-8 translate-y-0 rounded-full' />
            <CarouselNext className='border-border/50 bg-background/50 hover:bg-background/80 static h-8 w-8 translate-y-0 rounded-full' />
          </div>
        </Carousel>
      </div>

      {/* Top Row: Metrics (1x3 Grid) */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {/* Health Score */}
        <div className='group relative overflow-hidden bg-black/[0.02] p-4 ring-1 ring-black/5 md:p-5 dark:bg-white/[0.04] dark:ring-white/10'>
          <GradientFrame />
          <div className='relative z-10 flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10'>
            <div className='mb-4 flex items-start justify-between'>
              <div>
                <h3 className='text-foreground text-sm font-semibold dark:text-white'>
                  AI Content Health Score
                </h3>
                <div className='mt-2 flex items-center gap-2'>
                  <span className='flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10'>
                    <TrendingUp className='mr-1 h-3 w-3' /> +0.3
                  </span>
                  <span className='text-muted-foreground text-[10px]'>
                    (Last 7 days)
                  </span>
                </div>
              </div>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10'>
                <Activity className='h-5 w-5 text-emerald-500' />
              </div>
            </div>
            <div>
              <div className='mt-4 mb-2 flex items-baseline gap-1'>
                <span className='text-foreground text-4xl font-bold tracking-tight tabular-nums dark:text-white'>
                  8.5
                </span>
                <span className='text-muted-foreground text-base font-medium'>
                  /10
                </span>
              </div>
              <p className='text-muted-foreground text-xs font-medium'>
                Overall performance of the content is above avg.
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Snapshot */}
        <div className='group relative overflow-hidden bg-black/[0.02] p-4 ring-1 ring-black/5 md:p-5 dark:bg-white/[0.04] dark:ring-white/10'>
          <GradientFrame />
          <div className='relative z-10 flex h-full flex-col justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10'>
            <div className='mb-4 flex items-start justify-between'>
              <div>
                <h3 className='text-foreground text-sm font-semibold dark:text-white'>
                  Key Metrics Snapshot
                </h3>
                <p className='text-muted-foreground mt-1 text-[10px]'>
                  Performance Summary
                </p>
              </div>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10'>
                <BarChart className='h-5 w-5 text-[#0F4C81] dark:text-blue-400' />
              </div>
            </div>
            <div className='mt-4 grid grid-cols-3 gap-3'>
              <div>
                <p className='text-muted-foreground mb-1.5 text-[10px] font-medium tracking-wider uppercase'>
                  Organic CTR
                </p>
                <p className='text-foreground text-xl font-bold tracking-tight tabular-nums dark:text-white'>
                  3.8%
                </p>
                <span className='mt-1.5 flex w-max items-center rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10'>
                  <TrendingUp className='mr-1 h-3 w-3' /> +0.1
                </span>
              </div>
              <div>
                <p className='text-muted-foreground mb-1.5 text-[10px] font-medium tracking-wider uppercase'>
                  Social Share
                </p>
                <p className='text-foreground text-xl font-bold tracking-tight tabular-nums dark:text-white'>
                  1.5%
                </p>
                <span className='mt-1.5 flex w-max items-center rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10'>
                  <TrendingUp className='mr-1 h-3 w-3' /> +0.3
                </span>
              </div>
              <div>
                <p className='text-muted-foreground mb-1.5 text-[10px] font-medium tracking-wider uppercase'>
                  Time on Page
                </p>
                <p className='text-foreground text-xl font-bold tracking-tight tabular-nums dark:text-white'>
                  1:45{" "}
                  <span className='text-muted-foreground text-[10px] font-medium'>
                    min
                  </span>
                </p>
                <span className='mt-1.5 flex w-max items-center rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-500/10'>
                  Stable
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Task Due */}
        <div className='group relative overflow-hidden bg-black/[0.02] p-4 ring-1 ring-black/5 md:p-5 dark:bg-white/[0.04] dark:ring-white/10'>
          <GradientFrame />
          <div className='relative z-10 flex h-full flex-col justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10'>
            <div className='mb-4 flex items-start justify-between'>
              <div>
                <h3 className='text-foreground text-sm font-semibold dark:text-white'>
                  Next Task Due
                </h3>
                <div className='mt-2 flex items-center gap-2'>
                  <span className='flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-500/10'>
                    Urgent
                  </span>
                </div>
              </div>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10'>
                <CalendarCheck className='h-5 w-5 text-amber-500' />
              </div>
            </div>
            <div className='mt-4'>
              <h4 className='text-foreground mb-2 text-lg font-bold tracking-tight dark:text-white'>
                "Instagram post #28"
              </h4>
              <div className='flex items-center justify-between'>
                <p className='text-muted-foreground text-xs font-medium'>
                  Due: Today, 4 PM
                </p>
                <a
                  href='#'
                  className='text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400'
                >
                  Go to Draft
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Charts & Suggestions */}
      <div className='flex flex-col gap-6 lg:flex-row'>
        {/* Trend Chart (2/3) */}
        <div className='group relative flex flex-grow flex-col overflow-hidden bg-black/[0.02] p-4 ring-1 ring-black/5 md:p-5 lg:w-2/3 dark:bg-white/[0.04] dark:ring-white/10'>
          <GradientFrame />
          <div className='relative z-10 flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10'>
            <div className='mb-6 flex items-center justify-between'>
              <div>
                <h3 className='text-foreground text-base font-semibold tracking-tight dark:text-white'>
                  Traffic vs. Engagement Trend (30 days)
                </h3>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Time Range Picker: 1M (Active)
                </p>
              </div>
              <div className='flex gap-2'>
                {["7D", "1M", "3M", "1Y"].map((range) => (
                  <button
                    key={range}
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${range === "1M" ? "border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" : "text-muted-foreground border-zinc-200 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className='h-[250px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='var(--border)'
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey='name'
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid rgba(0,0,0,0.05)",
                      boxShadow:
                        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      background: "var(--background)",
                    }}
                    itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
                  />
                  <Line
                    type='monotone'
                    dataKey='Traffic'
                    stroke='#8B5CF6'
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='Engagement'
                    stroke='#F43F5E'
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className='mt-4 flex justify-center gap-6'>
              <div className='flex items-center gap-2'>
                <div className='h-2.5 w-2.5 rounded-full bg-[#8B5CF6]'></div>
                <span className='text-muted-foreground text-[10px] font-medium tracking-wider uppercase'>
                  Traffic
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2.5 w-2.5 rounded-full bg-[#F43F5E]'></div>
                <span className='text-muted-foreground text-[10px] font-medium tracking-wider uppercase'>
                  Engagement
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Smart Recommendation (1/3) */}
        <div className='group relative flex w-full flex-col overflow-hidden bg-black/[0.02] p-4 ring-1 ring-black/5 md:p-5 lg:w-1/3 dark:bg-white/[0.04] dark:ring-white/10'>
          <GradientFrame />
          <div className='relative z-10 flex h-full flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10'>
            <div className='mb-2 flex items-start justify-between'>
              <div>
                <h3 className='text-foreground text-base font-semibold tracking-tight dark:text-white'>
                  AI Recommendations
                </h3>
                <p className='text-muted-foreground mt-1 text-[10px]'>
                  Suggested actions for today
                </p>
              </div>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10'>
                <Sparkles className='h-4 w-4 text-indigo-500 dark:text-indigo-400' />
              </div>
            </div>

            <div className='rounded-xl bg-black/[0.02] p-3 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10'>
              <div className='mb-1.5 flex items-center justify-between'>
                <h4 className='text-foreground line-clamp-1 text-xs font-semibold dark:text-white'>
                  Meta Description Optimization
                </h4>
                <span className='shrink-0 rounded-full bg-red-50 px-1.5 py-0.5 text-[9px] font-bold text-red-600 dark:bg-red-500/10'>
                  High Priority
                </span>
              </div>
              <p className='text-muted-foreground mb-3 line-clamp-2 text-[11px] leading-relaxed'>
                Add 5 long-tail keywords to the article "B2B Automation Tips" to
                improve ranking.
              </p>
              <div className='flex justify-end'>
                <Button className='h-7 rounded-md bg-indigo-600 px-3 text-[10px] text-white shadow-none hover:bg-indigo-700'>
                  Fix Now
                </Button>
              </div>
            </div>

            <div className='rounded-xl bg-black/[0.02] p-3 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10'>
              <div className='mb-1.5 flex items-center justify-between'>
                <h4 className='text-foreground line-clamp-1 text-xs font-semibold dark:text-white'>
                  Content Gap Analysis
                </h4>
                <span className='shrink-0 rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600 dark:bg-indigo-500/10'>
                  Suggestion
                </span>
              </div>
              <p className='text-muted-foreground mb-3 line-clamp-2 text-[11px] leading-relaxed'>
                Consider writing a follow-up post on "SaaS Growth" based on
                recent engagement spikes.
              </p>
              <div className='flex justify-end'>
                <Button
                  variant='outline'
                  className='h-7 border-black/10 bg-white px-3 text-[10px] shadow-none hover:bg-black/5 dark:border-white/10 dark:bg-[#0a0a0a] dark:hover:bg-white/5'
                >
                  Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Activity */}
      <div className='flex flex-col gap-6 lg:flex-row'>
        {/* Social Media Activity (2/3) */}
        <div className='group relative flex flex-grow flex-col overflow-hidden bg-black/[0.02] p-4 ring-1 ring-black/5 md:p-5 lg:w-2/3 dark:bg-white/[0.04] dark:ring-white/10'>
          <GradientFrame />
          <div className='relative z-10 flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10'>
            <div className='mb-6 flex items-start justify-between'>
              <div>
                <h3 className='text-foreground text-base font-semibold tracking-tight dark:text-white'>
                  All Social Media Channel Activity
                </h3>
                <a
                  href='#'
                  className='mt-1 block text-[10px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400'
                >
                  View All Activity
                </a>
              </div>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10'>
                <Users className='h-5 w-5 text-indigo-500' />
              </div>
            </div>

            <div className='scrollbar-hide flex gap-4 overflow-x-auto pb-4'>
              {[
                {
                  id: "rizkydwihid",
                  network: InstagramBrand,
                  bg: "bg-white",
                  likes: 89,
                  comments: 20,
                  views: "1.2K",
                },
                {
                  id: "ui.rizkydh",
                  network: FacebookBrand,
                  bg: "bg-white",
                  likes: 120,
                  comments: 59,
                  views: "1.5K",
                },
                {
                  id: "rizkydwihid12",
                  network: XBrand,
                  bg: "bg-black dark:bg-white text-white dark:text-black",
                  likes: 8,
                  comments: 3,
                  views: 122,
                },
              ].map((user, i) => (
                <div
                  key={i}
                  className='group/card relative flex min-w-[240px] cursor-pointer flex-col rounded-xl bg-black/[0.02] p-4 ring-1 ring-black/5 transition hover:ring-black/10 dark:bg-white/[0.04] dark:ring-white/10 dark:hover:ring-white/20'
                >
                  <Button
                    variant='ghost'
                    size='icon'
                    className='absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 transition group-hover/card:opacity-100 hover:bg-black/10 dark:hover:bg-white/10'
                  >
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                  <div className='mb-4 flex items-start gap-3'>
                    <div className='relative'>
                      <div className='h-10 w-10 overflow-hidden rounded-xl ring-1 ring-black/5 dark:ring-white/10'>
                        <img
                          src={`https://i.pravatar.cc/150?img=${i + 11}`}
                          className='h-full w-full object-cover'
                        />
                      </div>
                      <div
                        className={`absolute -right-1 -bottom-1 h-5 w-5 rounded-md ${user.bg} flex items-center justify-center shadow-sm ring-1 ring-black/10 dark:ring-white/10`}
                      >
                        <user.network className='h-3 w-3' />
                      </div>
                    </div>
                    <div>
                      <h4 className='text-foreground mb-1 text-sm leading-none font-semibold tracking-tight dark:text-white'>
                        {user.id}
                      </h4>
                      <p className='text-muted-foreground text-[10px] font-medium'>
                        Friday, Nov 28 | 9:53 PM
                      </p>
                    </div>
                  </div>
                  <div className='text-muted-foreground mt-auto flex items-center gap-4 text-[10px] font-semibold'>
                    <div className='flex items-center gap-1'>
                      <Heart className='h-3.5 w-3.5 text-red-500' />{" "}
                      {user.likes}
                    </div>
                    <div className='flex items-center gap-1'>
                      <MessageSquare className='h-3.5 w-3.5 text-blue-500' />{" "}
                      {user.comments}
                    </div>
                    <div className='flex items-center gap-1'>
                      <Activity className='h-3.5 w-3.5 text-emerald-500' />{" "}
                      {user.views}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      

      <ConnectDialog
        open={Boolean(connectFor)}
        onOpenChange={(o) => !o && setConnectFor(null)}
        platform={connectFor?.platform ?? null}
        platformName={connectFor?.name ?? ""}
        platformDescription={connectFor?.description ?? ""}
        Icon={connectFor?.icon ?? (() => null)}
        glow={connectFor?.glow ?? "rgba(113,113,122,0.4)"}
      />

      <ManageDialog
        open={Boolean(manageFor)}
        onOpenChange={(o) => !o && setManageFor(null)}
        connections={manageConnections}
        platform={manageFor?.platform ?? null}
        platformName={manageFor?.name ?? ""}
        Icon={manageFor?.icon ?? (() => null)}
        glow={manageFor?.glow ?? "rgba(113,113,122,0.4)"}
      />
    </div>
  );
}
