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
  Play,
  Loader2,
  Check,
  WandSparklesIcon,
  Download,
  FileDown,
  Undo2,
  Redo2,
} from "lucide-react";
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
import UserPopOver from "../user/userPopOver";

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
      setProjectTitle("Untitled Project"); // Reset to original
    }
  };

  return (
    <nav className="flex items-center justify-between px-2 sm:px-6 sm:pr-1 py-3 bg-background/95 backdrop-blur-sm border-b border-border relative lg:pr-4 top-0 sticky z-[999]">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 sm:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        )}
        {/* Logo Section */}
        <div className="flex items-center gap-1 sm:gap-3 relative min-w-0">
          {/* Logo */}
          <div className="relative group flex-shrink-0">
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
            <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-muted-foreground via-muted-foreground/90 to-muted-foreground bg-clip-text text-transparent relative flex-shrink-0">
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
            <div className="flex items-center gap-1 sm:gap-2 min-w-0 max-w-[200px] sm:max-w-[300px]">
              <span className="text-xs sm:text-sm text-muted-foreground/50 font-medium relative group truncate block">
                {projectTitle || "Loading Project..."}
                <div className="absolute inset-x-0 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-muted-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </span>
              {/* Visibility Toggle - Simplified on mobile */}
              <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Desktop */}

      {!isMobile && (
        <div className="flex items-center gap-3">
          {/* 1. Status Indicator Group (Saving/Saved) - Elevated visibility */}

          {saving !== undefined && (
            <div className="flex items-center gap-1.5 text-xs">
              {saving ? (
                // Saving State: Loader + subtle text

                <div className="flex items-center gap-1 ">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-yellow-600 dark:text-yellow-400" />

                  <span className="hidden sm:inline font-medium">
                    Saving...
                  </span>
                </div>
              ) : (
                // Saved State: Check icon + green text

                <div className="flex items-center gap-1 ">
                  <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />

                  <span className="hidden sm:inline font-medium">Saved</span>
                </div>
              )}
            </div>
          )}

          {/* 2. Undo/Redo Group */}
          {(onUndo || onRedo) && (
            <div className="flex items-center gap-1 pl-3 border-l border-border/70">
              <Button
                variant="ghost"
                size="sm"
                onClick={onUndo}
                disabled={!canUndo}
                className="h-8 w-8 p-0"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRedo}
                disabled={!canRedo}
                className="h-8 w-8 p-0"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* 3. Primary Action Group (Export, Share & Present) */}

          <div className="flex items-center gap-2 pl-3 border-l border-border/70">
            {/* Export Dropdown */}
            {(onExportPPTX || onExportPDF) && (
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isExporting}
                  className="flex items-center gap-1.5 text-sm"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? "Exporting..." : "Export"}
                </Button>
                <div className="absolute top-full right-0 mt-1 w-40 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[9999]">
                  {onExportPPTX && (
                    <button
                      onClick={onExportPPTX}
                      disabled={isExporting}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 rounded-t-lg"
                    >
                      <FileDown className="w-4 h-4" />
                      PowerPoint
                    </button>
                  )}
                  {onExportPDF && (
                    <button
                      onClick={onExportPDF}
                      disabled={isExporting}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 rounded-b-lg"
                    >
                      <FileDown className="w-4 h-4" />
                      PDF
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

            <button className="relative inline-flex h-9 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                <div className="flex flex-row items-center gap-2">
                  <Play className="w-3 h-3" />
                  Present
                </div>
              </span>
            </button>
          </div>

          {/* 4. Utility Group (Theme & User) */}

          <div className="flex items-center gap-2 pl-3 border-l border-border/70">
            {/* Theme Toggle Button - Now a true icon button */}

            <Button
              variant="ghost"
              size="icon" // Use size="icon" for perfectly centered icon
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8 rounded-lg hover:bg-accent"
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            <UserPopOver />
          </div>
        </div>
      )}

      {/* Mobile Right Section */}

      {isMobile && (
        <div className="flex items-center gap-2">
          {/* 1. Status Indicator & Theme Toggle Group */}

          <div className="flex items-center gap-2">
            {/* Status Indicator (Icon only) */}

            {saving !== undefined && (
              <div className="flex items-center mr-1">
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : (
                  // Use CheckCircle2 for better visual confirmation than a dot

                  <Check className="w-4 h-4 text-green-500" />
                )}
              </div>
            )}

            {/* Theme Toggle - Mobile */}

            <Button
              variant="ghost"
              size="icon" // Use size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8 rounded-lg hover:bg-accent"
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* 2. Primary Action Group (Share & Present) */}

          <div className="flex items-center gap-1.5">
            {/* Share Button - Mobile */}

            <div className="flex relative justify-start items-center text-sm ">
              <Share2 className="w-4 h-4 mr-1.5" />
              Share
            </div>

            {/* Present Button - Mobile (Default variant for prominence) */}

            <button className="relative inline-flex h-9 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                <div className="flex flex-row items-center gap-2">
                  <Play className="w-3 h-3" />
                  Present
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
