import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { useCases } from "@/lib/use-cases";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Genit",
  description:
    "Genit is an AI marketing workspace for small teams: design, video, posting, inbox, campaigns, and automation in one place, built around your brand.",
  alternates: { canonical: "/company" },
  openGraph: {
    title: "About Genit",
    description:
      "Why we built one workspace for the marketing work small teams do every week.",
    url: "/company",
    type: "website",
  },
};

const beliefs = [
  {
    title: "Finished work beats drafts",
    description:
      "A caption in a chat window still has to be designed, sized, scheduled, and posted. We measure Genit by how much of that last mile it handles, not by how much text it writes.",
  },
  {
    title: "Explain your brand once",
    description:
      "Every workspace has a brand profile built from your website and your own notes. Every tool in Genit reads from it, so you stop pasting the same guidelines into every prompt.",
  },
  {
    title: "You approve what goes out",
    description:
      "Genit can publish, send, and run automations, but nothing public happens without the approval rules you set.",
  },
];

export default function CompanyPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Genit",
    url: "https://www.trygenit.com/company",
    description: metadata.description,
    mainEntity: { "@id": "https://www.trygenit.com/#organization" },
  };

  return (
    <div className='bg-white dark:bg-black'>
      <LandingNavbar />
      <main className='mx-auto my-20 max-w-3xl px-5 pt-6 pb-12 sm:px-8 lg:pt-10'>
        <article className='space-y-14'>
          <header className='space-y-6'>
            <h1 className='text-3xl font-bold tracking-tight text-neutral-950 md:text-5xl dark:text-white'>
              Marketing tools for teams that don&apos;t have a marketing
              department.
            </h1>
            <p className='text-base leading-8 text-pretty text-neutral-600 dark:text-neutral-400'>
              Genit is a workspace where a founder, a shop owner, or a two-person
              agency can make the graphics, write the posts, schedule them,
              answer the replies, and run the campaign, without stitching
              together a design app, a scheduler, an email tool, and three
              inboxes.
            </p>
          </header>

          <figure className=' overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
          <img
            className='h-auto max-h-[520px] w-full object-cover'
            src='https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            alt='Person checking their phone at a kitchen table'
          />
        </figure>

          <section className='space-y-4'>
            <h2 className='text-xl font-semibold text-neutral-950 dark:text-white'>
              Why we built it
            </h2>
            <p className='text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              AI made it cheap to generate a draft. It didn&apos;t make it
              cheaper to ship one. Small teams still copy text from one app,
              resize it in another, upload it to a third, and then lose track of
              the comments it gets. The work in between is where most of the
              time goes.
            </p>
            <p className='text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              So we put those steps in one place and connected them. A graphic
              you make in chat is already in your media library. A post you
              schedule shows up on the calendar. A reply to that post lands in
              the same inbox as your email. An AI agent can do any of those
              steps for you when you ask.
            </p>
          </section>

          <figure className=' overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
          <img
            className='h-auto max-h-[520px] w-full object-cover'
            src='https://images.unsplash.com/photo-1670272498380-eb330b61f3cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            alt='Two people looking at a phone together outdoors'
          />
        </figure>

          <section className='space-y-6'>
            <h2 className='text-xl font-semibold text-neutral-950 dark:text-white'>
              What we believe
            </h2>
            <div className='space-y-6'>
              {beliefs.map((belief) => (
                <div
                  key={belief.title}
                  className='border-l border-neutral-300 ps-4 dark:border-neutral-700'
                >
                  <h3 className='font-semibold text-neutral-950 dark:text-white'>
                    {belief.title}
                  </h3>
                  <p className='mt-1 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                    {belief.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className='space-y-4'>
            <h2 className='text-xl font-semibold text-neutral-950 dark:text-white'>
              What&apos;s in Genit today
            </h2>
            <div className='flex flex-wrap gap-2'>
              {useCases.map((useCase) => (
                <Link
                  key={useCase.slug}
                  className='inline-flex items-center rounded-full bg-neutral-100 px-3 py-1.5 text-sm text-neutral-800 transition-colors hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800'
                  href={`/use-cases/${useCase.slug}`}
                >
                  {useCase.name}
                </Link>
              ))}
            </div>
          </section>

          <section className='space-y-4 rounded-2xl border border-neutral-200 p-6 sm:p-8 dark:border-neutral-800'>
            <h2 className='text-xl font-semibold text-neutral-950 dark:text-white'>
              Try it, or talk to us
            </h2>
            <p className='text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              The Basic plan is free. If you want to suggest a feature or need
              help, we read everything that comes in.
            </p>
            <div className='flex flex-wrap items-center gap-4 pt-2'>
              <Link
                href='/pricing'
                className='rounded-full bg-neutral-950 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-950'
              >
                See plans
              </Link>
              <Link
                href='/contact'
                className='text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
              >
                Contact us →
              </Link>
            </div>
          </section>
        </article>
      </main>
      <LandingFooter />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
