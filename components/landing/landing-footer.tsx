"use client";

import type React from "react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ArrowUp,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Moon,
  Phone,
  Sun,
  Twitter,
  Youtube,
  Github,
  Globe,
  ChevronRight,
  Monitor,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export function LandingFooter() {
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme, setTheme } = useTheme();
  const [selected, setSelected] = useState("en");

  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "es", label: "Spanish", flag: "🇪🇸" },
    { code: "fr", label: "French", flag: "🇫🇷" },
  ];

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
    console.log("Subscribed with:", email);
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
    <div className="relative z-10">
      <section className="py-24 md:py-32 overflow-hidden relative rounded-t-4xl">
        <div className="absolute top-0 right-0 bottom-0 left-0 gap-x-8 gap-y-8">
          <img
            src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/46172b3c-6c63-4bd0-97b0-09a0ca82b055_3840w.webp"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />
        </div>
        <div className="container mx-auto px-6 md:px-12">
          <div
            className="relative rounded-[4rem] bg-(--color-primary)/5 border border-(--color-foreground)/5 p-12 md:p-24 overflow-hidden text-center"
            style={{ opacity: 1, transform: "none" }}
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
              <div className="grid grid-cols-12 h-full w-full">
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
                <div className="border border-(--color-foreground)/10 aspect-square" />
              </div>
            </div>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-200 tracking-tight mb-6 leading-tight">
                Idea to Design in Seconds
              </h2>
              <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
                Join a community of Creatives who have created
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="outline-hidden text-white relative inline-flex items-center justify-center select-none rounded-2xl disabled:cursor-not-allowed ease-in-out border-[2px] border-cyan-500/20 backdrop-blur-[25px] bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl shadow-sm shadow-cyan-500/10 hover:shadow-button transition-all duration-200 disabled:opacity-30 focus-visible:ring-4 focus-visible:ring-cyan-500/30 focus-visible:outline-hidden text-sm h-10 gap-0 px-4 font-semibold"
                >
                  Start for $0
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-right"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-gray-400 hover:text-gray-100 rounded-full px-8 h-12 text-base"
                >
                  Get in touch
                </Link>
              </div>
              <p className="mt-8 text-sm text-gray-400">
                No credit card required · Free plan available · Setup in minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden min-h-[400px]">
        <div className=" mx-auto px-4 md:px-12 lg:px-20 xl:px-24 py-16 lg:py-20 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24">
            <div className="lg:max-w-sm">
              <div className="flex flex-col">
                <Link href="/" className="flex items-center z-40 mb-1">
                  <Logo className="w-12 h-12 flex-shrink-0" />
                  <span className="text-xl font-semibold transition-colors duration-300 text-foreground">
                    Gennit
                  </span>
                </Link>
                <p className="text-gray-400 w-full md:max-w-[60vw] lg:max-w-60 mb-1">
                  Brand tailored media just got easier and faster
                </p>
                <div className="flex items-center gap-3 mb-6 mt-8">
                  <a
                    href="https://www.linkedin.com/company/gennit-ai/"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-linkedin"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width={4} height={12} x={2} y={9} />
                      <circle cx={4} cy={4} r={2} />
                    </svg>
                  </a>
                  <a
                    href="https://x.com/gennit_ai"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="X"
                  >
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  <a
                    href="https://instagram.com/gennitai"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Instagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-instagram"
                    >
                      <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/@gennitai"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="YouTube"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-youtube"
                    >
                      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                      <path d="m10 15 5-3-5-3z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="mt-6 flex flex-col  gap-2 md:gap-6">
                {/* <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Language
                  </span>

                  <Select
                    value={selected}
                    onValueChange={(value) => setSelected(value)}
                    disabled
                  >
                    <SelectTrigger className="w-fit text-sm bg-background border border-border rounded-md px-2 py-1 text-foreground">
                      <SelectValue placeholder="Select language">
                        <div className="flex items-center gap-2 w-fit">
                          <span>
                            {languages.find((l) => l.code === selected)?.flag}
                          </span>
                          <span>
                            {languages.find((l) => l.code === selected)?.label}
                          </span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-16">
              <div>
                <h4 className="font-semibold text-foreground mb-4">Company</h4>
                <ul className="space-y-3 flex flex-col">
                  <Link
                    href="/company"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                  <Link
                    href="/legal/privacy-policy"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/legal/terms-of-service"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Support
                  </Link>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">
                  Platform Pages
                </h4>
                <ul className="space-y-3 flex flex-col">
                  <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Home
                  </Link>
                  {/* <Link
                href="/inspirations"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Inspirations
              </Link> */}
                  <Link
                    href="/pricing"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/creators-program"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Creators Program
                  </Link>
                  <Link
                    href="/community"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Community
                  </Link>
                  <Link
                    href="/creators-program"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Templates
                  </Link>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Apps</h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/apps/chat"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Design Chat
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/apps/angle-reshape"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Angle Reshape
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      href="/apps/skin-enhancer"
                    >
                      Skin Enhancer
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      href="/logo-animation"
                    >
                      Logo Animation
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      href="/face-swap"
                    >
                      Face Swap
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      href="/relight"
                    >
                      Glow Control
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      href="/apps"
                    >
                      More Apps
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">
                  Learn More
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      href="/#"
                    >
                      Video Tutorials
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      href="/#"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      href="/#"
                    >
                      Creator Resources
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-10 pt-4 flex flex-col items-start lg:flex-row lg:items-center justify-between">
            <div className="flex items-center gap-2 py-2">
              <span className="text-sm font-medium text-muted-foreground">
                Theme
              </span>

              <div className="flex items-center bg-muted/60 border border-border rounded-full p-1">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex items-center justify-center size-7 rounded-full transition-all
        ${theme === "light" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}
      `}
                  title="Light mode"
                >
                  <Sun className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => setTheme("dark")}
                  className={`flex items-center justify-center size-7 rounded-full transition-all
        ${theme === "dark" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}
      `}
                  title="Dark mode"
                >
                  <Moon className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => setTheme("system")}
                  className={`flex items-center justify-center size-7 rounded-full transition-all
        ${theme === "system" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}
      `}
                  title="System theme"
                >
                  <Monitor className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              ©{currentYear},{" "}
              <span className="text-foreground font-medium ml-1">Gennit</span>{" "}
              All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
