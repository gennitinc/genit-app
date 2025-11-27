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
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useTheme } from "next-themes";
import Link from "next/link";
import AccountActionModal from "@/components/user/account-action-modal";
import CreditTopUpModal from "@/components/credits/CreditTopUpModal";
import { useAccountActions } from "@/hooks/use-account-actions";

const UserPopOver = () => {
  const { user } = useUserContext();
  const { theme, setTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("Untitled Project");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const { signOut, isSigningOut } = useAccountActions();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
    <Popover open={isUserPopoverOpen} onOpenChange={setIsUserPopoverOpen}>
      <PopoverTrigger asChild>
        <button className="relative group">
          <img
            src={
              user?.userdp ||
              "/placeholder.svg?height=40&width=40&query=User avatar"
            }
            alt="User avatar"
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-border shadow-sm object-cover hover:border-primary/50 transition-all duration-200 cursor-pointer"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 border-2 border-background rounded-full"></div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0 bg-background/95 backdrop-blur-sm border border-border shadow-xl rounded-xl"
        align="end"
      >
        <div className="p-4">
          {/* User Email */}
          <div className="pb-2 mb-2 flex flex-row items-center gap-2 border-b border-border">
            <img
              src={
                user?.userdp ||
                "/placeholder.svg?height=40&width=40&query=User avatar"
              }
              alt="User avatar"
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-border shadow-sm object-cover"
            />
            <p className="text-sm font-medium text-foreground">
              {user?.username || "Loading..."}
            </p>
          </div>
          {/* Preferences */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
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
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Language
              </span>
              <select
                className="text-sm bg-background border border-border rounded-md px-2 py-1 text-foreground"
                disabled
              >
                <option value="en" selected>
                  English
                </option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
          {/* Credit Balance */}
          <div className="mb-1 p-3 bg-muted/50 rounded-lg border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-muted-foreground">
                Credits
              </span>
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Available</span>
                <span className="font-medium text-foreground">
                  {user?.creditsRemaining ?? 0}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Used</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {user?.creditsUsed ?? 0}
                </span>
              </div>
            </div>
            <Link href="/pricing" target="_blank">
              <button className="text-xs text-primary hover:text-primary/80 font-medium mt-2 hover:underline transition-colors cursor-pointer">
                Buy more credits →
              </button>
            </Link>
            <div className="mt-2">
              <button
                onClick={() => setIsTopUpOpen(true)}
                className="text-xs text-foreground font-medium underline"
              >
                Top up credits
              </button>
            </div>
          </div>
          {/* Menu Items */}
          <div className="space-y-0.5 mb-2">
            {[
              { icon: Settings, label: "Settings", href: "/user/settings" },
              {
                icon: User,
                label: "Profile",
                href: "/user/settings?tab=account",
              },
              { icon: CreditCard, label: "Pricing", href: "/pricing" },
              { icon: Book, label: "Documentation", href: "/documentation" },
              { icon: Users, label: "Community", href: "/community" },
              { icon: MessageSquare, label: "Feedback", href: "/contact" },
            ].map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-all duration-200 group"
                onClick={() => setIsUserPopoverOpen(false)}
              >
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
                <span className="group-hover:translate-x-0.5 transition-transform duration-200 text-sm">
                  {label}
                </span>
              </Link>
            ))}
          </div>
          {/* Sign Out */}
          <div className="pt-1 border-t border-border">
            <button
              onClick={() => setIsSignOutModalOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all duration-200 group"
            >
              <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </PopoverContent>
      <AccountActionModal
        open={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={async () => {
          setIsUserPopoverOpen(false);
          await signOut();
        }}
        loading={isSigningOut}
        title="Ready to sign out?"
        description="You'll need to sign back in to continue working on your projects."
        confirmLabel="Sign out"
      />
      <CreditTopUpModal
        open={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onSuccess={() => {}}
      />
    </Popover>
  );
};

export default UserPopOver;
