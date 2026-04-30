"use client";

import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Button } from "@/components/ui/button";
import { apiResponse } from "@/utils/apiResponse";
import { ArrowRight, Check } from "lucide-react";
import React, { useState } from "react";

const plansDev = [
  {
    name: "Basic",
    monthlyPrice: 0,
    yearlyPrice: 0,
    productIds: {
      monthly: null,
      yearly: null,
    },
    features: [
      "10 AI-generated graphics per month",
      "Basic templates library",
      "Standard image formats (PNG, JPG)",
      "Community support",
      "Basic design tools",
    ],
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: 19,
    yearlyPrice: 120,
    productIds: {
      monthly: "1e641980-d7f2-4a21-8c8f-7af81795bcf0",
      yearly: "c1897be5-2126-4cc7-aac4-e769250780f3",
    },
    features: [
      "100 AI-generated graphics per month",
      "Premium templates library",
      "All image formats (PNG, JPG, SVG, PDF)",
      "Priority support",
      "Advanced design tools",
      "Brand kit management",
      "Social media templates",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: 25,
    yearlyPrice: 190,
    productIds: {
      monthly: "f60b7ec7-26f1-4311-87ca-03fcaab02dc0",
      yearly: "4952b33d-2654-44f7-9645-bdac62b008c3",
    },
    features: [
      "Unlimited AI-generated graphics",
      "Full templates library",
      "All image formats + vector files",
      "Dedicated support",
      "Advanced design tools",
      "Team collaboration",
      "Custom brand assets",
      "White-label options",
    ],
    popular: false,
  },
];
const plansProd = [
  {
    name: "Basic",
    monthlyPrice: 0,
    yearlyPrice: 0,
    productIds: {
      monthly: null,
      yearly: null,
    },
    features: [
      "10 AI-generated graphics per month",
      "Basic templates library",
      "Standard image formats (PNG, JPG)",
      "Community support",
      "Basic design tools",
    ],
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: 19,
    yearlyPrice: 120,
    productIds: {
      monthly: "e6020f20-000e-4ca4-b9f2-69e1168cf5aa",
      yearly: "ade34b2b-4e67-4d93-bd15-ef0ca62d7f8d",
    },
    features: [
      "100 AI-generated graphics per month",
      "Premium templates library",
      "All image formats (PNG, JPG, SVG, PDF)",
      "Priority support",
      "Advanced design tools",
      "Brand kit management",
      "Social media templates",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: 25,
    yearlyPrice: 190,
    productIds: {
      monthly: "b70d97f1-7633-4139-abb3-e1d19abd8729",
      yearly: "b4c7e616-e50e-4b34-9c07-55be1a485f53",
    },
    features: [
      "Unlimited AI-generated graphics",
      "Full templates library",
      "All image formats + vector files",
      "Dedicated support",
      "Advanced design tools",
      "Team collaboration",
      "Custom brand assets",
      "White-label options",
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
        }
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
    <section className='relative py-24 md:py-32'>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes counterUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .counter-animation {
          animation: counterUp 0.3s ease-out;
        }
      `}</style>
      <div className='w-full p-2 md:mx-auto md:max-w-5xl md:p-4'>
        <div className='animate-fadeInUp text-center'>
          <h1 className='text-2xl font-bold tracking-tight md:text-4xl lg:text-6xl'>
            Choose Your{" "}
            <span className='from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent'>
              Plan
            </span>
          </h1>
          <p
            className='text-muted-foreground animate-fadeInUp text-sm md:text-lg'
            style={{ animationDelay: "0.2s" }}
          >
            Flexible pricing options designed for you.
          </p>
        </div>
        <>
          {/* Switch */}
          <div
            className='animate-fadeInUp my-16 flex items-center justify-center gap-x-3'
            style={{ animationDelay: "0.4s" }}
          >
            <label
              htmlFor='pricing-switch'
              className='text-sm text-gray-800 dark:text-neutral-200'
            >
              Monthly
            </label>
            <label
              htmlFor='pricing-switch'
              className='relative inline-block h-6 w-11 cursor-pointer'
            >
              <input
                type='checkbox'
                id='pricing-switch'
                className='peer sr-only'
                checked={isYearly}
                onChange={(e) => setIsYearly(e.target.checked)}
              />
              <span className='absolute inset-0 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:pointer-events-none peer-disabled:opacity-50 dark:bg-neutral-700 dark:peer-checked:bg-blue-500' />
              <span className='absolute start-0.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white' />
            </label>
            <label
              htmlFor='pricing-switch'
              className='relative text-sm text-gray-800 dark:text-neutral-200'
            >
              Annually
              <span className='absolute start-auto -end-10 -top-10 md:-end-28'>
                <span className='flex items-center'>
                  <svg
                    className='-me-6 h-8 w-14'
                    width={45}
                    height={25}
                    viewBox='0 0 45 25'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z'
                      fill='currentColor'
                      className='fill-gray-300 dark:fill-neutral-700'
                    />
                  </svg>
                  <span className='mt-3 inline-block rounded-full bg-blue-600 px-2.5 py-1 text-[11px] leading-5 font-semibold whitespace-nowrap text-white uppercase'>
                    Save up to 30%
                  </span>
                </span>
              </span>
            </label>
          </div>
          {/* End Switch */}
        </>

        <div className='flex w-full flex-wrap items-center justify-center gap-6'>
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`w-[95%] transform rounded-lg p-6 text-center transition-all duration-500 hover:scale-105 hover:shadow-xl sm:w-72 ${
                plan.popular
                  ? "border-primary/30 relative border bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 pb-14 text-white"
                  : "bg-card text-foreground border-border hover:border-primary/50 border"
              }`}
              style={{
                animationDelay: `${index * 200}ms`,
                animation: `fadeInUp 0.6s ease-out ${index * 200}ms both`,
              }}
            >
              {plan.popular && (
                <p className='bg-primary-foreground text-primary absolute -top-3.5 left-3.5 rounded-full px-3 py-1 text-sm'>
                  Most Popular
                </p>
              )}

              <p
                className={`font-semibold ${plan.popular ? "pt-2" : ""} flex items-center justify-center gap-1`}
              >
                {plan.name}
                {plan.name === "Enterprise" && (
                  <svg
                    className='mt-0.5'
                    width='12'
                    height='12'
                    viewBox='0 0 12 12'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z'
                      fill='#2196F3'
                    />
                  </svg>
                )}
              </p>

              <h1 className='text-3xl font-semibold'>
                {plan.monthlyPrice === 0 ? (
                  "Free"
                ) : (
                  <span className='counter-animation'>
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    <span
                      className={`text-sm font-normal ${
                        plan.popular ? "text-white/80" : "text-muted-foreground"
                      }`}
                    >
                      /{isYearly ? "year" : "month"}
                    </span>
                  </span>
                )}
              </h1>

              {isYearly && plan.monthlyPrice > 0 && (
                <p className='mt-1 text-sm font-medium text-green-400'>
                  Save ${plan.monthlyPrice * 12 - plan.yearlyPrice} per year
                </p>
              )}

              <ul
                className={`mt-6 list-none space-y-1 text-left text-sm ${
                  plan.popular ? "text-white" : "text-muted-foreground"
                }`}
              >
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className='flex items-start justify-start gap-2 transition-all duration-300 hover:translate-x-2'
                    style={{
                      animationDelay: `${index * 200 + featureIndex * 100}ms`,
                      animation: `fadeInLeft 0.4s ease-out ${index * 200 + featureIndex * 100}ms both`,
                    }}
                  >
                    <Check className='text-primary h-4 w-4 flex-shrink-0 animate-pulse' />
                    <p className='text-left'>{feature}</p>
                  </li>
                ))}
              </ul>

              <button
                type='button'
                onClick={() => handleCheckout(plan)}
                disabled={loadingPlan === plan.name}
                className={`mt-7 flex w-full transform cursor-pointer items-center justify-center rounded py-2 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : plan.monthlyPrice === 0
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {loadingPlan === plan.name ? (
                  <div className='flex items-center justify-center gap-2'>
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                    Processing...
                  </div>
                ) : plan.monthlyPrice === 0 ? (
                  <div className='flex flex-row items-center gap-2'>
                    <span>Start for $0</span>
                    <ArrowRight className='ml-1 h-4 w-4' />
                  </div>
                ) : (
                  <div className='flex flex-row items-center gap-2'>
                    <span>Upgrade </span>
                    <ArrowRight className='ml-1 h-4 w-4' />
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
