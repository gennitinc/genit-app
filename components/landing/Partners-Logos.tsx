"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, CheckCircle, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const logos = [
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        width="48"
        height="48"
        className="transition-all duration-300 group-hover:scale-110 dark:invert"
      >
        <path fill="#000000" d="M0 0h256v256H0z" />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="25"
          strokeLinecap="round"
          d="M208 128l-80 80M192 40L40 192"
        />
      </svg>
    ),
    name: "shadcn/ui",
    alt: "shadcn/ui Logo",
    url: "https://ui.shadcn.com",
    description: "UI Components",
  },
  {
    svg: (
      <svg
        viewBox="0 0 109 113"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        className="transition-all duration-300 group-hover:scale-110"
      >
        <path
          d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
          fill="url(#paint0_linear)"
        />
        <path
          d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
          fill="url(#paint1_linear)"
          fillOpacity="0.2"
        />
        <path
          d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
          fill="#3ECF8E"
        />
        <defs>
          <linearGradient
            id="paint0_linear"
            x1="53.9738"
            y1="54.974"
            x2="94.1635"
            y2="71.8295"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#249361" />
            <stop offset="1" stopColor="#3ECF8E" />
          </linearGradient>
          <linearGradient
            id="paint1_linear"
            x1="36.1558"
            y1="30.578"
            x2="54.4844"
            y2="65.0806"
            gradientUnits="userSpaceOnUse"
          >
            <stop />
            <stop offset="1" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    ),
    name: "Supabase",
    alt: "Supabase Logo",
    url: "https://supabase.com",
    description: "Backend Platform",
  },
  {
    svg: (
      <svg
        viewBox="0 0 256 222"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
        height="48"
        width="48"
        className="transition-all duration-300 group-hover:scale-110 dark:invert"
      >
        <path fill="#000000" d="m128 0 128 221.705H0z" />
      </svg>
    ),
    name: "Vercel",
    alt: "Vercel Logo",
    url: "https://vercel.com",
    description: "Deployment",
  },
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 54 33"
        height="48"
        width="48"
        className="transition-all duration-300 group-hover:scale-110"
      >
        <g clipPath="url(#a)">
          <path
            fill="#38bdf8"
            fillRule="evenodd"
            d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
            clipRule="evenodd"
          />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h54v32.4H0z" />
          </clipPath>
        </defs>
      </svg>
    ),
    name: "Tailwind CSS",
    alt: "Tailwind CSS Logo",
    url: "https://tailwindcss.com",
    description: "CSS Framework",
  },
  {
    svg: (
      <svg
        height="48"
        width="48"
        className="transition-all duration-300 group-hover:scale-110"
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_408_139"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={180}
          height={180}
        >
          <circle cx={90} cy={90} r={90} fill="black" />
        </mask>
        <g mask="url(#mask0_408_139)">
          <circle
            cx={90}
            cy={90}
            r={87}
            fill="black"
            stroke="white"
            strokeWidth={6}
          />
          <path
            d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
            fill="url(#paint0_linear_408_139)"
          />
          <rect
            x={115}
            y={54}
            width={12}
            height={72}
            fill="url(#paint1_linear_408_139)"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_408_139"
            x1={109}
            y1="116.5"
            x2="144.5"
            y2="160.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset={1} stopColor="white" stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id="paint1_linear_408_139"
            x1={121}
            y1={54}
            x2="120.799"
            y2="106.875"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset={1} stopColor="white" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
    ),
    name: "Next.js",
    alt: "Next.js Logo",
    url: "https://nextjs.org",
    description: "React Framework",
  },
  {
    svg: (
      <svg
        height="48"
        width="48"
        className="transition-all duration-300 group-hover:scale-110"
        viewBox="0 0 54 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_912_3)">
          <path
            d="M13.3333 80.0002C20.6933 80.0002 26.6667 74.0268 26.6667 66.6668V53.3335H13.3333C5.97333 53.3335 0 59.3068 0 66.6668C0 74.0268 5.97333 80.0002 13.3333 80.0002Z"
            fill="#0ACF83"
          />
          <path
            d="M0 39.9998C0 32.6398 5.97333 26.6665 13.3333 26.6665H26.6667V53.3332H13.3333C5.97333 53.3332 0 47.3598 0 39.9998Z"
            fill="#A259FF"
          />
          <path
            d="M0 13.3333C0 5.97333 5.97333 0 13.3333 0H26.6667V26.6667H13.3333C5.97333 26.6667 0 20.6933 0 13.3333Z"
            fill="#F24E1E"
          />
          <path
            d="M26.6667 0H40.0001C47.3601 0 53.3334 5.97333 53.3334 13.3333C53.3334 20.6933 47.3601 26.6667 40.0001 26.6667H26.6667V0Z"
            fill="#FF7262"
          />
          <path
            d="M53.3334 39.9998C53.3334 47.3598 47.3601 53.3332 40.0001 53.3332C32.6401 53.3332 26.6667 47.3598 26.6667 39.9998C26.6667 32.6398 32.6401 26.6665 40.0001 26.6665C47.3601 26.6665 53.3334 32.6398 53.3334 39.9998Z"
            fill="#1ABCFE"
          />
        </g>
        <defs>
          <clipPath id="clip0_912_3">
            <rect width="53.3333" height="80" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    name: "Figma",
    alt: "Figma Logo",
    url: "https://figma.com",
    description: "Design Tool",
  },
];

export default function PartnerLogos() {
  return (
    <section className="px-4 py-16 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid overflow-hidden rounded-xl border border-muted shadow-lg lg:grid-cols-2">
          <div className="flex items-center px-6 py-12 md:px-8 lg:p-16">
            <div className="w-full max-w-lg">
              <Badge className="mb-6 inline-flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                <Globe className="h-4 w-4" />
                Strategic Partnerships
              </Badge>
              <h2 className="mb-6 text-3xl font-bold tracking-tight lg:text-4xl">
                Powered by industry-leading technologies
              </h2>
              <p className="mb-8 text-base text-normal text-muted-foreground">
                We collaborate with the most innovative companies in tech to
                deliver cutting-edge solutions that keep you ahead of the
                competition. Our strategic partnerships ensure you get the best
                tools for your needs.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button className="group flex items-center transition-all duration-300 hover:pr-4 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                  Become a partner
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  className="group flex items-center gap-2"
                >
                  <CheckCircle className="size-4" />
                  View case studies
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 border-t lg:grid-cols-3 lg:border-l lg:border-t-0">
            {logos.map((logo, index) => (
              <a
                key={index}
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center gap-3 border-b border-r p-8 transition-all hover:bg-muted/30"
              >
                <div className="relative flex h-16 w-full items-center justify-center">
                  {logo.svg}
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-base font-semibold text-foreground">
                    {logo.name}
                  </span>
                  <span className="text-sm text-muted-foreground transition-colors group-hover:text-primary">
                    {logo.description}
                  </span>
                </div>
                <div className="mt-1 flex items-center text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  <span>Learn more</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
