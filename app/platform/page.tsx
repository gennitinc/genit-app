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
    type: "website",
  },
};

const stages = [
  [
    "Understand",
    "Turn your website, brand guidelines, product catalogs, and creative directives into persistent brand, audience, and voice intelligence that every agent references.",
  ],
  [
    "Plan",
    "Conduct deep market and competitive research, formulate multi-channel campaigns, generate unified publishing calendars, set measurable KPIs, and assign agent workflows.",
  ],
  [
    "Create",
    "Produce on-brand copy, high-fidelity visual assets, dynamic video content, natural voiceovers, presentations, and sales collateral tailored for every channel format.",
  ],
  [
    "Execute",
    "Deploy autonomous agents and permissioned tool integrations to schedule posts, publish ad variants, dispatch email sequences, and route inbound customer conversations.",
  ],
  [
    "Improve",
    "Continuously monitor real-world campaign telemetry, synthesize attribution reports, isolate high-performing angles, and automatically translate findings into next-round strategic briefs.",
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
        {/* Section 1: Hero */}
        <section aria-labelledby='platform-hero'>
          <div className='flex items-center gap-3 font-mono text-xs tracking-widest text-neutral-500 uppercase'>
            <span>Platform Architecture</span>
            <span className='text-neutral-300 dark:text-neutral-700'>/</span>
            <span>System 01</span>
          </div>

          <h1
            id='platform-hero'
            className='mt-6 max-w-4xl text-3xl font-bold tracking-tight text-neutral-950 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white'
          >
            An operating system for autonomous marketing execution.
          </h1>

          <p className='mt-6 max-w-3xl text-base leading-8 text-pretty text-neutral-600 sm:text-lg dark:text-neutral-400'>
            Genit bridges brand strategy, creative generation, and live
            execution. Instead of fragmented tools and ephemeral prompts,
            autonomous agents run on persistent brand intelligence to plan,
            produce, automate, and publish across connected business channels.
          </p>

          <div className='mt-8 flex flex-wrap items-center gap-4 pt-2'>
            <Link
              href='/pricing'
              className='inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-950'
            >
              <span>Start on the free Basic plan</span>
              <span>→</span>
            </Link>
            <Link
              href='/plugins'
              className='inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900'
            >
              <span>Explore verified integrations</span>
            </Link>
          </div>

          <figure className='mt-12 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
            <img
              className='h-auto max-h-[560px] w-full object-cover'
              src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
              alt='Genit autonomous marketing architecture and connected workspace'
            />
            <figcaption className='flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 px-5 py-3 font-mono text-xs text-neutral-500 dark:border-neutral-800'>
              <span>Figure 01: Connected autonomous marketing environment</span>
              <span>Multi-agent coordination &amp; live execution</span>
            </figcaption>
          </figure>
        </section>

        {/* Section 2: Continuous Execution Lifecycle */}
        <section
          className='mt-24 border-t border-neutral-200 pt-16 dark:border-neutral-800'
          aria-labelledby='lifecycle-heading'
        >
          <div className='grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16'>
            <div className='space-y-4 lg:sticky lg:top-24 lg:col-span-5 lg:h-fit'>
              <span className='font-mono text-xs tracking-widest text-neutral-500 uppercase'>
                01 // Lifecycle
              </span>
              <h2
                id='lifecycle-heading'
                className='text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white'
              >
                The continuous execution lifecycle.
              </h2>
              <p className='text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                Traditional marketing breaks context whenever work transitions
                between planning, creation, and publishing. In Genit, five
                continuous phases operate on a single shared memory layer.
              </p>
              <blockquote className='mt-8 border-l-2 border-neutral-900 py-1 ps-4 text-sm font-medium text-neutral-800 italic dark:border-neutral-100 dark:text-neutral-200'>
                &ldquo;Creative generation is part of the system. Coordinated
                marketing execution is the product.&rdquo;
              </blockquote>
            </div>

            <div className='space-y-8 lg:col-span-7'>
              {stages.map(([name, description], index) => (
                <div
                  key={name}
                  className='border-l border-neutral-300 ps-5 dark:border-neutral-700'
                >
                  <div className='flex items-baseline gap-2 font-mono text-xs text-neutral-400 dark:text-neutral-500'>
                    <span>0{index + 1}</span>
                    <span>—</span>
                    <span className='tracking-wider uppercase'>Stage</span>
                  </div>
                  <h3 className='mt-1 text-lg font-semibold text-neutral-950 dark:text-white'>
                    {name}
                  </h3>
                  <p className='mt-2 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Capabilities Matrix */}
        <section
          className='mt-24 border-t border-neutral-200 pt-16 dark:border-neutral-800'
          aria-labelledby='capabilities-heading'
        >
          <div className='flex flex-col justify-between gap-6 pb-8 md:flex-row md:items-end'>
            <div>
              <span className='font-mono text-xs tracking-widest text-neutral-500 uppercase'>
                02 // Capabilities
              </span>
              <h2
                id='capabilities-heading'
                className='mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white'
              >
                Specialized platform capabilities.
              </h2>
            </div>
            <p className='max-w-md text-sm text-neutral-500 dark:text-neutral-400'>
              Each capability is autonomous, fully configurable, and designed to
              operate independently or orchestrated in unified campaigns.
            </p>
          </div>

          <figure className='my-10 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
            <img
              className='h-auto max-h-[440px] w-full object-cover'
              src='https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
              alt='Engineers and designers reviewing platform capability requests'
            />
            <figcaption className='flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 px-5 py-3 font-mono text-xs text-neutral-500 dark:border-neutral-800'>
              <span>
                Figure 02: Collaborative triage &amp; feature roadmap
                prioritization
              </span>
              <span>Customer-Led Engineering</span>
            </figcaption>
          </figure>

          <div className='grid grid-cols-1 divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 md:grid-cols-2 dark:divide-neutral-800 dark:border-neutral-800'>
            {marketingCapabilities.map((capability, idx) => (
              <Link
                key={capability.slug}
                href={`/platform/${capability.slug}`}
                className='group relative flex flex-col justify-between bg-white p-7 transition-colors duration-200 hover:bg-neutral-50/80 sm:p-9 dark:bg-neutral-950/60 dark:hover:bg-neutral-900/50'
              >
                <div>
                  <div className='flex items-center justify-between font-mono text-xs text-neutral-400 dark:text-neutral-500'>
                    <span className='tracking-widest uppercase'>
                      {capability.eyebrow}
                    </span>
                    <span>0{idx + 1}</span>
                  </div>
                  <h3 className='mt-4 flex items-center justify-between text-xl font-semibold text-neutral-950 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
                    <span>{capability.name}</span>
                    <span className='text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600 dark:text-neutral-600 dark:group-hover:text-blue-400'>
                      →
                    </span>
                  </h3>
                  <p className='mt-3 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                    {capability.description}
                  </p>
                </div>
                <div className='mt-6 flex items-center gap-2 border-t border-neutral-100 pt-4 text-xs font-medium text-neutral-500 dark:border-neutral-900 dark:text-neutral-400'>
                  <span>Inspect specifications</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 4: Execution Fabric & Human Control */}
        <section
          className='mt-24 border-t border-neutral-200 pt-16 dark:border-neutral-800'
          aria-labelledby='control-heading'
        >
          <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16'>
            <div className='order-2 lg:order-1 lg:col-span-6'>
              <figure className='overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
                <img
                  className='h-auto w-full object-cover'
                  src='https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                  alt='Integrations and human oversight in Genit'
                />
                <figcaption className='border-t border-neutral-200 px-5 py-3 font-mono text-xs text-neutral-500 dark:border-neutral-800'>
                  Figure 02: Verification gates &amp; permissioned tool
                  integrations
                </figcaption>
              </figure>
            </div>

            <div className='order-1 space-y-6 lg:order-2 lg:col-span-6'>
              <span className='font-mono text-xs tracking-widest text-neutral-500 uppercase'>
                03 // Foundation
              </span>
              <h2
                id='control-heading'
                className='text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white'
              >
                Autonomous capability with uncompromising human control.
              </h2>
              <p className='text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                Every external action—publishing a post, sending an email
                campaign, or adjusting advertising spend—is guarded by strict
                permissioning and approval checkpoints. Teams define which tasks
                run autonomously and which require explicit sign-off.
              </p>

              <ul className='space-y-4 pt-2'>
                <li className='border-l border-neutral-300 ps-4 text-sm leading-7 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400'>
                  <strong className='font-semibold text-neutral-950 dark:text-white'>
                    Deterministic Permissions:
                  </strong>{" "}
                  Granular controls configure exactly which social channels, ad
                  accounts, and audience lists agents can modify.
                </li>
                <li className='border-l border-neutral-300 ps-4 text-sm leading-7 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400'>
                  <strong className='font-semibold text-neutral-950 dark:text-white'>
                    Persistent Brand Memory:
                  </strong>{" "}
                  Brand identity guidelines, tone guardrails, and compliance
                  rules remain consistent across all agent operations.
                </li>
                <li className='border-l border-neutral-300 ps-4 text-sm leading-7 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400'>
                  <strong className='font-semibold text-neutral-950 dark:text-white'>
                    Deep Tool Interoperability:
                  </strong>{" "}
                  Direct connections to Meta, Google, LinkedIn, X, TikTok,
                  HubSpot, Shopify, Slack, and cloud storage providers.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5: Directory & Quick Navigation */}
        <section
          className='mt-24 border-t border-neutral-200 pt-16 dark:border-neutral-800'
          aria-labelledby='directory-heading'
        >
          <div className='mx-auto max-w-2xl text-center'>
            <span className='font-mono text-xs tracking-widest text-neutral-500 uppercase'>
              04 // Directory
            </span>
            <h2
              id='directory-heading'
              className='mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white'
            >
              Explore every dimension of the platform.
            </h2>
            <p className='mt-3 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              Jump directly into any specialized capability or start building on
              the free Basic plan.
            </p>

            <div className='mt-6 flex flex-wrap justify-center gap-2'>
              {marketingCapabilities.map((capability) => (
                <Link
                  key={capability.slug}
                  href={`/platform/${capability.slug}`}
                  className='inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3.5 py-2 text-xs font-medium text-neutral-800 transition-colors hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800'
                >
                  <span>{capability.name}</span>
                  <span className='text-neutral-400'>→</span>
                </Link>
              ))}
            </div>

            <div className='mt-8 flex items-center justify-center gap-4'>
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
                Explore integrations
              </Link>
            </div>
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
