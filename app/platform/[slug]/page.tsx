import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import {
  getMarketingCapability,
  marketingCapabilities,
} from "@/lib/marketing-capabilities";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return marketingCapabilities.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const capability = getMarketingCapability(slug);
  if (!capability) return {};
  return {
    title: `${capability.name} | Genit Marketing Platform`,
    description: capability.description,
    alternates: { canonical: `/platform/${slug}` },
    openGraph: {
      title: capability.title,
      description: capability.description,
      url: `/platform/${slug}`,
      type: "website",
    },
  };
}

export default async function CapabilityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const capability = getMarketingCapability(slug);
  if (!capability) notFound();

  const otherCapabilities = marketingCapabilities.filter(
    (c) => c.slug !== capability.slug
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: `Genit ${capability.name}`,
        url: `https://www.trygenit.com/platform/${slug}`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: capability.description,
        featureList: capability.features.map(({ title }) => title),
        isPartOf: { "@id": "https://www.trygenit.com/#application" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.trygenit.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Platform",
            item: "https://www.trygenit.com/platform",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: capability.name,
            item: `https://www.trygenit.com/platform/${slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: capability.faq.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  return (
    <div className='min-h-screen bg-white text-neutral-900 dark:bg-black dark:text-neutral-100'>
      <LandingNavbar />
      <main className='mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24'>
        {/* Breadcrumb Navigation */}
        <div className='flex items-center gap-2 font-mono text-xs tracking-widest text-neutral-500 uppercase'>
          <Link
            href='/platform'
            className='transition-colors hover:text-neutral-900 dark:hover:text-white'
          >
            Platform
          </Link>
          <span className='text-neutral-300 dark:text-neutral-700'>/</span>
          <span>Capabilities</span>
          <span className='text-neutral-300 dark:text-neutral-700'>/</span>
          <span className='text-neutral-900 dark:text-white'>
            {capability.name}
          </span>
        </div>

        {/* Header & Proposition */}
        <section className='mt-8 max-w-4xl' aria-labelledby='capability-title'>
          <span className='inline-block font-mono text-xs font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400'>
            {capability.eyebrow}
          </span>
          <h1
            id='capability-title'
            className='mt-4 text-3xl font-bold tracking-tight text-neutral-950 sm:text-5xl md:text-6xl dark:text-white'
          >
            {capability.title}
          </h1>
          <p className='mt-6 text-pretty text-base leading-8 text-neutral-600 sm:text-lg dark:text-neutral-400'>
            {capability.description}
          </p>
        </section>

        {/* Primary Hero Figure */}
        <figure className='mt-12 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
          <img
            className='h-auto max-h-[560px] w-full object-cover'
            src='https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
            alt={`${capability.name} autonomous workspace`}
          />
          <figcaption className='flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 px-5 py-3 font-mono text-xs text-neutral-500 dark:border-neutral-800'>
            <span>{capability.name} — Architecture &amp; Execution Engine</span>
            <span>Genit Autonomous System</span>
          </figcaption>
        </figure>

        {/* Section 1: Architectural Thesis & Verified Outcomes */}
        <section
          className='mt-24 border-t border-neutral-200 pt-16 dark:border-neutral-800'
          aria-labelledby='thesis-heading'
        >
          <div className='grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16'>
            <div className='space-y-6 lg:col-span-5'>
              <span className='font-mono text-xs tracking-widest text-neutral-500 uppercase'>
                01 // Architectural Thesis
              </span>
              <h2 id='thesis-heading' className='sr-only'>
                Architectural Thesis
              </h2>
              <blockquote className='border-l-2 border-neutral-900 py-1 ps-5 text-xl font-medium tracking-tight text-neutral-950 dark:border-neutral-100 dark:text-white'>
                &ldquo;{capability.eyebrow}: Moving from isolated prompts to
                autonomous marketing execution.&rdquo;
              </blockquote>
              <p className='text-pretty text-sm leading-7 text-neutral-600 dark:text-neutral-400'>
                {capability.summary}
              </p>
            </div>

            <div className='space-y-6 lg:col-span-7'>
              <span className='font-mono text-xs tracking-widest text-neutral-500 uppercase'>
                Key Outcomes &amp; Impact
              </span>
              <div className='space-y-6'>
                {capability.outcomes.map((outcome, idx) => (
                  <div
                    key={idx}
                    className='border-l border-neutral-300 ps-5 dark:border-neutral-700'
                  >
                    <div className='font-mono text-xs text-neutral-400 dark:text-neutral-500'>
                      Outcome 0{idx + 1}
                    </div>
                    <p className='mt-1 text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-100'>
                      {outcome}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Execution Pipeline (How It Works) */}
        <section
          className='mt-24 border-t border-neutral-200 pt-16 dark:border-neutral-800'
          aria-labelledby='workflow-heading'
        >
          <span className='font-mono text-xs tracking-widest text-neutral-500 uppercase'>
            02 // Execution Pipeline
          </span>
          <h2
            id='workflow-heading'
            className='mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white'
          >
            How {capability.name} operates.
          </h2>
          <p className='mt-3 max-w-2xl text-pretty text-sm text-neutral-600 dark:text-neutral-400'>
            A deterministic, three-stage pipeline that pairs autonomous agent
            action with structured verification.
          </p>

          <div className='mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-neutral-200 divide-y divide-neutral-200 md:grid-cols-3 md:divide-x md:divide-y-0 dark:border-neutral-800 dark:divide-neutral-800'>
            {capability.workflow.map((step, idx) => (
              <div
                key={step.title}
                className='flex flex-col justify-between bg-white p-7 sm:p-8 dark:bg-neutral-950/60'
              >
                <div>
                  <div className='flex items-center justify-between font-mono text-xs text-neutral-400 dark:text-neutral-500'>
                    <span>Step 0{idx + 1}</span>
                    <span className='uppercase'>Phase</span>
                  </div>
                  <h3 className='mt-4 text-lg font-semibold text-neutral-950 dark:text-white'>
                    {step.title}
                  </h3>
                  <p className='mt-3 text-pretty text-sm leading-7 text-neutral-600 dark:text-neutral-400'>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <figure className='mt-12 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
            <img
              className='h-auto max-h-[480px] w-full object-cover'
              src='https://images.unsplash.com/photo-1670272498380-eb330b61f3cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
              alt={`${capability.name} workflow execution and tool connections`}
            />
            <figcaption className='border-t border-neutral-200 px-5 py-3 font-mono text-xs text-neutral-500 dark:border-neutral-800'>
              Figure 03: Automated workflow execution &amp; integration hooks
            </figcaption>
          </figure>
        </section>

        {/* Section 3: Deep Specifications & Features */}
        <section
          className='mt-24 border-t border-neutral-200 pt-16 dark:border-neutral-800'
          aria-labelledby='specs-heading'
        >
          <span className='font-mono text-xs tracking-widest text-neutral-500 uppercase'>
            03 // Specifications
          </span>
          <h2
            id='specs-heading'
            className='mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white'
          >
            System capabilities &amp; feature specifications.
          </h2>

          <div className='mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-neutral-200 divide-y divide-neutral-200 md:grid-cols-2 dark:border-neutral-800 dark:divide-neutral-800'>
            {capability.features.map((feature) => (
              <div
                key={feature.title}
                className='bg-white p-7 sm:p-8 dark:bg-neutral-950/60'
              >
                <h3 className='text-base font-semibold text-neutral-950 dark:text-white'>
                  {feature.title}
                </h3>
                <p className='mt-2 text-pretty text-sm leading-7 text-neutral-600 dark:text-neutral-400'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Inquiries & FAQ */}
        <section
          className='mt-24 border-t border-neutral-200 pt-16 dark:border-neutral-800'
          aria-labelledby='faq-heading'
        >
          <span className='font-mono text-xs tracking-widest text-neutral-500 uppercase'>
            04 // Inquiries
          </span>
          <h2
            id='faq-heading'
            className='mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white'
          >
            Frequently asked questions.
          </h2>

          <div className='mt-10 border-y border-neutral-200 divide-y divide-neutral-200 dark:border-neutral-800 dark:divide-neutral-800'>
            {capability.faq.map(({ question, answer }) => (
              <div key={question} className='py-6 sm:py-8'>
                <h3 className='text-base font-semibold text-neutral-950 dark:text-white'>
                  {question}
                </h3>
                <p className='mt-3 text-pretty text-sm leading-7 text-neutral-600 dark:text-neutral-400'>
                  {answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Adjacent Modules & Callout */}
        <section
          className='mt-24 border-t border-neutral-200 pt-16 dark:border-neutral-800'
          aria-labelledby='adjacent-heading'
        >
          <div className='mx-auto max-w-2xl text-center'>
            <span className='font-mono text-xs tracking-widest text-neutral-500 uppercase'>
              Ecosystem Navigation
            </span>
            <h2
              id='adjacent-heading'
              className='mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white'
            >
              Adjacent capabilities in the ecosystem.
            </h2>
            <p className='mt-3 text-pretty text-sm leading-7 text-neutral-600 dark:text-neutral-400'>
              Genit agents share memory across all modules. Inspect another
              specialized capability or deploy {capability.name.toLowerCase()} in
              your brand workspace.
            </p>

            <div className='mt-6 flex flex-wrap justify-center gap-2'>
              {otherCapabilities.map((other) => (
                <Link
                  key={other.slug}
                  href={`/platform/${other.slug}`}
                  className='inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3.5 py-2 text-xs font-medium text-neutral-800 transition-colors hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800'
                >
                  <span>{other.name}</span>
                  <span className='text-neutral-400'>→</span>
                </Link>
              ))}
            </div>

            <div className='mt-8 flex items-center justify-center gap-4'>
              <Link
                href='/signup'
                className='rounded-full bg-neutral-950 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-950'
              >
                Get started with {capability.name}
              </Link>
              <Link
                href='/platform'
                className='rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900'
              >
                All platform capabilities
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
