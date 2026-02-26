"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Crown, Loader2 } from "lucide-react";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { apiResponse } from "@/utils/apiResponse";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight-new";

const plansDev = [
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: 0,
    yearlyPrice: 0,
    productIds: {
      monthly: null,
      yearly: null,
    },
    features: [
      "Limited monthly credits",
      "HD image generation",
      "Short video creation",
      "Basic templates library",
      "Community support",
    ],
    popular: false,
  },
  {
    id: "creator",
    name: "Creator",
    monthlyPrice: 5,
    yearlyPrice: 48,
    productIds: {
      monthly: "ADD_CREATOR_MONTHLY_ID",
      yearly: "ADD_CREATOR_YEARLY_ID",
    },
    features: [
      "500 credits per month",
      "HD image generation",
      "Short-form video exports",
      "Expanded templates library",
      "Standard support",
    ],
    popular: false,
  },
  {
    id: "studio",
    name: "Studio",
    monthlyPrice: 12,
    yearlyPrice: 96,
    productIds: {
      monthly: "ADD_STUDIO_MONTHLY_ID",
      yearly: "ADD_STUDIO_YEARLY_ID",
    },
    features: [
      "1,200 credits per month",
      "HD & 4K image generation",
      "Video & ad creation",
      "Brand kit access",
      "Priority rendering",
    ],
    popular: true,
  },
  {
    id: "pro-studio",
    name: "Pro Studio",
    monthlyPrice: 19,
    yearlyPrice: 120,
    productIds: {
      monthly: "1e641980-d7f2-4a21-8c8f-7af81795bcf0",
      yearly: "c1897be5-2126-4cc7-aac4-e769250780f3",
    },
    features: [
      "2,000 credits per month",
      "HD & 4K image generation",
      "Commercial video creation",
      "Priority support",
      "Advanced brand kit",
      "Social media optimized exports",
    ],
    popular: false,
  },
  {
    id: "agency",
    name: "Agency",
    monthlyPrice: 25,
    yearlyPrice: 190,
    productIds: {
      monthly: "f60b7ec7-26f1-4311-87ca-03fcaab02dc0",
      yearly: "4952b33d-2654-44f7-9645-bdac62b008c3",
    },
    features: [
      "5,000 credits per month",
      "4K ultra exports",
      "Full commercial licensing",
      "Dedicated support",
      "Team collaboration",
      "Custom brand assets",
    ],
    popular: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: -1,
    yearlyPrice: -1,
    productIds: {
      monthly: null,
      yearly: null,
    },
    features: [
      "Custom credit allowance",
      "Full API access",
      "Dedicated account manager",
      "SLA & custom contracts",
      "SSO & advanced security",
      "Custom AI model training",
    ],
    popular: false,
  },
];

const plansProd = [
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: 0,
    yearlyPrice: 0,
    productIds: {
      monthly: null,
      yearly: null,
    },
    features: [
      "Limited monthly credits",
      "HD image generation",
      "Short video creation",
      "Basic templates library",
      "Community support",
    ],
    popular: false,
  },
  {
    id: "creator",
    name: "Creator",
    monthlyPrice: 5,
    yearlyPrice: 48,
    productIds: {
      monthly: "21e60d79-cc2a-4c32-ab78-7eeadaabd60a",
      yearly: "bbb454d7-742a-419d-ba18-94386be003fe",
    },
    features: [
      "500 credits per month",
      "HD image generation",
      "Short-form video exports",
      "Expanded templates library",
      "Standard support",
    ],
    popular: false,
  },
  {
    id: "studio",
    name: "Studio",
    monthlyPrice: 12,
    yearlyPrice: 96,
    productIds: {
      monthly: "efd95591-37f9-4759-9664-332df51a2723",
      yearly: "881b3661-dcdf-4f7c-802d-5d1d67792b65",
    },
    features: [
      "1,200 credits per month",
      "HD & 4K image generation",
      "Video & ad creation",
      "Brand kit access",
      "Priority rendering",
    ],
    popular: true,
  },
  {
    id: "pro-studio",
    name: "Pro Studio",
    monthlyPrice: 19,
    yearlyPrice: 120,
    productIds: {
      monthly: "e6020f20-000e-4ca4-b9f2-69e1168cf5aa",
      yearly: "ade34b2b-4e67-4d93-bd15-ef0ca62d7f8d",
    },
    features: [
      "2,000 credits per month",
      "HD & 4K image generation",
      "Commercial video creation",
      "Priority support",
      "Advanced brand kit",
      "Social media optimized exports",
    ],
    popular: false,
  },
  {
    id: "agency",
    name: "Agency",
    monthlyPrice: 25,
    yearlyPrice: 190,
    productIds: {
      monthly: "b70d97f1-7633-4139-abb3-e1d19abd8729",
      yearly: "b4c7e616-e50e-4b34-9c07-55be1a485f53",
    },
    features: [
      "5,000 credits per month",
      "4K ultra exports",
      "Full commercial licensing",
      "Dedicated support",
      "Team collaboration",
      "Custom brand assets",
    ],
    popular: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: -1,
    yearlyPrice: -1,
    productIds: {
      monthly: null,
      yearly: null,
    },
    features: [
      "Custom credit allowance",
      "Full API access",
      "Dedicated account manager",
      "SLA & custom contracts",
      "SSO & advanced security",
      "Custom AI model training",
    ],
    popular: false,
  },
];

