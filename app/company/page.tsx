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
  title: "About Gennit – AI Media Design Company",
  description:
    "Learn about Gennit AI, the company revolutionizing media design with AI-powered solutions. Our mission is to democratize professional design for everyone.",
  keywords: [
    "about gennit",
    "company",
    "mission",
    "vision",
    "AI media design company",
    "team",
    "media creation tools",
  ],
  openGraph: {
    title: "About Gennit – AI Media Design Company",
    description:
      "Discover Gennit's mission to revolutionize media design through AI-powered solutions.",
    url: "https://www.gennit.online/company",
    type: "website",
    images: [
      {
        url: "https://www.gennit.online/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Gennit AI Company",
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
                  AI Media{" "}
                  <span className='from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent'>
                    Design Company
                  </span>
                </h1>
                <p className='text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                  At Gennit, our mission is to revolutionize media design
                  through AI-powered solutions. We specialize in creating
                  intelligent design tools that generate stunning graphics,
                  videos, animations, and multimedia content. Our AI understands
                  your brand, vision, and creative goals to empower creators,
                  marketers, agencies, and businesses to produce professional
                  media content at scale without traditional design complexity.
                </p>
              </div>
              <p className='text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                We're proud to be at the forefront of AI-powered media creation,
                democratizing professional design across all media formats. Our
                platform makes advanced media design accessible to everyone,
                regardless of their technical expertise or creative background.
              </p>
              <figure>
                <img
                  className='w-full rounded-xl object-cover'
                  src='https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80'
                  alt='Blog Image'
                />
                <figcaption className='mt-3 text-center text-sm text-gray-500 dark:text-neutral-500'>
                  AI-powered media design tools creating graphics, videos, and
                  animations.
                </figcaption>
              </figure>
              <p className='text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                As we've grown, we've seen how Gennit has helped businesses such
                as startups, marketing agencies, e-commerce brands, content
                creators, and media companies produce professional graphics,
                videos, animations, and multimedia content at scale. We've
                learned that when media design tools are intuitive and
                AI-powered, teams can focus on creativity and strategy rather
                than technical barriers.
              </p>
              <p className='text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                That's why we are excited to offer{" "}
                <a
                  className='font-medium text-blue-600 decoration-2 hover:underline focus:underline focus:outline-hidden dark:text-blue-500'
                  href='/pricing'
                >
                  our free Basic plan
                </a>
                , which allows individual creators, startups, and small teams to
                access professional AI media design tools and create stunning
                graphics, videos, and animations without any upfront investment.
              </p>
              <blockquote className='p-4 text-center sm:px-7'>
                <p className='text-xl font-medium text-gray-800 md:text-2xl md:leading-normal xl:text-2xl xl:leading-normal dark:text-neutral-200'>
                  To say that switching to Gennit has been life-changing is an
                  understatement. My media production output has tripled and I
                  can focus on strategy instead of technical design work. The AI
                  handles everything from graphics to video creation.
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
                  Teams collaborating on AI-generated media content across
                  multiple formats.
                </figcaption>
              </figure>
              <div className='space-y-3'>
                <h3 className='text-2xl font-semibold dark:text-white'>
                  Bringing professional media design to everyone
                </h3>
                <p className='text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                  We know the power of great media design is real, and we want
                  to create an opportunity for everyone to access professional
                  AI-powered media creation tools. Our platform enables teams of
                  any size to create stunning graphics, videos, animations, and
                  multimedia content with smart templates, brand kits, and AI
                  assistance that understands your vision across all media
                  formats.
                </p>
              </div>
              <ul className='list-outside list-disc space-y-5 ps-5 text-lg text-gray-800 dark:text-neutral-200'>
                <li className='ps-2'>
                  Gennit allows us to create professional media content in real
                  time and is a really great way for our marketing team to stay
                  consistent with brand guidelines while producing high-quality
                  graphics, videos, and animations,"{" "}
                  <a
                    className='font-medium text-blue-600 decoration-2 hover:underline focus:underline focus:outline-hidden dark:text-blue-500'
                    href='#'
                  >
                    said
                  </a>{" "}
                  Alex Rodriguez, Creative Director at TechStart.
                </li>
                <li className='ps-2'>
                  Gennit opened a new way of media creation. It's an intuitive
                  way for everyone to create and iterate on designs, videos, and
                  animations without technical barriers," said Maria Santos,
                  Marketing Manager at{" "}
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
                Small teams and individual creators need tools where they can
                create professional media content quickly, both for themselves
                and for the people they work with – no matter if it's a fellow
                marketer, product manager, developer or client. Gennit allows
                you to collaborate seamlessly, creating a central place for
                brand-consistent media design across graphics, videos, and
                animations. As those teams grow, consistency and efficiency
                becomes integrated in how they communicate and work together.
              </p>
              <div>
                <a
                  className='m-1 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:outline-hidden dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                  href='#'
                >
                  AI Media Design
                </a>
                <a
                  className='m-1 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:outline-hidden dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                  href='#'
                >
                  Video Creation
                </a>
                <a
                  className='m-1 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:outline-hidden dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                  href='#'
                >
                  Brand Kits
                </a>
                <a
                  className='m-1 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:outline-hidden dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                  href='#'
                >
                  Animations
                </a>
                <a
                  className='m-1 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:outline-hidden dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                  href='#'
                >
                  Free
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
