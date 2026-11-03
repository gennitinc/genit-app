"use client";

import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthenticatedContext";
import Loading from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  const steps = [
    {
      title: "Join with your Genit account",
      description:
        "You get a personal referral link and a dashboard showing sign-ups and earnings.",
    },
    {
      title: "Share Genit honestly",
      description:
        "Tutorials, reviews, or a mention to your clients. Show what you actually use it for.",
    },
    {
      title: "Earn on paid plans",
      description:
        "You earn a 20% commission every month that someone you referred stays on a paid plan.",
    },
  ];

  return (
    <div className='w-full'>
      <div className='mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24'>
        <div className='max-w-3xl space-y-6'>
          <Heading className='text-3xl font-bold tracking-tight text-neutral-950 sm:text-5xl dark:text-white'>
            Genit Creators Program
          </Heading>

          <p className='text-base leading-8 text-pretty text-neutral-600 sm:text-lg dark:text-neutral-400'>
            If you make content for founders, marketers, or small businesses, or
            you recommend tools to clients, you can earn a recurring share of
            the subscriptions you refer.
          </p>

          <div className='flex flex-wrap items-center gap-4 pt-2'>
            <Button
              onClick={handleJoinReferralProgram}
              disabled={joining}
              className='h-12 rounded-full bg-neutral-950 px-7 font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-950'
              size='lg'
            >
              {joining ? (
                <div className='flex items-center gap-2'>
                  <Loading size={18} />
                  <span>Joining...</span>
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <span>Join the program</span>
                  <ArrowRight className='size-4' />
                </div>
              )}
            </Button>

            <Link
              href='/legal/terms-of-service'
              className='inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
            >
              <span>Read the terms</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        <figure className='mt-16 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
          <img
            className='h-auto max-h-[520px] w-full object-cover'
            src='https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
            alt='Creator filming content in a studio'
          />
        </figure>

        <div className='mt-20 border-t border-neutral-200 pt-14 dark:border-neutral-800'>
          <h2 className='text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white'>
            How it works
          </h2>

          <ol className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-3'>
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className='flex size-7 items-center justify-center rounded-full border border-neutral-300 text-xs font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-300'>
                  {index + 1}
                </span>
                <h3 className='mt-4 font-semibold text-neutral-950 dark:text-white'>
                  {step.title}
                </h3>
                <p className='mt-2 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <figure className='mt-16 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
          <img
            className='h-auto max-h-[460px] w-full object-cover'
            src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
            alt='Group of people collaborating around a laptop'
          />
        </figure>

        <div className='mt-20 border-t border-neutral-200 pt-14 dark:border-neutral-800'>
          <h2 className='text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white'>
            Who it&apos;s for
          </h2>
          <ul className='mt-6 space-y-3 text-sm leading-7 text-neutral-700 dark:text-neutral-300'>
            <li className='border-l border-neutral-300 ps-4 dark:border-neutral-700'>
              YouTubers, newsletter writers, and educators who cover marketing
              or AI tools
            </li>
            <li className='border-l border-neutral-300 ps-4 dark:border-neutral-700'>
              Agencies and freelancers who set up tools for clients
            </li>
            <li className='border-l border-neutral-300 ps-4 dark:border-neutral-700'>
              Existing Genit users who want to recommend it to people they know
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
