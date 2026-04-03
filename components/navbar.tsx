"use client";
import {
  User,
  Settings,
  CreditCard,
  Book,
  Users,
  MessageSquare,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Edit3,
  Lock,
  Share2,
  Copy,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import appLogo from "@/resources/images/gennit.svg";
import Image from "next/image";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useRouter } from "next/navigation";
import cookie from "js-cookie";
import { useTheme } from "next-themes";
import UserPopOver from "./user/userPopOver";
import Link from "next/link";

interface NavbarProps {
  title?: string;
}

export function Navbar({ title }: NavbarProps) {
  const { user } = useUserContext();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState(title || "Untitled Project");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (title) {
      setProjectTitle(title);
    }
  }, [title]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleSignOut = () => {
    cookie.remove("gennituToken");
    router.push("/signin");
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    // Here you would typically save the project title to your backend
    console.log("Project title saved:", projectTitle);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave();
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
      setProjectTitle(title || "Untitled Project"); // Reset to original
    }
  };

  // Share functionality
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = "Check out this amazing project on Gennit!";
  const shareTitle = "Gennit Project";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      toast({
        title: "Link copied!",
        description: "Project link has been copied to clipboard.",
      });
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedTitle = encodeURIComponent(shareTitle);

    let platformShareUrl = "";
    switch (platform) {
      case "x":
      case "twitter":
        platformShareUrl = `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case "facebook":
        platformShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "linkedin":
        platformShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "whatsapp":
        platformShareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      default:
        return;
    }

    if (platformShareUrl) {
      window.open(platformShareUrl, "_blank", "width=600,height=400");
    }
  };

  return (
    <nav className="flex items-center justify-between px-2 sm:px-6 sm:pr-1 py-3 bg-background/95 backdrop-blur-sm border-b border-border relative lg:pr-4">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        {/* Mobile Menu Button */}

        {/* Logo Section */}
        <div className="flex items-center gap-1 sm:gap-3 relative min-w-0">
          {/* Logo */}
          <div
            className="relative group flex-shrink-0 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image
              src={appLogo || "/placeholder.svg"}
              alt="Gennit Logo"
              width={200}
              height={80}
              className="h-5 w-5 sm:h-8 sm:w-8 relative z-10 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          {/* Brand name and project - Responsive */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <span
              className="text-base sm:text-lg font-bold bg-gradient-to-r from-muted-foreground via-muted-foreground/90 to-muted-foreground bg-clip-text text-transparent relative flex-shrink-0 cursor-pointer"
              onClick={() => router.push("/")}
            >
              Gennit
              <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </span>
            {/* Separator - Hidden on very small screens */}
            <div className="hidden xs:flex items-center">
              <span className="text-sm sm:text-base text-muted-foreground/50 mx-1">
                /
              </span>
              <div className="w-px h-3 sm:h-4 bg-gradient-to-b from-transparent via-muted-foreground/50 to-transparent opacity-50"></div>
            </div>
            {/* Project name with visibility - Truncated on mobile */}
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <span className="text-xs sm:text-sm text-muted-foreground/50 font-medium relative group truncate">
                {projectTitle || "Loading Project..."}
                <div className="absolute inset-x-0 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-muted-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </span>
              {/* Visibility Toggle - Simplified on mobile */}
              <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Desktop */}
      {!isMobile && (
        <div className="flex items-center gap-2 sm:gap-2">
          {/* Main user avatar with popover */}
          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-2 md:justify-end">
            <Link
              target="__blank"
              className="hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors"
              href="/apps"
            >
              Apps
            </Link>
            <Link
              target="__blank"
              className="hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors"
              href="/pricing"
            >
              Pricing
            </Link>

            <a
              target="__blank"
              className="hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors"
              href="https://discord.gg/ftZbQvCdN7"
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
                className="h-4 w-4 text-neutral-500 dark:text-neutral-500"
              >
                <path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                <path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                <path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3" />
                <path d="M7 16.5c3.5 1 6.5 1 10 0" />
              </svg>
            </a>
            <a
              target="__blank"
              className="hover:text-foreground/80 text-foreground/60 text-sm font-medium transition-colors"
              href="https://twitter.com/mannupaaji"
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
                className="h-4 w-4 text-neutral-500 dark:text-neutral-500"
              >
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
            </a>

            {/* <button className="flex relative justify-start items-center text-sm text-muted-foreground dark:border-white/[0.2] py-2 w-fit border border-transparent shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] px-4 rounded-xl bg-muted">
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
                className="h-4 w-4 text-neutral-500"
              >
                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                <path d="M21 21l-6 -6" />
              </svg>
              <span className="transition-colors hover:text-foreground/80 text-foreground/60 rex text-xs sm:text-sm font-medium pl-2 pr-4">
                {" "}
                <span className="hidden xl:inline-block">Community</span>
              </span>
              <kbd className="pointer-events-none  hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button> */}
          </div>

          <div className="w-px h-6 bg-border mx-1"></div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="rounded-md px-4 font-semibold text-xs h-9 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
                
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleCopyLink}>
                <Copy className="w-4 h-4 mr-2" />
                {copiedLink ? "Copied!" : "Copy Link"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("x")}>
                <Twitter className="w-4 h-4 mr-2 text-neutral-700 dark:text-neutral-400" />
                Share on X
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("facebook")}>
                <Facebook className="w-4 h-4 mr-2 text-neutral-700 dark:text-neutral-400" />
                Share on Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("linkedin")}>
                <Linkedin className="w-4 h-4 mr-2 text-neutral-700 dark:text-neutral-400" />
                Share on LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
                <svg
                  className="w-4 h-4 mr-2 text-neutral-700 dark:text-neutral-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Share on WhatsApp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-8 h-8 p-0 rounded-lg hover:bg-accent"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          <UserPopOver />
        </div>
      )}
      {/* Mobile Right Section */}
      {isMobile && (
        <div className="flex items-center gap-2">
          {/* Theme Toggle - Mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-8 h-8 p-0 rounded-lg hover:bg-accent"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {/* User Avatar - Mobile */}
          <UserPopOver />
        </div>
      )}
      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-t border-border shadow-lg z-50">
          <div className="p-4 space-y-3">
            {/* Project Title for Mobile */}
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-medium text-foreground">
                {projectTitle}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingTitle(true)}
                className="p-1 h-6 w-6"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            </div>
            {/* Add any other mobile menu items here if needed */}
          </div>
        </div>
      )}
    </nav>
  );
}
