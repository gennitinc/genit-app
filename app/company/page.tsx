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

const principles = [
  {
    title: "Execution over output",
    description:
      "A useful marketing agent should do more than produce a draft. Genit is designed to move work from an idea through planning, creation, approval, and action.",
  },
  {
    title: "One brand context",
    description:
      "Products, audience, voice, visual identity, and goals should not be re-entered for every task. Genit makes brand knowledge reusable across the workspace.",
  },
  {
    title: "Automation with control",
    description:
      "Routine work can run automatically while people retain oversight of consequential external actions and connected accounts.",
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
    <div className='min-h-screen bg-white text-zinc-950 dark:bg-black dark:text-white'>
      <LandingNavbar />
      <main>
        <section className='mx-auto max-w-6xl px-5 py-24 md:py-32'>
          <p className='text-sm font-semibold tracking-widest text-indigo-600 uppercase'>
            About Genit
          </p>
          <h1 className='mt-4 max-w-5xl text-5xl font-semibold tracking-tight md:text-7xl'>
            We’re building the AI marketing team every business should have.
          </h1>
          <p className='text-muted-foreground mt-7 max-w-3xl text-lg leading-8'>
            Genit is an end-to-end AI marketing platform. It gives businesses
            one place to understand their brand, plan growth, create campaign
            assets, automate workflows, publish across connected channels,
            manage conversations, and learn from performance.
          </p>
          <div className='mt-9 flex flex-wrap gap-3'>
            <Link
              href='/platform'
              className='rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700'
            >
              Explore the platform
            </Link>
            <Link
              href='/contact'
              className='rounded-xl border border-zinc-300 px-6 py-3 font-semibold dark:border-zinc-700'
            >
              Contact Genit
            </Link>
          </div>
        </section>

        <section className='border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950'>
          <div className='mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[1fr_1.4fr]'>
            <div>
              <p className='text-sm font-semibold tracking-widest text-indigo-600 uppercase'>
                Our mission
              </p>
              <h2 className='mt-3 text-3xl font-semibold tracking-tight md:text-5xl'>
                Turn marketing goals into coordinated action
              </h2>
            </div>
            <div className='text-muted-foreground space-y-5 text-lg leading-8'>
              <p>
                Businesses often split marketing across writing tools, design
                tools, calendars, social dashboards, email platforms,
                advertising accounts, spreadsheets, and automation software. The
                context gets lost between every handoff.
              </p>
              <p>
                Genit brings those steps into one agentic workspace. A team can
                begin with a goal, use shared brand intelligence, create the
                required work, and act through authorized integrations without
                rebuilding the campaign in a different product at every stage.
              </p>
              <p>
                Creative generation is an important part of Genit, but it is not
                the whole product. The larger goal is dependable marketing
                execution with clear human control.
              </p>
            </div>
          </div>
        </section>

        <section
          className='mx-auto max-w-6xl px-5 py-20'
          aria-labelledby='principles'
        >
          <h2
            id='principles'
            className='text-3xl font-semibold tracking-tight md:text-5xl'
          >
            What guides the product
          </h2>
          <div className='mt-10 grid gap-5 md:grid-cols-3'>
            {principles.map((principle) => (
              <article
                key={principle.title}
                className='rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800'
              >
                <h3 className='text-xl font-semibold'>{principle.title}</h3>
                <p className='text-muted-foreground mt-3 leading-7'>
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          className='mx-auto max-w-6xl px-5 py-20'
          aria-labelledby='capabilities'
        >
          <div className='flex flex-col justify-between gap-5 md:flex-row md:items-end'>
            <div>
              <p className='text-sm font-semibold tracking-widest text-indigo-600 uppercase'>
                One connected platform
              </p>
              <h2
                id='capabilities'
                className='mt-3 text-3xl font-semibold tracking-tight md:text-5xl'
              >
                Built around the full marketing lifecycle
              </h2>
            </div>
            <Link href='/platform' className='font-semibold text-indigo-600'>
              View every capability →
            </Link>
          </div>
          <div className='mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2'>
            {marketingCapabilities.slice(0, 6).map((capability) => (
              <Link
                key={capability.slug}
                href={`/platform/${capability.slug}`}
                className='group border-t border-zinc-200 pt-5 dark:border-zinc-800'
              >
                <h3 className='text-xl font-semibold group-hover:text-indigo-600'>
                  {capability.name}
                </h3>
                <p className='text-muted-foreground mt-2 leading-7'>
                  {capability.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className='mx-auto mb-20 max-w-6xl rounded-3xl bg-zinc-950 px-6 py-14 text-center text-white dark:bg-zinc-900'>
          <h2 className='text-3xl font-semibold'>
            Build your AI marketing team
          </h2>
          <p className='mx-auto mt-3 max-w-2xl text-zinc-300'>
            Start with your website and a marketing goal. Genit helps turn both
            into an executable plan.
          </p>
          <Link
            href='/signup'
            className='mt-7 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-zinc-950'
          >
            Start for $0
          </Link>
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