const plans = process.env.NODE_ENV == "production" ? plansProd : plansDev;

export default function PricingComponent() {
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: any) => {
    if (plan.monthlyPrice === 0) {
      // Handle free plan - redirect to signup or dashboard
      window.location.href = "/signup";
      return;
    }

    setLoadingPlan(plan.name);

    try {
      const billing = isYearly ? "yearly" : "monthly";
      const productId = plan.productIds[billing];

      const response = await apiResponse.post(
        "/payment/sub/create",
        {
          productId: productId,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data && response.data.checkoutUrl) {
        // Redirect to Polar checkout
        window.location.href = response.data.checkoutUrl;
      } else {
        console.error("Checkout failed - no checkout URL received");
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="relative bg-background" id="pricing">
      <div className="lg:px-8 max-w-7xl mx-auto px-0 md:px-6 py-24 md:py-32">
        {/* Header */}
        <div className="text-center animate-fadeInUp">
          <h1 className="text-2xl font-bold tracking-tight md:text-4xl lg:text-6xl">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Plan
            </span>
          </h1>
          <p
            className="my-5 text-muted-foreground text-sm md:text-lg animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            Flexible pricing options designed for you.
          </p>
        </div>

        {/* Billing toggle */}
        {/* <div className="flex justify-center mb-20">
          <div className="inline-flex items-center rounded-full bg-secondary border border-border p-1 text-sm shadow-md">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={cn(
                "rounded-full px-8 py-2.5 transition-all duration-200 font-medium",
                !isYearly
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={cn(
                "rounded-full px-8 py-2.5 transition-all duration-200 flex items-center gap-2 font-medium",
                isYearly
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span>Yearly</span>
              <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full border border-primary/20">
                -30%
              </span>
            </button>
          </div>
        </div> */}

        <>
          {/* Switch */}
          <div
            className="flex justify-center items-center gap-x-3 my-16 animate-fadeInUp"
            style={{ animationDelay: "0.4s" }}
          >
            <label
              htmlFor="pricing-switch"
              className="text-sm text-gray-800 dark:text-neutral-200"
            >
              Monthly
            </label>
            <label
              htmlFor="pricing-switch"
              className="relative inline-block w-11 h-6 cursor-pointer"
            >
              <input
                type="checkbox"
                id="pricing-switch"
                className="peer sr-only"
                checked={isYearly}
                onChange={(e) => setIsYearly(e.target.checked)}
              />
              <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 dark:bg-neutral-700 dark:peer-checked:bg-blue-500 peer-disabled:opacity-50 peer-disabled:pointer-events-none" />
              <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-5 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white" />
            </label>
            <label
              htmlFor="pricing-switch"
              className="relative text-sm text-gray-800 dark:text-neutral-200"
            >
              Annually
              <span className="absolute -top-10 start-auto -end-10 md:-end-28">
                <span className="flex items-center">
                  <svg
                    className="w-14 h-8 -me-6"
                    width={45}
                    height={25}
                    viewBox="0 0 45 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z"
                      fill="currentColor"
                      className="fill-gray-300 dark:fill-neutral-700"
                    />
                  </svg>
                  <span className="mt-3 inline-block whitespace-nowrap text-[11px] leading-5 font-semibold uppercase bg-blue-600 text-white rounded-full py-1 px-2.5">
                    Save up to 30%
                  </span>
                </span>
              </span>
            </label>
          </div>
          {/* End Switch */}
        </>

        {/* Cards Container */}
        <div className="relative grid w-full grid-cols-1 gap-6 overflow-hidden p-4 sm:gap-8 md:grid-cols-2 md:p-8 lg:grid-cols-4">
          {plans.map((plan) => {
            const displayPrice = isYearly
              ? Math.floor(plan.yearlyPrice / 12)
              : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-sm p-1 sm:p-2 md:p-3 transition-all duration-300",
                  plan.popular
                    ? "border border-transparent bg-card shadow ring shadow-black/10 ring-black/5 dark:bg-card"
                    : "bg-transparent dark:bg-black",
                )}
              >
                {/* Dashed Border Effect for Popular Card */}
                {plan.popular && (
                  <>
                    <div
                      className="[--color-dark:var(--color-neutral-800)] [--color:var(--color-neutral-400)] absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] -top-[2px]"
                      style={
                        {
                          "--background": "hsl(var(--background))",
                          "--height": "1px",
                          "--width": "5px",
                          "--fade-stop": "90%",
                          "--offset": "100px",
                          maskComposite: "exclude",
                        } as React.CSSProperties
                      }
                    ></div>

                    <div
                      className="[--color-dark:var(--color-neutral-800)] [--color:var(--color-neutral-400)] absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] -bottom-[2px]"
                      style={
                        {
                          "--background": "hsl(var(--background))",
                          "--height": "1px",
                          "--width": "5px",
                          "--fade-stop": "90%",
                          "--offset": "100px",
                          maskComposite: "exclude",
                        } as React.CSSProperties
                      }
                    ></div>
                    <div
                      className="[--color-dark:var(--color-neutral-800)] [--color:var(--color-neutral-400)] absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] -left-[2px]"
                      style={
                        {
                          "--background": "hsl(var(--background))",
                          "--height": "5px",
                          "--width": "1px",
                          "--fade-stop": "90%",
                          "--offset": "100px",
                          maskComposite: "exclude",
                        } as React.CSSProperties
                      }
                    ></div>
                    <div
                      className="[--color-dark:var(--color-neutral-800)] [--color:var(--color-neutral-400)] absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] -right-[2px] left-auto"
                      style={
                        {
                          "--background": "hsl(var(--background))",
                          "--height": "5px",
                          "--width": "1px",
                          "--fade-stop": "90%",
                          "--offset": "100px",
                          maskComposite: "exclude",
                        } as React.CSSProperties
                      }
                    ></div>
                  </>
                )}

                <div className="flex h-full flex-col justify-start gap-1 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-medium text-foreground sm:text-lg">
                          {plan.name}
                        </p>
                        {["pro-studio", "agency", "enterprise"].includes(
                          plan.id,
                        ) && (
                          <Crown className="w-4 h-4 text-yellow-500 fill-cyan-500/10" />
                        )}
                      </div>
                    </div>
                    {plan.popular && (
                      <div className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1 text-xs font-medium text-white animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                        Popular
                      </div>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground min-h-[40px]">
                    {plan.name === "Basic" &&
                      "Perfect for side projects and small teams"}
                    {plan.name === "Creator" &&
                      "For individuals starting their creative journey"}
                    {plan.name === "Studio" &&
                      "Professional tools for serious builders"}
                    {plan.name === "Pro Studio" &&
                      "High-volume production for scaling teams"}
                    {plan.name === "Agency" &&
                      "Full enterprise control and collaboration"}
                    {plan.name === "Enterprise" &&
                      "For organizations that need full control"}
                  </p>

                  <div className="my-6">
                    <div className="flex items-end">
                      {plan.monthlyPrice === -1 ? (
                        <span className="text-3xl font-medium text-foreground md:text-4xl">
                          Custom
                        </span>
                      ) : (
                        <span className="text-3xl font-medium text-foreground md:text-4xl">
                          ${displayPrice}
                        </span>
                      )}
                    </div>
                    {plan.monthlyPrice !== -1 && (
                      <span className="text-sm text-muted-foreground">
                        per month
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      plan.id === "enterprise"
                        ? (window.location.href = "mailto:sales@gennit.com")
                        : handleCheckout(plan)
                    }
                    disabled={loadingPlan === plan.name}
                    className={cn(
                      "mt-4 mb-2 w-full cursor-pointer rounded-sm px-2 py-1.5 transition duration-200 active:scale-[0.98] border border-transparent flex items-center justify-center gap-2",
                      plan.popular
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl text-white shadow ring shadow-cyan-500/15 ring-cyan-500/10"
                        : "bg-secondary text-secondary-foreground shadow ring shadow-black/15 ring-black/10 dark:bg-secondary",
                    )}
                  >
                    {loadingPlan === plan.name ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : plan.id === "enterprise" ? (
                      "Contact Sales"
                    ) : (
                      "Get Started"
                    )}
                  </button>

                  <div className="mt-1">
                    {plan.features.map((feature: string, fIdx: number) => {
                      const showPlus =
                        fIdx === 5 &&
                        (plan.id === "agency" || plan.id === "enterprise");
                      return (
                        <React.Fragment key={fIdx}>
                          {showPlus && (
                            <div className="relative my-4">
                              <div className="h-px w-full bg-border"></div>
                              <div className="absolute inset-0 m-auto flex h-5 w-5 items-center justify-center rounded-xl bg-card shadow-[0px_-1px_0px_0px_var(--border)]">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-3 w-3 stroke-[4px] text-foreground"
                                >
                                  <path d="M12 5l0 14"></path>
                                  <path d="M5 12l14 0"></path>
                                </svg>
                              </div>
                            </div>
                          )}
                          <div className="my-5 flex items-start justify-start gap-2">
                            <div
                              className={cn(
                                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all",
                                "bg-gradient-to-r from-cyan-500 to-blue-500",
                              )}
                            >
                              <Check className="h-2 w-2 stroke-[4px] text-white" />
                            </div>
                            <div className="text-sm font-medium text-muted-foreground">
                              {feature}
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
