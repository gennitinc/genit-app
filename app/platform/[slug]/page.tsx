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
        <nav className='flex items-center gap-2 text-sm text-neutral-500'>
          <Link
            href='/platform'
            className='transition-colors hover:text-neutral-900 dark:hover:text-white'
          >
            Platform
          </Link>
          <span className='text-neutral-300 dark:text-neutral-700'>/</span>
          <span className='text-neutral-900 dark:text-white'>
            {capability.name}
          </span>
        </nav>

        <section className='mt-8 max-w-3xl' aria-labelledby='capability-title'>
          <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
            {capability.eyebrow}
          </p>
          <h1
            id='capability-title'
            className='mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-5xl dark:text-white'
          >
            {capability.title}
          </h1>
          <p className='mt-6 text-base leading-8 text-pretty text-neutral-600 sm:text-lg dark:text-neutral-400'>
            {capability.description}
          </p>
        </section>

        <figure className='mt-12 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
          <img
            className='h-auto max-h-[560px] w-full object-cover'
            src='https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
            alt={`${capability.name} in Genit`}
          />
        </figure>

        <section className='mt-20 border-t border-neutral-200 pt-14 dark:border-neutral-800'>
          <div className='grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16'>
            <div className='space-y-4 lg:col-span-5'>
              <h2 className='text-2xl font-bold tracking-tight text-neutral-950 dark:text-white'>
                Overview
              </h2>
              <p className='text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                {capability.summary}
              </p>
            </div>
            <div className='lg:col-span-7'>
              <h3 className='text-sm font-semibold text-neutral-950 dark:text-white'>
                What you can do
              </h3>
              <ul className='mt-4 space-y-3'>
                {capability.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className='border-l border-neutral-300 ps-4 text-sm leading-7 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300'
                  >
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          className='mt-20 border-t border-neutral-200 pt-14 dark:border-neutral-800'
          aria-labelledby='workflow-heading'
        >
          <h2
            id='workflow-heading'
            className='text-2xl font-bold tracking-tight text-neutral-950 dark:text-white'
          >
            How it works
          </h2>
          <ol className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-3'>
            {capability.workflow.map((step, idx) => (
              <li key={step.title}>
                <span className='flex size-7 items-center justify-center rounded-full border border-neutral-300 text-xs font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-300'>
                  {idx + 1}
                </span>
                <h3 className='mt-4 font-semibold text-neutral-950 dark:text-white'>
                  {step.title}
                </h3>
                <p className='mt-2 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                  {step.description}
                </p>
              </li>
            ))}
          </ol>

          <figure className='mt-12 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
          <img
            className='h-auto max-h-[480px] w-full object-cover'
            src='https://images.unsplash.com/photo-1670272498380-eb330b61f3cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
            alt={`${capability.name} workflow`}
          />
        </figure>

        </section>

        <section
          className='mt-20 border-t border-neutral-200 pt-14 dark:border-neutral-800'
          aria-labelledby='specs-heading'
        >
          <h2
            id='specs-heading'
            className='text-2xl font-bold tracking-tight text-neutral-950 dark:text-white'
          >
            Features
          </h2>
          <div className='mt-8 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2'>
            {capability.features.map((feature) => (
              <div key={feature.title}>
                <h3 className='font-semibold text-neutral-950 dark:text-white'>
                  {feature.title}
                </h3>
                <p className='mt-1 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          className='mt-20 border-t border-neutral-200 pt-14 dark:border-neutral-800'
          aria-labelledby='faq-heading'
        >
          <h2
            id='faq-heading'
            className='text-2xl font-bold tracking-tight text-neutral-950 dark:text-white'
          >
            Questions
          </h2>
          <div className='mt-6 divide-y divide-neutral-200 dark:divide-neutral-800'>
            {capability.faq.map(({ question, answer }) => (
              <div key={question} className='py-6'>
                <h3 className='font-semibold text-neutral-950 dark:text-white'>
                  {question}
                </h3>
                <p className='mt-2 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                  {answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          className='mt-20 border-t border-neutral-200 pt-14 dark:border-neutral-800'
          aria-labelledby='adjacent-heading'
        >
          <h2
            id='adjacent-heading'
            className='text-2xl font-bold tracking-tight text-neutral-950 dark:text-white'
          >
            Other parts of the platform
          </h2>
          <div className='mt-6 flex flex-wrap gap-2'>
            {otherCapabilities.map((other) => (
              <Link
                key={other.slug}
                href={`/platform/${other.slug}`}
                className='inline-flex items-center rounded-full bg-neutral-100 px-3.5 py-2 text-sm text-neutral-800 transition-colors hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800'
              >
                {other.name}
              </Link>
            ))}
          </div>
          <div className='mt-8 flex flex-wrap items-center gap-4'>
            <Link
              href='/signup'
              className='rounded-full bg-neutral-950 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-950'
            >
              Get started free
            </Link>
            <Link
              href='/platform'
              className='text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
            >
              Back to the platform overview →
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
