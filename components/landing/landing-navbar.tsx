"use client";

import { Logo } from "../logo";
import Aurora from "../ui/aurora";
import UserPopOver from "../user/userPopOver";
import {
  FacebookBrand,
  GmailBrand,
  GoogleCalendarBrand,
  GoogleDocsBrand,
  GoogleDriveBrand,
  GoogleMeetBrand,
  GoogleSheetsBrand,
  InstagramBrand,
  LinkedinBrand,
  MailChimpBrand,
  MessengerBrand,
  MicrosoftOutlookBrand,
  PinterestBrand,
  SlackBrand,
  TelegramBrand,
  TikTokBrand,
  WhatsAppBrand,
  YoutubeBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { PricingDialog } from "@/components/common/pricing-dialog";
import { useAvailablePlugins } from "@/components/plugins/plugins-flow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronDown, PanelRight } from "lucide-react";
import {
  BadgeCheck,
  Bell,
  CircleFadingArrowUp,
  CreditCard,
  LogOut,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const featuredPlugins = [
  {
    name: "Instagram",
    description: "Publish posts, reels and stories.",
    icon: InstagramBrand,
  },
  {
    name: "Facebook",
    description: "Manage posts, comments and Page DMs.",
    icon: FacebookBrand,
  },
  {
    name: "LinkedIn",
    description: "Post to profiles and company pages.",
    icon: LinkedinBrand,
  },
  {
    name: "Gmail",
    description: "Send, draft and automate email replies.",
    icon: GmailBrand,
  },
  {
    name: "Google Drive",
    description: "Browse, upload and share files.",
    icon: GoogleDriveBrand,
  },
  {
    name: "Google Calendar",
    description: "Create events and schedule meetings.",
    icon: GoogleCalendarBrand,
  },
  {
    name: "Slack",
    description: "Read channels and send messages.",
    icon: SlackBrand,
  },
  {
    name: "WhatsApp",
    description: "Run customer chats and campaigns.",
    icon: WhatsAppBrand,
  },
  {
    name: "YouTube",
    description: "Upload videos and manage comments.",
    icon: YoutubeBrand,
  },
  {
    name: "Pinterest",
    description: "Create pins and track performance.",
    icon: PinterestBrand,
  },
  {
    name: "TikTok",
    description: "Publish videos and read analytics.",
    icon: TikTokBrand,
  },
  {
    name: "Outlook",
    description: "Connect enterprise email workflows.",
    icon: MicrosoftOutlookBrand,
  },
  {
    name: "Mailchimp",
    description: "Build newsletters and email automations.",
    icon: MailChimpBrand,
  },
  {
    name: "Messenger",
    description: "Automate replies and customer DMs.",
    icon: MessengerBrand,
  },
  {
    name: "Telegram",
    description: "Manage chats with your AI agent.",
    icon: TelegramBrand,
  },
  {
    name: "Google Meet",
    description: "Schedule and launch video meetings.",
    icon: GoogleMeetBrand,
  },
  {
    name: "Google Sheets",
    description: "Create, edit and sync spreadsheets.",
    icon: GoogleSheetsBrand,
  },
  {
    name: "Google Docs",
    description: "Create and edit documents with AI.",
    icon: GoogleDocsBrand,
  },
];

export function LandingNavbar() {
  const { t } = useLanguage();
  const FARMNET_EMAIL = "farmnetent@gmail.com";
  const { theme, setTheme } = useTheme();
  const user = useUserContext().user;
  const { total: totalPlugins } = useAvailablePlugins();
  const [mounted, setMounted] = useState(false);
  const [pluginsOpen, setPluginsOpen] = useState(false);
  const pluginsCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openPlugins = () => {
    if (pluginsCloseTimer.current) clearTimeout(pluginsCloseTimer.current);
    setPluginsOpen(true);
  };

  const closePluginsSoon = () => {
    if (pluginsCloseTimer.current) clearTimeout(pluginsCloseTimer.current);
    pluginsCloseTimer.current = setTimeout(() => setPluginsOpen(false), 120);
  };

  const currentUser = mounted ? user : null;
  const isFarmnetUser = currentUser?.email?.toLowerCase() === FARMNET_EMAIL;

  const navigation = [
    // { name: t("Platform"), href: "/platform" },
    { name: t("Visual Flow"), href: "/visuals" },
    { name: t("Chat"), href: "/chat" },
    {
      name: t("Plugins"),
      href: "/plugins",
    },
    ...(isFarmnetUser ? [{ name: t("Apps"), href: "/apps" }] : []),
    // { name: "Video & Image Gen", href: "/inspire/create?mode=ai-video-gen" },
    // { name: t("Community"), href: "/community" },
    { name: t("Blog"), href: "/blog" },
    { name: t("History"), href: currentUser ? "/chat/history" : "/signin" },
    {
      name: t("Creator Program"),
      href: currentUser ? `/user/referral` : "/creators-program",
    },
    // currentUser && {
    //   name: "Profile",
    //   href: `/creator/${currentUser?.username}`,
    // },
    {
      name: currentUser ? t("Billing") : t("Pricing"),
      href: currentUser ? "/user/settings?tab=billing" : "/pricing",
    },
    { name: t("Company"), href: "/company" },
    { name: t("Contact"), href: "/contact" },
  ];

  useEffect(() => {
    setMounted(true);

    return () => {
      if (pluginsCloseTimer.current) clearTimeout(pluginsCloseTimer.current);
    };
  }, []);

  return (
    <>
      <header className='sticky top-0 z-50 w-full border-b border-black/[0.06] bg-white/65 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/55 dark:border-white/10 dark:bg-zinc-950/60 dark:shadow-[0_8px_30px_rgba(0,0,0,0.22)] dark:supports-[backdrop-filter]:bg-zinc-950/50'>
        <nav className='z-50 mx-auto flex h-fit items-center justify-between px-2 py-1 md:px-12 lg:px-20 xl:px-24'>
          {/* Replace <img> with new <Image> */}
          <Link href='/' className='z-40 flex items-center'>
            <Logo className='h-12 w-12 flex-shrink-0' />
            <span
              className={`text-foreground text-xl font-semibold transition-colors duration-300`}
            >
              {t("Genit")}
            </span>
          </Link>

          <div className='z-50 hidden items-center gap-4 lg:flex'>
            <div className='flex items-center gap-2 sm:gap-2'>
              <div className='flex flex-1 items-center justify-end gap-2 sm:gap-2 md:justify-end'>
                {/* <Link
                  className='hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors'
                  href='/platform'
                >
                  {t("Platform")}
                </Link> */}
                <Link
                  className='hover:text-foreground/80 text-foreground/60 mr-3 hidden text-sm font-medium transition-colors min-[1220px]:inline-flex'
                  href='/visuals'
                >
                  {t("Visual Flow")}
                </Link>
                <Link
                  className='hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors'
                  href='/chat'
                >
                  {t("Chat")}
                </Link>
                <DropdownMenu
                  modal={false}
                  open={pluginsOpen}
                  onOpenChange={setPluginsOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      type='button'
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") openPlugins();
                      }}
                      onPointerLeave={closePluginsSoon}
                      onPointerDown={(event) => {
                        if (event.pointerType === "mouse")
                          event.preventDefault();
                      }}
                      className='group text-foreground/60 hover:text-foreground/80 data-[state=open]:bg-accent data-[state=open]:text-foreground mr-3 hidden h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium transition-[color,background-color,transform] duration-150 outline-none active:scale-[0.97] min-[1100px]:inline-flex'
                    >
                      {t("Plugins")}
                      <ChevronDown className='size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180' />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='center'
                    sideOffset={12}
                    onPointerEnter={openPlugins}
                    onPointerLeave={closePluginsSoon}
                    onCloseAutoFocus={(event) => event.preventDefault()}
                    className='border-border/80 bg-popover/95 w-[min(1000px,calc(100vw-2rem))] overflow-x-hidden overflow-y-auto rounded-2xl p-2 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)]'
                  >
                    <DropdownMenuGroup className='grid grid-cols-3 gap-1 p-2'>
                      {featuredPlugins.map((plugin) => {
                        const Icon = plugin.icon;

                        return (
                          <DropdownMenuItem key={plugin.name} asChild>
                            <Link
                              href='/plugins'
                              className='focus:bg-accent hover:bg-accent flex min-w-0 cursor-pointer items-center gap-3 rounded-xl px-3 py-3.5 transition-colors outline-none'
                            >
                              <span className='border-border/70 bg-background flex size-11 shrink-0 items-center justify-center rounded-xl border shadow-sm'>
                                <Icon className='size-6' />
                              </span>
                              <span className='min-w-0'>
                                <span className='text-foreground block truncate text-sm font-semibold'>
                                  {plugin.name}
                                </span>
                                <span className='text-muted-foreground mt-0.5 block truncate text-xs'>
                                  {plugin.description}
                                </span>
                              </span>
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className='mx-2' />
                    <DropdownMenuItem asChild>
                      <Link
                        href='/plugins'
                        className='text-foreground focus:bg-accent hover:bg-accent mx-auto my-2 flex h-12 w-fit cursor-pointer items-center justify-center gap-2 rounded-xl border px-6 text-sm font-semibold transition-[background-color,transform] outline-none active:scale-[0.99]'
                      >
                        {t("View all")} {totalPlugins.toLocaleString()}+{" "}
                        {t("plugins")}
                        <ArrowRight className='size-4' />
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {isFarmnetUser && (
                  <Link
                    className='hover:text-foreground/80 text-foreground/60 mr-3 hidden text-sm font-medium transition-colors min-[1220px]:inline-flex'
                    href='/apps'
                  >
                    {t("Apps")}
                  </Link>
                )}
                {/* <Link
                  target='__blank'
                  className='hover:text-foreground/80 text-foreground/60 mr-3 hidden text-sm font-medium transition-colors min-[1450px]:inline-flex'
                  href='/community'
                >
                  {t("Community")}
                </Link> */}
                <Link
                  className='hover:text-foreground/80 text-foreground/60 mr-3 hidden text-sm font-medium transition-colors min-[1360px]:inline-flex'
                  href='/blog'
                >
                  {t("Blog")}
                </Link>
                <Link
                  className='hover:text-foreground/80 text-foreground/60 mr-3 text-sm font-medium transition-colors'
                  href={currentUser ? "/user/settings?tab=billing" : "/pricing"}
                >
                  {currentUser ? t("Billing") : t("Pricing")}
                </Link>
                {currentUser && (
                  <Link
                    className='hover:text-foreground/80 text-foreground/60 mr-3 hidden text-sm font-medium transition-colors min-[1450px]:inline-flex'
                    href='/chat/history'
                  >
                    {t("History")}
                  </Link>
                )}
                <Link
                  target='_blank'
                  className='hover:text-foreground/80 text-foreground/60 mr-3 hidden text-sm font-medium transition-colors 2xl:inline-flex'
                  href='https://discord.gg/ftZbQvCdN7'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='h-4 w-4 text-neutral-500 dark:text-neutral-500'
                  >
                    <path d='M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0' />
                    <path d='M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0' />
                    <path d='M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3' />
                    <path d='M7 16.5c3.5 1 6.5 1 10 0' />
                  </svg>
                </Link>
                <Link
                  target='_blank'
                  className='hover:text-foreground/80 text-foreground/60 hidden text-sm font-medium transition-colors 2xl:inline-flex'
                  href='https://twitter.com/genit_ai'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='h-4 w-4 text-neutral-500 dark:text-neutral-500'
                  >
                    <path d='M4 4l11.733 16h4.267l-11.733 -16z' />
                    <path d='M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772' />
                  </svg>
                </Link>
              </div>

              <Button
                variant='ghost'
                size='sm'
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className='hover:bg-accent h-8 w-8 rounded-lg p-0'
              >
                {mounted ? (
                  theme === "dark" ? (
                    <Sun className='h-4 w-4' />
                  ) : (
                    <Moon className='h-4 w-4' />
                  )
                ) : (
                  <div className='h-4 w-4' />
                )}
              </Button>

              {currentUser ? (
                <UserPopOver />
              ) : (
                <div className='flex items-center gap-2'>
                  <Link
                    className='text-gray-9 [&_svg]:text-gray-9 hover:text-gray-10 focus-visible:ring-gray-a2 relative hidden h-10 items-center justify-center gap-0 rounded-lg border border-transparent bg-transparent px-4 text-sm font-semibold transition duration-200 ease-in-out select-none focus-visible:ring-4 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-70 lg:flex'
                    data-state='closed'
                    href='/signin'
                  >
                    {t("Sign in")}
                  </Link>
                  <Link
                    className='hover:shadow-button shadow-primary/10 relative inline-flex h-10 items-center justify-center gap-0 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm outline-hidden backdrop-blur-[25px] transition-all duration-200 ease-in-out select-none hover:bg-indigo-700 focus-visible:ring-4 focus-visible:ring-cyan-500/30 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-30'
                    href='/signup'
                  >
                    <span>{t("Start for $0")}</span>
                    <ArrowRight className='ml-1 h-4 w-4' />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile/Tablet Menu Section */}
          <div className='flex items-center gap-2 lg:hidden'>
            {currentUser ? (
              <UserPopOver />
            ) : (
              // <div className='flex items-center gap-2'>
              //   <Link
              //     className='text-gray-9 [&_svg]:text-gray-9 hover:text-gray-10 focus-visible:ring-gray-a2 relative hidden h-10 items-center justify-center gap-0 rounded-lg border border-transparent bg-transparent px-4 text-sm font-semibold transition duration-200 ease-in-out select-none focus-visible:ring-4 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-70 md:flex'
              //     data-state='closed'
              //     href='/signin'
              //   >
              //     {t("Sign in")}
              //   </Link>
              //   <Link
              //     className='hover:shadow-button focus-visible:ring-primary/30 relative inline-flex h-10 items-center justify-center gap-0 rounded-lg border border-indigo-400/60 bg-indigo-600 px-4 text-sm font-semibold !text-white shadow-[0_6px_20px_rgba(79,70,229,0.28)] outline-hidden backdrop-blur-[25px] transition-all duration-200 ease-in-out select-none hover:bg-indigo-700 focus-visible:ring-4 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-30'
              //     href='/signup'
              //   >
              //     <span>{t("Start for $0")}</span>
              //     <ArrowRight className='ml-1 h-4 w-4' />
              //   </Link>
              // </div>
              <div className=''></div>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='z-50'>
                  <PanelRight className='text-muted-foreground size-4 h-4 w-4' />
                  <span className='sr-only'>{t("Toggle menu")}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='right'>
                <div className='mt-8 flex flex-col gap-4'>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                    >
                      {item.name}
                    </Link>
                  ))}
                  <hr className='my-4' />
                  {currentUser ? (
                    <Link
                      href={`/creator/${currentUser?.username}`}
                      className='flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    >
                      <Avatar className='h-10 w-10'>
                        <AvatarImage
                          src={currentUser?.userdp}
                          alt={currentUser?.username}
                        />
                        <AvatarFallback>
                          {currentUser?.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='font-medium'>
                          {currentUser?.username}
                        </span>
                        <span className='text-xs text-zinc-400'>
                          {currentUser?.email}
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className='flex w-fit flex-col gap-2'>
                      <Link
                        className='text-gray-9 [&_svg]:text-gray-9 hover:text-gray-10 focus-visible:ring-gray-a2 relative h-10 items-center justify-center gap-0 rounded-lg border border-transparent bg-transparent px-4 text-sm font-semibold transition duration-200 ease-in-out select-none focus-visible:ring-4 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-70'
                        data-state='closed'
                        href='/signin'
                      >
                        {t("Sign in")}
                      </Link>
                      <Link
                        className='text-foreground not-disabled:hover:shadow-button relative inline-flex h-10 items-center justify-center gap-0 rounded-lg border-[2px] border-white/5 bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1)_100%)] bg-origin-border px-4 text-sm font-semibold shadow-sm outline-hidden backdrop-blur-[25px] transition-all duration-200 ease-in-out select-none after:pointer-events-none after:absolute after:top-[-2px] after:left-[-2px] after:h-[calc(100%+4px)] after:w-[calc(100%+4px)] after:rounded-[1rem] after:bg-[url("/static/texture-btn.png")] after:bg-repeat not-disabled:hover:bg-white/90 not-disabled:hover:text-black focus-visible:bg-white/90 focus-visible:text-black focus-visible:ring-4 focus-visible:ring-white/30 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:text-white/50 disabled:opacity-30'
                        href='/signup'
                      >
                        <span>{t("Start for $0")}</span>
                        <ArrowRight className='ml-1 h-4 w-4' />
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    </>
  );
}
