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
    title: `${capability.name} Software | Genit`,
    description: capability.description,
    alternates: { canonical: `/platform/${slug}` },
    openGraph: {
      title: capability.title,
      description: capability.description,
      url: `/platform/${slug}`,
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
    <div className='min-h-screen bg-white text-zinc-950 dark:bg-black dark:text-white'>
      <LandingNavbar />
      <main>
        <section className='mx-auto max-w-6xl px-5 py-24 md:py-32'>
          <Link
            href='/platform'
            className='text-sm font-semibold text-indigo-600'
          >
            ← Genit platform
          </Link>
          <p className='mt-10 text-sm font-semibold tracking-widest text-indigo-600 uppercase'>
            {capability.eyebrow}
          </p>
          <h1 className='mt-4 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl'>
            {capability.title}
          </h1>
          <p className='text-muted-foreground mt-7 max-w-3xl text-lg leading-8'>
            {capability.description}
          </p>
          <div className='mt-9 flex gap-3'>
            <Link
              href='/signup'
              className='rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700'
            >
              Start for $0
            </Link>
            <Link
              href='/contact'
              className='rounded-xl border border-zinc-300 px-6 py-3 font-semibold dark:border-zinc-700'
            >
              Talk to us
            </Link>
          </div>
        </section>

        <section className='border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950'>
          <div className='mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2'>
            <div>
              <h2 className='text-3xl font-semibold tracking-tight'>
                More than a generated asset
              </h2>
              <p className='text-muted-foreground mt-5 text-lg leading-8'>
                {capability.summary}
              </p>
            </div>
            <ul className='space-y-4'>
              {capability.outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className='rounded-xl border border-zinc-200 bg-white p-4 font-medium dark:border-zinc-800 dark:bg-black'
                >
                  ✓ {outcome}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className='mx-auto max-w-6xl px-5 py-20'
          aria-labelledby='how-it-works'
        >
          <h2
            id='how-it-works'
            className='text-3xl font-semibold tracking-tight md:text-5xl'
          >
            How it works
          </h2>
          <div className='mt-10 grid gap-5 md:grid-cols-3'>
            {capability.workflow.map((step, index) => (
              <article
                key={step.title}
                className='rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800'
              >
                <span className='text-sm font-semibold text-indigo-600'>
                  Step {index + 1}
                </span>
                <h3 className='mt-4 text-xl font-semibold'>{step.title}</h3>
                <p className='text-muted-foreground mt-3 leading-7'>
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          className='mx-auto max-w-6xl px-5 py-20'
          aria-labelledby='features'
        >
          <h2
            id='features'
            className='text-3xl font-semibold tracking-tight md:text-5xl'
          >
            What you can do with Genit
          </h2>
          <div className='mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2'>
            {capability.features.map((feature) => (
              <article key={feature.title}>
                <h3 className='text-xl font-semibold'>{feature.title}</h3>
                <p className='text-muted-foreground mt-2 leading-7'>
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className='mx-auto max-w-4xl px-5 py-20' aria-labelledby='faq'>
          <h2
            id='faq'
            className='text-3xl font-semibold tracking-tight md:text-5xl'
          >
            Frequently asked questions
          </h2>
          <div className='mt-8 divide-y divide-zinc-200 dark:divide-zinc-800'>
            {capability.faq.map(({ question, answer }) => (
              <details key={question} className='group py-5'>
                <summary className='cursor-pointer list-none text-lg font-semibold'>
                  {question}
                </summary>
                <p className='text-muted-foreground mt-3 leading-7'>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className='mx-auto mb-20 max-w-6xl rounded-3xl bg-zinc-950 px-6 py-14 text-center text-white dark:bg-zinc-900'>
          <h2 className='text-3xl font-semibold'>
            Put {capability.name.toLowerCase()} to work
          </h2>
          <p className='mx-auto mt-3 max-w-2xl text-zinc-300'>
            Start with your brand and a goal. Genit helps turn both into
            coordinated marketing execution.
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
