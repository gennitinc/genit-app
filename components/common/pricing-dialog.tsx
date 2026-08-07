"use client";

import { LocalizedText } from "@/components/localized-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useUrlState } from "@/hooks/use-url-state";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface PricingTier {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  popular?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Studio",
    monthlyPrice: 19,
    yearlyPrice: 190,
    description: "Professional tools for serious builders.",
    features: [
      "1,200 credits per month",
      "25 GB organization storage",
      "HD & 4K image generation",
      "Video & ad creation",
      "Genit Auto",
      "Brand kit access",
    ],
  },
  {
    name: "Pro Studio",
    monthlyPrice: 39,
    yearlyPrice: 390,
    description: "High-volume production for scaling teams.",
    features: [
      "2,000 credits per month",
      "100 GB organization storage",
      "Commercial video creation",
      "Genit Auto",
      "Priority Support",
      "Advanced brand kit",
    ],
    popular: true,
  },
  {
    name: "Agency",
    monthlyPrice: 79,
    yearlyPrice: 790,
    description: "Full control and collaboration for agencies.",
    features: [
      "5,000 credits per month",
      "500 GB organization storage",
      "4K ultra exports",
      "Genit Auto",
      "Team collaboration",
      "Dedicated support",
    ],
  },
];

interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tier: PricingTier;
  isYearly: boolean;
}

