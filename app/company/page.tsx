import Image from "next/image";
import {
  ArrowUpRight,
  Users,
  Briefcase,
  Zap,
  Trophy,
  Layers,
  Target,
  Clock,
  Globe,
  Award,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { HoverVideoPlayer } from "@/components/features/hover-video-player";

export default function About2() {
  return (
    <div className="dark:bg-black bg-white">
      <LandingNavbar />

      <>
        <div className="max-w-3xl px-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8 mx-auto my-20">
          <div className="max-w-2xl">
            {/* Avatar Media */}

            {/* End Avatar Media */}
            {/* Content */}
            <div className="space-y-5 md:space-y-8">
              <div className="space-y-3">
                <h1 className="text-2xl font-bold tracking-tight md:text-4xl lg:text-6xl">
                  AI Media{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Design Company
                  </span>
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
                  At Gennit, our mission is to revolutionize media design
                  through AI-powered solutions. We specialize in creating
                  intelligent design tools that generate stunning graphics,
                  videos, animations, and multimedia content. Our AI understands
                  your brand, vision, and creative goals to empower creators,
                  marketers, agencies, and businesses to produce professional
                  media content at scale without traditional design complexity.
                </p>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
                We're proud to be at the forefront of AI-powered media creation,
                democratizing professional design across all media formats. Our
                platform makes advanced media design accessible to everyone,
                regardless of their technical expertise or creative background.
              </p>
              <figure>
                <img
                  className="w-full object-cover rounded-xl"
                  src="https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80"
                  alt="Blog Image"
                />
                <figcaption className="mt-3 text-sm text-center text-gray-500 dark:text-neutral-500">
                  AI-powered media design tools creating graphics, videos, and
                  animations.
                </figcaption>
              </figure>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
                As we've grown, we've seen how Gennit has helped businesses such
                as startups, marketing agencies, e-commerce brands, content
                creators, and media companies produce professional graphics,
                videos, animations, and multimedia content at scale. We've
                learned that when media design tools are intuitive and
                AI-powered, teams can focus on creativity and strategy rather
                than technical barriers.
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
                That's why we are excited to offer{" "}
                <a
                  className="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500"
                  href="/pricing"
                >
                  our free Basic plan
                </a>
                , which allows individual creators, startups, and small teams to
                access professional AI media design tools and create stunning
                graphics, videos, and animations without any upfront investment.
              </p>
              <blockquote className="text-center p-4 sm:px-7">
                <p className="text-xl font-medium text-gray-800 md:text-2xl md:leading-normal xl:text-2xl xl:leading-normal dark:text-neutral-200">
                  To say that switching to Gennit has been life-changing is an
                  understatement. My media production output has tripled and I
                  can focus on strategy instead of technical design work. The AI
                  handles everything from graphics to video creation.
                </p>
                <p className="mt-5 text-gray-800 dark:text-neutral-200">
                  Sarah Chen, Marketing Director
                </p>
              </blockquote>
              <figure>
                <img
                  className="w-full object-cover rounded-xl"
                  src="https://images.unsplash.com/photo-1670272498380-eb330b61f3cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80"
                  alt="Blog Image"
                />
                <figcaption className="mt-3 text-sm text-center text-gray-500 dark:text-neutral-500">
                  Teams collaborating on AI-generated media content across
                  multiple formats.
                </figcaption>
              </figure>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold dark:text-white">
                  Bringing professional media design to everyone
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
                  We know the power of great media design is real, and we want
                  to create an opportunity for everyone to access professional
                  AI-powered media creation tools. Our platform enables teams of
                  any size to create stunning graphics, videos, animations, and
                  multimedia content with smart templates, brand kits, and AI
                  assistance that understands your vision across all media
                  formats.
                </p>
              </div>
              <ul className="list-disc list-outside space-y-5 ps-5 text-lg text-gray-800 dark:text-neutral-200">
                <li className="ps-2">
                  Gennit allows us to create professional media content in real
                  time and is a really great way for our marketing team to stay
                  consistent with brand guidelines while producing high-quality
                  graphics, videos, and animations,"{" "}
                  <a
                    className="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500"
                    href="#"
                  >
                    said
                  </a>{" "}
                  Alex Rodriguez, Creative Director at TechStart.
                </li>
                <li className="ps-2">
                  Gennit opened a new way of media creation. It's an intuitive
                  way for everyone to create and iterate on designs, videos, and
                  animations without technical barriers," said Maria Santos,
                  Marketing Manager at{" "}
                  <a
                    className="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500"
                    href="#"
                  >
                    BrandCo
                  </a>
                  .
                </li>
              </ul>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
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
                  className="m-1 inline-flex items-center gap-1.5 py-2 px-3 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                  href="#"
                >
                  AI Media Design
                </a>
                <a
                  className="m-1 inline-flex items-center gap-1.5 py-2 px-3 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                  href="#"
                >
                  Video Creation
                </a>
                <a
                  className="m-1 inline-flex items-center gap-1.5 py-2 px-3 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                  href="#"
                >
                  Brand Kits
                </a>
                <a
                  className="m-1 inline-flex items-center gap-1.5 py-2 px-3 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                  href="#"
                >
                  Animations
                </a>
                <a
                  className="m-1 inline-flex items-center gap-1.5 py-2 px-3 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                  href="#"
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
