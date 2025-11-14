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
      {/* <div className="relative z-10 bg-background backdrop-blur-sm border-b border-primary/1">
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
      </div> */}

      {/* Main Footer Content */}
      <footer className="px-2 md:px-12 lg:px-20 xl:px-24 w-full text-sm bg-background border-t border-border pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center z-40 gap-2 mb-4">
              <Logo className="w-12 h-12 flex-shrink-0" />
              <span className="text-xl font-semibold transition-colors duration-300 text-foreground">
                Gennit
              </span>
            </Link>
            <p className="text-muted-foreground w-full md:max-w-[60vw] lg:max-w-60 mb-6">
              Create stunning promotional graphics with AI-powered design tools.
              Transform your ideas into professional visuals in seconds.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://discord.gg/ftZbQvCdN7"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
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
                  className="size-5"
                >
                  <path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                  <path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                  <path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3" />
                  <path d="M7 16.5c3.5 1 6.5 1 10 0" />
                </svg>
              </a>
              <a
                href="https://twitter.com/mannupaaji"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
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
                  className="size-5"
                >
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>
            </div>

            <div className="mt-14 flex flex-col items-start sm:flex-row gap-2 md:gap-6 md:items-center">
              <div className="flex items-center gap-4 mb-2 ">
                <span className="text-sm font-medium text-muted-foreground">
                  Theme
                </span>
                <div className="flex gap-1 p-1 bg-muted rounded-lg">
                  <button
                    className="p-1.5 hover:bg-accent hover:shadow-sm rounded transition-all duration-200"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button
                    className="p-1.5 hover:bg-accent hover:shadow-sm rounded transition-all duration-200"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button
                    className="p-1.5 bg-accent shadow-sm rounded"
                    onClick={() => setTheme("system")}
                  >
                    <Monitor className="h-3.5 w-3.5 text-primary" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 mb-2">
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
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Platform</h3>
            <div className="flex flex-col space-y-3 w-fit">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/inspirations"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Inspirations
              </Link>
              <Link
                href="/pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Company</h3>
            <div className="flex flex-col space-y-3 w-fit">
              <Link
                href="/company"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Company
              </Link>
              <Link
                href="/legal/privacy-policy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/legal/terms-of-service"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Support
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Use Cases</h3>
            <div className="flex flex-col space-y-3 w-fit">
              <div className="text-muted-foreground hover:text-foreground transition-colors">
                Design Flier
              </div>
              <div className="text-muted-foreground hover:text-foreground transition-colors">
                YT thumbnail
              </div>
              <div className="text-muted-foreground hover:text-foreground transition-colors">
                Design Poster
              </div>
              <div className="text-muted-foreground hover:text-foreground transition-colors">
                Instagram post
              </div>
              <div className="text-muted-foreground hover:text-foreground transition-colors">
                Facebook post
              </div>
              <div className="text-muted-foreground hover:text-foreground transition-colors">
                Design Banner
              </div>
              <div className="text-muted-foreground hover:text-foreground transition-colors">
                Facebook cover
              </div>
              <div className="text-muted-foreground hover:text-foreground transition-colors">
                Design Logo
              </div>
              <div className="text-muted-foreground hover:text-foreground transition-colors">
                Presentations - coming soon
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Stay Updated</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Get the latest AI design tips and updates delivered to your
                inbox.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full"
                />
                <Button type="submit" size="sm" className="w-full">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center py-4 text-muted-foreground">
          <p className="text-sm">
            Copyright {currentYear} ©{" "}
            <span className="text-foreground font-medium">Gennit</span> All
            Rights Reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <span className="text-xs">Powered by Klip Inc</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs">Online</span>
            </div>
          </div>
        </div>
      </footer>
    </footer>
  );
}