function PricingCard({
  tier,
  isYearly,
  className,
  ...props
}: PricingCardProps) {
  const [price, setPrice] = React.useState(
    isYearly ? tier.yearlyPrice : tier.monthlyPrice
  );

  React.useEffect(() => {
    const targetPrice = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
    const step = (targetPrice - price) / 5;
    const interval = setInterval(() => {
      setPrice((prevPrice) => {
        const newPrice = prevPrice + step;
        return Math.abs(newPrice - targetPrice) < 0.1 ? targetPrice : newPrice;
      });
    }, 5);
    return () => clearInterval(interval);
  }, [isYearly, tier.monthlyPrice, tier.yearlyPrice, price]);

  return (
    <div
      className={cn(
        "border-border bg-background relative rounded-lg border transition-all duration-300",
        "hover:border-border hover:shadow-lg hover:shadow-blue-500/10",
        tier.popular && "border-blue-500/20 shadow-lg shadow-blue-500/10",
        className
      )}
      {...props}
    >
      {tier.popular && (
        <Badge
          variant='secondary'
          className='absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white'
        >
          <LocalizedText text={"Popular"} />
        </Badge>
      )}
      <div className='p-6'>
        <div className='mb-5'>
          <h3 className='text-foreground text-lg font-semibold'>{tier.name}</h3>
          <p className='text-muted-foreground mt-1 text-sm'>
            {tier.description}
          </p>
        </div>
        <div className='mb-6'>
          <div className='flex items-baseline'>
            <span className='text-foreground text-4xl font-bold transition-all duration-300'>
              ${price.toFixed(2)}
            </span>
            <span className='text-muted-foreground ml-2'>
              /{isYearly ? "year" : "month"}
            </span>
          </div>
          {isYearly && (
            <p className='mt-1 text-sm text-blue-500'>
              <LocalizedText text={"Save $"} />
              {(tier.monthlyPrice * 12 - tier.yearlyPrice).toFixed(0)}{" "}
              <LocalizedText text={"yearly"} />
            </p>
          )}
        </div>
        <Button
          asChild
          className={cn(
            "mb-6 w-full transition-all duration-300",
            tier.popular
              ? "focus:ring-primary/30 dark:focus:ring-primary/40 bg-indigo-600 text-white hover:bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-700/90 focus:ring-4 focus:outline-none"
              : "bg-zinc-800 text-white hover:bg-zinc-700"
          )}
        >
          <Link href='/pricing'>
            <span>
              <LocalizedText text={"Choose"} />
              {tier.name}
            </span>
            <ArrowRight className='ml-1 h-4 w-4' />
          </Link>
        </Button>
        <div className='space-y-3'>
          {tier.features.map((feature) => (
            <div key={feature} className='flex items-center text-sm'>
              <Check className='mr-2 h-4 w-4 text-blue-500' />
              <span className='text-muted-foreground'>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PricingContent({
  isYearly,
  setIsYearly,
}: {
  isYearly: boolean;
  setIsYearly: (value: boolean) => void;
}) {
  return (
    <div className='overflow-y-auto'>
      <div className='space-y-8 px-2 py-6 md:p-6'>
        <div className='text-center'>
          <h2 className='text-foreground text-2xl font-bold sm:text-3xl'>
            <LocalizedText text={"Choose the right plan for you"} />
          </h2>
          <p className='text-muted-foreground mx-auto mt-4 max-w-2xl text-center text-sm'>
            <LocalizedText
              text={
                "Our plans are designed to fit your needs, whether you're just starting out or scaling up."
              }
            />
          </p>
        </div>

        <div className='flex justify-center'>
          <div className='inline-flex items-center rounded-full border border-zinc-800 p-1'>
            <Button
              variant='ghost'
              size='sm'
              className={cn(
                "text-muted-foreground rounded-full px-4 transition-colors duration-200 hover:bg-transparent",
                !isYearly &&
                  "bg-muted-foreground hover:bg-muted-foreground/90 text-white hover:text-white/90"
              )}
              onClick={() => setIsYearly(false)}
            >
              <LocalizedText text={"Monthly"} />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className={cn(
                "text-muted-foreground rounded-full px-4 transition-colors duration-200 hover:bg-transparent",
                isYearly &&
                  "bg-muted-foreground hover:bg-muted-foreground/90 text-white hover:text-white/90"
              )}
              onClick={() => setIsYearly(true)}
            >
              <LocalizedText text={"Annually"} />
            </Button>
          </div>
        </div>

        <div className='grid gap-8 lg:grid-cols-3'>
          {tiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} isYearly={isYearly} />
          ))}
        </div>

        <div className='mt-8 flex w-full flex-row items-center justify-center gap-2'>
          <Link
            href='/pricing'
            className='flex flex-row items-center gap-2 text-base font-semibold text-gray-400 dark:text-gray-300'
          >
            <span>
              {" "}
              <LocalizedText text={"Compare plans"} />
            </span>

            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
              />
            </svg>
          </Link>
        </div>

        {/* <div className="mt-8 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
          <div className="p-6">
            <h3 className="mb-4 text-base font-semibold text-white">Compare all features</h3>
            <div className="grid">
              <div className="grid grid-cols-4 items-center gap-4 text-sm font-medium">
                <div className="text-zinc-400">Features</div>
                <div className="text-white">Starter</div>
                <div className="text-white">Pro</div>
                <div className="text-white">Enterprise</div>
              </div>
              <div className="mt-4 space-y-4">
                {[
                  { name: "AI Generations", starter: "5/mo", pro: "Unlimited", enterprise: "Unlimited" },
                  { name: "Team Members", starter: "1", pro: "5", enterprise: "Unlimited" },
                  { name: "Analytics", starter: "Basic", pro: "Advanced", enterprise: "Custom" },
                  { name: "Support", starter: "Community", pro: "Priority", enterprise: "Dedicated" },
                  { name: "Templates", starter: "Basic", pro: "Custom", enterprise: "White-label" },
                  { name: "API Access", starter: "—", pro: "✓", enterprise: "✓" },
                  { name: "Custom Training", starter: "—", pro: "—", enterprise: "✓" },
                  { name: "SLA", starter: "—", pro: "Optional", enterprise: "Included" },
                ].map((feature) => (
                  <div
                    key={feature.name}
                    className="grid grid-cols-4 items-center gap-4 text-sm border-t border-zinc-800 pt-4"
                  >
                    <div className="text-zinc-400">{feature.name}</div>
                    <div className="text-zinc-300">{feature.starter}</div>
                    <div className="text-zinc-300">{feature.pro}</div>
                    <div className="text-zinc-300">{feature.enterprise}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export function PricingDialog({
  className,
  open,
}: {
  className?: string;
  open: boolean;
}) {
  const [isYearly, setIsYearly] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { removeUrlState } = useUrlState();
  const closeDialog = () => {
    removeUrlState("checkout");
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={closeDialog}>
        {/* <DialogTrigger asChild>
          <div className={className}></div>
        </DialogTrigger> */}
        <DialogContent className='bg-background h-[90vh] max-w-6xl overflow-y-auto p-0 text-white'>
          <PricingContent isYearly={isYearly} setIsYearly={setIsYearly} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={closeDialog}>
      {/* <DrawerTrigger asChild>
        <div className={className}>{children}</div>
      </DrawerTrigger> */}
      <DrawerContent className='bg-background h-[90vh] text-white'>
        <DrawerHeader className='text-left'>
          {/* <DrawerTitle className="text-2xl font-bold">Choose your plan</DrawerTitle> */}
          <DrawerClose className='absolute top-4 right-4'>
            <X className='h-4 w-4' />
            <span className='sr-only'>
              <LocalizedText text={"Close"} />
            </span>
          </DrawerClose>
        </DrawerHeader>
        <div className='h-full overflow-y-auto px-4 pb-8'>
          <PricingContent isYearly={isYearly} setIsYearly={setIsYearly} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
