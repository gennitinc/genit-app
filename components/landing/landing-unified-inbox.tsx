"use client";

import {
  GmailBrand,
  InstagramBrand,
  LinkedinBrand,
  MessengerBrand,
  MicrosoftOutlookBrand,
  TelegramBrand,
  WhatsAppBrand,
  XBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { useLanguage } from "@/context/LanguageContext";
import { GradientFrame } from "@/utils/gradient-frame";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const messagingPlatforms = [
  { name: "Instagram", Icon: InstagramBrand },
  { name: "X", Icon: XBrand },
  { name: "LinkedIn", Icon: LinkedinBrand },
  { name: "Gmail", Icon: GmailBrand },
  { name: "Outlook", Icon: MicrosoftOutlookBrand },
  { name: "WhatsApp", Icon: WhatsAppBrand },
  { name: "Messenger", Icon: MessengerBrand },
  { name: "Telegram", Icon: TelegramBrand },
];

const LandingUnifiedInbox = () => {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDarkMode = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className='mt-14 mr-auto ml-auto max-w-6xl px-2 pt-20 md:px-6 md:pt-5'>
      {/* Heading */}
      <h2 className='text-foreground mt-6 text-center text-4xl font-semibold tracking-tight md:text-6xl dark:text-white'>
        {t("Unified Inbox")}
      </h2>
      <p className='text-muted-foreground mx-auto mt-5 max-w-2xl text-center text-base font-normal md:text-lg dark:text-white/70'>
        {t(
          "Bring all your DMs together, reply to all and never miss a conversation"
        )}
      </p>

      <div className='mt-8 mb-12 flex justify-center'>
        <Link
          href='/signup'
          className='relative z-20 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-zinc-800 active:scale-95 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200'
        >
          <span>{t("Get your unified inbox")}</span>
          <ArrowRight className='h-4 w-4' />
        </Link>
      </div>
      <div
        className='mt-7 flex items-center justify-center -space-x-2.5'
        aria-label={t("Supported messaging platforms")}
      >
        {messagingPlatforms.map(({ name, Icon }) => (
          <span
            key={name}
            title={name}
            className='flex size-10 items-center justify-center rounded-full border border-zinc-200 bg-white p-2 shadow-sm ring-2 ring-white dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-950'
          >
            <Icon className='size-full' />
          </span>
        ))}
      </div>

      {/* Unified inbox dashboard preview */}
      <div className='relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-[2rem] bg-white p-2 shadow-2xl ring-1 shadow-black/10 ring-black/5 md:p-4 dark:bg-zinc-950/50 dark:shadow-black/30 dark:ring-white/10'>
        <GradientFrame />

        <div className='relative overflow-hidden rounded-[1.4rem] bg-zinc-100 ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10'>
          {!mounted ? (
            <div className='aspect-[1555/1012] w-full' />
          ) : isDarkMode ? (
            <Image
              key='unified-inbox-dark'
              src='/dm1.png'
              alt={t(
                "Unified social media DM dashboard for managing brand conversations in dark mode"
              )}
              width={1555}
              height={1012}
              sizes='(min-width: 1024px) 960px, calc(100vw - 32px)'
              draggable={false}
              className='h-auto w-full'
            />
          ) : (
            <Image
              key='unified-inbox-light'
              src='/dm1.png'
              alt={t(
                "Unified social media DM dashboard for managing brand conversations"
              )}
              width={1554}
              height={1012}
              sizes='(min-width: 1024px) 960px, calc(100vw - 32px)'
              draggable={false}
              className='h-auto w-full'
            />
          )}
        </div>
      </div>

      {/* Call to Action */}
    </section>
  );
};

export default LandingUnifiedInbox;
