import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { marketingCapabilities } from "@/lib/marketing-capabilities";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Genit | The AI Marketing Execution Platform",
  description:
    "Genit is building an autonomous AI marketing platform that helps businesses understand their brand, plan campaigns, create content, automate workflows, and execute across connected channels.",
  alternates: { canonical: "/company" },
  openGraph: {
    title: "About Genit | Your Autonomous AI Marketing Team",
    description:
      "Learn why Genit is building one connected platform for AI marketing planning, creation, automation, publishing, communication, and optimization.",
    url: "/company",
    type: "website",
  },
};

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
      <main className='mx-auto my-20 max-w-3xl px-4 pt-6 pb-12 sm:px-6 lg:px-8 lg:pt-10'>
        <article className='max-w-2xl'>
          <div className='space-y-5 md:space-y-8'>
            <div className='space-y-3'>
              <h1 className='text-2xl font-bold tracking-tight md:text-4xl lg:text-6xl'>
                We’re building the{" "}
                <span className='from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent'>
                  AI marketing team
                </span>{" "}
                every business should have.
              </h1>
              <p className='text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                Genit is an end-to-end AI marketing platform. It gives
                businesses one place to understand their brand, plan growth,
                create campaign assets, automate workflows, publish across
                connected channels, manage conversations, and learn from
                performance.
              </p>
            </div>

            <p className='text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              Businesses often split marketing across writing tools, design
              tools, calendars, social dashboards, email platforms, advertising
              accounts, spreadsheets, and automation software. The context gets
              lost between every handoff.
            </p>

            <figure>
              <img
                className='w-full rounded-xl object-cover'
                src='https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80'
                alt='AI technology representing connected marketing execution'
              />
              <figcaption className='mt-3 text-center text-sm text-gray-500 dark:text-neutral-500'>
                AI agents executing end-to-end marketing activities from a
                single workspace.
              </figcaption>
            </figure>

            <p className='text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              Genit brings those steps into one agentic workspace. A team can
              begin with a goal, use shared brand intelligence, create the
              required work, and act through authorized integrations without
              rebuilding the campaign in a different product at every stage.
            </p>

            <p className='text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              Creative generation is an important part of Genit, but it is not
              the whole product. The larger goal is dependable marketing
              execution with clear human control. Businesses can start with{" "}
              <Link
                className='font-medium text-blue-600 decoration-2 hover:underline focus:underline focus:outline-hidden dark:text-blue-500'
                href='/pricing'
              >
                the free Basic plan
              </Link>{" "}
              and grow into more advanced workflows as their needs expand.
            </p>

            <blockquote className='p-4 text-center sm:px-7'>
              <p className='text-xl font-medium text-gray-800 md:text-2xl md:leading-normal xl:text-2xl xl:leading-normal dark:text-neutral-200'>
                Creative generation is part of Genit. Coordinated marketing
                execution is the product.
              </p>
              <p className='mt-5 text-gray-800 dark:text-neutral-200'>
                The principle behind Genit
              </p>
            </blockquote>

            <figure>
              <img
                className='w-full rounded-xl object-cover'
                src='https://images.unsplash.com/photo-1670272498380-eb330b61f3cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80'
                alt='AI technology representing automated brand workflows'
              />
              <figcaption className='mt-3 text-center text-sm text-gray-500 dark:text-neutral-500'>
                AI agents and marketing integrations automating brand workflows.
              </figcaption>
            </figure>

            <div className='space-y-3'>
              <h2 className='text-2xl font-semibold dark:text-white'>
                Built around the full marketing lifecycle
              </h2>
              <p className='text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                Genit turns marketing goals into coordinated action. Its AI
                marketing agents use shared brand intelligence to research,
                plan, create, automate, publish, manage conversations, and
                optimize work across connected business tools.
              </p>
            </div>

            <ul className='space-y-5 text-lg text-gray-800 dark:text-neutral-200'>
              {marketingCapabilities.map((capability) => (
                <li
                  key={capability.slug}
                  className='border-l border-gray-200 ps-4 dark:border-neutral-800 text-sm leading-7 text-pretty text-neutral-400 dark:text-neutral-200'
                >
                  {capability.name}. {capability.description}
                </li>
              ))}
            </ul>

            <p className='text-slate-11 my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              Genit is guided by three principles: execution over output, one
              reusable brand context, and automation with human control. The
              result is an autonomous AI marketing platform that can move work
              from an idea through planning, creation, approval, and action
              without forcing teams to rebuild campaigns across disconnected
              tools.
            </p>

            <div>
              {marketingCapabilities.map((capability) => (
                <Link
                  key={capability.slug}
                  className='m-1 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:outline-hidden dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                  href={`/platform/${capability.slug}`}
                >
                  {capability.name}
                </Link>
              ))}
            </div>
          </div>
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
