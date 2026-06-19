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
  ArrowRight,
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
import { useRouter } from "next/navigation";
import { HomeCommandCenter } from "./_components/home-command-center";

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
  const router = useRouter()

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
          className='absolute inset-0 h-full w-full object-cover object-center opacity-60'
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
  

            {/* Secondary ghost button */}
          <button className="group relative inline-flex h-11 items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:text-white active:scale-95 rounded-full border">
  
  {/* hover background only */}
  <div className="pointer-events-none absolute inset-0 rounded-xl bg-white/5 opacity-10 transition-opacity duration-300 group-hover:opacity-100" />

 

  <span className="relative z-10">Click to view</span>

  <ArrowRight   className="relative z-10 h-4 w-4 text-white/60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white" />

</button>
          </div>
        </div>
      </div>

      {/* Integrations Carousel */}
      <div className='mt-2 flex flex-col p-6 shadow-sm'>
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
            onClick={() => {
              router.push("/integrations")
            }}
          >
            View more
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
                  className='basis-full p-2 pl-[-5] sm:basis-1/2 lg:basis-1/4 xl:basis-1/4'
                >
                  <div className='group relative h-full w-full overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10'>
                    <div className='relative z-10 flex h-full flex-col'>
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

      <HomeCommandCenter />

      

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
