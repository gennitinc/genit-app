"use client";

import UserPopOver from "../user/userPopOver";
import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserContext } from "@/context/AuthenticatedContext";
import appLogo from "@/resources/images/gennit.svg";
import { LoadingFileLoader } from "@/utils/Loading";
import cookie from "js-cookie";
import {
  Book,
  Check,
  CreditCard,
  Download,
  Edit3,
  FileDown,
  Loader2,
  Lock,
  LogOut,
  Menu,
  MessageSquare,
  Monitor,
  Moon,
  Play,
  Redo2,
  Settings,
  Share2,
  Sun,
  Undo2,
  User,
  Users,
  WandSparklesIcon,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PresentationNavbarProps {
  title?: string;
  saving?: boolean;
  onBack?: () => void;
  onExportPPTX?: () => void;
  onExportPDF?: () => void;
  isExporting?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function PresentationNavbar({
  title,
  saving,
  onBack,
  onExportPPTX,
  onExportPDF,
  isExporting = false,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: PresentationNavbarProps = {}) {
  const { user } = useUserContext();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState(title || "Untitled Project");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

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
    cookie.remove("genituToken");
    router.push("/signin");
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    // Here you would typically save the project title to your backend
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave();
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
      setProjectTitle("Untitled Project"); // Reset to original
    }
  };

  return (
    <nav className='bg-background/95 border-border relative sticky top-0 z-[999] flex items-center justify-between border-b px-2 py-3 backdrop-blur-sm sm:px-6 sm:pr-1 lg:pr-4'>
      {/* Left Section */}
      <div className='flex min-w-0 flex-1 items-center gap-2 sm:gap-4'>
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='p-1 sm:hidden'
          >
            {isMobileMenuOpen ? (
              <X className='h-5 w-5' />
            ) : (
              <Menu className='h-5 w-5' />
            )}
          </Button>
        )}
        {/* Logo Section */}
        <div className='relative flex min-w-0 items-center gap-1 sm:gap-3'>
          {/* Logo */}
          <div className='group relative flex-shrink-0'>
            <Image
              src={appLogo || "/placeholder.svg"}
              alt='genit Logo'
              width={200}
              height={80}
              className='relative z-10 h-5 w-5 transition-transform duration-300 group-hover:scale-110 sm:h-8 sm:w-8'
            />
          </div>
          {/* Brand name and project - Responsive */}
          <div className='flex min-w-0 items-center gap-1 sm:gap-2'>
            <span className='from-muted-foreground via-muted-foreground/90 to-muted-foreground relative flex-shrink-0 bg-gradient-to-r bg-clip-text text-base font-bold text-transparent sm:text-lg'>
              <LocalizedText text={"genit"} />
              <div className='absolute inset-x-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
            </span>
            {/* Separator - Hidden on very small screens */}
            <div className='xs:flex hidden items-center'>
              <span className='text-muted-foreground/50 mx-1 text-sm sm:text-base'>
                /
              </span>
              <div className='via-muted-foreground/50 h-3 w-px bg-gradient-to-b from-transparent to-transparent opacity-50 sm:h-4'></div>
            </div>
            {/* Project name with visibility - Truncated on mobile */}
            <div className='flex max-w-[200px] min-w-0 items-center gap-1 sm:max-w-[300px] sm:gap-2'>
              <span className='text-muted-foreground/50 group relative block truncate text-xs font-medium sm:text-sm'>
                {projectTitle || "Loading Project..."}
                <div className='via-muted-foreground/50 absolute inset-x-0 -bottom-0.5 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
              </span>
              {/* Visibility Toggle - Simplified on mobile */}
              <Lock className='text-muted-foreground/50 group-hover:text-muted-foreground h-3 w-3 flex-shrink-0 sm:h-3.5 sm:w-3.5' />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Desktop */}

      {!isMobile && (
        <div className='flex items-center gap-3'>
          {/* 1. Status Indicator Group (Saving/Saved) - Elevated visibility */}

          {saving !== undefined && (
            <div className='flex items-center gap-1.5 text-xs'>
              {saving ? (
                // Saving State: Loader + subtle text

                <div className='flex items-center gap-1'>
                  <LoadingFileLoader size={20} />

                  <span className='hidden font-medium sm:inline'>
                    <LocalizedText text={"Saving..."} />
                  </span>
                </div>
              ) : (
                // Saved State: Check icon + green text

                <div className='flex items-center gap-1'>
                  <Check className='h-3.5 w-3.5 text-green-600 dark:text-green-500' />

                  <span className='hidden font-medium sm:inline'>
                    <LocalizedText text={"Saved"} />
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 2. Undo/Redo Group */}
          {(onUndo || onRedo) && (
            <div className='border-border/70 flex items-center gap-1 border-l pl-3'>
              <Button
                variant='ghost'
                size='sm'
                onClick={onUndo}
                disabled={!canUndo}
                className='h-8 w-8 p-0'
                title='Undo (Ctrl+Z)'
              >
                <Undo2 className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={onRedo}
                disabled={!canRedo}
                className='h-8 w-8 p-0'
                title='Redo (Ctrl+Y)'
              >
                <Redo2 className='h-4 w-4' />
              </Button>
            </div>
          )}

          {/* 3. Primary Action Group (Export, Share & Present) */}

          <div className='border-border/70 flex items-center gap-2 border-l pl-3'>
            {/* Export Dropdown */}
            {(onExportPPTX || onExportPDF) && (
              <div className='group relative'>
                <Button
                  variant='ghost'
                  size='sm'
                  disabled={isExporting}
                  className='flex items-center gap-1.5 text-sm'
                >
                  <Download className='h-4 w-4' />
                  {isExporting ? "Exporting..." : "Export"}
                </Button>
                <div className='bg-background border-border invisible absolute top-full right-0 z-[9999] mt-1 w-40 rounded-lg border opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100'>
                  {onExportPPTX && (
                    <button
                      onClick={onExportPPTX}
                      disabled={isExporting}
                      className='hover:bg-muted flex w-full items-center gap-2 rounded-t-lg px-3 py-2 text-left text-sm'
                    >
                      <FileDown className='h-4 w-4' />
                      <LocalizedText text={"PowerPoint"} />
                    </button>
                  )}
                  {onExportPDF && (
                    <button
                      onClick={onExportPDF}
                      disabled={isExporting}
                      className='hover:bg-muted flex w-full items-center gap-2 rounded-b-lg px-3 py-2 text-left text-sm'
                    >
                      <FileDown className='h-4 w-4' />
                      <LocalizedText text={"PDF"} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Share Button (Secondary importance) */}
            {/* 
            <div className="flex relative justify-start items-center text-sm ">
              <Share2 className="w-4 h-4 mr-1.5" />
              Share
            </div> */}

            {/* Present Button (Primary importance) */}

            <button className='relative inline-flex h-9 overflow-hidden rounded-full p-[1px] focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none'>
              <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
              <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl'>
                <div className='flex flex-row items-center gap-2'>
                  <Play className='h-3 w-3' />
                  <LocalizedText text={"Present"} />
                </div>
              </span>
            </button>
          </div>

          {/* 4. Utility Group (Theme & User) */}

          <div className='border-border/70 flex items-center gap-2 border-l pl-3'>
            {/* Theme Toggle Button - Now a true icon button */}

            <Button
              variant='ghost'
              size='icon' // Use size="icon" for perfectly centered icon
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className='hover:bg-accent h-8 w-8 rounded-lg'
              title='Toggle Theme'
            >
              {theme === "dark" ? (
                <Sun className='h-4 w-4' />
              ) : (
                <Moon className='h-4 w-4' />
              )}
            </Button>

            <UserPopOver />
          </div>
        </div>
      )}

      {/* Mobile Right Section */}

      {isMobile && (
        <div className='flex items-center gap-2'>
          {/* 1. Status Indicator & Theme Toggle Group */}

          <div className='flex items-center gap-2'>
            {/* Status Indicator (Icon only) */}

            {saving !== undefined && (
              <div className='mr-1 flex items-center'>
                {saving ? (
                  <LoadingFileLoader size={20} />
                ) : (
                  // Use CheckCircle2 for better visual confirmation than a dot

                  <Check className='h-4 w-4 text-green-500' />
                )}
              </div>
            )}

            {/* Theme Toggle - Mobile */}

            <Button
              variant='ghost'
              size='icon' // Use size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className='hover:bg-accent h-8 w-8 rounded-lg'
              title='Toggle Theme'
            >
              {theme === "dark" ? (
                <Sun className='h-4 w-4' />
              ) : (
                <Moon className='h-4 w-4' />
              )}
            </Button>
          </div>

          {/* 2. Primary Action Group (Share & Present) */}

          <div className='flex items-center gap-1.5'>
            {/* Share Button - Mobile */}

            <div className='relative flex items-center justify-start text-sm'>
              <Share2 className='mr-1.5 h-4 w-4' />
              <LocalizedText text={"Share"} />
            </div>

            {/* Present Button - Mobile (Default variant for prominence) */}

            <button className='relative inline-flex h-9 overflow-hidden rounded-full p-[1px] focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none'>
              <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
              <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl'>
                <div className='flex flex-row items-center gap-2'>
                  <Play className='h-3 w-3' />
                  <LocalizedText text={"Present"} />
                </div>
              </span>
            </button>
          </div>

          {/* 3. User Avatar - Mobile */}

          <UserPopOver />
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className='bg-background border-border absolute top-full right-0 left-0 z-50 border-t shadow-lg'>
          <div className='space-y-3 p-4'>
            {/* Project Title for Mobile */}
            <div className='flex items-center gap-2'>
              <h1 className='text-foreground text-sm font-medium'>
                {projectTitle}
              </h1>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsEditingTitle(true)}
                className='h-6 w-6 p-1'
              >
                <Edit3 className='h-3 w-3' />
              </Button>
            </div>
            {/* Add any other mobile menu items here if needed */}
          </div>
        </div>
      )}
    </nav>
  );
}
