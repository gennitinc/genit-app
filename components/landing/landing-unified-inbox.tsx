import {
  FacebookBrand,
  InstagramBrand,
  LinkedinBrand,
  MessengerBrand,
  TelegramBrand,
  TikTokBrand,
  WhatsAppBrand,
  XBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { Logo } from "@/components/logo";
import { GradientFrame } from "@/utils/gradient-frame";
import { Check, Inbox, MessageCircleMore, Sparkles } from "lucide-react";
import type { CSSProperties, ComponentType } from "react";

type Channel = {
  name: string;
  Icon: ComponentType<{ className?: string }>;
};

const CHANNELS: Channel[] = [
  { name: "Instagram", Icon: InstagramBrand },
  { name: "Messenger", Icon: MessengerBrand },
  { name: "WhatsApp", Icon: WhatsAppBrand },
  { name: "LinkedIn", Icon: LinkedinBrand },
  { name: "Telegram", Icon: TelegramBrand },
  { name: "TikTok", Icon: TikTokBrand },
  { name: "X", Icon: XBrand },
  { name: "Facebook", Icon: FacebookBrand },
];

type OrbitStyle = CSSProperties & {
  "--orbit-index": number;
  "--orbit-angle": string;
};

const LandingUnifiedInbox = () => {
  return (
    <section className='mx-auto max-w-6xl px-2 py-20 md:px-6'>
      <div className='group relative overflow-hidden rounded-3xl bg-black/[0.02] p-5 ring-1 ring-black/5 md:p-8 lg:p-10 dark:bg-white/[0.04] dark:ring-white/10'>
        <GradientFrame />

        <div className='pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-400/10' />

        <div className='relative grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14'>
          <div>
            <div className='text-muted-foreground flex items-center gap-2 text-sm font-medium dark:text-white/70'>
              <span className='flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10'>
                <Inbox className='text-foreground h-4 w-4 dark:text-white' />
              </span>
              Unified inbox
            </div>

            <h2 className='text-foreground mt-5 text-4xl font-semibold tracking-tight md:text-5xl dark:text-white'>
              Every conversation,
              <span className='text-muted-foreground block dark:text-white/50'>
                finally in one place.
              </span>
            </h2>
            <p className='text-muted-foreground mt-5 max-w-xl text-base leading-relaxed md:text-lg dark:text-white/70'>
              Bring messages, comments, and customer replies from every social
              channel into one calm, shared inbox. Your team can respond faster
              without tab-hopping.
            </p>

            <div className='mt-7 flex flex-wrap gap-3'>
              {[
                "One shared inbox",
                "Real-time replies",
                "Nothing gets missed",
              ].map((feature) => (
                <span
                  key={feature}
                  className='text-foreground inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium shadow-sm ring-1 ring-black/5 dark:bg-white/[0.06] dark:text-white/80 dark:ring-white/10'
                >
                  <Check className='h-3.5 w-3.5 text-emerald-500' />
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className='relative flex min-h-[370px] items-center justify-center overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:min-h-[470px] dark:bg-white/5 dark:shadow-none dark:ring-white/10'>
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  @keyframes unifiedInboxOrbit {
                    to { transform: rotate(360deg); }
                  }
                  @keyframes unifiedInboxCounterOrbit {
                    to { transform: rotate(-360deg); }
                  }
                  .unified-inbox-orbit {
                    animation: unifiedInboxOrbit 48s linear infinite;
                  }
                  .unified-inbox-channel {
                    animation: unifiedInboxCounterOrbit 48s linear infinite;
                  }
                  .unified-inbox-visual:hover .unified-inbox-orbit,
                  .unified-inbox-visual:hover .unified-inbox-channel {
                    animation-play-state: paused;
                  }
                  @media (prefers-reduced-motion: reduce) {
                    .unified-inbox-orbit,
                    .unified-inbox-channel { animation: none; }
                  }
                `,
              }}
            />

            <div className='unified-inbox-visual relative h-[310px] w-[310px] sm:h-[390px] sm:w-[390px]'>
              <div className='absolute inset-3 rounded-full border border-dashed border-black/10 sm:inset-5 dark:border-white/15' />
              <div className='absolute inset-[19%] rounded-full border border-black/5 bg-black/[0.015] dark:border-white/10 dark:bg-white/[0.02]' />
              <div className='absolute inset-[31%] rounded-full bg-indigo-500/10 blur-2xl' />

              <div className='unified-inbox-orbit absolute inset-3 sm:inset-5'>
                {CHANNELS.map(({ name, Icon }, index) => (
                  <div
                    key={name}
                    className='absolute top-1/2 left-1/2'
                    style={
                      {
                        "--orbit-index": index,
                        "--orbit-angle": `${index * (360 / CHANNELS.length)}deg`,
                        transform:
                          "translate(-50%, -50%) rotate(var(--orbit-angle)) translateX(clamp(8.3rem, 18vw, 10.7rem))",
                      } as OrbitStyle
                    }
                  >
                    <div
                      className='unified-inbox-channel group/channel flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-white p-2.5 shadow-lg ring-1 shadow-black/5 ring-black/5 transition-transform hover:scale-110 sm:h-14 sm:w-14 sm:p-3 dark:bg-neutral-900 dark:ring-white/10'
                      title={`${name} inbox`}
                    >
                      <Icon className='h-full w-full' />
                    </div>
                  </div>
                ))}
              </div>

              <div className='absolute top-1/2 left-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[2rem] bg-white shadow-2xl ring-1 shadow-indigo-500/15 ring-black/5 sm:h-32 sm:w-32 dark:bg-neutral-950 dark:ring-white/10'>
                <div className='absolute -inset-3 -z-10 rounded-[2.5rem] border border-indigo-500/10' />
                <Logo className='h-12 w-12' />
                <span className='text-foreground mt-1 text-xs font-semibold tracking-tight dark:text-white'>
                  Genit Inbox
                </span>
                <span className='mt-1 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400'>
                  <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                  All synced
                </span>
              </div>

              <div className='absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-[11px] font-medium whitespace-nowrap text-black/70 shadow-lg ring-1 ring-black/5 backdrop-blur sm:bottom-5 dark:bg-neutral-900/90 dark:text-white/70 dark:ring-white/10'>
                <MessageCircleMore className='h-3.5 w-3.5 text-indigo-500' />
                24 conversations unified
                <Sparkles className='h-3.5 w-3.5 text-amber-500' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingUnifiedInbox;
