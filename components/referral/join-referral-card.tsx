"use client";

import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthenticatedContext";
import Loading from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  DollarSign,
  Gift,
  Link as LinkIcon,
  Percent,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface JoinReferralCardProps {
  onJoinSuccess: () => void;
  headingLevel?: "h1" | "h2";
}

export function JoinReferralCard({
  onJoinSuccess,
  headingLevel = "h2",
}: JoinReferralCardProps) {
  const Heading = headingLevel;
  const [joining, setJoining] = useState(false);
  const { user } = useUserContext();
  const router = useRouter();

  const handleJoinReferralProgram = async () => {
    if (!user) {
      toast.info("Please sign in to join the referral program", {
        description: "Redirecting to sign in...",
      });
      router.push("/signin");
      return;
    }

    setJoining(true);
    try {
      const response = await apiResponse.post(
        "/referral/join",
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Welcome to the Creators Program!", {
          description:
            "You've successfully joined. Start earning by sharing your unique link!",
        });
        onJoinSuccess();
      }
    } catch (error: any) {
      console.error("Failed to join referral program:", error);

      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("Please sign in to join the referral program", {
          description: "Redirecting to sign in...",
        });
        router.push("/signin");
        return;
      }

      toast.error(
        error?.response?.data?.message ||
          "Failed to join referral program. Please try again."
      );
    } finally {
      setJoining(false);
    }
  };

  const chartMonths = [
    { month: "Jan", height: "h-8", amount: "$320" },
    { month: "Feb", height: "h-12", amount: "$480" },
    { month: "Mar", height: "h-16", amount: "$640" },
    { month: "Apr", height: "h-14", amount: "$560" },
    { month: "May", height: "h-20", amount: "$820" },
    { month: "Jun", height: "h-24", amount: "$1,050" },
    { month: "Jul", height: "h-28", amount: "$1,280" },
    { month: "Aug", height: "h-32", amount: "$1,620" },
  ];

  return (
    <div className='w-full'>
      <div className='mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24'>
        {/* Breadcrumb indicator */}
        <div className='flex items-center gap-2 font-mono text-xs tracking-widest text-neutral-500 uppercase'>
          <Link
            href='/'
            className='transition-colors hover:text-neutral-900 dark:hover:text-white'
          >
            Home
          </Link>
          <span className='text-neutral-300 dark:text-neutral-700'>/</span>
          <span>Partnerships</span>
          <span className='text-neutral-300 dark:text-neutral-700'>/</span>
          <span className='text-neutral-900 dark:text-white'>Creators</span>
        </div>

        {/* Hero Section: 2 Columns */}
        <div className='mt-8 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16'>
          {/* Left Column */}
          <div className='space-y-6 lg:col-span-7'>
            <span className='inline-block font-mono text-xs font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400'>
              Partnership &amp; Affiliates
            </span>

            <Heading className='text-3xl font-bold tracking-tight text-neutral-950 sm:text-5xl dark:text-white'>
              Partner with Genit.
            </Heading>

            <p className='text-pretty text-base leading-8 text-neutral-600 sm:text-lg dark:text-neutral-400'>
              Join the Genit Creators Program. Introduce founders, growth teams,
              and agencies to our autonomous AI marketing platform and earn
              recurring monthly commissions on every eligible subscription.
            </p>

            {/* Left border value statements */}
            <ul className='space-y-4 pt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400'>
              <li className='border-l border-neutral-300 ps-4 dark:border-neutral-700'>
                <strong className='font-semibold text-neutral-950 dark:text-white'>
                  20% Recurring Commission:
                </strong>{" "}
                Earn continuous revenue for the active lifetime of every referred
                customer.
              </li>
              <li className='border-l border-neutral-300 ps-4 dark:border-neutral-700'>
                <strong className='font-semibold text-neutral-950 dark:text-white'>
                  Complete Creator Media Kit:
                </strong>{" "}
                Get official platform graphics, product recordings, case
                studies, and suggested messaging.
              </li>
              <li className='border-l border-neutral-300 ps-4 dark:border-neutral-700'>
                <strong className='font-semibold text-neutral-950 dark:text-white'>
                  Real-Time Analytics &amp; Prompt Payouts:
                </strong>{" "}
                Monitor impressions, conversions, and monthly payouts directly in
                your creator portal.
              </li>
            </ul>

            <div className='flex flex-wrap items-center gap-4 pt-4'>
              <Button
                onClick={handleJoinReferralProgram}
                disabled={joining}
                className='h-12 rounded-full bg-neutral-950 px-7 font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-950'
                size='lg'
              >
                {joining ? (
                  <div className='flex items-center gap-2'>
                    <Loading size={18} />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <span>Become a Creator Partner</span>
                    <ArrowRight className='size-4' />
                  </div>
                )}
              </Button>

              <Link
                href='/legal/terms-of-service'
                className='inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
              >
                <span>Read affiliate terms</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Architectural Dashboard Preview */}
          <div className='lg:col-span-5'>
            <div className='overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-950/60'>
              <div className='flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800'>
                <div>
                  <span className='font-mono text-xs text-neutral-400 uppercase dark:text-neutral-500'>
                    Partner Telemetry
                  </span>
                  <p className='text-sm font-semibold text-neutral-950 dark:text-white'>
                    Creator Performance
                  </p>
                </div>
              </div>

              <div className='mt-6 grid grid-cols-2 gap-4'>
                <div className='rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900'>
                  <span className='font-mono text-xs text-neutral-400 dark:text-neutral-500'>
                    Avg. Monthly Payout
                  </span>
                  <p className='mt-1 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white'>
                    $1,620
                  </p>
                  <span className='mt-1 flex items-center font-mono text-xs text-emerald-600 dark:text-emerald-400'>
                    +38% vs prev
                  </span>
                </div>

                <div className='rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900'>
                  <span className='font-mono text-xs text-neutral-400 dark:text-neutral-500'>
                    Conversion Rate
                  </span>
                  <p className='mt-1 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white'>
                    18.4%
                  </p>
                  <span className='mt-1 flex items-center font-mono text-xs text-neutral-500'>
                    Above average
                  </span>
                </div>
              </div>

              {/* Mini Bar Chart */}
              <div className='mt-6 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900'>
                <div className='flex items-center justify-between text-xs font-mono text-neutral-500'>
                  <span>Monthly Trajectory</span>
                  <span>Trailing 8 Months</span>
                </div>

                <div className='mt-6 flex h-36 items-end justify-between gap-2 pt-2'>
                  {chartMonths.map((col) => (
                    <div
                      key={col.month}
                      className='group flex flex-1 flex-col items-center gap-1.5'
                    >
                      <div className='relative flex h-28 w-full items-end justify-center rounded-sm bg-neutral-100 dark:bg-neutral-800'>
                        <div
                          className={`w-full rounded-sm bg-neutral-900 transition-all group-hover:bg-blue-600 dark:bg-neutral-100 dark:group-hover:bg-blue-400 ${col.height}`}
                        />
                      </div>
                      <span className='font-mono text-[10px] text-neutral-400 dark:text-neutral-500'>
                        {col.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='mt-4 flex items-center justify-between font-mono text-xs text-neutral-400 dark:text-neutral-500'>
                <span>Automated monthly payouts</span>
                <span>Direct wire &amp; Stripe</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Figure 01: Creator Studio Imagery */}
        <figure className='mt-16 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
          <img
            className='h-auto max-h-[520px] w-full object-cover'
            src='https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
            alt='Creator producing multimedia marketing campaigns with Genit'
          />
          <figcaption className='flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 px-5 py-3 font-mono text-xs text-neutral-500 dark:border-neutral-800'>
            <span>Figure 01: Creator studio &amp; multimedia campaign production</span>
            <span>Genit Creators Program</span>
          </figcaption>
        </figure>

        {/* Section 2: 3-Step Execution Pipeline */}
        <div className='mt-24 border-t border-neutral-200 pt-16 dark:border-neutral-800'>
          <div className='max-w-2xl'>
            <span className='font-mono text-xs tracking-widest text-neutral-500 uppercase'>
              01 // Workflow
            </span>
            <h2 className='mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white'>
              How the Creators Program works.
            </h2>
            <p className='mt-2 text-pretty text-sm leading-7 text-neutral-600 dark:text-neutral-400'>
              A streamlined, transparent partnership model built for content
              creators, educators, and industry consultants.
            </p>
          </div>

          <div className='mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-neutral-200 divide-y divide-neutral-200 md:grid-cols-3 md:divide-x md:divide-y-0 dark:border-neutral-800 dark:divide-neutral-800'>
            <div className='bg-white p-7 sm:p-8 dark:bg-neutral-950/60'>
              <div className='flex items-center justify-between font-mono text-xs text-neutral-400 dark:text-neutral-500'>
                <span>Step 01</span>
                <span className='uppercase'>Join</span>
              </div>
              <h3 className='mt-4 text-lg font-semibold text-neutral-950 dark:text-white'>
                Get Your Partner Link
              </h3>
              <p className='mt-2 text-pretty text-sm leading-7 text-neutral-600 dark:text-neutral-400'>
                Join in one click with your Genit account to unlock your unique
                tracking link and access the full creator media kit.
              </p>
            </div>

            <div className='bg-white p-7 sm:p-8 dark:bg-neutral-950/60'>
              <div className='flex items-center justify-between font-mono text-xs text-neutral-400 dark:text-neutral-500'>
                <span>Step 02</span>
                <span className='uppercase'>Share</span>
              </div>
              <h3 className='mt-4 text-lg font-semibold text-neutral-950 dark:text-white'>
                Share with Your Community
              </h3>
              <p className='mt-2 text-pretty text-sm leading-7 text-neutral-600 dark:text-neutral-400'>
                Publish tutorials, reviews, or social posts highlighting how
                autonomous AI marketing agents streamline execution.
              </p>
            </div>

            <div className='bg-white p-7 sm:p-8 dark:bg-neutral-950/60'>
              <div className='flex items-center justify-between font-mono text-xs text-neutral-400 dark:text-neutral-500'>
                <span>Step 03</span>
                <span className='uppercase'>Earn</span>
              </div>
              <h3 className='mt-4 text-lg font-semibold text-neutral-950 dark:text-white'>
                Earn Recurring Rewards
              </h3>
              <p className='mt-2 text-pretty text-sm leading-7 text-neutral-600 dark:text-neutral-400'>
                Receive 20% recurring commissions every month for as long as your
                referred subscribers maintain their plan.
              </p>
            </div>
          </div>
        </div>

        {/* Community & Growth Figure 02 */}
        <figure className='mt-16 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
          <img
            className='h-auto max-h-[460px] w-full object-cover'
            src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
            alt='Growth teams and creators collaborating with Genit'
          />
          <figcaption className='flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 px-5 py-3 font-mono text-xs text-neutral-500 dark:border-neutral-800'>
            <span>Figure 02: Sharing autonomous agent workflows with brand communities</span>
            <span>Ecosystem Growth</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
