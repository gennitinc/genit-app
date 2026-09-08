import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { marketingCapabilities } from "@/lib/marketing-capabilities";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Marketing Platform for End-to-End Execution | Genit",
  description:
    "Explore Genit's complete AI marketing platform: autonomous agents, workflows, content, campaigns, publishing, inbox, brand intelligence, analytics, and integrations.",
  alternates: { canonical: "/platform" },
  openGraph: {
    title: "Genit AI Marketing Platform",
    description:
      "Plan, create, automate, publish, communicate, and optimize from one agentic marketing workspace.",
    url: "/platform",
  },
};

const stages = [
  [
    "Understand",
    "Turn your website and guidance into reusable brand, product, audience, and voice context.",
  ],
  [
    "Plan",
    "Research markets, define campaigns, build calendars, set KPIs, and coordinate the work.",
  ],
  [
    "Create",
    "Generate copy, images, video, voice, documents, presentations, and campaign assets.",
  ],
  [
    "Execute",
    "Use agents, workflows, and integrations to schedule, publish, send, organize, and respond.",
  ],
  [
    "Improve",
    "Monitor activity, analyze campaign results, create reports, and turn findings into next actions.",
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
    <div className='min-h-screen bg-white text-zinc-950 dark:bg-black dark:text-white'>
      <LandingNavbar />
      <main>
        <section className='mx-auto max-w-6xl px-5 py-24 text-center md:py-32'>
          <p className='text-sm font-semibold tracking-widest text-indigo-600 uppercase'>
            The complete platform
          </p>
          <h1 className='mx-auto mt-4 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl'>
            One AI marketing team. Every stage of growth.
          </h1>
          <p className='text-muted-foreground mx-auto mt-6 max-w-3xl text-lg leading-8'>
            Genit is an end-to-end AI marketing platform where autonomous agents
            understand your brand, plan campaigns, create content, run
            workflows, act across connected tools, and help improve performance.
          </p>
          <div className='mt-9 flex justify-center gap-3'>
            <Link
              href='/signup'
              className='rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700'
            >
              Start for $0
            </Link>
            <Link
              href='/plugins'
              className='rounded-xl border border-zinc-300 px-6 py-3 font-semibold dark:border-zinc-700'
            >
              Explore integrations
            </Link>
          </div>
        </section>

        <section
          className='mx-auto max-w-6xl px-5 py-16'
          aria-labelledby='operating-system'
        >
          <h2
            id='operating-system'
            className='text-3xl font-semibold tracking-tight md:text-5xl'
          >
            A marketing operating system, not another isolated generator
          </h2>
          <div className='mt-10 grid gap-4 md:grid-cols-5'>
            {stages.map(([name, description], index) => (
              <article
                key={name}
                className='rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800'
              >
                <span className='text-sm text-indigo-600'>0{index + 1}</span>
                <h3 className='mt-5 text-xl font-semibold'>{name}</h3>
                <p className='text-muted-foreground mt-2 text-sm leading-6'>
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          className='mx-auto max-w-6xl px-5 py-20'
          aria-labelledby='capabilities'
        >
          <h2
            id='capabilities'
            className='text-3xl font-semibold tracking-tight md:text-5xl'
          >
            Explore Genit’s marketing capabilities
          </h2>
          <p className='text-muted-foreground mt-4 max-w-2xl text-lg'>
            Each capability works on its own and becomes more powerful when
            agents combine them in a single campaign or workflow.
          </p>
          <div className='mt-10 grid gap-5 md:grid-cols-2'>
            {marketingCapabilities.map((capability) => (
              <Link
                key={capability.slug}
                href={`/platform/${capability.slug}`}
                className='group rounded-2xl border border-zinc-200 p-7 transition hover:border-indigo-500 dark:border-zinc-800'
              >
                <p className='text-xs font-semibold tracking-widest text-indigo-600 uppercase'>
                  {capability.eyebrow}
                </p>
                <h3 className='mt-3 text-2xl font-semibold group-hover:text-indigo-600'>
                  {capability.name}
                </h3>
                <p className='text-muted-foreground mt-3 leading-7'>
                  {capability.description}
                </p>
                <span className='mt-6 inline-block font-semibold'>
                  Learn more →
                </span>
              </Link>
            ))}
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
