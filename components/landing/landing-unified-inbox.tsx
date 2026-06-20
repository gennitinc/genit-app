import { GradientFrame } from "@/utils/gradient-frame";
import Image from "next/image";

const LandingUnifiedInbox = () => {
  return (
    <section className='mr-auto ml-auto mt-14 max-w-6xl px-2 pt-20 md:px-6 md:pt-5'>
      {/* Heading */}
      <h1 className='text-foreground mt-6 text-center text-4xl font-semibold tracking-tight md:text-6xl dark:text-white'>
        Unified Inbox
      </h1>
      <p className='text-muted-foreground mx-auto mt-5 max-w-2xl text-center text-base font-normal md:text-lg dark:text-white/70'>
        Bring all your DMs together, reply to all and never miss a conversation
      </p>

      {/* Unified inbox dashboard preview */}
      <div className='relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-[2rem] bg-white p-2 shadow-2xl shadow-black/10 ring-1 ring-black/5 md:p-4 dark:bg-zinc-950/50 dark:shadow-black/30 dark:ring-white/10'>
        <GradientFrame />

        <div className='relative overflow-hidden rounded-[1.4rem] bg-zinc-100 ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10'>
          <Image
            src='/dm2.png'
            alt='Unified social media DM dashboard for managing brand conversations'
            width={1555}
            height={1012}
            sizes='(min-width: 1024px) 960px, calc(100vw - 32px)'
            className='h-auto w-full dark:hidden'
          />
          <Image
            src='/dm1.png'
            alt='Unified social media DM dashboard for managing brand conversations in dark mode'
            width={1554}
            height={1012}
            sizes='(min-width: 1024px) 960px, calc(100vw - 32px)'
            className='hidden h-auto w-full dark:block'
          />
        </div>
      </div>
    </section>
  );
};

export default LandingUnifiedInbox;
