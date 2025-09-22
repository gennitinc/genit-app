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
    { title: "The Future of AI in Business", date: "Mar 10, 2025" },
    { title: "5 Ways to Improve Team Productivity", date: "Mar 5, 2025" },
    { title: "Understanding Web3 Technologies", date: "Feb 28, 2025" },
  ];

  return (
    <footer className="relative border-t border-border overflow-hidden transition-colors duration-300">
      {/* Background Pattern */}
      {/* <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      /> */}

      {/* Back to Top Button */}
      <div
        className={cn(
          "fixed bottom-8 right-8 z-50 transition-all duration-500 transform",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        )}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={scrollToTop}
                size="icon"
                variant="secondary"
                className="rounded-full shadow-lg hover:shadow-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <ArrowUp className="h-5 w-5" />
                <span className="sr-only">Back to top</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Back to top</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Newsletter Banner */}
      <div className="relative z-10 bg-background backdrop-blur-sm border-b border-primary/1">
        <div className="container mx-auto py-10 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-md">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Stay in the loop
              </h2>
              <p className="text-muted-foreground text-sm">
                Subscribe to our newsletter for the latest updates, exclusive
                offers, and insights.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="w-full max-w-md flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full h-12 border-primary/20 focus:border-primary"
                />
              </div>
              <Button type="submit" size="lg" className="btn-gradient">
                Subscribe <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <footer className="flex flex-wrap justify-center lg:justify-between overflow-hidden gap-10 md:gap-20 py-16 px-6 md:px-16 lg:px-24 xl:px-32 text-[13px] text-muted-foreground bg-white dark:bg-black">
        <div className="flex flex-wrap items-start gap-10 md:gap-[60px] xl:gap-[140px]">
          <div className="flex items-center gap-2">
            <Logo className="w-12 h-12 flex-shrink-0" />
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="text-xl font-semibold">Gennit</span>
            </Link>
          </div>
          <div>
            <p className="text-foreground font-semibold">Product</p>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="/" className="hover:text-indigo-600 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-indigo-600 transition">
                  Support
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-indigo-600 transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-indigo-600 transition">
                  Affiliate
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-foreground font-semibold">Resources</p>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="/" className="hover:text-indigo-600 transition">
                  Company
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-indigo-600 transition">
                  Blogs
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-indigo-600 transition">
                  Community
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-indigo-600 transition">
                  Careers
                  <span className="text-xs text-white bg-indigo-600 rounded-md ml-2 px-2 py-1">
                    We’re hiring!
                  </span>
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-indigo-600 transition">
                  About
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-foreground font-semibold">Legal</p>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="/" className="hover:text-indigo-600 transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-indigo-600 transition">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col max-md:items-center max-md:text-center gap-2 items-end">
          <p className="max-w-60">
            Making every customer feel valued—no matter the size of your
            audience.
          </p>
          <div className="flex items-center gap-4 mt-3">
            <a
              href="https://dribbble.com/prebuiltui"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-dribbble size-5 hover:text-indigo-500"
                aria-hidden="true"
              >
                <circle cx={12} cy={12} r={10} />
                <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
                <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
                <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/prebuiltui"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-linkedin size-5 hover:text-indigo-500"
                aria-hidden="true"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width={4} height={12} x={2} y={9} />
                <circle cx={4} cy={4} r={2} />
              </svg>
            </a>
            <a href="https://x.com/prebuiltui" target="_blank" rel="noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-twitter size-5 hover:text-indigo-500"
                aria-hidden="true"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@prebuiltui"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-youtube size-6 hover:text-indigo-500"
                aria-hidden="true"
              >
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                <path d="m10 15 5-3-5-3z" />
              </svg>
            </a>
          </div>
          <p className="mt-3 text-center">
            © 2025 <Link href="/">Gennit AI</Link>
          </p>
        </div>
      </footer>
    </footer>
  );
}
