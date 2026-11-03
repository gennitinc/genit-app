import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { marketingCapabilities } from "@/lib/marketing-capabilities";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Platform | Genit",
  description:
    "Genit brings brand setup, planning, design, video, scheduling, outreach, a unified inbox, and reporting into one AI marketing workspace.",
  alternates: { canonical: "/platform" },
  openGraph: {
    title: "Genit AI Marketing Platform",
    description:
      "Plan, create, automate, publish, communicate, and optimize from one agentic marketing workspace.",
    url: "/platform",
    type: "website",
  },
};

const stages = [
  [
    "Set up your brand",
    "Give Genit your website. It builds a brand profile with your colors, fonts, voice, products, and audience, which you can edit. Every tool reads from it.",
  ],
  [
    "Plan",
    "Ask for a campaign or a month of content. Genit drafts the plan, the posting schedule, and the goals to track.",
  ],
  [
    "Create",
    "Make the graphics, videos, captions, emails, and decks the plan needs, in the formats each channel expects.",
  ],
  [
    "Publish and send",
    "Schedule posts to connected accounts, run outreach, and answer replies from one inbox. You choose what needs approval.",
  ],
  [
    "Review",
    "See how posts and campaigns performed and use that to decide what to do next.",
  ],
];

export default function PlatformPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Genit AI Marketing Platform",
    url: "https://www.trygenit.com/platform",
    description: metadata.description,
    mainEntity: marketingCapabilities.map((capability) => ({
      "@type": "SoftwareApplication",
      name: capability.name,
      url: `https://www.trygenit.com/platform/${capability.slug}`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: capability.description,
    })),
  };

  return (
    <div className='min-h-screen bg-white text-neutral-900 dark:bg-black dark:text-neutral-100'>
      <LandingNavbar />
      <main className='mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24'>
        <section aria-labelledby='platform-hero' className='max-w-3xl'>
          <h1
            id='platform-hero'
            className='text-3xl font-bold tracking-tight text-neutral-950 sm:text-5xl dark:text-white'
          >
            One workspace for the whole marketing job.
          </h1>
          <p className='mt-6 text-base leading-8 text-pretty text-neutral-600 sm:text-lg dark:text-neutral-400'>
            Genit covers the steps between an idea and a published campaign:
            brand setup, planning, design, video, scheduling, outreach, replies,
            and reporting. Each part shares the same brand profile and media
            library, and AI agents can work across all of them.
          </p>
          <div className='mt-8 flex flex-wrap items-center gap-4'>
            <Link
              href='/pricing'
              className='rounded-full bg-neutral-950 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-950'
            >
              Start on the free plan
            </Link>
            <Link
              href='/use-cases'
              className='text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
            >
              Browse use cases →
            </Link>
          </div>
        </section>

        <figure className='mt-12 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
          <img
            className='h-auto max-h-[560px] w-full object-cover'
            src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
            alt='Abstract artwork representing the Genit workspace'
          />
        </figure>

        <section
          className='mt-20 border-t border-neutral-200 pt-14 dark:border-neutral-800'
          aria-labelledby='lifecycle-heading'
        >
          <div className='grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16'>
            <div className='space-y-4 lg:col-span-5'>
              <h2
                id='lifecycle-heading'
                className='text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white'
              >
                How work moves through Genit
              </h2>
              <p className='text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                You can use any step on its own. The benefit of doing them in
                one place is that nothing has to be re-explained or re-uploaded
                between them.
              </p>
            </div>

            <ol className='space-y-8 lg:col-span-7'>
              {stages.map(([name, description], index) => (
                <li key={name} className='flex gap-4'>
                  <span className='flex size-7 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-xs font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-300'>
                    {index + 1}
                  </span>
                  <div>
                    <h3 className='font-semibold text-neutral-950 dark:text-white'>
                      {name}
                    </h3>
                    <p className='mt-1 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className='mt-20 border-t border-neutral-200 pt-14 dark:border-neutral-800'
          aria-labelledby='capabilities-heading'
        >
          <h2
            id='capabilities-heading'
            className='text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white'
          >
            What the platform includes
          </h2>

          <figure className='my-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
          <img
            className='h-auto max-h-[440px] w-full object-cover'
            src='https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
            alt='Team reviewing work together'
          />
        </figure>

          <div className='mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 md:grid-cols-2 dark:border-neutral-800 dark:bg-neutral-800'>
            {marketingCapabilities.map((capability) => (
              <Link
                key={capability.slug}
                href={`/platform/${capability.slug}`}
                className='group flex flex-col bg-white p-7 transition-colors hover:bg-neutral-50 sm:p-8 dark:bg-neutral-950 dark:hover:bg-neutral-900'
              >
                <h3 className='flex items-center justify-between text-lg font-semibold text-neutral-950 dark:text-white'>
                  <span>{capability.name}</span>
                  <span className='text-neutral-400 transition-transform group-hover:translate-x-1'>
                    →
                  </span>
                </h3>
                <p className='mt-2 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                  {capability.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section
          className='mt-20 border-t border-neutral-200 pt-14 dark:border-neutral-800'
          aria-labelledby='control-heading'
        >
          <figure className='mb-10 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
          <img
            className='h-auto max-h-[440px] w-full object-cover'
            src='https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
            alt='Person checking their phone at a kitchen table'
          />
        </figure>

          <div className='max-w-3xl space-y-6'>
            <h2
              id='control-heading'
              className='text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white'
            >
              You decide what runs on its own
            </h2>
            <p className='text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              Publishing a post, sending an email, or messaging a customer
              happens through accounts you connect and permissions you grant.
              Routine steps can run automatically; anything you mark as
              needing review waits for you.
            </p>
            <ul className='space-y-4'>
              <li className='border-l border-neutral-300 ps-4 text-sm leading-7 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400'>
                <strong className='font-semibold text-neutral-950 dark:text-white'>
                  Connected accounts only.
                </strong>{" "}
                Genit acts through the social, email, and ad accounts you sign
                in to, and you can disconnect any of them at any time.
              </li>
              <li className='border-l border-neutral-300 ps-4 text-sm leading-7 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400'>
                <strong className='font-semibold text-neutral-950 dark:text-white'>
                  One brand profile per workspace.
                </strong>{" "}
                Agencies can keep each client separate so their voice and
                assets never mix.
              </li>
              <li className='border-l border-neutral-300 ps-4 text-sm leading-7 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400'>
                <strong className='font-semibold text-neutral-950 dark:text-white'>
                  Works with your stack.
                </strong>{" "}
                Native connections to Meta, Google, LinkedIn, X, TikTok, and
                YouTube, plus a plugin catalog for CRMs, stores, and other
                business apps.
              </li>
            </ul>
          </div>
        </section>

        <section className='mt-20 rounded-2xl border border-neutral-200 p-8 text-center sm:p-12 dark:border-neutral-800'>
          <h2 className='text-2xl font-bold tracking-tight text-neutral-950 dark:text-white'>
            Start with one thing
          </h2>
          <p className='mx-auto mt-3 max-w-xl text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
            Most people begin with a single task, like a week of posts or a
            launch graphic, and add the rest as they need it.
          </p>
          <div className='mt-6 flex flex-wrap items-center justify-center gap-4'>
            <Link
              href='/signup'
              className='rounded-full bg-neutral-950 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-950'
            >
              Get started free
            </Link>
            <Link
              href='/plugins'
              className='rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900'
            >
              See integrations
            </Link>
          </div>
        </section>
      </main>
      <LandingFooter />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
