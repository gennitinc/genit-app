"use client";
import CreditTopUpModal from "@/components/credits/CreditTopUpModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AccountActionModal from "@/components/user/account-action-modal";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useAccountActions } from "@/hooks/use-account-actions";
import {
  Book,
  CreditCard,
  Edit3,
  Lock,
  LogOut,
  Menu,
  MessageSquare,
  Monitor,
  Moon,
  Settings,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

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
        <Avatar className={isMobile ? "h-6 w-6 px-0" : "h-8 w-8 px-0"}>
          <AvatarImage
            src={user?.userdp}
            alt={user?.username}
            className='object-cover'
          />
          <AvatarFallback>{user?.username[0]}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent
        className='bg-background/95 border-border w-64 rounded-xl border p-0 shadow-xl backdrop-blur-sm'
        align='end'
      >
        <div className='p-4'>
          {/* User Email */}
          <Link
            href={`/creator/${user?.username}`}
            onClick={() => setIsUserPopoverOpen(false)}
            className='border-border mb-2 flex flex-row items-center gap-2 border-b pb-2 transition-opacity hover:opacity-80'
          >
            <Avatar className={isMobile ? "h-6 w-6 px-0" : "h-8 w-8 px-0"}>
              <AvatarImage
                src={user?.userdp}
                alt={user?.username}
                className='object-cover'
              />
              <AvatarFallback>{user?.username[0]}</AvatarFallback>
            </Avatar>
            <p className='text-foreground text-sm font-medium'>
              {user?.username || "Loading..."}
            </p>
          </Link>
          {/* Preferences */}
          <div className='mb-2'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-muted-foreground text-sm font-medium'>
                Theme
              </span>
              <div className='bg-muted flex gap-1 rounded-lg p-1'>
                <button
                  className='hover:bg-accent rounded p-1.5 transition-all duration-200 hover:shadow-sm'
                  onClick={() => setTheme("light")}
                >
                  <Sun className='text-muted-foreground h-3.5 w-3.5' />
                </button>
                <button
                  className='hover:bg-accent rounded p-1.5 transition-all duration-200 hover:shadow-sm'
                  onClick={() => setTheme("dark")}
                >
                  <Moon className='text-muted-foreground h-3.5 w-3.5' />
                </button>
                <button
                  className='bg-accent rounded p-1.5 shadow-sm'
                  onClick={() => setTheme("system")}
                >
                  <Monitor className='text-primary h-3.5 w-3.5' />
                </button>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-sm font-medium'>
                Language
              </span>
              <select
                className='bg-background border-border text-foreground rounded-md border px-2 py-1 text-sm'
                disabled
              >
                <option value='en' selected>
                  English
                </option>
                <option value='es'>Spanish</option>
                <option value='fr'>French</option>
              </select>
            </div>
          </div>
          {/* Credit Balance */}
          <div className='bg-muted/50 border-border/50 mb-1 rounded-lg border p-3'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-muted-foreground text-sm font-semibold'>
                Credits
              </span>
              <CreditCard className='text-primary h-4 w-4' />
            </div>
            <div className='space-y-1 text-xs'>
              <div className='text-muted-foreground flex justify-between'>
                <span>Available</span>
                <span className='text-foreground font-medium'>
                  {user?.creditsRemaining ?? 0}
                </span>
              </div>
              <div className='text-muted-foreground flex justify-between'>
                <span>Used</span>
                <span className='font-medium text-green-600 dark:text-green-400'>
                  {user?.creditsUsed ?? 0}
                </span>
              </div>
            </div>
            <Link href='/pricing' target='_blank'>
              <button className='text-primary hover:text-primary/80 mt-2 cursor-pointer text-xs font-medium transition-colors hover:underline'>
                Pricing →
              </button>
            </Link>
            <div className='mt-2'>
              <button
                onClick={() => setIsTopUpOpen(true)}
                className='text-foreground text-xs font-medium underline'
              >
                Top up credits
              </button>
            </div>
          </div>
          {/* Menu Items */}
          <div className='mb-2 space-y-0.5'>
            {[
              { icon: Settings, label: "Settings", href: "/user/settings" },
              {
                icon: User,
                label: "Profile",
                href: `/creator/${user?.username}`,
              },
              { icon: CreditCard, label: "Pricing", href: "/pricing" },
              // { icon: Book, label: "Documentation", href: "/documentation" },
              { icon: Users, label: "Community", href: "/community" },
              { icon: MessageSquare, label: "Feedback", href: "/contact" },
            ].map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                className='text-muted-foreground hover:bg-accent hover:text-accent-foreground group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200'
                onClick={() => setIsUserPopoverOpen(false)}
              >
                <Icon className='text-muted-foreground group-hover:text-accent-foreground h-4 w-4 transition-colors' />
                <span className='text-sm transition-transform duration-200 group-hover:translate-x-0.5'>
                  {label}
                </span>
              </Link>
            ))}
          </div>
          {/* Sign Out */}
          <div className='border-border border-t pt-1'>
            <button
              onClick={() => setIsSignOutModalOpen(true)}
              className='text-destructive hover:bg-destructive/10 hover:text-destructive group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200'
            >
              <LogOut className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5' />
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
        title='Ready to sign out?'
        description="You'll need to sign back in to continue working on your projects."
        confirmLabel='Sign out'
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
