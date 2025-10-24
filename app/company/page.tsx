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
                  AI‑Powered{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Design
                  </span>
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
                  At Gennit, our mission has always been focused on making
                  professional graphic design accessible to everyone. We've
                  always believed that by providing AI-powered tools that
                  understand your brand and vision, we can empower creators,
                  marketers, and businesses to produce stunning visuals without
                  the complexity of traditional design software.
                </p>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
                We're proud to be part of democratizing design and continue
                building a platform that makes professional graphics accessible
                to everyone, regardless of their design experience.
              </p>
              <figure>
                <img
                  className="w-full object-cover rounded-xl"
                  src="https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80"
                  alt="Blog Image"
                />
                <figcaption className="mt-3 text-sm text-center text-gray-500 dark:text-neutral-500">
                  AI-powered design tools in action.
                </figcaption>
              </figure>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
                As we've grown, we've seen how Gennit has helped businesses such
                as startups, marketing agencies, e-commerce brands, and content
                creators produce professional graphics at scale. We've learned
                that when design tools are intuitive and AI-powered, teams can
                focus on creativity and strategy rather than technical barriers.
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
                access professional design tools and create stunning graphics
                without any upfront investment.
              </p>
              <blockquote className="text-center p-4 sm:px-7">
                <p className="text-xl font-medium text-gray-800 md:text-2xl md:leading-normal xl:text-2xl xl:leading-normal dark:text-neutral-200">
                  To say that switching to Gennit has been life-changing is an
                  understatement. My design output has tripled and I can focus
                  on strategy instead of technical design work.
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
                  Teams collaborating on AI-generated designs.
                </figcaption>
              </figure>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold dark:text-white">
                  Bringing professional design to everyone
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
                  We know the power of great design is real, and we want to
                  create an opportunity for everyone to access professional
                  design tools and explore how transformative AI-powered design
                  can be. Now you can have a team of any size create stunning
                  graphics with smart templates, brand kits, and AI assistance
                  that understands your vision.
                </p>
              </div>
              <ul className="list-disc list-outside space-y-5 ps-5 text-lg text-gray-800 dark:text-neutral-200">
                <li className="ps-2">
                  Gennit allows us to create professional graphics in real time
                  and is a really great way for our marketing team to stay
                  consistent with brand guidelines while producing high-quality
                  visuals,"{" "}
                  <a
                    className="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500"
                    href="#"
                  >
                    said
                  </a>{" "}
                  Alex Rodriguez, Creative Director at TechStart.
                </li>
                <li className="ps-2">
                  Gennit opened a new way of designing. It's an intuitive way
                  for everyone to create and iterate on designs without
                  technical barriers," said Maria Santos, Marketing Manager at{" "}
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
                create professional graphics quickly, both for themselves and
                for the people they work with – no matter if it's a fellow
                marketer, product manager, developer or client. Gennit allows
                you to collaborate seamlessly, creating a central place for
                brand-consistent design. As those teams grow, consistency and
                efficiency becomes integrated in how they communicate and work
                together.
              </p>
              <div>
                <a
                  className="m-1 inline-flex items-center gap-1.5 py-2 px-3 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                  href="#"
                >
                  AI Design
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
                  Free
                </a>
                <a
                  className="m-1 inline-flex items-center gap-1.5 py-2 px-3 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                  href="#"
                >
                  Templates
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
