"use client";

import { LanguageSelect } from "@/components/language-select";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import {
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Monitor,
  Moon,
  Phone,
  Sun,
  Twitter,
  Youtube,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";

export function LandingFooter() {
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  // For demo purposes - in a real app, this would be connected to your theme provider
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    // Show back-to-top button after scrolling down
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Set loaded state for animations
    setIsLoaded(true);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    setEmail("");
    // Show success message or toast notification
  };

  const currentYear = new Date().getFullYear();

  // Recent blog posts - would come from your CMS or API
  const recentPosts = [
    { title: "The Future of AI in Business", date: "Mar 10, 2026" },
    { title: "5 Ways to Improve Team Productivity", date: "Mar 5, 2026" },
    { title: "Understanding Web3 Technologies", date: "Feb 28, 2026" },
  ];

  return (
    <div className='relative z-10'>
      <section className='relative overflow-hidden rounded-t-4xl py-24 md:py-32'>
        <div className='absolute top-0 right-0 bottom-0 left-0 gap-x-8 gap-y-8'>
          <img
            src='https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/46172b3c-6c63-4bd0-97b0-09a0ca82b055_3840w.webp'
            alt=''
            className='h-full w-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70' />
        </div>
        <div className='container mx-auto px-6 md:px-12'>
          <div
            className='relative overflow-hidden rounded-[4rem] border border-(--color-foreground)/5 bg-(--color-primary)/5 p-12 text-center md:p-24'
            style={{ opacity: 1, transform: "none" }}
          >
            <div className='pointer-events-none absolute inset-0 opacity-[0.03] select-none'>
              <div className='grid h-full w-full grid-cols-12'>
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
                <div className='aspect-square border border-(--color-foreground)/10' />
              </div>
            </div>
            <div className='mx-auto max-w-3xl text-center'>
              <h2 className='mb-6 font-serif text-4xl leading-tight font-bold tracking-tight text-gray-200 sm:text-5xl lg:text-6xl'>
                {t("Ready? Set, Genit.")}
              </h2>
              <p className='mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray-400'>
                {t("Join a community of Creatives who have created")}
              </p>
              <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
                <Link
                  href='/signup'
                  className='hover:shadow-button shadow-primary/10 relative inline-flex h-10 items-center justify-center gap-0 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm outline-hidden backdrop-blur-[25px] transition-all duration-200 ease-in-out select-none hover:bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-700/90 focus-visible:ring-4 focus-visible:ring-cyan-500/30 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-30'
                >
                  {t("Start for $0")}
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={18}
                    height={18}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-arrow-right'
                  >
                    <path d='M5 12h14' />
                    <path d='m12 5 7 7-7 7' />
                  </svg>
                </Link>
                <Link
                  href='/contact'
                  className='ring-offset-background focus-visible:ring-ring inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-base font-medium whitespace-nowrap text-gray-400 transition-colors hover:text-gray-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'
                >
                  {t("Get in touch")}
                </Link>
              </div>
              <p className='mt-8 text-sm text-gray-400'>
                {t(
                  "No credit card required · Free plan available · Setup in minutes"
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className='relative min-h-[400px] overflow-hidden'>
        <div className='relative z-10 mx-auto px-4 py-16 md:px-12 lg:px-20 lg:py-20 xl:px-24'>
          <div className='flex flex-col justify-between gap-12 lg:flex-row lg:gap-24'>
            <div className='lg:max-w-sm'>
              <div className='flex flex-col'>
                <Link href='/' className='z-40 mb-1 flex items-center'>
                  <Logo className='h-12 w-12 flex-shrink-0' />
                  <span className='text-foreground text-xl font-semibold transition-colors duration-300'>
                    {t("Genit")}
                  </span>
                </Link>
                <p className='mb-1 w-full text-gray-400 md:max-w-[60vw] lg:max-w-60'>
                  {t(
                    "Autonomous AI marketing agents that work 24/7, so you don't have to."
                  )}
                </p>
                <div className='mt-8 mb-6 flex items-center gap-3'>
                  <a
                    href='https://www.linkedin.com/company/genit-ai/'
                    className='text-muted-foreground hover:text-foreground transition-colors'
                    aria-label='LinkedIn'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width={20}
                      height={20}
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-linkedin'
                    >
                      <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' />
                      <rect width={4} height={12} x={2} y={9} />
                      <circle cx={4} cy={4} r={2} />
                    </svg>
                  </a>
                  <a
                    href='https://x.com/genit_ai'
                    className='text-muted-foreground hover:text-foreground transition-colors'
                    aria-label='X'
                  >
                    <svg
                      width={20}
                      height={20}
                      viewBox='0 0 24 24'
                      fill='currentColor'
                    >
                      <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                    </svg>
                  </a>

                  <a
                    href='https://instagram.com/genitai'
                    className='text-muted-foreground hover:text-foreground transition-colors'
                    aria-label='Instagram'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width={20}
                      height={20}
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-instagram'
                    >
                      <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
                      <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
                      <line x1='17.5' x2='17.51' y1='6.5' y2='6.5' />
                    </svg>
                  </a>
                  <a
                    href='https://www.youtube.com/@genitai'
                    className='text-muted-foreground hover:text-foreground transition-colors'
                    aria-label='YouTube'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width={20}
                      height={20}
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-youtube'
                    >
                      <path d='M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17' />
                      <path d='m10 15 5-3-5-3z' />
                    </svg>
                  </a>
                </div>
              </div>

              <div className='mt-6 flex items-center justify-between gap-4 md:max-w-64'>
                <span className='text-muted-foreground text-sm font-medium'>
                  {t("Language")}
                </span>
                <LanguageSelect className='h-9' />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-16'>
              <div>
                <h4 className='text-foreground mb-4 font-semibold'>
                  {t("Company")}
                </h4>
                <ul className='flex flex-col space-y-3'>
                  <Link
                    href='/company'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {t("About")}
                  </Link>
                  <Link
                    href='/platform'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {t("Platform")}
                  </Link>
                  <Link
                    href='/creators-program'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {t("Creators Program")}
                  </Link>
                  <Link
                    href='/suggest'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {t("Feature Requests")}
                  </Link>
                  <Link
                    href='/contact'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {t("Contact")}
                  </Link>
                  <Link
                    href='/legal/privacy-policy'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {t("Privacy Policy")}
                  </Link>
                  <Link
                    href='/legal/terms-of-service'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {t("Terms of Service")}
                  </Link>
                  <Link
                    href='/contact'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {t("Support")}
                  </Link>
                </ul>
              </div>

              <div>
                <h4 className='text-foreground mb-4 font-semibold'>
                  {t("Platform Pages")}
                </h4>
                <ul className='flex flex-col space-y-3'>
                  <Link
                    href='/'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {t("Home")}
                  </Link>
                  <Link
                    href='/visuals'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {t("Visual Flow")}
                  </Link>
                  <Link
                    href='/chat'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {t("AI Chat")}
                  </Link>
                  <Link
                    href='/pricing'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {t("Pricing")}
                  </Link>
                  <Link
                    href='/plugins'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {t("Plugins")}
                  </Link>
                  <Link
                    href='/templates'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {t("Templates")}
                  </Link>
                  <Link
                    href='/inspirations'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {t("Inspirations")}
                  </Link>
                  <Link
                    href='/chat/history'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {t("Chat History")}
                  </Link>
                </ul>
              </div>
              <div>
                <h4 className='text-foreground mb-4 font-semibold'>
                  {t("Use cases")}
                </h4>
                <ul className='space-y-3'>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/chat'
                    >
                      {t("Graphic Design")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/apps/video-generation?mode=ai-video-gen'
                    >
                      {t("AI Video Creation")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/visuals/inbox'
                    >
                      {t("Unified Inbox")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/chat'
                    >
                      {t("AI Chat Agents")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/platform'
                    >
                      {t("Team & Organization Management")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/plugins'
                    >
                      {t("1,000+ External Apps & Plugins")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/visuals/automation'
                    >
                      {t("Marketing Automation")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/visuals/campaigns'
                    >
                      {t("Ad Campaigns")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/visuals/calendar'
                    >
                      {t("Content Calendar")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/visuals/posts'
                    >
                      {t("Social Publishing")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/visuals/library'
                    >
                      {t("Digital Asset Library")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className='text-foreground mb-4 font-semibold'>
                  {t("Learn More")}
                </h4>
                <ul className='space-y-3'>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/docs'
                    >
                      {t("Documentation")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/blog'
                    >
                      {t("Blog")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/templates'
                    >
                      {t("Templates")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/inspirations'
                    >
                      {t("Inspiration Gallery")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/creators-program'
                    >
                      {t("Creator Resources")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/suggest'
                    >
                      {t("Suggest a Feature")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                      href='/plugin/removal-instructions'
                    >
                      {t("Plugin Help & Data Removal")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='border-border mt-10 flex flex-col items-start justify-between border-t pt-4 lg:flex-row lg:items-center'>
            <div className='flex items-center gap-2 py-2'>
              <span className='text-muted-foreground text-sm font-medium'>
                {t("Theme")}
              </span>

              <div className='bg-muted/60 border-border flex items-center rounded-full border p-1'>
                <button
                  onClick={() => setTheme("light")}
                  className={`flex size-7 items-center justify-center rounded-full transition-all ${isLoaded && theme === "light" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"} `}
                  title={t("Light mode")}
                >
                  <Sun className='h-3.5 w-3.5' />
                </button>

                <button
                  onClick={() => setTheme("dark")}
                  className={`flex size-7 items-center justify-center rounded-full transition-all ${isLoaded && theme === "dark" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"} `}
                  title={t("Dark mode")}
                >
                  <Moon className='h-3.5 w-3.5' />
                </button>

                <button
                  onClick={() => setTheme("system")}
                  className={`flex size-7 items-center justify-center rounded-full transition-all ${isLoaded && theme === "system" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"} `}
                  title={t("System theme")}
                >
                  <Monitor className='h-3.5 w-3.5' />
                </button>
              </div>
            </div>

            <p className='text-muted-foreground text-sm'>
              ©{currentYear},{" "}
              <span className='text-foreground ml-1 font-medium'>
                {t("genit")}
              </span>{" "}
              {t("All Rights Reserved.")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
