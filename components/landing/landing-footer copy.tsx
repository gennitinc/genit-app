"use client";

import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  ArrowUp,
  ChevronRight,
  Facebook,
  Github,
  Globe,
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
    <footer className='border-border relative overflow-hidden border-t transition-colors duration-300'>
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
          "fixed right-8 bottom-8 z-50 transform transition-all duration-500",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        )}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={scrollToTop}
                size='icon'
                variant='secondary'
                className='hover:bg-primary hover:text-primary-foreground rounded-full shadow-lg transition-all duration-300 hover:shadow-xl'
              >
                <ArrowUp className='h-5 w-5' />
                <span className='sr-only'>Back to top</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side='left'>
              <p>Back to top</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Newsletter Banner */}
      <div className='bg-background border-primary/1 relative z-10 border-b backdrop-blur-sm'>
        <div className='container mx-auto px-4 py-10'>
          <div className='flex flex-col items-center justify-between gap-6 md:flex-row'>
            <div className='max-w-md'>
              <h2 className='text-foreground mb-2 text-2xl font-bold'>
                Stay in the loop
              </h2>
              <p className='text-muted-foreground'>
                Subscribe to our newsletter for the latest updates, exclusive
                offers, and insights.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className='flex w-full max-w-md flex-col gap-3 sm:flex-row'
            >
              <div className='flex-1'>
                <Input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  required
                  className='border-primary/20 focus:border-primary h-12 w-full'
                />
              </div>
              <Button type='submit' size='lg' className='btn-gradient'>
                Subscribe <ChevronRight className='ml-2 h-4 w-4' />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className='relative z-10 container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20'>
        <div
          className={cn(
            "grid grid-cols-1 gap-10 transition-opacity duration-1000 lg:grid-cols-9",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Company Info */}
          <div className='space-y-8 lg:col-span-3'>
            <div className='flex items-center gap-2'>
              <Logo className='h-12 w-12 flex-shrink-0' />
              <Link href='/' className='mr-6 flex items-center space-x-2'>
                <span className='text-xl font-semibold'>Gennit</span>
              </Link>
            </div>
            <p className='text-muted-foreground max-w-md text-base'>
              Making the world a better place through constructing elegant
              hierarchies and innovative solutions for tomorrow's challenges.
            </p>

            <div className='flex items-center space-x-3'>
              <div className='flex items-center space-x-2'>
                <Switch
                  id='theme-mode'
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                />
                <Label htmlFor='theme-mode' className='cursor-pointer'>
                  {theme === "dark" ? (
                    <Moon className='h-4 w-4' />
                  ) : (
                    <Sun className='h-4 w-4' />
                  )}
                </Label>
              </div>

              <Separator orientation='vertical' className='h-6' />

              <Select defaultValue='en'>
                <SelectTrigger className='h-8 w-[110px] text-xs'>
                  <Globe className='mr-2 h-3.5 w-3.5' />
                  <SelectValue placeholder='Language' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='en'>English</SelectItem>
                  {/* <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-4'>
              <div className='flex items-start space-x-3'>
                <MapPin className='text-primary mt-0.5 h-5 w-5' />
                <span className='text-muted-foreground text-sm'>
                  123 Innovation Drive, Tech City, TC 10101
                </span>
              </div>
              {/* <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  +1 (555) 123-4567
                </span>
              </div> */}
              <div className='flex items-center space-x-3'>
                <Mail className='text-primary h-5 w-5' />
                <span className='text-muted-foreground text-sm'>
                  contact@gennit.com
                </span>
              </div>
            </div>

            <div className='flex w-full flex-wrap gap-3'>
              {[
                { icon: Facebook, label: "Facebook" },
                // { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Youtube, label: "YouTube" },
                { icon: Github, label: "GitHub" },
              ].map((social) => (
                <TooltipProvider key={social.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href='#'
                        className='text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/20 rounded-full border border-transparent p-2.5 transition-colors duration-200'
                      >
                        <span className='sr-only'>{social.label}</span>
                        <social.icon className='h-5 w-5' />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{social.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className='grid w-full grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:col-span-5 lg:col-start-5'>
            {/* <div className="space-y-6">
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                Solutions
              </h3>
              <ul className="space-y-4">
                {[
                  "Marketing Automation",
                  "Data Analytics",
                  "E-Commerce",
                  "Business Intelligence",
                  "Content Management",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="group text-base text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center"
                    >
                      <ChevronRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div> */}
            <div className='space-y-6'>
              <h3 className='text-foreground text-sm font-semibold tracking-wider uppercase'>
                Support & Resources
              </h3>
              <ul className='space-y-4'>
                <li>
                  <Link
                    href='/pricing'
                    className='group text-muted-foreground hover:text-primary flex items-center text-base transition-colors duration-200'
                  >
                    <ChevronRight className='mr-2 -ml-5 h-3 w-3 opacity-0 transition-all duration-200 group-hover:ml-0 group-hover:opacity-100' />
                    Pricing Plans
                  </Link>
                </li>
                <li>
                  <Link
                    href='/documentation'
                    className='group text-muted-foreground hover:text-primary flex items-center text-base transition-colors duration-200'
                  >
                    <ChevronRight className='mr-2 -ml-5 h-3 w-3 opacity-0 transition-all duration-200 group-hover:ml-0 group-hover:opacity-100' />
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href='/help'
                    className='group text-muted-foreground hover:text-primary flex items-center text-base transition-colors duration-200'
                  >
                    <ChevronRight className='mr-2 -ml-5 h-3 w-3 opacity-0 transition-all duration-200 group-hover:ml-0 group-hover:opacity-100' />
                    Implementation Guides
                  </Link>
                </li>
              </ul>
            </div>
            <div className='space-y-6'>
              <h3 className='text-foreground text-sm font-semibold tracking-wider uppercase'>
                Company
              </h3>
              <ul className='space-y-4'>
                <li>
                  <Link
                    href='/company'
                    className='group text-muted-foreground hover:text-primary flex items-center text-base transition-colors duration-200'
                  >
                    <ChevronRight className='mr-2 -ml-5 h-3 w-3 opacity-0 transition-all duration-200 group-hover:ml-0 group-hover:opacity-100' />
                    Company
                  </Link>
                </li>
                <li>
                  <Link
                    href='/contact'
                    className='group text-muted-foreground hover:text-primary flex items-center text-base transition-colors duration-200'
                  >
                    <ChevronRight className='mr-2 -ml-5 h-3 w-3 opacity-0 transition-all duration-200 group-hover:ml-0 group-hover:opacity-100' />
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href='/company'
                    className='group text-muted-foreground hover:text-primary flex items-center text-base transition-colors duration-200'
                  >
                    <ChevronRight className='mr-2 -ml-5 h-3 w-3 opacity-0 transition-all duration-200 group-hover:ml-0 group-hover:opacity-100' />
                    Company
                  </Link>
                </li>
                <li>
                  <Link
                    href='/features'
                    className='group text-muted-foreground hover:text-primary flex items-center text-base transition-colors duration-200'
                  >
                    <ChevronRight className='mr-2 -ml-5 h-3 w-3 opacity-0 transition-all duration-200 group-hover:ml-0 group-hover:opacity-100' />
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href='/community'
                    className='group text-muted-foreground hover:text-primary flex items-center text-base transition-colors duration-200'
                  >
                    <ChevronRight className='mr-2 -ml-5 h-3 w-3 opacity-0 transition-all duration-200 group-hover:ml-0 group-hover:opacity-100' />
                    Market Place
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className='my-10 opacity-30' />

        <div
          className={cn(
            "flex flex-col items-center justify-between gap-4 transition-opacity duration-1000 md:flex-row",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        >
          <p className='text-muted-foreground text-sm'>
            &copy; {currentYear} Gennit, Inc. All rights reserved.
          </p>
          <div className='flex flex-wrap justify-center gap-x-6 gap-y-2'>
            <Link
              href='/privacy'
              className='text-muted-foreground hover:text-primary text-xs transition-colors duration-200'
            >
              Privacy Policy
            </Link>
            <Link
              href='/terms'
              className='text-muted-foreground hover:text-primary text-xs transition-colors duration-200'
            >
              Terms of Service
            </Link>
            <Link
              href='/cookies'
              className='text-muted-foreground hover:text-primary text-xs transition-colors duration-200'
            >
              Cookie Settings
            </Link>
            <Link
              href='/accessibility'
              className='text-muted-foreground hover:text-primary text-xs transition-colors duration-200'
            >
              Accessibility
            </Link>
            <Link
              href='/sitemap'
              className='text-muted-foreground hover:text-primary text-xs transition-colors duration-200'
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
