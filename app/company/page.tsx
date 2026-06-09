import { HoverVideoPlayer } from "@/components/features/hover-video-player";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Award,
  Briefcase,
  ChevronRight,
  Clock,
  Globe,
  Layers,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About genit – Your AI Marketing Team & Agent Platform",
  description:
    "genit is an AI agent platform that helps businesses manage and grow their brand from a single workspace, executing marketing tasks end-to-end.",
  keywords: [
    "about genit",
    "company",
    "mission",
    "vision",
    "AI marketing platform",
    "AI agents marketing",
    "brand management workspace",
    "marketing automation",
    "team",
  ],
  openGraph: {
    title: "About genit – Your AI Marketing Team & Agent Platform",
    description:
      "Connect your website and let genit's AI marketing agents create content, plan calendars, and execute growth activities at scale.",
    url: "https://www.trygenit.com/company",
    type: "website",
    images: [
      {
        url: "https://www.trygenit.com/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Genit AI Agent Platform",
      },
    ],
  },
};

export default function About2() {
  return (
    <div className='bg-white dark:bg-black'>
      <LandingNavbar />

      <>
        <div className='mx-auto my-20 max-w-3xl px-4 pt-6 pb-12 sm:px-6 lg:px-8 lg:pt-10'>
          <div className='max-w-2xl'>
            {/* Avatar Media */}

            {/* End Avatar Media */}
            {/* Content */}
            <div className='space-y-5 md:space-y-8'>
              <div className='space-y-3'>
                <h1 className='text-2xl font-bold tracking-tight md:text-4xl lg:text-6xl'>
                  AI Agent{" "}
                  <span className='from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent'>
                    Marketing Platform
                  </span>
                </h1>
                <p className='text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                  At genit, our mission is to give every business its own AI marketing team that can help plan, create, and execute growth activities at scale. genit is an AI agent platform that helps businesses manage and grow their brand from a single workspace. Businesses can connect their website, and genit learns about their products, audience, brand voice, and goals. From there, AI agents can create content, design marketing assets, plan content calendars, schedule and publish posts, send emails, generate insights, and automate marketing workflows across multiple platforms.
                </p>
              </div>
              <p className='text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                Unlike traditional AI tools that only generate content, genit is designed to take action. It combines AI agents with 25+ integrations to help businesses execute marketing tasks end-to-end, reducing the need to switch between multiple tools or hire large marketing teams.
              </p>
              <figure>
                <img
                  className='w-full rounded-xl object-cover'
                  src='https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80'
                  alt='Blog Image'
                />
                <figcaption className='mt-3 text-center text-sm text-gray-500 dark:text-neutral-500'>
                  AI agents executing end-to-end marketing activities from a single workspace.
                </figcaption>
              </figure>
              <p className='text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                As businesses adopt genit, they experience the power of having a full-scale marketing execution engine operating 24/7. Whether it is planning campaigns, scheduling social posts, designing brand-consistent assets, or generating deep analytics, our platform takes the busywork out of growth so that teams can focus on strategic decisions rather than administrative friction.
              </p>
              <p className='text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                That's why we are excited to offer{" "}
                <a
                  className='font-medium text-blue-600 decoration-2 hover:underline focus:underline focus:outline-hidden dark:text-blue-500'
                  href='/pricing'
                >
                  our free Basic plan
                </a>
                , which allows startups, small business owners, and creators to connect their website, onboard their brand voice, and let AI agents start automating their first marketing activities without upfront investment.
              </p>
              <blockquote className='p-4 text-center sm:px-7'>
                <p className='text-xl font-medium text-gray-800 md:text-2xl md:leading-normal xl:text-2xl xl:leading-normal dark:text-neutral-200'>
                  To say that switching to genit has been life-changing is an
                  understatement. Our marketing execution rate has tripled, and
                  the AI agents handle everything from social media scheduling
                  to automated email outreach based on our brand voice.
                </p>
                <p className='mt-5 text-gray-800 dark:text-neutral-200'>
                  Sarah Chen, Marketing Director
                </p>
              </blockquote>
              <figure>
                <img
                  className='w-full rounded-xl object-cover'
                  src='https://images.unsplash.com/photo-1670272498380-eb330b61f3cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80'
                  alt='Blog Image'
                />
                <figcaption className='mt-3 text-center text-sm text-gray-500 dark:text-neutral-500'>
                  AI agents and marketing integrations automating brand workflows.
                </figcaption>
              </figure>
              <div className='space-y-3'>
                <h3 className='text-2xl font-semibold dark:text-white'>
                  Bringing an AI marketing team to every business
                </h3>
                <p className='text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                  We believe that professional marketing should not be restricted by budget or size. Our platform makes advanced execution tools available to everyone. From small teams to large enterprises, genit provides a collaborative workspace where AI agents integrate seamlessly with your brand assets, messaging, and 23+ daily tools.
                </p>
              </div>
              <ul className='list-outside list-disc space-y-5 ps-5 text-lg text-gray-800 dark:text-neutral-200'>
                <li className='ps-2'>
                  genit allows us to run multi-channel campaigns in real-time, staying perfectly consistent with our brand voice while publishing high-quality assets and emails,"{" "}
                  <a
                    className='font-medium text-blue-600 decoration-2 hover:underline focus:underline focus:outline-hidden dark:text-blue-500'
                    href='#'
                  >
                    said
                  </a>{" "}
                  Alex Rodriguez, Creative Director at TechStart.
                </li>
                <li className='ps-2'>
                  genit redefined how we manage our growth. It is an intuitive workspace where anyone can launch automated marketing flows with zero complexity," said Maria Santos, Marketing Manager at{" "}
                  <a
                    className='font-medium text-blue-600 decoration-2 hover:underline focus:underline focus:outline-hidden dark:text-blue-500'
                    href='#'
                  >
                    BrandCo
                  </a>
                  .
                </li>
              </ul>
              <p className='text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                Small teams and individual creators need tools where they can launch campaigns quickly, both for themselves and for the clients they support. genit allows you to collaborate seamlessly, creating a centralized workspace for brand-consistent marketing assets, automated scheduling, and email dispatch. As your business grows, genit scales your marketing execution alongside it.
              </p>
              <div>
                <a
                  className='m-1 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:outline-hidden dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                  href='#'
                >
                  AI Agents
                </a>
                <a
                  className='m-1 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:outline-hidden dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                  href='#'
                >
                  Marketing Automation
                </a>
                <a
                  className='m-1 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:outline-hidden dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                  href='#'
                >
                  Brand Workspace
                </a>
                <a
                  className='m-1 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:outline-hidden dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                  href='#'
                >
                  Integrations
                </a>
                <a
                  className='m-1 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:outline-hidden dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                  href='#'
                >
                  Free Plan
                </a>
              </div>
            </div>
            {/* End Content */}
          </div>
        </div>
      </>

      <LandingFooter />
    </div>
  );
}
